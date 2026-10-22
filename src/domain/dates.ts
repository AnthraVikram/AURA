export function localToday(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isoNow(now = new Date()): string {
  return now.toISOString();
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return localToday(dt);
}

export function isWithinLastDays(dateStr: string, days: number, today = localToday()): boolean {
  for (let i = 0; i < days; i += 1) {
    if (addDays(today, -i) === dateStr) return true;
  }
  return false;
}

export function lastNDates(n: number, today = localToday()): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, -i));
}

export function newId(): string {
  return crypto.randomUUID();
}
