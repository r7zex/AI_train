import { Link } from 'react-router-dom'

const steps = [
  {
    n: 1,
    title: 'Изучи теорию',
    desc: 'Каждая тема начинается с теоретического блока: определения, формулы (через KaTeX), ключевые идеи. Читай внимательно, не пропускай формулы — именно их спрашивают на собеседованиях.',
  },
  {
    n: 2,
    title: 'Посчитай руками',
    desc: 'В разделе «Ручной расчёт» решай пример шаг за шагом. Это самый важный этап: если ты умеешь посчитать Gini impurity или обратное распространение вручную — интервьюер это заметит.',
  },
  {
    n: 3,
    title: 'Разбери код',
    desc: 'Пример на Python показывает, как алгоритм реализован на практике. Запускай код у себя, меняй параметры, наблюдай за результатом.',
  },
  {
    n: 4,
    title: 'Проверь себя',
    desc: 'Блок «Практические задания» — открытые вопросы в стиле собеседования. Попробуй ответить вслух или письменно до того, как смотреть подсказку.',
  },
  {
    n: 5,
    title: 'Отметь как изученное',
    desc: 'Нажми кнопку «Отметить как изученное» — прогресс сохранится в localStorage. Возвращайся к теме позже для повторения.',
  },
]

const topicStructure = [
  { icon: '📖', label: 'Теория', desc: 'Концепция, формулы, интуиция' },
  { icon: '🧮', label: 'Ручной расчёт', desc: 'Пошаговый числовой пример' },
  { icon: '💻', label: 'Код', desc: 'Реализация на Python/NumPy' },
  { icon: '🎯', label: 'Задания', desc: 'Вопросы в стиле интервью' },
  { icon: '✅', label: 'Прогресс', desc: 'Кнопка отметить / сбросить' },
]

const tips = [
  'Проговаривай ответ вслух — интервью это разговор, а не тест.',
  'Если не знаешь формулу точно, объясни идею и из чего она состоит.',
  'Учись рисовать схемы: дерево решений, граф вычислений, архитектуру сети.',
  'Знай порядок величин: типичные learning rate, batch size, количество слоёв.',
  'Готовь примеры из реального опыта для каждого алгоритма.',
  'Повторяй пройденные темы через 1 день, 1 неделю и 1 месяц (интервальное повторение).',
  'Изучи типичные ошибки — страница «Типичные ошибки» поможет их избежать.',
]

const recommendedOrder = [
  { section: 'Классическое МО', topics: 'Линейная регрессия → Логистическая → Деревья → Random Forest → Gradient Boosting', color: 'green' },
  { section: 'Метрики и валидация', topics: 'Accuracy/F1/ROC-AUC → Cross-validation → Bias-Variance', color: 'blue' },
  { section: 'Методология', topics: 'Feature Engineering → Regularization → Hyperparameter Tuning', color: 'orange' },
  { section: 'Deep Learning', topics: 'Backprop → CNN → RNN/LSTM → Attention → Transformer', color: 'purple' },
  { section: 'Продвинутые темы', topics: 'BERT/GPT → Диффузионные модели → MLOps', color: 'red' },
]

const colorBadge: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
  red: 'bg-red-100 text-red-800',
}

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">📘 Как пользоваться тренажёром</h1>
        <p className="text-gray-600 text-lg">
          Этот тренажёр создан для подготовки к техническим собеседованиям по ML/DL. Следуй этому руководству, чтобы использовать его максимально эффективно.
        </p>
      </div>

      {/* 5 steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🚀 Общая концепция: 5 шагов обучения</h2>
        <div className="space-y-4">
          {steps.map(step => (
            <div key={step.n} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.n}
              </div>
              <div>
                <div className="font-semibold text-gray-800 mb-1">{step.title}</div>
                <div className="text-gray-600 text-sm leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Topic structure */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🗂 Структура каждой темы</h2>
        <p className="text-gray-600 mb-5 text-sm">Каждая страница темы состоит из следующих блоков:</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topicStructure.map(item => (
            <div key={item.label} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-blue-800 text-sm">{item.label}</div>
                <div className="text-blue-700 text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Progress system */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💾 Система прогресса</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-3">
          <p className="text-amber-900 text-sm leading-relaxed">
            Прогресс хранится в <code className="bg-amber-200 px-1.5 py-0.5 rounded text-xs font-mono">localStorage</code> браузера — никаких аккаунтов и серверов не нужно.
          </p>
          <ul className="list-disc list-inside text-amber-800 text-sm space-y-1.5">
            <li>Нажми «Отметить как изученное» на любой теме — она сразу отображается как пройденная.</li>
            <li>Прогресс-бар на главной странице обновляется автоматически.</li>
            <li>Данные сохраняются между сессиями браузера, но <strong>не синхронизируются</strong> между устройствами.</li>
            <li>Чтобы сбросить прогресс по теме, нажми «Снять отметку» на странице темы.</li>
            <li>Полный сброс: <code className="bg-amber-200 px-1.5 py-0.5 rounded text-xs font-mono">localStorage.clear()</code> в консоли браузера.</li>
          </ul>
        </div>
      </section>

      {/* Interview tips */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎤 Советы по подготовке к собеседованию</h2>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
              <span className="text-green-600 font-bold text-sm flex-shrink-0">💡</span>
              <span className="text-green-800 text-sm leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended order */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🗺 Рекомендуемый порядок тем</h2>
        <p className="text-gray-600 text-sm mb-5">
          Если ты только начинаешь или хочешь систематически пройти весь материал, следуй такому порядку:
        </p>
        <div className="space-y-3">
          {recommendedOrder.map((row, i) => (
            <div key={row.section} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                <span className="w-7 h-7 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorBadge[row.color]}`}>
                  {row.section}
                </span>
              </div>
              <span className="text-gray-600 text-sm">{row.topics}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🚀</div>
        <h3 className="text-xl font-bold mb-2">Готов начать?</h3>
        <p className="text-blue-100 mb-5 text-sm">Открой список тем и выбери первую — или загляни в шпаргалку формул для быстрого повторения.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/topics" className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-sm">
            Все темы →
          </Link>
          <Link to="/cheatsheet" className="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-400 transition-colors text-sm">
            Шпаргалка формул →
          </Link>
        </div>
      </div>
    </div>
  )
}
