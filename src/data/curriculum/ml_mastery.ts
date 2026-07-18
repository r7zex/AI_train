import type { FlowStep } from '../aiCurriculumTypes'
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
} from './research/helpers'

const blockId = 'ml-foundations'
const blockTitle = 'Основы машинного обучения'
const blockIcon = '04'

const mathId = 'ml-math-vectors-gradients'
const mathSteps: FlowStep[] = [
  theoryStep(`${mathId}-theory`, 'Векторы, матрицы и геометрия модели', 'Минимальная линейная алгебра без отрыва от кода.', [
    section('math-objects', 'Что лежит в X, y и параметрах', [
      'Вектор признаков x описывает один объект, матрица X собирает объекты по строкам и признаки по столбцам, вектор y хранит ответы. Shape — часть контракта: X имеет форму n×p, y — n, веса линейной модели — p.',
      'Скалярное произведение измеряет согласованность направлений и формирует линейный score. Норма задаёт длину, расстояние сравнивает объекты, а матричное умножение применяет линейное преобразование сразу ко всей выборке. Транспонирование меняет роли строк и столбцов, но не «переворачивает смысл» автоматически.',
    ], {
      table: { headers: ['Объект', 'Shape', 'Смысл'], rows: [
        ['x', '(p,)', 'признаки одного объекта'],
        ['X', '(n, p)', 'n объектов × p признаков'],
        ['w', '(p,)', 'веса признаков'],
        ['X @ w', '(n,)', 'score каждого объекта'],
      ] },
      callouts: [callout('Проверка перед fit', 'Печатайте X.shape, y.shape, число уникальных patient_id и долю target. Это обнаруживает ошибку раньше модели.', 'remember')],
    }),
  ]),
  {
    id: `${mathId}-formula`, type: 'formula', title: 'Операции, которые встречаются в моделях', summary: 'От dot product до шага по градиенту.',
    formulaCards: [
      { label: 'Скалярное произведение', expression: 'x^Tw=\\sum_{j=1}^{p}x_jw_j', meaning: 'Линейный score объекта.', notation: ['p — число признаков', 'w_j — вес признака'] },
      { label: 'Евклидова норма', expression: '\\lVert x\\rVert_2=\\sqrt{\\sum_jx_j^2}', meaning: 'Длина вектора; лежит в основе расстояний и L2-регуляризации.', notation: ['Норма не учитывает шкалы признаков сама'] },
      { label: 'Градиентный шаг', expression: '\\theta_{t+1}=\\theta_t-\\eta\\nabla_\\theta L', meaning: 'Параметры смещаются против направления роста loss.', notation: ['eta — learning rate', 'L — функция потерь'] },
    ],
  },
  {
    id: `${mathId}-examples`, type: 'worked-example', title: 'Четыре геометрических чтения', summary: 'Формула сразу связывается с алгоритмом.',
    workedExample: [
      { title: 'Логистическая регрессия', body: 'X@w+b создаёт logit, sigmoid переводит его в вероятность.' },
      { title: 'KMeans', body: 'Назначает объект ближайшему центроиду по расстоянию; масштаб признаков меняет геометрию.' },
      { title: 'SVM', body: 'w задаёт нормаль разделяющей гиперплоскости; норма w связана с margin.' },
      { title: 'Нейронный слой', body: 'Матрица весов одновременно строит несколько новых координат, затем применяется нелинейность.' },
    ],
  },
  {
    id: `${mathId}-code`, type: 'code', title: 'Shape и векторный прогноз', summary: 'Одна операция вместо цикла по пациентам.',
    codeExample: code('python', `import numpy as np

X = np.array([[2.0, 10.0], [4.0, 5.0], [1.0, 12.0]])
w = np.array([0.8, -0.1])
b = -0.3
scores = X @ w + b
probability = 1 / (1 + np.exp(-scores))
assert scores.shape == (X.shape[0],)
print(probability)`, undefined, 'assert фиксирует ожидаемый shape; broadcasting добавляет b каждому score.'),
  },
  assessment(mathId, 'Линейная алгебра ML: 7 вопросов', [
    singleQuestion('mm-q1', mathId, 'Какой shape у X для 548 пациентов и 12 признаков?', ['(548, 12)', '(12, 548)', '(548,)', '(12,)'], 0, 'Строки — объекты, столбцы — признаки.'),
    numericQuestion('mm-q2', mathId, 'Чему равно [1,2]·[3,4]?', 11, '1·3+2·4=11.', 0),
    trueFalseQuestion('mm-q3', mathId, 'Масштаб признаков влияет на евклидово расстояние.', true, 'Признак с крупной шкалой может доминировать.'),
    singleQuestion('mm-q4', mathId, 'Какой shape у X@w при X=(100,5), w=(5,)?', ['(100,)', '(5,)', '(100,5)', '(5,100)'], 0, 'Получается один score на объект.'),
    trueFalseQuestion('mm-q5', mathId, 'Градиент указывает направление самого быстрого роста loss.', true, 'Поэтому gradient descent идёт со знаком минус.'),
    singleQuestion('mm-q6', mathId, 'Что контролирует learning rate?', ['Размер шага параметров', 'Число признаков', 'Долю test', 'Класс target'], 0, 'Слишком большой шаг может вызвать расходимость.'),
    singleQuestion('mm-q7', mathId, 'Почему shape — часть контракта?', ['Ошибочная ориентация меняет смысл объектов и признаков', 'Он влияет только на печать', 'Он всегда исправляется sklearn', 'Он не важен'], 0, 'Модель не может угадать биологический смысл осей.'),
  ]),
  practiceStep(`${mathId}-practice-dot`, 'Практика 1: линейный score', 'Реализуйте dot product без NumPy.', makeStdinTask(
    'ml-dot-product', 'Скалярное произведение',
    'Первая строка x, вторая w. Выведите dot product с 2 знаками.',
    `# TODO: прочитайте два вектора
# TODO: перемножьте попарно и сложите`,
    [{ id: 'sample-1', description: 'Три признака', input: '1 2 3\n4 5 6\n', expectedOutput: '32.00' }],
    [{ id: 'hidden-1', description: 'Отрицательные веса', input: '2 -1\n3 4\n', expectedOutput: '2.00' }],
    `x = list(map(float, input().split()))
w = list(map(float, input().split()))
score = sum(a * b for a, b in zip(x, w))
print(f'{score:.2f}')`,
  )),
  practiceStep(`${mathId}-practice-gradient`, 'Практика 2: один gradient step', 'Свяжите знак градиента и обновление.', makeStdinTask(
    'ml-gradient-step', 'Шаг параметра',
    'Даны theta eta gradient. Выведите theta-eta*gradient с 3 знаками.',
    `# TODO: прочитайте три числа
# TODO: обновите параметр против градиента`,
    [{ id: 'sample-1', description: 'Положительный gradient', input: '5 0.1 4\n', expectedOutput: '4.600' }],
    [{ id: 'hidden-1', description: 'Отрицательный gradient', input: '2 0.25 -2\n', expectedOutput: '2.500' }],
    `theta, eta, gradient = map(float, input().split())
print(f'{theta - eta * gradient:.3f}')`,
  )),
  sourceStep(mathId, [researchSources.sklearnPipeline]),
]

const probabilityId = 'ml-probability-loss-bayes'
const probabilitySteps: FlowStep[] = [
  theoryStep(`${probabilityId}-theory`, 'Вероятность, likelihood и loss', 'Почему probability модели не равна факту.', [
    section('probability-core', 'Случайность данных и неопределённость прогноза', [
      'Вероятность события лежит от 0 до 1 и относится к определённой популяции и условиям. Условная вероятность P(Y|X) отвечает на вопрос о target при известных признаках. Базовая частота P(Y) важна: одинаковый sensitivity/specificity даёт разный positive predictive value при разной prevalence.',
      'Likelihood рассматривает наблюдаемые данные как функцию параметров модели. Обучение часто минимизирует negative log-likelihood: для бинарной классификации это log loss. Loss оптимизируется на train; метрика оценивает полезность на evaluation data и не обязана совпадать с loss.',
    ], {
      table: { headers: ['Понятие', 'Вопрос'], rows: [
        ['P(Y)', 'насколько исход част в целевой популяции?'],
        ['P(Y|X)', 'каков риск для объекта с признаками X?'],
        ['likelihood', 'насколько параметры согласованы с наблюдениями?'],
        ['loss', 'что именно оптимизирует алгоритм?'],
      ] },
      callouts: [callout('Калибровка', 'Прогноз 0.8 означает: среди похожих объектов примерно 80% должны иметь событие. Это не утверждение, что конкретный пациент «на 80% болен».', 'important')],
    }),
  ]),
  {
    id: `${probabilityId}-formula`, type: 'formula', title: 'Байес, sigmoid и log loss', summary: 'Три формулы prediction pipeline.',
    formulaCards: [
      { label: 'Bayes', expression: 'P(Y|X)=\\frac{P(X|Y)P(Y)}{P(X)}', meaning: 'Обновляет prior с учётом наблюдения.', notation: ['P(Y) — prior/prevalence', 'P(X|Y) — likelihood'] },
      { label: 'Sigmoid', expression: '\\sigma(z)=\\frac{1}{1+e^{-z}}', meaning: 'Переводит любой logit в диапазон (0,1).', notation: ['z=0 даёт 0.5'] },
      { label: 'Binary log loss', expression: '-[y\\log p+(1-y)\\log(1-p)]', meaning: 'Сильно штрафует уверенную ошибку вероятности.', notation: ['p — прогноз вероятности', 'y — 0 или 1'] },
    ],
  },
  {
    id: `${probabilityId}-examples`, type: 'worked-example', title: 'Три разных вероятностных вопроса', summary: 'Не смешиваем prevalence, risk и confidence interval.',
    workedExample: [
      { title: 'Prevalence', body: '369/548 — доля прогрессии в наблюдаемой Gamma Knife cohort, а не универсальная частота для всех клиник.' },
      { title: 'Individual risk', body: 'Model probability 0.65 требует проверки calibration в применимой population.' },
      { title: 'Uncertainty of metric', body: '95% CI AUC описывает неопределённость оценки качества, а не диапазон индивидуальных risks.' },
    ],
  },
  {
    id: `${probabilityId}-code`, type: 'code', title: 'Log loss и baseline prevalence', summary: 'Сравниваем модель с константной вероятностью.',
    codeExample: code('python', `import numpy as np
from sklearn.metrics import log_loss

y = np.array([1, 0, 1, 1, 0])
model_probability = np.array([0.8, 0.3, 0.7, 0.6, 0.2])
baseline_probability = np.repeat(y.mean(), len(y))
print('model', log_loss(y, model_probability))
print('prevalence baseline', log_loss(y, baseline_probability))`, undefined, 'Probability baseline честнее константного hard class для оценки log loss/Brier.'),
  },
  assessment(probabilityId, 'Вероятностное мышление: 8 вопросов', [
    singleQuestion('pb-q1', probabilityId, 'Что такое P(Y)?', ['Базовая частота исхода', 'Train loss', 'Список признаков', 'Размер fold'], 0, 'Это marginal probability/prevalence.'),
    trueFalseQuestion('pb-q2', probabilityId, 'Probability 0.8 гарантирует событие у конкретного объекта.', false, 'Это риск для группы похожих объектов при корректной модели.'),
    numericQuestion('pb-q3', probabilityId, 'Чему равна sigmoid(0)?', 0.5, '1/(1+1)=0.5.'),
    singleQuestion('pb-q4', probabilityId, 'Что особенно штрафует log loss?', ['Уверенную ошибку', 'Малое число признаков', 'Групповой split', 'Наличие ID'], 0, 'p≈0 для y=1 создаёт большой loss.'),
    trueFalseQuestion('pb-q5', probabilityId, 'Loss и публикационная primary metric обязаны совпадать.', false, 'Loss удобен для оптимизации, metric — для оценки задачи.'),
    singleQuestion('pb-q6', probabilityId, 'Почему prior важен?', ['PPV зависит от prevalence', 'Он меняет число строк X', 'Он удаляет leakage', 'Он выбирает seed'], 0, 'Predictive values зависят от базовой частоты.'),
    numericQuestion('pb-q7', probabilityId, 'В cohort 30 событий из 100. Prevalence?', 0.3, '30/100=0.3.'),
    singleQuestion('pb-q8', probabilityId, 'Что описывает CI для ROC-AUC?', ['Неопределённость оценки discrimination', 'Индивидуальный risk', 'Долю train', 'Probability каждого класса'], 0, 'CI относится к оценке метрики.'),
  ]),
  practiceStep(`${probabilityId}-practice-prevalence`, 'Практика 1: prevalence baseline', 'Посчитайте константную вероятность.', makeStdinTask(
    'ml-prevalence', 'Частота события', 'Дан ряд 0/1. Выведите prevalence с 3 знаками.',
    `# TODO: прочитайте outcomes
# TODO: вычислите среднее бинарных значений`,
    [{ id: 'sample-1', description: 'Три события', input: '1 0 1 1 0\n', expectedOutput: '0.600' }],
    [{ id: 'hidden-1', description: 'Нет событий', input: '0 0 0\n', expectedOutput: '0.000' }],
    `y = list(map(int, input().split()))
print(f'{sum(y) / len(y):.3f}')`,
  )),
  practiceStep(`${probabilityId}-practice-logloss`, 'Практика 2: log loss одного объекта', 'Поймите цену уверенной ошибки.', makeStdinTask(
    'ml-log-loss-one', 'Binary log loss', 'Даны y и p. Выведите -[y ln p +(1-y) ln(1-p)] с 3 знаками.',
    `# TODO: прочитайте y и p
# TODO: примените нужную ветвь логарифма`,
    [{ id: 'sample-1', description: 'Верный уверенный прогноз', input: '1 0.8\n', expectedOutput: '0.223' }],
    [{ id: 'hidden-1', description: 'Уверенная ошибка', input: '1 0.1\n', expectedOutput: '2.303' }],
    `import math
y, p = input().split()
y, p = int(y), float(p)
loss = -(y * math.log(p) + (1 - y) * math.log(1 - p))
print(f'{loss:.3f}')`,
  )),
  sourceStep(probabilityId, [researchSources.sklearnCalibration, researchSources.probastAi]),
]

const learningId = 'ml-overfit-learning-curves'
const learningSteps: FlowStep[] = [
  theoryStep(`${learningId}-theory`, 'Обобщение, bias–variance и learning curves', 'Train score — диагностика, не доказательство качества.', [
    section('generalization', 'Почему модель ошибается на новых данных', [
      'Underfitting означает, что модель или признаки не извлекают доступный сигнал: ошибки высоки и на train, и на validation. Overfitting — модель запомнила шум train: train score хорош, evaluation заметно хуже. Bias–variance — полезная схема причин, а не число, которое напрямую печатает sklearn.',
      'Learning curve строит train/validation score по мере роста обучающей выборки. Сходящиеся низкие кривые указывают на underfitting; большой gap, уменьшающийся с n, — на variance и потенциальную пользу дополнительных данных. Кривую строят по всей Pipeline и корректной CV-схеме.',
    ], { callouts: [callout('Для n=548', 'Сложность модели ограничивают сильнее: baseline, регуляризация, nested/group CV и bootstrap uncertainty важнее перебора десятков моделей.', 'example')] }),
  ]),
  {
    id: `${learningId}-examples`, type: 'worked-example', title: 'Четыре диагноза по кривым', summary: 'Следующий эксперимент выбирается по симптомам.',
    workedExample: [
      { title: 'Train≈validation и обе низкие', body: 'Добавьте информативные признаки, измените представление или увеличьте capacity.' },
      { title: 'Train высокий, validation низкий', body: 'Усильте regularization, упростите модель, проверьте leakage и соберите данные.' },
      { title: 'Validation растёт с n', body: 'Дополнительные независимые объекты, вероятно, помогут.' },
      { title: 'Fold сильно различаются', body: 'Проверьте группы, центры, class counts и distribution shift.' },
    ],
  },
  {
    id: `${learningId}-code`, type: 'code', title: 'Learning curve всей Pipeline', summary: 'Preprocessing переобучается внутри каждого fold.',
    codeExample: code('python', `from sklearn.model_selection import learning_curve, StratifiedGroupKFold
import numpy as np

cv = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
sizes, train_scores, valid_scores = learning_curve(
    pipeline, X, y, groups=patient_id, cv=cv,
    scoring='balanced_accuracy', train_sizes=np.linspace(0.2, 1.0, 5),
    n_jobs=-1,
)
summary = {'size': sizes,
           'train_mean': train_scores.mean(axis=1),
           'valid_mean': valid_scores.mean(axis=1)}
print(summary)`, undefined, 'Группы не должны пересекаться; одинаковая scoring используется для всех размеров.'),
  },
  theoryStep(`${learningId}-pitfalls`, 'Четыре ложных лечения overfitting', 'Не подменяйте diagnosis косметикой.', [
    section('overfit-pitfalls', 'Что не решает проблему само по себе', ['Новый random_state не создаёт независимую проверку; больше epochs без early stopping может ухудшить generalization; выбор лучшего fold создаёт selection bias; удаление сложных объектов после просмотра ошибок искажает population.'], {
      bullets: ['Сравнивайте среднее и разброс.', 'Замораживайте evaluation set.', 'Используйте один заранее заданный split protocol.', 'Проверяйте learning curve после исправления leakage.'],
    }),
  ]),
  assessment(learningId, 'Диагностика обучения: 7 вопросов', [
    singleQuestion('lc-q1', learningId, 'Train и validation низкие и близкие. Что вероятнее?', ['Underfitting', 'Leak-free perfection', 'External validation', 'Calibration'], 0, 'Модель не извлекает signal.'),
    singleQuestion('lc-q2', learningId, 'Train высокий, validation заметно ниже. Что вероятнее?', ['Overfitting', 'Идеальная generalization', 'Нулевая variance', 'Правильный threshold'], 0, 'Gap — симптом variance/overfit.'),
    trueFalseQuestion('lc-q3', learningId, 'Смена seed до получения хорошей метрики является честной validation.', false, 'Это скрытый подбор по validation.'),
    singleQuestion('lc-q4', learningId, 'Что строит learning curve по оси x?', ['Размер train subset', 'Threshold', 'Число классов', 'p-value'], 0, 'Она показывает влияние объёма данных.'),
    trueFalseQuestion('lc-q5', learningId, 'Learning curve должна включать preprocessing Pipeline.', true, 'Иначе preprocessing может обучиться вне fold.'),
    singleQuestion('lc-q6', learningId, 'Что проверить при сильном разбросе folds?', ['Группы, центры и class counts', 'Только цвет графика', 'Удалить худший fold', 'Выбрать другое название'], 0, 'Fold heterogeneity часто предметна.'),
    singleQuestion('lc-q7', learningId, 'Что особенно важно при небольшой cohort?', ['Регуляризация и uncertainty', 'Максимум моделей', 'Train accuracy', 'Удаление baseline'], 0, 'Малая выборка повышает variance оценки.'),
  ]),
  practiceStep(`${learningId}-practice-gap`, 'Практика: generalization gap', 'Классифицируйте симптом по двум scores.', makeStdinTask(
    'ml-generalization-gap', 'Диагноз кривых',
    'Даны train_score valid_score. Если обе <0.65 и gap<0.05 — UNDERFIT; если gap>=0.10 — OVERFIT; иначе CHECK.',
    `# TODO: прочитайте scores
# TODO: примените правила в указанном порядке`,
    [{ id: 'sample-1', description: 'Большой gap', input: '0.95 0.70\n', expectedOutput: 'OVERFIT' }],
    [{ id: 'hidden-1', description: 'Обе низкие', input: '0.60 0.58\n', expectedOutput: 'UNDERFIT' }],
    `train, valid = map(float, input().split())
gap = train - valid
if train < 0.65 and valid < 0.65 and gap < 0.05:
    result = 'UNDERFIT'
elif gap >= 0.10:
    result = 'OVERFIT'
else:
    result = 'CHECK'
print(result)`,
  )),
  sourceStep(learningId, [researchSources.sklearnLearningCurves, researchSources.probastAi]),
]

const splitId = 'ml-split-strategy-lab'
const splitSteps: FlowStep[] = [
  theoryStep(`${splitId}-theory`, 'Train, validation, evaluation и единица разбиения', 'Split должен имитировать применение модели.', [
    section('split-roles', 'Три роли данных и один главный запрет', [
      'Development data используются для построения решения: fit параметров, preprocessing, feature selection и hyperparameter tuning. Validation внутри development помогает выбрать pipeline. Evaluation data оценивают уже зафиксированный pipeline и не участвуют ни в одном выборе.',
      'Единица split должна соответствовать источнику зависимости: patient_id при повторных визитах, sequence cluster при белках, author/source при текстах, center при multicenter data, время при прогнозе будущего. Случайный split по строкам допустим только для независимых и обменных объектов.',
    ], {
      table: { headers: ['Структура данных', 'Корректная стратегия', 'Запрещённый shortcut'], rows: [
        ['Независимые объекты', 'random + stratify', 'подбор по evaluation'],
        ['Несколько строк на пациента', 'group split', 'пациент в обеих частях'],
        ['Клиники/города', 'leave-center-out / external center', 'смешать центр и назвать external'],
        ['Время', 'past→future', 'shuffle будущего в train'],
        ['Белки/тексты', 'cluster/source split', 'near duplicates в обеих частях'],
      ] },
      callouts: [callout('Терминология TRIPOD+AI', 'Чтобы избежать двусмысленности слова validation, отдельно называйте development data, tuning folds и evaluation data.', 'important')],
    }),
  ]),
  {
    id: `${splitId}-formula`, type: 'formula', title: 'Размеры и события в частях', summary: 'Доля строк недостаточна — контролируйте события и группы.',
    formulaCards: [
      { label: 'Полное разбиение', expression: 'D=D_{dev}\\cup D_{eval},\\quad D_{dev}\\cap D_{eval}=\\varnothing', meaning: 'Evaluation не пересекается с development.', notation: ['Пересечение проверяется по group ID, не только индексам строк'] },
      { label: 'Event count', expression: 'E_s=\\sum_{i\\in s}I(y_i=1)', meaning: 'Число событий в split s.', notation: ['Каждый fold должен позволять считать primary metric'] },
    ],
  },
  {
    id: `${splitId}-examples`, type: 'worked-example', title: 'Пять split-протоколов', summary: 'Выбор зависит от будущего deployment.',
    workedExample: [
      { title: 'Gamma Knife', body: 'Все процедуры одного patient_id остаются вместе; при наличии дат дополнительно тестируется temporal holdout.' },
      { title: 'ASPA', body: 'Архангельск/Новосибирск можно использовать как geographic evaluation, если вопрос — перенос между городами.' },
      { title: 'Cancer omics', body: 'Все samples одного case остаются вместе; independent study даёт внешнюю evaluation.' },
      { title: 'Protein ML', body: 'Sequence clusters/families целиком назначаются в folds.' },
      { title: 'Biomedical NLP', body: 'Документы одного пациента/автора/источника не разрываются между development и evaluation.' },
    ],
  },
  {
    id: `${splitId}-code`, type: 'code', title: 'Стратифицированный group holdout', summary: 'Сначала группы, затем строки.',
    codeExample: code('python', `from sklearn.model_selection import StratifiedGroupKFold

splitter = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
train_idx, eval_idx = next(splitter.split(X, y, groups=patient_id))
assert set(patient_id.iloc[train_idx]).isdisjoint(patient_id.iloc[eval_idx])
assert set(train_idx).isdisjoint(eval_idx)
X_dev, X_eval = X.iloc[train_idx], X.iloc[eval_idx]
y_dev, y_eval = y.iloc[train_idx], y.iloc[eval_idx]`, undefined, 'Для одного holdout берётся один fold; для CV перебираются все folds.'),
  },
  theoryStep(`${splitId}-pitfalls`, 'Почему 80/20 не является универсальным правилом', 'Пропорция не заменяет дизайн.', [
    section('split-pitfalls', 'Шесть решений до генерации индексов', ['Определите target population, единицу независимости, момент прогноза, внешний источник, число событий и primary metric. При малом n простой 20% holdout может дать слишком широкий CI; тогда внутреннюю оценку строят через bootstrap/nested CV, а внешнюю cohort сохраняют отдельно.'], {
      bullets: ['Не делите до дедупликации ID.', 'Не используйте evaluation для выбора threshold.', 'Не называйте random holdout внешней validation.', 'Сохраняйте split assignments как artifact.'],
    }),
  ]),
  assessment(splitId, 'Split strategy: 9 вопросов', [
    singleQuestion('sp-q1', splitId, 'Где выбирают hyperparameters?', ['В development/tuning folds', 'На evaluation', 'После submission', 'На случайной строке'], 0, 'Evaluation не участвует в выборе.'),
    singleQuestion('sp-q2', splitId, 'Что группирует повторные процедуры?', ['patient_id', 'Номер строки', 'Target', 'Prediction'], 0, 'Зависимые записи пациента остаются вместе.'),
    trueFalseQuestion('sp-q3', splitId, 'Random 80/20 всегда является внешней validation.', false, 'Это internal holdout из той же data source.'),
    singleQuestion('sp-q4', splitId, 'Как проверить перенос между городами?', ['Hold out целый город', 'Перемешать города', 'Удалить city', 'Выбрать лучший seed'], 0, 'Это имитирует новую geography.'),
    trueFalseQuestion('sp-q5', splitId, 'Feature selection может использовать evaluation y.', false, 'Это прямое contamination.'),
    singleQuestion('sp-q6', splitId, 'Что сохранять как artifact?', ['Назначение group→split/fold', 'Только итоговую AUC', 'Только список признаков', 'Screenshot'], 0, 'Это делает split воспроизводимым.'),
    singleQuestion('sp-q7', splitId, 'Как делить protein sequences?', ['По clusters/families', 'Случайно по строкам всегда', 'По длине accession', 'По target'], 0, 'Так снижается homology leakage.'),
    trueFalseQuestion('sp-q8', splitId, 'Temporal split обучается на прошлом и оценивается на будущем.', true, 'Порядок соответствует прогнозу.'),
    singleQuestion('sp-q9', splitId, 'Что важнее фиксированной доли test?', ['Независимость и достаточное число событий', 'Круглое число строк', 'Одинаковый filename', 'Число цветов'], 0, 'Дизайн определяется оценимым вопросом.'),
  ]),
  practiceStep(`${splitId}-practice-groups`, 'Практика 1: group overlap', 'Найдите нарушение независимости.', makeStdinTask(
    'ml-split-group-overlap', 'Пересечение групп', 'Две строки: groups development и evaluation. Выведите общие groups по алфавиту или CLEAN.',
    `# TODO: прочитайте два множества
# TODO: найдите пересечение`,
    [{ id: 'sample-1', description: 'Один patient пересёк границу', input: 'p1 p2 p3\np3 p4\n', expectedOutput: 'p3' }],
    [{ id: 'hidden-1', description: 'Чистый split', input: 'a b\nc d\n', expectedOutput: 'CLEAN' }],
    `development = set(input().split())
evaluation = set(input().split())
overlap = sorted(development & evaluation)
print(' '.join(overlap) if overlap else 'CLEAN')`,
  )),
  practiceStep(`${splitId}-practice-time`, 'Практика 2: temporal audit', 'Проверьте chronology.', makeStdinTask(
    'ml-temporal-split-audit', 'Прошлое и будущее', 'Первая строка годы train, вторая годы evaluation. Выведите VALID, если max(train)<min(eval), иначе LEAK.',
    `# TODO: прочитайте годы
# TODO: сравните границу времени`,
    [{ id: 'sample-1', description: 'Корректный future holdout', input: '2018 2019 2020\n2021 2022\n', expectedOutput: 'VALID' }],
    [{ id: 'hidden-1', description: 'Перемешанное время', input: '2019 2021\n2020 2022\n', expectedOutput: 'LEAK' }],
    `train_years = list(map(int, input().split()))
evaluation_years = list(map(int, input().split()))
print('VALID' if max(train_years) < min(evaluation_years) else 'LEAK')`,
  )),
  sourceStep(splitId, [researchSources.sklearnValidation, researchSources.tripOd, researchSources.probastAi]),
]

const cvId = 'ml-cross-validation-oof'
const cvSteps: FlowStep[] = [
  theoryStep(`${cvId}-theory`, 'Cross-validation, OOF и repeated evaluation', 'CV оценивает procedure, а не создаёт несколько независимых datasets.', [
    section('cv-system', 'Что происходит в каждом fold', [
      'K-fold последовательно оставляет один fold для оценки, а остальные используют для fit. StratifiedKFold сохраняет class proportions, GroupKFold разделяет группы, StratifiedGroupKFold стремится сделать и то и другое, TimeSeriesSplit уважает порядок времени. Выбор splitter — часть предметного дизайна.',
      'OOF prediction каждого объекта получен моделью, которая не обучалась на нём. OOF useful для общей confusion matrix, calibration curve и error analysis. Однако preprocessing, feature selection, resampling и tuning должны повторяться внутри fold; иначе OOF перестаёт быть честным.',
    ], {
      table: { headers: ['Splitter', 'Когда'], rows: [
        ['KFold', 'независимая regression'],
        ['StratifiedKFold', 'classification без групп'],
        ['GroupKFold', 'patient/source clusters'],
        ['StratifiedGroupKFold', 'class balance + groups'],
        ['TimeSeriesSplit', 'past→future с expanding window'],
      ] },
    }),
  ]),
  {
    id: `${cvId}-formula`, type: 'formula', title: 'Среднее, разброс и OOF', summary: 'Одного mean недостаточно.',
    formulaCards: [
      { label: 'CV mean', expression: '\\bar{Q}=\\frac{1}{K}\\sum_{k=1}^{K}Q_k', meaning: 'Средняя оценка по folds.', notation: ['Folds зависимы, поэтому mean±SD не является автоматически 95% CI'] },
      { label: 'OOF coverage', expression: '\\forall i\\;\\exists!\\;k: i\\in V_k', meaning: 'Каждый объект ровно один раз служит validation в одном повторе K-fold.', notation: ['При repeated CV объект имеет несколько OOF predictions'] },
    ],
  },
  {
    id: `${cvId}-examples`, type: 'worked-example', title: 'Пять схем CV', summary: 'Схема подчиняется структуре данных.',
    workedExample: [
      { title: '5-fold stratified', body: 'Базовая classification при независимых объектах и достаточных events.' },
      { title: 'Repeated stratified', body: 'Оценивает чувствительность к нескольким случайным partitions, но не заменяет external data.' },
      { title: 'Group CV', body: 'Все визиты пациента остаются в одном fold.' },
      { title: 'Leave-one-center-out', body: 'Каждый центр по очереди имитирует external geography.' },
      { title: 'Nested CV', body: 'Inner folds выбирают hyperparameters; outer folds оценивают всю процедуру.' },
    ],
  },
  {
    id: `${cvId}-code`, type: 'code', title: 'Несколько метрик и OOF probabilities', summary: 'Evaluation сохраняется на уровне объекта.',
    codeExample: code('python', `from sklearn.model_selection import cross_validate, cross_val_predict

scoring = {'ba': 'balanced_accuracy', 'roc_auc': 'roc_auc', 'pr_auc': 'average_precision'}
scores = cross_validate(pipeline, X, y, groups=patient_id, cv=cv,
                        scoring=scoring, return_train_score=True, n_jobs=-1)
oof_probability = cross_val_predict(
    pipeline, X, y, groups=patient_id, cv=cv, method='predict_proba', n_jobs=-1
)[:, 1]
oof = metadata[['patient_id']].assign(y=y, probability=oof_probability)
oof.to_csv('artifacts/oof_predictions.csv', index=False)`, undefined, 'cross_val_predict не используется для подбора на тех же OOF без дополнительного уровня оценки.'),
  },
  theoryStep(`${cvId}-pitfalls`, 'CV-ошибки, которые завышают статью', 'Повторение folds не исправляет leakage.', [
    section('cv-pitfalls', 'Семь проверок', ['Splitter соответствует unit of independence; class counts достаточны; transform/selection/resampling находятся в Pipeline; tuning отделён inner loop; OOF не используется повторно для оптимизации без учёта; evaluation cohort не тронута; fold-level failures не удаляются.'], {
      bullets: ['Не выдавайте SD folds за CI без обоснования.', 'Не выбирайте лучший fold.', 'Не усредняйте patient duplicates как независимые.', 'Сохраняйте indices каждого fold.'],
    }),
  ]),
  assessment(cvId, 'CV и OOF: 9 вопросов', [
    singleQuestion('cv-q1', cvId, 'Что гарантирует OOF для объекта?', ['Модель не обучалась на этом объекте', 'External validation', 'Идеальную calibration', 'Отсутствие bias'], 0, 'Это internal resampling prediction.'),
    singleQuestion('cv-q2', cvId, 'Какой splitter для повторов пациента?', ['GroupKFold', 'KFold по строкам', 'ShuffleSplit без groups', 'LeavePOut строк'], 0, 'Группа не разрывается.'),
    trueFalseQuestion('cv-q3', cvId, 'Repeated CV заменяет независимую external cohort.', false, 'Все repeats используют тот же источник данных.'),
    singleQuestion('cv-q4', cvId, 'Где происходит feature selection?', ['В Pipeline внутри fold', 'До CV по всему y', 'На evaluation', 'После публикации'], 0, 'Иначе validation labels влияют на features.'),
    singleQuestion('cv-q5', cvId, 'Что делает outer loop nested CV?', ['Оценивает процедуру tuning', 'Выбирает финальный threshold на test', 'Создаёт labels', 'Удаляет missing'], 0, 'Inner loop подбирает, outer оценивает.'),
    trueFalseQuestion('cv-q6', cvId, 'Mean±SD folds автоматически является 95% CI.', false, 'Fold estimates зависимы и K обычно мало.'),
    singleQuestion('cv-q7', cvId, 'Зачем сохранять OOF probabilities?', ['Пересчитывать metrics/calibration/errors', 'Переобучать на evaluation', 'Скрывать folds', 'Удалять IDs'], 0, 'Это аудируемый prediction artifact.'),
    trueFalseQuestion('cv-q8', cvId, 'Fold с ошибкой обучения можно молча удалить.', false, 'Это selective reporting.'),
    singleQuestion('cv-q9', cvId, 'Что определяет выбор cv?', ['Структура зависимости и deployment', 'Любимое число', 'Цвет target', 'Размер шрифта'], 0, 'CV — часть дизайна.'),
  ]),
  practiceStep(`${cvId}-practice-oof`, 'Практика 1: OOF coverage', 'Каждый объект должен иметь prediction.', makeStdinTask(
    'ml-oof-coverage', 'Покрытие OOF', 'Первая строка ожидаемые IDs, вторая IDs с predictions. Выведите missing IDs или COMPLETE.',
    `# TODO: сравните два множества
# TODO: выведите missing детерминированно`,
    [{ id: 'sample-1', description: 'Один пропуск', input: 'p1 p2 p3\np1 p3\n', expectedOutput: 'p2' }],
    [{ id: 'hidden-1', description: 'Полное покрытие', input: 'a b\nb a\n', expectedOutput: 'COMPLETE' }],
    `expected = set(input().split())
predicted = set(input().split())
missing = sorted(expected - predicted)
print(' '.join(missing) if missing else 'COMPLETE')`,
  )),
  practiceStep(`${cvId}-practice-fold-events`, 'Практика 2: события по folds', 'Найдите fold без positive cases.', makeStdinTask(
    'ml-fold-event-audit', 'Пустой positive fold', 'Даны pairs fold:y. Выведите folds без y=1 по возрастанию или OK.',
    `# TODO: соберите labels по fold
# TODO: найдите folds без события`,
    [{ id: 'sample-1', description: 'Fold 1 без событий', input: '0:1 0:0 1:0 1:0 2:1\n', expectedOutput: '1' }],
    [{ id: 'hidden-1', description: 'В каждом есть событие', input: '0:1 1:1 2:1\n', expectedOutput: 'OK' }],
    `folds = {}
for token in input().split():
    fold, y = map(int, token.split(':'))
    folds.setdefault(fold, []).append(y)
empty = [fold for fold in sorted(folds) if sum(folds[fold]) == 0]
print(' '.join(map(str, empty)) if empty else 'OK')`,
  )),
  theoryStep(`${cvId}-recap`, 'CV-протокол для Methods', 'Что описать одной воспроизводимой схемой.', [
    section('cv-methods', 'Минимальный отчёт', ['Назовите splitter, K/repeats, shuffle/seed, grouping variable, stratification, все operations внутри fold, tuning loop, scoring, aggregation, uncertainty и сохранение OOF. Для external evaluation отдельно опишите data source и отсутствие участия в development.'], {
      bullets: ['Приложите diagram folds.', 'Сохраните split manifest.', 'Публикуйте fold-level scores, а не только mean.'],
    }),
  ]),
  sourceStep(cvId, [researchSources.sklearnValidation, researchSources.tripOd, researchSources.probastAi]),
]

const tuningId = 'ml-hyperparameter-nested-search'
const tuningSteps: FlowStep[] = [
  theoryStep(`${tuningId}-theory`, 'Hyperparameters, search space и nested CV', 'Tuning — эксперимент с собственным риском overfit.', [
    section('tuning-core', 'Что выбирает search', [
      'Параметры модели обучаются fit, hyperparameters задают структуру или regularization до fit. Search space должен быть предметно разумным и включать baseline/default. Grid перебирает декартово произведение, random search эффективнее при многих малозначимых измерениях, Bayesian/Optuna использует историю trials.',
      'Scoring, CV splitter, budget, early stopping/pruning и tie-break фиксируются заранее. Если search и оценка выполняются на одних folds, best score оптимистичен. Nested CV отделяет inner selection от outer evaluation; final model затем refit на всём development с правилом выбора hyperparameters.',
    ], {
      table: { headers: ['Метод', 'Сильная сторона', 'Риск'], rows: [
        ['Grid', 'полный малый grid', 'взрыв комбинаций'],
        ['Random', 'широкий budget', 'пропустить узкую область'],
        ['Optuna/Bayesian', 'адаптивный поиск/pruning', 'ещё больше скрытых решений'],
      ] },
    }),
  ]),
  {
    id: `${tuningId}-examples`, type: 'worked-example', title: 'Четыре пространства поиска', summary: 'Каждый параметр имеет шкалу и границы.',
    workedExample: [
      { title: 'LogisticRegression C', body: 'Ищут по log scale, например 1e-3…1e3; линейная шкала плохо покрывает порядки.' },
      { title: 'Tree depth', body: 'Небольшие целые значения и None; глубина напрямую управляет variance.' },
      { title: 'Learning rate', body: 'Связан с числом estimators/epochs; параметры нельзя интерпретировать независимо.' },
      { title: 'Class weight/threshold', body: 'Weights обучают модель, threshold выбирает решение; оптимизируются на разных этапах.' },
    ],
  },
  {
    id: `${tuningId}-code`, type: 'code', title: 'Nested search с группами', summary: 'Outer score не используется inner optimizer.',
    codeExample: code('python', `from sklearn.model_selection import GridSearchCV, StratifiedGroupKFold, cross_validate

inner = StratifiedGroupKFold(n_splits=4, shuffle=True, random_state=11)
outer = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=42)
search = GridSearchCV(
    pipeline,
    {'model__C': [0.01, 0.1, 1, 10, 100]},
    scoring='balanced_accuracy', cv=inner, n_jobs=-1, refit=True,
)
outer_result = cross_validate(
    search, X, y, groups=patient_id, cv=outer,
    scoring=['balanced_accuracy', 'roc_auc'], return_estimator=True,
)
print(outer_result['test_balanced_accuracy'])`, undefined, 'При сложных groups иногда нужен ручной outer loop, чтобы передать inner groups явно и сохранить trials.'),
  },
  theoryStep(`${tuningId}-pitfalls`, 'Search overfitting и researcher degrees of freedom', 'Больше trials не всегда лучше для статьи.', [
    section('tuning-pitfalls', 'Как поиск становится утечкой', ['Смена primary metric после результатов, многократный перезапуск search с разными seeds, ручное расширение grid вокруг удачного evaluation, выбор threshold на external data и отчёт только лучшего trial превращают evaluation в development.'], {
      bullets: ['Сохраняйте все trials.', 'Задавайте budget до запуска.', 'Используйте nested CV.', 'Сравнивайте с default/baseline.', 'Не подбирайте параметры, не влияющие на результат.'],
    }),
  ]),
  assessment(tuningId, 'Tuning без самообмана: 8 вопросов', [
    singleQuestion('tu-q1', tuningId, 'Чем parameter отличается от hyperparameter?', ['Parameter учится fit; hyperparameter задаётся до fit', 'Ничем', 'Hyperparameter всегда target', 'Parameter выбирается test'], 0, 'Это разные уровни обучения.'),
    singleQuestion('tu-q2', tuningId, 'Когда GridSearch удобен?', ['Малый дискретный grid', 'Миллион комбинаций', 'Отсутствие metric', 'Только NLP'], 0, 'Grid полный, но дорогой.'),
    trueFalseQuestion('tu-q3', tuningId, 'Best inner-CV score является независимой оценкой final performance.', false, 'Он использован для выбора.'),
    singleQuestion('tu-q4', tuningId, 'Что делает outer nested CV?', ['Оценивает search procedure', 'Подбирает threshold на test', 'Создаёт feature names', 'Удаляет groups'], 0, 'Outer folds не участвуют в inner selection.'),
    trueFalseQuestion('tu-q5', tuningId, 'Search budget и primary metric следует зафиксировать заранее.', true, 'Это уменьшает скрытые степени свободы.'),
    singleQuestion('tu-q6', tuningId, 'Как задавать C/learning rate?', ['Часто по log scale', 'Только линейно 1,2,3', 'По target IDs', 'По evaluation y'], 0, 'Их эффект меняется по порядкам.'),
    singleQuestion('tu-q7', tuningId, 'Что хранить?', ['Все trials/configs/scores', 'Только победителя', 'Только screenshot', 'Только train loss'], 0, 'Полная история необходима для reproducibility.'),
    trueFalseQuestion('tu-q8', tuningId, 'Threshold и model hyperparameters всегда выбираются одним и тем же способом.', false, 'Threshold относится к decision rule и требует validation/utility.'),
  ]),
  practiceStep(`${tuningId}-practice-grid`, 'Практика 1: размер grid', 'Оцените вычислительный бюджет.', makeStdinTask(
    'ml-grid-size', 'Число fits', 'Даны размеры списков параметров и K folds. Выведите combinations и fits=combinations*K.',
    `# TODO: прочитайте размеры и K
# TODO: перемножьте размеры search space`,
    [{ id: 'sample-1', description: '3×4 grid и 5 folds', input: '3 4\n5\n', expectedOutput: '12 60' }],
    [{ id: 'hidden-1', description: 'Три параметра', input: '2 3 2\n4\n', expectedOutput: '12 48' }],
    `sizes = list(map(int, input().split()))
k = int(input())
combinations = 1
for size in sizes:
    combinations *= size
print(combinations, combinations * k)`,
  )),
  practiceStep(`${tuningId}-practice-select`, 'Практика 2: детерминированный выбор', 'Tie-break должен быть описан.', makeStdinTask(
    'ml-trial-select', 'Лучший trial', 'Даны name:score. Выведите максимальный score; при равенстве — лексикографически меньший name.',
    `# TODO: разберите trials
# TODO: примените фиксированный tie-break`,
    [{ id: 'sample-1', description: 'Явный лучший', input: 'a:0.7 b:0.8 c:0.75\n', expectedOutput: 'b' }],
    [{ id: 'hidden-1', description: 'Равные scores', input: 'z:0.8 a:0.8\n', expectedOutput: 'a' }],
    `trials = [item.rsplit(':', 1) for item in input().split()]
best = max(float(score) for _, score in trials)
print(sorted(name for name, score in trials if float(score) == best)[0])`,
  )),
  theoryStep(`${tuningId}-recap`, 'Search protocol', 'Запишите до первого trial.', [
    section('tuning-protocol', 'Девять полей', ['Estimator/Pipeline, parameter distributions, bounds/scales, conditional parameters, sampler, pruner/early stopping, CV/groups, primary scoring, budget, seed и tie-break. Рядом укажите default baseline и правило refit final model.'], {
      bullets: ['Не расширяйте search по external score.', 'Храните trial table.', 'Отдельно оценивайте final procedure.'],
    }),
  ]),
  sourceStep(tuningId, [researchSources.sklearnValidation, researchSources.optuna, researchSources.probastAi]),
]

const pipelineId = 'ml-preprocessing-feature-selection'
const pipelineSteps: FlowStep[] = [
  theoryStep(`${pipelineId}-theory`, 'Preprocessing, ColumnTransformer и feature selection', 'Все обучаемые преобразования принадлежат Pipeline.', [
    section('pipeline-core', 'Разные типы данных — разные ветви', [
      'Числа обычно проходят validation диапазона, имputation и иногда scaling; категории — imputation и encoding; текст — TF-IDF/embeddings; omics — фильтрацию и feature selection. ColumnTransformer соединяет ветви в одну матрицу, Pipeline связывает их с model.',
      'fit вычисляет medians, vocabularies, categories, scaling statistics и selected features только на текущем train fold. transform применяет уже найденные параметры. Смешивание fit_transform до split — систематическая утечка независимо от наличия target.',
    ], {
      table: { headers: ['Шаг', 'Что учится'], rows: [
        ['SimpleImputer', 'median/mode'],
        ['StandardScaler', 'mean/std train'],
        ['OneHotEncoder', 'categories'],
        ['TfidfVectorizer', 'vocabulary + IDF'],
        ['SelectKBest/RFE', 'выбранные features'],
      ] },
    }),
  ]),
  {
    id: `${pipelineId}-examples`, type: 'worked-example', title: 'Пять pipelines по типу данных', summary: 'Архитектура соответствует модальности.',
    workedExample: [
      { title: 'Clinical table', body: 'numeric imputer+scaler, categorical imputer+one-hot, затем logistic/boosting.' },
      { title: 'Counts/omics', body: 'domain normalization вне sklearn по чёткому protocol; supervised selection внутри CV.' },
      { title: 'Sparse text', body: 'TfidfVectorizer→linear model, with_mean=False при scaling sparse.' },
      { title: 'Protein embeddings', body: 'versioned embeddings→scaler/head; cluster split задаётся отдельно.' },
      { title: 'Mixed data', body: 'ColumnTransformer объединяет clinical, text и precomputed embeddings без ручного merge по позиции.' },
    ],
  },
  {
    id: `${pipelineId}-code`, type: 'code', title: 'Полный mixed-type Pipeline', summary: 'Feature names и unknown categories сохраняются.',
    codeExample: code('python', `from sklearn.compose import ColumnTransformer
from sklearn.feature_selection import SelectPercentile, mutual_info_classif
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

numeric = Pipeline([('impute', SimpleImputer(strategy='median')),
                    ('scale', StandardScaler())])
categorical = Pipeline([('impute', SimpleImputer(strategy='most_frequent')),
                        ('encode', OneHotEncoder(handle_unknown='ignore'))])
prep = ColumnTransformer([('num', numeric, numeric_cols),
                          ('cat', categorical, categorical_cols)])
pipeline = Pipeline([('prep', prep),
                     ('select', SelectPercentile(mutual_info_classif, percentile=50)),
                     ('model', LogisticRegression(max_iter=2000))])`, undefined, 'Supervised selector получает y только внутри fit каждого fold.'),
  },
  theoryStep(`${pipelineId}-pitfalls`, 'Missingness, rare categories и high-dimensional data', 'Правило preprocessing меняет estimand.', [
    section('pipeline-pitfalls', 'Неочевидные решения', ['Missing может быть информативным: добавляйте indicators по plan. Категория «other» должна определяться на train. One-hot с редкими levels увеличивает variance. В p≫n supervised feature selection особенно легко переобучается и обязана быть nested. Для dates исходное значение обычно превращают в интервалы относительно index date.'], {
      bullets: ['Сохраняйте input schema.', 'Проверяйте unknown categories.', 'Не imputе target.', 'Не нормализуйте ID.', 'Не отбирайте genes до CV.'],
    }),
  ]),
  assessment(pipelineId, 'Pipeline-аудит: 9 вопросов', [
    singleQuestion('pp-q1', pipelineId, 'Где fit imputer?', ['На train fold', 'На всей таблице', 'На evaluation', 'После Results'], 0, 'Median/mode не должны видеть evaluation.'),
    trueFalseQuestion('pp-q2', pipelineId, 'TfidfVectorizer учит vocabulary и IDF.', true, 'Поэтому он должен быть внутри Pipeline.'),
    singleQuestion('pp-q3', pipelineId, 'Что делает handle_unknown="ignore"?', ['Позволяет transform unseen categories', 'Удаляет target', 'Исправляет leakage', 'Выбирает metric'], 0, 'Новые categories дают нулевые one-hot columns.'),
    trueFalseQuestion('pp-q4', pipelineId, 'Supervised gene selection до CV допустим, если genes очень важны.', false, 'Он использует validation labels.'),
    singleQuestion('pp-q5', pipelineId, 'Что делает ColumnTransformer?', ['Применяет разные ветви к колонкам', 'Создаёт folds', 'Считает AUC', 'Публикует PR'], 0, 'Он объединяет preprocessing модальностей.'),
    singleQuestion('pp-q6', pipelineId, 'Как обрабатывать dates для прогноза?', ['Интервалы относительно index date', 'Случайные числа', 'Как target', 'Удалить временную логику'], 0, 'Так сохраняется causal ordering.'),
    trueFalseQuestion('pp-q7', pipelineId, 'ID пациента является обычным numeric feature.', false, 'Это identifier/group, не биологический predictor.'),
    singleQuestion('pp-q8', pipelineId, 'Что сохранять?', ['Input schema и feature names после transform', 'Только model.pkl', 'Только mean score', 'Только raw Excel'], 0, 'Это нужно для audit/deployment.'),
    trueFalseQuestion('pp-q9', pipelineId, 'Missing indicator иногда может нести signal.', true, 'Но это может отражать process-of-care и требует interpretation.'),
  ]),
  practiceStep(`${pipelineId}-practice-columns`, 'Практика 1: назначение колонок', 'Разделите schema по типам.', makeStdinTask(
    'ml-column-routing', 'Маршрутизация типов', 'Даны pairs name:type, type=num/cat/text/id. Выведите имена num, затем cat, затем text; id пропустите. Каждая группа через |.',
    `# TODO: разберите schema
# TODO: сохраните порядок внутри типа`,
    [{ id: 'sample-1', description: 'Смешанная schema', input: 'age:num sex:cat note:text patient:id volume:num\n', expectedOutput: 'age volume|sex|note' }],
    [{ id: 'hidden-1', description: 'Без текста', input: 'x:num group:cat id:id\n', expectedOutput: 'x|group|' }],
    `groups = {'num': [], 'cat': [], 'text': []}
for token in input().split():
    name, kind = token.rsplit(':', 1)
    if kind in groups:
        groups[kind].append(name)
print('|'.join(' '.join(groups[kind]) for kind in ['num', 'cat', 'text']))`,
  )),
  practiceStep(`${pipelineId}-practice-impute`, 'Практика 2: median train', 'Evaluation не участвует в статистике.', makeStdinTask(
    'ml-train-median-impute', 'Train-only median', 'Первая строка train числа/NA, вторая evaluation числа/NA. Замените NA evaluation медианой train и выведите с 1 знаком.',
    `# TODO: вычислите median только известных train
# TODO: transform evaluation`,
    [{ id: 'sample-1', description: 'Evaluation с NA', input: '1 3 5 NA\nNA 10\n', expectedOutput: '3.0 10.0' }],
    [{ id: 'hidden-1', description: 'Чётный train', input: '2 4 NA 8\nNA NA\n', expectedOutput: '4.0 4.0' }],
    `train = sorted(float(x) for x in input().split() if x != 'NA')
evaluation = input().split()
n = len(train)
median = train[n // 2] if n % 2 else (train[n // 2 - 1] + train[n // 2]) / 2
result = [median if x == 'NA' else float(x) for x in evaluation]
print(' '.join(f'{x:.1f}' for x in result))`,
  )),
  practiceStep(`${pipelineId}-practice-feature-selection`, 'Практика 3: top-k без утечки кода', 'Реализуйте детерминированный selector по готовым train scores.', makeStdinTask(
    'ml-topk-features', 'Top-k features', 'Первая строка k. Далее name:score. Выведите k имён по score убыванию, при равенстве по имени.',
    `# TODO: прочитайте k и scores
# TODO: примените детерминированную сортировку`,
    [{ id: 'sample-1', description: 'Три признака', input: '2\nage:0.3 volume:0.8 sex:0.1\n', expectedOutput: 'volume age' }],
    [{ id: 'hidden-1', description: 'Tie', input: '2\nb:0.5 a:0.5 c:0.2\n', expectedOutput: 'a b' }],
    `k = int(input())
items = []
for token in input().split():
    name, score = token.rsplit(':', 1)
    items.append((name, float(score)))
items.sort(key=lambda item: (-item[1], item[0]))
print(' '.join(name for name, _ in items[:k]))`,
  )),
  theoryStep(`${pipelineId}-recap`, 'Definition of done Pipeline', 'Один объект должен воспроизводить путь от raw row к prediction.', [
    section('pipeline-done', 'Контрольный список', ['Pipeline принимает schema-compatible DataFrame, проверяет/преобразует типы, обучает все statistics внутри fit, обрабатывает unknown categories, хранит feature names, сериализуется вместе с versions и выдаёт probability до threshold. Splitter и threshold хранятся рядом, но не маскируются внутри preprocessing.'], {
      bullets: ['Test на unseen category.', 'Test на пропуски.', 'Test на порядок колонок.', 'Test на одинаковый prediction после reload.'],
    }),
  ]),
  sourceStep(pipelineId, [researchSources.sklearnPipeline, researchSources.sklearnFeatureSelection, researchSources.probastAi]),
]

const uncertaintyId = 'ml-uncertainty-calibration-utility'
const uncertaintySteps: FlowStep[] = [
  theoryStep(`${uncertaintyId}-theory`, 'Uncertainty, calibration и clinical utility', 'Discrimination — только одна часть evaluation.', [
    section('evaluation-dimensions', 'Четыре измерения prediction model', [
      'Overall accuracy вероятностей оценивают Brier/log loss, discrimination — ROC-AUC/PR-AUC, calibration — intercept/slope и curve, clinical utility — net benefit при диапазоне thresholds. Hard-class metrics описывают один decision threshold и зависят от prevalence и цены ошибок.',
      'Confidence intervals строят на независимой единице: bootstrap patients, не строки. В nested CV uncertainty должна отражать весь pipeline selection. Calibration лучше показывать curve вместе с distribution predicted risks; небольшие sample sizes требуют осторожного binning/smoothing.',
    ], {
      table: { headers: ['Вопрос', 'Инструмент'], rows: [
        ['Ранжирует?', 'ROC-AUC / PR-AUC'],
        ['Верны probabilities?', 'calibration curve, intercept, slope, Brier'],
        ['Что при threshold?', 'sensitivity, specificity, PPV, NPV'],
        ['Полезно ли решение?', 'decision curve / net benefit'],
      ] },
    }),
  ]),
  {
    id: `${uncertaintyId}-formula`, type: 'formula', title: 'Brier, calibration slope и net benefit', summary: 'Метрики отвечают на разные вопросы.',
    formulaCards: [
      { label: 'Brier score', expression: '\\frac{1}{n}\\sum_i(p_i-y_i)^2', meaning: 'Квадратичная ошибка probabilities.', notation: ['Меньше — лучше; зависит от prevalence'] },
      { label: 'Calibration model', expression: 'logit(P(Y=1))=a+b\\cdot logit(p)', meaning: 'a — calibration-in-the-large, b — slope.', notation: ['b<1 часто указывает на слишком экстремальные predictions'] },
      { label: 'Net benefit', expression: '\\frac{TP}{n}-\\frac{FP}{n}\\frac{p_t}{1-p_t}', meaning: 'Баланс пользы TP и вреда FP при threshold p_t.', notation: ['Сравнивается с treat-all/treat-none'] },
    ],
  },
  {
    id: `${uncertaintyId}-examples`, type: 'worked-example', title: 'Четыре модели с одинаковой AUC', summary: 'Ranking не определяет usefulness.',
    workedExample: [
      { title: 'Overconfident', body: 'Верно ранжирует, но predictions 0.99/0.01 слишком экстремальны; slope<1.' },
      { title: 'Underconfident', body: 'Risks сжаты к prevalence; ranking сохранён, calibration slope может быть >1.' },
      { title: 'Shifted prevalence', body: 'Calibration intercept меняется при новой base rate даже при похожей AUC.' },
      { title: 'No net benefit', body: 'Высокая AUC может не давать преимущества в clinically relevant threshold range.' },
    ],
  },
  {
    id: `${uncertaintyId}-code`, type: 'code', title: 'Bootstrap CI по пациентам', summary: 'Resampling сохраняет зависимость внутри group.',
    codeExample: code('python', `import numpy as np
from sklearn.metrics import roc_auc_score

rng = np.random.default_rng(42)
patients = oof['patient_id'].unique()
boot_auc = []
for _ in range(2000):
    sampled = rng.choice(patients, size=len(patients), replace=True)
    sample = oof.set_index('patient_id').loc[sampled].reset_index()
    if sample['y'].nunique() == 2:
        boot_auc.append(roc_auc_score(sample['y'], sample['probability']))
ci = np.quantile(boot_auc, [0.025, 0.975])
print(ci)`, undefined, 'При нескольких строках на patient нужна cluster bootstrap с корректным восстановлением всех строк группы.'),
  },
  theoryStep(`${uncertaintyId}-pitfalls`, 'Метрики, CI и threshold: где ошибаются статьи', 'Красивый ROC plot не закрывает evaluation.', [
    section('evaluation-pitfalls', 'Семь пропусков', ['Нет CI; threshold выбран на evaluation; calibration не показана; PR-AUC отсутствует при редком классе; bootstrap ресемплирует строки вместо пациентов; subgroup metrics без counts/uncertainty; decision curve трактуется без клинически допустимого threshold range.'], {
      bullets: ['Публикуйте denominator.', 'Показывайте distribution risks.', 'Отделяйте threshold selection от evaluation.', 'Не сравнивайте AUC без CI и paired resampling.'],
    }),
  ]),
  assessment(uncertaintyId, 'Полная evaluation: 8 вопросов', [
    singleQuestion('uc-q1', uncertaintyId, 'Что оценивает calibration?', ['Соответствие probabilities observed frequency', 'Только ranking', 'Число features', 'Скорость fit'], 0, 'Probability 0.3 должна соответствовать примерно 30% outcomes.'),
    trueFalseQuestion('uc-q2', uncertaintyId, 'Высокая ROC-AUC гарантирует clinical utility.', false, 'Utility зависит от threshold и consequences.'),
    singleQuestion('uc-q3', uncertaintyId, 'Как bootstrap повторные визиты?', ['На уровне patient', 'По строкам независимо', 'По features', 'По folds без IDs'], 0, 'Независимая единица — patient.'),
    singleQuestion('uc-q4', uncertaintyId, 'Что значит slope<1?', ['Predictions часто слишком экстремальны', 'Идеальная calibration', 'Нет outcome', 'AUC=0'], 0, 'Это типичный overfit pattern.'),
    trueFalseQuestion('uc-q5', uncertaintyId, 'Threshold можно выбирать по final evaluation data.', false, 'Он является частью development decision rule.'),
    singleQuestion('uc-q6', uncertaintyId, 'С чем сравнивают decision curve?', ['Treat-all и treat-none', 'Только train score', 'Только AIC', 'Только prevalence'], 0, 'Net benefit должен превосходить разумные alternatives.'),
    trueFalseQuestion('uc-q7', uncertaintyId, 'Subgroup metric без n и CI легко переинтерпретировать.', true, 'Малые subgroup дают imprecision.'),
    singleQuestion('uc-q8', uncertaintyId, 'Что показать при редком positive class?', ['PR-AUC вместе с ROC-AUC', 'Только accuracy', 'Только R²', 'Только train loss'], 0, 'PR-AUC чувствительнее к precision/recall.'),
  ]),
  practiceStep(`${uncertaintyId}-practice-brier`, 'Практика 1: Brier score', 'Оцените probabilities напрямую.', makeStdinTask(
    'ml-brier-score', 'Средняя квадратичная ошибка probabilities', 'Первая строка y, вторая p. Выведите Brier с 3 знаками.',
    `# TODO: прочитайте y и p
# TODO: усредните squared errors`,
    [{ id: 'sample-1', description: 'Три predictions', input: '1 0 1\n0.8 0.2 0.6\n', expectedOutput: '0.080' }],
    [{ id: 'hidden-1', description: 'Идеально', input: '1 0\n1 0\n', expectedOutput: '0.000' }],
    `y = list(map(int, input().split()))
p = list(map(float, input().split()))
score = sum((a - b) ** 2 for a, b in zip(y, p)) / len(y)
print(f'{score:.3f}')`,
  )),
  practiceStep(`${uncertaintyId}-practice-net-benefit`, 'Практика 2: net benefit', 'Свяжите threshold с ценой FP.', makeStdinTask(
    'ml-net-benefit', 'Net benefit', 'Даны TP FP n threshold. Выведите net benefit с 3 знаками.',
    `# TODO: прочитайте четыре числа
# TODO: примените threshold odds`,
    [{ id: 'sample-1', description: 'Clinical threshold 0.2', input: '30 10 100 0.2\n', expectedOutput: '0.275' }],
    [{ id: 'hidden-1', description: 'Нет FP', input: '20 0 100 0.5\n', expectedOutput: '0.200' }],
    `tp, fp, n, threshold = map(float, input().split())
net_benefit = tp / n - fp / n * threshold / (1 - threshold)
print(f'{net_benefit:.3f}')`,
  )),
  sourceStep(uncertaintyId, [researchSources.sklearnCalibration, researchSources.tripOd, researchSources.probastAi]),
]

const inspectionId = 'ml-interpretability-error-fairness'
const inspectionSteps: FlowStep[] = [
  theoryStep(`${inspectionId}-theory`, 'Интерпретация, error analysis и fairness', 'Объяснение модели не является объяснением болезни.', [
    section('inspection-levels', 'Глобальное, локальное и предметное', [
      'Коэффициенты линейной модели, permutation importance, partial dependence/ICE и SHAP отвечают на разные вопросы. Correlated features делят/переносят importance; impurity importance деревьев смещена к high-cardinality; PDP экстраполирует в редкие combinations; local explanations зависят от background/reference.',
      'Error analysis связывает false positives/negatives с data quality, subgroups, uncertainty и workflow. Fairness evaluation начинается с заранее мотивированных групп, counts, calibration и error rates с CI; механическое выравнивание одной метрики не гарантирует справедливость или клиническую пользу.',
    ], {
      table: { headers: ['Инструмент', 'Вопрос', 'Ограничение'], rows: [
        ['Coefficient', 'направление linear association', 'scale/correlation'],
        ['Permutation importance', 'падение score при разрушении feature', 'correlated substitutes'],
        ['PDP/ICE', 'изменение prediction по feature', 'нереалистичные combinations'],
        ['SHAP', 'распределение prediction относительно reference', 'не causal effect'],
      ] },
      callouts: [callout('Фраза для статьи', '«Признак был важен для прогнозов модели» допустимо; «признак вызывает прогрессию» из feature importance не следует.', 'important')],
    }),
  ]),
  {
    id: `${inspectionId}-examples`, type: 'worked-example', title: 'Пять уровней анализа ошибок', summary: 'От отдельной строки до deployment context.',
    workedExample: [
      { title: 'Label audit', body: 'Проверить ambiguous/incorrect outcomes среди high-confidence errors.' },
      { title: 'Missingness', body: 'Сравнить errors при наличии/отсутствии ключевых measurements.' },
      { title: 'Subgroups', body: 'Sex, age, diagnosis, center — только с n, prevalence и CI.' },
      { title: 'Temporal drift', body: 'Метрики по годам лечения/публикации протокола.' },
      { title: 'Uncertainty', body: 'Ошибки при probabilities около threshold и extreme wrong predictions анализируются отдельно.' },
    ],
  },
  {
    id: `${inspectionId}-code`, type: 'code', title: 'Permutation importance на evaluation', summary: 'Primary metric и repeats заданы явно.',
    codeExample: code('python', `from sklearn.inspection import permutation_importance

result = permutation_importance(
    fitted_pipeline, X_eval, y_eval,
    scoring='balanced_accuracy', n_repeats=50, random_state=42, n_jobs=-1,
)
importance = sorted(zip(feature_names, result.importances_mean,
                        result.importances_std), key=lambda row: row[1], reverse=True)
for name, mean, std in importance[:15]:
    print(name, mean, std)`, undefined, 'Evaluation importance описывает зависимость performance от feature в этой cohort; это не causal inference.'),
  },
  theoryStep(`${inspectionId}-pitfalls`, 'Fairness без tokenism', 'Subgroup table должна отвечать на риск применения.', [
    section('fairness-pitfalls', 'Что проверить до вывода', ['Группа биологически/социально мотивирована; sample size достаточен; labels измерены сопоставимо; prevalence и access-to-care различия описаны; uncertainty показана; threshold policy явна; вред ошибки обсуждён с предметным экспертом.'], {
      bullets: ['Не публикуйте unstable ranking малых groups.', 'Не скрывайте missing group labels.', 'Не подменяйте fairness одной parity metric.', 'Не используйте protected attribute как causal explanation автоматически.'],
    }),
  ]),
  assessment(inspectionId, 'Интерпретация и ошибки: 9 вопросов', [
    trueFalseQuestion('in-q1', inspectionId, 'Feature importance доказывает causal effect.', false, 'Она описывает модель и данные.'),
    singleQuestion('in-q2', inspectionId, 'Что измеряет permutation importance?', ['Падение score после перемешивания feature', 'p-value причинности', 'Размер sample', 'Calibration intercept'], 0, 'Feature signal разрушается при сохранении остальных.'),
    trueFalseQuestion('in-q3', inspectionId, 'Correlated features могут скрывать importance друг друга.', true, 'Одна заменяет другую.'),
    singleQuestion('in-q4', inspectionId, 'Что требуется для subgroup metric?', ['n, prevalence, metric и CI', 'Только цвет', 'Только mean age', 'Только p<0.05'], 0, 'Без denominator/uncertainty сравнение опасно.'),
    singleQuestion('in-q5', inspectionId, 'Что анализировать среди ошибок?', ['Labels, missingness, groups, time, confidence', 'Только красивые examples', 'Только TP', 'Только train'], 0, 'Это системный error analysis.'),
    trueFalseQuestion('in-q6', inspectionId, 'PDP всегда показывает реалистичные combinations признаков.', false, 'Он может изменять feature вне observed joint distribution.'),
    singleQuestion('in-q7', inspectionId, 'Как корректно писать вывод?', ['Feature связан с predictions модели', 'Feature вызывает outcome', 'Model доказала механизм', 'SHAP заменяет trial'], 0, 'Формулировка соответствует observational prediction.'),
    trueFalseQuestion('in-q8', inspectionId, 'Одинаковая error rate во всех groups автоматически означает справедливость.', false, 'Нужны context, harm и label/access quality.'),
    singleQuestion('in-q9', inspectionId, 'Где считать permutation importance?', ['На независимой evaluation/OOF по plan', 'На той же train без оговорки', 'До fit', 'На target IDs'], 0, 'Иначе importance отражает apparent fit.'),
  ]),
  practiceStep(`${inspectionId}-practice-subgroup`, 'Практика 1: subgroup confusion', 'Считайте sensitivity по группам.', makeStdinTask(
    'ml-subgroup-sensitivity', 'Sensitivity групп',
    'Даны записи group:y:pred. Выведите group:sensitivity с 2 знаками по алфавиту; groups без positive выведите NA.',
    `# TODO: соберите TP/FN по group
# TODO: обработайте отсутствие positives`,
    [{ id: 'sample-1', description: 'Две группы', input: 'A:1:1 A:1:0 A:0:0 B:1:1 B:1:1\n', expectedOutput: 'A:0.50 B:1.00' }],
    [{ id: 'hidden-1', description: 'Группа без positives', input: 'A:0:0 B:1:0\n', expectedOutput: 'A:NA B:0.00' }],
    `stats = {}
for token in input().split():
    group, y, pred = token.split(':')
    y, pred = int(y), int(pred)
    tp, positives = stats.get(group, (0, 0))
    stats[group] = (tp + int(y == 1 and pred == 1), positives + int(y == 1))
output = []
for group in sorted(stats):
    tp, positives = stats[group]
    output.append(f'{group}:{tp / positives:.2f}' if positives else f'{group}:NA')
print(' '.join(output))`,
  )),
  practiceStep(`${inspectionId}-practice-errors`, 'Практика 2: high-confidence errors', 'Найдите приоритетные records для label audit.', makeStdinTask(
    'ml-high-confidence-errors', 'Ошибочные extreme probabilities', 'Даны id:y:p. Выведите IDs, где y=1,p<=0.1 или y=0,p>=0.9, по порядку; иначе NONE.',
    `# TODO: разберите records
# TODO: найдите extreme wrong predictions`,
    [{ id: 'sample-1', description: 'Два приоритетных случая', input: 'a:1:0.05 b:0:0.95 c:1:0.6\n', expectedOutput: 'a b' }],
    [{ id: 'hidden-1', description: 'Нет extreme errors', input: 'x:1:0.7 y:0:0.2\n', expectedOutput: 'NONE' }],
    `errors = []
for token in input().split():
    record_id, y, p = token.split(':')
    y, p = int(y), float(p)
    if (y == 1 and p <= 0.1) or (y == 0 and p >= 0.9):
        errors.append(record_id)
print(' '.join(errors) if errors else 'NONE')`,
  )),
  theoryStep(`${inspectionId}-recap`, 'Раздел Error analysis в статье', 'Описывайте систему, не анекдоты.', [
    section('error-report', 'Минимум для supplement', ['Definition error categories, blinded label review procedure, subgroup denominators, prevalence, metric+CI, missingness pattern, temporal/center breakdown, extreme errors и связь с intended use. Любое post-hoc открытие маркируется exploratory и не превращается в новый primary claim.'], {
      bullets: ['Приложите machine-readable error table без персональных данных.', 'Отделите model error от label uncertainty.', 'Сформулируйте mitigation и external test.'],
    }),
  ]),
  sourceStep(inspectionId, [researchSources.sklearnInspection, researchSources.tripOd, researchSources.probastAi]),
]

export const mlMasteryTopics = [
  researchTopic({ id: mathId, title: '4.10 Математика ML: векторы, матрицы и градиенты', order: 10, summary: 'Shape, dot product, нормы, линейные преобразования и gradient descent прямо в моделях.', blockId, blockTitle, blockIcon, format: 'геометрический разбор + 2 вычисления', estimatedMinutes: 85, quizQuestions: 7, practiceTasks: 2, examples: 5, terminology: ['vector', 'matrix', 'dot product', 'norm', 'gradient'], formulas: ['xᵀw', 'L2 norm', 'gradient step'], cheatsheet: ['X: n объектов × p признаков.', 'Gradient descent идёт против градиента.'], sources: [researchSources.sklearnPipeline], steps: mathSteps }),
  researchTopic({ id: probabilityId, title: '4.11 Вероятность, likelihood, loss и Bayes', order: 11, summary: 'Prevalence, conditional probability, sigmoid, log loss и разница loss/metric.', blockId, blockTitle, blockIcon, format: 'вероятностная лаборатория + 2 задачи', estimatedMinutes: 90, quizQuestions: 8, practiceTasks: 2, examples: 4, terminology: ['prevalence', 'conditional probability', 'likelihood', 'logit', 'log loss'], formulas: ['Bayes', 'sigmoid', 'binary log loss'], cheatsheet: ['Probability требует calibration.', 'Loss оптимизируется; metric оценивает.'], sources: [researchSources.sklearnCalibration], steps: probabilitySteps }),
  researchTopic({ id: learningId, title: '4.12 Overfitting, bias–variance и learning curves', order: 12, summary: 'Диагностируем underfit/overfit, generalization gap и пользу дополнительных данных.', blockId, blockTitle, blockIcon, format: 'диагностика кривых', estimatedMinutes: 70, quizQuestions: 7, practiceTasks: 1, examples: 5, terminology: ['generalization', 'underfitting', 'overfitting', 'bias', 'variance', 'learning curve'], cheatsheet: ['Train score — диагностика.', 'Learning curve строится для всей Pipeline.'], sources: [researchSources.sklearnLearningCurves], steps: learningSteps }),
  researchTopic({ id: splitId, title: '4.13 Split strategy: random, stratified, group, center и time', order: 13, summary: 'Выбираем единицу split и отделяем development/tuning от независимой evaluation.', blockId, blockTitle, blockIcon, format: 'пять предметных split-кейсов + 2 аудита', estimatedMinutes: 105, quizQuestions: 9, practiceTasks: 2, examples: 6, terminology: ['development data', 'evaluation data', 'holdout', 'group split', 'temporal split'], formulas: ['disjoint sets', 'event count'], cheatsheet: ['Split имитирует deployment.', 'Проверяйте пересечение по group ID.'], sources: [researchSources.tripOd, researchSources.probastAi], steps: splitSteps }),
  researchTopic({ id: cvId, title: '4.14 Cross-validation, OOF и repeated evaluation', order: 14, summary: 'KFold/StratifiedGroup/TimeSeries, OOF predictions, fold artifacts и nested layer.', blockId, blockTitle, blockIcon, format: 'архитектура folds + 2 проверки', estimatedMinutes: 110, quizQuestions: 9, practiceTasks: 2, examples: 6, terminology: ['fold', 'OOF', 'GroupKFold', 'repeated CV', 'nested CV'], formulas: ['CV mean', 'OOF coverage'], cheatsheet: ['OOF prediction получен unseen model.', 'SD folds не равен автоматически CI.'], sources: [researchSources.sklearnValidation], steps: cvSteps }),
  researchTopic({ id: tuningId, title: '4.15 Hyperparameter tuning, Optuna и nested CV', order: 15, summary: 'Search spaces, budgets, Grid/Random/Bayesian search, pruning и защита от search overfit.', blockId, blockTitle, blockIcon, format: 'search protocol + 2 budget-задачи', estimatedMinutes: 100, quizQuestions: 8, practiceTasks: 2, examples: 5, terminology: ['hyperparameter', 'search space', 'trial', 'pruning', 'nested CV'], cheatsheet: ['Budget и scoring фиксируются заранее.', 'Outer loop оценивает search procedure.'], sources: [researchSources.optuna], steps: tuningSteps }),
  researchTopic({ id: pipelineId, title: '4.16 Preprocessing, ColumnTransformer и feature selection', order: 16, summary: 'Mixed data, train-only statistics, input schema, high-dimensional selection и три кодовых практики.', blockId, blockTitle, blockIcon, format: 'Pipeline-конструктор + 3 практики', estimatedMinutes: 120, quizQuestions: 9, practiceTasks: 3, examples: 6, terminology: ['fit/transform', 'ColumnTransformer', 'imputation', 'encoding', 'feature selection'], cheatsheet: ['Все обучаемые transforms внутри fold.', 'ID — group, не predictor.'], sources: [researchSources.sklearnPipeline, researchSources.sklearnFeatureSelection], steps: pipelineSteps }),
  researchTopic({ id: uncertaintyId, title: '4.17 Uncertainty, calibration и clinical utility', order: 17, summary: 'Brier, calibration slope/intercept, bootstrap CI, threshold и decision curve.', blockId, blockTitle, blockIcon, format: 'полная evaluation + 2 расчёта', estimatedMinutes: 105, quizQuestions: 8, practiceTasks: 2, examples: 5, terminology: ['Brier score', 'calibration slope', 'bootstrap CI', 'threshold', 'net benefit'], formulas: ['Brier', 'calibration model', 'net benefit'], cheatsheet: ['AUC не заменяет calibration.', 'Bootstrap выполняют по независимой единице.'], sources: [researchSources.sklearnCalibration, researchSources.tripOd], steps: uncertaintySteps }),
  researchTopic({ id: inspectionId, title: '4.18 Интерпретация, error analysis и fairness', order: 18, summary: 'Permutation importance, PDP/SHAP limits, subgroup metrics, label audit и честные выводы.', blockId, blockTitle, blockIcon, format: 'model audit + 2 error-практики', estimatedMinutes: 105, quizQuestions: 9, practiceTasks: 2, examples: 6, terminology: ['permutation importance', 'PDP', 'SHAP', 'error analysis', 'fairness'], cheatsheet: ['Importance не доказывает causality.', 'Subgroup metric публикуется с n и CI.'], sources: [researchSources.sklearnInspection, researchSources.probastAi], steps: inspectionSteps }),
]
