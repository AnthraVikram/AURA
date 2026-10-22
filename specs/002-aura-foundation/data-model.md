# Data Model: AURA Foundation

Persisted as one versioned document (`schemaVersion: 1`) behind repository ports. IDs are UUID strings. Timestamps are ISO-8601. Dates that mean a calendar day are `YYYY-MM-DD` in the device local timezone.

## Document root

| Field | Type | Rules |
|-------|------|--------|
| schemaVersion | number | Must be `1` for this release. Unknown versions fail load with a visible error; do not migrate silently by dropping fields. |
| preferences | Preferences | Single record |
| dailyLogEntries | DailyLogEntry[] | |
| expenses | Expense[] | |
| workoutSessions | WorkoutSession[] | |
| cardioSessions | CardioSession[] | |
| weightEntries | WeightEntry[] | |
| studySessions | StudySession[] | |
| screenTimeEntries | ScreenTimeEntry[] | |
| goals | Goal[] | |
| habits | Habit[] | |
| learningResources | LearningResource[] | Seeded from static catalogue; user does not CRUD resources in this release |

Not persisted: chat transcript (`ChatMessage` is in-memory session state only), computed observations, suggestions, daily/weekly/overall totals.

## Preferences

| Field | Type | Rules |
|-------|------|--------|
| displayName | string | Trimmed; empty allowed (UI shows a generic personal label, not fake data) |
| currencySymbol | string | Default `₹`; non-empty after save |
| weightUnit | `kg` \| `lb` | Default `kg`; applies to **new** weight/exercise-weight inputs and form defaults only. MUST NOT rewrite historical `WeightEntry.unit` or `Exercise.weightUnit` |

## DailyLogEntry

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| text | string | Trimmed; must be non-empty |
| date | string | Local `YYYY-MM-DD` |
| category | `activity` \| `health` \| `plan` \| `learning` \| `other` | Required |
| status | `incomplete` \| `complete` | Required |
| createdAt | string | ISO-8601 |
| updatedAt | string | ISO-8601 |

**Defaults**: category from keyword rules; `plan` for a plan dated today or later → status `incomplete`; otherwise `complete`.

**Transitions**: `incomplete` ↔ `complete` only by explicit user or supported chat action.

**Keyword category hints (predictable, user-correctable)**: health/gym/run/weight → `health`; plan/todo/tomorrow/study plan → `plan`; learn/course/read → `learning`; workout/went/did → `activity`; else `other`.

## Expense

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| description | string | Trimmed; non-empty |
| amount | number | Finite, `> 0`; store as number, display ≤ 2 decimal places |
| category | `food` \| `transport` \| `shopping` \| `bills` \| `health` \| `education` \| `other` | Required |
| date | string | Local `YYYY-MM-DD` |
| createdAt, updatedAt | string | ISO-8601 |

**Keyword map** (spec FR-027): coffee, lunch, dinner, breakfast, swiggy, zomato → food; uber, ola, metro, fuel, petrol → transport; amazon, groceries → shopping; else `other` when unspecified.

**Totals**: sum of `amount` where `date == today`; where `date` in last 7 local days including today; all records. Deleted rows excluded.

## WorkoutSession

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| type | `leg_day` \| `back_and_biceps` \| `chest_and_triceps` \| `shoulders` | Required |
| date | string | Local `YYYY-MM-DD` |
| exercises | Exercise[] | At least one |
| createdAt, updatedAt | string | ISO-8601 |

### Exercise

| Field | Type | Rules |
|-------|------|--------|
| name | string | Non-empty |
| sets | number | Integer `≥ 1` |
| repetitions | number | Integer `≥ 1` |
| weight | number \| null | If present: finite `≥ 0` |
| weightUnit | `kg` \| `lb` \| null | Required if weight present; snapshot of unit at save |

## CardioSession

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| type | `running` \| `skipping` | Required |
| date | string | Local `YYYY-MM-DD` |
| durationMinutes | number | Finite `> 0` |
| createdAt, updatedAt | string | ISO-8601 |

## WeightEntry

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| value | number | Finite `> 0` |
| unit | `kg` \| `lb` | Snapshot at save. Review lists MUST show this stored unit even if settings `weightUnit` later changes. MUST NOT convert `value` |
| date | string | Local `YYYY-MM-DD` |
| createdAt, updatedAt | string | ISO-8601 |

Not a diagnosis. No derived BMI or medical labels.

## StudySession / ScreenTimeEntry

Same shape:

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| date | string | Local `YYYY-MM-DD` |
| durationMinutes | number | Finite `> 0` |
| note | string | Optional; empty allowed |
| createdAt, updatedAt | string | ISO-8601 |

Screen-time rows are always presented as manual.

## Goal

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| title | string | Non-empty |
| notes | string | Optional |
| status | `active` \| `completed` | Default `active` |
| createdAt, updatedAt | string | ISO-8601 |

**Transitions**: `active` → `completed` and reverse only by the user. Suggestions never flip status.

## Habit

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| name | string | Non-empty |
| completions | string[] | Unique local `YYYY-MM-DD` values meaning “done that day” |
| createdAt, updatedAt | string | ISO-8601 |

Recent-day count = number of dates in `completions` among the last 7 local dates. Label as a count, not a proven pattern.

Deleting a habit removes the habit and its `completions`. Missing id → not-found; no success.

## ChatMessage (session only, not in AppDocument)

| Field | Type | Rules |
|-------|------|--------|
| id | string | UUID |
| role | `user` \| `aura` | |
| text | string | Non-empty |
| createdAt | string | ISO-8601 |
| outcome | `success` \| `clarification` \| `unsupported` \| `unknown` \| `error` \| `none` | `none` for user rows |
| intentType | string \| null | For aura rows, the intent name when applicable |

Empty user text is never stored. Reload MUST drop this list.

## LearningResource (seeded)

| Field | Type | Rules |
|-------|------|--------|
| id | string | Stable string id |
| title | string | |
| theme | enum below | |
| kind | `youtube` \| `course` \| `article` | |
| url | string | Absolute https URL, verified live before inclusion |
| destinationLabel | string | e.g. “YouTube”, “freeCodeCamp” |
| claimsCertificate | boolean | True only if the destination offers a certificate |
| curated | true | Always true in this release |

Themes: `confidence_communication`, `discipline_consistency`, `peace_focus`, `habits_character`, `mental_emotional`, `free_learning`.

## Derived (not stored)

- **Daily overview**: today’s saved Daily Log, expense, workout, cardio, weight, study, and screen-time rows (local today) + incomplete Daily Log items for today and overdue (`status=incomplete` and `date < today`). Recomputed after add/edit/delete. Never padded with sample data.
- **Observation**: counts, sums, last dates; labelled observation. Pattern-style copy forbidden unless ≥ 7 distinct dates with a relevant record in that area (otherwise: “not enough information”).
- **Suggestion**: optional text + optional `acceptsGoalTitle`; applying it creates a Goal only after explicit accept.

## Integrity

- Upsert of unknown id for “edit” → not-found; no create-on-edit.
- Delete of missing id → not-found; no success.
- Failed write → previous document remains the source of truth.
- No sample/demo records in empty collections.
