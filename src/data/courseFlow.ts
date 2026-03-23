import type { Quiz } from './quizzes'

export type FlowStepType =
  | 'theory'
  | 'terminology'
  | 'formula'
  | 'intuition'
  | 'worked-example'
  | 'quiz'
  | 'code'
  | 'practice'
  | 'pitfalls'
  | 'recap'
  | 'sources'

export interface SourceLink {
  label: string
  type: 'docs' | 'article' | 'book' | 'course'
  why: string
  url: string
}

export interface PracticeTestCase {
  id: string
  description: string
  input?: string
  args?: AnyInput[]
  expectedOutput?: string
  expectedValue?: string | number | boolean
}

type AnyInput = string | number | boolean | AnyInput[]

export interface PracticeTask {
  id: string
  title: string
  kind: 'function' | 'stdin-stdout' | 'fill-in-code' | 'debugging' | 'structural'
  language: 'javascript' | 'python'
  statement: string
  tips: string[]
  starterCode: string
  functionName?: string
  sampleTests: PracticeTestCase[]
  hiddenTests: PracticeTestCase[]
  structuralChecks?: string[]
  solution?: string
}

export interface DefinitionCard {
  term: string
  definition: string
  whyItMatters: string
}

export interface FormulaCard {
  label: string
  expression: string
  meaning: string
  notation: string[]
}

export interface LessonSection {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export interface FlowStep {
  id: string
  type: FlowStepType
  title: string
  summary: string
  mainIdea?: string
  paragraphs?: string[]
  bullets?: string[]
  definitions?: DefinitionCard[]
  formulaCards?: FormulaCard[]
  workedExample?: Array<{ title: string; body: string }>
  codeExample?: { language: string; code: string; explanation: string[] }
  quiz?: Quiz
  practiceTasks?: PracticeTask[]
  sources?: SourceLink[]
  drills?: Array<{ prompt: string; answer: string }>
  sections?: LessonSection[]
}

export interface FlowTopic {
  id: string
  title: string
  order: number
  summary: string
  blockId: string
  blockTitle: string
  blockIcon: string
  subblockId: string
  subblockTitle: string
  level: 'junior' | 'junior+'
  simpleExplanation: string
  terminology: string[]
  formulas: string[]
  themeCheatsheet: string[]
  steps: FlowStep[]
}

export const stepTypeMeta: Record<FlowStepType, { icon: string; label: string; accent: string; short: string }> = {
  theory: { icon: 'doc', label: 'Теория', accent: 'border-slate-300 bg-white text-slate-700', short: 'Теория' },
  terminology: { icon: 'terms', label: 'Термины', accent: 'border-slate-300 bg-white text-slate-700', short: 'Термины' },
  formula: { icon: 'math', label: 'Формулы', accent: 'border-slate-300 bg-white text-slate-700', short: 'Формулы' },
  intuition: { icon: 'idea', label: 'Интуиция', accent: 'border-slate-300 bg-white text-slate-700', short: 'Интуиция' },
  'worked-example': { icon: 'calc', label: 'Пример', accent: 'border-slate-300 bg-white text-slate-700', short: 'Пример' },
  quiz: { icon: 'help', label: 'Контроль', accent: 'border-slate-300 bg-white text-slate-700', short: 'Контроль' },
  code: { icon: 'code', label: 'Код', accent: 'border-slate-300 bg-white text-slate-700', short: 'Код' },
  practice: { icon: 'terminal', label: 'Практика', accent: 'border-slate-300 bg-white text-slate-700', short: 'Практика' },
  pitfalls: { icon: 'alert', label: 'Ошибки', accent: 'border-slate-300 bg-white text-slate-700', short: 'Ошибки' },
  recap: { icon: 'list', label: 'Выжимка', accent: 'border-slate-300 bg-white text-slate-700', short: 'Выжимка' },
  sources: { icon: 'link', label: 'Источники', accent: 'border-slate-300 bg-white text-slate-700', short: 'Источники' },
}

function makeStdInTask(params: {
  id: string
  title: string
  statement: string
  tips: string[]
  starterCode: string
  sampleTests: PracticeTestCase[]
  hiddenTests: PracticeTestCase[]
  structuralChecks: string[]
  solution: string
}): PracticeTask {
  return {
    id: params.id,
    title: params.title,
    kind: 'stdin-stdout',
    language: 'python',
    statement: params.statement,
    tips: params.tips,
    starterCode: params.starterCode,
    sampleTests: params.sampleTests,
    hiddenTests: params.hiddenTests,
    structuralChecks: params.structuralChecks,
    solution: params.solution,
  }
}

export const flowTopics: FlowTopic[] = [
  {
    id: 'intro-course',
    title: '1.1 Как устроен курс',
    order: 1,
    summary: 'Как проходить уроки так, чтобы теория превращалась в рабочий навык, а не в набор просмотренных экранов.',
    blockId: 'intro',
    blockTitle: 'Введение',
    blockIcon: '01',
    subblockId: 'intro-basics',
    subblockTitle: 'Старт и учебный ритм',
    level: 'junior',
    simpleExplanation: 'Урок состоит из последовательности шагов: теория, проверка понимания, код, практика, выжимка.',
    terminology: ['учебный шаг', 'sample tests', 'hidden tests', 'прогресс темы'],
    formulas: [],
    themeCheatsheet: [
      'Чтение теории без практики не считается усвоением.',
      'Сначала проверяем решение на sample tests, потом отправляем на hidden tests.',
      'После ошибки ищем конкретный edge case, а не переписываем задачу целиком.',
    ],
    steps: [
      {
        id: 'intro-course-theory',
        type: 'theory',
        title: 'Пошаговый формат обучения',
        summary: 'Главная цель курса — довести идею до устойчивого решения, а не показать красивый конспект.',
        sections: [
          {
            id: 'intro-1',
            title: 'Почему урок разбит на шаги',
            paragraphs: [
              'Обычно студент теряет качество не в сложном месте, а на переходе между этапами: понял определение, но не смог применить его к коду. Шаги нужны именно для закрытия этих переходов.',
              'Теория формирует язык. Контрольный шаг фиксирует понимание. Кодовый шаг показывает минимальный рабочий пример. Практика проверяет устойчивость решения на непредсказуемом вводе.',
              'Если один из этапов пропущен, создаётся ложное ощущение, что тема освоена, но это быстро выявляется на реальной задаче.',
            ],
          },
          {
            id: 'intro-2',
            title: 'Рабочий ритм на платформе',
            paragraphs: [
              'Проходите тему линейно: сначала теория, затем контроль, после этого код и только потом отправка в judge. Такой порядок экономит время и снижает число случайных ошибок.',
              'При падении hidden tests формулируйте гипотезу: какой краевой случай не обработан. Это дисциплинирует мышление и ускоряет отладку.',
            ],
          },
        ],
      },
      {
        id: 'intro-course-check',
        type: 'quiz',
        title: 'Контроль понимания',
        summary: 'Короткий чек-лист перед практикой.',
        bullets: [
          'Чем sample tests отличаются от hidden tests?',
          'Почему тестовые примеры из условия не доказывают корректность?',
          'Какой порядок прохождения шага вы используете по умолчанию?',
        ],
      },
      {
        id: 'intro-course-code',
        type: 'code',
        title: 'Минимальный каркас stdin → stdout',
        summary: 'Этот шаблон покрывает большинство базовых задач на платформе.',
        codeExample: {
          language: 'python',
          code: "import sys\n\nraw = sys.stdin.read().strip().split()\nif not raw:\n    print(0)\nelse:\n    values = list(map(int, raw))\n    print(sum(values))",
          explanation: [
            'sys.stdin.read() позволяет единообразно читать вход в задачах с одной или несколькими строками.',
            'Проверка пустого ввода сразу закрывает один из частых edge cases.',
            'Дальше остаётся преобразование типов и строгий вывод.',
          ],
        },
      },
      {
        id: 'intro-course-practice',
        type: 'practice',
        title: 'Практика: суммарные часы',
        summary: 'Короткая задача на чтение входа и корректный вывод.',
        practiceTasks: [
          makeStdInTask({
            id: 'task-intro-hours',
            title: 'Суммарные часы подготовки',
            statement: 'В первой строке дано n, во второй — n целых чисел (часы в день). Выведите сумму.',
            tips: ['Ввод/вывод строго через stdin/stdout.', 'Лишние пробелы во входе допустимы.'],
            starterCode: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\n# TODO\n",
            sampleTests: [
              { id: 'intro-s1', description: 'Базовый', input: '5\n2 3 1 4 2', expectedOutput: '12' },
              { id: 'intro-s2', description: 'Один день', input: '1\n7', expectedOutput: '7' },
            ],
            hiddenTests: [
              { id: 'intro-h1', description: 'Нули', input: '4\n0 0 0 0', expectedOutput: '0' },
              { id: 'intro-h2', description: 'Пробелы', input: '3\n10   5  1', expectedOutput: '16' },
            ],
            structuralChecks: ['sys.stdin.read', 'splitlines', 'map(', 'print('],
            solution: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\nn = int(lines[0])\nvalues = list(map(int, lines[1].split()))[:n]\nprint(sum(values))\n",
          }),
        ],
      },
      {
        id: 'intro-course-recap',
        type: 'recap',
        title: 'Итог шага',
        summary: 'Фиксируем рабочий протокол обучения.',
        bullets: [
          'Теория без практики не формирует навык.',
          'Edge cases — обязательная часть проверки.',
          'Стабильный ритм прохождения шага снижает количество случайных ошибок.',
        ],
      },
    ],
  },
  {
    id: 'python-numbers',
    title: '2.1 Арифметика и числовые типы',
    order: 1,
    summary: 'int, float, деление и форматирование результата в задачах со строгим stdout.',
    blockId: 'numbers',
    blockTitle: 'Арифметика и числа',
    blockIcon: '02',
    subblockId: 'numbers-core',
    subblockTitle: 'Числа и операции',
    level: 'junior',
    simpleExplanation: 'Большинство ошибок новичка в числовых задачах связано не с формулой, а с типами и округлением.',
    terminology: ['int', 'float', '//', '%', 'форматирование вывода'],
    formulas: ['a // b', 'a % b', "f'{value:.2f}'"],
    themeCheatsheet: [
      'Если нужен целый результат, используйте //, а не /.',
      'Остаток от деления через % часто нужен в задачах на группировку.',
      'Для дробных ответов задавайте формат явно, чтобы избежать ошибок проверки.',
    ],
    steps: [
      {
        id: 'python-numbers-theory',
        type: 'theory',
        title: 'Практика работы с числами',
        summary: 'Разбираем, как выбор типа и операции влияет на корректность ответа.',
        sections: [
          {
            id: 'num-1',
            title: 'int и float в задачах',
            paragraphs: [
              'int подходит для количества, индексов и счётчиков. float нужен для средних, долей и других непрерывных величин.',
              'Частая ошибка — неявно смешивать типы и получать не тот формат вывода, который ожидает judge.',
            ],
          },
          {
            id: 'num-2',
            title: 'Деление и остаток',
            paragraphs: [
              'Операция / всегда возвращает float. Операция // возвращает целую часть. Операция % даёт остаток.',
              'Пара // и % позволяет сразу получить число полных групп и размер неполной группы.',
            ],
          },
        ],
      },
      {
        id: 'python-numbers-code',
        type: 'code',
        title: 'Код: среднее и размах',
        summary: 'Минимальный пример с корректным форматированием дробного результата.',
        codeExample: {
          language: 'python',
          code: "values = [12, 9, 15, 10, 14]\nmean = sum(values) / len(values)\nspread = max(values) - min(values)\nprint(f'{mean:.2f}')\nprint(spread)",
          explanation: [
            'Среднее — дробная величина, поэтому форматируем до двух знаков.',
            'Размах вычисляется как max - min и остаётся целым в этом примере.',
          ],
        },
      },
      {
        id: 'python-numbers-practice',
        type: 'practice',
        title: 'Практика: min, max, mean',
        summary: 'Считайте массив и выведите минимум, максимум и среднее.',
        practiceTasks: [
          makeStdInTask({
            id: 'task-numbers-min-max-mean',
            title: 'Минимум, максимум и среднее',
            statement: 'В первой строке n, во второй n целых чисел. Выведите min max mean (mean с двумя знаками).',
            tips: ['Формат вывода строго: три значения через пробел.', 'Среднее выводите через f-строку.'],
            starterCode: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\n# TODO\n",
            sampleTests: [
              { id: 'num-s1', description: 'Базовый', input: '5\n12 9 15 10 14', expectedOutput: '9 15 12.00' },
              { id: 'num-s2', description: 'Отрицательные', input: '4\n-1 -3 2 6', expectedOutput: '-3 6 1.00' },
            ],
            hiddenTests: [
              { id: 'num-h1', description: 'Один элемент', input: '1\n7', expectedOutput: '7 7 7.00' },
              { id: 'num-h2', description: 'Нули', input: '3\n0 0 0', expectedOutput: '0 0 0.00' },
            ],
            structuralChecks: ['min(', 'max(', 'sum(', 'print('],
            solution: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\nn = int(lines[0])\nvalues = list(map(int, lines[1].split()))[:n]\nmean = sum(values) / n\nprint(f'{min(values)} {max(values)} {mean:.2f}')\n",
          }),
        ],
      },
      {
        id: 'python-numbers-recap',
        type: 'recap',
        title: 'Выжимка',
        summary: 'Опорные правила для числовых задач.',
        bullets: [
          'Сначала определяйте тип данных, потом пишите формулу.',
          'Следите за тем, какой тип возвращает каждая операция.',
          'Контролируйте формат вывода явно.',
        ],
      },
    ],
  },
  {
    id: 'python-control-flow',
    title: '4.1 Условия и циклы',
    order: 1,
    summary: 'Ветвления, циклы и обработка edge cases в базовых алгоритмах.',
    blockId: 'control-flow',
    blockTitle: 'Управляющие конструкции',
    blockIcon: '04',
    subblockId: 'control-flow-core',
    subblockTitle: 'Ветвления и повторения',
    level: 'junior',
    simpleExplanation: 'Корректность алгоритма определяется не синтаксисом if/for, а полнотой обработки крайних случаев.',
    terminology: ['if/elif/else', 'for', 'while', 'инвариант цикла', 'edge case'],
    formulas: [],
    themeCheatsheet: [
      'Перед циклом формулируйте инвариант: что должно оставаться верным.',
      'Сложные условия разбивайте на понятные булевы переменные.',
      'Проверяйте пустой ввод и минимальные размеры данных.',
    ],
    steps: [
      {
        id: 'python-control-flow-theory',
        type: 'theory',
        title: 'Структура корректного цикла',
        summary: 'Как писать цикл так, чтобы решение оставалось проверяемым.',
        sections: [
          {
            id: 'cf-1',
            title: 'Условия и инварианты',
            paragraphs: [
              'if/elif/else описывает ветви поведения для разных состояний входа. Хорошая ветка делает причину выбора явной.',
              'В цикле важно понимать инвариант: какое свойство должно быть истинным после каждой итерации. Это главный инструмент отладки.',
            ],
          },
          {
            id: 'cf-2',
            title: 'Краевые случаи',
            paragraphs: [
              'Частые ошибки: один элемент, все значения равны, повторяющиеся максимумы. Их нужно проверять отдельно от основного сценария.',
              'Перед отправкой решения полезно вручную прогнать минимум 3 особых теста, не совпадающих с примером из условия.',
            ],
          },
        ],
      },
      {
        id: 'python-control-flow-code',
        type: 'code',
        title: 'Код: подсчёт элементов по порогу',
        summary: 'Линейный проход с явным условием и счётчиком.',
        codeExample: {
          language: 'python',
          code: "values = [3, 7, 1, 9, 4]\nthreshold = 5\ncount_high = 0\nfor value in values:\n    if value >= threshold:\n        count_high += 1\nprint(count_high)",
          explanation: [
            'Счётчик инициализируется до цикла.',
            'Условие внутри цикла задаёт критерий включения в ответ.',
          ],
        },
      },
      {
        id: 'python-control-flow-practice',
        type: 'practice',
        title: 'Практика: второй максимальный',
        summary: 'Найдите второй по величине различный элемент.',
        practiceTasks: [
          makeStdInTask({
            id: 'task-control-second-max',
            title: 'Второй максимум',
            statement: 'В первой строке n, во второй n целых чисел. Выведите второй по величине различный элемент.',
            tips: ['Ищем второй DISTINCT максимум.', 'Гарантируется, что ответ существует.'],
            starterCode: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\n# TODO\n",
            sampleTests: [
              { id: 'cf-s1', description: 'Базовый', input: '6\n5 1 8 8 3 2', expectedOutput: '5' },
              { id: 'cf-s2', description: 'Отрицательные', input: '5\n-1 -3 -2 -2 -5', expectedOutput: '-2' },
            ],
            hiddenTests: [
              { id: 'cf-h1', description: 'Минимальный размер', input: '2\n10 3', expectedOutput: '3' },
              { id: 'cf-h2', description: 'Повторы максимума', input: '7\n4 9 9 9 8 8 1', expectedOutput: '8' },
            ],
            structuralChecks: ['set(', 'sorted(', 'print('],
            solution: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\nn = int(lines[0])\nvalues = list(map(int, lines[1].split()))[:n]\nunique_sorted = sorted(set(values), reverse=True)\nprint(unique_sorted[1])\n",
          }),
        ],
      },
      {
        id: 'python-control-flow-recap',
        type: 'recap',
        title: 'Выжимка',
        summary: 'Опорные правила для ветвлений и циклов.',
        bullets: [
          'Инвариант цикла помогает объяснить корректность решения.',
          'Крайние случаи проверяются отдельно и заранее.',
          'Условия должны быть читаемыми, а не максимально короткими.',
        ],
      },
    ],
  },
  {
    id: 'python-strings',
    title: '3.1 Работа со строками',
    order: 1,
    summary: 'Кавычки, экранирование, неизменяемость строк и базовые операции обработки текста.',
    blockId: 'strings',
    blockTitle: 'Строки',
    blockIcon: '03',
    subblockId: 'strings-core',
    subblockTitle: 'Синтаксис и операции',
    level: 'junior',
    simpleExplanation: 'Строка неизменяема: почти каждое преобразование возвращает новый объект.',
    terminology: ['str', 'экранирование', 'неизменяемость', 'конкатенация', 'f-строка'],
    formulas: ['len(text)', 'text.strip()', 'f"{value}"'],
    themeCheatsheet: [
      'Одинарные и двойные кавычки равноправны по смыслу.',
      'Для форматирования выводов используйте f-строки.',
      'Перед анализом пользовательского текста полезны trim и нормализация регистра.',
    ],
    steps: [
      {
        id: 'python-strings-theory',
        type: 'theory',
        title: 'Строки в практических задачах',
        summary: 'Разбираем строки как рабочий инструмент для ввода, отчётов и предобработки данных.',
        sections: [
          {
            id: 'str-1',
            title: 'Кавычки и экранирование',
            paragraphs: [
              'Одинарные и двойные кавычки эквивалентны. Выбор определяется читаемостью конкретной строки. Если внутри много апострофов, удобнее двойные кавычки.',
              'Тройные кавычки удобны для многострочного текста. Экранирование нужно там, где специальные символы должны восприниматься буквально.',
            ],
          },
          {
            id: 'str-2',
            title: 'Неизменяемость и производительность',
            paragraphs: [
              'Операции над строками не меняют объект на месте, а создают новый. Это важно учитывать в циклах и при сборке больших текстов.',
              'Частая ошибка — многократно конкатенировать строки в цикле. На небольшом вводе это незаметно, но на больших объёмах приводит к лишним затратам времени.',
            ],
          },
          {
            id: 'str-3',
            title: 'Преобразование типов и форматирование',
            paragraphs: [
              'str() переводит значения базовых типов в строку. f-строки делают этот процесс читаемым и позволяют точно управлять форматом числа.',
              'В задачах с проверкой stdout важен не только смысл, но и точный формат вывода: пробелы, перевод строки, количество знаков после запятой.',
            ],
          },
        ],
      },
      {
        id: 'python-strings-check',
        type: 'quiz',
        title: 'Контрольные вопросы',
        summary: 'Перед практикой зафиксируйте ключевые свойства строк.',
        bullets: [
          'Почему строки считают неизменяемыми?',
          'Когда стоит использовать тройные кавычки?',
          'Чем f-строка удобнее конкатенации через +?',
        ],
      },
      {
        id: 'python-strings-code',
        type: 'code',
        title: 'Код: очистка и нормализация текста',
        summary: 'Минимальный пример preprocessing для строкового ввода.',
        codeExample: {
          language: 'python',
          code: "raw = '   Machine Learning 2026  '\nclean = raw.strip().lower()\ndigits = sum(ch.isdigit() for ch in clean)\n\nprint(clean)\nprint(digits)",
          explanation: [
            'strip() убирает пробелы по краям.',
            'lower() приводит регистр к единому виду.',
            'Подсчёт цифр через isdigit() часто нужен в задачах на валидацию текстового ввода.',
          ],
        },
      },
      {
        id: 'python-strings-practice',
        type: 'practice',
        title: 'Практика: длина и число цифр',
        summary: 'Нужно корректно обработать строку и вывести две характеристики.',
        practiceTasks: [
          makeStdInTask({
            id: 'task-strings-length-digits',
            title: 'Длина и цифры в строке',
            statement: 'Считайте одну строку. Удалите пробелы по краям. Выведите два числа через пробел: длину очищенной строки и количество цифр в ней.',
            tips: ['Используйте .strip() и ch.isdigit().', 'Выводите ровно два числа.'],
            starterCode: "import sys\n\ntext = sys.stdin.read()\n# TODO\n",
            sampleTests: [
              { id: 'str-s1', description: 'Базовый', input: '  abc123  ', expectedOutput: '6 3' },
              { id: 'str-s2', description: 'Без цифр', input: '   hello   ', expectedOutput: '5 0' },
            ],
            hiddenTests: [
              { id: 'str-h1', description: 'Только цифры', input: '0099', expectedOutput: '4 4' },
              { id: 'str-h2', description: 'Пусто после trim', input: '     ', expectedOutput: '0 0' },
            ],
            structuralChecks: ['strip(', 'isdigit(', 'for ', 'print('],
            solution: "import sys\n\ntext = sys.stdin.read().strip()\ndigits = 0\nfor ch in text:\n    if ch.isdigit():\n        digits += 1\nprint(len(text), digits)\n",
          }),
        ],
      },
      {
        id: 'python-strings-recap',
        type: 'recap',
        title: 'Выжимка',
        summary: 'Минимум, который нужно держать в памяти.',
        bullets: [
          'Строки неизменяемы, преобразования создают новый объект.',
          'f-строки — стандартный способ форматировать вывод.',
          'Перед обработкой пользовательского текста полезны trim и нормализация.',
        ],
      },
    ],
  },
  {
    id: 'ml-quality-intro',
    title: '5.1 Введение в оценку качества',
    order: 1,
    summary: 'Почему метрика и схема валидации всегда рассматриваются вместе, и чем опасна утечка данных.',
    blockId: 'quality',
    blockTitle: 'Оценка качества моделей',
    blockIcon: '05',
    subblockId: 'quality-core',
    subblockTitle: 'Метрики и валидность оценки',
    level: 'junior+',
    simpleExplanation: 'Даже сильная модель не имеет ценности, если качество измерено неверно.',
    terminology: ['метрика', 'офлайн-оценка', 'онлайн-метрика', 'hold-out', 'data leakage'],
    formulas: ['quality = metric(model, validation_set)'],
    themeCheatsheet: [
      'Метрика отвечает на вопрос «что считаем хорошим».',
      'Схема валидации отвечает на вопрос «на каких данных считаем».',
      'Утечка данных даёт завышенную и недостоверную оценку.',
    ],
    steps: [
      {
        id: 'ml-quality-intro-theory',
        type: 'theory',
        title: 'Модель обучена, но можно ли ей доверять?',
        summary: 'Разбор базовой логики оценки качества: метрика, разбиение, интерпретация.',
        sections: [
          {
            id: 'q-1',
            title: 'Метрика и цель задачи',
            paragraphs: [
              'Метрика должна отражать цену ошибки именно в вашей задаче. Для разных продуктов одна и та же ошибка имеет разную стоимость, поэтому «универсальной лучшей метрики» не существует.',
              'В классификации часто используют Precision, Recall, F1, ROC-AUC. В регрессии — MAE, RMSE, MAPE. Выбор определяется сценарием применения модели, а не популярностью метрики.',
            ],
          },
          {
            id: 'q-2',
            title: 'Офлайн и онлайн',
            paragraphs: [
              'Офлайн-метрики позволяют быстро сравнивать гипотезы до внедрения. Онлайн-метрики показывают реальное поведение системы после выката.',
              'Рабочая стратегия: строить мост между офлайн и онлайн, проверяя, какие изменения в офлайн действительно улучшают продуктовые показатели.',
            ],
          },
          {
            id: 'q-3',
            title: 'Почему схема оценки так же важна, как метрика',
            paragraphs: [
              'Оценка на обучающей выборке всегда завышена: модель уже видела эти данные. Поэтому минимум — честное разбиение на train/validation/test.',
              'Если признаки или статистики подглядывают в test до завершения эксперимента, возникает leakage. После этого цифры качества нельзя использовать для принятия решений.',
            ],
          },
        ],
      },
      {
        id: 'ml-quality-intro-check',
        type: 'quiz',
        title: 'Контрольные вопросы',
        summary: 'Короткая самопроверка перед кодом и практикой.',
        bullets: [
          'Почему высокая accuracy не всегда означает хорошую модель?',
          'В чём разница между validation и test в процессе разработки?',
          'Какой тип leakage встречается чаще всего в табличных задачах?',
        ],
      },
      {
        id: 'ml-quality-intro-code',
        type: 'code',
        title: 'Код: базовые метрики из TP/FP/FN/TN',
        summary: 'Ручной расчёт метрик помогает правильно интерпретировать ошибки модели.',
        codeExample: {
          language: 'python',
          code: "tp, fp, fn, tn = 42, 8, 10, 140\n\naccuracy = (tp + tn) / (tp + fp + fn + tn)\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\n\nprint(f'{accuracy:.3f} {precision:.3f} {recall:.3f}')",
          explanation: [
            'Accuracy даёт общую долю верных ответов, но может скрывать проблемы на редком классе.',
            'Precision показывает, насколько чисты положительные предсказания.',
            'Recall показывает, сколько реальных позитивов модель не пропускает.',
          ],
        },
      },
      {
        id: 'ml-quality-intro-practice',
        type: 'practice',
        title: 'Практика: accuracy, precision, recall',
        summary: 'По четырём числам матрицы ошибок вычислите три метрики.',
        practiceTasks: [
          makeStdInTask({
            id: 'task-quality-basic-metrics',
            title: 'Три базовые метрики',
            statement: 'Ввод: TP FP FN TN. Вывод: accuracy precision recall с точностью до 3 знаков после запятой.',
            tips: ['Гарантируется, что знаменатели не равны нулю.', 'Формат вывода: три числа через пробел.'],
            starterCode: "import sys\n\ntp, fp, fn, tn = map(int, sys.stdin.read().strip().split())\n# TODO\n",
            sampleTests: [
              { id: 'q-s1', description: 'Пример 1', input: '42 8 10 140', expectedOutput: '0.910 0.840 0.808' },
              { id: 'q-s2', description: 'Пример 2', input: '30 20 10 40', expectedOutput: '0.700 0.600 0.750' },
            ],
            hiddenTests: [
              { id: 'q-h1', description: 'Сильный дисбаланс', input: '5 1 20 90', expectedOutput: '0.819 0.833 0.200' },
              { id: 'q-h2', description: 'Симметричный случай', input: '50 10 10 50', expectedOutput: '0.833 0.833 0.833' },
            ],
            structuralChecks: ['map(', 'print(', '/'],
            solution: "import sys\n\ntp, fp, fn, tn = map(int, sys.stdin.read().strip().split())\naccuracy = (tp + tn) / (tp + fp + fn + tn)\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\nprint(f'{accuracy:.3f} {precision:.3f} {recall:.3f}')\n",
          }),
        ],
      },
      {
        id: 'ml-quality-intro-recap',
        type: 'recap',
        title: 'Итог по теме',
        summary: 'Три опорных правила оценки качества.',
        bullets: [
          'Без корректной схемы валидации любая метрика теряет смысл.',
          'Офлайн-качество — инструмент разработки, онлайн-метрики — критерий реальной пользы.',
          'Leakage — критическая ошибка эксперимента, а не «небольшая неточность».',
        ],
      },
    ],
  },
  {
    id: 'ml-cross-validation',
    title: '6.1 Кросс-валидация и подбор параметров',
    order: 1,
    summary: 'Как получить устойчивую оценку на малых данных и выбирать гиперпараметры без переобучения на validation.',
    blockId: 'validation',
    blockTitle: 'Валидация и гиперпараметры',
    blockIcon: '06',
    subblockId: 'validation-core',
    subblockTitle: 'Надёжная оценка и эксперименты',
    level: 'junior+',
    simpleExplanation: 'Один split даёт случайный результат. K-fold и дисциплина эксперимента делают выводы надёжнее.',
    terminology: ['k-fold', 'stratified split', 'cv mean/std', 'grid search', 'random search'],
    formulas: ['cv_mean = (1/k) * Σ score_i', 'best = argmax(validation_score)'],
    themeCheatsheet: [
      'Смотрите на среднее качество и разброс по fold.',
      'Преобразования признаков нужно обучать только внутри train части каждого fold.',
      'Тестовый набор используем один раз в финале.',
    ],
    steps: [
      {
        id: 'ml-cross-validation-theory',
        type: 'theory',
        title: 'Надёжная оценка модели',
        summary: 'K-fold уменьшает зависимость результата от случайного разбиения и помогает увидеть стабильность модели.',
        sections: [
          {
            id: 'cv-1',
            title: 'Зачем нужен k-fold',
            paragraphs: [
              'Оценка по одному split может быть как завышенной, так и заниженной. Особенно это заметно на маленьких датасетах и редких классах.',
              'K-fold многократно переиспользует данные: каждый объект побывает в validation, и мы получим набор score, а не одно число.',
            ],
          },
          {
            id: 'cv-2',
            title: 'Что смотреть в отчёте',
            paragraphs: [
              'Средний score показывает ожидаемое качество. Стандартное отклонение показывает, насколько модель чувствительна к составу train/validation.',
              'Высокий разброс — сигнал, что модель нестабильна и нуждается в пересмотре признаков, регуляризации или объёма данных.',
            ],
          },
          {
            id: 'cv-3',
            title: 'Подбор гиперпараметров',
            paragraphs: [
              'Сравнивайте конфигурации только на одинаковом протоколе валидации. Иначе результат зависит не от параметров, а от методики измерения.',
              'При равных метриках разумно выбирать более простую конфигурацию: это снижает риск переобучения и упрощает сопровождение модели.',
            ],
          },
        ],
      },
      {
        id: 'ml-cross-validation-check',
        type: 'quiz',
        title: 'Контрольные вопросы',
        summary: 'Фиксируем практические критерии качества эксперимента.',
        bullets: [
          'Почему CV mean без CV std даёт неполную картину?',
          'Где чаще всего возникает leakage при кросс-валидации?',
          'Почему тест нельзя использовать при подборе гиперпараметров?',
        ],
      },
      {
        id: 'ml-cross-validation-code',
        type: 'code',
        title: 'Код: mean/std и выбор лучшей конфигурации',
        summary: 'Компактный фрагмент для агрегации результатов и ранжирования запусков.',
        codeExample: {
          language: 'python',
          code: "scores = [0.78, 0.81, 0.76, 0.80, 0.79]\nmean = sum(scores) / len(scores)\nstd = (sum((s - mean) ** 2 for s in scores) / len(scores)) ** 0.5\n\nruns = [('depth=3', 0.812, 3), ('depth=5', 0.826, 5), ('depth=4', 0.826, 4)]\nbest = max(runs, key=lambda item: (item[1], -item[2]))\n\nprint(f'{mean:.3f} {std:.3f}')\nprint(best[0])",
          explanation: [
            'Первая часть оценивает стабильность модели на фолдах.',
            'Вторая часть демонстрирует правило выбора конфигурации при равном score.',
            'Такой шаблон легко переносится в реальные эксперименты.',
          ],
        },
      },
      {
        id: 'ml-cross-validation-practice',
        type: 'practice',
        title: 'Практика: выберите лучший запуск',
        summary: 'По таблице запусков нужно выбрать индекс лучшей конфигурации.',
        practiceTasks: [
          makeStdInTask({
            id: 'task-cv-best-run',
            title: 'Лучший запуск по score и сложности',
            statement: 'В первой строке дано n. Далее n строк формата: score complexity. Выведите индекс (с 1) лучшего запуска. Критерии: max score; при равенстве — min complexity; при полном равенстве — меньший индекс.',
            tips: ['Используйте последовательное сравнение критериев.', 'Решение должно быть линейным по числу запусков.'],
            starterCode: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\n# TODO\n",
            sampleTests: [
              { id: 'cv-s1', description: 'Обычный случай', input: '3\n0.812 3\n0.826 5\n0.826 4', expectedOutput: '3' },
              { id: 'cv-s2', description: 'Победа по score', input: '4\n0.7 10\n0.8 20\n0.75 1\n0.6 5', expectedOutput: '2' },
            ],
            hiddenTests: [
              { id: 'cv-h1', description: 'Полное равенство', input: '3\n0.9 2\n0.9 2\n0.9 2', expectedOutput: '1' },
              { id: 'cv-h2', description: 'Сравнение по complexity', input: '3\n0.88 6\n0.88 4\n0.87 1', expectedOutput: '2' },
            ],
            structuralChecks: ['for ', 'if ', 'print('],
            solution: "import sys\n\nlines = sys.stdin.read().strip().splitlines()\nn = int(lines[0])\n\nbest_idx = 1\nbest_score, best_complexity = map(float, lines[1].split())\n\nfor i in range(2, n + 1):\n    score, complexity = map(float, lines[i].split())\n    if score > best_score:\n        best_score = score\n        best_complexity = complexity\n        best_idx = i\n    elif score == best_score and complexity < best_complexity:\n        best_complexity = complexity\n        best_idx = i\n\nprint(best_idx)\n",
          }),
        ],
      },
      {
        id: 'ml-cross-validation-recap',
        type: 'recap',
        title: 'Итог',
        summary: 'Фиксируем практический протокол.',
        bullets: [
          'Один split недостаточен для надёжной оценки модели.',
          'Стабильность качества измеряется разбросом по fold, а не только средним.',
          'Подбор гиперпараметров должен быть воспроизводимым и отделённым от финального теста.',
        ],
      },
    ],
  },
]

const blockOrder = ['intro', 'numbers', 'strings', 'control-flow', 'quality', 'validation']

const blockInfo: Record<string, { title: string; order: number; icon: string; description: string }> = {
  intro: { title: 'Введение', order: 1, icon: '01', description: 'Старт, учебный ритм и рабочий протокол прохождения шагов.' },
  numbers: { title: 'Арифметика и числа', order: 2, icon: '02', description: 'Типы чисел, операции и корректный вывод.' },
  strings: { title: 'Строки', order: 3, icon: '03', description: 'Синтаксис, обработка и форматирование текста.' },
  'control-flow': { title: 'Управляющие конструкции', order: 4, icon: '04', description: 'Условия, циклы и обработка крайних случаев.' },
  quality: { title: 'Оценка качества моделей', order: 5, icon: '05', description: 'Метрики, валидация и интерпретация результатов.' },
  validation: { title: 'Валидация и гиперпараметры', order: 6, icon: '06', description: 'Надёжная оценка и системный подбор параметров.' },
}

function blockThemes(blockId: string) {
  return flowTopics.filter((topic) => topic.blockId === blockId)
}

export const flowCourseBlocks = blockOrder.map((blockId) => {
  const meta = blockInfo[blockId]
  const themes = blockThemes(blockId)
  return {
    id: blockId,
    title: meta.title,
    order: meta.order,
    icon: meta.icon,
    description: meta.description,
    subblocks: [
      {
        id: `${blockId}-subblock`,
        title: themes[0]?.subblockTitle ?? 'Материалы',
        order: 1,
        description: themes[0]?.summary ?? 'Содержимое блока.',
        themes,
        cheatsheet: themes.flatMap((topic) => topic.themeCheatsheet),
      },
    ],
    cheatsheet: themes.flatMap((topic) => topic.themeCheatsheet),
  }
})

export function getFlowTopicById(topicId: string) {
  return flowTopics.find((topic) => topic.id === topicId) ?? null
}

export function getFlowStep(topicId: string, stepId: string) {
  return getFlowTopicById(topicId)?.steps.find((step) => step.id === stepId) ?? null
}

export function getFlowStepHref(topicId: string, stepId: string) {
  return `/topics/${topicId}/${stepId}`
}

export function getFlowPrevNextTopic(topicId: string) {
  const index = flowTopics.findIndex((topic) => topic.id === topicId)
  return {
    prev: index > 0 ? flowTopics[index - 1] : null,
    next: index >= 0 && index < flowTopics.length - 1 ? flowTopics[index + 1] : null,
  }
}

export function getFlowPrevNextStep(topicId: string, stepId: string) {
  const topic = getFlowTopicById(topicId)
  if (!topic) return { prev: null, next: null }
  const index = topic.steps.findIndex((step) => step.id === stepId)
  return {
    prev: index > 0 ? topic.steps[index - 1] : null,
    next: index >= 0 && index < topic.steps.length - 1 ? topic.steps[index + 1] : null,
  }
}

export const searchIndex = flowTopics.flatMap((topic) => [
  {
    id: `${topic.id}-topic`,
    type: 'topic',
    title: topic.title,
    href: `/topics/${topic.id}`,
    subtitle: `${topic.blockTitle} -> ${topic.subblockTitle}`,
    text: [topic.summary, topic.simpleExplanation, ...topic.terminology, ...topic.formulas, ...topic.themeCheatsheet].join(' '),
  },
  ...topic.steps.map((step) => ({
    id: step.id,
    type: 'step',
    title: `${topic.title} · ${step.title}`,
    href: getFlowStepHref(topic.id, step.id),
    subtitle: step.summary,
    text: [
      step.summary,
      step.mainIdea ?? '',
      ...(step.paragraphs ?? []),
      ...(step.bullets ?? []),
      ...(step.sections?.flatMap((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])]) ?? []),
      ...(step.codeExample ? [step.codeExample.code, ...step.codeExample.explanation] : []),
    ].join(' '),
  })),
])
