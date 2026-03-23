import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import TopicsPage from './pages/TopicsPage'
import TopicDetailPage from './pages/TopicDetailPage'
import TermsFunctionsPage from './pages/TermsFunctionsPage'
import ComparisonPage from './pages/ComparisonPage'
import CheatsheetPage from './pages/CheatsheetPage'
import YandexTheoryPage from './pages/YandexTheoryPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/topics" replace />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="topics/:topicId" element={<TopicDetailPage />} />
        <Route path="topics/:topicId/:stepId" element={<TopicDetailPage />} />
        <Route path="terms-functions" element={<TermsFunctionsPage />} />
        <Route path="comparison" element={<ComparisonPage />} />
        <Route path="cheatsheet" element={<CheatsheetPage />} />
        <Route path="yandex-theory" element={<YandexTheoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
