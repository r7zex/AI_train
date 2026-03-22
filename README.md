# Stepik-like ML/DL Trainer

Полноценная локальная обучающая платформа по ML/DL на React + TypeScript + Vite + Tailwind. Проект перестроен не как каталог статей, а как курс с последовательным lesson flow: слева структурная навигация по курсу, в центре шаги урока, внутри темы — теория → термины → формулы → интуиция → ручной разбор → квиз → код → практика → ловушки → шпаргалка → источники.

## Что умеет платформа

- **Stepik-like Topic page**: у каждой темы есть последовательные шаги, прогресс по уроку, TOC, step indicators, next/prev navigation.
- **Левая course navigation**: полноценная вертикальная иерархия `блок → подблок → тема → шаги`, поддержка collapse/expand, active/completed/in-progress states.
- **Расширенный учебный контент**: генерация больших теоретических блоков, терминов, формул, интуитивных объяснений и мини-конспектов для каждой темы.
- **Встроенные квизы**: квиз — это шаг внутри урока, а не отдельная мёртвая страница.
- **Локальная code practice**: deterministic judge запускается в браузере без AI-оценки и умеет два режима запуска:
  - `Запустить код` — sample tests.
  - `Отправить решение` — sample + hidden tests.
- **Подробный result panel**: sample tests, hidden tests, actual vs expected, diff, runtime error, structural feedback.
- **Поиск на Home page**: ищет по темам, шагам, терминам, формулам и шпаргалкам.
- **Comparison / Cheatsheet / Glossary pages**: отдельные страницы для повторения и собеседований.
- **Детальный progress layer**: completed steps, passed quizzes, passed practices, completed topics, completed subtopics, last visited step.

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте локальный адрес Vite, обычно `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Архитектура курса

### Основная модель

Проект хранит две связанные модели:

1. **`src/data/course.ts`** — базовое семя курса:
   - блоки;
   - подблоки;
   - темы;
   - краткие поля контента;
   - базовые quiz/code seed-данные.

2. **`src/data/courseFlow.ts`** — производная step-based модель:
   - `FlowTopic`;
   - `FlowStep`;
   - `PracticeTask`;
   - `stepTypeMeta` для корректных иконок;
   - `searchIndex` для глобального поиска;
   - `flowCourseBlocks` для боковой навигации;
   - `getFlowTopicById()` / `getFlowPrevNextTopic()`.

### Step types

Каждая тема превращается в последовательность шагов одного урока:

1. `theory`
2. `terminology`
3. `formula`
4. `intuition`
5. `worked-example`
6. `quiz`
7. `code`
8. `practice`
9. `pitfalls`
10. `recap`
11. `sources`

Иконка, label и визуальный accent для каждого типа шага описаны в `stepTypeMeta`, поэтому больше нет бага, когда выбранный тип влияет на иконки остальных шагов.

## Локальный раннер и judge

### Где находится

- `src/lib/practiceEngine.ts` — deterministic local judge.
- `src/pages/TopicDetailPage.tsx` — UI-панели практики.
- `src/components/CodeEditor.tsx` — локальный редактор кода с line numbers и поддержкой `Tab` как отступа.

### Какие режимы задач поддержаны

В модели `PracticeTask` есть поля для режимов:

- `function`
- `stdin-stdout`
- `fill-in-code`
- `debugging`
- `structural`

Сейчас в lesson flow используются три сценария, которые покрывают базовый учебный маршрут:

- **function-based checker** — пользователь пишет функцию, judge реально вызывает её на sample/hidden tests;
- **stdin/stdout checker** — пользователь реализует `solve(input)`, judge сравнивает ожидаемый и фактический вывод;
- **debugging task** — студент чинит стартовый код, judge проверяет runtime + structural checks.

### Как работает запуск

#### Кнопка `Запустить код`
- выполняет только sample tests;
- показывает ошибки до финальной отправки;
- не засчитывает hidden tests.

#### Кнопка `Отправить решение`
- запускает sample + hidden tests;
- обновляет статус practice step;
- влияет на progress.

### Что отображает result panel

- `passed / failed`;
- итоговый `score`;
- sample results;
- hidden results;
- runtime error;
- structural feedback;
- diff между `actual` и `expected`.

### Ограничения текущего раннера

Раннер намеренно детерминированный и локальный. Он использует JavaScript sandbox в браузере, поэтому не зависит от AI и не требует серверной проверки. Для реального Python/PyTorch исполнения можно добавить отдельный WASM/runtime слой, но текущая архитектура уже разделяет UI и judge так, чтобы это можно было сделать без переписывания lesson flow.

## Прогресс и localStorage

### Хранилище

Основное состояние прогресса лежит в `src/hooks/useProgress.ts` и сохраняется в ключ `ml-trainer-progress-v2`.

### Что хранится

```ts
interface ProgressState {
  version: 2
  completedSteps: string[]
  passedQuizzes: string[]
  passedPractices: string[]
  completedTopics: string[]
  completedSubtopics: string[]
  lastVisitedStep: Record<string, string>
}
```

### Миграция

Хук умеет читать старые ключи (`ml-trainer-progress`, `stepik-like-progress`) и поднимать их в новую схему через нормализацию completed steps.

## Страницы

### `/`
Home page:
- hero-блок курса;
- глобальный поиск;
- карточки блоков;
- обзор архитектуры обучения.

### `/topics`
Карта курса:
- прогресс по блокам и подблокам;
- нормальная визуальная иерархия;
- темы со статусами `completed / in progress / not started`.

### `/topics/:topicId`
Главная lesson-flow страница:
- sticky course sidebar;
- TOC справа;
- step indicators;
- progress bar по теме;
- встроенный квиз;
- локальная практика;
- previous/next topic navigation.

### `/comparison`
Таблицы сравнения по алгоритмам и API.

### `/cheatsheet`
Агрегированная формульная шпаргалка.

### `/terms-functions`
Глоссарий терминов, функций потерь, активаций и формул по блокам.

## Структура проекта

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── data/
│   ├── course.ts              # базовое семя курса
│   ├── courseFlow.ts          # производная Stepik-like flow model
│   ├── quizzes.ts             # типы и отдельные quiz-структуры
│   ├── steps.ts
│   └── topics.ts
├── hooks/
│   └── useProgress.ts         # progress schema + migration
├── lib/
│   └── practiceEngine.ts      # deterministic local judge
├── components/
│   ├── Navbar.tsx
│   ├── CodeEditor.tsx         # line numbers + tab indent
│   ├── Formula.tsx
│   └── ...
├── features/
│   └── quiz/
│       └── QuizWidget.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── TopicsPage.tsx
│   ├── TopicDetailPage.tsx
│   ├── ComparisonPage.tsx
│   ├── CheatsheetPage.tsx
│   ├── GlossaryPage.tsx
│   └── TermsFunctionsPage.tsx
└── layouts/
    └── MainLayout.tsx
```

## Как добавить новый блок / подблок / тему

### 1. Добавьте seed в `src/data/course.ts`

Нужно заполнить тему минимум этими полями:

- `id`
- `title`
- `summary`
- `level`
- `terminology`
- `simpleExplanation`
- `usage`
- `realLifeExample`
- `codeExample`
- `codeExplanation`
- `mistakes`
- `interview`
- `formulas`
- `extraTerms`
- `quizQuestions`
- `codeTasks`

### 2. Flow-модель построится автоматически

`courseFlow.ts` преобразует seed-тему в полноценный набор шагов. То есть при добавлении новой темы вы автоматически получаете:

- step cards;
- sidebar steps;
- progress integration;
- search indexing;
- recap/sources generation.

### 3. При необходимости настройте практику

Если тема требует нестандартного judge-сценария, добавьте новый `PracticeTask`-шаблон в `courseFlow.ts` и логику его проверки в `practiceEngine.ts`.

## Как добавить новый квиз

Есть два варианта:

1. **Встроенный lesson quiz** — генерируется в `courseFlow.ts` автоматически для каждой темы.
2. **Отдельный rich quiz** — добавляется в `src/data/quizzes.ts` и может переиспользовать `QuizWidget`.

Поддерживаемые типы вопросов в `QuizWidget`:

- `single`
- `multiple`
- `truefalse`
- `numeric`
- `fillblank`
- `matching`
- `ordering`
- `formula`

## Как добавить новую code task

### Через flow-модель

Добавьте новый объект `PracticeTask`:

```ts
{
  id: 'topic-practice-1',
  title: 'Task title',
  kind: 'function',
  language: 'javascript',
  statement: '...',
  tips: ['...'],
  starterCode: '...',
  functionName: 'solveTask',
  sampleTests: [...],
  hiddenTests: [...],
  structuralChecks: ['...'],
}
```

### Затем добавьте обработку в `practiceEngine.ts`

Judge уже умеет:

- вызывать функции;
- запускать `solve(input)`;
- сравнивать `expected` / `actual`;
- строить diff;
- отдавать structural feedback.

## Как расширять hidden tests

Каждая задача имеет:

- `sampleTests` — показываются пользователю;
- `hiddenTests` — описания показываются, сами проверки выполняются только при отправке.

Для усложнения задания добавляйте в hidden tests:

- edge-cases;
- отрицательные значения;
- нулевые/пустые входы;
- дубликаты;
- форматные ошибки вывода.

## Возможные улучшения

Если вы захотите развивать проект дальше, архитектура уже готова к следующим расширениям:

- Python/WASM runtime вместо JS sandbox;
- PyTorch-specific structural/runtime tasks;
- серверная синхронизация прогресса;
- авторизация и многопользовательский режим;
- импорт/экспорт прогресса;
- richer analytics по quiz/practice attempts.

## Технологии

- React 19
- TypeScript 5
- Vite 8
- Tailwind CSS 3
- React Router 7
- KaTeX
- localStorage

## Проверка перед коммитом

```bash
npm run build
npm run lint
```

Если редактор кода/квиз/страницы контента менялись — проверьте lesson flow вручную через `npm run dev`.
