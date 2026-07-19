# AI Train

Интерактивный курс по машинному обучению, biomedical NLP и биоинформатике на React, TypeScript, Vite и Tailwind. Интерфейс сохраняет учебный поток Stepik: тёмная панель курса, отдельные шаги урока, мгновенная проверка квизов, практические задачи и автоматический прогресс.

## Что входит в курс

Текущая программа: **14 модулей, 81 урок и 592 интерактивных шага**.

0. Python-минимум: типы, коллекции, циклы, функции, ошибки, файлы и окружение.
1. NumPy для машинного обучения.
2. pandas и подготовка данных.
3. Matplotlib, EDA и матрица корреляций.
4. ML с нуля: векторы, вероятность и loss, bias–variance, learning curves, random/group/center/time split, OOF и repeated/nested CV, Optuna, ColumnTransformer, feature selection, uncertainty, calibration, decision curve, интерпретация и fairness.
5. Линейная и логистическая регрессия, L1, L2 и ElasticNet.
6. Деревья решений, бэггинг, Random Forest и boosting.
7. SVM и кластеризация K-Means.
8. Статистика, размеры эффекта, FDR, мощность, bootstrap и дизайн исследования.
9. Биомедицинский ML без утечек: когорта, target, Pipeline, калибровка, nested CV и внешняя валидация на кейсах Gamma Knife и ASPA.
10. Гены и рак: FASTA/FASTQ/GTF/VCF, RNA-seq, DESeq2, варианты, GDC/cBioPortal, survival и multi-omics.
11. Белки: UniProt, BLAST, гомологический split, PDB, pLDDT/PAE, CNN/RNN/Transformers и ESM embeddings.
12. Biomedical NLP: корпуса и разметка, TF-IDF, честная NLP-валидация, Word2Vec/fastText, CNN/RNN/Transformers, PubMedBERT, NER, relations, LLM/RAG и evidence pipeline.
13. Capstone: protocol/SAP, literature gap, sample size, система экспериментов, TRIPOD+AI/PROBAST+AI, Methods/Results/Discussion, Q3-shortlist, submission и reviewer response.

Исследовательские уроки специально имеют разную структуру: от **5 до 9 вопросов**, **1–3 кодовых практик**, разное число примеров и более двадцати учебных форматов. В зависимости от темы это клиническое расследование утечки, split-аудит, omics-разбор, NER/RAG-лаборатория, редакционная мастерская или имитация submission room.

Финальная цель — воспроизводимый, submission-ready пакет исследования уровня, подходящего для рассмотрения профильным журналом. Курс не обещает принятие или конкретный квартиль: scope и актуальный quartile по базе, категории и году проверяются непосредственно перед подачей.

Уроки содержат:

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

`audit:curriculum` проверяет точное число модулей/уроков/шагов, обязательное покрытие ML и bioinformatics, разнообразие учебных форматов, заявленные числа вопросов/примеров/практик, а также выполняет эталонные Python-решения на sample и hidden tests.

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
    aiCurriculum.ts            # активные 14 модулей
    courseFlow.ts              # типы и итоговый lesson flow
    curriculum/                # NumPy, pandas, ML и research/bioinformatics-контент
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
