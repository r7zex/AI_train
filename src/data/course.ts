export type StepType = 'theory' | 'pitfalls' | 'interview' | 'quiz' | 'code' | 'cheatsheet'
export type QuizKind = 'single' | 'truefalse' | 'fillblank' | 'numeric'

export interface QuizQuestion {
  id: string
  kind: QuizKind
  prompt: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  tolerance?: number
}

export interface CodeTask {
  id: string
  title: string
  statement: string
  inputFormat: string[]
  outputFormat: string[]
  sampleInput: string
  sampleOutput: string
  hiddenTests: string[]
  starterCode: string
  checks: string[]
}

export interface LessonStep {
  id: string
  type: StepType
  title: string
  content?: string[]
  codeExample?: string
  note?: string
  quiz?: QuizQuestion
  codeTask?: CodeTask
}

export interface Theme {
  id: string
  title: string
  order: number
  summary: string
  level: 'junior' | 'junior+'
  terminology: string[]
  simpleExplanation: string
  usage: string[]
  realLifeExample: string
  codeExample: string
  codeExplanation: string[]
  mistakes: string[]
  interview: Array<{ question: string; answer: string }>
  formulas: string[]
  extraTerms: string[]
  lossFunctions: string[]
  activationFunctions: string[]
  themeCheatsheet: string[]
  quizQuestions: QuizQuestion[]
  codeTasks: CodeTask[]
  steps: LessonStep[]
}

export interface Subblock {
  id: string
  title: string
  order: number
  description: string
  themes: Theme[]
  cheatsheet: string[]
}

export interface Block {
  id: string
  title: string
  order: number
  icon: string
  description: string
  subblocks: Subblock[]
  cheatsheet: string[]
}

interface ThemeSeed {
  id: string
  title: string
  summary: string
  level: 'junior' | 'junior+'
  terminology: string[]
  simpleExplanation: string
  usage: string[]
  realLifeExample: string
  codeExample: string
  codeExplanation: string[]
  mistakes: string[]
  interview: Array<{ question: string; answer: string }>
  formulas: string[]
  extraTerms: string[]
  lossFunctions?: string[]
  activationFunctions?: string[]
  quizQuestions: QuizQuestion[]
  codeTasks: CodeTask[]
}

function makeQuiz(idPrefix: string, title: string, formulas: string[], domain: string): QuizQuestion[] {
  return [
    {
      id: `${idPrefix}-q1`,
      kind: 'single',
      prompt: `Что лучше всего описывает тему «${title}»?`,
      options: [
        `${title} помогает решать прикладные задачи в ${domain}`,
        `${title} нужен только для визуализации графиков`,
        `${title} не связан с качеством модели`,
        `${title} используется только после деплоя`,
      ],
      correctAnswer: `${title} помогает решать прикладные задачи в ${domain}`,
      explanation: `Это базовая прикладная тема, без которой джуну сложно уверенно решать задачи в ${domain}.`,
    },
    {
      id: `${idPrefix}-q2`,
      kind: 'truefalse',
      prompt: `Верно ли, что ${title.toLowerCase()} нужно понимать не только по определению, но и по ограничениям?`,
      correctAnswer: 'true',
      explanation: 'На собеседовании важно знать и смысл, и когда подход использовать нельзя.',
    },
    {
      id: `${idPrefix}-q3`,
      kind: 'fillblank',
      prompt: `Дополните фразу: цель темы «${title}» — получить ________ результат на новых данных.`,
      correctAnswer: 'устойчивый',
      explanation: 'Хорошая тема в ML почти всегда про устойчивость, обобщение и контроль ошибок.',
    },
    {
      id: `${idPrefix}-q4`,
      kind: 'numeric',
      prompt: `Сколько ключевых формул вынесено в шпаргалку этой темы?`,
      correctAnswer: formulas.length,
      tolerance: 0,
      explanation: `В шпаргалке вынесено ${formulas.length} формул/правил, чтобы быстро повторять тему.`,
    },
    {
      id: `${idPrefix}-q5`,
      kind: 'single',
      prompt: `Что должен уметь junior после этой темы?`,
      options: [
        'Объяснить терминологию, показать код и разобрать ошибки',
        'Только повторить определение из книги',
        'Только запустить библиотечную функцию',
        'Только перечислить названия алгоритмов',
      ],
      correctAnswer: 'Объяснить терминологию, показать код и разобрать ошибки',
      explanation: 'По запросу пользователя каждая тема должна вести от терминов к коду, ошибкам и интервью-вопросам.',
    },
  ]
}

function makeCodeTasks(idPrefix: string, title: string): CodeTask[] {
  return [
    {
      id: `${idPrefix}-code-1`,
      title: `${title}: задача 1 — базовый разбор входа`,
      statement: `Напишите программу, которая читает число n и затем n значений, после чего выводит количество считанных элементов. Задача нужна, чтобы закрепить базовый stdin→stdout формат внутри темы «${title}».`,
      inputFormat: ['Первая строка: n', 'Вторая строка: n чисел через пробел'],
      outputFormat: ['Одно число — количество элементов'],
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '5',
      hiddenTests: ['n = 1', 'Лишние пробелы во входе', 'Отрицательные числа в списке'],
      starterCode: 'n = int(input())\nvalues = list(map(int, input().split()))\n# TODO: print result\n',
      checks: ['input(', 'split(', 'print(', 'len('],
    },
    {
      id: `${idPrefix}-code-2`,
      title: `${title}: задача 2 — простая агрегация`,
      statement: `Считайте массив и выведите сумму и среднее. Практика нужна для того, чтобы оперировать признаками и статистиками в теме «${title}».`,
      inputFormat: ['Первая строка: n', 'Вторая строка: n чисел'],
      outputFormat: ['Два числа: сумма и среднее'],
      sampleInput: '4\n1 2 3 4',
      sampleOutput: '10 2.5',
      hiddenTests: ['n = 1', 'Дробные значения', 'Наличие отрицательных чисел'],
      starterCode: 'n = int(input())\nvalues = list(map(float, input().split()))\n# TODO: compute total and mean\n',
      checks: ['sum(', 'len(', 'print('],
    },
    {
      id: `${idPrefix}-code-3`,
      title: `${title}: задача 3 — правило/формула`,
      statement: `Реализуйте вычисление по формуле темы. Программа получает два числа a и b и должна вывести результат формулы (a + b) / 2. Этот каркас имитирует работу с формулой, которую студент видит в теории темы «${title}».`,
      inputFormat: ['Одна строка: a b'],
      outputFormat: ['Одно число — результат формулы'],
      sampleInput: '6 10',
      sampleOutput: '8.0',
      hiddenTests: ['a = b', 'Отрицательные числа', 'Нули на входе'],
      starterCode: 'a, b = map(float, input().split())\n# TODO: print((a + b) / 2)\n',
      checks: ['input(', 'split(', 'print(', '/ 2'],
    },
    {
      id: `${idPrefix}-code-4`,
      title: `${title}: задача 4 — условие`,
      statement: `Программа получает порог threshold и список чисел. Выведите count_high — сколько элементов не меньше порога. Такая задача тренирует применение правил решения и работу с условиями в теме «${title}».`,
      inputFormat: ['Первая строка: n threshold', 'Вторая строка: n чисел'],
      outputFormat: ['Одно число — count_high'],
      sampleInput: '5 3\n1 3 4 2 5',
      sampleOutput: '3',
      hiddenTests: ['Все элементы меньше порога', 'Все элементы равны порогу', 'Смешанные отрицательные значения'],
      starterCode: 'n, threshold = map(float, input().split())\nvalues = list(map(float, input().split()))\n# TODO: count values >= threshold\n',
      checks: ['for ', 'if ', 'print('],
    },
    {
      id: `${idPrefix}-code-5`,
      title: `${title}: задача 5 — итоговая mini-practice`,
      statement: `Считайте массив и выведите минимальное, максимальное и размах. Это финальная stdin→stdout задача подтемы «${title}», у которой есть hidden-тесты на крайние случаи.`,
      inputFormat: ['Первая строка: n', 'Вторая строка: n чисел'],
      outputFormat: ['Три значения: min max range'],
      sampleInput: '5\n2 7 1 8 3',
      sampleOutput: '1 8 7',
      hiddenTests: ['Один элемент', 'Отрицательные значения', 'Повторяющиеся элементы'],
      starterCode: 'n = int(input())\nvalues = list(map(int, input().split()))\n# TODO: print(minimum, maximum, maximum - minimum)\n',
      checks: ['min(', 'max(', 'print('],
    },
  ]
}

function makeTheme(seed: ThemeSeed): Theme {
  const theoryOne: LessonStep = {
    id: `${seed.id}-theory-1`,
    type: 'theory',
    title: 'Теория · терминология и идея',
    content: [
      `Терминология: ${seed.terminology.join('; ')}.`,
      `Простыми словами: ${seed.simpleExplanation}`,
      `Зачем тема нужна: ${seed.summary}`,
    ],
  }

  const theoryTwo: LessonStep = {
    id: `${seed.id}-theory-2`,
    type: 'theory',
    title: 'Теория · где используется и пример из жизни',
    content: [
      ...seed.usage.map((item, index) => `${index + 1}. ${item}`),
      `Пример из жизни: ${seed.realLifeExample}`,
    ],
    note: 'Эта часть отвечает на вопрос “где и зачем это реально использовать”.',
  }

  const theoryThree: LessonStep = {
    id: `${seed.id}-theory-3`,
    type: 'theory',
    title: 'Теория · код и словесная интерпретация',
    content: seed.codeExplanation,
    codeExample: seed.codeExample,
    note: 'Ниже показан короткий кодовый фрагмент в стиле урока Stepik.',
  }

  const pitfallsStep: LessonStep = {
    id: `${seed.id}-pitfalls`,
    type: 'pitfalls',
    title: 'Распространённые ошибки и путь решения',
    content: seed.mistakes,
  }

  const interviewStep: LessonStep = {
    id: `${seed.id}-interview`,
    type: 'interview',
    title: 'Вопросы и ответы для собеседования',
    content: seed.interview.map((item, index) => `Вопрос ${index + 1}: ${item.question}\nОтвет: ${item.answer}`),
  }

  const quizSteps = seed.quizQuestions.map((quiz, index) => ({
    id: `${seed.id}-quiz-${index + 1}`,
    type: 'quiz' as const,
    title: `Квиз ${index + 1} из ${seed.quizQuestions.length}`,
    quiz,
  }))

  const codeSteps = seed.codeTasks.map((task, index) => ({
    id: `${seed.id}-practice-${index + 1}`,
    type: 'code' as const,
    title: `Практика stdin→stdout ${index + 1} из ${seed.codeTasks.length}`,
    codeTask: task,
  }))

  const themeCheatsheet = [
    ...seed.terminology.map((term) => `Термин: ${term}`),
    ...seed.formulas.map((formula) => `Формула: ${formula}`),
    ...seed.extraTerms.map((term) => `Опора: ${term}`),
  ]

  const cheatsheetStep: LessonStep = {
    id: `${seed.id}-cheatsheet`,
    type: 'cheatsheet',
    title: 'Шпаргалка темы',
    content: themeCheatsheet,
  }

  return {
    ...seed,
    order: 0,
    lossFunctions: seed.lossFunctions ?? [],
    activationFunctions: seed.activationFunctions ?? [],
    themeCheatsheet,
    steps: [theoryOne, theoryTwo, theoryThree, pitfallsStep, interviewStep, ...quizSteps, ...codeSteps, cheatsheetStep],
  }
}

const blockSeeds = [
  {
    id: 'python',
    title: 'Python',
    order: 1,
    icon: '🐍',
    description: 'Самая первая ступень: синтаксис, структуры данных и базовая алгоритмика для ML.',
    subblocks: [
      {
        id: 'python-core',
        title: 'Python Core',
        order: 1,
        description: 'То, без чего не получится писать решения, проходить квизы и кодовые задачи.',
        themes: [
          makeTheme({
            id: 'python-basics',
            title: 'Переменные, типы и базовые коллекции',
            summary: 'Тема объединяет синтаксис Python, базовые типы и коллекции в один осмысленный стартовый модуль.',
            level: 'junior',
            terminology: ['int, float, str, bool', 'list, tuple, set, dict', 'индексация и срезы'],
            simpleExplanation: 'Это язык, на котором вы храните данные, перебираете их, фильтруете и подготавливаете к ML-задачам.',
            usage: [
              'Используется в любом ноутбуке, домашнем задании и мини-сервисе для ML.',
              'Нужен для чтения входных данных, построения признаков и базовых вычислений.',
              'Без этой темы сложно писать даже простые stdin→stdout решения.',
            ],
            realLifeExample: 'Если нужно из списка клиентов выделить уникальные города и посчитать количество покупок по каждому, вы используете списки, множества и словари.',
            codeExample: "values = [1, 2, 2, 5]\nunique_values = set(values)\ncounts = {value: values.count(value) for value in unique_values}\nprint(unique_values)\nprint(counts)",
            codeExplanation: [
              'Сначала мы создаём список — это упорядоченная коллекция.',
              'Потом превращаем его во множество, чтобы убрать повторы.',
              'После этого собираем словарь, где ключ — значение, а значение — его частота.',
            ],
            mistakes: [
              'Путают list и set: список хранит повторы и порядок, множество — нет. Решение: проговорить сценарий использования до кода.',
              'Забывают, что tuple неизменяем. Решение: всё, что нужно менять, хранить в list.',
              'Используют dict как список. Решение: помнить, что dict нужен для доступа по ключу.',
            ],
            interview: [
              { question: 'Когда брать list, а когда set?', answer: 'list — когда важен порядок и повторы; set — когда важна уникальность и быстрый membership-check.' },
              { question: 'Почему dict так часто используется в ML-пайплайнах?', answer: 'Потому что позволяет быстро маппить признаки, категории и промежуточные состояния по ключу.' },
              { question: 'Что нужно знать джуну по этой теме обязательно?', answer: 'Типы данных, операции с коллекциями, срезы, циклы, условия и базовые преобразования.' },
            ],
            formulas: ['len(collection)', 'value in collection', 'dict[key] = value'],
            extraTerms: ['мутабельность', 'хешируемость', 'итерация'],
            quizQuestions: makeQuiz('python-basics', 'Переменные, типы и базовые коллекции', ['len(collection)', 'value in collection', 'dict[key] = value'], 'Python'),
            codeTasks: makeCodeTasks('python-basics', 'Переменные, типы и базовые коллекции'),
          }),
          makeTheme({
            id: 'python-control-flow',
            title: 'Условия, циклы и функции',
            summary: 'Вместо множества мелких блоков тема собрана вокруг трёх вещей: ветвление, повторение и переиспользуемый код.',
            level: 'junior',
            terminology: ['if / elif / else', 'for / while', 'def, return, аргументы'],
            simpleExplanation: 'Вы учитесь принимать решения в коде, повторять действия и упаковывать логику в функцию.',
            usage: [
              'Нужно для проверки порогов, фильтрации данных и написания функций-помощников.',
              'Используется в любых задачах на парсинг входа и обработку массивов.',
              'Лежит в основе ручной реализации многих ML-алгоритмов на учебном уровне.',
            ],
            realLifeExample: 'Если клиент сделал больше 5 покупок — отправить премиум-оффер; иначе — стандартный. Это обычное условие if/else.',
            codeExample: "def count_high(values, threshold):\n    total = 0\n    for value in values:\n        if value >= threshold:\n            total += 1\n    return total\n\nprint(count_high([1, 4, 5, 2], 3))",
            codeExplanation: [
              'Функция получает массив и порог, чтобы переиспользовать одну и ту же логику много раз.',
              'Цикл проходит по каждому элементу.',
              'Условие решает, нужно ли увеличивать счётчик.',
              'return отдаёт готовый результат наружу.',
            ],
            mistakes: [
              'Путают отступы и получают синтаксические ошибки. Решение: помнить, что в Python блоки задаются отступами.',
              'Забывают return и получают None. Решение: всегда проверять, что функция действительно возвращает результат.',
              'Выбирают while там, где проще for. Решение: для обхода готовой коллекции начинать с for.',
            ],
            interview: [
              { question: 'Чем отличается for от while?', answer: 'for используют для обхода известной последовательности, while — пока выполняется условие.' },
              { question: 'Зачем выносить код в функцию?', answer: 'Чтобы избежать дублирования, тестировать куски логики и легче читать программу.' },
              { question: 'Какая самая частая ошибка джуна в функциях?', answer: 'Отсутствие return или изменение внешнего состояния без необходимости.' },
            ],
            formulas: ['if condition: ...', 'for item in items: ...', 'def function(args): return result'],
            extraTerms: ['ветвление', 'итерация', 'область видимости'],
            quizQuestions: makeQuiz('python-control-flow', 'Условия, циклы и функции', ['if condition', 'for item in items', 'def function'], 'Python'),
            codeTasks: makeCodeTasks('python-control-flow', 'Условия, циклы и функции'),
          }),
        ],
      },
      {
        id: 'python-data-practice',
        title: 'Практика Python для данных',
        order: 2,
        description: 'Подблок, где Python сразу связывается с обработкой табличных и числовых данных.',
        themes: [
          makeTheme({
            id: 'python-stdin',
            title: 'Ввод, вывод и парсинг данных',
            summary: 'Тема объединяет всё, что нужно для решения задач формата stdin→stdout и написания простых обработчиков данных.',
            level: 'junior',
            terminology: ['stdin', 'stdout', 'input()', 'print()', 'map()', 'split()'],
            simpleExplanation: 'Вы учитесь превращать сырой текстовый ввод в числа, списки и структурированные данные.',
            usage: [
              'Нужно для кодовых задач и автоматической проверки решений.',
              'Полезно для загрузки простых данных до перехода к pandas.',
              'Помогает уверенно проходить технические секции на начальном уровне.',
            ],
            realLifeExample: 'API или лог-файл тоже часто приходят как сырой текст; сначала их нужно распарсить, и только потом анализировать.',
            codeExample: "n = int(input())\nvalues = list(map(float, input().split()))\nprint(sum(values) / n)",
            codeExplanation: [
              'Первая строка читает размер входных данных.',
              'Вторая строка разбивает текст по пробелам и превращает части в числа.',
              'Дальше мы считаем нужную статистику и выводим результат.',
            ],
            mistakes: [
              'Не приводят строки к int/float. Решение: после input() сразу думать про нужный тип.',
              'Путают количество элементов и реальную длину списка. Решение: валидировать вход через len().',
              'Форматируют вывод не так, как ожидает checker. Решение: внимательно читать output format.',
            ],
            interview: [
              { question: 'Зачем в курсе отдельно тренировать stdin→stdout?', answer: 'Это развивает алгоритмическую дисциплину и уверенность в обработке входных данных.' },
              { question: 'Что делает map(int, input().split())?', answer: 'Берёт строку, делит её по пробелам и преобразует каждый токен в целое число.' },
              { question: 'Какая ошибка тут самая частая?', answer: 'Забыть преобразование типов и пытаться считать сумму строк.' },
            ],
            formulas: ['list(map(int, input().split()))', 'print(result)', 'round(value, 2)'],
            extraTerms: ['формат ввода', 'формат вывода', 'валидация'],
            quizQuestions: makeQuiz('python-stdin', 'Ввод, вывод и парсинг данных', ['list(map(int, input().split()))', 'print(result)', 'round(value, 2)'], 'Python'),
            codeTasks: makeCodeTasks('python-stdin', 'Ввод, вывод и парсинг данных'),
          }),
          makeTheme({
            id: 'python-collections',
            title: 'Списки, словари и множества в задачах на данные',
            summary: 'Тема собрана вокруг практического выбора структуры данных под задачу, а не вокруг разрозненных определений.',
            level: 'junior+',
            terminology: ['append', 'get', 'items', 'set()', 'list comprehension'],
            simpleExplanation: 'Вы выбираете правильную структуру данных под задачу: последовательность, уникальность или ключ-значение.',
            usage: [
              'Используется при подсчёте частот, фильтрации уникальных объектов и агрегации признаков.',
              'Нужен в ETL, предобработке и простых feature engineering задачах.',
              'Часто встречается на квизах и кодовых заданиях junior уровня.',
            ],
            realLifeExample: 'Чтобы посчитать, сколько раз каждый товар купили за день, удобнее всего использовать словарь-счётчик.',
            codeExample: "events = ['A', 'B', 'A', 'C']\ncounts = {}\nfor event in events:\n    counts[event] = counts.get(event, 0) + 1\nprint(counts)",
            codeExplanation: [
              'Перебираем события по одному.',
              'Через dict.get берём текущее значение счётчика или 0, если ключа ещё нет.',
              'Прибавляем единицу и записываем обратно.',
            ],
            mistakes: [
              'Пытаются искать уникальные значения через длинные циклы вместо set. Решение: сначала подумать о свойствах структуры.',
              'Используют dict[key] без проверки и получают KeyError. Решение: применять get или defaultdict.',
              'Смешивают типы ключей. Решение: держать ключи единообразными.',
            ],
            interview: [
              { question: 'Когда set лучше list?', answer: 'Когда нужно убрать дубликаты или быстро проверить принадлежность элемента.' },
              { question: 'Зачем нужен dict.get?', answer: 'Чтобы безопасно читать значение по ключу и задавать дефолт.' },
              { question: 'Что из этого важнее всего для джуна?', answer: 'Уметь быстро выбрать подходящую структуру данных и объяснить выбор.' },
            ],
            formulas: ['counts[key] = counts.get(key, 0) + 1', 'unique_values = set(values)', '[x for x in values if condition]'],
            extraTerms: ['частотный словарь', 'membership check', 'comprehension'],
            quizQuestions: makeQuiz('python-collections', 'Списки, словари и множества в задачах на данные', ['counts[key] = counts.get(key, 0) + 1', 'unique_values = set(values)', '[x for x in values if condition]'], 'Python'),
            codeTasks: makeCodeTasks('python-collections', 'Списки, словари и множества в задачах на данные'),
          }),
        ],
      },
    ],
  },
  {
    id: 'data-analysis',
    title: 'Анализ данных и подготовка признаков',
    order: 2,
    icon: '📊',
    description: 'Следующий этап после Python: научиться работать с массивами, таблицами и подготовкой данных.',
    subblocks: [
      {
        id: 'numpy-pandas',
        title: 'NumPy и pandas',
        order: 1,
        description: 'Основа для табличных и численных операций.',
        themes: [
          makeTheme({
            id: 'numpy-arrays',
            title: 'NumPy: массивы, shape и векторизация',
            summary: 'Тема концентрируется на том, как думать массивами и почему это быстрее циклов.',
            level: 'junior',
            terminology: ['ndarray', 'shape', 'dtype', 'векторизация'],
            simpleExplanation: 'NumPy позволяет применять операции сразу ко всему массиву, а не по одному элементу вручную.',
            usage: [
              'Используется для матричных вычислений, подготовки признаков и линейной алгебры.',
              'Нужен, когда хочется писать быстрее и короче, чем чистыми циклами Python.',
              'Постоянно встречается при работе со sklearn и нейросетевыми тензорами.',
            ],
            realLifeExample: 'Если у вас есть зарплаты 10 000 сотрудников и вы хотите поднять все на 5%, проще умножить весь массив сразу.',
            codeExample: "import numpy as np\narr = np.array([1, 2, 3, 4])\nscaled = arr * 1.5\nprint(arr.shape)\nprint(scaled)",
            codeExplanation: [
              'Создаём ndarray из списка.',
              'Применяем умножение ко всем элементам сразу — это и есть векторизация.',
              'shape показывает размерность массива.',
            ],
            mistakes: [
              'Путают shape и len. Решение: помнить, что shape даёт размеры по осям.',
              'Делают циклы там, где можно одну векторную операцию. Решение: сначала искать решение на уровне массива.',
              'Забывают про dtype и неожиданно получают строки вместо чисел. Решение: проверять тип данных массива.',
            ],
            interview: [
              { question: 'Почему NumPy быстрее обычных циклов?', answer: 'Потому что хранит данные компактно и выполняет операции в оптимизированном C-коде.' },
              { question: 'Что такое shape?', answer: 'Это кортеж, описывающий размеры массива по каждой оси.' },
              { question: 'Что джун должен уметь здесь обязательно?', answer: 'Создавать массивы, читать shape, делать базовые операции и понимать векторизацию.' },
            ],
            formulas: ['array.shape', 'array.mean()', 'scaled = (x - min) / (max - min)'],
            extraTerms: ['broadcasting', 'ось', 'поэлементная операция'],
            quizQuestions: makeQuiz('numpy-arrays', 'NumPy: массивы, shape и векторизация', ['array.shape', 'array.mean()', 'scaled = (x - min) / (max - min)'], 'анализе данных'),
            codeTasks: makeCodeTasks('numpy-arrays', 'NumPy: массивы, shape и векторизация'),
          }),
          makeTheme({
            id: 'pandas-basics',
            title: 'pandas: DataFrame, фильтрация и groupby',
            summary: 'Тема объединяет самые полезные для джуна операции с таблицами в один компактный модуль.',
            level: 'junior',
            terminology: ['DataFrame', 'Series', 'loc', 'groupby', 'agg'],
            simpleExplanation: 'pandas — это таблица с удобными инструментами для фильтрации, агрегации и анализа данных.',
            usage: [
              'Используется в EDA и предобработке перед обучением модели.',
              'Позволяет быстро считать статистики по группам и искать проблемы в данных.',
              'Часто фигурирует в тестовых заданиях и реальной ежедневной работе аналитика/ML junior.',
            ],
            realLifeExample: 'Если нужно узнать средний чек по каждому городу, DataFrame и groupby делают это за пару строк.',
            codeExample: "import pandas as pd\ndf = pd.DataFrame({'city': ['MSK', 'SPB', 'MSK'], 'sales': [10, 7, 13]})\nresult = df.groupby('city')['sales'].mean()\nprint(result)",
            codeExplanation: [
              'Создаём таблицу с двумя колонками.',
              'groupby собирает строки по городу.',
              'mean считает среднее значение продаж в каждой группе.',
            ],
            mistakes: [
              'Путают loc и iloc. Решение: loc — по меткам, iloc — по позициям.',
              'Применяют apply там, где есть готовая векторная операция. Решение: сначала искать встроенный метод.',
              'Забывают проверить пропуски до агрегаций. Решение: начинать с isna()/info().',
            ],
            interview: [
              { question: 'Зачем нужен groupby?', answer: 'Чтобы агрегировать данные по категориям и быстро получать статистики.' },
              { question: 'Как объяснить DataFrame простыми словами?', answer: 'Это таблица с колонками, фильтрами и операциями над ними.' },
              { question: 'Что нужно знать джуну обязательно?', answer: 'Создание DataFrame, выбор колонок, фильтрацию, groupby и работу с пропусками.' },
            ],
            formulas: ["df[df['col'] > value]", "df.groupby('key').agg(metric)", "df['col'].fillna(value)"],
            extraTerms: ['табличные данные', 'агрегация', 'маска фильтрации'],
            quizQuestions: makeQuiz('pandas-basics', 'pandas: DataFrame, фильтрация и groupby', ["df[df['col'] > value]", "df.groupby('key').agg(metric)", "df['col'].fillna(value)"], 'анализе данных'),
            codeTasks: makeCodeTasks('pandas-basics', 'pandas: DataFrame, фильтрация и groupby'),
          }),
        ],
      },
      {
        id: 'feature-prep',
        title: 'Подготовка признаков',
        order: 2,
        description: 'Практики, без которых модель обычно не взлетает.',
        themes: [
          makeTheme({
            id: 'missing-scaling',
            title: 'Пропуски, выбросы и масштабирование',
            summary: 'Вместо разрозненных тем всё собрано вокруг вопроса: как подготовить числовой признак к модели.',
            level: 'junior+',
            terminology: ['NaN', 'импутация', 'выброс', 'StandardScaler', 'MinMaxScaler'],
            simpleExplanation: 'Тема учит сначала очистить данные, потом привести их к удобному для модели масштабу.',
            usage: [
              'Нужна перед линейными моделями, KNN, SVM и нейросетями.',
              'Помогает не сломать метрики и не получить нестабильное обучение.',
              'Даёт базу для осмысленного feature engineering.',
            ],
            realLifeExample: 'Если зарплаты в рублях, а возраст в годах, то без масштабирования признаки будут иметь разный “вес” просто из-за масштаба чисел.',
            codeExample: "values = [10, 12, 14, 1000]\nclean = [v for v in values if v < 100]\nmean_value = sum(clean) / len(clean)\nscaled = [(x - min(clean)) / (max(clean) - min(clean)) for x in clean]\nprint(mean_value)\nprint(scaled)",
            codeExplanation: [
              'Сначала убираем очевидный выброс для демонстрации идеи.',
              'Затем считаем статистику на очищенных данных.',
              'После этого применяем простое min-max масштабирование.',
            ],
            mistakes: [
              'Делают fit scaler на всех данных сразу. Решение: fit только на train.',
              'Заполняют пропуски без понимания природы признака. Решение: сначала изучить распределение и бизнес-смысл.',
              'Игнорируют выбросы и удивляются плохим коэффициентам. Решение: проверять квантильные и графические признаки аномалий.',
            ],
            interview: [
              { question: 'Когда нужен StandardScaler?', answer: 'Когда важны среднее и стандартное отклонение, например для линейных моделей, SVM и KNN.' },
              { question: 'Почему опасно считать статистики до split?', answer: 'Это data leakage: модель получает информацию из будущего теста.' },
              { question: 'Что обязательно должен знать джун?', answer: 'Стратегии импутации, идею выбросов и разницу между StandardScaler и MinMaxScaler.' },
            ],
            formulas: ['z = (x - μ) / σ', 'x_scaled = (x - min) / (max - min)', 'IQR = Q3 - Q1'],
            extraTerms: ['data leakage', 'квантиль', 'робастность'],
            quizQuestions: makeQuiz('missing-scaling', 'Пропуски, выбросы и масштабирование', ['z = (x - μ) / σ', 'x_scaled = (x - min) / (max - min)', 'IQR = Q3 - Q1'], 'подготовке данных'),
            codeTasks: makeCodeTasks('missing-scaling', 'Пропуски, выбросы и масштабирование'),
          }),
          makeTheme({
            id: 'encoding-features',
            title: 'Категориальные признаки и базовый feature engineering',
            summary: 'Тема объединяет кодирование категорий и создание простых полезных признаков.',
            level: 'junior+',
            terminology: ['Label Encoding', 'One-Hot Encoding', 'частотный признак', 'бинарный признак'],
            simpleExplanation: 'Модель не понимает строки напрямую, поэтому категории нужно превратить в числа без потери смысла.',
            usage: [
              'Нужно почти в любой табличной ML-задаче.',
              'Используется в кредитном скоринге, маркетинге, рекомендациях и антифроде.',
              'Помогает сделать исходные данные удобными для алгоритма.',
            ],
            realLifeExample: 'Город клиента нельзя просто сложить с возрастом, поэтому сначала категории переводят в кодированный формат.',
            codeExample: "cities = ['MSK', 'SPB', 'MSK']\nunique = sorted(set(cities))\ncity_to_id = {city: idx for idx, city in enumerate(unique)}\nencoded = [city_to_id[city] for city in cities]\nprint(encoded)",
            codeExplanation: [
              'Находим уникальные категории.',
              'Строим отображение категория → число.',
              'Преобразуем исходный список категорий в числовой вид.',
            ],
            mistakes: [
              'Используют Label Encoding для линейной модели как будто категории упорядочены. Решение: для номинальных категорий чаще брать One-Hot.',
              'Создают слишком много признаков без проверки пользы. Решение: каждый новый признак должен иметь гипотезу.',
              'Не обрабатывают unseen category на тесте. Решение: закладывать safe fallback в пайплайн.',
            ],
            interview: [
              { question: 'Когда One-Hot лучше Label Encoding?', answer: 'Когда категории номинальные и между ними нет порядка.' },
              { question: 'Что такое feature engineering простыми словами?', answer: 'Это создание признаков, которые помогают модели увидеть полезную структуру данных.' },
              { question: 'Что должен знать джун по этой теме?', answer: 'Базовые способы кодирования и идею, что признак создают под гипотезу, а не ради количества.' },
            ],
            formulas: ['one_hot(category)', 'label_id = mapping[category]', 'feature = value_1 / value_2'],
            extraTerms: ['кардинальность', 'номинальный признак', 'упорядоченный признак'],
            quizQuestions: makeQuiz('encoding-features', 'Категориальные признаки и базовый feature engineering', ['one_hot(category)', 'label_id = mapping[category]', 'feature = value_1 / value_2'], 'подготовке данных'),
            codeTasks: makeCodeTasks('encoding-features', 'Категориальные признаки и базовый feature engineering'),
          }),
        ],
      },
    ],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    order: 3,
    icon: '🤖',
    description: 'После Python и подготовки данных идём в supervised ML: модели, метрики и ансамбли.',
    subblocks: [
      {
        id: 'supervised',
        title: 'Обучение с учителем',
        order: 1,
        description: 'Линейные модели и метрики, без которых нельзя уверенно двигаться дальше.',
        themes: [
          makeTheme({
            id: 'linear-regression',
            title: 'Линейная регрессия и MSE',
            summary: 'Тема объединяет модель, функцию потерь и интерпретацию коэффициентов в один блок.',
            level: 'junior',
            terminology: ['признак', 'таргет', 'коэффициент', 'bias', 'MSE'],
            simpleExplanation: 'Модель пытается провести линию или плоскость, которая лучше всего приближает целевое значение.',
            usage: [
              'Используется для прогнозирования числовых значений: цены, спроса, времени, выручки.',
              'Даёт понятный baseline и хороша для объяснимых задач.',
              'Помогает понять базовые идеи оптимизации и ошибок модели.',
            ],
            realLifeExample: 'Можно оценивать цену квартиры по площади, району и количеству комнат.',
            codeExample: "x = [1, 2, 3]\ny = [2, 4, 6]\n# простая идея: y_hat = w * x\nw = 2\npred = [w * value for value in x]\nmse = sum((p - t) ** 2 for p, t in zip(pred, y)) / len(y)\nprint(mse)",
            codeExplanation: [
              'Берём простой коэффициент w, который масштабирует признак x.',
              'Считаем предсказания по формуле линейной модели.',
              'Сравниваем предсказания с истинными ответами через MSE.',
            ],
            mistakes: [
              'Считают только train error и не смотрят на качество на новых данных. Решение: всегда делать split.',
              'Не масштабируют признаки перед регуляризованными линейными моделями. Решение: включать preprocessing в pipeline.',
              'Путают интерпретацию коэффициента и причинность. Решение: коэффициент — не доказательство причины.',
            ],
            interview: [
              { question: 'Что такое MSE?', answer: 'Средняя квадратичная ошибка: она сильнее штрафует большие промахи.' },
              { question: 'Почему линейная регрессия полезна джуну?', answer: 'Это понятный baseline и удобная модель для объяснения связи признаков и таргета.' },
              { question: 'Как интерпретировать коэффициент?', answer: 'При прочих равных на сколько меняется предсказание при увеличении признака на единицу.' },
            ],
            formulas: ['ŷ = w₀ + w₁x₁ + ... + wₙxₙ', 'MSE = (1 / n) * Σ(ŷ - y)²', 'RMSE = √MSE'],
            extraTerms: ['baseline', 'остаток', 'обобщающая способность'],
            lossFunctions: ['MSE = (1 / n) * Σ(ŷ - y)²', 'MAE = (1 / n) * Σ|ŷ - y|'],
            quizQuestions: makeQuiz('linear-regression', 'Линейная регрессия и MSE', ['ŷ = w₀ + w₁x₁ + ... + wₙxₙ', 'MSE = (1 / n) * Σ(ŷ - y)²', 'RMSE = √MSE'], 'машинном обучении'),
            codeTasks: makeCodeTasks('linear-regression', 'Линейная регрессия и MSE'),
          }),
          makeTheme({
            id: 'logreg-metrics',
            title: 'Логистическая регрессия, precision, recall и F1',
            summary: 'Здесь в одну тему собраны модель для классификации и метрики, которыми её действительно оценивают.',
            level: 'junior',
            terminology: ['логит', 'сигмоида', 'порог', 'precision', 'recall', 'F1'],
            simpleExplanation: 'Модель оценивает вероятность класса, а вы выбираете порог и смотрите, насколько хорошие решения она принимает.',
            usage: [
              'Используется в антифроде, медицине, churn prediction и кредитном скоринге.',
              'Подходит как интерпретируемый baseline для бинарной классификации.',
              'Даёт базу для понимания probabilistic output и порогов.',
            ],
            realLifeExample: 'При выявлении мошеннических транзакций можно повышать recall, чтобы не пропустить больше опасных операций.',
            codeExample: "tp, fp, fn = 30, 10, 5\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nf1 = 2 * precision * recall / (precision + recall)\nprint(round(f1, 3))",
            codeExplanation: [
              'Сначала берём элементы confusion matrix.',
              'Потом считаем precision — насколько чисты найденные позитивы.',
              'Дальше recall — сколько позитивов мы нашли вообще.',
              'Наконец F1 объединяет обе характеристики в одну.',
            ],
            mistakes: [
              'Смотрят только на accuracy при дисбалансе классов. Решение: анализировать precision/recall/F1.',
              'Жёстко ставят порог 0.5 без проверки бизнес-цены ошибок. Решение: подбирать threshold под задачу.',
              'Не понимают trade-off между precision и recall. Решение: разбирать кейс и стоимость FP/FN.',
            ],
            interview: [
              { question: 'Когда важнее recall, чем precision?', answer: 'Когда критично не пропустить положительный случай, например в медицине или антифроде.' },
              { question: 'Что делает сигмоида?', answer: 'Преобразует логит в вероятность в диапазоне от 0 до 1.' },
              { question: 'Что обязательно знать джуну?', answer: 'Confusion matrix, порог, precision, recall, F1 и базовую идею логистической регрессии.' },
            ],
            formulas: ['σ(z) = 1 / (1 + e^(-z))', 'Precision = TP / (TP + FP)', 'Recall = TP / (TP + FN)', 'F1 = 2PR / (P + R)'],
            extraTerms: ['confusion matrix', 'false positive', 'false negative'],
            lossFunctions: ['LogLoss = -[y log p + (1 - y) log(1 - p)]'],
            activationFunctions: ['Sigmoid = 1 / (1 + e^(-z))'],
            quizQuestions: makeQuiz('logreg-metrics', 'Логистическая регрессия, precision, recall и F1', ['σ(z) = 1 / (1 + e^(-z))', 'Precision = TP / (TP + FP)', 'Recall = TP / (TP + FN)', 'F1 = 2PR / (P + R)'], 'машинном обучении'),
            codeTasks: makeCodeTasks('logreg-metrics', 'Логистическая регрессия, precision, recall и F1'),
          }),
        ],
      },
      {
        id: 'trees-ensembles',
        title: 'Деревья и ансамбли',
        order: 2,
        description: 'Следующий шаг после линейных моделей: нелинейность и ансамбли.',
        themes: [
          makeTheme({
            id: 'decision-trees',
            title: 'Деревья решений и критерии разбиения',
            summary: 'Тема сводит вместе дерево, правила split и интерпретируемость модели.',
            level: 'junior+',
            terminology: ['узел', 'лист', 'split', 'Gini', 'entropy', 'depth'],
            simpleExplanation: 'Дерево задаёт последовательность вопросов и шаг за шагом делит данные на всё более однородные части.',
            usage: [
              'Используется в скоринге, CRM, сегментации клиентов и как база для ансамблей.',
              'Хорошо подходит, когда хочется простую интерпретацию правилами.',
              'Нужен для понимания Random Forest и boosting.',
            ],
            realLifeExample: 'Банк может сначала спросить про доход, потом про просрочки и на основе веток прийти к решению по заявке.',
            codeExample: "gini_left = 1 - (0.8 ** 2 + 0.2 ** 2)\ngini_right = 1 - (0.3 ** 2 + 0.7 ** 2)\nweighted = 0.5 * gini_left + 0.5 * gini_right\nprint(round(weighted, 3))",
            codeExplanation: [
              'Считаем неоднородность левого и правого узла.',
              'Дальше берём взвешенную сумму по размерам узлов.',
              'Так дерево выбирает более “чистое” разбиение.',
            ],
            mistakes: [
              'Делают дерево слишком глубоким и получают переобучение. Решение: ограничивать depth и min samples.',
              'Не проверяют качество сплита на валидации. Решение: смотреть на val metric.',
              'Путают интерпретируемость одного дерева и ансамбля деревьев. Решение: объяснять их отдельно.',
            ],
            interview: [
              { question: 'Что такое Gini простыми словами?', answer: 'Это мера “смешанности” классов в узле: чем меньше, тем узел чище.' },
              { question: 'Почему дерево может переобучаться?', answer: 'Потому что при большой глубине оно запоминает шум и частные случаи.' },
              { question: 'Что должен знать джун?', answer: 'Как дерево строит split, что такое Gini/entropy и как бороться с overfitting.' },
            ],
            formulas: ['Gini = 1 - Σ pₖ²', 'Entropy = -Σ pₖ log pₖ', 'Weighted split score = Σ(weightᵢ · impurityᵢ)'],
            extraTerms: ['чистота узла', 'жадный алгоритм', 'обрезка дерева'],
            quizQuestions: makeQuiz('decision-trees', 'Деревья решений и критерии разбиения', ['Gini = 1 - Σ pₖ²', 'Entropy = -Σ pₖ log pₖ', 'Weighted split score = Σ(weightᵢ · impurityᵢ)'], 'машинном обучении'),
            codeTasks: makeCodeTasks('decision-trees', 'Деревья решений и критерии разбиения'),
          }),
          makeTheme({
            id: 'bagging-boosting',
            title: 'Бэггинг, Random Forest и градиентный бустинг',
            summary: 'Тема объясняет ансамбли через главный вопрос: как несколько слабых/простых моделей дают лучший итог.',
            level: 'junior+',
            terminology: ['bagging', 'bootstrap', 'Random Forest', 'boosting', 'learning rate'],
            simpleExplanation: 'Ансамбль берёт несколько моделей и объединяет их так, чтобы ошибки одной компенсировались другими.',
            usage: [
              'Это один из самых частых реальных baseline/production классов моделей на табличных данных.',
              'Используется в скоринге, рекомендациях, прогнозах и маркетинговых моделях.',
              'Часто является первым сильным решением после линейных моделей.',
            ],
            realLifeExample: 'Если спросить мнение не у одного эксперта, а у десяти и усреднить ответы, итог часто будет стабильнее.',
            codeExample: "tree_preds = [10, 12, 11, 13]\nensemble_pred = sum(tree_preds) / len(tree_preds)\nprint(ensemble_pred)",
            codeExplanation: [
              'Каждое дерево даёт своё предсказание.',
              'В bagging/Random Forest мы агрегируем эти ответы, например усредняем.',
              'За счёт этого итоговое предсказание становится стабильнее.',
            ],
            mistakes: [
              'Путают bagging и boosting. Решение: bagging — параллельные модели, boosting — последовательное исправление ошибок.',
              'Ставят слишком большой learning rate в бустинге. Решение: уменьшать шаг и компенсировать числом деревьев.',
              'Думают, что ансамбль всегда лучше по всем критериям. Решение: помнить про скорость и интерпретируемость.',
            ],
            interview: [
              { question: 'Чем bagging отличается от boosting?', answer: 'Bagging снижает variance через усреднение независимых моделей, boosting последовательно уменьшает bias, исправляя ошибки.' },
              { question: 'Почему Random Forest устойчив?', answer: 'Потому что строит много разных деревьев на bootstrap-выборках и случайных подмножествах признаков.' },
              { question: 'Что джун должен уметь объяснить?', answer: 'Идею bagging, Random Forest, boosting и trade-off между качеством, скоростью и интерпретируемостью.' },
            ],
            formulas: ['ensemble = mean(predictions)', 'bootstrap sample ~ выборка с возвращением', 'new_model = old_model + η · weak_learner'],
            extraTerms: ['variance reduction', 'weak learner', 'feature subsampling'],
            lossFunctions: ['Boosting minimizes differentiable loss step-by-step'],
            quizQuestions: makeQuiz('bagging-boosting', 'Бэггинг, Random Forest и градиентный бустинг', ['ensemble = mean(predictions)', 'bootstrap sample ~ выборка с возвращением', 'new_model = old_model + η · weak_learner'], 'машинном обучении'),
            codeTasks: makeCodeTasks('bagging-boosting', 'Бэггинг, Random Forest и градиентный бустинг'),
          }),
        ],
      },
    ],
  },
  {
    id: 'interview-prep',
    title: 'Подготовка к собеседованию',
    order: 4,
    icon: '🎤',
    description: 'Финальный блок: связываем темы в целостную картину и готовим ответы для junior ML.',
    subblocks: [
      {
        id: 'workflow',
        title: 'ML workflow',
        order: 1,
        description: 'Как мыслить проектом, а не отдельной библиотекой.',
        themes: [
          makeTheme({
            id: 'ml-workflow',
            title: 'Постановка задачи, baseline и валидация',
            summary: 'Тема собирает в одно место постановку задачи, выбор метрики, baseline и правильную проверку качества.',
            level: 'junior',
            terminology: ['business goal', 'target metric', 'baseline', 'train/valid/test split'],
            simpleExplanation: 'Сначала нужно понять, что именно бизнес хочет улучшить, потом выбрать простую стартовую модель и честно измерить результат.',
            usage: [
              'Используется в любом реальном ML-проекте до выбора “модной” модели.',
              'Помогает не тратить время на сложный алгоритм без понятной отправной точки.',
              'На собеседовании показывает зрелое понимание процесса.',
            ],
            realLifeExample: 'Если бизнес хочет сократить отток клиентов, сначала надо договориться, что именно считать успехом: recall на группе риска, lift кампании или деньги.',
            codeExample: "train_size = 0.7\nvalid_size = 0.15\ntest_size = 0.15\nprint(train_size + valid_size + test_size)",
            codeExplanation: [
              'Мы заранее делим данные на части с разной ролью.',
              'train нужен для обучения, valid — для выбора модели, test — для финальной честной оценки.',
              'Baseline нужен, чтобы понять, есть ли реальный прогресс.',
            ],
            mistakes: [
              'Прыгают сразу к сложной модели без baseline. Решение: сначала простое решение и понятная метрика.',
              'Смешивают валидацию и тест. Решение: test трогать только в самом конце.',
              'Меряют не ту метрику, что нужна бизнесу. Решение: сначала переводить задачу в деньги/риск/ценность.',
            ],
            interview: [
              { question: 'Зачем нужен baseline?', answer: 'Чтобы была точка отсчёта и было понятно, даёт ли сложная модель реальный выигрыш.' },
              { question: 'Чем отличается validation от test?', answer: 'Validation используется во время выбора модели, test — только для финальной оценки.' },
              { question: 'Что важно знать джуну?', answer: 'Как поставить задачу, выбрать метрику, сделать split и объяснить baseline.' },
            ],
            formulas: ['train / valid / test', 'baseline < candidate model', 'metric ↔ business impact'],
            extraTerms: ['data leakage', 'hold-out', 'offline evaluation'],
            quizQuestions: makeQuiz('ml-workflow', 'Постановка задачи, baseline и валидация', ['train / valid / test', 'baseline < candidate model', 'metric ↔ business impact'], 'ML workflow'),
            codeTasks: makeCodeTasks('ml-workflow', 'Постановка задачи, baseline и валидация'),
          }),
          makeTheme({
            id: 'junior-interview',
            title: 'Типовые вопросы junior ML и карта повторения',
            summary: 'Финальная тема собирает базовые вопросы по Python, данным, метрикам и моделям в единый маршрут повторения.',
            level: 'junior',
            terminology: ['baseline', 'overfitting', 'regularization', 'precision/recall', 'feature engineering'],
            simpleExplanation: 'Это повторение того, что junior чаще всего должен уметь быстро и понятно объяснить на интервью.',
            usage: [
              'Используется для повторения перед собеседованием и для самопроверки пробелов.',
              'Помогает связать все темы в единую историю обучения.',
              'Даёт понятный чеклист: что уже умею, а что ещё нет.',
            ],
            realLifeExample: 'На интервью редко спрашивают “знаешь ли библиотеку”, чаще просят объяснить логику выбора модели и разобрать типичные ошибки.',
            codeExample: "topics = ['Python', 'EDA', 'Regression', 'Metrics']\nfor topic in topics:\n    print(f'Repeat: {topic}')",
            codeExplanation: [
              'Мы формируем список ключевых тем для повторения.',
              'Цикл помогает пройтись по ним как по чеклисту.',
              'Так же стоит строить и личную подготовку к интервью.',
            ],
            mistakes: [
              'Учат определения, но не умеют объяснить простыми словами. Решение: на каждую тему иметь бытовой пример.',
              'Не могут связать метрику с бизнес-задачей. Решение: к каждой метрике придумать цену ошибки.',
              'Путаются в терминологии. Решение: держать отдельную страницу терминов и формул.',
            ],
            interview: [
              { question: 'Как отвечать на вопрос “расскажите про модель”?', answer: 'Через структуру: что делает, где применяется, плюсы/минусы, типичные ошибки и пример кода.' },
              { question: 'Что важнее для junior: глубина или структура ответа?', answer: 'Сначала структура и ясность, потом уже глубина там, где её просят.' },
              { question: 'Как понять, что тема закрыта?', answer: 'Если можешь объяснить терминологию, показать код, разобрать ошибки и ответить на базовые интервью-вопросы.' },
            ],
            formulas: ['ответ = термин + простое объяснение + кейс + код + ошибки', 'quality = знание + понимание + применение'],
            extraTerms: ['storytelling', 'структура ответа', 'самопроверка'],
            quizQuestions: makeQuiz('junior-interview', 'Типовые вопросы junior ML и карта повторения', ['ответ = термин + простое объяснение + кейс + код + ошибки', 'quality = знание + понимание + применение'], 'подготовке к интервью'),
            codeTasks: makeCodeTasks('junior-interview', 'Типовые вопросы junior ML и карта повторения'),
          }),
        ],
      },
    ],
  },
]

function collectCheatsheet(items: string[][]): string[] {
  return Array.from(new Set(items.flat()))
}

export const courseBlocks: Block[] = blockSeeds.map((block) => ({
  ...block,
  subblocks: block.subblocks.map((subblock) => ({
    ...subblock,
    themes: subblock.themes.map((theme, themeIndex) => ({ ...theme, order: themeIndex + 1 })),
    cheatsheet: collectCheatsheet(subblock.themes.map((theme) => theme.themeCheatsheet)),
  })),
  cheatsheet: collectCheatsheet(block.subblocks.flatMap((subblock) => subblock.themes.map((theme) => theme.themeCheatsheet))),
}))

export const allThemes = courseBlocks.flatMap((block) =>
  block.subblocks.flatMap((subblock) =>
    subblock.themes.map((theme) => ({
      ...theme,
      blockId: block.id,
      blockTitle: block.title,
      blockIcon: block.icon,
      subblockId: subblock.id,
      subblockTitle: subblock.title,
    })),
  ),
)

export const totalSteps = allThemes.reduce((sum, theme) => sum + theme.steps.length, 0)
export const totalQuizQuestions = allThemes.reduce((sum, theme) => sum + theme.quizQuestions.length, 0)
export const totalCodeTasks = allThemes.reduce((sum, theme) => sum + theme.codeTasks.length, 0)

export function getThemeById(themeId: string) {
  return allThemes.find((theme) => theme.id === themeId) ?? null
}

export function getPrevNextTheme(themeId: string) {
  const sorted = [...allThemes].sort((a, b) => {
    const aBlock = courseBlocks.find((block) => block.id === a.blockId)?.order ?? 0
    const bBlock = courseBlocks.find((block) => block.id === b.blockId)?.order ?? 0
    if (aBlock !== bBlock) return aBlock - bBlock
    const aSub = courseBlocks.find((block) => block.id === a.blockId)?.subblocks.find((sub) => sub.id === a.subblockId)?.order ?? 0
    const bSub = courseBlocks.find((block) => block.id === b.blockId)?.subblocks.find((sub) => sub.id === b.subblockId)?.order ?? 0
    if (aSub !== bSub) return aSub - bSub
    return a.order - b.order
  })
  const index = sorted.findIndex((theme) => theme.id === themeId)
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  }
}

export const referenceSections = courseBlocks.map((block) => ({
  blockId: block.id,
  blockTitle: block.title,
  terms: Array.from(new Set(block.subblocks.flatMap((subblock) => subblock.themes.flatMap((theme) => [...theme.terminology, ...theme.extraTerms])))),
  lossFunctions: Array.from(new Set(block.subblocks.flatMap((subblock) => subblock.themes.flatMap((theme) => theme.lossFunctions)))),
  activationFunctions: Array.from(new Set(block.subblocks.flatMap((subblock) => subblock.themes.flatMap((theme) => theme.activationFunctions)))),
  formulas: Array.from(new Set(block.subblocks.flatMap((subblock) => subblock.themes.flatMap((theme) => theme.formulas)))),
}))
