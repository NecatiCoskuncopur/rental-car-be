import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PaginationMetaDto } from './pagination-meta.dto';
import { VehicleResponseDto } from './vehicle-response.dto';

export class VehiclesResponseDto {
  @ApiProperty({ type: [VehicleResponseDto] })
  @Type(() => VehicleResponseDto)
  vehicles: VehicleResponseDto[];

  @ApiProperty()
  @Type(() => PaginationMetaDto)
  pagination: PaginationMetaDto;

  @ApiProperty({ example: 100 })
  totalVehicles: number;
}
