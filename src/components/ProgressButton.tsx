import { useProgress } from '../hooks/useProgress'

export default function ProgressButton({ topicId }: { topicId: string }) {
  const { isCompleted, toggleCompleted } = useProgress()
  const done = isCompleted(topicId)
  return (
    <button onClick={() => toggleCompleted(topicId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${done ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`}>
      {done ? '✅ Изучено' : '⬜ Отметить как изученное'}
    </button>
  )
}
