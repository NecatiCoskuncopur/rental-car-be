import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
} from 'class-validator';

export enum VehicleType {
  Sedan = 'sedan',
  SUV = 'suv',
  Hatchback = 'hatchback',
  StationVagon = 'station vagon',
  MPV = 'mpv',
}

export enum TransmissionType {
  Automatic = 'automatic',
  Manual = 'manual',
}

export enum FuelType {
  Gasoline = 'gasoline',
  Diesel = 'diesel',
  Electric = 'electric',
  Hybrid = 'hybrid',
}

export class CreateVehicleTemplateDto {
  @ApiProperty({
    description: 'Vehicle Brand',
    examples: ['Renault', 'Mercedes'],
  })
  @IsString()
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Brand can only contain letters and spaces.',
  })
  brand: string;

  @ApiProperty({
    description: 'Vehicle Model',
    examples: ['Kadjar', 'C180'],
  })
  @IsString()
  @Matches(/^[A-Za-z0-9ÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Model can only contain letters, numbers, and spaces.',
  })
  model: string;

  @ApiProperty({
    description: 'Post image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;

  @ApiProperty({
    enum: VehicleType,
    description: 'Vehicle Type',
    examples: [VehicleType.SUV, VehicleType.Sedan],
  })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({
    type: Number,
    minimum: 2,
    maximum: 5,
    description: 'Vehicle Doors',
    example: 4,
  })
  @IsNumber()
  @Min(2)
  @Max(5)
  doors: number;

  @ApiProperty({
    type: Number,
    minimum: 2,
    maximum: 12,
    description: 'Passenger',
    example: 5,
  })
  @IsNumber()
  @Min(2)
  @Max(12)
  passengers: number;

  @ApiProperty({
    enum: TransmissionType,
    description: 'Transmission Type',
    example: TransmissionType.Manual,
  })
  @IsEnum(TransmissionType)
  transmissionType: TransmissionType;

  @ApiProperty({
    enum: FuelType,
    description: 'Fuel Type',
    example: FuelType.Gasoline,
  })
  @IsEnum(FuelType)
  fuelType: FuelType;
}
