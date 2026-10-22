# Feature Specification: AURA Foundation

**Feature Branch**: `002-aura-foundation`

**Created**: 2026-10-21

**Status**: Draft

**Input**: User description: "Create the initial working application for AURA 2.0 from scratch as a personal assistant and Spec-Driven Development learning project. Build a minimal, cohesive, genuinely functional foundation of the Autonomous Unified Reasoning Assistant: dark galaxy-inspired command centre; universal text chat with predictable commands; Daily Log; expenses; health and fitness; personal growth resources; manual study and screen-time tracking; local persistence; basic goals, habits, and data-grounded suggestions. Single user. No paid AI. No cloud sync. Do not fabricate dashboard data. Keep long-term agentic, notification, and multi-device capabilities out of this release except as recorded future work."

## User Scenarios & Testing *(mandatory)*

AURA 2.0 (Autonomous Unified Reasoning Assistant) is a personal command centre for one person. This feature is the first working application: a coherent set of useful areas, not a static dashboard and not a single-module demo. The user is the owner-operator of their own records.

### User Story 1 - Open a honest personal command centre (Priority: P1)

The user opens AURA and sees a dark, galaxy-inspired workspace with purple as the primary accent and restrained pink and blue highlights. The universal chat is the central workspace. A persistent sidebar lists the Daily Log and the other functional areas (expenses, health and fitness, personal growth, study and screen time, goals and habits, settings). A compact daily overview and a small set of quick actions are visible. Empty areas show empty states, not invented activity, charts, or personal data. On a laptop or tablet (including intended iPad use), the layout remains usable: the sidebar may compact, but the user can still reach chat and every area.

**Why this priority**: Without a navigable home, the other areas cannot be found or demonstrated as one assistant.

**Independent Test**: Open AURA with no saved records, walk the sidebar to every area, confirm empty states are honest, and confirm chat remains the central workspace.

**Acceptance Scenarios**:

1. **Given** AURA has no saved records, **When** the user opens the command centre, **Then** they see the universal chat, sidebar navigation to every initial-release area, a compact daily overview, and quick actions, and no area displays fabricated statistics or sample personal data.
2. **Given** the user is on a laptop-width or tablet-width screen, **When** they navigate between chat and another area, **Then** they can reach the destination without losing access to the rest of AURA's areas.
3. **Given** the compact daily overview has no records for today, **When** the user views it, **Then** it states that there is nothing recorded for today rather than filling the space with placeholder metrics.
4. **Given** the user has saved records dated today in Daily Log, expenses, health, study, or screen time, **When** they view the compact daily overview, **Then** those actual records appear there together with incomplete Daily Log items, and the overview updates after add, edit, or delete without inventing rows.

---

### User Story 2 - Keep records after closing AURA (Priority: P1)

The user creates records in any enabled area, closes AURA, and opens it again on the same device. Previously saved records are still there. Nothing implies that this local copy is shared with another device.

**Why this priority**: A personal assistant that forgets the day is not useful. Persistence is the foundation for every other story.

**Independent Test**: Create at least one record, fully close AURA, reopen it, and confirm the record is present and unchanged.

**Acceptance Scenarios**:

1. **Given** the user saved a Daily Log entry, an expense, and a workout on this device, **When** they close AURA and open it again, **Then** those three records are still available in their areas with the same content.
2. **Given** records exist only on this device, **When** the user views any summary, **Then** AURA does not claim that data is synced to another device or to the cloud.
3. **Given** the user had a chat transcript in the current session, **When** they close AURA and open it again, **Then** module records are still present and the chat panel starts empty (this release does not persist chat transcripts).

---

### User Story 3 - Capture expenses through chat (Priority: P1)

The user tells AURA about spending in ordinary short phrases (for example "Swiggy 200", "Coffee 80", or "Log ₹200 for Swiggy"). When AURA can extract a description and a valid amount, it saves the expense immediately, without an extra confirmation step, then confirms what was saved. If the amount is missing or unclear, AURA asks for clarification and does not save. The saved expense appears in the expenses area and in totals.

**Why this priority**: Fast expense capture is a core daily action and proves that chat changes real records.

**Independent Test**: Send a clear expense phrase in chat, then open the expenses area and verify the same record and updated totals.

**Acceptance Scenarios**:

1. **Given** the user sends a message that includes a clear description and a valid amount, **When** AURA accepts it as an expense, **Then** the expense is saved immediately and the chat reply confirms the saved description, amount, category, and date only after the save succeeded.
2. **Given** the user sends a message that looks like an expense but has no reliable amount, **When** AURA handles it, **Then** AURA asks for the amount, saves nothing, and does not report success.
3. **Given** a chat-saved expense exists, **When** the user opens the expenses area, **Then** the same expense is listed and is included in the relevant daily, weekly, and overall totals.

---

### User Story 4 - Keep a Daily Log through the day and at the end of the day (Priority: P1)

The user opens Daily Log from the sidebar and quickly adds a free-text entry. They can record activities, health notes, and plans; assign or correct a category; view entries by date; edit an entry; add details later; mark an entry incomplete and complete it later; and see incomplete entries as distinct from completed ones. A single note may hold more than one fact; in this release AURA applies a predictable category and the user may correct it.

**Why this priority**: Daily Log is a named core module and the main place for lived context.

**Independent Test**: Create, recategorise, edit, mark incomplete, complete, and review entries by date entirely inside Daily Log, without using chat.

**Acceptance Scenarios**:

1. **Given** the user is in Daily Log, **When** they submit a non-empty free-text entry with minimal extra fields, **Then** the entry is saved, given a completion status, given a category the user can change, and appears in the view for its date.
2. **Given** an existing entry, **When** the user edits the text, category, date, or completion status and saves, **Then** the updated entry is shown and the previous version is no longer shown as current.
3. **Given** an incomplete entry for today or an earlier date, **When** the user views Daily Log or the compact daily overview, **Then** that entry is visually distinct from completed entries and remains listed as incomplete until the user marks it complete.
4. **Given** the user opens a date that has no entries, **When** they view that date, **Then** they see an empty state for that date, not invented notes.

---

### User Story 5 - Review and correct expenses (Priority: P1)

The user opens the expenses area, sees saved expenses, edits a record, assigns or corrects a category, and sees daily, weekly, and overall totals that match the actual saved records. Summaries never invent spending.

**Why this priority**: Chat capture is not enough if the user cannot inspect and correct money records.

**Independent Test**: Add expenses in the expenses area (without chat), edit one, and check that displayed totals equal the sum of remaining valid records for each period.

**Acceptance Scenarios**:

1. **Given** the user submits a valid description and amount in the expenses area, **When** they save, **Then** the expense appears in the list and totals update to include it.
2. **Given** a saved expense, **When** the user changes its description, amount, category, or date and saves, **Then** the list and totals reflect only the corrected values.
3. **Given** one or more saved expenses, **When** the user views daily, weekly, and overall totals, **Then** each total equals the sum of saved amounts in that period and is labelled as a total of recorded expenses, not as a budget or prediction.

---

### User Story 6 - Ask AURA about the day and saved records (Priority: P2)

The user uses chat for Daily Log actions and for basic questions against saved data, such as adding a plan, recording that they went to the gym, asking how much they spent this week, asking for recent workouts, or asking AURA to summarise the day. Chat talks to the same records the modules own. If required information is missing, AURA asks. If the request needs a capability that is not in this release, AURA says so honestly and does not pretend to have done it. Chat does not claim to be advanced AI reasoning.

**Why this priority**: This is the connective tissue of the product vision, after capture and review already work.

**Independent Test**: Perform a Daily Log write, an expense total query, a recent-workout query, a day summary, and an unsupported request entirely through chat, then confirm module screens match what chat reported.

**Acceptance Scenarios**:

1. **Given** the user sends a supported Daily Log phrase with enough detail to save, **When** AURA handles it, **Then** a Daily Log entry is created and the chat confirms the saved text, category, date, and completion status only after success.
2. **Given** saved expenses exist, **When** the user asks how much they have spent today, this week, or overall using a supported query, **Then** the reply uses those saved amounts and matches the expenses area totals for the same period.
3. **Given** the user asks to summarise the day, **When** AURA replies, **Then** the summary is assembled only from today's actual records (or states that nothing was recorded), and it does not invent events.
4. **Given** the user asks for a capability that is out of scope (for example creating a calendar event or reading a bank statement image), **When** AURA replies, **Then** it states that the capability is not available yet and performs no silent partial action presented as success.
5. **Given** chat is handling a request, **When** the user reads the reply, **Then** AURA does not describe the reply as advanced AI reasoning; supported operations are presented as command and pattern handling.

---

### User Story 7 - Log workouts, cardio, and body weight (Priority: P2)

The user opens health and fitness and quickly logs a gym session (type, exercises, sets, repetitions, and weights where they apply), a cardio session (running or skipping with duration), or a body-weight measurement. They can review previous sessions and weight entries. AURA does not diagnose health or claim medical meaning from these numbers.

**Why this priority**: Health tracking is a main area of the vision and must exist as real records, after Daily Log and expenses.

**Independent Test**: Log one gym workout, one cardio session, and one weight entry from the health area, then reopen the area and review those records.

**Acceptance Scenarios**:

1. **Given** the user chooses a gym category (Leg Day, Back and Biceps, Chest and Triceps, or Shoulders) and enters at least one exercise with valid numeric set, repetition, and optional weight values, **When** they save, **Then** the session is stored and listed for review.
2. **Given** the user logs Running or Skipping with a valid duration, **When** they save, **Then** the cardio session is stored with its type, duration, and date and can be reviewed.
3. **Given** the user enters a valid body weight, **When** they save, **Then** the measurement is stored with its date and can be reviewed over time as a list of recorded values, not as a medical assessment.
4. **Given** the user asks chat for recent workouts and sessions exist, **When** AURA replies, **Then** the reply lists those saved sessions and does not invent additional ones.

---

### User Story 8 - Browse curated growth and learning resources (Priority: P3)

The user opens the personal growth area and views a small organised set of genuine learning resources across the intended themes (confidence and communication, discipline and consistency, peace and focus, habits and character, mental and emotional growth, and useful free courses). YouTube items open on YouTube. Course items include a direct link. Certificate language is used only when the source actually offers a certificate. Curated lists are labelled as curated, not as personalised AI recommendations.

**Why this priority**: The area must exist and be honest, but it is not the daily capture loop.

**Independent Test**: Open the growth area, open one YouTube resource and one course link, and confirm labelling distinguishes curated content from personalised recommendations.

**Acceptance Scenarios**:

1. **Given** the user opens personal growth, **When** they browse resources, **Then** they can view, group by theme, and open each resource through its stated destination.
2. **Given** a resource is a YouTube video or channel, **When** the user opens it, **Then** they are taken to YouTube rather than a substitute player presented as YouTube.
3. **Given** a resource does not offer a certificate, **When** the user reads its description, **Then** AURA does not promise a certificate.
4. **Given** the list is a hand-chosen catalogue, **When** the user views it, **Then** it is labelled as curated resources, not as personalised recommendations from an intelligent system.

---

### User Story 9 - Record study and screen time by hand (Priority: P3)

The user logs a study session and a screen-time session with duration and date, then reviews past sessions and simple summaries built from those entries. AURA never claims to have measured app usage or device screen time automatically.

**Why this priority**: These areas are required in the first release but are lower priority than Daily Log and expenses.

**Independent Test**: Save a study session and a screen-time session with durations, then view the list and a summary that equals those durations.

**Acceptance Scenarios**:

1. **Given** the user enters a valid study duration and date, **When** they save, **Then** the session appears in the study history and in a summary of recorded study time for the chosen period.
2. **Given** the user enters a valid screen-time duration and date, **When** they save, **Then** the session appears in the history and summaries, labelled as manually recorded time.
3. **Given** only manual entries exist, **When** the user views this area, **Then** AURA does not claim automatic measurement of device or application usage.

---

### User Story 10 - Set goals, check habits, and read grounded observations (Priority: P3)

The user writes down goals, marks them active or completed, and checks off simple habits for a date. AURA may show observations and optional suggestions drawn only from records that actually exist. Observations are labelled as observations. Suggestions are optional ideas the user may adopt; they are never executed as actions on the user's behalf. AURA does not claim a statistically established pattern from thin data.

**Why this priority**: The vision includes goals and suggestions, but only a reliable, modest version belongs in the first release.

**Independent Test**: Create a goal, complete a habit for today, and view the observations panel with both empty data and with a few saved records, confirming labels stay honest.

**Acceptance Scenarios**:

1. **Given** the user enters a goal title, **When** they save, **Then** the goal is listed as active until they mark it completed, and AURA does not start extra work merely because the goal exists.
2. **Given** the user has a habit, **When** they mark it done for a date, **Then** that date shows a completed check and counts shown for recent days are counts of those checks, not a claim of a proven behavioural pattern.
3. **Given** few or no records exist in an area, **When** AURA would otherwise suggest a "pattern", **Then** it states that there is not enough information and does not present a guess as a finding.
4. **Given** AURA shows a suggestion, **When** the user reads it, **Then** it is clearly a suggestion they may ignore, and no goal or habit changes unless they explicitly accept it.

---

### User Story 11 - Adjust minimal personal settings (Priority: P3)

The user opens settings and changes the small set of preferences that other areas actually use: a display name, a currency symbol for expense amounts, and a unit for body weight. Light Mode and Vacation Mode are not offered as working modes in this release.

**Why this priority**: Personalisation should exist where it changes displayed records, without inventing undecided modes.

**Independent Test**: Change display name, currency symbol, and weight unit, then confirm expenses and weight records display with those choices.

**Acceptance Scenarios**:

1. **Given** the user sets a display name, **When** they return to the command centre, **Then** that name is used in personal greetings or profile display.
2. **Given** the user sets a currency symbol, **When** they view expenses and expense chat confirmations, **Then** amounts are shown with that symbol.
3. **Given** the user sets a weight unit, **When** they add a new body-weight or exercise-weight value, **Then** the new form defaults to that unit and the new record stores that unit.
4. **Given** historical weight or exercise-weight records exist with a stored unit, **When** the user changes the settings weight unit, **Then** those historical rows still show their originally recorded value and unit and AURA does not convert them.

---

### Edge Cases

- Empty chat message: AURA does not send an empty request and does not create a record.
- Chat text that matches no supported command and is not a Daily Log save the user clearly asked for: AURA says it did not understand, lists the supported operations from the chat catalogue, and does not save a guess.
- Chat request for a known later-release capability (for example calendar, PDF statements, Strava): AURA says that capability is not available yet, lists the supported operations from the chat catalogue, and does not save a guess.
- Ambiguous chat (two plausible actions, or a missing required field): AURA asks a clarification question and saves nothing until the user answers.
- Expense amount missing, zero, negative, or not a number: AURA rejects the save, explains the problem, and leaves existing records unchanged.
- Invalid durations, repetition counts, set counts, or body-weight values (empty, zero where not allowed, negative, or not a number): the form or chat does not save and shows why.
- Edit or delete targeting a record that no longer exists: AURA tells the user the record was not found and does not report success.
- Storage failure while saving: AURA reports that the save did not complete, does not confirm success, and does not show a new record as if it were saved.
- Empty module: each area shows an empty state that invites a first real entry and shows no fake charts or sample people.
- Restart after a failed save: only records whose save previously succeeded reappear.
- Summary requested with no records in that period: AURA says there are no records for that period; totals show zero recorded amount or time, labelled as such.
- Multi-fact Daily Log note: AURA stores the note as one entry with one predicted category; it does not silently split the note into several records in this release.
- Unsupported workout type: the user can still save using the provided initial types; free-form types beyond the initial list are not required.
- Deleting the last record in a period: totals and overviews update to empty or zero recorded, not to stale numbers.

## Requirements *(mandatory)*

### Functional Requirements

#### Command centre and experience

- **FR-001**: AURA MUST present a single-user personal command centre whose central workspace is the universal text chat and whose sidebar provides access to Daily Log, expenses, health and fitness, personal growth, study and screen time, goals and habits, and settings.
- **FR-002**: The command centre MUST include a compact daily overview plus quick actions that start adding an expense, a Daily Log entry, or a workout. The overview MUST list today's actual saved records from Daily Log, expenses, health (workouts, cardio, weight), study, and screen time (local today), together with incomplete Daily Log items for today and overdue incomplete items. It MUST refresh after those records are added, edited, or deleted. It MUST NOT fabricate records or statistics.
- **FR-003**: Visual presentation MUST follow a dark, galaxy-inspired direction: black and deep-grey surfaces, purple as the primary accent, restrained pink and blue neon highlights, clear typography, consistent spacing, and purposeful hierarchy. Decorative stars, gradients, imagery, and motion MUST remain secondary to readability and MUST NOT fabricate data.
- **FR-004**: Empty states, overviews, and charts MUST display only real saved records or an explicit empty message. Fabricated activity, statistics, or personal data is forbidden.
- **FR-005**: Layout MUST remain usable on laptop and tablet widths, including the intention to use AURA on an iPad. The user MUST still reach chat and every sidebar area at those widths.
- **FR-006**: Interface language, examples, and any curated content MUST stay appropriate for a general audience (PG-13).

#### Universal chat

- **FR-007**: AURA MUST provide a working text chat in which the user can type a request and receive a reply in the same workspace. The transcript is session-only: it MUST NOT be written to the persisted document. A reload or restart MUST restore module records and MUST show an empty chat panel.
- **FR-008**: Chat MUST implement the supported operations listed in the chat catalogue (Assumptions) and only those operations. FR-061 is the allow-list and the source of unknown/unsupported reply rules.
- **FR-009**: Chat success and failure confirmation follows FR-055. (Expense-specific immediate save without a pre-save confirm step is FR-014.)
- **FR-010**: When required information is missing or the request is ambiguous, chat MUST ask a clarification question and MUST NOT save a partial guessed record.
- **FR-011**: Unknown and unsupported chat requests follow FR-061. This identifier exists so stories can cite “honest unavailability” without duplicating that allow-list.
- **FR-012**: Chat handling MUST be separate from each module's record-keeping: modules own their records; chat asks a module to save or retrieve. Adding a later capability MUST NOT require rewriting unrelated modules.
- **FR-013**: Chat MUST NOT present rule-based command handling as advanced AI reasoning, paid-model intelligence, or autonomous agency.
- **FR-014**: Clear, valid expense phrases that yield a description and a valid amount MUST be saved immediately without an extra confirmation step, then confirmed in chat. The success confirmation MUST include the configured `currencySymbol` (FR-050) and MUST obey FR-055 (confirm only after the save succeeds).

#### Daily Log

- **FR-015**: Users MUST be able to create a free-text Daily Log entry with minimal effort from the Daily Log area.
- **FR-016**: Users MUST be able to record activities, health information, and plans as Daily Log entries and to assign a category from this initial set: Activity, Health, Plan, Learning, Other.
- **FR-017**: AURA MUST assign a predictable initial category using simple keyword and structure rules (for example a note that starts with a plan for a named later date defaults to Plan). Users MUST be able to correct the category.
- **FR-018**: Users MUST be able to view entries by date, edit previous entries, and add details after the original save.
- **FR-019**: Users MUST be able to mark an entry incomplete, leave it incomplete, and later mark it complete. Incomplete and complete entries MUST be visually distinct.
- **FR-020**: New entries default to complete unless the user marks them incomplete or the entry is categorised as a Plan for today or a later date, in which case they default to incomplete.
- **FR-021**: Incomplete-entry handling for this release is limited to in-product visibility: Daily Log date views and the compact daily overview MUST list incomplete entries for the selected date and MUST also list incomplete entries whose date is in the past. AURA MUST NOT send scheduled, operating-system, email, or push notifications in this release.
- **FR-022**: AURA MUST NOT automatically split one note into multiple records in this release.
- **FR-023**: Supported chat commands MUST be able to create or retrieve Daily Log information using the same records as the Daily Log area.

#### Expenses

- **FR-024**: Users MUST be able to add, view, and edit expenses from the expenses area, including description, amount, category, and date.
- **FR-025**: AURA MUST extract an understandable description and amount from supported chat inputs such as "Swiggy 200", "Coffee 80", and "Log ₹200 for Swiggy".
- **FR-026**: Amounts MUST be finite numbers greater than zero. Invalid amounts MUST be rejected with an explanation.
- **FR-027**: If no category is given, AURA MUST assign Other unless the description matches this small keyword map: food-related words including coffee, lunch, dinner, breakfast, Swiggy, and Zomato map to Food; travel-related words including Uber, Ola, metro, fuel, and petrol map to Transport; shopping-related words including Amazon and groceries map to Shopping. Users MUST be able to change the category after save. Initial categories are Food, Transport, Shopping, Bills, Health, Education, Other.
- **FR-028**: AURA MUST calculate daily, weekly, and overall spending totals exclusively from saved valid expenses. A week is the last seven local calendar days including today.
- **FR-029**: Expense summaries MUST be labelled as totals of recorded expenses. AURA MUST NOT show financial predictions, automated budgets, or spend-reduction recommendations in this release.
- **FR-030**: Users MUST be able to delete an expense. After deletion, lists and totals MUST exclude it.

#### Health and fitness

- **FR-031**: Users MUST be able to log gym workouts using the initial types Leg Day, Back and Biceps, Chest and Triceps, and Shoulders, including exercises with sets, repetitions, and optional weights.
- **FR-032**: Users MUST be able to log cardio of types Running and Skipping with a valid duration and date.
- **FR-033**: Users MUST be able to record body weight with a date and review the history of recorded weights.
- **FR-034**: Logging flows MUST be completable with a small number of direct fields (simple forms or equivalent), and users MUST be able to review previous sessions.
- **FR-035**: Health records MUST be treated as personal tracking data. AURA MUST NOT make medical claims or infer health status from them.
- **FR-036**: Users MUST be able to edit or delete a workout, cardio session, or weight record, with the same not-found behaviour as other records.

#### Personal growth and learning

- **FR-037**: Users MUST be able to view, organise by theme, and open a small curated catalogue covering: confidence and communication; discipline and consistency; peace and focus; habits and character development; mental and emotional growth; and useful free learning resources.
- **FR-038**: Every catalogue item MUST have a real, direct destination. YouTube items MUST open on YouTube. Course items MUST include a direct link. Links MUST be verified as real public resources before they are included.
- **FR-039**: AURA MUST NOT promise a certificate unless the destination itself offers one, and MUST label the catalogue as curated rather than as personalised intelligent recommendations.
- **FR-040**: This release MUST NOT require live web search or an AI recommendation engine.

#### Study and screen time

- **FR-041**: Users MUST be able to record a study session with date and duration and review previous study sessions and simple totals of recorded study time.
- **FR-042**: Users MUST be able to record screen time with date and duration and review previous entries and simple totals of recorded screen time.
- **FR-043**: Screens and summaries for these records MUST describe them as manually entered. AURA MUST NOT claim automatic measurement of application usage or device screen time.

#### Goals, habits, and suggestions

- **FR-044**: Users MUST be able to create a goal with a title, optional notes, and status active or completed, and to update that status themselves.
- **FR-045**: Users MUST be able to create a named habit and mark it complete or not complete for a given date, then see a recent-day count of completions.
- **FR-046**: Observations MUST be computed only from saved records (counts, totals, last recorded dates) and MUST be labelled as observations.
- **FR-047**: Suggestions, when shown, MUST be optional, based only on information AURA actually has, labelled as suggestions, and MUST NOT change goals, habits, or other records unless the user explicitly accepts them.
- **FR-048**: AURA MUST NOT state that a pattern has been statistically established. If an area has fewer than seven calendar days containing at least one relevant record, AURA MUST say there is not enough information instead of offering a pattern-style claim.
- **FR-049**: AURA MUST NOT introduce autonomous behaviour that takes consequential action without the user asking.

#### Settings

- **FR-050**: Settings MUST include display name, currency symbol (default ₹), and body-weight unit (default kg). Display name MUST be used in personal greetings. Currency symbol MUST be used wherever expense amounts are shown, including expense lists, totals, and successful expense chat confirmations. Body-weight unit applies to **new** body-weight and exercise-weight inputs and their default form values only. Historical `WeightEntry` and exercise-weight values MUST keep and display the value and unit stored on that record. Changing the setting MUST NOT convert historical measurements.
- **FR-051**: Light Mode and Vacation Mode MUST NOT appear as working features in this release. Their behaviour remains an open question for a later specification.

#### Persistence, integrity, and failures

- **FR-052**: AURA MUST persist records locally on the user's device so that creating data, navigating, closing AURA, and reopening it still shows previously saved data.
- **FR-053**: Persistence MUST be separated from on-screen presentation and from chat interpretation enough that a later move to shared cloud storage can replace the storage approach without redesigning user-facing areas from scratch. This release MUST NOT implement cloud sync, accounts, or multi-device access, and MUST NOT imply that local data appears automatically on another device.
- **FR-054**: AURA MUST NOT silently discard user input. Rejected input remains visible enough for the user to correct it (form fields stay populated; chat shows the failed request).
- **FR-055**: AURA MUST NOT invent saved records, MUST NOT show misleading totals, and MUST NOT report success for unsuccessful operations. Chat MUST confirm a supported action only after the record is saved or the query has been computed from saved records.
- **FR-056**: If storage cannot complete a write, AURA MUST show a failure message and leave lists and totals unchanged.
- **FR-057**: Editing or deleting a record that does not exist MUST result in a not-found message and no success confirmation.
- **FR-058**: Users MUST be able to delete Daily Log, expense, health, study, screen-time, goal, and habit records they created.
- **FR-059**: Dates and "today" / "this week" MUST use the device's local calendar date.
- **FR-060**: This release is for one user on one device. Sign-in, authorisation between users, and concurrent multi-device updates are out of scope.

#### Chat catalogue (supported vs later)

- **FR-061**: Supported chat operations are exactly the catalogue in Assumptions. A **known later-release** request (including calendar writes, statement uploads, Strava or fitness-band import, automatic screen-time reading, and outbound emails) MUST reply that the capability is not available yet, MUST list the supported operations below, and MUST NOT write records. A request that matches **no** catalogue item MUST reply that AURA did not understand, MUST list the same supported operations, and MUST NOT write records. Supported operations to list: add an expense; ask spending today, this week, or overall; list recent expenses; add or list Daily Log entries; mark a Daily Log entry complete or incomplete; summarise today; log a gym or cardio session; list recent workouts; record body weight; log a study session; add a goal.

### Key Entities

- **Daily Log Entry**: Free-text note with date, category (Activity, Health, Plan, Learning, Other), completion status (incomplete or complete), and editable details. Owned by Daily Log; chat may create or retrieve it.
- **Expense**: Description, amount greater than zero, category, and date. Included in daily, weekly, and overall recorded totals.
- **Workout Session**: Gym session with a type from the initial gym list, date, and one or more exercises (name, sets, repetitions, optional weight).
- **Cardio Session**: Running or Skipping with date and duration.
- **Weight Entry**: Numeric body-weight value, the unit stored at save, and date. Display uses that stored unit; settings unit applies only to new entries.
- **Learning Resource**: Curated item with title, theme, destination label, direct link, and certificate claim flag that is true only when the destination offers a certificate.
- **Study Session**: Manually recorded study duration and date.
- **Screen Time Entry**: Manually recorded duration and date, never presented as automatic device measurement.
- **Goal**: Title, optional notes, status (active or completed), created date.
- **Habit**: Name plus per-date completion marks.
- **Chat Message**: In-session user text and AURA reply (success, clarification, unsupported, unknown, or error). Not a persisted document collection in this release.
- **User Preferences**: Display name, currency symbol, weight unit. Single-user, local to the device.
- **Observation**: Read-only factual summary derived from saved entities, labelled as an observation.
- **Suggestion**: Optional idea the user may accept into a goal or ignore; not an executed action.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can open AURA and reach every sidebar area, the universal chat, the compact daily overview, and quick actions in under 2 minutes without encountering fabricated personal statistics.
- **SC-002**: A user can save a valid expense from chat in under 30 seconds from focusing the chat input to seeing both a success confirmation and the same expense in the expenses list.
- **SC-003**: A user can create a Daily Log entry from the Daily Log area in under 1 minute, then find it again when filtering by that date.
- **SC-004**: After saving at least one Daily Log entry, one expense, and one health record, closing AURA fully, and reopening it on the same device, 100% of those records are still present with the same values.
- **SC-005**: For any displayed daily, weekly, or overall expense total, an independent sum of the expenses listed for that period matches the displayed total exactly.
- **SC-006**: When a chat action fails (invalid amount, missing field, storage failure, or missing record), 100% of such attempts show a failure or clarification message and 0% show a success confirmation.
- **SC-007**: Asking AURA to summarise a day that has no records yields an explicit empty summary in under 10 seconds, with no invented events.
- **SC-008**: At laptop and tablet widths, a user can complete the primary path of "open AURA → send one supported chat command → open the matching area and see the result" without a layout that hides all navigation or the chat workspace.
- **SC-009**: In usability review of the first release, the owner-operator can complete Daily Log capture, expense capture, and workout capture each on the first attempt when given valid sample inputs.
- **SC-010**: 100% of learning-resource destinations in the catalogue open the stated real location; 0% promise a certificate the destination does not offer.
- **SC-011**: 100% of study and screen-time summaries shown to the user are labelled as manual records whenever the data source is manual entry.

## Assumptions

- The product owner is a single person using AURA on one device at a time (laptop or tablet). There is no household sharing in this release.
- No paid AI service, live web search, or external account is required to use the first release. Chat uses documented commands and patterns.
- Default currency symbol is ₹ because the supplied examples use it. The user may change the symbol in settings; this release does not convert between currencies.
- Default weight unit is kilograms.
- Local calendar dates on the device define "today" and the seven-day week used in totals.
- Durations are entered as minutes (positive numbers). Body weight and expense amounts are decimal numbers with at most two decimal places shown.
- Gym exercise weight, when present, uses the same mass unit as body-weight settings.
- Predictable Daily Log categorisation uses simple keyword rules plus the Plan default in FR-020; it is not an AI classifier.
- Minimal incomplete-entry approach is in-product lists of incomplete items (including overdue items). Notification timing, quiet hours, and delivery channels are unresolved and out of scope here.
- Storage is local to the device. Clearing the application's local data would remove records; that limitation MUST be acceptable for the first release and explained in settings or an equivalent plain-language note.
- Chat transcripts are session-only. Reloading AURA MUST NOT restore prior chat bubbles; it MUST restore persisted module records.
- A future cloud migration may add sign-in, authorisation, cross-device access, and conflict handling. This specification does not design those mechanisms.
- Curated learning links are chosen and verified during planning and implementation against this spec's honesty rules; the spec does not freeze a URL list that can rot.
- Existing placeholder spec `specs/001-personal-daily-dashboard` is unused template material and is not a source of requirements for this feature.
- Constitution constraints apply: spec-first delivery, test-first implementation, explicit interfaces, integration checks between chat and modules, and no speculative complexity.

### Supported chat catalogue (this release)

Users can reasonably expect chat to handle:

1. Add expense from a description plus amount.
2. Answer recorded spending today, this week, or overall.
3. List recent expenses.
4. Add a Daily Log entry from a clearly requested note (including activity, health, or plan phrasing).
5. List or retrieve Daily Log entries for today or a named date.
6. Mark a uniquely identified Daily Log entry complete or incomplete when the user names it clearly; if several match, ask which one.
7. Summarise today from actual records across areas.
8. Log a gym or cardio session when the type and required fields are present; otherwise ask for the missing field.
9. List recent workouts.
10. Record body weight when a valid number is present.
11. Log a study session when a valid duration is present.
12. Add a goal when the user clearly asks to add one.
13. Reply that an unsupported request is not available yet.

### Out of scope for this release

- Paid or hosted AI reasoning, MCP tools, and machine-learning personalisation.
- Multi-user assistants and per-user cloud tenancy.
- Cloud deployment, authentication, authorisation, and multi-device synchronisation.
- Automatic splitting of a single note into several categorised records.
- Operating-system notifications, email reminders, SMS, or scheduled push for incomplete entries.
- Light Mode and Vacation Mode behaviour.
- Uploading or extracting weekly expense statements from PDFs or images.
- Advanced budgets, forecasts, and automated expense-reduction plans.
- Personalised health reports, workout-plan adaptation, Strava, and fitness-band integrations.
- Medical advice or diagnosis.
- Live web search for new learning resources and AI-generated recommendations.
- Automatic capture of application usage or device screen time.
- Full agentic workflow: knowledge-base search, calendar reads/writes, proposing a schedule, and executing external actions.
- Any consequential external action (calendar, messaging, purchases) without a later, explicit permission model.

### Future capabilities (not commitments of this feature)

- Natural-language goal understanding that selects tools across all areas with richer reasoning.
- Follow-up questions that split multi-fact notes into the right areas.
- Incomplete-entry reminders with agreed timing and channel.
- Cloud access to the same user's data on laptop and iPad, with conflict handling.
- Light Mode for mentally exhausting days and Vacation Mode.
- Statement import, richer finance insights, and external fitness integrations.
- Pattern recognition that remains labelled honestly and never auto-adopts goals.

### Open questions (later clarification; not blocking this spec)

These are recorded because the product vision left them undecided. This release uses the defaults above instead of inventing behaviour.

1. When should incomplete Daily Log entries remind the user, on what channel, and with what quiet hours?
2. What exactly should Light Mode change (appearance only versus reduced features)?
3. What exactly should Vacation Mode pause or relax, and how does the user start and end it?
4. Which identity and conflict rules should apply when local data later meets a cloud copy?
5. Should a later release auto-split a multi-fact note, and what confirmation is required before creating extra records?

## Constitution alignment

This feature is the first application implementation. Planning MUST name the chosen stack explicitly (constitution `TODO(TECHNOLOGY_STACK)`). Implementation MUST keep chat, modules, and persistence as explicit interfaces; MUST add tests from these acceptance scenarios before production behaviour; MUST verify chat-to-module saves as integration behaviour; and MUST NOT add agentic or cloud machinery that this spec does not require.
