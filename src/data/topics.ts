export interface Topic {
  id: string
  sectionId: string
  title: string
  shortDescription: string
}

export interface Section {
  id: string
  title: string
  description: string
  icon: string
  color: string
  topics: Topic[]
}

export const sections: Section[] = [
  {
    id: 'classical-ml',
    title: 'Классическое МО',
    description: 'Деревья решений, ансамбли, SVM, Наивный Байес',
    icon: '🌳',
    color: 'green',
    topics: [
      { id: 'gini-impurity', sectionId: 'classical-ml', title: 'Gini Impurity в деревьях решений', shortDescription: 'Мера неоднородности узла, выигрыш от разбиения, выбор лучшего сплита' },
      { id: 'bagging-boosting', sectionId: 'classical-ml', title: 'Bagging vs Boosting', shortDescription: 'Random Forest, AdaBoost, Gradient Boosting — сравнение ансамблей' },
      { id: 'svm-margin', sectionId: 'classical-ml', title: 'SVM: геометрический смысл margin', shortDescription: 'Разделяющая гиперплоскость, functional и geometric margin, максимизация зазора' },
      { id: 'naive-bayes', sectionId: 'classical-ml', title: 'Наивный Байес: апостериорная вероятность', shortDescription: 'Теорема Байеса, ненормализованный posterior, argmax-классификация' },
    ]
  },
  {
    id: 'metrics',
    title: 'Метрики качества',
    description: 'Precision/Recall/F1, ROC-AUC, PR-AUC, macro-averaging',
    icon: '📊',
    color: 'blue',
    topics: [
      { id: 'precision-recall-f1', sectionId: 'metrics', title: 'Precision, Recall, F1', shortDescription: 'Confusion matrix, формулы, когда что важнее, интерактивный калькулятор' },
      { id: 'roc-auc', sectionId: 'metrics', title: 'ROC-AUC', shortDescription: 'Интерпретация, AUC=0.5, инверсия score, ranking interpretation' },
      { id: 'pr-auc', sectionId: 'metrics', title: 'PR-AUC', shortDescription: 'Precision-Recall кривая, пошаговое построение, расчёт площади' },
      { id: 'macro-averaging', sectionId: 'metrics', title: 'Macro-averaging при дисбалансе', shortDescription: 'Macro vs micro vs weighted, чувствительность к редким классам' },
    ]
  },
  {
    id: 'methodology',
    title: 'Методология и оптимизация',
    description: 'Data leakage, кросс-валидация, градиентный спуск, регуляризация, бустинг',
    icon: '⚙️',
    color: 'orange',
    topics: [
      { id: 'data-leakage', sectionId: 'methodology', title: 'Data Leakage', shortDescription: 'Почему опасно, основные источники, чеклист предотвращения' },
      { id: 'kfold', sectionId: 'methodology', title: 'K-fold Cross-Validation', shortDescription: 'Идея, преимущества перед single split, ограничения, схема разбиения' },
      { id: 'gradient-descent', sectionId: 'methodology', title: 'Шаг градиентного спуска', shortDescription: 'Формула обновления, роль learning rate, интерактивный калькулятор' },
      { id: 'regularization', sectionId: 'methodology', title: 'L1 и L2 регуляризация', shortDescription: 'Геометрический смысл, sparsity, shrinkage, связь с prior' },
      { id: 'boosting-comparison', sectionId: 'methodology', title: 'CatBoost vs LightGBM vs XGBoost', shortDescription: 'Symmetric trees, leaf-wise, level-wise, категориальные признаки' },
    ]
  },
  {
    id: 'deep-learning',
    title: 'Глубокое обучение',
    description: 'Vanishing gradient, Dropout, CNN, LSTM, нормализации, Transformers',
    icon: '🧠',
    color: 'purple',
    topics: [
      { id: 'vanishing-gradient', sectionId: 'deep-learning', title: 'Vanishing Gradient', shortDescription: 'Причины, числовой пример затухания, решения: ReLU, ResNet, BatchNorm' },
      { id: 'dropout', sectionId: 'deep-learning', title: 'Dropout на inference', shortDescription: 'Training vs inference, inverted dropout, масштабирование активаций' },
      { id: 'pooling', sectionId: 'deep-learning', title: 'Pooling в CNN', shortDescription: 'Max vs average pooling, уменьшение размерности, устойчивость к сдвигам' },
      { id: 'lstm-rnn', sectionId: 'deep-learning', title: 'LSTM vs vanilla RNN', shortDescription: 'Проблема памяти, гейты LSTM, cell state vs hidden state' },
      { id: 'normalization', sectionId: 'deep-learning', title: 'Batch / Layer / Instance / Weight Norm', shortDescription: 'По каким осям нормализация, где применяется, сравнение' },
      { id: 'transformers-qkv', sectionId: 'deep-learning', title: 'Transformers: размерности Q, K, V', shortDescription: 'Пошаговый shape-tracking, multi-head attention, интерактивный калькулятор' },
    ]
  },
  {
    id: 'deployment',
    title: 'Оптимизация и деплой',
    description: 'Квантование весов, Straight-Through Estimator',
    icon: '🚀',
    color: 'red',
    topics: [
      { id: 'quantization', sectionId: 'deployment', title: 'Quantization нейросетей', shortDescription: 'Идея квантования, ошибка округления, нулевая производная, STE' },
    ]
  },
]

export const allTopics = sections.flatMap(s => s.topics)
export const getSectionById = (id: string) => sections.find(s => s.id === id)
export const getTopicById = (id: string) => allTopics.find(t => t.id === id)
export const getSectionForTopic = (topicId: string) => sections.find(s => s.topics.some(t => t.id === topicId))
