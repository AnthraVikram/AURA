import { screen } from "@testing-library/react";
import { renderWithStore } from "./helpers";

test("empty area routes have no sample personal data", () => {
  renderWithStore(undefined, "/expenses");
  expect(screen.getByText(/No expenses recorded yet/i)).toBeInTheDocument();
  expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
});
