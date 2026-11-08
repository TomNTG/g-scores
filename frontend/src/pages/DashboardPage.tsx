import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import {
  SUBJECTS,
  formatNumber,
} from '../constants/subjects';

import { getStatistics } from '../services/api';
import type { StatisticsResponse } from '../types';

export default function DashboardPage() {
  const [data, setData] =
    useState<StatisticsResponse | null>(null);

  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    void getStatistics(controller.signal)
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('Không tải được dữ liệu tổng quan.');
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <div className="page-heading">
        <h2>Dashboard</h2>
        <p>Tổng quan điểm thi tốt nghiệp THPT năm 2024.</p>
      </div>

      {error && (
        <p role="alert" className="alert-error">{error}</p>
      )}

      <div className="metric-grid">
        <article className="metric-card">
          <span>Tổng số thí sinh</span>
          <strong>
            {data ? formatNumber(data.totalStudents) : '—'}
          </strong>
        </article>

        <article className="metric-card">
          <span>Số môn thi</span>
          <strong>{SUBJECTS.length}</strong>
        </article>

        <article className="metric-card">
          <span>Xếp hạng khối A</span>
          <strong>Top 10</strong>
          <small>Toán + Vật lý + Hóa học</small>
        </article>
      </div>

      <section className="panel">
        <h3>Chức năng chính</h3>

        <div className="action-grid">
          <Link to="/search">
            Tra cứu điểm thi <span>→</span>
          </Link>

          <Link to="/statistics">
            Xem báo cáo thống kê <span>→</span>
          </Link>

          <Link to="/ranking">
            Xem Top 10 khối A <span>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}