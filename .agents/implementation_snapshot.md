# AI_train Implementation Snapshot

This file is maintained by `planner` before each pipeline plan.

Last refreshed: 2026-07-03 by planner, from local checkout and GitHub remote metadata.

## Repository

- Local path: `C:\Users\User\PycharmProjects\AI_learn\AI_train`
- Remote: `git@github.com:r7zex/AI_train.git`
- GitHub default branch: `main`
- GitHub `HEAD` at refresh: `3942d47b4abf5046cb43ade27a051045258b2586`
- Local branch at refresh: `codex/13`
- Local `HEAD` at refresh: `8541ffdd8ffda900c0f3566eab74e20a4d6cf9d8`

## Stack

- React 19, TypeScript, Vite 8, Tailwind CSS.
- Routing uses `react-router-dom` in `src/App.tsx`.
- Main verification commands on Windows:
  - `npm.cmd run lint`
  - `npm.cmd run build`

## OpenClaw Workflow Facts

- Local OpenClaw config must allow `ai_train_start_pipeline`, `ai_train_stop_all`, and Workboard lifecycle tools such as `workboard_complete`, `workboard_block`, and `workboard_dispatch`; otherwise role cards may remain visually stuck.
- Workboard worker cards are already claimed by the dispatcher. Agents must use the provided Worker protocol claim token and must not call `workboard_claim` on their current card.
- Plugin verification commands on Windows:
  - `cd .agents\openclaw_plugins; npm.cmd run build`
  - `cd .agents\openclaw_plugins; npm.cmd test`
- Use `git -c safe.directory=C:/Users/User/PycharmProjects/AI_learn/AI_train ...` for git commands.

## App Entry Points

- `src/main.tsx` mounts the app with `BrowserRouter`.
- `src/App.tsx` defines routes:
  - `/topics`
  - `/topics/:topicId`
  - `/topics/:topicId/:stepId`
  - `/terms-functions`
  - `/comparison`
  - `/cheatsheet`
  - `/yandex-theory`
- `src/pages/TopicDetailPage.tsx` renders lesson steps, rich text, quizzes, practice tasks, and the course sidebar.
- `src/components/CourseSidebar.tsx` renders left course navigation.
- `src/components/StepNavigator.tsx` renders step navigation and quiz embedding.
- `src/features/quiz/QuizWidget.tsx` renders quizzes and uses `RichText`.
- `src/components/RichText.tsx` renders formatted inline lesson text.
- `src/lib/practiceEngine.ts` runs practice tasks, including Python stdin/stdout through Pyodide, sample tests, hidden tests, normalized output comparison, runtime errors, and structural feedback.

## Curriculum Entry

`src/data/aiCurriculum.ts` currently exports `flowTopics` in this order:

1. `topicAiMlDlV2` from `src/data/curriculum/intro_v2.ts`
2. `topicMlTypes` from `src/data/curriculum/intro_v2.ts`
3. `topicMlProjectLifecycle` from `src/data/curriculum/intro_v2_part2.ts`
4. `topicMetricsDeep` from `src/data/curriculum/intro_v2_part2.ts`
5. `numpyTopics`
6. `pandasTopics`
7. `mlFoundationsTopics`

Active introductory topics are in `src/data/curriculum/intro_v2.ts`; do not edit old inactive intro files unless usage is proven.

## Curriculum Helpers

- `src/data/curriculum/helpers.ts` defines the local lesson-authoring style.
- Prefer existing helpers such as `introTopic`, `section`, `callout`, `quizStep`, `practiceStep`, and `makeStdinTask`.
- Keep lesson additions compatible with existing `FlowTopic`, step, quiz, and practice task types.
- Coding tasks should use existing `PracticeTask` fields: `statement`, `tips`, `starterCode`, `sampleTests`, `hiddenTests`, and `solution`.
- Stepik-like tasks should refresh `.agents/stepik_reference_notes.md` before planning.

## Planning Notes For Future Refresh

Before each task, `planner` must update this file if any of these changed:

- GitHub default branch commit.
- Active curriculum import order.
- Main rendering components.
- Verification commands.
- Files directly touched by the requested task.
- Known limitations or broken runtime checks.

If this file is stale or incomplete, reviewers must block the plan and request a refresh.
