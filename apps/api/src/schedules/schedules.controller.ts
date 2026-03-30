import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { UpsertScheduleDto } from './dto/upsert-schedule.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('businesses/:businessId/staff/:staffId/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  getByStaff(@Param('staffId') staffId: string) {
    return this.schedulesService.getByStaff(staffId);
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  upsert(
    @Param('businessId') businessId: string,
    @Param('staffId') staffId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpsertScheduleDto,
  ) {
    return this.schedulesService.upsert(businessId, staffId, userId, dto);
  }
}
