import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IncomeDto } from './income.dto';

export class IncomeResponseDto {
  @ApiProperty({
    description: 'A list of monthly income records.',
    type: [IncomeDto],
  })
  @Type(() => IncomeDto)
  income: IncomeDto[];
}
