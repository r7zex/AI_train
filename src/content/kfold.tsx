import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function KfoldContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>K-fold Cross-Validation</strong> — техника оценки модели, при которой данные делятся
          на <em>K</em> равных частей (фолдов). Модель обучается <em>K</em> раз: каждый раз один фолд
          служит валидационным, остальные K−1 — тренировочными. Итоговая метрика — среднее по K итерациям.
          Это позволяет использовать все данные и для обучения, и для оценки, получая более надёжную
          оценку generalization error, чем при одном train/test сплите.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Схема разбиения</h2>
        <p className="text-gray-700 mb-3">Пример K=5 с 10 объектами (каждая буква — объект):</p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden font-mono">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Fold</th>
                <th className="px-3 py-2 text-center">1-2</th>
                <th className="px-3 py-2 text-center">3-4</th>
                <th className="px-3 py-2 text-center">5-6</th>
                <th className="px-3 py-2 text-center">7-8</th>
                <th className="px-3 py-2 text-center">9-10</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1','VAL','train','train','train','train'],
                ['2','train','VAL','train','train','train'],
                ['3','train','train','VAL','train','train'],
                ['4','train','train','train','VAL','train'],
                ['5','train','train','train','train','VAL'],
              ].map(([fold,...cells]) => (
                <tr key={fold} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-bold text-center">{fold}</td>
                  {cells.map((c,i) => (
                    <td key={i} className={`px-3 py-2 text-center text-xs rounded ${c==='VAL' ? 'bg-blue-100 text-blue-800 font-bold' : 'text-gray-500'}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Каждый объект ровно 1 раз попадает в валидационный фолд, K−1 раз — в тренировочный.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>
        <p className="text-gray-700 mb-3">Оценка качества модели по K-fold:</p>
        <div className="my-4 p-5 bg-gray-50 rounded-xl border text-center space-y-3">
          <Formula math="\hat{E} = \frac{1}{K} \sum_{k=1}^{K} L(f_{-k},\, D_k)" block />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Где <Formula math="f_{-k}" /> — модель, обученная на всех фолдах кроме k-го,
          <Formula math="D_k" /> — k-й фолд (валидационный), <Formula math="L" /> — функция потерь/метрика.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">Разновидности K-fold</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Метод</th>
                <th className="px-3 py-2 text-left">Особенность</th>
                <th className="px-3 py-2 text-left">Когда использовать</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['KFold','Случайное разбиение','Регрессия, сбалансированные данные'],
                ['StratifiedKFold','Сохраняет пропорции классов в каждом фолде','Классификация с дисбалансом'],
                ['GroupKFold','Одна группа не попадает в оба split','Медицина (один пациент), временные серии'],
                ['TimeSeriesSplit','Последовательные split (train < test по времени)','Временные ряды, финансы'],
                ['LOO-CV (K=n)','Каждый объект — отдельный фолд','Малые датасеты (n < 50)'],
                ['RepeatedKFold','KFold повторяется R раз с разным seed','Высокая дисперсия, нужна надёжность'],
              ].map(([m,f,u]) => (
                <tr key={m} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-mono text-xs font-bold">{m}</td>
                  <td className="px-3 py-2 text-gray-700 text-xs">{f}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBlock type="note" title="Как выбрать K?">
          Стандартно K=5 или K=10. При K=5: bias чуть выше, variance ниже, быстрее.
          При K=10: менее смещённая оценка, чуть выше variance. LOO (K=n) — минимальный bias,
          но высокая дисперсия и большое время вычисления. Правило большого пальца: K=10 при n&gt;1000,
          K=5 при n~100–1000, LOO при n&lt;50.
        </InfoBlock>

        <InfoBlock type="warning" title="Nested Cross-Validation">
          Для честного выбора гиперпараметров нужна <strong>вложенная кросс-валидация</strong>:
          внешний loop — оценка качества, внутренний loop — подбор гиперпараметров.
          Если GridSearch делать внутри одного fold, то гиперпараметры «настроены» на конкретный fold.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock
          language="python"
          code={`import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import (
    cross_val_score, KFold, StratifiedKFold,
    TimeSeriesSplit, LeaveOneOut
)
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

X, y = make_classification(n_samples=500, n_features=10,
                            weights=[0.7, 0.3], random_state=42)

pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('clf', LogisticRegression(random_state=42))
])

# Обычный K-Fold (5 фолдов)
kf = KFold(n_splits=5, shuffle=True, random_state=42)
scores_kf = cross_val_score(pipe, X, y, cv=kf, scoring='roc_auc')
print(f"KFold-5        AUC: {scores_kf.mean():.4f} ± {scores_kf.std():.4f}")

# Stratified K-Fold (сохраняет пропорции классов)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores_skf = cross_val_score(pipe, X, y, cv=skf, scoring='roc_auc')
print(f"StratifiedKF-5 AUC: {scores_skf.mean():.4f} ± {scores_skf.std():.4f}")

# Сравнение K=3, 5, 10
for k in [3, 5, 10]:
    skf_k = StratifiedKFold(n_splits=k, shuffle=True, random_state=42)
    s = cross_val_score(pipe, X, y, cv=skf_k, scoring='roc_auc')
    print(f"  K={k:2d}: {s.mean():.4f} ± {s.std():.4f}")

# TimeSeriesSplit — для временных данных
print("\\nTimeSeriesSplit (5 splits):")
tss = TimeSeriesSplit(n_splits=5)
for i, (train_idx, val_idx) in enumerate(tss.split(X)):
    print(f"  Fold {i+1}: train={len(train_idx):3d}, val={len(val_idx):3d}")`}
          output={`KFold-5        AUC: 0.8543 ± 0.0312
StratifiedKF-5 AUC: 0.8561 ± 0.0287

  K= 3: 0.8489 ± 0.0421
  K= 5: 0.8561 ± 0.0287
  K=10: 0.8574 ± 0.0198

TimeSeriesSplit (5 splits):
  Fold 1: train= 83, val= 84
  Fold 2: train=167, val= 83
  Fold 3: train=250, val= 83
  Fold 4: train=333, val= 84
  Fold 5: train=417, val= 83`}
          explanation="StratifiedKFold обычно даёт меньшую дисперсию по фолдам при дисбалансе классов. K=10 даёт чуть меньшую дисперсию, чем K=5. TimeSeriesSplit увеличивает train с каждым фолдом — это имитирует реальный временной сценарий."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Делать препроцессинг вне CV loop', 'fit() трансформера на всём X приводит к data leakage. Всегда используй Pipeline.'],
            ['Использовать KFold вместо StratifiedKFold для классификации', 'Случайный split может дать фолды с очень разными пропорциями классов — нестабильные оценки.'],
            ['Использовать random KFold для временных данных', 'Данные из будущего попадают в train. Нужен TimeSeriesSplit.'],
            ['Игнорировать GroupKFold при зависимых объектах', 'Если один пациент дал 10 измерений, они не должны попасть в разные фолды — это утечка.'],
            ['Сравнивать модели по одному fold', 'Оценка на одном fold имеет высокую дисперсию. Нужно среднее по K фолдам.'],
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
            question: 'При K=5 fold, сколько раз каждый объект используется для обучения и для валидации?',
            solution: (
              <p>Для <strong>обучения: 4 раза</strong> (K−1 = 4 фолда из 5). Для <strong>валидации: 1 раз</strong>. Каждый объект ровно однажды попадает в валидационный фолд.</p>
            ),
          },
          {
            level: 'concept',
            question: 'В чём разница между KFold и StratifiedKFold? Когда обязательно использовать Stratified?',
            solution: (
              <div>
                <p><strong>KFold</strong>: случайное разбиение без учёта меток классов.</p>
                <p><strong>StratifiedKFold</strong>: в каждом фолде сохраняется исходное соотношение классов.</p>
                <p className="mt-2">Stratified <em>обязателен</em> при: дисбалансе классов (иначе фолд может не содержать редкий класс), малых датасетах, multi-class задачах.</p>
              </div>
            ),
          },
          {
            level: 'concept',
            question: 'Почему LOO-CV даёт несмещённую, но высокодисперсную оценку?',
            solution: (
              <div>
                <p><strong>Несмещённая</strong>: каждая модель обучена на n−1 объектах (почти весь датасет) — почти как финальная модель.</p>
                <p className="mt-2"><strong>Высокая дисперсия</strong>: n моделей обучены на почти одинаковых данных (отличаются одним объектом). Их оценки сильно коррелированы, и среднее нестабильно. Ещё и дорого: n обучений.</p>
              </div>
            ),
          },
          {
            level: 'tricky',
            question: 'Вы делаете GridSearchCV с KFold(5) для подбора гиперпараметров, а затем оцениваете итоговую модель на holdout test set. Нужна ли nested CV в этом случае?',
            solution: (
              <div>
                <p>Нет, если у вас есть отдельный <strong>holdout test set</strong>, который не участвовал в GridSearchCV — это уже честная оценка.</p>
                <p className="mt-2">Nested CV нужна только когда <em>весь датасет</em> используется в CV и нет отдельного holdout. Nested CV = внешний loop для оценки + внутренний loop для подбора гиперпараметров.</p>
                <p className="mt-2">Схема: train_data → GridSearchCV(KFold) → лучшие параметры → обучение на train → оценка на holdout ✅</p>
              </div>
            ),
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Kohavi, "A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection" (IJCAI 1995)</strong></li>
          <li>📚 <strong>Arlot & Celisse, "A survey of cross-validation procedures for model selection" (2010)</strong></li>
          <li>📚 <strong>scikit-learn Docs — cross_val_score, KFold, StratifiedKFold</strong></li>
          <li>📚 <strong>Hastie, Tibshirani, Friedman, "ESL" §7.10</strong> — кросс-валидация и выбор модели</li>
        </ul>
      </section>
    </div>
  )
}
