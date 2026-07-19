import type { FlowStep } from '../../aiCurriculumTypes'
import {
  assessment,
  callout,
  code,
  makeStdinTask,
  numericQuestion,
  practiceStep,
  researchSources,
  researchTopic,
  section,
  singleQuestion,
  sourceStep,
  theoryStep,
  trueFalseQuestion,
} from './helpers'

const blockId = 'biomedical-ml'
const blockTitle = 'Биомедицинский ML без утечек'
const blockIcon = '09'

const cohortId = 'biomedical-cohort-target'
const cohortSteps: FlowStep[] = [
  theoryStep(`${cohortId}-theory`, 'Из клинического вопроса в аналитическую таблицу', 'Одна строка должна иметь биологический смысл.', [
    section('cohort-table', 'Кто, когда и что предсказываем', [
      'До pandas зафиксируйте популяцию, момент предсказания, горизонт прогноза и исход. Таблица «одна строка — один пациент» подходит не всегда: для повторных процедур нужна индексная запись или модель продольных данных, а для образцов опухоли связь patient_id и sample_id должна оставаться явной.',
      'Target строится одной проверяемой функцией. Неоднозначные значения, пустые ячейки и технические ошибки не следует молча приравнивать к отрицательному классу: сначала формируется таблица правил и отчёт о числе перекодированных записей.',
    ], {
      table: {
        headers: ['Кейс', 'Момент предсказания', 'Target', 'Запрещённые данные'],
        rows: [
          ['Gamma Knife', 'до/в момент радиохирургии', 'последующая интракраниальная прогрессия', 'локальный рецидив и метастазы, известные после лечения'],
          ['ASPA', 'во время доступного скрининга', 'недиагностированный диабет HbA1c≥6.5%', 'HbA1c и глюкоза как прямые компоненты определения'],
        ],
      },
      callouts: [callout('Контрольная сумма', 'После каждого правила включения печатайте n, число событий и долю пропусков. Тогда выборка не «исчезнет» незаметно.', 'remember')],
    }),
  ]),
  {
    id: `${cohortId}-examples`, type: 'worked-example', title: 'Две спецификации когорты', summary: 'Переводим описание статьи в проверяемые правила.',
    workedExample: [
      { title: 'Gamma Knife', body: '548 наблюдений: 179 без прогрессии и 369 с прогрессией. Отдельно проверяются даты, интервалы 0–5000 дней, числовые поля с запятой и повторные процедуры.' },
      { title: 'ASPA', body: '4542 участника 35–69 лет из Архангельска и Новосибирска; исключаются известный диабет и сахароснижающие препараты, а доступность признаков проверяется на момент скрининга.' },
    ],
  },
  {
    id: `${cohortId}-code`, type: 'code', title: 'Функция построения target', summary: 'Явные категории вместо неявного truthy.',
    codeExample: code('python', `import pandas as pd

POSITIVE = {'да', 'прогрессия', '1'}
NEGATIVE = {'нет', 'без прогрессии', '0'}

def map_target(value):
    value = str(value).strip().lower()
    if value in POSITIVE:
        return 1
    if value in NEGATIVE:
        return 0
    return pd.NA

target = raw['Интракраниальная прогрессия'].map(map_target)
print(target.value_counts(dropna=False))`, undefined, 'Неизвестные значения остаются неизвестными; решение об исключении описывается отдельно.'),
  },
  assessment(cohortId, 'Мини-аудит когорты: 5 вопросов', [
    singleQuestion('ct-q1', cohortId, 'Что фиксируют до формирования target?', ['Цвет heatmap', 'Момент предсказания и определение исхода', 'Название модели', 'Количество деревьев'], 1, 'Это защищает временную логику задачи.'),
    trueFalseQuestion('ct-q2', cohortId, 'Пустое значение target всегда безопасно заменить на 0.', false, 'Это может ошибочно создать отрицательный класс.'),
    singleQuestion('ct-q3', cohortId, 'Какой идентификатор нельзя терять при нескольких образцах пациента?', ['patient_id', 'Номер строки Excel', 'Индекс DataFrame после reset', 'Имя ноутбука'], 0, 'Он нужен для группировки и предотвращения утечки.'),
    numericQuestion('ct-q4', cohortId, 'В когорте 179 без прогрессии и 369 с прогрессией. Сколько всего наблюдений?', 548, '179 + 369 = 548.', 0),
    singleQuestion('ct-q5', cohortId, 'Что запрещено как предиктор при target HbA1c≥6.5%?', ['Возраст', 'Город', 'HbA1c', 'Пол'], 2, 'Это прямая часть определения исхода.'),
  ]),
  practiceStep(`${cohortId}-practice`, 'Практика: прозрачная перекодировка', 'Отделите положительные, отрицательные и неизвестные значения.', makeStdinTask(
    'target-mapping', 'Сводка target',
    'Первая строка n, далее n значений: yes, no или unknown. Выведите количества 0, 1 и unknown через пробел.',
    `# TODO: прочитайте n строк
# TODO: посчитайте три категории`,
    [{ id: 'sample-1', description: 'Смешанные значения', input: '5\nyes\nno\nunknown\nyes\nno\n', expectedOutput: '2 2 1' }],
    [{ id: 'hidden-1', description: 'Только событие и unknown', input: '4\nyes\nyes\nunknown\nyes\n', expectedOutput: '0 3 1' }],
    `n = int(input())
counts = {'no': 0, 'yes': 0, 'unknown': 0}
for _ in range(n):
    value = input().strip().lower()
    counts[value] += 1
print(counts['no'], counts['yes'], counts['unknown'])`,
  )),
  sourceStep(cohortId, [researchSources.tripOd, researchSources.fair]),
]

const leakageId = 'biomedical-leakage-pipeline'
const leakageSteps: FlowStep[] = [
  theoryStep(`${leakageId}-theory`, 'Утечка данных в биомедицинском исследовании', 'Модель не должна видеть будущее, тест или определение target.', [
    section('leakage-types', 'Три источника завышенных результатов', [
      'Target leakage возникает, когда признак напрямую или косвенно содержит исход. Temporal leakage — когда признак измерен после момента прогноза. Train–test contamination — когда статистики preprocessing, отбор признаков или дубликаты пересекают границу между обучением и тестом.',
      'Правильный порядок: сначала разбиение на независимом уровне, затем все обучаемые преобразования внутри Pipeline. Это относится к импутации, масштабированию, кодированию категорий, отбору генов, oversampling и настройке гиперпараметров.',
    ], {
      table: {
        headers: ['Ситуация', 'Почему это утечка', 'Исправление'],
        rows: [
          ['Нормализация по всей таблице', 'использована статистика теста', 'fit только на train через Pipeline'],
          ['Один пациент в train и test', 'модель узнаёт индивидуальный профиль', 'GroupKFold / group split'],
          ['Отбор top-genes до CV', 'использован весь target', 'отбор внутри каждого fold'],
        ],
      },
      callouts: [callout('Кейс Gamma Knife', 'Столбцы «локальный рецидив» и «дистанционные метастазы» относятся к последующему исходу и должны быть исключены из матрицы признаков.', 'example')],
    }),
  ]),
  {
    id: `${leakageId}-examples`, type: 'worked-example', title: 'Три диагностических вопроса', summary: 'Проверяем каждый столбец и каждую операцию.',
    workedExample: [
      { title: 'Когда стало известно?', body: 'Если значение появляется только после лечения или в конце наблюдения, оно не может участвовать в прогнозе на старте.' },
      { title: 'На каких строках обучено?', body: 'Импутер, scaler и selector должны видеть только train конкретного разбиения.' },
      { title: 'Есть ли родство объектов?', body: 'Повторы пациента, лабораторный batch или центр требуют группового/внешнего разбиения.' },
    ],
  },
  {
    id: `${leakageId}-code`, type: 'code', title: 'ColumnTransformer и Pipeline', summary: 'Один объект описывает весь обучаемый путь.',
    codeExample: code('python', `from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

numeric = Pipeline([('impute', SimpleImputer(strategy='median')),
                    ('scale', StandardScaler())])
categorical = Pipeline([('impute', SimpleImputer(strategy='most_frequent')),
                        ('onehot', OneHotEncoder(handle_unknown='ignore'))])
prep = ColumnTransformer([('num', numeric, numeric_cols),
                          ('cat', categorical, categorical_cols)])
model = Pipeline([('prep', prep),
                  ('clf', LogisticRegression(class_weight='balanced'))])`, undefined, 'Передавайте весь Pipeline в CV; не вызывайте fit_transform на полной таблице.'),
  },
  theoryStep(`${leakageId}-pitfalls`, 'Красные флаги результата', 'Слишком хорошая метрика — повод расследовать.', [
    section('leakage-redflags', 'Что должно насторожить', [
      'AUC около 1.0 на маленькой ретроспективной когорте, резкое падение на внешнем центре, признаки с названиями outcome/status/followup, одинаковые строки в train и test, а также preprocessing до split требуют проверки происхождения данных.',
    ], { bullets: ['Сравните даты измерения с индексной датой.', 'Проверьте пересечение patient_id.', 'Повторите оценку с permutation target.', 'Сохраните список исключённых признаков и причину.'] }),
  ]),
  assessment(leakageId, 'Расследование утечки: 7 вопросов', [
    singleQuestion('lk-q1', leakageId, 'Когда обучать scaler?', ['До split', 'На train внутри каждого fold', 'На тесте', 'После публикации'], 1, 'Параметры scaler не должны видеть test.'),
    trueFalseQuestion('lk-q2', leakageId, 'Отбор генов по всей матрице до CV — это утечка.', true, 'Target из validation fold влияет на список генов.'),
    singleQuestion('lk-q3', leakageId, 'Чем разделять повторные процедуры пациента?', ['Обычным случайным split по строкам', 'GroupKFold по patient_id', 'Сортировкой по target', 'Удалением ID после split'], 1, 'Все записи пациента должны оставаться в одной стороне.'),
    singleQuestion('lk-q4', leakageId, 'Какой столбец подозрителен для прогноза прогрессии?', ['Возраст на лечении', 'Число очагов до лечения', 'Локальный рецидив после лечения', 'Пол'], 2, 'Он описывает будущее относительно момента прогноза.'),
    trueFalseQuestion('lk-q5', leakageId, 'OneHotEncoder можно fit на всей таблице, потому что он не использует target.', false, 'Даже unsupervised preprocessing использует распределение тестовой части; безопасный путь — Pipeline.'),
    singleQuestion('lk-q6', leakageId, 'Что передают в GridSearchCV?', ['Только классификатор после готового preprocessing', 'Весь Pipeline', 'Тестовый target', 'Предсказания внешней когорты'], 1, 'Так каждый fold обучает все преобразования заново.'),
    trueFalseQuestion('lk-q7', leakageId, 'Слишком высокая метрика может быть симптомом утечки.', true, 'Особенно на малой и сложной клинической задаче.'),
  ]),
  practiceStep(`${leakageId}-practice-columns`, 'Практика 1: фильтр запрещённых признаков', 'Сделайте список признаков аудируемым.', makeStdinTask(
    'drop-leakage-columns', 'Удаление признаков будущего',
    'В первой строке через пробел названия столбцов. Во второй — запрещённые названия. Выведите разрешённые столбцы в исходном порядке.',
    `# TODO: прочитайте columns и forbidden
# TODO: сохраните порядок разрешённых`,
    [{ id: 'sample-1', description: 'Клинические признаки', input: 'age lesions recurrence sex\nrecurrence target\n', expectedOutput: 'age lesions sex' }],
    [{ id: 'hidden-1', description: 'Omics-признаки', input: 'gene1 batch outcome gene2\noutcome\n', expectedOutput: 'gene1 batch gene2' }],
    `columns = input().split()
forbidden = set(input().split())
allowed = [name for name in columns if name not in forbidden]
print(' '.join(allowed))`,
  )),
  practiceStep(`${leakageId}-practice-groups`, 'Практика 2: проверка пересечения пациентов', 'Ни один patient_id не должен попасть в обе части.', makeStdinTask(
    'group-overlap', 'Пересечение patient_id',
    'Две строки содержат ID train и test. Выведите общие ID по алфавиту или OK.',
    `# TODO: прочитайте два множества ID
# TODO: найдите пересечение`,
    [{ id: 'sample-1', description: 'Обнаружено пересечение', input: 'p1 p2 p3\np3 p4\n', expectedOutput: 'p3' }],
    [{ id: 'hidden-1', description: 'Чистое разбиение', input: 'a b\nc d\n', expectedOutput: 'OK' }],
    `train = set(input().split())
test = set(input().split())
overlap = sorted(train & test)
print(' '.join(overlap) if overlap else 'OK')`,
  )),
  sourceStep(leakageId, [researchSources.sklearnPipeline, researchSources.sklearnValidation]),
]

const evaluationId = 'biomedical-evaluation'
const evaluationSteps: FlowStep[] = [
  theoryStep(`${evaluationId}-theory`, 'Дисбаланс, метрики и клинический порог', 'Вероятность, классификация и решение — три разных объекта.', [
    section('evaluation-levels', 'От score к действию', [
      'ROC-AUC оценивает ранжирование по всем порогам, PR-AUC сильнее отражает качество положительного класса при редком событии, balanced accuracy усредняет sensitivity и specificity. Ни одна из них не выбирает клинический порог автоматически.',
      'Калибровка отвечает, совпадает ли прогноз 0.30 с примерно 30% событий. Порог выбирают на validation-данных по заранее описанной цене ошибок или целевой sensitivity; финальный test используется один раз для оценки выбранного решения.',
    ], {
      table: { headers: ['Вопрос', 'Метрика/график', 'Чего не говорит'], rows: [
        ['Хорошо ли ранжирует?', 'ROC-AUC / PR-AUC', 'верны ли вероятности'],
        ['Верны ли вероятности?', 'Brier + calibration curve', 'какой порог использовать'],
        ['Что происходит при пороге?', 'confusion matrix, sensitivity, specificity', 'как переносится в другой центр'],
      ] },
    }),
  ]),
  {
    id: `${evaluationId}-formula`, type: 'formula', title: 'Метрики для события', summary: 'Считаем по confusion matrix.',
    formulaCards: [
      { label: 'Sensitivity / Recall', expression: '\\frac{TP}{TP+FN}', meaning: 'Доля найденных событий.', notation: ['FN — пропущенные события'] },
      { label: 'Specificity', expression: '\\frac{TN}{TN+FP}', meaning: 'Доля правильно исключённых несобытий.', notation: ['FP — ложные тревоги'] },
      { label: 'Balanced accuracy', expression: '\\frac{sensitivity+specificity}{2}', meaning: 'Равный вес обоим классам.', notation: ['Диапазон от 0 до 1'] },
      { label: 'Brier score', expression: '\\frac{1}{n}\\sum_i(p_i-y_i)^2', meaning: 'Средняя квадратичная ошибка вероятностей.', notation: ['Меньше — лучше'] },
    ],
  },
  {
    id: `${evaluationId}-examples`, type: 'worked-example', title: 'Три решения на одних вероятностях', summary: 'Порог зависит от сценария использования.',
    workedExample: [
      { title: 'Скрининг', body: 'Выбираем высокую sensitivity, принимая больше FP, если пропустить событие особенно опасно.' },
      { title: 'Дорогая процедура', body: 'Требуем высокую precision/specificity, чтобы сократить ненужные вмешательства.' },
      { title: 'Статья Gamma Knife', body: 'Сообщаем ROC-AUC/PR-AUC, BA, precision, recall, F1, CI и confusion matrix при заранее выбранном пороге.' },
    ],
  },
  {
    id: `${evaluationId}-code`, type: 'code', title: 'Оценка вероятностей и порога', summary: 'Не округляем probabilities слишком рано.',
    codeExample: code('python', `from sklearn.metrics import (balanced_accuracy_score, brier_score_loss,
                             confusion_matrix, precision_recall_curve)

prob = pipeline.predict_proba(X_valid)[:, 1]
precision, recall, thresholds = precision_recall_curve(y_valid, prob)
eligible = [(t, p, r) for t, p, r in zip(thresholds, precision[:-1], recall[:-1])
            if r >= 0.80]
threshold = max(eligible, key=lambda item: item[1])[0]
pred = (prob >= threshold).astype(int)
print(balanced_accuracy_score(y_valid, pred))
print(brier_score_loss(y_valid, prob), confusion_matrix(y_valid, pred))`, undefined, 'Порог выбирается только на validation; test остаётся нетронутым.'),
  },
  theoryStep(`${evaluationId}-pitfalls`, 'SMOTE, class_weight и честная оценка', 'Балансировка не должна касаться test.', [
    section('imbalance-pitfalls', 'Что меняет обучение, а что — оценку', [
      'class_weight меняет штраф ошибки во время fit. Oversampling создаёт/повторяет объекты train и должен происходить внутри каждого fold. Изменять распределение test нельзя: оно должно отражать реальную долю события. После балансировки вероятности часто требуют отдельной проверки калибровки.',
    ], { callouts: [callout('Не оптимизируйте всё сразу', 'Сначала baseline и схема validation, затем один фактор за раз: веса, sampling, модель, калибровка, порог.', 'remember')] }),
  ]),
  assessment(evaluationId, 'Метрики и порог: 8 вопросов', [
    numericQuestion('ev-q1', evaluationId, 'Sensitivity=0.8 и specificity=0.6. Чему равна balanced accuracy?', 0.7, 'Среднее равно 0.7.'),
    singleQuestion('ev-q2', evaluationId, 'Какая метрика особенно полезна при редком положительном классе?', ['PR-AUC', 'Только accuracy', 'MSE признаков', 'R²'], 0, 'PR-AUC фокусируется на precision и recall.'),
    trueFalseQuestion('ev-q3', evaluationId, 'ROC-AUC=0.85 гарантирует хорошую калибровку.', false, 'Ранжирование и калибровка — разные свойства.'),
    singleQuestion('ev-q4', evaluationId, 'Где выбирать threshold?', ['На test', 'На validation', 'На всей выборке после публикации', 'По умолчанию всегда 0.5'], 1, 'Test нужен для независимой итоговой оценки.'),
    trueFalseQuestion('ev-q5', evaluationId, 'SMOTE можно применить до train/test split.', false, 'Синтетические соседи могут связать train и test.'),
    singleQuestion('ev-q6', evaluationId, 'Что измеряет Brier score?', ['Ошибку вероятностей', 'Число признаков', 'Скорость обучения', 'Чистоту кластера'], 0, 'Это mean squared error между probability и outcome.'),
    numericQuestion('ev-q7', evaluationId, 'TP=40, FN=10. Чему равен recall?', 0.8, '40/(40+10)=0.8.'),
    singleQuestion('ev-q8', evaluationId, 'Что сохранять вместе с метрикой?', ['Только лучший seed', 'CI и схему разбиения', 'Только confusion matrix', 'Название ноутбука'], 1, 'Без неопределённости и дизайна число трудно интерпретировать.'),
  ]),
  practiceStep(`${evaluationId}-practice-ba`, 'Практика 1: balanced accuracy', 'Вычислите метрику из четырёх чисел.', makeStdinTask(
    'balanced-accuracy', 'Balanced accuracy', 'Даны TP FN TN FP. Выведите balanced accuracy с 3 знаками.',
    `# TODO: прочитайте confusion matrix
# TODO: вычислите sensitivity и specificity`,
    [{ id: 'sample-1', description: 'Несимметричные классы', input: '40 10 30 20\n', expectedOutput: '0.700' }],
    [{ id: 'hidden-1', description: 'Идеальная классификация', input: '15 0 85 0\n', expectedOutput: '1.000' }],
    `tp, fn, tn, fp = map(float, input().split())
sensitivity = tp / (tp + fn)
specificity = tn / (tn + fp)
print(f'{(sensitivity + specificity) / 2:.3f}')`,
  )),
  practiceStep(`${evaluationId}-practice-threshold`, 'Практика 2: матрица при пороге', 'Преобразуйте probability в решение.', makeStdinTask(
    'threshold-confusion', 'Confusion matrix по вероятностям',
    'Первая строка threshold. Вторая — y (0/1). Третья — probabilities. Выведите TP FN TN FP.',
    `# TODO: прочитайте threshold, y и probabilities
# TODO: постройте предсказания и четыре счётчика`,
    [{ id: 'sample-1', description: 'Порог 0.5', input: '0.5\n1 0 1 0\n0.8 0.7 0.4 0.1\n', expectedOutput: '1 1 1 1' }],
    [{ id: 'hidden-1', description: 'Порог 0.7', input: '0.7\n1 1 0\n0.9 0.7 0.2\n', expectedOutput: '2 0 1 0' }],
    `threshold = float(input())
y = list(map(int, input().split()))
prob = list(map(float, input().split()))
pred = [int(p >= threshold) for p in prob]
tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
tn = sum(a == 0 and b == 0 for a, b in zip(y, pred))
fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
print(tp, fn, tn, fp)`,
  )),
  sourceStep(evaluationId, [researchSources.sklearnCalibration, researchSources.tripOd]),
]

const validationId = 'biomedical-validation-reproducibility'
const validationSteps: FlowStep[] = [
  theoryStep(`${validationId}-theory`, 'Nested CV, внешний тест и воспроизводимость', 'Один seed не заменяет дизайн оценки.', [
    section('validation-layers', 'Три уровня честности', [
      'Внутренний цикл nested CV выбирает гиперпараметры, внешний оценивает процедуру выбора. GroupKFold защищает от родственных объектов, временной split — от будущего, а внешний центр проверяет переносимость на другую клиническую практику.',
      'Воспроизводимость требует не только seed: фиксируются версии пакетов, правила когорты, схема split, все preprocessing-шаги, пространство поиска, метрики, сохранённые out-of-fold predictions и журнал исключений.',
    ], { callouts: [callout('Минимальный benchmark', 'Сравните Dummy, прозрачную линейную модель и одну нелинейную модель. Сложная модель должна выигрывать по заранее выбранной метрике и сохранять калибровку.', 'schema')] }),
  ]),
  {
    id: `${validationId}-examples`, type: 'worked-example', title: 'Два сценария переноса', summary: 'Разбиение имитирует будущее применение.',
    workedExample: [
      { title: 'Два города ASPA', body: 'Обучение на одном городе и проверка на другом показывает geographic transportability лучше случайного split.' },
      { title: 'Онкология по времени', body: 'Обучение на ранних годах и тест на более поздних обнаруживает drift протоколов лечения и кодирования.' },
    ],
  },
  {
    id: `${validationId}-code`, type: 'code', title: 'OOF-предсказания и группы', summary: 'Каждый пациент получает прогноз от модели, которая его не видела.',
    codeExample: code('python', `from sklearn.model_selection import StratifiedGroupKFold, cross_val_predict

cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
oof_prob = cross_val_predict(
    pipeline, X, y, groups=patient_id, cv=cv, method='predict_proba'
)[:, 1]
results = metadata[['patient_id']].assign(y=y, oof_probability=oof_prob)
results.to_csv('oof_predictions.csv', index=False)`, undefined, 'OOF-файл позволяет повторно построить метрики, графики и CI без переобучения.'),
  },
  assessment(validationId, 'Проверка стратегии: 6 вопросов', [
    singleQuestion('vr-q1', validationId, 'Зачем nested CV?', ['Выбирать и оценивать гиперпараметры на разных уровнях', 'Увеличивать число признаков', 'Заполнять пропуски теста', 'Удалять группы'], 0, 'Внешний цикл оценивает всю процедуру настройки.'),
    trueFalseQuestion('vr-q2', validationId, 'Фиксированный random_state гарантирует научную воспроизводимость.', false, 'Нужны данные, версии, правила, pipeline и результаты.'),
    singleQuestion('vr-q3', validationId, 'Как проверить перенос между городами?', ['Случайно смешать города', 'Оставить один город внешним тестом', 'Удалить столбец города', 'Выбрать лучший seed'], 1, 'Так тест имитирует deployment в другой географии.'),
    singleQuestion('vr-q4', validationId, 'Что хранит OOF-файл?', ['Прогнозы объектов от моделей, не обучавшихся на них', 'Только train predictions', 'Только коэффициенты', 'Только названия моделей'], 0, 'Это основа честной агрегированной оценки.'),
    trueFalseQuestion('vr-q5', validationId, 'Внешняя валидация заменяет внутреннюю настройку.', false, 'Они решают разные задачи.'),
    singleQuestion('vr-q6', validationId, 'Какой benchmark минимально разумен?', ['Только бустинг', 'Dummy + линейная + одна нелинейная модель', '20 моделей без плана', 'Только модель с лучшим train score'], 1, 'Это показывает добавленную ценность сложности.'),
  ]),
  practiceStep(`${validationId}-practice`, 'Практика: групповой fold', 'Назначьте пациентов целиком в один fold.', makeStdinTask(
    'group-fold-audit', 'Проверка group split',
    'Даны строки patient_id:fold. Выведите LEAK, если пациент встречается в разных fold, иначе OK.',
    `# TODO: прочитайте n и пары patient:fold
# TODO: проверьте согласованность fold внутри пациента`,
    [{ id: 'sample-1', description: 'Обнаружена утечка', input: '4\np1:0\np2:1\np1:2\np3:0\n', expectedOutput: 'LEAK' }],
    [{ id: 'hidden-1', description: 'Корректное разбиение', input: '4\np1:0\np2:1\np1:0\np3:2\n', expectedOutput: 'OK' }],
    `n = int(input())
folds = {}
leak = False
for _ in range(n):
    patient, fold = input().split(':')
    if patient in folds and folds[patient] != fold:
        leak = True
    folds[patient] = fold
print('LEAK' if leak else 'OK')`,
  )),
  theoryStep(`${validationId}-recap`, 'Паспорт эксперимента', 'Что должно сопровождать каждую строку таблицы моделей.', [
    section('experiment-card', 'Минимальные поля', ['Сохраните dataset version, cohort hash, feature set, split strategy, random seed, pipeline, search space, primary metric, threshold rule, package versions, commit и путь к OOF/test predictions. Тогда таблицу результатов можно проверить, а не только прочитать.'], {
      bullets: ['Не выбирайте финальную модель по внешнему test.', 'Показывайте распределение метрики по fold.', 'Отделяйте exploratory-анализ от confirmatory.'],
    }),
  ]),
  sourceStep(validationId, [researchSources.sklearnValidation, researchSources.sklearnPipeline, researchSources.tripOd, researchSources.fair]),
]

export const biomedicalMlTopics = [
  researchTopic({ id: cohortId, title: '9.1 Когорта, временная ось и target', order: 1, summary: 'Превращаем вопрос статьи в проверяемую таблицу на примерах Gamma Knife и ASPA.', blockId, blockTitle, blockIcon, format: 'два сквозных кейса', estimatedMinutes: 55, quizQuestions: 5, practiceTasks: 1, examples: 3, terminology: ['cohort', 'index date', 'target', 'unit of analysis'], cheatsheet: ['Target строится одной проверяемой функцией.', 'Неизвестное значение не равно отрицательному классу.'], sources: [researchSources.tripOd], steps: cohortSteps }),
  researchTopic({ id: leakageId, title: '9.2 Утечка данных и безопасный Pipeline', order: 2, summary: 'Target leakage, будущее, групповые дубликаты и preprocessing внутри fold.', blockId, blockTitle, blockIcon, format: 'клиническое расследование + 2 практики', estimatedMinutes: 80, quizQuestions: 7, practiceTasks: 2, examples: 4, terminology: ['target leakage', 'temporal leakage', 'contamination', 'Pipeline'], cheatsheet: ['Сначала split, затем fit преобразований.', 'Все записи пациента остаются в одной части.'], sources: [researchSources.sklearnPipeline], steps: leakageSteps }),
  researchTopic({ id: evaluationId, title: '9.3 Дисбаланс, калибровка и выбор порога', order: 3, summary: 'От вероятностей к клиническому решению с BA, PR-AUC, Brier и CI.', blockId, blockTitle, blockIcon, format: 'метрическая лаборатория + 2 задачи', estimatedMinutes: 85, quizQuestions: 8, practiceTasks: 2, examples: 4, terminology: ['ROC-AUC', 'PR-AUC', 'balanced accuracy', 'calibration', 'threshold'], formulas: ['sensitivity', 'specificity', 'balanced accuracy', 'Brier score'], cheatsheet: ['Ранжирование, калибровка и порог — разные задачи.', 'Test не участвует в выборе порога.'], sources: [researchSources.sklearnCalibration], steps: evaluationSteps }),
  researchTopic({ id: validationId, title: '9.4 Nested CV, внешний тест и паспорт эксперимента', order: 4, summary: 'Оцениваем процедуру, переносимость и воспроизводимость, а не лучший случайный seed.', blockId, blockTitle, blockIcon, format: 'архитектура эксперимента', estimatedMinutes: 70, quizQuestions: 6, practiceTasks: 1, examples: 3, terminology: ['nested CV', 'OOF', 'external validation', 'transportability'], cheatsheet: ['Разбиение имитирует реальное применение.', 'Сохраняйте OOF predictions и версии окружения.'], sources: [researchSources.sklearnValidation, researchSources.fair], steps: validationSteps }),
]
