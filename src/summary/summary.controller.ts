import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SummaryService } from './summary.service';

type VehicleGroupField = 'vehicleType' | 'fuelType' | 'transmissionType';

@UseGuards(AuthGuard, AdminGuard)
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('montlyIncome')
  async getMonthlyIncome() {
    const income = await this.summaryService.getMonthlyIncome();

    return { income };
  }

  @Get('yearlyIncome')
  async getYearlyIncome() {
    const income = await this.summaryService.getYearlyIncome();

    return { income };
  }

  @Get('topUsers')
  async getTopUsers() {
    return this.summaryService.getTopUsers();
  }

  @Get('vehicleAvailability')
  async vehicleAvailability() {
    return this.summaryService.vehicleAvailability();
  }

  @Get('mostBookedVehicle')
  async getMostBookedVehicle() {
    return this.summaryService.getMostBookedVehicle();
  }

  @Get('mostBookedBy')
  async getMostBookedVehicleType(@Query('field') field?: string) {
    const validFields: VehicleGroupField[] = [
      'vehicleType',
      'fuelType',
      'transmissionType',
    ];
    const groupField: VehicleGroupField = validFields.includes(
      field as VehicleGroupField,
    )
      ? (field as VehicleGroupField)
      : 'vehicleType';

    return this.summaryService.getBookingCountsBy(groupField);
  }

  @Get('newUsers')
  getNewUserStats(@Query('range') range: 'day' | 'week' | 'month' = 'day') {
    return this.summaryService.getNewUserCountByRange(range);
  }
}
