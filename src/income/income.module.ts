import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema } from 'src/booking/booking.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
  ],
  providers: [IncomeService],
  controllers: [IncomeController],
})
export class IncomeModule {}
