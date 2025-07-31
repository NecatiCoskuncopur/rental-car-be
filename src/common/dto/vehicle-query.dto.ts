import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { FuelType, TransmissionType, VehicleType } from './create-vehicle.dto';
import { PaginateQueryDto } from './paginate-query.dto';

export enum SortBy {
  PRICE = 'price',
  CREATED_AT = 'createdAt',
}

export class VehicleQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    enum: SortBy,
    description: 'Order by',
    example: SortBy.PRICE,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Start Date',
    example: '2025-07-29',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'End Date',
    example: '2025-07-30',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    enum: VehicleType,
    description: 'Vehicle Type',
    example: VehicleType.SUV,
  })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @ApiPropertyOptional({
    enum: FuelType,
    description: 'Fuel Type',
    example: FuelType.Gasoline,
  })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({
    enum: TransmissionType,
    description: 'Transmission Type',
    example: TransmissionType.Manual,
  })
  @IsOptional()
  @IsEnum(TransmissionType)
  transmissionType?: TransmissionType;

  @ApiPropertyOptional({
    type: Number,
    minimum: 18,
    maximum: 35,
    description: 'Minimum Age',
    example: 21,
  })
  @IsOptional()
  @IsNumberString()
  minAge?: string;

  @ApiPropertyOptional({
    type: String,
    minimum: 2,
    maximum: 12,
    description: 'Passenger',
    example: '5',
  })
  @IsOptional()
  @IsNumberString()
  passengers?: string;
}
