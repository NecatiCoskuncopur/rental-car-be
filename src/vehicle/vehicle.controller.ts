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
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { CreateVehicleDto } from 'src/common/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/common/dto/update-vehicle.dto';
import { VehicleQueryDto } from 'src/common/dto/vehicle-query.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from './../common/guards/auth.guard';
import { VehicleService } from './vehicle.service';

@ApiExtraModels(VehicleQueryDto)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiRoles('guest')
  @Get('getVehicles')
  getVehicles(@Query() query: VehicleQueryDto) {
    return this.vehicleService.getVehicles(query);
  }

  @ApiRoles('guest')
  @Get('getVehicle/:id')
  async getVehicleById(@Param('id') id: string) {
    return this.vehicleService.getVehicle(id);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Post('createVehicle')
  async createVehicle(@Body() body: CreateVehicleDto) {
    return this.vehicleService.createVehicle(body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updateVehicle/:vehicleId')
  async updateVehicle(
    @Param('vehicleId') vehicleId: string,
    @Body() body: UpdateVehicleDto,
  ) {
    return this.vehicleService.updateVehicle(vehicleId, body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deleteVehicle/:vehicleId')
  async deleteVehicle(@Param('vehicleId') vehicleId: string) {
    return this.vehicleService.deleteVehicle(vehicleId);
  }
}
