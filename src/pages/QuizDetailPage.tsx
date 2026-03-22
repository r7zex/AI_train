import { Link, useParams, Navigate } from 'react-router-dom'
import { getQuizById } from '../data/quizzes'
import QuizWidget from '../features/quiz/QuizWidget'

const QuizDetailPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const quiz = quizId ? getQuizById(quizId) : undefined

  if (!quiz) {
    return <Navigate to="/quiz" replace />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Главная</Link>
        <span className="text-gray-300">/</span>
        <Link to="/quiz" className="hover:text-indigo-600 transition-colors">Тесты</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium truncate">{quiz.title}</span>
      </nav>

      {/* Back link */}
      <Link
        to="/quiz"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
      >
        ← Все тесты
      </Link>

      {/* Quiz header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        <p className="text-gray-500 leading-relaxed">{quiz.description}</p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
          <span>📝 {quiz.questions.length} вопросов</span>
          <span>
            🟢 {quiz.questions.filter(q => q.difficulty === 'easy').length} лёгких ·
            🟡 {quiz.questions.filter(q => q.difficulty === 'medium').length} средних ·
            🔴 {quiz.questions.filter(q => q.difficulty === 'hard').length} сложных
          </span>
        </div>
      </div>

      {/* Quiz widget — key ensures fresh state when quiz changes */}
      <QuizWidget key={quiz.id} quiz={quiz} />
    </div>
  )
}

export default QuizDetailPage
