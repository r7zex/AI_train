import type { FlowTopic } from './aiCurriculumTypes'
import { numpyTopics } from './curriculum/numpy/index'
import { pandasTopics } from './curriculum/pandas'
import { mlFoundationsTopics } from './curriculum/ml_foundations'
import { mlMasteryTopics } from './curriculum/ml_mastery'
import { nlpTopics } from './curriculum/nlp'
import {
  linearModelTopics,
  mlAdvancedFoundationsTopics,
  svmClusteringTopics,
  treeEnsembleTopics,
} from './curriculum/ml_extended'
import { visualizationTopics } from './curriculum/visualization'
import { researchTopics } from './curriculum/research'
import { pythonStartTopics } from './curriculum/python_start'

export const curriculumBlocks = [
  {
    id: 'python-start',
    title: 'Python-минимум перед анализом данных',
    icon: '00',
    description: 'Синтаксис, типы, коллекции, циклы, функции, ошибки, файлы и окружение — без предположения, что Python уже знаком.',
    order: 0,
  },
  {
    id: 'numpy-ml',
    title: 'NumPy для машинного обучения',
    icon: '01',
    description: 'Полноценное введение в числовые массивы: ndarray, shape, dtype, срезы, векторизация, статистики, axis, маски, broadcasting и random.',
    order: 1,
  },
  {
    id: 'pandas-eda',
    title: 'pandas и подготовка данных',
    icon: '02',
    description: 'Полноценное введение в табличные данные: DataFrame, Series, чтение CSV, первичный осмотр, фильтрация, группировки, пропуски и подготовка к ML.',
    order: 2,
  },
  {
    id: 'visualization-eda',
    title: 'Matplotlib и разведочный анализ данных',
    icon: '03',
    description: 'От первого рисунка до публикационного EDA: устройство Figure/Axes, линии, точки, распределения, несколько панелей, экспорт и корреляции.',
    order: 3,
  },
  {
    id: 'ml-foundations',
    title: 'Основы машинного обучения',
    icon: '04',
    description: 'Типы задач, целевая переменная, обучение, разбиения данных, простые сравнительные модели, кросс-валидация, метрики и дисбаланс классов.',
    order: 4,
  },
  {
    id: 'linear-models',
    title: 'Линейные модели и регуляризация',
    icon: '05',
    description: 'Линейная и логистическая регрессия, L1, L2, ElasticNet, параметры, формулы и реализация в sklearn.',
    order: 5,
  },
  {
    id: 'trees-ensembles',
    title: 'Деревья, бэггинг и бустинг',
    icon: '06',
    description: 'Деревья решений, impurity, Random Forest, Bagging, GradientBoosting и HistGradientBoosting.',
    order: 6,
  },
  {
    id: 'svm-clustering',
    title: 'Метод опорных векторов и кластеризация',
    icon: '07',
    description: 'SVC, SVR, margin, kernel, параметры C и gamma, а также KMeans и оценка кластеров.',
    order: 7,
  },
  {
    id: 'research-statistics',
    title: 'Статистика и дизайн исследования',
    icon: '08',
    description: 'Неопределённость, размеры эффекта, FDR, мощность, bootstrap и протокол биомедицинского исследования.',
    order: 8,
  },
  {
    id: 'biomedical-ml',
    title: 'Биомедицинский ML без утечек',
    icon: '09',
    description: 'Когорта, target, временная логика, Pipeline, дисбаланс, калибровка и внешняя валидация на кейсах Gamma Knife и ASPA.',
    order: 9,
  },
  {
    id: 'genomics-cancer',
    title: 'Гены, экспрессия и рак',
    icon: '10',
    description: 'FASTA/FASTQ/GTF/VCF, RNA-seq, варианты, GDC/cBioPortal, survival и multi-omics.',
    order: 10,
  },
  {
    id: 'protein-bioinformatics',
    title: 'Белки, последовательности и deep learning',
    icon: '11',
    description: 'UniProt, BLAST, гомологический split, PDB, pLDDT/PAE, CNN/RNN/Transformers и protein embeddings.',
    order: 11,
  },
  {
    id: 'biomedical-nlp',
    title: 'NLP для биомедицины и научных текстов',
    icon: '12',
    description: 'От разметки и TF-IDF до patient-level validation, biomedical NER, Transformers, RAG и проверяемого синтеза доказательств.',
    order: 12,
  },
  {
    id: 'article-capstone',
    title: 'От протокола до статьи',
    icon: '13',
    description: 'Capstone-проект, система экспериментов, TRIPOD+AI/PROBAST+AI, рукопись, supplement и воспроизводимый submission package.',
    order: 13,
  },
]

function withBlock(topic: FlowTopic, blockTitle: string, blockIcon: string, title: string, order: number): FlowTopic {
  return {
    ...topic,
    title,
    order,
    blockTitle,
    blockIcon,
    subblockTitle: title,
  }
}

function replaceModuleNumber(title: string, moduleNumber: number, order: number) {
  return title.replace(/^\d+\.\d+/, `${moduleNumber}.${order}`)
}

const numpyCourseTopics = numpyTopics.map((topic, index) => {
  const title = index === 0
    ? '1.1 Введение в NumPy и числовые данные'
    : replaceModuleNumber(topic.title, 1, index + 1)
  return withBlock(topic, 'NumPy для машинного обучения', '01', title, index + 1)
})

const pandasCourseTopics = pandasTopics.map((topic, index) => {
  const title = index === 0
    ? '2.1 Введение в pandas и табличные данные'
    : replaceModuleNumber(topic.title, 2, index + 1)
  return withBlock(topic, 'pandas и подготовка данных', '02', title, index + 1)
})

const mlCourseTopics = mlFoundationsTopics.map((topic, index) => {
  const title = replaceModuleNumber(topic.title, 4, index + 1)
  return withBlock(topic, 'Основы машинного обучения', '04', title, index + 1)
})

export const flowTopics: FlowTopic[] = [
  ...pythonStartTopics,
  ...numpyCourseTopics,
  ...pandasCourseTopics,
  ...visualizationTopics,
  ...mlCourseTopics,
  ...mlAdvancedFoundationsTopics,
  ...mlMasteryTopics,
  ...linearModelTopics,
  ...treeEnsembleTopics,
  ...svmClusteringTopics,
  ...nlpTopics,
  ...researchTopics,
]
