import { useState, useMemo } from 'react'

interface Term {
  term: string
  letter: string
  description: string
  category: string
}

const terms: Term[] = [
  // A
  { term: 'Adam', letter: 'A', category: 'Оптимизация', description: 'Adaptive Moment Estimation — оптимизатор, сочетающий SGD с моментом и RMSprop. Хранит скользящие средние первого (m) и второго (v) моментов градиента. Стандарт для обучения нейросетей.' },
  { term: 'Attention', letter: 'A', category: 'Deep Learning', description: 'Механизм в нейросетях, позволяющий модели взвешенно «смотреть» на разные части входа при генерации каждого токена. Основа архитектуры Transformer. Формула: softmax(QKᵀ/√dₖ)V.' },
  // B
  { term: 'Backpropagation', letter: 'B', category: 'Deep Learning', description: 'Алгоритм обучения нейросетей: вычисляет градиенты функции потерь по параметрам через цепное правило дифференцирования. Работает за один обратный проход по графу вычислений.' },
  { term: 'Batch', letter: 'B', category: 'Обучение', description: 'Подмножество обучающих данных, обрабатываемых за один шаг обновления весов. Размер батча (batch size) влияет на скорость сходимости и качество обобщения.' },
  { term: 'BatchNorm', letter: 'B', category: 'Архитектура', description: 'Batch Normalization — нормализует активации по мини-батчу (μ и σ считаются по батчу). Ускоряет обучение, снижает зависимость от инициализации. Имеет обучаемые γ (масштаб) и β (сдвиг).' },
  { term: 'Bias-Variance Tradeoff', letter: 'B', category: 'Теория', description: 'Ошибка модели раскладывается на Bias² (систематическая ошибка, недообучение) + Variance (чувствительность к данным, переобучение) + Irreducible Noise. Усложнение модели снижает Bias, но повышает Variance.' },
  { term: 'BERT', letter: 'B', category: 'NLP', description: 'Bidirectional Encoder Representations from Transformers (Google, 2018). Предобученная модель-кодировщик на масковом языковом моделировании. Задаёт стандарт transfer learning для NLP-задач.' },
  { term: 'Boosting', letter: 'B', category: 'Ансамбли', description: 'Метаалгоритм построения ансамбля: деревья обучаются последовательно, каждое следующее исправляет ошибки предыдущих. Снижает смещение. Примеры: AdaBoost, Gradient Boosting, XGBoost.' },
  // C
  { term: 'Cross-Entropy', letter: 'C', category: 'Метрики', description: 'Функция потерь для классификации: L = -Σ yᵢ log(ŷᵢ). Измеряет расстояние между истинным распределением и предсказанным. Минимизируется при обучении логистической регрессии и нейросетей.' },
  { term: 'Cross-Validation', letter: 'C', category: 'Методология', description: 'Метод оценки модели: данные разбиваются на k частей (folds), модель обучается на k-1 и тестируется на 1, и так k раз. Даёт устойчивую оценку обобщающей способности.' },
  // D
  { term: 'Dropout', letter: 'D', category: 'Регуляризация', description: 'Регуляризация нейросетей: каждый нейрон обнуляется с вероятностью (1-p) во время обучения. Предотвращает совместную адаптацию нейронов и снижает переобучение. При инференсе все нейроны активны.' },
  // E
  { term: 'Early Stopping', letter: 'E', category: 'Обучение', description: 'Регуляризация через остановку обучения, когда метрика на validation set перестаёт улучшаться. Сохраняется checkpoint с наилучшими весами. Эффективна и не требует изменений в архитектуре.' },
  { term: 'Embedding', letter: 'E', category: 'Представление', description: 'Плотное векторное представление дискретных объектов (слов, категорий, пользователей) в непрерывном пространстве. Близкие по смыслу объекты имеют близкие векторы (Word2Vec, GloVe, BERT embeddings).' },
  { term: 'Epoch', letter: 'E', category: 'Обучение', description: 'Одна полная итерация по всему обучающему датасету. За эпоху модель видит каждый пример ровно один раз. Типичное количество эпох: 10–100+ в зависимости от задачи и размера данных.' },
  // F
  { term: 'Feature Engineering', letter: 'F', category: 'Данные', description: 'Процесс создания, трансформации и отбора признаков для улучшения качества модели. Включает: нормализацию, кодирование категорий, создание полиномиальных признаков, агрегации, временные признаки.' },
  { term: 'Fine-tuning', letter: 'F', category: 'Transfer Learning', description: 'Дообучение предобученной модели на специфическом датасете с малым learning rate. Используется для адаптации BERT, GPT, ResNet к конкретной задаче без обучения с нуля.' },
  // G
  { term: 'Gradient', letter: 'G', category: 'Оптимизация', description: 'Вектор частных производных функции потерь по параметрам модели. Указывает направление наискорейшего возрастания. Шаг в обратном направлении уменьшает потери (gradient descent).' },
  // H
  { term: 'Hyperparameter', letter: 'H', category: 'Методология', description: 'Параметр модели или обучения, не обучаемый из данных, а задаваемый заранее. Примеры: learning rate, глубина дерева, число слоёв, размер батча. Подбирается через CV или Bayesian Optimization.' },
  // K
  { term: 'KL Divergence', letter: 'K', category: 'Теория', description: 'Kullback–Leibler Divergence — мера «расстояния» от распределения Q к P: DKL(P‖Q) = Σ P(x) log(P(x)/Q(x)). Не симметрична. Основа вариационного вывода (VAE).' },
  // L
  { term: 'Learning Rate', letter: 'L', category: 'Оптимизация', description: 'Размер шага при обновлении весов: θ ← θ − η∇L. Слишком большой → расходимость; слишком малый → медленная сходимость. Используются schedulers (warmup, cosine decay, cyclic LR).' },
  // M
  { term: 'Momentum', letter: 'M', category: 'Оптимизация', description: 'Накопленный «импульс» в направлении предыдущих градиентов. Ускоряет сходимость, сглаживает осцилляции. vₜ = μvₜ₋₁ − η∇L, θₜ₊₁ = θₜ + vₜ. Обычно μ = 0.9.' },
  // N
  { term: 'Normalization', letter: 'N', category: 'Данные', description: 'Масштабирование признаков к диапазону [0, 1]: x_norm = (x − min) / (max − min). Чувствительна к выбросам. Отличается от стандартизации (StandardScaler).' },
  // O
  { term: 'One-Hot Encoding', letter: 'O', category: 'Данные', description: 'Кодирование категориального признака с K уникальными значениями в K бинарных столбцов. Не навязывает порядок между категориями. При высокой кардинальности заменяют Embedding или Target Encoding.' },
  { term: 'Overfitting', letter: 'O', category: 'Теория', description: 'Переобучение: модель слишком хорошо запоминает обучающие данные и плохо обобщается на новые. Симптом: низкая train loss, высокая val loss. Лечится: регуляризацией, Dropout, аугментацией, упрощением модели.' },
  // P
  { term: 'Precision & Recall', letter: 'P', category: 'Метрики', description: 'Precision = TP/(TP+FP) — точность положительных предсказаний. Recall = TP/(TP+FN) — полнота: доля найденных позитивов. Между ними есть tradeoff, регулируемый порогом классификации.' },
  // R
  { term: 'Regularization', letter: 'R', category: 'Регуляризация', description: 'Методы снижения переобучения: L1 (Lasso, спарсивность весов), L2 (Ridge, малые веса), Dropout, Early Stopping, Data Augmentation, Batch Normalization. Добавляют штраф к функции потерь.' },
  { term: 'ResNet', letter: 'R', category: 'Архитектура', description: 'Residual Network (He et al., 2015). Добавляет skip connections: y = F(x) + x. Позволяет обучать очень глубокие сети (50–200+ слоёв), решая проблему затухающих градиентов.' },
  // S
  { term: 'Softmax', letter: 'S', category: 'Архитектура', description: 'Функция активации последнего слоя для многоклассовой классификации: softmax(zⱼ) = exp(zⱼ)/Σexp(zₖ). Возвращает вероятностное распределение (сумма = 1).' },
  { term: 'Standardization', letter: 'S', category: 'Данные', description: 'Приведение признака к нулевому среднему и единичной дисперсии: z = (x − μ) / σ. Устойчивее к выбросам, чем нормализация. Стандарт для большинства алгоритмов (SVM, нейросети).' },
  // T
  { term: 'Transfer Learning', letter: 'T', category: 'Transfer Learning', description: 'Использование весов модели, предобученной на большом датасете, для решения новой задачи с малыми данными. Заменяет последние слои и дообучает (fine-tune) на целевой задаче.' },
  { term: 'Transformer', letter: 'T', category: 'Архитектура', description: 'Архитектура (Vaswani et al., 2017) на базе Self-Attention без рекуррентности. Кодировщик и декодировщик из Multi-Head Attention + Feed-Forward слоёв. Основа GPT, BERT, T5, ViT.' },
  // U
  { term: 'Underfitting', letter: 'U', category: 'Теория', description: 'Недообучение: модель слишком проста, чтобы уловить закономерности в данных. Симптом: высокая train loss И высокая val loss. Лечится: усложнением модели, добавлением признаков, большим числом эпох.' },
  // V
  { term: 'Vanishing Gradient', letter: 'V', category: 'Deep Learning', description: 'Проблема в глубоких сетях: градиенты при backpropagation уменьшаются экспоненциально к начальным слоям, делая обучение невозможным. Решения: ReLU, BatchNorm, skip connections, LSTM/GRU.' },
  // W
  { term: 'Weight Initialization', letter: 'W', category: 'Обучение', description: 'Стратегия начальных значений весов. Xavier/Glorot (для tanh/sigmoid): W ~ U[-√(6/(n_in+n_out)), ...]. He initialization (для ReLU): W ~ N(0, √(2/n_in)). Нулевые веса нарушают симметрию и запрещены.' },
]

export default function GlossaryPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return terms
    return terms.filter(
      t =>
        t.term.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    )
  }, [query])

  const grouped = useMemo(() => {
    const map = new Map<string, Term[]>()
    for (const t of filtered) {
      const arr = map.get(t.letter) ?? []
      arr.push(t)
      map.set(t.letter, arr)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const letters = Array.from(new Set(terms.map(t => t.letter))).sort()

  const categoryColors: Record<string, string> = {
    'Теория': 'bg-blue-100 text-blue-700',
    'Deep Learning': 'bg-purple-100 text-purple-700',
    'Оптимизация': 'bg-orange-100 text-orange-700',
    'Архитектура': 'bg-indigo-100 text-indigo-700',
    'Данные': 'bg-teal-100 text-teal-700',
    'Регуляризация': 'bg-red-100 text-red-700',
    'Метрики': 'bg-green-100 text-green-700',
    'Обучение': 'bg-yellow-100 text-yellow-700',
    'Ансамбли': 'bg-pink-100 text-pink-700',
    'Методология': 'bg-cyan-100 text-cyan-700',
    'NLP': 'bg-violet-100 text-violet-700',
    'Transfer Learning': 'bg-emerald-100 text-emerald-700',
    'Представление': 'bg-sky-100 text-sky-700',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📖 Словарь терминов</h1>
        <p className="text-gray-600 mb-5">
          {terms.length} ключевых понятий ML/DL с объяснениями на русском языке.
        </p>

        {/* Search */}
        <div className="relative max-w-lg">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Поиск по термину или описанию..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>
      </div>

      {/* Alphabet nav */}
      {!query && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {letters.map(l => (
            <a
              key={l}
              href={`#letter-${l}`}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-sm font-semibold text-gray-600 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      )}

      {grouped.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Ничего не найдено по запросу «{query}»</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([letter, letterTerms]) => (
            <section key={letter} id={`letter-${letter}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gray-800 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                  {letter}
                </div>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="space-y-3">
                {letterTerms.map(t => (
                  <div key={t.term} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">{t.term}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[t.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {t.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{t.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {query && (
        <div className="mt-4 text-sm text-gray-500">{filtered.length} из {terms.length} терминов</div>
      )}
    </div>
  )
}

interface FormulaEntry {
  name: string
  formula: string
  meaning: string
}

const functionCatalog: Record<string, FormulaEntry[]> = {
  'Термины': [
    { name: 'Precision', formula: 'TP / (TP + FP)', meaning: 'Доля верных позитивных предсказаний.' },
    { name: 'Recall', formula: 'TP / (TP + FN)', meaning: 'Доля найденных позитивных объектов.' },
    { name: 'Gini', formula: '1 - Σ p_k²', meaning: 'Неоднородность узла дерева.' },
  ],
  'Функции потерь (формулы)': [
    { name: 'MSE', formula: '(1/n) * Σ(ŷ - y)²', meaning: 'Квадратичная ошибка регрессии.' },
    { name: 'MAE', formula: '(1/n) * Σ|ŷ - y|', meaning: 'Абсолютная ошибка регрессии.' },
    { name: 'Binary Cross-Entropy', formula: '-[y log p + (1-y) log(1-p)]', meaning: 'Лосс для бинарной классификации.' },
  ],
  'Функции активации (формулы)': [
    { name: 'Sigmoid', formula: '1 / (1 + e^(-x))', meaning: 'Сжимает значение в [0,1].' },
    { name: 'ReLU', formula: 'max(0, x)', meaning: 'Обнуляет отрицательные активации.' },
    { name: 'Softmax', formula: 'exp(z_i) / Σ exp(z_j)', meaning: 'Вероятностное распределение по классам.' },
  ],
  'Оптимизация (формулы)': [
    { name: 'Gradient Descent', formula: 'θ <- θ - η∇L(θ)', meaning: 'Шаг оптимизации против градиента.' },
    { name: 'Adam (идея)', formula: 'm_t, v_t + bias correction', meaning: 'Адаптивный оптимизатор на моментах градиента.' },
  ],
}

export function TermsAndFunctionsPage() {
  const [query, setQuery] = useState('')
  const norm = query.trim().toLowerCase()

  const filtered = useMemo<Record<string, FormulaEntry[]>>(() => {
    if (!norm) return functionCatalog
    return Object.fromEntries(
      Object.entries(functionCatalog)
        .map(([section, items]) => [
          section,
          items.filter(
            (item) =>
              item.name.toLowerCase().includes(norm) ||
              item.formula.toLowerCase().includes(norm) ||
              item.meaning.toLowerCase().includes(norm),
          ),
        ])
        .filter(([, items]) => items.length > 0),
    )
  }, [norm])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Термины и функции</h1>
        <p className="text-gray-600 mb-4">
          Единая страница по блокам: термины, функции потерь, функции активации, оптимизация.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по термину/формуле..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="space-y-6">
        {Object.entries(filtered).map(([section, items]) => (
          <section key={section} className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{section}</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${section}-${item.name}`} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm font-mono text-indigo-700 mt-1">{item.formula}</div>
                  <div className="text-sm text-gray-600 mt-1">{item.meaning}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
