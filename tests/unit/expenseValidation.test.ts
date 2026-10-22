import { validateDescription, validateExpenseAmount } from "../../src/domain/expenseValidation";

test("amount must be finite and > 0", () => {
  expect(validateExpenseAmount(80)).toBeNull();
  expect(validateExpenseAmount(0)).toBeTruthy();
  expect(validateExpenseAmount(-1)).toBeTruthy();
  expect(validateExpenseAmount(NaN)).toBeTruthy();
});

test("description trimmed non-empty", () => {
  expect(validateDescription("  ")).toBeTruthy();
  expect(validateDescription("Coffee")).toBeNull();
});
