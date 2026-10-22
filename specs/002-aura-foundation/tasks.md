---
description: "Task list for AURA Foundation implementation"
---

# Tasks: AURA Foundation

**Input**: Design documents from `/specs/002-aura-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included. Constitution Principle III and the plan require test-first: write the listed tests, confirm they fail, then implement.

**Organization**: Tasks are grouped by user story so each story can be implemented, tested, and demoed independently after Phase 2.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete work)
- **[Story]**: User story label (`US1`–`US11`)
- Exact file paths are in every task description

## Path Conventions

Single Vite app at repository root: `src/`, `tests/` as in plan.md.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the Vite + React + TypeScript workspace with no product behaviour yet

- [X] T001 Create directory tree `src/app`, `src/styles`, `src/chat`, `src/domain`, `src/modules/daily-log`, `src/modules/expenses`, `src/modules/health`, `src/modules/growth`, `src/modules/study`, `src/modules/goals`, `src/modules/settings`, `src/storage`, `src/data`, `tests/contract`, `tests/integration`, `tests/unit`
- [X] T002 Initialize Vite 5 + React 18 + TypeScript app in `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, and `src/main.tsx`
- [X] T003 Configure Vitest, jsdom, and React Testing Library in `vitest.config.ts` and the `test` script in `package.json`
- [X] T004 [P] Add Node/Vite ignores (`node_modules`, `dist`, `.env`) in `.gitignore`
- [X] T005 [P] Add a README setup blurb pointing at `specs/002-aura-foundation/quickstart.md` in `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types, storage port, in-memory adapter, and service result shape. MUST finish before any user story.

**⚠️ CRITICAL**: No user story work until this phase is complete

- [X] T006 Write failing contract tests that a v1 document (`schemaVersion` must be `1`) validates against `specs/002-aura-foundation/contracts/storage.schema.json` in `tests/contract/storageSchema.test.ts`
- [X] T007 [P] Write failing unit tests for `MemoryStore` load/save in `tests/unit/memoryStore.test.ts`
- [X] T008 Define `AppDocument` and entity TypeScript types (`id` UUID string, calendar dates `YYYY-MM-DD`, timestamps ISO-8601; `ChatMessage` is a session type not on `AppDocument`) in `src/domain/types.ts`
- [X] T009 Define `StorageError` and `Store` (`load() -> AppDocument`, `save(AppDocument) -> void`) in `src/storage/types.ts`
- [X] T010 Implement `createEmptyDocument()` with default preferences `displayName` empty, `currencySymbol` `₹`, `weightUnit` `kg`, all persisted collections `[]`, no `chatMessages` field, `schemaVersion` `1` in `src/domain/emptyDocument.ts`
- [X] T011 Implement `MemoryStore` in `src/storage/memoryStore.ts` so T007 passes (T006 is satisfied by T010’s empty document, not by MemoryStore)
- [X] T012 Define `{ ok: true, record } | { ok: false, error: 'validation' | 'not_found' | 'storage', message }` in `src/domain/result.ts`
- [X] T013 Add `renderWithStore` test helper wrapping the in-memory store in `tests/integration/helpers.tsx`

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 - Open a honest personal command centre (Priority: P1) 🎯 MVP

**Goal**: Dark galaxy shell with central chat column, sidebar to every first-release area, compact daily overview, quick actions, and honest empty states (no fabricated stats)

**Independent Test**: Open AURA with no records, walk every sidebar destination, confirm empty overview copy (no fabricated rows), confirm chat is central, check laptop and ~768px tablet width

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T014 [P] [US1] Write failing component tests that the shell shows chat, sidebar links, compact overview empty copy (“nothing recorded for today”), quick actions, and no fabricated statistics in `tests/integration/commandCentre.test.tsx`
- [X] T015 [P] [US1] Write failing tests that empty-area routes render empty states rather than sample personal data in `tests/integration/emptyStates.test.tsx`

### Implementation for User Story 1

- [X] T016 [US1] Add galaxy theme tokens (black/deep-grey surfaces, purple primary, restrained pink/blue highlights, type, spacing) in `src/styles/theme.css`
- [X] T017 [US1] Implement app router and persistent layout (sidebar, chat column, overview, quick actions) in `src/app/App.tsx`, `src/app/Layout.tsx`, and `src/app/routes.tsx`
- [X] T018 [US1] Implement sidebar navigation to Daily Log, Expenses, Health, Growth, Study, Goals, and Settings in `src/app/Sidebar.tsx` (depends on T017)
- [X] T019 [US1] Implement compact daily overview empty state (“nothing recorded for today”) with a real-records region that stays empty when nothing is saved in `src/app/DailyOverview.tsx` (depends on T017)
- [X] T020 [US1] Implement quick actions that navigate to add expense, Daily Log, and workout in `src/app/QuickActions.tsx` (depends on T017)
- [X] T021 [US1] Implement central chat column with in-memory session transcript only (empty input, no fake bubbles, nothing written to `AppDocument`) in `src/chat/ChatPanel.tsx` (depends on T017)
- [X] T022 [US1] Add honest empty placeholder screens in `src/modules/daily-log/DailyLogPage.tsx`, `src/modules/expenses/ExpensesPage.tsx`, `src/modules/health/HealthPage.tsx`, `src/modules/growth/GrowthPage.tsx`, `src/modules/study/StudyPage.tsx`, `src/modules/goals/GoalsPage.tsx`, and `src/modules/settings/SettingsPage.tsx`
- [X] T023 [US1] Add tablet-width sidebar compacting without hiding chat or navigation in `src/styles/layout.css`

**Checkpoint**: User Story 1 is independently demoable

---

## Phase 4: User Story 2 - Keep records after closing AURA (Priority: P1)

**Goal**: Local document persistence in `localStorage` key `aura.v1`; reload restores saved data; no cloud/sync claims

**Independent Test**: Save through a repository, reload the adapter (or the tab), confirm the same records; UI must not claim multi-device sync

### Tests for User Story 2

- [X] T024 [P] [US2] Write failing unit tests that `LocalDocumentStore` round-trips a document and rejects non-`1` `schemaVersion` in `tests/unit/localDocumentStore.test.ts`
- [X] T025 [P] [US2] Write failing integration tests that a write then new store instance looking at the same `localStorage` key `aura.v1` returns the record, overview copy does not claim cloud sync, and chat transcript is not in the persisted document, in `tests/integration/persistence.test.tsx`

### Implementation for User Story 2

- [X] T026 [US2] Implement collection repositories (`list`, `get`, `upsert`, `delete`) on top of `Store` in `src/storage/repositories.ts`
- [X] T027 [US2] Implement `LocalDocumentStore` using `localStorage` key `aura.v1`, atomic write, corrupt/unknown-version `StorageError` in `src/storage/localDocumentStore.ts`
- [X] T028 [US2] Wire the browser app to `LocalDocumentStore` and tests to `MemoryStore` in `src/storage/createStore.ts` and `src/main.tsx`
- [X] T029 [US2] Surface storage load/save failures without reporting success in `src/app/StorageErrorBanner.tsx`
- [X] T030 [US2] Add plain-language local-only persistence note (not synced to other devices) in `src/app/DailyOverview.tsx` and `src/modules/settings/SettingsPage.tsx`

**Checkpoint**: Restart persistence works independently of later modules

---

## Phase 5: User Story 3 - Capture expenses through chat (Priority: P1)

**Goal**: Rule-based chat saves a valid expense immediately, confirms only after success, asks for amount when missing; the expenses area shows the same row

**Independent Test**: Send `Coffee 80` in chat, open Expenses, see Coffee / 80 / Food / today; send `Snacks` and confirm nothing saved

### Tests for User Story 3

- [X] T031 [P] [US3] Write failing parse tests for `Swiggy 200`, `Coffee 80`, `Log ₹200 for Swiggy`, and missing-amount clarify in `tests/unit/parseExpenseChat.test.ts`
- [X] T032 [P] [US3] Write failing validation tests: amount MUST be finite and `> 0`; description trimmed non-empty in `tests/unit/expenseValidation.test.ts`
- [X] T033 [P] [US3] Write failing integration tests: `handleChat` persists expense then confirms using `preferences.currencySymbol`; missing amount does not write; storage error yields `outcome=error` in `tests/integration/chatExpense.test.ts`

### Implementation for User Story 3

- [X] T034 [US3] Implement expense category keyword map (coffee/lunch/dinner/breakfast/swiggy/zomato → `food`; uber/ola/metro/fuel/petrol → `transport`; amazon/groceries → `shopping`; else `other`) in `src/domain/expenseCategories.ts`
- [X] T035 [US3] Implement `ExpenseService.create` (description trimmed non-empty; amount finite `> 0`; category enum `food|transport|shopping|bills|health|education|other`; date default today `YYYY-MM-DD`) in `src/modules/expenses/expenseService.ts`
- [X] T036 [US3] Implement `parseChat` intents `expense.add` and `clarify` in `src/chat/parseChat.ts`
- [X] T037 [US3] Implement `handleChat` (confirm only after save; expense confirm includes `currencySymbol`; never persist transcript; never claim AI reasoning) in `src/chat/handleChat.ts`
- [X] T038 [US3] Connect `ChatPanel` to `handleChat` with success/clarification/error outcomes; expense success text MUST include the configured currency symbol; transcript stays in session memory only in `src/chat/ChatPanel.tsx`
- [X] T039 [US3] List saved expenses (read-only for this story) in `src/modules/expenses/ExpensesPage.tsx`

**Checkpoint**: Chat expense capture works end-to-end

---

## Phase 6: User Story 4 - Keep a Daily Log (Priority: P1)

**Goal**: Create/edit Daily Log entries by date, predictable categories, incomplete vs complete, overdue incomplete visible in overview

**Independent Test**: Create, recategorise, edit, mark incomplete, complete, and open an empty date — all inside Daily Log without chat

### Tests for User Story 4

- [X] T040 [P] [US4] Write failing tests: text trimmed non-empty; category enum `activity|health|plan|learning|other`; status `incomplete|complete`; Plan for today/later defaults `incomplete` otherwise `complete`; keyword hints in `tests/unit/dailyLogRules.test.ts`
- [X] T041 [P] [US4] Write failing page tests for create, edit, category change, incomplete distinction, empty date, and a multi-fact note saved as **one** entry (not split) in `tests/integration/dailyLogPage.test.tsx`

### Implementation for User Story 4

- [X] T042 [US4] Implement Daily Log keyword categorisation and status defaults in `src/domain/dailyLogRules.ts`
- [X] T043 [US4] Implement `DailyLogService` (`create` stores the full note as a single row and MUST NOT split multi-fact text; `update`, `listByDate`, `listIncomplete` with overdue `date < today`, `setStatus`, `delete`; empty text validation; not-found on missing id) in `src/modules/daily-log/dailyLogService.ts`
- [X] T044 [US4] Implement Daily Log UI (minimal create, date view, edit, complete/incomplete styling) in `src/modules/daily-log/DailyLogPage.tsx` and `src/modules/daily-log/DailyLogForm.tsx`
- [X] T045 [US4] Show today’s Daily Log entries plus incomplete today and overdue items in `src/app/DailyOverview.tsx` (no fabricated rows)

**Checkpoint**: Daily Log is usable without chat

---

## Phase 7: User Story 5 - Review and correct expenses (Priority: P1)

**Goal**: Add/edit/delete expenses in the expenses area; daily/weekly/overall totals equal sums of saved amounts; week = last 7 local days including today

**Independent Test**: Add two expenses in the form (not chat), edit one, delete one, check totals match remaining rows

### Tests for User Story 5

- [X] T046 [P] [US5] Write failing totals tests (`today`, `week` last 7 local days including today, `overall`) in `tests/unit/expenseTotals.test.ts`
- [X] T047 [P] [US5] Write failing page tests for create/edit/delete, invalid amount rejected, not-found message, labelled recorded totals in `tests/integration/expensesPage.test.tsx`

### Implementation for User Story 5

- [X] T048 [US5] Implement `ExpenseService.update`, `list`, `totals`, `delete` in `src/modules/expenses/expenseService.ts`
- [X] T049 [US5] Implement expense form and editable list (no budget/prediction copy) in `src/modules/expenses/ExpenseForm.tsx` and `src/modules/expenses/ExpensesPage.tsx`
- [X] T050 [US5] Display daily, weekly, and overall recorded totals in `src/modules/expenses/ExpenseTotals.tsx`

**Checkpoint**: Expenses area is complete without relying on chat

---

## Phase 8: User Story 6 - Ask AURA about the day and saved records (Priority: P2)

**Goal**: Chat Daily Log add/list/status, spending queries matching totals, today summary from real records only, honest unsupported replies, no AI-reasoning claims

**Independent Test**: Chat-create a Daily Log entry; query week spend vs expenses totals; summarise today; ask for a calendar event and get “not available yet” plus the supported-operations list; send unknown text and get “did not understand” plus the same list

### Tests for User Story 6

- [X] T051 [P] [US6] Write failing parse tests for Daily Log add/list/status, spend queries, summarise my day, unsupported calendar/PDF/Strava (not available yet + FR-061 operations list), and unknown text (did not understand + same list) in `tests/unit/parseChatCatalogue.test.ts`
- [X] T052 [P] [US6] Write failing integration tests for log write, totals match `ExpenseService.totals`, empty vs non-empty day summary, unsupported and unknown with no writes and the supported-operations list, in `tests/integration/chatCatalogue.test.ts`

### Implementation for User Story 6

- [X] T053 [US6] Extend `parseChat` with `dailyLog.*`, `expense.totals`, `expense.listRecent`, `summary.today`, `unsupported`, `unknown`; unsupported/unknown `message` MUST include the FR-061 supported-operations list in `src/chat/parseChat.ts`
- [X] T054 [US6] Implement `OverviewService.summariseToday` using only actual records (explicit empty summary when none) in `src/app/overviewService.ts`
- [X] T055 [US6] Route new intents through `handleChat` with clarification when several Daily Log entries match in `src/chat/handleChat.ts`
- [X] T056 [US6] Show a short “AURA follows saved commands; it is not advanced AI reasoning” note in `src/chat/ChatPanel.tsx`

**Checkpoint**: Chat catalogue minus health/study/goals is honest and wired

---

## Phase 9: User Story 7 - Log workouts, cardio, and body weight (Priority: P2)

**Goal**: Gym types Leg Day / Back and Biceps / Chest and Triceps / Shoulders with exercises (name non-empty, sets integer `≥ 1`, repetitions integer `≥ 1`, optional weight finite `≥ 0` with unit snapshot); cardio Running/Skipping with `durationMinutes` finite `> 0`; weight `value` finite `> 0`; review lists; no medical claims

**Independent Test**: Log one gym session, one cardio, one weight from Health; review them; chat “recent workouts” lists those sessions only

### Tests for User Story 7

- [X] T057 [P] [US7] Write failing validation tests for workout types, exercise fields, cardio types `running|skipping`, duration `> 0`, weight `> 0` in `tests/unit/healthValidation.test.ts`
- [X] T058 [P] [US7] Write failing page and chat-list tests (no medical wording; missing record → not-found) in `tests/integration/healthPage.test.tsx`

### Implementation for User Story 7

- [X] T059 [US7] Implement `HealthService` create/list/update/delete for workouts, cardio, and weight (unit snapshot at save) in `src/modules/health/healthService.ts`
- [X] T060 [US7] Implement quick health forms and review lists (historical weight/exercise-weight shown with stored unit; new inputs default to settings `weightUnit`; no conversion of history) in `src/modules/health/HealthPage.tsx`, `src/modules/health/WorkoutForm.tsx`, `src/modules/health/CardioForm.tsx`, and `src/modules/health/WeightForm.tsx`
- [X] T061 [US7] Add chat intents `workout.addGym`, `workout.addCardio`, `workout.listRecent`, `weight.add` (clarify if gym payload incomplete) in `src/chat/parseChat.ts` and `src/chat/handleChat.ts`

**Checkpoint**: Health records exist and are reachable from chat

---

## Phase 10: User Story 8 - Browse curated growth and learning resources (Priority: P3)

**Goal**: Curated catalogue by theme, real https URLs, YouTube opens on YouTube, certificate flag only when true, labelled curated not personalised AI

**Independent Test**: Open Growth, open one YouTube URL and one course URL, confirm labels and no false certificates

### Tests for User Story 8

- [X] T062 [P] [US8] Write failing tests that every catalogue item has `curated: true`, https URL, and `claimsCertificate` only when intended, in `tests/unit/learningResources.test.ts`
- [X] T063 [P] [US8] Write failing page tests for theme grouping and destination labels in `tests/integration/growthPage.test.tsx`

### Implementation for User Story 8

- [X] T064 [US8] Add a verified curated JSON catalogue (themes `confidence_communication`, `discipline_consistency`, `peace_focus`, `habits_character`, `mental_emotional`, `free_learning`) in `src/data/learningResources.json`
- [X] T065 [US8] Implement read-only `GrowthService.listByTheme` in `src/modules/growth/growthService.ts`
- [X] T066 [US8] Implement Growth UI (curated label; YouTube `kind` links to youtube.com/youtu.be; no false certificates) in `src/modules/growth/GrowthPage.tsx`

**Checkpoint**: Growth area is a real catalogue, not a placeholder

---

## Phase 11: User Story 9 - Record study and screen time by hand (Priority: P3)

**Goal**: Manual study and screen-time sessions with `durationMinutes` finite `> 0` and date; summaries labelled manual

**Independent Test**: Save one study and one screen-time session; summaries equal those durations and say manual

### Tests for User Story 9

- [X] T067 [P] [US9] Write failing validation and summary tests (`source: 'manual'`) in `tests/unit/studyValidation.test.ts`
- [X] T068 [P] [US9] Write failing page tests for create/review and no automatic-measurement claims in `tests/integration/studyPage.test.tsx`

### Implementation for User Story 9

- [X] T069 [US9] Implement `StudyService` create/list/summaries/update/delete for study and screen time in `src/modules/study/studyService.ts`
- [X] T070 [US9] Implement Study UI with manual-record labelling in `src/modules/study/StudyPage.tsx`
- [X] T071 [US9] Add chat intent `study.add` (valid duration required) in `src/chat/parseChat.ts` and `src/chat/handleChat.ts`

**Checkpoint**: Study/screen time is manual tracking only

---

## Phase 12: User Story 10 - Goals, habits, and grounded observations (Priority: P3)

**Goal**: Manual goals (`status` `active|completed`); habits with unique completion dates; observations as facts; suggestions optional and never auto-applied; no pattern claim unless ≥ 7 dates with records

**Independent Test**: Add a goal, check a habit today, view observations with empty data and with a few records

### Tests for User Story 10

- [X] T072 [P] [US10] Write failing tests for goal title non-empty, habit completion counts over last 7 days, “not enough information” when fewer than 7 dates, `deleteHabit` success, and `deleteHabit` missing id → `not_found` in `tests/unit/goalsHabitsObservations.test.ts`
- [X] T073 [P] [US10] Write failing page tests that suggestions do not change records until explicit accept, and that deleting a habit removes it, in `tests/integration/goalsPage.test.tsx`

### Implementation for User Story 10

- [X] T074 [US10] Implement `GoalsService` (goals + habits `setHabitDone`, `deleteHabit` success/`not_found`, `acceptSuggestion` only on explicit accept) in `src/modules/goals/goalsService.ts`
- [X] T075 [US10] Implement `observations()` (counts/totals/last dates; never statistically established patterns) in `src/app/overviewService.ts`
- [X] T076 [US10] Implement Goals/Habits UI with observation and suggestion labels in `src/modules/goals/GoalsPage.tsx`

**Checkpoint**: Suggestions stay suggestions

---

## Phase 13: User Story 11 - Adjust minimal personal settings (Priority: P3)

**Goal**: Display name, currency symbol (non-empty, default `₹`), weight unit `kg|lb` (default `kg`); no Light/Vacation Mode controls

**Independent Test**: Change name, currency, unit; greetings and expense amounts (including chat confirmations) follow currency; new weight inputs use the setting; historical weights keep stored units; no mode toggles

### Tests for User Story 11

- [X] T077 [P] [US11] Write failing tests for preference save (`currencySymbol` minLength 1, `weightUnit` `kg|lb`), expense chat confirmation using `currencySymbol`, and historical weight rows keeping stored unit after a settings change in `tests/unit/preferences.test.ts`
- [X] T078 [P] [US11] Write failing settings page tests (no Light/Vacation controls) in `tests/integration/settingsPage.test.tsx`

### Implementation for User Story 11

- [X] T079 [US11] Implement `PreferencesService.get/save` in `src/modules/settings/preferencesService.ts`
- [X] T080 [US11] Implement Settings form; apply currency symbol to expense lists, totals, and chat confirmations; apply weight unit to new inputs only; show historical weights with stored unit in `src/modules/settings/SettingsPage.tsx` and expense/health/chat display helpers
- [X] T081 [US11] Use display name in the command-centre greeting in `src/app/Layout.tsx`

**Checkpoint**: Minimal settings affect real displays

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Shared finish work after the stories above. T088 (failing overview tests) MUST precede T089.

- [X] T082 [P] Add chat intent `goal.add` per chat catalogue in `src/chat/parseChat.ts` and `src/chat/handleChat.ts`
- [X] T083 Reject empty chat sends and keep failed form values visible in `src/chat/ChatPanel.tsx` and shared form components under `src/modules/`
- [X] T084 Ensure delete/edit of missing ids (including habits) returns not-found without success in `src/domain/result.ts` consumers under `src/modules/`
- [X] T085 Verify PG-13 copy and no fabricated dashboard widgets in `src/app/DailyOverview.tsx`
- [X] T088 Write failing tests that `dailyOverview` lists today’s actual Daily Log, expense, health, study, and screen-time records plus incomplete/overdue log items, updates after add/edit/delete, and never fabricates rows in `tests/integration/dailyOverview.test.tsx`
- [X] T089 Implement `OverviewService.dailyOverview` and wire `src/app/DailyOverview.tsx` and `src/app/overviewService.ts` so the compact overview matches T088 (depends on T045, T048, T059, T069)
- [X] T086 Run `npm test` and execute `specs/002-aura-foundation/quickstart.md` browser scenarios including SC-001/002/003/007 timings, tablet width, iPad Safari or documented equivalent, reload (chat empty, records persist)
- [X] T087 [P] Confirm no secrets or paid AI clients in `package.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: None
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1–US11 (Phases 3–13)**: Depend on Foundational; implement in priority order for a solo developer
- **Polish (Phase 14)**: After the stories you intend to ship (all of them for the specified first release). T088 then T089 then T086.

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no other stories
- **US2 (P1)**: After Phase 2 — persistence for later stories; independently testable with repositories
- **US3 (P1)**: After US1 (chat panel) and US2 (store); expenses list can be minimal
- **US4 (P1)**: After US1–US2; does not need chat
- **US5 (P1)**: After US3 expense service/types; independently testable via the expenses form
- **US6 (P2)**: After US3 chat orchestrator, US4 Daily Log, US5 totals; workout queries may be empty until US7
- **US7 (P2)**: After US1–US2; chat wiring extends US6
- **US8 (P3)**: After US1 — catalogue only
- **US9 (P3)**: After US1–US2
- **US10 (P3)**: After US1–US2; observations improve once other modules have data
- **US11 (P3)**: After US1–US2; display wiring touches expenses/health when those exist

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Domain/rules before services
- Services before UI
- Story complete before the next priority unless working in parallel on different files

### Parallel Opportunities

- Phase 1: T004 and T005 in parallel after T002
- Phase 2: T006 and T007 in parallel
- US1 tests T014–T015 in parallel; T018–T021 MUST wait for T017 (not `[P]`)
- US3 tests T031–T033 in parallel
- After Phase 2, US4 and US8 can proceed in parallel with US3 if files stay separate (`daily-log/*` vs `expenses/*` vs `growth/*`)
- US7/US9/US10 modules are file-isolated after US2

---

## Parallel Example: User Story 3

```bash
# Tests first (parallel):
Task: "Failing parse tests in tests/unit/parseExpenseChat.test.ts"
Task: "Failing validation tests in tests/unit/expenseValidation.test.ts"
Task: "Failing handleChat integration in tests/integration/chatExpense.test.ts"

# Then implementation in order: categories → service → parse → handle → UI
```

## Parallel Example: User Story 1

```bash
Task: "Failing command centre tests in tests/integration/commandCentre.test.tsx"
Task: "Failing empty-state tests in tests/integration/emptyStates.test.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup
2. Phase 2 Foundational
3. Phase 3 User Story 1
4. **STOP and VALIDATE** empty command centre (no fake data)

### Incremental Delivery (specified first release)

1. Setup + Foundational
2. US1 shell → US2 persistence → US3 chat expenses → US4 Daily Log → US5 expense review (P1 complete)
3. US6 remaining chat → US7 health (P2)
4. US8 growth → US9 study → US10 goals → US11 settings (P3)
5. Polish + quickstart.md

### Parallel Team Strategy

Solo default: sequential P1 → P2 → P3. If two people: after Phase 2, one takes US3/US5/US6 (chat+expenses), the other US4 then US7 (log+health), then merge US8–US11.

---

## Notes

- [P] = different files, no unfinished dependencies
- [USn] maps to spec user stories 1–11
- Verify tests fail before implementing
- Do not add Light Mode, Vacation Mode, notifications, cloud, or LLM clients
- Suggested first-release MVP for *useful* AURA: US1–US5; spec-complete first release: US1–US11 plus polish (including T088–T089 overview)
- Chat transcript is session-only; do not add `chatMessages` to `aura.v1`
