import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from './booking.model';
import { VehicleSchema } from 'src/vehicle/vehicle.model';

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
