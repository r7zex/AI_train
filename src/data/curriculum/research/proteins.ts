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

const blockId = 'protein-bioinformatics'
const blockTitle = 'Белки, последовательности и deep learning'
const blockIcon = '11'

const proteinId = 'proteins-sequence-databases'
const proteinSteps: FlowStep[] = [
  theoryStep(`${proteinId}-theory`, 'Белок как последовательность, структура и функция', 'Одна строка аминокислот содержит несколько уровней информации.', [
    section('protein-levels', 'Что именно предсказывает модель', [
      'Первичная структура — последовательность аминокислот. Мотив — короткий паттерн, домен — эволюционно и структурно самостоятельная единица, а функция может зависеть от нескольких доменов, локализации, партнёров и посттрансляционных модификаций.',
      'UniProtKB содержит sequence, accession, gene name, organism, evidence и annotations. Reviewed Swiss-Prot записи курируются вручную, TrEMBL содержит автоматически аннотированные записи. При формировании dataset сохраняйте evidence level и не смешивайте предсказанные и экспериментальные labels без отметки.',
    ], {
      table: { headers: ['Уровень', 'Пример задачи', 'Риск shortcut'], rows: [
        ['Остаток', 'сайт связывания', 'позиционные повторы'],
        ['Последовательность', 'субклеточная локализация', 'сигнальный пептид доминирует'],
        ['Белковая семья', 'функция домена', 'гомологи в train и test'],
      ] },
      callouts: [callout('Определите label', 'GO-термин, EC number, disease association и curated function — разные цели с разной иерархией и достоверностью.', 'important')],
    }),
  ]),
  {
    id: `${proteinId}-examples`, type: 'worked-example', title: 'Два набора признаков', summary: 'Простой baseline остаётся обязательным.',
    workedExample: [
      { title: 'Composition baseline', body: 'Длины, доли 20 аминокислот, charge/hydrophobicity и k-mer частоты дают интерпретируемую отправную точку.' },
      { title: 'Curated annotations', body: 'Домены и сигнальные пептиды сильны, но могут быть недоступны для новой последовательности или уже содержать целевую информацию.' },
    ],
  },
  {
    id: `${proteinId}-code`, type: 'code', title: 'Композиция аминокислот', summary: 'Baseline в несколько строк.',
    codeExample: code('python', `from collections import Counter

sequence = 'MKWVTFISLLFLFSSAYSRGVFRR'
counts = Counter(sequence)
features = {aa: counts[aa] / len(sequence) for aa in 'ACDEFGHIKLMNPQRSTVWY'}
features['length'] = len(sequence)
print(features)`, undefined, 'Неизвестные X/U/O/B/Z обрабатываются явным правилом, а не молча удаляются.'),
  },
  assessment(proteinId, 'Белковая грамотность: 5 вопросов', [
    singleQuestion('ps-q1', proteinId, 'Что такое домен?', ['Всегда ровно 3 остатка', 'Эволюционно/структурно самостоятельная часть белка', 'Название гена', 'Строка качества FASTQ'], 1, 'Домен часто сохраняет структуру и функцию.'),
    trueFalseQuestion('ps-q2', proteinId, 'Все UniProt-записи имеют одинаковый уровень доказательности.', false, 'Reviewed и unreviewed записи различаются по курированию.'),
    singleQuestion('ps-q3', proteinId, 'Какой baseline подходит для sequence classification?', ['Только Transformer', 'Композиция и k-mer + простая модель', 'Случайный label', 'Удаление длины'], 1, 'Он проверяет, нужна ли сложная архитектура.'),
    singleQuestion('ps-q4', proteinId, 'Что сохранять вместе с label?', ['Источник и evidence', 'Только индекс строки', 'Цвет карточки', 'Только длину файла'], 0, 'Label provenance критичен для качества набора.'),
    trueFalseQuestion('ps-q5', proteinId, 'Символ X в sequence лучше удалить без отчёта.', false, 'Правило обработки неизвестных остатков должно быть явным.'),
  ]),
  practiceStep(`${proteinId}-practice`, 'Практика: композиционный baseline', 'Вычислите длину и долю гидрофобных остатков.', makeStdinTask(
    'protein-composition', 'Длина и hydrophobic fraction',
    'Дана белковая последовательность. Гидрофобные остатки: A V I L M F W Y. Выведите длину и долю с 3 знаками.',
    `# TODO: прочитайте sequence
# TODO: посчитайте гидрофобные остатки`,
    [{ id: 'sample-1', description: 'Смешанная последовательность', input: 'AVILDK\n', expectedOutput: '6 0.667' }],
    [{ id: 'hidden-1', description: 'Нет гидрофобных', input: 'DEKR\n', expectedOutput: '4 0.000' }],
    `sequence = input().strip().upper()
hydrophobic = set('AVILMFWY')
fraction = sum(aa in hydrophobic for aa in sequence) / len(sequence)
print(len(sequence), f'{fraction:.3f}')`,
  )),
  sourceStep(proteinId, [researchSources.uniprot, researchSources.biopython]),
]

const homologyId = 'proteins-alignment-homology'
const homologySteps: FlowStep[] = [
  theoryStep(`${homologyId}-theory`, 'Alignment, BLAST и гомологический split', 'Сходство последовательностей меняет смысл оценки.', [
    section('alignment-core', 'Identity не равна homology', [
      'Pairwise alignment сопоставляет остатки с заменами и gap. Sequence identity — доля совпавших позиций по выбранному знаменателю; similarity может учитывать матрицу замен. Homology означает общее эволюционное происхождение и не выражается процентом.',
      'BLAST ищет локальные сходства и сообщает bit score, E-value, identity и coverage. Низкий E-value свидетельствует против случайного совпадения, но функциональный перенос требует достаточного coverage, корректного доменного контекста и осторожности с паралогами.',
    ], {
      table: { headers: ['Сигнал', 'Что говорит', 'Чего не гарантирует'], rows: [
        ['Identity', 'доля точных совпадений', 'одинаковую функцию'],
        ['Coverage', 'какая часть sequence выровнена', 'качество совпадений'],
        ['E-value', 'ожидаемые случайные hits', 'экспериментальную валидацию'],
      ] },
      callouts: [callout('Главная утечка protein ML', 'Случайный split по sequences помещает близких гомологов в train и test. Метрика оценивает узнавание семейства, а не перенос на новую семью.', 'important')],
    }),
  ]),
  {
    id: `${homologyId}-formula`, type: 'formula', title: 'Identity и coverage', summary: 'Всегда называйте знаменатель.',
    formulaCards: [
      { label: 'Alignment identity', expression: 'identity=\\frac{matches}{aligned\\ positions}', meaning: 'Доля точных совпадений в alignment.', notation: ['Gap handling задаётся явно'] },
      { label: 'Query coverage', expression: 'coverage=\\frac{aligned\\ query\\ residues}{query\\ length}', meaning: 'Доля query, покрытая alignment.', notation: ['Высокая identity на коротком мотиве может быть недостаточна'] },
    ],
  },
  {
    id: `${homologyId}-examples`, type: 'worked-example', title: 'Три уровня split', summary: 'Чем строже split, тем ближе тест к discovery.',
    workedExample: [
      { title: 'Random sequence split', body: 'Оптимистичный, если почти идентичные sequences распределены по обеим частям.' },
      { title: 'Cluster split', body: 'Сначала кластеризация по identity threshold, затем целые кластеры назначаются в fold.' },
      { title: 'Family/domain holdout', body: 'Самая строгая проверка переноса на новые семейства или архитектуры доменов.' },
    ],
  },
  {
    id: `${homologyId}-code`, type: 'code', title: 'Cluster-aware split', summary: 'Группа — кластер гомологии.',
    codeExample: code('python', `from sklearn.model_selection import GroupKFold

# cluster_id получен независимой кластеризацией sequences по identity threshold
cv = GroupKFold(n_splits=5)
for train_idx, test_idx in cv.split(features, labels, groups=cluster_id):
    assert set(cluster_id[train_idx]).isdisjoint(cluster_id[test_idx])`, undefined, 'Кластеризация выполняется без target; threshold и инструмент фиксируются в protocol.'),
  },
  theoryStep(`${homologyId}-pitfalls`, 'Паралоги, домены и короткие hits', 'Функцию нельзя переносить механически.', [
    section('homology-pitfalls', 'Четыре ограничения', [
      'Паралоги после дупликации могут расходиться по функции. Многодоменные белки могут совпадать только одним доменом. Короткий мотив даёт высокую identity при низком coverage. Dataset может содержать одинаковые sequences с конфликтующими labels.',
    ], { bullets: ['Дедуплицируйте exact sequences.', 'Проверяйте label conflicts.', 'Показывайте распределение identity train↔test.', 'Отдельно оценивайте remote-homology subset.'] }),
  ]),
  assessment(homologyId, 'Alignment и split: 7 вопросов', [
    trueFalseQuestion('ho-q1', homologyId, 'Можно сказать «две sequences гомологичны на 40%».', false, '40% относится к identity/similarity; homology — отношение происхождения.'),
    singleQuestion('ho-q2', homologyId, 'Что означает query coverage?', ['Доля query в alignment', 'Число классов', 'Вероятность функции', 'Длина базы'], 0, 'Coverage показывает охваченную часть query.'),
    trueFalseQuestion('ho-q3', homologyId, 'Высокая identity на 8 остатках всегда доказывает одинаковую функцию белков.', false, 'Coverage и доменный контекст могут быть недостаточны.'),
    singleQuestion('ho-q4', homologyId, 'Какой split честнее для новой protein family?', ['Random rows', 'Cluster/family holdout', 'Одинаковые sequences в обеих частях', 'Split по длине имени'], 1, 'Он снижает homology leakage.'),
    singleQuestion('ho-q5', homologyId, 'Что такое E-value BLAST?', ['Ожидаемое число случайных hits такого качества', 'Доля положительных labels', 'Калибровка модели', 'Частота мутации'], 0, 'Меньшее значение обычно означает более значимое совпадение.'),
    numericQuestion('ho-q6', homologyId, 'В alignment 80 совпадений из 100 позиций. Identity?', 0.8, '80/100=0.8.'),
    trueFalseQuestion('ho-q7', homologyId, 'Exact duplicates с разными labels требуют аудита.', true, 'Иначе задача содержит противоречивую разметку.'),
  ]),
  practiceStep(`${homologyId}-practice-identity`, 'Практика 1: identity с gap', 'Зафиксируйте знаменатель alignment.', makeStdinTask(
    'alignment-identity', 'Identity без double-gap',
    'Даны две выровненные строки одинаковой длины. Игнорируйте позиции, где хотя бы одна sequence имеет -. Выведите identity с 3 знаками.',
    `# TODO: прочитайте две строки
# TODO: оставьте позиции без gap`,
    [{ id: 'sample-1', description: 'Один mismatch и gap', input: 'ACD-EF\nACDGEY\n', expectedOutput: '0.800' }],
    [{ id: 'hidden-1', description: 'Полное совпадение без gap-позиции', input: 'A-CG\nATCG\n', expectedOutput: '1.000' }],
    `a = input().strip()
b = input().strip()
pairs = [(x, y) for x, y in zip(a, b) if x != '-' and y != '-']
identity = sum(x == y for x, y in pairs) / len(pairs)
print(f'{identity:.3f}')`,
  )),
  practiceStep(`${homologyId}-practice-clusters`, 'Практика 2: аудит cluster split', 'Проверьте, что кластеры не пересекаются.', makeStdinTask(
    'cluster-overlap', 'Пересечение кластеров', 'Две строки содержат cluster_id для train и test. Выведите число общих кластеров.',
    `# TODO: прочитайте два множества cluster_id
# TODO: посчитайте пересечение`,
    [{ id: 'sample-1', description: 'Один общий кластер', input: 'c1 c2 c3\nc3 c4\n', expectedOutput: '1' }],
    [{ id: 'hidden-1', description: 'Строгий holdout', input: 'a b\nc d\n', expectedOutput: '0' }],
    `train = set(input().split())
test = set(input().split())
print(len(train & test))`,
  )),
  sourceStep(homologyId, [researchSources.blast, researchSources.uniprot]),
]

const structureId = 'proteins-structure-confidence'
const structureSteps: FlowStep[] = [
  theoryStep(`${structureId}-theory`, 'Структура белка и уверенность модели', 'PDB, AlphaFold и ограничения координат.', [
    section('structure-evidence', 'Эксперимент и предсказание', [
      'RCSB PDB хранит экспериментальные структуры и метаданные метода, разрешения, цепей, ligands и biological assembly. Предсказанная структура даёт гипотезу о fold, но её уверенность неоднородна по остаткам и отношениям между доменами.',
      'pLDDT описывает локальную уверенность в геометрии остатка. PAE оценивает уверенность в относительном расположении пар областей. Высокий pLDDT внутри двух доменов не гарантирует, что их взаимная ориентация надёжна.',
    ], {
      table: { headers: ['Сигнал', 'Читать как', 'Не читать как'], rows: [
        ['pLDDT', 'локальная уверенность', 'вероятность биологической функции'],
        ['PAE', 'уверенность относительного положения', 'расстояние между атомами'],
        ['Resolution', 'детальность experiment', 'универсальный рейтинг всех методов'],
      ] },
      callouts: [callout('Структурная осторожность', 'Disordered region с низким pLDDT может быть биологически важной, а не «плохой частью белка».', 'remember')],
    }),
  ]),
  {
    id: `${structureId}-examples`, type: 'worked-example', title: 'Два сценария использования', summary: 'Структура отвечает на конкретный вопрос.',
    workedExample: [
      { title: 'Кандидатный сайт', body: 'Высокая локальная уверенность позволяет осторожно анализировать окружение residue, но не доказывает binding.' },
      { title: 'Доменное движение', body: 'Высокий pLDDT доменов при высоком inter-domain PAE указывает на неопределённую ориентацию.' },
    ],
  },
  {
    id: `${structureId}-code`, type: 'code', title: 'Аннотация уверенности по pLDDT', summary: 'Категории используются для QC, а не для фильтра функции.',
    codeExample: code('python', `def confidence_label(plddt):
    if plddt >= 90: return 'very_high'
    if plddt >= 70: return 'confident'
    if plddt >= 50: return 'low'
    return 'very_low'

labels = [confidence_label(value) for value in plddt_per_residue]
print({label: labels.count(label) for label in set(labels)})`, undefined, 'Пороговые категории помогают описывать модель, но не заменяют PAE и биологическую валидацию.'),
  },
  assessment(structureId, 'Структурный checkpoint: 6 вопросов', [
    singleQuestion('st-q1', structureId, 'Что описывает pLDDT?', ['Локальную уверенность структуры', 'Силу связи ligand', 'Expression gene', 'p-value'], 0, 'Это per-residue confidence.'),
    singleQuestion('st-q2', structureId, 'Что важно для ориентации доменов?', ['Только средний pLDDT', 'PAE между доменами', 'Длина accession', 'GC-content'], 1, 'PAE показывает относительную уверенность.'),
    trueFalseQuestion('st-q3', structureId, 'Низкий pLDDT всегда означает бесполезный участок.', false, 'Он может отражать flexible/disordered region.'),
    singleQuestion('st-q4', structureId, 'Что хранить для PDB-структуры?', ['PDB ID, chain, method и resolution', 'Только PNG', 'Только gene symbol', 'Только цвет chain'], 0, 'Это минимальная provenance.'),
    trueFalseQuestion('st-q5', structureId, 'Высокая уверенность fold доказывает молекулярную функцию.', false, 'Функция требует дополнительных данных.'),
    singleQuestion('st-q6', structureId, 'Что такое biological assembly?', ['Предполагаемая биологически релевантная организация цепей', 'Первая строка FASTA', 'Fold CV', 'Список мутаций'], 0, 'Она может отличаться от asymmetric unit.'),
  ]),
  practiceStep(`${structureId}-practice`, 'Практика: профиль pLDDT', 'Посчитайте долю уверенных остатков.', makeStdinTask(
    'plddt-summary', 'Уверенные и низкоуверенные остатки',
    'Даны pLDDT. Выведите долю >=70 и число <50: долю с 3 знаками, затем count.',
    `# TODO: прочитайте pLDDT
# TODO: посчитайте две категории`,
    [{ id: 'sample-1', description: 'Смешанный профиль', input: '95 80 65 40\n', expectedOutput: '0.500 1' }],
    [{ id: 'hidden-1', description: 'Все уверенные', input: '70 75 90\n', expectedOutput: '1.000 0' }],
    `values = list(map(float, input().split()))
confident = sum(value >= 70 for value in values) / len(values)
very_low = sum(value < 50 for value in values)
print(f'{confident:.3f}', very_low)`,
  )),
  theoryStep(`${structureId}-recap`, 'Как описать структуру в статье', 'Минимальный provenance и оговорки.', [
    section('structure-report', 'Четыре обязательных элемента', ['Укажите accession/sequence version, источник структуры, PDB ID или версию prediction, chain/residue mapping и метрики качества. В Results разделяйте наблюдение по структуре и функциональную интерпретацию; последняя является гипотезой без отдельного эксперимента.'], {
      bullets: ['Показывайте scale pLDDT/PAE на рисунке.', 'Не скрывайте низкоуверенные regions.', 'Проверяйте соответствие residue numbering.'],
    }),
  ]),
  sourceStep(structureId, [researchSources.rcsb, researchSources.uniprot]),
]

const embeddingsId = 'proteins-embeddings-deep-learning'
const embeddingsSteps: FlowStep[] = [
  theoryStep(`${embeddingsId}-theory`, 'От k-mer к protein language model', 'Представление определяет доступный модели сигнал.', [
    section('representation-ladder', 'Четыре уровня сложности', [
      'Composition/k-mer подходят линейным моделям и дают сильный baseline. CNN ищет локальные motifs с shared filters. RNN обрабатывает последовательность рекуррентно, но длинные зависимости трудны. Transformer через self-attention моделирует контекст всех позиций и обычно предварительно обучается на больших корпусах sequences.',
      'Protein language model выдаёт per-residue embeddings. Для sequence-level задачи применяют masked mean pooling или специальный token, затем linear/MLP head. Fine-tuning требует больше памяти и данных; frozen embeddings часто являются разумным первым экспериментом.',
    ], {
      table: { headers: ['Модель', 'Индуктивное предположение', 'Baseline-вопрос'], rows: [
        ['MLP на composition', 'порядок почти не важен', 'достаточно ли состава?'],
        ['1D CNN', 'локальные motifs', 'какая длина receptive field?'],
        ['RNN', 'последовательное состояние', 'нужен ли дальний порядок?'],
        ['Transformer/ESM', 'контекст через attention', 'переносится ли pretrained signal?'],
      ] },
    }),
  ]),
  {
    id: `${embeddingsId}-formula`, type: 'formula', title: 'Pooling и attention', summary: 'Из L×d получаем один вектор или residue scores.',
    formulaCards: [
      { label: 'Masked mean pooling', expression: 'z=\\frac{\\sum_i m_i h_i}{\\sum_i m_i}', meaning: 'Среднее embeddings только по настоящим residues.', notation: ['m_i=0 для padding', 'h_i — embedding residue'] },
      { label: 'Scaled dot-product attention', expression: 'Attention(Q,K,V)=softmax(\\frac{QK^T}{\\sqrt{d_k}})V', meaning: 'Взвешивает контекст по совместимости query и key.', notation: ['Это вычислительный механизм, не готовое объяснение биологии'] },
    ],
  },
  {
    id: `${embeddingsId}-examples`, type: 'worked-example', title: 'Пять обязательных сравнений', summary: 'Модель оценивается не в вакууме.',
    workedExample: [
      { title: 'Label prevalence', body: 'Dummy baseline задаёт нижнюю границу для accuracy/PR-AUC.' },
      { title: 'Composition + LogisticRegression', body: 'Проверяет простой глобальный signal.' },
      { title: 'k-mer + linear model', body: 'Добавляет локальный порядок без deep learning.' },
      { title: 'Frozen ESM + linear head', body: 'Измеряет качество pretrained representation.' },
      { title: 'Fine-tuned model', body: 'Допустим только после честного cluster split и отдельной настройки.' },
    ],
  },
  {
    id: `${embeddingsId}-code`, type: 'code', title: 'Masked mean pooling в PyTorch', summary: 'Padding не должен влиять на vector.',
    codeExample: code('python', `import torch

def masked_mean(hidden, attention_mask):
    mask = attention_mask.unsqueeze(-1).to(hidden.dtype)
    summed = (hidden * mask).sum(dim=1)
    counts = mask.sum(dim=1).clamp_min(1)
    return summed / counts

# hidden: [batch, length, dim], attention_mask: [batch, length]
sequence_embeddings = masked_mean(last_hidden_state, attention_mask)`, undefined, 'Без mask короткие sequences получают вклад padding и зависят от batch length.'),
  },
  theoryStep(`${embeddingsId}-pitfalls`, 'Shortcut learning и вычислительный бюджет', 'Большая модель не исправляет dataset.', [
    section('deep-pitfalls', 'Что ломает убедительность', [
      'Random split с гомологами, различия длины между классами, taxonomic bias, labels из автоматической аннотации и выбор checkpoint по test дают эффект без реального discovery. Сначала проверяйте performance по identity bins, длине, организмам и семействам.',
    ], { bullets: ['Сохраняйте model/tokenizer revision.', 'Обрезку длинных sequences описывайте явно.', 'Вычисляйте embeddings один раз и version-cache.', 'Не интерпретируйте attention weight как causal explanation.'] }),
  ]),
  assessment(embeddingsId, 'Deep protein ML: 8 вопросов', [
    singleQuestion('em-q1', embeddingsId, 'Что делает masked pooling?', ['Исключает padding из агрегации', 'Удаляет target leakage', 'Строит PDB', 'Считает E-value'], 0, 'Mask оставляет только реальные residues.'),
    singleQuestion('em-q2', embeddingsId, 'Какая модель ищет локальные motifs shared filters?', ['1D CNN', 'KMeans', 'Kaplan–Meier', 'Bonferroni'], 0, 'Свёртки используют локальные окна.'),
    trueFalseQuestion('em-q3', embeddingsId, 'Frozen embeddings всегда хуже fine-tuning.', false, 'На малых данных они могут быть стабильнее и дешевле.'),
    singleQuestion('em-q4', embeddingsId, 'Что сравнивать до fine-tuning?', ['Dummy, composition/k-mer и frozen embeddings', 'Только train loss', 'Только Transformer', 'Только длину'], 0, 'Так измеряется добавленная ценность сложности.'),
    trueFalseQuestion('em-q5', embeddingsId, 'Attention weight сам по себе доказывает функциональную важность residue.', false, 'Это внутренний механизм модели, не causal evidence.'),
    singleQuestion('em-q6', embeddingsId, 'Что особенно важно для test split?', ['Cluster/family separation', 'Случайный цвет', 'Одинаковые duplicates', 'Максимальный batch'], 0, 'Иначе тест содержит близких гомологов.'),
    numericQuestion('em-q7', embeddingsId, 'У sequence 8 real tokens и 2 padding. Сколько tokens должно войти в masked mean?', 8, 'Padding имеет mask=0.', 0),
    singleQuestion('em-q8', embeddingsId, 'Что version-cache должен включать?', ['Model revision, tokenizer, pooling и sequence hash', 'Только имя CSV', 'Только GPU', 'Только seed'], 0, 'Это определяет воспроизводимость embeddings.'),
  ]),
  practiceStep(`${embeddingsId}-practice-pooling`, 'Практика 1: masked mean', 'Агрегируйте только реальные позиции.', makeStdinTask(
    'masked-mean-1d', 'Masked mean одномерных embeddings',
    'Первая строка значения, вторая mask 0/1. Выведите masked mean с 3 знаками.',
    `# TODO: прочитайте values и mask
# TODO: усредните значения с mask=1`,
    [{ id: 'sample-1', description: 'Два padding tokens', input: '1 3 100 100\n1 1 0 0\n', expectedOutput: '2.000' }],
    [{ id: 'hidden-1', description: 'Все позиции настоящие', input: '2 4 6\n1 1 1\n', expectedOutput: '4.000' }],
    `values = list(map(float, input().split()))
mask = list(map(int, input().split()))
selected = [value for value, keep in zip(values, mask) if keep]
print(f'{sum(selected) / len(selected):.3f}')`,
  )),
  practiceStep(`${embeddingsId}-practice-motif`, 'Практика 2: motif baseline', 'Сравните deep model с простым счётчиком.', makeStdinTask(
    'motif-count', 'Число motif occurrences',
    'Первая строка sequence, вторая motif. Выведите число перекрывающихся вхождений.',
    `# TODO: прочитайте sequence и motif
# TODO: проверьте каждую стартовую позицию`,
    [{ id: 'sample-1', description: 'Перекрывающиеся motifs', input: 'AAAAA\nAAA\n', expectedOutput: '3' }],
    [{ id: 'hidden-1', description: 'Два разделённых motif', input: 'MKTXXMKT\nMKT\n', expectedOutput: '2' }],
    `sequence = input().strip()
motif = input().strip()
count = sum(sequence[i:i + len(motif)] == motif for i in range(len(sequence) - len(motif) + 1))
print(count)`,
  )),
  theoryStep(`${embeddingsId}-recap`, 'Экспериментальная матрица моделей', 'Одна строка — одно заранее описанное сравнение.', [
    section('model-matrix', 'Что менять по одному', ['Фиксируйте dataset split и метрики, затем сравнивайте representation (composition, k-mer, ESM), head (linear/MLP), режим (frozen/fine-tuned) и threshold. Если одновременно сменить split, features и модель, причина улучшения неизвестна.'], {
      bullets: ['Показывайте performance по identity bins.', 'Сообщайте число параметров и время/память.', 'Сохраняйте predictions каждой модели.'],
    }),
  ]),
  sourceStep(embeddingsId, [researchSources.esm, researchSources.uniprot, researchSources.blast]),
]

export const proteinTopics = [
  researchTopic({ id: proteinId, title: '11.1 Белковые последовательности, функции и UniProt', order: 1, summary: 'Аминокислоты, motifs, domains, curated labels и сильный композиционный baseline.', blockId, blockTitle, blockIcon, format: 'биологическая карта + baseline lab', estimatedMinutes: 60, quizQuestions: 5, practiceTasks: 1, examples: 3, terminology: ['amino acid', 'motif', 'domain', 'accession', 'evidence'], cheatsheet: ['Сохраняйте provenance label.', 'Простой composition baseline обязателен.'], sources: [researchSources.uniprot], steps: proteinSteps }),
  researchTopic({ id: homologyId, title: '11.2 Alignment, BLAST и гомологический split', order: 2, summary: 'Identity, coverage, E-value, paralogs и защита от homology leakage.', blockId, blockTitle, blockIcon, format: 'alignment lab + 2 аудита', estimatedMinutes: 85, quizQuestions: 7, practiceTasks: 2, examples: 4, terminology: ['alignment', 'identity', 'coverage', 'E-value', 'homology', 'paralog'], formulas: ['identity', 'coverage'], cheatsheet: ['Homology не измеряется процентом.', 'Кластеры целиком назначаются в fold.'], sources: [researchSources.blast], steps: homologySteps }),
  researchTopic({ id: structureId, title: '11.3 Структура белка, PDB, pLDDT и PAE', order: 3, summary: 'Экспериментальные и предсказанные структуры, локальная и доменная уверенность.', blockId, blockTitle, blockIcon, format: 'структурный разбор', estimatedMinutes: 65, quizQuestions: 6, practiceTasks: 1, examples: 3, terminology: ['PDB', 'biological assembly', 'pLDDT', 'PAE', 'disorder'], cheatsheet: ['pLDDT — локальная уверенность, не функция.', 'PAE важен для взаимной ориентации доменов.'], sources: [researchSources.rcsb], steps: structureSteps }),
  researchTopic({ id: embeddingsId, title: '11.4 CNN, RNN, Transformers и protein embeddings', order: 4, summary: 'Архитектуры от k-mer до ESM, masked pooling, fine-tuning и честный benchmark.', blockId, blockTitle, blockIcon, format: 'архитектурная лаборатория + 2 задачи', estimatedMinutes: 105, quizQuestions: 8, practiceTasks: 2, examples: 6, terminology: ['CNN', 'RNN', 'Transformer', 'embedding', 'pooling', 'fine-tuning'], formulas: ['masked mean', 'attention'], cheatsheet: ['Сначала frozen embeddings и linear head.', 'Attention не является готовым биологическим объяснением.'], sources: [researchSources.esm], steps: embeddingsSteps }),
]
