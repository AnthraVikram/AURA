import { dailyExpenseSeries, expenseCategoryTotals, weightTrend } from "../../src/domain/dashboardStats";
import type { Expense, WeightEntry } from "../../src/domain/types";

test("weekly expense series uses real amounts and zeros for days without records", () => {
  const expenses: Expense[] = [
    {
      id: "1",
      description: "Tea",
      amount: 12,
      category: "food",
      date: "2026-10-21",
      createdAt: "t",
      updatedAt: "t",
    },
  ];
  const series = dailyExpenseSeries(expenses, 7, "2026-10-21");
  expect(series).toHaveLength(7);
  expect(series[6]).toEqual({ date: "2026-10-21", amount: 12 });
  expect(series[0].amount).toBe(0);
  expect(expenseCategoryTotals(expenses)).toEqual([{ category: "food", amount: 12 }]);
});

test("weight trend requires two points of the same stored unit", () => {
  const mixed: WeightEntry[] = [
    { id: "1", value: 70, unit: "kg", date: "2026-10-01", createdAt: "t", updatedAt: "t" },
    { id: "2", value: 154, unit: "lb", date: "2026-10-02", createdAt: "t", updatedAt: "t" },
  ];
  expect(weightTrend(mixed)).toBeNull();
  const kg: WeightEntry[] = [
    ...mixed,
    { id: "3", value: 69.5, unit: "kg", date: "2026-10-08", createdAt: "t", updatedAt: "t" },
  ];
  const trend = weightTrend(kg);
  expect(trend?.unit).toBe("kg");
  expect(trend?.points.map((p) => p.value)).toEqual([70, 69.5]);
});
