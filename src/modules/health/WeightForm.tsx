import { useState } from "react";
import { useAppStore } from "../../app/StoreContext";
import { HealthService } from "./healthService";

export function WeightForm({ onSaved }: { onSaved: () => void }) {
  const { store } = useAppStore();
  const unit = store.load().preferences.weightUnit;
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const result = new HealthService(store).createWeight({
          value: Number(value),
          unit,
        });
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        setMessage("");
        setValue("");
        onSaved();
      }}
    >
      <h3>Body weight</h3>
      <input aria-label="Body weight" placeholder={unit} value={value} onChange={(e) => setValue(e.target.value)} />
      <p className="empty">New entries use {unit}. Older rows keep the unit they were saved with. This is personal tracking, not a medical assessment.</p>
      {message ? <p className="error">{message}</p> : null}
      <button type="submit">Save weight</button>
    </form>
  );
}
