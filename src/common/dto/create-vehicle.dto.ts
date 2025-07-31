import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUrl, Max, Min } from 'class-validator';

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

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Vehicle Brand',
    examples: ['Renault', 'Mercedes'],
  })
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'Vehicle Model',
    examples: ['Kadjar', 'C180'],
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Vehicle Price',
    example: '200',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Vehicle image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsUrl({ protocols: ['http', 'https'] })
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

  @ApiProperty({
    type: Number,
    minimum: 18,
    maximum: 35,
    description: 'Minimum Age',
    example: 21,
  })
  @IsNumber()
  @Min(18)
  @Max(35)
  minAge: number;

  @ApiProperty({
    type: String,
    description: 'Plate Number',
    example: '34ABC123',
  })
  @IsString()
  plateNumber: string;
}
