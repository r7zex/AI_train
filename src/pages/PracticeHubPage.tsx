import { Link } from 'react-router-dom'
import ConfusionMatrixPlayground from '../components/calculators/ConfusionMatrixPlayground'
import ScalingIntuitionCalc from '../components/calculators/ScalingIntuitionCalc'
import SplitSimulatorCalc from '../components/calculators/SplitSimulatorCalc'

const quickPractice = [
  {
    title: 'Precision / Recall / F1',
    description: 'Разберите связь между TP/FP/FN и влиянием порога классификации.',
    to: '/topics/precision-recall-f1',
  },
  {
    title: 'Gini и деревья',
    description: 'Потренируйте ручной расчет impurity и выбор лучшего split.',
    to: '/topics/gini-impurity',
  },
  {
    title: 'Шаг градиентного спуска',
    description: 'Проверьте интуицию по обновлению весов и learning rate.',
    to: '/topics/gradient-descent',
  },
  {
    title: 'Attention shapes',
    description: 'Проверьте размерности Q/K/V и итоговых тензоров в MHA.',
    to: '/topics/transformers-qkv',
  },
]

export default function PracticeHubPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Практика: хаб тренажеров</h1>
        <p className="text-gray-600 max-w-3xl">
          Здесь собраны интерактивные мини-симуляторы и быстрые входы в практические темы. Используйте страницу как ежедневный
          warm-up перед квизами и код-задачами.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {quickPractice.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-blue-300 transition-all"
          >
            <h2 className="font-semibold text-gray-800 mb-1">{card.title}</h2>
            <p className="text-sm text-gray-600">{card.description}</p>
            <div className="text-xs text-blue-600 mt-3 font-medium">Открыть тему →</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <ConfusionMatrixPlayground />
        <ScalingIntuitionCalc />
      </div>

      <div className="mb-10">
        <SplitSimulatorCalc />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <Link
          to="/quiz"
          className="text-center bg-indigo-600 text-white rounded-xl px-4 py-3 font-semibold hover:bg-indigo-700 transition-colors"
        >
          Перейти к квизам
        </Link>
        <Link
          to="/code-practice"
          className="text-center bg-blue-600 text-white rounded-xl px-4 py-3 font-semibold hover:bg-blue-700 transition-colors"
        >
          Перейти к код-задачам
        </Link>
        <Link
          to="/progress"
          className="text-center bg-white border border-gray-300 text-gray-700 rounded-xl px-4 py-3 font-semibold hover:bg-gray-50 transition-colors"
        >
          Открыть прогресс
        </Link>
      </div>
    </div>
  )
}

