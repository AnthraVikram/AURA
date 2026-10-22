# Contract: Module services

Each area is a service with typed inputs and outputs. UI forms and chat call the same functions. Validation lives in domain helpers used by services, not only in widgets.

Common write result: `{ ok: true, record }` or `{ ok: false, error: 'validation' \| 'not_found' \| 'storage', message }`.

## DailyLogService

| Operation | Input | Success | Failure |
|-----------|-------|---------|---------|
| create | text, optional date/category/status | Saved entry with defaults applied | Empty text; storage |
| update | id + fields | Replaced entry | not_found; empty text |
| listByDate | date | Array (maybe empty) | — |
| listIncomplete | optional includeOverdue | Incomplete entries | — |
| setStatus | id, status | Updated | not_found |
| delete | id | ok | not_found |

## ExpenseService

| Operation | Input | Success | Failure |
|-----------|-------|---------|---------|
| create | description, amount, optional category/date | Saved; category defaulted | Invalid amount or empty description |
| update | id + fields | Replaced | not_found; validation |
| list | none | All expenses | — |
| totals | none | `{ today, week, overall }` from saved rows | — |
| delete | id | ok | not_found |

## HealthService

| Operation | Input | Success | Failure |
|-----------|-------|---------|---------|
| createWorkout | type, date, exercises | Saved | Unknown type; no exercises; invalid sets/reps/weight |
| createCardio | type, durationMinutes, date | Saved | Invalid duration or type |
| createWeight | value, date, unit | Saved | Invalid value |
| listRecent | limit | Workouts + cardio newest first | — |
| listWeights | — | Chronological | — |
| update*/delete* | id | ok | not_found; validation |

No medical fields or claims in outputs.

## StudyService

`createStudy`, `createScreenTime`, `list*`, `summaries` (sum of `durationMinutes` for period), `update`, `delete`. Summaries MUST include `source: 'manual'`.

## GoalsService

`createGoal`, `setStatus`, `list`, `delete` (goal). `createHabit`, `setHabitDone(id, date, done)`, `habitCounts(id)` as completion counts over last 7 days, `deleteHabit(id)` → ok or `not_found` (removes the habit and its completions).

`acceptSuggestion(suggestion)` creates a goal only on explicit accept.

## OverviewService

`dailyOverview(today)` → today’s saved Daily Log, expense, workout, cardio, weight, study, and screen-time records + incomplete/overdue log items. Empty collections omitted; never padded with sample data. MUST reflect the store after add, edit, or delete.

`summariseToday()` → text built only from those records, or an explicit empty summary.

`observations()` → labelled facts. If an area has fewer than 7 dates with records, include “not enough information” instead of pattern language.

## PreferencesService

`get`, `save` (displayName, currencySymbol, weightUnit). currencySymbol MUST be non-empty.

## GrowthService

`listByTheme()` read-only catalogue. Opening a resource is a UI navigation to `url` (YouTube entries must be youtube.com / youtu.be).
