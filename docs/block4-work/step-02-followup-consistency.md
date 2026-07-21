# Block 4 — step 02 post-merge consistency correction

## Publication

- Base: `775790eeed61abe521e9c148c565ce3491480d74` (merge commit of PR #54).
- Branch: `agent/block4-step02-followup-consistency`.
- Pull request: https://github.com/r7zex/AI_train/pull/55

## Corrected defects

### 1. Class order and class priors

The executable scikit-learn output and generated visual used:

- `classes_ = [да, нет]`;
- `class_prior_ = [2/5, 3/5]`.

The prose and theory table incorrectly reversed both arrays. Topic 4.2 now uses the scikit-learn order consistently in prose, the state table, the hyperparameter/parameter explanation, executable output, and the existing PNG.

### 2. Group leakage versus inference

C105 and C106 both belong to `household_group = H3`. The example is retained as one coherent six-row dataset, but C106 is now explicitly limited to demonstrating the mechanics of `predict`:

- it is not presented as an independent test object;
- the course explicitly states that quality must not be evaluated on C106 after training on C105;
- honest evaluation requires a split without group overlap.

The generic group-leakage row in topic 4.1 now uses H1, avoiding accidental visual identification with the C106 inference demonstration.

## Changed files

| File | Change |
|---|---|
| `src/data/curriculum/ml_foundations/data_target.ts` | Group-leakage example changed from H3 to H1. |
| `src/data/curriculum/ml_foundations/model_fit_predict.ts` | Correct class order/priors and explicit inference-versus-test warning. |
| `tests/e2e/block4-step02-consistency.spec.ts` | Regression assertions for both corrected defects. |
| `docs/block4-work/step-02-followup-consistency.md` | This correction report. |

## Scope preservation

Unchanged:

- six-row synthetic dataset values and group membership;
- all four PNG assets and their generator;
- topic/step/quiz/practice counts;
- local glossary;
- topics 4.3–4.18;
- navigation, judge, editor, and progress logic.

## Verification

- GitHub compare against the PR #54 merge commit reported only the scoped curriculum files and the new regression test before this report was added.
- Exact source assertions cover the corrected `classes_`/`class_prior_` order, removal of the old reversed order, the H1 leakage example, and the explicit prohibition on treating C106 as an independent test object.
- No CI status checks are attached to this repository branch through GitHub; no automated command result is claimed in this report.
