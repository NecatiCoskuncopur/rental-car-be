import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { CreateVehicleDto } from 'src/common/dto/request/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/common/dto/request/update-vehicle.dto';
import { VehiclesPaginateQueryDto } from 'src/common/dto/request/vehicles-paginate-query.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { VehicleResponseDto } from 'src/common/dto/response/vehicle-response.dto';
import { VehiclesResponseDto } from 'src/common/dto/response/vehicles-response.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VehicleService } from './vehicle.service';

@UseGuards(AuthGuard, AdminGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiRoles('admin')
  @Get('getVehicles')
  getAllVehicles(
    @Query() query: VehiclesPaginateQueryDto,
  ): Promise<VehiclesResponseDto> {
    return this.vehicleService.getVehicles(query);
  }
  @ApiRoles('admin')
  @ApiRoles('guest')
  @Get('getVehicle/:id')
  async getVehicleById(@Param('id') id: string): Promise<VehicleResponseDto> {
    return this.vehicleService.getVehicle(id);
  }

  @ApiRoles('admin')
  @Post('createVehicle')
  async createVehicle(
    @Body() body: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.createVehicle(body);
  }

  @ApiRoles('admin')
  @Patch('updateVehicle/:vehicleId')
  async updateVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.updateVehicle(vehicleId, body);
  }

  @ApiRoles('admin')
  @Delete('deleteVehicle/:vehicleId')
  async deleteVehicle(
    @Param('vehicleId') vehicleId: string,
  ): Promise<DeleteResponseDto> {
    return this.vehicleService.deleteVehicle(vehicleId);
  }
}
