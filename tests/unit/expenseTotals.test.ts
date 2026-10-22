import { addDays, localToday } from "../../src/domain/dates";
import { expenseTotals } from "../../src/domain/expenseTotals";
import type { Expense } from "../../src/domain/types";

function exp(amount: number, date: string): Expense {
  return {
    id: date + amount,
    description: "x",
    amount,
    category: "other",
    date,
    createdAt: "",
    updatedAt: "",
  };
}

test("today week overall totals", () => {
  const today = localToday();
  const rows = [exp(10, today), exp(5, addDays(today, -2)), exp(7, addDays(today, -10))];
  const t = expenseTotals(rows, today);
  expect(t.today).toBe(10);
  expect(t.week).toBe(15);
  expect(t.overall).toBe(22);
});
