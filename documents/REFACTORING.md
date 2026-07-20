# Refactoring Report: From Monolith to Modular

## The Original Problem (Legacy Code)
In the initial version (`legacy.c`), the entire logic was contained within a single `main()` function.
*   **Issue 1:** "Magic Numbers" were hardcoded (e.g., `100` for pulse).
*   **Issue 2:** Logic was coupled with I/O (printing and analyzing happened in the same loop).
*   **Issue 3:** Untestable. It was impossible to run unit tests on the heart rate logic without running the whole simulation.

## The Refactoring Process
I decomposed the system into a modular architecture:
1.  **Data Structure:** Created `struct Vitals` in `vitals.h` to encapsulate patient data.
2.  **Separation of Concerns:** Moved the analysis logic to `analyze_vitals()` in `vitals.c`.
3.  **Callback Pattern:** Implemented a function pointer (`alert_plugin`) so the analysis engine doesn't need to know how the alert is displayed (UI-agnostic).

## The Result (Clean Code)
**Before (`legacy.c`):**
```c
if (hr > 100) printf("ALARM!");
After (vitals.c):
#define MAX_PULSE 100
// ...
if (v.heart_rate > MAX_PULSE) alert_plugin("TACHYCARDIA_EVENT");
```
Improvement Impact
Testability: I can now pass "mock" data to analyze_vitals and verify alerts in milliseconds using tests.c.
Extensibility: Adding a new sensor (e.g., blood pressure) only requires updating the struct and one function, not the entire main loop.