import { Tenant as PrismaTenant } from '@prisma/client';

export class Tenant implements PrismaTenant {
  id: string;
  name: string;
  subdomain: string;
  status: 'CREATING' | 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}
