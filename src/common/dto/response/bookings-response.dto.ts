import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { BookingResponseDto } from './booking-response.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class BookingsResponseDto {
  @ApiProperty({ type: [BookingResponseDto] })
  @Type(() => BookingResponseDto)
  bookings: BookingResponseDto[];

  @ApiProperty()
  @Type(() => PaginationMetaDto)
  pagination: PaginationMetaDto;

  @ApiProperty({ example: 100 })
  totalBookings: number;
}
