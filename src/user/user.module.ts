import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { BookingSchema } from 'src/booking/booking.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Booking', schema: BookingSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [MongooseModule],
})
export class UserModule {}
