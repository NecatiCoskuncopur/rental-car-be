import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { AggregatePaginateModel, Model } from 'mongoose';

import { CreateVehicleDto } from 'src/common/dto/request/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/common/dto/request/update-vehicle-dto';
import { VehicleQueryDto } from 'src/common/dto/request/vehicle-query.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { VehicleResponseDto } from 'src/common/dto/response/vehicle-response.dto';
import { VehiclesResponseDto } from 'src/common/dto/response/vehicles-response.dto';
import { deleteImageFromStorage } from 'src/common/utils/deleteImageFromStorage';
import { pickAllowedKeys } from 'src/common/utils/pickAllowedKeys.util';
import { Vehicle, VehicleDocument } from './vehicle.model';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async getVehicles(queryDto: VehicleQueryDto): Promise<VehiclesResponseDto> {
    const {
      sortBy = 'updatedAt',
      order = 'desc',
      page = '1',
      limit = '10',
      startDate,
      endDate,
      vehicleType,
      fuelType,
      transmissionType,
      passengers,
    } = queryDto;

    const sortDirection = order === 'asc' ? 1 : -1;
    const query = {} as Record<string, any>;

    if (vehicleType) query.vehicleType = { $in: vehicleType.split(',') };
    if (fuelType) query.fuelType = fuelType;
    if (transmissionType) query.transmissionType = transmissionType;
    if (passengers) query.passengers = { $lte: parseInt(passengers) };

    const aggregatePipeline: any[] = [];

    if (Object.keys(query).length > 0) {
      aggregatePipeline.push({ $match: query });
    }

    if (startDate && endDate) {
      const start = dayjs(startDate).startOf('day').toDate();
      const end = dayjs(endDate).endOf('day').toDate();

      aggregatePipeline.push(
        {
          $lookup: {
            from: 'bookings',
            localField: 'plateNumbers',
            foreignField: 'plateNumber',
            as: 'bookedPlates',
            pipeline: [
              {
                $match: {
                  status: { $in: ['pending', 'confirmed'] },
                  $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
                },
              },
              { $project: { plateNumber: 1 } },
            ],
          },
        },
        {
          $addFields: {
            totalPlateCount: { $size: '$plateNumbers' },
            bookedPlateCount: { $size: '$bookedPlates' },
          },
        },
        {
          $addFields: {
            isAvailable: {
              $gt: ['$totalPlateCount', '$bookedPlateCount'],
            },
          },
        },
        {
          $project: {
            bookedPlates: 0,
            totalPlateCount: 0,
            bookedPlateCount: 0,
          },
        },
      );
    }

    aggregatePipeline.push({ $sort: { [sortBy]: sortDirection } });

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
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

    const result = await (
      this.vehicleModel as AggregatePaginateModel<VehicleDocument>
    ).aggregatePaginate(
      this.vehicleModel.aggregate(aggregatePipeline),
      options,
    );

    const vehiclesDto = plainToInstance(VehiclesResponseDto, {
      vehicle: result.vehicles,
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

    return vehiclesDto;
  }

  async getVehicleById(id: string): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) throw new NotFoundException('Vehicle not found.');

    return plainToInstance(VehicleResponseDto, vehicle);
  }

  async createVehicle(
    createVehicleDto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const { plateNumbers } = createVehicleDto;

    const existingPlates = await this.vehicleModel.find({
      plateNumbers: { $in: plateNumbers },
    });

    if (existingPlates.length > 0) {
      const duplicatePlates = existingPlates.flatMap((doc) =>
        doc.plateNumbers.filter((plate) => plateNumbers.includes(plate)),
      );
      throw new BadRequestException(
        `The following plate numbers are already in use: ${duplicatePlates.join(', ')}`,
      );
    }

    const newVehicle = new this.vehicleModel(createVehicleDto);

    const vehicle = await newVehicle.save();

    return plainToInstance(VehicleResponseDto, vehicle);
  }

  async updateVehicle(
    data: UpdateVehicleDto,
    id: string,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.vehicleModel.findById(id);

    if (!vehicle) throw new NotFoundException('Vehicle not found.');

    const updates = pickAllowedKeys(data, [
      'brand',
      'model',
      'price',
      'image',
      'vehicleType',
      'doors',
      'passengers',
      'transmissionType',
      'fuelType',
      'plateNumbers',
    ]);

    if (updates.plateNumbers && Array.isArray(updates.plateNumbers)) {
      const newPlates = updates.plateNumbers as string[];

      const existingPlatesInOtherVehicles = await this.vehicleModel.find({
        _id: { $ne: id },
        plateNumbers: { $in: newPlates },
      });

      if (existingPlatesInOtherVehicles.length > 0) {
        throw new BadRequestException(
          'One or more of the new plate numbers are already in use.',
        );
      }

      const combinedPlates = Array.from(
        new Set([...vehicle.plateNumbers, ...newPlates]),
      );

      updates.plateNumbers = combinedPlates;
    } else {
      delete updates.plateNumbers;
    }

    if (data.image && data.image !== vehicle.image) {
      await deleteImageFromStorage(vehicle.image);
    }

    if (!data.image) {
      delete updates.image;
    }

    const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedVehicle) {
      throw new NotFoundException('Vehicle update failed.');
    }

    return plainToInstance(VehicleResponseDto, updatedVehicle);
  }

  async deleteVehicle(id: string): Promise<DeleteResponseDto> {
    const vehicle = await this.vehicleModel.findByIdAndDelete(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    if (vehicle.image) await deleteImageFromStorage(vehicle.image);

    return { message: 'The vehicle has been deleted' };
  }
}
