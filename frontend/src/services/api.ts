import type {
  ExamResult,
  RankedStudent,
  StatisticsResponse,
} from '../types';

const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function getJson<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    signal,
  });

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return (await response.json()) as T;
}

export const getScore = (
  sbd: string,
  signal?: AbortSignal,
) =>
  getJson<ExamResult>(
    `/api/scores/${encodeURIComponent(sbd)}`,
    signal,
  );

export const getStatistics = (signal?: AbortSignal) =>
  getJson<StatisticsResponse>(
    '/api/statistics',
    signal,
  );

export const getRanking = (signal?: AbortSignal) =>
  getJson<RankedStudent[]>(
    '/api/ranking/group-a',
    signal,
  );