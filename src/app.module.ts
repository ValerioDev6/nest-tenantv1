import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TenantMiddleware } from './tenants/tenants.middleware';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
// import { TenantMiddleware } from './tenants/tenants.middleware';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TenantsModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    PrismaModule,
    CompaniesModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'v1/api/tenants', method: RequestMethod.POST }, // Ruta para crear tenants
        { path: 'v1/api/tenants/(.*)', method: RequestMethod.GET }, // Otras rutas relacionadas con tenants
      )
      .forRoutes('*'); // Aplicar middleware al resto de rutas
  }
}
