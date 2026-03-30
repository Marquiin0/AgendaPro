import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('CLIENT')
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    if (user.role === 'ADMIN') {
      return this.appointmentsService.findByBusiness(user.id);
    }
    return this.appointmentsService.findByClient(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.appointmentsService.cancel(id, userId);
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  confirm(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.appointmentsService.confirm(id, userId);
  }

  @Patch(':id/reschedule')
  reschedule(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body('startTime') startTime: string,
  ) {
    return this.appointmentsService.reschedule(id, userId, startTime);
  }
}
