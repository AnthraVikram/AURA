import { addDays, localToday } from "../domain/dates";
import { inferExpenseCategory } from "../domain/expenseCategories";
import { GYM_TYPES, CARDIO_TYPES } from "../domain/healthValidation";
import { operationsListText } from "./supportedOperations";
import type { CardioType, WorkoutType } from "../domain/types";

export type ParseResult =
  | { kind: "intent"; type: string; payload: Record<string, unknown> }
  | { kind: "clarify"; message: string; partialType: string }
  | { kind: "unsupported"; message: string }
  | { kind: "unknown"; message: string };

const LATER = [
  /calendar/i,
  /pdf|statement/i,
  /strava/i,
  /fitness band/i,
  /screen time automatically|automatic screen/i,
  /email me|send email/i,
];

function unsupportedMessage(): string {
  return `That is not available yet. ${operationsListText()}`;
}

function unknownMessage(): string {
  return `I did not understand. ${operationsListText()}`;
}

function parseAmount(text: string): { amount: number; rest: string } | null {
  const rupee = text.match(/₹\s*(\d+(?:\.\d+)?)/);
  if (rupee) {
    return { amount: Number(rupee[1]), rest: text.replace(rupee[0], " ").replace(/\blog\b/i, " ") };
  }
  const end = text.match(/^(.*?)(\d+(?:\.\d+)?)\s*$/);
  if (end && end[1].trim()) {
    return { amount: Number(end[2]), rest: end[1] };
  }
  return null;
}

export function parseChat(
  input: string,
  context: { today?: string } = {},
): ParseResult {
  const raw = input.trim();
  if (!raw) {
    return { kind: "unknown", message: unknownMessage() };
  }
  const today = context.today ?? localToday();
  const lower = raw.toLowerCase();

  if (LATER.some((re) => re.test(raw))) {
    return { kind: "unsupported", message: unsupportedMessage() };
  }

  if (/how much.*(spent|spend)/i.test(lower) || /spending (today|this week|overall)/i.test(lower)) {
    let period: "today" | "week" | "overall" = "overall";
    if (/today/.test(lower)) period = "today";
    else if (/week/.test(lower)) period = "week";
    return { kind: "intent", type: "expense.totals", payload: { period } };
  }

  if (/recent expenses|list expenses/.test(lower)) {
    return { kind: "intent", type: "expense.listRecent", payload: { limit: 5 } };
  }

  if (/summarise my day|summarize my day|summarise today|summarize today/.test(lower)) {
    return { kind: "intent", type: "summary.today", payload: {} };
  }

  if (/recent workouts|show me my recent workouts/.test(lower)) {
    return { kind: "intent", type: "workout.listRecent", payload: { limit: 5 } };
  }

  if (/\b(weight|weigh)\b/.test(lower) && /\d/.test(lower)) {
    const n = lower.match(/(\d+(?:\.\d+)?)/);
    if (n) return { kind: "intent", type: "weight.add", payload: { value: Number(n[1]) } };
  }

  if (/study/.test(lower) && /(\d+)\s*(min|minute)/.test(lower)) {
    const n = lower.match(/(\d+)\s*(min|minute)/);
    if (n) {
      return {
        kind: "intent",
        type: "study.add",
        payload: { durationMinutes: Number(n[1]) },
      };
    }
  }

  if (/^add (a )?goal\b/i.test(raw) || /add a goal to /i.test(raw)) {
    const title = raw.replace(/^add (a )?goal( to|:?)\s*/i, "").trim();
    if (!title) {
      return { kind: "clarify", message: "What goal should I add?", partialType: "goal.add" };
    }
    return { kind: "intent", type: "goal.add", payload: { title } };
  }

  const gymMatch = lower.match(/leg day|back and biceps|chest and triceps|shoulders/);
  if (gymMatch && /set|rep/.test(lower)) {
    const typeMap: Record<string, WorkoutType> = {
      "leg day": "leg_day",
      "back and biceps": "back_and_biceps",
      "chest and triceps": "chest_and_triceps",
      shoulders: "shoulders",
    };
    const type = typeMap[gymMatch[0]];
    const sets = lower.match(/(\d+)\s*sets?/);
    const reps = lower.match(/(\d+)\s*reps?/);
    const name = raw.replace(/leg day|back and biceps|chest and triceps|shoulders/gi, "").trim() || "Exercise";
    if (!sets || !reps) {
      return {
        kind: "clarify",
        message: "I need at least one exercise with sets and repetitions.",
        partialType: "workout.addGym",
      };
    }
    if (!GYM_TYPES.includes(type)) {
      return { kind: "clarify", message: "Which gym day is this?", partialType: "workout.addGym" };
    }
    return {
      kind: "intent",
      type: "workout.addGym",
      payload: {
        type,
        exercises: [{ name, sets: Number(sets[1]), repetitions: Number(reps[1]), weight: null, weightUnit: null }],
      },
    };
  }

  if (/\b(running|skipping)\b/.test(lower) && /(\d+)\s*(min|minute)/.test(lower)) {
    const type = (lower.includes("skipping") ? "skipping" : "running") as CardioType;
    const n = lower.match(/(\d+)\s*(min|minute)/);
    if (CARDIO_TYPES.includes(type) && n) {
      return {
        kind: "intent",
        type: "workout.addCardio",
        payload: { type, durationMinutes: Number(n[1]) },
      };
    }
  }

  if (/mark .* (complete|incomplete)/i.test(raw)) {
    const status = /incomplete/i.test(raw) ? "incomplete" : "complete";
    const text = raw.replace(/mark/i, "").replace(/as (complete|incomplete)/i, "").replace(/(complete|incomplete)/i, "").trim();
    if (!text) {
      return {
        kind: "clarify",
        message: "Which Daily Log entry should I update?",
        partialType: "dailyLog.setStatus",
      };
    }
    return { kind: "intent", type: "dailyLog.setStatus", payload: { textMatch: text, status } };
  }

  if (/^(show|list|what).*daily log|daily log (for|today)/i.test(lower) || /entries for /i.test(lower)) {
    return { kind: "intent", type: "dailyLog.list", payload: { date: today } };
  }

  if (
    /^(i |add |log |plan )/i.test(raw) &&
    !/\d+(?:\.\d+)?\s*$/.test(raw) &&
    !/₹/.test(raw)
  ) {
    let date = today;
    let text = raw;
    if (/\btomorrow\b/i.test(raw)) {
      date = addDays(today, 1);
    }
    return { kind: "intent", type: "dailyLog.add", payload: { text, date } };
  }

  const amt = parseAmount(raw);
  if (amt) {
    const description = amt.rest.replace(/\bfor\b/gi, " ").replace(/₹/g, "").trim();
    if (!description) {
      return { kind: "clarify", message: "What was this expense for?", partialType: "expense.add" };
    }
    return {
      kind: "intent",
      type: "expense.add",
      payload: {
        description,
        amount: amt.amount,
        category: inferExpenseCategory(description),
      },
    };
  }

  if (
    /log |spent |pay |paid |expense/i.test(raw) ||
    inferExpenseCategory(raw) !== "other" ||
    /^snacks$/i.test(raw)
  ) {
    return {
      kind: "clarify",
      message: "I need an amount greater than zero for that expense.",
      partialType: "expense.add",
    };
  }

  return { kind: "unknown", message: unknownMessage() };
}
