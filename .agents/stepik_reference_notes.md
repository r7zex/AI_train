# Stepik Reference Notes

Planner maintains this file. Do not treat it as a permanent copy of Stepik content.

## Current Status

2026-07-03 setup check:
- OpenClaw browser control is reachable through profile `openclaw`.
- Stepik opens in that profile.
- The human logged in manually.
- Login was verified through `openclaw browser snapshot --efficient --limit 120`: Stepik showed `Моё обучение`, `Activity`, and `Profile`, with no `Войти` login link in the visible header.
- Browser click capability was verified with a safe catalog tab click: `openclaw browser click e16` clicked `Новые курсы`, and the follow-up snapshot showed the course list changed.
- Browser headless mode is now configured persistently: `openclaw browser status` reports `headless: true (config)`.
- Headless tab switching probe passed through `.agents\scripts\browser_headless_stepik_probe.ps1`: catalog and learn tabs were focused, snapshots were saved under `.agents/browser_probe/`, and `.agents/browser_probe/report.json` reported `ok=true`.
- Model-driven probe passed after adding progress logs to the script: `planner` with `openrouter/qwen/qwen3-coder-plus` ran `.agents\scripts\browser_headless_stepik_probe.ps1` through `exec/process`, waited for completion, and returned `ok=true`, `headless=true`, `headlessSource=config`, `catalogTarget=t1`, `learnTarget=t2`, `catalogShowsLoggedInHeader=true`, `learnSnapshotShowsCourses=true`.
- This is only a setup/status check. Planner still must inspect relevant Stepik lesson examples and replace this setup status with task-specific observations before planning Stepik-like lesson changes.

## Template

```text
Date:
Stepik areas inspected:
Lesson flow:
Theory step pattern:
Test pattern:
Coding task pattern:
Input/output wording:
Feedback/retry behavior:
Navigation/progress behavior:
Patterns to reuse in AI_train:
Patterns not to copy:
Screenshots saved, if any:
```
