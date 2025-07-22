import { IsString, IsNumber, IsEnum, IsUrl, Min, Max } from 'class-validator';

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
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  price: number;

  @IsUrl({ protocols: ['http', 'https'] })
  image: string;

  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @IsNumber()
  @Min(2)
  @Max(5)
  doors: number;

  @IsNumber()
  @Min(2)
  @Max(12)
  passengers: number;

  @IsEnum(TransmissionType)
  transmissionType: TransmissionType;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsNumber()
  @Min(18)
  @Max(35)
  minAge: number;
}
