import { formatMoney } from "../../domain/money";
import { ExpenseService } from "./expenseService";
import { useAppStore } from "../../app/StoreContext";

export function ExpenseTotals() {
  const { store, revision } = useAppStore();
  void revision;
  const t = new ExpenseService(store).totals();
  const symbol = store.load().preferences.currencySymbol;
  return (
    <div>
      <p>Recorded spending today: {formatMoney(t.today, symbol)}</p>
      <p>Recorded spending this week (last 7 days): {formatMoney(t.week, symbol)}</p>
      <p>Recorded spending overall: {formatMoney(t.overall, symbol)}</p>
    </div>
  );
}
