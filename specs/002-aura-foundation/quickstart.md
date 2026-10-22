# Quickstart: AURA Foundation

Validation guide for the first working app. Implementation steps live in `tasks.md` (not this file).

## Prerequisites

- Node.js 20+ and npm
- A current desktop browser, plus tablet-width checks (browser responsive mode and/or iPad Safari)
- Feature spec: [spec.md](./spec.md)
- Contracts: [contracts/](./contracts/)
- Data model: [data-model.md](./data-model.md)

## Setup (after implementation exists)

```bash
npm install
npm test
npm run dev
```

Open the printed local URL. There is no account. Data stays in this browser profile (`aura.v1`).

## Automated checks (constitution)

Run before considering a story done:

```bash
npm test
```

Expected:

- Unit: chat parse cases from [contracts/chat.md](./contracts/chat.md), expense/daily-log validation, totals, category defaults, observation “not enough information” rule
- Contract: sample `AppDocument` validates against [contracts/storage.schema.json](./contracts/storage.schema.json)
- Integration: `handleChat` → module service → `MemoryStore` (and local adapter round-trip) for expense add (confirmation uses settings currency), clarify-missing-amount, daily log add (multi-fact note stays one entry), empty day summary, unsupported calendar request (lists supported operations), unknown text (lists supported operations), habit delete success and not-found

Empty `npm test` or tests written after the production code for a behaviour violate Principle III.

## Manual / browser scenarios

Use a clean profile or clear site data first so empty states are honest.

1. **Command centre (SC-001, under 2 minutes)**: From first paint, reach every sidebar area, chat, compact overview, and quick actions in under 2 minutes. Compact overview says nothing is recorded today. No fake charts.
2. **Expense via chat (SC-002, under 30 seconds)**: Focus chat, send `Coffee 80`, see success confirmation **and** the same row in Expenses in under 30 seconds. Confirmation includes the settings currency symbol (default ₹). Totals include 80. Overview lists that expense for today.
3. **Invalid expense**: Send `Snacks`. Reply asks for amount. Expenses list unchanged.
4. **Daily Log (SC-003, under 1 minute)**: Create an entry from Daily Log and find it by date in under 1 minute. Change category, mark incomplete, complete it, pick a date with no notes (empty state). A multi-fact note (two facts in one text) remains a single entry. Overview shows today’s log items and incomplete/overdue items.
5. **Health**: Log a Shoulders exercise with sets/reps; log Skipping with minutes; log a weight. Review lists. No medical wording. Overview includes today’s health rows. Change settings weight unit: historical rows keep stored unit; new form defaults use the setting.
6. **Growth**: Open a YouTube item (lands on YouTube) and a course link. Catalogue says curated. No false certificate claims.
7. **Study / screen time**: Save durations; summaries say manual. Overview includes today’s sessions.
8. **Goals / habits**: Add a goal; check a habit today; delete a habit (gone from the list); delete a missing habit id (not-found, no success). Observations are facts or “not enough information”.
9. **Settings**: Change currency symbol; expense **lists, totals, and chat confirmations** follow it. Note that data is local to this device.
10. **Restart**: Reload or close the tab, reopen. Records from steps 2–8 remain. Chat panel is empty. No sync claim.
11. **Tablet width (SC-008)**: Narrow the viewport (~768px). Complete “open → one supported chat command → matching area shows the result” without hiding navigation or chat.
12. **iPad Safari (FR-005)**: On an iPad, open the Vite URL in Safari and repeat scenario 11. If hardware is unavailable, use Safari (or WebKit) on a desktop with a ~768–1024px width and a documented note in the verification record that physical iPad was not used.
13. **Empty summary (SC-007, under 10 seconds)**: On a profile with no records for today, ask AURA to summarise the day. Explicit empty summary in under 10 seconds; no invented events.
14. **Unsupported / unknown**: Ask to add a calendar event → not available yet **and** the supported-operations list; nothing created. Send nonsense text → did not understand **and** the same list; nothing created.

## Persistence failure (if you can simulate)

Block or break storage (full quota / mocked adapter). Saving MUST show failure, not success, and lists MUST NOT show a phantom row.

## Done when

`npm test` is green, the scenarios above match [spec.md](./spec.md) success criteria (including SC-001/002/003/007 timings), overview never fabricates data, and no area is a static placeholder without create/review of real records.
