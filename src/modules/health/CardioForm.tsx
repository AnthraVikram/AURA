import { useState } from "react";
import { useAppStore } from "../../app/StoreContext";
import type { CardioType } from "../../domain/types";
import { HealthService } from "./healthService";

export function CardioForm({ onSaved }: { onSaved: () => void }) {
  const { store } = useAppStore();
  const [type, setType] = useState<CardioType | "">("");
  const [minutes, setMinutes] = useState("");
  const [message, setMessage] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!type) {
          setMessage("None selected — no cardio session was saved.");
          return;
        }
        const result = new HealthService(store).createCardio({
          type,
          durationMinutes: Number(minutes),
        });
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        setMessage("");
        setMinutes("");
        setType("");
        onSaved();
      }}
    >
      <h3>Cardio</h3>
      <label>
        Cardio type
        <select
          aria-label="Cardio type"
          value={type}
          onChange={(e) => setType(e.target.value as CardioType | "")}
        >
          <option value="">None</option>
          <option value="running">Running</option>
          <option value="skipping">Skipping</option>
        </select>
      </label>
      <input aria-label="Cardio minutes" placeholder="Minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
      {message ? <p className={type ? "error" : "empty"}>{message}</p> : null}
      <button type="submit">Save cardio</button>
    </form>
  );
}
