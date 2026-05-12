import { callout, code, functionSection, makeStdinTask, pandasTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicPandasMissingDuplicates = pandasTopic(
  'pandas-missing-duplicates',
  '3.5 Пропуски и дубликаты',
  5,
  'Находим пропуски, выбираем стратегию заполнения или удаления, удаляем дубликаты строк.',
  'Перед ML-моделью таблицу нужно очистить: пропуски и дубликаты могут исказить статистики, обучение и оценку качества.',
  ['isna', 'dropna', 'fillna', 'median', 'mode', 'duplicated', 'drop_duplicates'],
  ['df.isna().sum()', 'df["col"].fillna(value)', 'df.drop_duplicates()'],
  [
    '`isna().sum()` показывает число пропусков по столбцам.',
    'Числовые пропуски часто заполняют медианой, категориальные - модой.',
    '`drop_duplicates()` удаляет одинаковые строки.',
  ],
  [
    theoryStep(
      'pandas-missing-find',
      'Как найти пропуски: `isna()`, `isna().sum()`',
      'Сначала пропуски нужно увидеть и посчитать.',
      [
        functionSection(
          'isna-function',
          '`df.isna()`',
          'df.isna()',
          ['параметры не нужны'],
          `
            print(df.isna())
          `,
          'Таблица такого же размера со значениями `True` и `False`.',
          '`isna()` показывает, в каких ячейках есть пропуски.',
        ),
        functionSection(
          'isna-sum-function',
          '`df.isna().sum()`',
          'df.isna().sum()',
          ['сначала создаётся маска пропусков, затем сумма считается по столбцам'],
          `
            print(df.isna().sum())
          `,
          `
            age     2
            city    1
            price   0
            dtype: int64
          `,
          '`isna().sum()` считает количество пропусков в каждом столбце.',
        ),
        section('find-missing', 'Диагностика пропусков', [
          'Сначала пропуски нужно увидеть и посчитать. Они появляются из-за ошибок выгрузки, необязательных полей, объединения таблиц или ручного ввода.',
          'Многие модели не принимают `NaN` напрямую. Даже если модель умеет работать с пропусками, сначала нужно понять масштаб проблемы и связь пропусков с target.',
        ], {
          codeExamples: [
            code('python', `
              print(df.isna().sum())
            `, `
              age     2
              city    1
              price   0
              dtype: int64
            `, 'Сводка показывает, в каких столбцах есть пропуски и сколько их.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-missing-dropna',
      'Удаление пропусков: `dropna()`',
      'Удаление подходит, только если потери данных безопасны.',
      [
        functionSection(
          'dropna-function',
          '`df.dropna()`',
          'df.dropna(subset=None, how="any")',
          ['`subset` - столбцы, где проверять пропуски', '`how` - правило удаления строк'],
          `
            clean = df.dropna(subset=["price"])
            print(clean.shape)
          `,
          'Размер таблицы после удаления строк с пропуском в `price`.',
          '`dropna()` удаляет строки или столбцы с пропусками.',
        ),
        section('dropna', 'Когда удалять строки', [
          '`dropna()` - быстрый способ получить таблицу без `NaN`, но он может резко уменьшить выборку.',
          'Удалять строки можно, если пропусков мало и удаление не меняет смысл выборки. Нельзя механически удалять половину данных только ради удобства модели.',
        ], {
          callouts: [
            callout('Проверка', 'Перед `dropna()` сравните размер таблицы до и после удаления: `df.shape`.', 'remember'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-missing-fillna',
      'Заполнение пропусков: `fillna()`',
      'Заполняем пропуски осмысленными значениями.',
      [
        functionSection(
          'fillna-value-function',
          '`df.fillna()`',
          'df.fillna(value)',
          ['`value` - значение для замены пропусков'],
          `
            print(df.fillna(0))
          `,
          'Таблица, где пропуски заменены нулями.',
          '`fillna()` заменяет пропуски заданным значением.',
        ),
        functionSection(
          'fillna-median-function',
          '`median()` для чисел',
          'df["col"].fillna(df["col"].median())',
          ['`median()` - медиана числового столбца'],
          `
            df["age"] = df["age"].fillna(df["age"].median())
          `,
          'Пропуски в `age` заменены медианой.',
          'Медиана часто устойчивее среднего, если есть выбросы.',
        ),
        functionSection(
          'fillna-mode-function',
          '`mode()` для категорий',
          'df["col"].fillna(df["col"].mode()[0])',
          ['`mode()` возвращает самые частые значения', '`[0]` берёт первое из них'],
          `
            df["city"] = df["city"].fillna(df["city"].mode()[0])
          `,
          'Пропуски в `city` заменены самой частой категорией.',
          'Мода подходит для категориальных признаков.',
        ),
        section('fillna', 'Медиана, среднее, мода', [
          'Заполнение заменяет пропуски значением, которое не ломает столбец. Для чисел часто используют медиану, для категорий - моду.',
          'Среднее чувствительно к выбросам, медиана устойчивее. Target нельзя заполнять без понимания задачи: так легко создать неверные ответы для обучения.',
        ], {
          codeExamples: [
            code('python', `
              df["age"] = df["age"].fillna(df["age"].median())
              df["city"] = df["city"].fillna(df["city"].mode()[0])
            `, 'Пропуски в `age` заменены медианой, в `city` - самой частой категорией.', 'Стратегия зависит от смысла столбца, а не только от типа данных.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-duplicates',
      'Дубликаты: `duplicated()`, `drop_duplicates()`',
      'Повторяющиеся строки могут исказить обучение и статистики.',
      [
        functionSection(
          'duplicated-function',
          '`df.duplicated()`',
          'df.duplicated(subset=None)',
          ['`subset` - столбцы, по которым проверять повтор'],
          `
            print(df.duplicated().sum())
          `,
          'Количество повторяющихся строк.',
          '`duplicated()` возвращает маску строк-дубликатов.',
        ),
        functionSection(
          'drop-duplicates-function',
          '`df.drop_duplicates()`',
          'df.drop_duplicates(subset=None)',
          ['`subset` - столбцы, по которым определять одинаковые строки'],
          `
            df = df.drop_duplicates()
            print(df.shape)
          `,
          'Размер таблицы после удаления дублей.',
          '`drop_duplicates()` возвращает таблицу без повторяющихся строк.',
        ),
        section('duplicates', 'Повторы строк', [
          'Дубликаты появляются после склейки файлов, повторной выгрузки или ошибок сбора данных.',
          'Одинаковые объекты могут завысить вес части выборки и дать слишком оптимистичную оценку качества, особенно если дубль попал и в train, и в validation.',
        ], {
          codeExamples: [
            code('python', `
              print(df.duplicated().sum())
              df = df.drop_duplicates()
            `, 'Сначала напечатано число дублей, затем они удалены.', 'Удаление дубликатов обычно делают до разбиения на train и validation.'),
          ],
        }),
      ],
    ),
    quizStep(
      'pandas-cleaning-quiz-strategy',
      'Удалить или заполнить',
      'Выбираем безопасную стратегию для пропусков.',
      singleQuiz(
        'quiz-pandas-drop-or-fill',
        'Пропуски',
        'pandas-missing-duplicates',
        'pandas-eda',
        'Когда удаление строк с пропусками обычно наиболее безопасно?',
        [
          { id: 'a', text: 'Когда пропусков мало и удаление не искажает выборку' },
          { id: 'b', text: 'Когда пропущен target у половины строк' },
          { id: 'c', text: 'Когда так быстрее, без проверки размера данных' },
          { id: 'd', text: 'Когда столбец содержит категориальные значения' },
        ],
        'a',
        'Удаление подходит, если пропусков мало и после удаления выборка остаётся репрезентативной.',
      ),
    ),
    quizStep(
      'pandas-cleaning-quiz-median',
      'mean, median или mode',
      'Проверяем выбор заполнителя.',
      singleQuiz(
        'quiz-pandas-median-mode',
        'Заполнение пропусков',
        'pandas-missing-duplicates',
        'pandas-eda',
        'Почему медиана часто безопаснее среднего для числового признака с выбросами?',
        [
          { id: 'a', text: 'Медиана меньше зависит от экстремально больших или маленьких значений' },
          { id: 'b', text: 'Медиана удаляет все строки' },
          { id: 'c', text: 'Медиана работает только со строковыми столбцами' },
          { id: 'd', text: 'Медиана всегда равна нулю' },
        ],
        'a',
        'Медиана смотрит на центральное значение упорядоченного ряда и поэтому устойчивее к выбросам, чем среднее.',
      ),
    ),
    practiceStep(
      'pandas-cleaning-practice',
      'Очистить таблицу',
      'Заполняем пропуски медианой и модой, затем удаляем дубликаты.',
      makeStdinTask(
        'task-pandas-clean-table',
        'Очистить таблицу',
        'На вход подаётся CSV с колонками `name`, `age`, `city`. Заполните пропуски в `age` медианой, в `city` модой, удалите дубликаты и выведите таблицу.',
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))

          # TODO: найдите пропуски

          # TODO: заполните age медианой

          # TODO: заполните city модой

          # TODO: удалите дубликаты

          # TODO: выведите таблицу
        `,
        [
          {
            id: 's1',
            description: 'Пропуски и один дубль',
            input: 'name,age,city\nAnna,20,Moscow\nBoris,,Kazan\nBoris,,Kazan\nMira,40,',
            expectedOutput: ' name  age   city\n Anna 20.0 Moscow\nBoris 30.0  Kazan\n Mira 40.0  Kazan',
          },
        ],
        [
          {
            id: 'h1',
            description: 'Другая медиана и мода',
            input: 'name,age,city\nOleg,30,Tula\nIra,,Tula\nMax,50,\nMax,50,',
            expectedOutput: 'name  age city\nOleg 30.0 Tula\n Ira 50.0 Tula\n Max 50.0 Tula',
          },
        ],
        `
          import pandas as pd
          import sys
          from io import StringIO

          df = pd.read_csv(StringIO(sys.stdin.read()))
          df["age"] = df["age"].fillna(df["age"].median())
          df["city"] = df["city"].fillna(df["city"].mode()[0])
          df = df.drop_duplicates()
          print(df.to_string(index=False))
        `,
      ),
    ),
  ],
)
