# Block 4 work step 03: темы 4.3–4.4

## Итог этапа

- Branch: `agent/block4-step03-topics-4-3-4-4`
- Base SHA: `b93ae4ce2366422b0552b5d8f402c1361c154c24`
- Implementation SHA: будет зафиксирован после первого commit этого отчёта.
- Draft PR: будет добавлен после публикации ветки.
- Base source: `origin/main`, полученный командой `git fetch origin main` 2026-07-21 до создания ветки.
- Drift: отсутствует; актуальный `origin/main` уже содержал слитые этапы 01–02.
- Scope: только темы 4.3/4.4, их visual metadata/PNG, scoped generator, targeted tests и этот отчёт.
- Результат: все `T43-*`, `T44-*`, `V-015` и `V-016` закрыты; переход к следующему этапу не выполнялся.

## План, зафиксированный до реализации

1. Перестроить существующие theory steps 4.3 без уменьшения их числа: роли 60/20/20, граница первого фиксированного эксперимента, точные правила leakage и воспроизводимый, но не автоматически честный split.
2. Использовать один синтетический validation example для baseline и regression metrics; автоматически проверить MAE, MSE, RMSE, R² и точный F1 по счётчикам.
3. Представить 4.4 как операциональный цикл ML-проекта: датированный churn-вопрос, label/action gate, раздельные technical/decision/business уровни, мониторинг и checklist с evidence.
4. Перегенерировать только visuals и metadata двух topic IDs: четыре concepts для 4.3 и два для 4.4, с semantic alt, видимой подписью, вопросом и выводом.
5. Выполнить generator, targeted tests, curriculum audit, lint, build и browser review на desktop/mobile; затем опубликовать draft PR.

## Изменённые файлы и budget

| Файл | Изменение | Source lines (+/−) |
|---|---|---:|
| `src/data/curriculum/ml_foundations/train_test_baseline_metrics.ts` | Полная согласованность split/baseline/regression/classification | 183 / 105 |
| `src/data/curriculum/ml_foundations/project_cycle.ts` | Операционализированный цикл, gate, monitoring и checklist | 102 / 54 |
| `scripts/generate-course-visuals.py` | Шесть scoped visual concepts, объединённых и palette-optimized в два итоговых PNG | 313 / 4 |
| `src/data/courseVisuals.ts` | Semantic alt, caption и placement только для topic IDs 4.3/4.4 | 6 / 6 |
| `tests/test_block4_step03_metrics.py` | Независимая числовая проверка regression и F1 | 73 / 0 |
| `tests/e2e/block4-step03-topics.spec.ts` | Targeted desktop/mobile и content/visual verification | 78 / 0 |
| `public/course-visuals/ml-foundations-train-test-baseline-metrics.png` | Перегенерированный PNG 2280×4335 | binary, исключён |
| `public/course-visuals/ml-foundations-project-cycle.png` | Перегенерированный PNG 2276×2213 | binary, исключён |
| `docs/block4-work/step-03-topics-4-3-4-4.md` | Отчёт этапа | исключён |

Итого source diff: **755 additions + 169 deletions = 924 изменённых строки**. PNG binaries и отчёт исключены согласно правилу этапа; результат находится в бюджете 850–1450.

## Protected counts до/после

| Topic | Состояние | Steps | Theory | Quiz steps / questions | Practice steps / tasks | Sample tests | Hidden tests |
|---|---|---:|---:|---:|---:|---:|---:|
| 4.3 | до | 7 | 4 | 2 / 2 | 1 / 1 | 1 | 2 |
| 4.3 | после | 7 | 4 | 2 / 2 | 1 / 1 | 1 | 2 |
| 4.4 | до | 5 | 3 | 1 / 1 | 1 / 1 | 2 | 2 |
| 4.4 | после | 5 | 3 | 1 / 1 | 1 / 1 | 2 | 2 |

Темы не удалялись, не объединялись и не перенумеровывались. LocalGlossary, нижние расшифровки терминов, UI, navigation, progress и judge не изменялись.

## Acceptance evidence

| ID | Status | Что изменено | Files/lines | Evidence | Verification result | Remaining gap |
|---|---|---|---|---|---|---|
| T43-001 | DONE | Теория организована как why split → roles → baseline → regression → classification без уменьшения 7 steps. | `train_test_baseline_metrics.ts:30-258` | Отдельные section headings и четыре сохранённых theory steps. | Audit: 618 steps; E2E находит ключевые headings. | Нет |
| T43-002 | DONE | Один и тот же пример 60/20/20 в тексте, таблице, коде и первой visual panel; доли названы неуниверсальными. | `train_test_baseline_metrics.ts:44-74`; generator `413-453` | Код печатает `60 20 20`; визуал показывает те же роли. | E2E проверяет heading, figure и natural width. | Нет |
| T43-003 | DONE | Разделены beginner demo с одним закрытым test и iterative selection через validation/CV. | `train_test_baseline_metrics.ts:35-43` | Явный callout «Граница учебного примера». | E2E находит формулировку fixed run. | Нет |
| T43-004 | DONE | Train-only fit для статистик/feature selection отделён от заранее заданного парсинга и unit conversion до split. | `train_test_baseline_metrics.ts:75-89` | Таблица из четырёх операций с точной границей. | E2E находит deterministic parsing; audit проходит. | Нет |
| T43-005 | DONE | `random_state` объяснён как воспроизводимость; добавлены group/time counterexamples. | `train_test_baseline_metrics.ts:90-96` | Seed и стратегия split отвечают на разные вопросы. | E2E проверяет callout про seed. | Нет |
| T43-006 | DONE | Baseline задан как заранее выбранная процедура; `DummyRegressor.fit` получает только `y_train`. | `train_test_baseline_metrics.ts:104-150` | Среднее 14 вычисляется из `[8,10,12,14,18,22]`; validation answers не входят в fit. | Unit tests + E2E baseline output. | Нет |
| T43-007 | DONE | Baseline и модель сравниваются по MAE на одной validation: 4.00 против 2.33, delta −1.67 с направлением. | `train_test_baseline_metrics.ts:118-151`; generator `456-478` | Таблица содержит procedure, part, metric, score, delta, interpretation. | E2E проверяет оба score и delta. | Нет |
| T43-008 | DONE | Regression унифицирован на `y_true=[10,12,20]`, `y_pred=[11,10,16]`: MAE 2.333, MSE 7.000, RMSE 2.646, R² 0.625. | `train_test_baseline_metrics.ts:155-199`; `tests/test_block4_step03_metrics.py:28-55` | Текст, code/output, четыре formula cards, quiz и visual используют одни числа. | 2 numeric tests passed; E2E проверяет output. | Нет |
| T43-009 | DONE | Удалено расхождение: ранее prose/code использовали `[10,12,20]/[11,10,16]`, cards — `[10,20,30]/[12,18,27]`, отдельная R²-card — суммы 20/100; теперь один набор. | `train_test_baseline_metrics.ts:158-199,288-295`; numeric test `28-55` | Test запрещает legacy `10,20,30` и `MSE≈5.67`; исправлен прежний неверный output R²=0.67. | Unit test passed. | Нет |
| T43-010 | DONE | Указаны units MAE/RMSE, squared units MSE и outlier example 16→0: MAE 7.67, RMSE 11.62. | `train_test_baseline_metrics.ts:160-176` | Таблица units/reaction и отдельный sensitivity counterexample. | Unit metrics passed; content входит в successful build. | Нет |
| T43-011 | DONE | R²: max 1, level 0, нет нижней границы, negative example −1.93 и constant-target/`force_finite` case. | `train_test_baseline_metrics.ts:177-193` | Прогноз `[20,20,20]` даёт `1−164/56≈−1.93`. | E2E проверяет negative и `force_finite=False`. | Нет |
| T43-012 | DONE | До формул зафиксированы synthetic positive class, rows=truth, columns=prediction, затем TN/FP/FN/TP. | `train_test_baseline_metrics.ts:201-221` | Таблица четырёх клеток идёт перед section с formulas. | E2E проверяет orientation; visual содержит текстовые labels и hatch/axes. | Нет |
| T43-013 | DONE | F1 считается напрямую: `16/36=4/9≈0.444`; промежуточные precision/recall не округляются. | `train_test_baseline_metrics.ts:222-256`; numeric test `57-69` | Sklearn output: precision 0.308, recall 0.800, F1 0.444; legacy 0.45 запрещён тестом. | Unit test и E2E passed. | Нет |
| T44-001 | DONE | Общий процесс назван циклом/контуром; `Pipeline` оставлен только для sklearn transforms+estimator. | `project_cycle.ts:14-26` | Заголовок и пояснение отличают lifecycle от программной цепочки. | E2E проверяет heading и определение Pipeline. | Нет |
| T44-002 | DONE | Synthetic churn case содержит объект, cutoff, horizon, действие, target, primary metric и baseline. | `project_cycle.ts:57-78`; generator `593-635` | Все семь полей заполнены в таблице и operational canvas. | E2E циклом проверяет 7 labels. | Нет |
| T44-003 | DONE | Observation window — последние 90 дней до `t`, prediction horizon — следующие 30 дней; future data запрещены. | `project_cycle.ts:62-76` | Cutoff связывает признаки и будущий `churn_30d`. | E2E проверяет оба окна. | Нет |
| T44-004 | DONE | До modelling добавлен gate наблюдаемости label и своевременности полезного действия с evidence/stop condition. | `project_cycle.ts:28-39,80-85` | Нет label или действия → цикл останавливается. | E2E проверяет оба gate headings; visual содержит hatched gate. | Нет |
| T44-005 | DONE | Offline model metric, decision metric и business outcome разделены; рост F1 не обещает удержание. | `project_cycle.ts:87-100`; generator `641-684` | Таблица указывает, что каждый уровень подтверждает и чего не подтверждает. | E2E проверяет heading; desktop/mobile visual review. | Нет |
| T44-006 | DONE | Повторяющиеся лозунги сведены к одному точному callout. | `project_cycle.ts:25` | Точное вхождение `ML-проект — не только` одно. | `rg` подтверждает одно вхождение. | Нет |
| T44-007 | DONE | Добавлен короткий tail: data drift, metric drift, feedback, retraining gate и возврат на нужный этап. | `project_cycle.ts:41-53`; generator `641-684` | Retraining запускает заданное условие, а не календарь. | E2E проверяет monitoring heading/data drift; visual показывает return arrow. | Нет |
| T44-008 | DONE | Финальный checklist преобразован в 10 yes/no gates с artifact/evidence и точным условием «да». | `project_cycle.ts:103-132` | Любое «нет» блокирует зависимый этап; перечислен минимальный evidence package. | Audit/build passed; protected assessment count сохранён. | Нет |
| V-015 | DONE | В один читаемый PNG объединены roles 60/20/20, baseline-vs-model, regression errors и confusion/threshold. | generator `413-590`; metadata `courseVisuals.ts:64-72` | 4 panels, numeric labels, axis/role labels, hatches и explicit conclusions. | Generator validates 2280×4335; E2E desktop/mobile + manual review passed. | Нет |
| V-016 | DONE | В один PNG объединены operational canvas и непоследовательный six-node cycle с monitoring/return. | generator `593-691`; metadata `courseVisuals.ts:74-82` | Не generic four-box chain; содержит 7-field gate и conditional return. | Generator validates 2276×2213; E2E desktop/mobile + manual review passed. | Нет |

## Visual inventory

| Topic | src | Placement | Вопрос | Показанные данные | Вывод | Alt | Caption |
|---|---|---|---|---|---|---|---|
| 4.3 | `/course-visuals/ml-foundations-train-test-baseline-metrics.png` | step `...-split`, section `roles` | Как честно разделить роли данных и последовательно прочитать baseline, regression errors и classification threshold? | 60/20/20; MAE 4.00 vs 2.33, delta −1.67; errors 1/2/4 и MAE/MSE/RMSE/R²; TN72/FP18/FN2/TP8, F1 0.444 и threshold. | Честное сравнение сохраняет роли данных, общий evaluation set, единые числа и порог, выбранный без test. | Четыре вертикальные панели с ролями, score, regression errors и confusion matrix/threshold; числа перечислены. | Видимая подпись объясняет «что показано / как читать / главный вывод» и сообщает, что подписи/узоры дублируют цвет. |
| 4.4 | `/course-visuals/ml-foundations-project-cycle.png` | step `...-churn-case`, section `case` | Какие поля делают ML-вопрос операциональным и куда возвращает monitoring? | 7 полей churn canvas, label/action gate; 6 стадий цикла, offline/decision/business levels, drift/feedback/retraining return. | Без label/действия обучение не начинается; F1 сам по себе не доказывает business effect. | Две вертикальные панели: seven-field canvas/gate и полный cycle с monitoring и условной стрелкой возврата. | Видимая подпись объясняет обе панели, раздельные уровни результата и главный вывод. |

Generator создаёт отдельные панели во временном каталоге `/tmp/ai-train-course-visuals`, а в repository сохраняет только два итоговых scoped PNG. Общее число course visuals после генерации осталось ровно 103.

## Проверки

| Команда | Exit | Результат |
|---|---:|---|
| `git fetch origin main` | 0 | Base `b93ae4ce2366422b0552b5d8f402c1361c154c24` зафиксирован до работы. |
| `python scripts/generate-course-visuals.py` | 0 | Сгенерировано и validated ровно 103 PNG; scoped sizes 2280×4335 и 2276×2213. |
| `python -m unittest tests/test_block4_step03_metrics.py` | 0 | 2/2 passed: unified regression example и exact F1. |
| `npm run audit:curriculum` | 0 | `Curriculum audit passed: 14 blocks, 84 topics, 618 steps.` |
| `npm run lint` | 0 | ESLint без ошибок. |
| `npm run build` | 0 | TypeScript и Vite production build успешны; только существующее non-blocking chunk-size warning. |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/ai-train-playwright-browsers npx playwright test tests/e2e/block4-step03-topics.spec.ts` | 0 | 2/2 Chromium tests passed за 8.6 s. |
| `git diff --check` | 0 | Whitespace errors отсутствуют. |

Промежуточный первый browser launch корректно сообщил об отсутствующем Chromium. После `npx playwright install chromium` (exit 0; официальный Microsoft mirror) финальная команда выше прошла полностью. Два locator assertions были уточнены до семантически эквивалентных regex/`.first()`; product code из-за этого не менялся.

## Desktop/mobile review

- Desktop 1440×900, topic 4.3: headings, table, code/output, combined 4-panel figure и caption видимы; labels, hatches, axes и выводы не пересекаются и не обрезаются.
- Mobile 390×844, topic 4.3: sidebar скрыт штатно; figure и caption масштабируются в колонку; `document.documentElement.scrollWidth <= window.innerWidth` истинно; page-level horizontal overflow отсутствует.
- Desktop 1440×900, topic 4.4: seven-field canvas, gate, monitored cycle, return arrow, three-level table и caption читаемы без перекрытий.
- Mobile 390×844, topic 4.4: figure/caption остаются видимыми и page-level overflow отсутствует; широкие таблицы используют штатный локальный scroll container.
- Полноразмерные screenshots проверены вручную: `/tmp/ai-train-step03-split-desktop.png`, `/tmp/ai-train-step03-metrics-mobile.png`, `/tmp/ai-train-step03-churn-desktop.png`, `/tmp/ai-train-step03-cycle-mobile.png`, `/tmp/ai-train-step03-cycle-desktop.png`.

## Решения, источники и blockers

- Решение: четыре concepts 4.3 и два concepts 4.4 объединены вертикально в один PNG на topic. Это сохраняет читаемость, не увеличивает число repository assets и позволяет держать visual рядом с первым объяснением темы.
- Решение: regression example везде равен `y_true=[10,12,20]`, `y_pred=[11,10,16]`; baseline comparison использует тот же validation target и отдельный train-only mean 14.
- Решение: один train/test split оставлен только как beginner boundary; рекомендуемая iterative procedure явно использует validation/CV и закрытый test.
- Источники глубины/проверки: официальные Google MLCC pages по splitting и classification metrics, scikit-learn MOOC pages по baseline и regression/classification metrics; длинные фрагменты не копировались.
- Open decisions: нет.
- Blockers: нет.
