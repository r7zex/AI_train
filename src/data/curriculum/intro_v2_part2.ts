import type { FlowTopic } from '../aiCurriculumTypes'
import { callout, introTopic, makeStdinTask, practiceStep, quizStep, section, singleQuiz, theoryStep } from './helpers'

/**
 * TOPIC 1.3: ML Project Lifecycle
 * New topic about how real ML projects are built.
 */
export const topicMlProjectLifecycle: FlowTopic = introTopic(
  'ml-project-lifecycle',
  '1.3 Жизненный цикл ML-проекта',
  3,
  'От бизнес-задачи до работающей модели в продакшене.',
  'Узнаем, почему обучение модели — это лишь 10% работы ML-инженера.',
  ['бизнес-задача', 'сбор данных', 'EDA', 'обучение', 'валидация', 'деплой'],
  ['Data -> Preprocessing -> Model -> Evaluation -> Deploy'],
  ['Сначала бизнес-цель, потом данные', 'EDA помогает понять данные', 'Модель нужно постоянно переобучать'],
  [
    theoryStep(
      'ml-lifecycle-steps',
      'Основные этапы',
      'Путь от идеи до реализации.',
      [
        section('steps', '7 шагов к успеху', [
          'Разработка ML-системы — это итеративный процесс. Он состоит из следующих этапов:',
          '1. **Определение задачи**: что мы хотим улучшить? Какую метрику бизнеса поднять?',
          '2. **Сбор и подготовка данных**: поиск источников, очистка от мусора и дублей.',
          '3. **EDA (Разведочный анализ)**: визуализация, поиск аномалий и корреляций.',
          '4. **Feature Engineering**: создание новых признаков из сырых данных.',
          '5. **Обучение модели**: выбор алгоритма и подбор гиперпараметров.',
          '6. **Валидация**: проверка качества на данных, которые модель не видела.',
          '7. **Деплой и мониторинг**: запуск в работу и слежение за тем, чтобы качество не упало со временем.',
        ], {
          callouts: [
            callout('Реальность', 'Больше всего времени (до 80%) уходит на первые три этапа — работу с данными.', 'important'),
          ],
        }),
      ],
    ),
  ],
)

/**
 * TOPIC 1.4: Evaluation Metrics (Comprehensive)
 * Expanded version of the previous metrics topic.
 */
export const topicMetricsDeep: FlowTopic = introTopic(
  'metrics-deep',
  '1.4 Метрики: как понять, что модель хорошая?',
  4,
  'Разбираемся в Accuracy, Precision, Recall и F1-score на глубоком уровне.',
  'Узнаем, почему 99% точности может быть признаком плохой модели.',
  ['accuracy', 'precision', 'recall', 'f1-score', 'confusion matrix'],
  ['Accuracy = (TP + TN) / All', 'Precision = TP / (TP + FP)', 'Recall = TP / (TP + FN)'],
  ['Accuracy врет на несбалансированных данных', 'Precision — точность "да"', 'Recall — полнота поиска'],
  [
    theoryStep(
      'accuracy-paradox',
      'Парадокс Accuracy',
      'Почему высокая точность не всегда радость.',
      [
        section('concept', 'Проблема редких событий', [
          'Представьте, что вы создаете модель для обнаружения редкой болезни, которая встречается у 1 человека из 1000.',
          'Если ваша модель будет **всегда говорить "здоров"**, её Accuracy составит **99.9%**. Но такая модель абсолютно бесполезна, так как она не нашла ни одного больного.',
        ], {
          callouts: [
            callout('Вывод', 'Accuracy нельзя использовать, если классы в данных распределены неравномерно (несбалансированные данные).', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'confusion-matrix-deep',
      'Матрица ошибок (Confusion Matrix)',
      'Фундамент для понимания всех метрик.',
      [
        section('concept', 'Четыре исхода предсказания', [
          'Любое предсказание бинарной классификации попадает в одну из четырех ячеек:',
        ], {
          table: {
            headers: ['Реальность \\ Прогноз', 'Модель сказала 1', 'Модель сказала 0'],
            rows: [
              ['На самом деле 1', '**TP** (True Positive)', '**FN** (False Negative)'],
              ['На самом деле 0', '**FP** (False Positive)', '**TN** (True Negative)'],
            ],
          },
          callouts: [
            callout('TP (Успех)', 'Больной классифицирован как больной.', 'example'),
            callout('FP (Ложная тревога)', 'Здоровый классифицирован как больной.', 'example'),
            callout('FN (Пропуск)', 'Больной классифицирован как здоровый (Самое опасное!).', 'example'),
          ],
        }),
      ],
    ),
    quizStep(
      'quiz-metrics-deep-1',
      'Выбор метрики в медицине',
      'Проверяем понимание рисков.',
      singleQuiz(
        'quiz-med-metric',
        'Метрика для диагностики',
        'metrics-deep',
        'intro-ai-ml',
        'При диагностике смертельного заболевания мы хотим максимально снизить риск того, что больной человек уйдет из клиники с диагнозом "здоров". Какую метрику нужно максимизировать?',
        [
          { id: 'a', text: 'Accuracy' },
          { id: 'b', text: 'Precision' },
          { id: 'c', text: 'Recall' },
          { id: 'd', text: 'L2-norm' },
        ],
        'c',
        'Recall (полнота) отвечает за то, какую долю реальных положительных объектов (больных) мы нашли. Максимальный Recall = минимум пропусков (FN).',
      ),
    ),
    practiceStep(
      'practice-metrics-calc-v2',
      'Расчет метрик на Python',
      'Пишем код для оценки качества классификатора.',
      makeStdinTask(
        'task-metrics-v2',
        'Реализация Precision и Recall',
        'Напишите программу, которая принимает на вход TP, FP, FN и выводит Precision и Recall через пробел с точностью до 2 знаков.',
        `
          tp = int(input())
          fp = int(input())
          fn = int(input())
          
          # TODO: посчитайте precision

          # TODO: посчитайте recall

          # TODO: выведите precision и recall
        `,
        [
          { id: 's1', description: 'Тест 1', input: '10\n2\n3', expectedOutput: '0.83 0.77' },
        ],
        [
          { id: 'h1', description: 'Тест 2', input: '100\n0\n50', expectedOutput: '1.00 0.67' },
        ],
        `
          tp = int(input())
          fp = int(input())
          fn = int(input())
          
          p = tp / (tp + fp) if (tp + fp) > 0 else 0
          r = tp / (tp + fn) if (tp + fn) > 0 else 0
          
          print(f"{p:.2f} {r:.2f}")
        `,
      ),
    ),
  ],
)
