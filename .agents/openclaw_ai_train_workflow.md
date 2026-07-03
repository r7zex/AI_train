# AI_train OpenClaw Multi-Agent Workflow

Target project: `C:\Users\User\PycharmProjects\AI_learn\AI_train`.

Runtime:
- Use the Windows OpenClaw gateway for this project. It can see the Windows project path directly.
- Keep WSL OpenClaw as a separate gateway unless the human explicitly asks to use it.
- Keep work observable in the OpenClaw task thread and, when useful, in this file.
- For operator-controlled launches, use Windows Hub or Dashboard only:
  - Dashboard URL: `http://127.0.0.1:18789/`.
  - Workboard UI: visible default Workboard at `http://127.0.0.1:18789/workboard`.
  - Dashboard currently does not expose a clear board selector; AI_train cards must be visible default Workboard cards with `[AI_train]` title prefix and `ai-train` labels.
  - Start command in Hub/Dashboard: `/skill ai-train-start <task>`.
  - Emergency stop command in Hub/Dashboard: `/skill ai-train-stop-all`.
  - Foreground session abort: Dashboard `Stop` or `/stop` in the active session.
  - Do not require the human to run a PowerShell pipeline manually.

Context files:
- `.agents/project_vision.md`: stable product and learning-quality target.
- `.agents/implementation_snapshot.md`: refreshed implementation facts from GitHub/local code. `planner` maintains it before each plan.
- `.agents/stepik_reference_protocol.md`: how planner uses the human's logged-in Stepik account as a reference without copying content or changing the account.
- `.agents/stepik_reference_notes.md`: concise Stepik observations refreshed by planner for Stepik-like tasks.
- `.agents/curriculum_quality_rubric.md`: no-content-bloat, quiz/test, and coding-task quality bar.
- `.agents/planner_task_protocol.md`: required planner steps.
- `.agents/reviewer_protocol.md`: review gates for plan, code, runtime, design, and curriculum.
- `.agents/glm_task_contract.md`: exact task format for `coder` / GLM 5.2.
- `.agents/operator_guide.md`: human-facing usage guide.

Core rules:
- Use the existing AI_train repository style and make the smallest correct change.
- Launching `/skill ai-train-start <task>` is the human's approval for local reads and task-scoped local file edits inside `C:\Users\User\PycharmProjects\AI_learn\AI_train` by the AI_train pipeline roles. Agents should not ask before each ordinary local edit that is required by the approved task.
- `planner` is not an implementation role. During normal planning it may edit only `.agents/implementation_snapshot.md` and, for Stepik-like tasks, `.agents/stepik_reference_notes.md`. It must not edit or stage application files, operator guides, workflow/protocol files, plugin code, package files, tests, or other task-output files; those changes must be assigned to downstream roles through the plan.
- Do not rewrite unrelated code, rename files, alter public APIs, commit, push, or delete files unless the human explicitly asks in the current task.
- If the human explicitly asks to publish the result, create a new branch after code review and verification, commit only task-scoped files, push that branch to `origin`, and report the branch name/commit/PR URL when a PR is created. Never merge to `main`.
- No automatic model fallback. If a configured model is unavailable, stop and ask the human.
- If a model price is unknown or changed materially, stop and ask the human.
- High-risk actions still require explicit in-turn confirmation: destructive deletes, payments, external message or form submission, entering secrets, CAPTCHA or security bypass, security setting changes, and new software installs.
- If the human says stop, stop all role work immediately and report the last completed step, active command, and pending handoff.
- If launched from Workboard, complete or block the current card with evidence, then dispatch the default Workboard so dependent role cards can advance. If stopping, cancel active Gateway-tracked AI_train tasks and mark visible running cards blocked when possible.
- Workboard worker cards are already claimed by the dispatcher. Agents must not call `workboard_claim` on their current card; they must use the Worker protocol card id, owner id, and claim token for `workboard_heartbeat`, `workboard_complete`, and `workboard_block`.
- Only `planner` should receive and interpret the raw human task. Reviewers, fixer, coder, and testers must evaluate planner output, parent Workboard cards, `.agents/implementation_snapshot.md`, and their protocol files instead of independently expanding the original task.
- For Stepik-like tasks, planner should inspect Stepik through the logged-in OpenClaw browser profile `openclaw` and update `.agents/stepik_reference_notes.md`. Use Stepik as a reference for flow, tests, coding tasks, feedback, navigation, and pacing only. Do not copy Stepik content or submit/modify anything in the account.
- Browser readiness command: `openclaw browser --json doctor`.
- Browser start command: `openclaw browser start`.
- Stepik login URL for manual human login: `https://stepik.org/catalog?auth=login`.
- Browser is configured to run headless by default with `browser.headless=true`. `openclaw browser status` should show `headless: true (config)`.
- Required Stepik/browser probe before planner uses Stepik:
  ```powershell
  powershell -NoProfile -ExecutionPolicy Bypass -File .agents\scripts\browser_headless_stepik_probe.ps1
  ```
- The probe writes observable evidence to `.agents/browser_probe/doctor.json`, `.agents/browser_probe/tabs.json`, `.agents/browser_probe/catalog_snapshot.txt`, `.agents/browser_probe/learn_snapshot.txt`, and `.agents/browser_probe/report.json`.
- Agents must include a short browser action log in their Workboard card before and after browser use: command/action, target tab, result, and artifact path.
- Do not use the invalid syntax `openclaw browser action="tabs"`. Use either the OpenClaw `browser` tool JSON actions from `browser-automation` skill, or the CLI commands documented as `openclaw browser tabs`, `openclaw browser focus <tabId>`, `openclaw browser snapshot ...`, and the probe script above.
- If Stepik shows `Войти`, email/password fields, CAPTCHA, a security prompt, or a payment/account warning, block and ask the human. Agents must not enter credentials or bypass prompts.

Configured active agents:
- `planner`: `openrouter/qwen/qwen3-coder-plus`. Public OpenRouter price checked 2026-07-02: input $0.65/M, output $3.25/M. This exceeds the old planner output cap and is allowed by the human's later approval. `qwen/qwen3.7-plus` was not found as a valid OpenRouter id.
- `plan_reviewer_1`: `openrouter/google/gemini-2.5-flash-lite`. Price checked: input $0.10/M, output $0.40/M.
- `plan_reviewer_2`: `openrouter/qwen/qwen3-coder-flash`. Price checked: input $0.195/M, output $0.975/M.
- `plan_fixer`: `openrouter/qwen/qwen3-coder-flash`.
- `coder`: `openrouter/z-ai/glm-5.2`. Price checked: input $0.93/M, output $3.00/M. This is the fixed coder model.
- `code_reviewer_and_fixer`: `openrouter/qwen/qwen3-coder-flash`.
- `runtime_tester`: `openrouter/google/gemini-2.5-flash-lite`.
- `design_screenshot_reviewer`: `openrouter/qwen/qwen3-vl-30b-a3b-instruct`. Vision model. Price checked: input $0.13/M, output $0.52/M.
- `curriculum_reviewer`: `openrouter/qwen/qwen3-coder-flash`.

Manual-only optional model:
- `openrouter/mistralai/mistral-small-3.2-24b-instruct`. Vision-capable, input $0.075/M, output $0.20/M. Do not use as fallback; use only after explicit human request.

Pipeline:
1. `planner` reads the raw human task, project vision, current implementation snapshot, Stepik protocol, curriculum rubric, and current GitHub/local code. For Stepik-like tasks it verifies the OpenClaw browser profile `openclaw` with `.agents\scripts\browser_headless_stepik_probe.ps1`, refreshes `.agents/stepik_reference_notes.md`, then refreshes `.agents/implementation_snapshot.md`, creates a scoped implementation plan, and does not edit task-output files or stage changes.
2. `plan_reviewer_1` checks policy, approval gates, git safety, no-fallback rules, and GLM chunk size.
3. `plan_reviewer_2` checks technical feasibility, Windows/PowerShell runner details, timeouts, and local test strategy.
4. `plan_fixer` merges reviewer feedback into a final revised plan and one `.agents/glm_task_contract.md`-compatible task for `coder`, including exact quiz/test/coding-task requirements when curriculum changes.
5. `coder` implements exactly the approved small chunk using `z-ai/glm-5.2`.
6. `code_reviewer_and_fixer` reviews the diff and may apply narrow fixes that directly address review findings inside the approved task scope. It must report what it changed and how it verified the fix.
7. `runtime_tester` verifies commands, logs, timeouts, and runtime behavior. It must not trust claims without command output.
8. `design_screenshot_reviewer` compares screenshots when available: `reference.png`, `local_before.png`, and `local_after.png`. It focuses on layout, spacing, grid, colors, menus, progress bars, code blocks, quiz blocks, border radius, and shadows. It must not accept screenshot-as-content as implementation.
9. `curriculum_reviewer` checks topic order, explanation depth, content bloat, Stepik-reference use, quizzes, coding tasks, sample/hidden tests, projects, and junior ML engineer readiness.
10. If the human explicitly asked for GitHub delivery, the final verifier creates a new branch, commits only task-scoped files, pushes to `origin`, and creates a draft PR when feasible. Human final approval means reviewing/merging that branch or PR; agents must not merge it.

Reviewer behavior:
- Reviewers must look for real issues, not rubber-stamp.
- Reviewers must not call `workboard_claim` on their own dispatched card. Use the supplied Worker protocol token to complete or block the card.
- If no issue is found, state the exact evidence checked.
- Report findings with file paths, command output, screenshot names, or concrete user-visible behavior.
- If `.agents/implementation_snapshot.md` is stale or missing task-relevant implementation facts, block and request planner refresh before approving.
- If `planner` edited or staged anything except `.agents/implementation_snapshot.md` and `.agents/stepik_reference_notes.md`, block the plan and require the work to be routed through downstream role cards.

Coder chunking rule:
- One task should be limited to a scaffold, design slice, one module, one subblock, or one cell group.
- Do not ask `coder` to edit broad curriculum content in a single pass.
- After each chunk, route through code review, runtime testing, screenshot/design review when UI changed, and curriculum review when lesson content changed.
