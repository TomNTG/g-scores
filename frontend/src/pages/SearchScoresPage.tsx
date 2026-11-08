import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';

import {
  SUBJECTS,
  formatScore,
} from '../constants/subjects';

import { ApiError, getScore } from '../services/api';
import type { ExamResult } from '../types';

export default function SearchScoresPage() {
  const [sbd, setSbd] = useState('');

  const [student, setStudent] =
    useState<ExamResult | null>(null);

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentRequest =
    useRef<AbortController | null>(null);

  useEffect(
    () => () => currentRequest.current?.abort(),
    [],
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    currentRequest.current?.abort();

    setSearched(true);
    setStudent(null);
    setError('');
    setLoading(false);

    const value = sbd.trim();

    if (!/^\d{1,16}$/.test(value)) {
      setError('Số báo danh phải gồm các chữ số.');
      return;
    }

    const controller = new AbortController();
    currentRequest.current = controller;

    setLoading(true);

    try {
      const result = await getScore(
        value,
        controller.signal,
      );

      if (!controller.signal.aborted) {
        setStudent(result);
      }
    } catch (err) {
      if (controller.signal.aborted) return;

      if (
        err instanceof ApiError &&
        err.status === 404
      ) {
        setError('Không tìm thấy.');
      } else {
        setError(
          'Kiểm tra kết nối Backend.',
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <section className="panel">
        <h2>User Registration</h2>

        <form onSubmit={(event) => void handleSubmit(event)}>
          <label htmlFor="sbd">
            Registration Number:
          </label>

          <div className="search-row">
            <input
              id="sbd"
              type="text"
              inputMode="numeric"
              maxLength={16}
              placeholder="Enter registration number (e.g. 01000001)"
              value={sbd}
              onChange={(event) =>
                setSbd(event.target.value)
              }
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Submit'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <h2>Detailed Scores</h2>

        {error && (
          <p className="alert-error" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <p role="status">Đang tra cứu...</p>
        )}

        {!searched && (
          <p>
            Nhập số báo danh ở phía trên để xem điểm thi.
          </p>
        )}

        {student && (
          <>
            <p>
              <strong>Số báo danh:</strong> {student.sbd}
            </p>

            <div className="score-grid">
              {SUBJECTS.map(({ key, label }) => (
                <div className="score-item" key={key}>
                  <span>{label}</span>
                  <strong>
                    {formatScore(student[key])}
                  </strong>
                </div>
              ))}
            </div>

            <p className="helper-text">
              Mã ngoại ngữ: {student.ma_ngoai_ngu ?? '—'}.
              Dấu — nghĩa là không có dữ liệu điểm,
              khác với điểm 0.
            </p>
          </>
        )}
      </section>
    </>
  );
}