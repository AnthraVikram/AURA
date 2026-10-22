import { useState } from "react";
import { localToday } from "../../domain/dates";
import type { DailyLogCategory } from "../../domain/types";
import { useAppStore } from "../../app/StoreContext";
import { DailyLogForm } from "./DailyLogForm";
import { DailyLogService } from "./dailyLogService";

export function DailyLogPage() {
  const { store, bump, revision } = useAppStore();
  void revision;
  const [date, setDate] = useState(localToday());
  const service = new DailyLogService(store);
  const rows = service.listByDate(date);

  return (
    <section>
      <h2>Daily Log</h2>
      <DailyLogForm onSaved={bump} />
      <label>
        View date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      {rows.length === 0 ? (
        <p className="empty">No entries for this date. Add a real note when you are ready.</p>
      ) : (
        <ul>
          {rows.map((r) => (
            <li key={r.id} className={r.status === "incomplete" ? "incomplete" : undefined}>
              <div>
                {r.text} · {r.category} · {r.status}
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  service.setStatus(r.id, r.status === "complete" ? "incomplete" : "complete");
                  bump();
                }}
              >
                Toggle complete
              </button>
              <select
                aria-label={`Category for ${r.text}`}
                value={r.category}
                onChange={(e) => {
                  service.update(r.id, { category: e.target.value as DailyLogCategory });
                  bump();
                }}
              >
                <option value="activity">Activity</option>
                <option value="health">Health</option>
                <option value="plan">Plan</option>
                <option value="learning">Learning</option>
                <option value="other">Other</option>
              </select>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const next = window.prompt("Edit text", r.text);
                  if (next == null) return;
                  const result = service.update(r.id, { text: next });
                  if (!result.ok) window.alert(result.message);
                  bump();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const result = service.delete(r.id);
                  if (!result.ok) window.alert(result.message);
                  bump();
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
