import { screen } from "@testing-library/react";
import { renderWithStore } from "./helpers";

test("settings has no light or vacation mode", () => {
  renderWithStore(undefined, "/settings");
  expect(screen.queryByText(/Light Mode/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Vacation Mode/i)).not.toBeInTheDocument();
  expect(screen.getByLabelText("Currency symbol")).toHaveValue("₹");
});
