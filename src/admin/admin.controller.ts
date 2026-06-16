import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService, DashboardStats } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
// Endpoint para obtener estadísticas del dashboard, protegido por autenticación y autorización de rol ADMIN
  @Get('dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getDashboard(): Promise<{ data: DashboardStats }> {
    const stats = await this.adminService.getDashboardStats();
    return { data: stats };
  }
}
