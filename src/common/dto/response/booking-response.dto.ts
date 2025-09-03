import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { UserResponseDto } from './user-response.dto';
import { VehicleResponseDto } from './vehicle-response.dto';

@Exclude()
export class BookingResponseDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  startDate: Date;

  @Expose()
  @ApiProperty()
  endDate: Date;

  @Expose()
  @ApiProperty()
  totalPrice: number;

  @Expose()
  @ApiProperty()
  status: 'pending' | 'confirmed' | 'cancelled';

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  @ApiProperty()
  user: UserResponseDto;

  @Expose()
  @Type(() => VehicleResponseDto)
  @ApiProperty()
  vehicle: VehicleResponseDto;
}
