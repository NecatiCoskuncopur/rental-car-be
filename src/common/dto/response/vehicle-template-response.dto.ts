import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import {
  FuelType,
  TransmissionType,
  VehicleType,
} from '../request/create-vehicle-template.dto';

@Exclude()
export class VehicleTemplateResponseDto {
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
  vehicleType: VehicleType;

  @Expose()
  @ApiProperty()
  doors: number;

  @Expose()
  @ApiProperty()
  passengers: number;

  @Expose()
  @ApiProperty()
  transmissionType: TransmissionType;

  @Expose()
  @ApiProperty()
  fuelType: FuelType;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
