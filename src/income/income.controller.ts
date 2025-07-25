import { Controller, Get, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { IncomeService } from './income.service';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Get('monthly')
  async getMonthlyIncome() {
    const income = await this.incomeService.getMonthlyIncome();

    return { income };
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('yearly')
  async getYearlyIncome() {
    const income = await this.incomeService.getYearlyIncome();

    return { income };
  }
}
