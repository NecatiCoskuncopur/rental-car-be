import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { NewUserRange } from 'src/common/enums/new-user-range.enum';

export class NewUserRangeDto {
  @ApiPropertyOptional({
    enum: NewUserRange,
    description: 'New user range',
    example: NewUserRange.Day,
  })
  @IsOptional()
  @IsEnum(NewUserRange)
  range: NewUserRange;
}
