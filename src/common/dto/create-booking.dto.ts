import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsMongoId()
  @IsNotEmpty()
  vehicleId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @Min(0)
  totalPrice: number;
}
