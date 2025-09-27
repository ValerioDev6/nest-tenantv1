import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from './tenants.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService,
    private tenantsService: TenantsService,
  ) { }

  async use(
    req: Request & { tenantId?: string; prisma?: PrismaClient },
    res: Response,
    next: NextFunction,
  ) {
    const subdomain = req.headers['x-tenant-id'] as string;

    if (!subdomain) {
      return res.status(400).json({ message: 'X-TENANT-ID header is required' });
    }

    const tenant = await this.tenantsService.findBySubdomain(subdomain);

    if (!tenant || tenant.status !== 'ACTIVE') {
      return res.status(404).json({ message: 'Tenant not found or inactive' });
    }

    const tenantPrisma = await this.prismaService.getTenantPrisma(tenant.subdomain);

    req.tenantId = tenant.id;
    req.prisma = tenantPrisma;

    next();
  }
}
