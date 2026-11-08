// Lưu trữ giá trị và cấu hình được sử dụng
import type { LevelKey, SubjectKey } from '../types';

export const SUBJECTS: ReadonlyArray<{
  key: SubjectKey;
  label: string;
}> = [
  { key: 'toan', label: 'Toán' },
  { key: 'ngu_van', label: 'Ngữ văn' },
  { key: 'ngoai_ngu', label: 'Ngoại ngữ' },
  { key: 'vat_li', label: 'Vật lý' },
  { key: 'hoa_hoc', label: 'Hóa học' },
  { key: 'sinh_hoc', label: 'Sinh học' },
  { key: 'lich_su', label: 'Lịch sử' },
  { key: 'dia_li', label: 'Địa lý' },
  { key: 'gdcd', label: 'GDCD' },
];

export const LEVELS: ReadonlyArray<{
  key: LevelKey;
  label: string;
  color: string;
}> = [
  { key: 'gte8', label: '8–10', color: '#258e75' },
  { key: 'gte6lt8', label: '6–<8', color: '#d5a426' },
  { key: 'gte4lt6', label: '4–<6', color: '#5c85cb' },
  { key: 'lt4', label: '<4', color: '#de7676' },
];

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

export const formatScore = (
  value: number | null | undefined,
) =>
  value == null
    ? '—'
    : new Intl.NumberFormat('vi-VN', {
        maximumFractionDigits: 2,
      }).format(value);