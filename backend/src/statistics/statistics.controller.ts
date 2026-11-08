import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service.js';

@Controller('api/statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
  ) {}

  @Get()
  async getOverview() {
    return this.statisticsService.getOverview();
  }
}