# Stepik Reference Protocol

Use this protocol when the human asks for a lesson to be "Stepik-like", asks for course UX references, or asks to improve tests/coding tasks by comparing against Stepik.

## Purpose

Stepik is a reference for learning flow and interaction quality, not a source to copy from. Agents should extract patterns:

- how a lesson is split into short steps;
- where theory, examples, tests, and coding tasks appear;
- how task statements describe input/output;
- how sample tests and hidden tests are presented;
- how feedback, progress, navigation, and retries feel;
- how much text is useful before the learner gets an action.

Do not copy Stepik course text, tasks, datasets, solutions, screenshots, or proprietary content into AI_train. Use summarized observations and your own implementation.

## Account And Browser Rules

- Use the OpenClaw dedicated browser profile named `openclaw` for Stepik reference work.
- The profile is visible Chrome controlled through `openclaw browser ...`, with user data under `C:\Users\User\.openclaw\browser\openclaw\user-data`.
- Before inspecting Stepik, run `openclaw browser --json doctor` and ensure gateway, plugin, profile, browser, and tabs are OK.
- If the browser is not running, run `openclaw browser start`.
- The browser should run headless by default. Verify `openclaw browser status` says `headless: true (config)`.
- Run `.agents\scripts\browser_headless_stepik_probe.ps1` before using Stepik observations. The script verifies headless mode, tab switching, logged-in catalog access, and the learning page snapshot.
- Record browser action logs and artifact paths in the Workboard card. A valid log includes action, target tab, result, and snapshot/report path.
- If Stepik is not logged in, navigate to `https://stepik.org/catalog?auth=login`, block the card, and ask the human to log in manually in the visible OpenClaw browser window.
- Do not enter passwords, 2FA codes, recovery codes, payment data, or personal profile data.
- Do not enroll in paid courses, submit assignments, post comments, send messages, change account settings, or modify Stepik data unless the human explicitly confirms that exact action in the current turn.
- If Stepik shows a CAPTCHA, payment wall, account warning, or security prompt, stop and ask.

## What Planner Must Capture

Before planning a Stepik-like lesson change, planner should inspect 1-3 relevant Stepik examples through the logged-in browser and update `.agents/stepik_reference_notes.md` with concise observations.

Capture facts in this shape:

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

Keep notes short. The goal is to guide implementation, not to archive Stepik.

## Reference Checklist

When inspecting Stepik, look specifically for:

- step length: how many paragraphs before a question or action;
- step sequence: theory -> example -> test -> coding task -> summary;
- test types: single choice, multiple choice, numeric/text answer, matching, code;
- coding statements: problem, input format, output format, constraints, samples, hidden checks;
- hints: whether they explain strategy without giving the full answer;
- feedback: wrong answer, runtime error, sample failure, hidden test failure;
- retry loop: how quickly a learner can fix and rerun;
- progress state: completed step, current step, next step;
- visual density: content width, code block shape, task panel shape, button placement.

## Output Rules

Planner output must say which Stepik patterns were used and which were rejected. Reviewers should block if a Stepik-like task was planned without either:

- a current `.agents/stepik_reference_notes.md` update, or
- a clear reason why Stepik inspection was not possible.

Reviewers should also block if the planner claims browser inspection but does not include browser action evidence from `.agents/browser_probe/` or equivalent snapshot output.
