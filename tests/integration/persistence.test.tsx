import { screen } from "@testing-library/react";
import { ExpenseService } from "../../src/modules/expenses/expenseService";
import { LocalDocumentStore } from "../../src/storage/localDocumentStore";
import { MemoryStore } from "../../src/storage/memoryStore";
import { renderWithStore } from "./helpers";

test("write then new store instance restores record and no sync claim", () => {
  const mem = new MemoryStore();
  new ExpenseService(mem).create({ description: "Tea", amount: 40 });
  const json = JSON.stringify(mem.load());
  const storage: Storage = {
    get length() {
      return 1;
    },
    clear() {},
    getItem: () => json,
    key: () => "aura.v1",
    removeItem() {},
    setItem() {},
  };
  const restored = new LocalDocumentStore(storage).load();
  expect(restored.expenses[0].description).toBe("Tea");
  expect("chatMessages" in restored).toBe(false);
  renderWithStore();
  expect(screen.getByText(/not synced to the cloud/i)).toBeInTheDocument();
});
