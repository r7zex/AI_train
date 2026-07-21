# Block 4 - step 01 visual infrastructure

## Scope and implementation plan

Base: `df3389e3bcc753473711284b456f09d305e7211e` (`main`, fetched 2026-07-21).

Branch: `agent/block4-step01-visual-infrastructure`.

Verified source head: `d086e4120738e9286810a96867f55745ec9bed00`.

Draft PR: https://github.com/r7zex/AI_train/pull/53

The commit after the verified source head changes only this report to record publication metadata. The current PR head is therefore the report-finalization commit returned in the completion response; the tested source tree remains exactly `d086e4120738e9286810a96867f55745ec9bed00`.

The current `main` still matches the snapshot named in the roadmap, so there is no drift to reconcile. This step changes only visual metadata, placement/rendering, visual audit coverage, targeted tests, and this report. Curriculum theory, `LocalGlossary`, quizzes, practices, and PNG assets remain unchanged.

Implementation sequence:

1. Replace generic block-4 visual metadata with typed records containing semantic alt text, visible captions, exact step/section placement, order, and provenance.
2. Render each visual at its declared placement and expose a visible `figcaption` without changing the local glossary.
3. Extend the curriculum audit with registry, file, byte-size, dimensions, duplicate hash, duplicate alt/caption, and placement checks.
4. Add targeted browser assertions for placement order, unique semantic descriptions, captions, and desktop/mobile readability.
5. Re-run protected-count inventory and all required checks, then record evidence for `V-009`, `V-010`, `V-011`, `V-012`, and `V-023`.

## Protected inventory before changes

| Item | Before |
|---|---:|
| Block 4 topics | 18 |
| Quiz/assessment steps | 19 |
| Questions | 84 |
| Practice tasks | 27 |
| Sample tests | 28 |
| Hidden tests | 35 |
| Block 4 PNG assets | 22 |

## Changed files and size guard

| File | Change | Source additions | Source deletions |
|---|---|---:|---:|
| `src/data/courseVisuals.ts` | Typed metadata, 22 explicit block-4 records, placement lookup, temporary compatibility path outside block 4 | 271 | 14 |
| `src/components/CourseVisualGallery.tsx` | Visible `figcaption`, `aria-describedby`, rendering from supplied metadata | 24 | 15 |
| `src/pages/TopicDetailPage.tsx` | Render visuals after their declared step/section instead of before the first theory section | 70 | 61 |
| `scripts/audit-curriculum.mjs` | PNG header/dimension, bytes, hashes, registry, alt/caption, provenance, and placement audit | 68 | 6 |
| `tests/e2e/course.spec.ts` | Targeted DOM-order, semantic metadata, desktop, and mobile coverage | 47 | 0 |
| **Source total** | Report excluded as required | **480** | **96** |

Source additions + deletions: **576 changed lines**, inside the required 450-900 range. No PNG or generator changed. `LocalGlossary`, `getCourseGlossaryEntries`, theory, quizzes, practices, judge, navigation, and glossary placement are unchanged.

## Protected inventory after changes

| Item | Before | After | Result |
|---|---:|---:|---|
| Block 4 topics | 18 | 18 | unchanged |
| Quiz/assessment steps | 19 | 19 | unchanged |
| Questions | 84 | 84 | unchanged |
| Practice tasks | 27 | 27 | unchanged |
| Sample tests | 28 | 28 | unchanged |
| Hidden tests | 35 | 35 | unchanged |
| Block 4 PNG assets | 22 | 22 | unchanged |

The after-count is supported by `npm run audit:curriculum` and by the absence of any curriculum or PNG file from the diff.

## Acceptance evidence

| ID | Status | What changed | Files/lines | Evidence | Verification result | Remaining gap |
|---|---|---|---|---|---|---|
| V-009 | DONE | Every block-4 asset has a unique semantic alt describing visible data and the useful or missing conclusion; generic placeholder alt is rejected. | `src/data/courseVisuals.ts:3-243`; `scripts/audit-curriculum.mjs:220-256` | Registry contains 22 distinct block-4 alts; audit normalizes and rejects duplicate/generic values. | Positive audit exit 0; browser test confirms two unique non-generic alts on 4.6. | None for this step. |
| V-010 | DONE | Every rendered image is followed by a visible caption with explicit “what / how / conclusion” text and linked by `aria-describedby`. | `src/components/CourseVisualGallery.tsx:3-31`; metadata in `src/data/courseVisuals.ts:27-243` | Each `<figure>` contains one `<img>` and one `<figcaption>`. | Targeted browser test exit 0 on desktop and mobile; full E2E 14/14. | None for this step. |
| V-011 | DONE | Metadata targets an exact `stepId` and optional `sectionId`; rendering occurs after the declared content. | `src/data/courseVisuals.ts:3-20,27-243,298-306`; `src/pages/TopicDetailPage.tsx:514-631` | 4.6 DOM order is heading → visual 1 → next heading → visual 2; audit rejects unknown steps/sections. | Targeted DOM-order assertion exit 0; desktop screenshot reviewed. | None for this step. |
| V-012 | DONE | Multiple visuals are distributed by pedagogical use instead of being emitted together before theory. | `src/data/courseVisuals.ts:71-142`; `src/pages/TopicDetailPage.tsx:553-631` | 4.5 visual 1 is in `answer-first`, visual 2 is in the later implementation step; 4.6 and 4.8 use separate sections; 4.7 uses separate steps. | Targeted navigation assertions exit 0; full E2E exit 0. | None for this step. |
| V-023 | DONE | Audit checks directory/registry correspondence, file existence, 10 KB minimum, PNG header, minimum 1000×600 dimensions, SHA-256 duplicates, unique alt/caption, provenance, and placement validity. | `scripts/audit-curriculum.mjs:13,154-156,184-269` | A temporary missing-file fixture failed with exit 1; a duplicate-hash fixture failed with exit 1 and named both duplicate files. | Positive audit exit 0; both required negative controls exit 1. | None for this step. |

## Block 4 visual inventory

| Файл | Размещение | Какой вопрос | Что видно | Вывод | Alt | Caption |
|---|---|---|---|---|---|---|
| `ml-foundations-data-target.png` | `ml-foundations-data-target-object / apartment-table` | Где X и y входят в рабочий процесс? | Четыре блока: данные, обучение, прогноз, метрика | Процесс начинается с данных и завершается оценкой | Линейная схема из четырёх блоков: данные, обучение, прогноз и метрика; признаки и целевая переменная входят в процесс до проверки результата. | Что показано: путь от таблицы признаков и цели к обучению, прогнозу и метрике. Как читать: слева направо по стрелкам. Главный вывод: данные X и y задают начало процесса, а качество прогноза проверяют в конце. |
| `ml-foundations-model-fit-predict.png` | `ml-foundations-model-fit-predict-model / definition` | Что превращает таблицу признаков в ответ? | Таблица входит в модель-механизм; выходят шкала и точки двух классов | Обученное правило преобразует новые признаки в число или класс | Таблица объектов поступает в изображённую как механизм модель, а на выходе появляются числовая шкала и разделение точек на два класса. | Что показано: таблица признаков проходит через обученную модель и превращается в числовой либо классовый прогноз. Как читать: вход слева, два возможных вида ответа справа. Главный вывод: модель применяет выученное правило к новым признакам. |
| `ml-foundations-train-test-baseline-metrics.png` | `ml-foundations-train-test-baseline-metrics-split / why` | Какие данные могут влиять на выбор модели? | Одна полоса разделена на train, validation и test | Test должен оставаться вне подбора | Одна полоса данных разделена на большую обучающую, меньшую проверочную и отдельную тестовую части; под тестом стоит запрет использовать его при выборе. | Что показано: три роли данных - обучение, промежуточная проверка и финальный тест. Как читать: модель учится на зелёной части, решения принимаются без доступа к красной. Главный вывод: тест нельзя расходовать на подбор модели. |
| `ml-foundations-project-cycle.png` | `ml-foundations-project-cycle-pipeline / pipeline` | Каковы четыре крупных этапа проекта? | Данные → обучение → прогноз → метрика | Одного обучения недостаточно для завершения проекта | Последовательность из блоков данных, обучения, прогноза и метрики показывает контрольные точки базового цикла ML-проекта. | Что показано: укрупнённый цикл работы с моделью. Как читать: каждый следующий блок использует результат предыдущего. Главный вывод: проект не заканчивается обучением - прогноз обязательно проверяют выбранной метрикой. |
| `ml-problem-types.png` | `ml-problem-types-theory / answer-first` | Чем отличаются ответы регрессии, классификации и кластеризации? | Линия регрессии, два размеченных класса, два кластера без меток | Тип требуемого ответа определяет вид задачи | Три панели сравнивают числовой прогноз по линии регрессии, разделение точек на два известных класса и поиск двух групп без готовых ответов. | Что показано: разные формы ответа для регрессии, классификации и кластеризации. Как читать: слева требуется число, в центре - известный класс, справа - структура без целевой метки. Главный вывод: вид задачи определяется требуемым ответом. |
| `ml-problem-types-2.png` | `ml-problem-types-implementation / ml-problem-types-implementation-code` | Что возвращает каждая реализация? | Новый объект → обученная модель → класс, число или кластер | Код выбирают только после определения смысла ответа | Новый объект поступает в обученную модель, после чего схема разветвляется на три вида результата: класс, число или кластер. | Что показано: три возможных формата выхода модели. Как читать: проследите стрелки от нового объекта к одному из ответов. Главный вывод: код обучения выбирают после того, как определён смысл требуемого результата. |
| `validation-split.png` | `validation-split-theory / roles` | Каковы роли train, validation и test? | Одно фиксированное разбиение на три части | Финальный test остаётся вне подбора | Горизонтальная полоса объектов разделена на большую обучающую, меньшую проверочную и отдельную тестовую части с запретом использовать тест при выборе. | Что показано: одно фиксированное разбиение на train, validation и test. Как читать: размер сегмента отражает долю объектов, а подписи - роль части. Главный вывод: финальный test остаётся вне подбора. |
| `validation-split-2.png` | `validation-split-theory / hundred-example` | Показывает ли рисунок один вызов train_test_split? | Пять строк с перемещающейся выделенной частью | Это повторные проверки, а не три выхода одного вызова | Пять строк по пять частей показывают, как выделенная проверочная часть последовательно перемещается между группами объектов. | Что показано: пять последовательных проверок, в которых выделенная часть меняется. Как читать: строка - отдельный запуск, столбец - часть данных. Главный вывод: это повторная схема проверки, а не три результата одного вызова train_test_split. |
| `cross-validation-search.png` | `cross-validation-search-theory / fold-cycle` | Как 5-fold validation переносит проверочную часть? | Пять строк × пять folds | Каждая часть оценивает модель ровно один раз | Матрица из пяти строк и пяти частей показывает пять итераций кросс-валидации, где проверочная часть каждый раз занимает новый столбец. | Что показано: полный цикл 5-fold cross-validation. Как читать: в каждой строке четыре части служат обучением, одна - проверкой. Главный вывод: каждая часть ровно один раз оценивает модель. |
| `cross-validation-search-2.png` | `cross-validation-search-parameters / cross-validation-search-parameter-table` | Зачем сообщать разброс вместе со средним? | Оценки 0,80; 0,85; 0,90; 0,75; 0,95 и среднее 0,85 | Среднее 0,85 скрывает разброс 0,75-0,95 | Пять столбцов со значениями 0,80, 0,85, 0,90, 0,75 и 0,95 пересекает линия среднего результата 0,85. | Что показано: пять fold-оценок и их среднее 0,85. Как читать: высота столбца - score отдельного fold, линия - среднее. Главный вывод: одинаковое среднее не отменяет заметный разброс от 0,75 до 0,95. |
| `metrics-confusion-matrix.png` | `metrics-confusion-matrix-theory / four-outcomes` | Где находятся TP, TN, FP и FN? | TN=61, FP=9, FN=6, TP=24 | Типы ошибок нужно считать отдельно | Матрица ошибок с истинным классом по строкам и прогнозом по столбцам содержит 61 истинно отрицательный, 9 ложноположительных, 6 ложноотрицательных и 24 истинно положительных ответа. | Что показано: четыре исхода для 100 объектов - TN=61, FP=9, FN=6, TP=24. Как читать: сначала выберите строку истинного класса, затем столбец прогноза. Главный вывод: два типа ошибок считаются отдельно. |
| `metrics-confusion-matrix-2.png` | `metrics-confusion-matrix-theory / metric-choice` | Может ли одна матрица ошибок отвечать на разные вопросы? | Precision 0,73 и recall 0,80 | Выбор метрики зависит от цены ошибки | Столбчатая диаграмма сравнивает precision 0,73 и recall 0,80, рассчитанные из одной матрицы ошибок. | Что показано: precision равна 0,73, recall - 0,80. Как читать: высота каждого столбца отвечает на свой вопрос о положительном классе. Главный вывод: одна матрица ошибок даёт разные метрики, поэтому выбирать их нужно по цене ошибки. |
| `class-imbalance-pipeline.png` | `class-imbalance-pipeline-theory / safe-pipeline` | Что в действительности показывает текущий рисунок? | Общие блоки данные → обучение → прогноз → метрика | Показан порядок, но не дисбаланс и не train-only границы | Обобщённая цепочка данных, обучения, прогноза и метрики для темы дисбаланса классов не показывает сами доли классов или границы преобразований. | Что показано: только общий порядок этапов при работе с дисбалансом. Как читать: слева направо от данных к оценке. Главный вывод: текущая схема фиксирует место обучения и метрики, но не изображает распределение классов или train-only преобразования. |
| `ml-math-vectors-gradients.png` | `ml-math-vectors-gradients-theory / math-objects` | Где математика входит в ML-процесс? | Общая четырёхэтапная схема | Показан только контекст, без расчёта Xw или градиента | Общая четырёхэтапная схема связывает данные, обучение, прогноз и метрику, но не изображает векторы, матрицы или шаг градиента. | Что показано: места, где математические объекты участвуют в ML-процессе. Как читать: данные входят в обучение, параметры дают прогноз, метрика оценивает результат. Главный вывод: схема задаёт контекст, но не заменяет расчёт Xw или градиента. |
| `ml-probability-loss-bayes.png` | `ml-probability-loss-bayes-theory / probability-core` | Где используются вероятность и loss? | Общая четырёхэтапная схема | Показан только контекст, без распределения и кривой loss | Схема данных, обучения, прогноза и метрики показывает место вероятностного прогноза и функции потерь, не отображая распределение или кривую loss. | Что показано: общий путь вероятностной модели от данных к оценке. Как читать: вероятность появляется на этапе прогноза, а её качество проверяется справа. Главный вывод: текущий рисунок задаёт порядок, но не объясняет форму функции потерь. |
| `ml-overfit-learning-curves.png` | `ml-overfit-learning-curves-theory / generalization` | Где проверяется обобщение? | Общая четырёхэтапная схема | Оценка показана, learning curves не показаны | Обобщённая последовательность данных, обучения, прогноза и метрики для темы переобучения не содержит train и validation curves. | Что показано: этапы, между которыми проявляется разрыв обобщения. Как читать: модель учится слева, а качество нового прогноза проверяют справа. Главный вывод: схема обозначает контрольную точку, но не показывает форму learning curve. |
| `ml-split-strategy-lab.png` | `ml-split-strategy-lab-theory / split-roles` | Кодирует ли рисунок группы или время? | Общая четырёхэтапная схема | Показан порядок, но не правила group/time split | Цепочка данных, обучения, прогноза и метрики для разбиений по группам и времени не показывает идентификаторы групп или временную границу. | Что показано: общий контур оценки после выбора разбиения. Как читать: сначала формируются данные, затем обучается и проверяется модель. Главный вывод: рисунок отмечает порядок, но не кодирует group-aware или temporal split. |
| `ml-cross-validation-oof.png` | `ml-cross-validation-oof-theory / cv-system` | Где находятся OOF-прогнозы? | Общая четырёхэтапная схема | Показаны границы этапов, но не folds | Четыре блока данных, обучения, прогноза и метрики задают общий порядок, но не показывают фолды и внефолдовые прогнозы каждого объекта. | Что показано: место OOF-прогнозов между обучением и итоговой метрикой. Как читать: прогноз должен быть получен моделью, не обучавшейся на этом объекте. Главный вывод: текущая схема задаёт границы этапов, а не матрицу folds. |
| `ml-hyperparameter-nested-search.png` | `ml-hyperparameter-nested-search-theory / tuning-core` | Различает ли рисунок внутренний и внешний CV? | Общая четырёхэтапная схема | Tuning входит в обучение; nested folds не нарисованы | Общая цепочка данных, обучения, прогноза и метрики для вложенного подбора не различает внутренний и внешний циклы cross-validation. | Что показано: этапы, внутри которых выполняется выбор параметров и внешняя оценка. Как читать: подбор относится к обучению, итоговая метрика - к независимой проверке. Главный вывод: схема фиксирует разделение ролей, но не рисует nested folds. |
| `ml-preprocessing-feature-selection.png` | `ml-preprocessing-feature-selection-theory / pipeline-core` | Где должны находиться обучаемые preprocessing и selection? | Общая четырёхэтапная схема | Они входят в обучение; отдельные ветви не нарисованы | Последовательность данных, обучения, прогноза и метрики показывает общий Pipeline, не раскрывая числовую, категориальную и feature-selection ветви. | Что показано: место preprocessing и отбора признаков перед моделью. Как читать: все обучаемые преобразования входят в этап обучения до прогноза. Главный вывод: текущая схема обозначает границу Pipeline, но не состав ColumnTransformer. |
| `ml-uncertainty-calibration-utility.png` | `ml-uncertainty-calibration-utility-theory / evaluation-dimensions` | Как точечные оценки и uncertainty различаются по группам? | Шесть оценок с вертикальными интервалами разной ширины | Похожие оценки могут иметь разную надёжность | Для шести групп показаны точечные оценки примерно от 1,15 до 1,77 и вертикальные интервалы разной ширины, отражающие неодинаковую неопределённость. | Что показано: точечные оценки и интервалы неопределённости для шести групп. Как читать: точка - оценка, вертикальный отрезок - диапазон неопределённости. Главный вывод: одинаково выглядящие оценки могут иметь разную надёжность. |
| `ml-interpretability-error-fairness.png` | `ml-interpretability-error-fairness-theory / inspection-levels` | Какие данные нужны для error analysis? | Общая четырёхэтапная схема | Нужны прогнозы и группы; результаты подгрупп не показаны | Общая схема данных, обучения, прогноза и метрики для анализа ошибок не показывает подгруппы, отдельные ошибки или показатели fairness. | Что показано: этапы, где собирают данные, получают прогнозы и считают метрики. Как читать: анализ ошибок начинается с сохранённых прогнозов и исходных групп. Главный вывод: текущий рисунок задаёт контекст, но не визуализирует subgroup analysis. |

## Commands and results

| Command | Exit code | Result |
|---|---:|---|
| `git fetch origin main` | 0 | `origin/main` remained `df3389e3bcc753473711284b456f09d305e7211e`; no drift. |
| `npm ci --cache /tmp/npm-cache --prefer-offline` | 0 | 286 packages installed. |
| `npm run audit:curriculum` | 0 | 14 blocks, 84 topics, 618 steps; all visual checks passed. |
| Audit with `validation-split.png` absent from a temporary fixture | 1, expected | Reported 100 instead of 101 files, the missing registered asset, and registry mismatch. |
| Audit with `cross-validation-search.png` replaced by a copy of `validation-split.png` in a temporary fixture | 1, expected | Reported duplicate SHA-256 files by name. |
| `npm run lint` | 0 | No lint errors or warnings. |
| `npm run build` | 0 | TypeScript and Vite build succeeded; existing large-chunk advisory only. |
| Targeted Playwright test for block-4 visual placement | 0 | 1/1 Chromium test passed after installing the browser in `/tmp/ms-playwright`. |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/ms-playwright npm run test:e2e` | 0 | 14/14 Chromium tests passed. |
| `git diff --check` | 0 | No whitespace errors. |
| `python scripts/generate-course-visuals.py` | N/A | Not run because neither generator nor PNG assets changed. |

## Desktop and mobile review

- Desktop, 1440×900, topic 4.6 theory: each figure appears after its declared section; both captions are visible; image, border, caption, glossary, and navigation have no overlap or clipping. The two figures are separated by the second section heading rather than grouped before the text.
- Mobile, 390×844, topic 4.5 implementation: sidebar is hidden as designed; the second topic visual appears after the implementation explanation; its caption remains legible; `document.documentElement.scrollWidth <= window.innerWidth` is true.
- Screenshots were generated by the targeted test at `/tmp/ai-train-block4-visual-placement-desktop.png` and `/tmp/ai-train-block4-visual-placement-mobile.png` and inspected at original resolution. They are test evidence, not repository assets.

## Decisions, deferred content work, and blockers

- No PNG was regenerated. The current `validation-split-2.png` visually resembles repeated fold validation; its caption explicitly prevents interpreting it as three outputs from one `train_test_split` call. Replacing it with a correct holdout workflow belongs to later acceptance criterion `T46-008`, outside this infrastructure-only step.
- The generic pipeline assets in 4.9-4.16 and 4.18 remain visibly generic. Their alt/captions state exactly what is and is not shown. Topic-specific replacement is deferred to the numbered theory/visual steps that own those acceptance criteria.
- Topics outside block 4 use a named temporary compatibility path that still supplies typed metadata and non-leading placement. Full semantic migration of those topics is outside this step.
- Open blockers: none.
