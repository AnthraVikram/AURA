import { OverviewService } from "../../src/app/overviewService";
import { DailyLogService } from "../../src/modules/daily-log/dailyLogService";
import { ExpenseService } from "../../src/modules/expenses/expenseService";
import { HealthService } from "../../src/modules/health/healthService";
import { StudyService } from "../../src/modules/study/studyService";
import { MemoryStore } from "../../src/storage/memoryStore";

test("overview lists real records and updates after delete", () => {
  const store = new MemoryStore();
  const overview = new OverviewService(store);
  expect(overview.dailyOverview()).toHaveLength(0);
  new ExpenseService(store).create({ description: "Tea", amount: 12 });
  new DailyLogService(store).create({ text: "Note" });
  new HealthService(store).createCardio({ type: "running", durationMinutes: 20 });
  new StudyService(store).createStudy({ durationMinutes: 15 });
  const ids = overview.dailyOverview().map((i) => i.id);
  expect(ids.length).toBeGreaterThanOrEqual(4);
  const expense = store.load().expenses[0];
  new ExpenseService(store).delete(expense.id);
  expect(overview.dailyOverview().some((i) => i.id === expense.id)).toBe(false);
  expect(overview.dailyOverview().every((i) => i.label.length > 0)).toBe(true);
});
