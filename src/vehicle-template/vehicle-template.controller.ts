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
import { CreateVehicleTemplateDto } from 'src/common/dto/request/create-vehicle-template.dto';
import { UpdateVehicleTemplateDto } from 'src/common/dto/request/update-vehicle-template.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { VehicleTemplateResponseDto } from 'src/common/dto/response/vehicle-template-response.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VehicleTemplateService } from './vehicle-template.service';

@Controller('vehicle-template')
export class VehicleTemplateController {
  constructor(
    private readonly vehicleTemplateService: VehicleTemplateService,
  ) {}

  @ApiRoles('guest')
  @Get('getVehicleTemplate/:templateId')
  async getVehicleTemplateById(
    @Param('id') id: string,
  ): Promise<VehicleTemplateResponseDto> {
    return this.vehicleTemplateService.getVehicleTemplate(id);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Post('createVehicleTemplate')
  async createVehicleTemplate(
    @Body() body: CreateVehicleTemplateDto,
  ): Promise<VehicleTemplateResponseDto> {
    return this.vehicleTemplateService.createVehicleTemplate(body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Patch('updateVehicleTemplate/:templateId')
  async updateVehicleTemplate(
    @Param('templateId') templateId: string,
    @Body() body: UpdateVehicleTemplateDto,
  ): Promise<VehicleTemplateResponseDto> {
    return this.vehicleTemplateService.updateVehicleTemplate(templateId, body);
  }

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Delete('deleteVehicleTemplate/:templateId')
  async deleteVehicleTemplate(
    @Param('templateId') templateId: string,
  ): Promise<DeleteResponseDto> {
    return this.vehicleTemplateService.deleteVehicleTemplate(templateId);
  }
}
