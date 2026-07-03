# Curriculum Quality Rubric

Use this rubric for AI_train lesson, quiz, test, and coding-task changes.

## "No Water" Means No Content Bloat

The Russian requirement "bez vody" means no useless or bloated text. In English instructions, call this `no content bloat` or `no useless filler`, not "water".

Remove text when it does not help the learner answer at least one of these:

- What problem does this concept solve?
- What input does it use?
- What output, decision, or artifact does it produce?
- What is the smallest concrete example?
- What mistake should I avoid?
- How do I check that I understood it?
- How does this appear in a real ML/data workflow?

## Lesson Step Quality

Each Stepik-like subblock should normally contain:

1. A short orientation step: what the learner will be able to do.
2. A concept step: definitions before terms are reused.
3. A comparison or decision step: table or checklist when categories are easy to confuse.
4. A concrete example step: realistic input and output.
5. A misconception check: quiz aimed at one common confusion.
6. A coding or decision practice step when the topic can be practiced.
7. A short recap: what changed in the learner's mental model.

Do not force code into purely conceptual material, but prefer at least a small decision/coding task when it can be tested.

## Quiz And Test Quality

Good tests:

- check one intended distinction at a time;
- use plausible wrong answers that reveal misunderstanding;
- include explanation for the correct answer;
- avoid trick wording unless the lesson taught that edge case;
- avoid answers that can be guessed from grammar or length;
- are placed soon after the concept they test.

For AI_train, use existing `quizStep` and `singleQuiz` patterns unless the task explicitly asks for a new quiz type.

## Coding Task Quality

A Stepik-like coding task should include:

- a concrete learner goal;
- input format;
- output format;
- starter code with clear TODO placeholders;
- at least two sample tests when possible;
- at least two hidden tests when possible;
- edge cases that are fair and taught by the lesson;
- a reference solution;
- tips that point to the approach without giving the whole answer;
- expected output formatting rules.

For current AI_train curriculum tasks, prefer existing helpers:

- `practiceStep`
- `makeStdinTask`
- `sampleTests`
- `hiddenTests`
- `starterCode`
- `solution`

## Placeholder And Parameter Rules

When code contains placeholders, explain:

- what value the placeholder receives;
- expected type or shape;
- what the learner should compute;
- what the function or program should print or return;
- one small example of input -> output.

For ML/data lessons, explain shape terms explicitly:

- `n_samples`: number of rows/objects/examples;
- `n_features`: number of columns/features;
- `X`: input features;
- `y`: target/answer when supervised learning is used.

## Reviewer Pass Criteria

Curriculum reviewer should block if:

- Stepik-like work lacks Stepik reference notes or a reason they could not be collected;
- text contains content bloat;
- a beginner needs unstated prior knowledge;
- coding task has no sample/hidden tests when it reasonably can;
- hidden tests check edge cases that were not taught;
- starter code placeholders are unexplained;
- expected output formatting is ambiguous;
- the change edits inactive curriculum files.
