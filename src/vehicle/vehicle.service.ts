import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, PaginateModel } from 'mongoose';

import { CreateVehicleDto } from 'src/common/dto/request/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/common/dto/request/update-vehicle.dto';
import { VehiclesPaginateQueryDto } from 'src/common/dto/request/vehicles-paginate-query.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { VehicleResponseDto } from 'src/common/dto/response/vehicle-response.dto';
import { VehiclesResponseDto } from 'src/common/dto/response/vehicles-response.dto';
import { pickAllowedKeys } from 'src/common/utils/pickAllowedKeys.util';
import {
  VehicleTemplate,
  VehicleTemplateDocument,
} from 'src/vehicle-template/vehicle-template.model';
import { VehicleDocument } from './vehicle.model';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle')
    private readonly vehicleModel: PaginateModel<VehicleDocument>,
    @InjectModel(VehicleTemplate.name)
    private readonly vehicleTemplateModel: Model<VehicleTemplateDocument>,
  ) {}

  async getVehicles(
    query: VehiclesPaginateQueryDto,
  ): Promise<VehiclesResponseDto> {
    const { page = 1, limit = 10, order = 'desc', templateId } = query;

    const queryConditions = {} as Record<string, any>;

    if (templateId) {
      queryConditions.templateId = templateId;
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { updatedAt: order === 'asc' ? 1 : -1 },
      lean: true,
      customLabels: {
        totalDocs: 'totalVehicles',
        docs: 'vehicles',
        limit: 'perPage',
        page: 'currentPage',
        totalPages: 'totalPages',
        nextPage: 'next',
        prevPage: 'prev',
        pagingCounter: 'pageStartIndex',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
      },
    };

    const result = await this.vehicleModel.paginate(queryConditions, options);

    const vehicles = plainToInstance(VehiclesResponseDto, {
      vehicles: result.vehicles,
      pagination: {
        perPage: result.perPage,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        pageStartIndex: result.pageStartIndex,
        hasPrev: result.hasPrev,
        hasNext: result.hasNext,
        prev: result.prev,
        next: result.next,
      },
      totalVehicles: result.totalVehicles,
    });

    return vehicles;
  }

  async getVehicle(id: string): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }
    return plainToInstance(VehicleResponseDto, vehicle);
  }

  async createVehicle(
    createVehicle: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const template = await this.vehicleTemplateModel.findById(
      createVehicle.templateId,
    );
    if (!template) {
      throw new NotFoundException('Vehicle template not found');
    }

    const newVehicle = new this.vehicleModel(createVehicle);
    const vehicle = newVehicle.save();

    return plainToInstance(VehicleResponseDto, vehicle);
  }

  async updateVehicle(
    id: string,
    body: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const allowedUpdates = ['plateNumber', 'price'];

    const updates = pickAllowedKeys(body, allowedUpdates);

    const vehicle = await this.vehicleModel.findById(id);

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const updatedVehicle = await this.vehicleModel
      .findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true },
      )
      .lean();

    return plainToInstance(VehicleResponseDto, updatedVehicle);
  }

  async deleteVehicle(id: string): Promise<DeleteResponseDto> {
    const vehicle = await this.vehicleModel.findByIdAndDelete(id);
    if (!vehicle) throw new NotFoundException('Vehicle  not found');

    return {
      message: 'The vehicle template has been deleted',
    };
  }
}
