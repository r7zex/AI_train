import { code, makeStdinTask, numpyTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'



export const topicNumpyMasks = numpyTopic(
  'numpy-masks-where',
  '2.8 Маски и np.where',
  8,
  'Используем булевы маски, фильтрацию, логические операторы, `np.where`, `np.any` и `np.all`.',
  'Булева маска выбирает элементы по условию, а `np.where()` заменяет значения по условию.',
  ['булева маска', 'фильтрация', 'np.where', 'np.any', 'np.all'],
  ['mask = x > 10', 'np.where(condition, value_if_true, value_if_false)'],
  ['Маски нужны для фильтрации значений, поиска выбросов и условной замены.'],
  [
    theoryStep(
      'numpy-masks-mask',
      'Булевы маски',
      'Булева маска - массив из True и False.',
      [
        section('mask', 'Условие для каждого элемента', [
          'Булева маска получается, когда мы сравниваем массив с условием: `x > 10`, `x == 0`, `x != -1`. Каждый элемент маски отвечает на вопрос, выполняется ли условие для соответствующего элемента исходного массива.',
          'Маски - базовый инструмент фильтрации. Они помогают выбирать значения, находить выбросы, строить простые признаки и проверять качество данных.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([5, 12, 7, 20])

              mask = x > 10
              print(mask)
            `, '[False  True False  True]', 'Условие истинно только для 12 и 20.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-masks-filter-logic',
      'Фильтрация и логические операторы',
      'Маску можно применить к массиву, а условия можно объединять.',
      [
        section('filter', 'Фильтрация по маске', [
          'Запись `x[mask]` возвращает только элементы, для которых в маске стоит `True`. Если условий несколько, используйте `&` для “и”, `|` для “или”, `~` для отрицания.',
          'В NumPy скобки вокруг сравнений обязательны: пишем `(x > 5) & (x < 20)`, а не `x > 5 & x < 20`.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([5, 12, 7, 20])

              mask = (x > 5) & (x < 20)
              print(mask)
              print(x[mask])
            `, '[False  True  True False]\n[12  7]', 'В результат попали значения больше 5 и меньше 20.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-masks-where',
      '`np.where`',
      '`np.where()` выбирает значения по условию.',
      [
        section('syntax', 'Условная замена', [
          '`np.where(condition, value_if_true, value_if_false)` возвращает массив той же формы, где для `True` берётся первое значение, а для `False` - второе.',
          'Это удобно для быстрых меток, ограничений, замены выбросов и простых rule-based признаков. В отличие от фильтрации, `np.where` обычно не удаляет элементы, а заменяет их.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([5, 12, 7, 20])

              labels = np.where(x > 10, "big", "small")
              print(labels)
            `, "['small' 'big' 'small' 'big']", 'Форма сохранилась: каждому числу соответствует строковая метка.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-masks-any-all',
      '`np.any` и `np.all`',
      '`np.any` проверяет хотя бы одно True, `np.all` - все True.',
      [
        section('checks', 'Проверка маски целиком', [
          '`np.any(mask)` отвечает, есть ли в маске хотя бы одно `True`. `np.all(mask)` отвечает, все ли значения равны `True`.',
          'Эти функции полезны для проверок качества данных: есть ли выбросы, все ли значения положительные, все ли элементы прошли фильтр, остались ли подходящие строки после условия.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              x = np.array([5, 12, 7, 20])
              mask = x > 10

              print("mask:", mask)
              print("any:", np.any(mask))
              print("all:", np.all(mask))
            `, 'mask: [False  True False  True]\nany: True\nall: False', 'Хотя бы одно значение больше 10 есть, но не все значения больше 10.'),
          ],
        }),
      ],
    ),
    quizStep(
      'numpy-masks-quiz-mask',
      'Что вернёт маска',
      'Проверяем результат условия.',
      singleQuiz(
        'quiz-numpy-masks-mask',
        'Булева маска',
        'numpy-masks-where',
        'numpy-ml',
        'Что вернёт `np.array([1, 5, 10]) > 4`?',
        [
          { id: 'a', text: '`[False, True, True]`' },
          { id: 'b', text: '`[True, False, False]`' },
          { id: 'c', text: '`[1, 5, 10]`' },
          { id: 'd', text: '`[5, 10]`' },
        ],
        'a',
        'Условие `> 4` не выполняется для 1 и выполняется для 5 и 10.',
      ),
    ),
    quizStep(
      'numpy-masks-quiz-where',
      'Что выберет where',
      'Проверяем условную замену.',
      singleQuiz(
        'quiz-numpy-masks-where',
        'np.where',
        'numpy-masks-where',
        'numpy-ml',
        'Что делает `np.where(x > 0, 1, 0)`?',
        [
          { id: 'a', text: 'Заменяет положительные значения на 1, остальные на 0' },
          { id: 'b', text: 'Удаляет все нули' },
          { id: 'c', text: 'Сортирует массив' },
          { id: 'd', text: 'Меняет форму массива' },
        ],
        'a',
        '`np.where()` выбирает 1 там, где условие истинно, и 0 там, где оно ложно.',
      ),
    ),
    practiceStep(
      'numpy-masks-practice',
      'Отфильтровать значения',
      'Практика на булевую маску.',
      makeStdinTask(
        'task-numpy-filter-values',
        'Отфильтровать значения',
        'На вход подаются числа. Выведите только числа больше 10.',
        `
          import numpy as np

          # TODO: считайте числа

          # TODO: создайте массив

          # TODO: создайте маску

          # TODO: примените маску

          # TODO: выведите результат
        `,
        [
          { id: 's1', description: 'Есть значения больше 10', input: '5 12 7 20', expectedOutput: '[12 20]' },
        ],
        [
          { id: 'h1', description: 'Нет значений больше 10', input: '1 2 3', expectedOutput: '[]' },
          { id: 'h2', description: 'Граница и значения выше', input: '11 10 15', expectedOutput: '[11 15]' },
        ],
        `
          import numpy as np

          x = np.array(list(map(int, input().split())))
          mask = x > 10
          filtered = x[mask]
          print(filtered)
        `,
      ),
    ),
  ],
)

export const topicNumpyRandom = numpyTopic(
  'numpy-random-reproducibility',
  '2.10 Random и воспроизводимость',
  10,
  'Используем `default_rng`, seed и основные методы генератора случайных чисел.',
  'Seed фиксирует генератор, чтобы случайный эксперимент можно было повторить.',
  ['random', 'seed', 'default_rng', 'integers', 'normal', 'uniform', 'permutation', 'choice'],
  ['rng = np.random.default_rng(seed)'],
  ['Случайность нужна для перемешивания, train/test split, инициализации весов и синтетических данных.'],
  [
    theoryStep(
      'numpy-random-why',
      'Зачем нужна случайность',
      'Случайность в ML нужна часто, но она должна быть управляемой.',
      [
        section('uses', 'Где нужна случайность', [
          'Случайность в ML нужна для перемешивания данных, разделения train/test, инициализации весов, генерации синтетических данных, выбора случайной подвыборки и добавления шума.',
          'Но случайность должна быть управляемой. Если эксперимент каждый раз даёт другой результат, трудно понять, модель стала лучше из-за изменения кода или просто из-за случайного разбиения.',
        ], {
          table: {
            headers: ['Ситуация', 'Зачем random'],
            rows: [
              ['train/test split', 'случайно разделить объекты'],
              ['инициализация', 'задать стартовые веса'],
              ['синтетические данные', 'создать учебный пример'],
              ['перемешивание', 'убрать порядок объектов'],
            ],
          },
        }),
      ],
    ),
    theoryStep(
      'numpy-random-seed',
      'Seed',
      'Seed позволяет повторить последовательность псевдослучайных чисел.',
      [
        section('seed', 'Воспроизводимость', [
          'Seed фиксирует начальное состояние генератора случайных чисел. Если seed одинаковый и код тот же, результат можно повторить. Это удобно для тестов, учебных примеров и честного сравнения моделей.',
          'Seed не делает числа “неслучайными” по смыслу эксперимента. Он делает последовательность воспроизводимой: другой человек сможет получить такой же результат у себя.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              rng = np.random.default_rng(42)

              print(rng.integers(0, 10, size=5))
            `, '[0 7 6 4 4]', 'При seed 42 этот пример воспроизводимо печатает один и тот же массив.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-random-default-rng',
      '`default_rng`',
      '`default_rng()` создаёт современный генератор NumPy.',
      [
        section('rng', 'Генератор как объект', [
          'Современный стиль NumPy - создать генератор `rng = np.random.default_rng(seed)`, а затем вызывать методы генератора. Так состояние случайности хранится в одном объекте.',
          'Это лучше, чем разбрасывать глобальные random-вызовы по проекту: легче контролировать seed, повторять эксперименты и передавать генератор в функции.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              rng = np.random.default_rng(7)

              print("one:", rng.integers(0, 10, size=3))
              print("next:", rng.integers(0, 10, size=3))
            `, 'one: [9 6 6]\nnext: [8 5 7]', 'Один генератор выдаёт последовательность: второй вызов продолжает состояние первого.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'numpy-random-functions',
      'Основные методы random',
      'Близкие методы random лучше изучать вместе.',
      [
        section('functions', 'Пять частых методов', [
          '`rng.integers(low, high, size)` генерирует целые числа. `rng.normal(loc, scale, size)` - нормальное распределение. `rng.uniform(low, high, size)` - равномерные числа. `rng.permutation(x)` перемешивает элементы. `rng.choice(x, size)` выбирает элементы из набора.',
          'Не нужно выносить каждый метод в отдельный урок: все они отвечают на один вопрос - какой случайный объект нужен прямо сейчас.',
        ], {
          codeExamples: [
            code('python', `
              import numpy as np

              rng = np.random.default_rng(42)

              print(rng.integers(0, 10, size=3))
              print(np.round(rng.normal(0, 1, size=3), 2))
              print(np.round(rng.uniform(0, 1, size=3), 2))
              print(rng.permutation([1, 2, 3, 4]))
              print(rng.choice(["train", "test"], size=5))
            `, "[0 7 6]\n[ 0.75  0.94 -1.95]\n[0.98 0.76 0.79]\n[4 1 3 2]\n['train' 'test' 'train' 'train' 'test']", 'Вывод показывает разные типы случайности: целые, нормальные, равномерные, перестановку и выбор из категорий.'),
          ],
          table: {
            headers: ['Метод', 'Когда использовать'],
            rows: [
              ['`rng.integers`', 'случайные целые числа или индексы'],
              ['`rng.normal`', 'шум, синтетические признаки около среднего'],
              ['`rng.uniform`', 'равномерные значения в диапазоне'],
              ['`rng.permutation`', 'перемешать порядок объектов'],
              ['`rng.choice`', 'случайно выбрать элементы или метки'],
            ],
          },
        }),
      ],
    ),
    quizStep(
      'numpy-random-quiz-seed',
      'Зачем нужен seed',
      'Проверяем воспроизводимость.',
      singleQuiz(
        'quiz-numpy-random-seed',
        'Seed',
        'numpy-random-reproducibility',
        'numpy-ml',
        'Зачем фиксировать seed?',
        [
          { id: 'a', text: 'Чтобы эксперимент можно было повторить' },
          { id: 'b', text: 'Чтобы массивы всегда были только нулевыми' },
          { id: 'c', text: 'Чтобы NumPy работал без Python' },
          { id: 'd', text: 'Чтобы отключить все случайные числа' },
        ],
        'a',
        'Одинаковый seed позволяет повторить последовательность псевдослучайных чисел.',
      ),
    ),
    quizStep(
      'numpy-random-quiz-function',
      'Какую функцию выбрать',
      'Проверяем перестановку.',
      singleQuiz(
        'quiz-numpy-random-function',
        'Функции random',
        'numpy-random-reproducibility',
        'numpy-ml',
        'Какая функция создаёт случайную перестановку элементов?',
        [
          { id: 'a', text: '`rng.normal`' },
          { id: 'b', text: '`rng.integers`' },
          { id: 'c', text: '`rng.permutation`' },
          { id: 'd', text: '`np.array`' },
        ],
        'c',
        '`rng.permutation()` возвращает случайную перестановку элементов.',
      ),
    ),
    practiceStep(
      'numpy-random-practice',
      'Сгенерировать данные',
      'Практика на `default_rng()` и `integers()`.',
      makeStdinTask(
        'task-numpy-random-integers',
        'Сгенерировать данные',
        'На вход подаются `seed` и `n`. Создайте генератор `np.random.default_rng(seed)`. Сгенерируйте `n` случайных целых чисел от 0 до 10 не включая 10. Выведите массив.',
        `
          import numpy as np

          # TODO: считайте seed и n

          # TODO: создайте генератор

          # TODO: сгенерируйте случайные целые числа

          # TODO: выведите массив
        `,
        [
          { id: 's1', description: 'Seed 42', input: '42 5', expectedOutput: '[0 7 6 4 4]' },
        ],
        [
          { id: 'h1', description: 'Seed 1', input: '1 4', expectedOutput: '[4 5 7 9]' },
          { id: 'h2', description: 'Seed 7', input: '7 3', expectedOutput: '[9 6 6]' },
        ],
        `
          import numpy as np

          seed, n = map(int, input().split())
          rng = np.random.default_rng(seed)
          values = rng.integers(0, 10, size=n)
          print(values)
        `,
      ),
    ),
  ],
)
