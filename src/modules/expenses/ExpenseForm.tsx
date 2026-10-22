import { useState } from "react";
import { localToday } from "../../domain/dates";
import type { ExpenseCategory } from "../../domain/types";
import { useAppStore } from "../../app/StoreContext";
import { ExpenseService } from "./expenseService";

export function ExpenseForm({ onSaved }: { onSaved: () => void }) {
  const { store } = useAppStore();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(localToday());
  const [category, setCategory] = useState<ExpenseCategory | "">("");
  const [message, setMessage] = useState("");

  function submit() {
    const result = new ExpenseService(store).create({
      description,
      amount: Number(amount),
      date,
      category: category || undefined,
    });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage("");
    setDescription("");
    setAmount("");
    onSaved();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Amount
        <input
          aria-label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="₹"
        />
      </label>
      <label>
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory | "")}>
          <option value="">Auto</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
      </label>
      {message ? <p className="error">{message}</p> : null}
      <button type="submit">Save expense</button>
    </form>
  );
}
