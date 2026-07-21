import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import * as ts from 'typescript'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const curriculumPath = path.join(root, 'src/data/aiCurriculum.ts')
const glossaryPath = path.join(root, 'src/data/courseGlossary.ts')
const courseVisualRegistryPath = path.join(root, 'src/data/courseVisuals.ts')
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
const { getCourseGlossaryEntry, hasLatinLetters } = loadTsModule(glossaryPath)
const { getCourseVisuals } = loadTsModule(courseVisualRegistryPath)

if (process.env.CURRICULUM_PRINT_TERMS === '1') {
  const terms = [...new Set(flowTopics.flatMap((topic) => topic.terminology))].sort((left, right) => left.localeCompare(right))
  console.log(JSON.stringify(terms, null, 2))
  process.exit(0)
}

requireCondition(Array.isArray(curriculumBlocks), 'curriculumBlocks must be an array.')
requireCondition(Array.isArray(flowTopics), 'flowTopics must be an array.')
requireCondition(curriculumBlocks.length === 14, `Expected exactly 14 curriculum blocks, got ${curriculumBlocks.length}.`)
requireCondition(flowTopics.length === 84, `Expected exactly 84 topics, got ${flowTopics.length}.`)

const blockIds = curriculumBlocks.map((block) => block.id)
requireCondition(
  blockIds.join(',') === 'python-start,numpy-ml,pandas-eda,visualization-eda,ml-foundations,linear-models,trees-ensembles,svm-clustering,research-statistics,biomedical-ml,genomics-cancer,protein-bioinformatics,biomedical-nlp,article-capstone',
  `Unexpected block ids: ${blockIds.join(',')}.`,
)

const topicIds = flowTopics.map((topic) => topic.id)
requireCondition(
  topicIds.slice(4, 21).join(',') === [...expectedStepCounts.keys()].slice(0, 17).join(','),
  `Unexpected NumPy/pandas topic order: ${topicIds.slice(4, 21).join(',')}.`,
)

const totalSteps = flowTopics.reduce((sum, topic) => sum + topic.steps.length, 0)
requireCondition(totalSteps === 618, `Expected 618 total steps, got ${totalSteps}.`)

const courseVisualsPath = process.env.CURRICULUM_VISUALS_DIR
  ? path.resolve(process.env.CURRICULUM_VISUALS_DIR)
  : path.join(root, 'public/course-visuals')
requireCondition(fs.existsSync(courseVisualsPath), 'Course visual directory is missing.')
const courseVisualFiles = fs.existsSync(courseVisualsPath)
  ? fs.readdirSync(courseVisualsPath).filter((file) => file.endsWith('.png'))
  : []
requireCondition(courseVisualFiles.length === 101, `Expected exactly 101 course PNG files, got ${courseVisualFiles.length}.`)

function readPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath)
  const pngSignature = '89504e470d0a1a0a'
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== pngSignature) return null
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
}

const visualHashes = new Map()
for (const file of courseVisualFiles) {
  const filePath = path.join(courseVisualsPath, file)
  const fileBuffer = fs.readFileSync(filePath)
  const digest = createHash('sha256').update(fileBuffer).digest('hex')
  const matchingFiles = visualHashes.get(digest) ?? []
  matchingFiles.push(file)
  visualHashes.set(digest, matchingFiles)
  requireCondition(fileBuffer.length >= 10_000, `${file} is suspiciously small (${fileBuffer.length} bytes).`)
  const dimensions = readPngDimensions(filePath)
  requireCondition(Boolean(dimensions), `${file}: expected a readable PNG header.`)
  if (dimensions) {
    requireCondition(dimensions.width >= 1_000, `${file}: width ${dimensions.width}px is below the 1000px minimum.`)
    requireCondition(dimensions.height >= 600, `${file}: height ${dimensions.height}px is below the 600px minimum.`)
  }
}
for (const matchingFiles of visualHashes.values()) {
  requireCondition(matchingFiles.length === 1, `Course visuals must be distinct; duplicate files: ${matchingFiles.join(', ')}.`)
}

const registeredVisuals = flowTopics.flatMap((topic) => getCourseVisuals(topic).map((visual) => ({ topic, visual })))
const normalizedDescriptions = new Map()
const registeredFiles = new Set()

for (const { topic, visual } of registeredVisuals) {
  const prefix = `${topic.id}: ${visual.src}`
  requireCondition(/^\/course-visuals\/[a-z0-9-]+\.png$/.test(visual.src), `${prefix}: invalid public visual src.`)
  const file = visual.src.replace('/course-visuals/', '')
  registeredFiles.add(file)
  requireCondition(courseVisualFiles.includes(file), `${prefix}: registered asset is missing.`)
  requireCondition(visual.alt.trim().length >= 40, `${prefix}: semantic alt is missing or too short.`)
  requireCondition(visual.caption.includes('Что показано:'), `${prefix}: caption must say what is shown.`)
  requireCondition(visual.caption.includes('Как читать:'), `${prefix}: caption must explain how to read the visual.`)
  requireCondition(visual.caption.includes('Главный вывод:'), `${prefix}: caption must state the main conclusion.`)
  requireCondition(!/Учебная иллюстрация к теме|Дополнительная учебная иллюстрация/iu.test(visual.alt), `${prefix}: generic placeholder alt is forbidden.`)
  requireCondition(Number.isInteger(visual.order) && visual.order > 0, `${prefix}: order must be a positive integer.`)
  requireCondition(['generated', 'curated'].includes(visual.provenance?.kind), `${prefix}: invalid provenance kind.`)
  requireCondition(Boolean(visual.provenance?.source?.trim()), `${prefix}: provenance source is required.`)

  const targetStep = topic.steps.find((step) => step.id === visual.placement?.stepId)
  requireCondition(Boolean(targetStep), `${prefix}: placement step ${visual.placement?.stepId ?? '(missing)'} does not exist.`)
  if (visual.placement?.sectionId) {
    const targetSection = targetStep?.sections?.find((section) => section.id === visual.placement.sectionId)
    requireCondition(Boolean(targetSection), `${prefix}: placement section ${visual.placement.sectionId} does not exist in ${visual.placement.stepId}.`)
  }

  for (const [kind, value] of [['alt', visual.alt], ['caption', visual.caption]]) {
    const normalized = value.trim().toLocaleLowerCase('ru-RU')
    const matchingDescriptions = normalizedDescriptions.get(`${kind}:${normalized}`) ?? []
    matchingDescriptions.push(visual.src)
    normalizedDescriptions.set(`${kind}:${normalized}`, matchingDescriptions)
  }
}

for (const [description, matchingSources] of normalizedDescriptions) {
  requireCondition(matchingSources.length === 1, `Duplicate ${description.split(':', 1)[0]} text: ${matchingSources.join(', ')}.`)
}

const unregisteredFiles = courseVisualFiles.filter((file) => !registeredFiles.has(file))
requireCondition(unregisteredFiles.length === 0, `Course PNG files missing from registry: ${unregisteredFiles.join(', ')}.`)
requireCondition(registeredFiles.size === registeredVisuals.length, 'Each registered visual src must be unique.')

for (const topic of flowTopics) {
  const visualPattern = new RegExp(`^${topic.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:-\\d+)?\\.png$`)
  const topicVisuals = courseVisualFiles.filter((file) => visualPattern.test(file))
  if (topic.id === 'ml-foundations-data-target') {
  const structuredTables = topic.steps
    .flatMap((step) => step.sections ?? [])
    .map((section) => section.table)
    .filter(Boolean)
  const mainTable = structuredTables[0]
  requireCondition(topicVisuals.length === 0, `${topic.id}: concise table-only design must not register PNG illustrations.`)
  requireCondition(structuredTables.length === 1, `${topic.id}: expected exactly one structured data table.`)
  requireCondition(mainTable?.headers?.length === 6, `${topic.id}: structured data table must contain six columns.`)
  requireCondition(mainTable?.rows?.length === 6, `${topic.id}: structured data table must contain six rows.`)
} else {
  requireCondition(topicVisuals.length >= 1, `${topic.id}: expected at least one PNG illustration.`)
}
requireCondition(topicVisuals.length <= 3, `${topic.id}: expected no more than three PNG illustrations, got ${topicVisuals.length}.`)
  const topicRegistryFiles = getCourseVisuals(topic).map((visual) => visual.src.replace('/course-visuals/', '')).sort()
  requireCondition(topicRegistryFiles.join(',') === topicVisuals.sort().join(','), `${topic.id}: PNG files and visual registry entries do not match.`)
}

const researchTopics = flowTopics.filter((topic) => topic.blockId === 'research-statistics'
  || topic.blockId === 'biomedical-ml'
  || topic.blockId === 'genomics-cancer'
  || topic.blockId === 'protein-bioinformatics'
  || topic.blockId === 'biomedical-nlp'
  || topic.blockId === 'article-capstone')

requireCondition(researchTopics.length === 32, `Expected 32 research/bioinformatics topics, got ${researchTopics.length}.`)
requireCondition(new Set(researchTopics.map((topic) => topic.steps.length)).size >= 4, 'Research topics must use at least four different lesson lengths.')
requireCondition(new Set(researchTopics.map((topic) => topic.learningDesign?.format)).size >= 10, 'Research topics must use varied learning formats, not one repeated template.')

const mlMasteryTopics = flowTopics.filter((topic) => topic.id.startsWith('ml-') && topic.order >= 10)
const nlpTopics = flowTopics.filter((topic) => topic.blockId === 'biomedical-nlp')
const capstoneTopics = flowTopics.filter((topic) => topic.blockId === 'article-capstone')
requireCondition(mlMasteryTopics.length === 9, `Expected 9 from-zero ML mastery topics, got ${mlMasteryTopics.length}.`)
requireCondition(nlpTopics.length === 8, `Expected 8 dedicated NLP topics, got ${nlpTopics.length}.`)
requireCondition(capstoneTopics.length === 8, `Expected 8 article capstone topics, got ${capstoneTopics.length}.`)
requireCondition(new Set(nlpTopics.map((topic) => topic.learningDesign?.practiceTasks)).size >= 3, 'NLP lessons must vary practice intensity by topic.')
requireCondition(new Set(mlMasteryTopics.map((topic) => topic.learningDesign?.quizQuestions)).size >= 3, 'ML mastery lessons must vary assessment depth by topic.')

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

  if (topic.learningDesign) {
    const actualQuestions = topic.steps.reduce((sum, step) => sum + (step.quiz?.questions.length ?? 0), 0)
    const actualPractices = topic.steps.reduce((sum, step) => sum + (step.practiceTasks?.length ?? 0), 0)
    const actualExamples = topic.steps.reduce((sum, step) => sum
      + (step.workedExample?.length ?? 0)
      + (step.codeExample ? 1 : 0)
      + (step.sections?.reduce((sectionSum, section) => sectionSum + (section.codeExamples?.length ?? 0), 0) ?? 0), 0)
    requireCondition(actualQuestions === topic.learningDesign.quizQuestions, `${prefix} learning design says ${topic.learningDesign.quizQuestions} questions, actual ${actualQuestions}.`)
    requireCondition(actualPractices === topic.learningDesign.practiceTasks, `${prefix} learning design says ${topic.learningDesign.practiceTasks} practices, actual ${actualPractices}.`)
    requireCondition(actualExamples === topic.learningDesign.examples, `${prefix} learning design says ${topic.learningDesign.examples} examples, actual ${actualExamples}.`)
    requireCondition(topic.learningDesign.estimatedMinutes >= 45, `${prefix} research lesson duration is implausibly short.`)
  }

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
      const options = Array.isArray(question.options) ? question.options : []
      requireCondition(question.options == null || Array.isArray(question.options), `${prefix} quiz ${question.id} options must be an array.`)
      const visibleText = [question.question, ...options.map((option) => option.text), question.explanation].join(' ')
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
const forbiddenBoilerplate = [
  'когда применять и как проверять',
  'метод проверяют на данных, которые не участвовали в обучении',
  'качество сравнивают с baseline. если результат нестабилен между фолдами',
  'решение запускается на платформе',
]
for (const phrase of forbiddenBoilerplate) {
  requireCondition(!curriculumText.includes(phrase), `Repeated filler text must not appear: "${phrase}".`)
}

for (const topicId of ['ml-problem-types', 'validation-split']) {
  const topic = flowTopics.find((item) => item.id === topicId)
  const formulaCards = topic?.steps.flatMap((step) => step.formulaCards ?? []) ?? []
  requireCondition(formulaCards.length === 0, `${topicId}: beginner theory must explain the idea before introducing formulas.`)
}

for (const topicId of [
  'linear-regression',
  'regularization-l1-l2',
  'logistic-regression',
  'decision-trees',
  'bagging-random-forest',
  'gradient-boosting',
  'support-vector-machines',
  'kmeans-clustering',
]) {
  const topic = flowTopics.find((item) => item.id === topicId)
  const formulaCards = topic?.steps.flatMap((step) => step.formulaCards ?? []) ?? []
  requireCondition(formulaCards.some((card) => card.example?.steps?.length), `${topicId}: at least one displayed formula needs a worked numeric example.`)
}
const missingGlossaryTerms = [...new Set(flowTopics
  .flatMap((topic) => topic.terminology)
  .filter((term) => hasLatinLetters(term))
  .filter((term) => !getCourseGlossaryEntry(term)))]
  .sort((left, right) => left.localeCompare(right))
requireCondition(
  missingGlossaryTerms.length === 0,
  `English terminology without a local Russian definition: ${missingGlossaryTerms.join(', ')}.`,
)
requireCondition(!curriculumText.includes('карта метрик без углубления'), 'Vague metric map wording must not appear in the course.')
requireCondition(!curriculumText.includes('термины, которые нужно различать:'), 'Template terminology dumps must not appear in the course.')
const requiredCoverage = [
  ['matplotlib', 'Matplotlib'],
  ['fig.savefig', 'Matplotlib export'],
  ['boxplot', 'boxplot'],
  ['plt.subplots', 'Matplotlib subplots'],
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
  ['gamma knife', 'Gamma Knife case'],
  ['aspa', 'ASPA case'],
  ['benjamini', 'Benjamini-Hochberg / FDR'],
  ['calibration', 'probability calibration'],
  ['nested cv', 'nested cross-validation'],
  ['out-of-fold', 'out-of-fold predictions'],
  ['groupkfold', 'group cross-validation'],
  ['temporal split', 'temporal split'],
  ['learning curve', 'learning curves'],
  ['optuna', 'Optuna hyperparameter search'],
  ['columntransformer', 'ColumnTransformer'],
  ['decision curve', 'decision curve analysis'],
  ['permutation importance', 'permutation importance'],
  ['fasta', 'FASTA'],
  ['fastq', 'FASTQ'],
  ['vcf', 'VCF'],
  ['deseq2', 'DESeq2'],
  ['survival', 'survival analysis'],
  ['gdc', 'Genomic Data Commons'],
  ['cbioportal', 'cBioPortal'],
  ['uniprot', 'UniProt'],
  ['blast', 'BLAST'],
  ['plddt', 'pLDDT'],
  ['transformer', 'Transformers'],
  ['tf-idf', 'TF-IDF'],
  ['word2vec', 'Word2Vec'],
  ['pubmedbert', 'PubMedBERT'],
  ['biomedical ner', 'biomedical named entity recognition'],
  ['relation extraction', 'relation extraction'],
  ['macro f1', 'macro F1'],
  ['recall@k', 'retrieval evaluation'],
  ['citation faithfulness', 'RAG citation faithfulness'],
  ['tripod', 'TRIPOD reporting'],
  ['probast+ai', 'PROBAST+AI'],
  ['statistical analysis plan', 'statistical analysis plan'],
  ['reviewer response', 'reviewer response workflow'],
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
