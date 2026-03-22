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
]

const colorHeader: Record<string, string> = {
  green: 'bg-green-600',
  blue: 'bg-blue-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-500',
  indigo: 'bg-indigo-600',
  red: 'bg-red-600',
}

const colorBorder: Record<string, string> = {
  green: 'border-green-200',
  blue: 'border-blue-200',
  purple: 'border-purple-200',
  orange: 'border-orange-200',
  indigo: 'border-indigo-200',
  red: 'border-red-200',
}

const colorRow: Record<string, string> = {
  green: 'bg-green-50',
  blue: 'bg-blue-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  indigo: 'bg-indigo-50',
  red: 'bg-red-50',
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
