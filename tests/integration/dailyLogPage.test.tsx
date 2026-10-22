import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DailyLogService } from "../../src/modules/daily-log/dailyLogService";
import { MemoryStore } from "../../src/storage/memoryStore";
import { renderWithStore } from "./helpers";

test("create edit category incomplete empty date and multi-fact one entry", async () => {
  const user = userEvent.setup();
  const store = new MemoryStore();
  renderWithStore(store, "/daily-log");
  await user.type(screen.getByLabelText("Daily Log text"), "gym in the morning and dinner with family");
  await user.click(screen.getByRole("button", { name: "Save entry" }));
  expect(screen.getAllByText(/gym in the morning and dinner with family/).length).toBeGreaterThan(0);
  expect(new DailyLogService(store).listByDate(store.load().dailyLogEntries[0].date)).toHaveLength(1);
  await user.selectOptions(screen.getByLabelText(/Category for/), "plan");
  expect(store.load().dailyLogEntries[0].category).toBe("plan");
});
