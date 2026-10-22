import { handleChat } from "../../src/chat/handleChat";
import { DailyLogService } from "../../src/modules/daily-log/dailyLogService";
import { ExpenseService } from "../../src/modules/expenses/expenseService";
import { MemoryStore } from "../../src/storage/memoryStore";

test("log write, totals match, empty summary, unsupported unknown no writes", () => {
  const store = new MemoryStore();
  expect(handleChat("summarise my day", store).aura.text.toLowerCase()).toMatch(/nothing was recorded/);
  handleChat("I went to the gym today", store);
  expect(new DailyLogService(store).listByDate(store.load().dailyLogEntries[0].date).length).toBe(1);
  handleChat("Coffee 80", store);
  const t = new ExpenseService(store).totals();
  const week = handleChat("how much have I spent this week", store);
  expect(week.aura.text).toContain(String(t.week));
  const before = store.load().expenses.length;
  const un = handleChat("create a calendar event", store);
  expect(un.aura.outcome).toBe("unsupported");
  expect(un.aura.text.toLowerCase()).toContain("add an expense");
  expect(store.load().expenses.length).toBe(before);
  const unk = handleChat("asdfqwer", store);
  expect(unk.aura.outcome).toBe("unknown");
  expect(unk.aura.text.toLowerCase()).toContain("did not understand");
});
