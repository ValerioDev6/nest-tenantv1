import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class PrismaService extends PrismaClient {
  private tenantConnections: Map<string, PrismaClient> = new Map();

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  async createTenantDatabase(tenantId: string) {
    const databaseName = `tenant_${tenantId}`;
    const url = this.getTenantDatabaseUrl(tenantId);

    // Step 1: Crear la base de datos
    await this.$executeRawUnsafe(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);

    // Step 2: Ejecutar migraciones en el nuevo esquema
    const prismaSchemaPath = path.resolve(__dirname, '../../prisma/tenant_base.prisma');
    const migrateCommand = `npx prisma migrate deploy --schema=${prismaSchemaPath}`;
    const envWithNewDatabase = { ...process.env, DATABASE_URL: url };

    await new Promise((resolve, reject) => {
      exec(migrateCommand, { env: envWithNewDatabase }, (error, stdout, stderr) => {
        if (error) {
          console.error('Error running migrations:', stderr);
          reject(error);
        } else {
          console.log('Migrations applied successfully:', stdout);
          resolve(true);
        }
      });
    });

    // Step 3: Configurar conexión del tenant
    return this.getTenantPrisma(tenantId);
  }

  async getTenantPrisma(tenantId: string): Promise<PrismaClient> {
    if (!this.tenantConnections.has(tenantId)) {
      const url = this.getTenantDatabaseUrl(tenantId);
      const prisma = new PrismaClient({
        datasources: {
          db: { url },
        },
      });
      await prisma.$connect();
      this.tenantConnections.set(tenantId, prisma);
    }
    return this.tenantConnections.get(tenantId);
  }

  private getTenantDatabaseUrl(tenantId: string): string {
    const baseUrl = this.configService.get('DATABASE_URL');
    const baseUrlWithoutDB = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    return `${baseUrlWithoutDB}/tenant_${tenantId}`;
  }
}
