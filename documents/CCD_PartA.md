# 6. Clean Code Development — Part A: Before/After in Project Code

## Example 1 — Missing Branch = Incomplete Function (Single Responsibility / Correctness)

**Before** (`vitals.c`, `analyze_vitals`):
```c
void analyze_vitals(Vitals v, void (*alert_plugin)(const char* reason)) {
    if (v.heart_rate > MAX_PULSE) alert_plugin("TACHYCARDIA_EVENT");
    if (v.sugar_level > MAX_SUGAR) alert_plugin("HYPERGLYCEMIA_WARNING");
}
```
`MIN_PULSE` is defined in `vitals.h` but never used — the function's name
promises to "analyze vitals" but silently only covers two of three defined
thresholds. This violates the Clean Code principle that a function should
do what its name says, completely.

**After:**
```c
void analyze_vitals(Vitals v, void (*alert_plugin)(const char* reason)) {
    if (v.heart_rate > MAX_PULSE) alert_plugin("TACHYCARDIA_EVENT");
    if (v.heart_rate < MIN_PULSE) alert_plugin("BRADYCARDIA_EVENT");
    if (v.sugar_level > MAX_SUGAR) alert_plugin("HYPERGLYCEMIA_WARNING");
}
```

## Example 2 — Magic Strings → Named Constants (Avoid Magic Values)

**Before:** alert reasons are raw string literals scattered inline
(`"TACHYCARDIA_EVENT"`, `"HYPERGLYCEMIA_WARNING"`) — a typo in one call
site silently breaks any code matching on these strings, and there's no
single place listing all possible reasons.

**After** (`vitals.h`):
```c
#define REASON_TACHYCARDIA   "TACHYCARDIA_EVENT"
#define REASON_BRADYCARDIA   "BRADYCARDIA_EVENT"
#define REASON_HYPERGLYCEMIA "HYPERGLYCEMIA_WARNING"
```
```c
void analyze_vitals(Vitals v, void (*alert_plugin)(const char* reason)) {
    if (v.heart_rate > MAX_PULSE) alert_plugin(REASON_TACHYCARDIA);
    if (v.heart_rate < MIN_PULSE) alert_plugin(REASON_BRADYCARDIA);
    if (v.sugar_level > MAX_SUGAR) alert_plugin(REASON_HYPERGLYCEMIA);
}
```
Now `vitals.h` is the single source of truth for every possible alert
reason, and tests (`tests.c`) can reference the same constants instead of
re-typing the strings — removing duplication between production and test
code.

## Example 3 — Silent Error Swallowed by `printf` (Error Handling)

**Before** (`vitals.c`, `export_to_json`):
```c
FILE *f = fopen("../dashboard/public/data.json", "w");
if (f == NULL) {
    printf("Error: Could not open file for writing!\n");
    return;
}
```
The function reports the error only to stdout and returns `void` — a
caller has no way to know the export failed, so a broken Dashboard feed
can go unnoticed indefinitely.

**After:**
```c
int export_to_json(Vitals v) {
    FILE *f = fopen("../dashboard/public/data.json", "w");
    if (f == NULL) {
        fprintf(stderr, "export_to_json: failed to open telemetry file\n");
        return -1; /* signal failure to the caller */
    }
    fprintf(f, "{\"heart_rate\": %d, \"sugar\": %.1f, \"timestamp\": %lld}",
            v.heart_rate, v.sugar_level, (long long)v.timestamp);
    fclose(f);
    return 0;
}
```
Errors go to `stderr` (correct stream for diagnostics, keeps stdout clean
for actual program output) and the return code lets `main()` decide how to
react (retry, alert, log) instead of the decision being buried inside
`export_to_json` itself.

## Example 4 — Implicit Narrowing Conversion (Explicitness)

**Before** (`main.c`):
```c
srand(time(NULL));
```
`time()` returns `time_t` (a signed, often 64-bit, type); `srand()` takes
`unsigned int`. The implicit narrowing conversion is exactly the kind of
"invisible" behavior Clean Code asks you to avoid — confirmed by a real
`-Wconversion` warning during this project's lint pass (`METRICS.md`).

**After:**
```c
srand((unsigned int)time(NULL));
```
The cast makes the narrowing an explicit, intentional decision instead of
an implicit one the compiler has to warn about.
