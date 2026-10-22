import { useState } from "react";
import { useAppStore } from "../../app/StoreContext";
import type { WorkoutType } from "../../domain/types";
import { HealthService } from "./healthService";

export function WorkoutForm({ onSaved }: { onSaved: () => void }) {
  const { store } = useAppStore();
  const unit = store.load().preferences.weightUnit;
  const [type, setType] = useState<WorkoutType | "">("");
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("8");
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!type) {
          setMessage("None selected — no workout was saved.");
          return;
        }
        const w = weight === "" ? null : Number(weight);
        const result = new HealthService(store).createWorkout({
          type,
          exercises: [
            {
              name,
              sets: Number(sets),
              repetitions: Number(reps),
              weight: w,
              weightUnit: w === null ? null : unit,
            },
          ],
        });
        if (!result.ok) {
          setMessage(result.message);
          return;
        }
        setMessage("");
        setName("");
        setType("");
        onSaved();
      }}
    >
      <h3>Gym</h3>
      <label>
        Workout type
        <select
          aria-label="Workout type"
          value={type}
          onChange={(e) => setType(e.target.value as WorkoutType | "")}
        >
          <option value="">None</option>
          <option value="leg_day">Leg Day</option>
          <option value="back_and_biceps">Back and Biceps</option>
          <option value="chest_and_triceps">Chest and Triceps</option>
          <option value="shoulders">Shoulders</option>
        </select>
      </label>
      <input aria-label="Exercise name" placeholder="Exercise" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Sets" value={sets} onChange={(e) => setSets(e.target.value)} />
      <input aria-label="Repetitions" value={reps} onChange={(e) => setReps(e.target.value)} />
      <input aria-label="Weight" placeholder={`Weight (${unit})`} value={weight} onChange={(e) => setWeight(e.target.value)} />
      {message ? <p className={type ? "error" : "empty"}>{message}</p> : null}
      <button type="submit">Save workout</button>
    </form>
  );
}
