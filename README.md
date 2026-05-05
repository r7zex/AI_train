# ML/DL Local Trainer

Локальная учебная платформа на **React + TypeScript + Vite + Tailwind**, собранная в логике **Stepik-like flow**: курс разбит на блоки и подблоки, каждая тема состоит из последовательных шагов, а теория, квизы, кодовые примеры и практика идут внутри одного учебного маршрута.

## Что изменено в текущей версии

- **Step-based UX.** Каждая тема открывается как отдельный урок, а каждый шаг урока живёт на своём URL (`/topics/:topicId/:stepId`).
- **Навигация разделена по ролям.**
  - слева — только структура курса: блок → подблок → тема;
  - сверху в уроке — квадратики шагов, как у учебных тренажёров;
  - снизу — переходы на предыдущий/следующий шаг или тему.
- **Контент стал компактнее и полезнее.** Главная мысль вынесена в отдельный блок, терминология содержит готовые определения, а формулы идут с пояснениями обозначений.
- **Практика работает локально.** Встроен deterministic judge с `sample tests`, `hidden tests`, `diff`, `runtime error` и двумя действиями: `Запустить код` и `Отправить решение`.
- **Редактор улучшен.** Есть line numbers, monospace, многострочный ввод и Tab как отступ.
- **Прогресс хранится детально.** Сохраняются завершённые шаги, темы, подблоки, last visited step и статус практики/квизов. Добавлена миграция `v2 -> v3` через `localStorage`.

---

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск dev-сервера

```bash
npm run dev
```

### 3. Production build

```bash
npm run build
```

### 4. Предпросмотр production-сборки

```bash
npm run preview
```

---

## Архитектура проекта

```text
src/
  components/
    CourseSidebar.tsx      # левый sidebar курса
    CodeEditor.tsx         # локальный кодовый редактор с line numbers
    Formula.tsx            # формулы/KaTeX
    ...
  data/
    course.ts              # исходные блоки, подблоки, темы и seed-контент
    courseFlow.ts          # step-based flow, шаги уроков, quizzes, practice tasks
    quizzes.ts             # типы и часть quiz-данных
  hooks/
    useProgress.ts         # progress schema + migration + localStorage
  lib/
    practiceEngine.ts      # deterministic local judge
  pages/
    HomePage.tsx           # home + глобальный поиск
    TopicsPage.tsx         # карта курса
    TopicDetailPage.tsx    # Stepik-like lesson page
    ComparisonPage.tsx     # таблицы сравнения
    CheatsheetPage.tsx     # большая шпаргалка
    GlossaryPage.tsx       # глоссарий/справочник
```

---

## Как устроен курс

### Иерархия

1. **Block** — крупный раздел курса.
2. **Subblock** — более узкий кластер тем.
3. **Topic** — учебная тема, открывается как отдельный урок.
4. **Step** — атомарный шаг внутри урока.

### Типы шагов

В `src/data/courseFlow.ts` поддерживаются типы:

- `theory`
- `terminology`
- `formula`
- `intuition`
- `worked-example`
- `quiz`
- `code`
- `practice`
- `pitfalls`
- `recap`
- `sources`

### Как открывается урок

Маршрут темы:

```text
/topics/:topicId
```

Он автоматически редиректит пользователя на последний посещённый шаг или на первый шаг темы.

Маршрут конкретного шага:

```text
/topics/:topicId/:stepId
```

---

## Как добавлять новый блок / подблок / тему

### 1. Добавьте seed-тему в `src/data/course.ts`

Для темы задаются:

- `id`
- `title`
- `summary`
- `simpleExplanation`
- `terminology`
- `extraTerms`
- `formulas`
- `codeExample`
- `codeExplanation`
- `mistakes`
- `themeCheatsheet`
- `quizQuestions` / `codeTasks` (если используются в seed-модели)

### 2. Подвяжите тему к нужному подблоку

Внутри структуры `courseBlocks` тема должна попасть в нужный `subblock.themes`.

### 3. При необходимости добавьте override в `src/data/courseFlow.ts`

В `topicOverrides` можно задать для конкретной темы:

- `focus` — главную мысль темы;
- `intuition` — короткие тезисы по смыслу;
- `workedExample` — ручной пример;
- `sources` — релевантные источники.

Это позволяет делать урок компактным и при этом не скатываться в generic fallback.

---

## Как добавлять шаги в тему

В `src/data/courseFlow.ts` шаги собираются в `toFlowTopic(...)`.

Если нужен новый тип шага:

1. расширьте `FlowStepType`;
2. добавьте метаданные в `stepTypeMeta`;
3. расширьте интерфейс `FlowStep`;
4. добавьте рендер нового блока в `TopicDetailPage.tsx`.

---

## Как работают квизы

Квизы описываются типом `Quiz` и `QuizQuestion`.

Поддерживаемые типы вопросов:

- `single`
- `multiple`
- `truefalse`
- `numeric`
- `fillblank`
- `matching`
- `ordering`
- `formula`

### Что уже есть

- partial scoring для `matching` и `ordering`;
- tolerance для `numeric`;
- нормализация ответа для `formula`;
- пошаговый режим внутри урока.

### Как добавить квиз

1. создайте объект `Quiz`;
2. положите его в lesson step типа `quiz` внутри `courseFlow.ts`;
3. при необходимости расширьте `QuizWidget`.

---

## Как работают code tasks

Практика хранится в `PracticeTask` и поддерживает режимы:

- `function`
- `stdin-stdout`
- `debugging`
- `fill-in-code`
- `structural`

> Сейчас основная логика полноценно используется для `function`, `stdin-stdout` и `debugging`, но модель данных уже допускает расширение под остальные режимы.

### Поля задачи

- `statement`
- `starterCode`
- `sampleTests`
- `hiddenTests`
- `structuralChecks`
- `solution`
- `functionName` (для function-based проверок)

### UX задачи

Каждый практический шаг содержит:

- **Statement panel**
- **Editor panel**
- **Sample tests panel**
- **Hidden tests panel**
- **Result panel**

И две отдельные кнопки:

1. **Запустить код** — гоняет только sample tests.
2. **Отправить решение** — гоняет sample + hidden tests и влияет на прогресс.

---

## Как работает local runner

Локальный judge реализован в `src/lib/practiceEngine.ts`.

### Что делает judge

- исполняет пользовательский JavaScript-код локально;
- находит экспортируемую функцию (`solve`, `normalizeScores`, `summarizeValues` и т.д.);
- прогоняет sample tests;
- при submit прогоняет hidden tests;
- делает structural checks по строковым паттернам;
- показывает:
  - `passed / failed`
  - `score`
  - `runtimeError`
  - `expected vs actual`
  - `diff` для stdin/stdout кейсов.

### Важное ограничение

Judge **не зависит от AI**: итоговый verdict строится только на детерминированных локальных проверках.

---

## Hidden tests

`hiddenTests` хранятся прямо в определении `PracticeTask`.

Их идея простая:

- пользователь видит список сценариев, но не всегда все точные входы;
- при `Запустить код` hidden tests не запускаются;
- при `Отправить решение` они участвуют в оценке.

Если нужен более жёсткий режим, можно:

- не выводить точные `description` hidden tests в UI;
- хранить их в отдельном модуле;
- шифровать или собирать на этапе build.

---

## Progress и localStorage

Схема хранится в `src/hooks/useProgress.ts`.

### Текущая версия

```ts
version: 3
```

### Что сохраняется

- `completedSteps`
- `passedQuizzes`
- `passedPractices`
- `completedTopics`
- `completedSubtopics`
- `lastVisitedStep`

### Миграция

При загрузке приложение пытается прочитать:

- `ml-trainer-progress-v3`
- `ml-trainer-progress-v2`
- старые ключи `ml-trainer-progress` и `stepik-like-progress`

Это позволяет не терять уже накопленный прогресс после изменения структуры уроков.

---

## Поиск на Home page

Поиск использует `searchIndex` из `src/data/courseFlow.ts` и ищет по:

- темам;
- шагам;
- терминам;
- формулам;
- шпаргалкам;
- описаниям источников.

Если добавляете новую тему или шаг, они автоматически попадают в индекс, если собраны через `flowTopics`.

---

## Comparison / Cheatsheet / Glossary

### Comparison page

Здесь собраны сравнительные таблицы по ключевым ML/DL темам:

- RandomForest vs GradientBoosting
- L1 vs L2 vs ElasticNet
- BatchNorm vs LayerNorm vs InstanceNorm vs WeightNorm / GroupNorm
- RNN vs LSTM vs GRU
- sklearn vs PyTorch
- predict vs predict_proba vs decision_function

### Cheatsheet page

Это большая агрегированная шпаргалка по формулам и обозначениям. Подходит для:

- повторения перед интервью;
- быстрой сверки метрик и loss-функций;
- ручных расчётов.

### Glossary page

Это отдельный справочник терминов, функций потерь, активаций и формул по блокам курса.

---

## Optional integrations

Сейчас проект рассчитан на **полностью локальный режим**. Но архитектура допускает расширения:

- серверный judge;
- WebAssembly / Pyodide для Python-задач;
- синхронизация прогресса через backend;
- авторизация;
- импорт внешнего контента;
- аналитика по попыткам прохождения.

---

## Ограничения текущей реализации

- judge сейчас исполняет **JavaScript**, а не Python;
- модель данных допускает `fill-in-code` и `structural`, но UI пока оптимизирован под `function`, `stdin-stdout`, `debugging`;
- прогресс квизов/практик сохранён в общей схеме, но шаг считается завершённым через явное подтверждение или успешную отправку practice step.

---

## Рекомендации по дальнейшему развитию

1. Добавить Pyodide/WebWorker для Python-практики.
2. Вынести hidden tests в отдельный слой хранения.
3. Привязать зачёт quiz-step к реальному score, а не только к ручной отметке.
4. Сделать editor presets по типу задачи.
5. Добавить authoring-tools для редакторов курса.

---

## Проверка проекта перед коммитом

Минимальный набор команд:

```bash
npm run build
npm run lint
```

Если нужна локальная ручная проверка UX:

```bash
npm run dev
```

После этого откройте:

- `/` — home и поиск;
- `/topics` — карта курса;
- `/topics/:topicId/:stepId` — lesson flow;
- `/comparison` — таблицы сравнения;
- `/cheatsheet` — шпаргалка;
- `/terms-functions` — глоссарий.
