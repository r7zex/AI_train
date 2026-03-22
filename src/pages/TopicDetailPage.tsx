import { lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicById, getSectionForTopic } from '../data/topics'
import Breadcrumbs from '../components/Breadcrumbs'
import ProgressButton from '../components/ProgressButton'
import GenericTopicTheory from '../content/genericTopicTheory'
import StepNavigator from '../components/StepNavigator'
import type { SubTopic } from '../data/steps'
import { subTopicsMap, topicCheatsheets } from '../data/steps'
import { quizzes } from '../data/quizzes'

const contentMap: Record<string, React.LazyExoticComponent<() => React.ReactElement>> = {
  'gini-impurity': lazy(() => import('../content/giniImpurity')),
  'bagging-boosting': lazy(() => import('../content/baggingBoosting')),
  'svm-margin': lazy(() => import('../content/svmMargin')),
  'naive-bayes': lazy(() => import('../content/naiveBayes')),
  'precision-recall-f1': lazy(() => import('../content/precisionRecall')),
  'roc-auc': lazy(() => import('../content/rocAuc')),
  'pr-auc': lazy(() => import('../content/prAuc')),
  'macro-averaging': lazy(() => import('../content/macroAveraging')),
  'data-leakage': lazy(() => import('../content/dataLeakage')),
  kfold: lazy(() => import('../content/kfold')),
  'gradient-descent': lazy(() => import('../content/gradientDescent')),
  regularization: lazy(() => import('../content/regularization')),
  'boosting-comparison': lazy(() => import('../content/boostingComparison')),
  'vanishing-gradient': lazy(() => import('../content/vanishingGradient')),
  dropout: lazy(() => import('../content/dropout')),
  pooling: lazy(() => import('../content/pooling')),
  'lstm-rnn': lazy(() => import('../content/lstmRnn')),
  normalization: lazy(() => import('../content/normalization')),
  'transformers-qkv': lazy(() => import('../content/transformersQKV')),
  quantization: lazy(() => import('../content/quantization')),
}

export default function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = topicId ? getTopicById(topicId) : null
  const section = topicId ? getSectionForTopic(topicId) : null
  const ContentComponent = topicId ? contentMap[topicId] : null
  const fallbackQuizId =
    section?.id
      ? (quizzes.find((q) => q.topicId === topicId)?.id ??
        quizzes.find((q) => q.sectionId === section.id && q.questions.length >= 5)?.id ??
        quizzes.find((q) => q.questions.length >= 5)?.id)
      : undefined

  const defaultSubTopic: SubTopic | null =
    topic && fallbackQuizId
      ? {
          id: `${topic.id}-default-subtopic`,
          title: topic.title,
          steps: [
            {
              id: `${topic.id}-theory`,
              type: 'theory',
              title: 'Теория: базовая рамка',
              content: `1) Терминология\n${topic.title} — ключевая тема текущего блока.\n\n2) Простыми словами\n${topic.shortDescription}\n\n3) Где и зачем используется\nПрименяется в практических ML-задачах и часто обсуждается на собеседованиях.\n\n4) Пример из жизни\nРассматривайте тему через влияние на качество продукта и бизнес-метрики.\n\n5) Пример кода\n# Примерный каркас\n# 1) получить входные данные\n# 2) применить метод\n# 3) оценить результат\n\n6) Интерпретация кода\nКаждая строка кода отражает отдельный шаг алгоритма: подготовка, вычисление, проверка результата.`,
            },
            {
              id: `${topic.id}-pitfalls`,
              type: 'pitfalls',
              title: 'Распространённые ошибки и решения',
              content:
                '• Ошибка: использовать трансформации до train/test split.\nРешение: fit только на train.\n\n• Ошибка: не проверять крайние случаи.\nРешение: добавить guard-условия и hidden-тесты.\n\n• Ошибка: делать выводы по одной метрике.\nРешение: проверять набор метрик и бизнес-контекст.',
            },
            {
              id: `${topic.id}-interview`,
              type: 'interview',
              title: 'Вопросы/ответы для собеседования',
              content:
                `Q: Что это и зачем нужно?\nA: ${topic.shortDescription}\n\nQ: Какие формулы/метрики ключевые?\nA: Назовите базовые формулы темы и ограничения их применения.\n\nQ: Какие частые ошибки?\nA: Leakage, отсутствие baseline, отсутствие edge-case проверок.\n\nQ: Как проверить корректность решения?\nA: Сравнить с baseline, прогнать тесты и разобрать ошибки.`,
            },
            {
              id: `${topic.id}-quiz`,
              type: 'quiz',
              title: 'Квиз (5+ вопросов)',
              quizId: fallbackQuizId,
            },
            { id: `${topic.id}-code-1`, type: 'code', title: 'Практика stdin→stdout #1', codeTaskId: 'sum-pairs' },
            { id: `${topic.id}-code-2`, type: 'code', title: 'Практика stdin→stdout #2', codeTaskId: 'stdin-feature-stats' },
            { id: `${topic.id}-code-3`, type: 'code', title: 'Практика stdin→stdout #3', codeTaskId: 'stdin-minmax-scale' },
            { id: `${topic.id}-code-4`, type: 'code', title: 'Практика stdin→stdout #4', codeTaskId: 'stdin-threshold-metrics' },
            { id: `${topic.id}-code-5`, type: 'code', title: 'Практика stdin→stdout #5', codeTaskId: 'stdin-batch-loss' },
            {
              id: `${topic.id}-recap`,
              type: 'recap',
              title: 'Шпаргалка подтемы',
              content: (topicCheatsheets[topic.id] ?? ['Ключевые определения и формулы добавлены в общий справочник.'])
                .map((item) => `• ${item}`)
                .join('\n'),
            },
          ],
        }
      : null

  const subTopics = topicId ? (subTopicsMap[topicId] ?? (defaultSubTopic ? [defaultSubTopic] : [])) : []
  const hasSteps = subTopics.length > 0

  if (!topic || !section) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Тема не найдена</h1>
        <Link to="/topics" className="text-blue-600 hover:underline">
          ← Вернуться к списку тем
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs
        crumbs={[
          { label: 'Главная', to: '/' },
          { label: 'Темы', to: '/topics' },
          { label: section.title, to: `/topics?section=${section.id}` },
          { label: topic.title },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{topic.title}</h1>
          <p className="text-gray-600 text-sm">{topic.shortDescription}</p>
        </div>
        <div className="flex-shrink-0">
          <ProgressButton topicId={topic.id} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {hasSteps ? (
          <div className="space-y-6">
            {subTopics.map(st => (
              <div key={st.id}>
                {subTopics.length > 1 && (
                  <h2 className="text-lg font-bold text-gray-800 mb-4">{st.title}</h2>
                )}
                <StepNavigator subTopic={st} />
              </div>
            ))}
          </div>
        ) : ContentComponent ? (
          <Suspense
            fallback={
              <div className="py-20 text-center text-gray-500">
                <div className="text-3xl mb-3 animate-spin">⚙️</div>
                <p>Загрузка материала...</p>
              </div>
            }
          >
            <ContentComponent />
          </Suspense>
        ) : (
          <GenericTopicTheory
            topicTitle={topic.title}
            topicDescription={topic.shortDescription}
            sectionTitle={section.title}
          />
        )}
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Шпаргалка темы</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          {(topicCheatsheets[topic.id] ?? ['См. страницу «Термины и функции» для полного списка формул и определений.']).map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-between">
        {(() => {
          const idx = section.topics.findIndex((t) => t.id === topicId)
          const prev = idx > 0 ? section.topics[idx - 1] : null
          const next = idx < section.topics.length - 1 ? section.topics[idx + 1] : null
          return (
            <>
              {prev ? (
                <Link
                  to={`/topics/${prev.id}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:shadow-sm transition-all"
                >
                  ← {prev.title}
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to={`/topics/${next.id}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:shadow-sm transition-all"
                >
                  {next.title} →
                </Link>
              ) : (
                <div />
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}
