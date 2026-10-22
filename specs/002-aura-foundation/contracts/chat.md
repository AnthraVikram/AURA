# Contract: Chat interpreter and orchestrator

Chat is a library with a text in / structured out protocol (constitution Principle II). The UI only renders; modules only receive typed commands.

## `parseChat(input: string, context) -> ParseResult`

`context` includes local today, existing Daily Log titles/ids for disambiguation, and preference currency symbol.

`ParseResult`:

| kind | When | Fields |
|------|------|--------|
| `intent` | Catalogue match with required fields | `type`, `payload` |
| `clarify` | Catalogue match missing/ambiguous field | `message`, `partialType` |
| `unsupported` | Known later-release capability | `message` MUST say it is not available yet and MUST list supported operations (FR-061) |
| `unknown` | No catalogue match | `message` MUST say AURA did not understand and MUST list the same supported operations (FR-061) |

Empty/whitespace input MUST NOT produce `intent`. The UI MUST NOT call parse for empty send.

### Intent types (this release)

| type | Required payload | Service call |
|------|------------------|--------------|
| `expense.add` | description, amount; optional category, date (default today) | ExpenseService.create |
| `expense.totals` | period: `today` \| `week` \| `overall` | ExpenseService.totals |
| `expense.listRecent` | optional limit (default 5) | ExpenseService.list |
| `dailyLog.add` | text; optional date, category, status | DailyLogService.create |
| `dailyLog.list` | date (default today) | DailyLogService.listByDate |
| `dailyLog.setStatus` | id or unique text match; status | DailyLogService.setStatus |
| `summary.today` | none | OverviewService.summariseToday |
| `workout.addGym` | type; exercises[] | HealthService.createWorkout |
| `workout.addCardio` | type; durationMinutes; optional date | HealthService.createCardio |
| `workout.listRecent` | optional limit (default 5) | HealthService.listRecent |
| `weight.add` | value; optional date | HealthService.createWeight |
| `study.add` | durationMinutes; optional date, note | StudyService.createStudy |
| `goal.add` | title; optional notes | GoalsService.createGoal |

Pattern examples (not exclusive): `Swiggy 200`, `Coffee 80`, `Log ₹200 for Swiggy`, `how much have I spent this week`, `I went to the gym today` (Daily Log unless a full gym payload is present), `add a plan to study … tomorrow`, `summarise my day`, `show me my recent workouts`.

Gym log via chat only when type and at least one exercise with sets and reps are present; otherwise `clarify`.

## `handleChat(input, context) -> ChatOutcome`

1. Append user message only after non-empty validation.
2. `parseChat`.
3. On `intent`, call the service. On service success, append an in-memory aura message with `outcome=success` and confirm saved fields or query results. Expense confirmations MUST include `context.currencySymbol`. On service/`StorageError`, `outcome=error`, no success wording.
4. On `clarify`, no write; `outcome=clarification`.
5. On `unsupported` / `unknown`, no write; matching outcome; `message` includes the FR-061 supported-operations list.
6. MUST NOT persist the transcript. MUST NOT claim advanced AI reasoning.

Supported-operations list (exact items to include in unknown/unsupported replies): add an expense; ask spending today, this week, or overall; list recent expenses; add or list Daily Log entries; mark a Daily Log entry complete or incomplete; summarise today; log a gym or cardio session; list recent workouts; record body weight; log a study session; add a goal.

## Success / failure (observable)

| Case | Saved records | Reply |
|------|----------------|-------|
| Valid expense phrase | Expense created | Confirms description, amount with `currencySymbol`, category, date |
| Expense without amount | None | Asks for amount |
| Valid query | None | Numbers match module totals |
| Calendar/PDF/Strava/auto screen time | None | Not available yet, plus supported-operations list |
| Unrecognised text | None | Did not understand, plus supported-operations list |
| Storage failure after valid intent | None | Error; not success |

Integration tests MUST cover expense add (confirmation uses settings currency), failed amount, daily log add, today summary empty and non-empty, one unsupported request (list included), and one unknown request (list included).
