import type { FlowStep } from '../aiCurriculumTypes'
import type { QuizQuestion } from '../quizzes'
import {
  assessment,
  callout,
  code,
  makeStdinTask,
  practiceStep,
  researchSources,
  researchTopic,
  section,
  singleQuestion,
  sourceStep,
  theoryStep,
} from './research/helpers'

const blockId = 'biomedical-nlp'
const blockTitle = 'NLP для биомедицины и научных текстов'
const blockIcon = '12'

type QuestionRow = [string, string[], number, string]

function questions(topicId: string, rows: QuestionRow[]): QuizQuestion[] {
  return rows.map((row, index) => singleQuestion(
    topicId + '-q' + (index + 1),
    topicId,
    row[0],
    row[1],
    row[2],
    row[3],
    index < 2 ? 'easy' : index < rows.length - 2 ? 'medium' : 'hard',
  ))
}

const dataId = 'nlp-data-labels-tokenization'
const dataSteps: FlowStep[] = [
  theoryStep(dataId + '-theory', 'Текст становится исследовательскими данными', 'NLP начинается с задачи, корпуса и единицы наблюдения.', [
    section('nlp-units', 'Task, unit и intended use', [
      'Сначала фиксируют, какое решение поддерживает система: классифицировать abstract, извлечь gene–disease relation, нормализовать название белка или найти доказательство для обзора. Единицей может быть документ, предложение, mention, relation pair или пациент. Эта единица определяет label, split, знаменатель метрики и допустимое утверждение.',
      'В биомедицинском тексте один пациент порождает много заметок, одна статья — много предложений, а одно утверждение — несколько mentions. Если связанные единицы расходятся по train и test, модель запоминает автора, шаблон, пациента или почти одинаковый текст. Поэтому document_id, patient_id, source, date и annotation provenance хранятся до построения признаков.',
    ], {
      table: { headers: ['Задача', 'Единица', 'Выход'], rows: [
        ['screening abstracts', 'статья', 'include/exclude + вероятность'],
        ['NER', 'span в документе', 'тип сущности + offsets'],
        ['relation extraction', 'пара mentions', 'тип связи'],
        ['evidence retrieval', 'passage', 'релевантность + source ID'],
      ] },
      callouts: [callout('Исследовательское правило', 'Label должен описывать наблюдаемое решение и процедуру разметки, а не интуитивное слово «релевантно».', 'important')],
    }),
  ]),
  theoryStep(dataId + '-annotation', 'Корпус, guideline и качество разметки', 'Gold standard тоже содержит неопределённость.', [
    section('annotation-protocol', 'До первой модели', [
      'Annotation guideline задаёт inclusion/exclusion, границы span, приоритет источника, работу с отрицанием, неопределённостью, сокращениями и конфликтами. Пилот размечают минимум два эксперта, обсуждают disagreement, исправляют guideline и только затем масштабируют. Agreement публикуют вместе с единицей расчёта и prevalence, потому что одна kappa без распределения классов вводит в заблуждение.',
      'Train annotations можно уточнять итеративно, но test set замораживают до model development. Adjudicator не должен видеть prediction выбранной модели при создании финального gold standard. Для слабой разметки, distant supervision и LLM-assisted labeling сохраняют источник каждого label и отдельно оценивают human-verified subset.',
    ], {
      bullets: ['Version: corpus, guideline, annotator, timestamp, adjudication.', 'Не удаляйте ambiguous cases молча.', 'PHI/PII деидентифицируют до внешних API.', 'Лицензия текста должна разрешать предполагаемое использование.'],
    }),
  ]),
  {
    id: dataId + '-examples', type: 'worked-example', title: 'Четыре разных NLP-объекта', summary: 'Один текст даёт разные supervised examples.',
    workedExample: [
      { title: 'Document classification', body: 'Abstract получает один label include/exclude; метрики считаются по статьям.' },
      { title: 'Token classification', body: '«TP53 mutation» получает BIO-tags с offsets; важны exact и relaxed span metrics.' },
      { title: 'Relation extraction', body: 'Пара TP53—cancer получает relation associated_with; отрицательные пары задаются явно.' },
      { title: 'Retrieval', body: 'Passage ранжируется для вопроса; relevance judgment и document ID сохраняются.' },
    ],
  },
  assessment(dataId, 'Данные и разметка: 6 вопросов', questions(dataId, [
    ['Что выбирают до tokenization?', ['Task, intended use и единицу наблюдения', 'Цвет графика', 'Максимальный batch', 'Название журнала'], 0, 'Предметная единица определяет labels, split и метрику.'],
    ['Почему patient_id нужен даже при анализе отдельных заметок?', ['Чтобы связанные заметки не попали в разные splits', 'Чтобы увеличить vocabulary', 'Чтобы убрать punctuation', 'Чтобы вычислить BLEU'], 0, 'Иначе возникает entity leakage.'],
    ['Что замораживают до разработки модели?', ['Независимый test и его guideline', 'Все train predictions', 'Любые опечатки', 'Названия переменных'], 0, 'Test не должен адаптироваться к ошибкам выбранной модели.'],
    ['Что хранить у LLM-assisted label?', ['Provenance и human-verification status', 'Только final integer', 'Только prompt length', 'Ничего'], 0, 'Так можно оценить шум и воспроизвести разметку.'],
    ['Как корректно сообщить agreement?', ['Метрика, единица, prevalence и adjudication', 'Только «высокое»', 'Training loss', 'Test AUC модели'], 0, 'Контекст agreement обязателен.'],
    ['Можно ли отправлять клинические заметки во внешний API без проверки?', ['Нет: нужны правовые основания и деидентификация', 'Да, если prompt короткий', 'Да, если убрать пробелы', 'Да, только ночью'], 0, 'Конфиденциальность — ограничение дизайна, а не preprocessing trick.'],
  ])),
  practiceStep(dataId + '-practice-bio', 'Практика 1: BIO-разметка', 'Преобразуйте spans в token labels.', makeStdinTask(
    'bio-tags', 'BIO-tags по индексам',
    'Первая строка — tokens. Вторая — start:end для одной сущности, end не включён. Выведите BIO-tags.',
    '# TODO: прочитайте tokens и span\n# TODO: назначьте B/I/O',
    [{ id: 'sample-1', description: 'Два токена сущности', input: 'mutation in TP53 gene\n2:4\n', expectedOutput: 'O O B I' }],
    [{ id: 'hidden-1', description: 'Сущность в начале', input: 'breast cancer cohort\n0:2\n', expectedOutput: 'B I O' }],
    'tokens = input().split()\nstart, end = map(int, input().split(":"))\ntags = []\nfor i in range(len(tokens)):\n    tags.append("B" if i == start else "I" if start < i < end else "O")\nprint(" ".join(tags))',
  )),
  practiceStep(dataId + '-practice-groups', 'Практика 2: поиск document leakage', 'Проверьте пересечение источников.', makeStdinTask(
    'nlp-group-leakage', 'Document IDs в train и test',
    'Даны train IDs, затем |, затем test IDs. Выведите пересечение по алфавиту или OK.',
    '# TODO: разделите две части\n# TODO: найдите повторные document IDs',
    [{ id: 'sample-1', description: 'Есть duplicate', input: 'p1 p2 p3 | p3 p4\n', expectedOutput: 'p3' }],
    [{ id: 'hidden-1', description: 'Независимые документы', input: 'a b | c d\n', expectedOutput: 'OK' }],
    'left, right = input().split("|")\noverlap = sorted(set(left.split()) & set(right.split()))\nprint(" ".join(overlap) if overlap else "OK")',
  )),
  sourceStep(dataId, [researchSources.huggingFaceTokenizers, researchSources.tripOd]),
]

const tfidfId = 'nlp-tfidf-classical-models'
const tfidfSteps: FlowStep[] = [
  theoryStep(tfidfId + '-theory', 'От строки к sparse matrix', 'Сильный baseline начинается с counts и TF-IDF.', [
    section('tfidf-core', 'Vocabulary, n-grams и TF-IDF', [
      'CountVectorizer строит vocabulary только на train и превращает документы в разреженную матрицу document×term. Word n-grams ловят устойчивые фразы, character n-grams помогают с морфологией, опечатками и вариантами gene names. TF-IDF уменьшает вес повсеместных терминов: локальная частота умножается на обратную документную частоту, вычисленную только на train fold.',
      'В биомедицинских корпусах токенизация требует осторожности: TP53, IL-6, p53-dependent, c.215C>G и BRCA1/2 нельзя бездумно разрушать общей очисткой. Stop-word list, lowercasing, min_df, max_df, sublinear_tf и диапазон n-grams становятся hyperparameters внутри CV, а не решениями после просмотра test.',
    ], {
      table: { headers: ['Представление', 'Плюс', 'Риск'], rows: [
        ['word 1–2 grams', 'интерпретируемые фразы', 'редкие варианты написания'],
        ['character 3–5 grams', 'устойчивость к морфологии', 'больше признаков'],
        ['TF-IDF', 'сильный дешёвый baseline', 'нет контекстного значения'],
      ] },
    }),
  ]),
  theoryStep(tfidfId + '-models', 'Модели для high-dimensional text', 'Sparse baseline должен быть настроен и проверен.', [
    section('linear-text', 'Naive Bayes, logistic regression и LinearSVC', [
      'MultinomialNB использует counts и полезен как быстрый baseline. LogisticRegression и LinearSVC хорошо работают в пространстве тысяч sparse features благодаря регуляризации. Для вероятностей выбирают logistic regression или калибруют decision scores строго внутри validation procedure. Нельзя сравнивать модели только по training accuracy.',
      'Pipeline связывает vectorizer и classifier, поэтому vocabulary и IDF пересчитываются в каждом fold. Подбор C, n-grams и min_df происходит совместно. Коэффициенты показывают ассоциацию токена с решением модели, но correlated n-grams распределяют вес и не превращают анализ в причинный.',
    ], {
      bullets: ['DummyClassifier остаётся обязательным.', 'Macro F1 нужен при неодинаково важных классах.', 'PR-AUC полезна для редкого positive class.', 'Сохраняйте vocabulary и версию preprocessing.'],
    }),
  ]),
  {
    id: tfidfId + '-examples', type: 'worked-example', title: 'Пять baseline-решений', summary: 'Baseline зависит от задачи и стоимости ошибки.',
    workedExample: [
      { title: 'Systematic review', body: 'Word+character TF-IDF + logistic regression; recall при рабочем threshold.' },
      { title: 'Cancer subtype', body: 'TF-IDF clinical note + LinearSVC; group split по patient.' },
      { title: 'Rare relation', body: 'Character n-grams помогают вариантам gene names, но split остаётся по document.' },
      { title: 'Multi-label MeSH', body: 'One-vs-rest classifiers и per-label support; micro/macro metrics вместе.' },
    ],
  },
  {
    id: tfidfId + '-code', type: 'code', title: 'Leakage-safe text Pipeline', summary: 'Vectorizer обучается внутри каждого fold.',
    codeExample: code('python', [
      'from sklearn.pipeline import Pipeline',
      'from sklearn.feature_extraction.text import TfidfVectorizer',
      'from sklearn.linear_model import LogisticRegression',
      '',
      'model = Pipeline([',
      '    ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=3, sublinear_tf=True)),',
      '    ("clf", LogisticRegression(C=1.0, class_weight="balanced", max_iter=2000)),',
      '])',
      '# fit вызывается только на train fold; test vocabulary не участвует',
    ].join('\n'), undefined, 'Параметры vectorizer и classifier подбираются одной CV-процедурой.'),
  },
  assessment(tfidfId, 'TF-IDF и linear baselines: 8 вопросов', questions(tfidfId, [
    ['Где fit vocabulary и IDF?', ['Только на train fold', 'На всём корпусе', 'На test', 'После публикации'], 0, 'Это обучаемые статистики preprocessing.'],
    ['Зачем character n-grams?', ['Ловить варианты формы и опечатки', 'Вычислять p-value', 'Создавать patient split', 'Удалять labels'], 0, 'Они менее чувствительны к границам слов.'],
    ['Какая модель естественно работает со sparse TF-IDF?', ['LogisticRegression', 'k-means только на одном числе', 'Kaplan–Meier', 'DESeq2'], 0, 'Линейная модель масштабируется на high-dimensional sparse input.'],
    ['Почему нельзя очищать «IL-6» общим regex без проверки?', ['Можно уничтожить смысловой идентификатор', 'Увеличится экран', 'Сменится target', 'Пропадёт CV'], 0, 'Biomedical tokens содержат дефисы, цифры и символы.'],
    ['Где выбирать min_df и C?', ['Внутри CV на development data', 'По test F1', 'По training accuracy', 'По имени файла'], 0, 'Иначе test становится tuning set.'],
    ['Что означает положительный коэффициент n-gram?', ['Ассоциацию с решением при остальных признаках', 'Причину болезни', 'Качество label', 'Независимую репликацию'], 0, 'Вес модели не доказывает биологическую причинность.'],
    ['Какая метрика не скрывает редкий класс усреднением по объектам?', ['Macro F1', 'Accuracy', 'Training loss последней эпохи', 'Vocabulary size'], 0, 'Macro F1 даёт классам одинаковый вес.'],
    ['Нужен ли Dummy baseline для Transformer?', ['Да, он задаёт нижнюю границу', 'Нет, у Transformer всегда 100%', 'Только без labels', 'Только для regression'], 0, 'Сложность модели не отменяет baseline.'],
  ])),
  practiceStep(tfidfId + '-practice-tf', 'Практика 1: term frequency', 'Посчитайте нормированную частоту.', makeStdinTask(
    'term-frequency', 'TF выбранного токена',
    'Первая строка — токен, вторая — документ. Выведите count/число токенов с 3 знаками.',
    '# TODO: прочитайте query и document\n# TODO: вычислите нормированный TF',
    [{ id: 'sample-1', description: 'Два вхождения', input: 'gene\ngene mutation in gene\n', expectedOutput: '0.500' }],
    [{ id: 'hidden-1', description: 'Нет вхождений', input: 'tp53\nbrca1 cancer\n', expectedOutput: '0.000' }],
    'query = input().strip()\ntokens = input().split()\nprint(f"{tokens.count(query) / len(tokens):.3f}")',
  )),
  practiceStep(tfidfId + '-practice-ngrams', 'Практика 2: word bigrams', 'Постройте локальные признаки.', makeStdinTask(
    'word-bigrams', 'Последовательные bigrams',
    'Дана строка токенов. Выведите bigrams через |, слова внутри через _. Если слов меньше двух — NONE.',
    '# TODO: разбейте строку\n# TODO: создайте соседние пары',
    [{ id: 'sample-1', description: 'Три токена', input: 'breast cancer cohort\n', expectedOutput: 'breast_cancer|cancer_cohort' }],
    [{ id: 'hidden-1', description: 'Один токен', input: 'TP53\n', expectedOutput: 'NONE' }],
    'tokens = input().split()\nbigrams = [tokens[i] + "_" + tokens[i + 1] for i in range(len(tokens) - 1)]\nprint("|".join(bigrams) if bigrams else "NONE")',
  )),
  sourceStep(tfidfId, [researchSources.sklearnText]),
]

const evalId = 'nlp-split-leakage-evaluation'
const evalSteps: FlowStep[] = [
  theoryStep(evalId + '-split', 'Split текста имитирует публикацию или клиническое применение', 'Random sentence split почти всегда слишком прост.', [
    section('nlp-split-levels', 'Document, patient, author, source и time', [
      'Если предложения из одного abstract расходятся по folds, стиль и формулировка повторяются. Clinical notes группируют по patient, radiology reports — иногда по patient и institution, статьи — по DOI или corpus family, social text — по author. Temporal split проверяет изменение терминологии и практики, а external source split — перенос в другой журнал, центр или annotation process.',
      'Near-duplicates ищут до split и объединяют в одну группу. Exact hash недостаточен: шаблоны заметок и версии preprint/article могут отличаться несколькими словами. Порог semantic similarity выбирают на development data и документируют; удаление duplicates из test после просмотра performance запрещено.',
    ], {
      table: { headers: ['Скрытая зависимость', 'Group key'], rows: [
        ['несколько предложений статьи', 'document/DOI'],
        ['много заметок пациента', 'patient_id'],
        ['шаблон одного центра', 'institution + template family'],
        ['версия preprint и paper', 'work/duplicate cluster'],
      ] },
    }),
  ]),
  theoryStep(evalId + '-metrics', 'Метрики классификации, spans и retrieval', 'Один F1 не покрывает все NLP-задачи.', [
    section('nlp-metric-map', 'Знаменатель следует за выходом', [
      'Для binary screening сообщают sensitivity/recall, specificity, precision, PR-AUC, workload reduction при заранее выбранном threshold и CI по независимой единице. Для multiclass — confusion matrix, per-class support, macro и micro F1. Для multi-label дополнительно показывают label-wise performance и правила обработки пустых labels.',
      'NER оценивают exact span+type и, если обосновано, relaxed overlap отдельно. Relation extraction требует определения допустимых entity pairs и negative sampling. Retrieval оценивают recall@k, precision@k, MRR или nDCG на замороженных relevance judgments. Generative answer не считается верным только из-за fluent wording: проверяются claim, citation support и abstention.',
    ]),
  ]),
  theoryStep(evalId + '-uncertainty', 'Threshold, confidence interval и error taxonomy', 'Evaluation заранее связывают с реальным решением.', [
    section('nlp-evaluation-protocol', 'От OOF predictions к таблице ошибок', [
      'Threshold выбирают только по development OOF predictions под заданную стоимость false negative/false positive. Финальный test используется один раз. Bootstrap или другой interval учитывает clustering: при patient-level split ресэмплируют пациентов, при document task — документы. Confidence interval по отдельным tokens создаёт ложную точность.',
      'Error analysis использует заранее определённые категории: negation, temporality, abbreviation, rare entity, boundary, domain shift, annotation ambiguity. Reviewer ошибок по возможности не видит модель и проверяет выборку как correct, incorrect или uncertain. Категории публикуют с denominators, а не только с яркими примерами.',
    ], {
      callouts: [callout('Не подменяйте тест', 'После анализа test errors новую модель оценивают на новой независимой выборке; старый test стал development evidence.', 'important')],
    }),
  ]),
  {
    id: evalId + '-examples', type: 'worked-example', title: 'Пять честных evaluation-сценариев', summary: 'Каждый сценарий меняет split и знаменатель.',
    workedExample: [
      { title: 'Abstract screening', body: 'Group по DOI/work, report recall и missed eligible studies.' },
      { title: 'Clinical notes', body: 'Group по patient, temporal/external center test, patient-cluster bootstrap.' },
      { title: 'NER benchmark', body: 'Split по document, exact entity-level F1, boundary error table.' },
      { title: 'Relation extraction', body: 'Document split, fixed candidate pairs, relation-wise support.' },
      { title: 'Evidence retrieval', body: 'Question-level split, recall@k и citation-support audit.' },
    ],
  },
  assessment(evalId, 'NLP validation: 9 вопросов', questions(evalId, [
    ['Почему нельзя делить предложения случайно?', ['Один документ попадёт в обе части', 'Потому что F1 исчезнет', 'Потому что tokens станут числами', 'Потому что нужен GPU'], 0, 'Повторение стиля и контекста даёт leakage.'],
    ['Как группировать longitudinal clinical notes?', ['По patient_id', 'По длине строки', 'По positive label', 'По punctuation'], 0, 'Все заметки пациента должны оставаться вместе.'],
    ['Что показывает temporal test?', ['Перенос на будущий период', 'Только training fit', 'Размер vocabulary', 'Annotation agreement'], 0, 'Он моделирует deployment после cutoff.'],
    ['Какая метрика нужна для редких eligible abstracts?', ['PR-AUC и recall', 'Только accuracy', 'Только vocabulary size', 'MSE tokens'], 0, 'Они фокусируются на positive class.'],
    ['Как считать strict NER?', ['Exact span и type match', 'Любой общий символ', 'Document accuracy', 'BLEU'], 0, 'Strict entity F1 требует совпадения границ и класса.'],
    ['Где выбирать threshold?', ['На development OOF predictions', 'На final test', 'На каждом test объекте', 'По training loss'], 0, 'Test должен оставаться независимым.'],
    ['Что ресэмплировать для CI clinical notes?', ['Пациентов', 'Отдельные subword tokens', 'Буквы', 'Только positives'], 0, 'Ресэмплируют независимую единицу.'],
    ['Достаточно ли fluent ответа RAG?', ['Нет, нужна проверка claim и citation support', 'Да, стиль доказывает факт', 'Да, если ответ длинный', 'Да, если temperature=0'], 0, 'Правдоподобный текст может не поддерживаться источником.'],
    ['Что делать после настройки по test errors?', ['Получить новую независимую evaluation', 'Снова назвать его test', 'Удалить ошибки', 'Сообщить только старую метрику'], 0, 'Данные уже повлияли на разработку.'],
  ])),
  practiceStep(evalId + '-practice-group', 'Практика 1: group split audit', 'Найдите patient leakage.', makeStdinTask(
    'nlp-patient-overlap', 'Patients между folds',
    'Даны patient:fold. Выведите пациентов, встречающихся в нескольких folds, по алфавиту или OK.',
    '# TODO: соберите folds для patient\n# TODO: выведите пересечения',
    [{ id: 'sample-1', description: 'Один patient в двух folds', input: 'p1:A p2:A p1:B p3:B\n', expectedOutput: 'p1' }],
    [{ id: 'hidden-1', description: 'Чистый split', input: 'p1:A p2:A p3:B\n', expectedOutput: 'OK' }],
    'folds = {}\nfor token in input().split():\n    patient, fold = token.split(":")\n    folds.setdefault(patient, set()).add(fold)\nleaked = sorted(patient for patient, values in folds.items() if len(values) > 1)\nprint(" ".join(leaked) if leaked else "OK")',
  )),
  practiceStep(evalId + '-practice-macro', 'Практика 2: macro F1', 'Не дайте большому классу скрыть малый.', makeStdinTask(
    'macro-f1', 'Среднее per-class F1',
    'Даны значения F1 классов. Выведите их среднее с 3 знаками.',
    '# TODO: прочитайте F1\n# TODO: вычислите macro average',
    [{ id: 'sample-1', description: 'Три класса', input: '0.90 0.60 0.30\n', expectedOutput: '0.600' }],
    [{ id: 'hidden-1', description: 'Два класса', input: '1 0\n', expectedOutput: '0.500' }],
    'values = [float(value) for value in input().split()]\nprint(f"{sum(values) / len(values):.3f}")',
  )),
  sourceStep(evalId, [researchSources.sklearnValidation, researchSources.tripOd, researchSources.probastAi]),
]

const embedId = 'nlp-embeddings-representations'
const embedSteps: FlowStep[] = [
  theoryStep(embedId + '-theory', 'Плотные представления слов и документов', 'Embedding — координаты, а не готовое доказательство смысла.', [
    section('embedding-family', 'Word2Vec, fastText и document pooling', [
      'Word2Vec обучает векторы по локальному контексту через CBOW или skip-gram: слова с похожими окружениями становятся близкими. fastText представляет слово суммой character n-grams и лучше переносится на редкие формы и морфологию. Эти static embeddings дают одному token одно представление независимо от контекста, поэтому «expression» в разных фразах не различается.',
      'Документ можно представить средним или TF-IDF-взвешенным средним token vectors, но порядок теряется. Pretrained biomedical embeddings полезны только при совпадении языка, корпуса и лицензии. Любой embedding model фиксируют версией и проверяют downstream task; красивый nearest-neighbor example не заменяет held-out evaluation.',
    ], {
      table: { headers: ['Метод', 'Контекст', 'OOV'], rows: [
        ['Word2Vec', 'статический локальный', 'обычно unknown'],
        ['fastText', 'статический + subwords', 'строится из n-grams'],
        ['BERT-like', 'контекстный bidirectional', 'subword tokenization'],
      ] },
    }),
  ]),
  theoryStep(embedId + '-similarity', 'Similarity, pooling и embedding leakage', 'Сходство зависит от пространства и протокола.', [
    section('embedding-use', 'Cosine и retrieval', [
      'Cosine similarity сравнивает направление векторов и игнорирует их масштаб. Для semantic search corpus embeddings индексируют, query кодируют совместимым encoder и извлекают top-k. Bi-encoder быстрый, cross-encoder точнее переранжирует небольшое число candidates. Threshold similarity не универсален: его выбирают на размеченных development pairs.',
      'Если encoder дообучается на всем корпусе, включая test labels или positive pairs, evaluation загрязнена. Unsupervised pretraining на test text без labels тоже надо раскрывать как transductive setting. Дубликаты и цитирующие фрагменты могут сделать retrieval искусственно лёгким, поэтому группировка источников остаётся обязательной.',
    ]),
  ]),
  {
    id: embedId + '-examples', type: 'worked-example', title: 'Четыре режима embeddings', summary: 'Representation выбирают под задачу и ресурсы.',
    workedExample: [
      { title: 'Frozen vectors', body: 'TF-IDF-weighted average + logistic regression — дешёвый dense baseline.' },
      { title: 'Bi-encoder retrieval', body: 'Query и passages кодируются отдельно; top-k ищется быстро.' },
      { title: 'Cross-encoder reranking', body: 'Query+passage оцениваются совместно для top candidates.' },
      { title: 'Fine-tuned encoder', body: 'Representation меняется под labels и требует строгой nested evaluation.' },
    ],
  },
  {
    id: embedId + '-code', type: 'code', title: 'Cosine без магии', summary: 'Проверяем нормировку явно.',
    codeExample: code('python', [
      'import numpy as np',
      '',
      'def cosine(a, b):',
      '    a, b = np.asarray(a), np.asarray(b)',
      '    denom = np.linalg.norm(a) * np.linalg.norm(b)',
      '    return float(a @ b / denom) if denom else 0.0',
      '',
      'print(cosine([1, 1, 0], [2, 2, 0]))  # 1.0',
    ].join('\n'), undefined, 'Zero vector обрабатывается явно; threshold выбирается по development labels.'),
  },
  assessment(embedId, 'Embeddings: 7 вопросов', questions(embedId, [
    ['Чем fastText помогает редким словам?', ['Собирает их из character n-grams', 'Знает test labels', 'Удаляет morphology', 'Строит survival curve'], 0, 'Subword composition даёт вектор unseen form.'],
    ['Главное ограничение Word2Vec?', ['Одно статическое значение слова', 'Не содержит чисел', 'Всегда требует GPU', 'Не умеет vectors'], 0, 'Контекстные значения не различаются.'],
    ['Что теряет mean pooling?', ['Порядок и локальную структуру', 'Размер vector', 'Все слова', 'Все labels'], 0, 'Среднее схлопывает sequence.'],
    ['Когда cosine равен 1?', ['Векторы сонаправлены', 'Векторы ортогональны', 'Один vector нулевой', 'Labels равны'], 0, 'Он измеряет угол.'],
    ['Зачем cross-encoder после bi-encoder?', ['Точнее rerank top candidates', 'Создать random split', 'Посчитать HbA1c', 'Удалить sources'], 0, 'Совместное кодирование учитывает взаимодействия query-passage.'],
    ['Где выбирать similarity threshold?', ['На размеченном development set', 'На final test', 'По одному примеру', 'По длине vector'], 0, 'Порог — часть tuned decision rule.'],
    ['Что сообщить при pretraining на test text без labels?', ['Transductive setting', 'Что test не использовался', 'Только seed', 'Ничего'], 0, 'Модель видела распределение evaluation текста.'],
  ])),
  practiceStep(embedId + '-practice', 'Практика: dot и cosine', 'Посчитайте cosine для двумерных vectors.', makeStdinTask(
    'cosine-2d', 'Cosine similarity',
    'Даны ax ay bx by. Выведите cosine с 3 знаками; если норма нулевая — 0.000.',
    '# TODO: прочитайте vectors\n# TODO: вычислите dot и нормы',
    [{ id: 'sample-1', description: 'Одинаковое направление', input: '1 1 2 2\n', expectedOutput: '1.000' }],
    [{ id: 'hidden-1', description: 'Ортогональные vectors', input: '1 0 0 1\n', expectedOutput: '0.000' }],
    'import math\nax, ay, bx, by = map(float, input().split())\ndenom = math.hypot(ax, ay) * math.hypot(bx, by)\nvalue = (ax * bx + ay * by) / denom if denom else 0.0\nprint(f"{value:.3f}")',
  )),
  sourceStep(embedId, [researchSources.huggingFaceTokenizers, researchSources.bertPaper]),
]

const neuralId = 'nlp-neural-transformers'
const neuralSteps: FlowStep[] = [
  theoryStep(neuralId + '-sequence', 'CNN, RNN, LSTM и attention', 'Архитектуры отличаются тем, как собирают контекст.', [
    section('sequence-models', 'До Transformer', [
      'Text CNN применяет kernels к локальным windows embeddings и хорошо ловит устойчивые n-gram patterns. RNN обновляет hidden state по порядку tokens; LSTM/GRU используют gates, чтобы смягчить исчезающие градиенты. Bidirectional RNN видит левый и правый контекст, но последовательное вычисление ограничивает параллелизм.',
      'Attention вычисляет совместимость query с keys и суммирует values с нормированными весами. Это позволяет каждому token напрямую агрегировать информацию из других positions. Attention weights могут быть полезны для диагностики, но сами по себе не являются объяснением причин решения.',
    ], {
      table: { headers: ['Модель', 'Сильная сторона', 'Ограничение'], rows: [
        ['CNN', 'локальные patterns', 'fixed receptive field'],
        ['LSTM/GRU', 'sequence state', 'последовательное обучение'],
        ['Transformer', 'глобальный context', 'память растёт с length²'],
      ] },
    }),
  ]),
  theoryStep(neuralId + '-transformer', 'Transformer encoder и BERT', 'Pretraining превращается в downstream model через fine-tuning.', [
    section('bert-mechanics', 'Tokens, positions, masks и heads', [
      'Tokenizer разбивает редкие слова на subwords, добавляет special tokens и возвращает attention_mask. Encoder суммирует token и position information, затем многократно применяет multi-head self-attention и feed-forward blocks. BERT pretraining использует masked language modeling, после чего task head обучается для sequence или token classification.',
      'Padding не должен участвовать в attention или loss. Для NER word labels выравнивают с subword offsets: обычно первый subword получает label, остальные игнорируются или получают согласованную BIO-схему. Truncation — предметное решение: потерянный конец discharge note может содержать outcome или negation.',
    ]),
  ]),
  {
    id: neuralId + '-examples', type: 'worked-example', title: 'Четыре архитектурных решения', summary: 'Сложность добавляется только после baseline.',
    workedExample: [
      { title: 'Short sentence relation', body: 'CNN или compact encoder; document-level split.' },
      { title: 'Long clinical note', body: 'Chunking + aggregation либо long-context model; patient split.' },
      { title: 'Token NER', body: 'Encoder token head + offset alignment + exact span F1.' },
      { title: 'Low-data classification', body: 'Frozen encoder/linear head сравнивают с TF-IDF, затем cautious fine-tuning.' },
    ],
  },
  {
    id: neuralId + '-code', type: 'code', title: 'Fine-tuning skeleton с явными labels', summary: 'Tokenizer, dynamic padding и model checkpoint версионируются.',
    codeExample: code('python', [
      'from transformers import AutoTokenizer, AutoModelForSequenceClassification',
      '',
      'checkpoint = "microsoft/BiomedNLP-BiomedBERT-base-uncased-abstract-fulltext"',
      'tokenizer = AutoTokenizer.from_pretrained(checkpoint)',
      'model = AutoModelForSequenceClassification.from_pretrained(checkpoint, num_labels=2)',
      'batch = tokenizer(texts, truncation=True, max_length=256)',
      '# split создаётся до Dataset.map; best checkpoint выбирается по development metric',
    ].join('\n'), undefined, 'Checkpoint, tokenizer, max_length и label map входят в model card.'),
  },
  assessment(neuralId, 'Neural NLP: 9 вопросов', questions(neuralId, [
    ['Что хорошо ловит Text CNN?', ['Локальные n-gram patterns', 'Patient overlap', 'FDR genes', 'Journal quartile'], 0, 'Convolution сканирует локальные windows.'],
    ['Зачем gates в LSTM?', ['Управлять сохранением и забыванием state', 'Сортировать patients', 'Вычислять TF-IDF', 'Удалять padding'], 0, 'Они облегчают передачу длинной зависимости.'],
    ['Что агрегирует attention?', ['Values по весам query-key compatibility', 'Только labels', 'Only test rows', 'P-values'], 0, 'Softmax weights задают контекстную сумму.'],
    ['Зачем position information?', ['Self-attention сам не кодирует порядок', 'Чтобы увеличить labels', 'Чтобы скрыть leakage', 'Чтобы создать DOI'], 0, 'Без позиции перестановки неразличимы.'],
    ['Что делает attention_mask?', ['Исключает padding/недоступные positions', 'Меняет gold label', 'Создаёт vocabulary после test', 'Считает AUC'], 0, 'Mask контролирует допустимые связи.'],
    ['Как выровнять NER labels с subwords?', ['Через offsets/word_ids и явное правило', 'По длине файла', 'Случайно', 'После test'], 0, 'Tokenization меняет число позиций.'],
    ['Почему truncation опасен?', ['Может систематически удалить клинически важный фрагмент', 'Всегда улучшает recall', 'Удаляет только padding', 'Не меняет input'], 0, 'Max length влияет на доступную информацию.'],
    ['Доказывают ли attention weights причинное объяснение?', ['Нет', 'Да всегда', 'Только при batch=1', 'Только для BERT'], 0, 'Это внутренний механизм, не causal attribution.'],
    ['С чем сравнивать fine-tuned Transformer?', ['Dummy и TF-IDF/linear baseline', 'Только с собой', 'Только с training loss', 'С квартилем журнала'], 0, 'Добавленная сложность должна давать проверяемую пользу.'],
  ])),
  practiceStep(neuralId + '-practice-mask', 'Практика 1: attention mask', 'Отметьте реальные tokens.', makeStdinTask(
    'attention-mask', 'Mask по PAD',
    'Даны tokens, PAD обозначает padding. Выведите 1 для token и 0 для PAD.',
    '# TODO: прочитайте tokens\n# TODO: создайте binary mask',
    [{ id: 'sample-1', description: 'Два padding', input: 'CLS TP53 SEP PAD PAD\n', expectedOutput: '1 1 1 0 0' }],
    [{ id: 'hidden-1', description: 'Без padding', input: 'A B\n', expectedOutput: '1 1' }],
    'tokens = input().split()\nprint(" ".join("0" if token == "PAD" else "1" for token in tokens))',
  )),
  practiceStep(neuralId + '-practice-chunks', 'Практика 2: chunk boundaries', 'Разбейте long document без потери хвоста.', makeStdinTask(
    'document-chunks', 'Диапазоны chunks',
    'Даны n и max_len. Выведите полуинтервалы start:end через пробел.',
    '# TODO: прочитайте n и max_len\n# TODO: создайте ranges до n',
    [{ id: 'sample-1', description: 'Неполный хвост', input: '10 4\n', expectedOutput: '0:4 4:8 8:10' }],
    [{ id: 'hidden-1', description: 'Один chunk', input: '3 8\n', expectedOutput: '0:3' }],
    'n, size = map(int, input().split())\nprint(" ".join(f"{start}:{min(start + size, n)}" for start in range(0, n, size)))',
  )),
  sourceStep(neuralId, [researchSources.bertPaper, researchSources.huggingFaceTextClassification]),
]

const bioId = 'nlp-biomedical-ner-relations'
const bioSteps: FlowStep[] = [
  theoryStep(bioId + '-domain', 'Почему biomedical NLP — отдельный домен', 'Терминология, evidence и privacy меняют весь pipeline.', [
    section('biomedical-shift', 'Сущности и контекст', [
      'Biomedical text содержит gene/protein aliases, варианты HGVS, drugs, diseases, cell types, assays, abbreviations, negation и temporality. Один символ может означать gene или protein; общая модель языка смешивает повседневное и специальное значение. Нужны ontology/version, нормализация mention к идентификатору и правила для ambiguous aliases.',
      'BioBERT продолжает pretraining общего BERT на biomedical corpora; PubMedBERT обучен с нуля на biomedical text и собственном vocabulary. Выбор checkpoint подтверждают downstream validation, а не названием. Clinical notes отличаются от PubMed abstracts, поэтому domain-adaptive pretraining и external center evaluation рассматривают отдельно.',
    ], {
      table: { headers: ['Слой', 'Пример', 'Evaluation'], rows: [
        ['NER', 'TP53 → GENE', 'exact span+type F1'],
        ['normalization', 'TP53 → HGNC:11998', 'top-1/top-k accuracy'],
        ['relation', 'TP53 associated_with cancer', 'relation F1'],
        ['assertion', 'no evidence of metastasis', 'status-wise F1'],
      ] },
    }),
  ]),
  theoryStep(bioId + '-pipeline', 'NER → normalization → relation → evidence', 'Каждый слой имеет собственные ошибки.', [
    section('information-extraction', 'Каскад и joint models', [
      'NER находит spans и типы, entity linking сопоставляет их ontology IDs, relation extraction классифицирует пару сущностей в контексте, а evidence extraction сохраняет supporting sentence и provenance. В каскаде ошибка раннего слоя ограничивает recall следующих; поэтому оценивают каждый слой на gold inputs и end-to-end.',
      'Negative examples для relations нельзя формировать только случайно: лёгкие пары завышают performance. Добавляют hard negatives — сущности в одном предложении без утверждаемой связи — и фиксируют candidate generation. Для distant supervision label noise оценивают на ручной выборке, а ontology leakage проверяют по сущностям и публикациям.',
    ]),
  ]),
  theoryStep(bioId + '-privacy', 'Clinical NLP: de-identification и governance', 'Модель не отменяет ответственность за данные.', [
    section('clinical-governance', 'До внешнего checkpoint или API', [
      'Проверяют правовое основание, ethics approval, data use agreement, место хранения, доступ, retention и возможность передачи текста поставщику. De-identification оценивают по recall чувствительных сущностей, включая редкие форматы. Удаление имени не гарантирует анонимность: даты, адреса и редкие события могут реидентифицировать пациента.',
      'Model artifacts и logs тоже могут содержать текст. Запрещают логирование raw notes, проверяют memorization, ограничивают вывод цитат и проводят red-team tests. В публикации описывают governance и ограничения доступа, но не раскрывают protected content.',
    ], {
      bullets: ['Patient-level split.', 'External center/time validation.', 'Subgroup error analysis.', 'Human review для high-risk use.', 'Abstention при низкой уверенности.'],
    }),
  ]),
  {
    id: bioId + '-examples', type: 'worked-example', title: 'Пять biomedical задач', summary: 'От mentions до доказательств.',
    workedExample: [
      { title: 'Gene NER', body: 'Найти TP53 и BRCA1 с exact offsets и типом GENE.' },
      { title: 'Variant normalization', body: 'Связать c.215C>G с transcript/version и canonical identifier.' },
      { title: 'Cancer relation', body: 'Извлечь gene–disease association и supporting sentence.' },
      { title: 'Negation', body: 'Различить «metastasis» и «no evidence of metastasis».' },
      { title: 'Literature triage', body: 'Ранжировать abstracts, сохраняя recall и audit trail исключений.' },
    ],
  },
  {
    id: bioId + '-code', type: 'code', title: 'Offsets сохраняют связь с оригиналом', summary: 'Tokenizer возвращает позиции subwords.',
    codeExample: code('python', [
      'from transformers import AutoTokenizer',
      '',
      'tokenizer = AutoTokenizer.from_pretrained(',
      '    "microsoft/BiomedNLP-BiomedBERT-base-uncased-abstract-fulltext",',
      '    use_fast=True,',
      ')',
      'encoded = tokenizer("TP53 mutation in lung cancer", return_offsets_mapping=True)',
      'print(list(zip(encoded.tokens(), encoded["offset_mapping"])))',
    ].join('\n'), undefined, 'Fast tokenizer позволяет восстановить exact spans в исходной строке.'),
  },
  assessment(bioId, 'Biomedical NLP: 9 вопросов', questions(bioId, [
    ['Зачем entity normalization после NER?', ['Связать alias с устойчивым identifier', 'Увеличить punctuation', 'Создать random split', 'Посчитать AUC'], 0, 'Один объект имеет много названий.'],
    ['Почему «TP53» неоднозначен?', ['Mention может относиться к gene/protein и разным контекстам', 'Это всегда stop word', 'В нём нет букв', 'Он только label'], 0, 'Тип и ontology задают значение.'],
    ['Чем PubMedBERT отличается концептуально?', ['Pretraining с нуля на biomedical text', 'Он не использует tokens', 'Он только для изображений', 'Он гарантирует клиническую пользу'], 0, 'Domain vocabulary и corpus формируются с нуля.'],
    ['Что оценить в каскаде?', ['Каждый слой и end-to-end', 'Только последний output', 'Только training loss', 'Только NER examples'], 0, 'Иначе место потери recall неизвестно.'],
    ['Зачем hard negatives relations?', ['Не дать модели решать задачу по очевидным shortcut', 'Убрать все positives', 'Сделать labels случайными', 'Создать DOI'], 0, 'Реалистичные отрицательные пары повышают сложность.'],
    ['Что означает exact NER match?', ['Совпали span boundaries и type', 'Пересёкся один символ', 'Совпал document label', 'Совпал embedding'], 0, 'Это строгая entity-level оценка.'],
    ['Достаточно ли удалить имя для anonymization?', ['Нет', 'Да всегда', 'Да для rare disease', 'Да, если сохранить адрес'], 0, 'Комбинация квазиидентификаторов может реидентифицировать.'],
    ['Что может утечь через logs?', ['Raw text и identifiers', 'Только GPU temperature', 'Только F1', 'Только code version'], 0, 'Инфраструктура входит в threat surface.'],
    ['Как сравнить biomedical checkpoint с общим?', ['Одинаковый split, budget и downstream protocol', 'По названию', 'По числу букв', 'На training set'], 0, 'Сравнение должно контролировать остальные факторы.'],
  ])),
  practiceStep(bioId + '-practice-offset', 'Практика 1: извлечение span', 'Верните mention по character offsets.', makeStdinTask(
    'character-span', 'Substring по offsets',
    'Первая строка — text, вторая — start end. Выведите text[start:end].',
    '# TODO: прочитайте text и offsets\n# TODO: извлеките точный span',
    [{ id: 'sample-1', description: 'Gene mention', input: 'mutation in TP53 gene\n12 16\n', expectedOutput: 'TP53' }],
    [{ id: 'hidden-1', description: 'Disease mention', input: 'lung cancer sample\n0 11\n', expectedOutput: 'lung cancer' }],
    'text = input()\nstart, end = map(int, input().split())\nprint(text[start:end])',
  )),
  practiceStep(bioId + '-practice-negation', 'Практика 2: простая assertion rule', 'Найдите отрицание в локальном окне.', makeStdinTask(
    'negation-window', 'NEGATED или PRESENT',
    'Дана строка lowercase. Если в трёх словах перед metastasis есть no/not/without — NEGATED, иначе PRESENT.',
    '# TODO: найдите metastasis\n# TODO: проверьте левое окно',
    [{ id: 'sample-1', description: 'Явное отрицание', input: 'there is no evidence of metastasis\n', expectedOutput: 'NEGATED' }],
    [{ id: 'hidden-1', description: 'Положительное утверждение', input: 'new liver metastasis detected\n', expectedOutput: 'PRESENT' }],
    'tokens = input().split()\nindex = tokens.index("metastasis")\nwindow = tokens[max(0, index - 3):index]\nprint("NEGATED" if {"no", "not", "without"} & set(window) else "PRESENT")',
  )),
  sourceStep(bioId, [researchSources.pubmedBertPaper, researchSources.huggingFaceTokenizers]),
]

const ragId = 'nlp-llm-rag-evidence'
const ragSteps: FlowStep[] = [
  theoryStep(ragId + '-llm', 'LLM в исследовании: задача, а не магический собеседник', 'Prompting оценивают как любую другую модель.', [
    section('llm-protocol', 'Frozen prompts и structured outputs', [
      'Для extraction заранее задают input unit, schema, label definitions, examples, refusal rule и parser. Prompt, system instruction, model version, decoding parameters и timestamp сохраняют как часть config. JSON schema валидируют программно; непарсируемый ответ является ошибкой, а не удаляемой строкой.',
      'Few-shot examples берут только из development data. Prompt tuning по final test запрещён. Temperature=0 повышает повторяемость, но не гарантирует детерминизм или истинность. Каждую LLM system сравнивают с простым baseline и оценивают по held-out human labels, стоимости, latency и privacy.',
    ]),
  ]),
  theoryStep(ragId + '-rag', 'RAG: retrieval, generation и provenance', 'Система должна показывать, откуда взялось утверждение.', [
    section('rag-layers', 'Индекс → retrieval → reranking → answer', [
      'Документы очищают, version-control и режут на passages с overlap, сохраняя document ID, section, date и license. Retriever возвращает top-k, optional reranker уточняет порядок, generator отвечает только по evidence и прикрепляет passage IDs. Если доказательства недостаточны или противоречат друг другу, система должна abstain.',
      'Оценивают отдельно retrieval recall@k, reranker nDCG, answer correctness, citation precision/recall, faithfulness и abstention. End-to-end score без layer diagnostics не показывает, потерян ли источник на retrieval или искажён генератором. Index leakage возникает, если в него попал answer key, test annotation или будущая версия статьи.',
    ], {
      table: { headers: ['Слой', 'Artifact', 'Метрика'], rows: [
        ['corpus', 'manifest + checksums', 'coverage/version'],
        ['retrieval', 'ranked passage IDs', 'recall@k/MRR'],
        ['answer', 'claims + citations', 'correctness/faithfulness'],
        ['safety', 'abstention/log', 'unsupported claim rate'],
      ] },
    }),
  ]),
  theoryStep(ragId + '-evidence', 'Evidence synthesis для статьи', 'LLM ускоряет поиск, но автор проверяет каждое утверждение.', [
    section('evidence-table', 'От вопроса к traceable claim', [
      'Для обзора формируют query log, inclusion criteria и evidence table: citation, population, intervention/exposure, outcome, design, sample size, effect, uncertainty, limitation и exact supporting passage. Дубликаты публикаций одной cohort связывают, чтобы не считать её независимыми доказательствами.',
      'Черновик Methods или Introduction может генерироваться из проверенной таблицы, но каждое числовое или фактическое утверждение сопоставляется с первоисточником. Citation existence недостаточно: passage должен поддерживать claim в нужной популяции и контексте. Финальный авторский review и disclosure применения AI следуют правилам целевого журнала.',
    ], {
      callouts: [callout('Граница автоматизации', 'Нельзя делегировать системе ответственность за inclusion, оценку риска смещения и научный вывод.', 'important')],
    }),
  ]),
  {
    id: ragId + '-examples', type: 'worked-example', title: 'Четыре failure modes RAG', summary: 'Ошибка локализуется по сохранённым artifacts.',
    workedExample: [
      { title: 'Retrieval miss', body: 'Relevant paper отсутствует в top-k: исправляют corpus/query/retriever, не prompt prose.' },
      { title: 'Unsupported synthesis', body: 'Passage найден, но claim сильнее источника: измеряют citation entailment.' },
      { title: 'Version drift', body: 'Index обновился без manifest: результат нельзя воспроизвести.' },
      { title: 'Privacy leak', body: 'Clinical passage попал во внешний service/log: нарушен governance layer.' },
    ],
  },
  assessment(ragId, 'LLM и RAG: 8 вопросов', questions(ragId, [
    ['Что версионировать для LLM extraction?', ['Prompt, model, decoding и schema', 'Только final text', 'Только browser', 'Только token count'], 0, 'Все параметры влияют на результат.'],
    ['Что делать с invalid JSON?', ['Считать ошибкой и логировать', 'Молча удалить', 'Назвать correct', 'Добавить в test'], 0, 'Parser success входит в evaluation.'],
    ['Где брать few-shot examples?', ['Из development data', 'Из final test', 'Из answer key', 'После публикации'], 0, 'Test не используется для настройки.'],
    ['Какой первый показатель retrieval?', ['Recall@k', 'Training accuracy generator', 'Число parameters', 'Journal IF'], 0, 'Он проверяет, попал ли relevant passage в candidates.'],
    ['Что означает citation faithfulness?', ['Claim поддерживается процитированным passage', 'Citation существует где-то', 'Ответ длинный', 'Модель уверена'], 0, 'Нужна содержательная поддержка.'],
    ['Когда RAG должен abstain?', ['Когда evidence недостаточно или противоречиво', 'Никогда', 'Когда ответ короткий', 'Только без GPU'], 0, 'Отказ безопаснее unsupported claim.'],
    ['Что такое index leakage?', ['В corpus попал test answer/future information', 'Index слишком мал', 'Нет punctuation', 'Есть document IDs'], 0, 'Retriever получает недопустимую подсказку.'],
    ['Кто отвечает за научный вывод?', ['Авторы исследования', 'LLM provider', 'Tokenizer', 'Vector database'], 0, 'Автоматизация не переносит ответственность.'],
  ])),
  practiceStep(ragId + '-practice-recall', 'Практика 1: recall@k', 'Проверьте покрытие relevant passages.', makeStdinTask(
    'retrieval-recall-k', 'Recall@k',
    'Первая строка — relevant IDs, вторая — ranked top-k IDs. Выведите долю найденных relevant с 3 знаками.',
    '# TODO: прочитайте множества\n# TODO: вычислите recall',
    [{ id: 'sample-1', description: 'Два из трёх', input: 'a b c\nx a c\n', expectedOutput: '0.667' }],
    [{ id: 'hidden-1', description: 'Ничего не найдено', input: 'a b\nx y\n', expectedOutput: '0.000' }],
    'relevant = set(input().split())\nretrieved = set(input().split())\nprint(f"{len(relevant & retrieved) / len(relevant):.3f}")',
  )),
  practiceStep(ragId + '-practice-citations', 'Практика 2: citation audit', 'Найдите claims без source ID.', makeStdinTask(
    'citation-audit', 'Claims без citations',
    'Даны claim_id:source, NONE означает отсутствие. Выведите claim IDs без source или OK.',
    '# TODO: разберите claims\n# TODO: найдите NONE',
    [{ id: 'sample-1', description: 'Один unsupported claim', input: 'c1:p12 c2:NONE c3:p7\n', expectedOutput: 'c2' }],
    [{ id: 'hidden-1', description: 'Все процитированы', input: 'a:s1 b:s2\n', expectedOutput: 'OK' }],
    'missing = []\nfor token in input().split():\n    claim, source = token.split(":")\n    if source == "NONE":\n        missing.append(claim)\nprint(" ".join(missing) if missing else "OK")',
  )),
  sourceStep(ragId, [researchSources.ragPaper, researchSources.huggingFaceTextClassification]),
]

const projectId = 'nlp-capstone-evidence-pipeline'
const projectSteps: FlowStep[] = [
  theoryStep(projectId + '-protocol', 'NLP-capstone: воспроизводимый evidence pipeline', 'Проект заканчивается таблицей ошибок и manuscript-ready Methods.', [
    section('nlp-capstone-design', 'Поддерживаемый исследовательский вопрос', [
      'Выберите один endpoint: abstract screening для обзора gene–cancer relation; NER/normalization genes, proteins и variants; relation extraction; либо retrieval доказательств. Зафиксируйте corpus date, license, unit, inclusion, annotation guideline, group key, primary metric, baseline, model family, compute budget и independent evaluation.',
      'Минимальная сравнительная система включает rule/Dummy, TF-IDF linear baseline, pretrained encoder и один controlled ablation. Transformer не является обязательным победителем. Для каждого run сохраняют split assignment, predictions, probabilities/scores, prompt/model config, latency, cost и errors.',
    ], {
      table: { headers: ['Artifact', 'Содержание'], rows: [
        ['corpus_manifest.csv', 'source, version, license, checksum'],
        ['annotations.jsonl', 'text ID, labels, provenance, adjudication'],
        ['splits.csv', 'unit ID, group ID, fold/test'],
        ['predictions.csv', 'gold, pred, score, model/run'],
        ['error_table.csv', 'category, reviewer, resolution'],
      ] },
    }),
  ]),
  theoryStep(projectId + '-experiments', 'Экспериментальная лестница', 'Каждый следующий шаг отвечает на один вопрос.', [
    section('nlp-experiment-ladder', 'Baseline → representation → domain → error', [
      'Experiment 1 устанавливает Dummy/rule baseline. Experiment 2 обучает TF-IDF+linear model. Experiment 3 заменяет representation на frozen biomedical encoder. Experiment 4 fine-tunes encoder с тем же split и primary metric. Ablation меняет только один фактор: character n-grams, domain checkpoint, long-context aggregation или hard negatives.',
      'Hyperparameters выбирают внутри development CV, а independent test открывают для одного locked pipeline. Если данных мало, repeated group CV даёт распределение development performance, но не заменяет external validation. Все comparisons сопровождают paired predictions и uncertainty по независимой единице.',
    ]),
  ]),
  theoryStep(projectId + '-paper', 'Что войдёт в статью', 'Результат должен пережить внутреннюю репликацию.', [
    section('nlp-manuscript', 'Methods, Results и supplement', [
      'Methods описывает corpus selection, annotation, agreement, preprocessing, tokenization, split, models, hyperparameter search, metrics, CI, error review, ethics и software versions. Results начинается с corpus flow и class distribution, затем primary metric с CI, baseline comparison, subgroup/domain-shift и error taxonomy.',
      'Supplement включает guideline, label schema, prompt templates, search spaces, additional metrics, confusion matrices, per-class support, model card, data statement и executable commands. Discussion отделяет dataset-specific association от обобщаемого вывода и формулирует следующий external test.',
    ], {
      bullets: ['Не обещать Q3 или acceptance.', 'Цель — submission-ready evidence package.', 'Quartile и author guidelines проверяются в момент выбора журнала.', 'Human verification явно описывается.'],
    }),
  ]),
  {
    id: projectId + '-examples', type: 'worked-example', title: 'Пять manuscript-ready outputs', summary: 'Не notebook, а связанная цепочка доказательств.',
    workedExample: [
      { title: 'Corpus flow', body: 'Records found, deduplicated, excluded, annotated, train/dev/test.' },
      { title: 'Table 1', body: 'Sources, dates, labels, lengths, missingness и group counts.' },
      { title: 'Primary table', body: 'Dummy, TF-IDF, encoder: estimate, CI, split, compute.' },
      { title: 'Error figure', body: 'Negation, boundary, rare alias, domain shift с denominators.' },
      { title: 'Release', body: 'Code, configs, manifests, synthetic example и reproducibility instructions.' },
    ],
  },
  assessment(projectId, 'NLP-capstone: 7 вопросов', questions(projectId, [
    ['Что фиксируют до annotation?', ['Unit, guideline и intended use', 'Best test model', 'Discussion conclusion', 'Final color'], 0, 'Labels следуют из формальной задачи.'],
    ['Какой baseline обязателен?', ['Dummy/rule и TF-IDF linear', 'Только largest LLM', 'Только encoder', 'Никакой'], 0, 'Нужна нижняя и сильная дешёвая граница.'],
    ['Что меняет ablation?', ['Один фактор', 'Все параметры сразу', 'Test labels', 'Journal title'], 0, 'Тогда эффект интерпретируем.'],
    ['Когда открывать independent test?', ['После lock pipeline', 'После каждого prompt', 'До split', 'Для выбора vocabulary'], 0, 'Test не участвует в разработке.'],
    ['Что публиковать с subgroup F1?', ['n/support и uncertainty', 'Только лучший subgroup', 'Только training loss', 'Ничего'], 0, 'Малые группы дают нестабильные estimates.'],
    ['Гарантирует ли курс Q3 acceptance?', ['Нет', 'Да', 'Только с BERT', 'Только с 100% accuracy'], 0, 'Курс готовит дизайн и пакет; решение принимает журнал.'],
    ['Что позволяет воспроизвести corpus?', ['Manifest, version, license и checksums', 'Screenshot', 'Memory автора', 'Название папки'], 0, 'Происхождение данных должно быть проверяемым.'],
  ])),
  practiceStep(projectId + '-practice-manifest', 'Практика 1: manifest audit', 'Проверьте обязательные поля.', makeStdinTask(
    'nlp-manifest-audit', 'Поля manifest',
    'Даны названия полей. Обязательны SOURCE VERSION LICENSE CHECKSUM. Выведите отсутствующие по порядку или OK.',
    '# TODO: прочитайте fields\n# TODO: сравните с required',
    [{ id: 'sample-1', description: 'Нет license', input: 'SOURCE VERSION CHECKSUM\n', expectedOutput: 'LICENSE' }],
    [{ id: 'hidden-1', description: 'Полный manifest', input: 'CHECKSUM LICENSE SOURCE VERSION\n', expectedOutput: 'OK' }],
    'present = set(input().split())\nrequired = ["SOURCE", "VERSION", "LICENSE", "CHECKSUM"]\nmissing = [field for field in required if field not in present]\nprint(" ".join(missing) if missing else "OK")',
  )),
  practiceStep(projectId + '-practice-labels', 'Практика 2: label distribution', 'Посчитайте support классов.', makeStdinTask(
    'label-support', 'Support по label',
    'Даны labels. Выведите label:count по алфавиту.',
    '# TODO: посчитайте labels\n# TODO: отсортируйте keys',
    [{ id: 'sample-1', description: 'Два класса', input: 'include exclude include\n', expectedOutput: 'exclude:1 include:2' }],
    [{ id: 'hidden-1', description: 'Три класса', input: 'B A C A\n', expectedOutput: 'A:2 B:1 C:1' }],
    'from collections import Counter\ncounts = Counter(input().split())\nprint(" ".join(f"{label}:{counts[label]}" for label in sorted(counts)))',
  )),
  practiceStep(projectId + '-practice-freeze', 'Практика 3: lock checklist', 'Убедитесь, что pipeline готов к test.', makeStdinTask(
    'pipeline-lock', 'Готовность к independent test',
    'Даны отмеченные пункты. Нужны SPLIT MODEL THRESHOLD METRIC SEED. Выведите READY или NOT_READY и отсутствующие.',
    '# TODO: проверьте lock fields\n# TODO: сформируйте статус',
    [{ id: 'sample-1', description: 'Не выбран threshold', input: 'SPLIT MODEL METRIC SEED\n', expectedOutput: 'NOT_READY THRESHOLD' }],
    [{ id: 'hidden-1', description: 'Всё зафиксировано', input: 'METRIC THRESHOLD MODEL SPLIT SEED\n', expectedOutput: 'READY' }],
    'present = set(input().split())\nrequired = ["SPLIT", "MODEL", "THRESHOLD", "METRIC", "SEED"]\nmissing = [item for item in required if item not in present]\nprint("NOT_READY " + " ".join(missing) if missing else "READY")',
  )),
  sourceStep(projectId, [researchSources.tripOd, researchSources.probastAi, researchSources.ragPaper]),
]

export const nlpTopics = [
  researchTopic({ id: dataId, title: '12.1 NLP-задачи, корпуса и разметка', order: 1, summary: 'Единица наблюдения, label schema, annotation guideline, agreement, provenance и privacy.', blockId, blockTitle, blockIcon, format: 'лаборатория разметки + 2 проверки', estimatedMinutes: 85, quizQuestions: 6, practiceTasks: 2, examples: 4, terminology: ['corpus', 'annotation guideline', 'BIO tags', 'provenance', 'agreement'], cheatsheet: ['Unit определяет split и metric.', 'Test annotation замораживается.'], sources: [researchSources.huggingFaceTokenizers], steps: dataSteps }),
  researchTopic({ id: tfidfId, title: '12.2 TF-IDF, n-grams и классические модели', order: 2, summary: 'Sparse matrix, word/character n-grams, Naive Bayes, LogisticRegression и LinearSVC.', blockId, blockTitle, blockIcon, format: 'baseline-конструктор + 2 кодовых задачи', estimatedMinutes: 95, quizQuestions: 8, practiceTasks: 2, examples: 5, terminology: ['vocabulary', 'TF-IDF', 'n-gram', 'sparse matrix', 'LinearSVC'], formulas: ['tf-idf(t,d)', 'linear score'], cheatsheet: ['Vocabulary fit только на train fold.', 'Всегда сравнивайте с Dummy.'], sources: [researchSources.sklearnText], steps: tfidfSteps }),
  researchTopic({ id: evalId, title: '12.3 Split, leakage и метрики NLP', order: 3, summary: 'Document/patient/time split, duplicates, classification, NER, retrieval, threshold и clustered CI.', blockId, blockTitle, blockIcon, format: 'пять validation-сцениев + 2 аудита', estimatedMinutes: 110, quizQuestions: 9, practiceTasks: 2, examples: 5, terminology: ['document split', 'patient split', 'macro F1', 'exact span F1', 'recall@k'], formulas: ['macro F1', 'recall@k'], cheatsheet: ['Group key следует за зависимостью.', 'Threshold выбирают по OOF development predictions.'], sources: [researchSources.sklearnValidation, researchSources.probastAi], steps: evalSteps }),
  researchTopic({ id: embedId, title: '12.4 Word2Vec, fastText и embeddings', order: 4, summary: 'Статические и контекстные vectors, pooling, cosine, bi-encoder и cross-encoder.', blockId, blockTitle, blockIcon, format: 'карта представлений + cosine-практика', estimatedMinutes: 75, quizQuestions: 7, practiceTasks: 1, examples: 5, terminology: ['Word2Vec', 'fastText', 'embedding', 'cosine similarity', 'bi-encoder'], formulas: ['cosine similarity'], cheatsheet: ['Embedding quality проверяют downstream.', 'Threshold не универсален.'], sources: [researchSources.bertPaper], steps: embedSteps }),
  researchTopic({ id: neuralId, title: '12.5 CNN, RNN, attention и Transformers', order: 5, summary: 'Sequence architectures, BERT, subwords, masks, truncation, fine-tuning и reproducible comparison.', blockId, blockTitle, blockIcon, format: 'архитектурный разбор + 2 tensor-задачи', estimatedMinutes: 115, quizQuestions: 9, practiceTasks: 2, examples: 5, terminology: ['CNN', 'LSTM', 'self-attention', 'Transformer', 'BERT'], formulas: ['attention(Q,K,V)'], cheatsheet: ['Mask исключает padding.', 'Сложная модель сравнивается с TF-IDF.'], sources: [researchSources.bertPaper, researchSources.huggingFaceTextClassification], steps: neuralSteps }),
  researchTopic({ id: bioId, title: '12.6 Biomedical NLP: NER, normalization и relations', order: 6, summary: 'Genes, proteins, variants, diseases, PubMedBERT, каскад извлечения, отрицание и governance.', blockId, blockTitle, blockIcon, format: 'end-to-end information extraction + privacy audit', estimatedMinutes: 125, quizQuestions: 9, practiceTasks: 2, examples: 6, terminology: ['biomedical NER', 'entity normalization', 'relation extraction', 'PubMedBERT', 'de-identification'], cheatsheet: ['Оценивайте слои и end-to-end.', 'Logs тоже могут содержать PHI.'], sources: [researchSources.pubmedBertPaper], steps: bioSteps }),
  researchTopic({ id: ragId, title: '12.7 LLM, RAG и проверяемый синтез доказательств', order: 7, summary: 'Frozen prompts, structured outputs, retrieval, citations, abstention и evidence table.', blockId, blockTitle, blockIcon, format: 'RAG-аудит по слоям + 2 задачи', estimatedMinutes: 105, quizQuestions: 8, practiceTasks: 2, examples: 4, terminology: ['LLM', 'RAG', 'retrieval', 'citation faithfulness', 'abstention'], formulas: ['recall@k'], cheatsheet: ['Версионируйте corpus и prompt.', 'Fluency не равна evidence.'], sources: [researchSources.ragPaper], steps: ragSteps }),
  researchTopic({ id: projectId, title: '12.8 NLP-capstone для статьи', order: 8, summary: 'Протокол, baseline ladder, locked test, error taxonomy и воспроизводимый evidence package.', blockId, blockTitle, blockIcon, format: 'мини-исследование + 3 release-проверки', estimatedMinutes: 140, quizQuestions: 7, practiceTasks: 3, examples: 5, terminology: ['experiment ladder', 'controlled ablation', 'model card', 'corpus manifest', 'submission-ready'], cheatsheet: ['Один locked pipeline — один test.', 'Q3 readiness не гарантирует acceptance.'], sources: [researchSources.tripOd, researchSources.probastAi], steps: projectSteps }),
]
