import { callout, code, makeStdinTask, numpyTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'



export const topicNumpyCreation = numpyTopic(
  'numpy-array-creation',
  '2.2 Создание массивов',
  2,
  'Изучаем `np.array()`, заготовки из одинаковых значений, `np.arange()` и `np.linspace()`.',
  'Разные функции создания массивов нужны для разных стартовых ситуаций: готовые данные, заготовка, диапазон или сетка.',
  ['np.array', 'np.zeros', 'np.ones', 'np.full', 'np.arange', 'np.linspace'],
  ['np.arange(start, stop, step)', 'np.linspace(start, stop, num)'],
  ['`np.array()` создаёт массив из данных; `zeros/ones/full` делают заготовки; `arange/linspace` создают последовательности.'],
  [
    theoryStep(
      'numpy-array-creation-array',
      '`np.array()`',
      '`np.array()` создаёт массив из готовых данных.',
      [
        section('format', 'ЗАДАЧА, синтаксис и параметры', [
          'ЗАДАЧА: создать массив из готовых данных. `np.array(object, dtype=None)` принимает `object` - список, кортеж или вложенную структуру, и необязательный `dtype` - желаемый тип элементов.',
          'Функция возвращает `ndarray`. Если тип не указан, NumPy старается выбрать подходящий тип сам. В ML `np.array()` часто используют для учебных примеров, target, весов и небольших матриц признаков.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([1, 2, 3])

              print(x)
              print(type(x))
            `, '[1 2 3]\n<class \'numpy.ndarray\'>', 'Результат показывает и содержимое массива, и его тип.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-array-creation-fillers',
      'Массивы-заготовки: `zeros`, `ones`, `full`',
      'Похожие функции создают массивы одной формы, заполненные одним значением.',
      [
        section('functions', 'Три функции-заготовки', [
          '`np.zeros(shape)` создаёт нули, `np.ones(shape)` создаёт единицы, `np.full(shape, fill_value)` создаёт массив с выбранным значением. Все три функции удобно изучать вместе: меняется только значение заполнения.',
          'Параметр `shape` задаёт форму. Если нужна матрица, передают tuple, например `(2, 3)`. `np.empty()` существует, но новичку лучше не использовать его как основной способ: он создаёт массив без понятного начального значения.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              print(np.zeros(3))
              print(np.ones((2, 3)))
              print(np.full((2, 2), 7))
            `, '[0. 0. 0.]\n[[1. 1. 1.]\n [1. 1. 1.]]\n[[7 7]\n [7 7]]', 'По выводу видно: `shape` управляет формой, а функция - значением заполнения.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-array-creation-sequences',
      'Последовательности: `arange`, `linspace`',
      '`arange` удобен для шага, `linspace` - для количества точек.',
      [
        section('compare', 'Два способа создать последовательность', [
          '`np.arange(start, stop, step)` создаёт значения с заданным шагом и не включает `stop`. Эта функция удобна, когда важен именно шаг: индексы, диапазоны, номера объектов.',
          '`np.linspace(start, stop, num)` создаёт ровно `num` точек между `start` и `stop`. Эта функция удобна, когда важно количество точек, например для сетки значений или графика.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              print(np.arange(0, 10, 2))
              print(np.linspace(0, 1, 5))
            `, '[0 2 4 6 8]\n[0.   0.25 0.5  0.75 1.  ]', '`arange` не включает 10, а `linspace` включил 0 и 1 и дал ровно 5 точек.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-array-creation-choice',
      'Как выбрать функцию создания',
      'Функцию создания выбирают по ситуации.',
      [
        section('table', 'Быстрый выбор', [
          'Не нужно запоминать функции как разрозненный список. Сначала определите стартовую ситуацию: данные уже есть, нужна заготовка, нужен диапазон с шагом или нужна сетка из фиксированного числа точек.',
        ], {
          table: {
            headers: ['Ситуация', 'Функция'],
            rows: [
              ['Есть готовые данные', '`np.array`'],
              ['Нужны нули', '`np.zeros`'],
              ['Нужны единицы', '`np.ones`'],
              ['Нужно одно значение', '`np.full`'],
              ['Нужен диапазон с шагом', '`np.arange`'],
              ['Нужно N точек между start и stop', '`np.linspace`'],
            ],
          },
          callouts: [
            callout('Вывод', 'Выбирайте функцию по задаче, а не по памяти: готовые данные, заготовка, шаг или количество точек.', 'summary'),
          ],
        }),
      ],
    ),
    quizStep(
      'numpy-array-creation-quiz-function',
      'Выбрать функцию',
      'Проверяем выбор `linspace`.',
      singleQuiz(
        'quiz-numpy-array-creation-function',
        'Функция создания',
        'numpy-array-creation',
        'numpy-ml',
        'Какую функцию лучше использовать, чтобы создать 5 чисел от 0 до 1 включительно с равным шагом?',
        [
          { id: 'a', text: '`np.zeros(5)`' },
          { id: 'b', text: '`np.arange(5)`' },
          { id: 'c', text: '`np.linspace(0, 1, 5)`' },
          { id: 'd', text: '`np.full(5, 1)`' },
        ],
        'c',
        '`np.linspace(0, 1, 5)` создаёт ровно 5 равномерных точек от 0 до 1 включительно.',
      ),
    ),
    quizStep(
      'numpy-array-creation-quiz-arange',
      'Что получится на выходе',
      'Проверяем, что `stop` в `arange` не включается.',
      singleQuiz(
        'quiz-numpy-array-creation-arange',
        'Результат arange',
        'numpy-array-creation',
        'numpy-ml',
        'Что вернёт `np.arange(0, 6, 2)`?',
        [
          { id: 'a', text: '`[0, 2, 4]`' },
          { id: 'b', text: '`[0, 2, 4, 6]`' },
          { id: 'c', text: '`[2, 4, 6]`' },
          { id: 'd', text: '`[0, 1, 2, 3, 4, 5, 6]`' },
        ],
        'a',
        '`np.arange()` не включает `stop`, поэтому значение 6 не попадает в массив.',
      ),
    ),
    practiceStep(
      'numpy-array-creation-practice',
      'Создать массивы',
      'Практика на функции создания массивов.',
      makeStdinTask(
        'task-numpy-create-arrays',
        'Создать массивы',
        'На вход подаются `n` и `k`. Создайте массив из нулей длины `n`, массив чисел от `0` до `n - 1`, массив из `k` равномерных точек от `0` до `1`. Выведите каждый массив с новой строки.',
        `
          import numpy as np

          # TODO: считайте n и k

          # TODO: создайте массив из нулей длины n

          # TODO: создайте массив от 0 до n - 1

          # TODO: создайте k точек от 0 до 1

          # TODO: выведите результаты
        `,
        [
          { id: 's1', description: 'n=4, k=3', input: '4 3', expectedOutput: '[0. 0. 0. 0.]\n[0 1 2 3]\n[0.  0.5 1. ]' },
        ],
        [
          { id: 'h1', description: 'n=3, k=5', input: '3 5', expectedOutput: '[0. 0. 0.]\n[0 1 2]\n[0.   0.25 0.5  0.75 1.  ]' },
          { id: 'h2', description: 'n=1, k=2', input: '1 2', expectedOutput: '[0.]\n[0]\n[0. 1.]' },
        ],
        `
          import numpy as np

          n, k = map(int, input().split())
          zeros = np.zeros(n)
          sequence = np.arange(n)
          points = np.linspace(0, 1, k)
          print(zeros)
          print(sequence)
          print(points)
        `,
      ),
    ),
  ],
)

