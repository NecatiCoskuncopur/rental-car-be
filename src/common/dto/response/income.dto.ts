import { ApiProperty } from '@nestjs/swagger';

export class IncomeDto {
  @ApiProperty({
    description: 'The year and month of the income.',
    example: '2025-09 | 2025',
  })
  _id: string;

  @ApiProperty({
    description: 'The total income for the month or year',
    example: 200,
  })
  totalIncome: number;
}
