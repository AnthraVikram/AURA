import { OverviewService } from "./overviewService";
import { useAppStore } from "./StoreContext";

export function DailyOverview() {
  const { store, revision } = useAppStore();
  void revision;
  const items = new OverviewService(store).dailyOverview();
  return (
    <aside className="card" aria-label="Daily overview">
      <h2>Today</h2>
      {items.length === 0 ? (
        <p className="empty">Nothing recorded for today.</p>
      ) : (
        <ul>
          {items.map((i) => (
            <li key={`${i.kind}-${i.id}`} className={i.incomplete ? "incomplete" : undefined}>
              {i.label}
              {i.incomplete ? " (incomplete)" : ""}
            </li>
          ))}
        </ul>
      )}
      <p className="empty">Records stay on this device. They are not synced to the cloud or another device.</p>
    </aside>
  );
}
