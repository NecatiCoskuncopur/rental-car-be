import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

import { PaginateQueryDto } from './paginate-query.dto';

export class BookingQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    enum: ['pending', 'confirmed', 'cancelled'],
    description: 'Booking status filter',
    example: 'pending',
  })
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'cancelled';
}
