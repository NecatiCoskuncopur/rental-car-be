import { IsIn } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsIn(['confirmed', 'cancelled'], {
    message: 'Status must be either "confirmed" or "cancelled"',
  })
  status: 'confirmed' | 'cancelled';
}
