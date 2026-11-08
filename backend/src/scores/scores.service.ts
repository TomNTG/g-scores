import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DataSource } from 'typeorm';
import { ExamResult } from './exam-result.entity.js';

@Injectable()
export class ScoresService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async findBySbd(sbd: string) {
    const repository =
      this.dataSource.getMongoRepository(ExamResult);

    const student = await repository.findOneBy({
      sbd,
    });

    if (!student) {
      throw new NotFoundException(
        'Không tìm thấy số báo danh',
      );
    }

    const { _id, ...result } = student;

    return result;
  }
}