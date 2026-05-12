import { callout, code, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasGroupby = pandasTopic(
  'pandas-groupby',
  '3.6 Группировки и агрегирование',
  6,
  'Сравниваем группы объектов через `value_counts()`, `groupby()`, `agg()` и `pivot_table()`.',
  'Группировки нужны, чтобы понять различия между категориями: районами, городами, типами товаров или сегментами клиентов.',
  ['value_counts', 'groupby', 'agg', 'pivot_table', 'aggregation'],
  ['groupby -> split -> aggregate -> compare'],
  [
    '`value_counts()` считает частоты одного столбца.',
    '`groupby()` группирует строки по категории.',
    '`agg()` и `pivot_table()` помогают получить несколько статистик.',
  ],
  [
    theoryStep(
      'pandas-grouping-scenario',
      'Сравнение групп',
      'Показываем группировки как ответы на аналитические вопросы.',
      [
        section('questions', 'Какие вопросы решает группировка', [
          'Группировки нужны, чтобы сравнивать группы объектов: средняя цена по району, количество клиентов по городу, средний чек по категории, максимальная площадь по типу квартиры.',
          'В ML это помогает понять, какие категориальные признаки важны и где есть перекосы данных.',
        ], {
          callouts: [
            callout('ML-связка', 'Если средняя цена сильно отличается по районам, `district` может быть важным признаком. Если одна категория встречается почти всегда, модель может плохо учиться на редких категориях.', 'example'),
          ],
        }),
        section('value-counts', '`value_counts()` для частот', [
          'Когда нужен быстрый ответ “сколько раз встречается каждая категория”, достаточно `value_counts()`.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({"district": ["center", "north", "center", "south"]})

              print(df["district"].value_counts())
            `, `
              district
              center    2
              north     1
              south     1
              Name: count, dtype: int64
            `, 'Так быстро видно распределение категорий.'),
          ],
        }),
        section('groupby', '`groupby()` и `agg()`', [
          '`groupby()` разбивает строки на группы, а агрегирующая функция считает показатель внутри каждой группы.',
          '`agg()` удобен, когда нужно несколько статистик: например, средняя цена и количество объектов.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "district": ["center", "north", "center", "north"],
                  "price": [10, 8, 14, 12],
              })

              report = df.groupby("district")["price"].agg(["mean", "count"])
              print(report)
            `, `
                        mean  count
              district             
              center    12.0      2
              north     10.0      2
            `, 'По каждому району получили среднюю цену и число объектов.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-grouping-checkpoint',
      'Что теперь умеем',
      'Фиксируем инструменты сравнения групп.',
      [
        section('checkpoint', 'Промежуточный вывод', [
          'Группировка превращает список строк в сравнение категорий.',
        ], {
          bullets: [
            'считать частоты категорий через `value_counts()`;',
            'сравнивать группы через `groupby()`;',
            'получать несколько статистик через `agg()`;',
            'строить сводную таблицу через `pivot_table()`;',
            'замечать перекосы категорий перед ML.',
          ],
          callouts: [
            callout('Типичная ошибка', 'Сравнивать средние по группам и не смотреть `count`. Среднее по группе из одного объекта может быть случайным и ненадёжным.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-grouping-agg-choice',
      'Как выбрать агрегат',
      'Связываем статистику с вопросом к группе.',
      [
        section('choice', 'Среднее, количество, максимум', [
          'Агрегат выбирают по вопросу. Для типичного значения подойдёт `mean` или `median`, для размера сегмента - `count`, для максимального значения - `max`, для разброса - `std`.',
          'В EDA часто полезно считать сразу несколько агрегатов. Например, средняя цена без количества объектов может обмануть: район с одной дорогой квартирой будет выглядеть “дорогим”, хотя данных слишком мало.',
        ], {
          callouts: [
            callout('Где используется', 'Сравнение сегментов, поиск перекосов категорий, подготовка отчётов, проверка важности категориальных признаков.', 'example'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-grouping-pivot',
      'Когда нужна сводная таблица',
      'Объясняем место `pivot_table()` без справочного списка.',
      [
        section('pivot', 'Две категории в одном отчёте', [
          '`pivot_table()` удобна, когда нужно сравнить показатель сразу по двум категориальным осям: например, средний чек по городу и категории товара или среднюю цену по району и типу квартиры.',
          'По смыслу это тот же groupby, но результат разворачивается в таблицу, которую легче читать глазами. Такой формат часто используют в EDA-отчётах перед тем, как решать, какие признаки оставить для модели.',
        ], {
          callouts: [
            callout('Промежуточный вывод', '`value_counts()` отвечает про частоты, `groupby()` - про статистики по группам, `pivot_table()` - про удобное сравнение по двум измерениям.', 'summary'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-groupby-quiz-counts',
      'Частоты категорий',
      'Проверяем выбор метода.',
      singleQuiz(
        'quiz-pandas-groupby-counts',
        'value_counts',
        'pandas-groupby',
        'pandas-eda',
        'Что лучше вызвать, чтобы узнать, сколько раз встречается каждый город в столбце `city`?',
        [
          { id: 'a', text: '`df["city"].value_counts()`' },
          { id: 'b', text: '`df["city"].mean()`' },
          { id: 'c', text: '`df.describe()`' },
          { id: 'd', text: '`pd.read_csv("city")`' },
        ],
        'a',
        '`value_counts()` считает частоты значений одного столбца.',
      ),
    ),
    quizStep(
      'pandas-groupby-quiz-meaning',
      'Среднее по группам',
      'Проверяем сценарий `groupby`.',
      singleQuiz(
        'quiz-pandas-groupby-meaning',
        'groupby',
        'pandas-groupby',
        'pandas-eda',
        'Что делает `df.groupby("district")["price"].mean()`?',
        [
          { id: 'a', text: 'Считает среднюю цену внутри каждого района' },
          { id: 'b', text: 'Удаляет столбец `district`' },
          { id: 'c', text: 'Сортирует таблицу по цене' },
          { id: 'd', text: 'Заполняет пропуски в цене' },
        ],
        'a',
        '`groupby("district")` создаёт группы по району, а `mean()` считает среднее внутри каждой группы.',
      ),
    ),
    practiceStep(
      'pandas-groupby-practice',
      'Средняя цена по району',
      'Группируем таблицу и считаем среднее.',
      makeStdinTask(
        'task-pandas-mean-by-district',
        'Средняя цена по району',
        'Создайте DataFrame из готового словаря и выведите среднюю `price` по каждому `district`.',
        `
          import pandas as pd

          data = {
              "district": ["center", "north", "center", "north"],
              "price": [10, 8, 14, 12],
          }

          # TODO: создайте DataFrame

          # TODO: сгруппируйте по district и посчитайте среднюю price

          # TODO: выведите результат
        `,
        [
          { id: 's1', description: 'Средние по районам', expectedOutput: 'district\ncenter    12.0\nnorth     10.0\nName: price, dtype: float64' },
        ],
        [
          { id: 'h1', description: 'Проверка группировки', expectedOutput: 'district\ncenter    12.0\nnorth     10.0\nName: price, dtype: float64' },
        ],
        `
          import pandas as pd

          data = {
              "district": ["center", "north", "center", "north"],
              "price": [10, 8, 14, 12],
          }

          df = pd.DataFrame(data)
          result = df.groupby("district")["price"].mean()
          print(result)
        `,
      ),
    ),
  ],
)
