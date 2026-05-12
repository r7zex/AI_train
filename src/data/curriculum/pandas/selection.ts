import { callout, code, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasSelection = pandasTopic(
  'pandas-selection',
  '3.3 Выбор столбцов и строк',
  3,
  'Учимся выбирать один или несколько столбцов, строки через loc и iloc, а также строки по условию.',
  'Выбор строк и столбцов - основа анализа: почти каждый EDA-шаг начинается с того, что мы берём нужные признаки или нужные наблюдения.',
  ['column selection', 'loc', 'iloc', 'boolean mask', 'Series', 'DataFrame'],
  ['df["col"] -> Series', 'df[["col"]] -> DataFrame'],
  [
    '`df["column"]` выбирает один столбец как Series.',
    '`df[["col1", "col2"]]` выбирает несколько столбцов как DataFrame.',
    '`loc` выбирает по меткам, `iloc` - по позициям.',
  ],
  [
    theoryStep(
      'pandas-selection-columns',
      'Выбор одного и нескольких столбцов',
      'Одинарные и двойные скобки возвращают разные структуры.',
      [
        section('columns', 'Столбцы по имени', [
          '**ЗАДАЧА:** достать из таблицы нужные признаки. В ML редко используются все столбцы сразу: часть колонок может быть идентификаторами, текстом, target или служебной информацией.',
          '**СИНТАКСИС:** `df["price"]` выбирает один столбец, `df[["area", "price"]]` выбирает несколько столбцов.',
          '**ВОЗВРАЩАЕТ:** одинарные скобки обычно дают `Series`, двойные скобки - `DataFrame`. Для модели чаще нужен `DataFrame`, потому что матрица признаков `X` должна оставаться двумерной.',
        ], {
          codeExamples: [
            code('python', `
              price = df["price"]
              features = df[["area", "rooms"]]

              print(type(price).__name__)
              print(type(features).__name__)
            `, 'Series\nDataFrame', 'Один столбец стал `Series`, а список столбцов сохранил табличный вид.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-selection-loc',
      '`loc`',
      '`loc` выбирает по именам строк и столбцов.',
      [
        section('loc', 'Выбор по меткам', [
          '**ЗАДАЧА:** выбрать строки и столбцы по их меткам. Меткой может быть имя индекса строки или название столбца.',
          '**СИНТАКСИС:** `df.loc[row_labels, column_labels]`. Для строк можно передать одно имя, список имён, срез по меткам или булеву маску. Для столбцов обычно передают название или список названий.',
          '**ГДЕ ИСПОЛЬЗУЕТСЯ В ML:** `loc` удобен, когда нужно оставить конкретные признаки после фильтрации: например строки дорогих квартир и только столбцы `area`, `rooms`, `price`.',
        ], {
          codeExamples: [
            code('python', `
              expensive = df.loc[df["price"] > 10_000_000, ["area", "price"]]
              print(expensive)
            `, 'Строки с дорогими квартирами и два выбранных столбца.', '`loc` читабельно соединяет условие по строкам и список столбцов.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-selection-iloc',
      '`iloc`',
      '`iloc` выбирает по числовым позициям.',
      [
        section('iloc', 'Выбор по позициям', [
          '**ЗАДАЧА:** взять строки и столбцы по номеру позиции, а не по имени. Это похоже на обычную индексацию списков Python.',
          '**СИНТАКСИС:** `df.iloc[row_positions, column_positions]`. Например, `df.iloc[:5, :3]` берёт первые 5 строк и первые 3 столбца.',
          '**ВОЗВРАЩАЕТ:** фрагмент таблицы или отдельное значение. `iloc` полезен для быстрой проверки формы, но в учебном и production-коде по смысловым столбцам чаще читается `loc` или выбор по именам.',
        ], {
          codeExamples: [
            code('python', `
              preview = df.iloc[:3, :2]
              print(preview)
            `, 'Первые 3 строки и первые 2 столбца таблицы.', '`iloc` не знает названий колонок в выражении: он работает только с позициями.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-selection-masks',
      'Условия и булевы маски',
      'Условие по столбцу создаёт маску True/False.',
      [
        section('masks', 'Фильтрация через условие', [
          '**ЗАДАЧА:** оставить только строки, которые удовлетворяют условию: возраст больше 30, цена выше порога, город равен нужному значению.',
          '**СИНТАКСИС:** `df[df["price"] > 10000000]`. Сначала выражение `df["price"] > 10000000` создаёт `Series` из `True` и `False`, затем pandas оставляет строки с `True`.',
          '**ГДЕ ИСПОЛЬЗУЕТСЯ В ML:** булевы маски помогают исследовать сегменты данных: дорогие объекты, пропущенные значения, редкие категории и строки с подозрительными признаками.',
        ], {
          codeExamples: [
            code('python', `
              expensive = df[df["price"] > 10_000_000]
              print(expensive[["area", "price"]])
            `, 'Только строки, где `price` больше 10 000 000, и два выбранных столбца.', 'Маска применяется ко всей таблице сразу, без ручного цикла по строкам.'),
          ],
          callouts: [
            callout('Запомнить', 'Условие в pandas работает не с одной строкой, а сразу со всем столбцом.', 'remember'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-selection-quiz-loc-iloc',
      '`loc` или `iloc`',
      'Выбираем способ индексации.',
      singleQuiz(
        'quiz-pandas-loc-iloc',
        'loc и iloc',
        'pandas-selection',
        'pandas-eda',
        'Когда лучше использовать `iloc`?',
        [
          { id: 'a', text: 'Когда нужны строки и столбцы по числовым позициям' },
          { id: 'b', text: 'Когда нужно прочитать CSV-файл' },
          { id: 'c', text: 'Когда нужно посчитать пропуски' },
          { id: 'd', text: 'Когда нужно удалить дубликаты' },
        ],
        'a',
        '`iloc` работает с позициями строк и столбцов, например `df.iloc[:5, :2]`.',
      ),
    ),
    quizStep(
      'pandas-selection-quiz-return',
      'Что вернёт выбор',
      'Проверяем Series и DataFrame.',
      singleQuiz(
        'quiz-pandas-column-return',
        'Выбор столбца',
        'pandas-selection',
        'pandas-eda',
        'Чем обычно отличается `df["age"]` от `df[["age"]]`?',
        [
          { id: 'a', text: 'Первое возвращает Series, второе - DataFrame' },
          { id: 'b', text: 'Первое удаляет столбец, второе сортирует таблицу' },
          { id: 'c', text: 'Они всегда возвращают один и тот же тип' },
          { id: 'd', text: 'Второе читает файл с диска' },
        ],
        'a',
        '`df["age"]` выбирает один столбец как `Series`, а `df[["age"]]` сохраняет табличный формат `DataFrame`.',
      ),
    ),
    practiceStep(
      'pandas-selection-practice',
      'Выбрать строки и столбцы',
      'Фильтруем людей старше 30 и оставляем два столбца.',
      makeStdinTask(
        'task-pandas-select-age',
        'Выбрать строки и столбцы',
        'На вход подаётся CSV с колонками `name`, `age`, `city`. Выберите строки, где `age > 30`, и выведите только `name` и `age`.',
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))

          # TODO: выберите строки, где age > 30

          # TODO: оставьте только name и age

          # TODO: выведите результат
        `,
        [
          {
            id: 's1',
            description: 'Два человека старше 30',
            input: 'name,age,city\nAnna,24,Moscow\nBoris,35,Kazan\nMira,31,Perm',
            expectedOutput: ' name  age\nBoris   35\n Mira   31',
          },
        ],
        [
          {
            id: 'h1',
            description: 'Один человек старше 30',
            input: 'name,age,city\nOleg,30,Tula\nIra,44,Moscow\nMax,18,Kazan',
            expectedOutput: 'name  age\n Ira   44',
          },
        ],
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))
          result = df[df["age"] > 30][["name", "age"]]
          print(result.to_string(index=False))
        `,
      ),
    ),
  ],
)
