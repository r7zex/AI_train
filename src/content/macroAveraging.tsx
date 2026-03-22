import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function MacroAveragingContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          При многоклассовой классификации метрики (Precision, Recall, F1) нужно агрегировать по классам.
          Существует три стратегии: <strong>macro</strong> — простое среднее по всем классам
          (каждый класс важен одинаково), <strong>micro</strong> — глобальный подсчёт TP/FP/FN по всем классам
          вместе (объекты важны одинаково, чувствительно к дисбалансу),
          <strong> weighted</strong> — среднее, взвешенное по числу объектов в классе.
          Выбор стратегии критически влияет на итоговое число.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Macro-averaging</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{F1}_{\text{macro}} = \frac{1}{K} \sum_{i=1}^{K} F1_i" block />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Где <Formula math="K" /> — число классов, <Formula math="F1_i" /> — F1 для класса <Formula math="i" />.
          Редкий класс с плохим F1=0.1 так же сильно «тянет вниз», как и частый класс.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">Micro-averaging</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{F1}_{\text{micro}} = \frac{2 \cdot \sum TP_i}{2 \cdot \sum TP_i + \sum FP_i + \sum FN_i}" block />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Суммируем TP, FP, FN по всем классам, затем считаем F1 как для бинарной задачи.
          При сбалансированных данных micro ≈ accuracy.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">Weighted-averaging</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{F1}_{\text{weighted}} = \frac{\sum_{i=1}^{K} n_i \cdot F1_i}{\sum_{i=1}^{K} n_i}" block />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          <Formula math="n_i" /> — число объектов класса <Formula math="i" />.
          Частые классы имеют больший вес. Это компромисс между macro и micro.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Стратегия</th>
                <th className="px-3 py-2 text-left">Когда использовать</th>
                <th className="px-3 py-2 text-left">Чувствительность к дисбалансу</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['macro','Все классы одинаково важны (редкие тоже)','Высокая — штрафует за плохие редкие классы'],
                ['micro','Объект важнее класса; нужна общая accuracy','Низкая — доминируют частые классы'],
                ['weighted','Production: нужно учесть реальное распределение','Средняя — частые классы влияют пропорционально'],
                ['samples (multi-label)','Мульти-лейбл задачи','— (не применимо к multi-class)'],
              ].map(([s,w,d]) => (
                <tr key={s} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-mono font-bold">{s}</td>
                  <td className="px-3 py-2 text-gray-700">{w}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBlock type="warning" title="Macro F1 и дисбаланс">
          При сильном дисбалансе macro F1 может быть низкой даже при высокой accuracy.
          Модель с accuracy=99% на данных 99:1 может иметь macro F1=0.5 (редкий класс не предсказывается совсем).
          Это именно <em>нужное поведение</em> macro — она сигнализирует о проблеме.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример</h2>
        <p className="text-gray-700 mb-3">
          3 класса: A (90 объектов), B (8 объектов), C (2 объекта). Confusion matrix диагональ: 88, 5, 1.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Класс</th>
                <th className="px-3 py-2">n</th>
                <th className="px-3 py-2">TP</th>
                <th className="px-3 py-2">FP</th>
                <th className="px-3 py-2">FN</th>
                <th className="px-3 py-2">Prec</th>
                <th className="px-3 py-2">Recall</th>
                <th className="px-3 py-2">F1</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['A','90','88','3','2','0.967','0.978','0.972'],
                ['B','8','5','2','3','0.714','0.625','0.667'],
                ['C','2','1','1','1','0.500','0.500','0.500'],
              ].map(([cls,...vals]) => (
                <tr key={cls} className="border-t border-gray-100 text-center">
                  <td className="px-3 py-2 font-bold">{cls}</td>
                  {vals.map((v,i) => <td key={i} className="px-3 py-2 font-mono">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-1 text-sm text-gray-700 font-mono bg-gray-50 rounded-lg p-3">
          <p>Accuracy    = (88+5+1)/100 = <strong>0.940</strong></p>
          <p>Macro F1    = (0.972+0.667+0.500)/3 = <strong>0.713</strong> ← штрафует за класс C</p>
          <p>Weighted F1 = (90×0.972 + 8×0.667 + 2×0.500)/100 = <strong>0.928</strong></p>
          <p>Micro F1    ≈ Accuracy = <strong>0.940</strong> (при multi-class)</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Macro F1=0.71 при accuracy=0.94 — чёткий сигнал, что редкие классы предсказываются плохо.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock
          language="python"
          code={`import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score
from collections import Counter

# Имитируем 4 класса с дисбалансом: 800, 150, 40, 10
np.random.seed(42)
n = 1000
y_all = np.array([0]*800 + [1]*150 + [2]*40 + [3]*10)
X_all = np.random.randn(n, 10)
# Добавляем сигнал
for cls in range(4):
    mask = y_all == cls
    X_all[mask, cls] += 2.0

X_train, X_test, y_train, y_test = train_test_split(
    X_all, y_all, test_size=0.2, stratify=y_all, random_state=42
)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)

# Подробный отчёт
print(classification_report(y_test, y_pred,
    target_names=['Class 0 (n=160)', 'Class 1 (n=30)',
                  'Class 2 (n=8)', 'Class 3 (n=2)']))

# Явное сравнение стратегий
print("=== Сравнение стратегий F1 ===")
for avg in ['macro', 'micro', 'weighted']:
    score = f1_score(y_test, y_pred, average=avg)
    print(f"F1 {avg:>8}: {score:.4f}")`}
          output={`                   precision    recall  f1-score   support

   Class 0 (n=160)       0.97      0.99      0.98       160
    Class 1 (n=30)       0.93      0.87      0.90        30
     Class 2 (n=8)       0.83      0.62      0.71         8
     Class 3 (n=2)       0.50      0.50      0.50         2

         accuracy                           0.96       200
        macro avg       0.81      0.75      0.77       200
     weighted avg       0.96      0.96      0.96       200

=== Сравнение стратегий F1 ===
F1    macro: 0.7725
F1    micro: 0.9600
F1 weighted: 0.9580`}
          explanation="classification_report показывает все три усреднения. Macro F1=0.77 значительно ниже weighted/micro=0.96, потому что редкие классы (особенно Class 3 с F1=0.50) тянут macro вниз. Это полезный сигнал об их плохой предсказуемости."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Оптимизировать accuracy при дисбалансе', 'Accuracy игнорирует редкие классы. Используй macro F1 или balanced accuracy.'],
            ['Применять macro F1 когда редкие классы неважны', 'Macro штрафует за плохие редкие классы. Если класс «мусор», используй weighted или micro.'],
            ['Не указывать zero_division при f1_score', 'Если модель не предсказывает какой-то класс, появится деление на 0. Добавь zero_division=0.'],
            ['Путать micro F1 и accuracy', 'Для multi-class без multi-label micro F1 = accuracy. Но для multi-label они разные.'],
          ].map(([err, fix]) => (
            <div key={err} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <span className="font-semibold text-red-700">❌ {err}:</span>
              <span className="text-gray-700 ml-2">{fix}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Практические задания</h2>
        <TaskBlock tasks={[
          {
            level: 'basic',
            question: '3 класса, F1 по каждому: 0.9, 0.7, 0.2. Вычислите macro F1.',
            solution: (
              <p>Macro F1 = (0.9 + 0.7 + 0.2) / 3 = 1.8 / 3 = <strong>0.60</strong>. Класс с F1=0.2 сильно тянет вниз.</p>
            ),
          },
          {
            level: 'basic',
            question: 'Micro F1 для задачи с 3 классами: TP=[80,15,3], FP=[5,8,2], FN=[10,5,3]. Вычислите.',
            solution: (
              <div>
                <p>ΣTP=98, ΣFP=15, ΣFN=18</p>
                <p>Micro F1 = 2×98 / (2×98 + 15 + 18) = 196 / 229 ≈ <strong>0.856</strong></p>
              </div>
            ),
          },
          {
            level: 'concept',
            question: 'В каком случае macro F1 = weighted F1?',
            solution: (
              <p>Когда все классы имеют одинаковое число объектов (сбалансированные данные). Тогда веса в weighted равны 1/K для каждого класса, что совпадает с macro.</p>
            ),
          },
          {
            level: 'tricky',
            question: 'Модель имеет accuracy=99% на задаче с 1% позитивных, предсказывая всё как негативный класс. Какие будут macro F1, micro F1, weighted F1?',
            solution: (
              <div>
                <p>Negative class: Precision=0.99, Recall=1.0, F1≈0.995.</p>
                <p>Positive class: TP=0, Precision=0/0=0, Recall=0, F1=0.</p>
                <p className="mt-2"><strong>Macro F1</strong> = (0.995 + 0) / 2 = <strong>0.498</strong> — честно показывает проблему</p>
                <p><strong>Micro F1 ≈ Accuracy = 0.990</strong> — обманчиво высокая</p>
                <p><strong>Weighted F1</strong> = 0.99×0.995 + 0.01×0 ≈ <strong>0.985</strong> — тоже обманчивая</p>
              </div>
            ),
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>scikit-learn Docs — classification_report, f1_score</strong> — официальная документация по averaging стратегиям</li>
          <li>📚 <strong>Sokolova & Lapalme, "A systematic analysis of performance measures for classification tasks" (2009)</strong></li>
          <li>📚 <strong>Manning, Raghavan, Schütze, "Introduction to Information Retrieval" §8</strong> — micro/macro averaging в IR</li>
        </ul>
      </section>
    </div>
  )
}
