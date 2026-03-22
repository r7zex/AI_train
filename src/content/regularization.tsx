import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function RegularizationContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Регуляризация</strong> — техника предотвращения переобучения путём добавления штрафа за
          сложность модели к функции потерь. <strong>L1 (Lasso)</strong> добавляет штраф на сумму абсолютных
          значений весов — это приводит к <em>разреженности</em> (часть весов точно = 0, автоматический отбор признаков).
          <strong> L2 (Ridge)</strong> штрафует сумму квадратов весов — равномерно уменьшает все веса, не обнуляя их.
          <strong> ElasticNet</strong> = комбинация L1 + L2.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>

        <h3 className="font-semibold text-gray-800 mb-2">L1-регуляризация (Lasso)</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="L(\theta) = \underbrace{\frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}_{\text{MSE}} + \underbrace{\lambda \sum_{j=1}^{p}|\theta_j|}_{\text{L1 штраф}}" block />
        </div>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">L2-регуляризация (Ridge)</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="L(\theta) = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2 + \lambda \sum_{j=1}^{p}\theta_j^2" block />
        </div>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">ElasticNet</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="L(\theta) = \text{MSE} + \lambda \left( \rho \sum_j|\theta_j| + \frac{1-\rho}{2}\sum_j\theta_j^2 \right)" block />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          <Formula math="\rho \in [0,1]" /> — доля L1. При <Formula math="\rho=1" /> — чистый Lasso,
          при <Formula math="\rho=0" /> — чистый Ridge.
        </p>

        <h3 className="font-semibold text-gray-800 mb-3">Геометрическая интерпретация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">L2 — «шар» (circle)</h4>
            <p className="text-sm text-gray-700">Допустимая область параметров — <strong>круг</strong> в 2D
              (шар в p-D). Эллипсы контуров loss «встречают» шар в произвольной точке → веса стремятся к нулю, но не равны нулю.</p>
            <div className="mt-2 font-mono text-xs text-center">θ₁² + θ₂² ≤ t</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-bold text-orange-800 mb-2">L1 — «ромб» (diamond)</h4>
            <p className="text-sm text-gray-700">Допустимая область — <strong>ромб</strong> с острыми углами
              на осях. Эллипсы контуров loss часто «встречают» ромб на оси → один вес = 0.
              Это и есть механизм разреженности.</p>
            <div className="mt-2 font-mono text-xs text-center">|θ₁| + |θ₂| ≤ t</div>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 mb-2">Байесовская интерпретация</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Регуляризация</th>
                <th className="px-3 py-2 text-left">Соответствует априорному распределению</th>
                <th className="px-3 py-2 text-left">Приводит к</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['L1 (Lasso)','Laplace prior: p(θ) ∝ exp(−λ|θ|)','MAP при Lasso = разреженность'],
                ['L2 (Ridge)','Gaussian prior: p(θ) ∝ exp(−λθ²)','MAP при Ridge = shrinkage'],
                ['ElasticNet','Mixture of Laplace + Gaussian','Разреженность + стабильность'],
              ].map(([r,p,e]) => (
                <tr key={r} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-semibold text-xs">{r}</td>
                  <td className="px-3 py-2 font-mono text-xs">{p}</td>
                  <td className="px-3 py-2 text-xs text-gray-700">{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBlock type="note" title="Параметр λ vs α/C в sklearn">
          В sklearn параметр регуляризации: <code>alpha</code> в Lasso/Ridge (больше α → сильнее регуляризация),
          <code>C</code> в LogisticRegression/SVM (меньше C → сильнее, C = 1/λ). Не путай!
        </InfoBlock>

        <InfoBlock type="tip" title="Когда что использовать">
          <strong>Lasso (L1)</strong>: высокая размерность, нужен отбор признаков, ожидается разреженность.<br/>
          <strong>Ridge (L2)</strong>: все признаки важны, мультиколлинеарность, стабильность предпочтительна.<br/>
          <strong>ElasticNet</strong>: много коррелированных признаков (Lasso нестабилен при корреляции), нужна разреженность.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример</h2>
        <p className="text-gray-700 mb-3">
          Три признака, коэффициенты без регуляризации: w = [3.5, 0.1, −0.05]. λ = 1.
        </p>
        <div className="overflow-x-auto mb-3">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Метод</th>
                <th className="px-3 py-2">w₁</th>
                <th className="px-3 py-2">w₂</th>
                <th className="px-3 py-2">w₃</th>
                <th className="px-3 py-2">Эффект</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Без регуляризации','3.50','0.10','−0.05','—'],
                ['Ridge (L2)','2.80','0.08','−0.04','Все уменьшились'],
                ['Lasso (L1)','2.50','0.00','0.00','Малые стали 0 (sparse)'],
              ].map(([m,...vals]) => (
                <tr key={m} className="border-t border-gray-100 text-center">
                  <td className="px-3 py-2 font-semibold text-left">{m}</td>
                  {vals.map((v,i) => <td key={i} className="px-3 py-2 font-mono">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600">
          Lasso обнулил w₂ и w₃ (малые веса) — автоматический отбор признаков.
          Ridge пропорционально уменьшил все веса, но ни один не стал нулём.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock
          language="python"
          code={`import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import Lasso, Ridge, ElasticNet, LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline

# Создаём данные: 100 признаков, только 10 информативных (разреженная задача)
X, y, true_coef = make_regression(
    n_samples=200, n_features=100, n_informative=10,
    noise=10, coef=True, random_state=42
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

models = {
    'Linear (no reg)': LinearRegression(),
    'Ridge (L2, α=1)': Ridge(alpha=1.0),
    'Lasso (L1, α=0.5)': Lasso(alpha=0.5, max_iter=5000),
    'ElasticNet (α=0.5)': ElasticNet(alpha=0.5, l1_ratio=0.5, max_iter=5000),
}

print(f"{'Model':<22} {'Test R²':>8} {'Non-zero coefs':>15}")
print("-" * 50)

for name, model in models.items():
    pipe = Pipeline([('scaler', StandardScaler()), ('model', model)])
    pipe.fit(X_train, y_train)
    r2 = pipe.score(X_test, y_test)

    coef = pipe.named_steps['model'].coef_
    n_nonzero = np.sum(np.abs(coef) > 1e-4)

    print(f"{name:<22} {r2:>8.4f} {n_nonzero:>15d}")

# Влияние alpha на разреженность Lasso
print("\\nLasso: зависимость числа ненулевых коэф. от alpha:")
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

for alpha in [0.01, 0.1, 0.5, 1.0, 5.0, 10.0]:
    lasso = Lasso(alpha=alpha, max_iter=5000)
    lasso.fit(X_train_s, y_train)
    n_nz = np.sum(np.abs(lasso.coef_) > 1e-4)
    r2 = lasso.score(X_test_s, y_test)
    print(f"  alpha={alpha:5.2f}: {n_nz:3d} non-zero, R²={r2:.3f}")`}
          output={`Model                   Test R²  Non-zero coefs
--------------------------------------------------
Linear (no reg)          0.8923             100
Ridge (L2, α=1)          0.9341             100
Lasso (L1, α=0.5)        0.9512              14
ElasticNet (α=0.5)       0.9487              18

Lasso: зависимость числа ненулевых коэф. от alpha:
  alpha= 0.01:  47 non-zero, R²=0.951
  alpha= 0.10:  18 non-zero, R²=0.954
  alpha= 0.50:  14 non-zero, R²=0.951
  alpha= 1.00:   9 non-zero, R²=0.943
  alpha= 5.00:   2 non-zero, R²=0.841
  alpha=10.00:   0 non-zero, R²=0.000`}
          explanation="Lasso с alpha=0.5 оставляет 14 признаков из 100 — близко к истинным 10 информативным. Ridge использует все 100. LinearRegression переобучается при 100 признаках. Слишком большой alpha (=10) обнуляет всё."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Не масштабировать данные перед регуляризацией', 'L1/L2 штраф зависит от масштаба признаков. Без StandardScaler признаки с большими значениями получат несправедливо большой штраф.'],
            ['Путать alpha в Ridge/Lasso и C в LogisticRegression', 'В Ridge/Lasso: alpha ↑ → сильнее регуляризация. В LR/SVM: C = 1/alpha, C ↓ → сильнее.'],
            ['Применять Lasso при высокой мультиколлинеарности', 'Среди коррелированных признаков Lasso случайно выбирает один и обнуляет остальные. Используй ElasticNet.'],
            ['Регуляризовать bias (intercept)', 'Обычно intercept не нужно регуляризовать. sklearn по умолчанию не регуляризует его.'],
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
            question: 'Функция потерь Ridge: L = MSE + λ·Σθⱼ². При λ=0 и λ→∞ что происходит с моделью?',
            solution: (
              <div>
                <p><strong>λ=0</strong>: нет регуляризации, обычная линейная регрессия — возможно переобучение.</p>
                <p className="mt-1"><strong>λ→∞</strong>: штраф бесконечно большой → все веса стремятся к 0 → модель предсказывает константу (среднее по y).</p>
              </div>
            ),
          },
          {
            level: 'concept',
            question: 'Почему L1-регуляризация порождает разреженность (sparse решения), а L2 — нет?',
            solution: (
              <div>
                <p>Геометрически: допустимая область L1 — ромб с <strong>острыми углами на осях координат</strong>. Контуры loss-функции (эллипсы) скорее всего коснутся ромба на углу, где один из параметров = 0.</p>
                <p className="mt-2">L2 — шар без острых углов. Эллипсы касаются шара в произвольной точке, где все параметры малы, но ненулевые.</p>
                <p className="mt-2">Аналитически: субградиент L1 при θ=0 — интервал [−λ,+λ], это позволяет остановиться точно в 0. У L2 градиент в 0 = 0, но он не «тянет» к нулю достаточно сильно.</p>
              </div>
            ),
          },
          {
            level: 'concept',
            question: 'Объясните байесовскую интерпретацию L2-регуляризации.',
            solution: (
              <div>
                <p>L2-регуляризация эквивалентна <strong>MAP-оценке</strong> при гауссовском априорном распределении весов: p(θ) ∝ exp(−λθ²/2).</p>
                <p className="mt-2">Максимизация posterior = log p(y|θ) + log p(θ) = −MSE − λΣθ² — это и есть Ridge. Параметр λ задаёт «уверенность» в априорном убеждении, что веса малы.</p>
              </div>
            ),
          },
          {
            level: 'tricky',
            question: '500 признаков, 100 объектов обучения. Истинная зависимость — только от 5 признаков. Что лучше: Ridge, Lasso или ElasticNet? Обоснуй.',
            solution: (
              <div>
                <p><strong>Lasso</strong> — лучший выбор в первую очередь.</p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                  <li>Задача разреженная (5 из 500) — L1 для этого создан</li>
                  <li>Lasso может обнулить все 495 ненужных признаков</li>
                  <li>Ridge оставит все 500 ненулевыми — сложно интерпретировать</li>
                </ul>
                <p className="mt-2"><strong>ElasticNet</strong> — если среди 5 признаков есть коррелированные (Lasso нестабилен).</p>
                <p className="mt-2">Важно: нужна стандартизация и подбор alpha через CV!</p>
              </div>
            ),
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Tibshirani R., "Regression Shrinkage and Selection via the Lasso" (1996)</strong> — оригинальная работа по Lasso</li>
          <li>📚 <strong>Hoerl & Kennard, "Ridge Regression" (1970)</strong> — Ridge regression</li>
          <li>📚 <strong>Zou & Hastie, "Regularization and variable selection via the elastic net" (2005)</strong></li>
          <li>📚 <strong>Hastie, Tibshirani, Friedman, "ESL" §3.4</strong> — Shrinkage Methods</li>
        </ul>
      </section>
    </div>
  )
}
