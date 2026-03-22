import { useState } from 'react'

interface Mistake {
  id: number
  category: string
  mistake: string
  correct: string
}

const mistakes: Mistake[] = [
  // Классическое МО
  {
    id: 1,
    category: 'Классическое МО',
    mistake: 'Random Forest — это просто много деревьев, обученных на одних и тех же данных.',
    correct: 'Каждое дерево обучается на бутстрап-выборке (случайная выборка с возвращением), и при каждом разбиении выбирается случайное подмножество признаков. Именно это разнообразие (diversity) снижает дисперсию ансамбля.',
  },
  {
    id: 2,
    category: 'Классическое МО',
    mistake: 'Gradient Boosting обучает деревья параллельно, поэтому он быстрее Random Forest.',
    correct: 'Gradient Boosting обучает деревья последовательно — каждое следующее дерево исправляет ошибки предыдущего. Random Forest наоборот обучается параллельно. GB медленнее в обучении, но часто точнее.',
  },
  {
    id: 3,
    category: 'Классическое МО',
    mistake: 'SVM работает только для линейно разделимых данных.',
    correct: 'Kernel trick позволяет SVM неявно отображать данные в пространство высокой размерности, где они линейно разделимы. Популярные ядра: RBF (Гаусс), полиномиальное, сигмоидальное.',
  },
  {
    id: 4,
    category: 'Классическое МО',
    mistake: 'Чем глубже дерево решений, тем лучше модель.',
    correct: 'Глубокое дерево переобучается на обучающей выборке (высокая дисперсия, низкое смещение). Нужно ограничивать глубину, минимальное число объектов в листе или применять пост-прунинг.',
  },
  {
    id: 5,
    category: 'Классическое МО',
    mistake: 'Naive Bayes называется "наивным" потому что он плохо работает.',
    correct: 'Название отражает предположение об условной независимости признаков (наивное допущение, редко выполняется на практике). Несмотря на это, алгоритм отлично справляется с текстовой классификацией и работает быстро.',
  },
  {
    id: 6,
    category: 'Классическое МО',
    mistake: 'k-NN не имеет стадии обучения, значит это не машинное обучение.',
    correct: 'k-NN — ленивый (lazy) алгоритм: вся "обучающая" работа перекладывается на стадию предсказания (вычисление расстояний). Это полноценный алгоритм МО, относящийся к instance-based learning.',
  },

  // Метрики
  {
    id: 7,
    category: 'Метрики',
    mistake: 'Accuracy — лучшая метрика для оценки классификатора.',
    correct: 'При несбалансированных классах (например, 99% негативных) классификатор, предсказывающий всегда «0», имеет accuracy 99%, но полностью бесполезен. Используй F1, Precision/Recall, ROC-AUC.',
  },
  {
    id: 8,
    category: 'Метрики',
    mistake: 'ROC-AUC 0.8 всегда лучше чем 0.7.',
    correct: 'Зависит от задачи. При сильном дисбалансе классов PR-AUC (Precision-Recall AUC) информативнее ROC-AUC, так как ROC-AUC нечувствителен к редкому классу.',
  },
  {
    id: 9,
    category: 'Метрики',
    mistake: 'Высокий Recall всегда хуже чем высокий Precision.',
    correct: 'Зависит от стоимости ошибок. В медицинской диагностике пропустить больного (низкий Recall) хуже, чем ложная тревога. В спам-фильтре удалить важное письмо (низкий Precision) хуже.',
  },
  {
    id: 10,
    category: 'Метрики',
    mistake: 'MSE и MAE взаимозаменяемы для оценки регрессии.',
    correct: 'MSE сильнее штрафует крупные ошибки (из-за квадрата), поэтому чувствителен к выбросам. MAE более устойчив к выбросам. Выбор зависит от того, насколько критичны крупные ошибки в задаче.',
  },
  {
    id: 11,
    category: 'Метрики',
    mistake: 'Log Loss можно использовать только для двух классов.',
    correct: 'Категориальная кросс-энтропия — это обобщение Log Loss на K классов. Оба требуют вероятностных предсказаний, а не бинарных меток.',
  },

  // Методология
  {
    id: 12,
    category: 'Методология',
    mistake: 'Чем больше данных, тем лучше модель — всегда.',
    correct: 'Больше данных помогает при ундерфиттинге (высоком смещении), но не при оверфиттинге (высокой дисперсии, слишком сложная модель). Качество данных часто важнее количества.',
  },
  {
    id: 13,
    category: 'Методология',
    mistake: 'Нормализацию (StandardScaler) нужно применять ко всем данным перед разбиением на train/test.',
    correct: 'Data leakage! Scaler нужно обучать только на train, затем трансформировать и train, и test. Иначе статистика тестовой выборки проникает в обучение.',
  },
  {
    id: 14,
    category: 'Методология',
    mistake: 'Cross-validation заменяет тестовую выборку.',
    correct: 'CV оценивает обобщающую способность модели и используется для отбора гиперпараметров. Финальная оценка модели должна производиться на отдельном holdout test set, который не участвовал ни в обучении, ни в отборе параметров.',
  },
  {
    id: 15,
    category: 'Методология',
    mistake: 'Feature importance из Random Forest показывает причинно-следственные связи.',
    correct: 'Feature importance — мера корреляции / предсказательной силы. Она не говорит о причинности. Коррелированные признаки могут получить заниженную важность из-за взаимного «вытеснения».',
  },
  {
    id: 16,
    category: 'Методология',
    mistake: 'Перебор гиперпараметров по сетке (Grid Search) всегда лучше случайного поиска.',
    correct: 'Random Search при том же бюджете зачастую находит лучшие комбинации, так как равномерно покрывает пространство. Bayesian Optimization ещё эффективнее — оно учитывает предыдущие результаты.',
  },
  {
    id: 17,
    category: 'Методология',
    mistake: 'Если модель хорошо работает на train — значит всё окей.',
    correct: 'Хорошее качество на train ничего не говорит о generalization. Нужно отслеживать разрыв train/validation loss. Если val loss растёт, а train падает — это оверфиттинг.',
  },

  // Deep Learning
  {
    id: 18,
    category: 'Deep Learning',
    mistake: 'Больше слоёв нейросети → всегда лучше результат.',
    correct: 'Без skip-connections (как в ResNet) очень глубокие сети страдают от затухающих/взрывающихся градиентов и деградации точности. Архитектура важнее количества слоёв.',
  },
  {
    id: 19,
    category: 'Deep Learning',
    mistake: 'Dropout делает сеть более мощной, добавляя случайность.',
    correct: 'Dropout — это регуляризация. Он заставляет сеть не полагаться на отдельные нейроны, снижает оверфиттинг. При инференсе Dropout отключается (или масштабируется — inverted dropout).',
  },
  {
    id: 20,
    category: 'Deep Learning',
    mistake: 'Batch Normalization нужна только в CNN, в Transformer она не используется.',
    correct: 'В Transformer обычно применяется Layer Normalization (нормализация по признакам в пределах одного примера), а не Batch Normalization. Выбор нормализации зависит от архитектуры и размера батча.',
  },
  {
    id: 21,
    category: 'Deep Learning',
    mistake: 'RNN и LSTM устарели — нужно использовать только Transformer.',
    correct: 'LSTM/GRU остаются актуальными для задач с короткими последовательностями, ограниченными ресурсами или online-learning. Transformer требует O(n²) памяти по длине последовательности, что дорого для очень длинных последовательностей.',
  },
  {
    id: 22,
    category: 'Deep Learning',
    mistake: 'Transfer learning работает только для изображений (ResNet и т.д.).',
    correct: 'Transfer learning активно применяется в NLP (BERT, GPT, T5), аудио (Wav2Vec), видео, молекулярном моделировании. Ключевая идея — переносить веса, обученные на большом датасете, в задачу с малым числом примеров.',
  },
  {
    id: 23,
    category: 'Deep Learning',
    mistake: 'Learning rate нужно ставить как можно меньше — так модель лучше сойдётся.',
    correct: 'Слишком малый LR ведёт к медленной сходимости и застреванию в локальных минимумах. Оптимальный LR находится LR Finder (циклическое изменение LR) или используются schedulers: cosine annealing, warmup + decay.',
  },
]

const categories = ['Все', 'Классическое МО', 'Метрики', 'Методология', 'Deep Learning'] as const

const categoryColor: Record<string, { badge: string; border: string; bg: string }> = {
  'Классическое МО': { badge: 'bg-green-100 text-green-800', border: 'border-green-200', bg: 'bg-green-50' },
  'Метрики': { badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200', bg: 'bg-blue-50' },
  'Методология': { badge: 'bg-orange-100 text-orange-800', border: 'border-orange-200', bg: 'bg-orange-50' },
  'Deep Learning': { badge: 'bg-purple-100 text-purple-800', border: 'border-purple-200', bg: 'bg-purple-50' },
}

export default function MistakesPage() {
  const [active, setActive] = useState<string>('Все')

  const filtered = active === 'Все' ? mistakes : mistakes.filter(m => m.category === active)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🚫 Типичные ошибки на собеседованиях</h1>
        <p className="text-gray-600">
          Самые частые заблуждения по ML/DL, которые «проваливают» кандидатов. Изучи и запомни правильные ответы.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
            {cat !== 'Все' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({mistakes.filter(m => m.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 mb-5">{filtered.length} ошибок</div>

      <div className="space-y-5">
        {filtered.map(m => {
          const colors = categoryColor[m.category]
          return (
            <div key={m.id} className={`border ${colors.border} rounded-xl overflow-hidden`}>
              {/* Header badge */}
              <div className={`${colors.bg} px-5 pt-4 pb-2`}>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.badge}`}>
                  {m.category}
                </span>
              </div>
              {/* Mistake */}
              <div className="bg-red-50 border-t border-red-100 px-5 py-4">
                <div className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">❌</span>
                  <div>
                    <div className="text-xs font-semibold text-red-600 mb-1 uppercase tracking-wide">Типичная ошибка</div>
                    <p className="text-gray-800 text-sm leading-relaxed">{m.mistake}</p>
                  </div>
                </div>
              </div>
              {/* Correct */}
              <div className="bg-green-50 border-t border-green-100 px-5 py-4">
                <div className="flex gap-3 items-start">
                  <span className="text-xl flex-shrink-0">✅</span>
                  <div>
                    <div className="text-xs font-semibold text-green-600 mb-1 uppercase tracking-wide">Правильный ответ</div>
                    <p className="text-gray-700 text-sm leading-relaxed">{m.correct}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
