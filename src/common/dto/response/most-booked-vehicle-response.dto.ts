import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MostBookedVehicleResponseDto {
  @Expose()
  @ApiProperty()
  vehicleId: string;

  @Expose()
  @ApiProperty()
  bookingCount: number;

  @Expose()
  @ApiProperty()
  brand: string;

  @Expose()
  @ApiProperty()
  model: string;

  @Expose()
  @ApiProperty()
  image: string;
}
