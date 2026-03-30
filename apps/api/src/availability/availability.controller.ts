import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  getAvailableSlots(
    @Query('staffId') staffId: string,
    @Query('duration') duration: string,
    @Query('date') date: string,
  ) {
    return this.availabilityService.getAvailableSlots(
      staffId,
      parseInt(duration, 10),
      date,
    );
  }
}
