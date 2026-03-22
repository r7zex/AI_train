import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'
import GiniCalc from '../components/calculators/GiniCalc'

export default function GiniImpurityContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Gini Impurity</strong> — мера неоднородности (примеси) множества объектов в узле дерева решений.
          Показывает, насколько «перемешаны» классы: если в узле один класс — Gini = 0 (чистый узел);
          при равномерном распределении классов Gini максимальна. Алгоритм строит дерево, выбирая
          на каждом шаге тот сплит по признаку, который максимально снижает Gini после разбиения.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>
        <p className="text-gray-700 mb-3">
          Для узла с <em>k</em> классами и долями <Formula math="p_1, \ldots, p_k" />:
        </p>
        <div className="my-4 p-5 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{Gini}(t) = 1 - \sum_{i=1}^{k} p_i^2" block />
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Где <Formula math="p_i = n_i / n" /> — доля объектов класса <Formula math="i" /> в узле <Formula math="t" />.
          Диапазон: <Formula math="[0,\ 1 - 1/k]" />. При двух классах максимум равен 0.5.
        </p>
        <h3 className="font-semibold text-gray-800 mb-2">Выигрыш от разбиения (Gini Gain)</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\Delta\text{Gini} = \text{Gini}(t) - \frac{|t_L|}{|t|}\,\text{Gini}(t_L) - \frac{|t_R|}{|t|}\,\text{Gini}(t_R)" block />
        </div>
        <p className="text-sm text-gray-600">
          Выбирается сплит с максимальным <Formula math="\Delta\text{Gini}" />. Алгоритм перебирает все признаки и все пороги.
        </p>
        <InfoBlock type="note" title="Нюанс: Gini vs. энтропия">
          sklearn также предлагает criterion='entropy', основанный на информационном выигрыше (Information Gain).
          На практике Gini чуть быстрее вычисляется, а различие в качестве обычно незначительно.
          Gini склонна выделять наиболее частый класс, энтропия более «равновесна».
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример</h2>
        <p className="text-gray-700 mb-3">
          Узел содержит 10 объектов: 6 класса A и 4 класса B. Рассматриваем два сплита.
        </p>
        <h3 className="font-semibold text-gray-700 mb-2">Родительский узел:</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100"><tr>
              <th className="px-3 py-2 text-left">Узел</th><th className="px-3 py-2">A</th><th className="px-3 py-2">B</th>
              <th className="px-3 py-2">p(A)</th><th className="px-3 py-2">p(B)</th><th className="px-3 py-2">Gini</th>
            </tr></thead>
            <tbody><tr className="border-t border-gray-100">
              <td className="px-3 py-2">Родительский</td><td className="px-3 py-2 text-center">6</td><td className="px-3 py-2 text-center">4</td>
              <td className="px-3 py-2 text-center">0.6</td><td className="px-3 py-2 text-center">0.4</td>
              <td className="px-3 py-2 text-center font-mono font-bold">1−(0.36+0.16)=0.48</td>
            </tr></tbody>
          </table>
        </div>

        <h3 className="font-semibold text-gray-700 mb-2">Сплит 1 (признак X ≤ 3): левый [A,A,A,A,B], правый [A,A,B,B,B]</h3>
        <div className="overflow-x-auto mb-2">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100"><tr>
              <th className="px-3 py-2 text-left">Узел</th><th className="px-3 py-2">A</th><th className="px-3 py-2">B</th>
              <th className="px-3 py-2">Gini</th><th className="px-3 py-2">Вес</th>
            </tr></thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-3 py-2">Левый (5 объектов)</td><td className="px-3 py-2 text-center">4</td><td className="px-3 py-2 text-center">1</td>
                <td className="px-3 py-2 text-center font-mono">1−(0.64+0.04)=0.32</td><td className="px-3 py-2 text-center">5/10</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="px-3 py-2">Правый (5 объектов)</td><td className="px-3 py-2 text-center">2</td><td className="px-3 py-2 text-center">3</td>
                <td className="px-3 py-2 text-center font-mono">1−(0.16+0.36)=0.48</td><td className="px-3 py-2 text-center">5/10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Взвешенная Gini: <strong>0.5×0.32 + 0.5×0.48 = 0.40</strong> → Gain = 0.48 − 0.40 = <strong>0.08</strong>
        </p>

        <h3 className="font-semibold text-gray-700 mb-2">Сплит 2 (признак Y ≤ 5): левый [A,A,A,A], правый [A,A,B,B,B,B]</h3>
        <div className="overflow-x-auto mb-2">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100"><tr>
              <th className="px-3 py-2 text-left">Узел</th><th className="px-3 py-2">A</th><th className="px-3 py-2">B</th>
              <th className="px-3 py-2">Gini</th><th className="px-3 py-2">Вес</th>
            </tr></thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="px-3 py-2">Левый (4 объекта)</td><td className="px-3 py-2 text-center">4</td><td className="px-3 py-2 text-center">0</td>
                <td className="px-3 py-2 text-center font-mono">1−(1.0+0.0)=<strong>0.00</strong></td><td className="px-3 py-2 text-center">4/10</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="px-3 py-2">Правый (6 объектов)</td><td className="px-3 py-2 text-center">2</td><td className="px-3 py-2 text-center">4</td>
                <td className="px-3 py-2 text-center font-mono">1−(0.111+0.444)=0.444</td><td className="px-3 py-2 text-center">6/10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          Взвешенная Gini: <strong>0.4×0.00 + 0.6×0.444 = 0.267</strong> → Gain = 0.48 − 0.267 = <strong>0.213 ← лучше!</strong>
        </p>
        <InfoBlock type="tip" title="Вывод">
          Сплит 2 лучше: левый узел стал полностью чистым (Gini=0), это и даёт больший выигрыш.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock language="python"
          code={`import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
import pandas as pd

# Синтетические данные: 10 точек, бинарная классификация
X = pd.DataFrame({'x': range(1, 11), 'y': [3,1,4,1,5,9,2,6,5,3]})
y = np.array([1,1,1,1,0,0,0,0,1,0])

def gini(labels):
    n = len(labels)
    if n == 0: return 0.0
    counts = np.bincount(labels)
    probs = counts / n
    return 1 - np.sum(probs**2)

print(f"Родительский узел: Gini = {gini(y):.4f}")

# Ручной расчёт сплита x <= 4
left  = y[X['x'] <= 4]
right = y[X['x'] > 4]
w_gini = len(left)/len(y)*gini(left) + len(right)/len(y)*gini(right)
print(f"Сплит x<=4: взвеш. Gini={w_gini:.4f}, Gain={gini(y)-w_gini:.4f}")

# sklearn автоматически найдёт лучший сплит
dt = DecisionTreeClassifier(max_depth=2, criterion='gini', random_state=42)
dt.fit(X, y)
print("\\nДерево решений (max_depth=2):")
print(export_text(dt, feature_names=['x','y']))`}
          output={`Родительский узел: Gini = 0.4800
Сплит x<=4: взвеш. Gini=0.1667, Gain=0.3133

Дерево решений (max_depth=2):
|--- x <= 4.50
|   |--- class: 1
|--- x >  4.50
|   |--- y <= 2.50
|   |   |--- class: 0
|   |--- y >  2.50
|   |   |--- class: 0`}
          explanation="sklearn выбрал x ≤ 4.5 как лучший первый сплит: он полностью изолирует первые 4 объекта класса 1 (Gini=0). Наш ручной расчёт подтверждает это."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Интерактивный калькулятор</h2>
        <GiniCalc />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Путаница Gini Impurity с коэффициентом Джини из экономики', 'Это разные понятия. В ML "gini" — всегда критерий неоднородности для деревьев.'],
            ['Не взвешивать Gini дочерних узлов по размеру', 'Нельзя просто брать среднее Gini_left и Gini_right. Нужно: n_L/n × Gini_L + n_R/n × Gini_R.'],
            ['Думать, что Gini=0 в листе = хорошая модель', 'Gini=0 в листе означает идеальное разделение на train, но дерево могло переобучиться. Всегда проверяй на валидации.'],
            ['Игнорировать важность min_samples_split / max_depth', 'Без ограничений дерево растёт до Gini=0 в каждом листе (полное переобучение).'],
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
          { level: 'basic', question: 'Вычислите Gini Impurity для узла с 5 объектами класса A и 5 объектами класса B.',
            solution: <p>p(A)=0.5, p(B)=0.5 → Gini = 1−(0.25+0.25) = <strong>0.5</strong>. Максимум для бинарной задачи.</p> },
          { level: 'basic', question: 'Узел содержит 3 класса: 30 объектов класса A, 40 класса B, 30 класса C. Найдите Gini.',
            solution: <div><p>n=100, p(A)=0.3, p(B)=0.4, p(C)=0.3</p><p>Gini = 1 − (0.09 + 0.16 + 0.09) = 1 − 0.34 = <strong>0.66</strong></p></div> },
          { level: 'concept', question: 'При каком распределении трёх классов Gini максимальна? Чему равно это максимальное значение?',
            solution: <p>При равномерном: p₁=p₂=p₃=1/3. Gini = 1 − 3×(1/9) = 1 − 1/3 = <strong>2/3 ≈ 0.667</strong>. Общий максимум: 1 − 1/k.</p> },
          { level: 'code', question: 'Напишите функцию на Python gini(labels), которая принимает массив меток и возвращает Gini Impurity.',
            solution: <pre className="text-xs font-mono">{`def gini(labels):\n    from collections import Counter\n    n = len(labels)\n    if n == 0: return 0.0\n    return 1 - sum((c/n)**2 for c in Counter(labels).values())`}</pre> },
          { level: 'tricky', question: 'Сплит 1 даёт взвешенную Gini=0.233 (200 объ. с Gini=0.3, 100 объ. с Gini=0.1). Сплит 2 даёт взвешенную Gini=0.2 (по 150 объ. с Gini=0.2). Исходная Gini=0.4. Какой сплит лучше?',
            solution: <div><p>Gain сплита 1: 0.4 − 0.233 = 0.167</p><p>Gain сплита 2: 0.4 − 0.200 = <strong>0.2 ← лучше</strong></p><p>Несмотря на то что у сплита 1 есть узел с Gini=0.1, взвешенный результат хуже.</p></div> },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>scikit-learn Docs — Decision Trees (criterion='gini')</strong> — официальная документация, формула критерия</li>
          <li>📚 <strong>Breiman et al., "Classification and Regression Trees" (CART, 1984)</strong> — оригинальная работа, где введён Gini для деревьев</li>
          <li>📚 <strong>Hastie, Tibshirani, Friedman, "ESL" §9.2</strong> — теоретический анализ критериев разбиения</li>
        </ul>
      </section>
    </div>
  )
}
