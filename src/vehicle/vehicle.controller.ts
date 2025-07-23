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

import { CreateVehicleDto } from 'src/common/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/common/dto/update-vehicle.dto';
import { VehicleQueryDto } from 'src/common/dto/vehicle-query.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from './../common/guards/auth.guard';
import { VehicleService } from './vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('getVehicles')
  getVehicles(@Query() query: VehicleQueryDto) {
    return this.vehicleService.getVehicles(query);
  }

  @Get('getVehicle/:id')
  async getVehicleById(@Param('id') id: string) {
    return this.vehicleService.getVehicle(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post('createVehicle')
  async createVehicle(@Body() body: CreateVehicleDto) {
    return this.vehicleService.createVehicle(body);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updateVehicle/:id')
  async updateVehicle(@Param('id') id: string, @Body() body: UpdateVehicleDto) {
    return this.vehicleService.updateVehicle(id, body);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deleteVehicle/:id')
  async deleteVehicle(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(id);
  }
}
