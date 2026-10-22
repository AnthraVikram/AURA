export function validateExpenseAmount(amount: unknown): string | null {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return "Amount must be a number greater than zero.";
  }
  return null;
}

export function validateDescription(description: string): string | null {
  if (!description.trim()) return "Description is required.";
  return null;
}
