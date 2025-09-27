import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tenant } from '@prisma/client';
import { CreateTenantDto } from './dtos/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Validar que el subdomain no exista
    const existingTenant = await this.findBySubdomain(createTenantDto.subdomain);
    if (existingTenant) {
      throw new ConflictException('Subdomain already exists');
    }

    // 1. Crear registro del tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: createTenantDto.name,
        subdomain: createTenantDto.subdomain, // Este será usado como X-TENANT-ID
        status: 'CREATING',
      },
    });

    try {
      // 2. Crear base de datos del tenant
      await this.prisma.createTenantDatabase(tenant.subdomain);

      // 3. Actualizar estado a ACTIVE
      return await this.prisma.tenant.update({
        where: { id: tenant.id },
        data: { status: 'ACTIVE' },
      });
    } catch (error) {
      // En caso de error, marcar como inactivo
      await this.prisma.tenant.update({
        where: { id: tenant.id },
        data: { status: 'INACTIVE' },
      });
      throw error;
    }
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { subdomain },
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { id },
    });
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany({
      where: { status: 'ACTIVE' },
    });
  }
}
