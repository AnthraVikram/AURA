import { addDays, localToday } from "../../src/domain/dates";
import { defaultDailyLogStatus, inferDailyLogCategory } from "../../src/domain/dailyLogRules";

test("keyword category hints", () => {
  expect(inferDailyLogCategory("gym session")).toBe("health");
  expect(inferDailyLogCategory("plan to study tomorrow")).toBe("plan");
  expect(inferDailyLogCategory("read a course")).toBe("learning");
  expect(inferDailyLogCategory("I went to the park")).toBe("activity");
});

test("plan for today or later defaults incomplete", () => {
  const today = localToday();
  expect(defaultDailyLogStatus("plan", today, today)).toBe("incomplete");
  expect(defaultDailyLogStatus("plan", addDays(today, 1), today)).toBe("incomplete");
  expect(defaultDailyLogStatus("activity", today, today)).toBe("complete");
});
