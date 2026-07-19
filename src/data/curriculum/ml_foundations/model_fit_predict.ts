import type { FlowTopic } from '../../aiCurriculumTypes'
import { callout, code, makeStdinTask, mlFoundationsTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicMlModelFitPredict: FlowTopic = mlFoundationsTopic(
  'ml-foundations-model-fit-predict',
  '4.2 Модель, обучение и предсказание',
  2,
  'Объясняем model, fit и predict на уровне идеи: что модель получает, что меняется при обучении и что происходит на новом объекте.',
  'Модель обучается на X_train и y_train, а потом применяет найденную зависимость к X_new и возвращает y_pred.',
  ['model', 'параметры модели', 'обучение', 'предсказание', 'fit', 'predict', 'X_train', 'y_train', 'X_new', 'y_pred'],
  ['X_train + y_train → fit → trained model', 'X_new → predict → y_pred'],
  ['При fit есть правильные ответы; при predict правильный ответ неизвестен; модель работает с признаками, а не с человеческим пониманием объекта.'],
  [
    theoryStep(
      'ml-foundations-model-fit-predict-model',
      'Что такое модель',
      'Модель получает признаки и возвращает предсказание.',
      [
        section('definition', 'Модель как правило предсказания', [
          '**Модель (model)** — это объект, функция или алгоритм, который получает признаки и возвращает прогноз. Внутри модели есть параметры или правила, которые появились во время обучения.',
          'Для квартиры модель получает площадь (`area`), комнаты (`rooms`) и район (`district`), затем возвращает прогноз цены (`price`). Для письма модель получает признаки текста и возвращает класс «спам (spam)» или «не спам (not_spam)».',
        ], {
          callouts: [
            callout('Схема', 'признаки (features) → модель (model) → прогноз (prediction)', 'schema'),
            callout('Важно', 'Модель не “понимает” квартиру как человек. Она использует числовые или закодированные признаки и найденную по данным зависимость.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-model-fit-predict-fit',
      'Что происходит при обучении (fit)',
      'Метод обучения (`fit`) подбирает внутренние параметры модели по обучающим данным.',
      [
        section('training', 'Обучение по примерам', [
          'Во время обучения (fit) у нас есть обучающие признаки (`X_train`) и обучающие ответы (`y_train`). Модель делает пробные прогнозы, сравнивает их с ответами и меняет свои внутренние параметры.',
          'На бытовом уровне можно сказать: модель замечает закономерности. Например, в данных по квартирам большая площадь часто связана с более высокой ценой. Но это только иллюстрация идеи, а не отдельная тема про линейную регрессию.',
        ], {
          callouts: [
            callout('Схема', 'обучающие признаки (X_train) + ответы (y_train) → обучение (fit) → обученная модель (trained model)', 'schema'),
          ],
          codeExamples: [
            code('python', `
              model.fit(X_train, y_train)
            `, undefined, '`fit` - это действие обучения. Здесь модель получает и признаки, и правильные ответы.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-model-fit-predict-predict',
      'Что происходит при получении прогноза (predict)',
      'Метод получения прогноза (`predict`) применяет обученную модель к новым объектам.',
      [
        section('prediction', 'Прогноз без правильного ответа', [
          'После обучения модель применяют к новым объектам. На этом шаге есть признаки новых объектов (`X_new`): новой квартиры, письма или клиента. Правильного ответа рядом нет, иначе предсказывать было бы нечего.',
          'Результат метода `predict` обычно называют предсказанными ответами (`y_pred`). Это прогноз модели, а не факт. Позже, когда появится настоящий ответ или когда есть отложенная тестовая часть (test), `y_pred` можно сравнить с правильными ответами (`y_true`) по метрике.',
        ], {
          callouts: [
            callout('Схема', 'новые признаки (X_new) → получение прогноза (predict) → предсказанные ответы (y_pred)', 'schema'),
          ],
          codeExamples: [
            code('python', `
              y_pred = model.predict(X_new)
            `, undefined, '`predict` использует уже обученную модель и не получает `y_train`.'),
          ],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-model-fit-predict-compare',
      'Обучение и предсказание: в чём разница',
      '`fit` и `predict` решают разные задачи.',
      [
        section('comparison', 'Не путать два этапа', [
          '`fit` меняет модель: она подбирает внутренние параметры по обучающим данным. `predict` не учит модель заново, а использует уже найденную зависимость для новых объектов.',
          'На практике эти этапы часто идут рядом в коде, но смысл у них разный. Если во время предсказания подать `y_new`, это уже не реальный сценарий: target нового объекта обычно неизвестен.',
        ], {
          table: {
            headers: ['Этап', 'Что есть на входе', 'Что получается'],
            rows: [
              ['обучение (`fit`)', '`X_train`, `y_train`', 'обученная модель'],
              ['предсказание (`predict`)', '`X_new` или `X_test`', 'предсказанные ответы (`y_pred`)'],
            ],
          },
          callouts: [
            callout('Запомните', 'При обучении есть признаки и правильные ответы. При предсказании есть признаки, но правильный ответ неизвестен.', 'remember'),
          ],
        }),
      ],
    ),
    quizStep(
      'ml-foundations-model-fit-predict-quiz',
      'Где fit, а где predict',
      'Проверяем смысл двух действий.',
      singleQuiz(
        'quiz-ml-foundations-fit-predict',
        'fit и predict',
        'ml-foundations-model-fit-predict',
        'ml-foundations',
        'Какой шаг подбирает параметры модели по `X_train` и `y_train`?',
        [
          { id: 'a', text: '`fit`' },
          { id: 'b', text: '`predict`' },
          { id: 'c', text: 'вывод таблицы' },
          { id: 'd', text: 'сортировка колонок' },
        ],
        'a',
        '`fit` обучает модель на признаках и правильных ответах. `predict` применяет уже обученную модель.',
      ),
    ),
    practiceStep(
      'ml-foundations-model-fit-predict-practice',
      'Разложить этапы обучения',
      'Выводим правильный порядок базовых этапов.',
      makeStdinTask(
        'task-ml-foundations-order-fit-predict',
        'Разложить этапы обучения',
        'На вход подаются четыре этапа в произвольном порядке. Выведите правильный порядок через пробел: сначала сбор данных, затем обучение, затем предсказание, затем оценка.',
        `
          # TODO: считайте строку с этапами

          # TODO: выведите этапы в правильном порядке
        `,
        [
          { id: 's1', description: 'Перемешанный порядок', input: 'predict_new collect_data evaluate fit_model', expectedOutput: 'collect_data fit_model predict_new evaluate' },
        ],
        [
          { id: 'h1', description: 'Другой порядок', input: 'evaluate fit_model collect_data predict_new', expectedOutput: 'collect_data fit_model predict_new evaluate' },
        ],
        `
          _stages = input().split()
          print("collect_data fit_model predict_new evaluate")
        `,
      ),
    ),
  ],
)
