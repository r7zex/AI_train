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
      'pandas-grouping-scenario',
      'Сравнение групп',
      'Группировки отвечают на вопросы про сегменты данных.',
      [
        section('scenario', 'Зачем группировать строки', [
          'Группировки нужны, чтобы сравнивать группы: средняя цена по району, количество клиентов по городу, средний чек по категории, доля редких классов в target.',
          'Без группировки таблица показывает отдельные строки. С группировкой появляется сводка, по которой видно, какие сегменты отличаются и где искать аномалии или полезные признаки.',
          'Рабочий вопрос здесь не “какой метод вызвать?”, а “по какой группе сравниваем и какую статистику считаем?”.',
        ]),
      ],
    ),
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
            import pandas as pd

            df = pd.DataFrame({
                "district": ["Center", "North", "Center", "South"],
                "area": [35, 52, 80, 40],
                "price": [8, 9, 18, 12],
            })

            print(df["district"].value_counts())
          `,
          `
            district
            Center    2
            North     1
            South     1
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
              import pandas as pd

              df = pd.DataFrame({
                  "district": ["Center", "North", "Center", "South"],
                  "area": [35, 52, 80, 40],
                  "price": [8, 9, 18, 12],
              })

              print(df["district"].value_counts())
            `, `
              district
              Center    2
              North     1
              South     1
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
            import pandas as pd

            df = pd.DataFrame({
                "district": ["Center", "North", "Center", "South"],
                "area": [35, 52, 80, 40],
                "price": [8, 9, 18, 12],
            })

            print(df.groupby("district")["price"].mean())
          `,
          `
            district
            Center    13.0
            North      9.0
            South     12.0
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
              import pandas as pd

              df = pd.DataFrame({
                  "district": ["Center", "North", "Center", "South"],
                  "area": [35, 52, 80, 40],
                  "price": [8, 9, 18, 12],
              })

              print(df.groupby("district")["price"].mean())
            `, `
              district
              Center    13.0
              North      9.0
              South     12.0
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
            import pandas as pd

            df = pd.DataFrame({
                "district": ["Center", "North", "Center", "South"],
                "area": [35, 52, 80, 40],
                "price": [8, 9, 18, 12],
            })

            stats = df.groupby("district").agg({
                "price": ["mean", "median", "max"],
                "area": "mean",
            })

            print(stats)
          `,
          `
                     price             area
                      mean median max  mean
            district                       
            Center    13.0   13.0  18  57.5
            North      9.0    9.0   9  52.0
            South     12.0   12.0  12  40.0
          `,
          '`agg()` считает несколько агрегатов в одном выражении.',
        ),
        section('agg', 'Несколько агрегатов', [
          '`agg()` даёт компактную EDA-сводку по группам. Вместо отдельных вызовов `mean()`, `median()` и `max()` можно описать нужные статистики в одном месте.',
          'Агрегаты помогают искать закономерности, выбросы и различия между сегментами. Иногда групповые статистики становятся новыми признаками, если они рассчитаны без утечки данных.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "district": ["Center", "North", "Center", "South"],
                  "area": [35, 52, 80, 40],
                  "price": [8, 9, 18, 12],
              })

              stats = df.groupby("district").agg({
                  "price": ["mean", "median", "max"],
                  "area": "mean",
              })

              print(stats)
            `, `
                       price             area
                        mean median max  mean
              district                       
              Center    13.0   13.0  18  57.5
              North      9.0    9.0   9  52.0
              South     12.0   12.0  12  40.0
            `, '`agg()` удобно расширять: добавлять новые столбцы и функции без переписывания всей логики.'),
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
            import pandas as pd

            df = pd.DataFrame({
                "district": ["Center", "North", "Center", "South"],
                "area": [35, 52, 80, 40],
                "price": [8, 9, 18, 12],
            })

            table = df.pivot_table(index="district", values="price", aggfunc="mean")
            print(table)
          `,
          `
                      price
            district       
            Center     13.0
            North       9.0
            South      12.0
          `,
          '`pivot_table()` строит сводную таблицу агрегатов.',
        ),
        section('pivot', 'Сводная таблица', [
          '`pivot_table()` показывает агрегированные значения в формате строк и столбцов. Это похоже на сводные таблицы в Excel.',
          'Для первичного анализа `groupby()` часто проще, но `pivot_table()` удобен, когда нужно сравнивать сразу несколько разрезов данных.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "district": ["Center", "North", "Center", "South"],
                  "area": [35, 52, 80, 40],
                  "price": [8, 9, 18, 12],
              })

              table = df.pivot_table(index="district", values="price", aggfunc="mean")
              print(table)
            `, `
                        price
              district       
              Center     13.0
              North       9.0
              South      12.0
            `, '`pivot_table()` особенно полезен для отчётов и проверки гипотез по категориям.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-grouping-checkpoint',
      'Что теперь умеем',
      'Собираем группировки в EDA-сценарий.',
      [
        section('checkpoint', 'Промежуточный вывод', [
          'Теперь мы можем переходить от отдельных строк к сводкам: частоты категорий, средние по группам, несколько агрегатов сразу и pivot-таблицы для отчёта.',
          'После группировки важно смотреть не только среднее, но и количество строк в группе. Маленькая группа может дать нестабильную статистику и привести к неверному выводу.',
        ], {
          bullets: [
            'считать частоты через `value_counts()`;',
            'сравнивать группы через `groupby()`;',
            'считать несколько метрик через `agg()`;',
            'строить компактные сводки через `pivot_table()`.',
            'Где это используется в ML/EDA: сравнение сегментов, поиск дисбаланса категорий, анализ target по группам и подготовка агрегированных признаков.',
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
