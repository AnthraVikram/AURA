import { useState } from "react";
import { localToday } from "../../domain/dates";
import { useAppStore } from "../../app/StoreContext";
import { StudyService } from "./studyService";

export function StudyPage() {
  const { store, bump, revision } = useAppStore();
  void revision;
  const service = new StudyService(store);
  const [kind, setKind] = useState<"none" | "study" | "screen">("none");
  const [studyMin, setStudyMin] = useState("");
  const [screenMin, setScreenMin] = useState("");
  const [message, setMessage] = useState("");
  const study = service.summaries("study");
  const screen = service.summaries("screen");
  const today = localToday();
  const hasStudyToday = service.listStudy().some((s) => s.date === today);
  const hasScreenToday = service.listScreenTime().some((s) => s.date === today);
  const hasStudyWeek = study.week > 0;
  const hasScreenWeek = screen.week > 0;

  return (
    <section>
      <h2>Study and screen time</h2>
      <p className="empty">These totals are manually recorded. AURA does not measure device or app usage.</p>
      <label>
        Study activity
        <select
          aria-label="Study activity"
          value={kind}
          onChange={(e) => setKind(e.target.value as "none" | "study" | "screen")}
        >
          <option value="none">None</option>
          <option value="study">Study session</option>
          <option value="screen">Screen time</option>
        </select>
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (kind !== "study") {
            setMessage("None selected — no study session was saved.");
            return;
          }
          const result = service.createStudy({ durationMinutes: Number(studyMin) });
          if (!result.ok) setMessage(result.message);
          else {
            setStudyMin("");
            setMessage("");
            bump();
          }
        }}
      >
        <input aria-label="Study minutes" value={studyMin} onChange={(e) => setStudyMin(e.target.value)} />
        <button type="submit">Save study session</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (kind !== "screen") {
            setMessage("None selected — no screen-time record was saved.");
            return;
          }
          const result = service.createScreenTime({ durationMinutes: Number(screenMin) });
          if (!result.ok) setMessage(result.message);
          else {
            setScreenMin("");
            setMessage("");
            bump();
          }
        }}
      >
        <input aria-label="Screen minutes" value={screenMin} onChange={(e) => setScreenMin(e.target.value)} />
        <button type="submit">Save screen time</button>
      </form>
      {message ? <p className={kind === "none" ? "empty" : "error"}>{message}</p> : null}
      <p>
        {hasStudyToday
          ? `Recorded study today: ${study.today} min (manual)`
          : "No study time recorded yet."}
      </p>
      <p>
        {hasStudyWeek
          ? `Recorded study this week: ${study.week} min (manual)`
          : "No study time recorded this week."}
      </p>
      <p>
        {hasScreenToday
          ? `Recorded screen time today: ${screen.today} min (manual)`
          : "No screen time recorded yet."}
      </p>
      <p>
        {hasScreenWeek
          ? `Recorded screen time this week: ${screen.week} min (manual)`
          : "No screen time recorded this week."}
      </p>
      <ul>
        {service.listStudy().map((s) => (
          <li key={s.id}>
            Study {s.durationMinutes} min on {s.date} (manual)
          </li>
        ))}
        {service.listScreenTime().map((s) => (
          <li key={s.id}>
            Screen {s.durationMinutes} min on {s.date} (manual)
          </li>
        ))}
      </ul>
    </section>
  );
}
