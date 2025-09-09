import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Vehicle id' })
  @IsMongoId()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ description: 'Booking start date', example: '2025-07-29' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Booking end date', example: '2025-07-30' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
