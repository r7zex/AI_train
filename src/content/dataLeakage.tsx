import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function DataLeakageContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Data Leakage</strong> (утечка данных) — ситуация, когда модель в процессе обучения или
          оценки получает информацию, которая была бы недоступна в реальном production сценарии.
          Результат: завышенные метрики на валидации, полный провал в prod. Это одна из самых
          опасных и коварных ошибок в ML — модель «знает ответ» при обучении, поэтому учится на «читерстве»,
          а не на реальных паттернах.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Основные источники утечки</h2>

        <h3 className="font-semibold text-gray-800 mb-3">1. Информация из будущего (Temporal Leakage)</h3>
        <InfoBlock type="warning" title="Самый частый тип">
          Использование фичей, которые вычислены по данным <em>после</em> момента предсказания.
          Например: предсказываем отток клиента на дату T, но используем его активность за T+7 дней.
          Или rolling-средние без сдвига окна.
        </InfoBlock>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">2. Target Encoding до сплита</h3>
        <p className="text-gray-700 text-sm mb-3">
          Если вы вычислили target mean encoding по всему датасету до train/test split,
          тестовые метки «просочились» в обучающий набор через encoded значения.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">3. Нормализация до сплита</h3>
        <p className="text-gray-700 text-sm mb-3">
          Scaling/StandardScaler по всему датасету: mean и std вычислены с учётом тестовых данных.
          Правило: fit только на train, transform — на train и test отдельно.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">4. Дублирование строк</h3>
        <p className="text-gray-700 text-sm mb-3">
          Если в данных есть дубликаты и они попали в оба split — одни и те же объекты присутствуют
          в train и test. Модель «видела» тестовые данные при обучении.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">5. Surrogate / proxy features</h3>
        <p className="text-gray-700 text-sm mb-3">
          Фичи, которые являются прямым следствием целевой переменной. Например: предсказываем
          диагноз, но в датасете есть «назначенное лечение» — оно напрямую вытекает из диагноза.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">6. Утечка через препроцессинг в Pipeline</h3>
        <p className="text-gray-700 text-sm mb-3">
          Imputation, PCA, feature selection — все эти трансформации должны быть внутри
          cross-validation loop, а не снаружи.
        </p>

        <InfoBlock type="note" title="Почему это так коварно">
          Утечка часто даёт AUC 0.99+ или accuracy 100%, что выглядит как «отличный результат».
          Разработчик радуется и деплоит модель — а она падает в prod. Красный флаг: метрики
          слишком хороши или резко падают при переходе к другому временному периоду.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python: leaky vs clean pipeline</h2>
        <CodeBlock
          language="python"
          code={`import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, KFold
from sklearn.pipeline import Pipeline
from sklearn.metrics import roc_auc_score

X, y = make_classification(n_samples=1000, n_features=20,
                            n_informative=3, random_state=42)
kf = KFold(n_splits=5, shuffle=True, random_state=42)

# ❌ LEAKY: scaler.fit на всём датасете до кросс-валидации
scaler_leaky = StandardScaler()
X_scaled_leaky = scaler_leaky.fit_transform(X)  # использует и test!

scores_leaky = cross_val_score(
    LogisticRegression(random_state=42),
    X_scaled_leaky, y, cv=kf, scoring='roc_auc'
)
print(f"❌ Leaky  CV AUC: {scores_leaky.mean():.4f} ± {scores_leaky.std():.4f}")

# ✅ CLEAN: scaler внутри Pipeline — fit только на train fold
clean_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('clf', LogisticRegression(random_state=42))
])

scores_clean = cross_val_score(
    clean_pipeline, X, y, cv=kf, scoring='roc_auc'
)
print(f"✅ Clean  CV AUC: {scores_clean.mean():.4f} ± {scores_clean.std():.4f}")
print()

# Разница может быть небольшой здесь, но на реальных данных
# с малой выборкой или высоким дисбалансом — критична
print("На малых выборках утечка значительнее:")
X_small, y_small = X[:100], y[:100]

X_scaled_s = StandardScaler().fit_transform(X_small)
scores_s_leaky = cross_val_score(
    LogisticRegression(random_state=42),
    X_scaled_s, y_small, cv=5, scoring='roc_auc'
)
scores_s_clean = cross_val_score(
    clean_pipeline, X_small, y_small, cv=5, scoring='roc_auc'
)
print(f"  Leaky  (n=100): {scores_s_leaky.mean():.4f}")
print(f"  Clean  (n=100): {scores_s_clean.mean():.4f}")`}
          output={`❌ Leaky  CV AUC: 0.8841 ± 0.0285
✅ Clean  CV AUC: 0.8823 ± 0.0291

На малых выборках утечка значительнее:
  Leaky  (n=100): 0.8156
  Clean  (n=100): 0.7912`}
          explanation="На большой выборке стандартизация создаёт небольшую утечку (test влияет на mean/std незначительно). Но на малой выборке (n=100) утечка заметнее. В более сложных случаях (target encoding, PCA, feature selection) разница может быть огромной — от 0.7 до 0.99."
        />

        <CodeBlock
          language="python"
          code={`# ❌ Пример утечки при target encoding
import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.DataFrame({
    'category': ['A','B','A','C','B','A','C','B']*50,
    'feature':  np.random.randn(400),
    'target':   np.random.randint(0, 2, 400)
})

# ❌ LEAKY: target encoding по всему датасету
df['cat_encoded_leaky'] = df.groupby('category')['target'].transform('mean')
X_train, X_test = train_test_split(df, test_size=0.2, random_state=42)
print("❌ Leaky target encoding — test labels used in train features!")

# ✅ CLEAN: encoding только по train fold
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
target_mean = train_df.groupby('category')['target'].mean()
train_df = train_df.copy()
test_df  = test_df.copy()
train_df['cat_encoded'] = train_df['category'].map(target_mean)
# Unseen categories → global mean
global_mean = train_df['target'].mean()
test_df['cat_encoded']  = test_df['category'].map(target_mean).fillna(global_mean)
print("✅ Clean target encoding — only train labels used")`}
          output={`❌ Leaky target encoding — test labels used in train features!
✅ Clean target encoding — only train labels used`}
          explanation="Target encoding без guard — классический источник утечки. В cross-validation это особенно опасно: нужно делать encoding внутри каждого fold."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Чеклист для предотвращения утечки</h2>
        <div className="space-y-2">
          {[
            ['✅', 'Всегда делать train/test split до любого препроцессинга'],
            ['✅', 'Использовать sklearn Pipeline — все трансформации автоматически fit только на train'],
            ['✅', 'При временных данных — временной split (TimeSeriesSplit), не случайный'],
            ['✅', 'Проверять дубликаты в данных до split'],
            ['✅', 'Аудировать фичи: откуда берётся каждая колонка?'],
            ['✅', 'Target encoding делать внутри CV loop (или использовать TargetEncoder из sklearn 1.3+)'],
            ['✅', 'Красный флаг: AUC > 0.99 — проверяй утечку'],
            ['✅', 'Тестировать модель на другом временном периоде'],
          ].map(([icon, text]) => (
            <div key={text} className="bg-green-50 border border-green-200 rounded-lg p-2 text-sm flex gap-2">
              <span>{icon}</span>
              <span className="text-gray-700">{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Использовать StandardScaler вне Pipeline', 'fit_transform на всём X до split. Правило: всегда fit только на X_train, transform на X_test.'],
            ['Rolling features без сдвига', 'rolling(7).mean() берёт текущий день в окно. Нужно shift(1).rolling(7).mean().'],
            ['Shuffle перед TimeSeriesSplit', 'При временных данных перемешивание нарушает порядок — будущее попадает в train.'],
            ['Feature selection на всём датасете', 'SelectKBest, RFE и т.д. нужно делать только на train fold.'],
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
            question: 'Вы обучаете модель предсказания дефолта по кредиту. В датасете есть колонка "collection_agency_contacted" (контакт с коллекторами). Это утечка? Почему?',
            solution: (
              <div>
                <p><strong>Да, это утечка.</strong> Коллекторы связываются после дефолта — эта колонка является следствием целевой переменной, а не причиной.</p>
                <p className="mt-2">В production модель должна предсказывать дефолт <em>до</em> его наступления, когда контакта с коллекторами ещё нет. Это surrogate / proxy feature.</p>
              </div>
            ),
          },
          {
            level: 'concept',
            question: 'Объясните, почему нужно делать StandardScaler().fit() только на тренировочных данных.',
            solution: (
              <div>
                <p>StandardScaler вычисляет mean и std для нормализации. Если fit() на всём датасете — mean/std включают статистику тестовых данных.</p>
                <p className="mt-2">Это "просачивает" информацию о тесте в обучение. В production mean/std вычислены только по историческим данным — модель должна использовать именно их.</p>
              </div>
            ),
          },
          {
            level: 'code',
            question: 'Напишите правильный Pipeline с imputer и scaler для кросс-валидации.',
            solution: (
              <pre className="text-xs font-mono">{`from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

pipe = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler()),
    ('clf', LogisticRegression())
])
# Pipeline автоматически fit только на train fold!
scores = cross_val_score(pipe, X, y, cv=5, scoring='roc_auc')`}</pre>
            ),
          },
          {
            level: 'tricky',
            question: 'Модель показала AUC=0.97 на offline тесте, но AUC=0.61 в production на следующем месяце. Назовите 3 возможных причины.',
            solution: (
              <div>
                <ol className="list-decimal list-inside space-y-1">
                  <li><strong>Data leakage</strong>: использовались фичи из будущего (future info). В prod они недоступны.</li>
                  <li><strong>Distribution shift</strong>: распределение данных изменилось (сезонность, изменение поведения пользователей).</li>
                  <li><strong>Случайный split вместо временного</strong>: данные из будущего попали в train, модель обучилась на «будущем» паттерне.</li>
                  <li className="text-gray-500">(Доп.) Дубликаты: одни записи попали в train и test.</li>
                </ol>
              </div>
            ),
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Kaufman et al., "Leakage in Data Mining: Formulation, Detection, and Avoidance" (2012)</strong></li>
          <li>📚 <strong>scikit-learn Docs — Pipeline, cross_val_score</strong> — why Pipeline prevents leakage</li>
          <li>📚 <strong>Kaggle — "Data Leakage" tutorial</strong> — практические примеры</li>
          <li>📚 <strong>Zheng & Casari, "Feature Engineering for Machine Learning" (O'Reilly)</strong> — глава о feature leakage</li>
        </ul>
      </section>
    </div>
  )
}
