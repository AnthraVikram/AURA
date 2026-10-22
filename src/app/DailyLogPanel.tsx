import { useState } from "react";
import { DailyLogService } from "../modules/daily-log/dailyLogService";
import { expenseTotals } from "../domain/expenseTotals";
import { cardioTypeLabel, workoutTypeLabel } from "../domain/healthValidation";
import { formatMoney } from "../domain/money";
import { localToday } from "../domain/dates";
import { productivityScore } from "../domain/productivityScore";
import { useAppStore } from "./StoreContext";
import type { QuickKind } from "./QuickActionDialog";

export function DailyLogPanel({ onQuick }: { onQuick: (kind: Exclude<QuickKind, null>) => void }) {
  const { store, bump, revision, setError } = useAppStore();
  void revision;
  const doc = store.load();
  const today = localToday();
  const symbol = doc.preferences.currencySymbol;
  const totals = expenseTotals(doc.expenses, today);
  const workouts = doc.workoutSessions.filter((w) => w.date === today);
  const cardios = doc.cardioSessions.filter((c) => c.date === today);
  const studyMin = doc.studySessions.filter((s) => s.date === today).reduce((s, r) => s + r.durationMinutes, 0);
  const screenMin = doc.screenTimeEntries.filter((s) => s.date === today).reduce((s, r) => s + r.durationMinutes, 0);
  const logs = doc.dailyLogEntries.filter((e) => e.date === today);
  const complete = logs.filter((e) => e.status === "complete");
  const incomplete = logs.filter((e) => e.status === "incomplete");
  const overdue = doc.dailyLogEntries.filter((e) => e.status === "incomplete" && e.date < today);
  const prod = productivityScore(doc, today);
  const service = new DailyLogService(store);
  const [workoutNone, setWorkoutNone] = useState(false);
  const [studyNone, setStudyNone] = useState(false);
  const [screenNone, setScreenNone] = useState(false);

  return (
    <aside className="card rail-panel" aria-label="Daily overview">
      <div className="panel-head">
        <div>
          <h2>Daily Log</h2>
          <p className="empty">Your day at a glance</p>
        </div>
      </div>

      <section className="checkin">
        <article>
          <h3>How much did you spend today?</h3>
          {doc.expenses.some((e) => e.date === today) ? (
            <p>
              {formatMoney(totals.today, symbol)} across {doc.expenses.filter((e) => e.date === today).length}{" "}
              {doc.expenses.filter((e) => e.date === today).length === 1 ? "record" : "records"}
            </p>
          ) : (
            <p className="empty">No expenses logged yet.</p>
          )}
        </article>
        <article>
          <h3>Did you work out today?</h3>
          {workouts.length || cardios.length ? (
            <p>
              Logged
              {workouts.length ? ` · ${workouts.map((w) => workoutTypeLabel(w.type)).join(", ")}` : ""}
              {cardios.length ? ` · ${cardios.map((c) => `${cardioTypeLabel(c.type)} ${c.durationMinutes} min`).join(", ")}` : ""}
            </p>
          ) : workoutNone ? (
            <p className="empty">None — you chose not to record a workout (not saved as an activity).</p>
          ) : (
            <>
              <p className="empty">No workout logged yet.</p>
              <button type="button" className="secondary" onClick={() => setWorkoutNone(true)}>
                None (workout)
              </button>
            </>
          )}
        </article>
        <article>
          <h3>How much did you study today?</h3>
          {studyMin ? (
            <p>{studyMin} min (manual)</p>
          ) : studyNone ? (
            <p className="empty">None — you chose not to record study (not saved as a session).</p>
          ) : (
            <>
              <p className="empty">No study time recorded yet.</p>
              <button type="button" className="secondary" onClick={() => setStudyNone(true)}>
                None (study)
              </button>
            </>
          )}
        </article>
        <article>
          <h3>How much time did you spend on screens?</h3>
          {screenMin ? (
            <p>{screenMin} min (manual)</p>
          ) : screenNone ? (
            <p className="empty">None — you chose not to record screen time (not saved as a session).</p>
          ) : (
            <>
              <p className="empty">No screen time recorded yet.</p>
              <button type="button" className="secondary" onClick={() => setScreenNone(true)}>
                None (screen)
              </button>
            </>
          )}
        </article>
        <article>
          <h3>What did you accomplish today?</h3>
          {complete.length ? (
            <ul className="timeline">
              {complete.map((e) => (
                <li key={e.id}>
                  {e.text}
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      const result = service.setStatus(e.id, "incomplete");
                      if (!result.ok) setError(result.message);
                      bump();
                    }}
                  >
                    Undo
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No completed notes for today yet.</p>
          )}
        </article>
        <article>
          <h3>Is there anything you still need to do?</h3>
          {incomplete.length || overdue.length ? (
            <ul className="timeline">
              {[...incomplete, ...overdue].map((e) => (
                <li key={e.id} className="incomplete">
                  <span>
                    {e.text}
                    {e.date < today ? " (overdue)" : ""}
                  </span>
                  <span>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        service.setStatus(e.id, "complete");
                        bump();
                      }}
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const result = service.delete(e.id);
                        if (!result.ok) setError(result.message);
                        bump();
                      }}
                    >
                      Delete
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">Nothing marked incomplete.</p>
          )}
        </article>
      </section>

      <section>
        <h3>Daily insights</h3>
        <p>
          Spending today:{" "}
          {doc.expenses.some((e) => e.date === today)
            ? formatMoney(totals.today, symbol)
            : "none recorded"}
        </p>
        <p>
          Workout: {workouts.length || cardios.length ? "logged" : "No workout logged yet"}
        </p>
        <p>
          Study {studyMin ? `${studyMin} min (manual)` : "not recorded"} · Screen{" "}
          {screenMin ? `${screenMin} min (manual)` : "not recorded"}
        </p>
        <p>
          Daily Log {complete.length} complete / {incomplete.length} incomplete today
        </p>
        <p>
          {prod.score === null
            ? prod.reason
            : `Productivity ${prod.score}/100 — ${prod.reason}`}
        </p>
      </section>

      <div className="quick-row" aria-label="Daily Log quick actions">
        <button type="button" className="secondary" onClick={() => onQuick("expense")}>
          Add expense
        </button>
        <button type="button" className="secondary" onClick={() => onQuick("log")}>
          Add a Daily Log entry
        </button>
        <button type="button" className="secondary" onClick={() => onQuick("workout")}>
          Log workout
        </button>
        <button type="button" className="secondary" onClick={() => onQuick("study")}>
          Record study
        </button>
      </div>
      <p className="empty">Records stay on this device. They are not synced to the cloud or another device.</p>
    </aside>
  );
}
