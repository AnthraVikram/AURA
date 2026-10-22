import type { CompletionStatus, DailyLogCategory } from "./types";

export function inferDailyLogCategory(text: string): DailyLogCategory {
  const t = text.toLowerCase();
  if (/\b(health|gym|run|weight|workout|cardio)\b/.test(t)) return "health";
  if (/\b(plan|todo|tomorrow|study plan)\b/.test(t) || /^plan\b/.test(t)) return "plan";
  if (/\b(learn|course|read)\b/.test(t)) return "learning";
  if (/\b(went|did|workout)\b/.test(t)) return "activity";
  return "other";
}

export function defaultDailyLogStatus(
  category: DailyLogCategory,
  date: string,
  today: string,
): CompletionStatus {
  if (category === "plan" && date >= today) return "incomplete";
  return "complete";
}
