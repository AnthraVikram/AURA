# Implementation Plan: AURA Foundation

**Branch**: `002-aura-foundation` | **Date**: 2026-10-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-aura-foundation/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Deliver the first working AURA 2.0 application: a dark galaxy-inspired personal command centre whose universal text chat reads and writes the same records as Daily Log, expenses, health, growth, study/screen time, goals/habits, and settings. One Vite + React + TypeScript browser app, rule-based chat, and a versioned local JSON document behind repository ports. No paid AI, no backend, no cloud sync. Tests (Vitest + Testing Library) are written from acceptance scenarios before production code for each behaviour.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20+, compiled for modern browsers (Safari and Chromium)

**Primary Dependencies**: Vite 5, React 18, React Router 6, Vitest, React Testing Library, jsdom. No UI kit, no LLM SDK, no BaaS.

**Storage**: Versioned JSON document in `localStorage` key `aura.v1` (module records and preferences; no chat transcript), accessed only through `Store` / collection repositories. In-memory adapter for tests. See [research.md](./research.md) and [contracts/storage.md](./contracts/storage.md).

**Testing**: Vitest unit + contract + integration tests; React Testing Library for screens. Manual browser verification for visual design, iPad-width layout, and reload persistence ([quickstart.md](./quickstart.md)).

**Target Platform**: Local web app in desktop and tablet browsers (including iPad Safari). Served by Vite in development.

**Project Type**: Single-page web application (no separate API process)

**Performance Goals**: Chat confirmation and module list refresh feel immediate on a personal dataset (thousands of records is more than enough). Decorative motion MUST NOT block input or hide text.

**Constraints**: Offline after first load (no required network except opening curated links). Single user, single browser profile. No secrets in the repo. No fabricated dashboard data. Constitution: spec-first, test-first, explicit interfaces, integration tests for chat–module–storage, justified complexity only.

**Scale/Scope**: One operator; first-release areas in spec user stories 1–11; one repo, one app.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Spec-First | Plan and later tasks trace to `spec.md`; no extra agentic/cloud features | PASS — scope matches spec out-of-scope list |
| II. Explicit, Observable Interfaces | Named contracts for storage, chat parse/handle, and module services; success and failure defined | PASS — [contracts/](./contracts/) |
| III. Test-First | Each behaviour: tests from scenarios → fail → implement | PASS — mandated in this plan and [quickstart.md](./quickstart.md) |
| IV. Integration Verification | Chat to module to store; schema; totals vs lists | PASS — integration + JSON schema tests planned |
| V. Simplicity | One SPA, JSON document, rule-based chat, no kit/LLM/backend | PASS — trade-offs in [research.md](./research.md) |
| Secrets | No API keys required | PASS |
| Stack named | Constitution `TODO(TECHNOLOGY_STACK)` is named **for this feature** in Technical Context (constitution file itself is not amended here) | PASS for planning |
| Safety | No offensive security, no unauthorised access features | PASS |
| Scope | Light/Vacation, notifications, cloud, statement OCR, Strava excluded | PASS |

**Gate result (pre-research)**: PASS. No unjustified violations.

### Constitution Check (post-Phase 1)

Design artifacts keep a single app, a storage port instead of a second database product, and chat as a pure interpreter plus orchestrator. The repository-port layer is the only extra seam; it is required by FR-053 and tested with two adapters. Still PASS. Complexity table unused.

## Project Structure

### Documentation (this feature)

```text
specs/002-aura-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── storage.md
│   ├── storage.schema.json
│   ├── chat.md
│   └── module-services.md
└── tasks.md                 # created later by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── main.tsx
├── app/                     # shell, router, sidebar, compact overview, quick actions
├── styles/                  # galaxy theme (CSS custom properties)
├── chat/                    # parseChat, handleChat, catalogue
├── domain/                  # validation, category maps, totals, observations
├── modules/
│   ├── daily-log/
│   ├── expenses/
│   ├── health/
│   ├── growth/
│   ├── study/
│   ├── goals/
│   └── settings/
├── storage/                 # Store port, MemoryStore, LocalDocumentStore
└── data/                    # curated learning-resources JSON

tests/
├── contract/                # storage.schema.json samples
├── integration/             # chat → services → store
└── unit/                    # parser, validation, totals, categorisation

public/
index.html
package.json
vite.config.ts
vitest.config.ts
tsconfig.json
```

**Structure Decision**: One Vite app at the repository root. `chat/`, `modules/`, `domain/`, and `storage/` are directories inside that app, not separate packages. UI in `app/` and `modules/*/ui` (or colocated screens) may import services, never adapters.

## Complexity Tracking

> No constitution violations. Table not used.

## Phase 0: Research

Completed: [research.md](./research.md). Stack, storage, chat, styling, routing, and test runner decided. Spec open questions remain future work and are not implementation blockers.

## Phase 1: Design

Completed:

- [data-model.md](./data-model.md)
- [contracts/storage.md](./contracts/storage.md), [contracts/storage.schema.json](./contracts/storage.schema.json)
- [contracts/chat.md](./contracts/chat.md)
- [contracts/module-services.md](./contracts/module-services.md)
- [quickstart.md](./quickstart.md)

## Implementation approach (for /speckit-tasks)

Do not write application code in this planning stage. When implementation starts, work in this order so each slice is testable:

1. Tooling + empty shell theme + honest empty states (story 1)
2. Store port + local adapter + restart behaviour (story 2)
3. Expense domain + service + screen, then chat expense intents (stories 3 and 5)
4. Daily Log service + screen + chat create/list/status (story 4, part of 6)
5. Remaining chat catalogue: totals, summary, unsupported (story 6)
6. Health (story 7)
7. Growth catalogue with verified URLs (story 8)
8. Study and screen time (story 9)
9. Goals, habits, observations (story 10)
10. Settings (story 11)
11. Tablet layout pass and quickstart manual list

For every slice: write failing tests from the spec/contracts first.

## Clarifications

**Blocking**: none.

**Non-blocking (already in spec)**: reminder channel/timing; Light Mode; Vacation Mode; future cloud identity/conflicts; auto-split notes.
