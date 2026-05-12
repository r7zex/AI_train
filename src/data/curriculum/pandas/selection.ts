import { callout, code, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasSelection = pandasTopic(
  'pandas-selection',
  '3.3 Выбор столбцов и строк',
  3,
  'Учимся выбирать target, features, строки и подтаблицы через скобки, `loc` и `iloc`.',
  'После первого осмотра почти всегда нужно выбрать нужные признаки, целевой столбец или подтаблицу.',
  ['Series', 'DataFrame', 'loc', 'iloc', 'features', 'target'],
  ['df["col"] -> Series', 'df[["col"]] -> DataFrame', 'loc -> имена', 'iloc -> позиции'],
  [
    'Один столбец через одинарные скобки обычно даёт `Series`.',
    'Несколько столбцов через двойные скобки дают `DataFrame`.',
    '`loc` выбирает по именам, `iloc` - по позициям.',
  ],
  [
    theoryStep(
      'pandas-selection-scenario',
      'Выбрать признаки и target',
      'Связываем выбор столбцов с подготовкой данных к модели.',
      [
        section('features-target', 'Что обычно выбирают', [
          'После первого осмотра таблицы почти всегда нужно выделить целевую переменную и признаки. Например, `price` может быть target, а `area`, `rooms`, `district` - features.',
          'Выбор столбцов влияет на дальнейшую форму данных: модель ждёт матрицу признаков `X`, а не случайно выбранный `Series`.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "area": [35, 52, 80],
                  "rooms": [1, 2, 3],
                  "price": [8.2, 9.1, 18.4],
              })

              y = df["price"]
              X = df[["area", "rooms"]]

              print(type(y).__name__)
              print(type(X).__name__)
            `, `
              Series
              DataFrame
            `, '`y` стал одним столбцом Series, а `X` остался таблицей DataFrame с несколькими признаками.'),
          ],
        }),
        section('loc-iloc', '`loc` и `iloc`', [
          '`loc` используют, когда удобно мыслить именами строк и столбцов. `iloc` используют, когда нужны позиции: первая строка, первые три столбца, диапазон индексов.',
          'В учебных задачах это помогает не путать “колонка называется `price`” и “колонка находится на позиции 2”.',
        ], {
          table: {
            headers: ['Инструмент', 'Выбирает по', 'Пример'],
            rows: [
              ['`df["price"]`', 'имени одного столбца', 'target как Series'],
              ['`df[["area", "rooms"]]`', 'списку имён столбцов', 'features как DataFrame'],
              ['`df.loc[rows, cols]`', 'меткам', '`df.loc[:, "price"]`'],
              ['`df.iloc[rows, cols]`', 'позициям', '`df.iloc[:5, :2]`'],
            ],
          },
        }),
      ],
    ),
    theoryStep(
      'pandas-selection-checkpoint',
      'Что теперь умеем',
      'Закрепляем выбор данных без путаницы форм.',
      [
        section('checkpoint', 'Промежуточный вывод', [
          'Выбор строк и столбцов - первый шаг к явному разделению данных на `X` и `y`.',
        ], {
          bullets: [
            'выбирать один столбец как `Series`;',
            'выбирать несколько признаков как `DataFrame`;',
            'использовать `loc` для имён;',
            'использовать `iloc` для позиций;',
            'проверять тип результата перед передачей дальше.',
          ],
          callouts: [
            callout('Типичная ошибка', 'Ожидать DataFrame, но получить Series из-за одинарных скобок: `df["price"]`. Если нужна таблица с одним столбцом, используйте `df[["price"]]`.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-selection-ml-use',
      'Выбор данных перед ML',
      'Показываем, как выбор столбцов влияет на модель.',
      [
        section('ml', 'Не все столбцы должны попасть в `X`', [
          'В таблице могут быть служебные идентификаторы, текстовые комментарии, target и признаки. Выбор столбцов - это момент, где мы явно решаем, что модель увидит на входе.',
          'Если случайно оставить target внутри `X`, получится утечка данных. Если случайно выбрать один столбец как `Series`, а дальше ожидать таблицу, можно получить ошибку формы. Поэтому после выбора полезно проверить `type(X)` и `X.shape`.',
        ], {
          callouts: [
            callout('Где используется', 'Выделение target, сбор признаков, отладка формы перед sklearn, подготовка подтаблицы для анализа.', 'example'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-selection-row-column',
      'Строки и столбцы вместе',
      'Объясняем комбинированный выбор.',
      [
        section('combined', 'Одна операция выбирает и строки, и столбцы', [
          '`loc` и `iloc` удобны тем, что позволяют одновременно выбрать строки и столбцы. Например, можно взять первые строки и только нужные признаки, или выбрать строки по меткам и конкретный столбец target.',
          'Это делает код более явным, чем цепочка случайных срезов. Особенно важно не путать позиции и имена: `iloc` не знает названий колонок, а `loc` не выбирает по порядковому номеру, если индекс не совпадает с позициями.',
        ], {
          callouts: [
            callout('Промежуточный вывод', '`loc` отвечает на вопрос “какие имена?”, `iloc` - “какие позиции?”. Для признаков по названиям обычно читаемее `loc` или список колонок.', 'summary'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-selection-quiz-return',
      'Series или DataFrame',
      'Проверяем форму результата.',
      singleQuiz(
        'quiz-pandas-selection-return',
        'Выбор столбца',
        'pandas-selection',
        'pandas-eda',
        'Как выбрать столбец `price`, сохранив результат как DataFrame?',
        [
          { id: 'a', text: '`df[["price"]]`' },
          { id: 'b', text: '`df["price"]`' },
          { id: 'c', text: '`df.price.values[0]`' },
          { id: 'd', text: '`df.iloc["price"]`' },
        ],
        'a',
        'Двойные скобки передают список столбцов и возвращают DataFrame.',
      ),
    ),
    quizStep(
      'pandas-selection-quiz-loc',
      '`loc` или `iloc`',
      'Проверяем выбор по именам и позициям.',
      singleQuiz(
        'quiz-pandas-selection-loc',
        'loc и iloc',
        'pandas-selection',
        'pandas-eda',
        'Что выбрать, если нужны строки и столбцы по их позициям?',
        [
          { id: 'a', text: '`iloc`' },
          { id: 'b', text: '`loc`' },
          { id: 'c', text: '`describe`' },
          { id: 'd', text: '`read_csv`' },
        ],
        'a',
        '`iloc` выбирает по числовым позициям.',
      ),
    ),
    practiceStep(
      'pandas-selection-practice',
      'Выделить features',
      'Выбираем признаки без target.',
      makeStdinTask(
        'task-pandas-select-features',
        'Выделить features',
        'Создайте DataFrame из готового словаря и выведите таблицу только с колонками `area` и `rooms`.',
        `
          import pandas as pd

          data = {
              "area": [35, 52, 80],
              "rooms": [1, 2, 3],
              "price": [8.2, 9.1, 18.4],
          }

          # TODO: создайте DataFrame

          # TODO: выберите признаки area и rooms

          # TODO: выведите выбранную таблицу
        `,
        [
          { id: 's1', description: 'Два признака', expectedOutput: '   area  rooms\n0    35      1\n1    52      2\n2    80      3' },
        ],
        [
          { id: 'h1', description: 'Проверка формы DataFrame', expectedOutput: '   area  rooms\n0    35      1\n1    52      2\n2    80      3' },
        ],
        `
          import pandas as pd

          data = {
              "area": [35, 52, 80],
              "rooms": [1, 2, 3],
              "price": [8.2, 9.1, 18.4],
          }

          df = pd.DataFrame(data)
          features = df[["area", "rooms"]]
          print(features)
        `,
      ),
    ),
  ],
)
