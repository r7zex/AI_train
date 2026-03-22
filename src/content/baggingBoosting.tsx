import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function BaggingBoostingContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Bagging</strong> (Bootstrap AGGregating) обучает модели параллельно на случайных подвыборках и усредняет предсказания — снижает дисперсию (variance).
          <strong> Boosting</strong> обучает модели последовательно: каждая следующая исправляет ошибки предыдущей — снижает смещение (bias). Это принципиальное различие определяет свойства, риски переобучения и применимость.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Bagging</h2>
        <p className="text-gray-700 mb-3">Breiman (1996): создаём <Formula math="B"/> бутстрэп-подвыборок, обучаем по независимой модели на каждой, усредняем:</p>
        <div className="my-4 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\hat{f}(x) = \frac{1}{B}\sum_{b=1}^{B} f_b(x)" block/>
        </div>
        <p className="text-sm text-gray-600 mb-3">Для классификации — голосование большинством. <strong>Random Forest</strong> добавляет случайный выбор признаков при каждом разбиении (<Formula math="\sqrt{p}"/> для классификации), снижая корреляцию деревьев.</p>
        <InfoBlock type="intuition" title="Интуиция Bagging">Если взять B независимых оценок с дисперсией σ² и усреднить, дисперсия среднего = σ²/B. Смещение не меняется. Поэтому bagging помогает только если базовые модели имеют высокую дисперсию (глубокие деревья).</InfoBlock>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Boosting</h2>
        <h3 className="font-semibold text-gray-800 mb-2">AdaBoost</h3>
        <p className="text-gray-700 text-sm mb-3">Увеличивает веса объектов, на которых ошиблись предыдущие модели. Финальное предсказание — взвешенная сумма:</p>
        <div className="my-3 p-3 bg-gray-50 rounded-xl border text-center">
          <Formula math="F(x) = \text{sign}\!\left(\sum_{t=1}^{T} \alpha_t h_t(x)\right)" block/>
        </div>
        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Gradient Boosting (Friedman, 2001)</h3>
        <p className="text-gray-700 text-sm mb-3">Каждое следующее дерево обучается на псевдо-остатках — отрицательных градиентах функции потерь:</p>
        <div className="my-3 p-3 bg-gray-50 rounded-xl border text-center">
          <Formula math="F_m(x) = F_{m-1}(x) + \eta\, h_m(x)" block/>
        </div>
        <p className="text-xs text-gray-500">где <Formula math="\eta"/> — learning rate, <Formula math="h_m"/> — дерево на псевдо-остатках.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Сравнительная таблица</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
            <thead className="bg-gray-100"><tr>
              <th className="px-4 py-2 text-left">Свойство</th>
              <th className="px-4 py-2 text-center">Bagging</th>
              <th className="px-4 py-2 text-center">Boosting</th>
            </tr></thead>
            <tbody>
              {[
                ["Обучение моделей","Параллельное","Последовательное"],
                ["Зависимость моделей","Независимые","Зависимые"],
                ["Снижает","Variance","Bias"],
                ["Устойчивость к шуму","Высокая","Ниже (чувствителен к выбросам)"],
                ["Риск переобучения","Меньше","Выше при большом lr"],
                ["Скорость обучения","Быстрее (параллелизм)","Медленнее"],
                ["Примеры","Random Forest","XGBoost, LightGBM, AdaBoost"],
              ].map(([p,b,boost])=>(
                <tr key={p} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-700">{p}</td>
                  <td className="px-4 py-2 text-center text-green-700">{b}</td>
                  <td className="px-4 py-2 text-center text-blue-700">{boost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock language="python"
          code={`from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score
import numpy as np

X, y = make_classification(n_samples=500, n_features=10, n_informative=5, random_state=42)

models = {
    "Decision Tree":     DecisionTreeClassifier(random_state=42),
    "Random Forest":     RandomForestClassifier(n_estimators=50, random_state=42),
    "AdaBoost":          AdaBoostClassifier(n_estimators=50, random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=50, random_state=42),
}

for name, m in models.items():
    scores = cross_val_score(m, X, y, cv=5)
    print(f"{name:20s}: {scores.mean():.4f} ± {scores.std():.4f}")`}
          output={`Decision Tree       : 0.8220 ± 0.0298
Random Forest       : 0.8940 ± 0.0189
AdaBoost            : 0.8880 ± 0.0214
Gradient Boosting   : 0.9000 ± 0.0198`}
          explanation="Одиночное дерево показывает высокую дисперсию. Ансамбли стабильнее. Gradient Boosting часто даёт лучший результат на структурированных данных."
        />
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ["Bagging снижает bias","Нет. Bagging снижает только variance. Если базовая модель имеет высокое bias — bagging не поможет."],
            ["Чем больше деревьев в RF, тем лучше безгранично","У RF есть «плато» качества; после N деревьев добавление новых перестаёт помогать, но замедляет инференс."],
            ["Gradient Boosting не переобучается","Переобучается — особенно при высоком lr и большом числе деревьев без регуляризации."],
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
          {level:"concept",question:"Почему bagging снижает variance, а не bias? Что происходит при усреднении B независимых оценок?",
           solution:<p>Дисперсия среднего из B независимых оценок: σ²/B → variance падает. Смещение среднего = смещению каждой оценки → bias не меняется.</p>},
          {level:"concept",question:"Почему gradient boosting чувствителен к выбросам сильнее, чем Random Forest?",
           solution:<p>Gradient Boosting обучает каждое дерево на остатках предыдущих. Выброс с большой ошибкой будет привлекать внимание каждой следующей итерации. RF усредняет независимые деревья — влияние одного выброса ограничено.</p>},
          {level:"basic",question:"Какая доля объектов попадает в одну bootstrap-подвыборку (OOB)? Какая остаётся 'за бортом'?",
           solution:<p>P(объект не попал) = (1-1/N)^N → 1/e ≈ 0.368 при больших N. Т.е. ~63.2% объектов в каждой подвыборке, ~36.8% — OOB.</p>},
          {level:"tricky",question:"Можно ли применять boosting для задач с сильным шумом в метках? Почему?",
           solution:<p>Это опасно. Boosting последовательно «фокусируется» на трудных примерах, а объекты с шумными метками выглядят как «трудные». Результат — переобучение на шум. Bagging здесь надёжнее.</p>},
        ]}/>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>📚 <strong>Breiman, "Bagging Predictors" (1996)</strong> — оригинальная статья bagging</li>
          <li>📚 <strong>Friedman, "Greedy Function Approximation: A Gradient Boosting Machine" (2001)</strong></li>
          <li>📚 <strong>ESL §10, §15 (Hastie, Tibshirani, Friedman)</strong> — теория бустинга и RF</li>
          <li>📚 <strong>scikit-learn User Guide: Ensemble Methods</strong></li>
        </ul>
      </section>
    </div>
  )
}
