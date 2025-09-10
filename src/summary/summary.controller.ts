import { Controller, Get, Query } from '@nestjs/common';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { NewUserRangeDto } from 'src/common/dto/request/new-user-range.dto';
import { IncomeResponseDto } from 'src/common/dto/response/income-response.dto';
import { MostBookedVehicleResponseDto } from 'src/common/dto/response/most-booked-vehicle-response.dto';
import { NewUserCountResponseDto } from 'src/common/dto/response/new-user-count-response.dto';
import { TopUsersResponseDto } from 'src/common/dto/response/top-users-response.dto';
import { VehicleAvailabilityResponseDto } from 'src/common/dto/response/vehicle-availability-response.dto';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @ApiRoles('admin')
  @Get('montlyIncome')
  async getMonthlyIncome(): Promise<IncomeResponseDto> {
    const income = await this.summaryService.getMonthlyIncome();

    return income;
  }

  @ApiRoles('admin')
  @Get('yearlyIncome')
  async getYearlyIncome(): Promise<IncomeResponseDto> {
    const income = await this.summaryService.getYearlyIncome();

    return income;
  }

  @ApiRoles('admin')
  @Get('topUsers')
  async getTopUsers(): Promise<TopUsersResponseDto> {
    return this.summaryService.getTopUsers();
  }

  @ApiRoles('admin')
  @Get('vehicleAvailability')
  async vehicleAvailability(): Promise<VehicleAvailabilityResponseDto> {
    return this.summaryService.vehicleAvailability();
  }

  @ApiRoles('admin')
  @Get('mostBookedVehicle')
  async getMostBookedVehicle(): Promise<MostBookedVehicleResponseDto> {
    return this.summaryService.getMostBookedVehicle();
  }

  @ApiRoles('admin')
  @Get('newUsers')
  getNewUserStats(
    @Query() query: NewUserRangeDto,
  ): Promise<NewUserCountResponseDto> {
    return this.summaryService.getNewUserCountByRange(query);
  }
}
