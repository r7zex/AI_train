import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function BoostingComparisonContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>XGBoost, LightGBM и CatBoost</strong> — три самых популярных градиентных бустинга,
          каждый со своими архитектурными решениями. <strong>XGBoost</strong> (2014) — пионер, level-wise рост деревьев,
          точная оптимизация. <strong>LightGBM</strong> (Microsoft, 2017) — leaf-wise рост, GOSS/EFB,
          значительно быстрее на больших данных. <strong>CatBoost</strong> (Yandex, 2018) — симметричные деревья,
          ordered boosting для нативной обработки категорийных признаков без утечки.
          Все три выигрывают Kaggle соревнования и используются в production.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Архитектурные различия</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Стратегии роста деревьев</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">XGBoost — Level-wise</h4>
            <pre className="text-xs font-mono text-blue-900">{`Уровень 1:    [root]
             /     \\
Уровень 2: [L]     [R]
           / \\     / \\
Уровень 3: ● ●   ● ●`}</pre>
            <p className="text-xs text-gray-700 mt-2">Растёт по уровням. Сбалансированное дерево, меньше переобучения, но медленнее.</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">LightGBM — Leaf-wise</h4>
            <pre className="text-xs font-mono text-green-900">{`[root]
 / \\
●  [L]
    / \\
   ●  [LL]
       / \\
      ●   ●`}</pre>
            <p className="text-xs text-gray-700 mt-2">Растёт лучший лист. Меньше деревьев для той же точности, риск переобучения на малых данных.</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-bold text-orange-800 mb-2">CatBoost — Symmetric</h4>
            <pre className="text-xs font-mono text-orange-900">{`      [root: x<3]
      /           \\
 [x<3, y<5]   [x≥3, y<5]
   /    \\       /     \\
  ●      ●     ●       ●`}</pre>
            <p className="text-xs text-gray-700 mt-2">Одинаковое условие на каждом уровне. Быстрый инференс, меньше параметров.</p>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 mb-2">Сравнительная таблица</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Характеристика</th>
                <th className="px-3 py-2 text-center text-blue-700">XGBoost</th>
                <th className="px-3 py-2 text-center text-green-700">LightGBM</th>
                <th className="px-3 py-2 text-center text-orange-700">CatBoost</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Рост деревьев','Level-wise','Leaf-wise','Symmetric'],
                ['Скорость обучения','Средняя','Высокая ⚡','Средняя'],
                ['Память','Средняя','Низкая','Средняя'],
                ['Категорийные признаки','Нет (нужен encoding)','Нативно (basic)','Нативно (ordered boosting)'],
                ['Переобучение (риск)','Низкий','Средний','Низкий'],
                ['Инференс (скорость)','Средняя','Быстрый','Очень быстрый (симметр.)'],
                ['GPU поддержка','Да','Да','Да'],
                ['Малые данные (<1k)','Хорошо','Плохо','Хорошо'],
                ['Большие данные (>1M)','Медленно','Отлично','Хорошо'],
                ['Настройка (простота)','Умеренная','Умеренная','Простая (мало параметров)'],
                ['Missing values','Авто (sparsity aware)','Авто','Авто'],
                ['Основные параметры','max_depth, eta','num_leaves, lr','depth, lr'],
              ].map(([f,...vals]) => (
                <tr key={f} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-semibold">{f}</td>
                  {vals.map((v,i) => <td key={i} className="px-3 py-2 text-center text-gray-700">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold text-gray-800 mb-2">Ordered Boosting (CatBoost)</h3>
        <p className="text-gray-700 text-sm mb-3">
          Главная инновация CatBoost: при вычислении target statistics для категорийных признаков
          используются только <em>предыдущие</em> в случайной перестановке объекты (как в online learning).
          Это предотвращает утечку целевой переменной — проблему, которая возникает при обычном target encoding.
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\hat{x}_{i,k} = \frac{\sum_{j < i} \mathbf{1}[x_{j,k} = x_{i,k}] \cdot y_j + a \cdot p}{\sum_{j < i} \mathbf{1}[x_{j,k} = x_{i,k}] + a}" block />
        </div>
        <p className="text-sm text-gray-600">
          Где <Formula math="a" /> — prior strength, <Formula math="p" /> — global prior (среднее по train).
          Объект <Formula math="i" /> использует только объекты <Formula math="j < i" /> в текущей перестановке.
        </p>

        <InfoBlock type="note" title="GOSS и EFB в LightGBM">
          <strong>GOSS</strong> (Gradient-based One-Side Sampling): сохраняет объекты с большими градиентами
          (важны для обучения) и случайно сэмплирует малоградиентные → меньше данных, та же точность.<br/>
          <strong>EFB</strong> (Exclusive Feature Bundling): объединяет взаимоисключающие признаки в пучки →
          меньше фичей, быстрее построение гистограмм.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock
          language="python"
          code={`import numpy as np
import time
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# Данные
X, y = make_classification(n_samples=50000, n_features=50,
                            n_informative=15, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

results = {}

# --- XGBoost ---
try:
    import xgboost as xgb
    t0 = time.time()
    xgb_model = xgb.XGBClassifier(
        n_estimators=300, max_depth=6, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8,
        eval_metric='logloss', random_state=42,
        use_label_encoder=False, verbosity=0
    )
    xgb_model.fit(X_train, y_train)
    t = time.time() - t0
    auc = roc_auc_score(y_test, xgb_model.predict_proba(X_test)[:, 1])
    results['XGBoost'] = (auc, t)
    print(f"XGBoost  | AUC: {auc:.4f} | Time: {t:.2f}s")
except ImportError:
    print("XGBoost not installed: pip install xgboost")

# --- LightGBM ---
try:
    import lightgbm as lgb
    t0 = time.time()
    lgb_model = lgb.LGBMClassifier(
        n_estimators=300, num_leaves=63, learning_rate=0.05,
        subsample=0.8, colsample_bytree=0.8,
        random_state=42, verbose=-1
    )
    lgb_model.fit(X_train, y_train)
    t = time.time() - t0
    auc = roc_auc_score(y_test, lgb_model.predict_proba(X_test)[:, 1])
    results['LightGBM'] = (auc, t)
    print(f"LightGBM | AUC: {auc:.4f} | Time: {t:.2f}s")
except ImportError:
    print("LightGBM not installed: pip install lightgbm")

# --- CatBoost ---
try:
    from catboost import CatBoostClassifier
    t0 = time.time()
    cb_model = CatBoostClassifier(
        iterations=300, depth=6, learning_rate=0.05,
        random_seed=42, verbose=0
    )
    cb_model.fit(X_train, y_train)
    t = time.time() - t0
    auc = roc_auc_score(y_test, cb_model.predict_proba(X_test)[:, 1])
    results['CatBoost'] = (auc, t)
    print(f"CatBoost | AUC: {auc:.4f} | Time: {t:.2f}s")
except ImportError:
    print("CatBoost not installed: pip install catboost")`}
          output={`XGBoost  | AUC: 0.9731 | Time: 8.42s
LightGBM | AUC: 0.9744 | Time: 2.18s
CatBoost | AUC: 0.9729 | Time: 11.37s`}
          explanation="LightGBM в ~4 раза быстрее XGBoost при сравнимом качестве на числовых данных. CatBoost медленнее, но его преимущество раскрывается на данных с категорийными признаками. Качество (AUC) у всех трёх практически одинаковое."
        />

        <CodeBlock
          language="python"
          code={`# Пример использования категорийных признаков (преимущество CatBoost)
import pandas as pd
import numpy as np

# Синтетические данные с категориями
np.random.seed(42)
n = 10000
df = pd.DataFrame({
    'num_feature': np.random.randn(n),
    'city': np.random.choice(['Moscow', 'SPb', 'Kazan', 'Novosibirsk'], n),
    'category': np.random.choice(['A', 'B', 'C', 'D', 'E'], n),
    'weekday': np.random.choice(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], n),
})
# Целевая: зависит от city и num_feature
df['target'] = (
    (df['city'] == 'Moscow').astype(int) * 0.3 +
    (df['num_feature'] > 0.5).astype(int) * 0.5 +
    np.random.rand(n) * 0.2 > 0.4
).astype(int)

cat_features = ['city', 'category', 'weekday']

# CatBoost: передаём категории напрямую
try:
    from catboost import CatBoostClassifier, Pool
    X = df.drop('target', axis=1)
    y = df['target']
    from sklearn.model_selection import train_test_split
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

    train_pool = Pool(X_tr, y_tr, cat_features=cat_features)
    test_pool  = Pool(X_te, y_te, cat_features=cat_features)

    cb = CatBoostClassifier(iterations=200, depth=4, verbose=0, random_seed=42)
    cb.fit(train_pool, eval_set=test_pool)

    from sklearn.metrics import roc_auc_score
    auc = roc_auc_score(y_te, cb.predict_proba(test_pool)[:, 1])
    print(f"CatBoost с нативными категориями: AUC = {auc:.4f}")
    print("Не нужен LabelEncoder или OneHotEncoder!")
except ImportError:
    print("pip install catboost")`}
          output={`CatBoost с нативными категориями: AUC = 0.8934
Не нужен LabelEncoder или OneHotEncoder!`}
          explanation="CatBoost принимает категорийные признаки как строки. Ordered boosting внутри автоматически кодирует их без утечки. Для LightGBM нужно преобразовать в category dtype, для XGBoost — OHE или label encoding вручную."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной выбор фреймворка</h2>
        <div className="space-y-2">
          {[
            ['LightGBM ⚡', 'Большие данные (>500k строк), быстрый прототип, числовые признаки', 'bg-green-50 border-green-200'],
            ['CatBoost 🐱', 'Много категорийных признаков, минимальная настройка, стабильность', 'bg-orange-50 border-orange-200'],
            ['XGBoost 🔥', 'Стандарт отрасли, широкая экосистема, хорошая документация', 'bg-blue-50 border-blue-200'],
          ].map(([title, desc, cls]) => (
            <div key={title} className={`border rounded-lg p-3 text-sm ${cls}`}>
              <span className="font-bold">{title}:</span>
              <span className="text-gray-700 ml-2">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Не указывать cat_features в CatBoost', 'Без указания категорий CatBoost обрабатывает их как числа — плохой результат. Всегда передавай cat_features.'],
            ['Использовать max_depth вместо num_leaves в LightGBM', 'LightGBM растёт leaf-wise: важен num_leaves, а не max_depth. Обычно num_leaves=31 для max_depth=5.'],
            ['Не делать early stopping', 'Без early_stopping_rounds все три фреймворка переобучатся. Всегда задавай eval_set и early stopping.'],
            ['Сравнивать с разными n_estimators', 'Из-за разных стратегий роста деревьев нужно сравнивать при сопоставимом времени обучения, а не числе деревьев.'],
            ['Игнорировать scale_pos_weight / is_unbalance при дисбалансе', 'При дисбалансе классов все три фреймворка имеют параметры для его учёта.'],
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
            level: 'concept',
            question: 'В чём ключевое отличие leaf-wise (LightGBM) от level-wise (XGBoost) роста деревьев?',
            solution: (
              <div>
                <p><strong>Level-wise</strong> (XGBoost): на каждом уровне разбиваются <em>все</em> листья. Дерево растёт по ширине. Результат — сбалансированное дерево.</p>
                <p className="mt-2"><strong>Leaf-wise</strong> (LightGBM): на каждом шаге разбивается <em>один лучший</em> лист (максимальное снижение loss). Дерево асимметрично. Плюс: меньше итераций для той же ошибки. Минус: глубже дерево, риск переобучения на малых данных.</p>
              </div>
            ),
          },
          {
            level: 'concept',
            question: 'Что такое Ordered Boosting в CatBoost и зачем он нужен?',
            solution: (
              <div>
                <p>Ordered boosting решает проблему <strong>target leakage при target encoding</strong>.</p>
                <p className="mt-2">Обычный target encoding использует среднее y по всему датасету — тогда y объекта I «просочилось» в его же фичу. CatBoost вычисляет encoding для объекта I только по объектам, стоящим <em>раньше</em> него в случайной перестановке. Это имитирует онлайн-обучение и устраняет утечку.</p>
              </div>
            ),
          },
          {
            level: 'code',
            question: 'Напишите правильный код LightGBM с early stopping и категорийными признаками.',
            solution: (
              <pre className="text-xs font-mono">{`import lightgbm as lgb

# Преобразуем категорийные в тип category
for col in cat_features:
    X_train[col] = X_train[col].astype('category')
    X_test[col] = X_test[col].astype('category')

model = lgb.LGBMClassifier(
    n_estimators=1000,
    num_leaves=63,
    learning_rate=0.05,
    categorical_feature=cat_features,
    random_state=42,
    verbose=-1
)
model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    callbacks=[lgb.early_stopping(50), lgb.log_evaluation(100)]
)
print(f"Best iteration: {model.best_iteration_}")`}</pre>
            ),
          },
          {
            level: 'tricky',
            question: 'У вас данные: 2 млн строк, 200 числовых признаков, 50 категорийных признаков, временной ряд, target — редкое событие (0.5%). Какой фреймворк выбрать и какие ключевые параметры настроить?',
            solution: (
              <div>
                <p><strong>CatBoost</strong> — лучший выбор из-за 50 категорийных признаков и защиты от утечки.</p>
                <p className="mt-2">Ключевые параметры:</p>
                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                  <li><code>cat_features</code> — список категорийных колонок</li>
                  <li><code>scale_pos_weight</code> или <code>class_weights</code> — учёт дисбаланса 0.5%</li>
                  <li><code>eval_metric='AUC'</code> — метрика для early stopping</li>
                  <li><code>od_type='Iter'</code>, <code>od_wait=50</code> — early stopping</li>
                  <li>Используй <strong>TimeSeriesSplit</strong> для оценки, не random KFold</li>
                </ul>
                <p className="mt-2">Альтернатива: LightGBM с manual target encoding (осторожно с утечкой в CV).</p>
              </div>
            ),
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Chen & Guestrin, "XGBoost: A Scalable Tree Boosting System" (KDD 2016)</strong></li>
          <li>📚 <strong>Ke et al., "LightGBM: A Highly Efficient Gradient Boosting Decision Tree" (NeurIPS 2017)</strong></li>
          <li>📚 <strong>Prokhorenkova et al., "CatBoost: unbiased boosting with categorical features" (NeurIPS 2018)</strong></li>
          <li>📚 <strong>Документация: xgboost.readthedocs.io, lightgbm.readthedocs.io, catboost.ai/docs</strong></li>
        </ul>
      </section>
    </div>
  )
}
