import 'dotenv/config';
import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'csv-parse';
import {
  MongoClient,
  type AnyBulkWriteOperation,
} from 'mongodb';

// 1. Định nghĩa cấu trúc một bản ghi điểm thi
interface ExamResult {
  sbd: string;
  toan: number | null;
  ngu_van: number | null;
  ngoai_ngu: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  sinh_hoc: number | null;
  lich_su: number | null;
  dia_li: number | null;
  gdcd: number | null;
  ma_ngoai_ngu: string | null;
}

// 2. Chuyển chuỗi điểm thành số hoặc null
function parseScore(value: string | undefined): number | null {
  if (value === undefined || value.trim() === '') {
    return null;
  }

  const score = Number(value);

  if (!Number.isFinite(score) || score < 0 || score > 10) {
    throw new Error(`Điểm không hợp lệ: ${value}`);
  }

  return score;
}

// 3. Chuyển một dòng CSV thành document
function convertRow(row: Record<string, string>): ExamResult {
  const sbd = (row.sbd ?? '').trim();

  if (!/^\d+$/.test(sbd)) {
    throw new Error(`Số báo danh không hợp lệ: ${sbd}`);
  }

  return {
    sbd,
    toan: parseScore(row.toan),
    ngu_van: parseScore(row.ngu_van),
    ngoai_ngu: parseScore(row.ngoai_ngu),
    vat_li: parseScore(row.vat_li),
    hoa_hoc: parseScore(row.hoa_hoc),
    sinh_hoc: parseScore(row.sinh_hoc),
    lich_su: parseScore(row.lich_su),
    dia_li: parseScore(row.dia_li),
    gdcd: parseScore(row.gdcd),
    ma_ngoai_ngu: row.ma_ngoai_ngu?.trim() || null,
  };
}

// 4. Import dữ liệu vào MongoDB Atlas
async function main() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Thiếu MONGODB_URI trong file .env');
  }

  const csvPath = resolve(
    process.cwd(),
    '../dataset/diem_thi_thpt_2024.csv',
  );

  if (!existsSync(csvPath)) {
    throw new Error(`Không tìm thấy CSV: ${csvPath}`);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const collection = client
      .db('g_scores')
      .collection<ExamResult>('exam_results');

    // Số báo danh không được trùng
    await collection.createIndex(
      { sbd: 1 },
      { unique: true },
    );

    // Đọc CSV theo luồng
    const csvStream = createReadStream(csvPath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        bom: true,
      }),
    );

    let batch: AnyBulkWriteOperation<ExamResult>[] = [];
    let processed = 0;

    // Ghi các bản ghi theo từng batch
    async function saveBatch() {
      if (batch.length === 0) return;

      await collection.bulkWrite(batch, {
        ordered: true,
      });

      processed += batch.length;
      batch = [];

      console.log(`Processed: ${processed}`);
    }

    for await (const row of csvStream) {
      const document = convertRow(row);

      batch.push({
        updateOne: {
          filter: { sbd: document.sbd },
          update: { $set: document },
          upsert: true,
        },
      });

      if (batch.length >= 1000) {
        await saveBatch();
      }
    }

    // Ghi những bản ghi còn lại
    await saveBatch();

    console.log('Import completed!');
    console.log(
      'Total documents:',
      await collection.countDocuments({}),
    );

    // Kiểm tra thí sinh mẫu
    console.log(
      'Sample:',
      await collection.findOne({ sbd: '01000001' }),
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error('Import failed:', error.message);
  process.exitCode = 1;
});