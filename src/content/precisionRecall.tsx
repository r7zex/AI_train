import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'
import PrecisionRecallCalc from '../components/calculators/PrecisionRecallCalc'

export default function PrecisionRecallContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          Accuracy не всегда информативна (особенно при дисбалансе классов).
          <strong> Precision</strong> показывает, сколько из предсказанных позитивов реальные.
          <strong> Recall</strong> — сколько реальных позитивов мы нашли.
          <strong> F1</strong> — их гармоническое среднее. Выбор метрики зависит от задачи: в медицинской диагностике критичен recall (нельзя пропустить болезнь), в спам-фильтрации — precision (нельзя блокировать важные письма).
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Confusion Matrix</h2>
        <div className="overflow-x-auto mb-4">
          <table className="text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-100"><tr>
              <th className="px-4 py-2"></th><th className="px-4 py-2">Предсказан Positive</th><th className="px-4 py-2">Предсказан Negative</th>
            </tr></thead>
            <tbody>
              <tr className="border-t border-gray-100"><td className="px-4 py-2 font-medium bg-gray-50">Реально Positive</td>
                <td className="px-4 py-2 text-center bg-green-50 font-semibold text-green-700">TP</td>
                <td className="px-4 py-2 text-center bg-red-50 font-semibold text-red-700">FN</td></tr>
              <tr className="border-t border-gray-100"><td className="px-4 py-2 font-medium bg-gray-50">Реально Negative</td>
                <td className="px-4 py-2 text-center bg-orange-50 font-semibold text-orange-700">FP</td>
                <td className="px-4 py-2 text-center bg-blue-50 font-semibold text-blue-700">TN</td></tr>
            </tbody>
          </table>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Формулы</h2>
        <div className="grid sm:grid-cols-3 gap-4 my-4">
          {[
            {label:"Precision", f:"\\text{Precision} = \\frac{TP}{TP+FP}", desc:"Из всех предсказанных Positive — сколько реально Positive"},
            {label:"Recall (Sensitivity)", f:"\\text{Recall} = \\frac{TP}{TP+FN}", desc:"Из всех реальных Positive — сколько мы нашли"},
            {label:"F1 Score", f:"F_1 = \\frac{2 \\cdot P \\cdot R}{P + R}", desc:"Гармоническое среднее Precision и Recall"},
          ].map(({label,f,desc})=>(
            <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <div className="font-semibold text-gray-700 mb-2 text-sm">{label}</div>
              <Formula math={f} block/>
              <div className="text-xs text-gray-500 mt-2">{desc}</div>
            </div>
          ))}
        </div>
        <InfoBlock type="note" title="F-beta Score">
          Обобщение: <Formula math="F_\beta = (1+\beta^2)\frac{P\cdot R}{\beta^2 P + R}"/>. При β{">"}1 — больший вес на Recall, при β{"<"}1 — на Precision. F1 = F_β при β=1.
        </InfoBlock>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной расчёт</h2>
        <p className="text-gray-700 text-sm mb-3">Бинарный классификатор: TP=80, FP=20, FN=10, TN=390.</p>
        <div className="bg-gray-50 border rounded-xl p-4 text-sm space-y-2">
          <p>Precision = 80 / (80+20) = 80/100 = <strong>0.80</strong></p>
          <p>Recall = 80 / (80+10) = 80/90 ≈ <strong>0.889</strong></p>
          <p>F1 = 2×0.80×0.889 / (0.80+0.889) = 1.422 / 1.689 ≈ <strong>0.842</strong></p>
          <p>Accuracy = (80+390) / (80+20+10+390) = 470/500 = <strong>0.94</strong></p>
        </div>
        <InfoBlock type="warning" title="Когда Accuracy обманывает">
          Если классов 5% позитивных и 95% негативных, модель «все негативные» даст Accuracy=0.95, но Recall=0 и F1=0. Используй Precision/Recall/F1 при дисбалансе.
        </InfoBlock>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock language="python"
          code={`from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

# Симуляция предсказаний
np.random.seed(42)
y_true = np.array([1]*90 + [0]*410)   # 90 позитивных, 410 негативных
y_pred = np.array([1]*80 + [0]*10 + [1]*20 + [0]*390)  # TP=80,FN=10,FP=20,TN=390

print("Confusion Matrix:")
print(confusion_matrix(y_true, y_pred))
print()
print(classification_report(y_true, y_pred, target_names=['Negative','Positive']))`}
          output={`Confusion Matrix:
[[390  20]
 [ 10  80]]

              precision    recall  f1-score   support

    Negative       0.97      0.95      0.96       410
    Positive       0.80      0.89      0.84        90

    accuracy                           0.94       500
   macro avg       0.89      0.92      0.90       500
weighted avg       0.94      0.94      0.94       500`}
          explanation="Accuracy=0.94 выглядит хорошо, но Precision для Positive=0.80 (каждый 5-й позитивный прогноз ошибочен). Смотри на задачу: если важнее не пропустить позитивы — следи за Recall."
        />
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Интерактивный калькулятор</h2>
        <PrecisionRecallCalc />
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ["Оптимизировать только Accuracy при дисбалансе","При 99% негативных — модель 'всегда 0' даст Accuracy=0.99, но F1=0."],
            ["Считать F1 как среднее арифметическое P и R","F1 — гармоническое среднее: 2PR/(P+R). Оно штрафует за дисбаланс P и R сильнее, чем среднее."],
            ["Не указывать порог при вычислении P/R","P, R, F1 зависят от порога классификации (0.5 по умолчанию в sklearn). Иногда стоит настроить порог."],
          ].map(([e,f])=>(
            <div key={e} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <span className="font-semibold text-red-700">❌ {e}:</span> <span className="text-gray-700">{f}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Практические задания</h2>
        <TaskBlock tasks={[
          {level:"basic",question:"TP=50, FP=10, FN=20, TN=120. Вычислите Precision, Recall, F1.",
           solution:<div><p>P = 50/(50+10) = 0.833</p><p>R = 50/(50+20) = 0.714</p><p>F1 = 2×0.833×0.714/(0.833+0.714) = 1.190/1.547 = <strong>0.769</strong></p></div>},
          {level:"concept",question:"В задаче детекции рака какая метрика важнее: Precision или Recall? Почему?",
           solution:<p>Recall важнее. Пропустить реальный рак (FN) критически опасно. FP (ложная тревога) хуже, чем FN только при очень дорогом лечении. Обычно в медицине: recall → minimize FN.</p>},
          {level:"tricky",question:"Precision=0.9, Recall=0.1. F1=? Почему F1 такое низкое, хотя Precision высокая?",
           solution:<div><p>F1 = 2×0.9×0.1/(0.9+0.1) = 0.18/1.0 = <strong>0.18</strong>. Очень низкое!</p><p>F1 — гармоническое среднее: оно близко к меньшему из двух значений. Модель находит только 10% позитивов (Recall=0.1), что бесполезно на практике, несмотря на высокую Precision.</p></div>},
          {level:"code",question:"Напишите код на Python для построения Precision-Recall curve с разными порогами.",
           solution:<pre className="text-xs font-mono">{`from sklearn.metrics import precision_recall_curve
import matplotlib.pyplot as plt
prec, rec, thr = precision_recall_curve(y_true, y_scores)
plt.plot(rec, prec); plt.xlabel('Recall'); plt.ylabel('Precision')`}</pre>},
        ]}/>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>📚 <strong>scikit-learn Docs — Metrics and Scoring</strong></li>
          <li>📚 <strong>Powers, "Evaluation: Precision, Recall and F-measure" (2011)</strong></li>
          <li>📚 <strong>ESL §7.3 — Confusion Matrices</strong></li>
        </ul>
      </section>
    </div>
  )
}
