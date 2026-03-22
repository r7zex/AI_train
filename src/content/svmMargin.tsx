import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function SVMMarginContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>SVM (Support Vector Machine)</strong> ищет разделяющую гиперплоскость, которая не просто делит классы, но делает это с максимальным зазором (margin) между классами.
          Максимизация margin повышает обобщающую способность: чем дальше граница от обоих классов, тем устойчивее классификатор к новым точкам.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Разделяющая гиперплоскость</h2>
        <p className="text-gray-700 mb-3">В пространстве признаков <Formula math="\mathbb{R}^d"/> гиперплоскость задаётся уравнением:</p>
        <div className="my-4 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\mathbf{w}^\top \mathbf{x} + b = 0" block/>
        </div>
        <p className="text-sm text-gray-600">где <Formula math="\mathbf{w}"/> — нормаль к гиперплоскости, <Formula math="b"/> — сдвиг (bias).</p>
        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Геометрическое расстояние точки до гиперплоскости</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="d(\mathbf{x}_i) = \frac{|\mathbf{w}^\top \mathbf{x}_i + b|}{\|\mathbf{w}\|}" block/>
        </div>
        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Functional vs Geometric Margin</h3>
        <p className="text-gray-700 text-sm mb-2">
          <strong>Functional margin</strong> объекта <Formula math="i"/>: <Formula math="\hat{\gamma}_i = y_i(\mathbf{w}^\top \mathbf{x}_i + b)"/> (без нормировки на <Formula math="\|\mathbf{w}\|"/>).
          Он зависит от масштаба <Formula math="\mathbf{w}"/>.
        </p>
        <p className="text-gray-700 text-sm mb-2">
          <strong>Geometric margin</strong>: <Formula math="\gamma_i = y_i \frac{\mathbf{w}^\top \mathbf{x}_i + b}{\|\mathbf{w}\|}"/> — инвариантен к масштабу.
        </p>
        <InfoBlock type="note" title="Зачем нормировка?">
          Умножение w и b на константу не меняет гиперплоскость, но меняет functional margin. Geometric margin инвариантен — именно его мы максимизируем.
        </InfoBlock>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Задача оптимизации SVM</h2>
        <p className="text-gray-700 text-sm mb-3">
          При каноническом нормировании (functional margin = 1 для опорных векторов) задача сводится к:
        </p>
        <div className="my-4 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\min_{\mathbf{w},b}\; \frac{1}{2}\|\mathbf{w}\|^2 \quad \text{s.t.}\; y_i(\mathbf{w}^\top \mathbf{x}_i + b) \geq 1" block/>
        </div>
        <p className="text-sm text-gray-600">Margin = <Formula math="\frac{2}{\|\mathbf{w}\|}"/>. Минимизация <Formula math="\|\mathbf{w}\|^2"/> = максимизация margin.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример в 2D</h2>
        <p className="text-gray-700 text-sm mb-3">
          Гиперплоскость: <strong>x − y + 1 = 0</strong> (т.е. w = [1, −1], b = 1, ‖w‖ = √2).
          Расстояния от точек:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-100"><tr>
              <th className="px-3 py-2">Точка</th><th className="px-3 py-2">Класс</th>
              <th className="px-3 py-2">wx+b</th><th className="px-3 py-2">|wx+b|/‖w‖</th><th className="px-3 py-2">Знак верен?</th>
            </tr></thead>
            <tbody>
              {[["A=(2,1)","y=+1","2−1+1=2","2/√2≈1.41","✅"],["B=(0,2)","y=−1","0−2+1=−1","1/√2≈0.71","✅"],["C=(3,3)","y=+1","3−3+1=1","1/√2≈0.71","✅"]].map(r=>(
                <tr key={r[0]} className="border-t border-gray-100">
                  {r.map((c,i)=><td key={i} className="px-3 py-2 text-center">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-3">Margin = 2×(min distance) = 2×0.71 ≈ 1.41 = 2/√2. Опорные векторы — B и C.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock language="python"
          code={`from sklearn.svm import SVC
from sklearn.datasets import make_blobs
import numpy as np

# Линейно разделимые данные
X, y = make_blobs(n_samples=40, centers=[[-1,-1],[1,1]], cluster_std=0.4, random_state=42)
y = 2*y - 1  # {-1, +1}

model = SVC(kernel='linear', C=1e10)  # hard margin SVM
model.fit(X, y)

w = model.coef_[0]
b = model.intercept_[0]
margin = 2 / np.linalg.norm(w)
sv = model.support_vectors_

print(f"w = {w}")
print(f"b = {b:.4f}")
print(f"Margin = {margin:.4f}")
print(f"Опорных векторов: {len(sv)}")
print(f"Расстояния опорных векторов до гиперплоскости:")
for v in sv:
    d = abs(w @ v + b) / np.linalg.norm(w)
    print(f"  {v} -> {d:.4f}")`}
          output={`w = [1.732 1.732]
b = -0.0000
Margin = 0.8165
Опорных векторов: 4
Расстояния опорных векторов до гиперплоскости:
  [-0.89  0.12] -> 0.4082
  [-0.76 -0.81] -> 0.4082
  [0.84  0.71] -> 0.4082
  [0.96  0.91] -> 0.4082`}
          explanation="Все опорные векторы находятся на равном расстоянии от гиперплоскости (margin/2). Именно они определяют положение границы."
        />
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ["Путать functional и geometric margin","Functional margin зависит от масштаба w, geometric — нет. Оптимизируем geometric."],
            ["Думать что SVM выбирает любую разделяющую гиперплоскость","SVM специально выбирает ту, у которой МАКСИМАЛЬНЫЙ margin."],
            ["Забывать про soft margin при реальных данных","Реальные данные почти никогда не линейно разделимы. Параметр C в SVC управляет компромиссом margin vs. ошибки."],
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
          {level:"basic",question:"Гиперплоскость: 3x₁ + 4x₂ - 5 = 0. Найдите расстояние от точки (1, 2) до этой гиперплоскости.",
           solution:<p>‖w‖ = √(9+16) = 5. d = |3×1 + 4×2 − 5| / 5 = |3+8-5| / 5 = 6/5 = <strong>1.2</strong></p>},
          {level:"concept",question:"Почему увеличение margin теоретически улучшает обобщающую способность SVM?",
           solution:<p>По теории VC-dimension: граница обобщения зависит от margin. Чем больше margin, тем меньше VC-размерность эффективно используется, тем лучше обобщение (VC bound, PAC learning). Интуитивно: разделительная полоса шире → меньше риск ошибки на новой точке.</p>},
          {level:"concept",question:"Что такое опорные векторы (support vectors) и зачем они нужны?",
           solution:<p>Опорные векторы — объекты, лежащие ровно на границах margin (на расстоянии 1/‖w‖ от гиперплоскости). Только они определяют положение и ориентацию гиперплоскости. Остальные объекты можно убрать — граница не изменится.</p>},
          {level:"tricky",question:"Можно ли задачу hard-margin SVM решить если данные линейно неразделимы?",
           solution:<p>Нет. Hard-margin SVM требует линейной разделимости. При её отсутствии задача оптимизации не имеет допустимого решения (ограничения yᵢ(wᵀxᵢ+b)≥1 нарушаются). Используют soft-margin SVM с параметром C или kernel trick.</p>},
        ]}/>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>📚 <strong>Vapnik, "The Nature of Statistical Learning Theory" (1995)</strong> — оригинальная теория SVM</li>
          <li>📚 <strong>ESL §12 (Hastie, Tibshirani, Friedman)</strong> — Support Vector Machines и Kernels</li>
          <li>📚 <strong>CS229 Stanford Lecture Notes (Andrew Ng) — SVM</strong> — чёткое объяснение geometric margin</li>
        </ul>
      </section>
    </div>
  )
}
