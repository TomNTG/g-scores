import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ScoresModule } from './scores/scores.module.js';
import { ExamResult } from './scores/exam-result.entity.js';
import { StatisticsModule } from './statistics/statistics.module.js';
import { RankingModule } from './ranking/ranking.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URI,
      database: 'g_scores',
      entities: [ExamResult],
      synchronize: false,
    }),
    ScoresModule,
    StatisticsModule,
    RankingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}