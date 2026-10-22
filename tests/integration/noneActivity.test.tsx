import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryStore } from "../../src/storage/memoryStore";
import { renderWithStore } from "./helpers";

test("None on workout and study does not create records", async () => {
  const user = userEvent.setup();
  const store = new MemoryStore();
  renderWithStore(store, "/health");
  expect(screen.getByLabelText("Workout type")).toHaveDisplayValue("None");
  await user.click(screen.getByRole("button", { name: "Save workout" }));
  expect(screen.getByText(/no workout was saved/i)).toBeInTheDocument();
  expect(store.load().workoutSessions).toHaveLength(0);
  expect(store.load().cardioSessions).toHaveLength(0);
});

test("None on study activity does not create a session", async () => {
  const user = userEvent.setup();
  const store = new MemoryStore();
  renderWithStore(store, "/study");
  expect(screen.getByLabelText("Study activity")).toHaveDisplayValue("None");
  await user.type(screen.getByLabelText("Study minutes"), "40");
  await user.click(screen.getByRole("button", { name: "Save study session" }));
  expect(screen.getByText(/no study session was saved/i)).toBeInTheDocument();
  expect(store.load().studySessions).toHaveLength(0);
  expect(store.load().screenTimeEntries).toHaveLength(0);
});

test("check-in None does not invent a workout record", async () => {
  const user = userEvent.setup();
  const store = new MemoryStore();
  const before = JSON.stringify(store.load());
  renderWithStore(store, "/");
  await user.click(screen.getByRole("button", { name: "None (workout)" }));
  expect(screen.getByText(/not saved as an activity/i)).toBeInTheDocument();
  expect(JSON.stringify(store.load())).toBe(before);
});
