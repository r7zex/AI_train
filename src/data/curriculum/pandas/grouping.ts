import { code, functionSection, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasGroupby = pandasTopic(
  'pandas-groupby',
  '3.6 Группировки и агрегирование',
  6,
  'Считаем частоты категорий, группируем строки и получаем агрегированные статистики.',
  'Группировки превращают сырую таблицу в сводки: сколько объектов в категории, как меняется среднее и где находятся экстремальные значения.',
  ['value_counts', 'groupby', 'agg', 'pivot_table', 'aggregation'],
  ['df.groupby("group_col")["value_col"].mean()', 'df.groupby("group_col").agg({...})'],
  [
    '`value_counts()` считает частоты значений в одном столбце.',
    '`groupby()` делит строки на группы и применяет агрегирующую функцию.',
    '`agg()` позволяет посчитать несколько статистик сразу.',
  ],
  [
    theoryStep(
      'pandas-value-counts',
      '`value_counts()`',
      'Считаем, сколько раз встречается каждое значение.',
      [
        functionSection(
          'value-counts-function',
          '`value_counts()`',
          'df["col"].value_counts()',
          ['`normalize=True` - вернуть доли вместо количества', '`dropna=False` - учитывать пропуски'],
          `
            print(df["district"].value_counts())
          `,
          `
            Center    2
            North     1
            Name: count, dtype: int64
          `,
          '`value_counts()` считает, сколько раз встречается каждое значение.',
        ),
        section('counts', 'Частоты категорий', [
          '`value_counts()` быстро показывает распределение категориального столбца: сколько объектов в каждом районе, классе, городе или типе товара.',
          'В ML частоты показывают дисбаланс категорий. Если один класс встречается редко, модель может плохо его предсказывать, а метрики нужно выбирать осторожнее.',
        ], {
          codeExamples: [
            code('python', `
              print(df["district"].value_counts())
            `, `
              Center    2
              North     1
              Name: count, dtype: int64
            `, '`value_counts()` показывает количество строк для каждой категории.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-groupby-mean',
      '`groupby()`',
      'Группируем строки по категории и считаем статистику.',
      [
        functionSection(
          'groupby-mean-function',
          '`groupby().mean()`',
          'df.groupby("group_col")["value_col"].mean()',
          ['`group_col` - столбец группировки', '`value_col` - числовой столбец для агрегации'],
          `
            print(df.groupby("district")["price"].mean())
          `,
          `
            district
            Center    13300000.0
            North      9100000.0
            Name: price, dtype: float64
          `,
          '`groupby()` разбил строки по району, а `mean()` посчитал среднюю цену внутри каждой группы.',
        ),
        section('groupby', 'Разделить, посчитать, собрать', [
          '`groupby()` нужен, чтобы сравнить группы между собой: среднюю цену квартир по району, средний чек по типу клиента, долю ошибок по сегменту.',
          'Сначала pandas разбивает строки по `group_col`, затем берёт нужный столбец и считает агрегат внутри каждой группы. Индексом результата становятся названия групп.',
        ], {
          codeExamples: [
            code('python', `
              print(df.groupby("district")["price"].mean())
            `, `
              district
              Center    13300000.0
              North      9100000.0
              Name: price, dtype: float64
            `, 'Средняя цена посчитана отдельно внутри каждого района.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-agg',
      '`agg()`',
      'Считаем несколько статистик за один проход.',
      [
        functionSection(
          'agg-function',
          '`agg()`',
          'df.groupby("group_col").agg({...})',
          ['в словаре указывают столбец и одну функцию или список функций'],
          `
            stats = df.groupby("district").agg({
                "price": ["mean", "median", "max"],
                "area": "mean",
            })

            print(stats)
          `,
          'Сводная таблица с несколькими статистиками по районам.',
          '`agg()` считает несколько агрегатов в одном выражении.',
        ),
        section('agg', 'Несколько агрегатов', [
          '`agg()` даёт компактную EDA-сводку по группам. Вместо отдельных вызовов `mean()`, `median()` и `max()` можно описать нужные статистики в одном месте.',
          'Агрегаты помогают искать закономерности, выбросы и различия между сегментами. Иногда групповые статистики становятся новыми признаками, если они рассчитаны без утечки данных.',
        ], {
          codeExamples: [
            code('python', `
              stats = df.groupby("district").agg({
                  "price": ["mean", "median", "max"],
                  "area": "mean",
              })

              print(stats)
            `, 'Сводная таблица с несколькими статистиками по районам.', '`agg()` удобно расширять: добавлять новые столбцы и функции без переписывания всей логики.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-pivot-table',
      'Сводные таблицы через `pivot_table()`',
      '`pivot_table()` строит таблицу агрегатов в привычной форме.',
      [
        functionSection(
          'pivot-table-function',
          '`pivot_table()`',
          'df.pivot_table(index=..., values=..., aggfunc=...)',
          ['`index` - группы в строках', '`values` - столбец со значениями', '`aggfunc` - функция агрегации'],
          `
            table = df.pivot_table(index="district", values="price", aggfunc="mean")
            print(table)
          `,
          'Средняя цена по каждому району в виде `DataFrame`.',
          '`pivot_table()` строит сводную таблицу агрегатов.',
        ),
        section('pivot', 'Сводная таблица', [
          '`pivot_table()` показывает агрегированные значения в формате строк и столбцов. Это похоже на сводные таблицы в Excel.',
          'Для первичного анализа `groupby()` часто проще, но `pivot_table()` удобен, когда нужно сравнивать сразу несколько разрезов данных.',
        ], {
          codeExamples: [
            code('python', `
              table = df.pivot_table(index="district", values="price", aggfunc="mean")
              print(table)
            `, 'Средняя цена по каждому району в виде DataFrame.', '`pivot_table()` особенно полезен для отчётов и проверки гипотез по категориям.'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-groupby-quiz-counts',
      'value_counts или groupby',
      'Выбираем инструмент для частот.',
      singleQuiz(
        'quiz-pandas-value-counts',
        'Частоты категорий',
        'pandas-groupby',
        'pandas-eda',
        'Что удобнее всего использовать, чтобы посчитать количество строк по значениям одного столбца?',
        [
          { id: 'a', text: '`df["col"].value_counts()`' },
          { id: 'b', text: '`df.head()`' },
          { id: 'c', text: '`df.dropna()`' },
          { id: 'd', text: '`pd.read_csv()`' },
        ],
        'a',
        '`value_counts()` специально считает частоты значений в одном столбце.',
      ),
    ),
    quizStep(
      'pandas-groupby-quiz-meaning',
      'Что вернёт groupby',
      'Проверяем идею группировки.',
      singleQuiz(
        'quiz-pandas-groupby-mean',
        'groupby',
        'pandas-groupby',
        'pandas-eda',
        'Что делает выражение `df.groupby("district")["price"].mean()`?',
        [
          { id: 'a', text: 'Считает среднюю цену отдельно для каждого района' },
          { id: 'b', text: 'Удаляет столбец `district`' },
          { id: 'c', text: 'Выводит первые строки таблицы' },
          { id: 'd', text: 'Заполняет пропуски в цене' },
        ],
        'a',
        '`groupby("district")` разбивает строки по району, а `["price"].mean()` считает среднюю цену внутри каждой группы.',
      ),
    ),
    practiceStep(
      'pandas-groupby-practice',
      'Посчитать среднюю цену по району',
      'Считаем количество квартир, среднюю цену и максимальную площадь.',
      makeStdinTask(
        'task-pandas-groupby-district',
        'Посчитать статистики по району',
        'На вход подаётся CSV с колонками `district`, `area`, `price`. Выведите количество объектов по району, среднюю цену по району и максимальную площадь по району.',
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))

          # TODO: посчитайте количество объектов по району

          # TODO: посчитайте среднюю цену по району

          # TODO: посчитайте максимальную площадь по району

          # TODO: выведите результаты
        `,
        [
          {
            id: 's1',
            description: 'Два района',
            input: 'district,area,price\nCenter,35,8\nNorth,52,9\nCenter,80,18',
            expectedOutput: 'district\nCenter    2\nNorth     1\ndistrict\nCenter    13.0\nNorth      9.0\ndistrict\nCenter    80\nNorth     52',
          },
        ],
        [
          {
            id: 'h1',
            description: 'Три района',
            input: 'district,area,price\nA,40,10\nB,60,12\nA,80,18\nC,55,11',
            expectedOutput: 'district\nA    2\nB    1\nC    1\ndistrict\nA    14.0\nB    12.0\nC    11.0\ndistrict\nA    80\nB    60\nC    55',
          },
        ],
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))
          counts = df["district"].value_counts().sort_index()
          mean_price = df.groupby("district")["price"].mean().round(1)
          max_area = df.groupby("district")["area"].max()

          print(counts.to_string())
          print(mean_price.to_string())
          print(max_area.to_string())
        `,
      ),
    ),
  ],
)
