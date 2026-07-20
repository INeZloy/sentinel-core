# VALIDATION — Requirements Validation (Sentinel Core)

How each requirement in `SPEC.md` is verified, and by what evidence.

| Requirement | Acceptance Criteria | Verified by |
|---|---|---|
| FR-2 (tachycardia) | Given `heart_rate = 150`, alert handler is called exactly once with reason `TACHYCARDIA_EVENT` | `tests.c :: test_tachycardia_triggers_alert` |
| FR-4 (hyperglycemia) | Given `sugar_level = 200.0`, alert handler is called exactly once with reason `HYPERGLYCEMIA_WARNING` | `tests.c :: test_hyperglycemia_triggers_alert` |
| FR-2/FR-4 negative case | Given normal vitals (`HR=75`, `sugar=90`), alert handler is **not** called | `tests.c :: test_normal_vitals_no_alert` |
| FR-5 (dual alert) | Given both thresholds breached simultaneously, alert handler is called exactly twice | `tests.c :: test_both_thresholds_trigger_two_alerts` |
| FR-6 (JSON export) | `export_to_json` writes `heart_rate`, `sugar`, `timestamp` fields | Manual inspection of `dashboard/public/data.json` after a run; formal unit test pending (tracked as follow-up) |
| FR-8 (pluggable alert) | `analyze_vitals` accepts any `void(*)(const char*)` — proven by swapping `emergency_handler` for `mock_alert_plugin` in tests without touching `analyze_vitals` | `tests.c` (all tests use the mock, not the production handler) |
| NFR-2 (graceful degradation on I/O failure) | Forcing `fopen()` to fail must not crash the process | `tests.c :: test_export_json_handles_fopen_failure` (via `--wrap=fopen`) |
| NFR-3 (portability) | Project builds on Linux via CI and on Windows via `build.bat` | CI job (`main.yml`) green + documented manual Windows build in `METRICS.md` |
| NFR-4 (CC < 5) | Every function in `core/` measured | `METRICS.md` §2 — all functions between CC 1–3 |
| NFR-5 (testability) | Core logic testable without hardware/network | Demonstrated directly: all 5 unit tests run with zero I/O or hardware dependency |

## Validation Method

1. **Automated:** the CMocka test suite (`tests.c`) is run in CI on every
   push (see `.github/workflows/main.yml`), covering FR-2, FR-4, FR-5, FR-8,
   NFR-2, NFR-5.
2. **Static:** lint + Cyclomatic Complexity checks (`METRICS.md`) validate
   NFR-4 automatically on every push.
3. **Manual:** FR-6 (JSON shape) and NFR-3 (Windows build) are currently
   validated manually; both are flagged as follow-up work to automate
   (JSON schema test; Windows CI runner).

## Open Gaps (tracked, not hidden)

- No automated test yet for the JSON export *content* (only that it doesn't crash on failure) — next iteration should assert on the written file's contents.
- FR-3 (bradycardia, `heart_rate < 60`) is specified but **not implemented** in `analyze_vitals` yet — current code only checks the upper bound. This is a known gap between SPEC and implementation, documented here rather than silently ignored.
