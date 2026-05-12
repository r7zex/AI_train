import type { FlowTopic } from '../aiCurriculumTypes'
import { callout, code, introTopic, makeStdinTask, practiceStep, quizStep, section, singleQuiz, theoryStep } from './helpers'

export const topicMetricsPrf: FlowTopic = introTopic(
  'precision-recall-f1',
  '1.3 Метрики: Precision, Recall, F1',
  3,
  'Разбираем базовые метрики классификации, когда Accuracy недостаточно.',
  'Precision — точность ответов модели, Recall — полнота охвата реальных объектов.',
  ['precision', 'recall', 'f1-score', 'confusion matrix', 'TP', 'FP', 'FN'],
  ['P = TP / (TP + FP)', 'R = TP / (TP + FN)', 'F1 = 2PR / (P + R)'],
  ['Precision: не ошибиться в предсказании', 'Recall: не пропустить объект', 'F1: баланс между P и R'],
  [
    theoryStep(
      'metrics-prf-confusion-matrix',
      'Матрица ошибок (Confusion Matrix)',
      'База для всех метрик классификации.',
      [
        section('definition', 'Четыре исхода', [
          'В бинарной классификации (да/нет) есть четыре варианта того, как предсказание соотносится с реальностью:',
        ], {
          table: {
            headers: ['Название', 'Код', 'Смысл'],
            rows: [
              ['True Positive', '**TP**', 'Предсказали 1, на самом деле 1 (Успех)'],
              ['False Positive', '**FP**', 'Предсказали 1, на самом деле 0 (Ложная тревога)'],
              ['False Negative', '**FN**', 'Предсказали 0, на самом деле 1 (Пропуск цели)'],
              ['True Negative', '**TN**', 'Предсказали 0, на самом деле 0 (Верный отказ)'],
            ],
          },
          callouts: [
            callout('Мнемоника', 'Первое слово (**True/False**) — угадала ли модель. Второе слово (**Positive/Negative**) — что именно она предсказала.', 'remember'),
          ],
        }),
      ],
    ),
    theoryStep(
      'metrics-prf-precision',
      'Precision (Точность)',
      'Насколько можно доверять положительным ответам модели.',
      [
        section('formula', 'Формула Precision', [
          '**Precision** показывает, какая доля объектов, названных моделью положительными, реально являются таковыми.',
          'Если Precision = 0.8, это значит: в 80% случаев, когда модель сказала «это спам», это действительно был спам.',
        ], {
          callouts: [
            callout('Формула', 'P = TP / (TP + FP)', 'schema'),
            callout('Когда важна', 'В задачах, где **ложная тревога (FP) обходится дорого**. Например, блокировка аккаунта пользователя или назначение агрессивного лечения.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'metrics-prf-recall',
      'Recall (Полнота)',
      'Какую долю реальных объектов нашла модель.',
      [
        section('formula', 'Формула Recall', [
          '**Recall** показывает, какую часть всех реальных положительных объектов модель смогла найти.',
          'Если Recall = 0.6, это значит: модель нашла только 60% всех спам-писем, а 40% пропустила во входящие.',
        ], {
          callouts: [
            callout('Формула', 'R = TP / (TP + FN)', 'schema'),
            callout('Когда важна', 'В задачах, где **пропуск цели (FN) критичен**. Например, поиск дефектов на деталях самолета или диагностика опасного заболевания.', 'important'),
          ],
        }),
      ],
    ),
    theoryStep(
      'metrics-prf-f1',
      'F1-score',
      'Единая метрика, объединяющая точность и полноту.',
      [
        section('definition', 'Гармоническое среднее', [
          'Обычно между Precision и Recall есть компромисс: улучшая одно, мы портим другое. **F1-score** позволяет оценить модель одним числом.',
          'F1 не является обычным средним. Это **гармоническое среднее**, которое сильно падает, если хотя бы одна из метрик (P или R) близка к нулю.',
        ], {
          callouts: [
            callout('Формула', 'F1 = 2 * (P * R) / (P + R)', 'schema'),
            callout('Пример', 'Если P=1.0, а R=0.0 (модель ничего не нашла), обычное среднее будет 0.5, а F1 будет 0.0. Это корректно отражает бесполезность такой модели.', 'example'),
          ],
        }),
      ],
    ),
    quizStep(
      'metrics-prf-quiz-1',
      'Выбрать метрику для задачи',
      'Проверяем понимание Precision и Recall.',
      singleQuiz(
        'quiz-metrics-choice',
        'Выбор метрики',
        'precision-recall-f1',
        'intro-ai-ml',
        'В системе безопасности банка ложная блокировка карты клиента — это плохо, но пропуск мошеннической транзакции — катастрофа. Какую метрику нужно максимизировать в первую очередь?',
        [
          { id: 'a', text: 'Precision' },
          { id: 'b', text: 'Recall' },
          { id: 'c', text: 'Accuracy' },
          { id: 'd', text: 'L1-norm' },
        ],
        'b',
        'Если пропуск цели (FN) критичен, нужно максимизировать Recall.',
      ),
    ),
    practiceStep(
      'metrics-prf-practice-calc',
      'Расчет метрик вручную',
      'Реализуем расчет P, R и F1 на Python.',
      makeStdinTask(
        'task-metrics-calc',
        'Написать функции для метрик',
        'На вход подаются три числа: TP, FP, FN. Выведите Precision, Recall и F1-score с точностью до 3 знаков.',
        `
          tp = int(input())
          fp = int(input())
          fn = int(input())
          
          # TODO: рассчитайте precision
          # TODO: рассчитайте recall
          # TODO: рассчитайте f1
          
          print(f"{precision:.3f}")
          print(f"{recall:.3f}")
          print(f"{f1:.3f}")
        `,
        [
          { id: 's1', description: 'Базовый случай', input: '80\n20\n40', expectedOutput: '0.800\n0.667\n0.727' },
        ],
        [
          { id: 'h1', description: 'Высокая точность', input: '100\n0\n50', expectedOutput: '1.000\n0.667\n0.800' },
          { id: 'h2', description: 'Низкая полнота', input: '10\n5\n100', expectedOutput: '0.667\n0.091\n0.160' },
        ],
        `
          tp = int(input())
          fp = int(input())
          fn = int(input())
          
          precision = tp / (tp + fp) if (tp + fp) > 0 else 0
          recall = tp / (tp + fn) if (tp + fn) > 0 else 0
          f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
          
          print(f"{precision:.3f}")
          print(f"{recall:.3f}")
          print(f"{f1:.3f}")
        `,
      ),
    ),
  ],
)
