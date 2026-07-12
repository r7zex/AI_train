import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

const TopicsPage = lazy(() => import('./pages/TopicsPage'))
const TopicDetailPage = lazy(() => import('./pages/TopicDetailPage'))
const TermsFunctionsPage = lazy(() => import('./pages/TermsFunctionsPage'))
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'))
const CheatsheetPage = lazy(() => import('./pages/CheatsheetPage'))
const YandexTheoryPage = lazy(() => import('./pages/YandexTheoryPage'))

export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-[14px] text-[#727b83]">Загружаем курс…</div>}>
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
    </Suspense>
  )
}
