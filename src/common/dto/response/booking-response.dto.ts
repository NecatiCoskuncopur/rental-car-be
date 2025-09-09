import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BookingResponseDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  vehicleId: string;

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
  plateNumber: string;

  @Expose()
  @ApiProperty()
  status: 'pending' | 'cancelled' | 'confirmed';

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
