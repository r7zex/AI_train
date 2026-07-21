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
  source: 'scripts/generate-course-visuals.py',
}

const block4Visuals: Record<string, CourseVisual[]> = {
  'ml-foundations-data-target': [
    {
      src: '/course-visuals/ml-foundations-data-target.png',
      alt: 'Таблица из шести синтетических клиентов с подписями ID, GROUP, FEATURE и TARGET разделяется на X формы 6 на 3 и y формы 6.',
      caption: 'Что показано: все шесть строк исходной таблицы и разделение столбцов по ролям. Как читать: ID и GROUP исключаются, три FEATURE образуют X, TARGET образует y. Главный вывод: строки X и y совпадают, а target не входит в признаки.',
      placement: { stepId: 'ml-foundations-data-target-object', sectionId: 'synthetic-client-table' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-foundations-data-target-2.png',
      alt: 'Временная линия синтетического прогноза оттока отделяет три доступных до cutoff признака от target и даты закрытия аккаунта после cutoff.',
      caption: 'Что показано: временная граница между доступными признаками и будущими событиями. Как читать: зелёные блоки слева разрешены к cutoff, красные блоки справа прямо подписаны как запрещённые для X. Главный вывод: архивный столбец допустим только при доступности тем же способом в момент решения.',
      placement: { stepId: 'ml-foundations-data-target-leakage', sectionId: 'cutoff-timeline' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-model-fit-predict': [
    {
      src: '/course-visuals/ml-foundations-model-fit-predict.png',
      alt: 'Две подписанные ветви показывают обучение на X_train и y_train для клиентов C101-C105 и отдельный predict только по X_new клиента C106.',
      caption: 'Что показано: training path изменяет состояние через fit, а inference path получает один y_pred без target. Как читать: верхняя ветвь использует X_train и y_train, нижняя - только X_new и уже fitted model. Главный вывод: y не входит в predict, а обычный прогноз не меняет параметры.',
      placement: { stepId: 'ml-foundations-model-fit-predict-compare', sectionId: 'two-paths' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-foundations-model-fit-predict-2.png',
      alt: 'Панель объекта-оценивателя до fit содержит только стратегию most_frequent, а панель модели после fit содержит классы, доли 2 из 5 и 3 из 5 и правило возвращать нет.',
      caption: 'Что показано: состояние одного объекта-оценивателя до и после обучения на пяти синтетических ответах. Как читать: стрелка fit добавляет classes_, class_prior_ и полученное правило. Главный вывод: гиперпараметр задан заранее, а обученное состояние оценивается по обучающим данным.',
      placement: { stepId: 'ml-foundations-model-fit-predict-model', sectionId: 'state-before-after' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-train-test-baseline-metrics': [
    {
      src: '/course-visuals/ml-foundations-train-test-baseline-metrics.png',
      alt: 'Четыре вертикально объединённые панели показывают роли train 60, validation 20 и test 20, сравнение MAE baseline 4,00 и модели 2,33, regression errors 1, 2, 4 и confusion matrix TN 72, FP 18, FN 2, TP 8 со шкалой порога.',
      caption: 'Что показано: четыре обязательных visual concepts темы - роли 60/20/20, baseline-vs-model, единый regression example и confusion/threshold. Как читать: панели идут сверху вниз от протокола оценки к числовым ошибкам и классификации; подписи и узоры дублируют цвет. Главный вывод: честное сравнение сохраняет роли данных, общий evaluation set, единые числа и порог, выбранный без test.',
      placement: { stepId: 'ml-foundations-train-test-baseline-metrics-split', sectionId: 'roles' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-project-cycle': [
    {
      src: '/course-visuals/ml-foundations-project-cycle.png',
      alt: 'Две вертикально объединённые панели показывают operational problem canvas с семью полями churn-вопроса и gate, затем полный project cycle от вопроса через оценку к monitoring с условной стрелкой возврата.',
      caption: 'Что показано: operational problem canvas с объектом, cutoff, horizon, действием, target, primary metric и baseline, а ниже project cycle with monitoring. Как читать: первая панель проверяет постановку и gate, вторая разделяет offline, decision и business уровни и возвращает monitoring к вопросу. Главный вывод: без label/действия обучение не начинается, а рост F1 сам по себе не доказывает бизнес-эффект.',
      placement: { stepId: 'ml-foundations-project-cycle-churn-case', sectionId: 'case' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-problem-types': [
    {
      src: '/course-visuals/ml-problem-types.png',
      alt: 'Три панели сравнивают числовой прогноз по линии регрессии, разделение точек на два известных класса и поиск двух групп без готовых ответов.',
      caption: 'Что показано: разные формы ответа для регрессии, классификации и кластеризации. Как читать: слева требуется число, в центре - известный класс, справа - структура без целевой метки. Главный вывод: вид задачи определяется требуемым ответом.',
      placement: { stepId: 'ml-problem-types-theory', sectionId: 'answer-first' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-problem-types-2.png',
      alt: 'Новый объект поступает в обученную модель, после чего схема разветвляется на три вида результата: класс, число или кластер.',
      caption: 'Что показано: три возможных формата выхода модели. Как читать: проследите стрелки от нового объекта к одному из ответов. Главный вывод: код обучения выбирают после того, как определён смысл требуемого результата.',
      placement: { stepId: 'ml-problem-types-implementation', sectionId: 'ml-problem-types-implementation-code' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'validation-split': [
    {
      src: '/course-visuals/validation-split.png',
      alt: 'Горизонтальная полоса объектов разделена на большую обучающую, меньшую проверочную и отдельную тестовую части с запретом использовать тест при выборе.',
      caption: 'Что показано: одно фиксированное разбиение на train, validation и test. Как читать: размер сегмента отражает долю объектов, а подписи - роль части. Главный вывод: финальный test остаётся вне подбора.',
      placement: { stepId: 'validation-split-theory', sectionId: 'roles' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/validation-split-2.png',
      alt: 'Пять строк по пять частей показывают, как выделенная проверочная часть последовательно перемещается между группами объектов.',
      caption: 'Что показано: пять последовательных проверок, в которых выделенная часть меняется. Как читать: строка - отдельный запуск, столбец - часть данных. Главный вывод: это повторная схема проверки, а не три результата одного вызова train_test_split.',
      placement: { stepId: 'validation-split-theory', sectionId: 'hundred-example' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'cross-validation-search': [
    {
      src: '/course-visuals/cross-validation-search.png',
      alt: 'Матрица из пяти строк и пяти частей показывает пять итераций кросс-валидации, где проверочная часть каждый раз занимает новый столбец.',
      caption: 'Что показано: полный цикл 5-fold cross-validation. Как читать: в каждой строке четыре части служат обучением, одна - проверкой. Главный вывод: каждая часть ровно один раз оценивает модель.',
      placement: { stepId: 'cross-validation-search-theory', sectionId: 'fold-cycle' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/cross-validation-search-2.png',
      alt: 'Пять столбцов со значениями 0,80, 0,85, 0,90, 0,75 и 0,95 пересекает линия среднего результата 0,85.',
      caption: 'Что показано: пять fold-оценок и их среднее 0,85. Как читать: высота столбца - score отдельного fold, линия - среднее. Главный вывод: одинаковое среднее не отменяет заметный разброс от 0,75 до 0,95.',
      placement: { stepId: 'cross-validation-search-parameters', sectionId: 'cross-validation-search-parameter-table' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'metrics-confusion-matrix': [
    {
      src: '/course-visuals/metrics-confusion-matrix.png',
      alt: 'Матрица ошибок с истинным классом по строкам и прогнозом по столбцам содержит 61 истинно отрицательный, 9 ложноположительных, 6 ложноотрицательных и 24 истинно положительных ответа.',
      caption: 'Что показано: четыре исхода для 100 объектов - TN=61, FP=9, FN=6, TP=24. Как читать: сначала выберите строку истинного класса, затем столбец прогноза. Главный вывод: два типа ошибок считаются отдельно.',
      placement: { stepId: 'metrics-confusion-matrix-theory', sectionId: 'four-outcomes' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/metrics-confusion-matrix-2.png',
      alt: 'Столбчатая диаграмма сравнивает precision 0,73 и recall 0,80, рассчитанные из одной матрицы ошибок.',
      caption: 'Что показано: precision равна 0,73, recall - 0,80. Как читать: высота каждого столбца отвечает на свой вопрос о положительном классе. Главный вывод: одна матрица ошибок даёт разные метрики, поэтому выбирать их нужно по цене ошибки.',
      placement: { stepId: 'metrics-confusion-matrix-theory', sectionId: 'metric-choice' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'class-imbalance-pipeline': [
    {
      src: '/course-visuals/class-imbalance-pipeline.png',
      alt: 'Обобщённая цепочка данных, обучения, прогноза и метрики для темы дисбаланса классов не показывает сами доли классов или границы преобразований.',
      caption: 'Что показано: только общий порядок этапов при работе с дисбалансом. Как читать: слева направо от данных к оценке. Главный вывод: текущая схема фиксирует место обучения и метрики, но не изображает распределение классов или train-only преобразования.',
      placement: { stepId: 'class-imbalance-pipeline-theory', sectionId: 'safe-pipeline' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-math-vectors-gradients': [
    {
      src: '/course-visuals/ml-math-vectors-gradients.png',
      alt: 'Общая четырёхэтапная схема связывает данные, обучение, прогноз и метрику, но не изображает векторы, матрицы или шаг градиента.',
      caption: 'Что показано: места, где математические объекты участвуют в ML-процессе. Как читать: данные входят в обучение, параметры дают прогноз, метрика оценивает результат. Главный вывод: схема задаёт контекст, но не заменяет расчёт Xw или градиента.',
      placement: { stepId: 'ml-math-vectors-gradients-theory', sectionId: 'math-objects' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-probability-loss-bayes': [
    {
      src: '/course-visuals/ml-probability-loss-bayes.png',
      alt: 'Схема данных, обучения, прогноза и метрики показывает место вероятностного прогноза и функции потерь, не отображая распределение или кривую loss.',
      caption: 'Что показано: общий путь вероятностной модели от данных к оценке. Как читать: вероятность появляется на этапе прогноза, а её качество проверяется справа. Главный вывод: текущий рисунок задаёт порядок, но не объясняет форму функции потерь.',
      placement: { stepId: 'ml-probability-loss-bayes-theory', sectionId: 'probability-core' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-overfit-learning-curves': [
    {
      src: '/course-visuals/ml-overfit-learning-curves.png',
      alt: 'Обобщённая последовательность данных, обучения, прогноза и метрики для темы переобучения не содержит train и validation curves.',
      caption: 'Что показано: этапы, между которыми проявляется разрыв обобщения. Как читать: модель учится слева, а качество нового прогноза проверяют справа. Главный вывод: схема обозначает контрольную точку, но не показывает форму learning curve.',
      placement: { stepId: 'ml-overfit-learning-curves-theory', sectionId: 'generalization' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-split-strategy-lab': [
    {
      src: '/course-visuals/ml-split-strategy-lab.png',
      alt: 'Цепочка данных, обучения, прогноза и метрики для разбиений по группам и времени не показывает идентификаторы групп или временную границу.',
      caption: 'Что показано: общий контур оценки после выбора разбиения. Как читать: сначала формируются данные, затем обучается и проверяется модель. Главный вывод: рисунок отмечает порядок, но не кодирует group-aware или temporal split.',
      placement: { stepId: 'ml-split-strategy-lab-theory', sectionId: 'split-roles' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-cross-validation-oof': [
    {
      src: '/course-visuals/ml-cross-validation-oof.png',
      alt: 'Четыре блока данных, обучения, прогноза и метрики задают общий порядок, но не показывают фолды и внефолдовые прогнозы каждого объекта.',
      caption: 'Что показано: место OOF-прогнозов между обучением и итоговой метрикой. Как читать: прогноз должен быть получен моделью, не обучавшейся на этом объекте. Главный вывод: текущая схема задаёт границы этапов, а не матрицу folds.',
      placement: { stepId: 'ml-cross-validation-oof-theory', sectionId: 'cv-system' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-hyperparameter-nested-search': [
    {
      src: '/course-visuals/ml-hyperparameter-nested-search.png',
      alt: 'Общая цепочка данных, обучения, прогноза и метрики для вложенного подбора не различает внутренний и внешний циклы cross-validation.',
      caption: 'Что показано: этапы, внутри которых выполняется выбор параметров и внешняя оценка. Как читать: подбор относится к обучению, итоговая метрика - к независимой проверке. Главный вывод: схема фиксирует разделение ролей, но не рисует nested folds.',
      placement: { stepId: 'ml-hyperparameter-nested-search-theory', sectionId: 'tuning-core' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-preprocessing-feature-selection': [
    {
      src: '/course-visuals/ml-preprocessing-feature-selection.png',
      alt: 'Последовательность данных, обучения, прогноза и метрики показывает общий Pipeline, не раскрывая числовую, категориальную и feature-selection ветви.',
      caption: 'Что показано: место preprocessing и отбора признаков перед моделью. Как читать: все обучаемые преобразования входят в этап обучения до прогноза. Главный вывод: текущая схема обозначает границу Pipeline, но не состав ColumnTransformer.',
      placement: { stepId: 'ml-preprocessing-feature-selection-theory', sectionId: 'pipeline-core' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-uncertainty-calibration-utility': [
    {
      src: '/course-visuals/ml-uncertainty-calibration-utility.png',
      alt: 'Для шести групп показаны точечные оценки примерно от 1,15 до 1,77 и вертикальные интервалы разной ширины, отражающие неодинаковую неопределённость.',
      caption: 'Что показано: точечные оценки и интервалы неопределённости для шести групп. Как читать: точка - оценка, вертикальный отрезок - диапазон неопределённости. Главный вывод: одинаково выглядящие оценки могут иметь разную надёжность.',
      placement: { stepId: 'ml-uncertainty-calibration-utility-theory', sectionId: 'evaluation-dimensions' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-interpretability-error-fairness': [
    {
      src: '/course-visuals/ml-interpretability-error-fairness.png',
      alt: 'Общая схема данных, обучения, прогноза и метрики для анализа ошибок не показывает подгруппы, отдельные ошибки или показатели fairness.',
      caption: 'Что показано: этапы, где собирают данные, получают прогнозы и считают метрики. Как читать: анализ ошибок начинается с сохранённых прогнозов и исходных групп. Главный вывод: текущий рисунок задаёт контекст, но не визуализирует subgroup analysis.',
      placement: { stepId: 'ml-interpretability-error-fairness-theory', sectionId: 'inspection-levels' },
      order: 1,
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
  'ml-problem-types',
  'validation-split',
  'cross-validation-search',
  'metrics-confusion-matrix',
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
