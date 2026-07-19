import type { FlowStep } from '../../aiCurriculumTypes'
import type { QuizQuestion } from '../../quizzes'
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
} from './helpers'

const blockId = 'article-capstone'
const blockTitle = 'От протокола до статьи'
const blockIcon = '13'

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

const reviewId = 'capstone-literature-gap'
const reviewSteps: FlowStep[] = [
  theoryStep(reviewId + '-question', 'От клинической проблемы к поисковому вопросу', 'Introduction начинается с проверяемого пробела, а не с перечня технологий.', [
    section('review-frame', 'Population, predictor/exposure, outcome и model role', [
      'Сформулируйте один основной вопрос и разложите его на population, index moment, predictors/exposure, outcome, prediction horizon, setting и intended use. Для prognostic model отдельно укажите, создаётся ли новая модель, обновляется существующая или выполняется external evaluation. Для omics уточните tissue, assay, contrast и независимую cohort; для protein ML — sequence family и task.',
      'Поисковые концепты строят из синонимов, controlled vocabulary и известных aliases. Search string, базы, даты и filters сохраняют дословно. Поиск повторяют перед submission, потому что новая работа может изменить novelty. Citation chasing дополняет, но не заменяет воспроизводимый основной поиск.',
    ], {
      table: { headers: ['Слой вопроса', 'Gamma Knife', 'Cancer NLP/omics'], rows: [
        ['Population', 'пациенты с метастазами мозга', 'заданная cancer cohort/corpus'],
        ['Outcome', 'прогрессия за horizon', 'expression/variant/relation label'],
        ['Role', 'prognostic prediction', 'biomarker discovery или extraction'],
        ['Gap', 'нет честной center/time validation', 'нет external corpus validation'],
      ] },
    }),
  ]),
  theoryStep(reviewId + '-synthesis', 'Evidence matrix и проверяемая novelty', 'Пробел доказывается сравнением, а не словами «впервые».', [
    section('evidence-matrix', 'Что извлекать из каждой работы', [
      'Evidence matrix содержит citation, cohort/corpus, location/date, inclusion, n/events, target, feature timing, split, preprocessing, model, primary metric с uncertainty, calibration, external validation, code/data и ограничения. Для NLP добавляют annotation unit, agreement и duplicate policy; для omics — assay, normalization, multiple testing и validation cohort.',
      'Gap классифицируют как population, data quality, validation, method comparison, calibration/utility, reproducibility или biological interpretation. Новая архитектура без лучшего дизайна редко является самостоятельной научной новизной. Формулировка novelty должна выдержать прямое сравнение с 3–5 ближайшими работами.',
    ], {
      bullets: ['Не сравнивайте числа из несовместимых cohorts как leaderboard.', 'Отделяйте development от external evaluation.', 'Фиксируйте причины исключения full text.', 'Дубли одной cohort не считаются независимыми подтверждениями.'],
      callouts: [callout('Рабочая novelty', '«Мы оцениваем заранее зафиксированный pipeline на временно/географически независимых данных и публикуем calibration, CI и код» сильнее, чем «применили XGBoost».', 'remember')],
    }),
  ]),
  {
    id: reviewId + '-examples', type: 'worked-example', title: 'Пять формулировок пробела', summary: 'Пробел связывает литературу с конкретным экспериментом.',
    workedExample: [
      { title: 'Validation gap', body: 'Работы используют random row split; мы проверяем patient/time/center transfer.' },
      { title: 'Reporting gap', body: 'Есть AUC без calibration и CI; мы публикуем полную performance model evaluation.' },
      { title: 'Data gap', body: 'Недостаточно cancer-specific annotation; создаётся guideline и adjudicated corpus.' },
      { title: 'Reproducibility gap', body: 'Нет split IDs и predictions; пакет включает manifests и machine-readable outputs.' },
      { title: 'Biology gap', body: 'Ассоциация экспрессии не подтверждена pathway/protein/external cohort evidence.' },
    ],
  },
  {
    id: reviewId + '-code', type: 'code', title: 'Evidence matrix как таблица', summary: 'Структура позволяет сравнивать дизайн, а не впечатление.',
    codeExample: code('python', [
      'columns = [',
      '    "citation", "population", "n", "events", "outcome",',
      '    "split", "external_validation", "primary_metric",',
      '    "calibration", "code_available", "main_limitation",',
      ']',
      'evidence = pd.DataFrame(records, columns=columns)',
      'assert evidence["citation"].is_unique',
      'evidence.to_csv("review/evidence_matrix.csv", index=False)',
    ].join('\n'), undefined, 'Пустое поле — видимый пробел, а не повод молча его игнорировать.'),
  },
  assessment(reviewId, 'Литература и research gap: 7 вопросов', questions(reviewId, [
    ['Что фиксирует роль model study?', ['Development, update или evaluation', 'Цвет Figure', 'GPU brand', 'Author order'], 0, 'Эти роли требуют разного дизайна и отчётности.'],
    ['Когда обновлять поиск?', ['Перед submission', 'Никогда', 'Только после rejection', 'После каждого epoch'], 0, 'Novelty зависит от актуальной литературы.'],
    ['Что хранить для воспроизводимости поиска?', ['Базы, строки, даты и filters', 'Только число статей', 'Screenshot первой страницы', 'Только DOI победителя'], 0, 'Другой исследователь должен повторить стратегию.'],
    ['Можно ли сравнивать AUC разных cohorts как leaderboard?', ['Нет, без учёта population/design', 'Да всегда', 'Только без CI', 'Только для NLP'], 0, 'Различие выборок меняет сложность задачи.'],
    ['Что сильнее как novelty?', ['Независимая validation и полный reporting', 'Ещё один classifier без design change', 'Больше цветов', 'Выше training score'], 0, 'Научная ценность определяется новым надёжным знанием.'],
    ['Что добавить в evidence matrix NLP?', ['Annotation unit, agreement и duplicate policy', 'Только batch size', 'Только tokenizer name', 'Ничего'], 0, 'Качество labels и независимость критичны.'],
    ['Доказывает ли слово «впервые» novelty?', ['Нет, нужен сравнительный evidence synthesis', 'Да', 'Только в title', 'Только без ссылок'], 0, 'Приоритет проверяется литературой.'],
  ])),
  practiceStep(reviewId + '-practice-query', 'Практика 1: Boolean search string', 'Соедините синонимы по концептам.', makeStdinTask(
    'boolean-search', 'Строка из трёх концептов',
    'Даны три группы синонимов через |, слова группы через запятую. Выведите (a OR b) AND ... с сохранением порядка.',
    '# TODO: разделите concepts\n# TODO: соберите Boolean expression',
    [{ id: 'sample-1', description: 'Три концепта', input: 'cancer,neoplasm|gene,genomic|prediction,model\n', expectedOutput: '(cancer OR neoplasm) AND (gene OR genomic) AND (prediction OR model)' }],
    [{ id: 'hidden-1', description: 'Один термин в группе', input: 'protein|structure,fold|cancer\n', expectedOutput: '(protein) AND (structure OR fold) AND (cancer)' }],
    'groups = input().strip().split("|")\nparts = ["(" + " OR ".join(group.split(",")) + ")" for group in groups]\nprint(" AND ".join(parts))',
  )),
  practiceStep(reviewId + '-practice-matrix', 'Практика 2: найти reporting gap', 'Проверьте design fields.', makeStdinTask(
    'evidence-gap', 'Пропуски статьи-кандидата',
    'Даны поля статьи. Нужны SPLIT CI CALIBRATION CODE. Выведите отсутствующие или COMPLETE.',
    '# TODO: сравните с required\n# TODO: выведите gaps по порядку',
    [{ id: 'sample-1', description: 'Нет calibration и code', input: 'SPLIT CI\n', expectedOutput: 'CALIBRATION CODE' }],
    [{ id: 'hidden-1', description: 'Все поля есть', input: 'CODE CALIBRATION CI SPLIT\n', expectedOutput: 'COMPLETE' }],
    'present = set(input().split())\nrequired = ["SPLIT", "CI", "CALIBRATION", "CODE"]\nmissing = [item for item in required if item not in present]\nprint(" ".join(missing) if missing else "COMPLETE")',
  )),
  sourceStep(reviewId, [researchSources.equator, researchSources.tripOd]),
]

const protocolId = 'capstone-ethics-sap-sample-size'
const protocolSteps: FlowStep[] = [
  theoryStep(protocolId + '-governance', 'Data governance, ethics и разрешённое утверждение', 'До анализа нужно определить, что разрешено делать с данными.', [
    section('governance-plan', 'Доступ, privacy и provenance', [
      'Протокол описывает источник данных, правовое основание, ethics/IRB status, consent или waiver, data use agreement, контролируемый доступ, retention, sharing limits и incident procedure. Персональные identifiers, linkage keys и analysis IDs разделяют. Логи, notebooks, model artifacts и external services входят в область privacy review.',
      'Data provenance включает версию выгрузки, data dictionary, inclusion dates, transformations и checksums. Изменение cohort после просмотра результатов создаёт новую protocol version и объясняется. Closed data не исключают воспроизводимость: публикуют схему доступа, synthetic example, metadata и код без protected values.',
    ]),
  ]),
  theoryStep(protocolId + '-sap', 'Statistical Analysis Plan до открытия test', 'SAP превращает исследовательские решения в проверяемые обещания.', [
    section('sap-contents', 'Primary analysis и sensitivity analyses', [
      'SAP фиксирует estimand или prediction target, analysis population, exclusions, index date, feature availability, missing data, split, baseline, candidate models, search space, primary metric/effect, CI, threshold, subgroup, multiplicity и sensitivity analyses. Для omics отдельно задают normalization, covariates, contrasts и FDR; для NLP — unit, duplicates, label adjudication и metric averaging.',
      'Отклонения не запрещены, но маркируются date/reason/impact как amendments. Primary result не меняют после test. Exploratory analyses показывают отдельно и не получают язык подтверждённой гипотезы. PROBAST+AI используют как design review, а TRIPOD+AI — как reporting scaffold уже на стадии протокола.',
    ], {
      callouts: [callout('Version lock', 'Hash split, config и SAP сохраняются до финальной evaluation. Это не бюрократия, а защита от незаметного выбора удачного анализа.', 'important')],
    }),
  ]),
  theoryStep(protocolId + '-size', 'Размер выборки и events — не универсальное число', 'Precision и complexity планируются под конкретный анализ.', [
    section('sample-size-plan', 'Prediction, omics и NLP', [
      'Для prediction model development sample size зависит от outcome prevalence/event rate, числа candidate parameters, ожидаемого explained variation и допустимого optimism; простое правило «10 events per variable» недостаточно. Для external evaluation планируют precision primary metric и calibration. При clustered data эффективный размер меньше числа строк.',
      'Для omics power связан с dispersion, effect distribution, depth, multiple testing и biological replicates; technical replicates не заменяют независимые samples. Для NLP размер зависит от prevalence, annotation reliability и требуемой ширины CI. Learning curve показывает, ограничивает ли model data, но не является post-hoc оправданием маленького test.',
    ], {
      table: { headers: ['Задача', 'Независимая единица', 'Планирование'], rows: [
        ['clinical prediction', 'patient', 'events + parameters + calibration precision'],
        ['RNA-seq DE', 'biological sample', 'dispersion/effect/FDR'],
        ['NER', 'document/entity', 'support + entity-level CI'],
        ['retrieval', 'question', 'relevant judgments + recall@k CI'],
      ] },
    }),
  ]),
  {
    id: protocolId + '-examples', type: 'worked-example', title: 'Четыре protocol decisions', summary: 'Каждое решение имеет момент фиксации.',
    workedExample: [
      { title: 'Index date', body: 'Все predictors Gamma Knife доступны до решения, которое моделируется.' },
      { title: 'ASPA target', body: 'HbA1c определяет undiagnosed diabetes и не входит в predictors.' },
      { title: 'Omics multiplicity', body: 'Primary contrast и FDR procedure задаются до просмотра volcano plot.' },
      { title: 'NLP test', body: 'Adjudicated documents заморожены до prompt/model tuning.' },
    ],
  },
  assessment(protocolId, 'Governance, SAP и sample size: 8 вопросов', questions(protocolId, [
    ['Что входит в privacy review кроме raw data?', ['Logs, notebooks, artifacts и external services', 'Только title', 'Только metrics', 'Ничего'], 0, 'Производные системы тоже могут раскрывать данные.'],
    ['Что делать с closed data?', ['Опубликовать access procedure, metadata, code и synthetic example', 'Заявить полную открытость', 'Выложить identifiers', 'Удалить Methods'], 0, 'Воспроизводимость адаптируется к ограничениям доступа.'],
    ['Когда lock SAP?', ['До открытия independent test', 'После выбора лучшего test result', 'После review', 'Никогда'], 0, 'Так primary analysis не адаптируется к результату.'],
    ['Можно ли отклониться от SAP?', ['Да, с датой, причиной и маркировкой', 'Нет никогда', 'Да, молча', 'Только удалив SAP'], 0, 'Прозрачный amendment сохраняет audit trail.'],
    ['Достаточно ли 10 events per variable?', ['Нет, нужен task-specific расчет', 'Да всегда', 'Только для NLP', 'Только без missingness'], 0, 'Правило не контролирует все источники optimism.'],
    ['Что является replicate RNA-seq?', ['Независимый biological sample', 'Повторное чтение файла', 'Два графика', 'Два folds одного patient'], 0, 'Inference опирается на biological replication.'],
    ['Заменяет ли learning curve sample-size plan?', ['Нет', 'Да', 'Только при overfit', 'Только для Transformer'], 0, 'Она диагностирует observed regime, но не планирует precision test.'],
    ['Для чего PROBAST+AI на стадии протокола?', ['Найти design risks до анализа', 'Выбрать цвет таблицы', 'Гарантировать acceptance', 'Посчитать quartile'], 0, 'Инструмент выявляет риск смещения и applicability issues.'],
  ])),
  practiceStep(protocolId + '-practice-lock', 'Практика 1: SAP lock', 'Проверьте минимальный primary plan.', makeStdinTask(
    'sap-lock-audit', 'Поля SAP',
    'Даны поля. Нужны TARGET SPLIT PRIMARY_METRIC CI MISSING_DATA. Выведите отсутствующие или LOCKED.',
    '# TODO: прочитайте fields\n# TODO: проверьте полный SAP',
    [{ id: 'sample-1', description: 'Нет CI', input: 'TARGET SPLIT PRIMARY_METRIC MISSING_DATA\n', expectedOutput: 'CI' }],
    [{ id: 'hidden-1', description: 'Полный план', input: 'CI TARGET MISSING_DATA SPLIT PRIMARY_METRIC\n', expectedOutput: 'LOCKED' }],
    'present = set(input().split())\nrequired = ["TARGET", "SPLIT", "PRIMARY_METRIC", "CI", "MISSING_DATA"]\nmissing = [item for item in required if item not in present]\nprint(" ".join(missing) if missing else "LOCKED")',
  )),
  practiceStep(protocolId + '-practice-events', 'Практика 2: число events', 'Не путайте rows и independent outcomes.', makeStdinTask(
    'event-count', 'Patients с событием',
    'Даны patient:y, patient может повторяться. Выведите число уникальных patients с хотя бы одним y=1.',
    '# TODO: сгруппируйте по patient\n# TODO: посчитайте patients с event',
    [{ id: 'sample-1', description: 'Повторные наблюдения', input: 'p1:0 p1:1 p2:0 p3:1\n', expectedOutput: '2' }],
    [{ id: 'hidden-1', description: 'Нет событий', input: 'a:0 b:0 a:0\n', expectedOutput: '0' }],
    'events = set()\nfor token in input().split():\n    patient, y = token.split(":")\n    if y == "1":\n        events.add(patient)\nprint(len(events))',
  )),
  sourceStep(protocolId, [researchSources.probastAi, researchSources.tripOd, researchSources.fair]),
]

const writingId = 'capstone-methods-discussion-supplement'
const writingSteps: FlowStep[] = [
  theoryStep(writingId + '-methods', 'Methods пишется из artifacts', 'Читатель должен восстановить путь от source data до estimate.', [
    section('methods-map', 'Дизайн, данные, модели и evaluation', [
      'Methods последовательно описывает study design, setting/dates, participants/samples/documents, outcome/labels, predictors/features, sample-size rationale, missing data, preprocessing, split, model specification, tuning, metrics, CI, calibration, threshold, subgroup/sensitivity, software и ethics. Каждое обучаемое преобразование указывается как train-only.',
      'Названия packages без версии и фраза «данные поделили 80/20» недостаточны. Укажите random/group/time rule, seed или сохранённые split IDs, число folds, повторения, inner/outer loops и единицу bootstrap. Для pretrained models приводят exact checkpoint, tokenizer, max length, pooling и fine-tuning budget.',
    ], {
      callouts: [callout('Проверка Methods', 'Если новый исследователь не может по тексту выбрать ту же cohort и построить тот же split, раздел ещё не закончен.', 'remember')],
    }),
  ]),
  theoryStep(writingId + '-results', 'Results: числа, знаменатели и неопределённость', 'Narrative следует за заранее заданным primary analysis.', [
    section('results-order', 'От cohort flow к sensitivity', [
      'Сначала сообщают flow и final denominators, затем характеристики данных, missingness и event/class distribution. Primary metric/effect показывают с CI и evaluation scheme. После этого идут calibration/threshold/clinical utility, baseline comparison, ablation, external/subgroup и sensitivity analyses. Неудачные или противоречивые результаты остаются видимыми.',
      'Не используйте p-value как бинарный фильтр важности. Для omics одновременно показывают effect size и FDR; для prediction — discrimination и calibration; для NLP — per-class support и error taxonomy. Числа в abstract, text, table и figure программно сверяются из одного artifact.',
    ]),
  ]),
  theoryStep(writingId + '-discussion', 'Discussion без overclaim', 'Интерпретация ограничена design и validation.', [
    section('discussion-structure', 'Principal finding → comparison → mechanism → limits → next test', [
      'Первый абзац отвечает на primary question без повторения всей таблицы. Затем результат сравнивают с ближайшими исследованиями с учётом различий population, target и split. Биологическая интерпретация связывает genes/proteins/pathways с внешними evidence, но feature importance не называют причинностью.',
      'Limitations конкретно описывают selection bias, label uncertainty, missingness, small events, center/domain shift, multiple testing, compute search, absent external validation и restricted data. Последний абзац формулирует следующий независимый test или prospective study, а не декларацию немедленной клинической готовности.',
    ], {
      bullets: ['Association ≠ causation.', 'Internal validation ≠ general applicability.', 'Statistical significance ≠ clinical utility.', 'Q3-ready package ≠ гарантия publication.'],
    }),
  ]),
  {
    id: writingId + '-examples', type: 'worked-example', title: 'Пять manuscript fragments', summary: 'Сильный текст точен и ограничен.',
    workedExample: [
      { title: 'Methods', body: 'Preprocessing и feature selection выполнены внутри inner folds Pipeline.' },
      { title: 'Primary result', body: 'Указаны estimate, 95% CI, n/events и independent evaluation.' },
      { title: 'Calibration', body: 'Discrimination не подменяет agreement predicted/observed risk.' },
      { title: 'Limitation', body: 'Single-center retrospective design ограничивает transportability.' },
      { title: 'Conclusion', body: 'Pipeline требует external/prospective evaluation до clinical use.' },
    ],
  },
  assessment(writingId, 'Methods, Results и Discussion: 7 вопросов', questions(writingId, [
    ['Что обязательно в описании split?', ['Unit/group/time rule и воспроизводимые IDs/seed', 'Только 80/20', 'Только название function', 'Только test size'], 0, 'Нужна реальная схема независимости.'],
    ['Что сообщить для pretrained model?', ['Exact checkpoint, tokenizer и fine-tuning settings', 'Только слово BERT', 'Только GPU', 'Только epoch победителя'], 0, 'Model identity включает preprocessing и training.'],
    ['С чего начинается Results?', ['Cohort flow и denominators', 'Discussion', 'Best feature', 'Journal rank'], 0, 'Читатель должен знать, кто вошёл в анализ.'],
    ['Что показывать рядом с omics p-value?', ['Effect size и FDR', 'Только rank', 'Training AUC', 'Token count'], 0, 'Величина эффекта и multiplicity обязательны.'],
    ['Можно ли назвать SHAP causal mechanism?', ['Нет', 'Да всегда', 'Только для gene', 'Только при p<0.05'], 0, 'Model attribution не идентифицирует intervention effect.'],
    ['Как формулировать отсутствие external validation?', ['Как конкретное ограничение и следующий test', 'Скрыть', 'Назвать external', 'Заменить training score'], 0, 'Границы applicability должны быть явными.'],
    ['Что синхронизирует abstract и tables?', ['Общий versioned metrics artifact', 'Ручное копирование', 'Память автора', 'Округление до одного знака'], 0, 'Программный единый источник предотвращает расхождения.'],
  ])),
  practiceStep(writingId + '-practice-claim', 'Практика 1: сила утверждения', 'Найдите overclaim markers.', makeStdinTask(
    'claim-strength', 'Осторожное или чрезмерное утверждение',
    'Даны слова uppercase. Если есть PROVES, CAUSES или READY_FOR_CLINIC — OVERCLAIM, иначе CAUTIOUS.',
    '# TODO: прочитайте tokens\n# TODO: проверьте запрещённые markers',
    [{ id: 'sample-1', description: 'Причинное overclaim', input: 'MODEL CAUSES OUTCOME\n', expectedOutput: 'OVERCLAIM' }],
    [{ id: 'hidden-1', description: 'Осторожный вывод', input: 'ASSOCIATED REQUIRES_EXTERNAL_VALIDATION\n', expectedOutput: 'CAUTIOUS' }],
    'tokens = set(input().split())\nmarkers = {"PROVES", "CAUSES", "READY_FOR_CLINIC"}\nprint("OVERCLAIM" if tokens & markers else "CAUTIOUS")',
  )),
  practiceStep(writingId + '-practice-consistency', 'Практика 2: сверка результатов', 'Найдите несовпадающие числа.', makeStdinTask(
    'result-consistency', 'Abstract и table',
    'Даны пары name:abstract:table. Выведите names с разными значениями или OK.',
    '# TODO: разберите значения\n# TODO: найдите несогласованные fields',
    [{ id: 'sample-1', description: 'Разный n', input: 'AUC:0.78:0.78 N:548:547\n', expectedOutput: 'N' }],
    [{ id: 'hidden-1', description: 'Полное совпадение', input: 'F1:0.7:0.7 N:100:100\n', expectedOutput: 'OK' }],
    'bad = []\nfor token in input().split():\n    name, abstract, table = token.split(":")\n    if abstract != table:\n        bad.append(name)\nprint(" ".join(bad) if bad else "OK")',
  )),
  sourceStep(writingId, [researchSources.tripOd, researchSources.probastAi, researchSources.equator]),
]

const submitId = 'capstone-journal-submission-review'
const submitSteps: FlowStep[] = [
  theoryStep(submitId + '-journal', 'Выбор журнала: scope прежде quartile', 'Q3 — изменяемая библиометрическая категория, а не свойство рукописи.', [
    section('journal-fit', 'Проверка на дату submission', [
      'Составьте shortlist по scope, аудитории, article type, похожим публикациям, indexing, допустимой длине, data/code policy, fee, review model и срокам. Quartile проверяют в актуальном источнике на дату выбора: он зависит от базы, категории и года. Нельзя обещать, что конкретный журнал останется Q3 или примет работу.',
      'Признаки хищнического журнала: агрессивные письма, непрозрачные fees, ложная индексация, фиктивная editorial board и гарантированное быстрое принятие. Проверяйте официальный сайт, реальную базу индексации и последние выпуски. Одновременная подача в несколько журналов обычно недопустима.',
    ], {
      table: { headers: ['Критерий', 'Проверяемый вопрос'], rows: [
        ['Scope', 'публикует ли журнал такой design/data type?'],
        ['Reporting', 'какие checklist и data statements нужны?'],
        ['Quartile', 'какая база, категория и год?'],
        ['Cost', 'APC, waiver и другие fees?'],
        ['Trust', 'правдивы ли indexing/editorial contacts?'],
      ] },
    }),
  ]),
  theoryStep(submitId + '-package', 'Submission package без сюрпризов', 'Каждый файл имеет функцию и согласованную версию.', [
    section('submission-files', 'Manuscript, cover letter и declarations', [
      'Перед загрузкой скачайте актуальные author instructions и создайте checklist. Пакет может включать title page, blinded manuscript, highlights, graphical abstract, figures, tables, supplement, reporting checklist, data/code statement, ethics, funding, conflicts, author contributions и AI-use disclosure. Требования конкретного журнала имеют приоритет.',
      'Cover letter в одном экране формулирует вопрос, главный результат, novelty, fit со scope, подтверждение original work и отсутствие simultaneous submission. Он не преувеличивает clinical readiness и не повторяет abstract. Все authors подтверждают финальную версию, contributions и conflicts.',
    ]),
  ]),
  theoryStep(submitId + '-review', 'Ответ рецензентам как контролируемый change log', 'Цель — сделать рукопись проверяемее.', [
    section('review-response', 'Point-by-point и новые analyses', [
      'Скопируйте каждый комментарий, дайте короткий ответ, опишите изменение и укажите location. Если согласны — благодарите кратко и меняйте текст. Если не согласны — отвечайте доказательствами и ограничениями без спора о статусе. Все manuscript edits синхронизируют с tables, figures, supplement и code release.',
      'Запрошенный analysis сначала классифицируют: clarification, pre-specified sensitivity, new exploratory analysis или новый study scope. Новый exploratory результат маркируют и не превращают в primary. Если запрос требует недоступных данных, честно объясняют ограничение и смягчают claim. После revision повторяют полный test/build/reproduction checklist.',
    ], {
      callouts: [callout('Без p-hacking на revision', 'Нельзя перебирать анализы до желаемого ответа рецензенту. Покажите обоснованный sensitivity result и его uncertainty, даже если вывод не усилился.', 'important')],
    }),
  ]),
  {
    id: submitId + '-examples', type: 'worked-example', title: 'Пять решений перед submission', summary: 'Редакционная готовность проверяется отдельно от научной.',
    workedExample: [
      { title: 'Scope fit', body: 'В последних выпусках есть comparable prediction/bioinformatics studies.' },
      { title: 'Q3 check', body: 'Записаны database, subject category, year и date checked.' },
      { title: 'Cover letter', body: 'Один вопрос, один основной result, один gap, без гарантии impact.' },
      { title: 'Reviewer response', body: 'Comment → response → exact change → manuscript location.' },
      { title: 'Post-revision audit', body: 'Numbers, figures, supplement, code и checklist пересобраны.' },
    ],
  },
  assessment(submitId, 'Журнал, submission и review: 8 вопросов', questions(submitId, [
    ['Что важнее первого quartile filter?', ['Scope и audience fit', 'Самый низкий APC', 'Самое короткое title', 'Цвет сайта'], 0, 'Несоответствие scope ведёт к desk rejection независимо от rank.'],
    ['Почему нельзя зафиксировать Q3 навсегда?', ['Quartile зависит от базы, категории и года', 'Он зависит от seed', 'Он равен AUC', 'Он задаётся автором'], 0, 'Библиометрическая позиция меняется.'],
    ['Как проверить indexing?', ['В официальной базе и на сайте издателя', 'По письму спамера', 'По логотипу', 'По обещанию acceptance'], 0, 'Маркетинговое заявление может быть ложным.'],
    ['Что включает cover letter?', ['Question, result, novelty, scope fit и declarations', 'Полный supplement', 'Все code listings', 'Reviewer insults'], 0, 'Письмо помогает редактору быстро оценить fit.'],
    ['Кто подтверждает final manuscript?', ['Все authors', 'Только corresponding author без остальных', 'LLM', 'Редактор заранее'], 0, 'Authorship включает ответственность за финальную версию.'],
    ['Как отвечать на комментарии?', ['Point-by-point с location изменений', 'Удалить неудобные', 'Одним словом', 'Новой метрикой без описания'], 0, 'Ответ должен быть проверяемым.'],
    ['Что делать с новым post-hoc analysis?', ['Маркировать exploratory и объяснить', 'Назвать primary', 'Скрыть', 'Удалить старый plan'], 0, 'Revision не отменяет pre-specification.'],
    ['Гарантирует ли submission-ready пакет публикацию Q3?', ['Нет', 'Да', 'Только с PR', 'Только без limitations'], 0, 'Решение зависит от novelty, качества, fit и review.'],
  ])),
  practiceStep(submitId + '-practice-shortlist', 'Практика 1: shortlist audit', 'Проверьте журнал по критериям.', makeStdinTask(
    'journal-shortlist-audit', 'Поля проверки журнала',
    'Даны поля. Нужны SCOPE INDEXING CATEGORY_YEAR FEES DATA_POLICY. Выведите отсутствующие или SHORTLIST.',
    '# TODO: прочитайте checks\n# TODO: найдите missing fields',
    [{ id: 'sample-1', description: 'Нет года категории', input: 'SCOPE INDEXING FEES DATA_POLICY\n', expectedOutput: 'CATEGORY_YEAR' }],
    [{ id: 'hidden-1', description: 'Журнал проверен', input: 'FEES SCOPE CATEGORY_YEAR DATA_POLICY INDEXING\n', expectedOutput: 'SHORTLIST' }],
    'present = set(input().split())\nrequired = ["SCOPE", "INDEXING", "CATEGORY_YEAR", "FEES", "DATA_POLICY"]\nmissing = [item for item in required if item not in present]\nprint(" ".join(missing) if missing else "SHORTLIST")',
  )),
  practiceStep(submitId + '-practice-package', 'Практика 2: submission files', 'Проверьте обязательный пакет.', makeStdinTask(
    'submission-package', 'Отсутствующие файлы',
    'Даны имена категорий. Нужны MANUSCRIPT FIGURES SUPPLEMENT CHECKLIST DECLARATIONS. Выведите пропуски или READY.',
    '# TODO: сравните files с required\n# TODO: выведите статус',
    [{ id: 'sample-1', description: 'Нет checklist', input: 'MANUSCRIPT FIGURES SUPPLEMENT DECLARATIONS\n', expectedOutput: 'CHECKLIST' }],
    [{ id: 'hidden-1', description: 'Полный пакет', input: 'CHECKLIST MANUSCRIPT SUPPLEMENT FIGURES DECLARATIONS\n', expectedOutput: 'READY' }],
    'present = set(input().split())\nrequired = ["MANUSCRIPT", "FIGURES", "SUPPLEMENT", "CHECKLIST", "DECLARATIONS"]\nmissing = [item for item in required if item not in present]\nprint(" ".join(missing) if missing else "READY")',
  )),
  practiceStep(submitId + '-practice-response', 'Практика 3: response matrix', 'Найдите комментарии без location.', makeStdinTask(
    'review-response-audit', 'Полнота ответов рецензенту',
    'Даны comment_id:location, NONE означает отсутствие. Выведите IDs без location или COMPLETE.',
    '# TODO: разберите response rows\n# TODO: найдите NONE',
    [{ id: 'sample-1', description: 'Один неполный ответ', input: 'R1:L120 R2:NONE R3:S2\n', expectedOutput: 'R2' }],
    [{ id: 'hidden-1', description: 'Все изменения указаны', input: 'A:L10 B:L55\n', expectedOutput: 'COMPLETE' }],
    'missing = []\nfor token in input().split():\n    comment, location = token.split(":")\n    if location == "NONE":\n        missing.append(comment)\nprint(" ".join(missing) if missing else "COMPLETE")',
  )),
  sourceStep(submitId, [researchSources.icmje, researchSources.equator, researchSources.tripOd]),
]

export const capstoneQ3Topics = [
  researchTopic({ id: reviewId, title: '13.5 Литературный поиск и доказательство research gap', order: 5, summary: 'Воспроизводимый поиск, evidence matrix, ближайшие работы и проверяемая novelty.', blockId, blockTitle, blockIcon, format: 'evidence synthesis + 2 gap-аудита', estimatedMinutes: 105, quizQuestions: 7, practiceTasks: 2, examples: 6, terminology: ['search strategy', 'evidence matrix', 'research gap', 'novelty', 'citation chasing'], cheatsheet: ['Сохраняйте строки и даты поиска.', 'Новизна — новое надёжное знание.'], sources: [researchSources.equator, researchSources.tripOd], steps: reviewSteps }),
  researchTopic({ id: protocolId, title: '13.6 Ethics, SAP и планирование размера выборки', order: 6, summary: 'Governance, privacy, primary plan, amendments, events, precision и task-specific sample size.', blockId, blockTitle, blockIcon, format: 'protocol review + 2 lock-проверки', estimatedMinutes: 120, quizQuestions: 8, practiceTasks: 2, examples: 4, terminology: ['data governance', 'SAP', 'amendment', 'sample size', 'events'], cheatsheet: ['SAP lock до test.', 'Rows не равны independent units.'], sources: [researchSources.probastAi, researchSources.tripOd], steps: protocolSteps }),
  researchTopic({ id: writingId, title: '13.7 Methods, Results, Discussion и supplement', order: 7, summary: 'Полный manuscript narrative из artifacts, без overclaim и расхождений чисел.', blockId, blockTitle, blockIcon, format: 'редакторская мастерская + 2 consistency-теста', estimatedMinutes: 115, quizQuestions: 7, practiceTasks: 2, examples: 5, terminology: ['Methods', 'Results', 'Discussion', 'supplement', 'overclaim'], cheatsheet: ['Methods восстанавливает pipeline.', 'Conclusion не сильнее validation.'], sources: [researchSources.tripOd, researchSources.probastAi], steps: writingSteps }),
  researchTopic({ id: submitId, title: '13.8 Выбор Q3-журнала, submission и ответ рецензентам', order: 8, summary: 'Scope-first shortlist, актуальная проверка quartile, пакет подачи и point-by-point revision.', blockId, blockTitle, blockIcon, format: 'submission room + 3 редакционных аудита', estimatedMinutes: 130, quizQuestions: 8, practiceTasks: 3, examples: 5, terminology: ['journal scope', 'quartile', 'cover letter', 'submission package', 'reviewer response'], cheatsheet: ['Quartile проверяют по базе/категории/году.', 'Готовность не гарантирует acceptance.'], sources: [researchSources.icmje, researchSources.equator], steps: submitSteps }),
]
