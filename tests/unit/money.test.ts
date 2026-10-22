import { createEmptyDocument } from "../../src/domain/emptyDocument";
import { DEFAULT_CURRENCY_SYMBOL, formatMoney } from "../../src/domain/money";

test("new documents default to INR and never format with $ unless configured", () => {
  expect(createEmptyDocument().preferences.currencySymbol).toBe(DEFAULT_CURRENCY_SYMBOL);
  expect(formatMoney(1250)).toBe("₹1,250");
  expect(formatMoney(80)).toBe("₹80");
  expect(formatMoney(80.5)).toBe("₹80.50");
  expect(formatMoney(80, "$")).toBe("$80");
});
