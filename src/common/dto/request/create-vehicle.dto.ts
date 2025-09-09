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
    enum: ['sedan', 'suv', 'hatchback', 'station vagon', 'mpv'],
    description: 'Vehicle Type',
    example: 'suv',
  })
  @IsNotEmpty()
  @IsEnum(['sedan', 'suv', 'hatchback', 'station vagon', 'mpv'])
  vehicleType: string;

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
    enum: ['automatic', 'manual'],
    description: 'Transmission Type',
    example: 'manual',
  })
  @IsNotEmpty()
  @IsEnum(['automatic', 'manual'])
  transmissionType: string;

  @ApiProperty({
    enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
    description: 'Fuel Type',
    example: 'gasoline',
  })
  @IsNotEmpty()
  @IsEnum(['gasoline', 'diesel', 'electric', 'hybrid'])
  fuelType: string;

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
