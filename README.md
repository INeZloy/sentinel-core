In the current version (v1.0), the architecture focuses on Edge Computing. Data is processed locally on the node to ensure maximum response speed and privacy (as per the analysis in ANALYSIS.md). The Networking domain is designed as an interface, but in this iteration it is simulated by the logging module. This was done to ensure 100% stability of the analytics core and unit tests before deploying the transport layer.

Documentation of 13 Requirements
1. GIT Basics
Description: I implemented a standard Git workflow using feature branches to maintain the integrity of the main branch.
Evidence: I used git branch to create feature/modular-upgrade. You can see the merge history in the commit log [here (link to your GitHub commits)].
2. GIT Time-Travelling
Experience: During the development, I encountered a critical logic error in my pointer management. Instead of manual fixing, I used git reflog to identify the last stable state and executed git reset --hard [HASH] to revert the entire project. This demonstrated the power of version control as a "safety net" for high-pressure engineering.
Evidence: In image folder.
3. UML Diagrams
Description: I designed three major diagrams to model the system architecture.
Diagrams:
Use-Case: User monitors vitals via the Edge Node. diagram-1 in image folder.
Class Diagram: (Implemented via Mermaid in README)
code
Mermaid
classDiagram
    class Vitals { +int heart_rate, +float sugar_level, +Location pos }
    class Main { +emergency_handler() }
    Vitals --> Main : data flow
Activity Diagram: In image folder diagram-2 - Logic flow from "Read Sensor" to "Threshold Check" to "Alert".
4. REQUIREMENTS
Tool: I used Trello to manage tasks.
AI Usage: I used AI to generate 10 standard medical IoT requirements. (Prompt: "What are the top 10 safety requirements for an embedded pulse monitor?").
5. ANALYSIS (Startup Case)
Idea: "Sentinel-Health" — a robotic AI-integrated companion for dementia patients based on the PARO seal from Futurium.
Full Analysis: See ANALYSIS.md.
AI Usage: LLM helped structure the SWOT analysis and market data for Germany. (Prompt: "Analyze the AAL market in Germany 2025 for an IoT startup").
6. DDD (Domain Driven Design)
Core Domain: VitalsAnalytics (The logic that decides if a patient is in danger).
Supporting Domain: Networking (The POSIX Socket implementation).(WIP)
Generic Domain: Logging (Colorized terminal output).
7. METRICS
Metric 1: Strict Static Analysis. I used the GCC compiler with -Wall -Wextra -Werror flags. This metric ensures "Zero Defects" policy — the project will not compile if there is even a minor style or logic warning. Status: 100% Clean.
Metric 2: Cyclomatic Complexity Reduction. In the initial legacy.c, all logic was in a single main() block. Through refactoring, I decomposed the system into 4 small, atomic functions. This reduced the complexity score per function significantly, making the code easier to maintain and test (as shown in my Unit Tests).
Evidence: In image folder
8. CLEAN CODE DEVELOPMENT (CCD)
Implementation: I avoided "Magic Numbers" by using #define MAX_PULSE 100, used meaningful naming conventions, and kept functions under 20 lines.
Cheat Sheet: See my personal 10-point CCD_CheatSheet.md.
9. REFACTORING
Process: I moved from a monolithic legacy.c (where everything was in main) to a modular structure (vitals.c, vitals.h).
Benefit: This separation allowed me to run unit tests on the logic without starting the full simulation loop.
Evidence: Compare legacy.c and vitals.c.
10. BUILD Management
Tool: Makefile.
Functionality: My Makefile automates compilation with strict flags (-Wall -Wextra -Werror). It supports make all, make test for the QA suite, and make clean.
Evidence: Makefile.
12. UNIT TESTS
Implementation: I wrote a custom test suite in tests.c using the C assert.h library.
Coverage: It verifies the tachycardia detection logic and the hyperglycemic alert triggers.
Evidence: Run make test. Output: 100% STABLE.
13. FUNCTIONAL PROGRAMMING
Concepts applied in C:
Immutability: Used const fields in struct Vitals to prevent side effects.
Higher-Order Functions: The function analyze_vitals accepts a function pointer as a callback for emergency handling, making the logic modular and functional.
Evidence: See analyze_vitals implementation in vitals.c.
