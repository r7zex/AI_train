import { spawn } from "node:child_process";
import { Type } from "typebox";
import { defineToolPlugin } from "openclaw/plugin-sdk/tool-plugin";

const WORKSPACE_PATH = "C:/Users/User/PycharmProjects/AI_learn/AI_train";
const BOARD_ID = "default";
const CARD_PREFIX = "[AI_train]";
const OPENCLAW_CLI =
  process.env.OPENCLAW_CLI_PATH ??
  "C:/nvm4w/nodejs/node_modules/openclaw/openclaw.mjs";

const ROLE_AGENTS = [
  "planner",
  "plan_reviewer_1",
  "plan_reviewer_2",
  "plan_fixer",
  "coder",
  "code_reviewer_and_fixer",
  "runtime_tester",
  "design_screenshot_reviewer",
  "curriculum_reviewer",
] as const;

type JsonRecord = Record<string, unknown>;

const DISPATCH_CLAIM_RULE =
  "This Workboard worker card is already claimed by the dispatcher. Do not call workboard_claim on your current card. Use the Card id, Claim ownerId, and Claim token from the Worker protocol for workboard_heartbeat, workboard_complete, and workboard_block.";

type GatewayCallResult = {
  status: number | null;
  stdout: string;
  stderr: string;
};

function cleanTitle(task: string): string {
  const firstLine = task.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  const title = firstLine || "AI_train dashboard task";
  return title.length > 90 ? `${title.slice(0, 87)}...` : title;
}

function plannerReminder(task: string): string {
  return [
    `User task:`,
    task.trim(),
    "",
    "Role: planner.",
    "",
    "Read AGENTS.md, .agents/openclaw_ai_train_workflow.md, .agents/project_vision.md, .agents/stepik_reference_protocol.md, .agents/curriculum_quality_rubric.md, and .agents/planner_task_protocol.md before acting.",
    "This /skill ai-train-start launch authorizes local repository inspection and task-scoped local file edits inside the AI_train workspace by downstream pipeline roles. Do not require extra permission for ordinary local edits, but keep commit, push, destructive delete, broad rename, external submission, secrets, payment/account actions, CAPTCHA/security bypass, security setting changes, and software installs blocked until the human explicitly asks in the current task. If the human explicitly asks for GitHub delivery, include a final step that creates a new branch, commits only task-scoped files after verification, pushes to origin, and creates a draft PR when feasible. Never merge to main.",
    "Planner write boundary: during planning, you may edit only .agents/implementation_snapshot.md and, for Stepik-like tasks, .agents/stepik_reference_notes.md. Do not edit or stage application files, operator guides, workflow/protocol files, plugin code, package files, tests, task files, or documentation output. Put those changes into the downstream plan instead.",
    "If this is a Stepik-like lesson/course task, run `openclaw browser --json doctor`, confirm `openclaw browser status` says `headless: true (config)`, then run `powershell -NoProfile -ExecutionPolicy Bypass -File .agents\\scripts\\browser_headless_stepik_probe.ps1`. Use the OpenClaw browser profile `openclaw` to inspect Stepik and update .agents/stepik_reference_notes.md. Include browser action logs and .agents/browser_probe artifact paths in the card. If Stepik is not logged in, navigate to https://stepik.org/catalog?auth=login, block the card, and ask the human to log in manually. Use Stepik as UX/pedagogy reference only; do not copy content or submit/modify anything. Do not use invalid CLI syntax like `openclaw browser action=\"tabs\"`.",
    "Refresh .agents/implementation_snapshot.md from the current GitHub/local implementation before writing the plan.",
    "Use the Windows OpenClaw gateway and the AI_train workspace.",
    "Create a scoped plan only. Do not edit task-output files and do not stage changes.",
    DISPATCH_CLAIM_RULE,
    "When the plan is done, complete this card with the plan summary and dispatch the default Workboard so dependent review cards can start.",
  ].join("\n");
}

function roleReminder(role: string): string {
  const common = [
    `Role: ${role}.`,
    "",
    "Do not reinterpret the original human request from memory. Review the planner output from the linked parent Workboard card.",
    "Read AGENTS.md, .agents/openclaw_ai_train_workflow.md, .agents/project_vision.md, .agents/implementation_snapshot.md, .agents/stepik_reference_notes.md, .agents/curriculum_quality_rubric.md, and the role-specific protocol files.",
    "For Stepik-like work, verify that planner either refreshed .agents/stepik_reference_notes.md or clearly blocked because Stepik could not be inspected.",
    "If the implementation snapshot is stale, incomplete, or inconsistent with the repo, block this card and ask planner to refresh it.",
    "A card created by /skill ai-train-start already authorizes local reads and scoped local file edits in the AI_train workspace for this approved task. Do not ask before each ordinary local edit.",
    "Keep changes narrow. Do not commit, push, delete files, submit external forms, enter secrets, or install software unless the human explicitly asks in the current task. If GitHub delivery is explicitly requested, do it only after verification, on a new branch, with task-scoped files only, and never merge to main.",
    DISPATCH_CLAIM_RULE,
    "When this Workboard card is done, call workboard_complete or workboard_block with concrete evidence. Then call workboard_dispatch for the default Workboard so dependent cards can advance.",
  ];

  if (role === "coder") {
    return [
      ...common,
      "",
      "Before editing, read .agents/glm_task_contract.md. Implement only the concrete task emitted by plan_fixer. Do not broaden scope.",
      "For curriculum coding tasks, include clear input/output, TODO placeholders, sample tests, hidden tests, fair edge cases, and reference solution when the approved task requires them.",
    ].join("\n");
  }

  if (role === "code_reviewer_and_fixer") {
    return [
      ...common,
      "",
      "Before reviewing, read .agents/reviewer_protocol.md and report concrete findings with file paths, command output, screenshots, or user-visible behavior.",
      "You may apply narrow fixes that directly address review findings inside the approved task scope. Report the exact files changed and verification command output.",
    ].join("\n");
  }

  if (role.includes("reviewer") || role.includes("tester")) {
    return [
      ...common,
      "",
      "Before reviewing, read .agents/reviewer_protocol.md and report concrete findings with file paths, command output, screenshots, or user-visible behavior.",
    ].join("\n");
  }

  return common.join("\n");
}

function genericRoleTitle(label: string): string {
  return `${CARD_PREFIX} ${label}`;
}

function plannerTitle(task: string): string {
  return `${CARD_PREFIX} Plan: ${cleanTitle(task)}`;
}

function labelsFor(role: string): string[] {
  return [
    "ai-train",
    "dashboard-pipeline",
    role,
  ];
}

function roleCards(task: string, rootId: string): JsonRecord[] {
  const shared = {
    boardId: BOARD_ID,
    tenant: "ai-train",
    labels: ["ai-train", "dashboard-pipeline"],
    workspace: { kind: "dir", path: WORKSPACE_PATH },
    maxRuntimeSeconds: 7200,
    maxRetries: 0,
  };

  const reviewer1 = {
    ...shared,
    title: genericRoleTitle("Plan review 1"),
    notes: roleReminder("plan_reviewer_1"),
    status: "todo",
    priority: "high",
    agentId: "plan_reviewer_1",
    labels: labelsFor("plan_reviewer_1"),
    parents: [rootId],
  };
  const reviewer2 = {
    ...shared,
    title: genericRoleTitle("Plan review 2"),
    notes: roleReminder("plan_reviewer_2"),
    status: "todo",
    priority: "high",
    agentId: "plan_reviewer_2",
    labels: labelsFor("plan_reviewer_2"),
    parents: [rootId],
  };

  return [
    reviewer1,
    reviewer2,
    {
      ...shared,
      title: genericRoleTitle("Fix reviewed plan"),
      notes: roleReminder("plan_fixer"),
      status: "todo",
      priority: "high",
      agentId: "plan_fixer",
      labels: labelsFor("plan_fixer"),
      parents: ["__PLAN_REVIEWER_1__", "__PLAN_REVIEWER_2__"],
    },
    {
      ...shared,
      title: genericRoleTitle("Implement GLM chunk"),
      notes: roleReminder("coder"),
      status: "todo",
      priority: "high",
      agentId: "coder",
      labels: labelsFor("coder"),
      parents: ["__PLAN_FIXER__"],
    },
    {
      ...shared,
      title: genericRoleTitle("Review and fix code"),
      notes: roleReminder("code_reviewer_and_fixer"),
      status: "todo",
      priority: "high",
      agentId: "code_reviewer_and_fixer",
      labels: labelsFor("code_reviewer_and_fixer"),
      parents: ["__CODER__"],
    },
    {
      ...shared,
      title: genericRoleTitle("Runtime verify"),
      notes: roleReminder("runtime_tester"),
      status: "todo",
      priority: "high",
      agentId: "runtime_tester",
      labels: labelsFor("runtime_tester"),
      parents: ["__CODE_REVIEWER__"],
    },
    {
      ...shared,
      title: genericRoleTitle("Design screenshot review"),
      notes: roleReminder("design_screenshot_reviewer"),
      status: "todo",
      priority: "normal",
      agentId: "design_screenshot_reviewer",
      labels: labelsFor("design_screenshot_reviewer"),
      parents: ["__CODE_REVIEWER__"],
    },
    {
      ...shared,
      title: genericRoleTitle("Curriculum review"),
      notes: roleReminder("curriculum_reviewer"),
      status: "todo",
      priority: "high",
      agentId: "curriculum_reviewer",
      labels: labelsFor("curriculum_reviewer"),
      parents: ["__CODE_REVIEWER__", "__RUNTIME_TESTER__"],
    },
  ];
}

function parseCommandTask(params: JsonRecord): string {
  const raw = params.task ?? params.command ?? "";
  return typeof raw === "string" ? raw.trim() : "";
}

function parseJsonOutput(stdout: string): unknown {
  const trimmed = stdout.trim();
  if (!trimmed) {
    return {};
  }
  return JSON.parse(trimmed);
}

async function runOpenClaw(args: string[], timeoutMs = 30000): Promise<GatewayCallResult> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [OPENCLAW_CLI, ...args], {
      cwd: WORKSPACE_PATH,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill();
    }, timeoutMs);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({ status, stdout, stderr });
    });
  });
}

async function gatewayCall(method: string, params: JsonRecord, timeoutMs = 30000): Promise<unknown> {
  const result = await runOpenClaw(
    [
      "gateway",
      "call",
      method,
      "--json",
      "--params",
      JSON.stringify(params),
      "--timeout",
      String(timeoutMs),
    ],
    timeoutMs + 5000,
  );

  if (result.status !== 0) {
    return {
      ok: false,
      method,
      status: result.status,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  }

  return parseJsonOutput(result.stdout);
}

async function createCard(params: JsonRecord): Promise<JsonRecord> {
  const created = (await gatewayCall("workboard.cards.create", params, 30000)) as JsonRecord;
  const card = created.card as JsonRecord | undefined;
  if (!card || typeof card.id !== "string") {
    throw new Error(`Could not create Workboard card: ${JSON.stringify(created)}`);
  }
  return card;
}

async function createRoleCards(task: string, rootId: string): Promise<JsonRecord[]> {
  const cards: JsonRecord[] = [];
  const placeholders = new Map<string, string>();

  for (const draft of roleCards(task, rootId)) {
    const parents = Array.isArray(draft.parents)
      ? draft.parents.map((parent) => placeholders.get(String(parent)) ?? parent)
      : undefined;
    const card = await createCard({ ...draft, parents });
    cards.push(card);

    switch (draft.agentId) {
      case "plan_reviewer_1":
        placeholders.set("__PLAN_REVIEWER_1__", String(card.id));
        break;
      case "plan_reviewer_2":
        placeholders.set("__PLAN_REVIEWER_2__", String(card.id));
        break;
      case "plan_fixer":
        placeholders.set("__PLAN_FIXER__", String(card.id));
        break;
      case "coder":
        placeholders.set("__CODER__", String(card.id));
        break;
      case "code_reviewer_and_fixer":
        placeholders.set("__CODE_REVIEWER__", String(card.id));
        break;
      case "runtime_tester":
        placeholders.set("__RUNTIME_TESTER__", String(card.id));
        break;
      default:
        break;
    }
  }

  return cards;
}

async function ensureBoard(): Promise<unknown> {
  return gatewayCall(
    "workboard.boards.upsert",
    {
      id: BOARD_ID,
      name: "Default Workboard",
      description:
        "Visible Dashboard Workboard. AI_train pipeline cards are marked with [AI_train] titles and ai-train labels.",
      icon: "AI",
      color: "green",
      defaultWorkspace: { kind: "dir", path: WORKSPACE_PATH },
      orchestration: {
        autoDecompose: true,
        autoDecomposePerDispatch: 1,
        defaultAssignee: "planner",
        orchestratorProfile: "ai-train-openclaw",
      },
    },
    30000,
  );
}

async function startPipeline(params: JsonRecord): Promise<JsonRecord> {
  const task = parseCommandTask(params);
  if (!task) {
    return {
      ok: false,
      error:
        "Pass the task after the command, for example: /skill ai-train-start Make subblocks 1.1 and 1.2 Stepik-like using the logged-in OpenClaw Stepik browser profile as reference, with tests, coding tasks, and no content bloat.",
    };
  }

  const board = await ensureBoard();
  const root = await createCard({
    title: plannerTitle(task),
    notes: plannerReminder(task),
    status: "ready",
    priority: "urgent",
    labels: labelsFor("planner"),
    agentId: "planner",
    boardId: BOARD_ID,
    tenant: "ai-train",
    workspace: { kind: "dir", path: WORKSPACE_PATH },
    maxRuntimeSeconds: 7200,
    maxRetries: 0,
  });
  const children = await createRoleCards(task, String(root.id));
  const dispatch = await gatewayCall("workboard.cards.dispatch", { boardId: BOARD_ID }, 45000);

  return {
    ok: true,
    board,
    rootCard: { id: root.id, title: root.title, agentId: root.agentId },
    childCards: children.map((card) => ({
      id: card.id,
      title: card.title,
      agentId: card.agentId,
      status: card.status,
    })),
    dispatch,
    next:
      "Open Dashboard > Workboard and search for [AI_train] cards to watch linked sessions. Use the live card Stop control or /skill ai-train-stop-all to stop active AI_train tasks.",
  };
}

function isAiTrainTask(task: JsonRecord): boolean {
  const text = [
    task.title,
    task.summary,
    task.sessionKey,
    task.childSessionKey,
    task.ownerKey,
    task.agentId,
  ]
    .filter((value) => typeof value === "string")
    .join("\n")
    .toLowerCase();

  return (
    text.includes("ai_train") ||
    text.includes("ai-train") ||
    text.includes("workboard") ||
    ROLE_AGENTS.some((agentId) => text.includes(`agent:${agentId}`) || text.includes(agentId))
  );
}

async function stopAll(): Promise<JsonRecord> {
  const listed = (await gatewayCall("tasks.list", {}, 30000)) as JsonRecord;
  const tasks = Array.isArray(listed.tasks) ? (listed.tasks as JsonRecord[]) : [];
  const active = tasks.filter((task) => {
    const status = String(task.status ?? "");
    return ["queued", "running"].includes(status) && isAiTrainTask(task);
  });

  const cancelled = [];
  for (const task of active) {
    const taskId = String(task.taskId ?? task.id ?? "");
    if (!taskId) {
      continue;
    }
    cancelled.push({
      taskId,
      result: await gatewayCall("tasks.cancel", { taskId }, 30000),
    });
  }

  return {
    ok: true,
    matchedActiveTasks: active.length,
    cancelled,
    note:
      "This cancels active Gateway-tracked AI_train tasks. If a foreground chat is still generating, press Stop in that Dashboard session or send /stop there.",
  };
}

export default defineToolPlugin({
  id: "ai-train-dashboard-control",
  name: "AI_train Dashboard Control",
  description: "Start and stop AI_train Workboard pipeline tasks from Windows Hub/Dashboard.",
  tools: (tool) => [
    tool({
      name: "ai_train_start_pipeline",
      label: "AI_train Start Pipeline",
      description:
        "Create AI_train Workboard pipeline cards from a dashboard command and dispatch the planner.",
      parameters: Type.Object(
        {
          command: Type.Optional(Type.String({ description: "Raw task text from slash command." })),
          commandName: Type.Optional(Type.String({ description: "Calling slash command." })),
          skillName: Type.Optional(Type.String({ description: "Calling skill name." })),
          task: Type.Optional(Type.String({ description: "Task text when called directly." })),
        },
        { additionalProperties: false },
      ),
      execute: startPipeline,
    }),
    tool({
      name: "ai_train_stop_all",
      label: "AI_train Stop All",
      description: "Cancel active Gateway-tracked AI_train tasks.",
      parameters: Type.Object(
        {
          command: Type.Optional(Type.String({ description: "Unused raw command text." })),
          commandName: Type.Optional(Type.String({ description: "Calling slash command." })),
          skillName: Type.Optional(Type.String({ description: "Calling skill name." })),
        },
        { additionalProperties: false },
      ),
      execute: stopAll,
    }),
  ],
});
