import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DailyLogService } from "../../src/modules/daily-log/dailyLogService";
import { HealthService } from "../../src/modules/health/healthService";
import { MemoryStore } from "../../src/storage/memoryStore";
import { renderWithStore } from "./helpers";

test("home empty states do not invent a score or a missed workout", () => {
  renderWithStore();
  expect(screen.getAllByText(/No workout logged yet/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Not enough data yet/i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/74\s*\/\s*100/)).not.toBeInTheDocument();
  expect(screen.queryByText(/sample user/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
});

test("productivity score appears after two recorded factors and updates", async () => {
  const user = userEvent.setup();
  const store = new MemoryStore();
  new DailyLogService(store).create({ text: "Plan notes", status: "complete" });
  new HealthService(store).createCardio({ type: "running", durationMinutes: 20 });
  renderWithStore(store);
  expect(screen.getByLabelText(/Productivity \d+ of 100/i)).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Add daily note" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});
