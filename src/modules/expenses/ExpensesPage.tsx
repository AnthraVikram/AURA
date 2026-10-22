import { expenseCategoryLabel } from "../../domain/expenseCategories";
import { formatMoney } from "../../domain/money";
import { useAppStore } from "../../app/StoreContext";
import type { ExpenseCategory } from "../../domain/types";
import { ExpenseForm } from "./ExpenseForm";
import { ExpenseService } from "./expenseService";
import { ExpenseTotals } from "./ExpenseTotals";

export function ExpensesPage() {
  const { store, bump, revision } = useAppStore();
  void revision;
  const service = new ExpenseService(store);
  const rows = service.list();
  const symbol = store.load().preferences.currencySymbol;

  return (
    <section>
      <h2>Expenses</h2>
      <ExpenseForm onSaved={bump} />
      <ExpenseTotals />
      {rows.length === 0 ? (
        <p className="empty">No expenses recorded yet.</p>
      ) : (
        <ul>
          {rows.map((r) => (
            <li key={r.id}>
              {r.description} {formatMoney(r.amount, symbol)} · {expenseCategoryLabel(r.category)} · {r.date}
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const next = window.prompt("Amount", String(r.amount));
                  if (next == null) return;
                  const result = service.update(r.id, { amount: Number(next) });
                  if (!result.ok) window.alert(result.message);
                  bump();
                }}
              >
                Edit
              </button>
              <select
                aria-label={`Category for ${r.description}`}
                value={r.category}
                onChange={(e) => {
                  service.update(r.id, { category: e.target.value as ExpenseCategory });
                  bump();
                }}
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const result = service.delete(r.id);
                  if (!result.ok) window.alert(result.message);
                  bump();
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
