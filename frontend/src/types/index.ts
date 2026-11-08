// Mô tả dữ liệu
export type SubjectKey =
  | 'toan' | 'ngu_van' | 'ngoai_ngu'
  | 'vat_li' | 'hoa_hoc' | 'sinh_hoc'
  | 'lich_su' | 'dia_li' | 'gdcd';

export type ExamResult = {
  sbd: string;
  ma_ngoai_ngu: string | null;
} & Record<SubjectKey, number | null>;

export type LevelKey =
  'gte8' | 'gte6lt8' | 'gte4lt6' | 'lt4';

export interface SubjectStatistics {
  subject: SubjectKey;
  name: string;
  totalWithScore: number;
  levels: Record<LevelKey, number>;
}

export interface StatisticsResponse {
  totalStudents: number;
  subjects: SubjectStatistics[];
}

export interface RankedStudent {
  rank: number;
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  totalScore: number;
}