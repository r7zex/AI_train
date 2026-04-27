import type { ConceptCodeExample, FlowStep, FlowTopic, FormulaCard, LessonSection, PracticeTask } from '../aiCurriculumTypes'
import type { Quiz } from '../quizzes'

export const curriculumBlocks = [
  {
    id: 'intro-ai-ml',
    title: 'Введение в ИИ и машинное обучение',
    icon: '01',
    description: 'ИИ, машинное обучение, типы ML-задач и базовая структура ML-проекта.',
    order: 1,
  },
  {
    id: 'numpy-ml',
    title: 'NumPy для машинного обучения',
    icon: '02',
    description: 'Массивы, shape, dtype, срезы, векторизация, axis, маски, broadcasting и random.',
    order: 2,
  },
]

export const commonSources = [
  {
    label: 'Google Machine Learning Crash Course',
    type: 'course' as const,
    why: 'Короткие прикладные объяснения базовых понятий ML, данных, метрик и обучения моделей.',
    url: 'https://developers.google.com/machine-learning/crash-course/',
  },
  {
    label: 'scikit-learn User Guide',
    type: 'docs' as const,
    why: 'Практические определения признаков, target, моделей, метрик и baseline-подходов.',
    url: 'https://scikit-learn.org/stable/user_guide.html',
  },
  {
    label: 'NumPy documentation',
    type: 'docs' as const,
    why: 'Официальная справка по ndarray, созданию массивов, shape, axis, broadcasting и random.',
    url: 'https://numpy.org/doc/stable/',
  },
]

export function dedent(value: string) {
  const lines = value.replace(/\r\n/g, '\n').split('\n')
  while (lines.length > 0 && lines[0].trim().length === 0) lines.shift()
  while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) lines.pop()
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^ */)?.[0].length ?? 0)
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0
  return lines.map((line) => line.slice(minIndent)).join('\n')
}

export const code = (language: string, source: string, output?: string, explanation = ''): ConceptCodeExample => ({
  language,
  code: dedent(source),
  ...(output ? { output: dedent(output) } : {}),
  explanation: explanation ? [explanation] : [],
})

export const section = (
  id: string,
  title: string,
  paragraphs: string[],
  options: Pick<LessonSection, 'bullets' | 'callouts' | 'table' | 'codeExamples'> = {},
): LessonSection => ({
  id,
  title,
  paragraphs,
  ...options,
})

export const callout = (
  title: string,
  body: string,
  tone: 'important' | 'summary' | 'example' | 'remember' | 'schema' = 'important',
) => ({
  title,
  body,
  tone,
})

const functionReturnDescriptions: Record<string, string> = {
  'np.zeros()': 'возвращает массив заданной формы, заполненный нулями',
  'np.ones()': 'возвращает массив заданной формы, заполненный единицами',
  'np.full()': 'возвращает массив заданной формы, заполненный выбранным значением',
  'np.arange()': 'возвращает последовательность чисел с заданным шагом',
  'np.linspace()': 'возвращает заданное количество равномерных точек между началом и концом',
  'arr.shape': 'возвращает форму массива: размеры по каждой оси',
  'arr.ndim': 'возвращает число измерений массива',
  'arr.size': 'возвращает общее количество элементов массива',
  'arr.dtype': 'возвращает тип данных элементов массива',
  'arr.astype()': 'возвращает новый массив с элементами другого типа',
  'np.sum()': 'считает сумму элементов массива',
  'np.mean()': 'считает среднее значение массива',
  'np.min()': 'возвращает минимальное значение массива',
  'np.max()': 'возвращает максимальное значение массива',
  'np.var()': 'считает дисперсию значений',
  'np.std()': 'считает стандартное отклонение значений',
  'np.median()': 'возвращает медиану массива',
  'np.quantile()': 'возвращает квантиль массива',
  'np.percentile()': 'возвращает процентиль массива',
  'np.sort()': 'возвращает отсортированную копию массива',
  'np.argsort()': 'возвращает индексы, которые отсортируют массив',
  'np.unique()': 'возвращает уникальные значения массива',
  'np.argmax()': 'возвращает индекс максимального значения',
  'np.argmin()': 'возвращает индекс минимального значения',
  'arr.reshape()': 'возвращает массив с теми же данными, но другой формой',
  'arr.T': 'возвращает транспонированный массив',
  'arr.flatten()': 'возвращает плоскую копию массива',
  'np.where()': 'возвращает значения, выбранные по условию',
  'np.any()': 'проверяет, есть ли хотя бы одно значение True',
  'np.all()': 'проверяет, все ли значения равны True',
  'rng.integers()': 'возвращает случайные целые числа из заданного диапазона',
  'rng.normal()': 'возвращает случайные числа из нормального распределения',
  'rng.uniform()': 'возвращает случайные числа из равномерного распределения',
  'rng.permutation()': 'возвращает случайную перестановку значений',
  'rng.choice()': 'возвращает случайную выборку из набора',
}

function normalizeFunctionTitle(title: string) {
  return title.replace(/`/g, '')
}

export const functionSection = (
  id: string,
  title: string,
  signature: string,
  params: string[],
  exampleCode: string,
  output: string,
  explanation: string,
) => section(id, title, [
  `**Что считает/возвращает:** ${functionReturnDescriptions[normalizeFunctionTitle(title)] ?? explanation}`,
  `**Синтаксис:** \`${signature}\``,
  `**Параметры:** ${params.join('; ')}.`,
  '**Пример:** только эта функция, без соседних функций из группы.',
], {
  codeExamples: [
    code('python', exampleCode, output, explanation),
  ],
})

export const theoryStep = (id: string, title: string, summary: string, sections: LessonSection[]): FlowStep => ({
  id,
  type: 'theory',
  title,
  summary,
  sections,
})

export const theoryStepWithFormulas = (
  id: string,
  title: string,
  summary: string,
  sections: LessonSection[],
  formulaCards: FormulaCard[],
): FlowStep => ({
  id,
  type: 'theory',
  title,
  summary,
  sections,
  formulaCards,
})

export const quizStep = (id: string, title: string, summary: string, quiz: Quiz): FlowStep => ({
  id,
  type: 'quiz',
  title,
  summary,
  quiz,
})

export const practiceStep = (id: string, title: string, summary: string, task: PracticeTask): FlowStep => ({
  id,
  type: 'practice',
  title,
  summary,
  practiceTasks: [task],
})

export const singleQuiz = (
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

export const makeStdinTask = (
  id: string,
  title: string,
  statement: string,
  starterCode: string,
  sampleTests: PracticeTask['sampleTests'],
  hiddenTests: PracticeTask['hiddenTests'],
  solution: string,
  tips: string[] = [
    'Сначала разберите входные данные.',
    'Заполните строки с TODO самостоятельно.',
    'Проверьте решение на sample tests перед отправкой.',
  ],
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
  solution: dedent(solution),
})

function topicBase(
  id: string,
  title: string,
  order: number,
  summary: string,
  blockId: string,
  blockTitle: string,
  blockIcon: string,
  subblockId: string,
  subblockTitle: string,
  simpleExplanation: string,
  terminology: string[],
  formulas: string[],
  themeCheatsheet: string[],
  steps: FlowStep[],
): FlowTopic {
  return {
    id,
    title,
    order,
    summary,
    blockId,
    blockTitle,
    blockIcon,
    subblockId,
    subblockTitle,
    level: 'junior',
    simpleExplanation,
    terminology,
    formulas,
    themeCheatsheet,
    sources: commonSources,
    steps,
  }
}

export const introTopic = (
  id: string,
  title: string,
  order: number,
  summary: string,
  simpleExplanation: string,
  terminology: string[],
  formulas: string[],
  themeCheatsheet: string[],
  steps: FlowStep[],
) => topicBase(
  id,
  title,
  order,
  summary,
  'intro-ai-ml',
  'Введение в ИИ и машинное обучение',
  '01',
  `${id}-subblock`,
  title,
  simpleExplanation,
  terminology,
  formulas,
  themeCheatsheet,
  steps,
)

export const numpyTopic = (
  id: string,
  title: string,
  order: number,
  summary: string,
  simpleExplanation: string,
  terminology: string[],
  formulas: string[],
  themeCheatsheet: string[],
  steps: FlowStep[],
) => topicBase(
  id,
  title,
  order,
  summary,
  'numpy-ml',
  'NumPy для машинного обучения',
  '02',
  `${id}-subblock`,
  title,
  simpleExplanation,
  terminology,
  formulas,
  themeCheatsheet,
  steps,
)
