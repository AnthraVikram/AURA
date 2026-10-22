import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithStore } from "./helpers";

test("study page manual labels", async () => {
  const user = userEvent.setup();
  renderWithStore(undefined, "/study");
  await user.selectOptions(screen.getByLabelText("Study activity"), "study");
  await user.type(screen.getByLabelText("Study minutes"), "40");
  await user.click(screen.getByRole("button", { name: "Save study session" }));
  expect(screen.getAllByText(/manual/i).length).toBeGreaterThan(0);
  expect(screen.queryByText(/automatically measured/i)).not.toBeInTheDocument();
});
