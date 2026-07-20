# SPEC — Requirements Specification (Sentinel Core)

## 1. Functional Requirements

| ID | Requirement |
|---|---|
| FR-1 | The system shall continuously read vitals (heart rate, sugar level, GPS position, timestamp) from a bio-sensor source. |
| FR-2 | The system shall flag a **tachycardia event** when `heart_rate > 100`. |
| FR-3 | The system shall flag a **bradycardia event** when `heart_rate < 60`. |
| FR-4 | The system shall flag a **hyperglycemia event** when `sugar_level > 140.0`. |
| FR-5 | On any flagged event, the system shall invoke an alert handler with a machine-readable reason string. |
| FR-6 | The system shall export the latest telemetry (heart rate, sugar, timestamp) as JSON for consumption by the Dashboard. |
| FR-7 | The Dashboard shall display live vitals and the most recent alert(s) to a medical doctor / caregiver. |
| FR-8 | The system shall support pluggable alert handlers (function-pointer based), so the notification mechanism can be swapped (console, SMS, webhook) without changing analysis logic. |

## 2. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 (Performance) | `analyze_vitals` shall complete in O(1) time — fixed, small number of threshold comparisons, suitable for embedded/low-power hardware. |
| NFR-2 (Reliability) | A failure to export telemetry (e.g. disk/file error) shall not crash the monitoring loop — the system must degrade gracefully. |
| NFR-3 (Portability) | Core shall build with a standard C11 compiler (gcc) on both Linux (CI) and Windows (dev), with documented workarounds where platform APIs diverge (see `METRICS.md`). |
| NFR-4 (Maintainability) | Cyclomatic Complexity of any function in `core/` shall stay below 5 (enforced via CI lint step, see `METRICS.md`). |
| NFR-5 (Testability) | Core logic shall be decoupled from I/O (alert dispatch via function pointer) so it can be unit-tested without hardware or network. |

## 3. Use Cases (summary — full diagram in UML §4.B)

- **UC1 — Monitor Heart Rate:** Sensor feeds heart rate continuously; system evaluates against thresholds.
- **UC2 — Monitor Sugar Levels:** Same pattern for glucose.
- **UC4 — Detect Abnormalities:** Aggregation of UC1/UC2 outcomes into a single "is this patient in danger" decision.
- **UC5 — Trigger Emergency Alert:** Fired when UC4 detects an abnormality; notifies the doctor.
- **UC6 — Export Telemetry to JSON:** Makes current state available to the Dashboard.
- **UC7 — View Dashboard:** Doctor-facing consumption of UC6's output.

## 4. Out of Scope (v1)

- Real hardware sensor integration (mocked via `generate_mock_data`).
- Persistent storage / historical trend analysis (only latest reading is exported).
- Authentication/authorization on the Dashboard.
