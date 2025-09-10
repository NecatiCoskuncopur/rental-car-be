import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { BookingDocument } from 'src/booking/booking.model';

@Injectable()
export class BookingCronService {
  private readonly logger = new Logger(BookingCronService.name);

  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  @Cron('0 0 * * *')
  async cancelOutdatedBookings() {
    this.logger.log('Cancel outdated bookings job started');

    const nowInUtc = new Date();

    const result = await this.bookingModel.updateMany(
      {
        status: 'pending',
        startDate: { $lt: nowInUtc },
      },
      {
        $set: { status: 'cancelled' },
      },
    );

    this.logger.log(`Cancelled ${result.modifiedCount} outdated bookings`);
  }
}
