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

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideApi>
  }
}

interface PyodideApi {
  runPythonAsync: (code: string) => Promise<unknown>
  globals: {
    set: (name: string, value: unknown) => void
    get: (name: string) => unknown
  }
}

let pyodidePromise: Promise<PyodideApi> | null = null

function stableStringify(value: unknown): string {
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function normalizeOutput(value: unknown): string {
  return String(value ?? '').trim().replace(/\r\n/g, '\n')
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

function executeJavaScriptUserCode(code: string) {
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

async function loadPyodideApi() {
  if (typeof window === 'undefined') {
    throw new Error('Python runner is available only in the browser')
  }

  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector<HTMLScriptElement>('script[data-pyodide="true"]')
          if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true })
            existing.addEventListener('error', () => reject(new Error('Не удалось загрузить Pyodide')), { once: true })
            return
          }

          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js'
          script.async = true
          script.dataset.pyodide = 'true'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Не удалось загрузить Pyodide'))
          document.head.appendChild(script)
        })
      }

      if (!window.loadPyodide) {
        throw new Error('Pyodide API недоступен')
      }

      return window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/' })
    })()
  }

  return pyodidePromise
}

async function runPythonStdInCase(code: string, test: PracticeTestCase): Promise<JudgeCaseResult> {
  const pyodide = await loadPyodideApi()
  pyodide.globals.set('__judge_input__', test.input ?? '')
  pyodide.globals.set('__user_code__', code)

  const result = await pyodide.runPythonAsync(`
import io
import sys

stdin_backup = sys.stdin
stdout_backup = sys.stdout
sys.stdin = io.StringIO(__judge_input__)
sys.stdout = io.StringIO()
namespace = {"__name__": "__main__"}

try:
    exec(__user_code__, namespace)
    __judge_output__ = sys.stdout.getvalue()
finally:
    sys.stdin = stdin_backup
    sys.stdout = stdout_backup

__judge_output__
`)

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

async function runStdInCase(task: PracticeTask, code: string, test: PracticeTestCase): Promise<JudgeCaseResult> {
  if (task.language === 'python') {
    return runPythonStdInCase(code, test)
  }

  const executed = executeJavaScriptUserCode(code)
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

async function runStdInCases(task: PracticeTask, code: string, tests: PracticeTestCase[]) {
  const results: JudgeCaseResult[] = []
  for (const test of tests) {
    results.push(await runStdInCase(task, code, test))
  }
  return results
}

export async function judgeTask(task: PracticeTask, code: string, includeHidden: boolean): Promise<JudgeRunResult> {
  const structuralFeedback = getStructuralFeedback(code, task)

  try {
    const sampleResults = task.kind === 'stdin-stdout' || task.kind === 'input-output'
      ? await runStdInCases(task, code, task.sampleTests)
      : task.sampleTests.map((test) => runFunctionCase(executeJavaScriptUserCode(code), task, test))

    const hiddenResults = includeHidden
      ? task.kind === 'stdin-stdout' || task.kind === 'input-output'
        ? await runStdInCases(task, code, task.hiddenTests)
        : task.hiddenTests.map((test) => runFunctionCase(executeJavaScriptUserCode(code), task, test))
      : []

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
