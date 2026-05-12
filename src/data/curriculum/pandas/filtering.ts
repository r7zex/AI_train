import { callout, code, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasFilteringSorting = pandasTopic(
  'pandas-filtering-sorting',
  '3.4 Фильтрация, сортировка и новые столбцы',
  4,
  'Используем pandas для вопросов к данным: фильтрации, сортировки и создания новых признаков.',
  'EDA - это не только смотреть таблицу, но и задавать к ней вопросы: какие строки подходят, что самое большое и какой новый признак полезен.',
  ['filtering', 'sort_values', 'new column', 'feature engineering', '&', '|'],
  ['price_per_meter = price / area'],
  [
    'Фильтрация оставляет строки по условию.',
    'Сортировка меняет порядок строк.',
    'Новый столбец может стать новым ML-признаком.',
  ],
  [
    theoryStep(
      'pandas-filtering-scenario',
      'Вопросы к таблице',
      'Показываем EDA как серию практических вопросов.',
      [
        section('questions', 'Что можно спросить у данных', [
          'После первого осмотра появляются вопросы: какие квартиры дороже 10 млн, какие клиенты старше 30 и из Москвы, какие товары имеют самую высокую цену, какой признак можно создать из существующих.',
          'Фильтрация, сортировка и новые столбцы - базовый набор для такого анализа.',
        ], {
          callouts: [
            callout('ML-связка', 'Создание новых столбцов - простейший feature engineering. Например, `price_per_meter = price / area` может быть информативнее, чем цена и площадь по отдельности.', 'example'),
          ],
        }),
        section('filter-sort', 'Фильтровать и сортировать', [
          'Фильтрация отвечает “какие строки оставить?”. Сортировка отвечает “в каком порядке их посмотреть?”. Эти операции часто идут вместе.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "area": [35, 52, 80],
                  "price": [8.2, 12.5, 18.4],
              })

              expensive = df[df["price"] > 10]
              print(expensive.sort_values("price", ascending=False))
            `, `
                 area  price
              2    80   18.4
              1    52   12.5
            `, 'Сначала оставили дорогие квартиры, затем отсортировали их по цене по убыванию.'),
          ],
        }),
        section('new-feature', 'Новый столбец как признак', [
          'Новый столбец создаётся присваиванием. В EDA это удобно для проверки гипотез, а в ML - для подготовки новых признаков.',
        ], {
          codeExamples: [
            code('python', `
              import pandas as pd

              df = pd.DataFrame({
                  "area": [40, 50],
                  "price": [8.0, 12.5],
              })

              df["price_per_meter"] = df["price"] / df["area"]
              print(df)
            `, `
                 area  price  price_per_meter
              0    40    8.0             0.20
              1    50   12.5             0.25
            `, '`price_per_meter` создан из двух существующих столбцов.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-filtering-checkpoint',
      'Что теперь умеем',
      'Закрепляем операции EDA.',
      [
        section('checkpoint', 'Промежуточный вывод', [
          'Эти операции превращают пассивный просмотр таблицы в анализ.',
        ], {
          bullets: [
            'оставлять строки по условию;',
            'объединять условия через `&` и `|`;',
            'сортировать строки через `sort_values()`;',
            'создавать новые признаки из существующих столбцов.',
          ],
          callouts: [
            callout('Типичная ошибка', 'Использовать `and`/`or` для условий по столбцам. В pandas нужны `&` и `|`, а каждое условие берётся в скобки.', 'important'),
            callout('Важно', 'Не создавайте признаки из target так, чтобы в модель утекла информация, неизвестная на момент предсказания.', 'remember'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-filtering-analysis-flow',
      'Фильтрация как анализ',
      'Показываем, как операции соединяются в цепочку EDA.',
      [
        section('flow', 'Вопрос -> фильтр -> вывод', [
          'Хорошая фильтрация начинается с вопроса. Например: “какие квартиры дорогие для своей площади?”. Тогда мы создаём `price_per_meter`, фильтруем по порогу и сортируем результат, чтобы увидеть самые заметные случаи.',
          'Такой подход лучше механического вызова методов. Он связывает pandas-операции с аналитическим смыслом и помогает объяснить, почему именно эти строки оказались в результате.',
        ], {
          callouts: [
            callout('Где используется', 'Поиск сегментов, проверка гипотез, быстрый анализ выбросов, создание признаков перед ML.', 'example'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-filtering-safety',
      'Безопасность новых признаков',
      'Отделяем полезный feature engineering от утечки данных.',
      [
        section('safety', 'Не все новые столбцы честные', [
          'Новый признак должен быть доступен в момент предсказания. Если мы создаём столбец из будущей информации или напрямую из target, модель на обучении увидит подсказку, которой не будет в реальности.',
          'Например, `price_per_meter = price / area` полезен для EDA, но если задача - предсказывать `price`, такой признак нельзя просто положить в `X`: он использует сам target.',
        ], {
          callouts: [
            callout('Промежуточный вывод', 'Фильтрация и сортировка помогают задавать вопросы, а новые столбцы полезны только тогда, когда они честно доступны модели.', 'summary'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-filter-quiz-conditions',
      'Несколько условий',
      'Проверяем синтаксис фильтрации.',
      singleQuiz(
        'quiz-pandas-filter-conditions',
        'Фильтрация',
        'pandas-filtering-sorting',
        'pandas-eda',
        'Как правильно выбрать строки, где `price > 10` и `area < 80`?',
        [
          { id: 'a', text: '`df[(df["price"] > 10) & (df["area"] < 80)]`' },
          { id: 'b', text: '`df[df["price"] > 10 and df["area"] < 80]`' },
          { id: 'c', text: '`df[(price > 10) && (area < 80)]`' },
          { id: 'd', text: '`df.filter(price > 10, area < 80)`' },
        ],
        'a',
        'Условия по столбцам объединяются через `&`, каждое условие берётся в скобки.',
      ),
    ),
    quizStep(
      'pandas-filter-quiz-feature',
      'Новый признак',
      'Проверяем смысл feature engineering.',
      singleQuiz(
        'quiz-pandas-filter-feature',
        'Новый столбец',
        'pandas-filtering-sorting',
        'pandas-eda',
        'Какой пример лучше всего похож на базовый feature engineering?',
        [
          { id: 'a', text: '`df["price_per_meter"] = df["price"] / df["area"]`' },
          { id: 'b', text: '`df.shape`' },
          { id: 'c', text: '`df.head()`' },
          { id: 'd', text: '`pd.read_csv("data.csv")`' },
        ],
        'a',
        'Новый признак создаётся из существующих столбцов и может быть полезен модели.',
      ),
    ),
    practiceStep(
      'pandas-filter-practice',
      'Цена за метр',
      'Создаём новый признак и фильтруем строки.',
      makeStdinTask(
        'task-pandas-price-per-meter',
        'Цена за метр',
        'Создайте DataFrame из готового словаря, добавьте `price_per_meter`, оставьте строки где `price_per_meter > 0.2`, выведите результат.',
        `
          import pandas as pd

          data = {
              "area": [40, 50, 100],
              "price": [8.0, 12.5, 15.0],
          }

          # TODO: создайте DataFrame

          # TODO: создайте столбец price_per_meter

          # TODO: отфильтруйте строки

          # TODO: выведите результат
        `,
        [
          { id: 's1', description: 'Одна строка дороже порога', expectedOutput: '   area  price  price_per_meter\n1    50   12.5             0.25' },
        ],
        [
          { id: 'h1', description: 'Проверка фильтра', expectedOutput: '   area  price  price_per_meter\n1    50   12.5             0.25' },
        ],
        `
          import pandas as pd

          data = {
              "area": [40, 50, 100],
              "price": [8.0, 12.5, 15.0],
          }

          df = pd.DataFrame(data)
          df["price_per_meter"] = df["price"] / df["area"]
          result = df[df["price_per_meter"] > 0.2]
          print(result)
        `,
      ),
    ),
  ],
)
