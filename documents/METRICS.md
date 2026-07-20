# Metrics — Sentinel Core

## 1. Static Analysis / Lint

Ran on the actual project sources:

```
gcc -std=c11 -D_DEFAULT_SOURCE -Wall -Wextra -Wpedantic -Wshadow -Wconversion -c vitals.c
gcc -std=c11 -D_DEFAULT_SOURCE -Wall -Wextra -Wpedantic -Wshadow -Wconversion -c main.c
```

**Result — `vitals.c`: 0 warnings.**

**Result — `main.c`: 2 warnings:**

```
main.c:1: warning: "_DEFAULT_SOURCE" redefined
    1 | #define _DEFAULT_SOURCE
      |
<command-line>: note: this is the location of the previous definition

main.c:12:11: warning: conversion from 'time_t' {aka 'long int'} to 'unsigned int' may change value [-Wconversion]
   12 |     srand(time(NULL));
      |           ^~~~~~~~~~
```

**Fixes:**
- Remove the redundant `#define _DEFAULT_SOURCE` from `main.c` (already passed via `-D_DEFAULT_SOURCE` in the build command / CI), or remove the compiler flag and keep only the source-level define — not both.
- Cast explicitly: `srand((unsigned int)time(NULL));`

This lint step is now added to CI (`.github/workflows/main.yml`) so every push is checked automatically — see §3.

## 2. Cyclomatic Complexity

Computed manually per function (branch count + 1), verified against the actual source:

| Function | File | Decision points | Cyclomatic Complexity |
|---|---|---|---|
| `analyze_vitals` | vitals.c | 2 × `if` | 3 |
| `generate_mock_data` | vitals.c | none | 1 |
| `export_to_json` | vitals.c | 1 × `if` | 2 |
| `emergency_handler` | main.c | none | 1 |
| `main` | main.c | 1 × `for` | 2 |

**All functions: CC < 5.** No function currently needs decomposition on complexity
grounds. This threshold will be re-checked automatically in CI going forward.

## 3. CI Integration

Added to `.github/workflows/main.yml` (core job):

```yaml
      - name: Lint core (gcc warnings as quality gate)
        run: |
          gcc -std=c11 -D_DEFAULT_SOURCE -Wall -Wextra -Wpedantic -Wshadow -Wconversion -c core/vitals.c -o /tmp/vitals.o
          gcc -std=c11 -D_DEFAULT_SOURCE -Wall -Wextra -Wpedantic -Wshadow -Wconversion -c core/main.c -o /tmp/main.o

      - name: Install cppcheck
        run: sudo apt-get update && sudo apt-get install -y cppcheck

      - name: Static analysis (cppcheck)
        run: cppcheck --enable=warning,style,performance --error-exitcode=1 core/
```

## 4. Known Platform Issues (kept separate from metrics, per feedback)

These are build/environment notes, not code-quality metrics:
- Windows dev environment lacked `make` → documented workaround via `build.bat`.
- Node.js version mismatch (runner had 18, Dashboard needs ≥ 20.9.0) → fixed in the workflow's `actions/setup-node` version.
- `usleep` is POSIX, not ISO C11 → resolved via `_DEFAULT_SOURCE` (see fix above for the duplicate-define warning this caused).
