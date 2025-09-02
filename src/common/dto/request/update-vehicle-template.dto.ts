import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';

import {
  FuelType,
  TransmissionType,
  VehicleType,
} from './create-vehicle-template.dto';

export class UpdateVehicleTemplateDto {
  @ApiPropertyOptional({
    description: 'Vehicle Brand',
    examples: ['Renault', 'Mercedes'],
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Brand can only contain letters and spaces.',
  })
  brand?: string;

  @ApiPropertyOptional({
    description: 'Vehicle Model',
    examples: ['Kadjar', 'C180'],
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9ÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Model can only contain letters, numbers, and spaces.',
  })
  model?: string;

  @ApiPropertyOptional({
    description: 'Post image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Image must be a valid URL' })
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
}
