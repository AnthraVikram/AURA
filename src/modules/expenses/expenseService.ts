import { inferExpenseCategory } from "../../domain/expenseCategories";
import { expenseTotals } from "../../domain/expenseTotals";
import { validateDescription, validateExpenseAmount } from "../../domain/expenseValidation";
import { isoNow, localToday, newId } from "../../domain/dates";
import { err, ok, type Result } from "../../domain/result";
import type { Expense, ExpenseCategory } from "../../domain/types";
import { StorageError } from "../../storage/types";
import type { Store } from "../../storage/types";

export class ExpenseService {
  constructor(private store: Store) {}

  create(input: {
    description: string;
    amount: number;
    category?: ExpenseCategory;
    date?: string;
  }): Result<Expense> {
    const descErr = validateDescription(input.description);
    if (descErr) return err("validation", descErr);
    const amtErr = validateExpenseAmount(input.amount);
    if (amtErr) return err("validation", amtErr);
    const now = isoNow();
    const record: Expense = {
      id: newId(),
      description: input.description.trim(),
      amount: input.amount,
      category: input.category ?? inferExpenseCategory(input.description),
      date: input.date ?? localToday(),
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc.expenses.push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  update(id: string, patch: Partial<Pick<Expense, "description" | "amount" | "category" | "date">>): Result<Expense> {
    try {
      const doc = this.store.load();
      const idx = doc.expenses.findIndex((e) => e.id === id);
      if (idx < 0) return err("not_found", "That expense was not found.");
      const next = { ...doc.expenses[idx], ...patch, updatedAt: isoNow() };
      if (patch.description !== undefined) {
        const d = validateDescription(patch.description);
        if (d) return err("validation", d);
        next.description = patch.description.trim();
      }
      if (patch.amount !== undefined) {
        const a = validateExpenseAmount(patch.amount);
        if (a) return err("validation", a);
      }
      doc.expenses[idx] = next;
      this.store.save(doc);
      return ok(next);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  list(): Expense[] {
    return this.store.load().expenses;
  }

  totals() {
    return expenseTotals(this.list());
  }

  delete(id: string): Result<{ id: string }> {
    try {
      const doc = this.store.load();
      const next = doc.expenses.filter((e) => e.id !== id);
      if (next.length === doc.expenses.length) return err("not_found", "That expense was not found.");
      doc.expenses = next;
      this.store.save(doc);
      return ok({ id });
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }
}
