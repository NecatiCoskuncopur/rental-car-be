import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VehicleDocument } from './vehicle.model';
import { CreateVehicleDto } from 'src/common/dto/create-vehicle.dto';
import { pickAllowedKeys } from 'src/common/utils/object.util';
import { UpdateVehicleDto } from 'src/common/dto/update-vehicle.dto';
import { deleteImageFromStorage } from 'src/common/utils/deleteImageFromStorage';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle')
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  //Get all
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
