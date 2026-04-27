import { callout, code, makeStdinTask, numpyTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'



export const topicNumpyWhy = numpyTopic(
  'numpy-why',
  '2.1 Зачем нужен NumPy',
  1,
  'Объясняем роль NumPy, ndarray и отличие массива от списка Python.',
  'NumPy нужен для быстрых числовых массивов, которые удобно использовать в ML.',
  ['NumPy', 'ndarray', 'array', 'vectorization'],
  ['ndarray = N-dimensional array'],
  ['NumPy хранит числовые данные компактно и применяет операции ко всем элементам массива сразу.'],
  [
    theoryStep(
      'numpy-why-ml',
      'NumPy и числовые данные',
      'NumPy - базовая библиотека для числовых массивов.',
      [
        section('why', 'Зачем NumPy в ML', [
          '**NumPy** нужен, чтобы хранить и обрабатывать числовые данные: признаки, target, веса модели, ошибки, статистики и промежуточные вычисления. Даже когда модель обучается в другой библиотеке, данные часто проходят через NumPy-логику.',
          'Главная идея: массив NumPy хранит элементы одного типа и умеет выполнять операции сразу над всем массивом. Это делает код короче, нагляднее и обычно быстрее, чем ручные циклы Python.',
        ], {
          callouts: [
            callout('Вывод', 'NumPy - это рабочий слой для чисел: массивы, формы, операции, статистики и подготовка данных.', 'summary'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-why-ndarray',
      '`ndarray`',
      '`ndarray` - основной тип массива NumPy.',
      [
        section('definition', 'N-dimensional array', [
          '`ndarray` означает N-dimensional array: массив с любым числом измерений. Одномерный массив похож на вектор, двумерный - на таблицу, трёхмерный может хранить набор матриц или изображения.',
          'Для новичка важно запомнить две вещи: массив имеет форму (`shape`) и тип элементов (`dtype`). Эти свойства постоянно всплывают при подготовке данных для ML.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([10, 20, 30])

              print(x)
              print(type(x))
            `, '[10 20 30]\n<class \'numpy.ndarray\'>', 'Видно, что `np.array()` вернул не список Python, а объект `numpy.ndarray`.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-why-list-vs-array',
      'Python list vs NumPy array',
      'Список повторяется, массив умножает каждый элемент.',
      [
        section('difference', 'Одинаковый знак, разный смысл', [
          'В Python list операция `* 2` повторяет список. В NumPy array операция `* 2` умножает каждый элемент. Это один из первых примеров векторного мышления: действие применяется ко всем значениям сразу.',
          'Такой подход важен для ML: можно быстро масштабировать признаки, считать ошибки, центрировать данные и применять маски без ручного цикла по каждому элементу.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              values_list = [1, 2, 3]
              values_array = np.array([1, 2, 3])

              print(values_list * 2)
              print(values_array * 2)
            `, '[1, 2, 3, 1, 2, 3]\n[2 4 6]', 'Список повторился, а NumPy-массив применил умножение к каждому элементу.'),
          ],
        }),
      ],
    ),
    quizStep(
      'numpy-why-quiz-ndarray',
      'Что такое ndarray',
      'Проверяем базовый тип NumPy.',
      singleQuiz(
        'quiz-numpy-why-ndarray',
        'Что такое ndarray',
        'numpy-why',
        'numpy-ml',
        'Что такое `ndarray`?',
        [
          { id: 'a', text: 'Основной массив NumPy' },
          { id: 'b', text: 'Обычный список Python' },
          { id: 'c', text: 'Функция для графиков' },
          { id: 'd', text: 'Метрика классификации' },
        ],
        'a',
        '`ndarray` - основной тип массива NumPy.',
      ),
    ),
    quizStep(
      'numpy-why-quiz-vector',
      'Почему NumPy удобен',
      'Проверяем смысл векторных операций.',
      singleQuiz(
        'quiz-numpy-why-vector',
        'Зачем NumPy',
        'numpy-why',
        'numpy-ml',
        'Почему NumPy удобен для числовых данных?',
        [
          { id: 'a', text: 'Он применяет операции к массивам целиком' },
          { id: 'b', text: 'Он запрещает числа' },
          { id: 'c', text: 'Он нужен только для текста' },
          { id: 'd', text: 'Он всегда заменяет ML-модель' },
        ],
        'a',
        'NumPy умеет выполнять операции над массивами целиком, без ручного цикла по каждому элементу.',
      ),
    ),
    practiceStep(
      'numpy-why-practice',
      'Первый массив',
      'Создаём первый массив NumPy.',
      makeStdinTask(
        'task-numpy-first-array',
        'Первый массив',
        'На вход подаются числа. Создайте NumPy-массив и выведите его.',
        `
          import numpy as np

          # TODO: считайте числа

          # TODO: создайте массив NumPy

          # TODO: выведите массив
        `,
        [
          { id: 's1', description: 'Три числа', input: '1 2 3', expectedOutput: '[1 2 3]' },
        ],
        [
          { id: 'h1', description: 'Пять чисел', input: '5 4 3 2 1', expectedOutput: '[5 4 3 2 1]' },
          { id: 'h2', description: 'Один элемент', input: '10', expectedOutput: '[10]' },
        ],
        `
          import numpy as np

          values = list(map(int, input().split()))
          arr = np.array(values)
          print(arr)
        `,
      ),
    ),
  ],
)

export const topicNumpyShape = numpyTopic(
  'numpy-shape-ndim-dtype',
  '2.3 Форма, размерность и тип данных',
  3,
  'Разбираем свойства массива `shape`, `ndim`, `size`, `dtype` и их роль в ML.',
  '`shape` показывает форму, `ndim` - число измерений, `size` - число элементов, `dtype` - тип элементов.',
  ['shape', 'ndim', 'size', 'dtype', 'astype', 'n_samples', 'n_features'],
  ['X.shape = (n_samples, n_features)'],
  ['Для sklearn матрица признаков обычно имеет форму `(n_samples, n_features)`.'],
  [
    theoryStep(
      'numpy-shape-attributes',
      '`shape`, `ndim`, `size`',
      'Главные атрибуты показывают форму, размерность и число элементов.',
      [
        section('definition', 'Атрибуты массива', [
          '`arr.shape` показывает форму массива: сколько элементов лежит вдоль каждой оси. `arr.ndim` показывает число измерений. `arr.size` показывает общее число элементов.',
          'Эти атрибуты читаются без скобок, потому что это свойства массива, а не функции. Они помогают быстро понять, что именно лежит в переменной и подходит ли форма для модели.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              arr = np.array([[1, 2, 3],
                              [4, 5, 6]])

              print("shape:", arr.shape)
              print("ndim:", arr.ndim)
              print("size:", arr.size)
            `, 'shape: (2, 3)\nndim: 2\nsize: 6', 'Вывод подписан: видно 2 строки, 3 столбца, 2 измерения и 6 элементов всего.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-shape-dtype',
      '`dtype`',
      '`dtype` показывает тип данных элементов массива.',
      [
        section('definition', 'Тип элементов', [
          '`dtype` показывает, как NumPy хранит элементы: например `int64`, `float64`, `bool`. Обычно внутри одного массива элементы приводятся к одному типу.',
          'Метод `.astype(new_dtype)` создаёт массив с другим типом. Это нужно, когда числа нужно явно сделать вещественными, целыми или булевыми перед дальнейшими вычислениями.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([1, 2, 3])
              y = x.astype(float)

              print("x dtype:", x.dtype)
              print("y dtype:", y.dtype)
              print(y)
            `, 'x dtype: int64\ny dtype: float64\n[1. 2. 3.]', 'После `.astype(float)` значения стали вещественными: это видно по точкам в выводе.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-shape-ml',
      'Форма данных в ML',
      'ML-модели ожидают матрицу объектов и признаков.',
      [
        section('shape-ml', 'Стандартная форма X', [
          'В ML матрица признаков обычно имеет форму `X.shape = (n_samples, n_features)`. Первая размерность - объекты, вторая - признаки.',
          'Например, если есть 100 квартир и 3 признака каждой квартиры, форма будет `(100, 3)`. Target `y` обычно имеет форму `(100,)`, потому что на каждый объект приходится один правильный ответ.',
        ], {
          callouts: [
            callout('Схема', 'X.shape = (n_samples, n_features)\ny.shape = (n_samples,)', 'schema'),
            callout('Важно', 'Многие ошибки в ML начинаются с неправильной формы. Перед обучением полезно проверить `X.shape`, `y.shape`, `X.ndim` и `dtype`.', 'important'),
          ],
        }),
      ],
    ),
    quizStep(
      'numpy-shape-quiz-shape',
      'Определить shape',
      'Проверяем форму двумерного массива.',
      singleQuiz(
        'quiz-numpy-shape',
        'Shape массива',
        'numpy-shape-ndim-dtype',
        'numpy-ml',
        'Какой `shape` у массива `np.array([[1, 2, 3], [4, 5, 6]])`?',
        [
          { id: 'a', text: '`(3, 2)`' },
          { id: 'b', text: '`(2, 3)`' },
          { id: 'c', text: '`(6,)`' },
          { id: 'd', text: '`(2,)`' },
        ],
        'b',
        'В массиве 2 строки и 3 столбца, поэтому форма равна `(2, 3)`.',
      ),
    ),
    quizStep(
      'numpy-shape-quiz-dtype',
      'Определить dtype',
      'Проверяем смысл `dtype`.',
      singleQuiz(
        'quiz-numpy-dtype',
        'Dtype массива',
        'numpy-shape-ndim-dtype',
        'numpy-ml',
        'Что показывает `dtype`?',
        [
          { id: 'a', text: 'Форму массива' },
          { id: 'b', text: 'Количество измерений' },
          { id: 'c', text: 'Тип данных элементов массива' },
          { id: 'd', text: 'Количество строк' },
        ],
        'c',
        '`dtype` показывает тип элементов, например `int64`, `float64` или `bool`.',
      ),
    ),
    practiceStep(
      'numpy-shape-practice',
      'Проверить свойства массива',
      'Выводим `shape`, `ndim` и `dtype`.',
      makeStdinTask(
        'task-numpy-array-properties',
        'Проверить свойства массива',
        'На вход подаются числа. Создайте массив с `dtype=float` и выведите: `shape`, `ndim`, `dtype`.',
        `
          import numpy as np

          # TODO: считайте числа

          # TODO: создайте массив с dtype=float

          # TODO: выведите shape

          # TODO: выведите ndim

          # TODO: выведите dtype
        `,
        [
          { id: 's1', description: 'Три числа', input: '1 2 3', expectedOutput: '(3,)\n1\nfloat64' },
        ],
        [
          { id: 'h1', description: 'Пять чисел', input: '1 2 3 4 5', expectedOutput: '(5,)\n1\nfloat64' },
          { id: 'h2', description: 'Одно число', input: '7', expectedOutput: '(1,)\n1\nfloat64' },
        ],
        `
          import numpy as np

          x = np.array(list(map(float, input().split())), dtype=float)
          print(x.shape)
          print(x.ndim)
          print(x.dtype)
        `,
      ),
    ),
  ],
)

