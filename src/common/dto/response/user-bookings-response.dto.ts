import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PaginationMetaDto } from './pagination-meta.dto';
import { UserBookingResponseDto } from './user-booking-response.dto';

export class UserBookingsResponseDto {
  @ApiProperty({ type: [UserBookingResponseDto] })
  @Type(() => UserBookingResponseDto)
  bookings: UserBookingResponseDto[];

  @ApiProperty()
  @Type(() => PaginationMetaDto)
  pagination: PaginationMetaDto;

  @ApiProperty({ example: 100 })
  totalBookings: number;
}
