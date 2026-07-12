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

interface PythonWorkerResponse {
  id: number
  ok?: boolean
  status?: 'running'
  outputs?: string[]
  error?: string
}

function stableStringify(value: unknown): string {
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}

function normalizeOutput(value: unknown): string {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trimEnd())
    .join('\n')
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

function detectPythonPackages(code: string) {
  const packages = new Set<string>()
  if (/\b(import|from)\s+numpy\b/.test(code)) packages.add('numpy')
  if (/\b(import|from)\s+pandas\b/.test(code)) packages.add('pandas')
  if (/\b(import|from)\s+matplotlib\b/.test(code)) packages.add('matplotlib')
  if (/\b(import|from)\s+sklearn\b/.test(code)) packages.add('scikit-learn')
  return [...packages]
}

async function runPythonCases(code: string, tests: PracticeTestCase[], signal?: AbortSignal): Promise<JudgeCaseResult[]> {
  if (typeof window === 'undefined') throw new Error('Python runner is available only in the browser')
  if (signal?.aborted) throw new Error('Выполнение отменено пользователем.')

  const workerUrl = `${import.meta.env.BASE_URL}python-judge-worker.js`
  const worker = new Worker(workerUrl)
  const requestId = Date.now()

  return new Promise<JudgeCaseResult[]>((resolve, reject) => {
    let executionTimeoutId: number | undefined

    const cleanup = () => {
      window.clearTimeout(startupTimeoutId)
      if (executionTimeoutId !== undefined) window.clearTimeout(executionTimeoutId)
      signal?.removeEventListener('abort', abort)
      worker.terminate()
    }

    const abort = () => {
      cleanup()
      reject(new Error('Выполнение отменено пользователем.'))
    }

    const startupTimeoutId = window.setTimeout(() => {
      cleanup()
      reject(new Error('Python-окружение не запустилось за 60 секунд. Проверьте соединение и повторите попытку.'))
    }, 60_000)

    signal?.addEventListener('abort', abort, { once: true })

    worker.onerror = (event) => {
      cleanup()
      reject(new Error(event.message || 'Не удалось запустить Python worker.'))
    }

    worker.onmessage = (event: MessageEvent<PythonWorkerResponse>) => {
      if (event.data.id !== requestId) return
      const response = event.data
      if (response.status === 'running') {
        window.clearTimeout(startupTimeoutId)
        executionTimeoutId = window.setTimeout(() => {
          cleanup()
          reject(new Error('Превышен лимит времени: 15 секунд. Проверьте циклы и сложность решения.'))
        }, 15_000)
        return
      }
      cleanup()
      if (!response.ok) {
        reject(new Error(response.error || 'Python завершился с ошибкой.'))
        return
      }

      const outputs = response.outputs ?? []
      resolve(tests.map((test, index) => {
        const actual = normalizeOutput(outputs[index] ?? '')
        const expected = normalizeOutput(test.expectedOutput ?? '')
        return {
          id: test.id,
          description: test.description,
          passed: actual === expected,
          actual,
          expected,
          diff: actual === expected ? undefined : createDiff(actual, expected),
        }
      }))
    }

    worker.postMessage({
      id: requestId,
      code,
      cases: tests.map((test) => ({ input: test.input ?? '' })),
      packages: detectPythonPackages(code),
    })
  })
}

async function runJavaScriptStdInCase(code: string, test: PracticeTestCase): Promise<JudgeCaseResult> {
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

async function runStdInCases(task: PracticeTask, code: string, tests: PracticeTestCase[], signal?: AbortSignal) {
  if (task.language === 'python') return runPythonCases(code, tests, signal)

  const results: JudgeCaseResult[] = []
  for (const test of tests) {
    results.push(await runJavaScriptStdInCase(code, test))
  }
  return results
}

export async function judgeTask(task: PracticeTask, code: string, includeHidden: boolean, signal?: AbortSignal): Promise<JudgeRunResult> {
  const structuralFeedback = getStructuralFeedback(code, task)

  try {
    const isStdInTask = task.kind === 'stdin-stdout' || task.kind === 'input-output'
    let sampleResults: JudgeCaseResult[]
    let hiddenResults: JudgeCaseResult[]

    if (isStdInTask) {
      const selectedTests = includeHidden ? [...task.sampleTests, ...task.hiddenTests] : task.sampleTests
      const allStdInResults = await runStdInCases(task, code, selectedTests, signal)
      sampleResults = allStdInResults.slice(0, task.sampleTests.length)
      hiddenResults = includeHidden ? allStdInResults.slice(task.sampleTests.length) : []
    } else {
      sampleResults = task.sampleTests.map((test) => runFunctionCase(executeJavaScriptUserCode(code), task, test))
      hiddenResults = includeHidden
        ? task.hiddenTests.map((test) => runFunctionCase(executeJavaScriptUserCode(code), task, test))
        : []
    }

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
