export interface HandbookAssignment {
  title: string
  url: string
  type: 'contest'
}

export interface HandbookArticle {
  articleNumber: string
  title: string
  slug: string
  url: string
  chapterNumber: number
  chapterTitle: string
  chapterGoal: string
  keySections: string[]
  assignments: HandbookAssignment[]
  hasAssignment: boolean
}

export interface HandbookChapter {
  chapterNumber: number
  chapterTitle: string
  chapterGoal: string
  articles: HandbookArticle[]
  totalArticles: number
  totalAssignments: number
}

export const yandexHandbookChapters: HandbookChapter[] = [
  {
    "chapterNumber": 1,
    "chapterTitle": "1. Введение",
    "chapterGoal": "build the ML vocabulary and initial problem framing",
    "articles": [
      {
        "articleNumber": "1.1",
        "title": "Об этой книге",
        "slug": "about",
        "url": "https://education.yandex.ru/handbook/ml/article/about",
        "chapterNumber": 1,
        "chapterTitle": "1. Введение",
        "chapterGoal": "build the ML vocabulary and initial problem framing",
        "keySections": [
          "Key definitions and notation",
          "Model assumptions and constraints",
          "Typical mistakes and diagnostics",
          "Practical interpretation of results"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "1.2",
        "title": "Первые шаги",
        "slug": "pervie-shagi",
        "url": "https://education.yandex.ru/handbook/ml/article/pervie-shagi",
        "chapterNumber": 1,
        "chapterTitle": "1. Введение",
        "chapterGoal": "build the ML vocabulary and initial problem framing",
        "keySections": [
          "Рабочее окружение для ML-специалиста",
          "SaaS-платформы",
          "Получение доступа и настройка DataSphere",
          "Лабораторная работа",
          "Полезные ссылки"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "1.3",
        "title": "Машинное обучение",
        "slug": "mashinnoye-obucheniye",
        "url": "https://education.yandex.ru/handbook/ml/article/mashinnoye-obucheniye",
        "chapterNumber": 1,
        "chapterTitle": "1. Введение",
        "chapterGoal": "build the ML vocabulary and initial problem framing",
        "keySections": [
          "Постановка задачи",
          "Критерии качества",
          "Данные",
          "Модель и алгоритм обучения",
          "Выбор модели, переобучение",
          "После обучения"
        ],
        "assignments": [
          {
            "title": "Practical assignment (Yandex Contest)",
            "url": "https://new.contest.yandex.ru/60376/problem",
            "type": "contest"
          }
        ],
        "hasAssignment": true
      }
    ],
    "totalArticles": 3,
    "totalAssignments": 1
  },
  {
    "chapterNumber": 2,
    "chapterTitle": "2. Классическое обучение с учителем",
    "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
    "articles": [
      {
        "articleNumber": "2.1",
        "title": "Введение",
        "slug": "vvedenie-glava-dva",
        "url": "https://education.yandex.ru/handbook/ml/article/vvedenie-glava-dva",
        "chapterNumber": 2,
        "chapterTitle": "2. Классическое обучение с учителем",
        "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
        "keySections": [
          "Классическое обучение с учителем",
          "Key definitions and notation",
          "Model assumptions and constraints",
          "Typical mistakes and diagnostics"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "2.2",
        "title": "Линейные модели",
        "slug": "linear-models",
        "url": "https://education.yandex.ru/handbook/ml/article/linear-models",
        "chapterNumber": 2,
        "chapterTitle": "2. Классическое обучение с учителем",
        "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
        "keySections": [
          "Введение",
          "Математическое описание",
          "Линейная регрессия и метод наименьших квадратов (МНК)",
          "Сведение к задаче оптимизации",
          "МНК: точный аналитический метод",
          "МНК: приближенный численный метод",
          "Стохастический градиентный спуск",
          "Неградиентные методы"
        ],
        "assignments": [
          {
            "title": "Practical assignment (Yandex Contest)",
            "url": "https://new.contest.yandex.ru/60377/problem",
            "type": "contest"
          }
        ],
        "hasAssignment": true
      },
      {
        "articleNumber": "2.3",
        "title": "Метрические методы",
        "slug": "metricheskiye-metody",
        "url": "https://education.yandex.ru/handbook/ml/article/metricheskiye-metody",
        "chapterNumber": 2,
        "chapterTitle": "2. Классическое обучение с учителем",
        "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
        "keySections": [
          "Введение",
          "Метод k-ближайших соседей (KNN)",
          "Формальное описание",
          "Выбор метрики",
          "Обобщения алгоритма",
          "Преимущества и недостатки",
          "Применение",
          "Поиск ближайших соседей"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "2.4",
        "title": "Решающие деревья",
        "slug": "reshayushchiye-derevya",
        "url": "https://education.yandex.ru/handbook/ml/article/reshayushchiye-derevya",
        "chapterNumber": 2,
        "chapterTitle": "2. Классическое обучение с учителем",
        "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
        "keySections": [
          "Введение",
          "Определение решающего дерева",
          "Почему построение оптимального решающего дерева — сложная задача",
          "Жадный алгоритм построения решающего дерева",
          "Критерии ветвления: общая идея",
          "Информативность в задаче регрессии: MSE",
          "Информативность в задаче регрессии: MAE",
          "Критерий информативности в задаче классификации: misclassification error"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "2.5",
        "title": "Ансамбли в машинном обучении",
        "slug": "ansambli-v-mashinnom-obuchenii",
        "url": "https://education.yandex.ru/handbook/ml/article/ansambli-v-mashinnom-obuchenii",
        "chapterNumber": 2,
        "chapterTitle": "2. Классическое обучение с учителем",
        "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
        "keySections": [
          "Введение",
          "Смещение и разброс",
          "Бэггинг",
          "Математическое обоснование",
          "Пример: бэггинг над решающими деревьями",
          "Случайный лес",
          "Какая должна быть глубина деревьев в случайном лесу",
          "Сколько признаков надо подавать дереву для обучения"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "2.6",
        "title": "Градиентный бустинг",
        "slug": "gradientnyj-busting",
        "url": "https://education.yandex.ru/handbook/ml/article/gradientnyj-busting",
        "chapterNumber": 2,
        "chapterTitle": "2. Классическое обучение с учителем",
        "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
        "keySections": [
          "Введение",
          "Интуиция",
          "Пример с задачей регрессии: формальное описание",
          "Обобщение на другие функции потерь",
          "Математическое обоснование",
          "Обучение базового алгоритма",
          "На практике",
          "Проблема переобучения"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "2.7",
        "title": "Заключение",
        "slug": "dva-zakliuchenie",
        "url": "https://education.yandex.ru/handbook/ml/article/dva-zakliuchenie",
        "chapterNumber": 2,
        "chapterTitle": "2. Классическое обучение с учителем",
        "chapterGoal": "understand core supervised learning algorithms and tradeoffs",
        "keySections": [
          "Области применения",
          "Особенности применения",
          "Что дальше"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 7,
    "totalAssignments": 1
  },
  {
    "chapterNumber": 3,
    "chapterTitle": "3. Оценка качества моделей",
    "chapterGoal": "choose proper metrics and validation protocols",
    "articles": [
      {
        "articleNumber": "3.1",
        "title": "Введение",
        "slug": "vvedenie-glava-tri",
        "url": "https://education.yandex.ru/handbook/ml/article/vvedenie-glava-tri",
        "chapterNumber": 3,
        "chapterTitle": "3. Оценка качества моделей",
        "chapterGoal": "choose proper metrics and validation protocols",
        "keySections": [
          "Оценка качества моделей",
          "Key definitions and notation",
          "Model assumptions and constraints",
          "Typical mistakes and diagnostics"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "3.2",
        "title": "Метрики классификации и регрессии",
        "slug": "metriki-klassifikacii-i-regressii",
        "url": "https://education.yandex.ru/handbook/ml/article/metriki-klassifikacii-i-regressii",
        "chapterNumber": 3,
        "chapterTitle": "3. Оценка качества моделей",
        "chapterGoal": "choose proper metrics and validation protocols",
        "keySections": [
          "Введение",
          "Функция потерь ≠ метрика качества",
          "Бинарная классификация: метки классов",
          "Confusion matrix (матрица ошибок)",
          "Решение задачи",
          "Точность и полнота",
          "Accuracy",
          "Precision"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "3.3",
        "title": "Кросс-валидация",
        "slug": "kross-validaciya",
        "url": "https://education.yandex.ru/handbook/ml/article/kross-validaciya",
        "chapterNumber": 3,
        "chapterTitle": "3. Оценка качества моделей",
        "chapterGoal": "choose proper metrics and validation protocols",
        "keySections": [
          "Введение",
          "Методы кросс-валидации",
          "Hold-out",
          "k-Fold",
          "Когда стоит заподозрить, что оценка качества модели завышена",
          "Примеры подмешивания тестовых данных в тренировочные",
          "Подумайте над задачами",
          "Полезные ссылки"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "3.4",
        "title": "Подбор гиперпараметров",
        "slug": "podbor-giperparametrov",
        "url": "https://education.yandex.ru/handbook/ml/article/podbor-giperparametrov",
        "chapterNumber": 3,
        "chapterTitle": "3. Оценка качества моделей",
        "chapterGoal": "choose proper metrics and validation protocols",
        "keySections": [
          "Введение",
          "Методы подбора гиперпараметров",
          "Первый вариант",
          "Второй вариант",
          "Методы «на каждый день»",
          "Grid Search",
          "Random Search",
          "Зафиксируем"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "3.5",
        "title": "Заключение",
        "slug": "tri-zakliuchenie",
        "url": "https://education.yandex.ru/handbook/ml/article/tri-zakliuchenie",
        "chapterNumber": 3,
        "chapterTitle": "3. Оценка качества моделей",
        "chapterGoal": "choose proper metrics and validation protocols",
        "keySections": [
          "Особенности применения",
          "Что дальше",
          "Key definitions and notation",
          "Model assumptions and constraints"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 5,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 4,
    "chapterTitle": "4. Вероятностные модели",
    "chapterGoal": "reason with probabilistic modeling and uncertainty",
    "articles": [
      {
        "articleNumber": "4.1",
        "title": "Вероятностный подход в ML",
        "slug": "veroyatnostnyj-podhod-v-ml",
        "url": "https://education.yandex.ru/handbook/ml/article/veroyatnostnyj-podhod-v-ml",
        "chapterNumber": 4,
        "chapterTitle": "4. Вероятностные модели",
        "chapterGoal": "reason with probabilistic modeling and uncertainty",
        "keySections": [
          "Случайность как источник несовершенства модели",
          "Условное распределение на таргет, непрерывный случай",
          "Более сложные вероятностные модели",
          "Оценка максимального правдоподобия = оптимизация функции потерь",
          "Предсказание в вероятностных моделях",
          "Условное распределение на таргет, дискретный случай"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "4.2",
        "title": "Экспоненциальный класс распределений и принцип максимальной энтропии",
        "slug": "eksponencialnyj-klass-raspredelenij-i-princip-maksimalnoj-entropii",
        "url": "https://education.yandex.ru/handbook/ml/article/eksponencialnyj-klass-raspredelenij-i-princip-maksimalnoj-entropii",
        "chapterNumber": 4,
        "chapterTitle": "4. Вероятностные модели",
        "chapterGoal": "reason with probabilistic modeling and uncertainty",
        "keySections": [
          "Мотивация: метод моментов",
          "Энтропия и дивергенция Кульбака-Лейблера",
          "Принцип максимальной энтропии",
          "Экспоненциальное семейство распределений",
          "MLE для семейства из экспоненциального класса",
          "Теорема Купмана-Питмана-Дармуа"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "4.3",
        "title": "Обобщённые линейные модели",
        "slug": "obobshyonnye-linejnye-modeli",
        "url": "https://education.yandex.ru/handbook/ml/article/obobshyonnye-linejnye-modeli",
        "chapterNumber": 4,
        "chapterTitle": "4. Вероятностные модели",
        "chapterGoal": "reason with probabilistic modeling and uncertainty",
        "keySections": [
          "Мотивация",
          "Определение",
          "Что даёт нам принадлежность экспоненциальному классу?",
          "Примеры"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "4.4",
        "title": "Как оценивать вероятности",
        "slug": "kak-ocenivat-veroyatnosti",
        "url": "https://education.yandex.ru/handbook/ml/article/kak-ocenivat-veroyatnosti",
        "chapterNumber": 4,
        "chapterTitle": "4. Вероятностные модели",
        "chapterGoal": "reason with probabilistic modeling and uncertainty",
        "keySections": [
          "Что же такое вероятность класса, если объект либо принадлежит этому классу, либо нет?",
          "Вам скажут: логистическая регрессия корректно действительно предсказывает вероятности",
          "Но почему же все твердят, что логистическая регрессия хорошо калибрована?!",
          "Как же всё-таки предсказать вероятности: методы калибровки",
          "Как измерить качество калибровки"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "4.5",
        "title": "Генеративный подход к классификации",
        "slug": "generativnyj-podhod-k-klassifikacii",
        "url": "https://education.yandex.ru/handbook/ml/article/generativnyj-podhod-k-klassifikacii",
        "chapterNumber": 4,
        "chapterTitle": "4. Вероятностные модели",
        "chapterGoal": "reason with probabilistic modeling and uncertainty",
        "keySections": [
          "Генеративный и дискриминативный подходы к обучению",
          "Gaussian discriminant analysis",
          "Linear Discriminant Analysis",
          "Метод наивного байеса",
          "Оценка одномерного распределения",
          "Наивный байесовский подход и логистическая регрессия"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "4.6",
        "title": "Байесовский подход к оцениванию",
        "slug": "bajesovskij-podhod-k-ocenivaniyu",
        "url": "https://education.yandex.ru/handbook/ml/article/bajesovskij-podhod-k-ocenivaniyu",
        "chapterNumber": 4,
        "chapterTitle": "4. Вероятностные модели",
        "chapterGoal": "reason with probabilistic modeling and uncertainty",
        "keySections": [
          "Априорное знание",
          "Оцениваем не значение параметра, а его распределение",
          "Построение апостериорного распределения",
          "Сопряжённые распределения",
          "Оценка апостериорного максимума (MAP)",
          "Связь MAP- и MLE-оценок",
          "Байесовские оценки для условных распределений",
          "Пример: линейная регрессия с -регуляризацией как модель с гауссовским априорным распределением на веса"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "4.7",
        "title": "Модели с латентными переменными",
        "slug": "modeli-s-latentnymi-peremennymi",
        "url": "https://education.yandex.ru/handbook/ml/article/modeli-s-latentnymi-peremennymi",
        "chapterNumber": 4,
        "chapterTitle": "4. Вероятностные модели",
        "chapterGoal": "reason with probabilistic modeling and uncertainty",
        "keySections": [
          "Зачем нужны модели с латентными переменными",
          "Смеси распределений",
          "Как генерировать из смеси распределений",
          "Модели со скрытыми переменными",
          "EM-алгоритм",
          "Жёсткий EM-алгоритм",
          "Разделение смеси гауссиан",
          "Вероятностный PCA"
        ],
        "assignments": [
          {
            "title": "Practical assignment (Yandex Contest)",
            "url": "https://new.contest.yandex.ru/60380/problem",
            "type": "contest"
          }
        ],
        "hasAssignment": true
      }
    ],
    "totalArticles": 7,
    "totalAssignments": 1
  },
  {
    "chapterNumber": 5,
    "chapterTitle": "5. Глубинное обучение - введение",
    "chapterGoal": "learn the foundations of deep learning optimization",
    "articles": [
      {
        "articleNumber": "5.1",
        "title": "Нейронные сети",
        "slug": "nejronnye-seti",
        "url": "https://education.yandex.ru/handbook/ml/article/nejronnye-seti",
        "chapterNumber": 5,
        "chapterTitle": "5. Глубинное обучение - введение",
        "chapterGoal": "learn the foundations of deep learning optimization",
        "keySections": [
          "Key definitions and notation",
          "Model assumptions and constraints",
          "Typical mistakes and diagnostics",
          "Practical interpretation of results"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "5.2",
        "title": "Первое знакомство с полносвязными нейросетями",
        "slug": "pervoe-znakomstvo-s-polnosvyaznymi-nejrosetyami",
        "url": "https://education.yandex.ru/handbook/ml/article/pervoe-znakomstvo-s-polnosvyaznymi-nejrosetyami",
        "chapterNumber": 5,
        "chapterTitle": "5. Глубинное обучение - введение",
        "chapterGoal": "learn the foundations of deep learning optimization",
        "keySections": [
          "Основные определения",
          "Forward & backward propagation",
          "Архитектуры для простейших задач",
          "Бинарная классификация",
          "Многоклассовая классификация",
          "(Множественная) регрессия",
          "Всё вместе",
          "Популярные функции активации"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "5.3",
        "title": "Метод обратного распространения ошибки",
        "slug": "metod-obratnogo-rasprostraneniya-oshibki",
        "url": "https://education.yandex.ru/handbook/ml/article/metod-obratnogo-rasprostraneniya-oshibki",
        "chapterNumber": 5,
        "chapterTitle": "5. Глубинное обучение - введение",
        "chapterGoal": "learn the foundations of deep learning optimization",
        "keySections": [
          "Метод обратного распространения ошибки (backward propagation)",
          "Backward propagation в одномерном случае",
          "Почему же нельзя просто пойти и начать везде вычислять производные?",
          "Градиент сложной функции",
          "Градиенты для типичных слоёв",
          "Пример №1",
          "Пример №2",
          "Пример №3"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "5.4",
        "title": "Тонкости обучения",
        "slug": "tonkosti-obucheniya",
        "url": "https://education.yandex.ru/handbook/ml/article/tonkosti-obucheniya",
        "chapterNumber": 5,
        "chapterTitle": "5. Глубинное обучение - введение",
        "chapterGoal": "learn the foundations of deep learning optimization",
        "keySections": [
          "Инициализируем правильно",
          "Наивный подход №0: инициализация нулем/константой",
          "Эвристический подход №1: инициализация случайными числами",
          "Подход №2: Xavier & Normalized Xavier initialization",
          "Подход №3: Kaiming initialization",
          "Промежуточные выводы",
          "Методы оптимизации в нейронных сетях",
          "Регуляризация нейронных сетей"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 4,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 6,
    "chapterTitle": "6. Глубинное обучение - архитектуры",
    "chapterGoal": "understand architecture choices in modern neural networks",
    "articles": [
      {
        "articleNumber": "6.1",
        "title": "Свёрточные нейросети",
        "slug": "svyortochnye-nejroseti",
        "url": "https://education.yandex.ru/handbook/ml/article/svyortochnye-nejroseti",
        "chapterNumber": 6,
        "chapterTitle": "6. Глубинное обучение - архитектуры",
        "chapterGoal": "understand architecture choices in modern neural networks",
        "keySections": [
          "Формат данных",
          "MLP",
          "Недостаток №1: количество параметров",
          "Недостаток №2: структура данных никак не учитывается.",
          "Свёртки",
          "Формальное определение свёртки",
          "Свёртки не только для изображений",
          "Поворот, отражение, масштабирование"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "6.2",
        "title": "Нейросети для работы с последовательностями",
        "slug": "nejroseti-dlya-raboty-s-posledovatelnostyami",
        "url": "https://education.yandex.ru/handbook/ml/article/nejroseti-dlya-raboty-s-posledovatelnostyami",
        "chapterNumber": 6,
        "chapterTitle": "6. Глубинное обучение - архитектуры",
        "chapterGoal": "understand architecture choices in modern neural networks",
        "keySections": [
          "Word Embeddings",
          "Рекуррентные нейронные сети",
          "Bidirectional RNN",
          "Взрыв и затухание градиента в RNN",
          "LSTM",
          "Seq2seq",
          "Тонкости применения",
          "Тонкости обучения"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "6.3",
        "title": "Трансформеры",
        "slug": "transformery",
        "url": "https://education.yandex.ru/handbook/ml/article/transformery",
        "chapterNumber": 6,
        "chapterTitle": "6. Глубинное обучение - архитектуры",
        "chapterGoal": "understand architecture choices in modern neural networks",
        "keySections": [
          "Зачем нам внимание",
          "Слой внимания",
          "Особенности слоя внимания в декодере",
          "Multi-head attention",
          "Эффективность",
          "Полносвязный слой и нормализация",
          "Кодирование позиций",
          "Про BERT и GPT"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "6.4",
        "title": "Графовые нейронные сети",
        "slug": "grafovye-nejronnye-seti",
        "url": "https://education.yandex.ru/handbook/ml/article/grafovye-nejronnye-seti",
        "chapterNumber": 6,
        "chapterTitle": "6. Глубинное обучение - архитектуры",
        "chapterGoal": "understand architecture choices in modern neural networks",
        "keySections": [
          "Введение",
          "Описание графовых данных",
          "Задачи на графах",
          "Парадигмы построения графовых сверток",
          "Пространственная парадигма",
          "Спектральная парадигма"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "6.5",
        "title": "Нейросети для облаков точек",
        "slug": "nejroseti-dlya-oblakov-tochek",
        "url": "https://education.yandex.ru/handbook/ml/article/nejroseti-dlya-oblakov-tochek",
        "chapterNumber": 6,
        "chapterTitle": "6. Глубинное обучение - архитектуры",
        "chapterGoal": "understand architecture choices in modern neural networks",
        "keySections": [
          "Сенсоры для получения облаков точек",
          "LiDAR",
          "Камера RGB-D",
          "RGB-камеры",
          "Архитектуры для обработки облаков точек",
          "PointNet",
          "PointNet++",
          "Воксельные архитектуры"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 5,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 7,
    "chapterTitle": "7. Глубинное обучение - практика",
    "chapterGoal": "apply deep learning methods in practical settings",
    "articles": [
      {
        "articleNumber": "7.1",
        "title": "Обучение представлений",
        "slug": "obuchenie-predstavlenij",
        "url": "https://education.yandex.ru/handbook/ml/article/obuchenie-predstavlenij",
        "chapterNumber": 7,
        "chapterTitle": "7. Глубинное обучение - практика",
        "chapterGoal": "apply deep learning methods in practical settings",
        "keySections": [
          "Нейронные сети и выучивания представлений",
          "Representations",
          "Дообучение",
          "Prior",
          "Supervised обучение",
          "Обучение представлений через решение supervised задачи",
          "Обучение метрических эмбедингов с использование разметки (triplet loss)",
          "Self-supervised обучение"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "7.2",
        "title": "Дистилляция знаний",
        "slug": "distillyaciya-znanij",
        "url": "https://education.yandex.ru/handbook/ml/article/distillyaciya-znanij",
        "chapterNumber": 7,
        "chapterTitle": "7. Глубинное обучение - практика",
        "chapterGoal": "apply deep learning methods in practical settings",
        "keySections": [
          "Сжатие моделей",
          "Хинтоновская дистилляция знаний",
          "Формулировка",
          "Мотивация",
          "Использование температуры при подсчете KL-дивергенции",
          "DistilBERT как пример хинтоновской дистилляции",
          "Дополнительные источники знаний для дистилляции",
          "Сложность №1"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 2,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 8,
    "chapterTitle": "8. Генеративные модели",
    "chapterGoal": "compare and use major generative modeling families",
    "articles": [
      {
        "articleNumber": "8.1",
        "title": "Введение в генеративное моделирование",
        "slug": "vvedenie-v-generativnoe-modelirovanie",
        "url": "https://education.yandex.ru/handbook/ml/article/vvedenie-v-generativnoe-modelirovanie",
        "chapterNumber": 8,
        "chapterTitle": "8. Генеративные модели",
        "chapterGoal": "compare and use major generative modeling families",
        "keySections": [
          "Интерполяции в латентном пространстве",
          "Применения генеративных моделей",
          "Key definitions and notation",
          "Model assumptions and constraints"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "8.2",
        "title": "Variational Autoencoder (VAE)",
        "slug": "variational-autoencoder-(vae)",
        "url": "https://education.yandex.ru/handbook/ml/article/variational-autoencoder-(vae)",
        "chapterNumber": 8,
        "chapterTitle": "8. Генеративные модели",
        "chapterGoal": "compare and use major generative modeling families",
        "keySections": [
          "Постановка задачи",
          "Обучение VAE",
          "Вывод функции потерь",
          "Обучение VAE с помощью градиентного спуска",
          "Выбор вида используемых распределений",
          "Инференс обученной модели",
          "Conditional VAE (CVAE)",
          "Обзор статей"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "8.3",
        "title": "Генеративно-состязательные сети (GAN)",
        "slug": "generativno-sostyazatelnye-seti-(gan)",
        "url": "https://education.yandex.ru/handbook/ml/article/generativno-sostyazatelnye-seti-(gan)",
        "chapterNumber": 8,
        "chapterTitle": "8. Генеративные модели",
        "chapterGoal": "compare and use major generative modeling families",
        "keySections": [
          "Введение",
          "Основы обучения GAN-ов",
          "Метрики качества",
          "Frechet Inception Distance",
          "Интерполяции в скрытом пространстве",
          "Ближайшие соседи",
          "Базовые модели",
          "DCGAN"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "8.4",
        "title": "Нормализующие потоки",
        "slug": "normalizuyushie-potoki",
        "url": "https://education.yandex.ru/handbook/ml/article/normalizuyushie-potoki",
        "chapterNumber": 8,
        "chapterTitle": "8. Генеративные модели",
        "chapterGoal": "compare and use major generative modeling families",
        "keySections": [
          "Введение",
          "Мотивация",
          "Формула замены переменной",
          "Определение",
          "Развитие идеи",
          "NICE: Non-linear Independent Component Estimation и RealNVP",
          "Masked Autoregressive Flows",
          "Inverse Autoregressive Flows"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "8.5",
        "title": "Диффузионные модели",
        "slug": "diffuzionnye-modeli",
        "url": "https://education.yandex.ru/handbook/ml/article/diffuzionnye-modeli",
        "chapterNumber": 8,
        "chapterTitle": "8. Генеративные модели",
        "chapterGoal": "compare and use major generative modeling families",
        "keySections": [
          "Введение",
          "Более детально",
          "Обучение диффузионной модели",
          "Другой лосс. Предсказываем шум",
          "Выбор расписания",
          "Classifier guidance",
          "Classifier-free guidance",
          "Овервью ключевых работ на сегодняшний день"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "8.6",
        "title": "Языковые модели",
        "slug": "yazykovye-modeli",
        "url": "https://education.yandex.ru/handbook/ml/article/yazykovye-modeli",
        "chapterNumber": 8,
        "chapterTitle": "8. Генеративные модели",
        "chapterGoal": "compare and use major generative modeling families",
        "keySections": [
          "Что такое языковые модели?",
          "Развитие языковых моделей",
          "Статистические модели",
          "Токенизация",
          "Рекуррентные нейронные сети (RNN)",
          "Трансформеры",
          "Современные подходы",
          "GPT-1 & GPT-2"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 6,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 9,
    "chapterTitle": "9. Рекомендательные системы",
    "chapterGoal": "design and evaluate recommender systems",
    "articles": [
      {
        "articleNumber": "9.1",
        "title": "Введение в рекомендательные системы",
        "slug": "intro-recsys",
        "url": "https://education.yandex.ru/handbook/ml/article/intro-recsys",
        "chapterNumber": 9,
        "chapterTitle": "9. Рекомендательные системы",
        "chapterGoal": "design and evaluate recommender systems",
        "keySections": [
          "Где можно встретить рекомендательные системы?",
          "Формализация задачи",
          "Explicit и Implicit feedback",
          "Ранжирующая модель",
          "Коллаборативная фильтрация",
          "User2User рекомендации",
          "Item2Item рекомендации",
          "Особенности коллаборативной фильтрации"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "9.2",
        "title": "Рекомендации на основе матричных разложений",
        "slug": "rekomendacii-na-osnove-matrichnyh-razlozhenij",
        "url": "https://education.yandex.ru/handbook/ml/article/rekomendacii-na-osnove-matrichnyh-razlozhenij",
        "chapterNumber": 9,
        "chapterTitle": "9. Рекомендательные системы",
        "chapterGoal": "design and evaluate recommender systems",
        "keySections": [
          "Введение",
          "Связь с задачей матричной факторизации",
          "Постановка задачи",
          "Alternating Least Squares (ALS)",
          "ALS - шаг по (одному) :",
          "IALS (Implicit ALS)",
          "IALS: оптимизация",
          "Обобщения ALS и IALS"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "9.3",
        "title": "Контентные рекомендации",
        "slug": "kontentnye-rekomendacii",
        "url": "https://education.yandex.ru/handbook/ml/article/kontentnye-rekomendacii",
        "chapterNumber": 9,
        "chapterTitle": "9. Рекомендательные системы",
        "chapterGoal": "design and evaluate recommender systems",
        "keySections": [
          "Введение",
          "Какими бывают контентные признаки",
          "Факторизационные машины",
          "FFM – Field-aware Factorization Machines",
          "DSSM (deep sematic similiarity model)",
          "Обучение DSSM",
          "Другие функции потерь",
          "Трансформеры для рекомендаций"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "9.4",
        "title": "Хорошие свойства рекомендательных систем",
        "slug": "horoshie-svojstva-rekomendatelnyh-sistem",
        "url": "https://education.yandex.ru/handbook/ml/article/horoshie-svojstva-rekomendatelnyh-sistem",
        "chapterNumber": 9,
        "chapterTitle": "9. Рекомендательные системы",
        "chapterGoal": "design and evaluate recommender systems",
        "keySections": [
          "Введение",
          "Полнота (Coverage)",
          "Новизна (Novelty)",
          "Разнообразие (Diversity)",
          "Serendipity",
          "Заключение"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 4,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 10,
    "chapterTitle": "10. Практические главы",
    "chapterGoal": "apply ML to practical task formats",
    "articles": [
      {
        "articleNumber": "10.1",
        "title": "Кластеризация",
        "slug": "klasterizaciya",
        "url": "https://education.yandex.ru/handbook/ml/article/klasterizaciya",
        "chapterNumber": 10,
        "chapterTitle": "10. Практические главы",
        "chapterGoal": "apply ML to practical task formats",
        "keySections": [
          "Задача кластеризации",
          "Примеры задач кластеризации",
          "Простейшие методы кластеризации с помощью графов",
          "Выделение компонент связности",
          "Минимальное остовное дерево",
          "Метод K средних",
          "Выбор начального приближения",
          "Выбор метрик"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "10.2",
        "title": "Временные ряды",
        "slug": "vremennye-ryady",
        "url": "https://education.yandex.ru/handbook/ml/article/vremennye-ryady",
        "chapterNumber": 10,
        "chapterTitle": "10. Практические главы",
        "chapterGoal": "apply ML to practical task formats",
        "keySections": [
          "Введение",
          "Примеры временных рядов",
          "Прогнозирование с помощью сведения к задаче регрессии",
          "Признаки",
          "Построение прогноза",
          "Оценка качества моделей",
          "Резюме: стандартные модели ML для временных рядов",
          "Декомпозиция временных рядов"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "10.3",
        "title": "Аналитика временных рядов",
        "slug": "analitika-vremennyh-ryadov",
        "url": "https://education.yandex.ru/handbook/ml/article/analitika-vremennyh-ryadov",
        "chapterNumber": 10,
        "chapterTitle": "10. Практические главы",
        "chapterGoal": "apply ML to practical task formats",
        "keySections": [
          "Автокорреляционная функция",
          "Стационарные временные ряды",
          "Приведение к стационарным: стабилизация дисперсии",
          "Приведение к стационарным: тренд и сезонность",
          "Модели вида экспоненциального сглаживания",
          "Модель Хольта",
          "Модель Хольта-Уинтерса",
          "Адаптивное сглаживание"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "10.4",
        "title": "Модели вида ARIMA",
        "slug": "modeli-vida-arima",
        "url": "https://education.yandex.ru/handbook/ml/article/modeli-vida-arima",
        "chapterNumber": 10,
        "chapterTitle": "10. Практические главы",
        "chapterGoal": "apply ML to practical task formats",
        "keySections": [
          "Модель скользящего среднего MA( )",
          "Модель авторегрессии AR( )",
          "Модель ARMA( )",
          "Модель ARIMA( )",
          "Частичная автокорреляция",
          "Оценка коэффициентов в ARIMA",
          "Модели SARIMA и ARIMAX"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "10.5",
        "title": "Задача ранжирования",
        "slug": "zadacha-ranzhirovaniya",
        "url": "https://education.yandex.ru/handbook/ml/article/zadacha-ranzhirovaniya",
        "chapterNumber": 10,
        "chapterTitle": "10. Практические главы",
        "chapterGoal": "apply ML to practical task formats",
        "keySections": [
          "Примеры",
          "WEB-поиск",
          "Поиск синонимов",
          "Рекомендательная система",
          "Метрики качества ранжирования",
          "Бинарная релевантность",
          "Вещественная релевантность",
          "Expected Reciprocal Rank"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 5,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 11,
    "chapterTitle": "11. Взаимодействие со средой",
    "chapterGoal": "model learning in interactive environments",
    "articles": [
      {
        "articleNumber": "11.1",
        "title": "Обучение с подкреплением",
        "slug": "obuchenie-s-podkrepleniem",
        "url": "https://education.yandex.ru/handbook/ml/article/obuchenie-s-podkrepleniem",
        "chapterNumber": 11,
        "chapterTitle": "11. Взаимодействие со средой",
        "chapterGoal": "model learning in interactive environments",
        "keySections": [
          "Постановка задачи",
          "Окей, и как такое решать?",
          "А где же метод проб и ошибок?",
          "Дилемма Exploration-exploitation",
          "Добавим нейросеток",
          "Experience Replay",
          "А если пространство действий непрерывно?",
          "Policy Gradient алгоритмы"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "11.2",
        "title": "Краудсорсинг",
        "slug": "kraudsorsing",
        "url": "https://education.yandex.ru/handbook/ml/article/kraudsorsing",
        "chapterNumber": 11,
        "chapterTitle": "11. Взаимодействие со средой",
        "chapterGoal": "model learning in interactive environments",
        "keySections": [
          "Вступление",
          "Что такое краудсорсинг в ML?",
          "Ключевые принципы краудсорсинга в ML",
          "ML-задачи, где используется разметка",
          "Разметка данных",
          "Сбор данных",
          "Краудсорсинговые платформы",
          "Границы применимости краудсорсинга"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 2,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 12,
    "chapterTitle": "12. Теория ML",
    "chapterGoal": "strengthen theoretical ML fundamentals",
    "articles": [
      {
        "articleNumber": "12.1",
        "title": "Bias-variance decomposition",
        "slug": "bias-variance-decomposition",
        "url": "https://education.yandex.ru/handbook/ml/article/bias-variance-decomposition",
        "chapterNumber": 12,
        "chapterTitle": "12. Теория ML",
        "chapterGoal": "strengthen theoretical ML fundamentals",
        "keySections": [
          "Вывод разложения bias-variance для MSE",
          "Пример расчёта оценок bias и variance",
          "Bias-variance trade-off: в каких ситуациях он применим",
          "Список литературы"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 1,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 13,
    "chapterTitle": "13. Теория глубокого обучения",
    "chapterGoal": "connect deep learning practice with generalization theory",
    "articles": [
      {
        "articleNumber": "13.1",
        "title": "Введение в теорию глубокого обучения",
        "slug": "teoriya-glubokogo-obucheniya-vvedenie",
        "url": "https://education.yandex.ru/handbook/ml/article/teoriya-glubokogo-obucheniya-vvedenie",
        "chapterNumber": 13,
        "chapterTitle": "13. Теория глубокого обучения",
        "chapterGoal": "connect deep learning practice with generalization theory",
        "keySections": [
          "Key definitions and notation",
          "Model assumptions and constraints",
          "Typical mistakes and diagnostics",
          "Practical interpretation of results"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "13.2",
        "title": "Обобщающая способность – классическая теория",
        "slug": "obobshayushaya-sposobnost-klassicheskaya-teoriya",
        "url": "https://education.yandex.ru/handbook/ml/article/obobshayushaya-sposobnost-klassicheskaya-teoriya",
        "chapterNumber": 13,
        "chapterTitle": "13. Теория глубокого обучения",
        "chapterGoal": "connect deep learning practice with generalization theory",
        "keySections": [
          "Оценка супремума",
          "Симметризация и сложность Радемахера",
          "Оценка для «0/1-риска»",
          "Фундаментальная проблема равномерных оценок"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "13.3",
        "title": "PAC-байесовские оценки риска",
        "slug": "pac-bajesovskie-ocenki-riska",
        "url": "https://education.yandex.ru/handbook/ml/article/pac-bajesovskie-ocenki-riska",
        "chapterNumber": 13,
        "chapterTitle": "13. Теория глубокого обучения",
        "chapterGoal": "connect deep learning practice with generalization theory",
        "keySections": [
          "Применение пак-байесовских оценок к детерминированным алгоритмам обучения",
          "Key definitions and notation",
          "Model assumptions and constraints",
          "Typical mistakes and diagnostics"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "13.4",
        "title": "Сети бесконечной ширины",
        "slug": "seti-beskonechnoj-shiriny",
        "url": "https://education.yandex.ru/handbook/ml/article/seti-beskonechnoj-shiriny",
        "chapterNumber": 13,
        "chapterTitle": "13. Теория глубокого обучения",
        "chapterGoal": "connect deep learning practice with generalization theory",
        "keySections": [
          "Первый способ – ввести меру в пространстве весов",
          "Второй способ – вместо эволюции весов рассматривать эволюцию предсказаний модели в каждой точке",
          "Применение NTK-анализа",
          "NTK как математический аппарат",
          "Определение патологий обучения",
          "NTK и Ядровые методы",
          "Сходимость эмпирического ядра",
          "Стандартная параметризация и эволюция ядра"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "13.5",
        "title": "Ландшафт функции потерь",
        "slug": "landshaft-funkcii-poter",
        "url": "https://education.yandex.ru/handbook/ml/article/landshaft-funkcii-poter",
        "chapterNumber": 13,
        "chapterTitle": "13. Теория глубокого обучения",
        "chapterGoal": "connect deep learning practice with generalization theory",
        "keySections": [
          "Все минимумы достаточно широкой нелинейной сети глобальны",
          "Обобщения",
          "Key definitions and notation",
          "Model assumptions and constraints"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "13.6",
        "title": "Implicit bias",
        "slug": "implicit-bias",
        "url": "https://education.yandex.ru/handbook/ml/article/implicit-bias",
        "chapterNumber": 13,
        "chapterTitle": "13. Теория глубокого обучения",
        "chapterGoal": "connect deep learning practice with generalization theory",
        "keySections": [
          "Случай линейных сетей",
          "Key definitions and notation",
          "Model assumptions and constraints",
          "Typical mistakes and diagnostics"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 6,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 14,
    "chapterTitle": "14. Оптимизация в ML",
    "chapterGoal": "master optimization methods used in ML",
    "articles": [
      {
        "articleNumber": "14.1",
        "title": "Оптимизация в ML",
        "slug": "optimizaciya-v-ml",
        "url": "https://education.yandex.ru/handbook/ml/article/optimizaciya-v-ml",
        "chapterNumber": 14,
        "chapterTitle": "14. Оптимизация в ML",
        "chapterGoal": "master optimization methods used in ML",
        "keySections": [
          "Введение",
          "Градиентный спуск (GD)",
          "Стохастический градиентный спуск (SGD)",
          "Теоретический анализ",
          "Использование дополнительной информации о функции",
          "Методы второго порядка",
          "Проксимальные методы",
          "Использование информации о предыдущих шагах"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "14.2",
        "title": "Проксимальные методы",
        "slug": "proksimalnye-metody",
        "url": "https://education.yandex.ru/handbook/ml/article/proksimalnye-metody",
        "chapterNumber": 14,
        "chapterTitle": "14. Оптимизация в ML",
        "chapterGoal": "master optimization methods used in ML",
        "keySections": [
          "Проксимальная минимизация",
          "Композитная оптимизация, проксимальный градиентный метод (PGM)",
          "ISTA (Iterative Shrinkage-Thresholding Algorithm)",
          "Общие выводы"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "14.3",
        "title": "Методы второго порядка",
        "slug": "metody-vtorogo-poryadka",
        "url": "https://education.yandex.ru/handbook/ml/article/metody-vtorogo-poryadka",
        "chapterNumber": 14,
        "chapterTitle": "14. Оптимизация в ML",
        "chapterGoal": "master optimization methods used in ML",
        "keySections": [
          "Метод Ньютона",
          "Скорость сходимости метода Ньютона",
          "Метод Ньютона и плохо обусловленные задачи",
          "Слабости метода Ньютона",
          "Квазиньютоновские методы",
          "Метод касательной",
          "Метод секущей и общая схема квазиньютоновских методов",
          "BFGS"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "14.4",
        "title": "Сходимость SGD",
        "slug": "shodimost-sgd",
        "url": "https://education.yandex.ru/handbook/ml/article/shodimost-sgd",
        "chapterNumber": 14,
        "chapterTitle": "14. Оптимизация в ML",
        "chapterGoal": "master optimization methods used in ML",
        "keySections": [
          "Доказательство сходимости",
          "Методы редукции дисперсии",
          "Key definitions and notation",
          "Model assumptions and constraints"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 4,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 15,
    "chapterTitle": "15. Онлайн-обучение и стохастическая оптимизация",
    "chapterGoal": "work with online learning and stochastic optimization",
    "articles": [
      {
        "articleNumber": "15.1",
        "title": "Введение в онлайн-обучение",
        "slug": "onlajn-obuchenie-i-stohasticheskaya-optimizaciya",
        "url": "https://education.yandex.ru/handbook/ml/article/onlajn-obuchenie-i-stohasticheskaya-optimizaciya",
        "chapterNumber": 15,
        "chapterTitle": "15. Онлайн-обучение и стохастическая оптимизация",
        "chapterGoal": "work with online learning and stochastic optimization",
        "keySections": [
          "О чём раздел про онлайн-обучение, кому и зачем его читать?",
          "Оглавление",
          "Постановка задачи",
          "Предположения",
          "Поведение алгоритма на шаге T",
          "Поведение алгоритма на всей последовательности раундов игры",
          "Качество онлайн алгоритма на протяжении всей игры",
          "Online to batch conversion"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "15.2",
        "title": "Адаптивный FTRL",
        "slug": "adaptivnyj-ftrl",
        "url": "https://education.yandex.ru/handbook/ml/article/adaptivnyj-ftrl",
        "chapterNumber": 15,
        "chapterTitle": "15. Онлайн-обучение и стохастическая оптимизация",
        "chapterGoal": "work with online learning and stochastic optimization",
        "keySections": [
          "Полезные ссылки",
          "Синтаксический сахар",
          "Аддитивные регуляризаторы",
          "Setting 1",
          "Классы алгоритмов FTRL",
          "FTRL-Centered",
          "FTRL-Proximal",
          "Composite-Objective FTRL"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "15.3",
        "title": "Регуляризация в онлайн-обучении",
        "slug": "regulyarizaciya-v-onlajn-obuchenii",
        "url": "https://education.yandex.ru/handbook/ml/article/regulyarizaciya-v-onlajn-obuchenii",
        "chapterNumber": 15,
        "chapterTitle": "15. Онлайн-обучение и стохастическая оптимизация",
        "chapterGoal": "work with online learning and stochastic optimization",
        "keySections": [
          "Идея неразложения регуляризаторов в субградиентную оценку",
          "Связь между Composite-Objective FTRL и Proximal Gradient Descent. Lazy vs Greedy представления",
          "-регуляризация",
          "Отбор параметров разреженных моделей",
          "Инициализация разреженных параметров",
          "Composite-objective FTRL с -регуляризацией",
          "Linear incremental ( )",
          "Фиксированный ( )"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "15.4",
        "title": "Методы оптимизации в Deep Learning",
        "slug": "metody-optimizacii-v-deep-learning",
        "url": "https://education.yandex.ru/handbook/ml/article/metody-optimizacii-v-deep-learning",
        "chapterNumber": 15,
        "chapterTitle": "15. Онлайн-обучение и стохастическая оптимизация",
        "chapterGoal": "work with online learning and stochastic optimization",
        "keySections": [
          "Напоминания",
          "Скользящее среднее в знаменателе AdaGrad. Методы RMSprop и Adam",
          "Мотивация",
          "RMSProp",
          "Adam",
          "Промежуточный итог по Adam/RMSProp",
          "Как сломать адаптивные методы со скользящим средним",
          "Как и когда ломаются адаптивные методы"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 4,
    "totalAssignments": 0
  },
  {
    "chapterNumber": 16,
    "chapterTitle": "16. Теормин",
    "chapterGoal": "cover mathematical prerequisites used across ML topics",
    "articles": [
      {
        "articleNumber": "16.1",
        "title": "Матричное дифференцирование",
        "slug": "matrichnoe-differencirovanie",
        "url": "https://education.yandex.ru/handbook/ml/article/matrichnoe-differencirovanie",
        "chapterNumber": 16,
        "chapterTitle": "16. Теормин",
        "chapterGoal": "cover mathematical prerequisites used across ML topics",
        "keySections": [
          "Основные обозначения",
          "Простые примеры и свойства матричного дифференцирования",
          "Простые примеры вычисления производной",
          "Примеры вычисления производных сложных функций",
          "Вторая производная",
          "Примеры вычисления и использования второй производной"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "16.2",
        "title": "Матричная факторизация",
        "slug": "matrichnaya-faktorizaciya",
        "url": "https://education.yandex.ru/handbook/ml/article/matrichnaya-faktorizaciya",
        "chapterNumber": 16,
        "chapterTitle": "16. Теормин",
        "chapterGoal": "cover mathematical prerequisites used across ML topics",
        "keySections": [
          "Итак, я разложил матрицу в произведения — и что же?",
          "Смесь признаков",
          "Понижение размерности признакового пространства",
          "Матрицы в разложении: физический смысл",
          "Ковариация и дисперсия признаков",
          "Сингулярное разложение",
          "Математическое определение",
          "Теоретико-вероятностная интерпретация SVD"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "16.3",
        "title": "Вероятностные распределения",
        "slug": "veroyatnostnye-raspredeleniya",
        "url": "https://education.yandex.ru/handbook/ml/article/veroyatnostnye-raspredeleniya",
        "chapterNumber": 16,
        "chapterTitle": "16. Теормин",
        "chapterGoal": "cover mathematical prerequisites used across ML topics",
        "keySections": [
          "Вероятностное пространство",
          "Дискретные распределения",
          "Равномерное распределение",
          "Распределение Бернулли",
          "Биномиальное распределение",
          "Распределение Пуассона",
          "Геометрическое распределение",
          "Гипергеометрическое распределение"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "16.4",
        "title": "Многомерные распределения",
        "slug": "mnogomernye-raspredeleniya",
        "url": "https://education.yandex.ru/handbook/ml/article/mnogomernye-raspredeleniya",
        "chapterNumber": 16,
        "chapterTitle": "16. Теормин",
        "chapterGoal": "cover mathematical prerequisites used across ML topics",
        "keySections": [
          "Дискретные многомерные распределения",
          "Непрерывные многомерные распределения",
          "Маргинальные распределения",
          "Независимость случайных величин",
          "Характеристики случайных векторов",
          "Преобразования плотностей случайных векторов",
          "Распределение суммы независимых случайных величин",
          "Примеры многомерных распределений"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "16.5",
        "title": "Независимость и условные распределения вероятностей",
        "slug": "nezavisimost-i-uslovnye-raspredeleniya-veroyatnostej",
        "url": "https://education.yandex.ru/handbook/ml/article/nezavisimost-i-uslovnye-raspredeleniya-veroyatnostej",
        "chapterNumber": 16,
        "chapterTitle": "16. Теормин",
        "chapterGoal": "cover mathematical prerequisites used across ML topics",
        "keySections": [
          "Условная вероятность",
          "Формула полной вероятности",
          "Формула Байеса",
          "Независимые события",
          "Условная независимость",
          "Условные распределения",
          "Условные математические ожидания",
          "Регрессия"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "16.6",
        "title": "Параметрические оценки",
        "slug": "parametricheskie-ocenki",
        "url": "https://education.yandex.ru/handbook/ml/article/parametricheskie-ocenki",
        "chapterNumber": 16,
        "chapterTitle": "16. Теормин",
        "chapterGoal": "cover mathematical prerequisites used across ML topics",
        "keySections": [
          "Предельные теоремы",
          "Закон больших чисел",
          "Теорема Муавра-Лапласа",
          "Центральная предельная теорема",
          "Свойства параметрических оценок",
          "Несмещённость",
          "Состоятельность",
          "Bias-variance decomposition"
        ],
        "assignments": [],
        "hasAssignment": false
      },
      {
        "articleNumber": "16.7",
        "title": "Энтропия и семейство экспоненциальных распределений",
        "slug": "entropiya-i-semejstvo-eksponencialnyh-raspredelenij",
        "url": "https://education.yandex.ru/handbook/ml/article/entropiya-i-semejstvo-eksponencialnyh-raspredelenij",
        "chapterNumber": 16,
        "chapterTitle": "16. Теормин",
        "chapterGoal": "cover mathematical prerequisites used across ML topics",
        "keySections": [
          "Энтропия",
          "Информативность наблюдений",
          "Энтропия Шеннона",
          "Дифференциальная энтропия",
          "KL-дивергенция",
          "Кросс-энтропия",
          "Принцип максимальной энтропии",
          "Экспоненциальное семейство распределений"
        ],
        "assignments": [],
        "hasAssignment": false
      }
    ],
    "totalArticles": 7,
    "totalAssignments": 0
  }
]

export const yandexHandbookStats = {
  totalChapters: yandexHandbookChapters.length,
  totalArticles: yandexHandbookChapters.reduce((acc, chapter) => acc + chapter.totalArticles, 0),
  totalAssignments: yandexHandbookChapters.reduce((acc, chapter) => acc + chapter.totalAssignments, 0),
}
