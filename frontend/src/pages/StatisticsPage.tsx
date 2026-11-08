import { useEffect, useState } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  LEVELS,
  SUBJECTS,
  formatNumber,
} from '../constants/subjects';

import { getStatistics } from '../services/api';

import type {
  StatisticsResponse,
  SubjectKey,
} from '../types';

export default function StatisticsPage() {
  const [statistics, setStatistics] =
    useState<StatisticsResponse | null>(null);

  const [selectedSubject, setSelectedSubject] =
    useState<SubjectKey>('toan');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    void getStatistics(controller.signal)
      .then(setStatistics)
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('Không tải được thống kê.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const selectedData = statistics?.subjects.find(
    (item) => item.subject === selectedSubject,
  );

  const chartData = LEVELS.map((level) => ({
    key: level.key,
    name: level.label,
    count: selectedData?.levels[level.key] ?? 0,
    color: level.color,
  }));

  return (
    <section className="panel">
      <div className="panel-top">
        <div>
          <h2>Reports — Thống kê phổ điểm</h2>
          <p>
            Phân bố thí sinh theo bốn khoảng điểm.
          </p>
        </div>

        <label className="subject-picker">
          Môn học

          <select
            value={selectedSubject}
            onChange={(event) =>
              setSelectedSubject(
                event.target.value as SubjectKey,
              )
            }
          >
            {SUBJECTS.map(({ key, label }) => (
              <option value={key} key={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && (
        <p role="status">Đang tải thống kê...</p>
      )}

      {error && (
        <p role="alert" className="alert-error">
          {error}
        </p>
      )}

      {!loading && selectedData && (
        <>
          <p className="helper-text">
            Số thí sinh có điểm môn {selectedData.name}:{' '}
            <strong>
              {formatNumber(selectedData.totalWithScore)}
            </strong>
          </p>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={310}>
              <BarChart
                data={chartData}
                margin={{
                  top: 16,
                  right: 15,
                  left: 15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) =>
                    formatNumber(Number(value))
                  }
                />

                <Bar
                  dataKey="count"
                  name="Số thí sinh"
                  radius={[5, 5, 0, 0]}
                >
                  {chartData.map(({ key, color }) => (
                    <Cell key={key} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="level-grid">
            {chartData.map((item) => (
              <div className="level-card" key={item.key}>
                <span>
                  <i
                    style={{ background: item.color }}
                  />
                  {item.name}
                </span>

                <strong>
                  {formatNumber(item.count)}
                </strong>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}