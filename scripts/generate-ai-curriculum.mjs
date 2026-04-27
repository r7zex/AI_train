import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const sourceLinks = [
  {
    label: 'Google Machine Learning Crash Course',
    type: 'course',
    why: 'Модульная структура, интерактивные упражнения, метрики, данные, регуляризация и практический порядок изучения ML.',
    url: 'https://developers.google.com/machine-learning/crash-course/',
  },
  {
    label: 'Stanford CS229',
    type: 'course',
    why: 'Широкая карта машинного обучения: supervised learning, neural networks, model selection, practical advice и learning theory.',
    url: 'https://cs229.stanford.edu/syllabus-spring2022.html',
  },
  {
    label: 'Stanford CS231n Notes',
    type: 'course',
    why: 'Логика изучения loss-функций, оптимизации, MLP, CNN, batch normalization, dropout и практики обучения сетей.',
    url: 'https://cs231n.github.io/',
  },
  {
    label: 'PyTorch Optimization Tutorial',
    type: 'docs',
    why: 'Канонический train loop: model.train, loss.backward, optimizer.step, optimizer.zero_grad и validation/test loop.',
    url: 'https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html',
  },
  {
    label: 'XGBoost sklearn estimator',
    type: 'docs',
    why: 'Практическая схема eval_set, early_stopping_rounds и ручного разделения данных для бустинга.',
    url: 'https://xgboost.readthedocs.io/en/release_2.1.0/python/sklearn_estimator.html',
  },
  {
    label: 'CatBoost fit documentation',
    type: 'docs',
    why: 'Параметры fit, eval_set, cat_features, use_best_model и overfitting detector в CatBoost.',
    url: 'https://catboost.ai/docs/en/concepts/python-reference_catboost_fit',
  },
]

const S = (...parts) => ({ __joinSpace: parts })
const C = (code) => ({ __joinNewline: code.trim().split('\n') })

function concept(slug, title, formula, params, kind, domain) {
  return { slug, title, formula, params, kind, domain }
}

const topics = [
  {
    id: 'python-functions-for-ml',
    title: '1.1 Python-функции как основа ML-пайплайна',
    blockId: 'python-ml',
    blockTitle: 'Python для машинного обучения',
    blockIcon: '01',
    subblockId: 'python-foundations',
    subblockTitle: 'Функции, данные и воспроизводимость',
    level: 'junior',
    summary: 'Учимся писать функции так, чтобы подготовка данных, метрики и эксперименты были проверяемыми и переиспользуемыми.',
    concepts: [
      concept('pure-function', 'Чистая функция обработки признаков', 'f(x) = y, где одинаковый x всегда даёт одинаковый y', ['data', 'columns', 'return_copy'], 'python', 'подготовки данных'),
      concept('type-hints', 'Аннотации типов для учебных ML-функций', 'signature: input types -> output type', ['values', 'threshold', 'return_type'], 'python', 'проверяемого Python-кода'),
      concept('assertions', 'Проверки assert для входных данных', 'assert condition, message', ['condition', 'message', 'shape'], 'python', 'защиты пайплайна от тихих ошибок'),
    ],
  },
  {
    id: 'data-ingestion-splits',
    title: '2.1 Данные, датасеты и честные разбиения',
    blockId: 'data',
    blockTitle: 'Данные и preprocessing',
    blockIcon: '02',
    subblockId: 'data-basics',
    subblockTitle: 'Загрузка, признаки и split',
    level: 'junior',
    summary: 'Разбираем, как устроить dataset, features, target, train/validation/test и почему порядок операций важнее красивой модели.',
    concepts: [
      concept('read-csv', 'Загрузка таблицы через read_csv', 'D = {(x_i, y_i)}_{i=1}^{n}', ['filepath', 'sep', 'encoding', 'usecols'], 'pandas', 'табличных данных'),
      concept('train-test-split', 'train_test_split для holdout-валидации', 'D = D_train ∪ D_val ∪ D_test, пересечения пусты', ['test_size', 'random_state', 'stratify', 'shuffle'], 'sklearn-split', 'разделения датасета'),
      concept('random-state', 'random_state и воспроизводимость эксперимента', 'seed -> deterministic pseudo-random sequence', ['random_state', 'seed', 'shuffle'], 'sklearn-split', 'экспериментального контроля'),
    ],
  },
  {
    id: 'missing-values-outliers',
    title: '2.2 Пропуски, выбросы и устойчивые признаки',
    blockId: 'data',
    blockTitle: 'Данные и preprocessing',
    blockIcon: '02',
    subblockId: 'data-cleaning',
    subblockTitle: 'Очистка данных',
    level: 'junior',
    summary: 'Покрываем заполнение пропусков, индикаторы пропусков и обработку выбросов без утечки информации из validation/test.',
    concepts: [
      concept('simple-imputer', 'SimpleImputer для заполнения пропусков', 'x_missing -> statistic(X_train_column)', ['strategy', 'fill_value', 'add_indicator'], 'preprocess', 'очистки таблиц'),
      concept('missing-indicator', 'Индикатор пропуска как отдельный признак', 'm_i = 1 если x_i отсутствует, иначе 0', ['features', 'error_on_new', 'sparse'], 'preprocess', 'сохранения сигнала о пропусках'),
      concept('iqr-clipping', 'IQR-обработка выбросов', '[Q1 - 1.5 IQR, Q3 + 1.5 IQR]', ['lower_quantile', 'upper_quantile', 'multiplier'], 'preprocess', 'устойчивой очистки числовых признаков'),
    ],
  },
  {
    id: 'categorical-encoding',
    title: '2.3 Категориальные признаки: OHE, ordinal и target encoding',
    blockId: 'data',
    blockTitle: 'Данные и preprocessing',
    blockIcon: '02',
    subblockId: 'encoding',
    subblockTitle: 'Кодирование категорий',
    level: 'junior+',
    summary: 'Показываем, как превращать категории в числа и почему некоторые кодировки легко создают leakage.',
    concepts: [
      concept('one-hot-encoder', 'OneHotEncoder для независимых категорий', 'category c_j -> vector e_j', ['handle_unknown', 'drop', 'sparse_output', 'min_frequency'], 'preprocess', 'категориальных таблиц'),
      concept('ordinal-encoder', 'OrdinalEncoder для упорядоченных категорий', 'low < medium < high -> 0 < 1 < 2', ['categories', 'handle_unknown', 'unknown_value'], 'preprocess', 'ранговых признаков'),
      concept('target-encoding', 'Target encoding с защитой от leakage', 'enc(c) = mean(y | category=c) на train-fold', ['smoothing', 'cv', 'min_samples_leaf'], 'preprocess', 'высококардинальных категорий'),
    ],
  },
  {
    id: 'scaling-normalization',
    title: '2.4 Масштабирование и нормализация признаков',
    blockId: 'data',
    blockTitle: 'Данные и preprocessing',
    blockIcon: '02',
    subblockId: 'scaling',
    subblockTitle: 'Числовые преобразования',
    level: 'junior',
    summary: 'Разбираем StandardScaler, MinMaxScaler, RobustScaler и правило fit только на train.',
    concepts: [
      concept('standard-scaler', 'StandardScaler и z-score нормализация', 'z = (x - μ_train) / σ_train', ['with_mean', 'with_std', 'copy'], 'preprocess', 'линейных моделей и нейросетей'),
      concept('minmax-scaler', 'MinMaxScaler для ограниченного диапазона', 'x_scaled = (x - min) / (max - min)', ['feature_range', 'clip', 'copy'], 'preprocess', 'моделей с чувствительными диапазонами'),
      concept('robust-scaler', 'RobustScaler против выбросов', 'x_scaled = (x - median) / IQR', ['with_centering', 'with_scaling', 'quantile_range'], 'preprocess', 'шумных числовых данных'),
    ],
  },
  {
    id: 'pipelines-leakage',
    title: '2.5 Pipelines, ColumnTransformer и борьба с leakage',
    blockId: 'data',
    blockTitle: 'Данные и preprocessing',
    blockIcon: '02',
    subblockId: 'pipelines',
    subblockTitle: 'Безопасная сборка признаков',
    level: 'junior+',
    summary: 'Собираем preprocessing и модель в единый объект, чтобы split, cross-validation и production использовали одинаковую логику.',
    concepts: [
      concept('pipeline', 'Pipeline как контракт fit/transform/predict', 'model(x) = estimator(transformer(x))', ['steps', 'memory', 'verbose'], 'pipeline', 'production-ready обучения'),
      concept('column-transformer', 'ColumnTransformer для разных типов колонок', 'X -> concat(T_num(X_num), T_cat(X_cat))', ['transformers', 'remainder', 'sparse_threshold'], 'pipeline', 'смешанных таблиц'),
      concept('data-leakage', 'Data leakage как методологическая ошибка', 'val_information ∩ train_fit должно быть пустым', ['split_first', 'fit_on_train', 'holdout_policy'], 'pipeline', 'честной оценки моделей'),
    ],
  },
  {
    id: 'baseline-models',
    title: '3.1 Baseline-модели: dummy, линейная и логистическая регрессия',
    blockId: 'classic-ml',
    blockTitle: 'Классический ML',
    blockIcon: '03',
    subblockId: 'baselines',
    subblockTitle: 'Первые модели',
    level: 'junior',
    summary: 'Строим простые базовые модели, чтобы понимать, выигрывает ли сложный алгоритм у честного ориентира.',
    concepts: [
      concept('dummy-classifier', 'DummyClassifier как минимальный baseline', 'ŷ = most_frequent(y_train) или stratified sample', ['strategy', 'random_state', 'constant'], 'model', 'контроля здравого смысла'),
      concept('linear-regression', 'LinearRegression для численного прогноза', 'ŷ = w^T x + b', ['fit_intercept', 'positive', 'copy_X'], 'model', 'регрессии'),
      concept('logistic-regression', 'LogisticRegression для классификации', 'p(y=1|x)=σ(w^T x + b)', ['C', 'penalty', 'solver', 'class_weight', 'max_iter'], 'model', 'бинарной и мультиклассовой классификации'),
    ],
  },
  {
    id: 'metrics-classification-regression',
    title: '4.1 Метрики: от confusion matrix до PR-AUC и RMSE',
    blockId: 'metrics',
    blockTitle: 'Метрики и оценка качества',
    blockIcon: '04',
    subblockId: 'metric-selection',
    subblockTitle: 'Выбор метрик',
    level: 'junior+',
    summary: 'Учимся выбирать метрику под задачу, дисбаланс, цену ошибки и тип целевой переменной.',
    concepts: [
      concept('confusion-matrix', 'Confusion matrix как основа классификационных метрик', '[[TN, FP], [FN, TP]]', ['labels', 'normalize', 'sample_weight'], 'metrics', 'диагностики классификации'),
      concept('precision-recall-f1', 'Precision, Recall и F1 при дисбалансе', 'F1 = 2PR / (P + R)', ['average', 'pos_label', 'zero_division'], 'metrics', 'поиска редких событий'),
      concept('roc-pr-auc', 'ROC-AUC и PR-AUC для ранжирования', 'AUC = ∫ TPR(FPR) dFPR или ∫ Precision(Recall) dRecall', ['y_score', 'average', 'max_fpr'], 'metrics', 'пороговых классификаторов'),
      concept('regression-metrics', 'MAE, MSE и RMSE для регрессии', 'RMSE = sqrt(mean((y - ŷ)^2))', ['squared', 'multioutput', 'sample_weight'], 'metrics', 'численного прогноза'),
    ],
  },
  {
    id: 'validation-cross-bootstrap',
    title: '4.2 Валидация: cross-validation, bootstrap и time split',
    blockId: 'metrics',
    blockTitle: 'Метрики и оценка качества',
    blockIcon: '04',
    subblockId: 'validation',
    subblockTitle: 'Надёжная оценка',
    level: 'junior+',
    summary: 'Обязательно разбираем KFold, StratifiedKFold, TimeSeriesSplit и bootstrap confidence interval.',
    concepts: [
      concept('kfold', 'KFold cross-validation', 'score = mean(score_1, ..., score_k)', ['n_splits', 'shuffle', 'random_state'], 'validation', 'оценки устойчивости'),
      concept('stratified-kfold', 'StratifiedKFold для дисбаланса классов', 'p_fold(y=c) ≈ p_dataset(y=c)', ['n_splits', 'shuffle', 'random_state'], 'validation', 'классификации с редкими классами'),
      concept('time-series-split', 'TimeSeriesSplit для временных данных', 'train_t < validation_t', ['n_splits', 'gap', 'test_size', 'max_train_size'], 'validation', 'временных рядов'),
      concept('bootstrap-ci', 'Bootstrap confidence interval', 'CI = quantile(statistic(sample_with_replacement))', ['n_resamples', 'confidence_level', 'random_state'], 'validation', 'оценки неопределённости'),
    ],
  },
  {
    id: 'balancing-augmentation',
    title: '5.1 Балансировка классов и увеличение выборки',
    blockId: 'data-advanced',
    blockTitle: 'Улучшение данных',
    blockIcon: '05',
    subblockId: 'sampling',
    subblockTitle: 'Sampling и augmentation',
    level: 'junior+',
    summary: 'Сравниваем class_weight, oversampling, undersampling, SMOTE-идею и augmentation без подглядывания в validation.',
    concepts: [
      concept('class-weight', 'class_weight для стоимости ошибок', 'L = Σ w_y * loss(y, ŷ)', ['class_weight', 'sample_weight', 'balanced'], 'sampling', 'дисбалансной классификации'),
      concept('oversampling', 'Oversampling меньшинства', 'D_train_new = D_majority ∪ repeat(D_minority)', ['sampling_strategy', 'random_state', 'replacement'], 'sampling', 'малых редких классов'),
      concept('undersampling', 'Undersampling большинства', 'D_train_new ⊂ D_majority ∪ D_minority', ['sampling_strategy', 'random_state', 'replacement'], 'sampling', 'ускорения обучения на больших классах'),
      concept('augmentation', 'Data augmentation для изображений и текста', 'x_aug = T(x), y_aug = y', ['transforms', 'probability', 'strength', 'seed'], 'sampling', 'увеличения обучающей выборки'),
    ],
  },
  {
    id: 'knn-naive-bayes-svm',
    title: '6.1 kNN, Naive Bayes и SVM',
    blockId: 'classic-ml',
    blockTitle: 'Классический ML',
    blockIcon: '06',
    subblockId: 'classic-models',
    subblockTitle: 'Нелинейные baseline',
    level: 'junior+',
    summary: 'Показываем три семейства моделей, которые полезны как baseline и как способ понять геометрию признаков.',
    concepts: [
      concept('knn', 'k-nearest neighbors', 'ŷ = majority(y_i for i in N_k(x))', ['n_neighbors', 'weights', 'metric', 'algorithm'], 'model', 'локальной классификации'),
      concept('naive-bayes', 'Naive Bayes', 'P(y|x) ∝ P(y) Π P(x_j|y)', ['alpha', 'fit_prior', 'class_prior'], 'model', 'текста и простых вероятностных задач'),
      concept('svm-margin', 'SVM и максимальный margin', 'min 1/2||w||^2 + CΣξ_i', ['C', 'kernel', 'gamma', 'class_weight'], 'model', 'задач с явной границей классов'),
    ],
  },
  {
    id: 'trees-ensembles',
    title: '6.2 Деревья, Random Forest и градиентный бустинг',
    blockId: 'classic-ml',
    blockTitle: 'Классический ML',
    blockIcon: '06',
    subblockId: 'tree-models',
    subblockTitle: 'Деревья и ансамбли',
    level: 'junior+',
    summary: 'Разбираем деревья решений, bagging и boosting как основные практические инструменты для табличных данных.',
    concepts: [
      concept('decision-tree', 'DecisionTreeClassifier', 'split = argmax information_gain', ['max_depth', 'min_samples_leaf', 'criterion', 'class_weight'], 'model', 'интерпретируемых правил'),
      concept('random-forest', 'RandomForestClassifier', 'F(x)=majority(tree_m(x))', ['n_estimators', 'max_depth', 'max_features', 'bootstrap'], 'model', 'устойчивого табличного baseline'),
      concept('gradient-boosting', 'GradientBoosting как последовательное исправление ошибок', 'F_m(x)=F_{m-1}(x)+η h_m(x)', ['n_estimators', 'learning_rate', 'max_depth', 'subsample'], 'model', 'сильных табличных моделей'),
    ],
  },
  {
    id: 'xgboost-catboost',
    title: '6.3 XGBoost и CatBoost в реальном эксперименте',
    blockId: 'classic-ml',
    blockTitle: 'Классический ML',
    blockIcon: '06',
    subblockId: 'boosting-libraries',
    subblockTitle: 'Практический бустинг',
    level: 'junior+',
    summary: 'Показываем, как обучать XGBoost и CatBoost с eval_set, early stopping, категориальными признаками и честной валидацией.',
    concepts: [
      concept('xgb-classifier', 'XGBClassifier', 'objective + regularization + tree boosting', ['n_estimators', 'learning_rate', 'max_depth', 'eval_metric', 'early_stopping_rounds'], 'boosting', 'промышленных табличных задач'),
      concept('catboost-classifier', 'CatBoostClassifier', 'ordered boosting + categorical statistics', ['iterations', 'depth', 'learning_rate', 'cat_features', 'eval_set'], 'boosting', 'таблиц с категориями'),
      concept('early-stopping-boosting', 'Early stopping в бустинге', 'stop если metric_val не улучшается patience раундов', ['eval_set', 'early_stopping_rounds', 'use_best_model', 'verbose'], 'boosting', 'контроля переобучения'),
    ],
  },
  {
    id: 'logits-losses',
    title: '7.1 Логиты и loss-функции',
    blockId: 'deep-learning',
    blockTitle: 'Нейросети и глубокое обучение',
    blockIcon: '07',
    subblockId: 'losses',
    subblockTitle: 'Предсказания и ошибки',
    level: 'junior+',
    summary: 'Разбираем logits, softmax, CrossEntropyLoss, BCEWithLogitsLoss, MSE, MAE и Huber.',
    concepts: [
      concept('logits-softmax', 'Logits и softmax', 'p_i = exp(z_i) / Σ exp(z_j)', ['dim', 'temperature', 'axis'], 'torch-loss', 'мультиклассовой классификации'),
      concept('cross-entropy-loss', 'CrossEntropyLoss', 'CE = -Σ y_i log(p_i)', ['weight', 'ignore_index', 'label_smoothing', 'reduction'], 'torch-loss', 'классификации'),
      concept('bce-with-logits', 'BCEWithLogitsLoss', 'BCE = -y log σ(z) - (1-y) log(1-σ(z))', ['pos_weight', 'weight', 'reduction'], 'torch-loss', 'бинарной и multilabel классификации'),
      concept('regression-losses', 'MSE, MAE и Huber loss', 'Huber(r)=0.5r^2 если |r|≤δ, иначе δ(|r|-0.5δ)', ['delta', 'reduction', 'sample_weight'], 'torch-loss', 'регрессии и устойчивого обучения'),
    ],
  },
  {
    id: 'mlp-batches',
    title: '7.2 MLP, активации, батчи и DataLoader',
    blockId: 'deep-learning',
    blockTitle: 'Нейросети и глубокое обучение',
    blockIcon: '07',
    subblockId: 'mlp',
    subblockTitle: 'Полносвязные сети',
    level: 'junior+',
    summary: 'Собираем MLP из линейных слоёв, активаций и батчей, затем связываем архитектуру с train loop.',
    concepts: [
      concept('linear-layer', 'Linear layer в MLP', 'h = Wx + b', ['in_features', 'out_features', 'bias'], 'torch-layer', 'полносвязных сетей'),
      concept('relu-gelu', 'ReLU и GELU как функции активации', 'ReLU(x)=max(0,x)', ['inplace', 'approximate', 'negative_slope'], 'torch-layer', 'нелинейных представлений'),
      concept('dataloader-batches', 'DataLoader и mini-batch обучение', 'batch = {(x_i,y_i)}_{i=1}^{B}', ['batch_size', 'shuffle', 'num_workers', 'drop_last'], 'torch-data', 'эффективного обучения'),
      concept('mlp-architecture', 'MLPClassifier/PyTorch MLP', 'f(x)=W_L σ(...σ(W_1x+b_1))+b_L', ['hidden_layer_sizes', 'activation', 'max_iter', 'learning_rate_init'], 'torch-model', 'табличных и векторных признаков'),
    ],
  },
  {
    id: 'training-functions',
    title: '7.3 Функции train, validate и train_and_validate',
    blockId: 'deep-learning',
    blockTitle: 'Нейросети и глубокое обучение',
    blockIcon: '07',
    subblockId: 'training-loops',
    subblockTitle: 'Циклы обучения',
    level: 'junior+',
    summary: 'Обязательный блок: как писать функции обучения и валидации для sklearn, PyTorch, XGBoost и CatBoost.',
    concepts: [
      concept('train-sklearn', 'train_validate_sklearn', 'fit(X_train,y_train), score(X_val,y_val)', ['model', 'X_train', 'y_train', 'metric'], 'training', 'классического ML'),
      concept('train-epoch-torch', 'train_epoch_torch', 'loss.backward(); optimizer.step()', ['model', 'loader', 'optimizer', 'criterion', 'device'], 'training', 'нейросетей'),
      concept('validate-epoch-torch', 'validate_epoch_torch', 'model.eval(), no_grad(), metric(logits,y)', ['model', 'loader', 'criterion', 'metric'], 'training', 'контроля качества'),
      concept('train-and-validate', 'train_and_validate с history и early stopping', 'best = argmin(history.val_loss)', ['epochs', 'patience', 'monitor', 'checkpoint'], 'training', 'полного эксперимента'),
      concept('train-boosting-template', 'train_boosting_model для XGBoost/CatBoost', 'fit(..., eval_set=[(X_val,y_val)])', ['eval_set', 'early_stopping_rounds', 'cat_features', 'verbose'], 'training', 'градиентного бустинга'),
    ],
  },
  {
    id: 'optimizers',
    title: '8.1 Оптимизаторы: SGD, Momentum, RMSprop, Adam, AdamW и scheduler',
    blockId: 'optimization',
    blockTitle: 'Оптимизация и регуляризация',
    blockIcon: '08',
    subblockId: 'optimizers',
    subblockTitle: 'Обновление параметров',
    level: 'junior+',
    summary: 'Каждый оптимизатор разобран отдельно: теория, формула, параметры, код и ошибки выбора learning rate.',
    concepts: [
      concept('sgd', 'SGD', 'w_{t+1}=w_t-η∇L(w_t)', ['lr', 'weight_decay', 'maximize'], 'optimizer', 'базового обучения'),
      concept('momentum', 'SGD with Momentum', 'v_t=βv_{t-1}+∇L, w_{t+1}=w_t-ηv_t', ['lr', 'momentum', 'nesterov', 'dampening'], 'optimizer', 'ускорения SGD'),
      concept('rmsprop', 'RMSprop', 's_t=βs_{t-1}+(1-β)g_t^2, w=w-ηg/sqrt(s+eps)', ['lr', 'alpha', 'eps', 'momentum'], 'optimizer', 'нестационарных градиентов'),
      concept('adam', 'Adam', 'm_t=β1m+(1-β1)g, v_t=β2v+(1-β2)g^2', ['lr', 'betas', 'eps', 'weight_decay'], 'optimizer', 'универсального baseline'),
      concept('adamw', 'AdamW', 'w=w-η AdamStep - ηλw', ['lr', 'betas', 'eps', 'weight_decay'], 'optimizer', 'современных нейросетей'),
      concept('lr-scheduler', 'Learning rate scheduler', 'η_t = schedule(t)', ['step_size', 'gamma', 'patience', 'mode'], 'optimizer', 'управления шагом обучения'),
    ],
  },
  {
    id: 'regularization',
    title: '8.2 L1, L2, dropout, batch norm и early stopping',
    blockId: 'optimization',
    blockTitle: 'Оптимизация и регуляризация',
    blockIcon: '08',
    subblockId: 'regularization',
    subblockTitle: 'Контроль переобучения',
    level: 'junior+',
    summary: 'Сравниваем явные штрафы, регуляризацию через архитектуру, остановку по validation и нормализацию внутри сети.',
    concepts: [
      concept('l1-regularization', 'L1-регуляризация', 'L_total = L + λΣ|w_i|', ['alpha', 'lambda', 'penalty', 'C'], 'regularization', 'разреженных моделей'),
      concept('l2-weight-decay', 'L2-регуляризация и weight_decay', 'L_total = L + λΣw_i^2', ['weight_decay', 'alpha', 'lambda', 'C'], 'regularization', 'сдерживания больших весов'),
      concept('dropout', 'Dropout', 'h_drop = mask * h / (1-p)', ['p', 'inplace', 'training'], 'regularization', 'нейросетей'),
      concept('batch-norm', 'BatchNorm', 'x_hat=(x-μ_batch)/sqrt(σ_batch^2+eps)', ['num_features', 'eps', 'momentum', 'affine'], 'regularization', 'стабилизации сетей'),
      concept('early-stopping', 'Early stopping', 'stop если metric не улучшается patience эпох', ['patience', 'min_delta', 'monitor', 'restore_best'], 'regularization', 'итеративного обучения'),
    ],
  },
  {
    id: 'cnn-vision',
    title: '9.1 CNN: свёртки, pooling и transfer learning',
    blockId: 'vision',
    blockTitle: 'Компьютерное зрение',
    blockIcon: '09',
    subblockId: 'cnn',
    subblockTitle: 'Свёрточные модели',
    level: 'junior+',
    summary: 'Показываем, почему CNN хорошо работают на изображениях и как безопасно обучать vision-модель.',
    concepts: [
      concept('convolution', 'Свёрточный слой Conv2d', 'Y_{i,j,k}=Σ X_{i+a,j+b,c} W_{a,b,c,k}+b_k', ['in_channels', 'out_channels', 'kernel_size', 'stride', 'padding'], 'cnn', 'изображений'),
      concept('pooling', 'MaxPool и AveragePool', 'y = max(x_window) или mean(x_window)', ['kernel_size', 'stride', 'padding', 'ceil_mode'], 'cnn', 'уменьшения spatial-размера'),
      concept('cnn-classifier', 'CNN-классификатор', 'features = conv_blocks(image), logits = classifier(features)', ['channels', 'num_classes', 'dropout', 'input_size'], 'cnn', 'классификации изображений'),
      concept('transfer-learning', 'Transfer learning', 'θ = θ_pretrained, обучаем head или fine-tune', ['freeze_backbone', 'learning_rate', 'num_classes', 'epochs'], 'cnn', 'малых vision-датасетов'),
    ],
  },
  {
    id: 'embeddings-transformers',
    title: '10.1 Embeddings, attention и Transformer overview',
    blockId: 'modern-ai',
    blockTitle: 'Современный AI',
    blockIcon: '10',
    subblockId: 'representation-learning',
    subblockTitle: 'Представления и attention',
    level: 'junior+',
    summary: 'Даем понятную карту embeddings, attention и Transformer без превращения вводного курса в исследовательскую лекцию.',
    concepts: [
      concept('embeddings', 'Embeddings', 'token_id -> vector e ∈ R^d', ['num_embeddings', 'embedding_dim', 'padding_idx'], 'transformer', 'текста и категорий'),
      concept('attention', 'Scaled dot-product attention', 'Attention(Q,K,V)=softmax(QK^T/sqrt(d_k))V', ['query', 'key', 'value', 'mask', 'dropout'], 'transformer', 'контекстных представлений'),
      concept('transformer-block', 'Transformer block', 'x -> x + MHA(LN(x)); x -> x + FFN(LN(x))', ['d_model', 'num_heads', 'ffn_dim', 'dropout'], 'transformer', 'языковых и multimodal моделей'),
      concept('responsible-ai', 'Responsible AI и model cards', 'risk = f(data, model, deployment_context)', ['data_card', 'model_card', 'monitoring', 'fairness_checks'], 'production', 'безопасного внедрения'),
    ],
  },
]

const blockMeta = [
  ['python-ml', 'Python для машинного обучения', '01', 'Функции, проверки и воспроизводимый код для последующих ML-пайплайнов.'],
  ['data', 'Данные и preprocessing', '02', 'Загрузка, очистка, кодирование, масштабирование и безопасные pipelines.'],
  ['classic-ml', 'Классический ML', '03', 'Baseline-модели, линейные методы, SVM, деревья и практический бустинг.'],
  ['metrics', 'Метрики и оценка качества', '04', 'Метрики, validation, cross-validation, bootstrap и надёжность экспериментов.'],
  ['data-advanced', 'Улучшение данных', '05', 'Балансировка, augmentation и работа с ограниченной выборкой.'],
  ['deep-learning', 'Нейросети и глубокое обучение', '07', 'Логиты, loss-функции, MLP, batches и функции обучения.'],
  ['optimization', 'Оптимизация и регуляризация', '08', 'Оптимизаторы, learning rate, L1/L2, dropout, BatchNorm и early stopping.'],
  ['vision', 'Компьютерное зрение', '09', 'CNN, pooling, transfer learning и практика vision-моделей.'],
  ['modern-ai', 'Современный AI', '10', 'Embeddings, attention, Transformer overview и ответственное внедрение.'],
]

function words(text) {
  return text.split(/\s+/).filter(Boolean).length
}

function padText(parts, minWords, title, purpose) {
  const extra = `В этой теме важно не запомнить название ${title}, а увидеть рабочий контракт: какие данные входят, какие ограничения проверяются, какой результат считается корректным и какой риск появляется при небрежном применении в ${purpose}.`
  const result = [...parts]
  while (words(result.join(' ')) < minWords) result.push(extra)
  return result
}

function familyProfile(c) {
  if (['simple-imputer', 'missing-indicator', 'iqr-clipping'].includes(c.slug)) {
    return {
      object: 'грязную таблицу с пропусками, выбросами и неоднородными колонками',
      mechanism: 'обучаемую или вычисляемую статистику очистки, которая сохраняется после fit и затем одинаково применяется к validation, test и будущим данным',
      risk: 'утечка validation-статистики, потеря информации о самом факте пропуска и агрессивное удаление редких, но важных наблюдений',
      practice: 'сначала разделить данные, затем fit очистки только на train, после этого transform для остальных частей и контроль распределений до и после обработки',
    }
  }
  if (['one-hot-encoder', 'ordinal-encoder', 'target-encoding'].includes(c.slug)) {
    return {
      object: 'категориальные значения, которые нельзя напрямую подать в большинство численных алгоритмов',
      mechanism: 'кодировку категории в числовое представление: бинарный вектор, ранговое число или статистику целевой переменной внутри train-fold',
      risk: 'ложный порядок категорий, взрыв размерности, неизвестные категории на inference и leakage при target encoding без cross-fitting',
      practice: 'обрабатывать категории через ColumnTransformer или Pipeline, явно настроить неизвестные значения и проверять размерность матрицы после transform',
    }
  }
  if (['standard-scaler', 'minmax-scaler', 'robust-scaler'].includes(c.slug)) {
    return {
      object: 'числовые признаки с разными единицами измерения, диапазонами и чувствительностью к выбросам',
      mechanism: 'преобразование масштаба через среднее и стандартное отклонение, минимум и максимум или медиану и межквартильный размах',
      risk: 'fit scaler на всём датасете, неправильная работа со sparse-матрицами и слепое масштабирование признаков, для которых абсолютный масштаб несёт смысл',
      practice: 'выбирать scaler под модель и распределение, считать статистики только на train и сохранять объект scaler внутри общего Pipeline',
    }
  }
  if (['pipeline', 'column-transformer', 'data-leakage'].includes(c.slug)) {
    return {
      object: 'полный путь данных от сырых колонок до предсказания модели',
      mechanism: 'единый fit/transform/predict контракт, где разные колонки получают разные преобразования, а порядок операций фиксируется кодом',
      risk: 'разрозненный notebook-код, ручной preprocessing validation/test, несовпадение колонок в production и незаметная data leakage',
      practice: 'собирать preprocessing и estimator в Pipeline, валидировать весь объект через cross-validation и сохранять именно pipeline, а не только модель',
    }
  }
  if (['confusion-matrix', 'precision-recall-f1', 'roc-pr-auc', 'regression-metrics'].includes(c.slug)) {
    return {
      object: 'числовое описание качества модели относительно истинных ответов и стоимости ошибок',
      mechanism: 'сводку ошибок, пороговых решений, ранжирования или величины остатка между y и предсказанием',
      risk: 'выбор красивой, но неподходящей метрики: accuracy при дисбалансе, ROC-AUC при редких позитивных событиях или RMSE при сильных выбросах',
      practice: 'выбрать primary metric до эксперимента, считать дополнительные диагностические метрики и смотреть ошибки по сегментам данных',
    }
  }
  if (['kfold', 'stratified-kfold', 'time-series-split', 'bootstrap-ci'].includes(c.slug)) {
    return {
      object: 'процедуру оценки, которая показывает устойчивость качества, а не только один удачный split',
      mechanism: 'несколько train/validation разбиений или повторные выборки с возвращением, чтобы увидеть среднее качество и разброс',
      risk: 'перемешивание временных данных, потеря редкого класса в fold, подбор гиперпараметров по test и игнорирование доверительного интервала',
      practice: 'подобрать схему split под природу данных, логировать scores по fold и принимать решение по среднему, разбросу и худшим сегментам',
    }
  }
  if (['class-weight', 'oversampling', 'undersampling', 'augmentation'].includes(c.slug)) {
    return {
      object: 'несбалансированную или слишком маленькую обучающую выборку',
      mechanism: 'изменение веса ошибок, частоты объектов или создание допустимых вариантов исходного примера без изменения целевого класса',
      risk: 'дублирование validation, переобучение на копии меньшинства, потеря полезного большинства и augmentation, который меняет смысл метки',
      practice: 'применять sampling только внутри train-fold, сравнивать с class_weight и проверять не только F1, но и precision/recall отдельно',
    }
  }
  if (['dummy-classifier', 'linear-regression', 'logistic-regression', 'knn', 'naive-bayes', 'svm-margin', 'decision-tree', 'random-forest', 'gradient-boosting'].includes(c.slug)) {
    return {
      object: 'семейство классических моделей, которое связывает признаки с целевой переменной через понятное правило предсказания',
      mechanism: 'линейную функцию, вероятностную модель, локальное голосование, геометрический margin, дерево решений или ансамбль деревьев',
      risk: 'сложная модель без baseline, переобучение глубины, неверное масштабирование признаков и отсутствие проверки на validation',
      practice: 'начать с простого baseline, затем усложнять модель и сравнивать качество, стабильность и интерпретируемость на одинаковом split',
    }
  }
  if (['xgb-classifier', 'catboost-classifier', 'early-stopping-boosting'].includes(c.slug)) {
    return {
      object: 'градиентный бустинг над деревьями, который последовательно исправляет ошибки предыдущих деревьев',
      mechanism: 'добавление слабых деревьев к ансамблю с learning rate, регуляризацией и контролем качества на eval_set',
      risk: 'слишком много деревьев без early stopping, leakage через encoding категорий, неправильный eval_set и бесконтрольный подбор depth/learning_rate',
      practice: 'выделить validation, передать eval_set, включить early stopping и сохранять best_iteration или use_best_model для финального inference',
    }
  }
  if (['logits-softmax', 'cross-entropy-loss', 'bce-with-logits', 'regression-losses'].includes(c.slug)) {
    return {
      object: 'число ошибки, по которому нейросеть получает градиент для изменения весов',
      mechanism: 'сравнение logits или численного прогноза с правильной меткой через вероятностную или регрессионную функцию потерь',
      risk: 'двойной softmax перед CrossEntropyLoss, неправильный dtype target, несоответствие формы logits и меток, а также неверный reduction',
      practice: 'проверять shape logits, dtype target, диапазон меток и использовать loss, который математически соответствует задаче и выходу модели',
    }
  }
  if (['linear-layer', 'relu-gelu', 'dataloader-batches', 'mlp-architecture'].includes(c.slug)) {
    return {
      object: 'полносвязную нейросеть и поток mini-batch данных, из которых строится базовый deep learning baseline',
      mechanism: 'линейные слои, нелинейные активации и разбиение датасета на батчи для стабильного градиентного обучения',
      risk: 'неверные размеры входа, слишком большой batch, отсутствие shuffle на train, отсутствие eval режима и слабая регуляризация',
      practice: 'сначала проверить один forward pass, затем shapes батчей, затем короткое обучение на малом наборе и только после этого полный эксперимент',
    }
  }
  if (['train-sklearn', 'train-epoch-torch', 'validate-epoch-torch', 'train-and-validate', 'train-boosting-template'].includes(c.slug)) {
    return {
      object: 'функцию эксперимента, которая отделяет обновление параметров от измерения качества',
      mechanism: 'явный контракт train, validate и train_and_validate с history, метриками, режимами модели и early stopping',
      risk: 'обновление весов во время validation, отсутствие zero_grad, смешение train/test и потеря best checkpoint',
      practice: 'писать отдельные функции для обучения и проверки, возвращать словарь метрик и хранить history по эпохам или итерациям',
    }
  }
  if (['sgd', 'momentum', 'rmsprop', 'adam', 'adamw', 'lr-scheduler'].includes(c.slug)) {
    return {
      object: 'правило изменения весов нейросети на основании градиента loss-функции',
      mechanism: 'шаг в сторону уменьшения loss с учётом learning rate, накопленного импульса, адаптивных вторых моментов или расписания шага',
      risk: 'слишком большой learning rate, путаница Adam и AdamW, отсутствие scheduler, забытый zero_grad и weight_decay не там, где он нужен',
      practice: 'начать с AdamW или SGD baseline, смотреть train/validation loss, подбирать learning rate и фиксировать optimizer state вместе с моделью',
    }
  }
  if (['l1-regularization', 'l2-weight-decay', 'dropout', 'batch-norm', 'early-stopping'].includes(c.slug)) {
    return {
      object: 'механизм ограничения переобучения, который заставляет модель обобщать, а не запоминать train',
      mechanism: 'штраф на веса, случайное отключение нейронов, нормализацию активаций или остановку обучения по validation-сигналу',
      risk: 'слишком сильный штраф, dropout в eval, BatchNorm на маленьких батчах и early stopping по шумной метрике',
      practice: 'добавлять регуляризацию постепенно, сравнивать кривые train/validation и проверять, что режимы model.train/model.eval выставлены правильно',
    }
  }
  if (['convolution', 'pooling', 'cnn-classifier', 'transfer-learning'].includes(c.slug)) {
    return {
      object: 'модель для изображений, которая учитывает локальную структуру пикселей и повторяемость визуальных паттернов',
      mechanism: 'свёрточные ядра, pooling, feature extractor и классификационную голову, которая переводит признаки изображения в logits',
      risk: 'неверный порядок каналов, слишком сильная augmentation, неправильная нормализация картинок и fine-tuning с большим learning rate',
      practice: 'проверить размер тензора, нормализацию, несколько картинок после augmentation и только затем обучать CNN или transfer learning модель',
    }
  }
  if (['embeddings', 'attention', 'transformer-block'].includes(c.slug)) {
    return {
      object: 'векторные представления токенов и механизм, который позволяет элементам последовательности учитывать контекст друг друга',
      mechanism: 'таблицу embedding-векторов, query-key-value attention и residual blocks с нормализацией и feed-forward сетью',
      risk: 'неверная маска padding, слишком маленький context window, путаница batch/sequence axes и обучение большой модели без baseline',
      practice: 'начать с маленьких embedding и attention shapes, проверить mask, затем масштабировать размер модели и контролировать validation loss',
    }
  }
  if (c.slug === 'responsible-ai') {
    return {
      object: 'набор инженерных документов и проверок, которые описывают ограничения модели до её применения на людях или бизнес-процессах',
      mechanism: 'model card, data card, мониторинг drift, анализ сегментов, описание рисков и процедуры отката',
      risk: 'запуск модели без контекста, скрытые смещения данных, отсутствие мониторинга и невозможность объяснить пользователю ошибочное решение',
      practice: 'заполнять model card вместе с экспериментом, фиксировать known risks, метрики по сегментам и владельца мониторинга после релиза',
    }
  }
  return {
    object: 'важный блок AI-пайплайна с входами, параметрами и проверяемым результатом',
    mechanism: 'формальную операцию, которую можно описать математически, реализовать кодом и проверить на validation',
    risk: 'ошибки split, неверные параметры, отсутствие автотеста и слишком оптимистичную оценку качества',
    practice: 'встроить блок в pipeline, проверить sample и hidden cases, затем сравнить validation-метрики с baseline',
  }
}

function buildLongFields(topic, c) {
  const profile = familyProfile(c)
  const theory = padText([
    `${c.title} в теме «${topic.title}» разбирается не как название из библиотеки, а как самостоятельный учебный подблок с входом, выходом, формулой, параметрами и проверкой результата.`,
    `По сути он работает с объектом «${profile.object}» и реализует механизм: ${profile.mechanism}. Поэтому студент должен понимать не только синтаксис вызова, но и то, какую статистику, градиент, представление или правило принимает модель.`,
    `Главная практическая опасность: ${profile.risk}. Если её не проговорить заранее, код может выглядеть правильным, но validation-метрика окажется завышенной, нестабильной или бесполезной для настоящего применения.`,
    `Правильная учебная привычка: ${profile.practice}. Такой порядок соединяет научное понимание, инженерную дисциплину и автотесты, поэтому подблок можно переносить из учебной задачи в реальный эксперимент.`,
  ], 100, c.title, c.domain)

  const what = padText([
    `${c.title} — это инструмент для работы с объектом «${profile.object}».`,
    `Он задаёт не просто вызов функции, а конкретное правило поведения: что считается входом, какие параметры сохраняются после fit, какой результат должен получиться и какую проверку нужно выполнить на validation.`,
  ], 38, c.title, c.domain)

  const why = padText([
    `${c.title} нужен, потому что в задачах ${c.domain} качество зависит не только от архитектуры модели, но и от дисциплины эксперимента.`,
    `Он уменьшает случайность, делает шаг воспроизводимым и помогает понять, улучшилась ли модель из-за реальной закономерности, а не из-за leakage, неудачного split или случайной настройки.`,
  ], 38, c.title, c.domain)

  const where = padText([
    `${c.title} применяют там, где возникает ${profile.object}: в учебных датасетах, соревнованиях, аналитических моделях и production-пайплайнах.`,
    `Особенно часто он нужен, когда команда должна повторить эксперимент, объяснить метрику, найти источник ошибки и безопасно применить тот же код к новым данным.`,
  ], 38, c.title, c.domain)

  const formulaMeaning = padText([
    `Формула ${c.formula} фиксирует математический смысл подблока: что является входом, что преобразуется, какая статистика или параметр участвует и где появляется результат.`,
    `Даже когда библиотека скрывает вычисления за одним методом, формула помогает увидеть ограничения: что обучается на train, что только применяется на validation и что нельзя менять после финальной оценки.`,
  ], 38, c.title, c.domain)

  const howToUse = padText([
    `Применять ${c.title} нужно по явному протоколу: определить задачу, подготовить split, выполнить fit или вычисление только в разрешённой части данных и проверить результат на отложенной выборке.`,
    `На практике это означает: ${profile.practice}. После этого параметры фиксируют в коде или конфиге, а сам шаг покрывают маленьким автотестом.`,
  ], 38, c.title, c.domain)

  return { theory, what, why, where, formulaMeaning, howToUse }
}

function paramCards(params, c) {
  return params.map((name) => ({
    name,
    meaning: paramMeaning(name, c),
  }))
}

function paramMeaning(name, c) {
  const descriptions = {
    test_size: 'задаёт долю данных, которая уйдёт в validation или test. Чем меньше датасет, тем аккуратнее нужно выбирать это число, чтобы в отложенной части остались все важные классы и редкие случаи.',
    random_state: 'фиксирует псевдослучайность split, sampling или модели. Он не улучшает качество сам по себе, но делает эксперимент воспроизводимым и позволяет сравнивать изменения кода честно.',
    stratify: 'сохраняет распределение классов при разбиении. Этот параметр особенно важен при дисбалансе, потому что без него validation может случайно потерять редкий класс.',
    handle_unknown: 'определяет поведение encoder на категории, которой не было в train. В production это критично, потому что новые города, товары или источники трафика появляются постоянно.',
    strategy: 'выбирает способ заполнения пропусков: среднее, медиану, наиболее частое значение или константу. Его выбирают по типу признака и чувствительности модели к выбросам.',
    fill_value: 'задаёт явную константу для заполнения. Он полезен, когда пропуск означает отдельное состояние, например неизвестный город или отсутствие истории покупок.',
    add_indicator: 'добавляет бинарный признак факта пропуска. Это помогает модели использовать сам факт отсутствия значения как сигнал, а не просто терять его при заполнении.',
    with_mean: 'разрешает вычитать среднее в StandardScaler. Для dense-матриц это обычно нормально, но для sparse-признаков может разрушить разреженность и резко увеличить память.',
    with_std: 'разрешает делить на стандартное отклонение. Если отключить его, признаки только центрируются, но остаются с разным масштабом, что влияет на линейные модели и оптимизацию.',
    feature_range: 'задаёт нижнюю и верхнюю границы MinMaxScaler. Его используют, когда модель или downstream-логика ожидает конкретный диапазон, например от 0 до 1.',
    n_splits: 'задаёт число fold в cross-validation. Больше fold даёт больше обучающих данных на каждом запуске, но повышает стоимость вычислений и может увеличить разброс на маленьких данных.',
    shuffle: 'перемешивает объекты перед split или fold. Для iid-таблиц это часто полезно, но для временных рядов перемешивание разрушает причинный порядок и создаёт leakage.',
    n_estimators: 'задаёт число деревьев или итераций ансамбля. Малое значение недообучает модель, слишком большое без early stopping часто ведёт к переобучению и долгому inference.',
    learning_rate: 'задаёт размер вклада каждого шага обучения. Малый шаг требует больше итераций, большой может перескочить минимум loss или сделать обучение нестабильным.',
    max_depth: 'ограничивает глубину дерева. Чем глубже дерево, тем сложнее правила и выше риск переобучения, особенно на небольших или шумных табличных данных.',
    eval_set: 'передаёт validation-данные в XGBoost или CatBoost. По нему считают метрику во время обучения и принимают решение об early stopping.',
    early_stopping_rounds: 'останавливает обучение, если validation-метрика не улучшается заданное число итераций. Это защищает бустинг от лишних деревьев и ускоряет подбор.',
    cat_features: 'указывает CatBoost, какие колонки являются категориальными. Это позволяет использовать встроенную обработку категорий вместо ручного OHE или target encoding.',
    lr: 'задаёт learning rate оптимизатора. Это один из самых важных параметров нейросети: он определяет размер шага весов после вычисления градиента.',
    momentum: 'накапливает направление прошлых градиентов. Он помогает SGD быстрее проходить длинные узкие долины loss и меньше дёргаться от шума mini-batch.',
    betas: 'задают скорости сглаживания первого и второго моментов в Adam/AdamW. Обычно значения по умолчанию хороши, но на нестандартных задачах их меняют осторожно.',
    weight_decay: 'добавляет штраф на большие веса. В AdamW он отделён от адаптивного шага и чаще ведёт себя понятнее, чем классическая L2 внутри Adam.',
    batch_size: 'определяет число объектов в одном mini-batch. Большой batch стабильнее, но требует больше памяти; маленький шумнее, зато иногда лучше обобщает.',
    num_workers: 'задаёт число процессов загрузки данных в DataLoader. Он ускоряет input pipeline, но слишком большое значение может перегрузить диск или систему.',
    p: 'задаёт вероятность dropout. Чем выше p, тем сильнее регуляризация и тем выше риск недообучения, если сеть или датасет маленькие.',
    kernel_size: 'определяет размер окна свёртки или pooling. Малое ядро ловит локальные детали, большое видит более широкий контекст, но увеличивает вычисления.',
    padding: 'добавляет границы вокруг изображения или feature map. Он помогает сохранить spatial-размер и контролировать, как свёртка работает у краёв картинки.',
    num_heads: 'задаёт число attention-heads. Несколько голов позволяют модели смотреть на разные типы связей, но увеличивают память и вычислительную стоимость.',
    d_model: 'задаёт размерность скрытого представления в Transformer. Она влияет на ёмкость модели, память, скорость и совместимость attention-блоков.',
  }
  return descriptions[name]
    ? S(`Параметр ${name} в ${c.title} ${descriptions[name]}`)
    : S(
      `Параметр ${name} управляет поведением ${c.title} и задаёт важное инженерное ограничение.`,
      `Его выбирают по размеру данных, типу задачи, стабильности validation-метрики и тому, насколько модель должна быть простой, устойчивой или быстрой.`
    )
}

function mistakes(c) {
  const profile = familyProfile(c)
  return [
    {
      title: c.kind.includes('torch') || c.kind === 'optimizer' ? 'Путать train и eval режимы' : 'Обучать шаг на всём датасете',
      explanation: S(
        `Первая частая ошибка в ${c.title} связана с тем, что разработчик забывает границу между train и validation.`,
        `Для этой темы риск особенно понятен: ${profile.risk}. Если нарушить протокол, модель получает лишнюю информацию или обновляет параметры там, где должна только измерять качество.`
      ),
    },
    {
      title: 'Подбирать параметры по красивому train-результату',
      explanation: S(
        `Для ${c.title} легко подобрать параметры так, чтобы train-метрика стала лучше, но это не означает реального улучшения.`,
        'Train отражает запоминание доступных объектов, а validation показывает переносимость закономерности. Поэтому решение принимают по отложенной метрике, разбросу и ошибкам на важных сегментах.'
      ),
    },
    {
      title: 'Не проверять форму входа и смысл признаков',
      explanation: S(
        `${c.title} работает корректно только тогда, когда форма входа, типы колонок, размерности tensors и смысл признаков совпадают с ожиданиями метода.`,
        'Одна переставленная колонка, неправильный dtype target, неизвестная категория или неверная размерность batch могут дать ошибку поздно и выглядеть как проблема модели.'
      ),
    },
    {
      title: 'Смотреть только одну итоговую метрику',
      explanation: S(
        `Оценивать ${c.title} одним числом удобно, но опасно, потому что разные ошибки имеют разную цену.`,
        'В классификации нужно смотреть precision и recall отдельно, в регрессии сравнивать MAE и RMSE, а в cross-validation учитывать среднее качество и разброс по fold.'
      ),
    },
    {
      title: 'Не превращать объяснение в проверяемый код',
      explanation: S(
        `Даже если ${c.title} понятен теоретически, навык появляется только после маленькой реализации и автотеста.`,
        'Sample cases показывают ожидаемый формат, hidden cases ловят крайние ситуации, а эталонное решение помогает понять, была ли ошибка в математике, коде или обработке входа.'
      ),
    },
  ]
}

function specificCode(c) {
  const snippets = {
    'one-hot-encoder': `
from sklearn.preprocessing import OneHotEncoder

cities = [["Moscow"], ["Kazan"], ["Moscow"], ["Sochi"]]
encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
encoder.fit(cities)
encoded = encoder.transform([["Kazan"], ["Unknown"]])
print(encoder.get_feature_names_out(["city"]).tolist())
print(encoded.tolist())
`,
    'ordinal-encoder': `
from sklearn.preprocessing import OrdinalEncoder

sizes = [["low"], ["medium"], ["high"], ["medium"]]
encoder = OrdinalEncoder(categories=[["low", "medium", "high"]])
encoded = encoder.fit_transform(sizes)
print(encoded.ravel().tolist())
`,
    'target-encoding': `
import pandas as pd
from sklearn.model_selection import KFold

df = pd.DataFrame({"city": ["A", "A", "B", "B"], "target": [1, 0, 1, 1]})
global_mean = df["target"].mean()
encoded = pd.Series(index=df.index, dtype=float)
for train_idx, val_idx in KFold(n_splits=2, shuffle=True, random_state=42).split(df):
    means = df.iloc[train_idx].groupby("city")["target"].mean()
    encoded.iloc[val_idx] = df.iloc[val_idx]["city"].map(means).fillna(global_mean)
print(encoded.round(3).tolist())
`,
    'simple-imputer': `
import numpy as np
from sklearn.impute import SimpleImputer

X_train = np.array([[1.0, np.nan], [2.0, 10.0], [3.0, 12.0]])
X_val = np.array([[np.nan, 11.0]])
imputer = SimpleImputer(strategy="median", add_indicator=True)
imputer.fit(X_train)
print(imputer.transform(X_val))
`,
    'missing-indicator': `
import numpy as np
from sklearn.impute import MissingIndicator

X = np.array([[1.0, np.nan], [np.nan, 3.0], [2.0, 4.0]])
indicator = MissingIndicator(features="all")
mask = indicator.fit_transform(X)
print(mask.astype(int).tolist())
`,
    'iqr-clipping': `
import numpy as np

def clip_iqr(values, multiplier=1.5):
    q1, q3 = np.percentile(values, [25, 75])
    iqr = q3 - q1
    low, high = q1 - multiplier * iqr, q3 + multiplier * iqr
    return np.clip(values, low, high)

print(clip_iqr(np.array([10, 11, 12, 13, 200])).tolist())
`,
    'standard-scaler': `
from sklearn.preprocessing import StandardScaler

X_train = [[10.0, 100.0], [12.0, 110.0], [14.0, 120.0]]
X_val = [[16.0, 130.0]]
scaler = StandardScaler()
scaler.fit(X_train)
print(scaler.transform(X_val).round(3).tolist())
`,
    'minmax-scaler': `
from sklearn.preprocessing import MinMaxScaler

X_train = [[10.0], [20.0], [30.0]]
scaler = MinMaxScaler(feature_range=(0, 1), clip=True)
scaler.fit(X_train)
print(scaler.transform([[25.0], [100.0]]).round(3).ravel().tolist())
`,
    'robust-scaler': `
from sklearn.preprocessing import RobustScaler

X_train = [[10.0], [11.0], [12.0], [13.0], [200.0]]
scaler = RobustScaler(quantile_range=(25, 75))
scaler.fit(X_train)
print(scaler.transform([[12.0], [200.0]]).round(3).ravel().tolist())
`,
    kfold: `
from sklearn.model_selection import KFold

X = list(range(8))
cv = KFold(n_splits=4, shuffle=True, random_state=42)
for fold, (train_idx, val_idx) in enumerate(cv.split(X), start=1):
    print(fold, train_idx.tolist(), val_idx.tolist())
`,
    'stratified-kfold': `
from sklearn.model_selection import StratifiedKFold

X = list(range(8))
y = [0, 0, 0, 0, 1, 1, 1, 1]
cv = StratifiedKFold(n_splits=4, shuffle=True, random_state=42)
for train_idx, val_idx in cv.split(X, y):
    print([y[i] for i in val_idx])
`,
    'time-series-split': `
from sklearn.model_selection import TimeSeriesSplit

X = list(range(10))
cv = TimeSeriesSplit(n_splits=3, test_size=2, gap=1)
for train_idx, val_idx in cv.split(X):
    print("train", train_idx.tolist(), "val", val_idx.tolist())
`,
    'bootstrap-ci': `
import numpy as np

scores = np.array([0.71, 0.76, 0.73, 0.80, 0.77])
rng = np.random.default_rng(42)
means = [rng.choice(scores, size=len(scores), replace=True).mean() for _ in range(1000)]
low, high = np.quantile(means, [0.025, 0.975])
print(round(low, 3), round(high, 3))
`,
    'xgb-classifier': `
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

X_train, X_val, y_train, y_val = train_test_split(X, y, stratify=y, random_state=42)
model = XGBClassifier(n_estimators=800, learning_rate=0.03, max_depth=4, eval_metric="logloss", early_stopping_rounds=40)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
print(model.best_iteration, model.score(X_val, y_val))
`,
    'catboost-classifier': `
from catboost import CatBoostClassifier

model = CatBoostClassifier(iterations=500, depth=6, learning_rate=0.05, loss_function="Logloss", verbose=False)
model.fit(X_train, y_train, cat_features=["city", "device"], eval_set=(X_val, y_val), use_best_model=True)
print(model.get_best_iteration())
`,
    'early-stopping-boosting': `
model.fit(
    X_train,
    y_train,
    eval_set=[(X_val, y_val)],
    verbose=False,
)
best_round = model.best_iteration
val_score = model.score(X_val, y_val)
print(best_round, round(val_score, 4))
`,
    sgd: `
import torch
import torch.nn as nn

model = nn.Linear(10, 2)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.05)
x = torch.randn(16, 10)
y = torch.randint(0, 2, (16,))
loss = criterion(model(x), y)
loss.backward()
optimizer.step()
optimizer.zero_grad()
`,
    momentum: `
import torch
import torch.nn as nn

model = nn.Linear(10, 2)
optimizer = torch.optim.SGD(model.parameters(), lr=0.03, momentum=0.9, nesterov=True)
loss = nn.CrossEntropyLoss()(model(torch.randn(16, 10)), torch.randint(0, 2, (16,)))
loss.backward()
optimizer.step()
optimizer.zero_grad()
`,
    rmsprop: `
import torch
import torch.nn as nn

model = nn.Linear(10, 2)
optimizer = torch.optim.RMSprop(model.parameters(), lr=1e-3, alpha=0.99, eps=1e-8)
loss = nn.CrossEntropyLoss()(model(torch.randn(16, 10)), torch.randint(0, 2, (16,)))
loss.backward()
optimizer.step()
optimizer.zero_grad()
`,
    adam: `
import torch
import torch.nn as nn

model = nn.Linear(10, 2)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3, betas=(0.9, 0.999), eps=1e-8)
loss = nn.CrossEntropyLoss()(model(torch.randn(16, 10)), torch.randint(0, 2, (16,)))
loss.backward()
optimizer.step()
optimizer.zero_grad()
`,
    adamw: `
import torch
import torch.nn as nn

model = nn.Linear(10, 2)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
loss = nn.CrossEntropyLoss()(model(torch.randn(16, 10)), torch.randint(0, 2, (16,)))
loss.backward()
optimizer.step()
optimizer.zero_grad()
`,
    'lr-scheduler': `
import torch

model = torch.nn.Linear(10, 2)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)
for epoch in range(10):
    train_loss = 1.0 / (epoch + 1)
    scheduler.step()
    print(epoch, optimizer.param_groups[0]["lr"], train_loss)
`,
    'cross-entropy-loss': `
import torch
import torch.nn as nn

logits = torch.tensor([[2.0, -1.0, 0.1], [0.2, 1.5, -0.3]])
target = torch.tensor([0, 1], dtype=torch.long)
loss = nn.CrossEntropyLoss(label_smoothing=0.05)(logits, target)
print(round(loss.item(), 4))
`,
    'bce-with-logits': `
import torch
import torch.nn as nn

logits = torch.tensor([0.2, -1.0, 2.5])
target = torch.tensor([1.0, 0.0, 1.0])
loss = nn.BCEWithLogitsLoss(pos_weight=torch.tensor([2.0]))(logits, target)
print(round(loss.item(), 4))
`,
    'regression-losses': `
import torch
import torch.nn as nn

pred = torch.tensor([2.5, 3.0, 10.0])
target = torch.tensor([2.0, 4.0, 6.0])
mse = nn.MSELoss()(pred, target)
huber = nn.HuberLoss(delta=1.0)(pred, target)
print(round(mse.item(), 3), round(huber.item(), 3))
`,
    'train-sklearn': `
from sklearn.metrics import f1_score

def train_validate_sklearn(model, X_train, y_train, X_val, y_val):
    model.fit(X_train, y_train)
    pred = model.predict(X_val)
    return {"val_f1": f1_score(y_val, pred)}
`,
    'validate-epoch-torch': `
import torch

def validate_epoch(model, loader, criterion, device="cpu"):
    model.eval()
    total, correct, count = 0.0, 0, 0
    with torch.no_grad():
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            logits = model(x)
            total += criterion(logits, y).item()
            correct += (logits.argmax(1) == y).sum().item()
            count += y.numel()
    return {"val_loss": total / max(len(loader), 1), "val_acc": correct / max(count, 1)}
`,
  }
  return snippets[c.slug] ?? null
}

function codeLines(c) {
  const titleVar = c.slug.replace(/-/g, '_')
  const specific = specificCode(c)
  if (specific) return C(specific)
  if (c.kind === 'python') {
    return C(`
from typing import Iterable

def ${titleVar}(values: Iterable[float], scale: float = 1.0) -> list[float]:
    clean = [float(v) for v in values]
    if not clean:
        return []
    mean_value = sum(clean) / len(clean)
    return [round((v - mean_value) * scale, 4) for v in clean]

print(${titleVar}([1, 2, 3, 4], scale=0.5))
`)
  }
  if (c.kind === 'pandas') {
    return C(`
import pandas as pd

def load_dataset(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    required = {"target"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Нет обязательных колонок: {missing}")
    return df.drop_duplicates().reset_index(drop=True)
`)
  }
  if (c.kind === 'sklearn-split') {
    return C(`
from sklearn.model_selection import train_test_split

X = [[0.1, 1.0], [0.2, 0.9], [1.1, 0.1], [1.2, 0.2]]
y = [0, 0, 1, 1]
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
print(len(X_train), len(X_val), y_val)
`)
  }
  if (c.kind === 'preprocess') {
    return C(`
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric = ["age", "income"]
categorical = ["city"]
preprocess = ColumnTransformer([
    ("num", StandardScaler(), numeric),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
])
`)
  }
  if (c.kind === 'pipeline') {
    return C(`
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("preprocess", preprocess),
    ("model", LogisticRegression(max_iter=500, class_weight="balanced")),
])
pipe.fit(X_train, y_train)
print(pipe.score(X_val, y_val))
`)
  }
  if (c.kind === 'metrics') {
    return C(`
from sklearn.metrics import precision_score, recall_score, f1_score

y_true = [1, 0, 1, 1, 0, 0]
y_pred = [1, 0, 0, 1, 0, 1]
precision = precision_score(y_true, y_pred)
recall = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)
print(round(precision, 3), round(recall, 3), round(f1, 3))
`)
  }
  if (c.kind === 'validation') {
    return C(`
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.linear_model import LogisticRegression

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
model = LogisticRegression(max_iter=500)
scores = cross_val_score(model, X, y, cv=cv, scoring="f1")
print(scores.mean(), scores.std())
`)
  }
  if (c.kind === 'sampling') {
    return C(`
from collections import Counter

def oversample_minority(labels: list[int]) -> list[int]:
    counts = Counter(labels)
    max_count = max(counts.values())
    result = []
    for cls, count in counts.items():
        result.extend([cls] * max_count)
    return result

print(Counter(oversample_minority([0, 0, 0, 1])))
`)
  }
  if (c.kind === 'model') {
    return C(`
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score
from sklearn.ensemble import RandomForestClassifier

X_train, X_val, y_train, y_val = train_test_split(X, y, stratify=y, random_state=42)
model = RandomForestClassifier(n_estimators=200, random_state=42, class_weight="balanced")
model.fit(X_train, y_train)
pred = model.predict(X_val)
print(f1_score(y_val, pred))
`)
  }
  if (c.kind === 'boosting') {
    return C(`
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

X_train, X_val, y_train, y_val = train_test_split(X, y, stratify=y, random_state=42)
model = XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=4,
    eval_metric="logloss",
    early_stopping_rounds=30,
)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
print(model.best_iteration)
`)
  }
  if (c.kind === 'torch-loss') {
    return C(`
import torch
import torch.nn as nn

logits = torch.tensor([[1.2, -0.4], [0.1, 0.8]], dtype=torch.float32)
target = torch.tensor([0, 1], dtype=torch.long)
criterion = nn.CrossEntropyLoss()
loss = criterion(logits, target)
pred = logits.argmax(dim=1)
print(loss.item(), pred.tolist())
`)
  }
  if (c.kind === 'torch-layer' || c.kind === 'torch-model') {
    return C(`
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(8, 32),
    nn.ReLU(),
    nn.Linear(32, 2),
)
x = torch.randn(4, 8)
logits = model(x)
print(logits.shape)
`)
  }
  if (c.kind === 'torch-data') {
    return C(`
import torch
from torch.utils.data import TensorDataset, DataLoader

X = torch.randn(128, 10)
y = torch.randint(0, 2, (128,))
loader = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)
for batch_x, batch_y in loader:
    print(batch_x.shape, batch_y.shape)
    break
`)
  }
  if (c.kind === 'training') {
    return C(`
import torch

def train_epoch(model, loader, optimizer, criterion, device="cpu"):
    model.train()
    total = 0.0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        optimizer.zero_grad()
        logits = model(x)
        loss = criterion(logits, y)
        loss.backward()
        optimizer.step()
        total += loss.item()
    return total / max(len(loader), 1)
`)
  }
  if (c.kind === 'optimizer') {
    return C(`
import torch
import torch.nn as nn

model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 2))
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
x = torch.randn(16, 10)
y = torch.randint(0, 2, (16,))
loss = criterion(model(x), y)
loss.backward()
optimizer.step()
optimizer.zero_grad()
`)
  }
  if (c.kind === 'regularization') {
    return C(`
import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(20, 64),
    nn.BatchNorm1d(64),
    nn.ReLU(),
    nn.Dropout(p=0.2),
    nn.Linear(64, 2),
)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
`)
  }
  if (c.kind === 'cnn') {
    return C(`
import torch
import torch.nn as nn

cnn = nn.Sequential(
    nn.Conv2d(3, 16, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Conv2d(16, 32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.AdaptiveAvgPool2d((1, 1)),
    nn.Flatten(),
    nn.Linear(32, 10),
)
print(cnn(torch.randn(4, 3, 64, 64)).shape)
`)
  }
  if (c.kind === 'transformer') {
    return C(`
import torch
import torch.nn as nn

embedding = nn.Embedding(num_embeddings=1000, embedding_dim=64, padding_idx=0)
attention = nn.MultiheadAttention(embed_dim=64, num_heads=4, batch_first=True)
tokens = torch.tensor([[1, 5, 9, 0]])
x = embedding(tokens)
out, weights = attention(x, x, x, key_padding_mask=tokens.eq(0))
print(out.shape, weights.shape)
`)
  }
  if (c.kind === 'production') {
    return C(`
def build_model_card(name: str, metric: float, risks: list[str]) -> dict:
    if not risks:
        raise ValueError("Для responsible AI нужно явно записать риски")
    return {
        "name": name,
        "validation_metric": round(metric, 4),
        "known_risks": risks,
        "monitoring": ["data drift", "metric drift", "feedback quality"],
    }

card = build_model_card("credit-risk-baseline", 0.8123, ["class imbalance", "stale data"])
print(card["name"], card["validation_metric"])
`)
  }
  return C(`
def placeholder():
    return "Этот пример показывает структуру полноценного кода: вход, проверка, вычисление, вывод."

print(placeholder())
`)
}

function buildConcept(topic, c) {
  const fields = buildLongFields(topic, c)
  return {
    id: `${topic.id}-${c.slug}`,
    title: c.title,
    theory: S(...fields.theory),
    what: S(...fields.what),
    why: S(...fields.why),
    where: S(...fields.where),
    formula: {
      label: c.title,
      expression: c.formula,
      meaning: S(...fields.formulaMeaning),
      notation: [
        'x или X — входные признаки, которые модель или preprocessing получает на текущем шаге.',
        'y — целевая переменная или правильный ответ, с которым сравнивается предсказание.',
        'θ, w, b или statistic — параметры модели либо статистики, вычисленные только на train.',
        'validation/test — отложенные данные, которые нельзя использовать при fit преобразования.',
      ],
    },
    howToUse: S(...fields.howToUse),
    params: paramCards(c.params, c),
    codeExample: {
      language: 'python',
      code: codeLines(c),
      explanation: [
        `Код показывает не одну строку, а минимальный рабочий фрагмент вокруг ${c.title}: импорт, создание объекта, fit/вычисление и контроль результата.`,
        'В реальном проекте этот фрагмент нужно поместить в функцию, добавить validation-метрику, seed, логирование параметров и отдельный тест на крайние случаи.',
      ],
    },
    commonMistakes: mistakes(c),
  }
}

function quiz(topic, concepts) {
  const first = concepts[0]
  const second = concepts[1] ?? concepts[0]
  return {
    id: `quiz-${topic.id}`,
    title: `Тест: ${topic.title}`,
    description: 'Пять вопросов проверяют смысл, формулу, параметры, риск leakage и практическое применение темы.',
    topicId: topic.id,
    sectionId: topic.blockId,
    questions: [
      {
        id: `${topic.id}-q1`,
        topicId: topic.id,
        sectionId: topic.blockId,
        type: 'single',
        difficulty: 'easy',
        question: `Что лучше всего описывает ${first.title}?`,
        options: [
          { id: 'a', text: 'Проверяемая операция внутри ML-пайплайна с входами, параметрами и ожидаемым результатом.' },
          { id: 'b', text: 'Случайная эвристика, которую не нужно валидировать.' },
          { id: 'c', text: 'Только декоративный термин без влияния на модель.' },
          { id: 'd', text: 'Способ заменить train/validation/test одним набором данных.' },
        ],
        correctAnswer: 'a',
        explanation: `${first.title} нужно понимать как формальный блок пайплайна: он имеет параметры, влияет на качество и обязан проверяться на данных, которые не использовались для подбора.`,
      },
      {
        id: `${topic.id}-q2`,
        topicId: topic.id,
        sectionId: topic.blockId,
        type: 'truefalse',
        difficulty: 'medium',
        question: 'Параметры preprocessing или модели можно подбирать по test set, если validation уже использован много раз.',
        correctAnswer: 'false',
        explanation: 'Test set нужен для финальной проверки после выбора подхода. Если использовать его в подборе, он из независимой оценки превращается в ещё одну validation-выборку.',
      },
      {
        id: `${topic.id}-q3`,
        topicId: topic.id,
        sectionId: topic.blockId,
        type: 'multiple',
        difficulty: 'medium',
        question: `Какие действия безопасны при применении ${second.title}?`,
        options: [
          { id: 'a', text: 'Сначала сделать split, затем fit только на train.' },
          { id: 'b', text: 'Сохранять параметры и seed эксперимента.' },
          { id: 'c', text: 'Подгонять параметры по test set после каждого запуска.' },
          { id: 'd', text: 'Игнорировать hidden tests, если sample tests прошли.' },
        ],
        correctAnswer: ['a', 'b'],
        explanation: 'Безопасный ML-процесс начинается со split и заканчивается воспроизводимым логом параметров. Test set и hidden tests нужны именно для защиты от случайного самообмана.',
      },
      {
        id: `${topic.id}-q4`,
        topicId: topic.id,
        sectionId: topic.blockId,
        type: 'numeric',
        difficulty: 'medium',
        question: 'TP=8, FP=2, FN=2. Чему равен F1?',
        correctAnswer: 0.8,
        tolerance: 0.001,
        explanation: 'Precision=8/(8+2)=0.8, Recall=8/(8+2)=0.8, поэтому F1=2PR/(P+R)=0.8.',
      },
      {
        id: `${topic.id}-q5`,
        topicId: topic.id,
        sectionId: topic.blockId,
        type: 'fillblank',
        difficulty: 'easy',
        question: 'Как называется отложенная выборка, по которой подбирают гиперпараметры до финального test?',
        correctAnswer: 'validation',
        explanation: 'Validation set используется в ходе разработки и подбора параметров. Test set оставляют для одного финального подтверждения качества.',
      },
    ],
  }
}

function practice(topic) {
  const slug = topic.id.replace(/-/g, '_')
  return {
    id: `task-${topic.id}`,
    title: `Автопрактика: ${topic.title}`,
    kind: 'stdin-stdout',
    language: 'python',
    statement: 'Во входе идут числа: TP FP FN. Выведите F1 с точностью до 6 знаков. Эта универсальная задача закрепляет навык переводить формулу в проверяемый код, что затем переносится на любую тему курса.',
    tips: [
      'Сначала вычислите precision и recall с защитой от деления на ноль.',
      'Выводите только число, без поясняющего текста.',
      `Имя темы для самопроверки: ${slug}.`,
    ],
    starterCode: 'import sys\n\n# Считайте TP FP FN и выведите F1\n',
    sampleTests: [
      { id: `${topic.id}-s1`, description: 'Сбалансированный пример', input: '8 2 2', expectedOutput: '0.800000' },
      { id: `${topic.id}-s2`, description: 'Идеальная классификация', input: '5 0 0', expectedOutput: '1.000000' },
    ],
    hiddenTests: [
      { id: `${topic.id}-h1`, description: 'Нет найденных положительных', input: '0 0 4', expectedOutput: '0.000000' },
      { id: `${topic.id}-h2`, description: 'Неидеальный recall', input: '9 3 6', expectedOutput: '0.666667' },
      { id: `${topic.id}-h3`, description: 'Малые значения', input: '1 1 0', expectedOutput: '0.666667' },
    ],
    structuralChecks: ['import sys', 'print(', '/'],
    solution: "import sys\n\ntp, fp, fn = map(float, sys.stdin.read().strip().split())\nprecision = tp / (tp + fp) if (tp + fp) else 0.0\nrecall = tp / (tp + fn) if (tp + fn) else 0.0\nf1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0\nprint(f'{f1:.6f}')\n",
  }
}

function topicToFlowTopic(topic, index) {
  const concepts = topic.concepts.map((item) => buildConcept(topic, item))
  return {
    id: topic.id,
    title: topic.title,
    order: index + 1,
    summary: topic.summary,
    blockId: topic.blockId,
    blockTitle: topic.blockTitle,
    blockIcon: topic.blockIcon,
    subblockId: topic.subblockId,
    subblockTitle: topic.subblockTitle,
    level: topic.level,
    simpleExplanation: `Тема объясняет ${topic.title.toLowerCase()} через теорию, формулы, параметры, код, частые ошибки, тест и автопрактику.`,
    terminology: concepts.map((item) => item.title),
    formulas: concepts.map((item) => item.formula.expression),
    themeCheatsheet: concepts.flatMap((item) => [
      `${item.title}: сначала split, затем fit только на train.`,
      `${item.title}: параметры фиксируются и проверяются через validation.`,
      `${item.title}: результат должен проходить sample и hidden автотесты.`,
    ]),
    sources: sourceLinks,
    steps: [
      {
        id: `${topic.id}-theory`,
        type: 'theory',
        title: 'Теория и функции темы',
        summary: 'Каждый подблок отвечает на вопросы: что это, зачем нужно, где применяют, формула, как применять, параметры и ошибки.',
        conceptCards: concepts,
      },
      {
        id: `${topic.id}-formulas`,
        type: 'formula',
        title: 'Формулы и обозначения',
        summary: 'Собираем математические записи темы в одну шпаргалку.',
        formulaCards: concepts.map((item) => item.formula),
      },
      {
        id: `${topic.id}-code`,
        type: 'code',
        title: 'Кодовые шаблоны',
        summary: 'Полноценные небольшие примеры кода для каждой функции и метода темы.',
        workedExample: concepts.map((item) => ({
          title: item.title,
          body: item.howToUse,
        })),
        codeExample: {
          language: 'python',
          code: concepts.map((item) => `# ${item.title}\n${item.codeExample.code}`).join('\n\n'),
          explanation: concepts.map((item) => `${item.title}: ${item.codeExample.explanation[0]}`),
        },
      },
      {
        id: `${topic.id}-quiz`,
        type: 'quiz',
        title: 'Тест на понимание',
        summary: '5 вопросов проверяют теорию, формулы, параметры и риски практического применения.',
        quiz: quiz(topic, concepts),
      },
      {
        id: `${topic.id}-practice`,
        type: 'practice',
        title: 'Практика с автотестами',
        summary: 'Нужно написать код, который проходит sample tests и hidden tests.',
        practiceTasks: [practice(topic)],
      },
      {
        id: `${topic.id}-recap`,
        type: 'recap',
        title: 'Шпаргалка и частые ошибки',
        summary: 'Короткое повторение формул, параметров и типичных ошибок.',
        formulaCards: concepts.map((item) => item.formula),
        bullets: concepts.flatMap((item) => [
          `${item.title}: ${item.formula.expression}`,
          `Параметры: ${item.params.map((param) => param.name).join(', ')}`,
          `Главная ошибка: ${item.commonMistakes[0].title}.`,
        ]),
        sources: sourceLinks,
      },
    ],
  }
}

function emit(value, indent = 0, key = '') {
  const pad = ' '.repeat(indent)
  const next = ' '.repeat(indent + 2)
  if (value && typeof value === 'object' && value.__joinSpace) {
    return `[\n${value.__joinSpace.map((line) => `${next}${JSON.stringify(line)},`).join('\n')}\n${pad}].join(' ')`
  }
  if (value && typeof value === 'object' && value.__joinNewline) {
    return `[\n${value.__joinNewline.map((line) => `${next}${JSON.stringify(line)},`).join('\n')}\n${pad}].join('\\n')`
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    return `[\n${value.map((item) => `${next}${emit(item, indent + 2)},`).join('\n')}\n${pad}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
    return `{\n${entries.map(([entryKey, entryValue]) => `${next}${entryKey}: ${emit(entryValue, indent + 2, entryKey)},`).join('\n')}\n${pad}}`
  }
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value === null) return 'null'
  throw new Error(`Unsupported value for ${key}`)
}

const flowTopics = topics.map(topicToFlowTopic)
const out = [
  "import type { FlowTopic } from './aiCurriculumTypes'",
  '',
  '// Generated by scripts/generate-ai-curriculum.mjs. Edit the generator, then run npm run generate:curriculum.',
  'export const curriculumBlocks = ' + emit(blockMeta.map(([id, title, icon, description], index) => ({ id, title, icon, description, order: index + 1 }))),
  '',
  'export const flowTopics: FlowTopic[] = ' + emit(flowTopics),
  '',
].join('\n')

fs.writeFileSync(path.join(root, 'src/data/aiCurriculum.ts'), out, 'utf8')
console.log(`Generated ${flowTopics.length} topics into src/data/aiCurriculum.ts`)
