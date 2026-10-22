import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { handleChat } from "../../src/chat/handleChat";
import { HealthService } from "../../src/modules/health/healthService";
import { MemoryStore } from "../../src/storage/memoryStore";
import { renderWithStore } from "./helpers";

test("health page and chat list without medical wording", async () => {
  const user = userEvent.setup();
  const store = new MemoryStore();
  renderWithStore(store, "/health");
  await user.selectOptions(screen.getByLabelText("Workout type"), "shoulders");
  await user.type(screen.getByLabelText("Exercise name"), "OHP");
  await user.click(screen.getByRole("button", { name: "Save workout" }));
  expect(screen.getAllByText(/shoulders/i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/diagnos/i)).not.toBeInTheDocument();
  const missing = new HealthService(store).deleteWorkout("nope");
  expect(missing.ok).toBe(false);
  handleChat("show me my recent workouts", store);
});
