import { isWithinLastDays, localToday } from "./dates";
import type { Expense } from "./types";

export function expenseTotals(expenses: Expense[], today = localToday()) {
  const todaySum = expenses
    .filter((e) => e.date === today)
    .reduce((s, e) => s + e.amount, 0);
  const week = expenses
    .filter((e) => isWithinLastDays(e.date, 7, today))
    .reduce((s, e) => s + e.amount, 0);
  const overall = expenses.reduce((s, e) => s + e.amount, 0);
  return { today: todaySum, week, overall };
}
