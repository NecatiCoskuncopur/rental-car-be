import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    description: 'Plate Number',
    example: '34 ABC 1234',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,3}\s?\d{2,4}$/, {
    message:
      'Plate number must be a valid Turkish license plate (e.g., 34 ABC 1234)',
  })
  plateNumber?: string;

  @ApiPropertyOptional({
    description: 'Vehicle Price',
    example: 200,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}
