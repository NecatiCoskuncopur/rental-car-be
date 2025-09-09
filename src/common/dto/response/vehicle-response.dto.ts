import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class VehicleResponseDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  brand: string;

  @Expose()
  @ApiProperty()
  model: string;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  vehicleType: string;

  @Expose()
  @ApiProperty()
  doors: number;

  @Expose()
  @ApiProperty()
  passengers: number;

  @Expose()
  @ApiProperty()
  transmissionType: string;

  @Expose()
  @ApiProperty()
  fuelType: string;

  @Expose()
  @ApiProperty()
  plateNumbers: string[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
