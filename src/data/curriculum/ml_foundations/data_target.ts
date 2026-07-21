import type { FlowTopic } from '../../aiCurriculumTypes'
import { callout, code, makeStdinTask, mlFoundationsTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicMlDataTarget: FlowTopic = mlFoundationsTopic(
  'ml-foundations-data-target',
  '4.1 Данные, признаки и целевая переменная',
  1,
  'Разбираем на одной таблице, какие столбцы образуют признаки X, какой столбец является целевой переменной y и какие данные нельзя использовать.',
  'Из копии таблицы целевую переменную извлекают через pop, а в X оставляют только сведения, доступные на дату прогноза.',
  ['объект', 'наблюдение', 'dataset', 'feature', 'target', 'X', 'y', 'leakage'],
  ['X = таблица признаков', 'y = целевая переменная'],
  ['В X входят только сведения, доступные в момент реального прогноза.'],
  [
    theoryStep(
      'ml-foundations-data-target-object',
      'Таблица и роли столбцов',
      'На одной таблице выбираем столбцы для прогноза и столбец с правильным ответом.',
      [
        section('synthetic-client-table', 'Таблица для прогноза оттока', [
'По значениям на дату решения нужно предсказать, уйдёт ли клиент в следующие 30 дней. Каждая строка относится к одному клиенту на эту дату.',
        ], {
table: {
  headers: [
    '`client_id` — клиент',
    '`household_group` — группа',
    '`days_since_login` — дней без входа',
    '`tariff` — тариф',
    '`support_tickets` — обращения',
    '`churn_after_30d` — отток',
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
callouts: [
  callout(
    'Что использовать',
    '`days_since_login`, `tariff` и `support_tickets` — признаки. `churn_after_30d` — целевая переменная. `client_id` и `household_group` нужны для учёта записей и не входят в X.',
    'important',
  ),
],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-data-target-x-y',
      'Разделить таблицу на X и y',
      'Целевой столбец извлекаем через pop, не перечисляя признаки вручную.',
      [
        section('split-same-rows', 'Извлечь целевую переменную через pop', [
'Сначала исключаем идентификатор и групповой столбец. Затем `pop` возвращает `churn_after_30d` и одновременно удаляет его из таблицы. Оставшиеся столбцы образуют X.',
'`pop` не меняет порядок строк, поэтому каждому клиенту в X соответствует ответ с той же позиции в y.',
        ], {
codeExamples: [
  code('python', `
    import pandas as pd

    df = pd.DataFrame({
        "client_id": ["C101", "C102", "C103", "C104", "C105", "C106"],
        "household_group": ["H1", "H1", "H2", "H2", "H3", "H3"],
        "days_since_login": [2, 18, 5, 31, 9, 24],
        "tariff": ["pro", "basic", "pro", "basic", "basic", "pro"],
        "support_tickets": [0, 2, 1, 4, 0, 3],
        "churn_after_30d": ["нет", "да", "нет", "да", "нет", "да"],
    })

    data = df.drop(columns=["client_id", "household_group"]).copy()
    y = data.pop("churn_after_30d")
    X = data

    print(X.columns.tolist())
    print(y.tolist())
    print("X:", X.shape, "y:", y.shape)
  `, `
    ['days_since_login', 'tariff', 'support_tickets']
    ['нет', 'да', 'нет', 'да', 'нет', 'да']
    X: (6, 3) y: (6,)
  `, '`pop` вернул целевую переменную, а в X остались три признака и те же шесть строк.'),
],
        }),
        section('categorical-values', 'Тариф пока остаётся строкой', [
'`tariff` остаётся со значениями `basic` и `pro`. Преобразование категорий в числа разбирается позже, в теме 4.16.',
        ]),
      ],
    ),
    theoryStep(
      'ml-foundations-data-target-leakage',
      'Проверить признаки перед обучением',
      'В X оставляют только сведения, которые реально известны на дату прогноза.',
      [
        section('cutoff-timeline', 'Не брать ответ и сведения из будущего', [
'На дату прогноза известны `days_since_login`, `tariff` и обращения, зарегистрированные к этой дате. `churn_after_30d` и дата последующего закрытия аккаунта станут известны позже.',
'Если добавить такой будущий столбец в X, возникнет утечка данных: при реальном использовании модель не получит эту информацию.',
        ], {
callouts: [
  callout(
    'Короткая проверка X',
    'Целевая переменная удалена; идентификатор и групповой столбец исключены; каждый оставшийся признак доступен на дату прогноза.',
    'remember',
  ),
],
        }),
      ],
    ),
    quizStep(
      'ml-foundations-data-target-quiz',
      'Определить целевую переменную',
      'Проверяем, какой столбец хранит ответ задачи.',
      singleQuiz(
        'quiz-ml-foundations-data-target',
        'Признаки и целевая переменная',
        'ml-foundations-data-target',
        'ml-foundations',
        'Для клиента C106 нужно предсказать отток в следующие 30 дней. Какой столбец должен быть y?',
        [
{ id: 'a', text: '`days_since_login`' },
{ id: 'b', text: '`tariff`' },
{ id: 'c', text: '`support_tickets`' },
{ id: 'd', text: '`churn_after_30d`' },
        ],
        'd',
        '`y` хранит ответ задачи — произошёл ли отток в следующие 30 дней.',
      ),
    ),
    practiceStep(
      'ml-foundations-data-target-practice',
      'Отделить признаки от служебных столбцов и цели',
      'По ролям столбцов выводим только признаки.',
      makeStdinTask(
        'task-ml-foundations-split-x-y',
        'Оставить только признаки',
        'Первая строка содержит названия столбцов, вторая — целевой столбец. Необязательные третья и четвёртая строки содержат идентификаторы и групповые столбцы. Выведите только признаки в исходном порядке.',
        `
import sys

lines = sys.stdin.read().splitlines()
# TODO: соберите множество столбцов, которые нужно исключить.

# TODO: выведите оставшиеся столбцы в исходном порядке.
        `,
        [
{ id: 's1', description: 'Квартиры (сохранённый сценарий)', input: 'area rooms district price\nprice', expectedOutput: 'area rooms district' },
{ id: 's2', description: 'Клиенты', input: 'client_id household_group days_since_login tariff support_tickets churn_after_30d\nchurn_after_30d\nclient_id\nhousehold_group', expectedOutput: 'days_since_login tariff support_tickets' },
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
