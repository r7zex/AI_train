import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const curriculumPath = path.join(root, 'src/data/aiCurriculum.ts')
const source = fs.readFileSync(curriculumPath, 'utf8')
const errors = []

function wordCount(text) {
  return (String(text).match(/[\p{L}\p{N}_+-]+/gu) ?? []).length
}

function requireCondition(condition, message) {
  if (!condition) errors.push(message)
}

function normalizeOutput(value) {
  return String(value ?? '').trim().replace(/\r\n/g, '\n')
}

function verifyPythonTaskSolution(topicId, task) {
  if (task.kind !== 'stdin-stdout' || task.language !== 'python' || !task.solution) return

  for (const test of [...(task.sampleTests ?? []), ...(task.hiddenTests ?? [])]) {
    const result = spawnSync(process.env.CURRICULUM_AUDIT_PYTHON ?? 'python', ['-c', task.solution], {
      input: test.input ?? '',
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true,
    })
    const actual = normalizeOutput(result.stdout)
    const expected = normalizeOutput(test.expectedOutput ?? '')
    requireCondition(result.status === 0, `${topicId}: task ${task.id} solution failed on ${test.id}: ${result.stderr}`)
    requireCondition(actual === expected, `${topicId}: task ${task.id} solution mismatch on ${test.id}: expected "${expected}", got "${actual}".`)
  }
}

function loadFlowTopics() {
  const runtimeSource = source
    .replace(/^import type .*$/gm, '')
    .replace(/export const curriculumBlocks =/, 'const curriculumBlocks =')
    .replace(/export const flowTopics: FlowTopic\[\] =/, 'const flowTopics =')
    .concat('\n;({ curriculumBlocks, flowTopics });')

  return vm.runInNewContext(runtimeSource, {}, { filename: 'aiCurriculum.ts' })
}

const lineCount = source.split(/\r?\n/).length
requireCondition(lineCount >= 5000, `Curriculum source must contain at least 5000 lines, got ${lineCount}.`)

const { flowTopics } = loadFlowTopics()

requireCondition(Array.isArray(flowTopics), 'flowTopics must be an array.')
requireCondition(flowTopics.length >= 18, `Expected at least 18 topics, got ${flowTopics.length}.`)

for (const topic of flowTopics) {
  const prefix = `${topic.id}:`
  const stepTypes = new Set((topic.steps ?? []).map((step) => step.type))
  for (const type of ['theory', 'formula', 'code', 'quiz', 'practice', 'recap']) {
    requireCondition(stepTypes.has(type), `${prefix} missing required step type ${type}.`)
  }

  const theoryStep = topic.steps.find((step) => step.type === 'theory')
  const concepts = theoryStep?.conceptCards ?? []
  requireCondition(concepts.length >= 3, `${prefix} theory step must contain at least 3 concept cards.`)

  for (const concept of concepts) {
    const conceptPrefix = `${topic.id}/${concept.id}:`
    requireCondition(wordCount(concept.theory) >= 100, `${conceptPrefix} theory must be at least 100 words.`)
    requireCondition(wordCount(concept.what) >= 30, `${conceptPrefix} what must be at least 30 words.`)
    requireCondition(wordCount(concept.why) >= 30, `${conceptPrefix} why must be at least 30 words.`)
    requireCondition(wordCount(concept.where) >= 30, `${conceptPrefix} where must be at least 30 words.`)
    requireCondition(wordCount(concept.formula?.meaning ?? '') >= 30, `${conceptPrefix} formula meaning must be at least 30 words.`)
    requireCondition(wordCount(concept.howToUse) >= 30, `${conceptPrefix} howToUse must be at least 30 words.`)
    requireCondition((concept.params ?? []).length >= 3, `${conceptPrefix} params must contain at least 3 popular parameters.`)
    requireCondition((concept.commonMistakes ?? []).length >= 5, `${conceptPrefix} must contain at least 5 common mistakes.`)
    requireCondition(String(concept.codeExample?.code ?? '').split('\n').length >= 5, `${conceptPrefix} code example must be a full small snippet.`)
    for (const mistake of concept.commonMistakes ?? []) {
      requireCondition(wordCount(mistake.explanation) >= 30, `${conceptPrefix} mistake "${mistake.title}" must be at least 30 words.`)
    }
  }

  const quizStep = topic.steps.find((step) => step.type === 'quiz')
  const questionCount = quizStep?.quiz?.questions?.length ?? 0
  requireCondition(questionCount >= 5 && questionCount <= 10, `${prefix} quiz must contain 5-10 questions, got ${questionCount}.`)

  const practiceStep = topic.steps.find((step) => step.type === 'practice')
  const tasks = practiceStep?.practiceTasks ?? []
  requireCondition(tasks.length >= 1, `${prefix} practice step must contain at least one task.`)
  for (const task of tasks) {
    requireCondition((task.sampleTests ?? []).length >= 1, `${prefix} task ${task.id} must contain sample tests.`)
    requireCondition((task.hiddenTests ?? []).length >= 1, `${prefix} task ${task.id} must contain hidden tests.`)
    requireCondition(Boolean(task.solution), `${prefix} task ${task.id} must contain a reference solution.`)
    verifyPythonTaskSolution(topic.id, task)
  }
}

if (errors.length > 0) {
  console.error('Curriculum audit failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Curriculum audit passed: ${flowTopics.length} topics, ${lineCount} source lines.`)
