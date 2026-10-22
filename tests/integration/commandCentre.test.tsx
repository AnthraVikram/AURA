import { screen } from "@testing-library/react";
import { renderWithStore } from "./helpers";

test("command centre shell", () => {
  renderWithStore();
  expect(screen.getByLabelText("Universal chat")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Daily Log" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Expenses" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Health/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Growth/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Study/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Goals/ })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();
  expect(screen.getByText(/Nothing recorded for today/i)).toBeInTheDocument();
  expect(screen.getByLabelText("Quick actions")).toBeInTheDocument();
  expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  expect(screen.queryByText(/sample user/i)).not.toBeInTheDocument();
});
