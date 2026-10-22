import { cardioTypeLabel, workoutTypeLabel } from "../../domain/healthValidation";
import { useAppStore } from "../../app/StoreContext";
import { CardioForm } from "./CardioForm";
import { HealthService } from "./healthService";
import { WeightForm } from "./WeightForm";
import { WorkoutForm } from "./WorkoutForm";

export function HealthPage() {
  const { store, bump, revision } = useAppStore();
  void revision;
  const service = new HealthService(store);
  const recent = service.listRecent(20);
  const weights = service.listWeights();

  return (
    <section>
      <h2>Health and fitness</h2>
      <WorkoutForm onSaved={bump} />
      <CardioForm onSaved={bump} />
      <WeightForm onSaved={bump} />
      <h3>Sessions</h3>
      {recent.length === 0 ? (
        <p className="empty">No sessions recorded yet.</p>
      ) : (
        <ul>
          {recent.map((r) => (
            <li key={r.record.id}>
              {r.kind === "workout"
                ? `${workoutTypeLabel(r.record.type)} · ${r.record.exercises.map((e) => e.name).join(", ")}`
                : `${cardioTypeLabel(r.record.type)} · ${r.record.durationMinutes} min`}
            </li>
          ))}
        </ul>
      )}
      <h3>Weight history</h3>
      {weights.length === 0 ? (
        <p className="empty">No weight records yet.</p>
      ) : (
        <ul>
          {weights.map((w) => (
            <li key={w.id}>
              {w.value} {w.unit} on {w.date}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
