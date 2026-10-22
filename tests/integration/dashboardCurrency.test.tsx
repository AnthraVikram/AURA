import { screen } from "@testing-library/react";
import { ExpenseService } from "../../src/modules/expenses/expenseService";
import { MemoryStore } from "../../src/storage/memoryStore";
import { renderWithStore } from "./helpers";

test("dashboard expenses use INR by default and match saved totals", () => {
  const store = new MemoryStore();
  expect(store.load().preferences.currencySymbol).toBe("₹");
  new ExpenseService(store).create({ description: "Tea", amount: 1250 });
  renderWithStore(store, "/");
  expect(screen.getAllByText(/₹1,250/).length).toBeGreaterThan(0);
  expect(screen.queryByText(/\$1,250/)).not.toBeInTheDocument();
  expect(screen.getByText(/other ₹1,250/i)).toBeInTheDocument();
});
