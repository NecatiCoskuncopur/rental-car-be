import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { FuelType } from 'src/common/enums/fuel-type.enum';
import { TransmissionType } from 'src/common/enums/transmission-type.enum';
import { VehicleType } from 'src/common/enums/vehicle-type.enum';
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
    example: FuelType.Diesel,
  })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({
    enum: TransmissionType,
    description: 'Transmission Type',
    example: TransmissionType.Automatic,
  })
  @IsOptional()
  @IsEnum(TransmissionType)
  transmissionType?: TransmissionType;

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
