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
  ['numpy-why', 7],
  ['numpy-array-creation', 9],
  ['numpy-shape-ndim-dtype', 7],
  ['numpy-indexing-slices', 9],
  ['numpy-vector-operations', 7],
  ['numpy-aggregations-statistics', 9],
  ['numpy-2d-axis', 7],
  ['numpy-masks-where', 8],
  ['numpy-broadcasting', 9],
  ['numpy-random-reproducibility', 8],
  ['pandas-why-dataframe', 8],
  ['pandas-read-inspect', 9],
  ['pandas-selection', 9],
  ['pandas-filtering-sorting', 9],
  ['pandas-missing-duplicates', 9],
  ['pandas-groupby', 9],
  ['pandas-types-preparation', 9],
  ['ml-foundations-data-target', 5],
  ['ml-foundations-model-fit-predict', 6],
  ['ml-foundations-train-test-baseline-metrics', 7],
  ['ml-foundations-project-cycle', 5],
])

const expectedQuizCounts = new Map([
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
  ['pandas-why-dataframe', 2],
  ['pandas-read-inspect', 2],
  ['pandas-selection', 2],
  ['pandas-filtering-sorting', 2],
  ['pandas-missing-duplicates', 2],
  ['pandas-groupby', 2],
  ['pandas-types-preparation', 2],
  ['ml-foundations-data-target', 1],
  ['ml-foundations-model-fit-predict', 1],
  ['ml-foundations-train-test-baseline-metrics', 2],
  ['ml-foundations-project-cycle', 1],
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
requireCondition(curriculumBlocks.length === 7, `Expected exactly 7 curriculum blocks, got ${curriculumBlocks.length}.`)
requireCondition(flowTopics.length === 36, `Expected exactly 36 topics, got ${flowTopics.length}.`)

const blockIds = curriculumBlocks.map((block) => block.id)
requireCondition(
  blockIds.join(',') === 'numpy-ml,pandas-eda,visualization-eda,ml-foundations,linear-models,trees-ensembles,svm-clustering',
  `Unexpected block ids: ${blockIds.join(',')}.`,
)

const topicIds = flowTopics.map((topic) => topic.id)
requireCondition(
  topicIds.slice(0, 17).join(',') === [...expectedStepCounts.keys()].slice(0, 17).join(','),
  `Unexpected NumPy/pandas topic order: ${topicIds.slice(0, 17).join(',')}.`,
)

const totalSteps = flowTopics.reduce((sum, topic) => sum + topic.steps.length, 0)
requireCondition(totalSteps === 240, `Expected 240 total steps, got ${totalSteps}.`)

for (const topic of flowTopics) {
  const prefix = `${topic.id}:`
  const expectedCount = expectedStepCounts.get(topic.id)
  if (expectedCount != null) {
    requireCondition(topic.steps.length === expectedCount, `${prefix} expected ${expectedCount} steps, got ${topic.steps.length}.`)
  } else {
    requireCondition(topic.steps.length >= 5, `${prefix} expected at least 5 steps, got ${topic.steps.length}.`)
  }
  requireCondition(blockIds.includes(topic.blockId), `${prefix} unexpected blockId ${topic.blockId}.`)
  requireCondition(!['intro-ai-ml', 'python-for-ai', 'data-prep'].includes(topic.blockId), `${prefix} old block id must not be displayed.`)

  const stepTypes = topic.steps.map((step) => step.type)
  requireCondition(stepTypes.includes('theory'), `${prefix} missing theory steps.`)
  const expectedQuizCount = expectedQuizCounts.get(topic.id) ?? 1
  requireCondition(stepTypes.filter((type) => type === 'quiz').length === expectedQuizCount, `${prefix} unexpected quiz step count.`)
  requireCondition(stepTypes.includes('practice'), `${prefix} missing practice step.`)

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

const curriculumText = collectText(flowTopics).join(' ').toLowerCase()
const requiredCoverage = [
  ['matplotlib', 'Matplotlib'],
  ['разведочный анализ', 'EDA'],
  ['classification', 'classification'],
  ['regression', 'regression'],
  ['clustering', 'clustering'],
  ['linearregression', 'LinearRegression'],
  ['logisticregression', 'LogisticRegression'],
  ['decisiontreeclassifier', 'DecisionTreeClassifier'],
  ['randomforestclassifier', 'RandomForestClassifier'],
  ['baggingclassifier', 'BaggingClassifier'],
  ['gradientboostingclassifier', 'GradientBoostingClassifier'],
  ['svc', 'SVC'],
  ['train_test_split', 'train_test_split'],
  ['gridsearchcv', 'GridSearchCV'],
  ['randomizedsearchcv', 'RandomizedSearchCV'],
  ['confusion matrix', 'confusion matrix'],
  ['class_weight', 'class_weight'],
  ['l1', 'L1'],
  ['l2', 'L2'],
  ['корреляц', 'correlation matrix'],
]

for (const [needle, label] of requiredCoverage) {
  requireCondition(curriculumText.includes(needle), `Required curriculum coverage is missing: ${label}.`)
}

if (errors.length > 0) {
  console.error('Curriculum audit failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Curriculum audit passed: ${curriculumBlocks.length} blocks, ${flowTopics.length} topics, ${totalSteps} steps.`)
