import { useState } from 'react'

export interface Task {
  level: 'basic' | 'concept' | 'code' | 'tricky'
  question: string
  solution: React.ReactNode
}

const levelMeta = {
  basic:   { label: 'Базовый',   color: 'bg-green-100 text-green-700 border-green-200' },
  concept: { label: 'Концепция', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  code:    { label: 'Код',       color: 'bg-purple-100 text-purple-700 border-purple-200' },
  tricky:  { label: 'Подвох',    color: 'bg-red-100 text-red-700 border-red-200' },
}

function TaskItem({ task, index }: { task: Task; index: number }) {
  const [open, setOpen] = useState(false)
  const meta = levelMeta[task.level]
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
        <div className="flex-1">
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium border mb-2 ${meta.color}`}>{meta.label}</span>
          <p className="text-gray-800 text-sm leading-relaxed">{task.question}</p>
          <button onClick={() => setOpen(!open)} className="mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors">
            {open ? '▼ Скрыть ответ' : '▶ Показать ответ'}
          </button>
          {open && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 leading-relaxed">
              {task.solution}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TaskBlock({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-3 my-4">
      {tasks.map((task, i) => <TaskItem key={i} task={task} index={i} />)}
    </div>
  )
}
