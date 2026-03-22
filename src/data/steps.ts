export type StepType =
  | 'theory'
  | 'formula'
  | 'intuition'
  | 'manual-solution'
  | 'quiz'
  | 'code'
  | 'fill-in-code'
  | 'debugging'
  | 'recap'
  | 'pitfalls'
  | 'sources'

export interface Step {
  id: string
  type: StepType
  title: string
  content?: string   // plain text/markdown-like content for theory/recap/pitfalls
  quizId?: string    // for quiz steps
  codeTaskId?: string // for code steps
}

export interface SubTopic {
  id: string
  title: string
  steps: Step[]
}

export const stepTypeConfig: Record<StepType, { icon: string; label: string; color: string }> = {
  theory:          { icon: '📖', label: 'Теория',       color: 'bg-blue-100 text-blue-700 border-blue-300' },
  formula:         { icon: '📐', label: 'Формула',      color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  intuition:       { icon: '💡', label: 'Интуиция',     color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  'manual-solution': { icon: '✏️', label: 'Ручной расчёт', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  quiz:            { icon: '📝', label: 'Квиз',         color: 'bg-purple-100 text-purple-700 border-purple-300' },
  code:            { icon: '💻', label: 'Код',          color: 'bg-gray-100 text-gray-700 border-gray-300' },
  'fill-in-code':  { icon: '🔧', label: 'Заполни код',  color: 'bg-green-100 text-green-700 border-green-300' },
  debugging:       { icon: '🐛', label: 'Отладка',      color: 'bg-red-100 text-red-700 border-red-300' },
  recap:           { icon: '🔁', label: 'Итого',        color: 'bg-teal-100 text-teal-700 border-teal-300' },
  pitfalls:        { icon: '⚠️', label: 'Ошибки',       color: 'bg-rose-100 text-rose-700 border-rose-300' },
  sources:         { icon: '📚', label: 'Источники',    color: 'bg-slate-100 text-slate-700 border-slate-300' },
}

// Example subtopics with steps for a few topics
export const subTopicsMap: Record<string, SubTopic[]> = {
  'precision-recall-f1': [
    {
      id: 'prf-sub1',
      title: 'Precision & Recall',
      steps: [
        {
          id: 'prf-s1',
          type: 'theory',
          title: 'Что такое Precision и Recall',
          content:
            'Precision (точность) — доля правильных положительных предсказаний среди всех положительных предсказаний:\nPrecision = TP / (TP + FP)\n\nRecall (полнота) — доля найденных положительных объектов среди всех реально положительных:\nRecall = TP / (TP + FN)\n\nPrecision отвечает на вопрос: "Сколько из тех, кого мы назвали позитивными, реально позитивны?"\nRecall отвечает: "Сколько реально позитивных мы нашли?"',
        },
        {
          id: 'prf-s2',
          type: 'intuition',
          title: 'Когда важнее Precision, когда Recall',
          content:
            'Precision важна, когда цена ложной тревоги (FP) высока:\n• Спам-фильтр: не хочется отправить важное письмо в спам\n• Судебная система: лучше оправдать виновного, чем осудить невиновного\n\nRecall важен, когда цена пропуска (FN) высока:\n• Медицинская диагностика: лучше направить здорового на повторный тест, чем пропустить больного\n• Противопожарная сигнализация: лучше ложная тревога, чем пропустить пожар',
        },
        {
          id: 'prf-s3',
          type: 'formula',
          title: 'Формула F1-Score',
          content:
            'F1-Score — гармоническое среднее Precision и Recall:\nF1 = 2·P·R / (P + R)\n\nПочему гармоническое, а не среднее арифметическое?\nГармоническое среднее штрафует за несбалансированность: если P=1.0, R=0.01, то:\n• Арифметическое: (1.0 + 0.01) / 2 = 0.505\n• Гармоническое: 2·1.0·0.01 / 1.01 ≈ 0.02\n\nF1 принуждает нас достичь баланса между P и R.',
        },
        {
          id: 'prf-s4',
          type: 'manual-solution',
          title: 'Ручной расчёт F1',
          content:
            'Задача: TP=70, FP=30, FN=70\n\nШаг 1: Precision = TP/(TP+FP) = 70/(70+30) = 70/100 = 0.7\nШаг 2: Recall = TP/(TP+FN) = 70/(70+70) = 70/140 = 0.5\nШаг 3: F1 = 2·0.7·0.5 / (0.7+0.5) = 0.7 / 1.2 ≈ 0.583\n\nПроверка: F1 всегда между min(P,R) и max(P,R)\n0.5 ≤ 0.583 ≤ 0.7 ✓',
        },
        {
          id: 'prf-s5',
          type: 'quiz',
          title: 'Квиз: Precision, Recall, F1',
          quizId: 'quiz-metrics',
        },
        {
          id: 'prf-s6',
          type: 'pitfalls',
          title: 'Типичные ошибки',
          content:
            '1. Путать Precision и Recall местами — всегда проверяй по формуле.\n2. Использовать Accuracy для несбалансированных датасетов — модель "всегда предсказывает 0" даст 99% Accuracy при 1% позитивов.\n3. Оптимизировать F1 напрямую в sklearn — используй make_scorer(f1_score, average="binary").\n4. Забывать указывать average= при мультиклассовом F1: "macro", "micro", "weighted".',
        },
        {
          id: 'prf-s7',
          type: 'recap',
          title: 'Итого',
          content:
            '✅ Precision = TP/(TP+FP) — точность положительных предсказаний\n✅ Recall = TP/(TP+FN) — полнота поиска позитивных\n✅ F1 = 2PR/(P+R) — баланс между P и R\n✅ Выбор метрики зависит от стоимости FP vs FN ошибок\n✅ При несбалансированных классах F1 > Accuracy',
        },
      ],
    },
  ],

  'gradient-descent': [
    {
      id: 'gd-sub1',
      title: 'Градиентный спуск',
      steps: [
        {
          id: 'gd-s1',
          type: 'theory',
          title: 'Идея градиентного спуска',
          content:
            'Градиентный спуск — итеративный алгоритм оптимизации для минимизации дифференцируемой функции потерь.\n\nАналогия: представь, что ты в горах с завязанными глазами. Ты можешь нащупать направление уклона под ногами (градиент) и сделать шаг вниз. Повторяя это, ты придёшь в долину (локальный минимум).\n\nОбновление: θ_{t+1} = θ_t - η·∇_θ L(θ_t)\n• θ — параметры модели (веса)\n• η — learning rate (размер шага)\n• ∇_θ L — градиент функции потерь',
        },
        {
          id: 'gd-s2',
          type: 'intuition',
          title: 'Выбор learning rate',
          content:
            'Learning rate η — критический гиперпараметр:\n\nСлишком большой η: колебания, расходимость\n• Представь большой прыжок — перелетаешь через долину\n\nСлишком маленький η: очень медленная сходимость\n• Маленькие шажки — придёшь в минимум, но очень долго\n\nОптимальный η: быстрая сходимость к минимуму\n\nПрактика: начинай с η=0.01 для Adam, η=0.1 для SGD с LR scheduler.',
        },
        {
          id: 'gd-s3',
          type: 'formula',
          title: 'SGD vs Batch GD vs Mini-batch',
          content:
            'Batch GD: ∇L = (1/n)·Σᵢ ∇Lᵢ\n• Один шаг = весь датасет. Точно, медленно.\n\nSGD: ∇L ≈ ∇Lᵢ (один объект)\n• Быстрый, шумный. Хорошо обобщает.\n\nMini-batch: ∇L ≈ (1/B)·Σᵢ∈batch ∇Lᵢ\n• Баланс: скорость + стабильность. B=32-256 типично.',
        },
        {
          id: 'gd-s4',
          type: 'quiz',
          title: 'Квиз по оптимизации',
          quizId: 'quiz-deep-learning',
        },
        {
          id: 'gd-s5',
          type: 'code',
          title: 'Код: Fill-in gradient descent',
          codeTaskId: 'fill-gradient-descent',
        },
        {
          id: 'gd-s6',
          type: 'pitfalls',
          title: 'Типичные ошибки',
          content:
            '1. Забывать zero_grad() в PyTorch — градиенты накапливаются!\n2. Слишком большой LR — loss сразу идёт в NaN.\n3. Не нормализовать данные — разные масштабы признаков = плохое обусловливание.\n4. Использовать SGD без momentum для нейросетей — сходится медленно.\n5. Не использовать LR scheduler — фиксированный LR редко оптимален.',
        },
        {
          id: 'gd-s7',
          type: 'recap',
          title: 'Итого',
          content:
            '✅ GD: θ -= η·∇L (итеративная оптимизация)\n✅ η слишком большой → расходимость; слишком маленький → медленно\n✅ Mini-batch = компромисс скорость/стабильность\n✅ Adam = SGD + momentum + адаптивный LR\n✅ В PyTorch: zero_grad → forward → loss → backward → step',
        },
      ],
    },
  ],

  'gini-impurity': [
    {
      id: 'gi-sub1',
      title: 'Индекс Джини',
      steps: [
        {
          id: 'gi-s1',
          type: 'theory',
          title: 'Что такое Gini Impurity',
          content:
            'Gini Impurity (нечистота Джини) — мера неоднородности узла дерева решений.\n\nФормула: G = 1 - Σ pₖ²\n\nгде pₖ — доля объектов класса k в узле.\n\nСвойства:\n• G = 0: узел чистый (все объекты одного класса)\n• G максимальна при равном распределении классов\n• Для K классов: G_max = 1 - 1/K\n• Для 2 классов: G_max = 0.5 при p₁ = p₂ = 0.5',
        },
        {
          id: 'gi-s2',
          type: 'manual-solution',
          title: 'Ручной расчёт Gini',
          content:
            'Задача: узел содержит 7 объектов класса A и 3 объекта класса B.\n\np_A = 7/10 = 0.7\np_B = 3/10 = 0.3\n\nGini = 1 - (0.7² + 0.3²)\n     = 1 - (0.49 + 0.09)\n     = 1 - 0.58\n     = 0.42\n\nПроверка: 0 ≤ 0.42 ≤ 0.5 ✓ (не превышает максимум для 2 классов)',
        },
        {
          id: 'gi-s3',
          type: 'intuition',
          title: 'Gini vs Entropy',
          content:
            'Gini и Entropy — оба критерия для выбора лучшего разбиения.\n\nGini: быстрее вычисляется (нет логарифма)\nEntropy: чуть более чувствительна к редким классам\n\nОтличие невелико: в большинстве задач дают схожие деревья.\nsklearn Decision Tree использует Gini по умолчанию.',
        },
        {
          id: 'gi-s4',
          type: 'quiz',
          title: 'Квиз по деревьям решений',
          quizId: 'quiz-classical-ml',
        },
        {
          id: 'gi-s5',
          type: 'recap',
          title: 'Итого',
          content:
            '✅ Gini = 1 - Σpₖ² (мера неоднородности)\n✅ G=0: чистый узел; G_max=0.5 для бинарной задачи\n✅ Дерево выбирает разбиение с наименьшим взвешенным Gini потомков\n✅ Альтернатива: Information Gain (энтропия Шеннона)',
        },
      ],
    },
  ],
}
