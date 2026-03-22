import Formula from '../components/Formula'

interface Column {
  label: string
  width?: string
}

interface Row {
  header: string
  values: (string | { math: string })[]
  isHeader?: boolean
}

interface ComparisonTable {
  id: string
  title: string
  icon: string
  description: string
  color: string
  columns: Column[]
  rows: Row[]
}

const tables: ComparisonTable[] = [
  {
    id: 'ensemble',
    title: 'Bagging vs Boosting vs Stacking',
    icon: '🌳',
    color: 'green',
    description: 'Три стратегии построения ансамблевых моделей. Понимание различий — обязательный вопрос на собеседовании.',
    columns: [
      { label: 'Критерий' },
      { label: 'Bagging' },
      { label: 'Boosting' },
      { label: 'Stacking' },
    ],
    rows: [
      { header: 'Идея', values: ['Параллельное обучение на бутстрап-выборках, усреднение', 'Последовательное обучение: каждый исправляет ошибки предыдущего', 'Мета-модель обучается на предсказаниях базовых моделей'] },
      { header: 'Примеры', values: ['Random Forest', 'AdaBoost, XGBoost, LightGBM, CatBoost', 'Любые комбинации + meta-learner (Ridge, LogReg)'] },
      { header: 'Параллельность', values: ['✅ Полностью параллельно', '❌ Строго последовательно', '⚠️ Базовые модели параллельно, мета-обучение последовательно'] },
      { header: 'Снижает', values: ['Дисперсию (Variance)', 'Смещение (Bias)', 'Оба, зависит от мета-модели'] },
      { header: 'Переобучение', values: ['Устойчив', 'Склонен (нужна регуляризация)', 'Возможно при нет CV-стекинге'] },
      { header: 'Гиперпарам.', values: ['n_estimators, max_features', 'n_estimators, LR, глубина', 'Гиперпарам. каждой базовой модели'] },
    ],
  },
  {
    id: 'regularization',
    title: 'L1 vs L2 Regularization',
    icon: '📏',
    color: 'blue',
    description: 'Два стандартных метода регуляризации. Ключевые отличия в геометрии, спарсивности и байесовской интерпретации.',
    columns: [
      { label: 'Критерий' },
      { label: 'L1 (Lasso)' },
      { label: 'L2 (Ridge)' },
    ],
    rows: [
      { header: 'Штраф', values: [{ math: '\\lambda\\|\\mathbf{w}\\|_1 = \\lambda\\sum|w_j|' }, { math: '\\lambda\\|\\mathbf{w}\\|_2^2 = \\lambda\\sum w_j^2' }] },
      { header: 'Геометрия', values: ['Ромб (L1-шар) в пространстве весов — углы на осях', 'Сфера (L2-шар) — касание непрерывно по всей поверхности'] },
      { header: 'Спарсивность', values: ['✅ Да, веса точно обнуляются', '❌ Нет, веса стремятся к 0, но не обнуляются'] },
      { header: 'Отбор признаков', values: ['✅ Встроен (0-веса = не нужны)', '❌ Не выполняет отбор'] },
      { header: 'Дифференцируемость', values: ['❌ Недифференцируема в 0 (subgradient)', '✅ Всюду дифференцируема'] },
      { header: 'Байесовская интерпретация', values: ['Лапласов априорный (p ∝ exp(-λ|w|))', 'Гауссов априорный (p ∝ exp(-λw²))'] },
      { header: 'Корреляция признаков', values: ['Выбирает один из группы коррелированных', 'Сжимает все коррелированные равномерно'] },
    ],
  },
  {
    id: 'normalization',
    title: 'Batch Norm vs Layer Norm vs Instance Norm',
    icon: '⚖️',
    color: 'purple',
    description: 'Три варианта нормализации активаций. Выбор зависит от архитектуры и размера батча.',
    columns: [
      { label: 'Критерий' },
      { label: 'Batch Norm' },
      { label: 'Layer Norm' },
      { label: 'Instance Norm' },
    ],
    rows: [
      { header: 'Оси норм.', values: ['По батчу и пространству (N, H, W)', 'По каналам/признакам (C, H, W)', 'По пространству (H, W) для каждого примера отдельно'] },
      { header: 'Применение', values: ['CNN, MLP (ResNet, VGG)', 'Transformer, RNN, NLP', 'Перенос стиля (Style Transfer), GAN'] },
      { header: 'Зависит от батча', values: ['✅ Да — нестабильна при batch=1', '❌ Нет — работает при любом batch', '❌ Нет — работает при любом batch'] },
      { header: 'Параметры γ,β', values: ['По каналу (C параметров)', 'По каналу/признаку', 'По каналу'] },
      { header: 'Инференс', values: ['Использует running mean/var', 'Вычисляется на лету', 'Вычисляется на лету'] },
    ],
  },
  {
    id: 'optimizers',
    title: 'SGD vs Adam vs RMSprop',
    icon: '⚙️',
    color: 'orange',
    description: 'Популярные оптимизаторы. На собеседованиях часто спрашивают формулы обновления и отличия.',
    columns: [
      { label: 'Критерий' },
      { label: 'SGD (+ Momentum)' },
      { label: 'Adam' },
      { label: 'RMSprop' },
    ],
    rows: [
      { header: 'Обновление', values: [{ math: '\\theta -= \\eta g_t' }, { math: '\\theta -= \\frac{\\eta}{\\sqrt{\\hat{v}_t}+\\varepsilon}\\hat{m}_t' }, { math: '\\theta -= \\frac{\\eta}{\\sqrt{v_t}+\\varepsilon}g_t' }] },
      { header: 'Адаптивный LR', values: ['❌ Один LR для всех', '✅ Индивидуальный для каждого параметра', '✅ Индивидуальный для каждого параметра'] },
      { header: 'Память', values: ['O(1) или O(d) с моментом', 'O(2d) — m и v', 'O(d) — только v'] },
      { header: 'Bias correction', values: ['—', '✅ Есть (÷ 1-βᵗ)', '❌ Нет'] },
      { header: 'Гиперпарам.', values: ['η, μ (momentum)', 'η, β₁, β₂, ε', 'η, ρ (decay), ε'] },
      { header: 'Когда лучше', values: ['Large batch, CV, кастомные LR schedulers', 'Нейросети по умолчанию (быстрый старт)', 'RNN, нестационарные цели'] },
    ],
  },
  {
    id: 'architectures',
    title: 'CNN vs RNN vs Transformer',
    icon: '🧠',
    color: 'indigo',
    description: 'Три ключевые нейросетевые архитектуры. Понимание их сильных сторон и ограничений необходимо для Deep Learning-интервью.',
    columns: [
      { label: 'Критерий' },
      { label: 'CNN' },
      { label: 'RNN / LSTM' },
      { label: 'Transformer' },
    ],
    rows: [
      { header: 'Архитектура', values: ['Свёрточные слои + пулинг', 'Рекуррентные связи, hidden state', 'Self-Attention + Feed-Forward, без рекуррентности'] },
      { header: 'Тип данных', values: ['Изображения, 2D/3D данные, аудио спектрограммы', 'Последовательности (текст, временные ряды)', 'Текст, изображения (ViT), аудио, мультимодальность'] },
      { header: 'Параллельность', values: ['✅ Полностью параллельна', '❌ Последовательная (шаг за шагом)', '✅ Полностью параллельна'] },
      { header: 'Дальний контекст', values: ['❌ Ограничен receptive field', '⚠️ Затухающий градиент для длинных', '✅ Глобальный (любые позиции)'] },
      { header: 'Сложность', values: ['O(k·n·d²) по длине', 'O(n·d²) последовательно', 'O(n²·d) по длине, O(n·d) параллельно'] },
      { header: 'Примеры', values: ['ResNet, VGG, EfficientNet', 'LSTM, GRU, seq2seq', 'BERT, GPT-4, T5, ViT, Whisper'] },
    ],
  },
  {
    id: 'boosting',
    title: 'XGBoost vs LightGBM vs CatBoost',
    icon: '🚀',
    color: 'red',
    description: 'Три ведущих реализации градиентного бустинга. Детали реализации важны для работы с табличными данными.',
    columns: [
      { label: 'Критерий' },
      { label: 'XGBoost' },
      { label: 'LightGBM' },
      { label: 'CatBoost' },
    ],
    rows: [
      { header: 'Стратегия дерева', values: ['Level-wise (по уровням), симметричное', 'Leaf-wise (лучший лист) — глубже, асимметрично', 'Oblivious trees (симметричные) — идентичные условия на уровне'] },
      { header: 'Скорость', values: ['⚡ Быстрый', '⚡⚡ Очень быстрый (гистограммы)', '⚡ Сравним с XGBoost'] },
      { header: 'Категориальные', values: ['❌ Нужен preprocessing', '⚠️ Есть поддержка, но ограничена', '✅ Встроенная обработка (ordered target encoding)'] },
      { header: 'Память', values: ['Умеренная', '✅ Меньше (гистограммное приближение)', 'Умеренная'] },
      { header: 'Регуляризация', values: ['α (L1), λ (L2), gamma, min_child_weight', 'reg_alpha, reg_lambda, min_gain_to_split', 'l2_leaf_reg, depth ограничение деревьев'] },
      { header: 'Переобучение', values: ['Хорошо управляется параметрами', 'Склонен при leaf-wise без лимита', '✅ Встроенная защита через ordered boosting'] },
    ],
  },
  {
    id: 'rf-vs-gb',
    title: 'RandomForest vs GradientBoosting',
    icon: '🌲',
    color: 'teal',
    description: 'Два ключевых ансамблевых метода на деревьях: разные стратегии обучения, смещение/дисперсия и применимость.',
    columns: [
      { label: 'Критерий' },
      { label: 'RandomForest' },
      { label: 'GradientBoosting' },
    ],
    rows: [
      { header: 'Базовые деревья', values: ['Глубокие независимые деревья (low bias, high variance)', 'Мелкие деревья-«пни» (high bias, low variance)'] },
      { header: 'Стратегия', values: ['Параллельное бутстрап-обучение, усреднение', 'Последовательное исправление ошибок'] },
      { header: 'Bias/Variance', values: ['Снижает дисперсию (Variance)', 'Снижает смещение (Bias)'] },
      { header: 'Скорость', values: ['Быстрее (параллелизм)', 'Медленнее (последовательно)'] },
      { header: 'Переобучение', values: ['Устойчив к переобучению', 'Склонен без регуляризации'] },
      { header: 'Ключевые гиперпараметры', values: ['n_estimators, max_features, max_depth', 'n_estimators, learning_rate, max_depth'] },
      { header: 'Когда использовать', values: ['Быстрый бейзлайн, устойчивость важна', 'Нужна максимальная точность на табличных данных'] },
    ],
  },
  {
    id: 'l1-l2-elasticnet',
    title: 'L1 vs L2 vs ElasticNet Regularization',
    icon: '📐',
    color: 'blue',
    description: 'Три подхода к регуляризации линейных моделей с разными свойствами спарсивности и геометрии.',
    columns: [
      { label: 'Критерий' },
      { label: 'L1 (Lasso)' },
      { label: 'L2 (Ridge)' },
      { label: 'ElasticNet' },
    ],
    rows: [
      { header: 'Штраф', values: [{ math: '\\lambda\\sum|w_j|' }, { math: '\\lambda\\sum w_j^2' }, { math: '\\lambda_1\\sum|w_j|+\\lambda_2\\sum w_j^2' }] },
      { header: 'Спарсивность', values: ['✅ Точно обнуляет', '❌ Не обнуляет', '⚠️ Частично'] },
      { header: 'Дифференцируемость', values: ['❌ Не дифф. в 0', '✅ Всюду', '❌ Не дифф. в 0'] },
      { header: 'Отбор признаков', values: ['✅ Встроен', '❌ Нет', '⚠️ Частично'] },
      { header: 'Коррелированные признаки', values: ['Выбирает один', 'Усредняет все', 'Группирует'] },
      { header: 'Байесовская интерпретация', values: ['Лапласов априорный', 'Гауссов априорный', 'Смешанный'] },
      { header: 'Когда использовать', values: ['Нужна разрежённость', 'Много коррелированных', 'Промежуточный случай'] },
    ],
  },
  {
    id: 'rnn-lstm-gru',
    title: 'RNN vs LSTM vs GRU',
    icon: '🔄',
    color: 'purple',
    description: 'Эволюция рекуррентных архитектур: от базовой RNN к LSTM и GRU с решением проблемы затухающего градиента.',
    columns: [
      { label: 'Критерий' },
      { label: 'RNN' },
      { label: 'LSTM' },
      { label: 'GRU' },
    ],
    rows: [
      { header: 'Ворота (Gates)', values: ['Нет', '3: Input, Forget, Output', '2: Reset, Update'] },
      { header: 'Cell State', values: ['❌ Нет', '✅ Отдельный', '❌ Объединён с hidden'] },
      { header: 'Затухающий градиент', values: ['❌ Сильно страдает', '✅ Решено', '✅ Решено'] },
      { header: 'Кол-во параметров', values: ['Минимум', 'Максимум', 'Меньше LSTM'] },
      { header: 'Скорость обучения', values: ['Быстрее', 'Медленнее', 'Быстрее LSTM'] },
      { header: 'Случаи применения', values: ['Короткие последовательности', 'Долгосрочные зависимости', 'Компромисс скорость/качество'] },
      { header: 'Сложность', values: ['Простейшая', 'Высокая', 'Средняя'] },
    ],
  },
  {
    id: 'sklearn-pytorch',
    title: 'scikit-learn vs PyTorch',
    icon: '⚙️',
    color: 'orange',
    description: 'Когда использовать классический sklearn, а когда переходить на PyTorch — ключевые сценарии.',
    columns: [
      { label: 'Критерий' },
      { label: 'scikit-learn' },
      { label: 'PyTorch' },
    ],
    rows: [
      { header: 'Основной сценарий', values: ['Классический ML на табличных данных', 'Нейросети, DL задачи'] },
      { header: 'Тип данных', values: ['Табличные, text (TF-IDF), небольшие', 'Изображения, текст (embeddings), аудио'] },
      { header: 'Автодифференцирование', values: ['❌ Нет', '✅ Autograd'] },
      { header: 'GPU поддержка', values: ['❌ Нет (CPU only)', '✅ CUDA/MPS'] },
      { header: 'Деплоймент', values: ['joblib/pickle', 'TorchScript/ONNX'] },
      { header: 'Отладка', values: ['Простая (Python)', 'Средняя (графы, tensor shapes)'] },
      { header: 'Экосистема', values: ['Pipeline, GridSearchCV, метрики', 'torchvision, HuggingFace, Lightning'] },
      { header: 'Когда выбрать', values: ['Бейзлайн, небольшие данные', 'Сложные архитектуры, большие данные'] },
    ],
  },
  {
    id: 'predict-methods',
    title: 'predict vs predict_proba vs decision_function',
    icon: '🎯',
    color: 'green',
    description: 'Три метода вывода sklearn-классификаторов: выходной тип, диапазон значений и типичное применение.',
    columns: [
      { label: 'Критерий' },
      { label: 'predict' },
      { label: 'predict_proba' },
      { label: 'decision_function' },
    ],
    rows: [
      { header: 'Выходной тип', values: ['Метки классов', 'Вероятности', 'Расстояния/Scores'] },
      { header: 'Диапазон', values: ['Дискретные классы', '[0, 1], сумма = 1', '(-∞, +∞)'] },
      { header: 'Применение', values: ['Финальная классификация', 'Калиброванные вероятности', 'ROC-AUC, ранжирование'] },
      { header: 'Доступность', values: ['Все классификаторы', 'Только вероятностные', 'SVM, LDA и др.'] },
      { header: 'Калибровка', values: ['N/A', 'Требует CalibratedClassifierCV', 'Не калиброваны'] },
      { header: 'Типичный use case', values: ['Финальный ответ', 'Порог, Log Loss', 'ROC-AUC без калибровки'] },
    ],
  },
  {
    id: 'norm-variants',
    title: 'BatchNorm vs LayerNorm vs InstanceNorm vs GroupNorm',
    icon: '⚖️',
    color: 'pink',
    description: 'Четыре варианта нормализации активаций: по каким осям нормализуют, зависимость от батча, область применения.',
    columns: [
      { label: 'Критерий' },
      { label: 'BatchNorm' },
      { label: 'LayerNorm' },
      { label: 'InstanceNorm' },
      { label: 'GroupNorm' },
    ],
    rows: [
      { header: 'Оси нормализации', values: ['Батч + пространство (N, H, W)', 'Каналы/признаки (C)', 'Пространство (H, W)', 'Группы каналов (C/G)'] },
      { header: 'Зависимость от батча', values: ['✅ Да', '❌ Нет', '❌ Нет', '❌ Нет'] },
      { header: 'Применение', values: ['CNN (ResNet, VGG)', 'Transformer, RNN', 'Style Transfer, GAN', 'Малые батчи, видео'] },
      { header: 'Параметры γ,β', values: ['По каналу', 'По признаку', 'По каналу', 'По каналу/группе'] },
      { header: 'При инференсе', values: ['Running mean/var', 'Вычисляется на лету', 'Вычисляется на лету', 'Вычисляется на лету'] },
      { header: 'Плюсы', values: ['Ускоряет сходимость', 'Не зависит от батча', 'Стиль на уровне экземпляра', 'Компромисс BN/LN'] },
      { header: 'Минусы', values: ['Плохо при малом батче', 'Хуже для CNN', 'Не подходит классификации', 'Нужно подобрать G'] },
    ],
  },
]

const colorHeader: Record<string, string> = {
  green: 'bg-green-600',
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-500',
  indigo: 'bg-indigo-600',
  red: 'bg-red-600',
  teal: 'bg-teal-600',
  pink: 'bg-pink-600',
  sky: 'bg-sky-600',
}

const colorBorder: Record<string, string> = {
  green: 'border-green-200',
  blue: 'border-blue-200',
  purple: 'border-purple-200',
  orange: 'border-orange-200',
  indigo: 'border-indigo-200',
  red: 'border-red-200',
  teal: 'border-teal-200',
  pink: 'border-pink-200',
  sky: 'border-sky-200',
}

const colorRow: Record<string, string> = {
  green: 'bg-green-50',
  blue: 'bg-blue-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  indigo: 'bg-indigo-50',
  red: 'bg-red-50',
  teal: 'bg-teal-50',
  pink: 'bg-pink-50',
  sky: 'bg-sky-50',
}

export default function ComparisonPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚖️ Сравнительные таблицы</h1>
        <p className="text-gray-600">
          Сравнение ключевых ML-концепций, алгоритмов и архитектур. Используй для систематизации знаний перед собеседованием.
        </p>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-2 mb-10">
        {tables.map(t => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-full transition-colors"
          >
            {t.icon} {t.title}
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {tables.map(table => (
          <section key={table.id} id={table.id} className="scroll-mt-20">
            {/* Header */}
            <div className={`${colorHeader[table.color]} text-white rounded-t-xl px-6 py-4`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{table.icon}</span>
                <div>
                  <h2 className="text-xl font-bold">{table.title}</h2>
                  <p className="text-white text-opacity-80 text-sm mt-0.5 opacity-90">{table.description}</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className={`border-x border-b ${colorBorder[table.color]} rounded-b-xl overflow-x-auto`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {table.columns.map((col, i) => (
                      <th
                        key={i}
                        className={`px-4 py-3 text-left font-semibold text-gray-700 ${i === 0 ? 'w-36 bg-gray-100' : ''}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={`border-b border-gray-100 last:border-0 ${rowIdx % 2 === 0 ? 'bg-white' : colorRow[table.color]}`}>
                      <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 whitespace-nowrap border-r border-gray-100">
                        {row.header}
                      </td>
                      {row.values.map((val, valIdx) => (
                        <td key={valIdx} className="px-4 py-3 text-gray-600 leading-relaxed align-top">
                          {typeof val === 'string' ? (
                            val
                          ) : (
                            <Formula math={val.math} block={false} />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-5 text-center text-sm text-gray-500">
        Для детального изучения каждого алгоритма открой соответствующую тему в разделе{' '}
        <a href="/topics" className="text-blue-600 hover:underline">Все темы</a>.
      </div>
    </div>
  )
}
