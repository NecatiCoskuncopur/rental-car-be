import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginateQueryDto } from './paginate-query.dto';

export class VehiclesPaginateQueryDto extends PaginateQueryDto {
  @ApiPropertyOptional({
    description: 'Template ID',
  })
  @IsOptional()
  @IsString()
  templateId?: string;
}
