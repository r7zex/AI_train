import type { FlowTopic } from '../../aiCurriculumTypes'
import { callout, code, makeStdinTask, mlFoundationsTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicMlDataTarget: FlowTopic = mlFoundationsTopic(
  'ml-foundations-data-target',
  '4.1 Данные, признаки и target',
  1,
  'Разбираем, как устроена ML-таблица: объект, наблюдение, строка, столбец, feature, target, dataset, X, y и leakage.',
  'В ML строка обычно описывает один объект, признаки лежат в X, а правильный ответ лежит в y.',
  ['объект', 'наблюдение', 'dataset', 'feature', 'target', 'X', 'y', 'leakage'],
  ['X = features', 'y = target'],
  ['Признаки известны до предсказания; target - то, что нужно узнать; target нельзя включать в X.'],
  [
    theoryStep(
      'ml-foundations-data-target-object',
      'Объект, признаки и target',
      'ML-таблица состоит из объектов, признаков и ответа, который нужно предсказать.',
      [
        section('apartment-table', 'Сквозной пример: квартиры', [
          '**Dataset** - это набор данных для задачи. В табличном ML dataset часто выглядит как таблица: строки описывают объекты, а столбцы описывают свойства этих объектов.',
          'В примере ниже одна **строка** - одна квартира, то есть один объект или одно наблюдение. Столбцы `area`, `rooms`, `district` - признаки. Столбец `price` - `target`, потому что именно цену мы хотим научиться предсказывать.',
        ], {
          table: {
            headers: ['area', 'rooms', 'district', 'price'],
            rows: [
              ['35', '1', 'center', '8.2 млн'],
              ['52', '2', 'suburb', '9.1 млн'],
              ['80', '3', 'center', '18.4 млн'],
            ],
          },
          callouts: [
            callout('Важно', 'Признаки должны быть известны ДО предсказания. Target - это то, что мы хотим узнать.', 'important'),
          ],
        }),
        section('terms', 'Как связаны термины', [
          '**Объект** - то, про что делается прогноз: квартира, клиент, письмо, заказ. **Наблюдение** - зафиксированная строка с данными про один объект.',
          '**Feature** или **признак** - входная информация для модели. **Target** - правильный ответ в исторических данных и цель предсказания для новых объектов.',
        ], {
          table: {
            headers: ['Задача', 'Объект', 'Features', 'Target'],
            rows: [
              ['цена квартиры', 'квартира', '`area`, `rooms`, `district`', '`price`'],
              ['спам', 'письмо', '`text_length`, `has_link`, `sender_domain`', '`is_spam`'],
              ['отток клиента', 'клиент', '`days_since_login`, `tariff`, `tickets_count`', '`churn`'],
              ['диагностика', 'пациент', '`age`, `symptoms`, `test_values`', '`diagnosis`'],
            ],
          },
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-data-target-x-y',
      'X и y',
      '`X` хранит признаки, `y` хранит target.',
      [
        section('notation', 'Стандартные обозначения', [
          'В ML часто используют короткие обозначения: `X` - таблица признаков, `y` - столбец правильных ответов. Для квартиры `X` содержит `area`, `rooms`, `district`, а `y` содержит `price`.',
          '`X` обычно двумерный: строки - объекты, столбцы - признаки. `y` обычно одномерный: один ответ на каждый объект. Поэтому важно, чтобы каждой строке `X` соответствовало ровно одно значение в `y`.',
        ], {
          callouts: [
            callout('Схема', '`dataset` → выбрать признаки → `X`\n`dataset` → выбрать target → `y`', 'schema'),
          ],
          codeExamples: [
            code('python', `
              X = df[feature_cols]
              y = df[target_col]
            `, undefined, 'Это только псевдо-код идеи: признаки отдельно, target отдельно. Тема не превращается в pandas-урок.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-data-target-leakage',
      'Leakage: когда target попал в признаки',
      'Leakage появляется, когда модель получает информацию, недоступную в реальном прогнозе.',
      [
        section('mistake', 'Модель подсматривает ответ', [
          '**Leakage** - типичная ошибка подготовки данных. Она возникает, когда в `X` попадает `target` или информация из будущего, которая не будет известна в момент реального предсказания.',
          'Если мы предсказываем `price`, нельзя оставлять `price` в `X`. Такая модель может показать почти идеальное качество на учебной проверке, потому что ответ уже лежит среди входов. В реальном использовании цены новой квартиры у нас нет.',
        ], {
          table: {
            headers: ['Неправильно', 'Почему плохо', 'Правильно'],
            rows: [
              ['`X = area, rooms, price`', '`price` является target', '`X = area, rooms, district`'],
              ['`X = churn, tariff, activity`', '`churn` является ответом', '`X = tariff, activity, support_tickets`'],
            ],
          },
          callouts: [
            callout('Типичная ошибка', 'Включить `price` в `X`, когда задача - предсказывать `price`. Это не сильная модель, а подсказанный ответ.', 'important'),
          ],
        }),
      ],
    ),
    quizStep(
      'ml-foundations-data-target-quiz',
      'Найти features и target',
      'Проверяем, где признаки, а где ответ.',
      singleQuiz(
        'quiz-ml-foundations-data-target',
        'Features и target',
        'ml-foundations-data-target',
        'ml-foundations',
        'Нужно предсказать `price` квартиры. Что должно попасть в `y`?',
        [
          { id: 'a', text: '`area`' },
          { id: 'b', text: '`rooms`' },
          { id: 'c', text: '`district`' },
          { id: 'd', text: '`price`' },
        ],
        'd',
        '`y` хранит target. Если предсказываем цену, target - `price`.',
      ),
    ),
    practiceStep(
      'ml-foundations-data-target-practice',
      'Разделить колонки на X и y',
      'По списку колонок и target выводим признаки.',
      makeStdinTask(
        'task-ml-foundations-split-x-y',
        'Разделить колонки на X и y',
        'На вход подаются две строки: названия колонок через пробел и название target. Выведите только features через пробел, сохранив исходный порядок.',
        `
          # TODO: считайте названия колонок

          # TODO: считайте название target

          # TODO: оставьте только features
        `,
        [
          { id: 's1', description: 'Квартиры', input: 'area rooms district price\nprice', expectedOutput: 'area rooms district' },
        ],
        [
          { id: 'h1', description: 'Клиенты', input: 'age purchases churn\nchurn', expectedOutput: 'age purchases' },
          { id: 'h2', description: 'Target в середине', input: 'text is_spam sender\nis_spam', expectedOutput: 'text sender' },
        ],
        `
          columns = input().split()
          target = input().strip()
          features = [column for column in columns if column != target]
          print(" ".join(features))
        `,
      ),
    ),
  ],
)
