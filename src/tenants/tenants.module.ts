import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TenantsService],
  imports: [PrismaModule],
  controllers: [TenantsController],
  exports: [TenantsService],
})
export class TenantsModule {}
