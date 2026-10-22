import type { ExpenseCategory } from "./types";

const MAP: Record<string, ExpenseCategory> = {
  coffee: "food",
  snacks: "food",
  lunch: "food",
  dinner: "food",
  breakfast: "food",
  swiggy: "food",
  zomato: "food",
  uber: "transport",
  ola: "transport",
  metro: "transport",
  fuel: "transport",
  petrol: "transport",
  amazon: "shopping",
  groceries: "shopping",
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  bills: "Bills",
  health: "Health",
  education: "Education",
  other: "Other",
};

export function expenseCategoryLabel(category: ExpenseCategory): string {
  return EXPENSE_CATEGORY_LABELS[category];
}

export function inferExpenseCategory(description: string): ExpenseCategory {
  const words = description.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  for (const w of words) {
    if (MAP[w]) return MAP[w];
  }
  return "other";
}
