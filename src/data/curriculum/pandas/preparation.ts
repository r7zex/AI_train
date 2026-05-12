import { callout, code, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasTypesAndPreparation = pandasTopic(
  'pandas-types-preparation',
  '3.7 Типы данных и подготовка таблицы к ML',
  7,
  'Доводим таблицу до ML-формата: типы, категории, `X` и `y`.',
  'Pandas-таблица ещё не значит, что данные готовы к модели: нужно привести типы, закодировать категории и отделить target.',
  ['dtypes', 'astype', 'get_dummies', 'one-hot', 'X', 'y', 'target leakage'],
  ['X = признаки', 'y = целевая переменная', 'pd.get_dummies() -> one-hot признаки'],
  [
    'Проверяем типы через `dtypes`.',
    'Исправляем типы через `astype()`.',
    'Категории кодируем через `pd.get_dummies()`.',
    'Target не должен оставаться среди признаков.',
  ],
  [
    theoryStep(
      'pandas-prep-scenario',
      'От таблицы к `X` и `y`',
      'Показываем финальный шаг перед sklearn.',
      [
        section('workflow', 'Пять шагов подготовки', [
          'Pandas-таблица может выглядеть аккуратно, но модель всё ещё может не принять её: строки нужно закодировать, типы привести, target отделить.',
          'Рабочий сценарий: проверить `dtypes`, исправить типы через `astype`, закодировать категории, выделить `X`, выделить `y`.',
        ], {
          bullets: [
            'проверить `dtypes`;',
            'исправить типы через `astype()`;',
            'закодировать категориальные признаки;',
            'выделить `X` - признаки;',
            'выделить `y` - целевую переменную.',
          ],
        }),
        section('encoding', 'Категории нужно превратить в числа', [
          'Многие модели не умеют напрямую работать со строками вроде `center` или `north`. Один из простых способов - one-hot encoding через `pd.get_dummies()`.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "area": [35, 52, 80],
                  "district": ["center", "north", "center"],
                  "price": [8.2, 9.1, 18.4],
              })

              features = pd.get_dummies(df[["area", "district"]])
              target = df["price"]

              print(features)
              print(target)
            `, `
                 area  district_center  district_north
              0    35             True           False
              1    52            False            True
              2    80             True           False
              0     8.2
              1     9.1
              2    18.4
              Name: price, dtype: float64
            `, '`district` превратился в несколько 0/1-признаков, а `price` отделён как target.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-prep-checkpoint',
      'Что теперь умеем',
      'Закрепляем требования к таблице перед ML.',
      [
        section('checkpoint', 'Промежуточный вывод', [
          'После этого шага таблица становится ближе к виду, который можно передать в sklearn.',
        ], {
          bullets: [
            'проверять и исправлять типы столбцов;',
            'понимать, почему строки нужно кодировать;',
            'создавать one-hot признаки через `pd.get_dummies()`;',
            'отделять `X` от `y`;',
            'не оставлять target среди признаков.',
          ],
          callouts: [
            callout('Важно', 'Модель не должна видеть target среди features. Иначе возникает утечка данных: качество на обучении выглядит отличным, но в реальности модель использует ответ, которого не будет при предсказании.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-prep-types',
      'Типы данных перед кодированием',
      'Показываем, почему `dtypes` важен перед ML.',
      [
        section('types', 'Числа могут оказаться строками', [
          'После чтения CSV числовой столбец иногда оказывается строковым: из-за пробелов, запятых вместо точек, валютных символов или смешанных значений. Поэтому `dtypes` проверяют до кодирования и обучения.',
          '`astype()` полезен, когда данные уже чистые и их нужно привести к ожидаемому типу. Если в столбце есть мусорные строки, сначала нужно разобраться с ними, иначе приведение типа упадёт или даст неверный результат.',
        ], {
          callouts: [
            callout('Где используется', 'Исправление числовых признаков, подготовка категорий к one-hot encoding, проверка готовности таблицы к sklearn.', 'example'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-prep-final-check',
      'Финальная проверка `X` и `y`',
      'Закрепляем критерии готовности таблицы.',
      [
        section('final', 'Что проверить перед передачей в sklearn', [
          'Перед моделью полезно проверить, что `X` не содержит target, все нужные категории закодированы, числовые столбцы имеют числовой тип, а число строк `X` совпадает с длиной `y`.',
          'Это простой финальный барьер. Он не гарантирует хорошую модель, но предотвращает типичные технические ошибки: строки вместо чисел, target leakage и несовпадение объектов с ответами.',
        ], {
          callouts: [
            callout('Промежуточный вывод', 'Готовая к ML таблица - это не просто DataFrame, а осмысленно выбранные признаки `X` и отдельный target `y` без утечки ответа.', 'summary'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-prep-quiz-target',
      'Target leakage',
      'Проверяем понимание утечки target.',
      singleQuiz(
        'quiz-pandas-prep-target',
        'Target',
        'pandas-types-preparation',
        'pandas-eda',
        'Почему `price` нельзя оставлять в `X`, если мы пытаемся предсказывать `price`?',
        [
          { id: 'a', text: 'Модель увидит правильный ответ среди признаков' },
          { id: 'b', text: 'Pandas удалит все строки' },
          { id: 'c', text: '`price` всегда должен быть строкой' },
          { id: 'd', text: 'Так нельзя создать DataFrame' },
        ],
        'a',
        'Target среди признаков создаёт утечку данных и делает оценку качества нереалистичной.',
      ),
    ),
    quizStep(
      'pandas-prep-quiz-dummies',
      'Кодирование категорий',
      'Проверяем выбор инструмента.',
      singleQuiz(
        'quiz-pandas-prep-dummies',
        'get_dummies',
        'pandas-types-preparation',
        'pandas-eda',
        'Что делает `pd.get_dummies()`?',
        [
          { id: 'a', text: 'Превращает категориальные столбцы в one-hot признаки' },
          { id: 'b', text: 'Удаляет все числовые столбцы' },
          { id: 'c', text: 'Считает среднее по группам' },
          { id: 'd', text: 'Читает CSV-файл' },
        ],
        'a',
        '`get_dummies()` создаёт отдельные 0/1-признаки для категорий.',
      ),
    ),
    practiceStep(
      'pandas-prep-practice',
      'Подготовить X и y',
      'Кодируем категорию и отделяем target.',
      makeStdinTask(
        'task-pandas-prepare-x-y',
        'Подготовить X и y',
        'Создайте DataFrame из готового словаря. Сформируйте `X` из `area` и `district` через one-hot encoding, `y` из `price`. Выведите `X`, затем `y`.',
        `
          import pandas as pd

          data = {
              "area": [35, 52, 80],
              "district": ["center", "north", "center"],
              "price": [8.2, 9.1, 18.4],
          }

          # TODO: создайте DataFrame

          # TODO: сформируйте X без target и закодируйте категории

          # TODO: сформируйте y

          # TODO: выведите X и y
        `,
        [
          { id: 's1', description: 'X и y', expectedOutput: '   area  district_center  district_north\n0    35             True           False\n1    52            False            True\n2    80             True           False\n0     8.2\n1     9.1\n2    18.4\nName: price, dtype: float64' },
        ],
        [
          { id: 'h1', description: 'Target не в X', expectedOutput: '   area  district_center  district_north\n0    35             True           False\n1    52            False            True\n2    80             True           False\n0     8.2\n1     9.1\n2    18.4\nName: price, dtype: float64' },
        ],
        `
          import pandas as pd

          data = {
              "area": [35, 52, 80],
              "district": ["center", "north", "center"],
              "price": [8.2, 9.1, 18.4],
          }

          df = pd.DataFrame(data)
          X = pd.get_dummies(df[["area", "district"]])
          y = df["price"]
          print(X)
          print(y)
        `,
      ),
    ),
  ],
)
