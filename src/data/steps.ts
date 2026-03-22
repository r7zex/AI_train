export type StepType =
  | 'theory'
  | 'quiz'
  | 'code'
  | 'recap'
  | 'pitfalls'
  | 'interview'

export interface Step {
  id: string
  type: StepType
  title: string
  content?: string
  quizId?: string
  codeTaskId?: string
}

export interface SubTopic {
  id: string
  title: string
  steps: Step[]
}

export const stepTypeConfig: Record<StepType, { icon: string; label: string; color: string }> = {
  theory: { icon: '📖', label: 'Теория', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  quiz: { icon: '📝', label: 'Квиз', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  code: { icon: '💻', label: 'Код', color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  recap: { icon: '📌', label: 'Шпаргалка', color: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
  pitfalls: { icon: '⚠️', label: 'Ошибки', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  interview: { icon: '🎤', label: 'Собес', color: 'bg-violet-100 text-violet-700 border-violet-300' },
}

const requiredCodeTasks = [
  'sum-pairs',
  'stdin-feature-stats',
  'stdin-minmax-scale',
  'stdin-threshold-metrics',
  'stdin-batch-loss',
]

function theoryTemplate(topic: string, term: string, formula: string, lifeCase: string, codeExample: string): string {
  return [
    `Тема: ${topic}`,
    '',
    '1) Терминология',
    `${term}`,
    '',
    '2) Объяснение простыми словами',
    'Это базовая идея, которая помогает модели учиться на данных и улучшать качество предсказаний шаг за шагом.',
    '',
    '3) Где и зачем используется',
    'Используется в production ML-пайплайнах: от baseline до продвинутых моделей, когда нужно контролировать качество и интерпретацию результата.',
    '',
    '4) Пример из жизни',
    `${lifeCase}`,
    '',
    '5) Пример кода',
    codeExample,
    '',
    '6) Словесная интерпретация кода',
    'Код берёт входные данные, считает ключевые промежуточные величины, а затем возвращает метрику/обновлённое состояние модели. Это прямое отображение формулы в программную логику.',
    '',
    'Ключевая формула:',
    formula,
  ].join('\n')
}

function pitfallsTemplate(): string {
  return [
    'Частые ошибки и как исправлять:',
    '• Ошибка 1: считать формулы на всём датасете до split → Решение: все fit-операции только на train.',
    '• Ошибка 2: путать precision/recall/F1 → Решение: всегда выписывать confusion matrix и формулы.',
    '• Ошибка 3: не проверять крайние случаи (деление на 0) → Решение: добавлять явные guard-ветки.',
    '• Ошибка 4: смотреть только на одну метрику → Решение: анализировать набор метрик и бизнес-стоимость ошибок.',
  ].join('\n')
}

function interviewTemplate(topic: string): string {
  return [
    `Вопросы на собеседовании по теме «${topic}»`,
    '',
    'Q1: Как объяснить тему человеку без ML-бэкграунда?',
    'A1: Через бизнес-пример, где ошибка модели имеет цену, и тема помогает эту цену уменьшить.',
    '',
    'Q2: Какие метрики/формулы ключевые?',
    'A2: Нужно назвать формулу, расшифровать каждую переменную и объяснить ограничение формулы.',
    '',
    'Q3: Какие типичные ошибки в проде?',
    'A3: Leakage, некорректный split, отсутствие baseline и отсутствие мониторинга дрейфа.',
    '',
    'Q4: Как проверить решение?',
    'A4: Проверить на edge-cases, сравнить с baseline и прогнать hidden-тесты.',
  ].join('\n')
}

function recapTemplate(formulas: string[]): string {
  return [
    'Шпаргалка подтемы:',
    ...formulas.map((f) => `• ${f}`),
    '• Минимальная практика: 5 quiz-вопросов + 5 задач stdin→stdout с hidden-тестами.',
  ].join('\n')
}

function buildStandardSubTopic(
  subId: string,
  title: string,
  quizId: string,
  theory: string,
  formulas: string[],
): SubTopic {
  return {
    id: subId,
    title,
    steps: [
      { id: `${subId}-theory`, type: 'theory', title: 'Теория: базовая рамка', content: theory },
      { id: `${subId}-pitfalls`, type: 'pitfalls', title: 'Распространённые ошибки и решения', content: pitfallsTemplate() },
      { id: `${subId}-interview`, type: 'interview', title: 'Вопросы и ответы для собеседования', content: interviewTemplate(title) },
      { id: `${subId}-quiz`, type: 'quiz', title: 'Квиз (минимум 5 вопросов)', quizId },
      ...requiredCodeTasks.map((taskId, idx) => ({
        id: `${subId}-code-${idx + 1}`,
        type: 'code' as const,
        title: `Практика stdin→stdout #${idx + 1}`,
        codeTaskId: taskId,
      })),
      { id: `${subId}-recap`, type: 'recap', title: 'Шпаргалка подтемы', content: recapTemplate(formulas) },
    ],
  }
}

export const subTopicsMap: Record<string, SubTopic[]> = {
  'precision-recall-f1': [
    buildStandardSubTopic(
      'prf-core',
      'Precision / Recall / F1',
      'quiz-prf-subtopic',
      theoryTemplate(
        'Precision / Recall / F1',
        'TP, FP, FN — базовые элементы матрицы ошибок; Precision = TP/(TP+FP), Recall = TP/(TP+FN), F1 = 2PR/(P+R).',
        'P = TP/(TP+FP), R = TP/(TP+FN), F1 = 2PR/(P+R)',
        'Медицинский скрининг: высокий Recall снижает риск пропустить заболевание, высокий Precision снижает число ложных тревог.',
        'tp, fp, fn = 70, 30, 70\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nf1 = 2 * precision * recall / (precision + recall)',
      ),
      [
        'Precision = TP / (TP + FP)',
        'Recall = TP / (TP + FN)',
        'F1 = 2 * Precision * Recall / (Precision + Recall)',
      ],
    ),
  ],
  'gradient-descent': [
    buildStandardSubTopic(
      'gd-core',
      'Градиентный спуск',
      'quiz-gd-subtopic',
      theoryTemplate(
        'Градиентный спуск',
        'Функция потерь L(θ), градиент ∇L, скорость обучения η.',
        'θ(t+1) = θ(t) - η * ∇L(θ(t))',
        'Подбор цены в динамике: если шаг слишком большой, «перелетаем» минимум; слишком маленький — двигаемся очень медленно.',
        'for _ in range(steps):\n    grad = (2 / n) * X.T @ (X @ w - y)\n    w = w - lr * grad',
      ),
      [
        'θ(t+1) = θ(t) - η∇L(θ(t))',
        'MSE = (1/n) * Σ(ŷ - y)^2',
        '∇MSE = (2/n) * X.T @ (Xw - y)',
      ],
    ),
  ],
  'gini-impurity': [
    buildStandardSubTopic(
      'gini-core',
      'Индекс Джини',
      'quiz-gini-subtopic',
      theoryTemplate(
        'Индекс Джини',
        'p_k — доля класса k в узле дерева, impurity — степень неоднородности.',
        'Gini = 1 - Σ p_k^2',
        'Сегментация клиентов: чем «чище» сегмент по целевому действию, тем проще принимать бизнес-решение.',
        'p1, p2 = 0.7, 0.3\ngini = 1 - (p1**2 + p2**2)\nprint(round(gini, 2))',
      ),
      [
        'Gini = 1 - Σ p_k^2',
        'Для 2 классов максимум Gini = 0.5',
        'Лучший split минимизирует взвешенный Gini потомков',
      ],
    ),
  ],
}

export const topicCheatsheets: Record<string, string[]> = {
  'precision-recall-f1': [
    'Precision = TP / (TP + FP)',
    'Recall = TP / (TP + FN)',
    'F1 = 2PR / (P + R)',
  ],
  'gradient-descent': [
    'θ(t+1) = θ(t) - η∇L(θ(t))',
    'MSE = (1/n) * Σ(ŷ - y)^2',
    '∇MSE = (2/n) * X.T @ (Xw - y)',
  ],
  'gini-impurity': [
    'Gini = 1 - Σ p_k^2',
    'Gini = 0 для чистого узла',
    'Для бинарного случая максимум 0.5',
  ],
}
