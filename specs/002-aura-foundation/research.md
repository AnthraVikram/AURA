# Research: AURA Foundation

Phase 0 decisions for `002-aura-foundation`. All Technical Context unknowns are resolved here. No paid AI, no cloud, no extra runtimes.

## Decision: Single-page web app (Vite + React 18 + TypeScript)

- **Decision**: Build one browser application with Vite, React 18, and TypeScript. Run locally with the Vite dev server; later it can be copied as static files. Target Chromium and Safari (laptop and iPad).
- **Rationale**: The spec needs a visual command centre, sidebar, chat, and forms on laptop and tablet. A browser app is the smallest way to get that without an app store, Electron, or a backend. TypeScript makes the module and storage contracts explicit (constitution Principle II). Vite keeps the tool chain small for a solo learner of Spec-Driven Development.
- **Alternatives considered**:
  - **Python + templates**: Poor fit for a galaxy-inspired interactive shell and iPad use.
  - **Next.js / full-stack framework**: SSR, routing, and deployment model are unused; they add complexity the spec forbids.
  - **Vue or Svelte**: Equally capable; React plus Testing Library is the most documented path for component tests.
  - **Native iOS/Android**: Excluded by “fresh simple web foundation” and dual laptop/iPad without two codebases.
  - **Electron / Tauri**: Not usable as an iPad app; extra packaging.

## Decision: No separate backend process

- **Decision**: All first-release logic runs in the browser. Chat, modules, and storage are TypeScript libraries inside the same app.
- **Rationale**: The spec is single-user and local. A server would invent accounts, ports, and CORS for no user value.
- **Alternatives considered**:
  - **Local FastAPI/Express**: Two processes, more failure modes, no extra capability this release needs.
  - **BaaS (Firebase, Supabase)**: Cloud and accounts; out of scope.

## Decision: Versioned JSON document behind a repository port

- **Decision**: Persist one versioned JSON document on the device (`localStorage` key `aura.v1`) containing module records and preferences only. Chat transcripts are **not** in the document (session UI state). Application code talks only to small repository interfaces (`list`, `get`, `upsert`, `delete` per collection). Tests use an in-memory adapter. UI never reads the storage key directly.
- **Rationale**: FR-052/FR-053 require restart persistence and a later cloud swap without redesigning screens. One JSON blob is enough for personal-scale data and is trivial to export later as a backup or API payload. The port is the migration seam.
- **Spec requirement this abstraction satisfies**: FR-053 (storage separated from presentation and chat).
- **Simpler alternative rejected**: Components calling `localStorage` directly. That would block a future adapter and make chat/module tests depend on the browser.
- **Heavier alternative rejected**: IndexedDB/Dexie or SQLite WASM. Better for huge datasets; this release does not have them. Extra API surface and Safari quirks are not justified (constitution Principle V).
- **Known limitation (must be visible in Settings)**: Data lives only in this browser profile on this device. Clearing site data deletes records. Another device will not see them.
- **How it will be tested**: Unit tests on the in-memory adapter and JSON serialisation; integration tests that save through a module, reload the adapter, and read the same records.

## Decision: Rule-based chat interpreter + orchestrator

- **Decision**: A pure function parses user text into a typed intent (or `clarify` / `unsupported` / `unknown`). An orchestrator calls the matching module service, then formats a reply. Unknown and unsupported replies include the FR-061 supported-operations list. Expense success replies use settings `currencySymbol`. The transcript stays in memory for the session. No LLM, no network calls for chat.
- **Rationale**: Spec forbids paid AI, persisted chat history is unnecessary for the first-release catalogue (FR-007), and listing supported operations avoids a dead-end reply (FR-061).
- **Alternatives considered**:
  - **Hosted AI API**: Cost, accounts, and non-determinism; excluded.
  - **On-device LLM**: Large, unreliable on iPad Safari, not needed for the catalogue.
  - **Chat UI calling modules with ad-hoc string matching in components**: Violates FR-012 (chat separate from modules).

## Decision: CSS custom properties, no UI kit

- **Decision**: One theme stylesheet (CSS custom properties for galaxy colours, type, spacing) plus component CSS. No Material, Chakra, or Tailwind requirement.
- **Rationale**: The spec asks for a distinctive celestial look. A kit fights that look or adds bundle weight. Custom properties keep contrast and accent colour consistent.
- **Alternatives considered**: Tailwind (faster scaffolding, harder atmospheric control); a component library (generic dashboard look the spec rejects).

## Decision: Client-side routing with a layout shell

- **Decision**: React Router. Persistent shell (sidebar, compact overview, chat column). Area routes swap the main panel. Hash-free browser history is fine while served by Vite. A compact sidebar pattern at tablet width.
- **Rationale**: Matches FR-001/FR-005: chat stays central, areas remain reachable.
- **Alternatives considered**: Multiple HTML pages (loses shared chat state); no router (fails sidebar deep links).

## Decision: Vitest + Testing Library; tests before production code

- **Decision**: Vitest for unit, contract, and integration tests. React Testing Library for screens. jsdom for DOM. In-memory store for logic tests. No Playwright in this release unless a later task finds a gap that jsdom cannot cover (true multi-reload persistence can be checked in the quickstart manually and during implementation browser verification).
- **Rationale**: Constitution Principle III (test-first) and IV (chat–module–storage integration). Playwright is valuable but is a second runner; skip until the first release is otherwise green.
- **Alternatives considered**: Jest (redundant with Vite); Cypress/Playwright as the only tests (slower, weaker for parser/totals).

## Decision: Curated resources as static data

- **Decision**: A checked-in JSON catalogue of real public URLs, labelled curated. Verify each link before merge. YouTube entries use `youtube.com` URLs opened in a new browsing context.
- **Rationale**: FR-037–FR-040. No search API.
- **Alternatives considered**: Fetching YouTube/search at runtime (network + API keys); placeholder fake links (forbidden).

## Decision: Date/time and locale

- **Decision**: Use the device local calendar date for “today” and a rolling 7-day window including today for “this week”. Display currency symbol from settings; do not convert currencies. Weight unit from settings; store the numeric value and the unit used at entry so later unit changes do not silently rewrite history (show stored unit on old rows).
- **Rationale**: Spec assumptions. Converting historical kg↔lb without asking would invent measurements.
- **Alternatives considered**: Always UTC days (wrong for a personal daily log); live FX rates (out of scope).

## Remaining questions that do not block implementation

These stay as later-spec work (already in `spec.md`). This plan does not invent answers.

1. Incomplete-entry reminder schedule and channel.
2. Light Mode behaviour.
3. Vacation Mode behaviour.
4. Cloud identity and conflict rules.
5. Auto-splitting multi-fact notes.

No other stack items remain as `NEEDS CLARIFICATION`.
