import { handleChat } from "../../src/chat/handleChat";
import { ExpenseService } from "../../src/modules/expenses/expenseService";
import { MemoryStore } from "../../src/storage/memoryStore";
import { StorageError } from "../../src/storage/types";

test("handleChat persists expense and confirms with currency", () => {
  const store = new MemoryStore();
  const result = handleChat("Coffee 80", store);
  expect(result.aura.outcome).toBe("success");
  expect(result.aura.text).toContain("₹80");
  expect(new ExpenseService(store).list()).toHaveLength(1);
});

test("missing amount does not write", () => {
  const store = new MemoryStore();
  const result = handleChat("Snacks", store);
  expect(result.aura.outcome).toBe("clarification");
  expect(new ExpenseService(store).list()).toHaveLength(0);
});

test("storage error yields error outcome", () => {
  const store = new MemoryStore();
  store.save = () => {
    throw new StorageError("Save did not complete.");
  };
  const result = handleChat("Coffee 80", store);
  expect(result.aura.outcome).toBe("error");
  expect(result.aura.text.toLowerCase()).not.toMatch(/saved coffee/);
});
