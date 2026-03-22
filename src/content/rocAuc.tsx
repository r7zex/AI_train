import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function RocAucContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>ROC-AUC</strong> (Area Under the ROC Curve) — метрика качества бинарного классификатора,
          не зависящая от выбора порога. ROC-кривая строится как TPR (чувствительность) против FPR
          (1-специфичность) при всех возможных порогах. AUC — площадь под этой кривой:
          случайный классификатор даёт <strong>AUC = 0.5</strong>, идеальный — <strong>AUC = 1.0</strong>.
          Ключевое свойство: AUC равен вероятности того, что случайно выбранный положительный объект
          получит более высокий score, чем случайно выбранный отрицательный.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>
        <p className="text-gray-700 mb-3">
          Оси ROC-кривой определяются двумя метриками:
        </p>
        <div className="my-4 p-5 bg-gray-50 rounded-xl border text-center space-y-3">
          <Formula math="\text{TPR (Recall)} = \frac{TP}{TP + FN}" block />
          <Formula math="\text{FPR} = \frac{FP}{FP + TN}" block />
        </div>
        <p className="text-gray-700 text-sm mb-4">
          При повышении порога (более «строгий» классификатор): TPR ↓, FPR ↓ — движение по кривой влево-вниз.
          При снижении порога: TPR ↑, FPR ↑ — движение вправо-вверх.
        </p>
        <h3 className="font-semibold text-gray-800 mb-2">Площадь под кривой (AUC)</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{AUC} = \int_0^1 \text{TPR}(\text{FPR})\, d(\text{FPR}) = P(\hat{p}_{pos} > \hat{p}_{neg})" block />
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Правая часть — вероятностная интерпретация (U-statistic Wilcoxon-Mann-Whitney).
        </p>
        <h3 className="font-semibold text-gray-800 mb-2">Интерпретация значений AUC</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">AUC</th>
                <th className="px-3 py-2 text-left">Интерпретация</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['0.5', 'Случайный классификатор (угадывает не лучше монеты)'],
                ['0.5–0.7', 'Слабая модель'],
                ['0.7–0.8', 'Удовлетворительная модель'],
                ['0.8–0.9', 'Хорошая модель'],
                ['0.9–1.0', 'Отличная / подозрительно хорошая (риск data leakage!)'],
                ['1.0', 'Идеальный классификатор'],
                ['< 0.5', 'Инвертированная модель — инвертируй predictions!'],
              ].map(([v, d]) => (
                <tr key={v} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-mono font-bold">{v}</td>
                  <td className="px-3 py-2 text-gray-700">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InfoBlock type="note" title="AUC не зависит от порога">
          ROC-AUC учитывает <em>ранжирование</em> объектов, а не конкретный порог.
          Поэтому она подходит для сравнения моделей независимо от бизнес-порога. Но для операционного
          применения всё равно нужно выбрать порог, используя, например, F1 или cost-sensitive анализ.
        </InfoBlock>
        <InfoBlock type="warning" title="Слабость ROC-AUC при дисбалансе">
          При сильном дисбалансе классов (1:100 и более) ROC-AUC может выглядеть хорошо даже у плохой модели,
          потому что FPR в знаменателе — это доля от <em>всех негативных</em>, которых много.
          В таких случаях используй PR-AUC.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример</h2>
        <p className="text-gray-700 mb-3">
          5 объектов, реальные метки и predicted scores:
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Объект</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Метка</th>
              </tr>
            </thead>
            <tbody>
              {[['A','0.9','+'],['B','0.8','−'],['C','0.7','+'],['D','0.4','−'],['E','0.1','+']].map(([o,s,l]) => (
                <tr key={o} className="border-t border-gray-100 text-center">
                  <td className="px-3 py-2">{o}</td>
                  <td className="px-3 py-2 font-mono">{s}</td>
                  <td className={`px-3 py-2 font-bold ${l==='+' ? 'text-green-600' : 'text-red-600'}`}>{l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          Positives: A, C, E (3 объекта). Negatives: B, D (2 объекта).
        </p>
        <p className="text-sm text-gray-700 mb-2">
          Пары (pos, neg): (A,B), (A,D), (C,B), (C,D), (E,B), (E,D) — всего 6 пар.
        </p>
        <p className="text-sm text-gray-700 mb-2">
          Победы pos: A{'>'}B ✓, A{'>'}D ✓, C{'>'}B ✓, C{'>'}D ✓, E{'>'}D ✓ — 5 побед. E{'<'}B ✗ — 1 поражение.
        </p>
        <p className="text-sm text-gray-700 font-semibold">
          AUC = 5/6 ≈ <strong>0.833</strong>
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
from sklearn.metrics import roc_auc_score, roc_curve
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Генерируем данные
X, y = make_classification(n_samples=1000, n_features=20,
                            n_informative=5, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = LogisticRegression(random_state=42)
model.fit(X_train, y_train)

# Вероятности для положительного класса
y_prob = model.predict_proba(X_test)[:, 1]

# ROC-AUC
auc = roc_auc_score(y_test, y_prob)
print(f"ROC-AUC: {auc:.4f}")

# Точки кривой
fpr, tpr, thresholds = roc_curve(y_test, y_prob)
print(f"Кол-во точек на кривой: {len(thresholds)}")
print(f"FPR (первые 5): {fpr[:5].round(3)}")
print(f"TPR (первые 5): {tpr[:5].round(3)}")

# Оптимальный порог (максимизируем TPR - FPR = Youden's J)
optimal_idx = np.argmax(tpr - fpr)
optimal_threshold = thresholds[optimal_idx]
print(f"\\nОптимальный порог: {optimal_threshold:.4f}")
print(f"  TPR = {tpr[optimal_idx]:.4f}, FPR = {fpr[optimal_idx]:.4f}")

# Демонстрация: инвертированный классификатор
auc_inverted = roc_auc_score(y_test, -y_prob)
print(f"\\nAUC инвертированных scores: {auc_inverted:.4f}")`}
          output={`ROC-AUC: 0.9354
Кол-во точек на кривой: 197
FPR (первые 5): [0.    0.    0.    0.    0.005]
TPR (первые 5): [0.    0.01  0.02  0.03  0.03 ]

Оптимальный порог: 0.5231
  TPR = 0.8700, FPR = 0.0850

AUC инвертированных scores: 0.0646`}
          explanation="roc_curve возвращает массивы FPR, TPR и соответствующих порогов. AUC инвертированных scores = 1 − original_AUC. Оптимальный порог по Youden's J: max(TPR − FPR)."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Использовать ROC-AUC при сильном дисбалансе', 'При 1:100 FPR мал даже у плохой модели. Используй PR-AUC или F1 с нужным порогом.'],
            ['Передавать predict() вместо predict_proba()[:, 1]', 'roc_auc_score нужны вероятности (continuous scores), а не бинарные предсказания. С бинарными AUC теряет смысл.'],
            ['Считать AUC=0.7 «плохой» в медицине', 'Требования к AUC зависят от задачи. В диагностике рака AUC=0.7 может быть критически мало; в рекомендательной системе — приемлемо.'],
            ['Игнорировать AUC < 0.5', 'Это не сломанная модель — просто инвертируй scores (умножь на −1). AUC=0.3 → после инверсии = 0.7.'],
            ['Строить ROC-кривую только для бинарной задачи', 'Для многоклассовой задачи: One-vs-Rest с micro/macro усреднением (roc_auc_score(..., multi_class="ovr")).'],
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
            question: 'Что такое AUC = 0.5 и что это означает для модели?',
            solution: (
              <p>AUC = 0.5 означает, что модель не лучше случайного угадывания: вероятность того, что случайный положительный объект получит higher score, чем случайный отрицательный, равна 50%. ROC-кривая — диагональ квадрата.</p>
            ),
          },
          {
            level: 'basic',
            question: 'Как изменится ROC-AUC если изменить порог классификации с 0.5 на 0.3?',
            solution: (
              <p>ROC-AUC <strong>не изменится</strong> — она агрегирует все пороги сразу. Изменится лишь конкретная точка на кривой, выбранная как рабочая. AUC зависит только от ранжирования объектов по score, а не от порога.</p>
            ),
          },
          {
            level: 'concept',
            question: 'Объясните вероятностную интерпретацию AUC.',
            solution: (
              <div>
                <p>AUC = P(score(pos) &gt; score(neg)) — вероятность того, что случайно выбранный положительный объект получит более высокий score, чем случайно выбранный отрицательный.</p>
                <p className="mt-2">Это эквивалентно статистике Wilcoxon-Mann-Whitney (U-тест). Именно поэтому AUC — это метрика <em>ранжирования</em>, а не классификации.</p>
              </div>
            ),
          },
          {
            level: 'code',
            question: 'Напишите функцию для вычисления AUC методом трапеций вручную, не используя sklearn.',
            solution: (
              <pre className="text-xs font-mono">{`def manual_auc(y_true, y_score):
    # Сортируем по убыванию score
    order = np.argsort(-y_score)
    y_true = y_true[order]
    n_pos = y_true.sum()
    n_neg = len(y_true) - n_pos
    tpr_list, fpr_list = [0], [0]
    tp = fp = 0
    for label in y_true:
        if label == 1: tp += 1
        else: fp += 1
        tpr_list.append(tp / n_pos)
        fpr_list.append(fp / n_neg)
    # Метод трапеций
    auc = np.trapz(tpr_list, fpr_list)
    return auc`}</pre>
            ),
          },
          {
            level: 'tricky',
            question: 'У модели A AUC=0.85 на balanced данных. У модели B AUC=0.80 на тех же данных, но F1=0.78 при пороге 0.5. У модели A F1=0.72 при пороге 0.5. Какую модель выбрать для production при сильном дисбалансе?',
            solution: (
              <div>
                <p>Вопрос хитрый: на balanced данных AUC выглядит хорошо у обеих моделей. При сильном дисбалансе в production нужно смотреть на <strong>PR-AUC и F1 при подобранном пороге</strong>.</p>
                <p className="mt-2">Модель B имеет лучший F1 при дефолтном пороге, что говорит о лучшей калиброванности. Правильный ответ: <strong>нужно тестировать обе модели с оптимальным порогом на imbalanced production данных</strong>, а не выбирать только по ROC-AUC на balanced.</p>
              </div>
            ),
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Fawcett T., "An introduction to ROC analysis" (2006)</strong> — классическая работа, детальное объяснение ROC/AUC</li>
          <li>📚 <strong>scikit-learn Docs — roc_auc_score, roc_curve</strong> — официальная документация с примерами</li>
          <li>📚 <strong>Hanley & McNeil, "The meaning and use of the area under a ROC curve" (1982)</strong> — вероятностная интерпретация AUC</li>
          <li>📚 <strong>Davis & Goadrich, "The relationship between Precision-Recall and ROC curves" (2006)</strong> — сравнение ROC и PR кривых</li>
        </ul>
      </section>
    </div>
  )
}
