import type { FlowTopic } from '../../aiCurriculumTypes'
import { callout, code, makeStdinTask, mlFoundationsTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicMlDataTarget: FlowTopic = mlFoundationsTopic(
  'ml-foundations-data-target',
  '4.2 Объекты, признаки и целевая переменная',
  2,
  'На одной таблице разбираем строки-объекты, столбцы-характеристики, признаки X, целевую переменную y и служебные столбцы, которые не должны поступать модели.',
  'Каждая строка описывает один объект, признаки содержат доступные характеристики, а целевая переменная хранит величину, которую требуется предсказать.',
  ['объект', 'наблюдение', 'набор данных', 'признак', 'целевая переменная', 'X', 'y', 'утечка данных'],
  ['X = таблица признаков', 'y = целевая переменная'],
  [
    'Строка — отдельный объект или наблюдение; столбец — одна характеристика.',
    'Признаки X используются для поиска закономерностей; целевая переменная y — требуемый ответ.',
    'Идентификаторы, служебные столбцы, цель и сведения из будущего не включают в X.',
  ],
  [
    theoryStep(
      'ml-foundations-data-target-object',
      'Таблица, объекты и роли столбцов',
      'На одном примере определяем, что хранится в строках и столбцах набора данных.',
      [
        section('client-table', 'Один объект в каждой строке', [
          '**Набор данных** представлен таблицей. Каждая строка — отдельный **объект**, или **наблюдение**: здесь это один клиент на дату, когда нужно сделать прогноз. Каждый столбец содержит одну характеристику этих клиентов.',
          'В таблице шесть наблюдений. Порядок строк связывает характеристики конкретного клиента с правильным ответом в той же строке, поэтому при дальнейших операциях признаки и ответы нельзя перемешивать независимо друг от друга.',
        ], {
          table: {
            headers: [
              '`client_id`',
              '`household_group`',
              '`days_since_login`',
              '`tariff`',
              '`support_tickets`',
              '`churn_after_30d`',
            ],
            rows: [
              ['C101', 'H1', '2', 'pro', '0', 'нет'],
              ['C102', 'H1', '18', 'basic', '2', 'да'],
              ['C103', 'H2', '5', 'pro', '1', 'нет'],
              ['C104', 'H2', '31', 'basic', '4', 'да'],
              ['C105', 'H3', '9', 'basic', '0', 'нет'],
              ['C106', 'H3', '24', 'pro', '3', 'да'],
            ],
          },
        }),
        section('column-translations', 'Перевод названий столбцов', [
          '`client_id` — идентификатор клиента; `household_group` — группа связанных клиентов; `days_since_login` — число дней с последнего входа; `tariff` — тариф; `support_tickets` — количество обращений в поддержку; `churn_after_30d` — уйдёт ли клиент в течение следующих 30 дней.',
        ]),
        section('feature-and-target', 'Признаки и целевая переменная', [
          '**Признак** — характеристика объекта, по которой модель ищет закономерности. В примере признаками служат число дней без входа, тариф и количество обращений в поддержку.',
          '**Целевая переменная** — величина, которую требуется предсказать. Столбец `churn_after_30d` показывает, уйдёт ли клиент в следующие 30 дней. Выбор цели определяется задачей: для тех же клиентов целью могла бы быть будущая сумма покупок, и тогда получилась бы другая задача.',
        ]),
        section('service-columns', 'Идентификаторы и служебные столбцы — не признаки', [
          '`client_id` только отличает одну запись от другой, а `household_group` помогает не разделить связанных клиентов при проверке модели. Эти столбцы нужны для учёта и организации данных, но не описывают закономерность, по которой должен строиться прогноз.',
          '`client_id` и `household_group` исключают из признаков не из-за того, что они записаны числами или строками, а из-за их служебного смысла. Перед формированием `X` определяют назначение каждого столбца и оставляют только характеристики, по которым модель должна строить прогноз.',
        ], {
          callouts: [
            callout('Роли в сквозном примере', '`days_since_login`, `tariff` и `support_tickets` — признаки; `churn_after_30d` — требуемый ответ; `client_id` и `household_group` — служебные столбцы.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-data-target-x-y',
      'Отделить признаки X от целевой переменной y',
      'Сначала исключаем служебные столбцы, затем создаём X и y из одной и той же таблицы.',
      [
        section('split-columns', 'Разделение словами и кодом', [
          'Таблица ниже уже хранится в переменной `df`. `X` — таблица признаков: три столбца, которые модель получает на вход. `y` — один столбец с правильными ответами. Обе части содержат те же шесть строк в одинаковом порядке.',
          'Сначала из `df` удаляются `client_id` и `household_group`. После этого строка `X = df.drop(columns=["churn_after_30d"])` создаёт признаки без целевой переменной, а строка `y = df["churn_after_30d"]` отдельно выбирает ответы.',
        ], {
          table: {
            headers: [
              '`client_id`',
              '`household_group`',
              '`days_since_login`',
              '`tariff`',
              '`support_tickets`',
              '`churn_after_30d`',
            ],
            rows: [
              ['C101', 'H1', '2', 'pro', '0', 'нет'],
              ['C102', 'H1', '18', 'basic', '2', 'да'],
              ['C103', 'H2', '5', 'pro', '1', 'нет'],
              ['C104', 'H2', '31', 'basic', '4', 'да'],
              ['C105', 'H3', '9', 'basic', '0', 'нет'],
              ['C106', 'H3', '24', 'pro', '3', 'да'],
            ],
          },
          codeExamples: [
            code('python', `
              df = df.drop(columns=["client_id", "household_group"])
              X = df.drop(columns=["churn_after_30d"])
              y = df["churn_after_30d"]

              print(X.columns.tolist())
              print(y.tolist())
              print("X:", X.shape, "y:", y.shape)
            `, `
              ['days_since_login', 'tariff', 'support_tickets']
              ['нет', 'да', 'нет', 'да', 'нет', 'да']
              X: (6, 3) y: (6,)
            `, 'X содержит три признака, y — шесть ответов; индексы и порядок строк сохранены.'),
          ],
        }),
        section('same-example', 'Что получилось в сквозном примере', [
          'Для строки C106 в `X` остаются значения `24`, `pro` и `3`, а соответствующее значение в `y` равно «да». Целевой столбец не дублируется среди входных данных модели.',
          'Тариф пока записан строками: `basic` означает «базовый», `pro` — «расширенный». Преобразование категорий в числовой вид выполняется отдельным шагом подготовки данных; оно не меняет роль этого столбца как признака.',
        ]),
      ],
    ),
    quizStep(
      'ml-foundations-data-target-quiz',
      'Определить целевую переменную',
      'Проверяем, какой столбец хранит ответ поставленной задачи.',
      singleQuiz(
        'quiz-ml-foundations-data-target',
        'Признаки и целевая переменная',
        'ml-foundations-data-target',
        'ml-foundations',
        'Для клиента C106 требуется предсказать, уйдёт ли он в следующие 30 дней. Какой столбец должен стать y?',
        [
          { id: 'a', text: '`days_since_login`' },
          { id: 'b', text: '`tariff`' },
          { id: 'c', text: '`support_tickets`' },
          { id: 'd', text: '`churn_after_30d`' },
        ],
        'd',
        '`y` хранит требуемый ответ задачи — факт ухода клиента в следующие 30 дней.',
      ),
    ),
    practiceStep(
      'ml-foundations-data-target-practice',
      'Отделить признаки от служебных столбцов и цели',
      'По ролям столбцов выводим только признаки в исходном порядке.',
      makeStdinTask(
        'task-ml-foundations-split-x-y',
        'Оставить только признаки',
        'Первая строка содержит названия столбцов, вторая — целевой столбец. Необязательные третья и четвёртая строки содержат идентификаторы и групповые столбцы. Выведите только признаки в исходном порядке.',
        `
          import sys

          lines = sys.stdin.read().splitlines()
          # TODO: соберите множество столбцов, которые нужно исключить

          # TODO: выведите оставшиеся столбцы в исходном порядке
        `,
        [
          { id: 's1', description: 'Квартиры', input: 'area rooms district price\nprice', expectedOutput: 'area rooms district' },
          { id: 's2', description: 'Клиенты со служебными столбцами', input: 'client_id household_group days_since_login tariff support_tickets churn_after_30d\nchurn_after_30d\nclient_id\nhousehold_group', expectedOutput: 'days_since_login tariff support_tickets' },
        ],
        [
          { id: 'h1', description: 'Клиенты (сохранённый сценарий)', input: 'age purchases churn\nchurn', expectedOutput: 'age purchases' },
          { id: 'h2', description: 'Цель в середине (сохранённый сценарий)', input: 'text is_spam sender\nis_spam', expectedOutput: 'text sender' },
          { id: 'h3', description: 'Несколько идентификаторов', input: 'row_id patient_id clinic age marker outcome\noutcome\nrow_id patient_id\nclinic', expectedOutput: 'age marker' },
        ],
        `
          import sys

          lines = sys.stdin.read().splitlines()
          columns = lines[0].split()
          excluded = {lines[1].strip()}
          if len(lines) > 2:
              excluded.update(lines[2].split())
          if len(lines) > 3:
              excluded.update(lines[3].split())
          features = [column for column in columns if column not in excluded]
          print(" ".join(features))
        `,
      ),
    ),
  ],
)
