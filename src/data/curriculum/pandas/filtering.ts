import { callout, code, functionSection, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasFilteringSorting = pandasTopic(
  'pandas-filtering-sorting',
  '3.4 Фильтрация, сортировка и новые столбцы',
  4,
  'Закрепляем фильтрацию по условиям, сортировку через sort_values и создание новых признаков.',
  'Фильтрация, сортировка и новые столбцы помогают перейти от сырой таблицы к признакам, которые можно анализировать и отдавать модели.',
  ['filtering', 'boolean mask', 'sort_values', 'ascending', 'feature engineering'],
  ['condition1 & condition2', 'df["new_col"] = expression'],
  [
    'Каждое условие в pandas нужно брать в скобки при использовании `&` и `|`.',
    '`sort_values()` сортирует строки по значениям столбца.',
    'Новый столбец часто является новым признаком для ML.',
  ],
  [
    theoryStep(
      'pandas-filter-one-condition',
      'Фильтрация по одному условию',
      'Оставляем строки, где условие истинно.',
      [
        section('single-condition', 'Одно условие', [
          'Фильтрация выбирает только нужные строки таблицы: например квартиры дороже 10 млн, клиентов старше 30 лет или заказы из конкретного города.',
          'Запись `df[df["col"] > value]` читается в два шага. Внутри скобок создаётся булева маска, а pandas оставляет строки, где маска равна `True`.',
          'В EDA фильтрация нужна для проверки выбросов, отбора сегментов и поиска строк, которые могут испортить обучение модели.',
        ], {
          codeExamples: [
            code('python', `
              expensive = df[df["price"] > 10_000_000]
              print(expensive)
            `, 'DataFrame только со строками, где цена выше порога.', 'Условие применяется ко всему столбцу `price` сразу.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-filter-many-conditions',
      'Несколько условий: `&`, `|`, `~`',
      'Комбинируем условия через логические операторы pandas.',
      [
        section('many-conditions', 'Скобки обязательны', [
          'Несколько условий описывают более точный фильтр: возраст больше 30 и город Москва, цена высокая или площадь большая, не пустая категория.',
          '`(condition1) & (condition2)` означает И, `(condition1) | (condition2)` означает ИЛИ, `~condition` означает НЕ. Каждое условие нужно брать в скобки.',
          'В pandas нельзя писать `and` и `or` для Series. Эти операторы ожидают один булев результат, а pandas-условие содержит много значений `True/False` по строкам.',
        ], {
          codeExamples: [
            code('python', `
              filtered = df[(df["age"] > 30) & (df["city"] == "Moscow")]
              print(filtered)
            `, 'Строки, где одновременно выполнены оба условия.', 'Скобки вокруг условий защищают код от ошибок приоритетов операций.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-sort-values',
      '`sort_values()`',
      'Сортируем таблицу по значениям одного или нескольких столбцов.',
      [
        functionSection(
          'sort-values-ascending',
          '`df.sort_values()`',
          'df.sort_values("col")',
          ['`col` - столбец для сортировки'],
          `
            print(df.sort_values("price").head(3))
          `,
          'Три строки с самыми маленькими значениями `price`.',
          '`sort_values()` по умолчанию сортирует по возрастанию.',
        ),
        functionSection(
          'sort-values-descending',
          '`ascending=False`',
          'df.sort_values("col", ascending=False)',
          ['`ascending=False` - сортировать от больших значений к меньшим'],
          `
            top = df.sort_values("price", ascending=False).head(3)
            print(top[["area", "price"]])
          `,
          'Три самые дорогие строки по столбцу `price`.',
          '`ascending=False` меняет порядок сортировки на убывающий.',
        ),
        section('sort', 'Порядок строк', [
          'Сортировка помогает увидеть самые большие, маленькие или приоритетные значения. Например, отсортировать квартиры по цене, клиентов по возрасту или признаки по доле пропусков.',
          '`sort_values()` возвращает новый `DataFrame` в отсортированном порядке. Исходная таблица не меняется, если не присвоить результат обратно.',
        ], {
          codeExamples: [
            code('python', `
              top = df.sort_values("price", ascending=False).head(3)
              print(top[["area", "price"]])
            `, 'Три самые дорогие строки по столбцу `price`.', 'Сортировка часто используется вместе с `head()`, чтобы посмотреть экстремальные объекты.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-new-column',
      'Создание нового столбца',
      'Новый столбец создаётся присваиванием в `df["name"]`.',
      [
        section('new-feature', 'Новый признак', [
          'Новый столбец часто создают из существующих. В ML это называется feature engineering: мы добавляем информацию, которая может лучше объяснять target.',
          'Синтаксис обычный для присваивания: `df["new_col"] = ...`. Правая часть может быть арифметикой столбцов, булевым условием, строковой операцией или результатом функции.',
          'Для квартир полезен признак `price_per_meter = price / area`. Он показывает цену квадратного метра и часто лучше сравнивает объекты разной площади.',
        ], {
          codeExamples: [
            code('python', `
              df["price_per_meter"] = df["price"] / df["area"]
              print(df[["price", "area", "price_per_meter"]])
            `, 'Таблица с новым столбцом цены за квадратный метр.', 'Новый признак считается сразу для всех строк таблицы.'),
          ],
          callouts: [
            callout('Важно', 'Не создавайте признаки из target так, чтобы в модель утекла информация, неизвестная на момент предсказания.', 'important'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-filter-quiz-conditions',
      'Как записать несколько условий',
      'Проверяем синтаксис булевых масок.',
      singleQuiz(
        'quiz-pandas-many-conditions',
        'Несколько условий',
        'pandas-filtering-sorting',
        'pandas-eda',
        'Как правильно объединить два pandas-условия через логическое И?',
        [
          { id: 'a', text: '`(df["age"] > 30) & (df["city"] == "Moscow")`' },
          { id: 'b', text: '`df["age"] > 30 and df["city"] == "Moscow"`' },
          { id: 'c', text: '`df["age"] > 30 && df["city"] == "Moscow"`' },
          { id: 'd', text: '`df["age"] > 30 + df["city"] == "Moscow"`' },
        ],
        'a',
        'Для pandas-условий используют `&`, `|`, `~`, а каждое условие берут в скобки.',
      ),
    ),
    quizStep(
      'pandas-filter-quiz-sort',
      'Что делает sort_values',
      'Проверяем назначение сортировки.',
      singleQuiz(
        'quiz-pandas-sort-values',
        'sort_values',
        'pandas-filtering-sorting',
        'pandas-eda',
        'Что делает `df.sort_values("price", ascending=False)`?',
        [
          { id: 'a', text: 'Сортирует строки по `price` от больших значений к меньшим' },
          { id: 'b', text: 'Удаляет столбец `price`' },
          { id: 'c', text: 'Считает среднюю цену' },
          { id: 'd', text: 'Заполняет пропуски в цене' },
        ],
        'a',
        '`ascending=False` задаёт сортировку по убыванию, поэтому большие цены окажутся выше.',
      ),
    ),
    practiceStep(
      'pandas-filter-practice',
      'Отфильтровать и создать признак',
      'Оставляем дорогие квартиры и считаем цену за метр.',
      makeStdinTask(
        'task-pandas-filter-feature',
        'Отфильтровать и создать признак',
        'На вход подаётся CSV с колонками `area`, `rooms`, `price`. Отфильтруйте квартиры дороже `10_000_000`, создайте `price_per_meter` и выведите `area`, `price`, `price_per_meter`.',
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))

          # TODO: отфильтруйте квартиры дороже 10_000_000

          # TODO: создайте столбец price_per_meter

          # TODO: выведите результат
        `,
        [
          {
            id: 's1',
            description: 'Одна дорогая квартира',
            input: 'area,rooms,price\n35,1,8200000\n52,2,9100000\n80,3,18400000',
            expectedOutput: ' area    price  price_per_meter\n   80 18400000         230000.0',
          },
        ],
        [
          {
            id: 'h1',
            description: 'Две дорогие квартиры',
            input: 'area,rooms,price\n40,1,12000000\n60,2,9000000\n100,4,25000000',
            expectedOutput: ' area    price  price_per_meter\n   40 12000000         300000.0\n  100 25000000         250000.0',
          },
        ],
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))
          filtered = df[df["price"] > 10_000_000].copy()
          filtered["price_per_meter"] = filtered["price"] / filtered["area"]
          print(filtered[["area", "price", "price_per_meter"]].to_string(index=False))
        `,
      ),
    ),
  ],
)
