# Sentinel-Core: Project Constitution

## Mission Statement
Sentinel-Core aims to bridge the gap between low-level medical sensor data and high-level healthcare visualization. Our mission is to provide a rock-solid, resource-efficient C core that ensures patient safety through real-time deterministic monitoring, while providing modern interfaces for medical professionals.

## Product Roadmap
*   **Phase 1 (MVP - Completed):** Development of the C-core logic. Implementation of Tachycardia and Hyperglycemia detection algorithms. CLI-based simulation.
*   **Phase 2 (Distributed System - Completed):** Integration of a JSON-based data bridge. Development of the Next.js Dashboard for remote monitoring.
*   **Phase 3 (Scaling - Planned):** Implementation of POSIX Sockets for multi-node support. Adding AI-driven predictive analytics for heart failure prevention.

## Tech Stack Iteration
*   **Core:** C11 (chosen for memory efficiency and speed).
*   **Build:** Makefile / Windows Batch (chosen for reproducibility).
*   **Frontend:** Next.js + Tailwind (vibe-coded for rapid prototyping).
*   **CI/CD:** GitHub Actions (automated QA).

---
*Note: This constitution was developed iteratively using LLM assistance to refine the business goals and technical milestones.*