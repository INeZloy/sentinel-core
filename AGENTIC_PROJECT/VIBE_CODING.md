# 14. Vibe Coding / Assisted Coding / Agentic Coding (counts double)

LLM assistance was used throughout this project, per point rather than as
one giant undifferentiated prompt. Below: where, how, and what prompt(s)
drove each numbered requirement — plus what was reviewed/adjusted by hand
rather than accepted as-is.

| # | Requirement | AI involvement | Representative prompt |
|---|---|---|---|
| 1 | Git | AI proposed the branch/merge/conflict workflow and commit message wording | *"give me exact git commands to demonstrate branch + merge + a conflict for a grading screenshot"* |
| 2 | Requirements | AI drafted SPEC.md/VALIDATION.md structure from the assignment text | *"turn this feedback + assignment text into a proper [SPEC] and [VALIDATION] doc pair"* |
| 3 | Analysis | AI generated the analysis-market prompt template (part B), left content to be filled in by hand | *(see AI market-analysis prompt in `documents/AI_Market_Analysis.md`)* |
| 4 | UML | Not covered in this session — pre-existing diagrams reused | — |
| 5 | DDD | AI derived Core Domain Chart / Bounded Context / Event Storming diagrams as mermaid from the described system | *"turn this system description into an Event Storming diagram, Core Domain Chart, and Bounded Context map, mermaid format"* |
| 6 | Clean Code Dev | AI found and explained 4 before/after examples directly in the actual source (magic strings, missing branch, error handling, implicit conversion) | *"give me clean-code before/after examples using only the real bugs/smells in this code, not invented ones"* |
| 7 | Refactoring | Reused/extended from CCD examples; kept to real code smells found by lint, not synthetic ones | — |
| 8 | Build | Not covered in this session | — |
| 9 | CI/CD | AI wrote the GitHub Actions snippet to add lint + CMocka test execution to the pipeline | *"add a CI step that installs libcmocka-dev and runs the test binary"* |
| 10 | Unit Tests | AI rewrote `tests.c` from a single `assert()` into a real CMocka suite with a mock alert plugin and an error-path test via `--wrap=fopen` | *"rewrite this test file using a real C testing framework, with an actual mock (not just a counter) and a test for a failure/exception path"* |
| 11 | Metrics | AI ran real `gcc -Wall -Wextra -Wpedantic -Wconversion -Wshadow` on the actual source and manually computed Cyclomatic Complexity per function from the real code | *"run a real lint pass on this exact code and compute cyclomatic complexity by hand per function, don't invent numbers"* |
| 12 | Architecture | AI wrote `ARCHITECTURE.md` (Architecture Canvas) from the described component split (Core / Dashboard / Dispatcher) | *"write an architecture canvas doc for this system: components, data flow, bounded contexts, deployment view"* |
| 13 | Functional Programming | AI wrote `functional-demo.js`, chosen deliberately in JS (not C) since the language natively supports closures/HOF/immutability enforcement | *"write a small standalone JS module proving: immutable data, pure functions, HOF, functions returned from functions, and closures — with real runnable output"* |

## What was NOT just accepted as-is

- The C fixes to `vitals.c`/`main.c` (wiring up `export_to_json`, the
  `getenv`-based path, the bradycardia gap) were compiled and run locally
  (`gcc -Wall -Wextra -Wpedantic`) before being accepted — not merged
  blind.
- The CMocka test file (`tests.c`) could **not** be compiled in this
  environment (no network to install `libcmocka-dev`) — it is based on
  correct, standard CMocka API usage, but must be verified once in real
  CI before being trusted as "passing."
- Numeric values in `METRICS.md` (lint output, Cyclomatic Complexity) are
  taken directly from a real compiler run against the real source, not
  generated/estimated by the AI.

## Tooling used

- Claude (Anthropic) — primary assistant for this documentation pass,
  code fixes, and the messenger pet project (`server.js`, `client/index.html`,
  `functional-demo.js`).
- (Optional, per your own workflow) Cursor / Bolt.new — mention here if
  you additionally used them for the messenger UI, with a screenshot as
  evidence per the assignment's own suggestion.