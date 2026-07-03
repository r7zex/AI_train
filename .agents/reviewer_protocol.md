# Reviewer Protocol

Reviewers exist to find real issues, not to approve by default.

Worker card handling: do not call `workboard_claim` on the current dispatched card. Use the card id, owner id, and claim token supplied in the Worker protocol for heartbeat, complete, or block actions.

## Plan Reviewers

`plan_reviewer_1` checks operational safety:

- No unrelated rewrites.
- No hidden deletes, commits, pushes, installs, payments, external submissions, secrets, or security bypasses.
- If GitHub delivery is requested, commit/push must be explicit in the plan, happen only after verification, use a new branch, include only task-scoped files, and never merge to `main`.
- Planner did not edit or stage anything except `.agents/implementation_snapshot.md` and `.agents/stepik_reference_notes.md`.
- No automatic model fallback.
- GLM task is narrow enough.
- Snapshot is refreshed and relevant.
- Stepik-like lesson work has either fresh `.agents/stepik_reference_notes.md` observations or a clear blocker explaining why Stepik could not be inspected.

`plan_reviewer_2` checks technical feasibility:

- Correct files and active code paths.
- Fits existing React/TypeScript/Tailwind/curriculum helper patterns.
- Verification commands are realistic on Windows.
- UI/browser/screenshot checks are included when UI changes.
- Content review is included when lesson text changes.
- Quiz, test, and coding-task requirements are included when curriculum changes.

If either reviewer finds a blocker, the reviewer must block the card and write a concrete fix request.

## Plan Fixer

`plan_fixer` merges reviewer findings into one final plan. It must not ignore reviewer objections. It must produce a single GLM-ready task, or explicitly block if the plan is not ready.

## Code Reviewer And Fixer

Review the actual diff. Focus on:

- Broken imports, type errors, runtime regressions.
- Misused curriculum helpers or inactive files.
- UI regressions: overflow, overlap, bad active state, unstable layout.
- Content regressions: vague text, undefined terms, hidden assumptions.
- Content bloat: useless or bloated text that does not teach concept, example, mistake, decision, input/output contract, or next action.
- Practice tasks with unclear input/output, missing sample tests, missing hidden tests, or brittle tests.
- Coding tasks whose TODO placeholders, parameters, expected output, or edge cases are not explained.

Apply only narrow fixes when the required fix is obvious and within the approved task. Otherwise block and describe the issue.

## Runtime Tester

Do not trust claims. Use command output.

Default checks:

```powershell
npm.cmd run lint
npm.cmd run build
```

If UI changed, verify rendered behavior through browser or static built output when feasible.

If the human explicitly requested GitHub delivery and all required checks pass, the final verifier may create the new branch, commit only task-scoped files, push it to `origin`, and create a draft PR when feasible. Report the exact branch, commit hash, PR URL, and staged files.

## Design Screenshot Reviewer

Use when UI changed or screenshots are available.

Check:

- desktop and mobile layout;
- left menu width and active state;
- buttons and interaction states;
- text wrapping and overflow;
- lesson cards, quizzes, code blocks, practice panels;
- visual consistency with the existing app.

## Curriculum Reviewer

Use when lesson content changed.

Check:

- beginner can follow without prior ML assumptions;
- each concept has purpose, input, output, and example;
- no content bloat or vague motivational prose;
- Stepik reference notes were used when the task asks for Stepik-like lessons;
- quizzes test the intended distinction;
- tests have plausible wrong answers and useful explanations;
- coding tasks have statement, input format, output format, starter code, sample tests, hidden tests, fair edge cases, reference solution, and success condition;
- practice tasks explain placeholders, parameters, expected output, and success condition.

Also read `.agents/curriculum_quality_rubric.md` before approving curriculum changes.
