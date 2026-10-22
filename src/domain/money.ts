export const DEFAULT_CURRENCY_SYMBOL = "₹";

/** Display-only. Amounts in storage stay numeric; missing prefs fall back to INR. */
export function currencySymbol(symbol: string | undefined | null): string {
  const trimmed = symbol?.trim();
  return trimmed || DEFAULT_CURRENCY_SYMBOL;
}

export function formatMoney(amount: number, symbol?: string | null): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
  return `${currencySymbol(symbol)}${formatted}`;
}
