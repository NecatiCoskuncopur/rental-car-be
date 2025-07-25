import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';

import { BookingDocument } from '../booking.model';

@Injectable()
export class BookingCronService {
  private readonly logger = new Logger(BookingCronService.name);

  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: Model<BookingDocument>,
  ) {}

  @Cron('0 21 * * *')
  async cancelOutdatedBookings() {
    this.logger.log('Cancel job started');

    const now = new Date();
    const turkeyNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const bookings = await this.bookingModel.find({
      status: 'pending',
      startDate: { $lt: turkeyNow },
    });

    for (const booking of bookings) {
      booking.status = 'cancelled';
      await booking.save();
    }

    this.logger.log(`Cancelled ${bookings.length} outdated bookings`);
  }
}
