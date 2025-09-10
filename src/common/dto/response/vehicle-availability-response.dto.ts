import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class VehicleAvailabilityResponseDto {
  @Expose()
  @ApiProperty()
  totalVehicles: number;

  @Expose()
  @ApiProperty()
  rentedVehiclesToday: number;

  @Expose()
  @ApiProperty()
  availableVehiclesToday: number;
}
