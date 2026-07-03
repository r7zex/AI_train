# AI_train Simple Operator Guide

Use this guide in Windows Hub/Dashboard.

## 0. One-Time Setup

Dashboard URL:

```text
http://127.0.0.1:18789/workboard
```

The Workboard has no separate visible `AI_train` board. AI_train work appears on the normal visible Workboard as cards with:

```text
[AI_train]
```

Before Stepik-like tasks:

1. Start the agent browser:
   ```powershell
   openclaw browser start
   ```
2. Check that it is ready:
   ```powershell
   openclaw browser --json doctor
   ```
3. Confirm it is headless by default:
   ```powershell
   openclaw browser status
   ```
   Expected line:
   ```text
   headless: true (config)
   ```
4. Open Stepik login through the agent browser only if login is needed:
   ```powershell
   openclaw browser navigate https://stepik.org/catalog?auth=login
   ```
5. Log in manually if Stepik asks for login. Normal agent work is headless. If manual login is needed, ask Codex to temporarily start a visible OpenClaw browser for login, then switch it back to headless.
   The normal headless restart command after login is:
   ```powershell
   openclaw browser stop
   openclaw browser start
   ```
6. After login, verify browser access with the probe:
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File .agents\scripts\browser_headless_stepik_probe.ps1
   ```

Agents must not type your password, 2FA code, or recovery code.
Agents use the OpenClaw browser profile named `openclaw`, stored at:

```text
C:\Users\User\.openclaw\browser\openclaw\user-data
```

This is separate from your normal Chrome profile. Logging into Stepik once in this OpenClaw browser profile should persist across restarts.

## 1. Where To Write The Task

Do not write the task on the Workboard itself first.

Use the left sidebar:

```text
CHAT -> Chat
```

In the chat input, paste one command:

```text
/skill ai-train-start <task>
```

Example:

```text
/skill ai-train-start Make subblocks 1.1 and 1.2 Stepik-like using my logged-in Stepik account as reference: add tests and coding tasks with sample/hidden tests, explain input/output and TODO placeholders, remove content bloat.
```

Then send the message.

## 2. What Should Happen

After the command, OpenClaw should create `[AI_train]` cards on Workboard:

1. Planner.
2. Plan reviewers.
3. Plan fixer.
4. GLM coder.
5. Code reviewer.
6. Runtime tester.
7. Design reviewer if UI changed.
8. Curriculum reviewer if lesson content changed.

Only planner receives your raw task. Other agents work from planner output, local notes, and review protocols.

## 3. Where To Watch Progress

Open:

```text
http://127.0.0.1:18789/workboard
```

On the top bar:

1. In `Search cards`, type:
   ```text
   AI_train
   ```
2. Set `Auto-refresh` to `On` if available.
3. Look at these columns:
   - `READY`: waiting to run.
   - `RUNNING`: active work.
   - `BLOCKED`: agent needs human action.
   - done/completed cards may move out of the active columns depending on Workboard state.

Open a card to read:

- what the agent is doing;
- linked session;
- comments/proof;
- blocker reason;
- command output;
- review findings.

If a role card blocks with `card dependencies are not done` after trying `workboard_claim`, that role tried to claim a card that Workboard had already dispatched to it. Retry after the updated AI_train plugin is installed; normal worker cards must use the supplied Worker protocol token instead of self-claiming.

## 4. What To Check In Planner Output

For Stepik-like work, planner must mention:

- Stepik was inspected through the logged-in OpenClaw browser profile `openclaw`, or why it could not be inspected;
- browser ran headless and the planner wrote action logs/artifact paths;
- `.agents/scripts/browser_headless_stepik_probe.ps1` passed, or why it could not run;
- `.agents/stepik_reference_notes.md` was updated;
- `.agents/implementation_snapshot.md` was updated;
- exact files to edit;
- exact tests/coding tasks needed;
- exact GLM task;
- verification commands specified that will be used to validate changes;
- proper workflow handoff steps between agents.
- planner did not edit or stage task-output files. It may only refresh `.agents/implementation_snapshot.md` and, for Stepik-like work, `.agents/stepik_reference_notes.md`.

If planner did not inspect Stepik and did not explain why, treat the plan as bad.

## 5. What To Check In GLM/Coder Output

For lesson/coding-task work, coder output should include:

- changed files;
- quizzes/tests added or changed;
- coding task statement;
- input format;
- output format;
- starter code with TODO placeholders;
- sample tests;
- hidden tests;
- fair edge cases;
- reference solution;
- `npm.cmd run lint` / `npm.cmd run build` result when run.

Verify that the generated code passes all specified verification commands.

## 6. Verification and Quality Assurance Checks

During the workflow, verify these points:

- Each agent completes its defined role before passing to the next
- Verification commands consistently pass (npm run build, npm run lint)
- Stepik reference patterns are appropriately applied without copying content
- Curriculum changes meet quality rubric standards (no content bloat, clear definitions, appropriate examples)
- Files edited are within the agreed scope
- No unauthorized changes to configs, routing, or unrelated modules occurred

## 7. How To Stop Everything

Preferred stop command in Chat:

```text
/skill ai-train-stop-all
```

To stop one live session:

1. Open the running card.
2. Open its linked session.
3. Press `Stop`, or type:
   ```text
   /stop
   ```

If Dashboard is stuck:

```powershell
openclaw gateway stop
openclaw gateway start
```

## 8. After Reboot

1. Open:
   ```text
   http://127.0.0.1:18789/workboard
   ```
2. If it does not open, run:
   ```powershell
   openclaw gateway start
   ```
3. Check skills:
   ```powershell
   openclaw skills list --agent main
   ```
4. You should see:
   ```text
   ai-train-start
   ai-train-stop-all
   ```
5. If the commands are missing, ask Codex to run the OpenClaw plugin install/validate check. The installed plugin is the part that makes `/skill ai-train-start` and `/skill ai-train-stop-all` available in Chat.

## 9. Manual Fallback

Use this only if `/skill ai-train-start ...` does not create cards.

1. Open Workboard.
2. Click `+ New card`.
3. Title:
   ```text
   [AI_train] Plan: <short task name>
   ```
4. Status: `ready`.
5. Agent: `planner`.
6. Notes:
   ```text
   Read AGENTS.md and .agents/openclaw_ai_train_workflow.md.
   Read .agents/project_vision.md, .agents/planner_task_protocol.md, .agents/stepik_reference_protocol.md, and .agents/curriculum_quality_rubric.md.
   User task:
   <paste task here>
   If Stepik-like, inspect Stepik through the logged-in OpenClaw browser profile `openclaw` and update .agents/stepik_reference_notes.md.
   Refresh .agents/implementation_snapshot.md.
   Create a scoped plan only. Do not write code.
   ```
7. Click `Dispatch ready work`.
