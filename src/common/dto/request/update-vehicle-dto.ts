import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { FuelType } from 'src/common/enums/fuel-type.enum';
import { TransmissionType } from 'src/common/enums/transmission-type.enum';
import { VehicleType } from 'src/common/enums/vehicle-type.enum';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    description: 'Vehicle Brand',
    examples: ['Renault', 'Mercedes'],
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Brand can only contain letters and spaces.',
  })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Vehicle Model',
    examples: ['Kadjar', 'C180'],
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: 'Model can only contain letters, numbers, and spaces.',
  })
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
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({
    enum: VehicleType,
    description: 'Vehicle Type',
    example: VehicleType.Sedan,
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
    example: TransmissionType.Automatic,
  })
  @IsOptional()
  @IsEnum(TransmissionType)
  transmissionType?: TransmissionType;

  @ApiPropertyOptional({
    enum: FuelType,
    description: 'Fuel Type',
    example: FuelType.Electric,
  })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({
    type: [String],
    description: 'An array of plate numbers to be added to the vehicle model.',
    example: ['34 ABC 123', '34 DEF 456', '34 GHI 789'],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^(0[1-9]|[1-7][0-9]|8[0-1])\s[A-Z]{1,3}\s\d{2,4}$/, {
    each: true,
    message: 'Each plate number must be a valid Turkish plate format.',
  })
  @IsOptional()
  plateNumbers?: string[];
}
