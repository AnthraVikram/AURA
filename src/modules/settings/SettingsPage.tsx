import { useState } from "react";
import { useAppStore } from "../../app/StoreContext";
import type { WeightUnit } from "../../domain/types";
import { PreferencesService } from "./preferencesService";

export function SettingsPage() {
  const { store, bump, revision } = useAppStore();
  void revision;
  const service = new PreferencesService(store);
  const prefs = service.get();
  const [name, setName] = useState(prefs.displayName);
  const [symbol, setSymbol] = useState(prefs.currencySymbol);
  const [unit, setUnit] = useState<WeightUnit>(prefs.weightUnit);
  const [message, setMessage] = useState("");

  return (
    <section>
      <h2>Settings</h2>
      <p className="empty">
        Data is stored only in this browser on this device. Clearing site data deletes records. AURA does not
        sync to your iPad or the cloud in this release.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = service.save({ displayName: name, currencySymbol: symbol, weightUnit: unit });
          if (!result.ok) setMessage(result.message);
          else {
            setMessage("");
            bump();
          }
        }}
      >
        <label>
          Display name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Currency (default Indian rupees ₹)
          <input
            aria-label="Currency symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="₹"
          />
        </label>
        <p className="empty">New profiles use ₹. Amounts stay numeric; only the display symbol changes.</p>
        <label>
          Weight unit for new entries
          <select value={unit} onChange={(e) => setUnit(e.target.value as WeightUnit)}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </label>
        {message ? <p className="error">{message}</p> : null}
        <button type="submit">Save settings</button>
      </form>
    </section>
  );
}
