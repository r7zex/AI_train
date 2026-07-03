# Task: Make AI_train subblocks 1.1 and 1.2 more Stepik-like

Read `AGENTS.md` and `.agents/openclaw_ai_train_workflow.md` first.

Goal:
Edit the existing AI_train project so the first two active introductory subblocks feel closer to a Stepik lesson flow.

Reference requirement:
- Before planning, inspect relevant Stepik lesson examples through the logged-in OpenClaw browser profile `openclaw`.
- Use Stepik only as a reference for flow, pacing, tests, coding tasks, feedback, navigation, and progress behavior.
- Do not copy Stepik course text, tasks, screenshots, datasets, or solutions.
- Update `.agents/stepik_reference_notes.md` with concise observations before writing the implementation plan.
- If Stepik is not logged in, navigate to `https://stepik.org/catalog?auth=login`, block, and ask the human to log in manually in the visible OpenClaw browser. Do not enter credentials.

Scope:
- Work only on active curriculum topics imported by `src/data/aiCurriculum.ts`.
- Target file: `src/data/curriculum/intro_v2.ts`.
- Target topics:
  - `topicAiMlDlV2`, title starts with `1.1`.
  - `topicMlTypes`, title starts with `1.2`.
- Do not edit old inactive `src/data/curriculum/intro.ts` unless you prove it is used.
- Do not touch unrelated course blocks, routing, configs, lockfiles, generated files, or Git metadata.
- Do not commit.

Desired Stepik-like result:
- Each topic should read like a practical Stepik lesson, not a short glossary page.
- Use small sequential steps with clear titles.
- Add concise explanations, examples, tables, callouts, tests/quizzes, and at least one small coding or decision practice task where it fits.
- Keep explanations beginner-friendly but technically correct for junior ML.
- "No water" means no content bloat: remove useless text that does not teach a concept, example, mistake, decision, input/output contract, or next action.
- Avoid huge monolithic paragraphs.
- Keep the style consistent with existing helpers in `src/data/curriculum/helpers.ts`.
- If adding practice, use existing `practiceStep` and `makeStdinTask` helpers.
- Practice/coding tasks should have statement, input format, output format, starter code with clear TODO placeholders, sample tests, hidden tests, fair edge cases, and a reference solution where feasible.
- Tests should check real understanding, not trivia.
- Make the smallest correct change that improves only 1.1 and 1.2.

Acceptance criteria:
- `topicAiMlDlV2` has a richer Stepik-like sequence: orientation, concept, comparison, concrete examples, misconception tests, and a small practice/decision/coding task if feasible.
- `topicMlTypes` has a richer Stepik-like sequence: supervised, unsupervised, reinforcement, regression/classification distinction, examples, misconception tests, and a small practice/decision/coding task if feasible.
- Any coding task explains input/output and placeholders and includes sample/hidden tests when feasible.
- `.agents/stepik_reference_notes.md` records the Stepik patterns used or explains why Stepik could not be inspected.
- Build stays type-safe.
- Run `npm.cmd run build` after edits. If lint is cheap, run `npm.cmd run lint` too.
- Summarize changed files and verification output.

Operational rules:
- Use `git -c safe.directory=C:/Users/User/PycharmProjects/AI_learn/AI_train ...` for git checks.
- Use `npm.cmd`, not bare `npm`.
- Do not use automatic model fallback.
- Stop and ask the human before destructive deletes, secrets, payments, external submissions, security setting changes, or new software installs.
