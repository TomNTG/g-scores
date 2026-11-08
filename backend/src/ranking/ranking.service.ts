import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ExamResult } from '../scores/exam-result.entity.js';

@Injectable()
export class RankingService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async getTop10GroupA() {
    const repository =
      this.dataSource.getMongoRepository(ExamResult);

    const students = await repository.aggregate([
      // 1. Chỉ lấy thí sinh có đủ 3 môn hợp lệ
      {
        $match: {
          toan: {
            $type: 'number',
            $gte: 0,
            $lte: 10,
          },
          vat_li: {
            $type: 'number',
            $gte: 0,
            $lte: 10,
          },
          hoa_hoc: {
            $type: 'number',
            $gte: 0,
            $lte: 10,
          },
        },
      },

      // 2. Tính tổng điểm khối A
      {
        $addFields: {
          totalScore: {
            $round: [
              {
                $add: [
                  '$toan',
                  '$vat_li',
                  '$hoa_hoc',
                ],
              },
              2,
            ],
          },
        },
      },

      // 3. Sắp xếp theo tổng điểm giảm dần
      {
        $sort: {
          totalScore: -1,
          sbd: 1,
        },
      },

      // 4. Lấy 10 thí sinh đầu tiên
      {
        $limit: 10,
      },

      // 5. Chỉ trả về các trường cần thiết
      {
        $project: {
          _id: 0,
          sbd: 1,
          toan: 1,
          vat_li: 1,
          hoa_hoc: 1,
          totalScore: 1,
        },
      },
    ]).toArray();

    // Thêm thứ tự xếp hạng từ 1 đến 10
    return students.map((student, index) => ({
      rank: index + 1,
      ...student,
    }));
  }
}