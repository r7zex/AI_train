import { callout, code, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasWhy = pandasTopic(
  'pandas-why-dataframe',
  '3.1 Зачем нужен pandas и что такое DataFrame',
  1,
  'Показываем pandas как основной инструмент работы с табличными данными до обучения модели.',
  'Pandas помогает пройти путь от CSV к осмотру, очистке, признакам `X`, target `y` и дальше к модели.',
  ['pandas', 'DataFrame', 'Series', 'columns', 'index', 'EDA'],
  ['CSV -> DataFrame -> осмотр -> очистка -> X и y -> модель'],
  [
    'DataFrame - рабочая форма табличных данных для EDA.',
    'Series - один столбец таблицы.',
    'До модели таблицу обычно нужно осмотреть, очистить и подготовить.',
  ],
  [
    theoryStep(
      'pandas-why-scenario',
      'Таблица до модели',
      'Связываем pandas с типичным ML-пайплайном.',
      [
        section('pipeline', 'CSV -> DataFrame -> модель', [
          'Pandas - основной инструмент для табличных данных. До модели обычно нужно понять, что лежит в таблице: какие признаки есть, какие типы данных, есть ли пропуски, дубликаты и странные значения.',
          'Типовая цепочка выглядит так: `CSV -> DataFrame -> осмотр -> очистка -> признаки X и target y -> модель`.',
          'Например, таблица квартир может содержать `area`, `rooms`, `district`, `price`. До обучения модели нужно понять, какие столбцы являются признаками, а какой столбец является целевой переменной.',
        ], {
          callouts: [
            callout('Вывод', 'DataFrame - это не просто “таблица”, а рабочая форма данных для EDA и подготовки ML-признаков.', 'summary'),
          ],
        }),
        section('dataframe-series', 'DataFrame и Series', [
          '`DataFrame` хранит строки, именованные столбцы и индекс. `Series` обычно появляется, когда мы выбираем один столбец: например, `df["price"]`.',
          'Это различие важно: одинарные скобки часто дают `Series`, двойные скобки - `DataFrame`.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "area": [35, 52, 80],
                  "rooms": [1, 2, 3],
                  "district": ["center", "north", "south"],
                  "price": [8.2, 9.1, 18.4],
              })

              print(df)
            `, `
                 area  rooms district  price
              0    35      1   center    8.2
              1    52      2    north    9.1
              2    80      3    south   18.4
            `, 'В таблице есть числовые и категориальные столбцы, а также индекс строк.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-why-checkpoint',
      'Что теперь умеем',
      'Фиксируем роль pandas в курсе.',
      [
        section('checkpoint', 'Промежуточный вывод', [
          'Pandas нужен там, где данные ещё табличные и не готовы к модели.',
        ], {
          bullets: [
            'видеть DataFrame как рабочую таблицу EDA;',
            'отличать DataFrame от Series;',
            'понимать цепочку `CSV -> осмотр -> очистка -> X, y`;',
            'связывать столбцы таблицы с признаками и target.',
          ],
          callouts: [
            callout('Типичная ошибка', 'Сразу обучать модель после чтения CSV. Обычно сначала нужен хотя бы первый осмотр таблицы: строки, типы, пропуски, диапазоны значений.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-why-flat-example',
      'Пример таблицы квартир',
      'Связываем названия столбцов с будущими признаками.',
      [
        section('flats', 'Что означает каждый столбец', [
          'В таблице квартир `area` и `rooms` обычно являются числовыми признаками, `district` - категориальным признаком, а `price` часто становится target. Такое чтение таблицы помогает не воспринимать DataFrame как безымянную сетку ячеек.',
          'Когда вы смотрите на новый датасет, полезно мысленно разделить столбцы: какие описывают объект, какой столбец нужно предсказать, какие столбцы пока требуют очистки или кодирования.',
        ], {
          callouts: [
            callout('Промежуточный вывод', 'DataFrame нужен, чтобы работать с таблицей осмысленно: видеть имена столбцов, типы данных, пропуски и связь признаков с задачей ML.', 'summary'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-why-quiz-role',
      'Роль pandas',
      'Проверяем понимание pandas в ML-пайплайне.',
      singleQuiz(
        'quiz-pandas-why-role',
        'Pandas в ML',
        'pandas-why-dataframe',
        'pandas-eda',
        'Какой сценарий лучше всего описывает роль pandas перед обучением модели?',
        [
          { id: 'a', text: 'Загрузить таблицу, осмотреть, очистить и подготовить признаки' },
          { id: 'b', text: 'Заменить любую ML-модель' },
          { id: 'c', text: 'Рисовать только нейронные сети' },
          { id: 'd', text: 'Хранить только одномерные числовые массивы без имён' },
        ],
        'a',
        'Pandas закрывает табличный этап: загрузка, осмотр, очистка и подготовка данных.',
      ),
    ),
    quizStep(
      'pandas-why-quiz-series',
      'Series или DataFrame',
      'Проверяем отличие одного столбца от таблицы.',
      singleQuiz(
        'quiz-pandas-why-series',
        'Series и DataFrame',
        'pandas-why-dataframe',
        'pandas-eda',
        'Что обычно возвращает `df["price"]`?',
        [
          { id: 'a', text: '`Series` с одним столбцом' },
          { id: 'b', text: '`DataFrame` со всеми столбцами' },
          { id: 'c', text: 'Список имён колонок' },
          { id: 'd', text: 'CSV-файл' },
        ],
        'a',
        'Одинарные скобки при выборе одного столбца обычно возвращают `Series`.',
      ),
    ),
    practiceStep(
      'pandas-why-practice',
      'Создать таблицу квартир',
      'Создаём DataFrame и выводим названия столбцов.',
      makeStdinTask(
        'task-pandas-create-flat-dataframe',
        'Создать таблицу квартир',
        'Создайте `DataFrame` с колонками `area`, `rooms`, `price` и выведите список названий столбцов.',
        `
          import pandas as pd

          # TODO: создайте DataFrame с колонками area, rooms, price

          # TODO: выведите список названий столбцов
        `,
        [
          { id: 's1', description: 'Названия трёх колонок', expectedOutput: "['area', 'rooms', 'price']" },
        ],
        [
          { id: 'h1', description: 'Проверка порядка колонок', expectedOutput: "['area', 'rooms', 'price']" },
        ],
        `
          import pandas as pd

          df = pd.DataFrame({
              "area": [35, 52, 80],
              "rooms": [1, 2, 3],
              "price": [8.2, 9.1, 18.4],
          })

          print(list(df.columns))
        `,
      ),
    ),
  ],
)
