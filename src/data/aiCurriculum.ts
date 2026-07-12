import type { FlowTopic } from './aiCurriculumTypes'
import { numpyTopics } from './curriculum/numpy/index'
import { pandasTopics } from './curriculum/pandas'
import { mlFoundationsTopics } from './curriculum/ml_foundations'
import {
  linearModelTopics,
  mlAdvancedFoundationsTopics,
  svmClusteringTopics,
  treeEnsembleTopics,
  visualizationTopics,
} from './curriculum/ml_extended'

export const curriculumBlocks = [
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
    description: 'Figure, Axes, базовые графики, распределения, выбросы, EDA и матрица корреляций.',
    order: 3,
  },
  {
    id: 'ml-foundations',
    title: 'Основы машинного обучения',
    icon: '04',
    description: 'Типы задач, данные, target, обучение, train/test, baseline, CV-search, метрики, матрица ошибок и дисбаланс классов.',
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
  ...numpyCourseTopics,
  ...pandasCourseTopics,
  ...visualizationTopics,
  ...mlCourseTopics,
  ...mlAdvancedFoundationsTopics,
  ...linearModelTopics,
  ...treeEnsembleTopics,
  ...svmClusteringTopics,
]
