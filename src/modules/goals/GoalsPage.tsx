import { useState } from "react";
import { OverviewService } from "../../app/overviewService";
import { useAppStore } from "../../app/StoreContext";
import { localToday } from "../../domain/dates";
import { GoalsService } from "./goalsService";

export function GoalsPage() {
  const { store, bump, revision } = useAppStore();
  void revision;
  const service = new GoalsService(store);
  const [title, setTitle] = useState("");
  const [habit, setHabit] = useState("");
  const [message, setMessage] = useState("");
  const observations = new OverviewService(store).observations();
  const suggestion = store.load().expenses.length
    ? "Suggestion: you may add a goal to review this week's spending. You decide."
    : null;

  return (
    <section>
      <h2>Goals and habits</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = service.createGoal({ title });
          if (!result.ok) setMessage(result.message);
          else {
            setTitle("");
            bump();
          }
        }}
      >
        <input aria-label="Goal title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>
          Related activity (optional)
          <select aria-label="Goal related activity" defaultValue="">
            <option value="">None</option>
          </select>
        </label>
        <p className="empty">None means no extra activity is attached. Goals only store the title you enter.</p>
        <button type="submit">Add goal</button>
      </form>
      <ul>
        {service.list().map((g) => (
          <li key={g.id}>
            {g.title} ({g.status})
            <button
              type="button"
              className="secondary"
              onClick={() => {
                service.setStatus(g.id, g.status === "active" ? "completed" : "active");
                bump();
              }}
            >
              Toggle
            </button>
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = service.createHabit(habit);
          if (!result.ok) setMessage(result.message);
          else {
            setHabit("");
            bump();
          }
        }}
      >
        <input aria-label="Habit name" value={habit} onChange={(e) => setHabit(e.target.value)} />
        <button type="submit">Add habit</button>
      </form>
      <ul>
        {service.listHabits().map((h) => {
          const count = service.habitCounts(h.id);
          return (
            <li key={h.id}>
              {h.name} — {count.ok ? count.record.count : 0} of last 7 days (count, not a proven pattern)
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const done = !h.completions.includes(localToday());
                  service.setHabitDone(h.id, localToday(), done);
                  bump();
                }}
              >
                Today
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const result = service.deleteHabit(h.id);
                  if (!result.ok) window.alert(result.message);
                  bump();
                }}
              >
                Delete habit
              </button>
            </li>
          );
        })}
      </ul>
      <h3>Observations</h3>
      {observations.map((o) => (
        <p key={o}>{o}</p>
      ))}
      {suggestion ? (
        <p>
          {suggestion}{" "}
          <button
            type="button"
            className="secondary"
            onClick={() => {
              service.acceptSuggestion("Review this week's spending");
              bump();
            }}
          >
            Accept suggestion
          </button>
        </p>
      ) : null}
      {message ? <p className="error">{message}</p> : null}
    </section>
  );
}
