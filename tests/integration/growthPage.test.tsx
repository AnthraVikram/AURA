import { screen } from "@testing-library/react";
import { renderWithStore } from "./helpers";

test("growth themes and destination labels", () => {
  renderWithStore(undefined, "/growth");
  expect(screen.getByText(/Curated resources/i)).toBeInTheDocument();
  expect(screen.getByText(/Confidence and communication/i)).toBeInTheDocument();
  expect(screen.getAllByText(/YouTube/i).length).toBeGreaterThan(0);
});
