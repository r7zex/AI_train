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

const blockId = 'research-statistics'
const blockTitle = 'Статистика и дизайн исследования'
const blockIcon = '08'

const uncertaintyId = 'research-uncertainty'
const uncertaintySteps: FlowStep[] = [
  theoryStep(`${uncertaintyId}-theory`, 'От выборки к неопределённости', 'Почему одной средней недостаточно.', [
    section('population-sample', 'Генеральная совокупность и выборка', [
      'В статье мы почти никогда не наблюдаем всю генеральную совокупность. Выборка даёт точечную оценку — например, средний возраст — но другая выборка дала бы немного другое значение. Поэтому исследователь сообщает не только оценку, но и диапазон правдоподобных значений.',
      'Стандартное отклонение описывает разброс наблюдений, а стандартная ошибка — неопределённость оценки среднего. Смешивать их нельзя: SD отвечает «насколько различаются пациенты», SE — «насколько неточно оценено среднее».',
    ], {
      table: {
        headers: ['Величина', 'Что описывает', 'Пример'],
        rows: [
          ['SD', 'разброс значений', 'вариативность экспрессии гена между образцами'],
          ['SE', 'неопределённость среднего', 'насколько стабильно среднее по группе'],
          ['95% CI', 'диапазон для параметра', 'интервал для разницы групп'],
        ],
      },
      callouts: [callout('Правило статьи', 'Всегда уточняйте: что именно оценено, в каких единицах и каким способом построен интервал.', 'remember')],
    }),
  ]),
  {
    id: `${uncertaintyId}-formula`, type: 'formula', title: 'SD, SE и доверительный интервал', summary: 'Три формулы и их границы применимости.',
    formulaCards: [
      { label: 'Среднее', expression: '\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n}x_i', meaning: 'Центр наблюдаемой выборки.', notation: ['n — размер выборки', 'x_i — отдельное наблюдение'] },
      { label: 'Стандартная ошибка', expression: 'SE=\\frac{s}{\\sqrt{n}}', meaning: 'Приближённая неопределённость среднего для независимых наблюдений.', notation: ['s — выборочное SD', 'n — число независимых объектов'] },
      { label: 'Приближённый 95% CI', expression: '\\bar{x}\\pm1.96\\cdot SE', meaning: 'Работает как крупновыборочное приближение; для малых n нужен t-квантиль.', notation: ['1.96 — квантиль нормального распределения'] },
    ],
  },
  {
    id: `${uncertaintyId}-examples`, type: 'worked-example', title: 'Два разных масштаба неопределённости', summary: 'Клиника и экспрессия генов требуют разных интерпретаций.',
    workedExample: [
      { title: 'Когорта Gamma Knife', body: 'При n=548 узкий CI для среднего возраста не означает, что пациенты однородны: SD может оставаться большим.' },
      { title: 'Экспрессия гена', body: 'Три технических повтора не заменяют трёх биологических образцов: независимая единица — пациент или организм, а не лунка.' },
    ],
  },
  {
    id: `${uncertaintyId}-code`, type: 'code', title: 'Расчёт описательной статистики', summary: 'Минимальный воспроизводимый расчёт без магии.',
    codeExample: code('python', `import numpy as np

x = np.array([12.1, 11.8, 13.0, 12.4, 12.7])
mean = x.mean()
sd = x.std(ddof=1)
se = sd / np.sqrt(len(x))
ci = (mean - 1.96 * se, mean + 1.96 * se)
print(mean, sd, ci)`, undefined, 'ddof=1 даёт выборочную оценку SD; в статье укажите правило расчёта CI.'),
  },
  assessment(uncertaintyId, 'Проверка понимания: 5 вопросов', [
    singleQuestion('unc-q1', uncertaintyId, 'Что описывает стандартная ошибка среднего?', ['Разброс пациентов', 'Неопределённость оценки среднего', 'Долю пропусков', 'Систематическое смещение'], 1, 'SE меняется с размером выборки и описывает точность оценки.'),
    trueFalseQuestion('unc-q2', uncertaintyId, 'Малое SD автоматически означает отсутствие систематической ошибки.', false, 'Низкий разброс не защищает от смещённого отбора или измерения.'),
    numericQuestion('unc-q3', uncertaintyId, 'Если SD=10 и n=100, чему равна SE?', 1, 'SE = 10 / √100 = 1.'),
    singleQuestion('unc-q4', uncertaintyId, 'Что является независимой единицей в исследовании опухолевой ткани?', ['Каждый ген', 'Каждое чтение FASTQ', 'Пациент, если по нему формируется исход', 'Каждая ячейка таблицы'], 2, 'Единица анализа должна совпадать с единицей формирования исхода.'),
    trueFalseQuestion('unc-q5', uncertaintyId, '95% CI — это интервал, который в повторных исследованиях покрывал бы истинный параметр примерно в 95% случаев.', true, 'Такова частотная интерпретация процедуры построения интервала.'),
  ]),
  practiceStep(`${uncertaintyId}-practice`, 'Практика: среднее и SE', 'Посчитайте две разные характеристики выборки.', makeStdinTask(
    'uncertainty-mean-se', 'Среднее и стандартная ошибка',
    'В первой строке даны числа. Выведите выборочное среднее и SE, округлённые до 2 знаков через пробел. Используйте выборочное SD (n-1).',
    `# TODO: прочитайте значения
values = []
# TODO: вычислите mean и SE`,
    [{ id: 'sample-1', description: 'Пять измерений', input: '10 12 14 16 18\n', expectedOutput: '14.00 1.41' }],
    [{ id: 'hidden-1', description: 'Три измерения', input: '2 4 6\n', expectedOutput: '4.00 1.15' }],
    `import math
values = list(map(float, input().split()))
n = len(values)
mean = sum(values) / n
variance = sum((x - mean) ** 2 for x in values) / (n - 1)
se = math.sqrt(variance) / math.sqrt(n)
print(f'{mean:.2f} {se:.2f}')`,
  )),
  theoryStep(`${uncertaintyId}-recap`, 'Шпаргалка перед анализом', 'Короткий контрольный список.', [
    section('unc-recap', 'Перед тем как писать число в Results', [
      'Назовите единицу анализа, покажите n после исключений, различайте SD и SE, сообщайте интервал вместе с оценкой и не выдавайте узкий CI за доказательство отсутствия смещения.',
    ], { bullets: ['Повторы одного пациента не увеличивают клиническое n.', 'График распределения дополняет, но не заменяет таблицу.', 'Способ построения CI должен быть воспроизводим.'] }),
  ]),
]

const testsId = 'research-tests-effects'
const testsSteps: FlowStep[] = [
  theoryStep(`${testsId}-theory`, 'Гипотеза, эффект и клинический смысл', 'p-value — не размер эффекта.', [
    section('test-question', 'Сначала исследовательский контраст', [
      'Статистический тест проверяет конкретную нулевую гипотезу при конкретных предпосылках. До выбора функции сформулируйте исход, группы, единицу анализа, направление контраста и допустимый риск ошибки.',
      'В большой выборке ничтожная разница может иметь маленькое p-value. Поэтому вместе с p-value сообщают размер эффекта и доверительный интервал: разницу средних, odds ratio, risk ratio или стандартизованный эффект.',
    ], { callouts: [callout('Не начинайте с меню тестов', 'Сначала определите тип исхода и дизайн: независимые или парные наблюдения, две группы или больше, непрерывный или категориальный исход.', 'important')] }),
  ]),
  {
    id: `${testsId}-formula`, type: 'formula', title: 'Эффекты для разных исходов', summary: 'Выберите меру, которую сможет интерпретировать читатель.',
    formulaCards: [
      { label: 'Разница рисков', expression: 'RD=p_1-p_0', meaning: 'Абсолютное изменение вероятности события.', notation: ['p_1 — риск в исследуемой группе', 'p_0 — риск в контрольной группе'] },
      { label: 'Отношение рисков', expression: 'RR=\\frac{p_1}{p_0}', meaning: 'Во сколько раз риск отличается между группами.', notation: ['RR=1 — различия риска нет'] },
      { label: 'Cohen d', expression: 'd=\\frac{\\bar{x}_1-\\bar{x}_0}{s_{pooled}}', meaning: 'Стандартизованная разница средних.', notation: ['s_pooled — объединённое SD'] },
    ],
  },
  {
    id: `${testsId}-examples`, type: 'worked-example', title: 'Три контраста из биомедицины', summary: 'Одинаковый p-value может отвечать на разные вопросы.',
    workedExample: [
      { title: 'Два независимых распределения', body: 'Сравнение экспрессии гена в опухоли и нормальной ткани: t-test при приемлемых предпосылках или устойчивый/пермутационный подход.' },
      { title: 'Парные образцы', body: 'Опухоль и прилежащая ткань одного пациента: парность надо сохранить, иначе теряется информация и искажается SE.' },
      { title: 'Бинарный исход', body: 'Прогрессия после Gamma Knife: показывайте абсолютные доли, разницу рисков или OR с CI, а не только p-value.' },
    ],
  },
  {
    id: `${testsId}-code`, type: 'code', title: 'Эффект рядом с тестом', summary: 'Вычисляем интерпретируемую величину.',
    codeExample: code('python', `import numpy as np
from scipy.stats import ttest_ind

tumor = np.array([8.2, 7.9, 9.1, 8.7])
normal = np.array([5.0, 5.4, 4.9, 5.2])
effect = tumor.mean() - normal.mean()
test = ttest_ind(tumor, normal, equal_var=False)
print({'mean_difference': effect, 'p_value': test.pvalue})`, undefined, 'Welch t-test не требует равенства дисперсий; эффект остаётся в исходных единицах.'),
  },
  theoryStep(`${testsId}-pitfalls`, 'Предпосылки и частые ошибки', 'Что проверить до запуска теста.', [
    section('test-pitfalls', 'Пять точек контроля', [
      'Независимость важнее визуальной нормальности. При кластеризации по пациенту стандартный тест по строкам таблицы неверен. Парные данные нельзя анализировать как независимые, а post-hoc выбор теста после просмотра p-value увеличивает риск ложного результата.',
    ], { bullets: ['Покажите распределение и выбросы.', 'Не путайте отсутствие значимости с доказанным отсутствием эффекта.', 'Не меняйте первичный исход после просмотра результатов.', 'Для малых выборок рассматривайте перестановочные методы.'] }),
  ]),
  assessment(testsId, 'Контроль: 7 вопросов', [
    singleQuestion('te-q1', testsId, 'Что лучше всего дополняет p-value?', ['Только размер выборки', 'Размер эффекта и CI', 'Номер версии Python', 'Название журнала'], 1, 'Эффект и CI позволяют судить о величине и неопределённости.'),
    singleQuestion('te-q2', testsId, 'Какой дизайн парный?', ['Разные пациенты в двух центрах', 'Опухоль и нормальная ткань одного пациента', 'Два случайных батча', 'Две независимые когорты'], 1, 'Два измерения принадлежат одному объекту.'),
    trueFalseQuestion('te-q3', testsId, 'p=0.2 доказывает отсутствие биологически важного эффекта.', false, 'Недостаток мощности и широкий CI могут скрывать важный эффект.'),
    numericQuestion('te-q4', testsId, 'Риск события 0.30 против 0.20. Чему равен RR?', 1.5, 'RR = 0.30 / 0.20 = 1.5.'),
    numericQuestion('te-q5', testsId, 'Риск события 0.30 против 0.20. Чему равна разница рисков?', 0.1, 'RD = 0.30 - 0.20 = 0.10.'),
    singleQuestion('te-q6', testsId, 'Что критично при нескольких строках на пациента?', ['Увеличить шрифт графика', 'Учесть кластеризацию/группировку по пациенту', 'Удалить ID пациента', 'Смешать строки случайно'], 1, 'Строки одного пациента не независимы.'),
    trueFalseQuestion('te-q7', testsId, 'Welch t-test допускает разные дисперсии групп.', true, 'Это одно из его отличий от классического pooled t-test.'),
  ]),
  practiceStep(`${testsId}-practice`, 'Практика: абсолютный и относительный эффект', 'Переведите таблицу 2×2 в понятные меры.', makeStdinTask(
    'risk-effects', 'Разница и отношение рисков',
    'Даны события и размеры двух групп: events1 n1 events0 n0. Выведите RD и RR с 3 знаками.',
    `# TODO: прочитайте четыре числа
# TODO: вычислите риски, RD и RR`,
    [{ id: 'sample-1', description: '30 из 100 против 20 из 100', input: '30 100 20 100\n', expectedOutput: '0.100 1.500' }],
    [{ id: 'hidden-1', description: '12 из 80 против 10 из 100', input: '12 80 10 100\n', expectedOutput: '0.050 1.500' }],
    `events1, n1, events0, n0 = map(float, input().split())
p1, p0 = events1 / n1, events0 / n0
print(f'{p1 - p0:.3f} {p1 / p0:.3f}')`,
  )),
  sourceStep(testsId, [researchSources.tripOd, researchSources.equator]),
]

const fdrId = 'research-multiple-testing'
const fdrSteps: FlowStep[] = [
  theoryStep(`${fdrId}-theory`, 'От одного теста к тысячам генов', 'Почему p<0.05 не масштабируется.', [
    section('fdr-problem', 'Семейство гипотез', [
      'Если независимо проверить 20 истинно нулевых гипотез при alpha=0.05, в среднем ожидается одна ложноположительная находка. В транскриптомике тестируются тысячи генов, поэтому необработанный список p-value почти гарантированно содержит шум.',
      'Bonferroni контролирует вероятность хотя бы одной ошибки в семействе и часто консервативен. Benjamini–Hochberg контролирует ожидаемую долю ложных открытий среди объявленных значимыми — это типичный выбор для discovery-анализа.',
    ], { callouts: [callout('Заранее задайте семейство', 'Нельзя корректно выбирать число тестов после того, как увидели выгодный результат.', 'important')] }),
  ]),
  {
    id: `${fdrId}-examples`, type: 'worked-example', title: 'Как меняется решение', summary: 'Два примера с одинаковым alpha.',
    workedExample: [
      { title: '20 клинических признаков', body: 'Bonferroni-порог 0.05/20=0.0025. p=0.01 уже не проходит строгий контроль FWER.' },
      { title: '20 000 генов', body: 'BH сортирует p-value и сравнивает p_(i) с i·q/m; значимость зависит от ранга, а не от одного фиксированного порога.' },
    ],
  },
  {
    id: `${fdrId}-code`, type: 'code', title: 'Benjamini–Hochberg в Python', summary: 'Используем проверенную реализацию.',
    codeExample: code('python', `from statsmodels.stats.multitest import multipletests

p_values = [0.0003, 0.004, 0.02, 0.4]
reject, q_values, _, _ = multipletests(p_values, alpha=0.05, method='fdr_bh')
print(reject)
print(q_values)`, undefined, 'В таблицу результатов сохраняйте и исходные p-value, и скорректированные q-value.'),
  },
  assessment(fdrId, 'Тест по множественным сравнениям: 6 вопросов', [
    numericQuestion('fdr-q1', fdrId, 'Чему равен Bonferroni-порог для 10 тестов при alpha=0.05?', 0.005, '0.05 / 10 = 0.005.', 0.0001),
    singleQuestion('fdr-q2', fdrId, 'Что контролирует BH?', ['Среднее значение признака', 'Ожидаемую долю ложных открытий среди найденных', 'Размер эффекта', 'Число пропусков'], 1, 'Это контроль FDR.'),
    trueFalseQuestion('fdr-q3', fdrId, 'Можно отобрать гены по p<0.05, а затем объявить, что множественных тестов не было.', false, 'Отбор не отменяет исходное семейство гипотез.'),
    singleQuestion('fdr-q4', fdrId, 'Что публиковать для genome-wide таблицы?', ['Только округлённые p', 'p-value, q-value и эффект', 'Только названия генов', 'Только heatmap'], 1, 'Нужны значимость, коррекция и величина эффекта.'),
    trueFalseQuestion('fdr-q5', fdrId, 'Bonferroni обычно строже BH.', true, 'Он контролирует FWER и часто даёт меньше открытий.'),
    singleQuestion('fdr-q6', fdrId, 'Когда формулируют семейство гипотез?', ['После получения результатов', 'До анализа или по заранее описанному правилу', 'После рецензии', 'Только при p>0.05'], 1, 'Это часть аналитического плана.'),
  ]),
  practiceStep(`${fdrId}-practice`, 'Практика: шаг Benjamini–Hochberg', 'Реализуйте решение без библиотечной функции.', makeStdinTask(
    'bh-count', 'Число открытий BH',
    'Первая строка: q. Вторая: p-value. Отсортируйте p и найдите максимальный ранг i, где p(i) <= i*q/m. Выведите число отклонённых гипотез.',
    `# TODO: прочитайте q и p-value
# TODO: найдите максимальный подходящий ранг`,
    [{ id: 'sample-1', description: 'Четыре теста', input: '0.05\n0.001 0.01 0.04 0.2\n', expectedOutput: '2' }],
    [{ id: 'hidden-1', description: 'Пять тестов', input: '0.1\n0.001 0.02 0.03 0.2 0.8\n', expectedOutput: '3' }],
    `q = float(input())
p_values = sorted(map(float, input().split()))
m = len(p_values)
k = 0
for i, p in enumerate(p_values, start=1):
    if p <= i * q / m:
        k = i
print(k)`,
  )),
  sourceStep(fdrId, [researchSources.deseq2, researchSources.geo]),
]

const designId = 'research-design-power'
const designSteps: FlowStep[] = [
  theoryStep(`${designId}-theory`, 'Дизайн, мощность и единица анализа', 'Статистика начинается до загрузки CSV.', [
    section('design-core', 'Что фиксирует протокол', [
      'Протокол связывает вопрос, популяцию, экспозицию или признаки, исход, временную точку и анализ. В ретроспективном исследовании он также фиксирует критерии включения, индексную дату, обработку повторных наблюдений и причины исключения.',
      'Мощность зависит от эффекта, разброса, частоты исхода, alpha и размера выборки. Пост-hoc power после теста редко добавляет смысл: полезнее показать эффект и CI, а ограничения мощности обсудить через заранее заданный минимально важный эффект.',
    ], { callouts: [callout('ASPA / Know Your Heart', 'Для цели «недиагностированный диабет» HbA1c≥6.5% формирует target; HbA1c и глюкозу нельзя одновременно оставлять предикторами.', 'example')] }),
  ]),
  {
    id: `${designId}-examples`, type: 'worked-example', title: 'Две схемы набора данных', summary: 'Один вопрос — одна ясная временная ось.',
    workedExample: [
      { title: 'Диагностическая задача', body: 'ASPA: 4542 участника 35–69 лет, исключаются известный диабет и сахароснижающие препараты; признаки должны быть доступны в момент скрининга.' },
      { title: 'Прогностическая задача', body: 'Gamma Knife: индексная дата — лечение; признаки берутся до неё, исход — последующая интракраниальная прогрессия в заданном горизонте.' },
    ],
  },
  {
    id: `${designId}-code`, type: 'code', title: 'Bootstrap для интервала эффекта', summary: 'Ресемплинг уважает единицу анализа.',
    codeExample: code('python', `import numpy as np

rng = np.random.default_rng(42)
patient_effects = np.array([0.1, 0.4, -0.2, 0.3, 0.5])
boot = [rng.choice(patient_effects, len(patient_effects), replace=True).mean()
        for _ in range(5000)]
print(np.quantile(boot, [0.025, 0.975]))`, undefined, 'Если у пациента несколько строк, ресемплируйте пациентов, а не отдельные строки.'),
  },
  assessment(designId, 'Проверка дизайна: 6 вопросов', [
    singleQuestion('dp-q1', designId, 'Что задают до расчёта мощности?', ['Минимально важный эффект', 'Цвет графика', 'Название файла', 'Результат теста'], 0, 'Мощность имеет смысл относительно конкретного эффекта.'),
    trueFalseQuestion('dp-q2', designId, 'Технические повторы можно считать независимыми пациентами.', false, 'Они не увеличивают число независимых биологических единиц.'),
    singleQuestion('dp-q3', designId, 'Что нельзя использовать как предиктор диабета, если target задан HbA1c?', ['Возраст', 'Пол', 'Сам HbA1c', 'ИМТ'], 2, 'Это прямое определение целевой переменной.'),
    singleQuestion('dp-q4', designId, 'Что является индексной датой в прогностическом исследовании после лечения?', ['Любая дата', 'Момент, относительно которого собираются признаки и отсчитывается исход', 'Дата выгрузки CSV', 'Дата публикации'], 1, 'Она определяет временную логику анализа.'),
    trueFalseQuestion('dp-q5', designId, 'Bootstrap всегда исправляет смещённую выборку.', false, 'Ресемплинг оценивает вариабельность в рамках наблюдаемой выборки, но не лечит selection bias.'),
    singleQuestion('dp-q6', designId, 'Что полезнее post-hoc power?', ['Эффект и CI', 'Ещё один p-value', 'Удаление выбросов без правила', 'Повторение теста'], 0, 'Они прямо показывают величину и неопределённость.'),
  ]),
  practiceStep(`${designId}-practice`, 'Практика: единица анализа', 'Сверните повторные измерения на уровне пациента.', makeStdinTask(
    'patient-aggregation', 'Среднее по пациентам',
    'В каждой строке patient_id и значение. Выведите среднее из пациентских средних с 2 знаками. Число строк идёт первым.',
    `# TODO: прочитайте строки
# TODO: сначала агрегируйте внутри patient_id`,
    [{ id: 'sample-1', description: 'Два пациента с разным числом измерений', input: '3\np1 10\np1 14\np2 20\n', expectedOutput: '16.00' }],
    [{ id: 'hidden-1', description: 'Три пациента', input: '5\na 2\na 4\nb 5\nc 7\nc 9\n', expectedOutput: '5.33' }],
    `n = int(input())
groups = {}
for _ in range(n):
    patient, raw = input().split()
    groups.setdefault(patient, []).append(float(raw))
means = [sum(values) / len(values) for values in groups.values()]
print(f'{sum(means) / len(means):.2f}')`,
  )),
  theoryStep(`${designId}-recap`, 'Мини-протокол на одну страницу', 'Перед анализом ответьте на семь вопросов.', [
    section('protocol-seven', 'Семь строк протокола', ['Опишите популяцию, индексную дату, единицу анализа, первичный исход, доступные к моменту прогноза признаки, основной эффект/метрику и схему оценки неопределённости. Этого уже достаточно, чтобы обнаружить большую часть противоречий до кода.'], {
      bullets: ['Кто включён и исключён?', 'Когда измерен каждый признак?', 'Как обрабатываются повторы?', 'Какой эффект считается практически важным?'],
    }),
  ]),
  sourceStep(designId, [researchSources.tripOd, researchSources.equator, researchSources.fair]),
]

export const statisticsTopics = [
  researchTopic({ id: uncertaintyId, title: '8.1 Неопределённость, интервалы и биологические повторы', order: 1, summary: 'SD, SE, доверительные интервалы и правильная единица анализа.', blockId, blockTitle, blockIcon, format: 'теория + вычислительная мини-лаборатория', estimatedMinutes: 55, quizQuestions: 5, practiceTasks: 1, examples: 3, terminology: ['генеральная совокупность', 'выборка', 'SD', 'SE', 'confidence interval'], formulas: ['mean', 'SE', '95% CI'], cheatsheet: ['SD описывает данные; SE — неопределённость оценки.', 'Биологический повтор важнее технического.'], sources: [researchSources.tripOd], steps: uncertaintySteps }),
  researchTopic({ id: testsId, title: '8.2 Статистические тесты и размеры эффекта', order: 2, summary: 'Выбор теста через дизайн, эффект и предпосылки, а не через меню функций.', blockId, blockTitle, blockIcon, format: 'разбор контрастов', estimatedMinutes: 70, quizQuestions: 7, practiceTasks: 1, examples: 4, terminology: ['нулевая гипотеза', 'p-value', 'размер эффекта', 'парный дизайн'], formulas: ['RD', 'RR', 'Cohen d'], cheatsheet: ['p-value не измеряет величину эффекта.', 'Парность и кластеризацию нельзя игнорировать.'], sources: [researchSources.tripOd, researchSources.equator], steps: testsSteps }),
  researchTopic({ id: fdrId, title: '8.3 Множественные проверки и FDR', order: 3, summary: 'Bonferroni, Benjamini–Hochberg и честный список дифференциально экспрессируемых генов.', blockId, blockTitle, blockIcon, format: 'алгоритмический практикум', estimatedMinutes: 50, quizQuestions: 6, practiceTasks: 1, examples: 3, terminology: ['FWER', 'FDR', 'q-value', 'семейство гипотез'], formulas: ['Bonferroni', 'BH threshold'], cheatsheet: ['Для omics сохраняйте p-value, q-value и эффект.', 'Семейство тестов задаётся до просмотра результата.'], sources: [researchSources.deseq2], steps: fdrSteps }),
  researchTopic({ id: designId, title: '8.4 Дизайн исследования, мощность и bootstrap', order: 4, summary: 'Протокол, временная ось, единица анализа и ресемплинг на правильном уровне.', blockId, blockTitle, blockIcon, format: 'два кейса + протокол', estimatedMinutes: 65, quizQuestions: 6, practiceTasks: 1, examples: 3, terminology: ['индексная дата', 'мощность', 'минимально важный эффект', 'bootstrap'], cheatsheet: ['Статистика начинается с протокола.', 'Ресемплируйте независимые единицы.'], sources: [researchSources.tripOd, researchSources.fair], steps: designSteps }),
]
