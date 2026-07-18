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

const blockId = 'genomics-cancer'
const blockTitle = 'Гены, экспрессия и рак'
const blockIcon = '10'

const filesId = 'genomics-files-qc'
const filesSteps: FlowStep[] = [
  theoryStep(`${filesId}-theory`, 'От ДНК к аналитической матрице', 'Биологическая сущность важнее расширения файла.', [
    section('central-dogma', 'Ген, транскрипт и белок — не одно и то же', [
      'Ген — участок генома, транскрипт — конкретная RNA-форма, а белок — продукт трансляции некоторых транскриптов. Альтернативный сплайсинг означает, что одному gene_id могут соответствовать несколько transcript_id и разные изоформы белка.',
      'Перед объединением таблиц согласуйте genome build, систему идентификаторов, версию аннотации и уровень анализа. Символ гена удобен для чтения, но не всегда уникален и меняется; устойчивые Ensembl/Entrez/UniProt ID обычно лучше для ключей.',
    ], {
      table: { headers: ['Формат', 'Одна запись', 'Главная проверка'], rows: [
        ['FASTA', 'последовательность', 'алфавит, длина, уникальный ID'],
        ['FASTQ', 'read + качества', 'Phred, адаптеры, длина, GC'],
        ['GTF/GFF', 'геномный интервал и атрибуты', 'build и версия аннотации'],
        ['VCF', 'вариант в координате', 'reference build, REF/ALT, FILTER'],
      ] },
      callouts: [callout('Контракт данных', 'В README проекта фиксируйте источник, accession, дату скачивания, build и checksum каждого входного файла.', 'schema')],
    }),
  ]),
  {
    id: `${filesId}-examples`, type: 'worked-example', title: 'Три уровня одной биологии', summary: 'Не смешиваем сущности при merge.',
    workedExample: [
      { title: 'Gene-level counts', body: 'Строка ENSG… агрегирует чтения по гену и подходит для анализа экспрессии на gene-level.' },
      { title: 'Transcript TPM', body: 'Строка ENST… отражает конкретную изоформу; суммирование требует явного правила.' },
      { title: 'Protein accession', body: 'UniProt accession относится к белковой записи; маппинг gene→protein может быть one-to-many.' },
    ],
  },
  {
    id: `${filesId}-code`, type: 'code', title: 'Чтение FASTA через SeqIO', summary: 'Потоковый парсер вместо ручного split.',
    codeExample: code('python', `from Bio import SeqIO

for record in SeqIO.parse('proteins.fasta', 'fasta'):
    sequence = str(record.seq)
    print(record.id, len(sequence), sequence[:10])`, undefined, 'SeqIO сохраняет связь ID, описания и последовательности и корректно читает многострочные записи.'),
  },
  assessment(filesId, 'Форматы и идентификаторы: 5 вопросов', [
    singleQuestion('gf-q1', filesId, 'Что хранит FASTQ дополнительно к последовательности?', ['Координаты экзонов', 'Качество каждого символа', 'Клинический исход', 'Белковую структуру'], 1, 'FASTQ включает строку Phred-качеств.'),
    trueFalseQuestion('gf-q2', filesId, 'Символ гена всегда является уникальным и неизменным ключом.', false, 'Синонимы и обновления номенклатуры делают это небезопасным.'),
    singleQuestion('gf-q3', filesId, 'Что проверять перед объединением VCF и GTF?', ['Только размер файлов', 'Одинаковый genome build', 'Одинаковый цвет графика', 'Число моделей'], 1, 'Координаты разных build не совпадают напрямую.'),
    singleQuestion('gf-q4', filesId, 'Какое отношение gene→transcript типично?', ['Всегда один к одному', 'Один ко многим', 'Никакого', 'Всегда много к одному'], 1, 'Альтернативный сплайсинг создаёт несколько транскриптов.'),
    trueFalseQuestion('gf-q5', filesId, 'Accession и checksum помогают воспроизвести входные данные.', true, 'Они идентифицируют версию и целостность файла.'),
  ]),
  practiceStep(`${filesId}-practice`, 'Практика: FASTA без потери строк', 'Соберите последовательность и вычислите GC.', makeStdinTask(
    'fasta-gc', 'Длина и GC%',
    'Дана одна FASTA-запись: первая строка начинается с >, остальные — части DNA-последовательности. Выведите длину и GC% с 1 знаком.',
    `# TODO: пропустите заголовок
# TODO: соедините все строки последовательности`,
    [{ id: 'sample-1', description: 'Многострочная запись', input: '>gene1\nACGT\nGGAA\n', expectedOutput: '8 50.0' }],
    [{ id: 'hidden-1', description: 'Только AT', input: '>gene2\nAAAA\nTT\n', expectedOutput: '6 0.0' }],
    `import sys
lines = [line.strip() for line in sys.stdin if line.strip()]
sequence = ''.join(line for line in lines if not line.startswith('>')).upper()
gc = 100 * sum(base in {'G', 'C'} for base in sequence) / len(sequence)
print(len(sequence), f'{gc:.1f}')`,
  )),
  sourceStep(filesId, [researchSources.sra, researchSources.biopython, researchSources.geo]),
]

const rnaId = 'genomics-rnaseq-expression'
const rnaSteps: FlowStep[] = [
  theoryStep(`${rnaId}-theory`, 'RNA-seq: от counts к дифференциальной экспрессии', 'Нормализация не означает «поделить всё на одно число».', [
    section('rnaseq-workflow', 'Единица наблюдения — образец', [
      'Count matrix обычно имеет гены в строках и биологические образцы в столбцах. Сырые counts зависят от глубины библиотеки и композиции RNA, поэтому сравнивать их напрямую нельзя. Методы DESeq2/edgeR оценивают size factors и дисперсию в модели count-данных.',
      'TPM полезен для описания относительного abundance внутри образца, но не является прямой заменой raw counts для стандартного DESeq2-анализа. Design formula должна включать биологический контраст и известные confounders, например batch, центр или пол, если они релевантны.',
    ], {
      table: { headers: ['Артефакт', 'Симптом', 'Проверка'], rows: [
        ['Низкая глубина', 'малые library sizes', 'total counts и detected genes'],
        ['Batch effect', 'PCA разделяется по партии', 'цвет по batch и condition'],
        ['Sample swap', 'неожиданный кластер/пол', 'метаданные, генотип, маркеры пола'],
      ] },
      callouts: [callout('До тестов', 'Отфильтруйте совсем низкоэкспрессированные гены по заранее заданному правилу, затем выполняйте нормализацию и модель внутри определённого дизайна.', 'important')],
    }),
  ]),
  {
    id: `${rnaId}-formula`, type: 'formula', title: 'Fold change и шкалы', summary: 'Логарифм делает направления симметричными.',
    formulaCards: [
      { label: 'Fold change', expression: 'FC=\\frac{expression_1}{expression_0}', meaning: 'Относительное изменение между условиями.', notation: ['FC=2 — удвоение', 'FC=0.5 — уменьшение вдвое'] },
      { label: 'log2 fold change', expression: 'log_2FC=\\log_2(FC)', meaning: 'Симметричная шкала: +1 и -1.', notation: ['+1 — ×2', '-1 — ×0.5'] },
      { label: 'CPM', expression: 'CPM=\\frac{count}{library\\ size}\\cdot10^6', meaning: 'Простая поправка на глубину для QC/визуализации.', notation: ['Не заменяет полноценную DE-модель'] },
    ],
  },
  {
    id: `${rnaId}-examples`, type: 'worked-example', title: 'Четыре графика до списка генов', summary: 'Сначала качество, затем вывод.',
    workedExample: [
      { title: 'Library size', body: 'Показывает образцы с аномально малым числом reads/counts.' },
      { title: 'PCA', body: 'Цвет по condition и форма по batch выявляют confounding.' },
      { title: 'MA plot', body: 'Связывает среднюю экспрессию и log2FC; помогает увидеть зависимость разброса от abundance.' },
      { title: 'Volcano', body: 'Удобен как обзор, но не заменяет таблицу с baseMean, log2FC, p-value и padj.' },
    ],
  },
  {
    id: `${rnaId}-code`, type: 'code', title: 'DESeq2: минимальный дизайн', summary: 'Batch указывается до condition.',
    codeExample: code('r', `dds <- DESeqDataSetFromMatrix(
  countData = counts,
  colData = metadata,
  design = ~ batch + condition
)
dds <- dds[rowSums(counts(dds) >= 10) >= 3, ]
dds <- DESeq(dds)
res <- results(dds, contrast = c("condition", "tumor", "normal"))
res <- lfcShrink(dds, coef = "condition_tumor_vs_normal", res = res, type = "apeglm")`, undefined, 'Порядок уровней и название коэффициента проверяют через resultsNames(dds).'),
  },
  theoryStep(`${rnaId}-pitfalls`, 'Batch, confounding и псевдорепликация', 'PCA не исправляет дизайн.', [
    section('rna-pitfalls', 'Когда контраст нельзя отделить', [
      'Если все опухоли измерены в batch A, а все нормы — в batch B, condition полностью confounded с batch: статистическая модель не может узнать, чем вызвана разница. Нельзя «удалить batch» так, чтобы восстановить отсутствующую комбинацию.',
    ], { bullets: ['Балансируйте условия по партиям на этапе эксперимента.', 'Для single-cell не считайте клетки независимыми пациентами: используйте patient-level/pseudobulk дизайн.', 'Не отбирайте гены по итоговой significance до независимой валидации модели.'] }),
  ]),
  assessment(rnaId, 'RNA-seq checkpoint: 7 вопросов', [
    singleQuestion('rna-q1', rnaId, 'Что обычно подают в DESeq2?', ['TPM после log', 'Сырые integer counts', 'p-value', 'Только список генов'], 1, 'Модель ожидает count-данные.'),
    trueFalseQuestion('rna-q2', rnaId, 'TPM автоматически устраняет batch effect.', false, 'TPM корректирует длину/глубину, но не экспериментальную партию.'),
    numericQuestion('rna-q3', rnaId, 'FC=4. Чему равен log2FC?', 2, 'log2(4)=2.'),
    numericQuestion('rna-q4', rnaId, 'FC=0.5. Чему равен log2FC?', -1, 'log2(0.5)=-1.'),
    singleQuestion('rna-q5', rnaId, 'Что показывает PCA в первую очередь?', ['Причину различий', 'Главные направления вариации, требующие интерпретации', 'Доказательство каузальности', 'FDR каждого гена'], 1, 'PCA обнаруживает структуру, но не объясняет её автоматически.'),
    trueFalseQuestion('rna-q6', rnaId, 'Полное confounding condition и batch можно надёжно исправить программно.', false, 'Дизайн не содержит информации для разделения эффектов.'),
    singleQuestion('rna-q7', rnaId, 'Что публиковать для DE-гена?', ['Только padj', 'log2FC, SE/CI, p и padj', 'Только название', 'Только цвет на heatmap'], 1, 'Нужны величина, неопределённость и коррекция.'),
  ]),
  practiceStep(`${rnaId}-practice`, 'Практика: CPM для QC', 'Нормализуйте на размер библиотеки.', makeStdinTask(
    'counts-cpm', 'CPM одного гена',
    'Первая строка counts гена по образцам, вторая — library sizes. Выведите CPM с 1 знаком.',
    `# TODO: прочитайте counts и library sizes
# TODO: посчитайте CPM попарно`,
    [{ id: 'sample-1', description: 'Два образца', input: '100 250\n1000000 5000000\n', expectedOutput: '100.0 50.0' }],
    [{ id: 'hidden-1', description: 'Три образца', input: '50 0 20\n500000 1000000 200000\n', expectedOutput: '100.0 0.0 100.0' }],
    `counts = list(map(float, input().split()))
sizes = list(map(float, input().split()))
cpm = [count / size * 1_000_000 for count, size in zip(counts, sizes)]
print(' '.join(f'{value:.1f}' for value in cpm))`,
  )),
  sourceStep(rnaId, [researchSources.deseq2, researchSources.geo, researchSources.sra]),
]

const variantId = 'genomics-variants-annotation'
const variantSteps: FlowStep[] = [
  theoryStep(`${variantId}-theory`, 'Варианты: VCF, аннотация и соматический контекст', 'Координата — ещё не биологический вывод.', [
    section('variant-levels', 'От аллеля к кандидату', [
      'VCF описывает REF/ALT относительно конкретного reference build. Один локус может иметь несколько ALT, а одна замена — разные последствия для разных транскриптов. Поэтому аннотация должна сохранять transcript, consequence, gene и версию инструмента.',
      'В раке различают germline и somatic variants. Для соматического варианта важны глубина, variant allele fraction, нормальный контроль, purity, copy number и артефакты платформы. Фильтр PASS — начало проверки, а не доказательство драйверности.',
    ], {
      table: { headers: ['Поле', 'Смысл', 'Типичная ошибка'], rows: [
        ['CHROM:POS', 'координата build', 'смешать hg19 и hg38'],
        ['REF/ALT', 'замена относительно reference', 'не нормализовать indel'],
        ['DP/AD/VAF', 'поддержка чтениями', 'игнорировать малую глубину'],
        ['Consequence', 'эффект на транскрипт', 'выбрать удобную изоформу без правила'],
      ] },
    }),
  ]),
  {
    id: `${variantId}-formula`, type: 'formula', title: 'Аллельная доля и частота', summary: 'Не путайте VAF в образце и population frequency.',
    formulaCards: [
      { label: 'Variant allele fraction', expression: 'VAF=\\frac{AD_{alt}}{AD_{ref}+AD_{alt}}', meaning: 'Доля чтений ALT в конкретном образце.', notation: ['AD — allele depth'] },
      { label: 'Population AF', expression: 'AF=\\frac{alternate\\ alleles}{all\\ observed\\ alleles}', meaning: 'Частота варианта в популяционном ресурсе.', notation: ['Не равна VAF опухоли'] },
    ],
  },
  {
    id: `${variantId}-examples`, type: 'worked-example', title: 'Три причины не делать вывод по одной строке VCF', summary: 'Технический, транскриптный и клинический уровни.',
    workedExample: [
      { title: 'Низкая глубина', body: 'ALT 2 из 8 reads даёт VAF 0.25, но неопределённость и риск артефакта велики.' },
      { title: 'Разные транскрипты', body: 'Вариант может быть missense в одном transcript и intronic в другом.' },
      { title: 'Passenger ≠ driver', body: 'Наличие соматической мутации не доказывает функциональное влияние или терапевтическую применимость.' },
    ],
  },
  {
    id: `${variantId}-code`, type: 'code', title: 'Разбор ключевых полей VCF', summary: 'Сохраняем координату и фильтр.',
    codeExample: code('python', `def parse_info(raw):
    return dict(item.split('=', 1) for item in raw.split(';') if '=' in item)

chrom, pos, vid, ref, alt, qual, filt, info = vcf_line.split('\\t')[:8]
record = {'variant_id': f'{chrom}:{pos}:{ref}>{alt}',
          'filter': filt, 'info': parse_info(info)}
print(record)`, undefined, 'Для production используйте cyvcf2/pysam и нормализованный VCF; пример показывает структуру записи.'),
  },
  assessment(variantId, 'Варианты и аннотация: 6 вопросов', [
    singleQuestion('va-q1', variantId, 'Почему важен genome build?', ['Определяет координаты reference', 'Меняет цвет VCF', 'Выбирает модель ML', 'Задаёт p-value'], 0, 'Одна числовая координата может указывать на разные основания.'),
    numericQuestion('va-q2', variantId, 'ALT reads=20, REF reads=80. Чему равен VAF?', 0.2, '20/(20+80)=0.2.'),
    trueFalseQuestion('va-q3', variantId, 'VAF опухоли равен частоте аллеля в общей популяции.', false, 'Это разные уровни и знаменатели.'),
    singleQuestion('va-q4', variantId, 'Что учитывать при consequence?', ['Только первый transcript в файле', 'Явное правило выбора релевантного transcript', 'Только длину имени гена', 'Только QUAL'], 1, 'Последствия зависят от изоформы.'),
    trueFalseQuestion('va-q5', variantId, 'FILTER=PASS доказывает, что вариант является драйвером.', false, 'PASS относится к техническим фильтрам caller.'),
    singleQuestion('va-q6', variantId, 'Что отличает somatic анализ?', ['Сравнение опухоли с нормой и учёт purity/VAF', 'Только FASTA', 'Отсутствие координат', 'Запрет на QC'], 0, 'Контекст опухоль-норма критичен.'),
  ]),
  practiceStep(`${variantId}-practice`, 'Практика: VAF и фильтр глубины', 'Отделите вычисление от решения.', makeStdinTask(
    'variant-vaf-filter', 'VAF и статус',
    'Даны ref_reads alt_reads min_depth min_vaf. Выведите VAF с 3 знаками и PASS, если глубина и VAF не меньше порогов, иначе FAIL.',
    `# TODO: прочитайте четыре значения
# TODO: вычислите depth, VAF и статус`,
    [{ id: 'sample-1', description: 'Вариант проходит', input: '80 20 50 0.1\n', expectedOutput: '0.200 PASS' }],
    [{ id: 'hidden-1', description: 'Недостаточная глубина', input: '8 2 20 0.1\n', expectedOutput: '0.200 FAIL' }],
    `ref_reads, alt_reads, min_depth, min_vaf = map(float, input().split())
depth = ref_reads + alt_reads
vaf = alt_reads / depth
status = 'PASS' if depth >= min_depth and vaf >= min_vaf else 'FAIL'
print(f'{vaf:.3f} {status}')`,
  )),
  sourceStep(variantId, [researchSources.gdc, researchSources.cbioportal]),
]

const cancerId = 'genomics-cancer-public-data'
const cancerSteps: FlowStep[] = [
  theoryStep(`${cancerId}-theory`, 'Рак как эволюционная и клиническая система', 'Драйверы, гетерогенность и исходы.', [
    section('cancer-system', 'Почему одной мутации недостаточно', [
      'Опухоль содержит клональную структуру, copy-number изменения, экспрессионные программы и микроокружение. Driver даёт селективное преимущество, passenger сопровождает процесс. Один и тот же ген может иметь разные последствия в разных тканях и молекулярных подтипах.',
      'В публичных данных нужно различать case, sample и aliquot, первичную и метастатическую опухоль, assay и clinical follow-up. Endpoint overall survival, progression-free survival и response отвечают на разные вопросы; censoring является частью данных, а не пропуском.',
    ], {
      table: { headers: ['Источник', 'Сильная сторона', 'Ограничение'], rows: [
        ['GDC/TCGA', 'гармонизированные omics + clinical', 'сложный отбор и неоднородный follow-up'],
        ['cBioPortal', 'быстрый обзор исследований и alteration', 'нужно проверять исходную study schema'],
        ['GEO/SRA', 'много экспериментальных наборов', 'неоднородные протоколы и метаданные'],
      ] },
      callouts: [callout('Сначала data dictionary', 'Не объединяйте таблицы по «похожему» barcode. Зафиксируйте уровень case/sample/aliquot и ожидаемую кратность join.', 'important')],
    }),
  ]),
  {
    id: `${cancerId}-formula`, type: 'formula', title: 'Время до события', summary: 'Риск и вероятность выживания меняются во времени.',
    formulaCards: [
      { label: 'Survival function', expression: 'S(t)=P(T>t)', meaning: 'Вероятность не испытать событие к моменту t.', notation: ['T — время до события'] },
      { label: 'Hazard ratio', expression: 'HR=\\frac{h_1(t)}{h_0(t)}', meaning: 'Отношение мгновенных интенсивностей риска при предположении proportional hazards.', notation: ['HR<1 — меньший hazard в группе 1'] },
      { label: 'Censoring indicator', expression: '\\delta_i\\in\\{0,1\\}', meaning: 'Показывает, наблюдалось ли событие.', notation: ['0 — цензурировано', '1 — событие'] },
    ],
  },
  {
    id: `${cancerId}-examples`, type: 'worked-example', title: 'Четыре шага публичного cancer-проекта', summary: 'От запроса к анализируемой когорте.',
    workedExample: [
      { title: 'Study question', body: 'Например: связан ли статус мутации гена X с прогрессией в конкретном типе рака?' },
      { title: 'Manifest', body: 'Сохраняются project, data category/type, workflow, sample type, access level и file_id.' },
      { title: 'Cohort flow', body: 'Показываются case после каждого join, фильтра и требования follow-up.' },
      { title: 'Validation', body: 'Кандидат проверяется в независимом исследовании или с разделением по центру/времени.' },
    ],
  },
  {
    id: `${cancerId}-code`, type: 'code', title: 'Безопасное объединение case и sample', summary: 'validate превращает кратность join в проверку.',
    codeExample: code('python', `analysis = expression.merge(
    samples[['sample_id', 'case_id', 'sample_type']],
    on='sample_id', how='inner', validate='one_to_one'
)
analysis = analysis.merge(
    clinical[['case_id', 'time', 'event']],
    on='case_id', how='inner', validate='many_to_one'
)
assert analysis['case_id'].nunique() == clinical.loc[
    clinical.case_id.isin(analysis.case_id), 'case_id'
].nunique()`, undefined, 'validate выявляет неожиданные one-to-many отношения до того, как строки раздуют выборку.'),
  },
  theoryStep(`${cancerId}-pitfalls`, 'Survival leakage и immortal time', 'Время должно быть определено одинаково.', [
    section('survival-pitfalls', 'Три временные ловушки', [
      'Если биомаркер измеряется спустя время после старта наблюдения, включение только доживших до измерения создаёт immortal time bias. Если follow-up используется как обычный числовой признак для прогноза события, модель видит длительность будущего наблюдения. Если censoring зависит от риска, стандартные предположения могут нарушаться.',
    ], { bullets: ['Определите time zero.', 'Согласуйте событие и censoring.', 'Не используйте post-baseline данные как baseline predictors.', 'Проверьте proportional hazards для Cox-модели.'] }),
  ]),
  assessment(cancerId, 'Cancer data checkpoint: 8 вопросов', [
    singleQuestion('ca-q1', cancerId, 'Что является цензурированием?', ['Наблюдение закончилось без зарегистрированного события', 'Удаление выброса', 'Пропуск gene_id', 'Низкий VAF'], 0, 'Известно, что до последнего контакта события не было.'),
    trueFalseQuestion('ca-q2', cancerId, 'Case и sample всегда относятся один к одному.', false, 'У case может быть несколько образцов.'),
    singleQuestion('ca-q3', cancerId, 'Что означает driver mutation?', ['Любая PASS mutation', 'Изменение, дающее селективное преимущество', 'Самая частая запись VCF', 'Вариант с длинным ID'], 1, 'Драйверность — биологическое свойство, а не только фильтр.'),
    trueFalseQuestion('ca-q4', cancerId, 'Follow-up duration безопасно использовать как baseline-признак прогрессии.', false, 'Он содержит информацию из будущего.'),
    singleQuestion('ca-q5', cancerId, 'Зачем pandas merge(validate=...)?', ['Проверить ожидаемую кратность ключей', 'Ускорить GPU', 'Посчитать p-value', 'Построить Kaplan–Meier'], 0, 'Это защита от случайного размножения строк.'),
    singleQuestion('ca-q6', cancerId, 'Что фиксировать в GDC manifest?', ['Только gene symbol', 'Project, data type, workflow, sample type и file_id', 'Только размер ZIP', 'Только дату статьи'], 1, 'Эти поля определяют воспроизводимую выборку файлов.'),
    trueFalseQuestion('ca-q7', cancerId, 'HR=0.7 означает ровно на 30 процентных пунктов выше survival.', false, 'HR относится к hazard, не к абсолютной разнице survival.'),
    singleQuestion('ca-q8', cancerId, 'Что лучше всего проверяет переносимость находки?', ['Повторное обучение на тех же данных', 'Независимая когорта', 'Выбор лучшего p-value', 'Удаление неудобных образцов'], 1, 'Независимая проверка оценивает generalization.'),
  ]),
  practiceStep(`${cancerId}-practice-join`, 'Практика 1: аудит кратности sample→case', 'Найдите case с несколькими sample.', makeStdinTask(
    'case-sample-multiplicity', 'Число case с повторами',
    'Первая строка n, далее sample_id case_id. Выведите число case, у которых больше одного sample.',
    `# TODO: соберите samples по case_id
# TODO: посчитайте кратность больше 1`,
    [{ id: 'sample-1', description: 'Один case с двумя образцами', input: '3\ns1 c1\ns2 c1\ns3 c2\n', expectedOutput: '1' }],
    [{ id: 'hidden-1', description: 'Два case с повторами', input: '5\na x\nb x\nc y\nd y\ne z\n', expectedOutput: '2' }],
    `n = int(input())
counts = {}
for _ in range(n):
    sample, case = input().split()
    counts[case] = counts.get(case, 0) + 1
print(sum(count > 1 for count in counts.values()))`,
  )),
  practiceStep(`${cancerId}-practice-events`, 'Практика 2: события и censoring', 'Постройте минимальную сводку survival-когорты.', makeStdinTask(
    'survival-summary', 'Сводка времени до события',
    'Даны пары time:event (event 0/1). Выведите число событий, число censored и медиану наблюдаемого времени с 1 знаком.',
    `# TODO: прочитайте пары time:event
# TODO: посчитайте статусы и медиану времени`,
    [{ id: 'sample-1', description: 'Пять наблюдений', input: '2:1 4:0 6:1 8:0 10:1\n', expectedOutput: '3 2 6.0' }],
    [{ id: 'hidden-1', description: 'Чётное число наблюдений', input: '1:0 3:1 7:0 9:1\n', expectedOutput: '2 2 5.0' }],
    `pairs = [item.split(':') for item in input().split()]
times = sorted(float(time) for time, _ in pairs)
events = sum(int(event) for _, event in pairs)
n = len(times)
median = times[n // 2] if n % 2 else (times[n // 2 - 1] + times[n // 2]) / 2
print(events, n - events, f'{median:.1f}')`,
  )),
  sourceStep(cancerId, [researchSources.gdc, researchSources.cbioportal, researchSources.geo]),
]

export const genomicsTopics = [
  researchTopic({ id: filesId, title: '10.1 Молекулярная биология, идентификаторы и форматы', order: 1, summary: 'Гены, транскрипты, изоформы, FASTA/FASTQ/GTF/VCF и воспроизводимые входные данные.', blockId, blockTitle, blockIcon, format: 'карта форматов + parser lab', estimatedMinutes: 60, quizQuestions: 5, practiceTasks: 1, examples: 4, terminology: ['gene', 'transcript', 'isoform', 'FASTA', 'FASTQ', 'GTF', 'VCF'], cheatsheet: ['Фиксируйте build и версию аннотации.', 'Не используйте gene symbol как единственный технический ключ.'], sources: [researchSources.sra, researchSources.biopython], steps: filesSteps }),
  researchTopic({ id: rnaId, title: '10.2 RNA-seq, нормализация и дифференциальная экспрессия', order: 2, summary: 'Counts, design formula, batch effects, log2FC, FDR и QC-графики.', blockId, blockTitle, blockIcon, format: 'omics-разбор + R/Python', estimatedMinutes: 90, quizQuestions: 7, practiceTasks: 1, examples: 5, terminology: ['count matrix', 'size factor', 'TPM', 'log2FC', 'batch effect'], formulas: ['CPM', 'fold change', 'log2FC'], cheatsheet: ['DESeq2 начинает с raw counts.', 'Полное confounding нельзя исправить постфактум.'], sources: [researchSources.deseq2, researchSources.geo], steps: rnaSteps }),
  researchTopic({ id: variantId, title: '10.3 Варианты, VCF и функциональная аннотация', order: 3, summary: 'REF/ALT, build, VAF, транскрипты, germline/somatic и граница между PASS и driver.', blockId, blockTitle, blockIcon, format: 'VCF-аудит', estimatedMinutes: 65, quizQuestions: 6, practiceTasks: 1, examples: 4, terminology: ['REF', 'ALT', 'VAF', 'somatic', 'germline', 'consequence'], formulas: ['VAF', 'population AF'], cheatsheet: ['PASS не означает driver.', 'Последствие зависит от transcript.'], sources: [researchSources.gdc, researchSources.cbioportal], steps: variantSteps }),
  researchTopic({ id: cancerId, title: '10.4 Публичные данные рака, survival и multi-omics', order: 4, summary: 'GDC, cBioPortal, case/sample, driver/passenger, censoring и честные join.', blockId, blockTitle, blockIcon, format: 'проектная лаборатория + 2 задачи', estimatedMinutes: 95, quizQuestions: 8, practiceTasks: 2, examples: 5, terminology: ['driver', 'passenger', 'case', 'sample', 'survival', 'censoring', 'hazard'], formulas: ['S(t)', 'hazard ratio'], cheatsheet: ['Time zero и event задаются явно.', 'Проверяйте кратность каждого join.'], sources: [researchSources.gdc, researchSources.cbioportal], steps: cancerSteps }),
]
