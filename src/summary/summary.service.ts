import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';

import { Booking, BookingDocument } from 'src/booking/booking.model';
import { NewUserRangeDto } from 'src/common/dto/request/new-user-range.dto';
import { IncomeResponseDto } from 'src/common/dto/response/income-response.dto';
import { MostBookedVehicleResponseDto } from 'src/common/dto/response/most-booked-vehicle-response.dto';
import { NewUserCountResponseDto } from 'src/common/dto/response/new-user-count-response.dto';
import { TopUsersResponseDto } from 'src/common/dto/response/top-users-response.dto';
import { VehicleAvailabilityResponseDto } from 'src/common/dto/response/vehicle-availability-response.dto';
import { NewUserRange } from 'src/common/enums/new-user-range.enum';
import { User, UserDocument } from 'src/user/user.model';
import { Vehicle, VehicleDocument } from 'src/vehicle/vehicle.model';

@Injectable()
export class SummaryService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) {}

  async getMonthlyIncome(): Promise<IncomeResponseDto> {
    const result = await this.bookingModel.aggregate([
      {
        $match: {
          status: 'confirmed',
        },
      },
      {
        $project: {
          yearMonth: {
            $dateToString: { format: '%Y-%m', date: { $toDate: '$startDate' } },
          },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: '$yearMonth',
          totalIncome: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return plainToInstance(IncomeResponseDto, { income: result });
  }

  async getYearlyIncome(): Promise<IncomeResponseDto> {
    const result = await this.bookingModel.aggregate([
      {
        $match: {
          status: 'confirmed',
        },
      },
      {
        $project: {
          year: {
            $year: { $toDate: '$startDate' },
          },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: '$year',
          totalIncome: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return plainToInstance(IncomeResponseDto, { income: result });
  }

  async getTopUsers(limit = 5): Promise<TopUsersResponseDto> {
    const result = await this.bookingModel.aggregate([
      {
        $match: {
          status: 'confirmed',
        },
      },
      {
        $group: {
          _id: '$userId',
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          fullName: {
            $concat: [
              { $ifNull: ['$userInfo.name', ''] },
              ' ',
              { $ifNull: ['$userInfo.surname', ''] },
            ],
          },
          bookingCount: 1,
        },
      },
    ]);

    return plainToInstance(TopUsersResponseDto, { topUsers: result });
  }

  async vehicleAvailability(): Promise<VehicleAvailabilityResponseDto> {
    const today = new Date();
    today.setHours(today.getHours() + 3);

    const rentedVehicleIds = await this.bookingModel.distinct('vehicle', {
      status: 'confirmed',
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    const totalVehicles = await this.vehicleModel.countDocuments();

    const result = {
      totalVehicles,
      rentedVehiclesToday: rentedVehicleIds.length,
      availableVehiclesToday: totalVehicles - rentedVehicleIds.length,
    };

    return plainToInstance(VehicleAvailabilityResponseDto, result);
  }

  async getMostBookedVehicle(): Promise<MostBookedVehicleResponseDto> {
    const results = await this.bookingModel.aggregate([
      {
        $match: { status: 'confirmed' },
      },
      {
        $group: {
          _id: '$vehicleId',
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: '_id',
          as: 'vehicleInfo',
        },
      },
      {
        $unwind: '$vehicleInfo',
      },
      {
        $project: {
          vehicleId: '$_id',
          bookingCount: 1,
          brand: '$vehicleInfo.brand',
          model: '$vehicleInfo.model',
          image: '$vehicleInfo.image',
        },
      },
    ]);

    return plainToInstance(MostBookedVehicleResponseDto, results[0] || []);
  }

  async getNewUserCountByRange(
    query: NewUserRangeDto,
  ): Promise<NewUserCountResponseDto> {
    const { range } = query;
    const now = new Date();
    let from: Date;

    switch (range) {
      case NewUserRange.Day:
        from = new Date(now);
        from.setHours(0, 0, 0, 0);
        break;
      case NewUserRange.Week:
        from = new Date(now);
        from.setDate(now.getDate() - 7);
        from.setHours(0, 0, 0, 0);
        break;
      case NewUserRange.Month:
        from = new Date(now);
        from.setMonth(now.getMonth() - 1);
        from.setHours(0, 0, 0, 0);
        break;
      case NewUserRange.Year:
        from = new Date(now);
        from.setFullYear(now.getFullYear() - 1);
        from.setHours(0, 0, 0, 0);
        break;
      default:
        throw new Error('Invalid range');
    }

    const count = await this.userModel.countDocuments({
      createdAt: { $gte: from },
    });

    const result = {
      range,
      from: from.toISOString(),
      to: now.toISOString(),
      newUsers: count,
    };

    return plainToInstance(NewUserCountResponseDto, result);
  }
}
