import type { PracticeTask, PracticeTestCase } from '../data/courseFlow'

export interface JudgeCaseResult {
  id: string
  description: string
  passed: boolean
  actual: string
  expected: string
  diff?: string
}

export interface JudgeRunResult {
  passed: boolean
  score: number
  sampleResults: JudgeCaseResult[]
  hiddenResults: JudgeCaseResult[]
  runtimeError?: string
  structuralFeedback: string[]
}

type AnyValue = string | number | boolean | null | undefined | AnyValue[]

function stableStringify(value: unknown): string {
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function normalizeOutput(value: unknown): string {
  return String(value).trim().replace(/\r\n/g, '\n')
}

function createDiff(actual: string, expected: string) {
  const actualLines = actual.split('\n')
  const expectedLines = expected.split('\n')
  const maxLen = Math.max(actualLines.length, expectedLines.length)
  const diff: string[] = []
  for (let i = 0; i < maxLen; i += 1) {
    const a = actualLines[i] ?? '(missing)'
    const e = expectedLines[i] ?? '(missing)'
    if (a === e) diff.push(`  ${i + 1}: ${a}`)
    else diff.push(`- ${i + 1}: ${a}\n+ ${i + 1}: ${e}`)
  }
  return diff.join('\n')
}

function executeUserCode(code: string) {
  const exports: Record<string, unknown> = {}
  const wrapped = `${code}\n;return { ...exports, ...(typeof solve !== 'undefined' ? { solve } : {}), ...(typeof normalizeScores !== 'undefined' ? { normalizeScores } : {}), ...(typeof module !== 'undefined' && module.exports ? module.exports : {}) }`
  const fn = new Function('exports', 'module', wrapped)
  const module = { exports }
  return fn(exports, module) as Record<string, unknown>
}

function runFunctionCase(executed: Record<string, unknown>, task: PracticeTask, test: PracticeTestCase): JudgeCaseResult {
  const callable = task.functionName ? executed[task.functionName] : undefined
  if (typeof callable !== 'function') {
    return {
      id: test.id,
      description: test.description,
      passed: false,
      actual: 'Function not found',
      expected: task.functionName ?? 'function',
    }
  }

  const result = (callable as (...args: AnyValue[]) => unknown)(...((test.args ?? []) as AnyValue[]))
  const actual = normalizeOutput(stableStringify(result))
  const expected = normalizeOutput(stableStringify(test.expectedValue))
  return {
    id: test.id,
    description: test.description,
    passed: actual === expected,
    actual,
    expected,
    diff: actual === expected ? undefined : createDiff(actual, expected),
  }
}

function runStdInCase(executed: Record<string, unknown>, test: PracticeTestCase): JudgeCaseResult {
  const callable = executed.solve
  if (typeof callable !== 'function') {
    return {
      id: test.id,
      description: test.description,
      passed: false,
      actual: 'solve(input) not found',
      expected: 'solve(input) should return a string',
    }
  }
  const result = (callable as (input: string) => unknown)(test.input ?? '')
  const actual = normalizeOutput(result)
  const expected = normalizeOutput(test.expectedOutput ?? '')
  return {
    id: test.id,
    description: test.description,
    passed: actual === expected,
    actual,
    expected,
    diff: actual === expected ? undefined : createDiff(actual, expected),
  }
}

function getStructuralFeedback(code: string, task: PracticeTask) {
  return (task.structuralChecks ?? []).map((check) => (
    code.includes(check)
      ? `✓ Найден паттерн: ${check}`
      : `✗ Не найден паттерн: ${check}`
  ))
}

export function judgeTask(task: PracticeTask, code: string, includeHidden: boolean): JudgeRunResult {
  const structuralFeedback = getStructuralFeedback(code, task)

  try {
    const executed = executeUserCode(code)
    const runCase = (test: PracticeTestCase) => {
      if (task.kind === 'stdin-stdout') return runStdInCase(executed, test)
      return runFunctionCase(executed, task, test)
    }

    const sampleResults = task.sampleTests.map(runCase)
    const hiddenResults = includeHidden ? task.hiddenTests.map(runCase) : []
    const allResults = [...sampleResults, ...hiddenResults]
    const passedCases = allResults.filter((item) => item.passed).length
    const score = allResults.length > 0 ? Math.round((passedCases / allResults.length) * 100) : 0

    return {
      passed: allResults.length > 0 && allResults.every((item) => item.passed),
      score,
      sampleResults,
      hiddenResults,
      structuralFeedback,
    }
  } catch (error) {
    return {
      passed: false,
      score: 0,
      sampleResults: [],
      hiddenResults: [],
      runtimeError: error instanceof Error ? error.message : 'Unknown runtime error',
      structuralFeedback,
    }
  }
}
