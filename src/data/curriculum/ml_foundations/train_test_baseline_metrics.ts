import type { FlowTopic } from '../../aiCurriculumTypes'
import { callout, makeStdinTask, mlFoundationsTopic, practiceStep, quizStep, section, singleQuiz, theoryStep } from '../helpers'

export const topicMlTrainTestBaselineMetrics: FlowTopic = mlFoundationsTopic(
  'ml-foundations-train-test-baseline-metrics',
  '4.3 Train/test, baseline и метрики',
  3,
  'Разбираем, зачем проверять модель на отложенных данных, с чем сравнивать качество и какие метрики встречаются в регрессии и классификации.',
  'Train нужен для обучения, test - для честной проверки, baseline - простое решение, метрика - число качества.',
  ['train', 'test', 'overfitting', 'baseline', 'metric', 'MAE', 'MSE', 'RMSE', 'R²', 'accuracy', 'precision', 'recall', 'F1'],
  ['train → fit', 'test → predict → metric', 'quality > baseline'],
  ['Проверка на train может обмануть; baseline задаёт минимальный уровень; метрика выбирается под тип задачи.'],
  [
    theoryStep(
      'ml-foundations-train-test-baseline-metrics-split',
      'Train/test',
      'Train используют для обучения, test - для проверки на новых данных.',
      [
        section('why', 'Почему нельзя верить качеству на train', [
          'Если оценивать модель на тех же данных, где она училась, результат может быть слишком хорошим. Модель могла подстроиться под обучающие примеры, но плохо работать на новых объектах.',
          'Эту проблему на уровне идеи называют **overfitting**: модель слишком хорошо запомнила train и хуже обобщает закономерности. Поэтому данные делят на `train` и `test`.',
        ], {
          table: {
            headers: ['Часть данных', 'Назначение', 'Что делаем'],
            rows: [
              ['`train`', 'обучение', 'вызываем `fit`'],
              ['`test`', 'проверка', 'вызываем `predict` и считаем метрику'],
            ],
          },
          callouts: [
            callout('Схема', '`X_train + y_train → fit → trained model`\n`X_test → predict → y_pred`\n`y_test + y_pred → metric`', 'schema'),
          ],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-train-test-baseline-metrics-baseline',
      'Baseline',
      'Baseline - простое решение, которое модель должна побить.',
      [
        section('definition', 'Зачем нужен простой ориентир', [
          '**Baseline** нужен, чтобы понять, есть ли смысл в модели. Если сложный алгоритм не лучше простого правила, проблема может быть в данных, признаках, метрике или постановке задачи.',
          'Для регрессии baseline часто предсказывает среднее или медиану `target`. Для классификации baseline часто всегда выбирает самый частый класс.',
        ], {
          table: {
            headers: ['Тип задачи', 'Пример baseline'],
            rows: [
              ['регрессия', 'всегда предсказывать среднюю цену'],
              ['классификация', 'всегда предсказывать самый частый класс'],
            ],
          },
          callouts: [
            callout('Запомните', 'Метрика без baseline плохо читается: непонятно, модель полезна или просто сложнее простого решения.', 'remember'),
          ],
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-train-test-baseline-metrics-regression',
      'Метрики регрессии',
      'Метрики регрессии измеряют числовую ошибку.',
      [
        section('overview', 'Карта метрик без углубления', [
          'В регрессии модель предсказывает число: цену, время, спрос, температуру. Метрика сравнивает `y_true` и `y_pred` и показывает, насколько прогнозы отличаются от правильных ответов.',
          '`MAE` легко объяснять в единицах target. `MSE` сильнее штрафует большие ошибки. `RMSE` возвращает ошибку к масштабу target. `R²` на уровне идеи показывает, насколько модель лучше простого прогноза средним.',
        ], {
          table: {
            headers: ['Метрика', 'Как читать'],
            rows: [
              ['MAE', 'средняя абсолютная ошибка'],
              ['MSE', 'средний квадрат ошибки'],
              ['RMSE', 'корень из MSE, ближе к масштабу target'],
              ['R²', 'насколько модель лучше простого прогноза средним'],
            ],
          },
        }),
      ],
    ),
    theoryStep(
      'ml-foundations-train-test-baseline-metrics-classification',
      'Метрики классификации',
      'Метрики классификации считают правильные и ошибочные классы.',
      [
        section('overview', 'Accuracy, precision, recall, F1', [
          'В классификации модель выбирает класс. `accuracy` показывает долю правильных ответов, но при редком важном классе она может обманывать.',
          '`precision` отвечает, насколько точны найденные положительные случаи. `recall` отвечает, сколько настоящих положительных случаев модель нашла. `F1` даёт один компромиссный показатель между precision и recall.',
        ], {
          table: {
            headers: ['Метрика', 'Вопрос'],
            rows: [
              ['accuracy', 'какая доля всех ответов верна?'],
              ['precision', 'насколько точны найденные положительные?'],
              ['recall', 'сколько настоящих положительных нашли?'],
              ['F1', 'какой баланс между precision и recall?'],
            ],
          },
          callouts: [
            callout('Типичная ошибка', 'Использовать только `accuracy` на несбалансированных классах. Если 98% клиентов не уходят, baseline “все не уйдут” уже даст 98% accuracy, но не найдёт клиентов с риском оттока.', 'important'),
          ],
        }),
        section('summary-table', 'Baseline и метрика вместе', [
          'Выбор метрики зависит от задачи и цены ошибок. В вводном блоке достаточно видеть общую карту, а не считать все формулы вручную.',
        ], {
          table: {
            headers: ['Задача', 'Baseline', 'Метрика'],
            rows: [
              ['Цена квартиры', 'средняя цена', 'MAE / RMSE'],
              ['Спам', 'самый частый класс', 'precision / recall / F1'],
              ['Отток клиента', 'самый частый класс', 'recall / F1'],
            ],
          },
        }),
      ],
    ),
    quizStep(
      'ml-foundations-train-test-baseline-metrics-quiz-baseline',
      'Выбрать baseline',
      'Проверяем простую точку сравнения.',
      singleQuiz(
        'quiz-ml-foundations-baseline',
        'Baseline',
        'ml-foundations-train-test-baseline-metrics',
        'ml-foundations',
        'Какой baseline подходит для первой проверки задачи классификации?',
        [
          { id: 'a', text: 'Всегда предсказывать самый частый класс' },
          { id: 'b', text: 'Подставить target в X' },
          { id: 'c', text: 'Проверять качество только на train' },
          { id: 'd', text: 'Не считать метрику' },
        ],
        'a',
        'Для классификации простой baseline часто выбирает самый частый класс. Модель должна показать качество выше этого ориентира.',
      ),
    ),
    quizStep(
      'ml-foundations-train-test-baseline-metrics-quiz-metric',
      'Выбрать метрику',
      'Проверяем базовый выбор метрики по типу задачи.',
      singleQuiz(
        'quiz-ml-foundations-metric',
        'Метрика',
        'ml-foundations-train-test-baseline-metrics',
        'ml-foundations',
        'Нужно оценить ошибку прогноза цены квартиры в рублях. Какая метрика будет самой понятной для первого отчёта?',
        [
          { id: 'a', text: 'MAE' },
          { id: 'b', text: 'accuracy' },
          { id: 'c', text: 'precision' },
          { id: 'd', text: 'recall' },
        ],
        'a',
        'MAE читается в единицах target, поэтому ошибку цены можно объяснить в рублях.',
      ),
    ),
    practiceStep(
      'ml-foundations-train-test-baseline-metrics-practice',
      'Посчитать простой baseline',
      'Для регрессии выводим среднее значение target.',
      makeStdinTask(
        'task-ml-foundations-regression-baseline',
        'Baseline для регрессии',
        'На вход подаётся список чисел `y` через пробел. Выведите baseline-предсказание как среднее значение, округлённое вниз до целого числа.',
        `
          # TODO: считайте список значений y

          # TODO: посчитайте среднее значение

          # TODO: подготовьте ответ
        `,
        [
          { id: 's1', description: 'Цены', input: '3000000 4000000 5000000', expectedOutput: '4000000' },
        ],
        [
          { id: 'h1', description: 'Четыре значения', input: '100 200 300 400', expectedOutput: '250' },
          { id: 'h2', description: 'Неровное среднее', input: '1 2 2', expectedOutput: '1' },
        ],
        `
          values = list(map(float, input().split()))
          baseline = sum(values) / len(values)
          print(int(baseline))
        `,
      ),
    ),
  ],
)
