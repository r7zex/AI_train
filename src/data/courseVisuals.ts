import type { FlowTopic } from './aiCurriculumTypes'

export interface CourseVisualPlacement {
  stepId: string
  sectionId?: string
}

export interface CourseVisualProvenance {
  kind: 'generated' | 'curated'
  source: string
}

export interface CourseVisual {
  src: string
  alt: string
  caption: string
  placement: CourseVisualPlacement
  order: number
  provenance: CourseVisualProvenance
}

const generatedVisual: CourseVisualProvenance = {
  kind: 'generated',
  source: 'scripts/generate-block4-revised-visuals.py',
}

const block4Visuals: Record<string, CourseVisual[]> = {
  'ml-problem-types': [
    {
      src: '/course-visuals/ml-4-1-task-map.svg',
      alt: 'Дерево выбора вида задачи: наличие готовых ответов ведёт к обучению с учителем и разделяется на классификацию или регрессию, отсутствие ответов ведёт к кластеризации.',
      caption: 'Начните сверху: есть ли у исторических примеров готовый правильный ответ? Если да, спросите, нужен класс или число; если нет, можно искать похожие группы. Так вид задачи выбирают по нужному результату, а не по типу столбца.',
      placement: { stepId: 'ml-problem-types-foundations', sectionId: 'ml-purpose' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-data-target': [
    {
      src: '/course-visuals/ml-4-2-dataset-terms.svg',
      alt: 'Учебная таблица клиентов с подписями: строка является объектом, входные столбцы являются признаками, целевой столбец является разметкой, а идентификатор не используется как признак.',
      caption: 'Возьмите одну строку: это один клиент в момент решения. Синие столбцы — сведения, которые получает модель, фиолетовый столбец — правильный ответ для обучения, а служебный идентификатор лишь помогает найти запись.',
      placement: { stepId: 'ml-foundations-data-target-table', sectionId: 'dataset-table' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-2-leakage.svg',
      alt: 'Временная шкала показывает момент прогноза и горизонт 30 дней; разрешённые признаки расположены до момента прогноза, а будущие сведения и целевой ответ после него отмечены как утечка.',
      caption: 'Проведите мысленную черту через момент прогноза. Слева находятся сведения, которые уже известны; справа — будущие события и ответ. Если модель увидела правую часть во время обучения, её высокая метрика не показывает честный прогноз.',
      placement: { stepId: 'ml-foundations-data-target-leakage', sectionId: 'prediction-time' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-model-fit-predict': [
    {
      src: '/course-visuals/ml-4-3-linear-prediction.svg',
      alt: 'Точки обучения, линия линейной регрессии и пунктир от нового объекта к числовому прогнозу; рядом показано первое учебное разбиение 80 на 20.',
      caption: 'Читайте три шага справа: разделить данные, обучить модель, получить прогноз. Пунктир на графике ведёт от нового объекта к числу, а тестовая часть не участвует в поиске коэффициентов.',
      placement: { stepId: 'ml-foundations-model-fit-predict-model', sectionId: 'fit-predict' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-3-outlier-extrapolation.svg',
      alt: 'Две мини-диаграммы показывают, как выброс поворачивает линию регрессии и как прогноз за пределами обучающего диапазона продолжает прямую без поддержки данными.',
      caption: 'Слева одна необычная точка заметно поворачивает прямую. Справа линия продолжается туда, где учебных точек уже нет. В обоих случаях формула выдаёт число, но данных для доверия этому числу может быть недостаточно.',
      placement: { stepId: 'ml-foundations-model-fit-predict-limits', sectionId: 'outlier' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-baseline-metrics-cycle': [
    {
      src: '/course-visuals/ml-4-4-regression-metrics.svg',
      alt: 'Единый регрессионный пример показывает правильные значения, прогнозы, остатки и среднюю абсолютную ошибку; рядом модель сравнивается с простым ориентиром.',
      caption: 'Сначала найдите разницу между ответом и прогнозом в каждой строке, затем усредните её модуль. Простая и сложная модели сравниваются на одной тестовой части.',
      placement: { stepId: 'ml-foundations-baseline-metrics-cycle-regression', sectionId: 'residual-example' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-4-confusion-imbalance.svg',
      alt: 'Матрица ошибок обозначает четыре вида решения, а пример с долями классов 99 и 1 процент показывает, почему высокая доля правильных ответов может быть бесполезной.',
      caption: 'Строки — правильный класс, столбцы — прогноз. Ложная тревога и пропуск имеют разный смысл; пример справа показывает модель с 99% правильных ответов, которая не нашла ни одного редкого положительного объекта.',
      placement: { stepId: 'ml-foundations-baseline-metrics-cycle-classification', sectionId: 'confusion-matrix' },
      order: 2,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-4-project-cycle.svg',
      alt: 'Цикл ML-проекта идёт от прикладного вопроса через данные, простой ориентир, модель, проверку, решение и мониторинг, после чего возвращается к постановке.',
      caption: 'Читайте карточки по номерам. Модель — только середина процесса: после запуска нужно проверять данные, качество и последствия, а затем при необходимости возвращаться к вопросу или обучению.',
      placement: { stepId: 'ml-foundations-baseline-metrics-cycle-project', sectionId: 'project-cycle' },
      order: 3,
      provenance: generatedVisual,
    },
  ],
  'ml-validation-strategies': [
    {
      src: '/course-visuals/ml-4-5-split-strategies.svg',
      alt: 'Две схемы сравнивают случайное и стратифицированное разделение независимых строк; во второй схеме доля редкого класса одинакова в обучении и проверке.',
      caption: 'Сначала посмотрите на красные точки. При случайном разделении их доли могут отличаться, а стратификация сохраняет долю класса. Оба варианта подходят только для независимых строк из одного источника.',
      placement: { stepId: 'ml-validation-strategies-splits', sectionId: 'random-stratified' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-5-group-source-time.svg',
      alt: 'Три схемы показывают разбиение по пациенту, по целому источнику данных и по времени от прошлого к будущему.',
      caption: 'Найдите то, что связывает строки: один пациент, один источник или общий порядок времени. Такая единица целиком остаётся по одну сторону границы; именно этого не показывало обычное случайное разделение.',
      placement: { stepId: 'ml-validation-strategies-splits', sectionId: 'group-source-time' },
      order: 2,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-5-cross-validation.svg',
      alt: 'Пять строк кросс-валидации показывают, как проверочная часть по очереди перемещается между пятью частями данных.',
      caption: 'Читайте строки сверху вниз: выделенная проверочная часть каждый раз новая, а остальные четыре служат обучением. Поэтому каждый объект получает прогноз от модели, которая на нём не обучалась.',
      placement: { stepId: 'ml-validation-strategies-cv', sectionId: 'kfold' },
      order: 3,
      provenance: generatedVisual,
    },
  ],
  'ml-hyperparameter-selection': [
    {
      src: '/course-visuals/ml-4-6-parameters-hyperparameters.svg',
      alt: 'Две карточки сравнивают параметр, который модель находит во время обучения, и гиперпараметр, который задаётся до обучения.',
      caption: 'Смотрите, когда появляется число. Если модель нашла его во время обучения (`fit`), это параметр; если человек или поиск задал его до обучения, это гиперпараметр.',
      placement: { stepId: 'ml-hyperparameter-selection-theory', sectionId: 'hyperparameters' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-6-nested-search.svg',
      alt: 'Схема вложенной кросс-валидации отделяет внутренний поиск настроек от внешней оценки и показывает однократное открытие теста.',
      caption: 'Читайте изнутри наружу: внутренний цикл выбирает настройку, внешний проверяет весь способ выбора. Финальный тест остаётся закрытым до конца.',
      placement: { stepId: 'ml-hyperparameter-selection-nested', sectionId: 'nested-cv' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-safe-preprocessing-pipeline': [
    {
      src: '/course-visuals/ml-4-7-pipeline.svg',
      alt: 'Схема безопасного конвейера разделяет числовые и категориальные столбцы, обучает преобразования только на обучающей части и передаёт результат модели.',
      caption: 'Следуйте по стрелкам от таблицы к двум веткам. Все вычисляемые по данным правила находятся внутри `Pipeline` и обучаются только после разбиения; новые категории обрабатываются без аварии.',
      placement: { stepId: 'ml-safe-preprocessing-pipeline-code', sectionId: 'full-pipeline' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-math-optimization': [
    {
      src: '/course-visuals/ml-4-8-batches-dot-product.svg',
      alt: 'Скалярное произведение пошагово умножает два признака на два веса и складывает результаты в одно число 0,4.',
      caption: 'Сначала соедините каждый признак с весом на той же позиции. Затем сложите два произведения: одна строка признаков превращается в один числовой результат модели.',
      placement: { stepId: 'ml-math-optimization-foundations', sectionId: 'vectors-matrix' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-8-learning-rates.svg',
      alt: 'Три траектории градиентного спуска показывают слишком маленькую, подходящую и слишком большую скорость обучения на поверхности функции потерь.',
      caption: 'Сравните длину стрелок в трёх карточках. Слишком маленький шаг движется медленно, подходящий достигает минимума, слишком большой перескакивает его.',
      placement: { stepId: 'ml-math-optimization-foundations', sectionId: 'gradient' },
      order: 2,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-8-batch-types.svg',
      alt: 'Три карточки сравнивают шаг по всей выборке, по одному объекту и по мини-пакету из четырёх объектов.',
      caption: 'Посчитайте цветные точки: 12, 1 и 4. Это число объектов для одного шага оптимизации; смысл функции потерь при этом не меняется.',
      placement: { stepId: 'ml-math-optimization-batches', sectionId: 'batch-types' },
      order: 3,
      provenance: generatedVisual,
    },
  ],
  'ml-probability-reliability': [
    {
      src: '/course-visuals/ml-4-9-probability-basics.svg',
      alt: 'Две группы точек сравнивают базовую частоту 10 из 100 и условную вероятность 8 из 20 среди похожих клиентов.',
      caption: 'Слева событие считается среди всех клиентов, справа — только среди клиентов с известным условием. Вертикальная черта в формуле читается как «при известном условии».',
      placement: { stepId: 'ml-probability-reliability-probability', sectionId: 'base-conditional' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-9-threshold-calibration.svg',
      alt: 'Шкала пяти вероятностей показывает, как пороги 0,5 и 0,8 меняют границу между классами 0 и 1.',
      caption: 'Двигайте границу мысленно вправо: положительных решений становится меньше. Вместе с ложными тревогами могут исчезнуть и нужные срабатывания, поэтому порог выбирают по последствиям.',
      placement: { stepId: 'ml-probability-reliability-probability', sectionId: 'threshold' },
      order: 2,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-9-calibration.svg',
      alt: 'График калибровки сравнивает предсказанную вероятность с наблюдаемой частотой; зелёные точки идут по диагонали, красные кресты отклоняются.',
      caption: 'Пунктир означает идеальное совпадение вероятности и частоты. Зелёные точки близки к нему, красные систематически ниже: такая модель завышает риск.',
      placement: { stepId: 'ml-probability-reliability-calibration', sectionId: 'calibration' },
      order: 3,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-9-bootstrap.svg',
      alt: 'Четыре шага бутстрэпа показывают выборки с возвращением, распределение метрики и практический 95-процентный интервал между 2,5 и 97,5 процентилями.',
      caption: 'Читайте четыре карточки слева направо: повторная выборка даёт одно значение метрики, а множество значений образует распределение. Края распределения задают практический интервал оценки, не прогноз для отдельного объекта.',
      placement: { stepId: 'ml-probability-reliability-calibration', sectionId: 'bootstrap' },
      order: 4,
      provenance: generatedVisual,
    },
  ],
  'ml-generalization-regularization': [
    {
      src: '/course-visuals/ml-4-10-complexity-curves.svg',
      alt: 'Две кривые ошибок по сложности модели показывают зоны недообучения, подходящей сложности и переобучения.',
      caption: 'Синяя ошибка на обучении продолжает уменьшаться, но красная ошибка на проверке после минимума растёт. Правую зону нельзя выбирать только за красивый результат на обучении.',
      placement: { stepId: 'ml-generalization-regularization-complexity', sectionId: 'three-regimes' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-10-learning-curves.svg',
      alt: 'Два графика кривых обучения сравнивают недообучение с близкими плохими кривыми и переобучение с большим разрывом.',
      caption: 'По горизонтали добавляются обучающие объекты. Близкие плохие кривые требуют другой модели или признаков; большой разрыв иногда уменьшается при добавлении данных.',
      placement: { stepId: 'ml-generalization-regularization-complexity', sectionId: 'learning-curves' },
      order: 2,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-10-regularization-coefficients.svg',
      alt: 'Столбцы коэффициентов сравнивают модель без штрафа с L2, где коэффициенты сжаты, и L1, где часть коэффициентов стала нулевой.',
      caption: 'Сравните столбцы слева направо при одинаковом масштабе признаков. L2 обычно уменьшает все коэффициенты, а L1 может сделать некоторые ровно нулевыми. Это ограничивает модель, но не доказывает причинную важность признаков.',
      placement: { stepId: 'ml-generalization-regularization-penalties', sectionId: 'l2' },
      order: 3,
      provenance: generatedVisual,
    },
  ],
  'ml-interpretability-error-analysis': [
    {
      src: '/course-visuals/ml-4-11-subgroup-metrics.svg',
      alt: 'Общая метрика сравнивается с тремя подгруппами разного размера и с доверительными интервалами, показывая слабое качество и высокую неопределённость в малой группе.',
      caption: 'Сравнивайте каждую точку вместе с числом объектов и шириной интервала. Общая метрика скрывает слабую малую группу, поэтому проверку равенства качества нельзя сводить к двум процентам.',
      placement: { stepId: 'ml-interpretability-error-analysis-errors', sectionId: 'subgroups' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-11-interpretability.svg',
      alt: 'Три карточки сравнивают коэффициент, важность через перемешивание и SHAP-объяснение; предупреждение говорит, что связь не равна причинности.',
      caption: 'Каждая карточка отвечает на свой вопрос о поведении модели и сразу показывает ограничение. Ни один из этих инструментов сам по себе не доказывает, что изменение признака вызовет изменение исхода.',
      placement: { stepId: 'ml-interpretability-error-analysis-tools', sectionId: 'coefficients-built-in' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
}

export const extraVisualTopicIds = new Set([
  'matplotlib-basics',
  'matplotlib-lines-scatter',
  'matplotlib-distributions',
  'matplotlib-layout-export',
  'eda-correlation',
  'linear-regression',
  'regularization-l1-l2',
  'logistic-regression',
  'decision-trees',
  'bagging-random-forest',
  'gradient-boosting',
  'support-vector-machines',
  'kmeans-clustering',
])

function plainTopicTitle(title: string) {
  return title.replace(/^\d+\.\d+\s+/, '')
}

function legacyPlacement(topic: FlowTopic, visualIndex: number): CourseVisualPlacement {
  const candidates = topic.steps
    .filter((step) => step.type === 'theory')
    .flatMap((step) => step.sections?.length
      ? step.sections.map((section) => ({ stepId: step.id, sectionId: section.id }))
      : [{ stepId: step.id }])
  return candidates[Math.min(visualIndex, candidates.length - 1)] ?? { stepId: topic.steps[0].id }
}

// Temporary compatibility path for topics outside block 4 until their visual metadata is migrated.
function getLegacyVisuals(topic: FlowTopic): CourseVisual[] {
  const title = plainTopicTitle(topic.title)
  const sources = [`/course-visuals/${topic.id}.png`]
  if (extraVisualTopicIds.has(topic.id)) sources.push(`/course-visuals/${topic.id}-2.png`)

  return sources.map((src, index) => ({
    src,
    alt: index === 0
      ? `Основная предметная иллюстрация темы «${title}» показывает ключевые данные и связь понятий, объясняемую в ближайшем разделе.`
      : `Вторая предметная иллюстрация темы «${title}» показывает следующий пример и его отличие от основной схемы.`,
    caption: index === 0
      ? `Что показано: основная схема темы «${title}». Как читать: сопоставьте подписи рисунка с ближайшим разделом. Главный вывод: рисунок и расположенный рядом текст раскрывают одну и ту же связь.`
      : `Что показано: дополнительный пример темы «${title}». Как читать: сравните его с первым рисунком. Главный вывод: второй пример раскрывает отдельный аспект темы.`,
    placement: legacyPlacement(topic, index),
    order: index + 1,
    provenance: generatedVisual,
  }))
}

export function getCourseVisuals(topic: FlowTopic): CourseVisual[] {
  return [...(block4Visuals[topic.id] ?? getLegacyVisuals(topic))].sort((left, right) => left.order - right.order)
}

export function getCourseVisualsAtPlacement(topic: FlowTopic, stepId: string, sectionId?: string): CourseVisual[] {
  return getCourseVisuals(topic).filter((visual) => (
    visual.placement.stepId === stepId && visual.placement.sectionId === sectionId
  ))
}
