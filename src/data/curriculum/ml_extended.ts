import type { FlowTopic, FormulaCard } from '../aiCurriculumTypes'
import {
  code,
  makeStdinTask,
  practiceStep,
  quizStep,
  section,
  singleQuiz,
  theoryStep,
  theoryStepWithFormulas,
  topicBase,
} from './helpers'

type ParameterRow = [name: string, defaultValue: string, commonValues: string, effect: string]

interface ExtendedTopicSpec {
  id: string
  title: string
  order: number
  blockId: string
  blockTitle: string
  blockIcon: string
  summary: string
  intuition: string
  terminology: string[]
  formulas: FormulaCard[]
  parameterRows: ParameterRow[]
  implementationNotes: string[]
  code: string
  output?: string
  quiz: {
    question: string
    options: Array<{ id: string; text: string }>
    correctAnswer: string
    explanation: string
  }
  practice: {
    title: string
    statement: string
    starterCode: string
    solution: string
    samples: Array<{ id: string; description: string; input: string; expectedOutput: string }>
    hidden: Array<{ id: string; description: string; input: string; expectedOutput: string }>
  }
}

function buildExtendedTopic(spec: ExtendedTopicSpec): FlowTopic {
  const formulaNames = spec.formulas.map((formula) => formula.label).join(', ')
  const parameterSummary = spec.parameterRows.map(([name, defaultValue]) => `${name}=${defaultValue}`).join(', ')

  return topicBase(
    spec.id,
    spec.title,
    spec.order,
    spec.summary,
    spec.blockId,
    spec.blockTitle,
    spec.blockIcon,
    `${spec.blockId}-core`,
    spec.blockTitle,
    spec.intuition,
    spec.terminology,
    spec.formulas.map((formula) => formula.expression),
    [
      `Формулы: ${formulaNames}.`,
      `Параметры по умолчанию: ${parameterSummary}.`,
      'Практический порядок для обучаемой модели: обучение (fit) → прогноз (predict) → оценка качества на отложенных данных.',
    ],
    [
      theoryStepWithFormulas(
        `${spec.id}-theory`,
        'Идея и математика',
        spec.summary,
        [
          section('idea', 'Что решает метод', [
            spec.summary,
            spec.intuition,
            'Перед применением метода сформулируйте тип задачи, доступный в момент прогноза вход и критерий успеха. Формула описывает устройство алгоритма, но не заменяет проверку качества, устойчивости и соответствия исследовательскому вопросу.',
          ]),
          section('workflow', 'Когда применять и как проверять', [
            'Метод проверяют на данных, которые не участвовали в обучении. Для обычных независимых объектов используют train/test и кросс-валидацию; для временных данных сохраняют порядок времени; для группированных объектов не разрывают одну группу между train и validation.',
            'Качество сравнивают с baseline. Если результат нестабилен между фолдами, сначала проверяют утечки, разбиение, признаки и метрику, а уже потом усложняют алгоритм.',
          ]),
        ],
        spec.formulas,
      ),
      theoryStep(
        `${spec.id}-parameters`,
        'Параметры: значения по умолчанию и рабочие диапазоны',
        'Разбираем, какие параметры меняют сложность модели и какие значения обычно проверяют.',
        [
          section('parameters', 'Главные параметры', [
            'Значение «по умолчанию» взято из актуального интерфейса scikit-learn. «Часто проверяют» — не новое значение по умолчанию, а практическая стартовая сетка. Лучшее значение зависит от размера данных, шума, метрики и схемы валидации.',
            'Параметры подбирают только внутри train через кросс-валидацию. Test оставляют для одной финальной оценки, иначе он превращается в часть обучения и оценка становится оптимистичной.',
          ], {
            table: {
              headers: ['Параметр', 'По умолчанию', 'Часто проверяют', 'Что меняет'],
              rows: spec.parameterRows,
            },
          }),
        ],
      ),
      theoryStep(
        `${spec.id}-implementation`,
        'Реализация на Python',
        'Собираем воспроизводимый пример с разбиением, обучением и оценкой.',
        [
          section('implementation', 'Минимальный рабочий шаблон', [
            ...spec.implementationNotes,
            'В реальном проекте фиксируют `random_state`, сохраняют одинаковое разбиение для сравнения моделей и помещают преобразования в `Pipeline`. Это предотвращает утечку статистик validation/test в обучение.',
          ], {
            codeExamples: [code('python', spec.code, spec.output, 'Пример показывает минимальную воспроизводимую реализацию и объясняет, какой результат возвращает метод.')],
          }),
        ],
      ),
      quizStep(
        `${spec.id}-quiz`,
        'Проверка понимания',
        'Один вопрос с немедленной проверкой, как в учебном шаге Stepik.',
        singleQuiz(
          `quiz-${spec.id}`,
          spec.title,
          spec.id,
          spec.blockId,
          spec.quiz.question,
          spec.quiz.options,
          spec.quiz.correctAnswer,
          spec.quiz.explanation,
          'medium',
        ),
      ),
      practiceStep(
        `${spec.id}-practice`,
        'Задача с автоматической проверкой',
        'Решение запускается в Python, сначала на открытых, затем на скрытых тестах.',
        makeStdinTask(
          `task-${spec.id}`,
          spec.practice.title,
          spec.practice.statement,
          spec.practice.starterCode,
          spec.practice.samples,
          spec.practice.hidden,
          spec.practice.solution,
        ),
      ),
    ],
  )
}

const specs: ExtendedTopicSpec[] = [
  {
    id: 'matplotlib-basics',
    title: '3.1 Matplotlib: Figure, Axes и базовые графики',
    order: 1,
    blockId: 'visualization-eda',
    blockTitle: 'Matplotlib и разведочный анализ данных',
    blockIcon: '03',
    summary: 'Matplotlib превращает числовые данные в графики; объектный стиль через `fig, ax = plt.subplots()` даёт явный контроль над областью рисования.',
    intuition: 'Figure — весь холст, Axes — отдельная система координат. Линия показывает динамику, scatter — связь двух чисел, hist — распределение, bar — сравнение категорий.',
    terminology: ['Figure', 'Axes', 'axis', 'plot', 'scatter', 'hist', 'bar', 'legend', 'label'],
    formulas: [
      { label: 'Координаты точки', expression: String.raw`P_i=(x_i,y_i)`, meaning: 'Scatter отображает каждую пару признаков отдельной точкой.', notation: ['x_i — значение по оси X', 'y_i — значение по оси Y'] },
      { label: 'Частота в bin', expression: String.raw`h_j=\sum_{i=1}^{n} I(x_i \in B_j)`, meaning: 'Высота столбца гистограммы равна числу наблюдений в интервале.', notation: ['B_j — j-й интервал', 'I — индикатор условия'] },
    ],
    parameterRows: [
      ['figsize', '`(6.4, 4.8)`', '`(8, 5)`, `(12, 6)`', 'размер Figure в дюймах'],
      ['bins', '`10` в `hist`', '`20`, `30`, `auto`', 'детализацию гистограммы'],
      ['alpha', '`None`', '`0.5`–`0.8`', 'прозрачность перекрывающихся объектов'],
      ['marker', '`None` для линии', '`o`, `.`, `x`', 'вид точек'],
      ['linewidth', 'из стиля', '`1`–`3`', 'толщину линии'],
    ],
    implementationNotes: ['Для нескольких графиков используйте OO-стиль: `fig, axes = plt.subplots(...)`, затем вызывайте методы конкретного `ax`.', 'Всегда подписывайте оси и единицы измерения; легенда нужна только когда на одном Axes несколько серий.'],
    code: `import matplotlib.pyplot as plt
import numpy as np

x = np.arange(1, 6)
y = np.array([2, 5, 4, 8, 9])

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].plot(x, y, marker="o", label="score")
axes[0].set(xlabel="experiment", ylabel="score", title="Dynamics")
axes[0].legend()

axes[1].hist(y, bins=4, edgecolor="black")
axes[1].set(title="Distribution", xlabel="score")
fig.tight_layout()
plt.show()`,
    quiz: {
      question: 'Какой объект Matplotlib представляет отдельную систему координат, на которой вызывают `plot`, `scatter` и `hist`?',
      options: [{ id: 'a', text: '`Axes`' }, { id: 'b', text: '`Figure`' }, { id: 'c', text: '`Series`' }, { id: 'd', text: '`Legend`' }],
      correctAnswer: 'a',
      explanation: '`Figure` — весь холст, а `Axes` — конкретная область с осями и графиком.',
    },
    practice: {
      title: 'Посчитать частоты для гистограммы',
      statement: 'Считайте целые значения и границу `t`. Выведите количество значений меньше `t` и количество значений не меньше `t`.',
      starterCode: `values = list(map(int, input().split()))
t = int(input())
# TODO: посчитайте две частоты
# TODO: подготовьте строку ответа`,
      solution: `values = list(map(int, input().split()))
t = int(input())
left = sum(value < t for value in values)
right = sum(value >= t for value in values)
print(left, right)`,
      samples: [{ id: 's1', description: 'Две группы', input: '1 2 3 4 5\n3', expectedOutput: '2 3' }],
      hidden: [{ id: 'h1', description: 'Все слева', input: '1 1 2\n5', expectedOutput: '3 0' }, { id: 'h2', description: 'Все справа', input: '5 6\n5', expectedOutput: '0 2' }],
    },
  },
  {
    id: 'eda-correlation',
    title: '3.2 EDA, распределения и матрица корреляций',
    order: 2,
    blockId: 'visualization-eda',
    blockTitle: 'Matplotlib и разведочный анализ данных',
    blockIcon: '03',
    summary: 'EDA проверяет форму данных, пропуски, выбросы, распределения, баланс target и связи между признаками до обучения модели.',
    intuition: 'Разведочный анализ — технический осмотр данных: сначала убедиться, что таблица правдоподобна, и только потом строить модель.',
    terminology: ['EDA', 'distribution', 'outlier', 'correlation', 'Pearson', 'Spearman', 'target leakage', 'heatmap'],
    formulas: [
      { label: 'Корреляция Пирсона', expression: String.raw`r_{xy}=\frac{\sum_i(x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum_i(x_i-\bar{x})^2\sum_i(y_i-\bar{y})^2}}`, meaning: 'Измеряет линейную связь двух числовых переменных от -1 до 1.', notation: ['r_xy — коэффициент корреляции', 'bar{x}, bar{y} — средние'] },
      { label: 'Межквартильный размах', expression: String.raw`IQR=Q_3-Q_1`, meaning: 'Часто используется для первичного поиска выбросов.', notation: ['Q_1 — 25-й процентиль', 'Q_3 — 75-й процентиль'] },
    ],
    parameterRows: [
      ['corr(method)', '`pearson`', '`pearson`, `spearman`', 'тип связи: линейная или монотонная ранговая'],
      ['numeric_only', '`False`', '`True` для быстрого числового EDA', 'какие столбцы включить'],
      ['min_periods', '`1`', 'зависит от объёма данных', 'минимум пар наблюдений'],
      ['quantile', '—', '`0.25`, `0.5`, `0.75`', 'границы распределения'],
      ['normalize в value_counts', '`False`', '`True` для долей классов', 'частоты или пропорции'],
    ],
    implementationNotes: ['Проверяйте `shape`, `dtypes`, `isna().sum()`, `describe()` и `value_counts()` до визуализации.', 'Корреляция не доказывает причинность и не видит все нелинейные связи; target и признаки с утечкой анализируют отдельно.'],
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "area": [35, 42, 58, 75, 90],
    "rooms": [1, 1, 2, 3, 4],
    "price": [6.2, 7.1, 10.4, 14.8, 19.0],
})

print(df.describe())
corr = df.corr(numeric_only=True, method="pearson")
print(corr.round(2))

fig, ax = plt.subplots(figsize=(5, 4))
image = ax.imshow(corr, vmin=-1, vmax=1, cmap="coolwarm")
ax.set_xticks(range(len(corr.columns)), corr.columns, rotation=45)
ax.set_yticks(range(len(corr.columns)), corr.columns)
fig.colorbar(image, ax=ax)
fig.tight_layout()`,
    quiz: {
      question: 'Что означает корреляция Пирсона, близкая к нулю?',
      options: [{ id: 'a', text: 'Нет заметной линейной связи; нелинейная связь всё ещё возможна' }, { id: 'b', text: 'Переменные точно независимы' }, { id: 'c', text: 'Один признак вызывает другой' }, { id: 'd', text: 'В данных нет выбросов' }],
      correctAnswer: 'a',
      explanation: 'Пирсон измеряет именно линейную связь. Нулевая корреляция не гарантирует независимость и не исключает нелинейную зависимость.',
    },
    practice: {
      title: 'Посчитать среднее и IQR',
      statement: 'Считайте отсортированный список из четырёх чисел. Выведите среднее и IQR, где `Q1=(x1+x2)/2`, `Q3=(x3+x4)/2`.',
      starterCode: `values = list(map(float, input().split()))
# TODO: вычислите mean, Q1, Q3 и IQR
# TODO: подготовьте вывод`,
      solution: `values = list(map(float, input().split()))
mean = sum(values) / len(values)
q1 = (values[0] + values[1]) / 2
q3 = (values[2] + values[3]) / 2
print(f"{mean:g} {(q3 - q1):g}")`,
      samples: [{ id: 's1', description: 'Ровный ряд', input: '1 2 3 4', expectedOutput: '2.5 2' }],
      hidden: [{ id: 'h1', description: 'Одинаковые значения', input: '5 5 5 5', expectedOutput: '5 0' }, { id: 'h2', description: 'Отрицательные значения', input: '-4 -2 2 4', expectedOutput: '0 6' }],
    },
  },
  {
    id: 'ml-problem-types',
    title: '4.5 Виды задач: классификация, регрессия и кластеризация',
    order: 5,
    blockId: 'ml-foundations',
    blockTitle: 'Основы машинного обучения',
    blockIcon: '04',
    summary: 'Тип целевой переменной (target) определяет постановку: класс — классификация, число — регрессия, отсутствие готового ответа и поиск групп — кластеризация.',
    intuition: 'Один и тот же набор признаков можно использовать для разных задач, но алгоритм, метрика и способ проверки выбираются по тому, какой ответ нужен.',
    terminology: ['supervised learning', 'unsupervised learning', 'classification', 'regression', 'clustering', 'target', 'label'],
    formulas: [
      { label: 'Классификация', expression: String.raw`\hat{y}\in\{1,\ldots,K\}`, meaning: 'Модель выбирает один из K классов.', notation: ['K — число классов', 'hat{y} — предсказанный класс'] },
      { label: 'Регрессия', expression: String.raw`\hat{y}\in\mathbb{R}`, meaning: 'Модель предсказывает вещественное число.', notation: ['mathbb{R} — множество вещественных чисел'] },
      { label: 'Кластеризация', expression: String.raw`c_i\in\{1,\ldots,K\}`, meaning: 'Алгоритм присваивает объекту номер найденной группы без готового target.', notation: ['c_i — кластер объекта i'] },
    ],
    parameterRows: [
      ['целевая переменная (`target`)', 'задаётся данными', 'класс / число / отсутствует', 'тип задачи'],
      ['простая сравнительная модель (`baseline`)', 'нет универсальной', 'частый класс / среднее / случайное правило', 'минимальный ориентир'],
      ['метрика качества (`metric`)', 'нет универсальной', 'F1 / MAE / силуэт', 'критерий качества'],
      ['зерно случайности (`random_state`)', '`None`', '`42` или другое фиксированное целое число', 'воспроизводимость'],
    ],
    implementationNotes: ['Не определяйте задачу только по dtype: целые числа могут быть как классами, так и числовым target.', 'Для кластеризации нет правильных меток по умолчанию, поэтому используют внутренние метрики и предметную интерпретацию групп.'],
    code: `from sklearn.datasets import load_iris, load_diabetes, make_blobs
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.cluster import KMeans

X_cls, y_cls = load_iris(return_X_y=True)
classifier = LogisticRegression(max_iter=1000).fit(X_cls, y_cls)

X_reg, y_reg = load_diabetes(return_X_y=True)
regressor = LinearRegression().fit(X_reg, y_reg)

X_cluster, _ = make_blobs(n_samples=100, centers=3, random_state=42)
clusters = KMeans(n_clusters=3, random_state=42).fit_predict(X_cluster)

print(classifier.predict(X_cls[:1])[0])
print(round(regressor.predict(X_reg[:1])[0], 2))
print(clusters[:5])`,
    quiz: {
      question: 'В таблице нет target, а требуется найти группы похожих клиентов. Как называется задача?',
      options: [{ id: 'a', text: 'Кластеризация' }, { id: 'b', text: 'Регрессия' }, { id: 'c', text: 'Бинарная классификация' }, { id: 'd', text: 'Ранжирование с учителем' }],
      correctAnswer: 'a',
      explanation: 'Кластеризация ищет структуру без размеченной целевой переменной.',
    },
    practice: {
      title: 'Определить тип задачи',
      statement: 'Считайте слово `class`, `number` или `none`. Выведите `classification`, `regression` или `clustering`.',
      starterCode: `target_kind = input().strip()
# TODO: сопоставьте вид target и задачу
# TODO: подготовьте ответ`,
      solution: `target_kind = input().strip()
mapping = {"class": "classification", "number": "regression", "none": "clustering"}
print(mapping[target_kind])`,
      samples: [{ id: 's1', description: 'Категориальный target', input: 'class', expectedOutput: 'classification' }],
      hidden: [{ id: 'h1', description: 'Числовой target', input: 'number', expectedOutput: 'regression' }, { id: 'h2', description: 'Target отсутствует', input: 'none', expectedOutput: 'clustering' }],
    },
  },
  {
    id: 'validation-split',
    title: '4.6 Проверочное разбиение и функция train_test_split',
    order: 6,
    blockId: 'ml-foundations',
    blockTitle: 'Основы машинного обучения',
    blockIcon: '04',
    summary: 'Функция `train_test_split` создаёт отложенную выборку; проверочную часть (validation) используют для выбора решения, а тестовую (test) — для финальной честной оценки.',
    intuition: 'Модель должна сдавать экзамен на примерах, которых не видела. Если подбирать параметры по тестовой части, экзамен превращается в тренировку.',
    terminology: ['train', 'validation', 'test', 'holdout', 'stratify', 'shuffle', 'random_state', 'data leakage'],
    formulas: [
      { label: 'Доли разбиения', expression: String.raw`n=n_{train}+n_{val}+n_{test}`, meaning: 'Все объекты распределяются между независимыми ролями.', notation: ['n_train — обучение', 'n_val — подбор', 'n_test — финальная проверка'] },
      { label: 'Holdout-оценка', expression: String.raw`\hat{Q}=Q(y_{test},f(X_{test}))`, meaning: 'Качество считается на отложенных ответах.', notation: ['Q — выбранная метрика', 'f — обученная модель'] },
    ],
    parameterRows: [
      ['test_size', '`None` → 0.25, если train_size тоже None', '`0.2` или `0.25`', 'долю test'],
      ['train_size', '`None`', 'обычно вычисляется автоматически', 'долю train'],
      ['random_state', '`None`', '`42` или другой фиксированный int', 'повторяемость случайного split'],
      ['shuffle', '`True`', '`False` только когда порядок принципиален', 'перемешивание объектов'],
      ['stratify', '`None`', '`y` для классификации', 'сохранение долей классов'],
    ],
    implementationNotes: ['Для классификации обычно передают `stratify=y`, особенно при редком классе.', 'Временные ряды нельзя случайно перемешивать: обучение должно происходить на прошлом, проверка — на будущем.'],
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = LogisticRegression(max_iter=2000)
model.fit(X_train, y_train)
prediction = model.predict(X_test)
print(round(f1_score(y_test, prediction), 3))`,
    quiz: {
      question: 'Какой аргумент `train_test_split` помогает сохранить долю каждого класса?',
      options: [{ id: 'a', text: '`stratify=y`' }, { id: 'b', text: '`shuffle=False`' }, { id: 'c', text: '`test_size=None`' }, { id: 'd', text: '`train_size=1`' }],
      correctAnswer: 'a',
      explanation: '`stratify=y` формирует части с близкими долями классов.',
    },
    practice: {
      title: 'Посчитать размеры train и test',
      statement: 'Даны `n` и доля test в процентах. Размер test округляется вниз. Выведите размеры train и test.',
      starterCode: `n, test_percent = map(int, input().split())
# TODO: вычислите test_size и train_size
# TODO: подготовьте ответ`,
      solution: `n, test_percent = map(int, input().split())
test_size = n * test_percent // 100
train_size = n - test_size
print(train_size, test_size)`,
      samples: [{ id: 's1', description: 'Разбиение 80/20', input: '100 20', expectedOutput: '80 20' }],
      hidden: [{ id: 'h1', description: 'Неровное деление', input: '43 25', expectedOutput: '33 10' }, { id: 'h2', description: 'Половина', input: '10 50', expectedOutput: '5 5' }],
    },
  },
  {
    id: 'cross-validation-search',
    title: '4.7 Кросс-валидация и поиск настроек',
    order: 7,
    blockId: 'ml-foundations',
    blockTitle: 'Основы машинного обучения',
    blockIcon: '04',
    summary: 'Кросс-валидация несколько раз меняет проверочный блок (validation fold), а полный и случайный поиск (`GridSearchCV`, `RandomizedSearchCV`) сравнивают настройки по средней метрике.',
    intuition: 'Одно разбиение (split) может случайно оказаться лёгким или сложным. Несколько блоков показывают не только среднее качество, но и его устойчивость.',
    terminology: ['KFold', 'StratifiedKFold', 'TimeSeriesSplit', 'cross_validate', 'GridSearchCV', 'RandomizedSearchCV', 'fold', 'scoring'],
    formulas: [
      { label: 'Среднее по CV', expression: String.raw`\bar{Q}=\frac{1}{K}\sum_{k=1}^{K}Q_k`, meaning: 'Средняя метрика по K validation-фолдам.', notation: ['K — число фолдов', 'Q_k — качество на фолде k'] },
      { label: 'Разброс CV', expression: String.raw`s_Q=\sqrt{\frac{1}{K-1}\sum_{k=1}^{K}(Q_k-\bar{Q})^2}`, meaning: 'Показывает нестабильность оценки.', notation: ['s_Q — стандартное отклонение метрики'] },
    ],
    parameterRows: [
      ['cv', '`None` → 5-fold', '`5`, иногда `3` или `10`', 'число/схему фолдов'],
      ['scoring', '`None` → estimator.score', '`f1`, `roc_auc`, `neg_mean_absolute_error`', 'целевую метрику'],
      ['n_jobs', '`None`', '`-1`', 'параллельность'],
      ['n_iter в RandomizedSearchCV', '`10`', '`20`–`100` по бюджету', 'число случайных комбинаций'],
      ['refit', '`True`', '`True`', 'переобучение лучшей модели на всём train'],
    ],
    implementationNotes: ['GridSearchCV перебирает все комбинации сетки; RandomizedSearchCV пробует ограниченное число случайных наборов и лучше подходит для широких пространств.', 'Преобразования данных должны находиться внутри Pipeline, чтобы на каждом фолде обучаться только по train-части фолда.'],
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, GridSearchCV

X, y = load_breast_cancer(return_X_y=True)
pipeline = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))
params = {"logisticregression__C": [0.01, 0.1, 1, 10]}
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

search = GridSearchCV(pipeline, params, scoring="f1", cv=cv, n_jobs=-1)
search.fit(X, y)
print(search.best_params_)
print(round(search.best_score_, 3))`,
    quiz: {
      question: 'Когда RandomizedSearchCV обычно практичнее GridSearchCV?',
      options: [{ id: 'a', text: 'Когда параметров и возможных значений много, а вычислительный бюджет ограничен' }, { id: 'b', text: 'Когда в сетке ровно одна комбинация' }, { id: 'c', text: 'Только для временных рядов' }, { id: 'd', text: 'Когда метрика не нужна' }],
      correctAnswer: 'a',
      explanation: 'RandomizedSearchCV ограничивает число испытаний параметром `n_iter` и не обязан обходить всю декартову сетку.',
    },
    practice: {
      title: 'Среднее и разброс по фолдам',
      statement: 'Считайте метрики фолдов. Выведите среднее и размах `max-min` с двумя знаками.',
      starterCode: `scores = list(map(float, input().split()))
# TODO: вычислите mean и range
# TODO: подготовьте форматированный ответ`,
      solution: `scores = list(map(float, input().split()))
mean = sum(scores) / len(scores)
spread = max(scores) - min(scores)
print(f"{mean:.2f} {spread:.2f}")`,
      samples: [{ id: 's1', description: 'Пять фолдов', input: '0.80 0.85 0.90 0.75 0.95', expectedOutput: '0.85 0.20' }],
      hidden: [{ id: 'h1', description: 'Стабильная модель', input: '0.7 0.7 0.7', expectedOutput: '0.70 0.00' }, { id: 'h2', description: 'Два фолда', input: '0.6 0.8', expectedOutput: '0.70 0.20' }],
    },
  },
  {
    id: 'metrics-confusion-matrix',
    title: '4.8 Метрики и матрица исходов классификации',
    order: 8,
    blockId: 'ml-foundations',
    blockTitle: 'Основы машинного обучения',
    blockIcon: '04',
    summary: 'Матрица ошибок раскладывает бинарные предсказания на TP, TN, FP и FN; из них получают accuracy, precision, recall, specificity и F1.',
    intuition: 'Одна accuracy скрывает цену разных ошибок. В медицине опасен FN, в спам-фильтре может быть особенно неприятен FP.',
    terminology: ['confusion matrix', 'TP', 'TN', 'FP', 'FN', 'accuracy', 'precision', 'recall', 'specificity', 'F1', 'ROC-AUC', 'PR-AUC'],
    formulas: [
      { label: 'Accuracy', expression: String.raw`Accuracy=\frac{TP+TN}{TP+TN+FP+FN}`, meaning: 'Доля всех правильных ответов.', notation: ['TP, TN — правильные исходы', 'FP, FN — ошибки'] },
      { label: 'Precision', expression: String.raw`Precision=\frac{TP}{TP+FP}`, meaning: 'Доля истинных положительных среди предсказанных положительных.', notation: ['FP — ложные срабатывания'] },
      { label: 'Recall', expression: String.raw`Recall=\frac{TP}{TP+FN}`, meaning: 'Доля найденных положительных объектов.', notation: ['FN — пропущенные положительные'] },
      { label: 'F1', expression: String.raw`F_1=2\frac{Precision\cdot Recall}{Precision+Recall}`, meaning: 'Гармоническое среднее precision и recall.', notation: ['F1 высока, только если обе метрики высоки'] },
    ],
    parameterRows: [
      ['average', '`binary` для бинарных функций', '`macro`, `weighted`, `micro`', 'агрегацию по классам'],
      ['pos_label', '`1`', 'важный положительный класс', 'какой класс считать positive'],
      ['zero_division', '`warn`', '`0` или `1` по политике отчёта', 'поведение при нулевом знаменателе'],
      ['normalize в confusion_matrix', '`None`', '`true`, `pred`, `all`', 'счётчики или доли'],
      ['threshold', '`0.5` обычно вне функции метрики', 'подбирают по PR/ROC и цене ошибок', 'компромисс precision/recall'],
    ],
    implementationNotes: ['В `sklearn.metrics.confusion_matrix` строки соответствуют истинным классам, столбцы — предсказанным; для бинарной матрицы используйте `tn, fp, fn, tp = cm.ravel()`.', 'При сильном дисбалансе дополнительно смотрите PR-AUC и метрики важного класса, а не только accuracy.'],
    code: `from sklearn.metrics import (
    confusion_matrix, classification_report,
    accuracy_score, precision_score, recall_score, f1_score,
)

y_true = [0, 0, 0, 1, 1, 1]
y_pred = [0, 0, 1, 1, 0, 1]
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

print({"TN": tn, "FP": fp, "FN": fn, "TP": tp})
print("accuracy", accuracy_score(y_true, y_pred))
print("precision", precision_score(y_true, y_pred))
print("recall", recall_score(y_true, y_pred))
print("f1", f1_score(y_true, y_pred))
print(classification_report(y_true, y_pred))`,
    quiz: {
      question: 'Больной пациент классифицирован как здоровый. Как обозначается этот исход, если «болен» — положительный класс?',
      options: [{ id: 'a', text: 'FN — false negative' }, { id: 'b', text: 'FP — false positive' }, { id: 'c', text: 'TN — true negative' }, { id: 'd', text: 'TP — true positive' }],
      correctAnswer: 'a',
      explanation: 'Реальный класс положительный, но прогноз отрицательный — это false negative.',
    },
    practice: {
      title: 'Посчитать precision, recall и F1',
      statement: 'Считайте `TP FP FN`. Выведите precision, recall и F1 с двумя знаками.',
      starterCode: `tp, fp, fn = map(int, input().split())
# TODO: вычислите precision, recall и f1
# TODO: подготовьте форматированный ответ`,
      solution: `tp, fp, fn = map(int, input().split())
precision = tp / (tp + fp) if tp + fp else 0
recall = tp / (tp + fn) if tp + fn else 0
f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0
print(f"{precision:.2f} {recall:.2f} {f1:.2f}")`,
      samples: [{ id: 's1', description: 'Сбалансированный пример', input: '8 2 2', expectedOutput: '0.80 0.80 0.80' }],
      hidden: [{ id: 'h1', description: 'Нет ложных срабатываний', input: '5 0 5', expectedOutput: '1.00 0.50 0.67' }, { id: 'h2', description: 'Нет положительных прогнозов', input: '0 0 4', expectedOutput: '0.00 0.00 0.00' }],
    },
  },
  {
    id: 'class-imbalance-pipeline',
    title: '4.9 Балансировка классов, масштабирование и Pipeline',
    order: 9,
    blockId: 'ml-foundations',
    blockTitle: 'Основы машинного обучения',
    blockIcon: '04',
    summary: 'При дисбалансе классов используют подходящую метрику, стратификацию, веса классов и resampling только внутри train; преобразования объединяют с моделью в Pipeline.',
    intuition: 'Если положительных объектов 1%, константный прогноз нуля даёт 99% accuracy. Нужно изменить способ оценки и иногда стоимость ошибки, а не радоваться числу.',
    terminology: ['class imbalance', 'class_weight', 'oversampling', 'undersampling', 'SMOTE', 'StandardScaler', 'Pipeline', 'leakage'],
    formulas: [
      { label: 'Сбалансированный вес класса', expression: String.raw`w_c=\frac{n}{K\cdot n_c}`, meaning: 'Редкий класс получает больший вес.', notation: ['n — число объектов', 'K — число классов', 'n_c — объектов класса c'] },
      { label: 'Стандартизация', expression: String.raw`z=\frac{x-\mu_{train}}{\sigma_{train}}`, meaning: 'Среднее и стандартное отклонение оцениваются только на train.', notation: ['mu_train — среднее train', 'sigma_train — std train'] },
    ],
    parameterRows: [
      ['class_weight', '`None`', '`balanced` или словарь весов', 'цену ошибок классов'],
      ['stratify', '`None`', '`y`', 'сохранение долей при split'],
      ['with_mean', '`True`', '`False` для sparse matrices', 'центрирование StandardScaler'],
      ['with_std', '`True`', '`True`', 'масштабирование до единичной дисперсии'],
      ['sampling_strategy', 'зависит от resampler', '`auto`, доля или словарь', 'целевой баланс resampling'],
    ],
    implementationNotes: ['Сначала сделайте split, затем oversampling/SMOTE только на train. Иначе синтетические соседи или копии исходных объектов попадут в validation/test.', '`Pipeline` обучает scaler отдельно внутри каждого CV-фолда и позволяет подбирать параметры через имена вида `model__C`.'],
    code: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X, y = make_classification(
    n_samples=1000, weights=[0.95, 0.05], random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

pipeline = make_pipeline(
    StandardScaler(),
    LogisticRegression(class_weight="balanced", max_iter=1000),
)
scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring="average_precision")
print(scores.mean().round(3))`,
    quiz: {
      question: 'Когда допустимо выполнять oversampling или SMOTE?',
      options: [{ id: 'a', text: 'Только на train-части внутри каждого CV-фолда' }, { id: 'b', text: 'До train/test split на всей таблице' }, { id: 'c', text: 'Только на test' }, { id: 'd', text: 'После расчёта финальной метрики' }],
      correctAnswer: 'a',
      explanation: 'Resampling до разбиения создаёт утечку между train и validation/test.',
    },
    practice: {
      title: 'Посчитать balanced-веса',
      statement: 'Даны количества объектов двух классов `n0 n1`. Выведите веса `n/(2*n0)` и `n/(2*n1)` с двумя знаками.',
      starterCode: `n0, n1 = map(int, input().split())
# TODO: вычислите веса двух классов
# TODO: подготовьте ответ`,
      solution: `n0, n1 = map(int, input().split())
n = n0 + n1
w0 = n / (2 * n0)
w1 = n / (2 * n1)
print(f"{w0:.2f} {w1:.2f}")`,
      samples: [{ id: 's1', description: 'Дисбаланс 90/10', input: '90 10', expectedOutput: '0.56 5.00' }],
      hidden: [{ id: 'h1', description: 'Баланс', input: '50 50', expectedOutput: '1.00 1.00' }, { id: 'h2', description: 'Дисбаланс 3/1', input: '3 1', expectedOutput: '0.67 2.00' }],
    },
  },
  {
    id: 'linear-regression',
    title: '5.1 Линейная регрессия',
    order: 1,
    blockId: 'linear-models',
    blockTitle: 'Линейные модели и регуляризация',
    blockIcon: '05',
    summary: 'Линейная регрессия строит числовой прогноз как сумму вкладов признаков; обычный метод наименьших квадратов подбирает прямую по остаткам обучающих объектов.',
    intuition: 'Коэффициент — изменение прогноза при росте одного признака на единицу при фиксированных остальных; свободный член — прогноз при нулевых признаках.',
    terminology: ['linear regression', 'OLS', 'coefficient', 'intercept', 'residual', 'multicollinearity'],
    formulas: [
      { label: 'Линейный прогноз', expression: String.raw`\hat{y}=w_0+\sum_{j=1}^{p}w_jx_j`, meaning: 'Свободный член и сумма вкладов всех признаков.', notation: ['w_j — коэффициент j-го признака', 'x_j — значение j-го признака', 'w_0 — свободный член (intercept)'] },
      { label: 'Остаток наблюдения', expression: String.raw`e_i=y_i-\hat{y}_i`, meaning: 'Вертикальное расстояние от правильного ответа до прогноза прямой.', notation: ['e_i — остаток', 'y_i — правильный ответ', 'hat y_i — прогноз'] },
      { label: 'Цель метода наименьших квадратов', expression: String.raw`\min_w\sum_{i=1}^{n}e_i^2`, meaning: 'OLS выбирает коэффициенты с наименьшей суммой квадратов остатков на обучающих данных.', notation: ['OLS — обычный метод наименьших квадратов', 'w — набор подбираемых коэффициентов'] },
    ],
    parameterRows: [
      ['fit_intercept', '`True`', '`True`; `False` только при обоснованном нуле', 'наличие свободного члена'],
      ['positive', '`False`', '`True` при требовании неотрицательных коэффициентов', 'знак коэффициентов'],
      ['n_jobs', '`None`', '`-1` полезен только в отдельных многотаргетных случаях', 'параллельность'],
      ['copy_X', '`True`', 'обычно не меняют', 'копирование X'],
    ],
    implementationNotes: ['После `fit` свободный член находится в `intercept_`, а коэффициенты признаков — в `coef_`; сопоставляйте их с названиями столбцов.', 'Сильная линейная связь признаков называется мультиколлинеарностью и делает отдельные коэффициенты нестабильными; это не то же самое, что плохое качество прогноза.'],
    code: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[0.0], [1.0], [2.0]])
y = np.array([5.0, 8.0, 11.0])

model = LinearRegression()
model.fit(X, y)

print("Свободный член:", round(model.intercept_, 1))
print("Коэффициент x:", round(model.coef_[0], 1))
print("Прогноз при x=3:", round(model.predict([[3.0]])[0], 1))`,
    output: `Свободный член: 5.0
Коэффициент x: 3.0
Прогноз при x=3: 14.0`,
    quiz: {
      question: 'Как интерпретируется коэффициент `w_j` линейной регрессии?',
      options: [{ id: 'a', text: 'Изменение прогноза при росте `x_j` на 1 при прочих равных' }, { id: 'b', text: 'Вероятность класса j' }, { id: 'c', text: 'Количество листьев дерева' }, { id: 'd', text: 'Доля test' }],
      correctAnswer: 'a',
      explanation: 'В линейной модели коэффициент задаёт наклон по конкретному признаку при фиксированных остальных признаках.',
    },
    practice: {
      title: 'Сделать линейный прогноз',
      statement: 'Даны `w0 w1 w2 x1 x2`. Выведите `w0 + w1*x1 + w2*x2` с двумя знаками.',
      starterCode: `w0, w1, w2, x1, x2 = map(float, input().split())
# TODO: вычислите линейный прогноз
# TODO: подготовьте ответ`,
      solution: `w0, w1, w2, x1, x2 = map(float, input().split())
prediction = w0 + w1 * x1 + w2 * x2
print(f"{prediction:.2f}")`,
      samples: [{ id: 's1', description: 'Два признака', input: '1 2 3 4 5', expectedOutput: '24.00' }],
      hidden: [{ id: 'h1', description: 'Нулевые веса', input: '7 0 0 4 5', expectedOutput: '7.00' }, { id: 'h2', description: 'Отрицательный коэффициент', input: '0 -2 1 3 4', expectedOutput: '-2.00' }],
    },
  },
  {
    id: 'regularization-l1-l2',
    title: '5.2 L1, L2 и ElasticNet-регуляризация',
    order: 2,
    blockId: 'linear-models',
    blockTitle: 'Линейные модели и регуляризация',
    blockIcon: '05',
    summary: 'L2 плавно уменьшает коэффициенты, L1 может обнулить часть коэффициентов, ElasticNet смешивает оба штрафа.',
    intuition: 'Регуляризация покупает устойчивость ценой небольшого смещения: модели запрещают назначать слишком большие веса без достаточных оснований.',
    terminology: ['Ridge', 'Lasso', 'ElasticNet', 'L1 norm', 'L2 norm', 'alpha', 'l1_ratio', 'sparsity'],
    formulas: [
      { label: 'Ridge (L2)', expression: String.raw`L_{Ridge}=MSE+\alpha\sum_{j=1}^{p}w_j^2`, meaning: 'Квадратичный штраф сжимает веса.', notation: ['alpha — сила регуляризации'] },
      { label: 'Lasso (L1)', expression: String.raw`L_{Lasso}=\frac{1}{2n}\sum_i(y_i-\hat{y}_i)^2+\alpha\sum_j|w_j|`, meaning: 'Абсолютный штраф способен сделать веса ровно нулевыми.', notation: ['|w_j| — модуль коэффициента'] },
      { label: 'ElasticNet', expression: String.raw`L=\frac{1}{2n}\|y-Xw\|_2^2+\alpha\rho\|w\|_1+\frac{\alpha(1-\rho)}{2}\|w\|_2^2`, meaning: 'Смешивает L1 и L2.', notation: ['rho=l1_ratio', 'rho=1 — Lasso'] },
    ],
    parameterRows: [
      ['alpha', '`1.0`', '`1e-4`…`1e3` по лог-сетке', 'силу штрафа'],
      ['l1_ratio в ElasticNet', '`0.5`', '`0.1`, `0.5`, `0.9`, `0.95`, `1.0`', 'долю L1'],
      ['max_iter', '`1000`', '`5000`–`20000` при сложной сходимости', 'лимит итераций'],
      ['tol', '`1e-4`', '`1e-3`…`1e-6`', 'критерий остановки'],
      ['selection', '`cyclic`', '`random` иногда сходится быстрее', 'порядок обновления координат'],
    ],
    implementationNotes: ['Масштабируйте признаки перед L1/L2, иначе одинаковый alpha по-разному штрафует коэффициенты из-за разных единиц измерения.', 'Значения alpha подбирайте по CV; `RidgeCV`, `LassoCV` и `ElasticNetCV` имеют встроенный подбор.'],
    code: `from sklearn.datasets import load_diabetes
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import RidgeCV, LassoCV, ElasticNetCV
from sklearn.model_selection import train_test_split

X, y = load_diabetes(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)
alphas = [0.001, 0.01, 0.1, 1, 10, 100]

ridge = make_pipeline(StandardScaler(), RidgeCV(alphas=alphas)).fit(X_train, y_train)
lasso = make_pipeline(StandardScaler(), LassoCV(alphas=alphas, cv=5, max_iter=10000)).fit(X_train, y_train)
elastic = make_pipeline(StandardScaler(), ElasticNetCV(
    alphas=alphas, l1_ratio=[0.1, 0.5, 0.9], cv=5, max_iter=10000
)).fit(X_train, y_train)

print(ridge[-1].alpha_)
print(lasso[-1].alpha_)
print(elastic[-1].alpha_, elastic[-1].l1_ratio_)`,
    quiz: {
      question: 'Какая регуляризация чаще приводит часть коэффициентов точно к нулю?',
      options: [{ id: 'a', text: 'L1 / Lasso' }, { id: 'b', text: 'L2 / Ridge' }, { id: 'c', text: 'Только стандартизация' }, { id: 'd', text: 'train_test_split' }],
      correctAnswer: 'a',
      explanation: 'Геометрия L1-штрафа способствует разреженным решениям с нулевыми коэффициентами.',
    },
    practice: {
      title: 'Посчитать L1- и L2-штраф',
      statement: 'Считайте коэффициенты. Выведите сумму модулей (L1) и сумму квадратов (L2) с двумя знаками.',
      starterCode: `weights = list(map(float, input().split()))
# TODO: вычислите L1 и L2
# TODO: подготовьте ответ`,
      solution: `weights = list(map(float, input().split()))
l1 = sum(abs(weight) for weight in weights)
l2 = sum(weight ** 2 for weight in weights)
print(f"{l1:.2f} {l2:.2f}")`,
      samples: [{ id: 's1', description: 'Положительные и отрицательные веса', input: '-2 1 3', expectedOutput: '6.00 14.00' }],
      hidden: [{ id: 'h1', description: 'Нули', input: '0 0', expectedOutput: '0.00 0.00' }, { id: 'h2', description: 'Дробные веса', input: '0.5 -0.5', expectedOutput: '1.00 0.50' }],
    },
  },
  {
    id: 'logistic-regression',
    title: '5.3 Логистическая регрессия',
    order: 3,
    blockId: 'linear-models',
    blockTitle: 'Линейные модели и регуляризация',
    blockIcon: '05',
    summary: 'Логистическая регрессия строит линейный logit, переводит его сигмоидой в вероятность и оптимизирует log loss.',
    intuition: 'Граница решения линейна в пространстве признаков, но выход интерпретируется как вероятность класса.',
    terminology: ['logit', 'sigmoid', 'probability', 'log loss', 'decision threshold', 'C', 'solver', 'penalty'],
    formulas: [
      { label: 'Сигмоида', expression: String.raw`p(y=1|x)=\sigma(z)=\frac{1}{1+e^{-z}}`, meaning: 'Переводит любое z в интервал (0,1).', notation: ['z=w^Tx+b — logit'] },
      { label: 'Log loss', expression: String.raw`L=-\frac{1}{n}\sum_i[y_i\log p_i+(1-y_i)\log(1-p_i)]`, meaning: 'Сильно штрафует уверенные неправильные вероятности.', notation: ['p_i — вероятность положительного класса'] },
      { label: 'Связь C и регуляризации', expression: String.raw`C\propto\frac{1}{\lambda}`, meaning: 'Меньше C — сильнее регуляризация.', notation: ['lambda — сила штрафа'] },
    ],
    parameterRows: [
      ['penalty', '`l2`', '`l2`; `l1`/`elasticnet` с `saga`', 'тип регуляризации'],
      ['C', '`1.0`', '`0.001`…`100` по лог-сетке', 'обратную силу регуляризации'],
      ['solver', '`lbfgs`', '`lbfgs`; `liblinear` для малых binary; `saga` для L1/elasticnet', 'алгоритм оптимизации'],
      ['max_iter', '`100`', '`1000`–`5000` при предупреждении о сходимости', 'лимит итераций'],
      ['class_weight', '`None`', '`balanced` при дисбалансе', 'вес классов'],
    ],
    implementationNotes: ['Для линейной модели и SVM числовые признаки обычно масштабируют внутри Pipeline.', 'Порог 0.5 не является обязательным: его выбирают по validation с учётом цены FP и FN, не по test.'],
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, f1_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
model = make_pipeline(
    StandardScaler(),
    LogisticRegression(C=1.0, penalty="l2", max_iter=2000),
)
model.fit(X_train, y_train)
proba = model.predict_proba(X_test)[:, 1]
prediction = (proba >= 0.5).astype(int)
print("ROC-AUC", round(roc_auc_score(y_test, proba), 3))
print("F1", round(f1_score(y_test, prediction), 3))`,
    quiz: {
      question: 'Что происходит с регуляризацией LogisticRegression при уменьшении `C`?',
      options: [{ id: 'a', text: 'Регуляризация усиливается' }, { id: 'b', text: 'Регуляризация исчезает' }, { id: 'c', text: 'Число классов растёт' }, { id: 'd', text: 'Порог автоматически становится 0' }],
      correctAnswer: 'a',
      explanation: '`C` обратно связано с силой регуляризации: меньше C — сильнее штраф коэффициентов.',
    },
    practice: {
      title: 'Сигмоида и решение по порогу',
      statement: 'Даны logit `z` и порог `t`. Выведите вероятность сигмоиды с четырьмя знаками и класс 0/1.',
      starterCode: `import math
z, threshold = map(float, input().split())
# TODO: вычислите sigmoid и класс
# TODO: подготовьте ответ`,
      solution: `import math
z, threshold = map(float, input().split())
probability = 1 / (1 + math.exp(-z))
prediction = int(probability >= threshold)
print(f"{probability:.4f} {prediction}")`,
      samples: [{ id: 's1', description: 'Нулевой logit', input: '0 0.5', expectedOutput: '0.5000 1' }],
      hidden: [{ id: 'h1', description: 'Положительный logit', input: '2 0.8', expectedOutput: '0.8808 1' }, { id: 'h2', description: 'Отрицательный logit', input: '-2 0.2', expectedOutput: '0.1192 0' }],
    },
  },
  {
    id: 'decision-trees',
    title: '6.1 Деревья решений',
    order: 1,
    blockId: 'trees-ensembles',
    blockTitle: 'Деревья, бэггинг и бустинг',
    blockIcon: '06',
    summary: 'Дерево рекурсивно делит пространство признаков условиями, выбирая разбиения по уменьшению impurity или ошибки.',
    intuition: 'Каждый узел задаёт вопрос вида `feature <= threshold`, а лист хранит итоговый класс, вероятность или среднее target.',
    terminology: ['node', 'split', 'threshold', 'leaf', 'depth', 'Gini', 'entropy', 'information gain', 'pruning'],
    formulas: [
      { label: 'Gini impurity', expression: String.raw`Gini=1-\sum_{k=1}^{K}p_k^2`, meaning: 'Равно нулю в чистом узле.', notation: ['p_k — доля класса k в узле'] },
      { label: 'Entropy', expression: String.raw`H=-\sum_{k=1}^{K}p_k\log_2p_k`, meaning: 'Альтернативная мера неоднородности.', notation: ['H=0 в чистом узле'] },
      { label: 'Взвешенная impurity', expression: String.raw`I_{split}=\frac{n_L}{n}I_L+\frac{n_R}{n}I_R`, meaning: 'Лучший split сильнее уменьшает impurity.', notation: ['L, R — дочерние узлы'] },
    ],
    parameterRows: [
      ['criterion', '`gini` для classifier, `squared_error` для regressor', '`gini`, `entropy`, `log_loss`', 'критерий split'],
      ['max_depth', '`None`', '`3`, `5`, `10`, `None`', 'максимальную глубину'],
      ['min_samples_split', '`2`', '`2`, `5`, `10`, `20`', 'минимум объектов для split'],
      ['min_samples_leaf', '`1`', '`1`, `2`, `5`, `10`', 'минимум объектов в листе'],
      ['ccp_alpha', '`0.0`', '`0`, `1e-4`, `1e-3`, `1e-2`', 'cost-complexity pruning'],
    ],
    implementationNotes: ['Одиночное глубокое дерево легко переобучается. Ограничивайте глубину/листья и подбирайте параметры по CV.', 'Деревьям не требуется StandardScaler, но они чувствительны к малым изменениям данных и имеют ступенчатые прогнозы.'],
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.metrics import f1_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
model = DecisionTreeClassifier(
    criterion="gini", max_depth=4, min_samples_leaf=5, random_state=42
)
model.fit(X_train, y_train)
print("F1", round(f1_score(y_test, model.predict(X_test)), 3))
print(export_text(model, max_depth=2))`,
    quiz: {
      question: 'Какой параметр прямо ограничивает число уровней дерева?',
      options: [{ id: 'a', text: '`max_depth`' }, { id: 'b', text: '`learning_rate`' }, { id: 'c', text: '`C`' }, { id: 'd', text: '`n_clusters`' }],
      correctAnswer: 'a',
      explanation: '`max_depth` задаёт максимальную глубину от корня до листа.',
    },
    practice: {
      title: 'Посчитать Gini бинарного узла',
      statement: 'Даны количества классов `a b`. Выведите Gini с четырьмя знаками.',
      starterCode: `a, b = map(int, input().split())
# TODO: найдите доли классов и Gini
# TODO: подготовьте ответ`,
      solution: `a, b = map(int, input().split())
n = a + b
p0 = a / n
p1 = b / n
gini = 1 - p0 ** 2 - p1 ** 2
print(f"{gini:.4f}")`,
      samples: [{ id: 's1', description: 'Равные классы', input: '5 5', expectedOutput: '0.5000' }],
      hidden: [{ id: 'h1', description: 'Чистый узел', input: '8 0', expectedOutput: '0.0000' }, { id: 'h2', description: 'Доля 3/4', input: '3 1', expectedOutput: '0.3750' }],
    },
  },
  {
    id: 'bagging-random-forest',
    title: '6.2 Бэггинг и случайный лес',
    order: 2,
    blockId: 'trees-ensembles',
    blockTitle: 'Деревья, бэггинг и бустинг',
    blockIcon: '06',
    summary: 'Bagging обучает базовые модели параллельно на bootstrap-выборках, а Random Forest дополнительно случайно ограничивает признаки каждого split.',
    intuition: 'Много разнообразных переобученных деревьев при усреднении дают более устойчивый прогноз, чем одно дерево.',
    terminology: ['ensemble', 'bagging', 'bootstrap', 'aggregation', 'Random Forest', 'out-of-bag', 'max_features', 'variance'],
    formulas: [
      { label: 'Усреднение регрессоров', expression: String.raw`\hat{y}(x)=\frac{1}{B}\sum_{b=1}^{B}f_b(x)`, meaning: 'Итог — среднее B базовых прогнозов.', notation: ['B — число моделей'] },
      { label: 'Голосование классификаторов', expression: String.raw`\hat{y}(x)=\operatorname{mode}\{f_1(x),\ldots,f_B(x)\}`, meaning: 'Итоговый класс выбирается голосованием.', notation: ['mode — самый частый класс'] },
    ],
    parameterRows: [
      ['n_estimators', '`10` в Bagging, `100` в RandomForest', '`100`–`500`', 'число базовых моделей'],
      ['max_samples', '`1.0`', '`0.5`, `0.8`, `1.0`', 'долю объектов на модель'],
      ['max_features', '`1.0` в Bagging, `sqrt` в RF classifier', '`sqrt`, `log2`, `0.5`', 'долю признаков'],
      ['bootstrap', '`True`', '`True`', 'выбор с возвращением'],
      ['oob_score', '`False`', '`True` при bootstrap', 'out-of-bag оценку'],
    ],
    implementationNotes: ['Увеличение `n_estimators` обычно стабилизирует качество, но увеличивает время и память; оно реже вызывает переобучение, чем рост глубины отдельного дерева.', 'Для дисбаланса RandomForestClassifier поддерживает `class_weight="balanced"` и `"balanced_subsample"`.'],
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import f1_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
bagging = BaggingClassifier(
    estimator=DecisionTreeClassifier(max_depth=None),
    n_estimators=100, max_samples=0.8, random_state=42, n_jobs=-1,
)
forest = RandomForestClassifier(
    n_estimators=300, max_features="sqrt", min_samples_leaf=2,
    random_state=42, n_jobs=-1,
)
for model in (bagging, forest):
    model.fit(X_train, y_train)
    print(type(model).__name__, round(f1_score(y_test, model.predict(X_test)), 3))`,
    quiz: {
      question: 'Чем Random Forest дополнительно отличается от обычного bagging деревьев?',
      options: [{ id: 'a', text: 'На каждом split рассматривает случайное подмножество признаков' }, { id: 'b', text: 'Обучает деревья только последовательно' }, { id: 'c', text: 'Всегда требует StandardScaler' }, { id: 'd', text: 'Не использует усреднение' }],
      correctAnswer: 'a',
      explanation: 'Случайный выбор признаков уменьшает корреляцию деревьев и повышает пользу усреднения.',
    },
    practice: {
      title: 'Агрегировать прогнозы деревьев',
      statement: 'Считайте прогнозы регрессоров. Выведите их среднее с двумя знаками.',
      starterCode: `predictions = list(map(float, input().split()))
# TODO: агрегируйте прогнозы
# TODO: подготовьте ответ`,
      solution: `predictions = list(map(float, input().split()))
ensemble = sum(predictions) / len(predictions)
print(f"{ensemble:.2f}")`,
      samples: [{ id: 's1', description: 'Три дерева', input: '10 12 14', expectedOutput: '12.00' }],
      hidden: [{ id: 'h1', description: 'Одна модель', input: '7', expectedOutput: '7.00' }, { id: 'h2', description: 'Дробные прогнозы', input: '0.1 0.2 0.3 0.4', expectedOutput: '0.25' }],
    },
  },
  {
    id: 'gradient-boosting',
    title: '6.3 Бустинг: GradientBoosting и HistGradientBoosting',
    order: 3,
    blockId: 'trees-ensembles',
    blockTitle: 'Деревья, бэггинг и бустинг',
    blockIcon: '06',
    summary: 'Бустинг строит модели последовательно: каждое новое слабое дерево исправляет ошибки текущего ансамбля.',
    intuition: 'Bagging усредняет независимые мнения, boosting собирает команду корректоров, где следующий участник видит промахи предыдущих.',
    terminology: ['boosting', 'weak learner', 'residual', 'negative gradient', 'learning_rate', 'n_estimators', 'subsample', 'early stopping'],
    formulas: [
      { label: 'Аддитивная модель', expression: String.raw`F_M(x)=F_0(x)+\eta\sum_{m=1}^{M}h_m(x)`, meaning: 'Прогноз складывается из M слабых моделей.', notation: ['eta — learning_rate', 'h_m — дерево m'] },
      { label: 'Псевдоостаток', expression: String.raw`r_{im}=-\left.\frac{\partial L(y_i,F(x_i))}{\partial F(x_i)}\right|_{F=F_{m-1}}`, meaning: 'Новое дерево приближает отрицательный градиент loss.', notation: ['L — функция потерь'] },
    ],
    parameterRows: [
      ['n_estimators / max_iter', '`100`', '`100`–`1000` вместе с learning_rate', 'число итераций'],
      ['learning_rate', '`0.1`', '`0.01`, `0.03`, `0.05`, `0.1`', 'вклад каждого дерева'],
      ['max_depth', '`3` в GradientBoosting', '`2`–`6`', 'сложность слабого дерева'],
      ['subsample', '`1.0`', '`0.6`–`1.0`', 'долю объектов на итерацию'],
      ['max_leaf_nodes в HistGB', '`31`', '`15`, `31`, `63`', 'сложность дерева'],
    ],
    implementationNotes: ['Меньший learning_rate обычно требует больше деревьев; эти параметры подбирают совместно.', 'HistGradientBoosting быстрее классического GradientBoosting на больших табличных наборах и поддерживает early stopping.'],
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier, HistGradientBoostingClassifier
from sklearn.metrics import roc_auc_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
models = [
    GradientBoostingClassifier(
        n_estimators=200, learning_rate=0.05, max_depth=3, random_state=42
    ),
    HistGradientBoostingClassifier(
        max_iter=200, learning_rate=0.05, max_leaf_nodes=31, random_state=42
    ),
]
for model in models:
    model.fit(X_train, y_train)
    score = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
    print(type(model).__name__, round(score, 3))`,
    quiz: {
      question: 'Какая пара параметров бустинга обычно подбирается совместно?',
      options: [{ id: 'a', text: '`learning_rate` и число деревьев' }, { id: 'b', text: '`test_size` и `pos_label`' }, { id: 'c', text: '`n_clusters` и `kernel`' }, { id: 'd', text: '`fit_intercept` и `bins`' }],
      correctAnswer: 'a',
      explanation: 'Малый шаг уменьшает вклад дерева и обычно компенсируется большим числом итераций.',
    },
    practice: {
      title: 'Сделать один шаг бустинга',
      statement: 'Даны текущий прогноз `f`, прогноз нового дерева `h` и learning rate `eta`. Выведите `f + eta*h` с двумя знаками.',
      starterCode: `f, h, eta = map(float, input().split())
# TODO: выполните аддитивное обновление
# TODO: подготовьте ответ`,
      solution: `f, h, eta = map(float, input().split())
updated = f + eta * h
print(f"{updated:.2f}")`,
      samples: [{ id: 's1', description: 'Шаг 0.1', input: '10 -2 0.1', expectedOutput: '9.80' }],
      hidden: [{ id: 'h1', description: 'Положительная поправка', input: '0 4 0.05', expectedOutput: '0.20' }, { id: 'h2', description: 'Нулевой шаг', input: '3 100 0', expectedOutput: '3.00' }],
    },
  },
  {
    id: 'support-vector-machines',
    title: '7.1 Метод опорных векторов: SVC и SVR',
    order: 1,
    blockId: 'svm-clustering',
    blockTitle: 'Метод опорных векторов и кластеризация',
    blockIcon: '07',
    summary: 'SVM ищет границу с максимальным зазором; kernel позволяет получить нелинейную границу через попарные сходства.',
    intuition: 'Границу определяют ближайшие к ней объекты — опорные векторы. Далёкие объекты обычно не меняют решение.',
    terminology: ['hyperplane', 'margin', 'support vector', 'hinge loss', 'kernel', 'RBF', 'C', 'gamma', 'SVR'],
    formulas: [
      { label: 'Линейная граница', expression: String.raw`w^Tx+b=0`, meaning: 'Знак выражения задаёт сторону гиперплоскости.', notation: ['w — нормаль к границе', 'b — сдвиг'] },
      { label: 'Зазор', expression: String.raw`margin=\frac{2}{\|w\|_2}`, meaning: 'Меньшая норма w соответствует большему геометрическому зазору.', notation: ['||w||_2 — L2-норма'] },
      { label: 'RBF kernel', expression: String.raw`K(x,x')=\exp(-\gamma\|x-x'\|_2^2)`, meaning: 'Сходство быстро падает с расстоянием.', notation: ['gamma — радиус влияния объектов'] },
    ],
    parameterRows: [
      ['C', '`1.0`', '`0.01`, `0.1`, `1`, `10`, `100`', 'штраф ошибок и ширину margin'],
      ['kernel', '`rbf`', '`linear`, `rbf`, иногда `poly`', 'форму границы'],
      ['gamma', '`scale`', '`scale`, `auto`, `1e-4`…`1`', 'радиус RBF-влияния'],
      ['class_weight', '`None`', '`balanced`', 'вес классов'],
      ['probability', '`False`', '`True` только если нужны вероятности', 'дорогую калибровку вероятностей'],
    ],
    implementationNotes: ['SVM чувствителен к масштабу признаков, поэтому StandardScaler почти всегда находится в Pipeline.', 'Обучение kernel SVC плохо масштабируется по числу объектов; для больших выборок рассматривают LinearSVC, SGDClassifier или приближения ядер.'],
    code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, stratify=y, random_state=42
)
pipeline = make_pipeline(StandardScaler(), SVC())
grid = {
    "svc__C": [0.1, 1, 10],
    "svc__gamma": ["scale", 0.01, 0.1],
    "svc__kernel": ["rbf"],
}
search = GridSearchCV(pipeline, grid, cv=5, scoring="f1", n_jobs=-1)
search.fit(X_train, y_train)
print(search.best_params_)
print(round(search.score(X_test, y_test), 3))`,
    quiz: {
      question: 'Почему перед SVC обычно применяют StandardScaler?',
      options: [{ id: 'a', text: 'Расстояния и margin чувствительны к масштабу признаков' }, { id: 'b', text: 'SVC принимает только целые числа' }, { id: 'c', text: 'Scaler добавляет новые классы' }, { id: 'd', text: 'Без него дерево станет глубоким' }],
      correctAnswer: 'a',
      explanation: 'Признак с крупными числовыми единицами иначе непропорционально влияет на расстояния и оптимизацию.',
    },
    practice: {
      title: 'Вычислить линейный decision score',
      statement: 'Даны `w1 w2 b x1 x2`. Выведите `w1*x1+w2*x2+b` и класс 1, если score>=0, иначе 0.',
      starterCode: `w1, w2, b, x1, x2 = map(float, input().split())
# TODO: вычислите score и класс
# TODO: подготовьте ответ`,
      solution: `w1, w2, b, x1, x2 = map(float, input().split())
score = w1 * x1 + w2 * x2 + b
prediction = int(score >= 0)
print(f"{score:.2f} {prediction}")`,
      samples: [{ id: 's1', description: 'Положительная сторона', input: '1 -1 0 3 1', expectedOutput: '2.00 1' }],
      hidden: [{ id: 'h1', description: 'На границе', input: '1 1 -2 1 1', expectedOutput: '0.00 1' }, { id: 'h2', description: 'Отрицательная сторона', input: '2 1 -5 1 1', expectedOutput: '-2.00 0' }],
    },
  },
  {
    id: 'kmeans-clustering',
    title: '7.2 Кластеризация и KMeans',
    order: 2,
    blockId: 'svm-clustering',
    blockTitle: 'Метод опорных векторов и кластеризация',
    blockIcon: '07',
    summary: 'KMeans чередует назначение объектов ближайшему центроиду и пересчёт центров, минимизируя внутрикластерную сумму квадратов.',
    intuition: 'Алгоритм двигает K центров в плотные области данных. Номера кластеров условны и не являются готовыми бизнес-классами.',
    terminology: ['cluster', 'centroid', 'inertia', 'k-means++', 'silhouette score', 'elbow method', 'unsupervised learning'],
    formulas: [
      { label: 'Цель KMeans', expression: String.raw`J=\sum_{k=1}^{K}\sum_{x_i\in C_k}\|x_i-\mu_k\|_2^2`, meaning: 'Минимизирует квадраты расстояний до центроидов.', notation: ['C_k — кластер k', 'mu_k — центроид'] },
      { label: 'Центроид', expression: String.raw`\mu_k=\frac{1}{|C_k|}\sum_{x_i\in C_k}x_i`, meaning: 'Центр кластера — среднее его объектов.', notation: ['|C_k| — размер кластера'] },
    ],
    parameterRows: [
      ['n_clusters', '`8`', '`2`–`10` по предметному смыслу и метрикам', 'число кластеров'],
      ['init', '`k-means++`', '`k-means++`', 'инициализацию центроидов'],
      ['n_init', '`auto`', '`auto` или `10` для явных повторов', 'число запусков'],
      ['max_iter', '`300`', '`100`–`500`', 'итерации одного запуска'],
      ['tol', '`1e-4`', '`1e-3`…`1e-5`', 'остановку по движению центров'],
    ],
    implementationNotes: ['Масштабируйте признаки: расстояние в KMeans чувствительно к единицам измерения.', 'KMeans лучше всего подходит примерно сферическим кластерам; для сложной формы или разной плотности рассмотрите DBSCAN и другие методы.'],
    code: `from sklearn.datasets import make_blobs
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=400, centers=4, cluster_std=1.2, random_state=42)
pipeline = make_pipeline(
    StandardScaler(),
    KMeans(n_clusters=4, init="k-means++", n_init="auto", random_state=42),
)
labels = pipeline.fit_predict(X)
X_scaled = pipeline[0].transform(X)
print("inertia", round(pipeline[-1].inertia_, 2))
print("silhouette", round(silhouette_score(X_scaled, labels), 3))`,
    quiz: {
      question: 'Почему перед KMeans обычно масштабируют признаки?',
      options: [{ id: 'a', text: 'Алгоритм опирается на расстояния, и крупная шкала может доминировать' }, { id: 'b', text: 'KMeans требует target от 0 до 1' }, { id: 'c', text: 'Scaler выбирает n_clusters' }, { id: 'd', text: 'Чтобы получить confusion matrix' }],
      correctAnswer: 'a',
      explanation: 'Без масштабирования признак в больших единицах непропорционально влияет на евклидово расстояние.',
    },
    practice: {
      title: 'Посчитать центроид одномерного кластера',
      statement: 'Считайте значения одного кластера и выведите их центроид-среднее с двумя знаками.',
      starterCode: `cluster = list(map(float, input().split()))
# TODO: вычислите центроид
# TODO: подготовьте ответ`,
      solution: `cluster = list(map(float, input().split()))
centroid = sum(cluster) / len(cluster)
print(f"{centroid:.2f}")`,
      samples: [{ id: 's1', description: 'Три объекта', input: '1 2 3', expectedOutput: '2.00' }],
      hidden: [{ id: 'h1', description: 'Один объект', input: '7', expectedOutput: '7.00' }, { id: 'h2', description: 'Отрицательные значения', input: '-3 -1 2 6', expectedOutput: '1.00' }],
    },
  },
]

export const visualizationTopics = specs.filter((topic) => topic.blockId === 'visualization-eda').map(buildExtendedTopic)
export const mlAdvancedFoundationsTopics = specs.filter((topic) => topic.blockId === 'ml-foundations').map(buildExtendedTopic)
export const linearModelTopics = specs.filter((topic) => topic.blockId === 'linear-models').map(buildExtendedTopic)
export const treeEnsembleTopics = specs.filter((topic) => topic.blockId === 'trees-ensembles').map(buildExtendedTopic)
export const svmClusteringTopics = specs.filter((topic) => topic.blockId === 'svm-clustering').map(buildExtendedTopic)
