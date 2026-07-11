# AI Train

Интерактивный курс по машинному обучению на React, TypeScript, Vite и Tailwind. Интерфейс повторяет учебный поток Stepik: тёмная панель курса, отдельные шаги урока, мгновенная проверка квизов, практические задачи и автоматический прогресс.

## Что входит в курс

Текущая программа: **7 модулей, 36 уроков и 240 интерактивных шагов**.

1. NumPy для машинного обучения.
2. pandas и подготовка данных.
3. Matplotlib, EDA и матрица корреляций.
4. Типы ML-задач, train/test split, валидация, cross-validation, CV-search, метрики, confusion matrix, балансировка классов и Pipeline.
5. Линейная и логистическая регрессия, L1, L2 и ElasticNet.
6. Деревья решений, бэггинг, Random Forest и boosting.
7. SVM и кластеризация K-Means.

Новые алгоритмические уроки содержат:

- идею и математические формулы в KaTeX;
- таблицу параметров с default и часто используемыми значениями;
- реализацию на Python/scikit-learn;
- проверочный квиз;
- задачу с sample и hidden tests.

## Учебный UX

- URL каждого шага: `/topics/:topicId/:stepId`;
- квадраты шагов и предыдущий/следующий шаг;
- автоматический зачёт текущего шага при переходе на другой;
- мгновенная обратная связь в квизах и повторная попытка;
- локальные комментарии к каждому шагу;
- сохранение прогресса и последнего посещённого шага в `localStorage`;
- Monaco Editor с Python-подсветкой, четырёхпробельными отступами, `Ctrl+Space`, snippets и контекстными подсказками для NumPy, pandas, Matplotlib и scikit-learn.

## Проверка Python

Python 3.12 запускается через Pyodide в отдельном Web Worker. Базовый runtime копируется из npm-зависимости в public assets перед dev/build, поэтому запуск обычного Python не зависит от CDN.

Judge:

- компилирует `main.py` и показывает синтаксические/runtime-ошибки;
- проверяет вывод по всем sample и hidden cases;
- не раскрывает входы и expected output скрытых тестов;
- ограничивает выполнение пользовательского кода 15 секундами;
- действительно останавливает worker по кнопке «Отменить»;
- загружает научные пакеты Pyodide (`numpy`, `pandas`, `matplotlib`, `scikit-learn`) только при соответствующем import.

Для загрузки дополнительных научных пакетов браузеру нужен доступ к официальному CDN дистрибутива Pyodide. Сам Python runtime и стандартная библиотека раздаются приложением локально.

## Быстрый старт

```bash
npm install
npm run dev
```

Production build и preview:

```bash
npm run build
npm run preview
```

Перед `dev`, `build` и `preview` автоматически выполняется `sync:python-runtime`.

## Проверки

```bash
npm run audit:curriculum
npm run lint
npm run build
npm run test:e2e
```

`audit:curriculum` проверяет точное число модулей/уроков/шагов, обязательное покрытие тем, наличие теории, квизов и практики, а также выполняет эталонные Python-решения на sample и hidden tests.

Playwright E2E проверяет программу курса, автоматический прогресс, квизы, комментарии, Python judge со скрытыми тестами и отмену зависшего выполнения.

## Структура

```text
public/
  python-judge-worker.js       # изолированный Pyodide judge
scripts/
  audit-curriculum.mjs         # структурный и исполняемый аудит курса
  sync-python-runtime.mjs      # локальные assets Pyodide
src/
  components/
    CodeEditor.tsx             # Monaco + контекстные Python completions
    CourseSidebar.tsx          # Stepik-like структура курса
    PlatformTopBar.tsx
  data/
    aiCurriculum.ts            # активные 7 модулей
    courseFlow.ts              # типы и итоговый lesson flow
    curriculum/                # NumPy, pandas и расширенный ML-контент
  features/quiz/
    QuizWidget.tsx
  hooks/
    useProgress.ts
  lib/
    practiceEngine.ts          # sample/hidden judge protocol
  pages/
    TopicsPage.tsx
    TopicDetailPage.tsx
tests/e2e/
  course.spec.ts
```

## Прогресс

Схема `ml-trainer-progress-v3` хранит завершённые шаги, пройденные квизы и практики, завершённые темы/подтемы и последний посещённый шаг. Миграция читает прежние ключи прогресса, чтобы не терять результаты существующих пользователей.
