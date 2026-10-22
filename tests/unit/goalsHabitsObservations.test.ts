import { MemoryStore } from "../../src/storage/memoryStore";
import { GoalsService } from "../../src/modules/goals/goalsService";
import { OverviewService } from "../../src/app/overviewService";

test("goal title required and habit counts / delete", () => {
  const store = new MemoryStore();
  const svc = new GoalsService(store);
  expect(svc.createGoal({ title: "  " }).ok).toBe(false);
  const g = svc.createGoal({ title: "Run" });
  expect(g.ok).toBe(true);
  const h = svc.createHabit("Water");
  expect(h.ok).toBe(true);
  if (!h.ok) return;
  svc.setHabitDone(h.record.id, "2026-10-21", true);
  const counts = svc.habitCounts(h.record.id);
  expect(counts.ok).toBe(true);
  expect(svc.deleteHabit(h.record.id).ok).toBe(true);
  expect(svc.deleteHabit(h.record.id).ok).toBe(false);
  const missing = svc.deleteHabit("missing");
  expect(missing.ok).toBe(false);
  if (!missing.ok) expect(missing.error).toBe("not_found");
});

test("not enough information when fewer than 7 dates", () => {
  const notes = new OverviewService(new MemoryStore()).observations();
  expect(notes.some((n) => n.toLowerCase().includes("not enough information"))).toBe(true);
});
