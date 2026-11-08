import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller.js';
import { ScoresService } from './scores.service.js';

@Module({
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}