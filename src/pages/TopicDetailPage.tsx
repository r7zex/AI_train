import { lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTopicById, getSectionForTopic } from '../data/topics'
import Breadcrumbs from '../components/Breadcrumbs'
import ProgressButton from '../components/ProgressButton'
import GenericTopicTheory from '../content/genericTopicTheory'
import StepNavigator from '../components/StepNavigator'
import { subTopicsMap } from '../data/steps'

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
  const subTopics = topicId ? (subTopicsMap[topicId] ?? []) : []
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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
        {[
          { to: '/practice', label: 'Практика' },
          { to: '/quiz', label: 'Квизы' },
          { to: '/code-practice', label: 'Код-задачи' },
          { to: '/pytorch-lab', label: 'PyTorch Lab' },
          { to: '/progress', label: 'Прогресс' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="text-center text-xs sm:text-sm font-medium bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-sm transition-all"
          >
            {item.label}
          </Link>
        ))}
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
