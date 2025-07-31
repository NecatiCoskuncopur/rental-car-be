import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SummaryService } from './summary.service';

type VehicleGroupField = 'vehicleType' | 'fuelType' | 'transmissionType';

@UseGuards(AuthGuard, AdminGuard)
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @ApiRoles('admin')
  @Get('montlyIncome')
  async getMonthlyIncome() {
    const income = await this.summaryService.getMonthlyIncome();

    return { income };
  }

  @ApiRoles('admin')
  @Get('yearlyIncome')
  async getYearlyIncome() {
    const income = await this.summaryService.getYearlyIncome();

    return { income };
  }

  @ApiRoles('admin')
  @Get('topUsers')
  async getTopUsers() {
    return this.summaryService.getTopUsers();
  }

  @ApiRoles('admin')
  @Get('vehicleAvailability')
  async vehicleAvailability() {
    return this.summaryService.vehicleAvailability();
  }

  @ApiRoles('admin')
  @Get('mostBookedVehicle')
  async getMostBookedVehicle() {
    return this.summaryService.getMostBookedVehicle();
  }

  @ApiRoles('admin')
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

  @ApiRoles('admin')
  @Get('newUsers')
  getNewUserStats(@Query('range') range: 'day' | 'week' | 'month' = 'day') {
    return this.summaryService.getNewUserCountByRange(range);
  }
}
