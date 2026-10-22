import { useState } from "react";
import { localToday } from "../../domain/dates";
import type { CompletionStatus, DailyLogCategory } from "../../domain/types";
import { DailyLogService } from "./dailyLogService";
import { useAppStore } from "../../app/StoreContext";

export function DailyLogForm({ onSaved }: { onSaved: () => void }) {
  const { store } = useAppStore();
  const [text, setText] = useState("");
  const [date, setDate] = useState(localToday());
  const [category, setCategory] = useState<DailyLogCategory | "">("");
  const [status, setStatus] = useState<CompletionStatus | "">("");
  const [message, setMessage] = useState("");

  function submit() {
    const result = new DailyLogService(store).create({
      text,
      date,
      category: category || undefined,
      status: status || undefined,
    });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage("");
    setText("");
    onSaved();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label>
        Note
        <textarea aria-label="Daily Log text" value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label>
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Category
        <select
          aria-label="Daily Log category"
          value={category}
          onChange={(e) => setCategory(e.target.value as DailyLogCategory | "")}
        >
          <option value="">None</option>
          <option value="activity">Activity</option>
          <option value="health">Health</option>
          <option value="plan">Plan</option>
          <option value="learning">Learning</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value as CompletionStatus | "")}>
          <option value="">Default</option>
          <option value="complete">Complete</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </label>
      {message ? <p className="error">{message}</p> : null}
      <button type="submit">Save entry</button>
    </form>
  );
}
