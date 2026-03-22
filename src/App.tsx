import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import TopicsPage from './pages/TopicsPage'
import TopicDetailPage from './pages/TopicDetailPage'
import GuidePage from './pages/GuidePage'
import CheatsheetPage from './pages/CheatsheetPage'
import MistakesPage from './pages/MistakesPage'
import GlossaryPage from './pages/GlossaryPage'
import ComparisonPage from './pages/ComparisonPage'
import QuizPage from './pages/QuizPage'
import QuizDetailPage from './pages/QuizDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="topics/:topicId" element={<TopicDetailPage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="cheatsheet" element={<CheatsheetPage />} />
        <Route path="mistakes" element={<MistakesPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="comparisons" element={<ComparisonPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="quiz/:quizId" element={<QuizDetailPage />} />
      </Route>
    </Routes>
  )
}
