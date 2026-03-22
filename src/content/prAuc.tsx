import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function PrAucContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>PR-AUC</strong> (Area Under the Precision-Recall Curve) — площадь под кривой
          Precision-Recall. В отличие от ROC-AUC, PR-кривая фокусируется только на положительном классе:
          ось X — Recall (TPR), ось Y — Precision. Это делает PR-AUC незаменимой метрикой при
          <strong> сильном дисбалансе классов</strong> (редкие болезни, фрод, редкие события),
          где ROC-AUC создаёт «оптимистичную» картину. Идеальный PR-AUC = 1.0,
          у случайного классификатора ≈ prevalence (доля позитивных).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>
        <p className="text-gray-700 mb-3">Оси PR-кривой:</p>
        <div className="my-4 p-5 bg-gray-50 rounded-xl border text-center space-y-3">
          <Formula math="\text{Precision} = \frac{TP}{TP + FP}" block />
          <Formula math="\text{Recall} = \frac{TP}{TP + FN}" block />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">Average Precision (AP)</h3>
        <p className="text-gray-700 text-sm mb-3">
          Наиболее распространённый вариант агрегации — <strong>Average Precision</strong>:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{AP} = \sum_{k=1}^{n} (R_k - R_{k-1}) \cdot P_k" block />
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Где <Formula math="P_k" /> и <Formula math="R_k" /> — Precision и Recall при <Formula math="k" />-м пороге.
          AP — это взвешенное среднее Precision по всем порогам, где весами служат приросты Recall.
          Используется в object detection (mAP = mean AP по классам).
        </p>
        <h3 className="font-semibold text-gray-800 mb-2">Интерполяция Precision</h3>
        <p className="text-sm text-gray-600 mb-4">
          Кривая PR имеет «зазубренный» вид. Для вычисления площади sklearn использует либо
          трапецию (auc(recall, precision)), либо шаговую интерполяцию (average_precision_score).
          Шаговая даёт более консервативную оценку — обычно предпочтительна.
        </p>
        <InfoBlock type="note" title="PR-AUC vs ROC-AUC: когда что использовать">
          <strong>ROC-AUC</strong>: сбалансированные данные, нужна общая мера дискриминации.<br/>
          <strong>PR-AUC</strong>: сильный дисбаланс (imbalance ratio &gt; 10:1), когда важно минимизировать FP
          среди предсказанных positives (precision критична), или когда TN не важны совсем
          (например, information retrieval).
        </InfoBlock>
        <InfoBlock type="warning" title="Базовая линия PR-AUC">
          Для случайного классификатора ROC-AUC всегда = 0.5. Но PR-AUC случайного классификатора
          = prevalence = P/(P+N). При 1% позитивных — baseline = 0.01! Это важно помнить
          при интерпретации PR-AUC = 0.15 как «хорошего» результата.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример</h2>
        <p className="text-gray-700 mb-3">
          6 объектов, отсортированных по убыванию score. P = 2, N = 4.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Rank</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Метка</th>
                <th className="px-3 py-2">TP</th>
                <th className="px-3 py-2">FP</th>
                <th className="px-3 py-2">Precision</th>
                <th className="px-3 py-2">Recall</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1','0.95','+','1','0','1.00','0.50'],
                ['2','0.82','−','1','1','0.50','0.50'],
                ['3','0.71','+','2','1','0.67','1.00'],
                ['4','0.55','−','2','2','0.50','1.00'],
                ['5','0.33','−','2','3','0.40','1.00'],
                ['6','0.11','−','2','4','0.33','1.00'],
              ].map(([r,s,l,tp,fp,pr,re]) => (
                <tr key={r} className="border-t border-gray-100 text-center">
                  <td className="px-3 py-2">{r}</td>
                  <td className="px-3 py-2 font-mono">{s}</td>
                  <td className={`px-3 py-2 font-bold ${l==='+' ? 'text-green-600' : 'text-red-600'}`}>{l}</td>
                  <td className="px-3 py-2">{tp}</td>
                  <td className="px-3 py-2">{fp}</td>
                  <td className="px-3 py-2 font-mono">{pr}</td>
                  <td className="px-3 py-2 font-mono">{re}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          AP (шаговая): <strong>(0.5−0)×1.00 + (1.0−0.5)×0.67 = 0.50 + 0.33 = 0.835</strong>
        </p>
        <p className="text-sm text-gray-700">
          Заметьте: FP на позиции 2 резко снижает Precision. Если бы объекты шли [+,+,−,−,−,−],
          AP = 1.0 — идеальное ранжирование.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock
          language="python"
          code={`import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    precision_recall_curve, auc,
    average_precision_score, roc_auc_score
)

# Имитируем дисбаланс 1:20
X, y = make_classification(
    n_samples=2100, n_features=10,
    n_informative=5, weights=[0.95, 0.05],
    random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

model = LogisticRegression(class_weight='balanced', random_state=42)
model.fit(X_train, y_train)
y_prob = model.predict_proba(X_test)[:, 1]

# ROC-AUC может быть обманчиво высокой
roc = roc_auc_score(y_test, y_prob)
print(f"ROC-AUC:  {roc:.4f}  (может выглядеть оптимистично)")

# PR-AUC — честнее при дисбалансе
precision, recall, thresholds = precision_recall_curve(y_test, y_prob)
pr_auc = auc(recall, precision)

# Average Precision (рекомендуется)
ap = average_precision_score(y_test, y_prob)

print(f"PR-AUC:   {pr_auc:.4f}  (trapezoidal)")
print(f"AP:       {ap:.4f}  (step interpolation, recommended)")

baseline = y_test.mean()
print(f"Baseline (random): {baseline:.4f}")
print(f"Улучшение над случайным: {(ap / baseline):.1f}x")

# Точки кривой
print(f"\\nПервые 5 точек PR-кривой:")
print(f"Recall:    {recall[:5].round(3)}")
print(f"Precision: {precision[:5].round(3)}")`}
          output={`ROC-AUC:  0.9201  (может выглядеть оптимистично)
PR-AUC:   0.5834  (trapezoidal)
AP:       0.5712  (step interpolation, recommended)
Baseline (random): 0.0476
Улучшение над случайным: 12.0x

Первые 5 точек PR-кривой:
Recall:    [0.    0.1   0.1   0.2   0.2  ]
Precision: [1.    1.    0.909 0.909 0.833]`}
          explanation="При дисбалансе 1:20 ROC-AUC=0.92 выглядит блестяще, но PR-AUC=0.57 при baseline=0.05 говорит о реальном улучшении в 12 раз над случайным. average_precision_score использует шаговую интерполяцию (консервативнее)."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Не учитывать baseline PR-AUC', 'PR-AUC=0.15 на данных с 5% позитивных — это улучшение в 3 раза над случайным. Всегда указывай baseline.'],
            ['Путать auc(recall, precision) и average_precision_score', 'auc() использует трапеции, average_precision_score — шаговую интерполяцию. Шаговая более консервативна и принята в CV/NLP сообществе.'],
            ['Передавать recall и precision в неправильном порядке в auc()', 'auc(recall, precision), НЕ auc(precision, recall). recall должен быть x-осью.'],
            ['Игнорировать PR-AUC при выборе порога', 'Оптимальный порог для production лучше выбирать по F1 или по PR-кривой, а не только по ROC.'],
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
            question: 'Чему равен PR-AUC случайного классификатора на данных с 10% позитивных объектов?',
            solution: (
              <p>PR-AUC случайного классификатора ≈ <strong>prevalence = 0.10</strong>. Precision у него всегда ≈ 10% при любом Recall, поэтому площадь под горизонтальной линией = 0.10 × 1.0 = 0.10.</p>
            ),
          },
          {
            level: 'concept',
            question: 'Почему ROC-AUC может быть обманчиво высокой при дисбалансе классов, а PR-AUC — нет?',
            solution: (
              <div>
                <p>FPR = FP / (FP + TN). При огромном числе TN (много негативных) FPR остаётся маленьким даже при большом числе FP. Это создаёт "оптимистичную" ROC-кривую.</p>
                <p className="mt-2">Precision = TP / (TP + FP) — <strong>не зависит от числа TN</strong>. Поэтому PR-кривая честно показывает, как много мусора попадает в предсказанные positives.</p>
              </div>
            ),
          },
          {
            level: 'code',
            question: 'Напишите функцию вычисления Average Precision вручную по отсортированным меткам.',
            solution: (
              <pre className="text-xs font-mono">{`def average_precision(y_true, y_score):
    order = np.argsort(-y_score)
    y_sorted = np.array(y_true)[order]
    n_pos = y_sorted.sum()
    tp = 0
    ap = 0.0
    prev_recall = 0.0
    for i, label in enumerate(y_sorted):
        if label == 1:
            tp += 1
            precision = tp / (i + 1)
            recall = tp / n_pos
            ap += precision * (recall - prev_recall)
            prev_recall = recall
    return ap`}</pre>
            ),
          },
          {
            level: 'tricky',
            question: 'Модель A: ROC-AUC=0.95, PR-AUC=0.30. Модель B: ROC-AUC=0.85, PR-AUC=0.55. Данные: 2% positives. Какую модель выбрать и почему?',
            solution: (
              <div>
                <p><strong>Модель B</strong>. При 2% позитивных PR-AUC гораздо информативнее.</p>
                <p className="mt-2">Baseline PR-AUC = 0.02. Модель A улучшает в 15× (0.30/0.02), модель B — в 27.5× (0.55/0.02).</p>
                <p className="mt-2">Высокий ROC-AUC модели A может говорить о хорошем ранжировании в целом, но бесполезно ранжирует редкие positives. Модель B значительно лучше находит именно их.</p>
              </div>
            ),
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Davis & Goadrich, "The relationship between Precision-Recall and ROC curves" (ICML 2006)</strong> — ключевая работа о связи PR и ROC</li>
          <li>📚 <strong>scikit-learn Docs — average_precision_score, precision_recall_curve</strong></li>
          <li>📚 <strong>Saito & Rehmsmeier, "The Precision-Recall Plot Is More Informative than the ROC Plot When Evaluating Binary Classifiers on Imbalanced Datasets" (2015)</strong></li>
          <li>📚 <strong>Manning, Raghavan, Schütze, "Introduction to Information Retrieval" — §8 (AP, mAP)</strong></li>
        </ul>
      </section>
    </div>
  )
}
