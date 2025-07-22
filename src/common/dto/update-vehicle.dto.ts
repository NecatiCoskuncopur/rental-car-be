import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsUrl,
  Min,
  Max,
} from 'class-validator';
import { VehicleType, TransmissionType, FuelType } from './create-vehicle.dto';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'] })
  image?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(5)
  doors?: number;

  @IsOptional()
  @IsNumber()
  @Min(2)
  @Max(12)
  passengers?: number;

  @IsOptional()
  @IsEnum(TransmissionType)
  transmissionType?: TransmissionType;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(35)
  minAge?: number;
}
