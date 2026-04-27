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

type AnyInput = string | number | boolean | AnyInput[]

export interface PracticeTestCase {
  id: string
  description: string
  input?: string
  args?: AnyInput[]
  expectedOutput?: string
  expectedValue?: string | number | boolean
}

export interface PracticeTask {
  id: string
  title: string
  kind: 'function' | 'stdin-stdout' | 'input-output' | 'fill-in-code' | 'debugging' | 'structural'
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

export interface ParameterInfo {
  name: string
  meaning: string
}

export interface CommonMistake {
  title: string
  explanation: string
}

export interface ConceptCodeExample {
  language: string
  code: string
  output?: string
  explanation: string[]
}

export interface ConceptCard {
  id: string
  title: string
  shortTitle?: string
  signature?: string
  definition?: string
  parametersIntro?: string
  minimalExample?: ConceptCodeExample
  theory: string
  what: string
  why: string
  where: string
  formula: FormulaCard
  howToUse: string
  params: ParameterInfo[]
  codeExample: ConceptCodeExample
  commonMistakes: CommonMistake[]
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
  conceptCards?: ConceptCard[]
  formulaCards?: FormulaCard[]
  workedExample?: Array<{ title: string; body: string }>
  codeExample?: ConceptCodeExample
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
  sources: SourceLink[]
  steps: FlowStep[]
}

export const stepTypeMeta: Record<FlowStepType, { icon: string; label: string; accent: string; short: string }> = {
  theory: { icon: 'doc', label: 'Теория', accent: 'border-slate-300 bg-white text-slate-700', short: 'Теория' },
  terminology: { icon: 'terms', label: 'Термины', accent: 'border-slate-300 bg-white text-slate-700', short: 'Термины' },
  formula: { icon: 'math', label: 'Формулы', accent: 'border-slate-300 bg-white text-slate-700', short: 'Формулы' },
  intuition: { icon: 'idea', label: 'Интуиция', accent: 'border-slate-300 bg-white text-slate-700', short: 'Интуиция' },
  'worked-example': { icon: 'calc', label: 'Пример', accent: 'border-slate-300 bg-white text-slate-700', short: 'Пример' },
  quiz: { icon: 'help', label: 'Тест', accent: 'border-slate-300 bg-white text-slate-700', short: 'Тест' },
  code: { icon: 'code', label: 'Код', accent: 'border-slate-300 bg-white text-slate-700', short: 'Код' },
  practice: { icon: 'terminal', label: 'Практика', accent: 'border-slate-300 bg-white text-slate-700', short: 'Практика' },
  pitfalls: { icon: 'alert', label: 'Ошибки', accent: 'border-slate-300 bg-white text-slate-700', short: 'Ошибки' },
  recap: { icon: 'list', label: 'Шпаргалка', accent: 'border-slate-300 bg-white text-slate-700', short: 'Шпаргалка' },
  sources: { icon: 'link', label: 'Источники', accent: 'border-slate-300 bg-white text-slate-700', short: 'Источники' },
}
