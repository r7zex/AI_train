import type { FlowTopic } from '../aiCurriculumTypes'
import { callout, code, introTopic, makeStdinTask, practiceStep, quizStep, section, singleQuiz, theoryStep } from './helpers'

export const topicPandasBasics: FlowTopic = introTopic(
  'pandas-basics',
  '2.4 Анализ данных с Pandas',
  6,
  'Учимся работать с таблицами в Python.',
  'Pandas — это Excel на стероидах. Он позволяет обрабатывать миллионы строк кода за секунды.',
  ['pandas', 'dataframe', 'series', 'read_csv', 'filtering'],
  ['df = pd.read_csv()', 'df.head()', 'df.groupby()'],
  ['Series — это столбец', 'DataFrame — это вся таблица', 'Pandas быстрее циклов'],
  [
    theoryStep(
      'pandas-intro',
      'Зачем нужен Pandas?',
      'Почему недостаточно обычных списков или NumPy.',
      [
        section('concept', 'Таблицы и метаданные', [
          'В реальном мире данные редко бывают просто набором чисел. У них есть названия столбцов (имя, дата, цена) и индексы строк. **Pandas** добавляет этот слой метаданных поверх массивов NumPy.',
          'Основные объекты:',
          '1. **Series**: одномерный массив с метками (один столбец).',
          '2. **DataFrame**: двумерная таблица (набор столбцов).',
        ], {
          callouts: [
            callout('Связь', 'Pandas внутри использует NumPy, поэтому он очень быстрый.', 'schema'),
          ],
        }),
      ],
    ),
    theoryStep(
      'pandas-filtering',
      'Фильтрация данных',
      'Как достать нужные строки без циклов.',
      [
        section('concept', 'Булева маска', [
          'В Pandas мы не пишем `for row in table: if row...`. Мы используем условия напрямую к столбцам.',
        ], {
          codeExamples: [
            code('python', `
              # Найти всех клиентов старше 30 лет
              senior_clients = df[df['age'] > 30]
            `, 'senior_clients', 'Результатом будет новый DataFrame только с нужными строками.'),
          ],
        }),
      ],
    ),
    quizStep(
      'quiz-pandas-1',
      'Структуры данных',
      'Проверяем знание основ.',
      singleQuiz(
        'quiz-pandas-df',
        'Что такое DataFrame?',
        'pandas-basics',
        'data-analysis',
        'Какое определение лучше всего описывает DataFrame в Pandas?',
        [
          { id: 'a', text: 'Список списков в Python' },
          { id: 'b', text: 'Двумерная таблица с именованными столбцами и строками' },
          { id: 'c', text: 'Просто массив чисел без метаданных' },
          { id: 'd', text: 'Словарь, где ключи — это строки' },
        ],
        'b',
        'DataFrame — это именно табличная структура с заголовками.',
      ),
    ),
  ],
)
