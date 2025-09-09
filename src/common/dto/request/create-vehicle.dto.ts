import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

import { FuelType } from 'src/common/enums/fuel-type.enum';
import { TransmissionType } from 'src/common/enums/transmission-type.enum';
import { VehicleType } from 'src/common/enums/vehicle-type.enum';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Vehicle Brand',
    examples: ['Renault', 'Mercedes'],
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Brand can only contain letters and spaces.',
  })
  brand: string;

  @ApiProperty({
    description: 'Vehicle Model',
    examples: ['Kadjar', 'C180'],
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9\s]+$/, {
    message: 'Model can only contain letters, numbers, and spaces.',
  })
  model: string;

  @ApiProperty({
    description: 'Vehicle image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    description: 'Vehicle Price',
    example: '200',
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    enum: VehicleType,
    description: 'Vehicle Type',
    example: VehicleType.Hatchback,
  })
  @IsNotEmpty()
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({
    type: Number,
    minimum: 2,
    maximum: 5,
    description: 'Vehicle Doors',
    example: 4,
  })
  @IsNotEmpty()
  @IsNumber()
  doors: number;

  @ApiProperty({
    type: Number,
    minimum: 2,
    maximum: 12,
    description: 'Passenger',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  passengers: number;

  @ApiProperty({
    enum: TransmissionType,
    description: 'Transmission Type',
    example: TransmissionType.Manual,
  })
  @IsNotEmpty()
  @IsEnum(TransmissionType)
  transmissionType: TransmissionType;

  @ApiProperty({
    enum: FuelType,
    description: 'Fuel Type',
    example: FuelType.Hybrid,
  })
  @IsNotEmpty()
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({
    type: [String],
    description: 'An array of plate numbers to be added to the vehicle model.',
    example: ['34 ABC 123', '34 DEF 456', '34 GHI 789'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^(0[1-9]|[1-7][0-9]|8[0-1])\s[A-Z]{1,3}\s\d{2,4}$/, {
    each: true,
    message: 'Each plate number must be a valid Turkish plate format.',
  })
  plateNumbers: string[];
}
