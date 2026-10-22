import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryStore } from "../../src/storage/memoryStore";
import { renderWithStore } from "./helpers";

test("expense form create totals and invalid amount", async () => {
  const user = userEvent.setup();
  renderWithStore(new MemoryStore(), "/expenses");
  await user.type(screen.getByLabelText("Description"), "Metro");
  await user.type(screen.getByLabelText("Amount"), "50");
  await user.click(screen.getByRole("button", { name: "Save expense" }));
  expect(screen.getByText(/Recorded spending today/)).toHaveTextContent("50");
  await user.type(screen.getByLabelText("Description"), "Bad");
  await user.type(screen.getByLabelText("Amount"), "0");
  await user.click(screen.getByRole("button", { name: "Save expense" }));
  expect(screen.getByText(/greater than zero/i)).toBeInTheDocument();
});
