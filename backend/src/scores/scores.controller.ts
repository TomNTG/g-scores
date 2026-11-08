import {
  Controller,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';

import { ScoresService } from './scores.service.js';

@Controller('api/scores')
export class ScoresController {
  constructor(
    private readonly scoresService: ScoresService,
  ) {}

  @Get(':sbd')
  async getScore(@Param('sbd') sbd: string) {
    if (!/^\d{1,16}$/.test(sbd)) {
      throw new BadRequestException(
        'Số báo danh phải là chuỗi chữ số hợp lệ',
      );
    }

    return this.scoresService.findBySbd(sbd);
  }
}