import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import { FuelType, TransmissionType, VehicleType } from './create-vehicle.dto';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    description: 'Vehicle Brand',
    examples: ['Renault', 'Mercedes'],
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Vehicle Model',
    examples: ['Kadjar', 'C180'],
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    description: 'Vehicle Price',
    example: '200',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Vehicle image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'] })
  image?: string;

  @ApiPropertyOptional({
    enum: VehicleType,
    description: 'Vehicle Type',
    examples: [VehicleType.SUV, VehicleType.Sedan],
  })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @ApiPropertyOptional({
    type: Number,
    minimum: 2,
    maximum: 5,
    description: 'Vehicle Doors',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(5)
  doors?: number;

  @ApiPropertyOptional({
    type: Number,
    minimum: 2,
    maximum: 12,
    description: 'Passenger',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(12)
  passengers?: number;

  @ApiPropertyOptional({
    enum: TransmissionType,
    description: 'Transmission Type',
    example: TransmissionType.Manual,
  })
  @IsOptional()
  @IsEnum(TransmissionType)
  transmissionType?: TransmissionType;

  @ApiPropertyOptional({
    enum: FuelType,
    description: 'Fuel Type',
    example: FuelType.Gasoline,
  })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({
    type: Number,
    minimum: 18,
    maximum: 35,
    description: 'Minimum Age',
    example: 21,
  })
  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(35)
  minAge?: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Plate Number',
    example: '34ABC123',
  })
  @IsOptional()
  @IsString()
  plateNumber?: string;
}
