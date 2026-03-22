import { allThemes, courseBlocks, type Theme } from './course'
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
  language: 'javascript'
  statement: string
  tips: string[]
  starterCode: string
  functionName?: string
  sampleTests: PracticeTestCase[]
  hiddenTests: PracticeTestCase[]
  structuralChecks?: string[]
  solution?: string
}

export interface FlowStep {
  id: string
  type: FlowStepType
  title: string
  summary: string
  paragraphs?: string[]
  bullets?: string[]
  formulaCards?: Array<{ label: string; expression: string; meaning: string }>
  workedExample?: Array<{ title: string; body: string }>
  codeExample?: { language: string; code: string; explanation: string[] }
  quiz?: Quiz
  practiceTasks?: PracticeTask[]
  sources?: SourceLink[]
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
  level: Theme['level']
  simpleExplanation: string
  terminology: string[]
  formulas: string[]
  themeCheatsheet: string[]
  steps: FlowStep[]
}

export const stepTypeMeta: Record<FlowStepType, { icon: string; label: string; accent: string; short: string }> = {
  theory: { icon: '📘', label: 'Вводная теория', accent: 'bg-blue-50 text-blue-700 border-blue-200', short: 'Теория' },
  terminology: { icon: '🧾', label: 'Термины', accent: 'bg-slate-50 text-slate-700 border-slate-200', short: 'Термины' },
  formula: { icon: '∑', label: 'Формулы', accent: 'bg-violet-50 text-violet-700 border-violet-200', short: 'Формулы' },
  intuition: { icon: '💡', label: 'Интуиция', accent: 'bg-amber-50 text-amber-700 border-amber-200', short: 'Интуиция' },
  'worked-example': { icon: '🧮', label: 'Ручной разбор', accent: 'bg-cyan-50 text-cyan-700 border-cyan-200', short: 'Пример' },
  quiz: { icon: '❓', label: 'Квиз', accent: 'bg-emerald-50 text-emerald-700 border-emerald-200', short: 'Квиз' },
  code: { icon: '🧠', label: 'Кодовый пример', accent: 'bg-indigo-50 text-indigo-700 border-indigo-200', short: 'Код' },
  practice: { icon: '💻', label: 'Практика', accent: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', short: 'Практика' },
  pitfalls: { icon: '⚠️', label: 'Типичные ошибки', accent: 'bg-rose-50 text-rose-700 border-rose-200', short: 'Ловушки' },
  recap: { icon: '📌', label: 'Шпаргалка', accent: 'bg-teal-50 text-teal-700 border-teal-200', short: 'Конспект' },
  sources: { icon: '🔗', label: 'Источники', accent: 'bg-stone-50 text-stone-700 border-stone-200', short: 'Источники' },
}

const genericSources: SourceLink[] = [
  {
    label: 'scikit-learn User Guide',
    type: 'docs',
    why: 'Даёт инженерную трактовку алгоритмов, типичные гиперпараметры и практические ограничения.',
    url: 'https://scikit-learn.org/stable/user_guide.html',
  },
  {
    label: 'PyTorch Tutorials',
    type: 'docs',
    why: 'Нужен для сопоставления формул из урока с реальным train/eval workflow и отладкой модели.',
    url: 'https://pytorch.org/tutorials/',
  },
  {
    label: 'Dive into Deep Learning',
    type: 'book',
    why: 'Хорошо связывает интуицию, математику и код на понятных числовых примерах.',
    url: 'https://d2l.ai/',
  },
]

function makeParagraphs(theme: Theme): string[] {
  return [
    `Что это такое. ${theme.simpleExplanation} В рамках темы «${theme.title}» студент должен не просто запомнить определение, а понять, какое решение принимает модель, какие входы она получает, какой объект оптимизирует и чем эта идея отличается от соседних понятий.`,
    `Зачем это нужно. ${theme.summary} На практике тема появляется в baseline-моделях, в разборе ошибок, в объяснении результатов для бизнеса и в выборе следующего шага обучения. Поэтому внутри урока мы связываем определение, формулу, инженерную интерпретацию и небольшой ручной пример.`,
    `Где используется. ${theme.usage.join(' ')} Это особенно важно для Stepik-подобного сценария: студент проходит материал последовательно и на каждом шаге видит, как абстрактный термин превращается в проверяемое действие — выбор метрики, вычисление статистики, запуск кода или исправление ошибки.`,
    `Чем отличается от похожих концепций. Близкие темы часто используют те же слова — «ошибка», «вес», «вероятность», «разбиение», — но различаются по цели: где-то мы минимизируем loss, где-то измеряем качество, а где-то накладываем ограничение на модель. Поэтому в уроке явно проговаривается, что является входом, что является выходом и какая величина служит критерием успеха.`,
  ]
}

function makeTerminology(theme: Theme): string[] {
  return [
    ...theme.terminology.map((term) => `Ключевой термин: ${term}. Сформулируйте его своими словами и обязательно привяжите к примеру из реальной задачи.`),
    ...theme.extraTerms.map((term) => `Дополнительный термин: ${term}. Полезно понимать не только определение, но и почему без этого термина трудно объяснить ограничения метода.`),
    `Проверка понимания: после шага студент должен уметь различать термин из названия темы, связанную с ним формулу и типичную ошибку интерпретации на собеседовании.`,
  ]
}

function makeFormulaCards(theme: Theme) {
  return theme.formulas.map((expression, index) => ({
    label: `Формула ${index + 1}`,
    expression,
    meaning: `Используйте выражение «${expression}» как опорную запись: сначала проговорите, что означает каждая буква, затем объясните, когда формула применима, и только потом переходите к вычислению.`,
  }))
}

function makeIntuition(theme: Theme): string[] {
  return [
    `Смысловой уровень. Представьте, что тема «${theme.title}» — это не формула, а правило принятия решения. Тогда первый вопрос звучит так: какую ошибку или неопределённость мы пытаемся уменьшить? Ответ на него помогает не путать теоретическое определение с инженерным выбором модели.`,
    `Геометрическая/вероятностная интуиция. Во многих ML-задачах одна и та же идея читается двумя способами: либо как движение в пространстве параметров, либо как изменение доверия к гипотезе. Полезно мысленно переводить формулу из алгебры в историю про расстояние, вероятность, баланс классов или однородность узла.`,
    `Инженерная интуиция. Если после применения темы модель ведёт себя нестабильно, почти всегда проблема кроется в масштабе признаков, пороге, смещённой выборке или неверной трактовке метрики. Поэтому хороший инженер не останавливается на «знаю формулу», а задаёт вопрос: как эта идея сломается на плохих данных?`,
  ]
}

function makeWorkedExample(theme: Theme) {
  return [
    {
      title: 'Шаг 1. Постановка мини-задачи',
      body: `Возьмём короткий кейс по теме «${theme.title}». Нам нужно не просто получить число, а отследить все промежуточные значения: входные данные, правило вычисления, промежуточную статистику и итоговую интерпретацию. Именно это чаще всего проверяют в квизах и на интервью.`,
    },
    {
      title: 'Шаг 2. Подстановка значений',
      body: `Запишите известные величины вручную, затем выберите одну формулу из списка темы и подставьте числа без пропуска действий. Если по теме есть метрика, сначала выпишите числитель и знаменатель отдельно; если это оптимизация или регуляризация — отдельно покажите знак обновления и коэффициенты.`,
    },
    {
      title: 'Шаг 3. Интерпретация результата',
      body: `После получения ответа обязательно скажите, хороший это результат или нет для выбранного контекста. Это критично: число само по себе почти ничего не значит, пока не понятно, к какому baseline, порогу или альтернативному методу его сравнивают.`,
    },
    {
      title: 'Шаг 4. Что может пойти не так',
      body: `Проверьте крайние случаи: нулевой знаменатель, отсутствующие положительные ответы, одинаковые значения признака, слишком большой шаг обучения или неочищенные выбросы. Такой контроль делает решение «учебным», а не просто формальным.`,
    },
  ]
}

function buildThemeQuiz(theme: Theme & { blockId: string }): Quiz {
  const formulaAnswer = theme.formulas[0] ? theme.formulas[0].replace(/\s+/g, '').toLowerCase() : 'baseline'
  return {
    id: `${theme.id}-flow-quiz`,
    title: `Квиз по теме: ${theme.title}`,
    description: 'Встроенный уроковый квиз: теория, формулы, интуиция и порядок действий внутри одной подтемы.',
    topicId: theme.id,
    sectionId: theme.blockId,
    questions: [
      {
        id: `${theme.id}-q-single`,
        topicId: theme.id,
        sectionId: theme.blockId,
        type: 'single',
        difficulty: 'easy',
        question: `Что лучше всего описывает практическую ценность темы «${theme.title}»?`,
        options: [
          { id: 'a', text: theme.summary },
          { id: 'b', text: 'Тема полезна только для рисования графиков и не влияет на модель.' },
          { id: 'c', text: 'Тема нужна только после деплоя, а не при обучении.' },
          { id: 'd', text: 'Тему невозможно применить к реальным данным.' },
        ],
        correctAnswer: 'a',
        explanation: `Правильный ответ повторяет суть темы: ${theme.summary}`,
      },
      {
        id: `${theme.id}-q-multiple`,
        topicId: theme.id,
        sectionId: theme.blockId,
        type: 'multiple',
        difficulty: 'medium',
        question: 'Какие действия помогают не превратить знание темы в «сухое определение»?',
        options: [
          { id: 'a', text: 'Расшифровать обозначения формулы' },
          { id: 'b', text: 'Проверить ограничение метода и крайние случаи' },
          { id: 'c', text: 'Игнорировать контекст данных и просто помнить название' },
          { id: 'd', text: 'Связать тему с прикладным кейсом' },
        ],
        correctAnswer: ['a', 'b', 'd'],
        explanation: 'Глубокое понимание темы требует формулы, ограничений и связи с реальной задачей.',
      },
      {
        id: `${theme.id}-q-truefalse`,
        topicId: theme.id,
        sectionId: theme.blockId,
        type: 'truefalse',
        difficulty: 'easy',
        question: `Верно ли, что по теме «${theme.title}» важно помнить не только определение, но и типичные ошибки применения?`,
        correctAnswer: 'true',
        explanation: 'Да. В реальной задаче чаще ломается не формула, а контекст её применения.',
      },
      {
        id: `${theme.id}-q-numeric`,
        topicId: theme.id,
        sectionId: theme.blockId,
        type: 'numeric',
        difficulty: 'medium',
        question: 'Сколько ключевых формул вынесено в эту тему?',
        correctAnswer: theme.formulas.length,
        tolerance: 0,
        explanation: `В теме вынесено ${theme.formulas.length} опорных формул/правил.`,
      },
      {
        id: `${theme.id}-q-fill`,
        topicId: theme.id,
        sectionId: theme.blockId,
        type: 'fillblank',
        difficulty: 'medium',
        question: 'Дополните: хороший ответ студента включает термин, формулу, пример и ________.',
        correctAnswer: 'ошибки',
        explanation: 'Разбор ошибок показывает, что студент понимает тему глубже определения.',
      },
      {
        id: `${theme.id}-q-order`,
        topicId: theme.id,
        sectionId: theme.blockId,
        type: 'ordering',
        difficulty: 'hard',
        question: 'Расположите этапы изучения внутри урока в логичном порядке.',
        items: ['Код и практика', 'Формулы и обозначения', 'Краткая теория', 'Разбор ошибок'],
        correctOrder: [2, 1, 0, 3],
        correctAnswer: ['2', '1', '0', '3'],
        explanation: 'Сначала строим теоретическую рамку, затем фиксируем формулы, после этого код и в конце ошибки.',
      },
      {
        id: `${theme.id}-q-formula`,
        topicId: theme.id,
        sectionId: theme.blockId,
        type: 'formula',
        difficulty: 'hard',
        question: 'Введите первую опорную формулу темы без лишних пробелов.',
        formulaAnswer,
        correctAnswer: formulaAnswer,
        explanation: `Опорная формула темы: ${theme.formulas[0] ?? 'baseline'}.`,
      },
    ],
  }
}

function buildPracticeTasks(theme: Theme): PracticeTask[] {
  const safeName = theme.id.replace(/-/g, '_')

  return [
    {
      id: `${theme.id}-practice-function`,
      title: `${theme.title}: function-based checker`,
      kind: 'function',
      language: 'javascript',
      functionName: `score_${safeName}`,
      statement: `Напишите функцию \`score_${safeName}(values)\`, которая принимает массив чисел и возвращает среднее значение. Задача специально проста: здесь тренируется навык оформить решение как чистую функцию, а judge проверяет реальный результат на sample и hidden tests.`,
      tips: [
        'Верните число, а не строку.',
        'Пустой массив должен вернуть 0.',
        'Не мутируйте входной массив.',
      ],
      starterCode: `function score_${safeName}(values) {\n  if (!Array.isArray(values) || values.length === 0) {\n    return 0\n  }\n\n  // TODO: compute arithmetic mean\n  return 0\n}\n`,
      sampleTests: [
        { id: 'avg-s1', description: 'Простой массив', args: [[2, 4, 6]], expectedValue: 4 },
        { id: 'avg-s2', description: 'Один элемент', args: [[5]], expectedValue: 5 },
      ],
      hiddenTests: [
        { id: 'avg-h1', description: 'Пустой массив', args: [[]], expectedValue: 0 },
        { id: 'avg-h2', description: 'Отрицательные числа', args: [[-2, 2, 6]], expectedValue: 2 },
      ],
      solution: `function score_${safeName}(values) {\n  if (!Array.isArray(values) || values.length === 0) {\n    return 0\n  }\n\n  const total = values.reduce((sum, value) => sum + value, 0)\n  return total / values.length\n}\n`,
    },
    {
      id: `${theme.id}-practice-stdin`,
      title: `${theme.title}: stdin/stdout checker`,
      kind: 'stdin-stdout',
      language: 'javascript',
      functionName: 'solve',
      statement: 'Реализуйте функцию `solve(input)`, которая получает весь ввод строкой. Формат: первая строка — число n, вторая — n чисел. Верните строку с тремя значениями: minimum maximum range. Кнопка «Запустить код» гоняет sample tests, а «Отправить решение» запускает и hidden tests.',
      tips: [
        'Верните строку; не используйте console.log как основной результат.',
        'Range = max - min.',
        'Корректно обрабатывайте пробелы и перевод строки.',
      ],
      starterCode: `function solve(input) {\n  const lines = input.trim().split(/\\n+/)\n  const n = Number(lines[0])\n  const values = lines[1].trim().split(/\\s+/).map(Number)\n\n  // TODO: return 'min max range'\n  return ''\n}\n`,
      sampleTests: [
        { id: 'io-s1', description: 'Базовый пример', input: '5\n2 7 1 8 3', expectedOutput: '1 8 7' },
        { id: 'io-s2', description: 'Один элемент', input: '1\n9', expectedOutput: '9 9 0' },
      ],
      hiddenTests: [
        { id: 'io-h1', description: 'Отрицательные числа', input: '4\n-5 0 4 10', expectedOutput: '-5 10 15' },
        { id: 'io-h2', description: 'Повторы', input: '3\n6 6 6', expectedOutput: '6 6 0' },
      ],
      solution: `function solve(input) {\n  const lines = input.trim().split(/\\n+/)\n  const values = lines[1].trim().split(/\\s+/).map(Number)\n  const minimum = Math.min(...values)\n  const maximum = Math.max(...values)\n  return \`${'${minimum}'} ${'${maximum}'} ${'${maximum - minimum}'}\`\n}\n`,
    },
    {
      id: `${theme.id}-practice-debug`,
      title: `${theme.title}: debugging task`,
      kind: 'debugging',
      language: 'javascript',
      functionName: 'normalizeScores',
      statement: 'Исправьте функцию `normalizeScores(values)`. Она должна возвращать массив min-max нормализованных значений. Если все числа равны, верните массив из нулей. В starter code специально оставлены две типичные ошибки: неверный диапазон и отсутствие edge-case для одинаковых чисел.',
      tips: [
        'Нужна формула (x - min) / (max - min).',
        'При max === min диапазон равен нулю.',
        'Judge проверяет и структуру, и реальный результат.',
      ],
      starterCode: `function normalizeScores(values) {\n  const min = Math.min(...values)\n  const max = Math.max(...values)\n  const range = max + min\n\n  return values.map((value) => value / range)\n}\n`,
      sampleTests: [
        { id: 'dbg-s1', description: 'Обычный диапазон', args: [[1, 2, 3]], expectedValue: '[0,0.5,1]' },
        { id: 'dbg-s2', description: 'Все элементы равны', args: [[5, 5, 5]], expectedValue: '[0,0,0]' },
      ],
      hiddenTests: [
        { id: 'dbg-h1', description: 'Отрицательные значения', args: [[-2, 0, 2]], expectedValue: '[0,0.5,1]' },
        { id: 'dbg-h2', description: 'Дробные значения', args: [[10, 15]], expectedValue: '[0,1]' },
      ],
      structuralChecks: ['max - min', 'range === 0', 'map('],
      solution: `function normalizeScores(values) {\n  const min = Math.min(...values)\n  const max = Math.max(...values)\n  const range = max - min\n\n  if (range === 0) {\n    return values.map(() => 0)\n  }\n\n  return values.map((value) => (value - min) / range)\n}\n`,
    },
  ]
}

function buildRecap(theme: Theme): string[] {
  return [
    `Что помнить в первую очередь: ${theme.summary}`,
    ...theme.themeCheatsheet.map((item) => `Опорный пункт: ${item}`),
    'Мини-план ответа на собеседовании: определение → где используется → формула → ручной пример → типичная ошибка → как проверить кодом.',
    'Ловушка: если формула посчитана правильно, но выбор метрики/порога/масштаба данных неверный, решение всё равно будет плохим.',
    'Мини-конспект для повторения: сначала проговорите обозначения, затем расскажите интуицию, после этого решите одну числовую задачу и только потом переходите к коду.',
  ]
}

function buildSources(theme: Theme): SourceLink[] {
  return [
    ...genericSources,
    {
      label: `Материалы по теме «${theme.title}» в документации курса`,
      type: 'course',
      why: 'Нужны как краткая внутренняя карта темы: термины, ошибки, квиз и практика лежат рядом и проходят в едином lesson flow.',
      url: `/topics/${theme.id}`,
    },
  ]
}

function toFlowTopic(theme: Theme & { blockId: string; blockTitle: string; blockIcon: string; subblockId: string; subblockTitle: string }): FlowTopic {
  const quiz = buildThemeQuiz(theme)
  const practiceTasks = buildPracticeTasks(theme)

  return {
    id: theme.id,
    title: theme.title,
    order: theme.order,
    summary: theme.summary,
    blockId: theme.blockId,
    blockTitle: theme.blockTitle,
    blockIcon: theme.blockIcon,
    subblockId: theme.subblockId,
    subblockTitle: theme.subblockTitle,
    level: theme.level,
    simpleExplanation: theme.simpleExplanation,
    terminology: [...theme.terminology, ...theme.extraTerms],
    formulas: theme.formulas,
    themeCheatsheet: theme.themeCheatsheet,
    steps: [
      {
        id: `${theme.id}-overview`,
        type: 'theory',
        title: 'Краткая суть и вводная теория',
        summary: 'Сначала фиксируем, что это за тема, зачем она нужна и какой результат обучения ожидается.',
        paragraphs: makeParagraphs(theme),
      },
      {
        id: `${theme.id}-terminology`,
        type: 'terminology',
        title: 'Терминология и понятия',
        summary: 'Здесь собраны определения, без которых дальнейшие формулы и практика будут казаться механическими.',
        bullets: makeTerminology(theme),
      },
      {
        id: `${theme.id}-formula`,
        type: 'formula',
        title: 'Формулы, обозначения и смысл символов',
        summary: 'Формулы показаны вместе с расшифровкой и инженерным смыслом каждой записи.',
        formulaCards: makeFormulaCards(theme),
      },
      {
        id: `${theme.id}-intuition`,
        type: 'intuition',
        title: 'Интуиция: как понимать тему без зубрёжки',
        summary: 'Шаг про смысл, интерпретации и связь теории с поведением модели.',
        paragraphs: makeIntuition(theme),
      },
      {
        id: `${theme.id}-worked-example`,
        type: 'worked-example',
        title: 'Ручной числовой разбор',
        summary: 'Важный шаг для закрепления: пройти пример без пропуска промежуточных действий.',
        workedExample: makeWorkedExample(theme),
      },
      {
        id: `${theme.id}-quiz`,
        type: 'quiz',
        title: 'Мини-квиз внутри урока',
        summary: 'Вопросы встроены прямо в flow урока и закрывают теорию, формулы и порядок действий.',
        quiz,
      },
      {
        id: `${theme.id}-code`,
        type: 'code',
        title: 'Кодовый пример и комментарии',
        summary: 'Короткий рабочий пример показывает, как формула и терминология переходят в исполняемый код.',
        codeExample: {
          language: 'python',
          code: theme.codeExample,
          explanation: theme.codeExplanation,
        },
      },
      {
        id: `${theme.id}-practice`,
        type: 'practice',
        title: 'Локальная кодовая практика',
        summary: 'Три формата задач: function-based, stdin/stdout и debugging — все проверяются локальным deterministic judge.',
        practiceTasks,
      },
      {
        id: `${theme.id}-pitfalls`,
        type: 'pitfalls',
        title: 'Типичные ошибки и ложные интуиции',
        summary: 'Шаг, который отделяет формальное знание от реального понимания темы.',
        bullets: theme.mistakes.map((item) => item),
      },
      {
        id: `${theme.id}-recap`,
        type: 'recap',
        title: 'Мини-конспект и шпаргалка',
        summary: 'Сжатое, но содержательное повторение темы перед квизом, практикой или собеседованием.',
        bullets: buildRecap(theme),
      },
      {
        id: `${theme.id}-sources`,
        type: 'sources',
        title: 'Источники и куда читать дальше',
        summary: 'Собрали краткий список первичных материалов и объяснили, зачем каждый из них нужен.',
        sources: buildSources(theme),
      },
    ],
  }
}

export const flowTopics: FlowTopic[] = allThemes.map((theme) => toFlowTopic(theme))

export const flowCourseBlocks = courseBlocks.map((block) => ({
  ...block,
  subblocks: block.subblocks.map((subblock) => ({
    ...subblock,
    themes: flowTopics.filter((topic) => topic.blockId === block.id && topic.subblockId === subblock.id),
  })),
}))

export function getFlowTopicById(topicId: string) {
  return flowTopics.find((topic) => topic.id === topicId) ?? null
}

export function getFlowPrevNextTopic(topicId: string) {
  const sorted = [...flowTopics].sort((a, b) => {
    if (a.blockTitle !== b.blockTitle) {
      const aIndex = flowCourseBlocks.findIndex((block) => block.id === a.blockId)
      const bIndex = flowCourseBlocks.findIndex((block) => block.id === b.blockId)
      if (aIndex !== bIndex) return aIndex - bIndex
    }
    if (a.subblockTitle !== b.subblockTitle) {
      const block = flowCourseBlocks.find((item) => item.id === a.blockId)
      const aIndex = block?.subblocks.findIndex((sub) => sub.id === a.subblockId) ?? 0
      const bIndex = block?.subblocks.findIndex((sub) => sub.id === b.subblockId) ?? 0
      if (aIndex !== bIndex) return aIndex - bIndex
    }
    return a.order - b.order
  })
  const currentIndex = sorted.findIndex((topic) => topic.id === topicId)
  return {
    prev: currentIndex > 0 ? sorted[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null,
  }
}

export const searchIndex = flowTopics.flatMap((topic) => [
  {
    id: `${topic.id}-topic`,
    type: 'topic',
    title: topic.title,
    href: `/topics/${topic.id}`,
    subtitle: `${topic.blockTitle} → ${topic.subblockTitle}`,
    text: [topic.summary, topic.simpleExplanation, ...topic.terminology, ...topic.formulas, ...topic.themeCheatsheet].join(' '),
  },
  ...topic.steps.map((step) => ({
    id: step.id,
    type: 'step',
    title: `${topic.title} · ${step.title}`,
    href: `/topics/${topic.id}`,
    subtitle: step.summary,
    text: [
      step.summary,
      ...(step.paragraphs ?? []),
      ...(step.bullets ?? []),
      ...(step.formulaCards?.map((card) => `${card.expression} ${card.meaning}`) ?? []),
      ...(step.sources?.map((source) => `${source.label} ${source.why}`) ?? []),
    ].join(' '),
  })),
])
