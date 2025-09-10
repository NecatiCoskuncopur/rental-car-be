import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Vehicle, VehicleSchema } from 'src/vehicle/vehicle.model';
import { BookingController } from './booking.controller';
import { Booking, BookingSchema } from './booking.model';
import { BookingService } from './booking.service';
import { BookingCronService } from './tasks/booking-cron.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingCronService],
})
export class BookingModule {}
