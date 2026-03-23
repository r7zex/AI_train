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
          makeTheme({
            id: 'python-comprehensions',
            title: 'Списковые, словарные и множественные включения, генераторы',
            summary: 'Тема показывает, как писать компактные и читаемые преобразования данных через comprehensions и ленивые генераторы.',
            level: 'junior+',
            terminology: ['list comprehension', 'dict comprehension', 'set comprehension', 'generator expression', 'yield'],
            simpleExplanation: 'Вместо длинного цикла с append вы пишете одну строку, которая описывает преобразование сразу и понятно.',
            usage: [
              'Используется для фильтрации и преобразования массивов данных в одну строку.',
              'Нужен при построении словарей-счётчиков, маппинге признаков и подготовке данных.',
              'Генераторы полезны для экономии памяти при обработке больших файлов.',
            ],
            realLifeExample: 'Если нужно отобрать из большого DataFrame только числовые признаки и нормализовать их, comprehension позволяет сделать это в одну строку.',
            codeExample: "numbers = [1, 2, 3, 4, 5]\nsquared_evens = [x ** 2 for x in numbers if x % 2 == 0]\nword_lengths = {word: len(word) for word in ['alpha', 'beta', 'gamma']}\ngen = (x ** 2 for x in range(1000))\nprint(squared_evens)\nprint(word_lengths)\nprint(next(gen))",
            codeExplanation: [
              'List comprehension фильтрует чётные числа и возводит их в квадрат за один проход.',
              'Dict comprehension строит словарь слово→длина без явного цикла.',
              'Generator expression создаёт ленивый итератор — элементы вычисляются по требованию, не занимая память.',
            ],
            mistakes: [
              'Пишут сложные вложенные comprehensions с несколькими условиями. Решение: если не читается с первого взгляда — лучше обычный цикл.',
              'Используют генератор там, где нужен список (например, при обращении по индексу). Решение: генератор нельзя индексировать, нужно явно list().',
              'Забывают, что генератор одноразовый: после исчерпания он пуст. Решение: при повторном использовании создавать заново.',
            ],
            interview: [
              { question: 'Чем генератор отличается от списка?', answer: 'Генератор вычисляет элементы лениво по запросу и не хранит всё в памяти, список хранит все элементы сразу.' },
              { question: 'Когда comprehension лучше обычного цикла?', answer: 'Когда логика простая и умещается в одно выражение без потери читаемости.' },
              { question: 'Что должен знать джун о comprehensions?', answer: 'Синтаксис list/dict/set comprehension, идею генераторных выражений и когда применять каждый вариант.' },
            ],
            formulas: ['[expr for item in iterable if condition]', '{key: val for item in iterable}', '(expr for item in iterable)'],
            extraTerms: ['ленивые вычисления', 'итерируемость', 'выражение-фильтр'],
            quizQuestions: makeQuiz('python-comprehensions', 'Списковые, словарные и множественные включения, генераторы', ['[expr for item in iterable if condition]', '{key: val for item in iterable}', '(expr for item in iterable)'], 'Python'),
            codeTasks: makeCodeTasks('python-comprehensions', 'Списковые, словарные и множественные включения, генераторы'),
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
          makeTheme({
            id: 'python-functional',
            title: 'Функциональный Python: map, filter, zip и lambda',
            summary: 'Тема собирает функциональные инструменты Python, которые часто встречаются в коде обработки данных.',
            level: 'junior+',
            terminology: ['map()', 'filter()', 'zip()', 'lambda', 'functools.reduce'],
            simpleExplanation: 'Функциональный стиль позволяет применять операцию к каждому элементу, отфильтровывать лишнее или склеивать несколько коллекций без явных циклов.',
            usage: [
              'map() используется для поэлементного преобразования коллекций, например приведения типов.',
              'filter() отбирает элементы по условию без явного цикла.',
              'zip() нужен для поперечного обхода нескольких массивов одновременно.',
            ],
            realLifeExample: 'При чтении CSV-строк map(float, row) сразу переводит все поля в числа без ручного цикла.',
            codeExample: "nums = [1, 2, 3, 4, 5]\ndoubled = list(map(lambda x: x * 2, nums))\nevens = list(filter(lambda x: x % 2 == 0, nums))\nkeys = ['a', 'b', 'c']\nvalues = [1, 2, 3]\npairs = dict(zip(keys, values))\nprint(doubled)\nprint(evens)\nprint(pairs)",
            codeExplanation: [
              'map() применяет лямбду к каждому элементу и возвращает итератор, который мы превращаем в список.',
              'filter() оставляет только те элементы, для которых лямбда возвращает True.',
              'zip() попарно соединяет два списка, что удобно для создания словарей.',
            ],
            mistakes: [
              'Забывают обернуть map/filter в list() и получают объект-итератор вместо результата. Решение: всегда добавлять list() при необходимости конкретного контейнера.',
              'Пишут сложные lambda-выражения с вложенными условиями. Решение: для сложной логики лучше именованная функция def.',
              'Путают порядок аргументов map(func, iterable). Решение: сначала функция, потом последовательность.',
            ],
            interview: [
              { question: 'Чем map() отличается от list comprehension?', answer: 'map() принимает функцию и возвращает итератор, comprehension — полноценный синтаксис Python с фильтром и выражением.' },
              { question: 'Когда использовать lambda?', answer: 'Для короткой одноразовой функции, которая не нуждается в имени и читается в одну строку.' },
              { question: 'Как zip работает при разных длинах?', answer: 'zip останавливается на самом коротком итераторе; для выравнивания используют itertools.zip_longest.' },
            ],
            formulas: ['list(map(func, iterable))', 'list(filter(predicate, iterable))', 'dict(zip(keys, values))'],
            extraTerms: ['функция высшего порядка', 'частичное применение', 'итератор'],
            quizQuestions: makeQuiz('python-functional', 'Функциональный Python: map, filter, zip и lambda', ['list(map(func, iterable))', 'list(filter(predicate, iterable))', 'dict(zip(keys, values))'], 'Python'),
            codeTasks: makeCodeTasks('python-functional', 'Функциональный Python: map, filter, zip и lambda'),
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
          makeTheme({
            id: 'numpy-linear-algebra',
            title: 'NumPy: матричные операции и линейная алгебра',
            summary: 'Тема охватывает матричное умножение, транспонирование и базовые операции линейной алгебры через numpy.linalg.',
            level: 'junior+',
            terminology: ['матрица', 'транспонирование', 'dot product', 'numpy.linalg', 'обратная матрица'],
            simpleExplanation: 'NumPy позволяет выполнять векторные и матричные вычисления, которые лежат в основе большинства ML-алгоритмов.',
            usage: [
              'Используется в реализации линейных моделей и нейросетевых слоёв.',
              'Нужен для понимания forward pass и матричного скалярного произведения.',
              'Применяется при работе с ковариационными матрицами и PCA.',
            ],
            realLifeExample: 'Предсказание линейной регрессии — это матричное умножение вектора признаков на вектор весов.',
            codeExample: "import numpy as np\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nC = A @ B\nprint('dot product:', C)\nprint('transpose:', A.T)\nprint('det:', np.linalg.det(A))",
            codeExplanation: [
              'Оператор @ выполняет матричное умножение между двумя массивами.',
              'Атрибут .T транспонирует матрицу, меняя строки и столбцы местами.',
              'np.linalg.det вычисляет определитель, который показывает, обратима ли матрица.',
            ],
            mistakes: [
              'Используют * вместо @ для матричного умножения. Решение: * — поэлементное, @ или np.dot() — матричное.',
              'Не понимают разницу между вектором-строкой и вектором-столбцом (shape). Решение: всегда проверять shape перед умножением.',
              'Пытаются инвертировать вырожденную матрицу. Решение: сначала проверять определитель или использовать псевдообратную np.linalg.pinv.',
            ],
            interview: [
              { question: 'Чем @ отличается от *?', answer: '@ — матричное умножение, * — поэлементное перемножение соответствующих элементов.' },
              { question: 'Зачем транспонирование в ML?', answer: 'Оно нужно для выравнивания размерностей при вычислении ŷ = X @ w или при реализации слоёв нейросети.' },
              { question: 'Что такое dot product простыми словами?', answer: 'Сумма произведений соответствующих элементов двух векторов — это мера их схожести.' },
            ],
            formulas: ['C = A @ B (матричное умножение)', 'A.T (транспонирование)', 'det(A) ≠ 0 → обратимость'],
            extraTerms: ['определитель', 'ранг матрицы', 'псевдообратная матрица'],
            quizQuestions: makeQuiz('numpy-linear-algebra', 'NumPy: матричные операции и линейная алгебра', ['C = A @ B (матричное умножение)', 'A.T (транспонирование)', 'det(A) ≠ 0 → обратимость'], 'анализе данных'),
            codeTasks: makeCodeTasks('numpy-linear-algebra', 'NumPy: матричные операции и линейная алгебра'),
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
          makeTheme({
            id: 'feature-selection',
            title: 'Отбор признаков: корреляция, дисперсия и важность',
            summary: 'Тема учит убирать лишние признаки, которые шумят, дублируются или не несут информации для модели.',
            level: 'junior+',
            terminology: ['корреляция Пирсона', 'дисперсия', 'feature importance', 'SelectKBest', 'VIF'],
            simpleExplanation: 'Больше признаков не всегда лучше: неинформативные и сильно скоррелированные признаки мешают модели обобщать.',
            usage: [
              'Нужен перед обучением, чтобы убрать шум и снизить размерность без потери качества.',
              'Используется в кредитном скоринге, медицине и задачах с высокой размерностью.',
              'Помогает ускорить обучение и улучшить интерпретируемость модели.',
            ],
            realLifeExample: 'Если признаки "доход" и "сумма трат" почти одинаковы, одного из них достаточно — держать оба означает дублирование информации.',
            codeExample: "import numpy as np\nX = np.array([[1, 2, 2], [2, 4, 4], [3, 6, 5]])\ncorr = np.corrcoef(X.T)\nprint('Корреляционная матрица:')\nprint(corr.round(2))\nvariances = X.var(axis=0)\nprint('Дисперсии:', variances)",
            codeExplanation: [
              'np.corrcoef вычисляет попарные коэффициенты корреляции Пирсона для всех признаков.',
              'Признаки с корреляцией > 0.9 скорее всего несут одинаковую информацию.',
              'Признаки с нулевой дисперсией (константы) полезной информации не несут и их нужно удалять.',
            ],
            mistakes: [
              'Удаляют признаки только по корреляции без проверки важности в модели. Решение: сочетать корреляционный анализ с feature importance.',
              'Делают отбор признаков до split на train/test. Решение: всё вычислять только на train, иначе data leakage.',
              'Удаляют слишком много признаков за один шаг. Решение: итеративно убирать и проверять метрику на валидации.',
            ],
            interview: [
              { question: 'Зачем убирать сильно скоррелированные признаки?', answer: 'Они вносят мультиколлинеарность: коэффициенты становятся нестабильными, а модель — сложнее без выигрыша в качестве.' },
              { question: 'Что такое feature importance?', answer: 'Мера вклада каждого признака в снижение ошибки модели, доступная у деревьев и ансамблей.' },
              { question: 'Когда отбор признаков важнее всего?', answer: 'При высокой размерности (много признаков), риске переобучения или требовании интерпретируемости.' },
            ],
            formulas: ['r = Cov(X,Y) / (σ_X · σ_Y)', 'Variance(X) = E[(X - μ)²]', 'importance_i = Σ снижение_примеси_i / кол-во_деревьев'],
            extraTerms: ['мультиколлинеарность', 'нулевая дисперсия', 'рекурсивное исключение признаков'],
            quizQuestions: makeQuiz('feature-selection', 'Отбор признаков: корреляция, дисперсия и важность', ['r = Cov(X,Y) / (σ_X · σ_Y)', 'Variance(X) = E[(X - μ)²]', 'importance_i = Σ снижение_примеси_i / кол-во_деревьев'], 'подготовке данных'),
            codeTasks: makeCodeTasks('feature-selection', 'Отбор признаков: корреляция, дисперсия и важность'),
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
          makeTheme({
            id: 'regularization-ml',
            title: 'Регуляризация: L1 (Lasso), L2 (Ridge) и ElasticNet',
            summary: 'Тема объясняет, как штраф за сложность модели помогает избежать переобучения и стабилизировать веса.',
            level: 'junior+',
            terminology: ['L1 регуляризация', 'L2 регуляризация', 'ElasticNet', 'коэффициент регуляризации α', 'разреженность'],
            simpleExplanation: 'Регуляризация добавляет штраф к функции потерь за большие веса, заставляя модель оставаться простой.',
            usage: [
              'Используется при переобучении линейной модели с большим числом признаков.',
              'L1 (Lasso) полезен для автоматического отбора признаков: часть весов обнуляется.',
              'L2 (Ridge) сглаживает веса, оставляя все признаки, но уменьшая их влияние.',
            ],
            realLifeExample: 'В задаче кредитного скоринга с тысячами признаков Lasso автоматически обнуляет незначимые признаки, упрощая модель.',
            codeExample: "import numpy as np\nweights = np.array([3.0, -1.5, 0.2, -0.01])\nalpha = 0.5\nl1_penalty = alpha * np.sum(np.abs(weights))\nl2_penalty = alpha * np.sum(weights ** 2)\nprint(f'L1 penalty: {l1_penalty:.3f}')\nprint(f'L2 penalty: {l2_penalty:.3f}')",
            codeExplanation: [
              'L1 суммирует абсолютные значения весов — это приводит к обнулению маленьких весов.',
              'L2 суммирует квадраты весов — это равномерно уменьшает все веса.',
              'Параметр alpha контролирует силу штрафа: больше alpha — проще модель.',
            ],
            mistakes: [
              'Не масштабируют признаки перед применением регуляризации. Решение: StandardScaler обязателен, иначе штраф применяется неравномерно.',
              'Путают alpha и C в sklearn (в LogisticRegression C = 1/alpha). Решение: знать, что меньший C — сильнее регуляризация.',
              'Думают, что регуляризация всегда улучшает качество. Решение: подбирать alpha через кросс-валидацию.',
            ],
            interview: [
              { question: 'В чём главное отличие L1 от L2?', answer: 'L1 может обнулять веса (разреженность), L2 только уменьшает их — оба предотвращают переобучение, но по-разному.' },
              { question: 'Что такое ElasticNet?', answer: 'Комбинация L1 и L2 регуляризации, управляемая параметром l1_ratio.' },
              { question: 'Зачем нужна регуляризация?', answer: 'Чтобы не давать модели переобучаться: штраф за сложность заставляет её обобщать, а не запоминать.' },
            ],
            formulas: ['Loss_L1 = Loss + α·Σ|wᵢ|', 'Loss_L2 = Loss + α·Σwᵢ²', 'ElasticNet = α·[ρ·Σ|wᵢ| + (1-ρ)·Σwᵢ²]'],
            extraTerms: ['переобучение', 'разреженность', 'гиперпараметр'],
            quizQuestions: makeQuiz('regularization-ml', 'Регуляризация: L1 (Lasso), L2 (Ridge) и ElasticNet', ['Loss_L1 = Loss + α·Σ|wᵢ|', 'Loss_L2 = Loss + α·Σwᵢ²', 'ElasticNet = α·[ρ·Σ|wᵢ| + (1-ρ)·Σwᵢ²]'], 'машинном обучении'),
            codeTasks: makeCodeTasks('regularization-ml', 'Регуляризация: L1 (Lasso), L2 (Ridge) и ElasticNet'),
          }),
          makeTheme({
            id: 'knn-classifier',
            title: 'Метод k ближайших соседей (k-NN)',
            summary: 'Тема раскрывает алгоритм k-NN: как считается близость, как выбирается k и почему нужна нормализация.',
            level: 'junior',
            terminology: ['евклидово расстояние', 'манхэттенское расстояние', 'гиперпараметр k', 'большинством голосов', 'KD-tree'],
            simpleExplanation: 'k-NN классифицирует новый объект по меткам k ближайших к нему объектов из обучающей выборки.',
            usage: [
              'Используется как интерпретируемый baseline в задачах классификации и регрессии.',
              'Применяется в рекомендательных системах для поиска похожих пользователей или товаров.',
              'Полезен для быстрого прототипирования без необходимости обучать модель.',
            ],
            realLifeExample: 'Чтобы рекомендовать фильм, можно найти k пользователей с похожими оценками и порекомендовать то, что понравилось им.',
            codeExample: "import numpy as np\ndef euclidean(a, b):\n    return np.sqrt(np.sum((a - b) ** 2))\n\ntrain = np.array([[1, 2], [3, 4], [5, 1]])\nlabels = ['A', 'B', 'A']\nquery = np.array([2, 3])\ndists = [euclidean(query, p) for p in train]\nnearest = labels[np.argmin(dists)]\nprint('Nearest label:', nearest)",
            codeExplanation: [
              'Вычисляем евклидово расстояние от запросной точки до каждого обучающего примера.',
              'argmin находит индекс ближайшего соседа (k=1 в этом примере).',
              'На практике берут k > 1 и голосуют большинством меток.',
            ],
            mistakes: [
              'Не масштабируют признаки перед k-NN. Решение: без нормализации признаки с большим масштабом доминируют в расстоянии.',
              'Выбирают слишком маленький k и получают переобучение. Решение: подбирать k через кросс-валидацию.',
              'Применяют k-NN к большим данным без оптимизации. Решение: использовать KD-tree или Ball-tree для ускорения поиска.',
            ],
            interview: [
              { question: 'Почему k-NN чувствителен к масштабу?', answer: 'Потому что расстояние зависит от абсолютных значений: признак с диапазоном 1000 доминирует над признаком с диапазоном 1.' },
              { question: 'Как выбрать оптимальное k?', answer: 'Через кросс-валидацию: обычно нечётное k от 3 до 20, подбираемое по метрике на валидации.' },
              { question: 'В чём главный недостаток k-NN?', answer: 'Медленный инференс: для каждого объекта нужно считать расстояние до всех обучающих примеров.' },
            ],
            formulas: ['d(a,b) = √Σ(aᵢ - bᵢ)²', 'Manhattan: d = Σ|aᵢ - bᵢ|', 'класс = mode(labels[k_ближайших])'],
            extraTerms: ['проклятие размерности', 'KD-tree', 'инленс-метод (lazy learning)'],
            quizQuestions: makeQuiz('knn-classifier', 'Метод k ближайших соседей (k-NN)', ['d(a,b) = √Σ(aᵢ - bᵢ)²', 'Manhattan: d = Σ|aᵢ - bᵢ|', 'класс = mode(labels[k_ближайших])'], 'машинном обучении'),
            codeTasks: makeCodeTasks('knn-classifier', 'Метод k ближайших соседей (k-NN)'),
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
          makeTheme({
            id: 'random-forest',
            title: 'Random Forest: детали алгоритма и настройка',
            summary: 'Тема углубляет понимание Random Forest: откуда берётся устойчивость, как влияют гиперпараметры и когда RF — хороший выбор.',
            level: 'junior+',
            terminology: ['bootstrap aggregating', 'feature subsampling', 'out-of-bag error', 'n_estimators', 'max_features'],
            simpleExplanation: 'Random Forest строит много деревьев на случайных подвыборках данных и признаков, а потом усредняет их ответы.',
            usage: [
              'Хорош как первый сильный baseline на табличных данных.',
              'Используется в медицине, финансах и задачах с умеренным размером данных.',
              'Out-of-bag error позволяет оценить качество без отдельного val-сплита.',
            ],
            realLifeExample: 'В банке Random Forest используют для скоринга заявок: он устойчив к выбросам и даёт feature importance для объяснения решения.',
            codeExample: "import numpy as np\nnp.random.seed(42)\nn_trees = 5\ndata = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])\npreds = []\nfor _ in range(n_trees):\n    sample = np.random.choice(data, size=len(data), replace=True)\n    preds.append(sample.mean())\nprint('Предсказания деревьев:', [round(p, 2) for p in preds])\nprint('RF предсказание:', round(np.mean(preds), 2))",
            codeExplanation: [
              'Каждое дерево обучается на bootstrap-выборке — случайной с возвращением.',
              'Результат каждого дерева может немного отличаться из-за разных подвыборок.',
              'Финальное предсказание — среднее по всем деревьям, что снижает дисперсию.',
            ],
            mistakes: [
              'Увеличивают n_estimators бесконечно, тратя время без выигрыша. Решение: смотреть на кривую OOB-ошибки и останавливаться при её стабилизации.',
              'Не смотрят на feature importance и пропускают сигнальные признаки. Решение: анализировать важность признаков после обучения.',
              'Думают, что RF не переобучается никогда. Решение: при малом количестве данных RF тоже переобучается.',
            ],
            interview: [
              { question: 'Откуда берётся устойчивость Random Forest?', answer: 'Из двойного случайного: bootstrap-выборки данных и случайного подмножества признаков при каждом split.' },
              { question: 'Что такое OOB-error?', answer: 'Ошибка на объектах, которые не попали в bootstrap-выборку конкретного дерева — бесплатная оценка обобщения.' },
              { question: 'Как влияет max_features?', answer: 'Меньше признаков → деревья разнообразнее → корреляция между ними ниже → ансамбль устойчивее.' },
            ],
            formulas: ['RF(x) = (1/T)·Σ tree_t(x)', 'OOB error ≈ CV error', 'max_features = √(num_features) для классификации'],
            extraTerms: ['decorrelation', 'variance reduction', 'bootstrap'],
            quizQuestions: makeQuiz('random-forest', 'Random Forest: детали алгоритма и настройка', ['RF(x) = (1/T)·Σ tree_t(x)', 'OOB error ≈ CV error', 'max_features = √(num_features) для классификации'], 'машинном обучении'),
            codeTasks: makeCodeTasks('random-forest', 'Random Forest: детали алгоритма и настройка'),
          }),
          makeTheme({
            id: 'gradient-boosting',
            title: 'Градиентный бустинг: GradientBoosting и XGBoost',
            summary: 'Тема объясняет принцип градиентного бустинга, роль learning rate и почему XGBoost так часто побеждает на соревнованиях.',
            level: 'junior+',
            terminology: ['градиентный бустинг', 'learning rate', 'weak learner', 'XGBoost', 'shrinkage'],
            simpleExplanation: 'Бустинг строит деревья последовательно: каждое следующее дерево исправляет ошибки предыдущих.',
            usage: [
              'Используется в задачах ранжирования, классификации и регрессии на табличных данных.',
              'XGBoost и LightGBM — стандарт на соревнованиях Kaggle по табличным данным.',
              'Применяется в задачах рекомендаций, антифрода и прогнозирования спроса.',
            ],
            realLifeExample: 'В задаче прогнозирования кликов на рекламу градиентный бустинг строит всё точнее приближение через последовательное устранение остатков.',
            codeExample: "residuals = [5, -3, 2, -1, 4]\nlr = 0.1\npredictions = [0.0] * len(residuals)\nfor step in range(50):\n    pseudo_resid = [r - p for r, p in zip(residuals, predictions)]\n    tree_pred = sum(pseudo_resid) / len(pseudo_resid)\n    predictions = [p + lr * tree_pred for p in predictions]\nprint([round(p, 3) for p in predictions])",
            codeExplanation: [
              'На каждом шаге вычисляем псевдо-остатки как разницу между целевыми значениями и текущими предсказаниями.',
              'Простая модель аппроксимирует эти остатки — в реальности это дерево.',
              'Предсказания обновляются с маленьким learning rate, чтобы идти осторожно.',
            ],
            mistakes: [
              'Ставят слишком большой learning rate и пропускают оптимум. Решение: уменьшать lr и компенсировать числом деревьев.',
              'Не используют early stopping и получают переобучение. Решение: контролировать val-метрику и останавливаться вовремя.',
              'Не нормируют данные перед бустингом. Решение: деревья инвариантны к масштабу, но регуляризация XGBoost работает лучше при нормированных данных.',
            ],
            interview: [
              { question: 'Чем бустинг принципиально отличается от бэггинга?', answer: 'Бустинг строит модели последовательно, исправляя ошибки предыдущих (уменьшает bias), бэггинг — параллельно для снижения variance.' },
              { question: 'Что делает learning rate в бустинге?', answer: 'Масштабирует вклад каждого нового дерева, замедляя обучение и снижая риск переобучения.' },
              { question: 'Почему XGBoost быстрее обычного GBM?', answer: 'Он использует приблизительный алгоритм поиска split, гистограммное хеширование и параллельность по признакам.' },
            ],
            formulas: ['F_m(x) = F_{m-1}(x) + η·h_m(x)', 'псевдо-остаток = -∂Loss/∂F', 'XGBoost регуляризует листья: Ω(f) = γT + ½λΣwⱼ²'],
            extraTerms: ['early stopping', 'leaf regularization', 'shrinkage'],
            lossFunctions: ['GBM minimizes differentiable loss via gradient approximation'],
            quizQuestions: makeQuiz('gradient-boosting', 'Градиентный бустинг: GradientBoosting и XGBoost', ['F_m(x) = F_{m-1}(x) + η·h_m(x)', 'псевдо-остаток = -∂Loss/∂F', 'XGBoost регуляризует листья: Ω(f) = γT + ½λΣwⱼ²'], 'машинном обучении'),
            codeTasks: makeCodeTasks('gradient-boosting', 'Градиентный бустинг: GradientBoosting и XGBoost'),
          }),
        ],
      },
      {
        id: 'model-evaluation',
        title: 'Оценка модели',
        order: 3,
        description: 'Метрики и инструменты для глубокой оценки качества классификаторов.',
        themes: [
          makeTheme({
            id: 'roc-auc',
            title: 'ROC-кривая и метрика AUC',
            summary: 'Тема объясняет, как ROC-кривая показывает компромисс между чувствительностью и специфичностью при разных порогах.',
            level: 'junior+',
            terminology: ['ROC-кривая', 'AUC', 'TPR (Recall)', 'FPR', 'порог классификации'],
            simpleExplanation: 'ROC-кривая показывает, насколько хорошо модель разделяет классы при любом пороге, а AUC — площадь под этой кривой.',
            usage: [
              'Используется в медицине, антифроде и любой задаче с дисбалансом классов.',
              'AUC = 0.5 означает случайный классификатор, AUC = 1.0 — идеальный.',
              'ROC позволяет сравнивать модели без выбора конкретного порога.',
            ],
            realLifeExample: 'При скрининге болезней важно сначала посмотреть на ROC, чтобы понять, можно ли вообще разделить больных и здоровых данной моделью.',
            codeExample: "import numpy as np\ny_true = np.array([0, 0, 1, 1, 1])\ny_scores = np.array([0.1, 0.4, 0.35, 0.8, 0.9])\nthresholds = np.sort(np.unique(y_scores))[::-1]\ntprs, fprs = [], []\nfor t in thresholds:\n    pred = (y_scores >= t).astype(int)\n    tp = np.sum((pred == 1) & (y_true == 1))\n    fp = np.sum((pred == 1) & (y_true == 0))\n    fn = np.sum((pred == 0) & (y_true == 1))\n    tn = np.sum((pred == 0) & (y_true == 0))\n    tprs.append(tp / (tp + fn))\n    fprs.append(fp / (fp + tn))\nprint('TPR:', [round(t, 2) for t in tprs])\nprint('FPR:', [round(f, 2) for f in fprs])",
            codeExplanation: [
              'Перебираем пороги от высокого к низкому и при каждом считаем TPR и FPR.',
              'TPR (True Positive Rate) — доля правильно найденных позитивов (= Recall).',
              'FPR (False Positive Rate) — доля негативов, ошибочно отнесённых к позитивам.',
            ],
            mistakes: [
              'Интерпретируют AUC как вероятность правильного ответа для одного примера. Решение: AUC — вероятность, что модель оценит случайный позитив выше случайного негатива.',
              'Используют AUC при сильном дисбалансе без дополнительной проверки. Решение: в этом случае лучше смотреть на Precision-Recall AUC.',
              'Забывают, что ROC не зависит от соотношения классов. Решение: это плюс, но при дисбалансе PR-AUC информативнее.',
            ],
            interview: [
              { question: 'Что такое AUC простыми словами?', answer: 'Это вероятность того, что модель присвоит случайному положительному примеру бо́льший score, чем случайному отрицательному.' },
              { question: 'Когда ROC-AUC может быть обманчивым?', answer: 'При сильном дисбалансе классов: высокий AUC может скрывать плохой precision на миноритарном классе.' },
              { question: 'Как выбрать порог по ROC?', answer: 'Найти точку на кривой, которая даёт нужный баланс между TPR и FPR для конкретной бизнес-задачи.' },
            ],
            formulas: ['TPR = TP / (TP + FN)', 'FPR = FP / (FP + TN)', 'AUC = P(score(pos) > score(neg))'],
            extraTerms: ['Precision-Recall кривая', 'Youden index', 'порог классификации'],
            quizQuestions: makeQuiz('roc-auc', 'ROC-кривая и метрика AUC', ['TPR = TP / (TP + FN)', 'FPR = FP / (FP + TN)', 'AUC = P(score(pos) > score(neg))'], 'машинном обучении'),
            codeTasks: makeCodeTasks('roc-auc', 'ROC-кривая и метрика AUC'),
          }),
          makeTheme({
            id: 'classification-metrics',
            title: 'Матрица ошибок, Precision, Recall и F1: детальный разбор',
            summary: 'Тема систематизирует метрики классификации вокруг confusion matrix и учит выбирать метрику под задачу.',
            level: 'junior',
            terminology: ['confusion matrix', 'TP', 'TN', 'FP', 'FN', 'macro/micro averaging'],
            simpleExplanation: 'Confusion matrix — таблица, которая показывает, как часто модель правильно и неправильно классифицирует каждый класс.',
            usage: [
              'Нужна для понимания характера ошибок: какой тип ошибки преобладает.',
              'Используется при выборе метрики под конкретную бизнес-задачу.',
              'Macro-averaging важно при балансе классов, micro — при дисбалансе.',
            ],
            realLifeExample: 'В задаче диагностики болезни FN (пропустили больного) гораздо опаснее FP (ложная тревога), поэтому оптимизируют recall.',
            codeExample: "def confusion_stats(y_true, y_pred):\n    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)\n    tn = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)\n    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)\n    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)\n    precision = tp / (tp + fp) if tp + fp > 0 else 0\n    recall = tp / (tp + fn) if tp + fn > 0 else 0\n    f1 = 2 * precision * recall / (precision + recall) if precision + recall > 0 else 0\n    return precision, recall, f1\n\ny_true = [1, 0, 1, 1, 0, 1]\ny_pred = [1, 0, 0, 1, 1, 1]\nprint(confusion_stats(y_true, y_pred))",
            codeExplanation: [
              'Функция считает все четыре ячейки confusion matrix за один проход.',
              'Precision — насколько точны наши положительные предсказания.',
              'Recall — сколько из реальных положительных мы нашли.',
              'F1 — гармоническое среднее precision и recall, сбалансированная метрика.',
            ],
            mistakes: [
              'Ориентируются только на accuracy. Решение: при дисбалансе accuracy обманчива — смотреть на F1 или macro-recall.',
              'Не понимают разницу micro и macro averaging. Решение: micro — взвешенно по числу объектов, macro — по классам одинаково.',
              'Путают FP и FN и неправильно интерпретируют цену ошибок. Решение: перечитать confusion matrix с конкретным бизнес-кейсом.',
            ],
            interview: [
              { question: 'Что такое confusion matrix?', answer: 'Таблица N×N, где строки — реальные классы, столбцы — предсказанные; ячейки показывают количество примеров каждого типа.' },
              { question: 'Когда F1 лучше accuracy?', answer: 'При дисбалансе классов: accuracy может быть 95% просто потому, что модель всегда предсказывает мажоритарный класс.' },
              { question: 'В чём разница macro и micro F1?', answer: 'Macro усредняет F1 по каждому классу одинаково, micro считает глобально по всем TP/FP/FN.' },
            ],
            formulas: ['Precision = TP / (TP + FP)', 'Recall = TP / (TP + FN)', 'F1 = 2·P·R / (P + R)', 'Accuracy = (TP + TN) / N'],
            extraTerms: ['дисбаланс классов', 'micro averaging', 'macro averaging'],
            quizQuestions: makeQuiz('classification-metrics', 'Матрица ошибок, Precision, Recall и F1: детальный разбор', ['Precision = TP / (TP + FP)', 'Recall = TP / (TP + FN)', 'F1 = 2·P·R / (P + R)', 'Accuracy = (TP + TN) / N'], 'машинном обучении'),
            codeTasks: makeCodeTasks('classification-metrics', 'Матрица ошибок, Precision, Recall и F1: детальный разбор'),
          }),
        ],
      },
    ],
  },
  {
    id: 'neural-networks',
    title: 'Нейронные сети',
    order: 4,
    icon: '🧠',
    description: 'Введение в нейронные сети: от перцептрона до современных оптимизаторов.',
    subblocks: [
      {
        id: 'nn-basics',
        title: 'Основы нейронных сетей',
        order: 1,
        description: 'Перцептрон, активации и принцип forward pass.',
        themes: [
          makeTheme({
            id: 'perceptron-forward',
            title: 'Перцептрон, веса и прямое распространение',
            summary: 'Тема объясняет базовый строительный блок нейронной сети: как нейрон вычисляет взвешенную сумму и передаёт сигнал дальше.',
            level: 'junior',
            terminology: ['перцептрон', 'вес (weight)', 'смещение (bias)', 'взвешенная сумма', 'forward pass'],
            simpleExplanation: 'Нейрон умножает входные сигналы на веса, суммирует всё вместе со смещением и пропускает через функцию активации.',
            usage: [
              'Это строительный блок любой нейросети — понимание нейрона необходимо для всего остального.',
              'Forward pass используется при каждом предсказании нейросети.',
              'Понимание весов нужно для интерпретации нейросетей и их отладки.',
            ],
            realLifeExample: 'Нейрон напоминает простой фильтр: каждый входной признак имеет свою «важность» (вес), а итоговый сигнал — взвешенное голосование.',
            codeExample: "import numpy as np\ndef neuron(inputs, weights, bias):\n    z = np.dot(inputs, weights) + bias\n    return z\n\ninputs = np.array([1.0, 2.0, 3.0])\nweights = np.array([0.5, -0.3, 0.8])\nbias = 0.1\nz = neuron(inputs, weights, bias)\nprint(f'Взвешенная сумма z = {z:.3f}')",
            codeExplanation: [
              'np.dot вычисляет скалярное произведение входов и весов.',
              'К результату добавляем bias — смещение, которое позволяет нейрону активироваться даже при нулевых входах.',
              'Результат z передаётся в функцию активации на следующем шаге.',
            ],
            mistakes: [
              'Путают веса и признаки. Решение: признаки — это данные, веса — то, что обучается в процессе тренировки.',
              'Игнорируют bias и не понимают, зачем он нужен. Решение: без bias нейрон всегда проходит через начало координат.',
              'Думают, что один нейрон — это полноценная нейросеть. Решение: сила нейросетей — в слоях и нелинейных активациях.',
            ],
            interview: [
              { question: 'Что такое forward pass?', answer: 'Прямой проход данных от входного слоя через все нейроны к выходу: последовательное вычисление взвешенных сумм и активаций.' },
              { question: 'Зачем нужен bias?', answer: 'Он даёт нейрону смещение: без него гиперплоскость разделения всегда проходит через ноль, что ограничивает выразительность.' },
              { question: 'Как связан перцептрон с линейной регрессией?', answer: 'Перцептрон без нелинейной активации — это линейная регрессия; добавление активации даёт нелинейность.' },
            ],
            formulas: ['z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b', 'z = wᵀx + b', 'output = activation(z)'],
            extraTerms: ['слой (layer)', 'нейрон', 'параметры сети'],
            quizQuestions: makeQuiz('perceptron-forward', 'Перцептрон, веса и прямое распространение', ['z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b', 'z = wᵀx + b', 'output = activation(z)'], 'нейронных сетях'),
            codeTasks: makeCodeTasks('perceptron-forward', 'Перцептрон, веса и прямое распространение'),
          }),
          makeTheme({
            id: 'activation-functions',
            title: 'Функции активации: Sigmoid, ReLU, tanh, Softmax',
            summary: 'Тема объясняет, зачем нужны нелинейные активации и чем отличаются основные варианты.',
            level: 'junior',
            terminology: ['Sigmoid', 'ReLU', 'tanh', 'Softmax', 'проблема затухающих градиентов'],
            simpleExplanation: 'Функция активации вносит нелинейность: без неё нейросеть с любым числом слоёв эквивалентна одному линейному слою.',
            usage: [
              'ReLU используется в скрытых слоях большинства нейросетей как стандарт.',
              'Sigmoid и tanh — в выходных слоях бинарной классификации и старых архитектурах.',
              'Softmax применяется в последнем слое многоклассовых классификаторов.',
            ],
            realLifeExample: 'В распознавании изображений скрытые слои используют ReLU для скорости и эффективности, а последний слой с Softmax выдаёт вероятности классов.',
            codeExample: "import numpy as np\ndef sigmoid(z): return 1 / (1 + np.exp(-z))\ndef relu(z): return np.maximum(0, z)\ndef tanh_act(z): return np.tanh(z)\ndef softmax(z):\n    exp_z = np.exp(z - np.max(z))\n    return exp_z / exp_z.sum()\n\nz = np.array([-2.0, 0.0, 2.0])\nprint('sigmoid:', sigmoid(z).round(3))\nprint('relu:', relu(z))\nprint('tanh:', tanh_act(z).round(3))\nprint('softmax:', softmax(z).round(3))",
            codeExplanation: [
              'Sigmoid сжимает значение в диапазон (0, 1) — удобно для вероятностной интерпретации.',
              'ReLU обнуляет отрицательные значения — быстро и эффективно избегает насыщения.',
              'Softmax нормирует вектор в вероятностное распределение с суммой 1.',
            ],
            mistakes: [
              'Используют Sigmoid в скрытых слоях глубоких сетей. Решение: Sigmoid насыщается и вызывает затухание градиентов — в скрытых слоях предпочтителен ReLU.',
              'Не вычитают max перед softmax. Решение: вычитание max(z) обеспечивает численную стабильность.',
              'Думают, что tanh всегда лучше Sigmoid. Решение: tanh лучше центрирует данные, но тоже насыщается.',
            ],
            interview: [
              { question: 'Почему ReLU популярнее Sigmoid?', answer: 'ReLU не насыщается в положительной области, позволяя градиентам распространяться глубже без затухания.' },
              { question: 'Что такое проблема затухающих градиентов?', answer: 'В глубоких сетях с насыщающими активациями градиенты при обратном распространении стремятся к нулю, и ранние слои не обучаются.' },
              { question: 'Зачем softmax в последнем слое?', answer: 'Он преобразует логиты в нормированные вероятности: сумма по классам равна 1, что удобно для интерпретации и cross-entropy loss.' },
            ],
            formulas: ['σ(z) = 1/(1+e^{-z})', 'ReLU(z) = max(0, z)', 'softmax(z_i) = e^{z_i} / Σe^{z_j}'],
            extraTerms: ['насыщение', 'мёртвые нейроны', 'Leaky ReLU'],
            activationFunctions: ['Sigmoid = 1/(1+e^(-z})', 'ReLU = max(0, z)', 'tanh = (e^z - e^{-z})/(e^z + e^{-z})', 'Softmax(z_i) = e^{z_i} / Σe^{z_j}'],
            quizQuestions: makeQuiz('activation-functions', 'Функции активации: Sigmoid, ReLU, tanh, Softmax', ['σ(z) = 1/(1+e^{-z})', 'ReLU(z) = max(0, z)', 'softmax(z_i) = e^{z_i} / Σe^{z_j}'], 'нейронных сетях'),
            codeTasks: makeCodeTasks('activation-functions', 'Функции активации: Sigmoid, ReLU, tanh, Softmax'),
          }),
        ],
      },
      {
        id: 'nn-training',
        title: 'Обучение нейронных сетей',
        order: 2,
        description: 'Обратное распространение ошибки и оптимизаторы.',
        themes: [
          makeTheme({
            id: 'backpropagation',
            title: 'Обратное распространение ошибки и градиентный поток',
            summary: 'Тема объясняет алгоритм backpropagation: как цепное правило позволяет вычислить градиенты для всех весов сети.',
            level: 'junior+',
            terminology: ['backpropagation', 'цепное правило', 'градиент потерь', 'вычислительный граф', 'partial derivative'],
            simpleExplanation: 'Backpropagation последовательно применяет цепное правило дифференцирования: от выхода к входу, чтобы узнать, как каждый вес влияет на ошибку.',
            usage: [
              'Используется при обучении любой нейросети с дифференцируемыми функциями.',
              'Лежит в основе всех фреймворков автодифференцирования: PyTorch, TensorFlow.',
              'Понимание backprop необходимо для диагностики проблем обучения.',
            ],
            realLifeExample: 'При обучении сети распознавать кошек backprop говорит каждому весу, насколько он "виноват" в ошибке и в каком направлении его нужно изменить.',
            codeExample: "import numpy as np\ndef mse_loss(y_pred, y_true):\n    return np.mean((y_pred - y_true) ** 2)\n\ndef mse_grad(y_pred, y_true):\n    return 2 * (y_pred - y_true) / len(y_true)\n\ny_true = np.array([1.0, 0.0, 1.0])\ny_pred = np.array([0.8, 0.3, 0.6])\nloss = mse_loss(y_pred, y_true)\ngrad = mse_grad(y_pred, y_true)\nprint(f'Loss: {loss:.3f}')\nprint(f'Gradient: {grad.round(3)}')",
            codeExplanation: [
              'Функция потерь MSE показывает, насколько предсказания далеки от истинных значений.',
              'Градиент MSE — это производная по y_pred: она говорит, в каком направлении и насколько изменить предсказание.',
              'В реальной сети этот градиент передаётся обратно через все слои по цепному правилу.',
            ],
            mistakes: [
              'Думают, что backprop — это обратный forward pass. Решение: это вычисление градиентов по цепному правилу, а не просто "обратное" движение данных.',
              'Не понимают, почему важна дифференцируемость активаций. Решение: недифференцируемые функции нельзя использовать в backprop напрямую.',
              'Путают gradient и update. Решение: gradient — это направление роста ошибки; update = -lr * gradient, чтобы ошибку уменьшить.',
            ],
            interview: [
              { question: 'Что такое цепное правило в контексте нейросетей?', answer: 'Правило позволяет вычислить градиент составной функции: ∂L/∂w = ∂L/∂z · ∂z/∂w, итеративно от выхода к входу.' },
              { question: 'Почему backprop эффективнее численного дифференцирования?', answer: 'Он вычисляет все градиенты за один обратный проход, тогда как численный метод требует отдельного прохода для каждого параметра.' },
              { question: 'Что происходит при затухающих градиентах?', answer: 'Ранние слои получают очень малые градиенты и почти не обновляются, что замедляет или останавливает обучение.' },
            ],
            formulas: ['∂L/∂w = ∂L/∂z · ∂z/∂w (chain rule)', 'w ← w - η · ∂L/∂w', '∂MSE/∂ŷ = 2(ŷ - y)/n'],
            extraTerms: ['автодифференцирование', 'вычислительный граф', 'gradient clipping'],
            quizQuestions: makeQuiz('backpropagation', 'Обратное распространение ошибки и градиентный поток', ['∂L/∂w = ∂L/∂z · ∂z/∂w (chain rule)', 'w ← w - η · ∂L/∂w', '∂MSE/∂ŷ = 2(ŷ - y)/n'], 'нейронных сетях'),
            codeTasks: makeCodeTasks('backpropagation', 'Обратное распространение ошибки и градиентный поток'),
          }),
          makeTheme({
            id: 'optimizers',
            title: 'Оптимизаторы: SGD, Adam и импульс',
            summary: 'Тема сравнивает стратегии обновления весов: от простого SGD до адаптивного Adam.',
            level: 'junior+',
            terminology: ['SGD', 'momentum', 'RMSprop', 'Adam', 'learning rate schedule'],
            simpleExplanation: 'Оптимизатор определяет, как именно обновлять веса на основе градиентов: с какой скоростью и в каком направлении.',
            usage: [
              'Adam — стандарт для большинства задач глубокого обучения благодаря адаптивному LR.',
              'SGD с momentum используется в ResNet и других задачах с хорошо подобранным расписанием LR.',
              'Выбор оптимизатора влияет на скорость сходимости и финальное качество.',
            ],
            realLifeExample: 'Представьте мяч, катящийся по холмистой поверхности: SGD — маленькие осторожные шаги, momentum — мяч набирает скорость, Adam — автоматически меняет размер шага в зависимости от истории.',
            codeExample: "import numpy as np\ndef sgd_update(w, grad, lr=0.01):\n    return w - lr * grad\n\ndef momentum_update(w, v, grad, lr=0.01, beta=0.9):\n    v_new = beta * v + (1 - beta) * grad\n    w_new = w - lr * v_new\n    return w_new, v_new\n\nw = 1.0\ngrad = 0.5\nv = 0.0\nw_sgd = sgd_update(w, grad)\nw_mom, v = momentum_update(w, v, grad)\nprint(f'SGD: {w_sgd:.4f}')\nprint(f'Momentum: {w_mom:.4f}')",
            codeExplanation: [
              'SGD просто вычитает градиент, умноженный на learning rate.',
              'Momentum сохраняет историю градиентов в переменной v, что сглаживает обновления.',
              'Adam идёт дальше: адаптирует learning rate индивидуально для каждого параметра.',
            ],
            mistakes: [
              'Не меняют learning rate в процессе обучения. Решение: lr schedule (cosine decay, step decay) часто существенно улучшает результат.',
              'Используют Adam везде без проверки. Решение: для некоторых задач SGD с правильным schedule даёт лучший результат.',
              'Ставят слишком большой lr и наблюдают взрывной рост loss. Решение: начинать с малого lr или использовать gradient clipping.',
            ],
            interview: [
              { question: 'Чем Adam отличается от SGD?', answer: 'Adam адаптирует learning rate для каждого параметра на основе истории градиентов (первый и второй моменты), SGD использует один глобальный lr.' },
              { question: 'Зачем нужен momentum?', answer: 'Он накапливает инерцию в направлении стабильного градиента, ускоряя сходимость и сглаживая осцилляции.' },
              { question: 'Что такое learning rate schedule?', answer: 'Стратегия изменения lr во время обучения: тёплый запуск, экспоненциальное затухание или cosine annealing.' },
            ],
            formulas: ['SGD: w ← w - η·∇L', 'Momentum: v ← βv + (1-β)∇L; w ← w - η·v', 'Adam: m ← β₁m + (1-β₁)g; v ← β₂v + (1-β₂)g²; w ← w - η·m̂/√v̂'],
            extraTerms: ['сходимость', 'lr schedule', 'batch size'],
            quizQuestions: makeQuiz('optimizers', 'Оптимизаторы: SGD, Adam и импульс', ['SGD: w ← w - η·∇L', 'Momentum: v ← βv + (1-β)∇L; w ← w - η·v', 'Adam: m ← β₁m + (1-β₁)g; v ← β₂v + (1-β₂)g²; w ← w - η·m̂/√v̂'], 'нейронных сетях'),
            codeTasks: makeCodeTasks('optimizers', 'Оптимизаторы: SGD, Adam и импульс'),
          }),
        ],
      },
    ],
  },
  {
    id: 'interview-prep',
    title: 'Подготовка к собеседованию',
    order: 5,
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
            id: 'cross-validation',
            title: 'Кросс-валидация: k-Fold, StratifiedKFold и LOO',
            summary: 'Тема объясняет, как честно оценить качество модели при ограниченном объёме данных с помощью кросс-валидации.',
            level: 'junior+',
            terminology: ['k-Fold', 'StratifiedKFold', 'Leave-One-Out (LOO)', 'fold', 'bias-variance в CV'],
            simpleExplanation: 'Кросс-валидация делит данные на k частей и k раз обучает модель, каждый раз оставляя одну часть для проверки.',
            usage: [
              'Используется для надёжной оценки качества при небольших данных.',
              'StratifiedKFold обязателен при дисбалансе классов для сохранения пропорций.',
              'LOO применяют в медицине и биологии, где каждый пример на вес золота.',
            ],
            realLifeExample: 'Если данных мало, нельзя просто отложить 20% — нужно k-fold, чтобы каждый объект побывал в тест-части хотя бы раз.',
            codeExample: "data = list(range(10))\nk = 5\nfold_size = len(data) // k\nfor i in range(k):\n    val_idx = list(range(i * fold_size, (i + 1) * fold_size))\n    train_idx = [j for j in range(len(data)) if j not in val_idx]\n    print(f'Fold {i+1}: train={train_idx}, val={val_idx}')",
            codeExplanation: [
              'Делим данные на k частей одинакового размера.',
              'На каждой итерации одна часть становится валидационной, остальные — тренировочными.',
              'В итоге каждый объект ровно один раз участвует в валидации.',
            ],
            mistakes: [
              'Делают shuffle перед CV без фиксации seed. Решение: фиксировать random_state для воспроизводимости.',
              'Используют обычный k-Fold при дисбалансе. Решение: StratifiedKFold сохраняет пропорции классов в каждом fold.',
              'Считают mean score по CV и игнорируют std. Решение: высокий std означает нестабильное качество и требует анализа.',
            ],
            interview: [
              { question: 'Почему кросс-валидация лучше одного split?', answer: 'Оценка на одном split зависит от случайного разбиения; CV даёт усреднённую, более стабильную оценку обобщения.' },
              { question: 'Когда использовать StratifiedKFold?', answer: 'Когда классы несбалансированы: он гарантирует, что пропорции классов сохраняются в каждом fold.' },
              { question: 'В чём минус LOO кросс-валидации?', answer: 'Вычислительно дорого: нужно обучить столько моделей, сколько объектов в выборке.' },
            ],
            formulas: ['CV score = (1/k)·Σ metric_i', 'k-Fold: каждый объект в val ровно 1 раз', 'LOO: k = n (один объект = один fold)'],
            extraTerms: ['bias-variance tradeoff в CV', 'nested CV', 'GroupKFold'],
            quizQuestions: makeQuiz('cross-validation', 'Кросс-валидация: k-Fold, StratifiedKFold и LOO', ['CV score = (1/k)·Σ metric_i', 'k-Fold: каждый объект в val ровно 1 раз', 'LOO: k = n (один объект = один fold)'], 'ML workflow'),
            codeTasks: makeCodeTasks('cross-validation', 'Кросс-валидация: k-Fold, StratifiedKFold и LOO'),
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
