import type { ConceptCodeExample, FlowStep, FlowTopic, LessonSection, PracticeTask } from './aiCurriculumTypes'
import type { Quiz } from './quizzes'

export const curriculumBlocks = [
  {
    id: 'intro-ai-ml',
    title: 'Введение в ИИ и машинное обучение',
    icon: '01',
    description: 'Базовые понятия ИИ/ML/DL, типы задач и структура ML-проекта.',
    order: 1,
  },
  {
    id: 'python-for-ai',
    title: 'Python для ИИ',
    icon: '02',
    description: 'NumPy, pandas и визуализация данных для практической работы с ML.',
    order: 2,
  },
  {
    id: 'data-prep',
    title: 'Подготовка данных',
    icon: '03',
    description: 'EDA, пропуски, категориальные признаки и масштабирование перед обучением.',
    order: 3,
  },
]

const commonSources = [
  {
    label: 'scikit-learn User Guide',
    type: 'docs' as const,
    why: 'Практические примеры по подготовке данных, моделям и пайплайнам.',
    url: 'https://scikit-learn.org/stable/user_guide.html',
  },
  {
    label: 'pandas documentation',
    type: 'docs' as const,
    why: 'Справочные примеры для анализа таблиц, фильтрации, группировок и пропусков.',
    url: 'https://pandas.pydata.org/docs/',
  },
  {
    label: 'NumPy documentation',
    type: 'docs' as const,
    why: 'Базовые операции с массивами, shape, dtype, срезами и векторизацией.',
    url: 'https://numpy.org/doc/stable/',
  },
]

function dedent(value: string) {
  const lines = value.replace(/\r\n/g, '\n').trim().split('\n')
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0)
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0
  return lines.map((line) => line.slice(minIndent)).join('\n')
}

const code = (language: string, source: string, output?: string, explanation = ''): ConceptCodeExample => ({
  language,
  code: dedent(source),
  ...(output ? { output: dedent(output) } : {}),
  explanation: explanation ? [explanation] : [],
})

const section = (
  id: string,
  title: string,
  paragraphs: string[],
  options: Pick<LessonSection, 'bullets' | 'table' | 'codeExamples'> = {},
): LessonSection => ({
  id,
  title,
  paragraphs,
  ...options,
})

const theoryStep = (id: string, title: string, summary: string, sections: LessonSection[]): FlowStep => ({
  id,
  type: 'theory',
  title,
  summary,
  sections,
})

const quizStep = (id: string, title: string, summary: string, quiz: Quiz): FlowStep => ({
  id,
  type: 'quiz',
  title,
  summary,
  quiz,
})

const practiceStep = (id: string, title: string, summary: string, task: PracticeTask): FlowStep => ({
  id,
  type: 'practice',
  title,
  summary,
  practiceTasks: [task],
})

const singleQuiz = (
  id: string,
  title: string,
  topicId: string,
  sectionId: string,
  question: string,
  options: Array<{ id: string; text: string }>,
  correctAnswer: string,
  explanation: string,
  difficulty: 'easy' | 'medium' | 'hard' = 'easy',
): Quiz => ({
  id,
  title,
  description: title,
  topicId,
  sectionId,
  questions: [
    {
      id: `${id}-q1`,
      topicId,
      sectionId,
      type: 'single',
      question,
      options,
      correctAnswer,
      explanation,
      difficulty,
    },
  ],
})

const makeStdinTask = (
  id: string,
  title: string,
  statement: string,
  starterCode: string,
  sampleTests: PracticeTask['sampleTests'],
  hiddenTests: PracticeTask['hiddenTests'],
  tips: string[] = ['Сначала разберите входные данные.', 'Заполните строки с TODO.', 'Проверьте решение на sample tests перед отправкой.'],
): PracticeTask => ({
  id,
  title,
  kind: 'stdin-stdout',
  language: 'python',
  statement,
  tips,
  starterCode: dedent(starterCode),
  sampleTests,
  hiddenTests,
})

const topicIntroAi: FlowTopic = {
  id: 'what-is-ai',
  title: '1.1 Что такое ИИ',
  order: 1,
  summary: 'Разбираем связь ИИ, машинного обучения и глубокого обучения.',
  blockId: 'intro-ai-ml',
  blockTitle: 'Введение в ИИ и машинное обучение',
  blockIcon: '01',
  subblockId: 'intro-ai-basics',
  subblockTitle: '1.1 Что такое ИИ',
  level: 'junior',
  simpleExplanation: 'ИИ — широкая область, ML — обучение по данным, DL — ML на нейросетях.',
  terminology: ['ИИ', 'машинное обучение', 'глубокое обучение', 'правила', 'модель'],
  formulas: ['ИИ → машинное обучение → глубокое обучение'],
  themeCheatsheet: ['Обычная программа получает правила от человека; ML-модель ищет правило по данным и правильным ответам.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'what-is-ai-theory',
      'Что такое ИИ',
      'ИИ — это большая область, внутри которой машинное обучение занимает отдельное практическое место.',
      [
        section('intro', 'Зачем это изучать', [
          '**Искусственный интеллект** встречается в рекомендациях, поиске, голосовых помощниках, фильтрах спама, медицине и промышленности.',
          'Для ML-инженера важно не смешивать термины: **ИИ** — область целиком, **машинное обучение** — способ строить системы по данным, **глубокое обучение** — часть ML, основанная на нейронных сетях.',
        ]),
        section(
          'what',
          'Что это такое',
          [
            'Простая схема: **ИИ → машинное обучение → глубокое обучение**.',
            '**ИИ** может включать правила, поиск, планирование и экспертные системы. **ML** нужен там, где правило трудно написать вручную, но есть примеры. **DL** особенно полезен для изображений, текста, звука и больших неструктурированных данных.',
          ],
          {
            table: {
              headers: ['Уровень', 'Что означает', 'Пример'],
              rows: [
                ['ИИ', 'Система решает задачу, похожую на интеллектуальную', 'Голосовой помощник выбирает действие по запросу'],
                ['ML', 'Модель учится на данных и правильных ответах', 'Фильтр спама учится на размеченных письмах'],
                ['DL', 'ML-модель на многослойных нейросетях', 'Нейросеть распознаёт объекты на фото'],
              ],
            },
          },
        ),
        section(
          'rules-vs-ml',
          'Обычная программа и ML',
          [
            'В обычном программировании человек заранее пишет правило: **правила + данные → ответ**.',
            'В машинном обучении мы даём данные и правильные ответы: **данные + ответы → модель**. Затем модель применяют к новым данным.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
def rule_based_temperature(t):
    if t > 25:
        return "hot"
    return "normal"

print(rule_based_temperature(30))
                `,
                'hot',
                'Это не ML: правило `if t > 25` написал человек. В ML модель сама подбирает похожее правило по обучающим данным.',
              ),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'Если система просто выполняет написанные человеком условия, это ещё не машинное обучение. Если правило извлекается из примеров, мы обычно говорим о **ML**.',
        ]),
      ],
    ),
    quizStep(
      'what-is-ai-quiz-terms',
      'ИИ, ML и DL',
      'Проверяем связь между тремя понятиями.',
      singleQuiz(
        'quiz-ai-ml-dl',
        'ИИ, ML и DL',
        'what-is-ai',
        'intro-ai-ml',
        'Как корректно описать связь ИИ, ML и DL?',
        [
          { id: 'a', text: 'ML шире ИИ, а DL шире ML' },
          { id: 'b', text: 'ИИ шире ML, а ML шире DL' },
          { id: 'c', text: 'DL и ML не связаны' },
          { id: 'd', text: 'Это три названия одного метода' },
        ],
        'b',
        'ИИ — самая широкая область, ML — её часть, DL — часть ML.',
      ),
    ),
    quizStep(
      'what-is-ai-quiz-rule-or-ml',
      'Где машинное обучение',
      'Отличаем ручные правила от обучения по данным.',
      singleQuiz(
        'quiz-rule-or-ml',
        'Правила или ML',
        'what-is-ai',
        'intro-ai-ml',
        'Какой пример ближе всего к машинному обучению?',
        [
          { id: 'a', text: 'Если температура выше 25, вывести hot' },
          { id: 'b', text: 'Модель обучили на истории писем и она предсказывает спам' },
          { id: 'c', text: 'Калькулятор складывает два числа' },
          { id: 'd', text: 'Сайт открывает страницу по кнопке' },
        ],
        'b',
        'Вариант b использует данные и правильные ответы для обучения модели.',
      ),
    ),
    practiceStep(
      'what-is-ai-practice-mini-prediction',
      'Простая формула предсказания',
      'Практика на идею признаков и числового прогноза без готового решения.',
      makeStdinTask(
        'task-mini-prediction',
        'Линейный прогноз',
        'На вход подаются два числа `x1` и `x2`. Вычислите `y = 2*x1 + 3*x2 + 5` и выведите результат.',
        `
x1, x2 = map(float, input().split())

# TODO: вычислите y по формуле из условия
y = ...

print(int(y) if y == int(y) else y)
        `,
        [
          { id: 's1', description: 'Простой пример', input: '1 2', expectedOutput: '13' },
          { id: 's2', description: 'Нулевые признаки', input: '0 0', expectedOutput: '5' },
        ],
        [
          { id: 'h1', description: 'Другие положительные значения', input: '3 4', expectedOutput: '23' },
          { id: 'h2', description: 'Отрицательный x1', input: '-1 2', expectedOutput: '9' },
        ],
      ),
    ),
  ],
}

const topicTaskTypes: FlowTopic = {
  id: 'ml-task-types',
  title: '1.2 Типы задач машинного обучения',
  order: 2,
  summary: 'Регрессия, классификация и кластеризация на понятных ML-примерах.',
  blockId: 'intro-ai-ml',
  blockTitle: 'Введение в ИИ и машинное обучение',
  blockIcon: '01',
  subblockId: 'ml-task-types-subblock',
  subblockTitle: '1.2 Типы задач машинного обучения',
  level: 'junior',
  simpleExplanation: 'Тип задачи определяется тем, что именно хранится в target.',
  terminology: ['регрессия', 'бинарная классификация', 'многоклассовая классификация', 'кластеризация', 'target'],
  formulas: ['число → регрессия', 'класс → классификация', 'нет готовых ответов → кластеризация'],
  themeCheatsheet: ['Цена квартиры → регрессия; спам/не спам → бинарная классификация; кот/собака/машина → многокласс; сегменты клиентов → кластеризация.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'ml-task-types-theory',
      'Типы задач машинного обучения',
      'Чтобы выбрать модель и метрику, сначала определяют тип задачи.',
      [
        section('intro', 'Зачем это нужно', [
          'Один и тот же набор признаков может вести к разным задачам. Например, по квартире можно предсказывать цену, класс района или группу похожих объектов.',
          'Главный ориентир — **target**: что модель должна вернуть на выходе.',
        ]),
        section(
          'table',
          'Основные типы задач',
          [
            'В supervised learning у нас есть правильные ответы. В unsupervised learning готового `target` нет, поэтому алгоритм ищет структуру сам.',
          ],
          {
            table: {
              headers: ['Тип задачи', 'Что предсказываем', 'Пример'],
              rows: [
                ['Регрессия', 'число', 'цена квартиры'],
                ['Бинарная классификация', 'один из двух классов', 'спам / не спам'],
                ['Многоклассовая классификация', 'один из нескольких классов', 'кот / собака / машина'],
                ['Кластеризация', 'группы без готовых ответов', 'сегменты клиентов'],
              ],
            },
          },
        ),
        section(
          'examples',
          'Примеры и схемы',
          [
            '**Регрессия**: площадь, комнаты → модель → цена. Ответ является числом.',
            '**Бинарная классификация**: текст письма → модель → спам / не спам. Ответ выбирается из двух классов.',
            '**Многоклассовая классификация**: изображение → модель → кот / собака / машина. Классов больше двух, но модель выбирает один.',
            '**Кластеризация**: данные клиентов → алгоритм → группы клиентов. Готового правильного ответа заранее нет.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
area = 42
rooms = 2

price = 120_000 * area + 500_000 * rooms
print(price)
                `,
                '6040000',
                'Коэффициенты здесь заданы вручную. В реальном ML модель сама подбирает их по обучающим данным.',
              ),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'Если ответ модели — число, чаще всего это **регрессия**. Если ответ — класс, это **классификация**. Если готовых ответов нет и нужны группы, это **кластеризация**.',
        ]),
      ],
    ),
    quizStep(
      'ml-task-types-quiz-reg-or-class',
      'Регрессия или классификация',
      'Проверяем, что тип задачи определяется выходом модели.',
      singleQuiz(
        'quiz-reg-class',
        'Тип задачи',
        'ml-task-types',
        'intro-ai-ml',
        'Какая задача является регрессией?',
        [
          { id: 'a', text: 'Определить, является ли письмо спамом' },
          { id: 'b', text: 'Предсказать цену квартиры' },
          { id: 'c', text: 'Разделить клиентов на группы' },
          { id: 'd', text: 'Определить породу собаки на фото' },
        ],
        'b',
        'Цена квартиры — числовое значение, значит это регрессия.',
      ),
    ),
    quizStep(
      'ml-task-types-quiz-supervised',
      'С учителем или без',
      'Различаем supervised и unsupervised постановки.',
      singleQuiz(
        'quiz-supervised-unsupervised',
        'Supervised vs unsupervised',
        'ml-task-types',
        'intro-ai-ml',
        'Группировка клиентов по похожему поведению без заранее известных меток — это:',
        [
          { id: 'a', text: 'Обучение с учителем' },
          { id: 'b', text: 'Обучение без учителя' },
          { id: 'c', text: 'Бинарная классификация' },
          { id: 'd', text: 'Регрессия' },
        ],
        'b',
        'Если готового target нет, задача обычно относится к обучению без учителя.',
      ),
    ),
    practiceStep(
      'ml-task-types-practice-toy-datasets',
      'Определи тип задачи',
      'Пользователь сам пишет соответствие номера и типа задачи.',
      makeStdinTask(
        'task-toy-datasets',
        'Игрушечные задачи',
        'На вход подаётся номер задачи. Выведите тип: `regression`, `binary`, `multiclass` или `clustering`.\n1 — цена квартиры; 2 — спам/не спам; 3 — кот/собака/машина; 4 — группы клиентов.',
        `
task_id = int(input().strip())

# TODO: выберите тип задачи по номеру
answer = ...

print(answer)
        `,
        [
          { id: 's1', description: 'Цена квартиры', input: '1', expectedOutput: 'regression' },
          { id: 's2', description: 'Спам/не спам', input: '2', expectedOutput: 'binary' },
        ],
        [
          { id: 'h1', description: 'Кот/собака/машина', input: '3', expectedOutput: 'multiclass' },
          { id: 'h2', description: 'Сегменты клиентов', input: '4', expectedOutput: 'clustering' },
        ],
      ),
    ),
  ],
}

const topicMlProject: FlowTopic = {
  id: 'ml-project-flow',
  title: '1.3 Как устроен ML-проект',
  order: 3,
  summary: 'Цепочка от данных и признаков до метрики, baseline и вывода.',
  blockId: 'intro-ai-ml',
  blockTitle: 'Введение в ИИ и машинное обучение',
  blockIcon: '01',
  subblockId: 'ml-project-flow-subblock',
  subblockTitle: '1.3 Как устроен ML-проект',
  level: 'junior',
  simpleExplanation: 'ML-проект: данные → признаки → модель → обучение → предсказание → метрика → вывод.',
  terminology: ['данные', 'features', 'target', 'модель', 'обучение', 'метрика', 'baseline'],
  formulas: ['CSV-файл → DataFrame → features/target → model.fit() → model.predict() → metric'],
  themeCheatsheet: ['Baseline — простая отправная точка, с которой сравнивают более сложные решения.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'ml-project-flow-theory',
      'Как устроен ML-проект',
      'ML-проект — это не только вызов model.fit(), а цепочка решений от постановки задачи до проверки качества.',
      [
        section('intro', 'Зачем нужна цепочка проекта', [
          'Если пропустить этап анализа данных или метрику, можно обучить модель, которая выглядит рабочей, но решает не ту задачу.',
          'Базовая схема: **данные → признаки → модель → обучение → предсказание → метрика → вывод**.',
        ]),
        section(
          'terms',
          'Ключевые сущности',
          [
            '**Данные** — таблица, изображения, тексты или события, из которых модель будет учиться.',
            '**features** — признаки, то есть входные переменные модели. Для квартиры это могут быть `area`, `rooms`, `district`.',
            '**target** — то, что нужно предсказать. Для задачи цены квартиры это `price`.',
            '**Модель** — функция, которая получает признаки и возвращает прогноз.',
            '**Метрика** — численная проверка качества: например, MAE для регрессии или accuracy/F1 для классификации.',
            '**baseline** — простое первое решение. Оно показывает, есть ли смысл усложнять модель.',
          ],
        ),
        section(
          'pipeline',
          'Минимальный пайплайн',
          [
            'Практическая схема выглядит так: `CSV-файл → DataFrame → features/target → model.fit() → model.predict() → metric`.',
            'В реальном проекте между этими шагами добавляют очистку данных, разбиение на train/validation, обработку пропусков и контроль утечек.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
from sklearn.linear_model import LinearRegression

X = [[30], [40], [50]]
y = [3_000_000, 4_000_000, 5_000_000]

model = LinearRegression()
model.fit(X, y)

print(model.predict([[45]]))
                `,
                '[4500000.]',
                'Это минимальный ML-пайплайн: есть признаки X, target y, обучение через model.fit() и прогноз через model.predict().',
              ),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'Хороший ML-проект всегда начинается с понимания данных и заканчивается проверкой качества. Модель без метрики и baseline трудно оценивать честно.',
        ]),
      ],
    ),
    quizStep(
      'ml-project-flow-quiz-order',
      'Порядок этапов',
      'Проверяем цепочку ML-проекта.',
      singleQuiz(
        'quiz-ml-order',
        'Этапы проекта',
        'ml-project-flow',
        'intro-ai-ml',
        'Какой порядок шагов ближе всего к корректному ML-пайплайну?',
        [
          { id: 'a', text: 'Модель → данные → метрика → признаки' },
          { id: 'b', text: 'Данные → признаки/target → обучение → предсказание → метрика' },
          { id: 'c', text: 'Метрика → target → данные → обучение' },
          { id: 'd', text: 'Только обучение, остальные шаги не важны' },
        ],
        'b',
        'Сначала разбирают данные и целевую переменную, затем обучают модель и измеряют качество.',
      ),
    ),
    quizStep(
      'ml-project-flow-quiz-pipeline-mistake',
      'Ошибка в пайплайне',
      'Понимаем типичную проблему утечки данных.',
      singleQuiz(
        'quiz-pipeline-leakage',
        'Найти ошибку',
        'ml-project-flow',
        'intro-ai-ml',
        'Что не так, если StandardScaler обучили на всей таблице до train/validation split?',
        [
          { id: 'a', text: 'Ничего, это стандартная практика' },
          { id: 'b', text: 'Это data leakage: в preprocessing попала информация из validation' },
          { id: 'c', text: 'Scaler нельзя использовать вообще' },
          { id: 'd', text: 'Нужно просто увеличить число эпох' },
        ],
        'b',
        'Все fit-операции preprocessing должны учиться только на train, иначе качество на validation становится нечестным.',
      ),
    ),
    practiceStep(
      'ml-project-flow-practice-first-pipeline',
      'Мини-пайплайн LinearRegression',
      'Практика с пропущенными строками обучения и предсказания.',
      makeStdinTask(
        'task-first-pipeline',
        'Предсказание цены по площади',
        'На вход подаётся площадь квартиры. Обучите `LinearRegression` на трёх примерах и выведите прогноз цены для введённой площади, округлив до целого.',
        `
from sklearn.linear_model import LinearRegression

area = float(input())

X = [[30], [40], [50]]
y = [3_000_000, 4_000_000, 5_000_000]

model = LinearRegression()

# TODO: обучите модель на X и y

# TODO: получите предсказание для введённой площади
prediction = ...

print(round(float(prediction)))
        `,
        [
          { id: 's1', description: 'Площадь 45', input: '45', expectedOutput: '4500000' },
          { id: 's2', description: 'Площадь 60', input: '60', expectedOutput: '6000000' },
        ],
        [
          { id: 'h1', description: 'Площадь 35', input: '35', expectedOutput: '3500000' },
          { id: 'h2', description: 'Площадь 52', input: '52', expectedOutput: '5200000' },
        ],
      ),
    ),
  ],
}

const topicNumpy: FlowTopic = {
  id: 'python-numpy',
  title: '2.1 NumPy',
  order: 4,
  summary: 'Массивы, shape, dtype, индексация, срезы и векторные операции.',
  blockId: 'python-for-ai',
  blockTitle: 'Python для ИИ',
  blockIcon: '02',
  subblockId: 'python-numpy-subblock',
  subblockTitle: '2.1 NumPy',
  level: 'junior',
  simpleExplanation: 'NumPy хранит численные данные компактно и быстро считает векторные операции.',
  terminology: ['np.array', 'ndarray', 'shape', 'ndim', 'dtype', 'срез'],
  formulas: ['матрица данных: объекты × признаки'],
  themeCheatsheet: ['В ML данные часто превращают в матрицу X размера (n_samples, n_features).'],
  sources: commonSources,
  steps: [
    theoryStep(
      'python-numpy-theory',
      'NumPy',
      'NumPy — базовая библиотека для численных вычислений в Python и основа многих ML-инструментов.',
      [
        section('intro', 'Зачем NumPy нужен в ML', [
          'В ML данные часто хранятся как матрица **объекты × признаки**. Обычные списки Python подходят для маленьких примеров, но плохо масштабируются на большие массивы.',
          '`np.array` создаёт массив, который умеет быстро выполнять операции сразу над многими числами.',
        ]),
        section(
          'array-properties',
          'Массив и его свойства',
          [
            '`shape` показывает форму массива, `ndim` — число измерений, `dtype` — тип данных внутри массива.',
            'Если форма неожиданная, модель может получить не те признаки или упасть на этапе обучения.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
import numpy as np

x = np.array([10, 20, 30])

print(x)
print(x.shape)
print(x.ndim)
print(x.dtype)
                `,
                `
[10 20 30]
(3,)
1
int64
                `,
                'Один вектор имеет shape `(3,)`: в нём три элемента и одна ось.',
              ),
            ],
          },
        ),
        section(
          'vector-ops',
          'Векторные операции',
          [
            'NumPy позволяет писать вычисления без явных циклов. Это короче и обычно быстрее.',
            'Вместо прохода по каждому элементу вручную мы складываем массивы целиком.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
import numpy as np

a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

print(a + b)
print(a * 2)
                `,
                `
[11 22 33]
[2 4 6]
                `,
                'Операции выполняются поэлементно: первый элемент с первым, второй со вторым и так далее.',
              ),
            ],
          },
        ),
        section('indexing', 'Индексация и срезы', [
          'Срезы помогают быстро брать строки, столбцы и диапазоны. Например, `X[:, 0]` означает первый столбец матрицы признаков.',
          'Это нужно при анализе признаков, разбиении данных и подготовке входа для модели.',
        ]),
        section('conclusion', 'Важный вывод', [
          'NumPy — рабочий формат для числовых признаков. Перед обучением модели всегда проверяйте `shape`, `ndim` и `dtype`.',
        ]),
      ],
    ),
    quizStep(
      'python-numpy-quiz-shape',
      'Определить shape',
      'Проверяем понимание формы массива.',
      singleQuiz(
        'quiz-numpy-shape',
        'Shape массива',
        'python-numpy',
        'python-for-ai',
        'Какой shape у массива с 4 строками и 3 столбцами?',
        [
          { id: 'a', text: '(3, 4)' },
          { id: 'b', text: '(4, 3)' },
          { id: 'c', text: '(12,)' },
          { id: 'd', text: '(4,)' },
        ],
        'b',
        'В NumPy форма матрицы записывается как `(число строк, число столбцов)`.',
      ),
    ),
    quizStep(
      'python-numpy-quiz-slice',
      'Что вернёт срез',
      'Проверяем базовую индексацию.',
      singleQuiz(
        'quiz-numpy-slice',
        'Срез NumPy',
        'python-numpy',
        'python-for-ai',
        'Для `x = np.array([10, 20, 30, 40])` выражение `x[1:3]` вернёт:',
        [
          { id: 'a', text: '[10, 20]' },
          { id: 'b', text: '[20, 30]' },
          { id: 'c', text: '[30, 40]' },
          { id: 'd', text: '[20, 30, 40]' },
        ],
        'b',
        'Срез `1:3` берёт элементы с индексами 1 и 2, правая граница не включается.',
      ),
    ),
    practiceStep(
      'python-numpy-practice-stats',
      'Массив и простые статистики',
      'Пользователь создаёт массив и считает статистики сам.',
      makeStdinTask(
        'task-numpy-stats',
        'Среднее и максимум',
        'На вход подаются числа через пробел. Создайте NumPy-массив, выведите среднее значение и максимум.',
        `
import numpy as np

values = list(map(float, input().split()))

# TODO: создайте NumPy-массив
x = ...

# TODO: посчитайте среднее и максимум
mean_value = ...
max_value = ...

print(mean_value)
print(max_value)
        `,
        [
          { id: 's1', description: 'Четыре числа', input: '1 2 3 4', expectedOutput: '2.5\n4.0' },
          { id: 's2', description: 'Одинаковые значения', input: '5 5 5', expectedOutput: '5.0\n5.0' },
        ],
        [
          { id: 'h1', description: 'Есть отрицательное число', input: '-2 4 10', expectedOutput: '4.0\n10.0' },
        ],
      ),
    ),
  ],
}

const topicPandas: FlowTopic = {
  id: 'python-pandas',
  title: '2.2 pandas',
  order: 5,
  summary: 'Практический анализ таблиц: чтение CSV, head/info/describe, фильтрация и groupby.',
  blockId: 'python-for-ai',
  blockTitle: 'Python для ИИ',
  blockIcon: '02',
  subblockId: 'python-pandas-subblock',
  subblockTitle: '2.2 pandas',
  level: 'junior',
  simpleExplanation: 'pandas нужен для первичного анализа таблиц и подготовки признаков.',
  terminology: ['pd.read_csv', 'DataFrame', 'df.head()', 'df.info()', 'df.describe()', 'df.columns', 'df.isna()', 'value_counts()', 'groupby()', 'loc', 'iloc'],
  formulas: ['CSV-файл → DataFrame → анализ → очистка → признаки для модели'],
  themeCheatsheet: ['pandas помогает увидеть структуру таблицы, найти пропуски, отфильтровать строки и собрать признаки.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'python-pandas-theory',
      'pandas',
      'pandas — главный инструмент для работы с табличными данными в Python.',
      [
        section('intro', 'Зачем pandas нужен в ML', [
          'Большинство прикладных ML-задач начинается с таблицы: CSV-файла, выгрузки из базы или отчёта.',
          'Схема работы: **CSV-файл → DataFrame → анализ → очистка → признаки для модели**.',
        ]),
        section(
          'first-look',
          'Первый взгляд на таблицу',
          [
            '`pd.read_csv` загружает CSV в `DataFrame`. После загрузки почти всегда смотрят `df.head()`, `df.info()`, `df.describe()` и `df.columns`.',
            '`df.head()` показывает первые строки, `df.info()` помогает увидеть типы и пропуски, `df.describe()` считает базовые статистики.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
import pandas as pd

df = pd.read_csv("data.csv")

print(df.head())
print(df.info())
print(df.describe())
                `,
                undefined,
                'Так выглядит стандартный старт EDA: сначала проверяем, что файл прочитан правильно, затем смотрим типы и статистики.',
              ),
            ],
          },
        ),
        section(
          'filtering',
          'Фильтрация, loc и iloc',
          [
            'Фильтрация строк нужна, чтобы изучать подвыборки: дорогие квартиры, клиентов из одного города, заказы за конкретный период.',
            '`loc` выбирает по названиям строк/столбцов, `iloc` — по числовым позициям.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
expensive = df[df["price"] > 10_000_000]
print(expensive.head())
                `,
                undefined,
                'Здесь остаются только строки, где цена больше 10 миллионов.',
              ),
            ],
          },
        ),
        section(
          'aggregations',
          'value_counts и groupby',
          [
            '`value_counts()` показывает частоты категорий. Это быстрый способ понять, какие значения встречаются часто, а какие выглядят подозрительно.',
            '`groupby()` группирует строки и считает статистики внутри групп: среднюю цену по району, медианный чек по сегменту, конверсию по каналу.',
          ],
          {
            codeExamples: [
              code('python', 'print(df["district"].value_counts())', undefined, 'Так можно быстро увидеть распределение квартир по районам.'),
              code('python', 'print(df.groupby("district")["price"].mean())', undefined, 'Так считается средняя цена внутри каждого района.'),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'pandas нужен не ради красивых таблиц, а ради контроля данных перед моделью: найти проблемы, проверить признаки, подготовить `features` и `target`.',
        ]),
      ],
    ),
    quizStep(
      'python-pandas-quiz-head',
      'Что делает df.head()',
      'Проверяем базовые методы pandas.',
      singleQuiz(
        'quiz-pandas-head',
        'Метод head',
        'python-pandas',
        'python-for-ai',
        'Что делает `df.head()`?',
        [
          { id: 'a', text: 'Удаляет пропуски' },
          { id: 'b', text: 'Показывает первые строки таблицы' },
          { id: 'c', text: 'Обучает модель' },
          { id: 'd', text: 'Строит график' },
        ],
        'b',
        '`df.head()` используют для быстрой проверки первых строк DataFrame.',
      ),
    ),
    quizStep(
      'python-pandas-quiz-groupby',
      'Что делает groupby',
      'Проверяем группировку данных.',
      singleQuiz(
        'quiz-pandas-groupby',
        'groupby',
        'python-pandas',
        'python-for-ai',
        'Зачем обычно используют `groupby()`?',
        [
          { id: 'a', text: 'Чтобы сгруппировать строки и посчитать статистики внутри групп' },
          { id: 'b', text: 'Чтобы удалить все строки' },
          { id: 'c', text: 'Чтобы заменить DataFrame на список' },
          { id: 'd', text: 'Чтобы автоматически обучить нейросеть' },
        ],
        'a',
        '`groupby()` объединяет строки по значению столбца и позволяет считать агрегаты по группам.',
      ),
    ),
    practiceStep(
      'python-pandas-practice-basic-table',
      'Таблица и среднее по столбцу',
      'Практика с DataFrame без готового решения.',
      makeStdinTask(
        'task-pandas-basic-table',
        'Средняя цена',
        'На вход подаётся число строк, затем строки формата `district price`. Создайте `DataFrame` и выведите среднее значение столбца `price`, округлив до 2 знаков.',
        `
import pandas as pd

n = int(input())
rows = [input().split() for _ in range(n)]

df = pd.DataFrame(rows, columns=["district", "price"])
df["price"] = df["price"].astype(float)

# TODO: посмотрите первые строки через df.head(), если нужно
# TODO: посчитайте среднюю цену
mean_price = ...

print(round(mean_price, 2))
        `,
        [
          { id: 's1', description: 'Три района', input: '3\ncenter 10\nnorth 6\ncenter 8', expectedOutput: '8.0' },
          { id: 's2', description: 'Одна строка', input: '1\nsouth 7.5', expectedOutput: '7.5' },
        ],
        [
          { id: 'h1', description: 'Четыре строки', input: '4\na 1\na 2\nb 3\nb 4', expectedOutput: '2.5' },
        ],
      ),
    ),
  ],
}

const topicViz: FlowTopic = {
  id: 'python-visualization',
  title: '2.3 Визуализация данных',
  order: 6,
  summary: 'Гистограммы, scatter plot и boxplot для EDA.',
  blockId: 'python-for-ai',
  blockTitle: 'Python для ИИ',
  blockIcon: '02',
  subblockId: 'python-visualization-subblock',
  subblockTitle: '2.3 Визуализация данных',
  level: 'junior',
  simpleExplanation: 'Графики помогают увидеть распределения, зависимости и выбросы до обучения модели.',
  terminology: ['EDA', 'histogram', 'scatter plot', 'boxplot', 'выброс'],
  formulas: ['один признак → histogram', 'два числовых признака → scatter', 'сравнение распределений → boxplot'],
  themeCheatsheet: ['Визуализация помогает заметить ошибки данных до того, как они испортят модель.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'python-viz-theory',
      'Визуализация данных',
      'Графики — один из самых быстрых способов понять датасет до обучения модели.',
      [
        section('intro', 'Зачем графики нужны в EDA', [
          'Табличные статистики показывают числа, но график быстрее выявляет выбросы, странные пики, перекос распределения и зависимость между признаками.',
          'Визуализация не заменяет метрики, но помогает задавать правильные вопросы к данным.',
        ]),
        section(
          'hist',
          'Гистограмма',
          [
            '**Гистограмма** показывает распределение одного числового признака: где значения встречаются часто, где редко, есть ли длинный хвост.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
import matplotlib.pyplot as plt

prices = [5, 6, 6, 7, 8, 12, 20]

plt.hist(prices)
plt.show()
                `,
                undefined,
                'Так можно увидеть, что большинство цен близко к 5-8, а 20 выглядит как возможный выброс.',
              ),
            ],
          },
        ),
        section(
          'scatter',
          'Scatter plot',
          [
            '**Scatter plot** показывает связь двух числовых признаков. Каждая точка — один объект.',
            'Для квартир это может быть связь площади и цены: `area` по оси X, `price` по оси Y.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
import matplotlib.pyplot as plt

area = [30, 40, 50, 60]
price = [3, 4, 5, 6]

plt.scatter(area, price)
plt.xlabel("area")
plt.ylabel("price")
plt.show()
                `,
                undefined,
                'Если точки идут вверх, между признаками есть положительная связь.',
              ),
            ],
          },
        ),
        section(
          'boxplot',
          'Boxplot',
          [
            '**Boxplot** показывает медиану, квартильный размах и возможные выбросы. Он удобен для сравнения групп.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
import matplotlib.pyplot as plt

prices = [5, 6, 6, 7, 8, 12, 20]

plt.boxplot(prices)
plt.show()
                `,
                undefined,
                'Boxplot помогает быстро заметить значения, которые выбиваются из основной массы.',
              ),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'Графики нужны до обучения модели: они помогают увидеть выбросы, странные значения, зависимости и ошибки в данных.',
        ]),
      ],
    ),
    quizStep(
      'python-viz-quiz-choose-plot',
      'Какой график выбрать',
      'Выбираем тип графика под задачу.',
      singleQuiz(
        'quiz-viz-choose',
        'Выбор графика',
        'python-visualization',
        'python-for-ai',
        'Какой график лучше всего показывает связь двух числовых признаков?',
        [
          { id: 'a', text: 'Scatter plot' },
          { id: 'b', text: 'Pie chart' },
          { id: 'c', text: 'Word cloud' },
          { id: 'd', text: 'Только таблица' },
        ],
        'a',
        'Scatter plot строит точки по двум числовым координатам и показывает связь признаков.',
      ),
    ),
    quizStep(
      'python-viz-quiz-hist',
      'Что показывает гистограмма',
      'Проверяем смысл histogram.',
      singleQuiz(
        'quiz-viz-hist',
        'Гистограмма',
        'python-visualization',
        'python-for-ai',
        'Что показывает гистограмма?',
        [
          { id: 'a', text: 'Распределение одного числового признака' },
          { id: 'b', text: 'Только связь двух признаков' },
          { id: 'c', text: 'Текстовые документы' },
          { id: 'd', text: 'Порядок обучения модели' },
        ],
        'a',
        'Гистограмма разбивает значения одного признака на интервалы и показывает частоты.',
      ),
    ),
    practiceStep(
      'python-viz-practice-hist',
      'Подготовка простого графика',
      'Практика с TODO для построения графика.',
      makeStdinTask(
        'task-viz-hist',
        'Гистограмма значений',
        'На вход подаются числа через пробел. Постройте гистограмму этих значений и выведите количество точек.',
        `
import matplotlib.pyplot as plt

values = list(map(float, input().split()))

# TODO: постройте гистограмму values
# plt.hist(...)
# plt.show()

# TODO: выведите количество значений
count = ...
print(count)
        `,
        [
          { id: 's1', description: 'Семь значений', input: '5 6 6 7 8 12 20', expectedOutput: '7' },
          { id: 's2', description: 'Три значения', input: '1 2 3', expectedOutput: '3' },
        ],
        [
          { id: 'h1', description: 'Пять значений', input: '10 10 11 12 30', expectedOutput: '5' },
        ],
      ),
    ),
  ],
}

const topicEda: FlowTopic = {
  id: 'data-initial-analysis',
  title: '3.1 Первичный анализ данных',
  order: 7,
  summary: 'Открываем таблицу, смотрим размер, типы, признаки и target.',
  blockId: 'data-prep',
  blockTitle: 'Подготовка данных',
  blockIcon: '03',
  subblockId: 'data-eda-subblock',
  subblockTitle: '3.1 Первичный анализ данных',
  level: 'junior',
  simpleExplanation: 'Перед моделью нужно понять, что лежит в таблице и где target.',
  terminology: ['EDA', 'df.head()', 'df.shape', 'df.info()', 'df.describe()', 'features', 'target'],
  formulas: ['таблица → признаки X + целевая переменная y'],
  themeCheatsheet: ['Первичный анализ защищает от обучения модели на мусоре или неправильной целевой переменной.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'data-eda-theory',
      'Первичный анализ данных',
      'Перед обучением модели нужно понять таблицу: строки, столбцы, типы, пропуски, признаки и target.',
      [
        section('intro', 'Зачем начинать с анализа', [
          'Модель не понимает бизнес-контекст. Если случайно подать неправильный `target` или не заметить текстовый столбец среди чисел, результат будет бесполезным.',
          'Схема: **таблица → признаки X + целевая переменная y**.',
        ]),
        section(
          'first-commands',
          'Базовые команды',
          [
            '`df.head()` показывает первые строки, `df.shape` — размер таблицы, `df.info()` — типы и пропуски, `df.describe()` — статистики по числовым столбцам.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
print(df.head())
print(df.shape)
print(df.info())
print(df.describe())
                `,
                undefined,
                'Эти команды обычно запускают до любых моделей.',
              ),
            ],
          },
        ),
        section(
          'features-target',
          'Признаки и target',
          [
            '**features** — вход модели, **target** — правильный ответ, который нужно предсказывать.',
            'Для цены квартиры `area` и `rooms` могут быть признаками, а `price` — целевой переменной.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
X = df[["area", "rooms"]]
y = df["price"]

print(X.shape)
print(y.head())
                `,
                undefined,
                'Так мы явно отделяем входные признаки X от целевой переменной y.',
              ),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'Перед моделью нужно понять структуру таблицы. Иначе можно обучить модель на мусоре или случайно использовать неправильный `target`.',
        ]),
      ],
    ),
    quizStep(
      'data-eda-quiz-target',
      'Найти target',
      'Проверяем понимание целевой переменной.',
      singleQuiz(
        'quiz-eda-target',
        'Target',
        'data-initial-analysis',
        'data-prep',
        'Для задачи «предсказать стоимость квартиры» target — это:',
        [
          { id: 'a', text: 'Площадь' },
          { id: 'b', text: 'Район' },
          { id: 'c', text: 'Цена' },
          { id: 'd', text: 'Количество комнат' },
        ],
        'c',
        'Target — то, что модель должна предсказать, то есть цена.',
      ),
    ),
    quizStep(
      'data-eda-quiz-types',
      'Числовые и категориальные признаки',
      'Различаем типы признаков.',
      singleQuiz(
        'quiz-eda-feature-types',
        'Типы признаков',
        'data-initial-analysis',
        'data-prep',
        'Какой признак обычно является категориальным?',
        [
          { id: 'a', text: 'income' },
          { id: 'b', text: 'age' },
          { id: 'c', text: 'city' },
          { id: 'd', text: 'balance' },
        ],
        'c',
        '`city` содержит названия категорий, а не непрерывные числа.',
      ),
    ),
    practiceStep(
      'data-eda-practice-x-y',
      'Выделить X и y',
      'Практика на отделение признаков от target.',
      makeStdinTask(
        'task-eda-x-y',
        'Признаки и целевая переменная',
        'На вход подаётся число строк, затем строки `area rooms price`. Создайте DataFrame, выделите `X = area, rooms` и `y = price`. Выведите `X.shape` и среднюю цену, округлённую до целого.',
        `
import pandas as pd

n = int(input())
rows = [list(map(float, input().split())) for _ in range(n)]

df = pd.DataFrame(rows, columns=["area", "rooms", "price"])

# TODO: выделите признаки и target
X = ...
y = ...

print(X.shape)
print(round(y.mean()))
        `,
        [
          { id: 's1', description: 'Три квартиры', input: '3\n30 1 3000000\n40 2 4200000\n50 2 5100000', expectedOutput: '(3, 2)\n4100000' },
          { id: 's2', description: 'Две квартиры', input: '2\n10 1 100\n20 1 300', expectedOutput: '(2, 2)\n200' },
        ],
        [
          { id: 'h1', description: 'Четыре квартиры', input: '4\n1 1 10\n2 1 20\n3 2 30\n4 2 40', expectedOutput: '(4, 2)\n25' },
        ],
      ),
    ),
  ],
}

const topicMissing: FlowTopic = {
  id: 'data-missing-duplicates',
  title: '3.2 Пропуски и дубликаты',
  order: 8,
  summary: 'Находим NaN, выбираем drop/fill и удаляем дубликаты.',
  blockId: 'data-prep',
  blockTitle: 'Подготовка данных',
  blockIcon: '03',
  subblockId: 'data-missing-subblock',
  subblockTitle: '3.2 Пропуски и дубликаты',
  level: 'junior',
  simpleExplanation: 'Пропуски и дубликаты искажают статистики и могут ломать обучение.',
  terminology: ['NaN', 'dropna', 'fillna', 'median', 'mode', 'drop_duplicates'],
  formulas: ['mean чувствителен к выбросам', 'median устойчивее к выбросам', 'mode для категорий'],
  themeCheatsheet: ['Среднее — для спокойных числовых данных, медиана — при выбросах, мода — для категорий.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'data-missing-theory',
      'Пропуски и дубликаты',
      'Реальные данные почти всегда содержат пустые значения, повторы и странные строки.',
      [
        section('intro', 'Что такое пропуски', [
          '**Пропуск** — отсутствующее значение в ячейке: `NaN`, `None`, пустая строка или специальный код вроде -1.',
          'Многие ML-модели не умеют работать с пропусками напрямую, поэтому preprocessing должен явно их обработать.',
        ]),
        section(
          'find',
          'Как найти пропуски',
          [
            '`df.isna().sum()` показывает количество пропусков по каждому столбцу. Это один из первых шагов EDA.',
          ],
          {
            codeExamples: [
              code('python', 'print(df.isna().sum())', undefined, 'Если в столбце много пропусков, стратегию обработки выбирают особенно осторожно.'),
            ],
          },
        ),
        section(
          'strategies',
          'Удалить или заполнить',
          [
            'Строки можно удалить через `dropna()`, если пропусков мало и удаление не ломает распределение.',
            'Числовой признак часто заполняют средним или медианой. **Среднее** чувствительно к выбросам, **медиана** устойчивее.',
            'Категориальные признаки часто заполняют **модой** — самым частым значением.',
          ],
          {
            codeExamples: [
              code('python', 'df = df.dropna()', undefined, 'Удаляем строки с пропусками. Это просто, но может выбросить полезные данные.'),
              code('python', 'df["age"] = df["age"].fillna(df["age"].median())', undefined, 'Медиана часто лучше среднего, если в числовом признаке есть выбросы.'),
            ],
          },
        ),
        section(
          'duplicates',
          'Дубликаты',
          [
            '**Дубликат** — повтор той же записи. Повторы могут переусилить одни и те же объекты и исказить обучение.',
          ],
          {
            codeExamples: [
              code('python', 'df = df.drop_duplicates()', undefined, 'Перед удалением дубликатов важно понять, являются ли повторные строки ошибкой или реальными событиями.'),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'Пропуски нельзя игнорировать. Нужно выбрать стратегию по смыслу признака, доле пропусков и наличию выбросов.',
        ]),
      ],
    ),
    quizStep(
      'data-missing-quiz-delete-or-fill',
      'Удалить или заполнить',
      'Проверяем выбор стратегии.',
      singleQuiz(
        'quiz-missing-delete-fill',
        'Стратегия пропусков',
        'data-missing-duplicates',
        'data-prep',
        'Если пропусков в числовом столбце мало, а данных очень много, чаще всего можно:',
        [
          { id: 'a', text: 'Удалить весь датасет' },
          { id: 'b', text: 'Удалить строки с пропусками или заполнить простым устойчивым значением' },
          { id: 'c', text: 'Оставить пропуски как есть для любой модели' },
          { id: 'd', text: 'Заполнить случайными словами' },
        ],
        'b',
        'При малой доле пропусков обычно подходят простые стабильные стратегии, но решение зависит от контекста.',
      ),
    ),
    quizStep(
      'data-missing-quiz-method',
      'Mean, median или mode',
      'Выбираем метод заполнения.',
      singleQuiz(
        'quiz-missing-method',
        'Метод заполнения',
        'data-missing-duplicates',
        'data-prep',
        'Для числового признака с сильными выбросами обычно лучше использовать:',
        [
          { id: 'a', text: 'Среднее' },
          { id: 'b', text: 'Медиану' },
          { id: 'c', text: 'Моду как для категорий' },
          { id: 'd', text: 'Случайную строку' },
        ],
        'b',
        'Медиана устойчивее к выбросам, чем среднее.',
      ),
    ),
    practiceStep(
      'data-missing-practice-fill',
      'Заполнить пропуски медианой',
      'Практика без готового решения.',
      makeStdinTask(
        'task-missing-fill',
        'Заполнение NaN',
        'На вход подаются значения столбца `age`, где `nan` означает пропуск. Создайте DataFrame, заполните пропуски медианой, выведите число оставшихся пропусков и среднее значение.',
        `
import pandas as pd

values = input().split()
df = pd.DataFrame({
    "age": [None if value == "nan" else float(value) for value in values]
})

# TODO: заполните пропуски медианой
df["age"] = ...

print(df["age"].isna().sum())
print(round(df["age"].mean(), 2))
        `,
        [
          { id: 's1', description: 'Один пропуск', input: '10 nan 20', expectedOutput: '0\n15.0' },
          { id: 's2', description: 'Без пропусков', input: '5 15', expectedOutput: '0\n10.0' },
        ],
        [
          { id: 'h1', description: 'Пропуск и выброс', input: '10 20 nan 100', expectedOutput: '0\n37.5' },
        ],
      ),
    ),
  ],
}

const topicCategorical: FlowTopic = {
  id: 'data-categorical-features',
  title: '3.3 Категориальные признаки',
  order: 9,
  summary: 'Label Encoding, One-Hot Encoding и риск ложного порядка.',
  blockId: 'data-prep',
  blockTitle: 'Подготовка данных',
  blockIcon: '03',
  subblockId: 'data-categorical-subblock',
  subblockTitle: '3.3 Категориальные признаки',
  level: 'junior',
  simpleExplanation: 'Строковые категории нужно превратить в числа перед подачей в большинство моделей.',
  terminology: ['категориальный признак', 'Label Encoding', 'One-Hot Encoding', 'pd.get_dummies', 'OneHotEncoder'],
  formulas: ['"red", "green", "blue" → кодирование → числа для модели'],
  themeCheatsheet: ['Для номинальных категорий One-Hot часто безопаснее обычной нумерации, потому что не создаёт ложный порядок.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'data-categorical-theory',
      'Категориальные признаки',
      'Категориальные признаки описывают класс, тип или название, а не непрерывную величину.',
      [
        section('intro', 'Что это такое', [
          'Примеры категориальных признаков: `color`, `city`, `device_type`, `district`.',
          'Большинство ML-моделей принимает числа, поэтому строки нужно кодировать.',
          'Схема: **"red", "green", "blue" → кодирование → числа для модели**.',
        ]),
        section('label', 'Label Encoding', [
          '**Label Encoding** заменяет категории числами: `red -> 0`, `green -> 1`, `blue -> 2`.',
          'Проблема в том, что модель может решить, будто `blue > green > red`, хотя настоящего порядка нет.',
          'Обычная нумерация уместнее для ordinal-признаков, где порядок реален: например, `low < medium < high`.',
        ]),
        section(
          'onehot',
          'One-Hot Encoding',
          [
            '**One-Hot Encoding** создаёт отдельный бинарный столбец для каждой категории: `color_red`, `color_green`, `color_blue`.',
            'Для номинальных категорий это часто безопаснее, потому что не добавляет искусственный порядок.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
import pandas as pd

df = pd.DataFrame({"color": ["red", "green", "blue"]})
encoded = pd.get_dummies(df, columns=["color"])

print(encoded)
                `,
                undefined,
                '`pd.get_dummies` быстро создаёт one-hot столбцы прямо в pandas.',
              ),
              code(
                'python',
                `
from sklearn.preprocessing import OneHotEncoder

encoder = OneHotEncoder(handle_unknown="ignore")
encoded = encoder.fit_transform(df[["color"]])
                `,
                undefined,
                '`handle_unknown="ignore"` помогает безопасно обработать новую категорию на inference.',
              ),
            ],
          },
        ),
        section('conclusion', 'Важный вывод', [
          'Строковые категории нельзя просто отправить в большинство моделей. Для номинальных категорий обычно начинайте с One-Hot Encoding.',
        ]),
      ],
    ),
    quizStep(
      'data-categorical-quiz-order-risk',
      'Риск ложного порядка',
      'Проверяем, почему обычная нумерация не всегда безопасна.',
      singleQuiz(
        'quiz-categorical-order-risk',
        'Ложный порядок',
        'data-categorical-features',
        'data-prep',
        'Почему кодирование города как 0, 1, 2 может быть проблемой для линейной модели?',
        [
          { id: 'a', text: 'Модель может воспринять номера как настоящий порядок или расстояние' },
          { id: 'b', text: 'Потому что строки вообще нельзя кодировать' },
          { id: 'c', text: 'Потому что One-Hot всегда хуже' },
          { id: 'd', text: 'Потому что pandas не умеет работать с городами' },
        ],
        'a',
        'Номинальные категории не имеют естественного порядка, а числа могут создать ложный смысл.',
      ),
    ),
    quizStep(
      'data-categorical-quiz-onehot',
      'Что делает One-Hot',
      'Проверяем смысл one-hot кодирования.',
      singleQuiz(
        'quiz-categorical-onehot',
        'One-Hot Encoding',
        'data-categorical-features',
        'data-prep',
        'Что делает One-Hot Encoding?',
        [
          { id: 'a', text: 'Удаляет категориальный признак' },
          { id: 'b', text: 'Преобразует категорию в набор бинарных столбцов' },
          { id: 'c', text: 'Стандартизирует числовые признаки' },
          { id: 'd', text: 'Сортирует строки по алфавиту' },
        ],
        'b',
        'One-Hot создаёт отдельные 0/1-столбцы для категорий.',
      ),
    ),
    practiceStep(
      'data-categorical-practice-ohe',
      'Закодировать категориальный столбец',
      'Практика с pd.get_dummies без готового решения.',
      makeStdinTask(
        'task-categorical-ohe',
        'One-Hot для color',
        'На вход подаются цвета через пробел. Создайте DataFrame, закодируйте столбец `color` через `pd.get_dummies`, выведите количество получившихся столбцов и сумму первой строки.',
        `
import pandas as pd

colors = input().split()
df = pd.DataFrame({"color": colors})

# TODO: примените One-Hot Encoding к столбцу color
encoded = ...

print(encoded.shape[1])
print(int(encoded.iloc[0].sum()))
        `,
        [
          { id: 's1', description: 'Три цвета', input: 'red green blue', expectedOutput: '3\n1' },
          { id: 's2', description: 'Повтор категории', input: 'red red blue', expectedOutput: '2\n1' },
        ],
        [
          { id: 'h1', description: 'Две категории', input: 'cat dog cat dog', expectedOutput: '2\n1' },
        ],
      ),
    ),
  ],
}

const topicScaling: FlowTopic = {
  id: 'data-feature-scaling',
  title: '3.4 Масштабирование признаков',
  order: 10,
  summary: 'StandardScaler, MinMaxScaler и модели, чувствительные к масштабу.',
  blockId: 'data-prep',
  blockTitle: 'Подготовка данных',
  blockIcon: '03',
  subblockId: 'data-scaling-subblock',
  subblockTitle: '3.4 Масштабирование признаков',
  level: 'junior',
  simpleExplanation: 'Масштабирование приводит признаки к сопоставимым шкалам.',
  terminology: ['StandardScaler', 'MinMaxScaler', 'kNN', 'SVM', 'нейросети', 'деревья решений'],
  formulas: ['StandardScaler: z = (x - mean) / std', 'MinMaxScaler: (x - min) / (max - min)'],
  themeCheatsheet: ['kNN, линейные модели, SVM и нейросети чувствительны к масштабу; деревья, Random Forest и бустинг на деревьях обычно менее чувствительны.'],
  sources: commonSources,
  steps: [
    theoryStep(
      'data-scaling-theory',
      'Масштабирование признаков',
      'Если признаки измеряются в разных шкалах, некоторые модели начинают учитывать масштаб сильнее смысла.',
      [
        section('intro', 'Зачем масштабировать признаки', [
          'Представьте признаки: площадь = 50, доход = 200000. Для моделей на расстояниях или градиентах большой числовой диапазон может доминировать.',
          'После масштабирования значения становятся сопоставимыми: площадь ≈ 0.1, доход ≈ 0.3.',
        ]),
        section(
          'standard',
          'StandardScaler',
          [
            '`StandardScaler` вычитает среднее и делит на стандартное отклонение. После преобразования признак обычно имеет mean≈0 и std≈1.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
from sklearn.preprocessing import StandardScaler

X = [[50, 200000], [70, 300000], [40, 150000]]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

print(X_scaled)
                `,
                undefined,
                'Важно: на реальном train/validation split `fit` делают только на train, а `transform` — на validation/test.',
              ),
            ],
          },
        ),
        section(
          'minmax',
          'MinMaxScaler',
          [
            '`MinMaxScaler` линейно переводит значения в диапазон, чаще всего от 0 до 1.',
          ],
          {
            codeExamples: [
              code(
                'python',
                `
from sklearn.preprocessing import MinMaxScaler

X = [[50, 200000], [70, 300000], [40, 150000]]

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

print(X_scaled)
                `,
                undefined,
                'MinMaxScaler полезен, когда нужен фиксированный диапазон значений.',
              ),
            ],
          },
        ),
        section(
          'models',
          'Для каких моделей это важно',
          [
            'Масштабирование особенно важно для **kNN**, линейных моделей, **SVM** и нейросетей.',
            'Обычно менее важно для деревьев решений, **Random Forest** и бустинга на деревьях, потому что они выбирают пороги по отдельным признакам.',
          ],
        ),
        section('conclusion', 'Важный вывод', [
          'Если модель использует расстояния или градиентную оптимизацию, масштаб признаков почти всегда нужно проверить.',
        ]),
      ],
    ),
    quizStep(
      'data-scaling-quiz-sensitive-models',
      'Какие модели чувствительны к масштабу',
      'Проверяем влияние шкал признаков.',
      singleQuiz(
        'quiz-scaling-sensitive',
        'Чувствительность к масштабу',
        'data-feature-scaling',
        'data-prep',
        'Какая группа моделей обычно сильнее зависит от масштаба признаков?',
        [
          { id: 'a', text: 'kNN, линейные модели, SVM и нейросети' },
          { id: 'b', text: 'Только Decision Tree и Random Forest' },
          { id: 'c', text: 'Только правила if/else' },
          { id: 'd', text: 'Никакая модель' },
        ],
        'a',
        'Модели на расстояниях и градиентной оптимизации обычно чувствительны к шкалам признаков.',
      ),
    ),
    quizStep(
      'data-scaling-quiz-standardization',
      'Что делает стандартизация',
      'Проверяем смысл StandardScaler.',
      singleQuiz(
        'quiz-scaling-standardization',
        'Стандартизация',
        'data-feature-scaling',
        'data-prep',
        'Что обычно делает StandardScaler?',
        [
          { id: 'a', text: 'Приводит признак к mean≈0 и std≈1' },
          { id: 'b', text: 'Кодирует строки через one-hot' },
          { id: 'c', text: 'Удаляет все выбросы' },
          { id: 'd', text: 'Всегда переводит значения в 0..255' },
        ],
        'a',
        'StandardScaler использует формулу `(x - mean) / std`.',
      ),
    ),
    practiceStep(
      'data-scaling-practice-standard',
      'Масштабировать признаки через StandardScaler',
      'Практика с пропущенной fit_transform строкой.',
      makeStdinTask(
        'task-scaling-standard',
        'Средние после стандартизации',
        'На вход подаётся число строк, затем строки с двумя признаками. Масштабируйте матрицу через `StandardScaler` и выведите среднее каждого столбца после масштабирования с одним знаком после точки.',
        `
import numpy as np
from sklearn.preprocessing import StandardScaler

n = int(input())
X = [list(map(float, input().split())) for _ in range(n)]

scaler = StandardScaler()

# TODO: обучите scaler и преобразуйте X
X_scaled = ...

# TODO: посчитайте средние значения по столбцам
means = ...

print(" ".join(f"{value:.1f}" for value in means))
        `,
        [
          { id: 's1', description: 'Три строки', input: '3\n50 200000\n70 300000\n40 150000', expectedOutput: '0.0 0.0' },
          { id: 's2', description: 'Две строки', input: '2\n1 10\n3 30', expectedOutput: '0.0 0.0' },
        ],
        [
          { id: 'h1', description: 'Четыре строки', input: '4\n1 2\n2 4\n3 6\n4 8', expectedOutput: '0.0 0.0' },
        ],
      ),
    ),
  ],
}

export const flowTopics: FlowTopic[] = [
  topicIntroAi,
  topicTaskTypes,
  topicMlProject,
  topicNumpy,
  topicPandas,
  topicViz,
  topicEda,
  topicMissing,
  topicCategorical,
  topicScaling,
]
