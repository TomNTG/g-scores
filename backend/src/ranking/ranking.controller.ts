import { Controller, Get } from '@nestjs/common';
import { RankingService } from './ranking.service.js';

@Controller('api/ranking')
export class RankingController {
  constructor(
    private readonly rankingService: RankingService,
  ) {}

  @Get('group-a')
  async getTop10GroupA() {
    return this.rankingService.getTop10GroupA();
  }
}