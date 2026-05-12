import { callout, code, functionSection, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasReadInspect = pandasTopic(
  'pandas-read-inspect',
  '3.2 Загрузка данных и первый просмотр таблицы',
  2,
  'Учимся читать CSV и быстро проверять размер, столбцы, типы и базовые статистики таблицы.',
  'Первый осмотр таблицы показывает, что лежит в данных: сколько строк, какие столбцы, какие типы и есть ли числовые статистики.',
  ['read_csv', 'head', 'tail', 'sample', 'shape', 'columns', 'dtypes', 'info', 'describe'],
  ['df.shape = (число строк, число столбцов)'],
  [
    '`pd.read_csv(path)` читает CSV-файл в DataFrame.',
    '`head()`, `tail()` и `sample()` помогают быстро увидеть строки.',
    '`shape`, `columns`, `dtypes`, `info()` и `describe()` дают первый EDA-снимок таблицы.',
  ],
  [
    theoryStep(
      'pandas-read-csv',
      '`pd.read_csv()`',
      'Читаем CSV-файл в DataFrame.',
      [
        functionSection(
          'read-csv-function',
          '`pd.read_csv()`',
          'pd.read_csv(path)',
          ['`path` - путь к CSV-файлу', '`sep` - разделитель, если это не запятая', '`encoding` - кодировка файла'],
          `
              import pandas as pd

              df = pd.read_csv("flats.csv")

              print(df.head())
          `,
          `
                 area  rooms     price district
              0    35      1   8200000  Center
              1    52      2   9100000   North
              2    80      3  18400000  Center
          `,
          '`read_csv()` прочитал CSV-файл в `DataFrame`, а `head()` показал первые строки.',
        ),
        section('first-check', 'Что проверить после чтения', [
          'После загрузки таблицу сразу осматривают: правильно ли распознаны столбцы, нет ли лишней колонки, числа не стали строками, а размер данных похож на ожидаемый.',
          'Если CSV использует `;` вместо запятой, указывают `sep=";"`. Если в файле русские заголовки и старые кодировки, может понадобиться `encoding`.',
        ]),
      ],
    ),
    theoryStep(
      'pandas-head-tail-sample',
      '`head()`, `tail()`, `sample()`',
      'Смотрим первые, последние и случайные строки.',
      [
        functionSection(
          'head-function',
          '`df.head()`',
          'df.head(n=5)',
          ['`n` - сколько первых строк показать'],
          `
            print(df.head(3))
          `,
          'Первые 3 строки таблицы.',
          '`head()` быстро показывает начало таблицы.',
        ),
        functionSection(
          'tail-function',
          '`df.tail()`',
          'df.tail(n=5)',
          ['`n` - сколько последних строк показать'],
          `
            print(df.tail(2))
          `,
          'Последние 2 строки таблицы.',
          '`tail()` помогает заметить проблемы в конце файла.',
        ),
        functionSection(
          'sample-function',
          '`df.sample()`',
          'df.sample(n, random_state=None)',
          ['`n` - сколько случайных строк взять', '`random_state` - фиксирует случайность для повторяемого результата'],
          `
            print(df.sample(2, random_state=42))
          `,
          'Две случайные строки таблицы.',
          '`sample()` даёт взгляд на разные части таблицы, а не только на начало.',
        ),
        section('rows-preview', 'Как читать первые строки', [
          '`head()`, `tail()` и `sample()` отвечают на один вопрос с разных сторон: как выглядят реальные строки таблицы. Это помогает заметить неверный разделитель, лишнюю колонку, странные значения или неожиданный порядок данных.',
          'До очистки данных полезно увидеть не только начало файла. `tail()` ловит проблемы в конце выгрузки, а `sample()` снижает риск судить о всей таблице только по первым строкам.',
        ], {
          codeExamples: [
            code('python', `
              print(df.head(3))
              print(df.tail(2))
              print(df.sample(2, random_state=42))
            `, 'Фрагменты строк из начала, конца и случайной части таблицы.', 'Параметр `random_state` фиксирует случайный выбор, чтобы пример повторялся.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-shape-columns-dtypes',
      '`shape`, `columns`, `dtypes`',
      'Проверяем размер таблицы, названия столбцов и типы.',
      [
        functionSection(
          'shape-attribute',
          '`df.shape`',
          'df.shape',
          ['`df` - таблица pandas'],
          `
            print(df.shape)
          `,
          '(3, 4)',
          '`shape` показывает: 3 строки и 4 столбца.',
        ),
        functionSection(
          'columns-attribute',
          '`df.columns`',
          'df.columns',
          ['`df` - таблица pandas'],
          `
            print(list(df.columns))
          `,
          "['area', 'rooms', 'price', 'district']",
          '`columns` возвращает названия столбцов.',
        ),
        functionSection(
          'dtypes-attribute',
          '`df.dtypes`',
          'df.dtypes',
          ['`df` - таблица pandas'],
          `
            print(df.dtypes)
          `,
          `
            area         int64
            rooms        int64
            price        int64
            district    object
            dtype: object
          `,
          '`dtypes` показывает тип данных каждого столбца.',
        ),
        section('attributes', 'Размер, имена и типы', [
          '`shape`, `columns` и `dtypes` помогают понять структуру таблицы без просмотра всех строк. Это атрибуты, поэтому скобки не ставятся.',
          'Если числовой столбец стал `object`, его нужно проверить до обучения модели: возможно, в данных есть пробелы, текстовые значения или неправильный десятичный разделитель.',
        ], {
          codeExamples: [
            code('python', `
              print(df.shape)
              print(list(df.columns))
              print(df.dtypes)
            `, `
              (3, 4)
              ['area', 'rooms', 'price', 'district']
              area         int64
              rooms        int64
              price        int64
              district    object
              dtype: object
            `, 'Размер, имена колонок и типы помогают быстро найти ошибки чтения данных.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-info-describe',
      '`info()` и `describe()`',
      'Смотрим непустые значения и статистики числовых столбцов.',
      [
        functionSection(
          'info-function',
          '`df.info()`',
          'df.info()',
          ['параметры обычно не нужны для первого осмотра'],
          `
            df.info()
          `,
          'Краткий отчёт: число строк, столбцы, non-null count и dtype.',
          '`info()` быстро показывает типы и количество непустых значений.',
        ),
        functionSection(
          'describe-function',
          '`df.describe()`',
          'df.describe()',
          ['`include` - какие типы столбцов включить; по умолчанию берутся числовые'],
          `
            print(df.describe())
          `,
          'Таблица со статистиками `count`, `mean`, `std`, `min`, квартилями и `max`.',
          '`describe()` возвращает числовую сводку по столбцам.',
        ),
        section('eda-summary', 'Краткая сводка таблицы', [
          '`info()` и `describe()` часто запускают рядом. Первый отвечает на вопрос “что за столбцы и сколько непустых значений”, второй - “какие диапазоны и средние у числовых признаков”.',
          'В ML это быстрый способ найти пропуски, выбросы и странные масштабы признаков до обучения модели.',
        ], {
          callouts: [
            callout('Важно', '`describe()` не заменяет анализ данных, но быстро показывает диапазоны и средние значения числовых признаков.', 'remember'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-read-quiz-method',
      'Какой метод выбрать',
      'Выбираем инструмент первого осмотра.',
      singleQuiz(
        'quiz-pandas-inspect-method',
        'Первый осмотр',
        'pandas-read-inspect',
        'pandas-eda',
        'Что лучше использовать, чтобы быстро увидеть первые строки таблицы?',
        [
          { id: 'a', text: '`df.head()`' },
          { id: 'b', text: '`df.dtypes`' },
          { id: 'c', text: '`df.shape`' },
          { id: 'd', text: '`df.columns`' },
        ],
        'a',
        '`head()` показывает первые строки, поэтому подходит для быстрой визуальной проверки таблицы после загрузки.',
      ),
    ),
    quizStep(
      'pandas-read-quiz-describe',
      'Что показывает describe',
      'Проверяем смысл статистической сводки.',
      singleQuiz(
        'quiz-pandas-describe',
        'describe',
        'pandas-read-inspect',
        'pandas-eda',
        'Что обычно показывает `df.describe()` для числовых столбцов?',
        [
          { id: 'a', text: 'Только названия колонок' },
          { id: 'b', text: 'Статистики вроде count, mean, min и max' },
          { id: 'c', text: 'Только последние строки таблицы' },
          { id: 'd', text: 'Список файлов в папке' },
        ],
        'b',
        '`describe()` возвращает статистическую сводку числовых признаков: количество значений, среднее, разброс, минимум, квартильные точки и максимум.',
      ),
    ),
    practiceStep(
      'pandas-read-practice',
      'Первый осмотр таблицы',
      'Читаем CSV из входных данных и выводим базовую сводку.',
      makeStdinTask(
        'task-pandas-read-inspect',
        'Первый осмотр таблицы',
        'На вход подаётся CSV-таблица. Прочитайте её, выведите первые строки, размер таблицы, названия столбцов и среднее значение первого числового столбца через `describe()`.',
        `
          import pandas as pd
          import sys
          from io import StringIO

          csv_text = sys.stdin.read()

          # TODO: прочитайте CSV

          # TODO: выведите первые строки

          # TODO: выведите размер таблицы

          # TODO: выведите названия столбцов

          # TODO: посчитайте describe и выведите среднее первого числового столбца
        `,
        [
          {
            id: 's1',
            description: 'Таблица студентов',
            input: 'name,age,score\nAnna,20,82\nBoris,30,90\nMira,25,88',
            expectedOutput: ' name  age  score\n Anna   20     82\nBoris   30     90\n Mira   25     88\n(3, 3)\n[\'name\', \'age\', \'score\']\n25.0',
          },
        ],
        [
          {
            id: 'h1',
            description: 'Таблица квартир',
            input: 'city,area,price\nMoscow,35,8\nKazan,52,9\nPerm,80,18',
            expectedOutput: '  city  area  price\nMoscow    35      8\n Kazan    52      9\n  Perm    80     18\n(3, 3)\n[\'city\', \'area\', \'price\']\n55.7',
          },
        ],
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))
          print(df.head().to_string(index=False))
          print(df.shape)
          print(list(df.columns))

          stats = df.describe()
          first_numeric_col = df.select_dtypes("number").columns[0]
          print(round(stats.loc["mean", first_numeric_col], 1))
        `,
      ),
    ),
  ],
)
