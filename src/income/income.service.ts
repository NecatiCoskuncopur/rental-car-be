import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

import { BookingDocument } from 'src/booking/booking.model';

@Injectable()
export class IncomeService {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: PaginateModel<BookingDocument>,
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
}
