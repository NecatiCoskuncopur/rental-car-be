import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: 'Vehicle Template id' })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    description: 'Plate Number',
    example: '34 ABC 1234',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,3}\s?\d{2,4}$/, {
    message:
      'Plate number must be a valid Turkish license plate (e.g., 34 ABC 1234)',
  })
  plateNumber: string;

  @ApiProperty({
    description: 'Vehicle Price',
    example: 200,
  })
  @Min(0)
  @IsNumber()
  price: number;
}
