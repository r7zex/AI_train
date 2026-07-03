# GLM 5.2 Task Contract

`coder` uses `openrouter/z-ai/glm-5.2`. Give it small, concrete implementation chunks.

## Required Task Shape

Every GLM task must include:

- exact goal;
- exact files allowed to edit;
- files forbidden to edit when relevant;
- current behavior;
- desired behavior;
- visual constraints when UI changes;
- content constraints when lesson text changes;
- Stepik reference observations to reuse, summarized from `.agents/stepik_reference_notes.md`;
- exact quiz/test/coding-task requirements when curriculum changes;
- acceptance criteria;
- verification commands.

## Good UI Task Example

```text
Edit only src/components/CourseSidebar.tsx and related Tailwind classes in existing components.
Make the left menu 280px wide on desktop, collapsible below 768px, and keep active topic visibly highlighted.
Do not change route structure or curriculum data.
Acceptance: no text overlap, active topic obvious, topic titles wrap to two lines max, build passes.
```

## Good Curriculum Task Example

```text
Edit only topicAiMlDlV2 in src/data/curriculum/intro_v2.ts.
Add Stepik-like sequence: orientation, concept, comparison table, concrete examples, misconception quiz, one small stdin/stdout practice task.
Use the Stepik reference notes only for pacing and interaction patterns; do not copy Stepik text or tasks.
For the coding task, include statement, input format, output format, starter code with TODO, at least 2 sample tests if feasible, at least 2 hidden tests if feasible, fair edge cases, and a reference solution.
Explain every placeholder and expected output. Avoid content bloat and useless filler.
Use existing helpers from src/data/curriculum/helpers.ts.
Acceptance: beginner can answer what AI/ML/DL input/output mean; npm.cmd run build passes.
```

## Content Quality Requirements

Lesson text must:

- define terms before using them;
- explain function parameters and returned values;
- show at least one concrete input and output where possible;
- avoid "obviously", "simply", and unexplained jargon;
- avoid content bloat: no paragraphs that only sound encouraging or repeat the same idea without adding a concept, example, warning, decision, or action;
- avoid long paragraphs;
- include checks that reveal misunderstanding.

## Coding Task Requirements

When adding or changing a practice/coding task, the GLM task must say exactly:

- which helper to use, normally `practiceStep` and `makeStdinTask`;
- what `starterCode` should contain;
- what every TODO placeholder means;
- sample test inputs and expected outputs;
- hidden test inputs and expected outputs;
- edge cases and why they are fair;
- reference solution requirements;
- commands to verify TypeScript/build compatibility.

## Hard Limits

- In a task launched through `/skill ai-train-start`, local reads and exact local edits named in the approved GLM task are already authorized. Do not pause to ask before ordinary scoped edits.
- Do not perform broad refactors.
- Do not rename public files or routes unless explicitly required.
- Do not edit generated files or lockfiles unless the task requires it.
- Do not change configs or CI for a lesson/UI task.
- Do not commit or push unless the human explicitly asked for GitHub delivery in the current task and the final reviewed plan assigns that delivery step. If assigned, commit/push only after verification, use a new branch, and never merge to `main`.
