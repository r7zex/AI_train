import type { FlowStep, FlowTopic, SourceLink } from '../../aiCurriculumTypes'
import type { Quiz, QuizQuestion } from '../../quizzes'
import {
  callout,
  code,
  makeStdinTask,
  practiceStep,
  quizStep,
  section,
  theoryStep,
} from '../helpers'

export { callout, code, makeStdinTask, practiceStep, quizStep, section, theoryStep }

export const researchSources = {
  python: {
    label: 'Python 3 Tutorial', type: 'docs',
    why: 'Официальное руководство по синтаксису, коллекциям, функциям, файлам и исключениям.',
    url: 'https://docs.python.org/3/tutorial/',
  },
  sklearnValidation: {
    label: 'scikit-learn: Cross-validation', type: 'docs',
    why: 'Официальная документация по разбиениям, CV и оценке моделей.',
    url: 'https://scikit-learn.org/stable/modules/cross_validation.html',
  },
  sklearnPipeline: {
    label: 'scikit-learn: Pipeline', type: 'docs',
    why: 'Официальные правила объединения preprocessing и модели без утечки.',
    url: 'https://scikit-learn.org/stable/modules/compose.html#pipeline',
  },
  sklearnCalibration: {
    label: 'scikit-learn: Probability calibration', type: 'docs',
    why: 'Калибровочные кривые, Brier score и калибровка вероятностей.',
    url: 'https://scikit-learn.org/stable/modules/calibration.html',
  },
  sklearnLearningCurves: {
    label: 'scikit-learn: Learning and validation curves', type: 'docs',
    why: 'Официальная документация по диагностике underfitting, overfitting и влияния размера выборки.',
    url: 'https://scikit-learn.org/stable/modules/learning_curve.html',
  },
  sklearnFeatureSelection: {
    label: 'scikit-learn: Feature selection', type: 'docs',
    why: 'Официальная документация по фильтрам, wrapper-методам и включению отбора в Pipeline.',
    url: 'https://scikit-learn.org/stable/modules/feature_selection.html',
  },
  sklearnInspection: {
    label: 'scikit-learn: Model inspection', type: 'docs',
    why: 'Permutation importance, partial dependence и ограничения интерпретации модели.',
    url: 'https://scikit-learn.org/stable/inspection.html',
  },
  sklearnText: {
    label: 'scikit-learn: Working with text data', type: 'docs',
    why: 'Официальный workflow CountVectorizer/TF-IDF, sparse features, Pipeline и классификация текста.',
    url: 'https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html',
  },
  optuna: {
    label: 'Optuna documentation', type: 'docs',
    why: 'Официальная документация по studies, trials, search spaces, pruning и воспроизводимому HPO.',
    url: 'https://optuna.readthedocs.io/en/stable/',
  },
  tripOd: {
    label: 'TRIPOD+AI Statement (BMJ 2024)', type: 'article',
    why: 'Актуальный 27-пунктный чек-лист прозрачного описания diagnostic/prognostic моделей, заменивший TRIPOD 2015.',
    url: 'https://www.bmj.com/content/385/bmj-2023-078378',
  },
  probastAi: {
    label: 'PROBAST+AI (BMJ 2025)', type: 'article',
    why: 'Актуальная оценка качества разработки, риска смещения и применимости prediction model studies.',
    url: 'https://www.bmj.com/content/388/bmj-2024-082505',
  },
  fair: {
    label: 'FAIR Principles', type: 'article',
    why: 'Принципы находимых, доступных, совместимых и переиспользуемых данных.',
    url: 'https://www.go-fair.org/fair-principles/',
  },
  geo: {
    label: 'NCBI GEO overview', type: 'docs',
    why: 'Официальное описание репозитория функциональной геномики и структуры данных.',
    url: 'https://www.ncbi.nlm.nih.gov/geo/info/overview.html',
  },
  sra: {
    label: 'NCBI Sequence Read Archive', type: 'docs',
    why: 'Официальный вход в сырые данные секвенирования и метаданные экспериментов.',
    url: 'https://www.ncbi.nlm.nih.gov/sra/docs/',
  },
  gdc: {
    label: 'NCI Genomic Data Commons', type: 'docs',
    why: 'Официальный портал гармонизированных клинических и геномных данных рака.',
    url: 'https://docs.gdc.cancer.gov/Data_Portal/Users_Guide/getting_started/',
  },
  deseq2: {
    label: 'Bioconductor DESeq2', type: 'docs',
    why: 'Официальная документация по дифференциальной экспрессии count-данных.',
    url: 'https://bioconductor.org/packages/DESeq2',
  },
  biopython: {
    label: 'Biopython SeqIO', type: 'docs',
    why: 'Официальное руководство по чтению и записи FASTA/FASTQ.',
    url: 'https://biopython.org/docs/latest/Tutorial/chapter_seqio.html',
  },
  blast: {
    label: 'NCBI BLAST Help', type: 'docs',
    why: 'Официальная документация по поиску сходных последовательностей.',
    url: 'https://blast.ncbi.nlm.nih.gov/doc/blast-help/',
  },
  uniprot: {
    label: 'UniProtKB', type: 'docs',
    why: 'Курируемые белковые последовательности, функции и аннотации.',
    url: 'https://www.uniprot.org/help/uniprotkb',
  },
  rcsb: {
    label: 'RCSB Protein Data Bank', type: 'docs',
    why: 'Структуры белков, экспериментальные методы и метаданные качества.',
    url: 'https://www.rcsb.org/docs/general-help',
  },
  esm: {
    label: 'Hugging Face: ESM', type: 'docs',
    why: 'Документация по белковым языковым моделям и представлениям последовательностей.',
    url: 'https://huggingface.co/docs/transformers/model_doc/esm',
  },
  huggingFaceTokenizers: {
    label: 'Hugging Face Tokenizers', type: 'docs',
    why: 'Официальная документация по subword tokenization, special tokens, padding, truncation и alignment offsets.',
    url: 'https://huggingface.co/docs/transformers/main_classes/tokenizer',
  },
  huggingFaceTextClassification: {
    label: 'Hugging Face: Text classification', type: 'docs',
    why: 'Официальная реализация tokenization, dynamic padding, fine-tuning и inference для sequence classification.',
    url: 'https://huggingface.co/docs/transformers/main/tasks/sequence_classification',
  },
  bertPaper: {
    label: 'BERT paper (NAACL 2019)', type: 'article',
    why: 'Первичная статья о bidirectional pretraining и fine-tuning Transformer encoder.',
    url: 'https://aclanthology.org/N19-1423/',
  },
  pubmedBertPaper: {
    label: 'PubMedBERT paper (ACL 2020)', type: 'article',
    why: 'Первичная статья о pretraining language model с нуля на biomedical text.',
    url: 'https://aclanthology.org/2020.acl-main.740/',
  },
  ragPaper: {
    label: 'Retrieval-Augmented Generation paper (NeurIPS 2020)', type: 'article',
    why: 'Первичная работа о генерации, связанной с внешним индексом документов и извлечёнными доказательствами.',
    url: 'https://proceedings.neurips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html',
  },
  cbioportal: {
    label: 'cBioPortal documentation', type: 'docs',
    why: 'Исследование мутаций, копийности, экспрессии и клинических исходов в онкологии.',
    url: 'https://docs.cbioportal.org/',
  },
  equator: {
    label: 'EQUATOR Network', type: 'article',
    why: 'Выбор корректного стандарта отчётности для дизайна исследования.',
    url: 'https://www.equator-network.org/',
  },
  icmje: {
    label: 'ICMJE Recommendations', type: 'docs',
    why: 'Актуальные рекомендации по authorship, disclosure, manuscript preparation, conflicts of interest и editorial conduct.',
    url: 'https://www.icmje.org/recommendations/',
  },
} satisfies Record<string, SourceLink>

export function singleQuestion(
  id: string,
  topicId: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  difficulty: QuizQuestion['difficulty'] = 'medium',
): QuizQuestion {
  return {
    id,
    topicId,
    sectionId: `${topicId}-assessment`,
    type: 'single',
    question,
    options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
    correctAnswer: String.fromCharCode(97 + correctIndex),
    explanation,
    difficulty,
  }
}

export function trueFalseQuestion(
  id: string,
  topicId: string,
  question: string,
  correct: boolean,
  explanation: string,
  difficulty: QuizQuestion['difficulty'] = 'medium',
): QuizQuestion {
  return {
    id,
    topicId,
    sectionId: `${topicId}-assessment`,
    type: 'truefalse',
    question,
    correctAnswer: String(correct),
    explanation,
    difficulty,
  }
}

export function numericQuestion(
  id: string,
  topicId: string,
  question: string,
  answer: number,
  explanation: string,
  tolerance = 0.01,
): QuizQuestion {
  return {
    id,
    topicId,
    sectionId: `${topicId}-assessment`,
    type: 'numeric',
    question,
    correctAnswer: answer,
    explanation,
    tolerance,
    difficulty: 'medium',
  }
}

export function assessment(topicId: string, title: string, questions: QuizQuestion[]): FlowStep {
  const quiz: Quiz = {
    id: `${topicId}-quiz`,
    title,
    description: `${questions.length} вопросов: от понимания идеи до решения исследовательской ситуации.`,
    topicId,
    sectionId: `${topicId}-assessment`,
    questions,
  }
  return quizStep(`${topicId}-assessment`, title, quiz.description, quiz)
}

export function sourceStep(topicId: string, sources: SourceLink[]): FlowStep {
  return {
    id: `${topicId}-sources`,
    type: 'sources',
    title: 'Первоисточники и следующий шаг',
    summary: 'Официальные документы, к которым стоит возвращаться во время реального исследования.',
    sources,
  }
}

export function researchTopic(options: {
  id: string
  title: string
  order: number
  summary: string
  blockId: string
  blockTitle: string
  blockIcon: string
  format: string
  estimatedMinutes: number
  quizQuestions: number
  practiceTasks: number
  examples: number
  terminology: string[]
  formulas?: string[]
  cheatsheet: string[]
  sources: SourceLink[]
  steps: FlowStep[]
}): FlowTopic {
  return {
    id: options.id,
    title: options.title,
    order: options.order,
    summary: options.summary,
    blockId: options.blockId,
    blockTitle: options.blockTitle,
    blockIcon: options.blockIcon,
    subblockId: `${options.id}-subblock`,
    subblockTitle: options.title,
    level: 'junior+',
    simpleExplanation: options.summary,
    terminology: options.terminology,
    formulas: options.formulas ?? [],
    themeCheatsheet: options.cheatsheet,
    sources: options.sources,
    learningDesign: {
      format: options.format,
      estimatedMinutes: options.estimatedMinutes,
      quizQuestions: options.quizQuestions,
      practiceTasks: options.practiceTasks,
      examples: options.examples,
    },
    steps: options.steps,
  }
}
