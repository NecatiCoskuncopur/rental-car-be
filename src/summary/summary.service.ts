import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BookingDocument } from 'src/booking/booking.model';
import { getBookingCountsBy } from 'src/common/dto/get-booking-countsBy';
import { MostBookedVehicleDto } from 'src/common/dto/most-booked-vehicle.dto';
import { TopUserDto } from 'src/common/dto/top-user.dto';
import { UserDocument } from 'src/user/user.model';
import { VehicleDocument } from 'src/vehicle/vehicle.model';

@Injectable()
export class SummaryService {
  constructor(
    @InjectModel('Booking') private bookingModel: Model<BookingDocument>,
    @InjectModel('Vehicle') private vehicleModel: Model<VehicleDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  async getMonthlyIncome() {
    return this.bookingModel.aggregate([
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
  }

  async getYearlyIncome() {
    return this.bookingModel.aggregate([
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
  }

  async getTopUsers(limit = 5) {
    const results = await this.bookingModel.aggregate<TopUserDto>([
      {
        $match: {
          status: 'confirmed',
        },
      },
      {
        $group: {
          _id: '$user',
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

    return results;
  }

  async vehicleAvailability() {
    const today = new Date();
    today.setHours(today.getHours() + 3);

    const rentedVehicleIds = await this.bookingModel.distinct('vehicle', {
      status: 'confirmed',
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    const totalVehicles = await this.vehicleModel.countDocuments();

    return {
      totalVehicles,
      rentedVehiclesToday: rentedVehicleIds.length,
      availableVehiclesToday: totalVehicles - rentedVehicleIds.length,
    };
  }

  async getMostBookedVehicle() {
    const results = await this.bookingModel.aggregate<MostBookedVehicleDto>([
      {
        $match: { status: 'confirmed' },
      },
      {
        $group: {
          _id: '$vehicle',
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

    return results[0] || null;
  }

  async getBookingCountsBy(
    groupField: 'vehicleType' | 'fuelType' | 'transmissionType' = 'vehicleType',
  ) {
    const fieldName = `vehicleInfo.${groupField}`;

    const results = await this.bookingModel.aggregate<getBookingCountsBy>([
      {
        $match: { status: 'confirmed' },
      },
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle',
          foreignField: '_id',
          as: 'vehicleInfo',
        },
      },
      { $unwind: '$vehicleInfo' },
      {
        $group: {
          _id: `$${fieldName}`,
          bookingCount: { $sum: 1 },
        },
      },
      { $sort: { bookingCount: -1 } },
    ]);

    return results;
  }

  async getNewUserCountByRange(range: 'day' | 'week' | 'month') {
    const now = new Date();
    let from: Date;

    switch (range) {
      case 'day':
        from = new Date(now);
        from.setHours(0, 0, 0, 0);
        break;
      case 'week':
        from = new Date(now);
        from.setDate(now.getDate() - 7);
        from.setHours(0, 0, 0, 0);
        break;
      case 'month':
        from = new Date(now);
        from.setMonth(now.getMonth() - 1);
        from.setHours(0, 0, 0, 0);
        break;
      default:
        throw new Error('Invalid range');
    }

    const count = await this.userModel.countDocuments({
      createdAt: { $gte: from },
    });

    return {
      range,
      from: from.toISOString(),
      to: now.toISOString(),
      newUsers: count,
    };
  }
}
