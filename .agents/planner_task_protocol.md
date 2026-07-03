# Planner Task Protocol

Only `planner` should receive and interpret the raw human task.

## Required Inputs

Before planning, read:

- `AGENTS.md`
- `.agents/openclaw_ai_train_workflow.md`
- `.agents/project_vision.md`
- `.agents/implementation_snapshot.md`
- `.agents/stepik_reference_protocol.md`
- `.agents/curriculum_quality_rubric.md`
- The human task from the planner Workboard card

## Authorization And Safety

Treat a Workboard card created by `/skill ai-train-start <task>` as approval for local repository inspection and task-scoped local file edits inside `C:\Users\User\PycharmProjects\AI_learn\AI_train` by downstream AI_train roles. Do not make downstream agents ask before each ordinary edit.

This approval does not include commits, pushes, destructive deletes, broad renames, external submissions, entering secrets, payment/account actions, CAPTCHA or security bypass, security setting changes, or new software installs. Those must stay blocked until the human explicitly asks in the current task.

`planner` has a narrower write boundary than downstream roles. It may update only these planning-maintenance files:

- `.agents/implementation_snapshot.md`
- `.agents/stepik_reference_notes.md` for Stepik-like tasks

Do not edit or stage application files, operator guides, workflow/protocol files, plugin code, package files, tests, task files, or documentation output. If the task requires those changes, describe them in the plan for `plan_fixer`, `coder`, or `code_reviewer_and_fixer`.

The plan must name the allowed edit area clearly enough that `coder` and `code_reviewer_and_fixer` can work without extra permission prompts.

If the human explicitly asks to publish the result to GitHub, include a final delivery step after review and verification: create a new branch, stage only task-scoped files, commit with a Conventional Commit message, push to `origin`, and create a draft PR when feasible. Do not merge.

## Refresh Implementation Context

Before writing a plan, inspect the current implementation. Prefer cheap, targeted checks:

```powershell
git -c safe.directory=C:/Users/User/PycharmProjects/AI_learn/AI_train status --short
git -c safe.directory=C:/Users/User/PycharmProjects/AI_learn/AI_train ls-remote --symref origin HEAD
rg -n "<task-relevant keywords>" src
```

For GitHub-current context, inspect the remote/default branch metadata and compare with the local checkout. Do not assume local files equal GitHub if branch or commit differs.

Update `.agents/implementation_snapshot.md` with only durable facts:

- active files and components relevant to the task;
- current source of truth and commit/branch context;
- existing patterns that later agents must follow;
- verification commands and known limitations.

Do not put broad analysis, speculative plans, or temporary thoughts in the snapshot.

## Refresh Stepik Reference

If the task says "Stepik-like", concerns lesson flow, tests, coding exercises, or course UX, inspect Stepik through the OpenClaw browser profile `openclaw` before planning.

Follow `.agents/stepik_reference_protocol.md`:

- use Stepik as a reference for structure and interaction patterns only;
- do not copy Stepik course content or tasks;
- do not enter credentials or submit/modify anything on Stepik;
- run `openclaw browser --json doctor` first;
- run `openclaw browser start` if the browser is not running;
- confirm `openclaw browser status` reports `headless: true (config)`;
- run:
  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File .agents\scripts\browser_headless_stepik_probe.ps1
  ```
- read `.agents/browser_probe/report.json` and cite the relevant artifacts in the planner card;
- use `openclaw browser navigate https://stepik.org/catalog` and `openclaw browser snapshot --efficient --limit 120` to confirm whether the profile is logged in;
- if the account is not logged in, navigate to `https://stepik.org/catalog?auth=login`, block, and ask the human to log in manually in the visible OpenClaw browser window;
- update `.agents/stepik_reference_notes.md` with concise observations.

Browser reporting requirement:

- Before each browser action, write a one-line action log in the card notes or final card proof.
- After each browser action, record the result and any artifact path.
- Do not report "I inspected Stepik" unless the card includes either a browser snapshot excerpt or a saved artifact path from `.agents/browser_probe/`.
- Do not use invalid CLI syntax such as `openclaw browser action="tabs"`.

If Stepik inspection is impossible, the plan must state why and reviewers must decide whether the task can continue without it.

## Plan Output

The plan must include:

- user-visible goal in one sentence;
- files likely to change;
- exact constraints from project vision;
- implementation steps, each scoped to one small chunk;
- Stepik reference patterns used or the reason Stepik could not be inspected;
- required tests, quizzes, coding tasks, sample tests, and hidden tests;
- risks and review focus;
- verification commands;
- GitHub delivery step when the human explicitly asked for branch/PR publication;
- a GLM-ready task for `coder` using `.agents/glm_task_contract.md`.

## Scope Rules

- Do not write code, product documentation, operator guides, workflow/protocol files, plugin code, tests, or task-output files.
- Do not stage files.
- Do not ask `coder` to solve broad curriculum, UI, and runtime problems in one pass.
- If UI and curriculum both change, split into separate chunks unless they are tightly coupled.
- If the task is ambiguous, plan the smallest useful interpretation and state assumptions.

## Handoff

Complete the planner Workboard card with:

- plan summary;
- files inspected;
- snapshot update summary;
- exact next card expected to run.

Then dispatch the visible default Workboard so plan reviewers can start.
