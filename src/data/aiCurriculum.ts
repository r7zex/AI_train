import type { FlowTopic } from './aiCurriculumTypes'
import { numpyTopics } from './curriculum/numpy/index'
import { pandasTopics } from './curriculum/pandas'
import { mlFoundationsTopics } from './curriculum/ml_foundations'

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
    title: 'Pandas и первичный анализ данных',
    icon: '02',
    description: 'Полноценное введение в табличные данные: DataFrame, Series, чтение CSV, первичный осмотр, фильтрация, группировки, пропуски и подготовка к ML.',
    order: 2,
  },
  {
    id: 'ml-foundations',
    title: 'Основы машинного обучения',
    icon: '03',
    description: 'Общее введение в ML после NumPy и pandas: данные, признаки, target, модель, обучение, train/test, baseline, метрики и полный цикл проекта.',
    order: 3,
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
  return withBlock(topic, 'Pandas и первичный анализ данных', '02', title, index + 1)
})

const mlCourseTopics = mlFoundationsTopics.map((topic, index) => {
  const title = replaceModuleNumber(topic.title, 3, index + 1)
  return withBlock(topic, 'Основы машинного обучения', '03', title, index + 1)
})

export const flowTopics: FlowTopic[] = [
  ...numpyCourseTopics,
  ...pandasCourseTopics,
  ...mlCourseTopics,
]
