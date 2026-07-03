# AI_train Project Vision

This file is the stable product intent for AI_train agents.

## Product Goal

AI_train is an interactive Russian-language learning app for a beginner who wants to grow into a junior ML/AI engineer. The app should feel closer to a practical Stepik course than to a glossary or blog: short sequenced steps, concrete examples, quick checks, practice tasks, clear feedback, and visible progress.

The core promise is: a learner with no assumed ML background can move from basic AI/ML concepts to practical Python, NumPy, pandas, model workflow, evaluation, and small ML projects without memorizing disconnected definitions.

## Stepik Reference Target

When the human asks for a Stepik-like result, agents should use the human's logged-in Stepik account as a live UX and pedagogy reference through the OpenClaw browser profile `openclaw`. Stepik is a reference for structure, pacing, tests, coding tasks, feedback, navigation, and progress behavior.

Do not copy Stepik course text, tasks, datasets, solutions, screenshots, or private/proprietary material into AI_train. Extract patterns and rewrite everything for AI_train's own curriculum.

Use `.agents/stepik_reference_protocol.md` and maintain `.agents/stepik_reference_notes.md` before planning Stepik-like lesson changes.

## Target Learner

- Russian-speaking beginner.
- May know basic programming, but should not need prior ML terminology.
- Needs explanations that define inputs, outputs, parameters, and why each operation matters.
- Benefits from concrete examples, edge cases, and small decisions rather than abstract theory.

## Learning Design

Every lesson block should answer:

- What problem does this concept solve?
- What input does it take?
- What output or decision does it produce?
- What can go wrong?
- How does the learner check themselves?
- How would this appear in a real ML/data workflow?

Prefer:

- Short sequential steps with descriptive titles.
- Tables for comparisons.
- Callouts for common mistakes and mental models.
- Quizzes after important distinctions.
- Tests that check one specific concept or misconception.
- Coding tasks with clear input format, output format, sample tests, hidden tests, starter code, and reference solution when the topic can support code.
- Practice tasks with small realistic input/output.
- Code examples with named placeholders and comments only where helpful.

Avoid:

- Content bloat: useless or bloated text that does not teach a concept, example, mistake, decision, input/output contract, or next action.
- Motivational filler and vague "AI is everywhere" prose.
- Terms before definitions.
- Monolithic paragraphs.
- Tasks that require hidden prior knowledge.
- UI decorations that make repeated learning workflows slower.

For detailed checks, use `.agents/curriculum_quality_rubric.md`.

## UI Direction

The app is a learning tool, not a marketing landing page.

- Prioritize readable lesson content, predictable navigation, compact progress, and clear active state.
- Left navigation should be stable, scannable, and not steal content width.
- Buttons and interactions should make the next action obvious.
- Code/practice/quiz areas should be visually distinct and ergonomic.
- Mobile layouts must not overlap text or controls.

## Curriculum Direction

Course order should move from concepts to practice:

1. AI, ML, DL and task types.
2. ML project lifecycle and metrics.
3. Python/numerical foundations with NumPy.
4. Tabular data work with pandas.
5. Core ML foundations: data/target, fit/predict, train/test, baseline, metrics.
6. Classical model families and practical projects.

Each topic should have enough explanation for a beginner to complete the next exercise without guessing.

## Quality Bar

A change is good only if it improves the learner's ability to understand, practice, or navigate.

For content changes, reviewers must check:

- No undefined key terms.
- Examples map directly to the concept.
- Tests and quizzes reveal a specific misunderstanding.
- Coding tasks have clear input/output, sample tests, hidden tests, fair edge cases, and do not rely on hidden knowledge.
- Function placeholders explain what each parameter receives and returns.
- Explanations are technically correct but beginner-readable.

For UI changes, reviewers must check:

- Layout is stable at desktop and mobile widths.
- Text does not overlap or overflow.
- Active topic/step state is visible.
- Navigation and buttons are predictable.
- Styling fits the existing React/Tailwind design.

## Non-goals

- Do not convert the app into a landing page.
- Do not introduce broad new frameworks for narrow changes.
- Do not rewrite curriculum or UI architecture just because a local fix is requested.
- Do not optimize for model cleverness over maintainability.
