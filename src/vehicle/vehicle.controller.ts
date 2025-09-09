import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { CreateVehicleDto } from 'src/common/dto/request/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/common/dto/request/update-vehicle-dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { VehicleResponseDto } from 'src/common/dto/response/vehicle-response.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VehicleService } from './vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiRoles('guest')
  @Get('getVehicle/:vehicleId')
  async getVehicleById(
    @Param('vehicleId') vehicleId: string,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.getVehicleById(vehicleId);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Post('createVehicle')
  async createVehicle(
    @Body() body: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.createVehicle(body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updateVehicle/:vehicleId')
  async updateVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    return this.vehicleService.updateVehicle(body, vehicleId);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deleteVehicle/:vehicleId')
  async deleteVehicle(
    @Param('vehicleId') vehicleId: string,
  ): Promise<DeleteResponseDto> {
    return this.vehicleService.deleteVehicle(vehicleId);
  }
}
