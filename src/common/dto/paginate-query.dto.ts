import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class PaginateQueryDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Page Number',
    example: 2,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Order direction: ascending  (asc) veya descending (desc)',
    example: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
