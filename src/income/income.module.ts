import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookingSchema } from 'src/booking/booking.model';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
  ],
  providers: [IncomeService],
  controllers: [IncomeController],
})
export class IncomeModule {}
