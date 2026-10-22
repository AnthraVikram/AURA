import { localToday } from "../domain/dates";
import { cardioTypeLabel, workoutTypeLabel } from "../domain/healthValidation";
import { formatMoney } from "../domain/money";
import type { OverviewItem } from "../domain/types";
import type { Store } from "../storage/types";

export class OverviewService {
  constructor(private store: Store) {}

  dailyOverview(today = localToday()): OverviewItem[] {
    const doc = this.store.load();
    const items: OverviewItem[] = [];
    for (const e of doc.dailyLogEntries) {
      if (e.date === today || (e.status === "incomplete" && e.date < today)) {
        items.push({
          kind: "daily-log",
          id: e.id,
          label: e.text,
          incomplete: e.status === "incomplete",
        });
      }
    }
    for (const e of doc.expenses.filter((x) => x.date === today)) {
      items.push({
        kind: "expense",
        id: e.id,
        label: `${e.description} ${formatMoney(e.amount, doc.preferences.currencySymbol)}`,
      });
    }
    for (const w of doc.workoutSessions.filter((x) => x.date === today)) {
      items.push({ kind: "workout", id: w.id, label: workoutTypeLabel(w.type) });
    }
    for (const c of doc.cardioSessions.filter((x) => x.date === today)) {
      items.push({ kind: "cardio", id: c.id, label: `${cardioTypeLabel(c.type)} ${c.durationMinutes} min` });
    }
    for (const w of doc.weightEntries.filter((x) => x.date === today)) {
      items.push({ kind: "weight", id: w.id, label: `${w.value} ${w.unit}` });
    }
    for (const s of doc.studySessions.filter((x) => x.date === today)) {
      items.push({ kind: "study", id: s.id, label: `Study ${s.durationMinutes} min (manual)` });
    }
    for (const s of doc.screenTimeEntries.filter((x) => x.date === today)) {
      items.push({
        kind: "screen",
        id: s.id,
        label: `Screen time ${s.durationMinutes} min (manual)`,
      });
    }
    return items;
  }

  summariseToday(today = localToday()): string {
    const todayItems = this.dailyOverview(today).filter((i) => {
      if (i.kind === "daily-log") {
        const e = this.store.load().dailyLogEntries.find((x) => x.id === i.id);
        return e?.date === today;
      }
      return true;
    });
    if (!todayItems.length) {
      return "Nothing was recorded for today.";
    }
    return `Today: ${todayItems.map((i) => i.label).join("; ")}.`;
  }

  observations(): string[] {
    const doc = this.store.load();
    const notes: string[] = [];
    const distinct = (dates: string[]) => new Set(dates).size;
    const expenseDays = distinct(doc.expenses.map((e) => e.date));
    notes.push(
      `Observation: ${doc.expenses.length} recorded expense(s); ${doc.dailyLogEntries.length} Daily Log entr${doc.dailyLogEntries.length === 1 ? "y" : "ies"}.`,
    );
    if (expenseDays < 7) {
      notes.push("Not enough information to talk about an expense pattern (fewer than 7 days with records).");
    }
    const workoutDays = distinct([
      ...doc.workoutSessions.map((w) => w.date),
      ...doc.cardioSessions.map((c) => c.date),
    ]);
    if (workoutDays < 7) {
      notes.push("Not enough information to talk about a workout pattern (fewer than 7 days with records).");
    }
    return notes;
  }
}
