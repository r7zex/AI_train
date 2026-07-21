# Block 4 - step 02: topics 4.1-4.2

## Scope, base, and publication

- Base SHA: `966930bfb146042104f978901e77503039c636a3`.
- Verified source head: `a03362caa2e911df28ee4b3098194de3ff1c71f7`.
- Branch: `agent/block4-step02-topics-4-1-4-2`.
- Draft PR: https://github.com/r7zex/AI_train/pull/54
- Base drift: none. `git fetch origin main` completed before the branch was created, and `origin/main` already contained the merge commit for step 01.

The commit after the verified source head changes only this report to record publication metadata. The current PR head is therefore the report-finalization commit returned in the completion response; the tested source tree remains exactly `a03362caa2e911df28ee4b3098194de3ff1c71f7`.

Scope is limited to topics 4.1-4.2, their four PNG assets and metadata, the visual generator, targeted audit/browser coverage, and this report. Topics 4.3-4.18, `LocalGlossary`, `getCourseGlossaryEntries`, glossary placement, navigation, sidebar, progress, judge, and editor are unchanged.

## Implementation plan and result

1. Use one six-row synthetic churn dataset in both topics; make row meaning, column roles, the `X`/`y` split, shapes, cutoff, and four leakage sources explicit.
2. Define estimator state, `fit`, `predict`, the feature contract, output kinds, output shape, and parameters versus hyperparameters without expanding later topics.
3. Replace the two current visuals and add one second generated visual per topic; register exact placements, semantic alternatives, captions, and reproducible provenance.
4. Add targeted assertions for the scoped theory and four visuals, preserve protected assessment counts, then run generator, curriculum audit, lint, build, targeted browser checks, and desktop/mobile review.

All four plan items are complete. The same C101-C106 values, column names, roles, labels, and shapes are used in prose, tables, executable code/output, quiz questions, and generated visuals.

## Changed files and size guard

| File | Change | Source additions | Source deletions |
|---|---|---:|---:|
| `src/data/curriculum/ml_foundations/data_target.ts` | Six-row table, units and roles, X/y split, cutoff, leakage taxonomy, feature audit, aligned quiz/practice | 141 | 83 |
| `src/data/curriculum/ml_foundations/model_fit_predict.ts` | Estimator state, algorithm-neutral fit, predict shapes/outputs, paths, contract, executable example | 122 | 43 |
| `scripts/generate-course-visuals.py` | Four deterministic diagrams and explicit asset validation/provenance output | 218 | 5 |
| `src/data/courseVisuals.ts` | Four scoped semantic records with exact placement and generated provenance | 23 | 10 |
| `scripts/audit-curriculum.mjs` | Targeted expected PNG count after adding two scoped assets | 1 | 1 |
| `tests/e2e/course.spec.ts` | Targeted 4.1-4.2 theory, asset, placement, desktop, and mobile assertions | 83 | 7 |
| **Source total** | PNG binaries and this report excluded as required | **588** | **149** |

Source additions + deletions: **737 changed lines**, inside the required 700-1200 range.

Generated assets changed or added:

- `public/course-visuals/ml-foundations-data-target.png`
- `public/course-visuals/ml-foundations-data-target-2.png`
- `public/course-visuals/ml-foundations-model-fit-predict.png`
- `public/course-visuals/ml-foundations-model-fit-predict-2.png`

## Protected counts before and after

| Topic | Item | Before | After | Result |
|---|---|---:|---:|---|
| 4.1 | Steps | 5 | 5 | unchanged |
| 4.1 | Quiz questions | 1 | 1 | unchanged |
| 4.1 | Practices | 1 | 1 | unchanged |
| 4.1 | Sample tests | 1 | 2 | increased; original `s1` preserved |
| 4.1 | Hidden tests | 2 | 3 | increased; original `h1`/`h2` preserved |
| 4.2 | Steps | 6 | 6 | unchanged |
| 4.2 | Quiz questions | 1 | 1 | unchanged |
| 4.2 | Practices | 1 | 1 | unchanged |
| 4.2 | Sample tests | 1 | 1 | unchanged; original `s1` preserved |
| 4.2 | Hidden tests | 1 | 1 | unchanged; original `h1` preserved |
| Whole curriculum | Topics | 84 | 84 | unchanged |
| Whole curriculum | Steps | 618 | 618 | unchanged |

The topic counts come from the base/current source inventory. Whole-curriculum counts are enforced by the successful curriculum audit.

## Acceptance evidence

| ID | Status | What changed | Files/lines | Evidence | Verification result | Remaining gap |
|---|---|---|---|---|---|---|
| T41-001 | DONE | Opens with a visible six-row synthetic client table and explicit labels for row, columns, and target. | `data_target.ts:19-37`; generated table visual `generate-course-visuals.py:210-327` | HTML table contains C101-C106; first visual repeats all six rows and prints `[ID]`, `[GROUP]`, `[FEATURE]`, `[TARGET]`. | Targeted browser assertion and desktop review passed. | None. |
| T41-002 | DONE | Separates dataset, object/example/observation, feature, and target/label; forecast unit follows the research question. | `data_target.ts:19-50` | Table identifies apartment, client-at-cutoff, and completed repeat visit as distinct row units. | Audit and targeted heading/content assertions passed. | None. |
| T41-003 | DONE | Defines cutoff and separates available churn features from the 30-day outcome and later account closure. | `data_target.ts:154-161`; timeline `generate-course-visuals.py:212-267` | Timeline explicitly says available before cutoff and do not include in X after cutoff. | Raw PNG and mobile UI review passed. | None. |
| T41-004 | DONE | Physically constructs X and y from the same DataFrame and explains `(n,p)` and `(n,)` with `n=6`, `p=3`. | `data_target.ts:77-130`; table/X/y visual `generate-course-visuals.py:269-326` | Executable code prints six X rows, six y values, `X: (6, 3) y: (6,)`; target/id/group are absent from X. | Build, browser assertions, and code/output inspection passed. | None. |
| T41-005 | DONE | Assigns every column one role and excludes client ID and household group from predictors. | `data_target.ts:51-70` | Role table has `feature/target/id/group` and explicit X decision; practice excludes optional id/group columns. | Audit executes all preserved and added practice tests successfully. | None. |
| T41-006 | DONE | Replaces the unrelated 16-row universal name dictionary with translations only for the six used columns. | `data_target.ts:51-70` | Main text now contains only `client_id`, `household_group`, three predictors, and `churn_after_30d`. | Diff review confirms removal; local glossary files are absent from diff. | None. |
| T41-007 | DONE | Gives Russian-first definitions and one forbidden source for target, future, preprocessing, and group/duplicate leakage. | `data_target.ts:162-178` | Four table rows name the forbidden answer, future, held-out statistics, and linked-group information. | Targeted browser loop finds all four categories; audit passed. | None. |
| T41-008 | DONE | Highlights the availability/same-measurement/permission rule and applies it to all three predictors. | `data_target.ts:131-142` | Five-column audit table records three checks and the keep decision for each feature. | Targeted content review and build passed. | None. |
| T41-009 | DONE | Keeps `tariff` as raw `basic`/`pro` values and defers encoding to 4.16. | `data_target.ts:143-147` | Text explicitly says X need not already be a numeric matrix and links forward without explaining encoding. | Targeted browser assertions passed. | None. |
| T42-001 | DONE | Distinguishes an object-estimator before fit from a fitted model and states exactly what is added. | `model_fit_predict.ts:19-41`; state visual `generate-course-visuals.py:328-374` | Before: strategy only and no learned attributes; after: classes, priors, and the most-frequent rule. | Raw PNG and targeted state-page assertions passed. | None. |
| T42-002 | DONE | Defines fit as estimating algorithm-specific parameters, rules, or summaries rather than one universal trial-prediction loop. | `model_fit_predict.ts:46-62` | Comparison covers linear coefficients, tree splits/leaves, and dummy class frequencies. | Audit, lint, and targeted assertions passed. | None. |
| T42-003 | DONE | Adds separate training and inference paths and states that ordinary predict neither receives y nor changes parameters. | `model_fit_predict.ts:157-164`; path visual `generate-course-visuals.py:375-425` | Upper branch uses X_train+y_train; lower branch uses C106 X_new only and returns one y_pred. | Targeted figure/caption assertion and desktop/mobile review passed. | None. |
| T42-004 | DONE | Defines identical columns, order, units, and transformations; shows missing, extra, reordered, and unit errors plus prevention. | `model_fit_predict.ts:165-181` | One `feature_cols` list and a Pipeline are prescribed; table gives a C106 example for each contract violation. | Targeted browser assertions passed. | None. |
| T42-005 | DONE | Separates regression number, classification label, and classification probability; defers probability detail to 4.11. | `model_fit_predict.ts:138-151` | Output table shows `10.8`, class `нет`, and `[0.4, 0.6]` as different entities. | Targeted `predict_proba` assertion and build passed. | None. |
| T42-006 | DONE | Explains one result per new object and prints all training/new/result shapes. | `model_fit_predict.ts:75-137` | Code prints `(5,3) (5,) (1,3) (1,)` and `['нет']`. | Exact scikit-learn example exited 0 with the documented output. | None. |
| T42-007 | DONE | Uses one dummy example to separate pre-fit strategy from learned class proportions and links to 4.15. | `model_fit_predict.ts:64-68` | `strategy="most_frequent"` is set before fit; `class_prior_=[2/5,3/5]` is learned. | Targeted forward-reference assertion passed. | None. |
| T42-008 | DONE | Replaces anthropomorphic definitions with computational state, estimation, and application language. | `model_fit_predict.ts:19-25,46-49,75-78` | Main definitions contain no “model notices/understands” claim. | Diff/text review, lint, and build passed. | None. |
| V-003 | DONE | Replaces the curated/silently skipped 4.2 asset with deterministic generation and hard validation of all four scoped outputs. | `generate-course-visuals.py:328-425,755-832`; `courseVisuals.ts:46-63` | Main no longer skips 4.2; validation checks file, bytes, dimensions and prints `source=scripts/generate-course-visuals.py`; metadata says generated. | Generator exit 0 validated all four PNGs; audit exit 0. | None. |
| V-013 | DONE | Creates distinct table-to-X/y and cutoff/leakage timeline visuals for 4.1. | `generate-course-visuals.py:210-327`; `courseVisuals.ts:28-45` | Two unique PNGs have different data/questions and are placed after `synthetic-client-table` and `cutoff-timeline`. | Raw PNG inspection, audit uniqueness checks, targeted desktop/mobile test passed. | None. |
| V-014 | DONE | Creates distinct training-vs-inference and state-before/after-fit visuals for 4.2. | `generate-course-visuals.py:328-425`; `courseVisuals.ts:46-63` | One PNG separates y_train from X_new; the other shows absent/present learned attributes. | Raw PNG inspection, audit uniqueness checks, targeted desktop/mobile test passed. | None. |

## Visual inventory

| src | placement | question | shown data | conclusion | alt | caption |
|---|---|---|---|---|---|---|
| `/course-visuals/ml-foundations-data-target.png` | `ml-foundations-data-target-object / synthetic-client-table` | How do the six original rows become X and y? | C101-C106, six role-labelled columns, X `(6,3)`, y `(6,)` | Rows stay aligned; id/group/target do not enter X | Table of six synthetic clients labelled ID, GROUP, FEATURE, and TARGET splits into X of shape 6 by 3 and y of shape 6. | What: all six rows and role split. How: exclude ID/GROUP, send three FEATURE columns to X and TARGET to y. Conclusion: X/y rows match and target is absent from features. |
| `/course-visuals/ml-foundations-data-target-2.png` | `ml-foundations-data-target-leakage / cutoff-timeline` | Which values exist at decision time? | Three feature value sequences before cutoff; target and close date after cutoff | Archive presence is insufficient; availability at cutoff controls admissibility | Churn timeline separates three features available before cutoff from target and account-closure date after cutoff. | What: temporal boundary. How: labelled allowed blocks are left, explicitly forbidden blocks right. Conclusion: a column is admissible only if available the same way at decision time. |
| `/course-visuals/ml-foundations-model-fit-predict.png` | `ml-foundations-model-fit-predict-compare / two-paths` | What differs between training and inference? | C101-C105 X/y shapes, fit, fitted state, C106 X_new, y_pred | y enters fit only; ordinary predict leaves parameters unchanged | Two branches show training with X_train and y_train for C101-C105 and a separate predict using only C106 X_new. | What: fit and inference branches. How: upper uses X_train+y_train, lower uses X_new and fitted model. Conclusion: y is absent from predict and parameters stay fixed. |
| `/course-visuals/ml-foundations-model-fit-predict-2.png` | `ml-foundations-model-fit-predict-model / state-before-after` | What state appears after fit? | Strategy before; classes, `[2/5,3/5]` priors, and majority rule after | Hyperparameter is preset; learned state comes from training answers | Before-fit estimator panel has only most-frequent strategy; after-fit model panel has classes, priors, and return-no rule. | What: one estimator before/after five answers. How: fit adds classes, priors, and rule. Conclusion: the setting is preset and state is estimated from training data. |

All four visible captions in the UI contain explicit “Что показано”, “Как читать”, and “Главный вывод” text. Color is redundant with role labels, path labels, shape text, cutoff position, and allowed/forbidden wording.

## Commands and exit codes

| Command | Exit code | Result |
|---|---:|---|
| `git fetch origin main` | 0 | Fetched latest main before branch creation; base `966930b...`. |
| `python scripts/generate-course-visuals.py` | 0 | Generated 103 assets and explicitly validated the four scoped PNGs at 2167x1029 or 1976x993. |
| Standalone execution of the documented pandas/scikit-learn fit/predict example | 0 | Produced the exact documented classes, priors, shapes, and `['нет']`. |
| `npm run audit:curriculum` | 0 | 14 blocks, 84 topics, 618 steps; visual and practice checks passed. |
| `npm run lint` | 0 | ESLint passed. |
| `npm run build` | 0 | TypeScript and production Vite build passed. |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/ms-playwright npx playwright test tests/e2e/course.spec.ts --grep "topics 4.1 and 4.2"` | 0 | 1/1 targeted Chromium test passed. |
| `PLAYWRIGHT_BROWSERS_PATH=/tmp/ms-playwright npx playwright test` | 0 | Full Chromium suite passed, 14/14. |
| `git diff --check` | 0 | No whitespace errors. |

The first dependency attempt failed because npm tried to create `/root/.npm`; `npm ci --cache /tmp/npm-cache` then completed with exit 0. The first targeted browser attempt only reported a missing browser binary; installing/using Chromium from `/tmp/ms-playwright` resolved it. The first audit exposed the new expected PNG count and a required starter-code marker; both targeted checks were corrected before the final all-green run.

## Desktop and mobile review

- Desktop at 1440x900: the six-row table, table-to-X/y visual, role tables, two-path visual, feature-contract table, captions, glossary, and navigation render without overlap or clipping. Figures appear after their declared sections rather than being grouped at topic start.
- Mobile at 390x844: the sidebar is hidden as designed; leakage and fit/predict figures remain inside the content width; captions remain visible; wide data tables scroll inside their own containers; `document.documentElement.scrollWidth <= window.innerWidth` is true on both scoped mobile pages.
- The four raw generated PNGs were inspected at original resolution after final regeneration. Text, arrows, role labels, conclusions, and cutoff marks are legible; no element overlaps; color is not the only carrier of meaning.
- Browser evidence was written to `/tmp/ai-train-step02-data-table-desktop.png`, `/tmp/ai-train-step02-fit-predict-desktop.png`, `/tmp/ai-train-step02-data-mobile.png`, and `/tmp/ai-train-step02-fit-predict-mobile.png`. These are temporary verification artifacts, not repository assets.

## Open decisions and blockers

- Open decisions: none.
- Remaining gaps: none for the scoped IDs.
- Blockers: none. Local HTTPS push lacked GitHub credentials, so the authenticated GitHub connector published the exact tested tree and opened the draft PR; this did not change source content.
