import { callout, code, makeStdinTask, numpyTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'



export const topicNumpyAggregations = numpyTopic(
  'numpy-aggregations-statistics',
  '2.6 Агрегации и статистики',
  6,
  'Считаем сумму, среднее, границы, разброс, медиану, квантили и статистики по axis.',
  'Агрегации сворачивают массив в одно или несколько статистических значений.',
  ['np.sum', 'np.mean', 'np.min', 'np.max', 'np.var', 'np.std', 'np.median', 'np.quantile', 'np.percentile'],
  ['mean = sum / n'],
  ['Агрегации нужны для анализа признаков, ошибок, выбросов и baseline-решений.'],
  [
    theoryStep(
      'numpy-aggregations-basic',
      'Базовые агрегаты: `sum`, `mean`, `min`, `max`',
      '`np.sum`, `np.mean`, `np.min`, `np.max` дают базовое описание массива.',
      [
        section('functions', 'Сумма, среднее и границы', [
          '`np.sum(x)` считает сумму, `np.mean(x)` - среднее, `np.min(x)` - минимум, `np.max(x)` - максимум. Эти функции быстро отвечают на первые вопросы о числовом признаке.',
          'Если `axis` не указан, массив обычно сворачивается в одно число. Если `axis` указан, статистика считается по строкам или столбцам.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([10, 20, 30])

              print("sum:", np.sum(x))
              print("mean:", np.mean(x))
              print("min/max:", np.min(x), np.max(x))
            `, 'sum: 60\nmean: 20.0\nmin/max: 10 30', 'Подписанный вывод показывает, какая статистика чему равна.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-aggregations-spread',
      'Разброс: `std`, `var`',
      '`np.var` и `np.std` описывают разброс значений.',
      [
        section('spread', 'Дисперсия и стандартное отклонение', [
          '`np.var(x)` считает дисперсию, а `np.std(x)` - стандартное отклонение. Обе функции описывают разброс значений вокруг среднего.',
          'Стандартное отклонение легче интерпретировать, потому что оно возвращается в масштабе исходных данных. Если признак измеряется в рублях, `std` тоже читается в рублях.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([2, 4, 4, 4, 5, 5, 7, 9])

              print("var:", np.var(x))
              print("std:", np.std(x))
            `, 'var: 4.0\nstd: 2.0', 'У этого массива стандартное отклонение равно 2: типичный разброс вокруг среднего понятен по масштабу.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-aggregations-quantiles',
      'Медиана, квантили, процентили',
      '`median`, `quantile`, `percentile` помогают читать распределение.',
      [
        section('quantiles', 'Центр и пороги распределения', [
          '`np.median(x)` возвращает медиану - центральное значение. `np.quantile(x, q)` возвращает квантиль от 0 до 1. `np.percentile(x, p)` делает похожее, но `p` задаётся от 0 до 100.',
          'Медиана и квантили полезны, когда есть выбросы. Они помогают описать не только среднее, но и то, где находится нижняя, центральная и верхняя часть данных.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([10, 20, 30, 40])

              print("median:", np.median(x))
              print("q25:", np.quantile(x, 0.25))
              print("p75:", np.percentile(x, 75))
            `, 'median: 25.0\nq25: 17.5\np75: 32.5', 'Вывод показывает центр, нижний квартиль и верхний квартиль массива.'),
          ],
        }),
        section('sorting', 'Сортировка, уникальные и arg-функции', [
          'Для анализа массива рядом со статистиками часто нужны `np.sort`, `np.argsort`, `np.unique`, `np.argmax`, `np.argmin`. Их не нужно выносить в отдельные уроки: это маленькие инструменты для порядка, уникальных значений и индексов экстремумов.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([30, 10, 20, 10])

              print("sort:", np.sort(x))
              print("argsort:", np.argsort(x))
              print("unique:", np.unique(x))
              print("argmax/argmin:", np.argmax(x), np.argmin(x))
            `, 'sort: [10 10 20 30]\nargsort: [1 3 2 0]\nunique: [10 20 30]\nargmax/argmin: 0 1', '`argsort` вернул индексы, которые отсортируют массив; `argmax` и `argmin` вернули индексы экстремумов.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-aggregations-axis',
      'Статистики по axis',
      'С `axis` статистики считаются по строкам или столбцам.',
      [
        section('axis', 'Один массив - разные результаты', [
          'Для двумерного массива без `axis` статистика считается по всем значениям. С `axis=0` результат получается по столбцам. С `axis=1` результат получается по строкам.',
          'Эта идея важна для ML: в матрице `X` столбцы часто являются признаками, поэтому среднее по `axis=0` даёт среднее значение каждого признака.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              X = np.array([[1, 2, 3],
                            [4, 5, 6]])

              print("mean all:", np.mean(X))
              print("mean axis=0:", np.mean(X, axis=0))
              print("mean axis=1:", np.mean(X, axis=1))
            `, 'mean all: 3.5\nmean axis=0: [2.5 3.5 4.5]\nmean axis=1: [2. 5.]', 'Одна функция дала три разных уровня агрегирования: всё, столбцы, строки.'),
          ],
        }),
      ],
    ),
    quizStep(
      'numpy-aggregations-quiz-mean',
      'Выбрать статистику',
      'Проверяем функцию среднего.',
      singleQuiz(
        'quiz-numpy-aggregations-mean',
        'Среднее значение',
        'numpy-aggregations-statistics',
        'numpy-ml',
        'Какую функцию использовать для среднего значения массива?',
        [
          { id: 'a', text: '`np.max`' },
          { id: 'b', text: '`np.mean`' },
          { id: 'c', text: '`np.arange`' },
          { id: 'd', text: '`np.shape`' },
        ],
        'b',
        '`np.mean()` считает среднее значение массива.',
      ),
    ),
    quizStep(
      'numpy-aggregations-quiz-max',
      'Что вернёт агрегация',
      'Проверяем максимум.',
      singleQuiz(
        'quiz-numpy-aggregations-max',
        'Максимум',
        'numpy-aggregations-statistics',
        'numpy-ml',
        'Что вернёт `np.max(np.array([3, 10, 5]))`?',
        [
          { id: 'a', text: '3' },
          { id: 'b', text: '5' },
          { id: 'c', text: '10' },
          { id: 'd', text: '18' },
        ],
        'c',
        '`np.max()` возвращает наибольшее значение массива.',
      ),
    ),
    practiceStep(
      'numpy-aggregations-practice',
      'Посчитать статистики',
      'Практика на базовые агрегации.',
      makeStdinTask(
        'task-numpy-statistics',
        'Посчитать статистики',
        'На вход подаются числа. Выведите сумму, среднее, минимум, максимум и медиану.',
        `
          import numpy as np

          # TODO: считайте числа

          # TODO: создайте массив

          # TODO: посчитайте сумму, среднее, минимум, максимум и медиану

          # TODO: выведите результаты
        `,
        [
          { id: 's1', description: 'Три числа', input: '10 20 30', expectedOutput: '60\n20.0\n10\n30\n20.0' },
        ],
        [
          { id: 'h1', description: 'Разные значения', input: '3 10 5', expectedOutput: '18\n6.0\n3\n10\n5.0' },
          { id: 'h2', description: 'Одинаковые значения', input: '7 7 7 7', expectedOutput: '28\n7.0\n7\n7\n7.0' },
        ],
        `
          import numpy as np

          x = np.array(list(map(int, input().split())))
          print(np.sum(x))
          print(np.mean(x))
          print(np.min(x))
          print(np.max(x))
          print(np.median(x))
        `,
      ),
    ),
  ],
)

export const topicNumpyAxis = numpyTopic(
  'numpy-2d-axis',
  '2.7 Двумерные массивы и axis',
  7,
  'Разбираем матрицу объектов-признаков, `axis=0`, `axis=1` и `reshape()`.',
  '`axis=0` агрегирует по строкам и даёт результат по столбцам; `axis=1` агрегирует по столбцам и даёт результат по строкам.',
  ['axis', 'reshape', 'матрица', 'строка', 'столбец', 'flatten', 'ravel', 'transpose'],
  ['X.mean(axis=0)', 'X.mean(axis=1)', 'x.reshape(new_shape)'],
  ['Для матрицы объектов и признаков `axis=0` часто даёт статистику по каждому признаку.'],
  [
    theoryStep(
      'numpy-2d-axis-matrix',
      'Матрица объектов и признаков',
      'В ML таблицу часто представляют как двумерный массив.',
      [
        section('matrix', 'Матрица X', [
          'В ML таблицу часто представляют как двумерный массив: строки - объекты, столбцы - признаки. Поэтому `X.shape = (3, 2)` читается как 3 объекта и 2 признака.',
          'Такой взгляд помогает правильно выбирать срезы и axis. Если нужно посчитать среднее каждого признака, мы хотим получить результат длины 2, то есть по столбцам.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              X = np.array([[30, 1],
                            [45, 2],
                            [60, 3]])

              print("X shape:", X.shape)
            `, 'X shape: (3, 2)', 'В матрице 3 строки-объекта и 2 столбца-признака.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-2d-axis-both',
      'Как работает `axis`',
      '`axis=0` и `axis=1` нужно объяснять вместе.',
      [
        section('axis', 'Две оси двумерного массива', [
          'Для двумерного массива `axis=0` означает: агрегируем строки и получаем результат по столбцам. `axis=1` означает: агрегируем столбцы и получаем результат по строкам.',
          'Мини-схема: `axis=0` - вниз по строкам, `axis=1` - вправо по столбцам. Не запоминайте как “строки” или “столбцы” отдельно: смотрите, какая ось сворачивается и какой результат остаётся.',
        ], {
          callouts: [
            callout('Схема', 'axis=0 → вниз по строкам → результат по столбцам\naxis=1 → вправо по столбцам → результат по строкам', 'schema'),
          ],
          codeExamples: [
            code('python', `
              import numpy as np

              X = np.array([[1, 2, 3],
                            [4, 5, 6]])

              print("axis=0:", X.mean(axis=0))
              print("axis=1:", X.mean(axis=1))
            `, 'axis=0: [2.5 3.5 4.5]\naxis=1: [2. 5.]', 'Для `axis=0` осталось 3 столбца, для `axis=1` осталось 2 строки.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-2d-axis-reshape',
      '`reshape`',
      '`reshape()` меняет форму массива без изменения значений.',
      [
        section('syntax', 'Новая форма', [
          '`x.reshape(new_shape)` меняет форму массива, но не меняет значения. Главное условие: общее число элементов должно совпадать. Массив из 6 элементов можно превратить в `(2, 3)` или `(3, 2)`, но нельзя в `(4, 2)`.',
          '`-1` означает “посчитай этот размер автоматически”. Ещё рядом полезно знать `.T` для транспонирования и `.flatten()` или `.ravel()` для превращения массива в плоский вектор.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.arange(6)
              X = x.reshape(2, 3)

              print(X)
              print("auto shape:", x.reshape(-1, 2).shape)
              print("T shape:", X.T.shape)
              print("flat:", X.flatten())
            `, '[[0 1 2]\n [3 4 5]]\nauto shape: (3, 2)\nT shape: (3, 2)\nflat: [0 1 2 3 4 5]', 'Вывод показывает reshape, автоматический размер `-1`, транспонирование и плоский массив.'),
          ],
        }),
      ],
    ),
    quizStep(
      'numpy-2d-axis-quiz-axis',
      'Что означает axis',
      'Проверяем `axis=0`.',
      singleQuiz(
        'quiz-numpy-2d-axis-axis',
        'Axis',
        'numpy-2d-axis',
        'numpy-ml',
        'Что обычно даёт `X.mean(axis=0)` для матрицы объектов-признаков?',
        [
          { id: 'a', text: 'Среднее по каждому столбцу-признаку' },
          { id: 'b', text: 'Среднее по каждой строке-объекту' },
          { id: 'c', text: 'Только первый элемент' },
          { id: 'd', text: 'Ошибку всегда' },
        ],
        'a',
        '`axis=0` сворачивает строки и оставляет результат по столбцам, то есть по признакам.',
      ),
    ),
    quizStep(
      'numpy-2d-axis-quiz-reshape',
      'Форма после reshape',
      'Проверяем форму результата.',
      singleQuiz(
        'quiz-numpy-2d-axis-reshape',
        'Reshape',
        'numpy-2d-axis',
        'numpy-ml',
        'Какая форма будет у `np.arange(6).reshape(2, 3)`?',
        [
          { id: 'a', text: '`(6,)`' },
          { id: 'b', text: '`(3, 2)`' },
          { id: 'c', text: '`(2, 3)`' },
          { id: 'd', text: '`(1, 6)`' },
        ],
        'c',
        '`reshape(2, 3)` явно задаёт форму 2 строки и 3 столбца.',
      ),
    ),
    practiceStep(
      'numpy-2d-axis-practice',
      'Средние по строкам и столбцам',
      'Практика на `reshape` и `axis`.',
      makeStdinTask(
        'task-numpy-axis-means',
        'Средние по строкам и столбцам',
        'На вход подаются 6 чисел. Создайте матрицу формы `(2, 3)`. Выведите среднее по столбцам и среднее по строкам.',
        `
          import numpy as np

          # TODO: считайте 6 чисел

          # TODO: создайте матрицу формы (2, 3)

          # TODO: выведите среднее по столбцам

          # TODO: выведите среднее по строкам
        `,
        [
          { id: 's1', description: '1..6', input: '1 2 3 4 5 6', expectedOutput: '[2.5 3.5 4.5]\n[2. 5.]' },
        ],
        [
          { id: 'h1', description: 'Две строки', input: '2 4 6 8 10 12', expectedOutput: '[5. 7. 9.]\n[ 4. 10.]' },
          { id: 'h2', description: 'Одинаковые', input: '1 1 1 1 1 1', expectedOutput: '[1. 1. 1.]\n[1. 1.]' },
        ],
        `
          import numpy as np

          values = list(map(float, input().split()))
          X = np.array(values).reshape(2, 3)
          print(X.mean(axis=0))
          print(X.mean(axis=1))
        `,
      ),
    ),
  ],
)

