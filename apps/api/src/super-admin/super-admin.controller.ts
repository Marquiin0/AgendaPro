import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get('stats')
  getStats() {
    return this.superAdminService.getStats();
  }

  @Get('stats/timeline')
  getTimeline(@Query('months') months?: string) {
    return this.superAdminService.getTimeline(months ? parseInt(months) : 12);
  }

  @Get('businesses')
  getBusinesses(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.superAdminService.getBusinesses(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
    );
  }

  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.superAdminService.getUsers(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      role,
      search,
    );
  }

  @Get('appointments')
  getAppointments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.superAdminService.getAppointments(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      status,
      dateFrom,
      dateTo,
    );
  }
}
