import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VehicleSchema } from 'src/vehicle/vehicle.model';
import { BookingController } from './booking.controller';
import { BookingSchema } from './booking.model';
import { BookingService } from './booking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Booking', schema: BookingSchema },
      { name: 'Vehicle', schema: VehicleSchema },
    ]),
  ],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
