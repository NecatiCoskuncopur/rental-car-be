import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';

import { CreateVehicleTemplateDto } from 'src/common/dto/request/create-vehicle-template.dto';
import { UpdateVehicleTemplateDto } from 'src/common/dto/request/update-vehicle-template.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { VehicleTemplateResponseDto } from 'src/common/dto/response/vehicle-template-response.dto';
import { deleteImageFromStorage } from 'src/common/utils/deleteImageFromStorage';
import { pickAllowedKeys } from 'src/common/utils/pickAllowedKeys.util';
import { VehicleDocument } from 'src/vehicle/vehicle.model';
import {
  VehicleTemplate,
  VehicleTemplateDocument,
} from './vehicle-template.model';

@Injectable()
export class VehicleTemplateService {
  constructor(
    @InjectModel(VehicleTemplate.name)
    private readonly templateModel: Model<VehicleTemplateDocument>,
    @InjectModel('Vehicle')
    private readonly vehicleModel: PaginateModel<VehicleDocument>,
  ) {}

  //getVehicleTemplates Vehicle model sonrası

  async getVehicleTemplate(id: string): Promise<VehicleTemplateResponseDto> {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new NotFoundException('Vehicle not found.');
    }
    return plainToInstance(VehicleTemplateResponseDto, template);
  }

  async createVehicleTemplate(
    createVehicleTemplate: CreateVehicleTemplateDto,
  ): Promise<VehicleTemplateResponseDto> {
    const newTemplate = new this.templateModel(createVehicleTemplate);
    const template = await newTemplate.save();

    return plainToInstance(VehicleTemplateResponseDto, template);
  }

  async updateVehicleTemplate(
    id: string,
    body: UpdateVehicleTemplateDto,
  ): Promise<VehicleTemplateResponseDto> {
    const allowedUpdates = [
      'brand',
      'model',
      'image',
      'vehicleType',
      'doors',
      'passengers',
      'transmissionType',
      'fuelType',
    ];

    const updates = pickAllowedKeys(body, allowedUpdates);

    const vehicleTemplate = await this.templateModel.findById(id);

    if (!vehicleTemplate) {
      throw new NotFoundException('Vehicle template not found');
    }

    if (body.image && body.image !== vehicleTemplate.image) {
      await deleteImageFromStorage(vehicleTemplate.image);
    }

    if (!body.image || body.image === '') {
      delete updates.image;
    }
    const updatedVehicle = await this.templateModel
      .findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true },
      )
      .lean();

    return plainToInstance(VehicleTemplateResponseDto, updatedVehicle);
  }

  async deleteVehicleTemplate(id: string): Promise<DeleteResponseDto> {
    const template = await this.templateModel.findById(id);
    if (!template) throw new NotFoundException('Vehicle Template not found');

    await this.vehicleModel.deleteMany({ templateId: id });
    await this.templateModel.findByIdAndDelete(id);

    if (template.image) {
      await deleteImageFromStorage(template.image);
    }

    return {
      message: 'The vehicle template has been deleted',
    };
  }
}
