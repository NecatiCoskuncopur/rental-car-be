import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingSchema } from 'src/booking/booking.model';
import { UserSchema } from 'src/user/user.model';
import { VehicleSchema } from 'src/vehicle/vehicle.model';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Booking', schema: BookingSchema },
      { name: 'Vehicle', schema: VehicleSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
