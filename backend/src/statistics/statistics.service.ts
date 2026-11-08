import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ExamResult } from '../scores/exam-result.entity.js';
import { SubjectsCatalog } from './subjects.catalog.js';

// Bốn khoảng điểm theo yêu cầu của đề
const LEVELS = [
  {
    key: 'gte8',
    min: 8,
    max: 10,
    includeMax: true,
  },
  {
    key: 'gte6lt8',
    min: 6,
    max: 8,
    includeMax: false,
  },
  {
    key: 'gte4lt6',
    min: 4,
    max: 6,
    includeMax: false,
  },
  {
    key: 'lt4',
    min: 0,
    max: 4,
    includeMax: false,
  },
] as const;

@Injectable()
export class StatisticsService {
  private readonly subjects = new SubjectsCatalog();

  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async getOverview() {
    const group: Record<string, unknown> = {
      _id: null,
      totalStudents: { $sum: 1 },
    };

    // Tạo các phép đếm cho từng môn và khoảng điểm
    for (const subject of this.subjects.getAll()) {
      const field = subject.getFieldPath();

      for (const level of LEVELS) {
        const upperOperator = level.includeMax
          ? '$lte'
          : '$lt';

        const conditions = [
          { $isNumber: field },
          { $gte: [field, level.min] },
          { [upperOperator]: [field, level.max] },
        ];

        group[`${subject.key}_${level.key}`] = {
          $sum: {
            $cond: [
              { $and: conditions },
              1,
              0,
            ],
          },
        };
      }
    }

    const repository =
      this.dataSource.getMongoRepository(ExamResult);

    const documents = await repository
      .aggregate([{ $group: group }])
      .toArray();

    const result = documents[0];

    const subjects = this.subjects.getAll().map(
      (subject) => {
        const levels = {
          gte8: result?.[`${subject.key}_gte8`] ?? 0,
          gte6lt8:
            result?.[`${subject.key}_gte6lt8`] ?? 0,
          gte4lt6:
            result?.[`${subject.key}_gte4lt6`] ?? 0,
          lt4: result?.[`${subject.key}_lt4`] ?? 0,
        };

        const totalWithScore =
          levels.gte8 +
          levels.gte6lt8 +
          levels.gte4lt6 +
          levels.lt4;

        return {
          subject: subject.key,
          name: subject.name,
          levels,
          totalWithScore,
        };
      },
    );

    return {
      totalStudents: result?.totalStudents ?? 0,
      subjects,
    };
  }
}