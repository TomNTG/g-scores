import { Navigate, Route, Routes } from 'react-router';

import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import SearchScoresPage from './pages/SearchScoresPage';
import StatisticsPage from './pages/StatisticsPage';
import RankingPage from './pages/RankingPage';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="search" element={<SearchScoresPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}