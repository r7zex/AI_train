import type { FlowStep } from '../../aiCurriculumTypes'
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
  trueFalseQuestion,
} from './helpers'

const blockId = 'article-capstone'
const blockTitle = 'От протокола до статьи'
const blockIcon = '13'

const protocolId = 'capstone-protocol'
const protocolSteps: FlowStep[] = [
  theoryStep(`${protocolId}-theory`, 'Выберите один проверяемый вопрос', 'Capstone начинается с протокола, а не с модели.', [
    section('capstone-tracks', 'Четыре поддерживаемых трека', [
      'Курс приводит к одному из четырёх законченных исследований: клинический прогноз прогрессии после Gamma Knife; скрининг недиагностированного диабета ASPA; анализ gene expression/variants в раке; protein sequence/structure prediction. Для статьи выбирается один первичный вопрос, одна основная метрика или эффект и один независимый способ проверки.',
      'Протокол называет популяцию, данные, исход, признаки, момент предсказания, исключения, split, baseline, основную метрику, план неопределённости и reporting guideline. Дополнительные analyses маркируются exploratory.',
    ], {
      table: { headers: ['Трек', 'Первичный объект', 'Честный test'], rows: [
        ['Gamma Knife', 'пациент/процедура по явному правилу', 'группа пациента, время или внешний центр'],
        ['ASPA', 'участник без известного диабета', 'город/центр или nested CV'],
        ['Cancer omics', 'case/sample по data dictionary', 'независимая cohort/study'],
        ['Protein ML', 'sequence cluster/family', 'cluster/family holdout'],
      ] },
      callouts: [callout('Финальная формулировка', '«Разработать и первично оценить воспроизводимый pipeline…» точнее, чем обещать клиническое внедрение по одной ретроспективной выборке.', 'remember')],
    }),
  ]),
  {
    id: `${protocolId}-examples`, type: 'worked-example', title: 'Три уровня утверждения', summary: 'Текст статьи не должен быть сильнее дизайна.',
    workedExample: [
      { title: 'Описание', body: 'В выборке X наблюдалась ассоциация между признаком и исходом.' },
      { title: 'Прогноз', body: 'Pipeline показал такую-то дискриминацию и калибровку во внутренней/внешней проверке.' },
      { title: 'Каузальность', body: 'Требует отдельного причинного дизайна; feature importance не доказывает причинный механизм.' },
    ],
  },
  {
    id: `${protocolId}-code`, type: 'code', title: 'Конфигурация исследования как данные', summary: 'Решения отделяются от ноутбука.',
    codeExample: code('yaml', `study:
  population: gamma_knife_eligible
  index_date: radiosurgery_date
  target: intracranial_progression
  forbidden_features: [local_recurrence, distant_metastases]
validation:
  strategy: stratified_group_kfold
  group: patient_id
  primary_metric: balanced_accuracy
  random_seed: 42
reporting:
  guideline: TRIPOD
  save_oof_predictions: true`, undefined, 'Config versionируется вместе с кодом и сохраняется рядом с результатами.'),
  },
  assessment(protocolId, 'Протокол capstone: 5 вопросов', [
    singleQuestion('cp-q1', protocolId, 'Сколько первичных исследовательских вопросов лучше выбрать для capstone?', ['Один ясный', 'Не меньше двадцати', 'Сколько даст p<0.05', 'Ни одного'], 0, 'Один вопрос позволяет согласовать дизайн и вывод.'),
    trueFalseQuestion('cp-q2', protocolId, 'Feature importance доказывает причинное влияние гена.', false, 'Она описывает поведение модели в данных.'),
    singleQuestion('cp-q3', protocolId, 'Какой holdout нужен protein ML?', ['Случайные строки', 'Sequence cluster/family', 'Одинаковые duplicates', 'Только самый короткий белок'], 1, 'Он проверяет перенос за пределы близких гомологов.'),
    singleQuestion('cp-q4', protocolId, 'Что маркируют как exploratory?', ['Дополнительные анализы вне первичного плана', 'Первичный target', 'Размер выборки', 'Версию данных'], 0, 'Это отделяет гипотезу от поиска.'),
    trueFalseQuestion('cp-q5', protocolId, 'Reporting guideline выбирают до написания Results.', true, 'Чек-лист влияет на то, что надо сохранить во время анализа.'),
  ]),
  practiceStep(`${protocolId}-practice`, 'Практика: временной аудит признаков', 'Проверьте доступность каждого признака.', makeStdinTask(
    'feature-time-audit', 'Признаки после index date',
    'Даны пары feature:time, где time — целое смещение в днях относительно index date. Выведите признаки с time>0 по порядку или OK.',
    `# TODO: прочитайте пары feature:time
# TODO: найдите информацию из будущего`,
    [{ id: 'sample-1', description: 'Два post-baseline признака', input: 'age:0 lesions:-3 recurrence:120 metastasis:90\n', expectedOutput: 'recurrence metastasis' }],
    [{ id: 'hidden-1', description: 'Все доступны заранее', input: 'sex:-1000 age:0 volume:-1\n', expectedOutput: 'OK' }],
    `pairs = [item.rsplit(':', 1) for item in input().split()]
future = [name for name, time in pairs if int(time) > 0]
print(' '.join(future) if future else 'OK')`,
  )),
  sourceStep(protocolId, [researchSources.tripOd, researchSources.equator]),
]

const experimentId = 'capstone-experiment-system'
const experimentSteps: FlowStep[] = [
  theoryStep(`${experimentId}-theory`, 'Воспроизводимая система экспериментов', 'Ноутбук рассказывает историю, pipeline выполняет работу.', [
    section('project-layout', 'Четыре слоя проекта', [
      'Raw data остаются неизменными и адресуются по manifest/checksum. Скрипт cohort строит аналитическую таблицу и flow counts. Pipeline preprocessing+model обучается по config. Report читает сохранённые predictions/metrics и строит таблицы без скрытого переобучения.',
      'Каждый run получает ID, commit, config, версии данных, split hash, время, metrics и пути к artifacts. Ошибочные и слабые запуски не удаляются: их статус сохраняется, чтобы не повторять поиск и не выбирать только удачные результаты.',
    ], {
      table: { headers: ['Каталог', 'Содержимое', 'Правило'], rows: [
        ['data/raw', 'неизменяемые входы/manifest', 'не редактировать вручную'],
        ['src', 'cohort, features, train, evaluate', 'тестируемые функции'],
        ['configs', 'решения эксперимента', 'один config — один run'],
        ['artifacts/run_id', 'predictions, metrics, plots', 'создаётся автоматически'],
      ] },
      callouts: [callout('Ноутбук без побочных эффектов', 'Финальный notebook читает готовые artifacts и строит объяснение; он не должен содержать единственную рабочую версию preprocessing.', 'schema')],
    }),
  ]),
  {
    id: `${experimentId}-examples`, type: 'worked-example', title: 'Четыре обязательных эксперимента', summary: 'Сравнение строится ступенчато.',
    workedExample: [
      { title: 'Dummy', body: 'Показывает метрику стратегии без признаков.' },
      { title: 'Прозрачный baseline', body: 'LogisticRegression или linear head с минимальным preprocessing.' },
      { title: 'Нелинейная модель', body: 'Random Forest/boosting или frozen protein embeddings.' },
      { title: 'Ablation', body: 'Удаление группы признаков или компонента показывает его добавленную ценность.' },
    ],
  },
  {
    id: `${experimentId}-code`, type: 'code', title: 'Реестр запусков', summary: 'Одна строка хранит происхождение результата.',
    codeExample: code('python', `from pathlib import Path
import json, platform, subprocess

run = {
    'config': config,
    'git_commit': subprocess.check_output(['git', 'rev-parse', 'HEAD']).decode().strip(),
    'python': platform.python_version(),
    'split_hash': split_hash,
    'metrics': metrics,
}
path = Path('artifacts') / run_id
path.mkdir(parents=True, exist_ok=False)
(path / 'run.json').write_text(json.dumps(run, ensure_ascii=False, indent=2))
oof_predictions.to_csv(path / 'oof_predictions.csv', index=False)`, undefined, 'Run directory не перезаписывается: новый config создаёт новый ID.'),
  },
  theoryStep(`${experimentId}-pitfalls`, 'Почему лучший run может быть ложным', 'Многократный поиск создаёт optimism.', [
    section('experiment-selection', 'Неявные степени свободы', [
      'Если десятки seeds, моделей, наборов признаков и порогов пробуются на одном validation, максимум метрики оптимистичен. Сократите пространство заранее, используйте nested CV, храните все попытки и финально проверяйте один выбранный pipeline на нетронутом test.',
    ], { bullets: ['Не сортируйте статью по лучшему fold.', 'Не удаляйте «неудачные» seeds.', 'Ablation должен менять один фактор.', 'Решение о primary metric принимается до поиска.'] }),
  ]),
  assessment(experimentId, 'Система экспериментов: 7 вопросов', [
    singleQuestion('ex-q1', experimentId, 'Что делает report-ноутбук?', ['Читает artifacts и строит narrative', 'Скрыто переобучает лучший run', 'Меняет raw data', 'Выбирает target после метрик'], 0, 'Анализ и представление разделены.'),
    trueFalseQuestion('ex-q2', experimentId, 'Слабые запуски лучше удалить из реестра.', false, 'Полная история уменьшает selective reporting.'),
    singleQuestion('ex-q3', experimentId, 'Что такое ablation?', ['Изменение одного компонента для оценки вклада', 'Случайный split', 'Удаление test', 'Сжатие ZIP'], 0, 'Она связывает изменение с компонентом.'),
    singleQuestion('ex-q4', experimentId, 'Что хранить рядом с metrics?', ['Config, commit, data/split version и predictions', 'Только screenshot', 'Только seed', 'Только model name'], 0, 'Так результат можно восстановить.'),
    trueFalseQuestion('ex-q5', experimentId, 'Максимум из 100 проб на одном validation обычно оптимистичен.', true, 'Validation становится частью подбора.'),
    singleQuestion('ex-q6', experimentId, 'Зачем Dummy baseline?', ['Показать нижнюю границу стратегии без signal', 'Увеличить число классов', 'Исправить batch', 'Сделать causal inference'], 0, 'Без него метрика может выглядеть значимой при дисбалансе.'),
    trueFalseQuestion('ex-q7', experimentId, 'Raw data можно править вручную, если изменения записаны в памяти.', false, 'Преобразования должны быть скриптуемыми и проверяемыми.'),
  ]),
  practiceStep(`${experimentId}-practice`, 'Практика: агрегатор run registry', 'Выберите run по primary metric, не по test.', makeStdinTask(
    'run-registry-best', 'Лучший validation run',
    'Даны записи run_id:validation_score. Выведите ID с максимальным score; при равенстве — лексикографически меньший.',
    `# TODO: прочитайте записи
# TODO: примените детерминированное правило tie-break`,
    [{ id: 'sample-1', description: 'Явный победитель', input: 'r1:0.70 r2:0.74 r3:0.71\n', expectedOutput: 'r2' }],
    [{ id: 'hidden-1', description: 'Равные scores', input: 'b:0.8 a:0.8 c:0.7\n', expectedOutput: 'a' }],
    `records = [item.rsplit(':', 1) for item in input().split()]
best_score = max(float(score) for _, score in records)
candidates = sorted(run_id for run_id, score in records if float(score) == best_score)
print(candidates[0])`,
  )),
  theoryStep(`${experimentId}-recap`, 'Definition of done эксперимента', 'Run закончен, когда его можно проверить.', [
    section('run-done', 'Артефакты завершённого run', ['Config, log, cohort counts, split assignments, fitted pipeline, OOF/test predictions, metrics with CI, calibration/diagnostic plots и environment lock. Если хотя бы одного элемента нет, результат нельзя надёжно включать в финальную таблицу.'], {
      bullets: ['Artifacts read-only после завершения.', 'Каждый график строится из сохранённой таблицы.', 'Ошибки получают статус failed и traceback.'],
    }),
  ]),
  sourceStep(experimentId, [researchSources.fair, researchSources.tripOd]),
]

const reportingId = 'capstone-figures-results'
const reportingSteps: FlowStep[] = [
  theoryStep(`${reportingId}-theory`, 'Таблицы, рисунки и Results без украшательства', 'Каждый элемент отвечает на один вопрос.', [
    section('results-map', 'Логика результатов', [
      'Results обычно идут в порядке: поток когорты; характеристики выборки и пропуски; primary performance/effect с CI; calibration/threshold; сравнение baseline и ablation; error/subgroup analysis; sensitivity analyses. Discussion интерпретирует, а Results не скрывает неудобные числа.',
      'Figure должна быть самодостаточной: подпись называет данные, разбиение, n, группы/цвета, метрику, uncertainty и ключевые сокращения. Оси содержат единицы. Цвет не является единственным способом различать группы, а палитра остаётся читаемой для color-vision deficiency.',
    ], {
      table: { headers: ['Элемент', 'Обязательный вопрос', 'Минимум'], rows: [
        ['Cohort flow', 'куда ушли объекты?', 'n после каждого правила'],
        ['Table 1', 'кто вошёл?', 'n, missingness, scale/units'],
        ['Performance table', 'что и где оценено?', 'estimate, CI, split, threshold'],
        ['Calibration plot', 'верны ли probabilities?', 'observed vs predicted + distribution'],
      ] },
    }),
  ]),
  {
    id: `${reportingId}-examples`, type: 'worked-example', title: 'Три подписи разного качества', summary: 'Подпись должна позволять читать рисунок отдельно.',
    workedExample: [
      { title: 'Слабая', body: '«ROC-кривая модели». Нет когорты, split, n и CI.' },
      { title: 'Рабочая', body: '«ROC-кривая OOF-прогнозов 5-fold StratifiedGroupKFold для 548 наблюдений; цвет — модель; лента — 95% bootstrap CI по пациентам». ' },
      { title: 'Для omics', body: '«Volcano plot tumor vs normal: x — shrunken log2FC, y — -log10(padj); выделены гены с |log2FC|≥1 и FDR<0.05». ' },
    ],
  },
  {
    id: `${reportingId}-code`, type: 'code', title: 'Единый источник таблицы и графика', summary: 'Plot читает те же predictions, что и metric table.',
    codeExample: code('python', `import pandas as pd
from sklearn.metrics import roc_auc_score

pred = pd.read_csv('artifacts/final/oof_predictions.csv')
auc = roc_auc_score(pred['y'], pred['probability'])
assert pred['patient_id'].is_unique

metrics = pd.DataFrame([{
    'model': 'final_pipeline', 'split': 'OOF group CV',
    'n': len(pred), 'events': int(pred['y'].sum()), 'roc_auc': auc,
}])
metrics.to_csv('tables/model_performance.csv', index=False)`, undefined, 'И таблица, и рисунок используют один versioned predictions-файл.'),
  },
  assessment(reportingId, 'Results и графики: 6 вопросов', [
    singleQuestion('rp-q1', reportingId, 'Что показывают первым в Results?', ['Поток когорты и характеристики данных', 'Только лучшую модель', 'Только Discussion', 'Список библиотек'], 0, 'Читателю нужен знаменатель анализа.'),
    trueFalseQuestion('rp-q2', reportingId, 'Подпись «ROC-кривая модели» самодостаточна.', false, 'Не хватает когорты, разбиения, n и uncertainty.'),
    singleQuestion('rp-q3', reportingId, 'Что обязательно рядом с performance?', ['CI и схема оценки', 'Только три знака после запятой', 'Название GPU', 'Номер страницы'], 0, 'Метрика без uncertainty/design неполна.'),
    trueFalseQuestion('rp-q4', reportingId, 'Results должны скрывать слабый baseline, если он мешает narrative.', false, 'Это selective reporting.'),
    singleQuestion('rp-q5', reportingId, 'Как избежать рассинхронизации графика и таблицы?', ['Строить их из одного predictions artifact', 'Копировать числа вручную', 'Перезапускать разные notebooks', 'Округлять target'], 0, 'Единый источник делает проверку возможной.'),
    singleQuestion('rp-q6', reportingId, 'Что указывать на оси omics-графика?', ['Величину, преобразование и единицы/шкалу', 'Только цвет', 'Только title', 'Ничего'], 0, 'Например log2FC и -log10(padj).'),
  ]),
  practiceStep(`${reportingId}-practice`, 'Практика: аудит подписи рисунка', 'Проверьте пять обязательных элементов.', makeStdinTask(
    'caption-audit', 'Полнота подписи',
    'Дана строка с токенами. Обязательны DATA, SPLIT, N, METRIC, CI. Выведите отсутствующие токены в этом порядке или OK.',
    `# TODO: прочитайте токены
# TODO: сравните с обязательным списком`,
    [{ id: 'sample-1', description: 'Не хватает n и CI', input: 'DATA SPLIT METRIC\n', expectedOutput: 'N CI' }],
    [{ id: 'hidden-1', description: 'Полная подпись', input: 'DATA N METRIC CI SPLIT\n', expectedOutput: 'OK' }],
    `present = set(input().split())
required = ['DATA', 'SPLIT', 'N', 'METRIC', 'CI']
missing = [item for item in required if item not in present]
print(' '.join(missing) if missing else 'OK')`,
  )),
  sourceStep(reportingId, [researchSources.tripOd, researchSources.equator]),
]

const packageId = 'capstone-paper-package'
const packageSteps: FlowStep[] = [
  theoryStep(`${packageId}-theory`, 'Статья, supplement и воспроизводимый пакет', 'Финал — это проверяемое утверждение, а не только PDF.', [
    section('paper-package', 'Связь разделов и артефактов', [
      'Methods ссылается на protocol/config и описывает cohort, preprocessing, validation и statistics. Results воспроизводится из сохранённых predictions/tables. Figures имеют исходные data tables. Supplement содержит расширенные QC, search space, sensitivity analyses и checklist reporting guideline.',
      'Пакет включает manuscript source/PDF, environment lock, README с командами, data manifest без запрещённых персональных данных, code, configs, tests, tables, figures и checksums. Если данные закрыты, публикуется схема доступа и synthetic/minimal example.',
    ], {
      table: { headers: ['Утверждение', 'Проверяемый артефакт'], rows: [
        ['N=548 после фильтров', 'cohort_flow.csv'],
        ['BA и CI финальной модели', 'test_predictions.csv + metrics.json'],
        ['Топ DE genes', 'deseq2_results.tsv с padj/log2FC'],
        ['Protein benchmark', 'split_clusters.tsv + predictions'],
      ] },
      callouts: [callout('Приватность', 'Нельзя включать исходные персональные данные, идентификаторы пациентов или секретные токены в ZIP/репозиторий.', 'important')],
    }),
  ]),
  {
    id: `${packageId}-examples`, type: 'worked-example', title: 'Четыре вопроса внутреннего рецензента', summary: 'Попытайтесь опровергнуть собственный вывод.',
    workedExample: [
      { title: 'Утечка', body: 'Мог ли любой feature/preprocessing увидеть будущее или test?' },
      { title: 'Независимость', body: 'Есть ли один patient/cluster/center в обеих частях?' },
      { title: 'Неопределённость', body: 'Сохраняется ли вывод по CI, folds и sensitivity analyses?' },
      { title: 'Сила утверждения', body: 'Не звучит ли association как causation или внутренняя validation как готовность к клинике?' },
    ],
  },
  {
    id: `${packageId}-code`, type: 'code', title: 'Checksums финальных артефактов', summary: 'Файл можно проверить после передачи.',
    codeExample: code('python', `from pathlib import Path
import hashlib, json

manifest = {}
for path in sorted(Path('release').rglob('*')):
    if path.is_file():
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        manifest[str(path.relative_to('release'))] = digest
Path('release/MANIFEST.sha256.json').write_text(
    json.dumps(manifest, indent=2), encoding='utf-8'
)`, undefined, 'Manifest создаётся после финальной сборки; изменение файла меняет checksum.'),
  },
  theoryStep(`${packageId}-pitfalls`, 'Типовые замечания рецензента', 'Закройте их до submission.', [
    section('reviewer-comments', 'Восемь предсказуемых вопросов', ['Достаточен ли sample size? Как обрабатывались missing data? Где выполнялся feature selection? Есть ли calibration? Как выбран threshold? Учтены ли repeated measures? Что является external validation? Доступны ли code и data dictionary?'], {
      bullets: ['Ответ на каждый вопрос должен ссылаться на Methods, table/figure или supplement.', 'Если ограничение нельзя устранить, его формулируют прямо.', 'Не добавляйте post-hoc analysis как будто он был запланирован.'],
    }),
  ]),
  assessment(packageId, 'Финальный контроль: 8 вопросов', [
    singleQuestion('pk-q1', packageId, 'Что доказывает checksum?', ['Целостность конкретной версии файла', 'Научную истинность', 'Отсутствие bias', 'Клиническую пользу'], 0, 'Checksum обнаруживает изменение bytes.'),
    trueFalseQuestion('pk-q2', packageId, 'Закрытые данные можно заменить описанием доступа и synthetic example.', true, 'Это поддерживает проверяемость без нарушения приватности.'),
    singleQuestion('pk-q3', packageId, 'Откуда должна воспроизводиться таблица метрик?', ['Из predictions artifact', 'Из вручную набранного текста', 'Из screenshot', 'Из памяти автора'], 0, 'Predictions позволяют пересчитать метрики.'),
    trueFalseQuestion('pk-q4', packageId, 'Внутренняя CV равна внешней клинической валидации.', false, 'Внешняя validation использует независимую популяцию/центр/время.'),
    singleQuestion('pk-q5', packageId, 'Что нельзя помещать в release?', ['Персональные идентификаторы и токены', 'README', 'Configs', 'Tests'], 0, 'Это риск приватности и безопасности.'),
    singleQuestion('pk-q6', packageId, 'Где хранить расширенный search space?', ['Supplement/configs', 'Только в памяти', 'В названии PDF', 'Нигде'], 0, 'Он нужен для оценки множества попыток.'),
    trueFalseQuestion('pk-q7', packageId, 'Негативный sensitivity analysis можно опустить.', false, 'Он важен для устойчивости и должен быть сообщён.'),
    singleQuestion('pk-q8', packageId, 'Когда capstone завершён?', ['Когда независимый человек может пройти README и получить основные таблицы', 'Когда train accuracy=1', 'Когда выбран красивый график', 'После первого notebook'], 0, 'Это практический критерий воспроизводимости.'),
  ]),
  practiceStep(`${packageId}-practice-manifest`, 'Практика 1: release manifest', 'Проверьте обязательные части пакета.', makeStdinTask(
    'release-manifest', 'Недостающие артефакты',
    'Даны токены файлов. Обязательны README CODE CONFIG ENV PREDICTIONS TABLES FIGURES. Выведите недостающие в этом порядке или READY.',
    `# TODO: прочитайте содержимое release
# TODO: сравните с обязательным набором`,
    [{ id: 'sample-1', description: 'Не хватает environment и predictions', input: 'README CODE CONFIG TABLES FIGURES\n', expectedOutput: 'ENV PREDICTIONS' }],
    [{ id: 'hidden-1', description: 'Полный пакет', input: 'FIGURES README ENV CODE PREDICTIONS CONFIG TABLES\n', expectedOutput: 'READY' }],
    `present = set(input().split())
required = ['README', 'CODE', 'CONFIG', 'ENV', 'PREDICTIONS', 'TABLES', 'FIGURES']
missing = [item for item in required if item not in present]
print(' '.join(missing) if missing else 'READY')`,
  )),
  practiceStep(`${packageId}-practice-claims`, 'Практика 2: сила утверждения', 'Найдите слова, требующие более сильного дизайна.', makeStdinTask(
    'claim-audit', 'Аудит каузальных слов',
    'Дана строка на английском. Выведите CAUSAL, если есть proves/causes/cures, иначе ASSOCIATIONAL.',
    `# TODO: нормализуйте текст
# TODO: найдите слова сильного причинного утверждения`,
    [{ id: 'sample-1', description: 'Слишком сильное утверждение', input: 'Gene X causes progression in our retrospective cohort\n', expectedOutput: 'CAUSAL' }],
    [{ id: 'hidden-1', description: 'Корректная осторожная формулировка', input: 'Gene X was associated with progression\n', expectedOutput: 'ASSOCIATIONAL' }],
    `text = input().lower().split()
causal = {'proves', 'causes', 'cures'}
print('CAUSAL' if any(word.strip('.,') in causal for word in text) else 'ASSOCIATIONAL')`,
  )),
  theoryStep(`${packageId}-recap`, 'Submission checklist', 'Последний проход перед отправкой.', [
    section('submission-checklist', 'Пять независимых проверок', ['Запустите проект в чистом окружении; пересчитайте primary table из predictions; проверьте все n и проценты; сверьте figures с captions; пройдите TRIPOD/EQUATOR checklist и privacy scan. Только после этого собирайте PDF и release archive.'], {
      bullets: ['Все ссылки на figure/table существуют.', 'Все сокращения расшифрованы.', 'Limitations соответствуют реальному дизайну.', 'Data/code availability statement конкретен.'],
    }),
  ]),
  sourceStep(packageId, [researchSources.tripOd, researchSources.equator, researchSources.fair]),
]

export const capstoneTopics = [
  researchTopic({ id: protocolId, title: '13.1 Протокол статьи и выбор capstone', order: 1, summary: 'Один вопрос, четыре поддерживаемых трека и границы допустимого утверждения.', blockId, blockTitle, blockIcon, format: 'выбор трека + протокол', estimatedMinutes: 55, quizQuestions: 5, practiceTasks: 1, examples: 4, terminology: ['protocol', 'primary outcome', 'exploratory analysis', 'reporting guideline'], cheatsheet: ['Один первичный вопрос.', 'Текст вывода не сильнее дизайна.'], sources: [researchSources.tripOd, researchSources.equator], steps: protocolSteps }),
  researchTopic({ id: experimentId, title: '13.2 Система экспериментов и benchmark', order: 2, summary: 'Конфиги, artifacts, OOF predictions, baselines, ablation и полный реестр запусков.', blockId, blockTitle, blockIcon, format: 'инженерная лаборатория', estimatedMinutes: 85, quizQuestions: 7, practiceTasks: 1, examples: 5, terminology: ['artifact', 'run registry', 'benchmark', 'ablation', 'split hash'], cheatsheet: ['Один config — один immutable run.', 'Не удаляйте слабые запуски.'], sources: [researchSources.fair], steps: experimentSteps }),
  researchTopic({ id: reportingId, title: '13.3 Таблицы, рисунки и Results', order: 3, summary: 'Cohort flow, Table 1, performance, calibration, captions и единый источник данных.', blockId, blockTitle, blockIcon, format: 'редакционная мастерская', estimatedMinutes: 65, quizQuestions: 6, practiceTasks: 1, examples: 4, terminology: ['cohort flow', 'Table 1', 'caption', 'uncertainty', 'selective reporting'], cheatsheet: ['График и таблица читают один predictions artifact.', 'Caption содержит data, split, n, metric и CI.'], sources: [researchSources.tripOd], steps: reportingSteps }),
  researchTopic({ id: packageId, title: '13.4 Рецензирование и воспроизводимый пакет статьи', order: 4, summary: 'Manuscript, supplement, environment, manifests, privacy и финальный self-review.', blockId, blockTitle, blockIcon, format: 'внутренняя рецензия + 2 аудита', estimatedMinutes: 90, quizQuestions: 8, practiceTasks: 2, examples: 5, terminology: ['supplement', 'checksum', 'data availability', 'reproducibility', 'privacy'], cheatsheet: ['Основные таблицы пересчитываются из predictions.', 'Release не содержит персональных данных и секретов.'], sources: [researchSources.equator, researchSources.fair], steps: packageSteps }),
]
