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
      caption: 'Что показано: порядок выбора между обучением с учителем и без учителя, а затем между категорией, числом и группами. Как читать: начните с вопроса о готовых ответах. Главный вывод: вид задачи определяется смыслом результата, а не типом столбца.',
      placement: { stepId: 'ml-problem-types-foundations', sectionId: 'ml-purpose' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-data-target': [
    {
      src: '/course-visuals/ml-4-2-dataset-terms.svg',
      alt: 'Учебная таблица клиентов с подписями: строка является объектом, входные столбцы являются признаками, целевой столбец является разметкой, а идентификатор не используется как признак.',
      caption: 'Что показано: роли строки, признаков, целевой переменной и идентификатора в одной таблице. Как читать: синие столбцы образуют X, целевой столбец — y. Главный вывод: X и y описывают разные роли одних и тех же исторических объектов.',
      placement: { stepId: 'ml-foundations-data-target-table', sectionId: 'dataset-table' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-2-leakage.svg',
      alt: 'Временная шкала показывает момент прогноза и горизонт 30 дней; разрешённые признаки расположены до момента прогноза, а будущие сведения и целевой ответ после него отмечены как утечка.',
      caption: 'Что показано: граница доступности сведений в момент прогноза и различие прямой и временной утечки. Как читать: всё справа от границы недоступно модели в реальном решении. Главный вывод: признак допустим только если его значение известно в нужный момент.',
      placement: { stepId: 'ml-foundations-data-target-leakage', sectionId: 'prediction-time' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-model-fit-predict': [
    {
      src: '/course-visuals/ml-4-3-linear-prediction.svg',
      alt: 'Точки обучения, линия линейной регрессии и пунктир от нового объекта к числовому прогнозу; рядом показано разбиение 80 процентов train и 20 процентов test.',
      caption: 'Что показано: обучение прямой на train и применение найденных коэффициентов к новому объекту. Как читать: разбиение выполняется до fit, пунктир показывает predict. Главный вывод: test не участвует в поиске coef_ и intercept_.',
      placement: { stepId: 'ml-foundations-model-fit-predict-model', sectionId: 'fit-predict' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-3-outlier-extrapolation.svg',
      alt: 'Две мини-диаграммы показывают, как выброс поворачивает линию регрессии и как прогноз за пределами обучающего диапазона продолжает прямую без поддержки данными.',
      caption: 'Что показано: влияние выброса и риск экстраполяции. Как читать: сравните линию до и после необычной точки, затем область вне обучающего диапазона. Главный вывод: математически возможный прогноз не обязательно подтверждён данными.',
      placement: { stepId: 'ml-foundations-model-fit-predict-limits', sectionId: 'outlier' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-foundations-baseline-metrics-cycle': [
    {
      src: '/course-visuals/ml-4-4-regression-metrics.svg',
      alt: 'Единый регрессионный пример показывает правильные значения, прогнозы, остатки и из них вычисляет MAE, MSE, RMSE и R квадрат; рядом модель сравнивается с baseline.',
      caption: 'Что показано: четыре регрессионные метрики, рассчитанные по одним остаткам, и честное сравнение с baseline. Как читать: сначала найдите остаток, затем способ его агрегирования. Главный вывод: метрики отвечают на разные вопросы и считаются на одном evaluation set.',
      placement: { stepId: 'ml-foundations-baseline-metrics-cycle-regression', sectionId: 'residual-example' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-4-confusion-imbalance.svg',
      alt: 'Матрица ошибок обозначает TN, FP, FN и TP, а пример с долями классов 99 и 1 процент показывает, почему высокая Accuracy может быть бесполезной.',
      caption: 'Что показано: четыре исхода бинарной классификации и ловушка дисбаланса 99/1. Как читать: строки — правильный класс, столбцы — прогноз. Главный вывод: Precision, Recall и F1 нужны, когда одной Accuracy недостаточно.',
      placement: { stepId: 'ml-foundations-baseline-metrics-cycle-classification', sectionId: 'confusion-matrix' },
      order: 2,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-4-project-cycle.svg',
      alt: 'Цикл ML-проекта идёт от прикладного вопроса через данные, baseline, модель, offline-оценку, решение и мониторинг, после чего возвращается к постановке.',
      caption: 'Что показано: полный цикл от постановки до мониторинга. Как читать: offline-метрика — только один контрольный этап между моделью и решением. Главный вывод: ML-проект заканчивается не обучением, а проверкой последствий и изменений после запуска.',
      placement: { stepId: 'ml-foundations-baseline-metrics-cycle-project', sectionId: 'project-cycle' },
      order: 3,
      provenance: generatedVisual,
    },
  ],
  'ml-validation-strategies': [
    {
      src: '/course-visuals/ml-4-5-split-strategies.svg',
      alt: 'Пять схем сравнивают случайное, стратифицированное, групповое, доменное и временное разбиение; повторные визиты одного пациента остаются в одной части.',
      caption: 'Что показано: пять стратегий разбиения для разных структур данных. Как читать: найдите единицу зависимости — строку, класс, пациента, домен или время. Главный вывод: случайное разбиение корректно только для действительно независимых строк.',
      placement: { stepId: 'ml-validation-strategies-splits', sectionId: 'random-stratified' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-5-cross-validation.svg',
      alt: 'Пять строк K-fold cross-validation показывают перемещение validation fold, а отдельная полоса OOF-прогнозов отмечает, что каждый объект предсказан моделью без этого объекта в train.',
      caption: 'Что показано: один полный цикл K-fold и получение OOF-прогноза для каждого объекта. Как читать: выделенная часть меняется на каждом fold. Главный вывод: CV оценивает процедуру, а финальный test остаётся отдельным.',
      placement: { stepId: 'ml-validation-strategies-cv', sectionId: 'kfold' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-hyperparameter-selection': [
    {
      src: '/course-visuals/ml-4-6-nested-search.svg',
      alt: 'Схема вложенной кросс-валидации отделяет внешний цикл оценки от внутреннего поиска гиперпараметров и показывает однократное открытие test после выбора.',
      caption: 'Что показано: внутренний подбор и внешняя честная оценка в nested CV. Как читать: Grid, Random или adaptive search работают только внутри train внешнего fold. Главный вывод: test открывается один раз после всех решений.',
      placement: { stepId: 'ml-hyperparameter-selection-nested', sectionId: 'nested-cv' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-safe-preprocessing-pipeline': [
    {
      src: '/course-visuals/ml-4-7-pipeline.svg',
      alt: 'Слева показана ошибочная предобработка до разбиения с утечкой, справа безопасная Pipeline с числовой и категориальной ветвями ColumnTransformer, fit только на train и обработкой неизвестных категорий.',
      caption: 'Что показано: опасная и безопасная границы fit для preprocessing. Как читать: справа каждый обучаемый преобразователь входит в Pipeline и видит только train fold. Главный вывод: ColumnTransformer и Pipeline защищают процедуру, если разбиение сделано заранее.',
      placement: { stepId: 'ml-safe-preprocessing-pipeline-code', sectionId: 'full-pipeline' },
      order: 1,
      provenance: generatedVisual,
    },
  ],
  'ml-math-optimization': [
    {
      src: '/course-visuals/ml-4-8-learning-rates.svg',
      alt: 'Три траектории градиентного спуска показывают слишком маленькую, подходящую и слишком большую скорость обучения на поверхности функции потерь.',
      caption: 'Что показано: влияние learning rate на шаг против градиента. Как читать: сравните скорость сходимости и устойчивость трёх траекторий. Главный вывод: слишком большой шаг перескакивает минимум, слишком маленький движется медленно.',
      placement: { stepId: 'ml-math-optimization-foundations', sectionId: 'gradient' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-8-batches-dot-product.svg',
      alt: 'Схема скалярного произведения связывает вектор признаков и коэффициентов с прогнозом, а рядом сравнивает batch, stochastic и mini-batch шаги.',
      caption: 'Что показано: матричная основа линейного прогноза и три режима оценки градиента. Как читать: умножения складываются в один прогноз, размер выделенной группы задаёт режим спуска. Главный вывод: mini-batch меняет способ оптимизации, а не определение функции потерь.',
      placement: { stepId: 'ml-math-optimization-batches', sectionId: 'batch-types' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-probability-reliability': [
    {
      src: '/course-visuals/ml-4-9-threshold-calibration.svg',
      alt: 'Сигмоида преобразует логит в вероятность, шкала порога показывает переход к классу, а calibration plot сравнивает предсказанную вероятность с наблюдаемой частотой.',
      caption: 'Что показано: переход логит → вероятность → решение и отдельная проверка калибровки. Как читать: порог управляет FP/FN, диагональ calibration plot означает совпадение вероятности и частоты. Главный вывод: класс, ранжирование и калибровка — разные свойства.',
      placement: { stepId: 'ml-probability-reliability-probability', sectionId: 'threshold' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-9-bootstrap.svg',
      alt: 'Четыре шага bootstrap показывают выборки с возвращением, распределение метрики и практический 95-процентный интервал между 2,5 и 97,5 процентилями.',
      caption: 'Что показано: практическая bootstrap-оценка интервала метрики. Как читать: каждая повторная выборка даёт одно значение, процентили обрезают края распределения. Главный вывод: интервал описывает неопределённость оценки, а не гарантирует исход отдельного объекта.',
      placement: { stepId: 'ml-probability-reliability-calibration', sectionId: 'bootstrap' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-generalization-regularization': [
    {
      src: '/course-visuals/ml-4-10-complexity-curves.svg',
      alt: 'Train и validation ошибки по сложности модели показывают зоны недообучения, подходящей сложности и переобучения; рядом кривые обучения сравниваются по размеру train.',
      caption: 'Что показано: два способа обнаружить underfitting и overfitting. Как читать: ищите высокий общий уровень ошибок или большой разрыв между train и validation. Главный вывод: лучшая train-метрика сама по себе не означает лучшего обобщения.',
      placement: { stepId: 'ml-generalization-regularization-complexity', sectionId: 'three-regimes' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-10-regularization-coefficients.svg',
      alt: 'Столбцы коэффициентов сравнивают модель без штрафа с L2, где коэффициенты сжаты, и L1, где часть коэффициентов стала нулевой.',
      caption: 'Что показано: типичное действие L2 и L1 на коэффициенты. Как читать: сравните высоты и нулевые столбцы при одинаковом масштабе признаков. Главный вывод: регуляризация ограничивает сложность, но не доказывает причинную важность признаков.',
      placement: { stepId: 'ml-generalization-regularization-penalties', sectionId: 'l2' },
      order: 2,
      provenance: generatedVisual,
    },
  ],
  'ml-interpretability-error-analysis': [
    {
      src: '/course-visuals/ml-4-11-subgroup-metrics.svg',
      alt: 'Общая метрика сравнивается с тремя подгруппами разного размера и с доверительными интервалами, показывая слабое качество и высокую неопределённость в малой группе.',
      caption: 'Что показано: как общая метрика скрывает различия подгрупп. Как читать: сравнивайте значение вместе с n и интервалом. Главный вывод: fairness-аудит нельзя сводить к двум процентам без размера и неопределённости.',
      placement: { stepId: 'ml-interpretability-error-analysis-errors', sectionId: 'subgroups' },
      order: 1,
      provenance: generatedVisual,
    },
    {
      src: '/course-visuals/ml-4-11-interpretability.svg',
      alt: 'Три карточки сравнивают коэффициенты и встроенную важность, permutation importance и PDP с SHAP, а общая предупреждающая плашка говорит, что связь не равна причинности.',
      caption: 'Что показано: вопросы и ограничения основных инструментов интерпретации. Как читать: каждый инструмент объясняет свой аспект модели на выбранных данных. Главный вывод: коэффициенты, permutation importance, PDP и SHAP не доказывают причинный эффект.',
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
