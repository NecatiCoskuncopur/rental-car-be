import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class UpdateBookingStatusDto {
  @ApiProperty({
    type: String,
    enum: ['confirmed', 'cancelled'],
    description: 'Reservation status: can only be "confirmed" or "cancelled".',
    example: 'confirmed',
  })
  @IsIn(['confirmed', 'cancelled'], {
    message: 'Status must be either "confirmed" or "cancelled"',
  })
  status: 'confirmed' | 'cancelled';
}
