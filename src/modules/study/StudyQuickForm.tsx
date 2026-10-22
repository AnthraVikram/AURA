import { useState } from "react";
import { useAppStore } from "../../app/StoreContext";
import { StudyService } from "./studyService";

export function StudyQuickForm({ onSaved }: { onSaved: () => void }) {
  const { store } = useAppStore();
  const [kind, setKind] = useState<"none" | "study" | "screen">("none");
  const [studyMin, setStudyMin] = useState("");
  const [screenMin, setScreenMin] = useState("");
  const [message, setMessage] = useState("");
  const service = new StudyService(store);

  return (
    <div>
      <p className="empty">Manually recorded. AURA does not measure device usage.</p>
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
            onSaved();
          }
        }}
      >
        <label>
          Study minutes
          <input aria-label="Study minutes" value={studyMin} onChange={(e) => setStudyMin(e.target.value)} />
        </label>
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
            onSaved();
          }
        }}
      >
        <label>
          Screen minutes
          <input aria-label="Screen minutes" value={screenMin} onChange={(e) => setScreenMin(e.target.value)} />
        </label>
        <button type="submit">Save screen time</button>
      </form>
      {message ? <p className={kind === "none" ? "empty" : "error"}>{message}</p> : null}
    </div>
  );
}
