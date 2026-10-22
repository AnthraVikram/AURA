import { lastNDates, localToday } from "./dates";
import type { AppDocument, Expense, ExpenseCategory, WeightEntry, WeightUnit } from "./types";

export type DayAmount = { date: string; amount: number };
export type DayCount = { date: string; count: number };
export type CategoryAmount = { category: ExpenseCategory; amount: number };

export function dailyExpenseSeries(expenses: Expense[], days = 7, today = localToday()): DayAmount[] {
  return lastNDates(days, today)
    .slice()
    .reverse()
    .map((date) => ({
      date,
      amount: expenses.filter((e) => e.date === date).reduce((s, e) => s + e.amount, 0),
    }));
}

export function expenseCategoryTotals(expenses: Expense[]): CategoryAmount[] {
  const map = new Map<ExpenseCategory, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function movementByDay(doc: AppDocument, days = 7, today = localToday()): DayCount[] {
  return lastNDates(days, today)
    .slice()
    .reverse()
    .map((date) => ({
      date,
      count:
        doc.workoutSessions.filter((w) => w.date === date).length +
        doc.cardioSessions.filter((c) => c.date === date).length,
    }));
}

export function timedByDay(
  rows: { date: string; durationMinutes: number }[],
  days = 7,
  today = localToday(),
): { date: string; minutes: number }[] {
  return lastNDates(days, today)
    .slice()
    .reverse()
    .map((date) => ({
      date,
      minutes: rows.filter((r) => r.date === date).reduce((s, r) => s + r.durationMinutes, 0),
    }));
}

export function weightTrend(entries: WeightEntry[]): {
  unit: WeightUnit;
  points: { date: string; value: number }[];
} | null {
  const byUnit = new Map<WeightUnit, WeightEntry[]>();
  for (const e of entries) {
    const list = byUnit.get(e.unit) ?? [];
    list.push(e);
    byUnit.set(e.unit, list);
  }
  let best: { unit: WeightUnit; points: WeightEntry[] } | null = null;
  for (const [unit, list] of byUnit) {
    if (list.length >= 2 && (!best || list.length > best.points.length)) {
      best = { unit, points: list };
    }
  }
  if (!best) return null;
  const points = [...best.points]
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))
    .map((e) => ({ date: e.date, value: e.value }));
  return { unit: best.unit, points };
}

export function formatShortDate(date: string): string {
  const d = date.slice(8, 10);
  return d.startsWith("0") ? d.slice(1) : d;
}
