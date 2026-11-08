import { useEffect, useState } from 'react';

import { formatScore } from '../constants/subjects';
import { getRanking } from '../services/api';
import type { RankedStudent } from '../types';

export default function RankingPage() {
  const [ranking, setRanking] =
    useState<RankedStudent[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    void getRanking(controller.signal)
      .then(setRanking)
      .catch(() => {
        if (!controller.signal.aborted) {
          setError('Không tải được bảng xếp hạng.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="panel">
      <h2>Top 10 thí sinh khối A</h2>
      <p>
        Điểm khối A = Toán + Vật lý + Hóa học.
      </p>

      {loading && (
        <p role="status">
          Đang tải bảng xếp hạng...
        </p>
      )}

      {error && (
        <p className="alert-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Số báo danh</th>
                <th>Toán</th>
                <th>Vật lý</th>
                <th>Hóa học</th>
                <th>Tổng điểm</th>
              </tr>
            </thead>

            <tbody>
              {ranking.map((item) => (
                <tr key={item.sbd}>
                  <td>
                    <strong>{item.rank}</strong>
                  </td>
                  <td>{item.sbd}</td>
                  <td>{formatScore(item.toan)}</td>
                  <td>{formatScore(item.vat_li)}</td>
                  <td>{formatScore(item.hoa_hoc)}</td>
                  <td>
                    <strong>
                      {formatScore(item.totalScore)}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ranking.length === 0 && (
            <p>
              Chưa có thí sinh trong bảng xếp hạng.
            </p>
          )}
        </div>
      )}
    </section>
  );
}