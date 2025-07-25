import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregatePaginateModel, Model } from 'mongoose';

import { CreateVehicleDto } from 'src/common/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/common/dto/update-vehicle.dto';
import { VehicleQueryDto } from 'src/common/dto/vehicle-query.dto';
import { deleteImageFromStorage } from 'src/common/utils/deleteImageFromStorage';
import { pickAllowedKeys } from 'src/common/utils/object.util';
import { VehicleDocument } from './vehicle.model';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle')
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async getVehicles(queryDto: VehicleQueryDto) {
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
      minAge,
      passengers,
    } = queryDto;

    const sortDirection = order === 'asc' ? 1 : -1;
    const query = {} as Record<string, any>;

    if (vehicleType) query.vehicleType = { $in: vehicleType.split(',') };
    if (fuelType) query.fuelType = fuelType;
    if (transmissionType) query.transmissionType = transmissionType;
    if (minAge) query.minAge = { $lte: parseInt(minAge) };
    if (passengers) query.passengers = { $lte: parseInt(passengers) };
    const start = startDate ? new Date(startDate) : new Date('1970-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');

    const aggregatePipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'vehicle',
          as: 'bookings',
        },
      },
      {
        $addFields: {
          bookingsWithinRange: {
            $filter: {
              input: '$bookings',
              as: 'booking',
              cond: {
                $and: [
                  {
                    $or: [
                      {
                        $and: [
                          { $lt: ['$$booking.startDate', end] },
                          { $gt: ['$$booking.endDate', start] },
                        ],
                      },
                      {
                        $and: [
                          { $gte: ['$$booking.startDate', start] },
                          { $lte: ['$$booking.endDate', end] },
                        ],
                      },
                    ],
                  },
                  { $ne: ['$$booking.status', 'cancelled'] },
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          bookingsWithinRange: { $size: 0 },
        },
      },
      { $sort: { [sortBy]: sortDirection } },
    ];

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

    return result;
  }

  async getVehicle(id: string): Promise<VehicleDocument> {
    const vehicle = await this.vehicleModel.findById(id).exec();
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }
    return vehicle;
  }

  async createVehicle(
    createVehicle: CreateVehicleDto,
  ): Promise<VehicleDocument> {
    try {
      const createdVehicle = new this.vehicleModel(createVehicle);
      return await createdVehicle.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error: Failed to create vehicle');
    }
  }

  async updateVehicle(
    id: string,
    data: UpdateVehicleDto,
  ): Promise<VehicleDocument> {
    try {
      const allowedUpdates = [
        'brand',
        'model',
        'price',
        'image',
        'vehicleType',
        'doors',
        'passengers',
        'transmissionType',
        'fuelType',
        'minAge',
      ];
      const updates = pickAllowedKeys(data, allowedUpdates);

      const vehicle = await this.vehicleModel.findById(id);

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      if (data.image && data.image !== vehicle.image) {
        await deleteImageFromStorage(vehicle.image);
      }

      if (!data.image) {
        delete updates.image;
      }
      const updatedVehicle = (await this.vehicleModel
        .findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true },
        )
        .lean()) as VehicleDocument;

      return updatedVehicle;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error: Failed to update vehicle');
    }
  }

  async deleteVehicle(id: string) {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    if (vehicle.image) {
      await deleteImageFromStorage(vehicle.image);
    }

    await this.vehicleModel.findByIdAndDelete(id);
    return { message: 'The vehicle has been deleted' };
  }
}
