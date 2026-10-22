import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithStore } from "./helpers";

test("suggestions do not apply until accept and habit delete", async () => {
  const user = userEvent.setup();
  renderWithStore(undefined, "/goals");
  await user.type(screen.getByLabelText("Habit name"), "Read");
  await user.click(screen.getByRole("button", { name: "Add habit" }));
  expect(screen.getByText(/Read/)).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Delete habit" }));
  expect(screen.queryByText(/Read —/)).not.toBeInTheDocument();
});
