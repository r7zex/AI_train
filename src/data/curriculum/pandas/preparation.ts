import { callout, code, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasTypesAndPreparation = pandasTopic(
  'pandas-types-preparation',
  '3.7 Типы данных и подготовка таблицы к ML',
  7,
  'Проверяем типы столбцов, кодируем категории и разделяем таблицу на признаки X и target y.',
  'Перед обучением модели pandas-таблицу нужно привести к понятным типам, закодировать категории и отделить target от признаков.',
  ['dtypes', 'astype', 'categorical features', 'get_dummies', 'X', 'y', 'target'],
  ['X = df[feature_cols]', 'y = df[target_col]', 'pd.get_dummies(df, columns=[...])'],
  [
    '`astype()` меняет тип столбца.',
    'Строковые категории нужно кодировать перед большинством ML-моделей.',
    'Target нельзя включать в `X`, иначе возникнет утечка данных.',
  ],
  [
    theoryStep(
      'pandas-types-astype',
      '`astype()` и типы столбцов',
      'Проверяем и меняем типы перед дальнейшей обработкой.',
      [
        section('astype', 'Типы данных', [
          '**ЗАДАЧА:** убедиться, что числа действительно числовые, категории читаются как категории или строки, а даты не остались обычным текстом.',
          '**СИНТАКСИС:** `df.dtypes` показывает типы столбцов, `df["col"].astype(...)` возвращает столбец с новым типом. Например, `astype(int)`, `astype(float)`, `astype("category")`.',
          '**ГДЕ ИСПОЛЬЗУЕТСЯ В ML:** если числовой столбец прочитан как `object`, модель может не принять данные. Ошибочный тип часто указывает на пробелы, запятые вместо точек или смешанные значения.',
        ], {
          codeExamples: [
            code('python', `
              print(df.dtypes)
              df["rooms"] = df["rooms"].astype(int)
            `, 'Типы проверены, столбец `rooms` приведён к целому типу.', 'Перед `astype()` нужно убедиться, что в столбце нет несовместимых значений.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-categorical-features',
      'Категориальные признаки',
      'Большинство моделей не принимает сырые строки как числа.',
      [
        section('categories', 'Почему строки нужно кодировать', [
          '**ЗАДАЧА:** превратить категории в числовое представление. Район, город, пол, тариф или тип устройства несут информацию, но строка `"Moscow"` сама по себе не является числом для модели.',
          '**СИНТАКСИС:** простой вариант - `pd.get_dummies(df, columns=["district"])`. Он создаёт отдельные 0/1-столбцы для категорий.',
          '**ВАЖНО:** не каждое кодирование одинаково хорошо. One-hot подходит для небольшого числа категорий, но при тысячах уникальных значений может создать слишком широкую таблицу.',
        ], {
          codeExamples: [
            code('python', `
              df_encoded = pd.get_dummies(df, columns=["district"], drop_first=False)
              print(df_encoded.head())
            `, 'Вместо `district` появились столбцы вида `district_Center`, `district_North`.', 'Так модель получает числовые индикаторы категорий.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-split-x-y',
      'Разделение на `X` и `y`',
      'Признаки и целевую переменную нужно хранить отдельно.',
      [
        section('xy', 'Features и target', [
          '**ЗАДАЧА:** отделить входы модели от правильного ответа. `X` - таблица признаков, `y` - целевая переменная, которую модель должна предсказывать.',
          '**СИНТАКСИС:** `X = df[feature_cols]`, `y = df[target_col]`. В `feature_cols` не должен попадать target и столбцы, которые раскрывают target напрямую.',
          '**ГДЕ ИСПОЛЬЗУЕТСЯ В ML:** почти все библиотеки обучения ожидают пару `X`, `y`. Для sklearn это стандартный интерфейс: `model.fit(X, y)`.',
        ], {
          codeExamples: [
            code('python', `
              feature_cols = ["area", "rooms"]
              X = df[feature_cols]
              y = df["price"]

              print(X.head())
              print(y.head())
            `, 'Сначала выводятся признаки, затем целевой столбец.', '`price` не входит в `X`, потому что это ответ, который модель должна научиться предсказывать.'),
          ],
          callouts: [
            callout('Важно', 'Target внутри признаков почти всегда приводит к утечке данных и нереалистично высокой оценке качества.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-mini-pipeline',
      'Мини-пайплайн pandas -> sklearn',
      'Собираем базовую последовательность подготовки таблицы.',
      [
        section('pipeline', 'От CSV к матрице признаков', [
          '**ЗАДАЧА:** привести таблицу к виду, который можно передать модели. Минимальная цепочка: прочитать данные, проверить структуру, обработать пропуски, закодировать категории, выбрать `X` и `y`.',
          '**ПРИМЕР:** `df = pd.read_csv(...)`, затем `df.isna().sum()`, `fillna()`, `pd.get_dummies()`, `X = df_encoded[feature_cols]`, `y = df_encoded["target"]`.',
          '**ВЫВОД:** pandas не обучает модель сам по себе в этом курсе, но делает данные пригодными для обучения. Хорошая подготовка часто важнее выбора сложной модели.',
        ], {
          codeExamples: [
            code('python', `
              df_encoded = pd.get_dummies(df, columns=["district"], dtype=int)

              feature_cols = ["area", "rooms", "district_Center", "district_North"]
              X = df_encoded[feature_cols]
              y = df_encoded["price"]

              print(X.shape)
              print(y.shape)
            `, '(3, 4)\n(3,)', 'У `X` две размерности: объекты и признаки. У `y` одна размерность: ответ на каждый объект.'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-prep-quiz-target',
      'Что является target',
      'Определяем целевую переменную.',
      singleQuiz(
        'quiz-pandas-target',
        'Target',
        'pandas-types-preparation',
        'pandas-eda',
        'Если задача - предсказать цену квартиры, какой столбец обычно будет `y`?',
        [
          { id: 'a', text: '`price`' },
          { id: 'b', text: '`area`' },
          { id: 'c', text: '`rooms`' },
          { id: 'd', text: '`district`' },
        ],
        'a',
        '`y` хранит целевую переменную, то есть ответ для обучения. В задаче предсказания цены target - `price`.',
      ),
    ),
    quizStep(
      'pandas-prep-quiz-features',
      'Как выбрать X',
      'Проверяем запрет на утечку target.',
      singleQuiz(
        'quiz-pandas-features-no-target',
        'Признаки',
        'pandas-types-preparation',
        'pandas-eda',
        'Почему target нельзя включать в `feature_cols`?',
        [
          { id: 'a', text: 'Модель увидит правильный ответ среди входных признаков' },
          { id: 'b', text: 'Pandas не умеет выбирать несколько столбцов' },
          { id: 'c', text: 'Так `head()` перестанет работать' },
          { id: 'd', text: 'Так все числа станут строками' },
        ],
        'a',
        'Если target попадает в `X`, модель получает ответ на входе. Это утечка данных и такая оценка качества не отражает реальную задачу.',
      ),
    ),
    practiceStep(
      'pandas-prep-practice',
      'Подготовить X и y',
      'Кодируем категорию и отделяем признаки от target.',
      makeStdinTask(
        'task-pandas-prepare-xy',
        'Подготовить X и y',
        'На вход подаётся CSV с колонками `area`, `rooms`, `district`, `price`. Закодируйте `district` через `pd.get_dummies`, выберите признаки и target, выведите `X.shape`, `y.shape` и список признаков.',
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))

          # TODO: закодируйте категориальный столбец

          # TODO: выберите feature_cols

          # TODO: создайте X и y

          # TODO: выведите X.shape и y.shape
        `,
        [
          {
            id: 's1',
            description: 'Два района',
            input: 'area,rooms,district,price\n35,1,Center,8\n52,2,North,9\n80,3,Center,18',
            expectedOutput: "(3, 4)\n(3,)\n['area', 'rooms', 'district_Center', 'district_North']",
          },
        ],
        [
          {
            id: 'h1',
            description: 'Три района',
            input: 'area,rooms,district,price\n40,1,A,10\n60,2,B,12\n80,3,C,18',
            expectedOutput: "(3, 5)\n(3,)\n['area', 'rooms', 'district_A', 'district_B', 'district_C']",
          },
        ],
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))
          df_encoded = pd.get_dummies(df, columns=["district"], dtype=int)
          feature_cols = [col for col in df_encoded.columns if col != "price"]
          X = df_encoded[feature_cols]
          y = df_encoded["price"]

          print(X.shape)
          print(y.shape)
          print(list(X.columns))
        `,
      ),
    ),
  ],
)
