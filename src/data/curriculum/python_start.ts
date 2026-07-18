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

const blockId = 'python-start'
const blockTitle = 'Python-минимум перед анализом данных'
const blockIcon = '00'

const syntaxId = 'python-syntax-types'
const syntaxSteps: FlowStep[] = [
  theoryStep(`${syntaxId}-theory`, 'Переменные, типы и выражения', 'Ровно тот Python, который нужен до NumPy.', [
    section('syntax-core', 'Как Python выполняет программу', [
      'Интерпретатор выполняет инструкции сверху вниз. Переменная связывает имя со значением, а тип принадлежит значению: int хранит целое, float — число с плавающей точкой, str — текст, bool — True/False, None обозначает отсутствие значения.',
      'input() всегда возвращает str, поэтому числовой ввод явно преобразуют через int() или float(). print() выводит результат. Отступы являются частью синтаксиса и объединяют инструкции в блоки.',
    ], {
      table: { headers: ['Тип', 'Пример', 'Типичная операция'], rows: [
        ['int / float', '42 / 3.14', '+ - * / **'],
        ['str', '"BRCA1"', 'strip, lower, split'],
        ['bool', 'age >= 18', 'and, or, not'],
        ['None', 'missing target', 'is None'],
      ] },
      callouts: [callout('Для биоданных', 'Строка "12,5" не станет float автоматически: сначала согласуйте десятичный разделитель и только затем преобразуйте.', 'example')],
    }),
  ]),
  {
    id: `${syntaxId}-examples`, type: 'worked-example', title: 'Два коротких вычисления', summary: 'От ввода к проверяемому выводу.',
    workedExample: [
      { title: 'Интервал дат', body: 'days = int(input()) превращает текстовый ввод в целое число, после чего можно проверить 0 <= days <= 5000.' },
      { title: 'Имя гена', body: 'gene = input().strip().upper() нормализует пробелы и регистр, но не исправляет синонимы идентификатора.' },
    ],
  },
  {
    id: `${syntaxId}-code`, type: 'code', title: 'Мини-программа с типами', summary: 'Явное преобразование делает ошибку видимой.',
    codeExample: code('python', `gene = input().strip().upper()
expression = float(input().replace(',', '.'))
is_high = expression >= 10
print(gene, expression, is_high)`, undefined, 'Каждое преобразование связано с правилом формата входных данных.'),
  },
  assessment(syntaxId, 'Python-старт: 5 вопросов', [
    singleQuestion('py0-q1', syntaxId, 'Какой тип возвращает input()?', ['str', 'int', 'float', 'bool'], 0, 'Преобразование выполняется явно.'),
    numericQuestion('py0-q2', syntaxId, 'Чему равно 2 ** 3?', 8, 'Оператор ** — степень.', 0),
    trueFalseQuestion('py0-q3', syntaxId, 'В Python отступы влияют на структуру программы.', true, 'Они задают блоки if, for, def и других конструкций.'),
    singleQuestion('py0-q4', syntaxId, 'Как корректно проверить отсутствие значения?', ['x = None', 'x is None', 'x == "None" всегда', 'bool(None) is True'], 1, 'Для singleton None используют is None.'),
    singleQuestion('py0-q5', syntaxId, 'Что делает str.strip()?', ['Удаляет пробелы по краям', 'Переводит в int', 'Сортирует символы', 'Удаляет все буквы'], 0, 'Это базовая нормализация текстового ввода.'),
  ]),
  practiceStep(`${syntaxId}-practice`, 'Практика: нормализация числа', 'Обработайте десятичную запятую и порог.', makeStdinTask(
    'python-normalize-number', 'Число и категория',
    'Дана строка с числом, возможна запятая. Выведите значение с 2 знаками и HIGH, если оно >=10, иначе LOW.',
    `# TODO: прочитайте строку
# TODO: замените разделитель и преобразуйте`,
    [{ id: 'sample-1', description: 'Десятичная запятая', input: '12,5\n', expectedOutput: '12.50 HIGH' }],
    [{ id: 'hidden-1', description: 'Значение ниже порога', input: '9.75\n', expectedOutput: '9.75 LOW' }],
    `value = float(input().strip().replace(',', '.'))
label = 'HIGH' if value >= 10 else 'LOW'
print(f'{value:.2f} {label}')`,
  )),
  sourceStep(syntaxId, [researchSources.python]),
]

const collectionsId = 'python-collections-loops'
const collectionsSteps: FlowStep[] = [
  theoryStep(`${collectionsId}-theory`, 'Списки, словари, циклы и comprehensions', 'Как хранить последовательности и счётчики.', [
    section('collections-core', 'Выберите структуру по операции', [
      'list сохраняет порядок и допускает повторы; tuple обычно обозначает фиксированную запись; set быстро проверяет принадлежность и хранит уникальные значения; dict связывает ключ и значение. Индексация начинается с нуля, а slice [start:stop] не включает stop.',
      'for перебирает элементы напрямую. enumerate добавляет индекс, zip соединяет синхронные последовательности. List/dict comprehension удобны для короткого преобразования, но сложную проверку лучше оформить обычным циклом с ясными именами.',
    ], {
      table: { headers: ['Задача', 'Структура'], rows: [
        ['сохранить порядок измерений', 'list'],
        ['быстро искать forbidden columns', 'set'],
        ['считать sample по case_id', 'dict'],
        ['пара координат', 'tuple'],
      ] },
    }),
  ]),
  {
    id: `${collectionsId}-examples`, type: 'worked-example', title: 'Три паттерна анализа', summary: 'Они повторяются во всём курсе.',
    workedExample: [
      { title: 'Фильтрация', body: 'clean = [x for x in values if x is not None] оставляет известные значения.' },
      { title: 'Частоты', body: 'counts[label] = counts.get(label, 0) + 1 обновляет счётчик категории.' },
      { title: 'Параллельные данные', body: 'for y_i, p_i in zip(y, prob) связывает outcome и probability одной строки.' },
    ],
  },
  {
    id: `${collectionsId}-code`, type: 'code', title: 'Сводка категорий', summary: 'dict и sorted дают детерминированный вывод.',
    codeExample: code('python', `diagnoses = ['lung', 'breast', 'lung', 'melanoma']
counts = {}
for diagnosis in diagnoses:
    counts[diagnosis] = counts.get(diagnosis, 0) + 1

for diagnosis in sorted(counts):
    print(diagnosis, counts[diagnosis])`, undefined, 'Сортировка делает таблицу стабильной между запусками.'),
  },
  assessment(collectionsId, 'Коллекции: 6 вопросов', [
    singleQuestion('pcl-q1', collectionsId, 'Какая структура быстро проверяет membership уникальных ID?', ['set', 'str', 'float', 'None'], 0, 'Set предназначен для уникальности и membership.'),
    numericQuestion('pcl-q2', collectionsId, 'Сколько элементов в [10, 20, 30][0:2]?', 2, 'Stop=2 не включается.', 0),
    trueFalseQuestion('pcl-q3', collectionsId, 'dict сохраняет связь ключ→значение.', true, 'Это его основное назначение.'),
    singleQuestion('pcl-q4', collectionsId, 'Что делает zip(a, b)?', ['Соединяет элементы попарно', 'Архивирует файл', 'Удаляет дубликаты', 'Сортирует a'], 0, 'Итерация заканчивается на более короткой последовательности.'),
    singleQuestion('pcl-q5', collectionsId, 'Как получить индекс и значение?', ['enumerate(values)', 'float(values)', 'set(values)[0]', 'values.keys()'], 0, 'enumerate возвращает пары index, value.'),
    trueFalseQuestion('pcl-q6', collectionsId, 'Сложный многоуровневый comprehension всегда читаемее обычного цикла.', false, 'Ясность важнее краткости.'),
  ]),
  practiceStep(`${collectionsId}-practice-counts`, 'Практика 1: частоты генов', 'Постройте стабильный словарь частот.', makeStdinTask(
    'python-frequency-table', 'Частоты по алфавиту',
    'Даны названия генов через пробел. Выведите gene:count по алфавиту в одну строку.',
    `# TODO: посчитайте элементы
# TODO: выведите ключи детерминированно`,
    [{ id: 'sample-1', description: 'Повторы', input: 'TP53 BRCA1 TP53 EGFR\n', expectedOutput: 'BRCA1:1 EGFR:1 TP53:2' }],
    [{ id: 'hidden-1', description: 'Один ген', input: 'KRAS\n', expectedOutput: 'KRAS:1' }],
    `counts = {}
for gene in input().split():
    counts[gene] = counts.get(gene, 0) + 1
print(' '.join(f'{gene}:{counts[gene]}' for gene in sorted(counts)))`,
  )),
  practiceStep(`${collectionsId}-practice-filter`, 'Практика 2: фильтрация пропусков', 'Оставьте только известные числа.', makeStdinTask(
    'python-filter-missing', 'Среднее без NA',
    'Даны токены: числа или NA. Выведите число известных значений и их среднее с 2 знаками.',
    `# TODO: отфильтруйте NA
# TODO: преобразуйте остальные токены`,
    [{ id: 'sample-1', description: 'Два пропуска', input: '1 NA 3 NA 6\n', expectedOutput: '3 3.33' }],
    [{ id: 'hidden-1', description: 'Без пропусков', input: '2 4\n', expectedOutput: '2 3.00' }],
    `values = [float(token) for token in input().split() if token != 'NA']
print(len(values), f'{sum(values) / len(values):.2f}')`,
  )),
  sourceStep(collectionsId, [researchSources.python]),
]

const functionsId = 'python-functions-errors'
const functionsSteps: FlowStep[] = [
  theoryStep(`${functionsId}-theory`, 'Условия, функции и ошибки', 'Повторяемое правило оформляется как функция.', [
    section('functions-core', 'Контракт функции', [
      'if/elif/else выбирает ветвь по условию. Функция def получает параметры, выполняет один понятный шаг и возвращает значение через return. Хорошее имя, docstring и небольшой набор примеров делают правило проверяемым.',
      'Исключение сообщает, что контракт нарушен. Не перехватывайте все ошибки пустым except: это скрывает повреждённые данные. Лучше проверить допустимый диапазон и выбросить ValueError с конкретным сообщением.',
    ], {
      callouts: [callout('Правило курса', 'Логика target, дат и исключений должна жить в функциях с тестами, а не в цепочке ручных действий в notebook.', 'remember')],
    }),
  ]),
  {
    id: `${functionsId}-examples`, type: 'worked-example', title: 'Три функции проекта', summary: 'Каждая решает одну задачу.',
    workedExample: [
      { title: 'parse_decimal', body: 'Преобразует строку с запятой/точкой или возвращает явную ошибку.' },
      { title: 'map_target', body: 'Сопоставляет только известные категории, остальные помечает missing.' },
      { title: 'validate_interval', body: 'Проверяет 0≤days≤5000 и не изменяет значение молча.' },
    ],
  },
  {
    id: `${functionsId}-code`, type: 'code', title: 'Функция с контрактом', summary: 'Явное правило и конкретная ошибка.',
    codeExample: code('python', `def validate_interval(days: int, maximum: int = 5000) -> int:
    """Return days when the clinical interval is plausible."""
    if not 0 <= days <= maximum:
        raise ValueError(f'interval outside 0..{maximum}: {days}')
    return days

assert validate_interval(120) == 120`, undefined, 'Type hints помогают чтению, но runtime-проверку выполняет условие.'),
  },
  theoryStep(`${functionsId}-pitfalls`, 'Ошибки, которые нельзя скрывать', 'except должен быть узким.', [
    section('error-pitfalls', 'Три антипаттерна', ['bare except с pass превращает ошибку в тихий пропуск; изменяемый default вроде items=[] сохраняется между вызовами; функция с печатью вместо return плохо комбинируется и тестируется.'], {
      bullets: ['Ловите конкретный ValueError.', 'Для изменяемого default используйте None.', 'Возвращайте данные, печатайте только на границе CLI.'],
    }),
  ]),
  assessment(functionsId, 'Функции и ошибки: 6 вопросов', [
    singleQuestion('pfn-q1', functionsId, 'Что делает return?', ['Возвращает значение и завершает функцию', 'Печатает автоматически', 'Импортирует модуль', 'Создаёт цикл'], 0, 'Результат можно сохранить и тестировать.'),
    trueFalseQuestion('pfn-q2', functionsId, 'Type hint сам запрещает передать строку во время выполнения обычного Python.', false, 'Hints проверяются инструментами, но не являются runtime-guard по умолчанию.'),
    singleQuestion('pfn-q3', functionsId, 'Как сообщить о недопустимом значении?', ['raise ValueError(...)', 'pass', 'print и продолжить всегда', 'Удалить строку молча'], 0, 'Ошибка делает нарушение контракта видимым.'),
    singleQuestion('pfn-q4', functionsId, 'Почему bare except: pass опасен?', ['Скрывает причины повреждения анализа', 'Ускоряет код', 'Меняет float в int', 'Строит тесты'], 0, 'Pipeline продолжает работу с неполными данными.'),
    trueFalseQuestion('pfn-q5', functionsId, 'Логику target полезно покрыть отдельными тестами.', true, 'Она определяет весь вывод исследования.'),
    singleQuestion('pfn-q6', functionsId, 'Что использовать вместо изменяемого default list?', ['None и создать list внутри', 'Глобальную переменную', 'Строку "[]"', 'bare except'], 0, 'Так вызовы не делят одно состояние.'),
  ]),
  practiceStep(`${functionsId}-practice`, 'Практика: проверка интервала', 'Реализуйте функцию как правило данных.', makeStdinTask(
    'python-validate-interval', 'Статус клинического интервала',
    'Дано целое days. Выведите VALID, если 0<=days<=5000, иначе INVALID.',
    `# TODO: прочитайте days
# TODO: оформите проверку отдельной функцией`,
    [{ id: 'sample-1', description: 'Допустимый интервал', input: '120\n', expectedOutput: 'VALID' }],
    [{ id: 'hidden-1', description: 'Отрицательное значение', input: '-3\n', expectedOutput: 'INVALID' }, { id: 'hidden-2', description: 'Слишком большое значение', input: '5001\n', expectedOutput: 'INVALID' }],
    `def interval_status(days):
    return 'VALID' if 0 <= days <= 5000 else 'INVALID'

days = int(input())
print(interval_status(days))`,
  )),
  sourceStep(functionsId, [researchSources.python]),
]

const filesId = 'python-files-environment'
const filesSteps: FlowStep[] = [
  theoryStep(`${filesId}-theory`, 'Файлы, модули и окружение', 'Как превратить скрипт в воспроизводимый проект.', [
    section('files-project', 'Границы программы', [
      'pathlib.Path безопасно собирает пути, with open(...) закрывает файл даже при ошибке, а csv/json модули сохраняют структуру лучше ручного split. Код распределяют по модулям: функции живут в src, запуск — в коротком main/CLI, tests проверяют правила.',
      'Виртуальное окружение изолирует зависимости. Файл requirements/lock и версия Python позволяют повторить среду. Секреты и персональные данные не помещают в код; пути и параметры передают через config или аргументы запуска.',
    ], {
      table: { headers: ['Артефакт', 'Назначение'], rows: [
        ['README', 'команды от установки до результата'],
        ['requirements/lock', 'точные зависимости'],
        ['src/', 'переиспользуемые функции'],
        ['tests/', 'проверка правил и крайних случаев'],
      ] },
    }),
  ]),
  {
    id: `${filesId}-examples`, type: 'worked-example', title: 'Два безопасных ввода', summary: 'Парсер соответствует формату.',
    workedExample: [
      { title: 'CSV', body: 'csv.DictReader или pandas.read_csv учитывает заголовок и quoting; ручной split(",") ломается на запятых внутри поля.' },
      { title: 'JSON config', body: 'json.load возвращает dict и позволяет хранить threshold, список признаков и seed отдельно от кода.' },
    ],
  },
  {
    id: `${filesId}-code`, type: 'code', title: 'Pathlib и JSON', summary: 'Путь и encoding заданы явно.',
    codeExample: code('python', `from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
config_path = root / 'configs' / 'baseline.json'
with config_path.open(encoding='utf-8') as stream:
    config = json.load(stream)
print(config['random_seed'])`, undefined, 'Код не зависит от текущей директории терминала.'),
  },
  assessment(filesId, 'Файлы и окружение: 5 вопросов', [
    singleQuestion('pfi-q1', filesId, 'Зачем with open(...) as stream?', ['Гарантированно закрыть файл', 'Обучить модель', 'Создать GPU', 'Посчитать FDR'], 0, 'Context manager закрывает ресурс.'),
    trueFalseQuestion('pfi-q2', filesId, 'Ручной split(",") надёжно читает любой CSV.', false, 'CSV допускает quoted fields и запятые внутри значения.'),
    singleQuestion('pfi-q3', filesId, 'Что фиксирует lock/requirements?', ['Зависимости окружения', 'Клинический target', 'PDB coordinates', 'Цвет темы'], 0, 'Версии пакетов влияют на воспроизводимость.'),
    singleQuestion('pfi-q4', filesId, 'Где хранить правила анализа?', ['В versioned config', 'Только в памяти', 'В персональном токене', 'В случайном имени файла'], 0, 'Config делает решения явными.'),
    trueFalseQuestion('pfi-q5', filesId, 'Секретный API token можно безопасно закоммитить в учебный репозиторий.', false, 'Секреты передаются через защищённое окружение и не попадают в VCS.'),
  ]),
  practiceStep(`${filesId}-practice`, 'Практика: разбор простого config', 'Прочитайте пары key=value.', makeStdinTask(
    'python-config-parser', 'Детерминированный config',
    'Даны пары key=value через пробел. Выведите их по алфавиту ключей в формате key:value.',
    `# TODO: разберите пары по первому =
# TODO: отсортируйте ключи`,
    [{ id: 'sample-1', description: 'Три параметра', input: 'seed=42 metric=ba model=logreg\n', expectedOutput: 'metric:ba model:logreg seed:42' }],
    [{ id: 'hidden-1', description: 'Одно значение', input: 'build=hg38\n', expectedOutput: 'build:hg38' }],
    `config = dict(item.split('=', 1) for item in input().split())
print(' '.join(f'{key}:{config[key]}' for key in sorted(config)))`,
  )),
  theoryStep(`${filesId}-recap`, 'Готовность к NumPy', 'Четыре навыка перед следующим модулем.', [
    section('python-ready', 'Вы готовы, если можете', ['Преобразовать input в нужный тип; отфильтровать list и посчитать dict; оформить правило как функцию с ошибкой; прочитать config/file через стандартный parser. Дальше NumPy заменит ручные циклы над числами векторными операциями.'], {
      bullets: ['Не бойтесь traceback: читайте последнюю строку и место ошибки.', 'Проверяйте маленький пример до полного dataset.', 'Сохраняйте код, который породил результат.'],
    }),
  ]),
  sourceStep(filesId, [researchSources.python]),
]

export const pythonStartTopics = [
  researchTopic({ id: syntaxId, title: '0.1 Синтаксис, переменные и типы', order: 1, summary: 'input/print, int/float/str/bool/None, выражения, сравнения и явные преобразования.', blockId, blockTitle, blockIcon, format: 'нулевой старт + мини-задача', estimatedMinutes: 45, quizQuestions: 5, practiceTasks: 1, examples: 3, terminology: ['variable', 'type', 'expression', 'input', 'None'], cheatsheet: ['input возвращает str.', 'Преобразование формата выполняется явно.'], sources: [researchSources.python], steps: syntaxSteps }),
  researchTopic({ id: collectionsId, title: '0.2 Коллекции, циклы и comprehensions', order: 2, summary: 'list/tuple/set/dict, индексация, for, enumerate, zip и два практических паттерна.', blockId, blockTitle, blockIcon, format: 'паттерны данных + 2 практики', estimatedMinutes: 65, quizQuestions: 6, practiceTasks: 2, examples: 4, terminology: ['list', 'tuple', 'set', 'dict', 'loop', 'comprehension'], cheatsheet: ['Set — membership, dict — ключ→значение.', 'Сложный цикл лучше короткого, но непрозрачного comprehension.'], sources: [researchSources.python], steps: collectionsSteps }),
  researchTopic({ id: functionsId, title: '0.3 Условия, функции и обработка ошибок', order: 3, summary: 'if/elif/else, def/return, docstring, type hints, ValueError и тестируемые правила.', blockId, blockTitle, blockIcon, format: 'контракты функций + аудит ошибок', estimatedMinutes: 60, quizQuestions: 6, practiceTasks: 1, examples: 4, terminology: ['condition', 'function', 'return', 'exception', 'contract'], cheatsheet: ['Функция возвращает данные, а не скрывает ошибку.', 'Логику target покрывают тестами.'], sources: [researchSources.python], steps: functionsSteps }),
  researchTopic({ id: filesId, title: '0.4 Файлы, модули и воспроизводимое окружение', order: 4, summary: 'pathlib, with/open, CSV/JSON, структура проекта, зависимости и безопасные configs.', blockId, blockTitle, blockIcon, format: 'мини-проект перед NumPy', estimatedMinutes: 55, quizQuestions: 5, practiceTasks: 1, examples: 3, terminology: ['pathlib', 'context manager', 'module', 'virtual environment', 'config'], cheatsheet: ['Формат читает стандартный parser.', 'Зависимости и команды фиксируются в README/lock.'], sources: [researchSources.python], steps: filesSteps }),
]
