import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import * as ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const curriculumPath = path.join(root, 'src/data/aiCurriculum.ts')
const errors = []

const expectedStepCounts = new Map([
  ['intro-ai-ml-dl', 6],
  ['programming-vs-ml', 6],
  ['ml-task-types', 8],
  ['data-features-target', 6],
  ['ml-model-fit-predict-metric', 9],
  ['numpy-why', 6],
  ['numpy-array-creation', 7],
  ['numpy-shape-ndim-dtype', 6],
  ['numpy-indexing-slices', 7],
  ['numpy-vector-operations', 6],
  ['numpy-aggregations-statistics', 7],
  ['numpy-2d-axis', 6],
  ['numpy-masks-where', 7],
  ['numpy-broadcasting', 8],
  ['numpy-random-reproducibility', 7],
])

const expectedQuizCounts = new Map([
  ['intro-ai-ml-dl', 2],
  ['programming-vs-ml', 2],
  ['ml-task-types', 2],
  ['data-features-target', 1],
  ['ml-model-fit-predict-metric', 2],
  ['numpy-why', 2],
  ['numpy-array-creation', 2],
  ['numpy-shape-ndim-dtype', 2],
  ['numpy-indexing-slices', 2],
  ['numpy-vector-operations', 2],
  ['numpy-aggregations-statistics', 2],
  ['numpy-2d-axis', 2],
  ['numpy-masks-where', 2],
  ['numpy-broadcasting', 2],
  ['numpy-random-reproducibility', 2],
])

function requireCondition(condition, message) {
  if (!condition) errors.push(message)
}

function normalizeOutput(value) {
  return String(value ?? '').trim().replace(/\r\n/g, '\n')
}

function resolveTsModule(fromFile, specifier) {
  if (!specifier.startsWith('.')) {
    throw new Error(`Unsupported import in audit: ${specifier}`)
  }

  const basePath = path.resolve(path.dirname(fromFile), specifier)
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
  ]
  const resolved = candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
  if (!resolved) throw new Error(`Cannot resolve ${specifier} from ${fromFile}`)
  return resolved
}

const moduleCache = new Map()

function loadTsModule(filePath) {
  const resolvedPath = path.resolve(filePath)
  if (moduleCache.has(resolvedPath)) return moduleCache.get(resolvedPath).exports

  const source = fs.readFileSync(resolvedPath, 'utf8')
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: resolvedPath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  })

  for (const diagnostic of diagnostics ?? []) {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    requireCondition(false, `TypeScript transpile diagnostic: ${message}`)
  }

  const module = { exports: {} }
  moduleCache.set(resolvedPath, module)
  const context = {
    exports: module.exports,
    module,
    require: (specifier) => loadTsModule(resolveTsModule(resolvedPath, specifier)),
  }
  vm.runInNewContext(outputText, context, { filename: resolvedPath })
  return module.exports
}

function loadCurriculum() {
  return loadTsModule(curriculumPath)
}

function verifyPythonTaskSolution(topicId, task) {
  if (task.kind !== 'stdin-stdout' || task.language !== 'python') return
  requireCondition(Boolean(task.solution), `${topicId}: task ${task.id} must contain a reference solution.`)
  if (!task.solution) return

  for (const test of [...(task.sampleTests ?? []), ...(task.hiddenTests ?? [])]) {
    const result = spawnSync(process.env.CURRICULUM_AUDIT_PYTHON ?? 'python', ['-c', task.solution], {
      input: test.input ?? '',
      encoding: 'utf8',
      env: { ...process.env, PYTHONUTF8: '1' },
      timeout: 10000,
      windowsHide: true,
    })
    const actual = normalizeOutput(result.stdout)
    const expected = normalizeOutput(test.expectedOutput ?? '')
    requireCondition(result.status === 0, `${topicId}: task ${task.id} solution failed on ${test.id}: ${result.stderr}`)
    requireCondition(actual === expected, `${topicId}: task ${task.id} solution mismatch on ${test.id}: expected "${expected}", got "${actual}".`)
  }
}

function collectText(value) {
  if (value == null) return []
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectText)
  if (typeof value === 'object') return Object.values(value).flatMap(collectText)
  return []
}

const { curriculumBlocks, flowTopics } = loadCurriculum()

requireCondition(Array.isArray(curriculumBlocks), 'curriculumBlocks must be an array.')
requireCondition(Array.isArray(flowTopics), 'flowTopics must be an array.')
requireCondition(curriculumBlocks.length === 2, `Expected exactly 2 curriculum blocks, got ${curriculumBlocks.length}.`)
requireCondition(flowTopics.length === 15, `Expected exactly 15 topics, got ${flowTopics.length}.`)

const blockIds = curriculumBlocks.map((block) => block.id)
requireCondition(blockIds.join(',') === 'intro-ai-ml,numpy-ml', `Unexpected block ids: ${blockIds.join(',')}.`)

const topicIds = flowTopics.map((topic) => topic.id)
requireCondition(topicIds.join(',') === [...expectedStepCounts.keys()].join(','), `Unexpected topic order: ${topicIds.join(',')}.`)

const totalSteps = flowTopics.reduce((sum, topic) => sum + topic.steps.length, 0)
requireCondition(totalSteps === 102, `Expected 102 total steps, got ${totalSteps}.`)

for (const topic of flowTopics) {
  const prefix = `${topic.id}:`
  const expectedCount = expectedStepCounts.get(topic.id)
  requireCondition(topic.steps.length === expectedCount, `${prefix} expected ${expectedCount} steps, got ${topic.steps.length}.`)
  requireCondition(topic.blockId === 'intro-ai-ml' || topic.blockId === 'numpy-ml', `${prefix} unexpected blockId ${topic.blockId}.`)
  requireCondition(!['python-for-ai', 'data-prep'].includes(topic.blockId), `${prefix} old block id must not be displayed.`)

  const stepTypes = topic.steps.map((step) => step.type)
  requireCondition(stepTypes.includes('theory'), `${prefix} missing theory steps.`)
  requireCondition(stepTypes.filter((type) => type === 'quiz').length === expectedQuizCounts.get(topic.id), `${prefix} unexpected quiz step count.`)
  if (topic.id !== 'intro-ai-ml-dl') {
    requireCondition(stepTypes.includes('practice'), `${prefix} missing practice step.`)
  } else {
    requireCondition(!stepTypes.includes('practice'), `${prefix} conceptual intro topic should not contain artificial practice.`)
  }

  for (const step of topic.steps.filter((item) => item.type === 'theory')) {
    const sections = step.sections ?? []
    requireCondition(sections.length > 0, `${prefix} theory step ${step.id} must contain sections.`)
    const text = collectText(sections).join(' ')
    requireCondition(text.length >= 300, `${prefix} theory step ${step.id} is too short.`)
  }

  for (const step of topic.steps.filter((item) => item.type === 'quiz')) {
    const questions = step.quiz?.questions ?? []
    requireCondition(questions.length >= 1, `${prefix} quiz step ${step.id} must contain questions.`)
    for (const question of questions) {
      const visibleText = [question.question, ...(question.options ?? []).map((option) => option.text), question.explanation].join(' ')
      requireCondition(!/верн(ый|ого)\s+ответ|ответ:\s*[a-d]/i.test(visibleText), `${prefix} quiz ${question.id} reveals answer in visible text.`)
    }
  }

  for (const step of topic.steps.filter((item) => item.type === 'practice')) {
    const tasks = step.practiceTasks ?? []
    requireCondition(tasks.length === 1, `${prefix} practice step ${step.id} must contain one task.`)
    for (const task of tasks) {
      requireCondition((task.sampleTests ?? []).length >= 1, `${prefix} task ${task.id} must contain sample tests.`)
      requireCondition((task.hiddenTests ?? []).length >= 1, `${prefix} task ${task.id} must contain hidden tests.`)
      requireCondition(task.starterCode.includes('TODO'), `${prefix} task ${task.id} starter code must contain TODO markers.`)
      requireCondition(normalizeOutput(task.starterCode) !== normalizeOutput(task.solution), `${prefix} task ${task.id} starter code must not equal solution.`)
      requireCondition(!/\bprint\s*\(/.test(task.starterCode), `${prefix} task ${task.id} starter code should not contain ready output calls.`)
      verifyPythonTaskSolution(topic.id, task)
    }
  }
}

if (errors.length > 0) {
  console.error('Curriculum audit failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Curriculum audit passed: ${curriculumBlocks.length} blocks, ${flowTopics.length} topics, ${totalSteps} steps.`)
