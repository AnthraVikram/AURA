import { isoNow, newId } from "../domain/dates";
import type { ChatMessage, ChatOutcome } from "../domain/types";
import { DailyLogService } from "../modules/daily-log/dailyLogService";
import { ExpenseService } from "../modules/expenses/expenseService";
import { GoalsService } from "../modules/goals/goalsService";
import { HealthService } from "../modules/health/healthService";
import { StudyService } from "../modules/study/studyService";
import { OverviewService } from "../app/overviewService";
import { StorageError, type Store } from "../storage/types";
import { cardioTypeLabel, workoutTypeLabel } from "../domain/healthValidation";
import { formatMoney } from "../domain/money";
import { parseChat } from "./parseChat";
import type { CardioType, Exercise, WorkoutType } from "../domain/types";

export type ChatOutcomeResult = {
  user: ChatMessage;
  aura: ChatMessage;
};

function msg(
  role: "user" | "aura",
  text: string,
  outcome: ChatOutcome,
  intentType: string | null,
): ChatMessage {
  return {
    id: newId(),
    role,
    text,
    createdAt: isoNow(),
    outcome,
    intentType,
  };
}

export function handleChat(input: string, store: Store): ChatOutcomeResult {
  const user = msg("user", input.trim(), "none", null);
  const parsed = parseChat(input);
  const currency = store.load().preferences.currencySymbol;
  const expenses = new ExpenseService(store);
  const logs = new DailyLogService(store);
  const health = new HealthService(store);
  const study = new StudyService(store);
  const goals = new GoalsService(store);
  const overview = new OverviewService(store);

  const reply = (text: string, outcome: ChatOutcome, type: string | null): ChatOutcomeResult => ({
    user,
    aura: msg("aura", text, outcome, type),
  });

  try {
    if (parsed.kind === "clarify") {
      return reply(parsed.message, "clarification", parsed.partialType);
    }
    if (parsed.kind === "unsupported") {
      return reply(parsed.message, "unsupported", null);
    }
    if (parsed.kind === "unknown") {
      return reply(parsed.message, "unknown", null);
    }

    const { type, payload } = parsed;

    if (type === "expense.add") {
      const result = expenses.create({
        description: String(payload.description),
        amount: Number(payload.amount),
        category: payload.category as never,
      });
      if (!result.ok) return reply(result.message, result.error === "storage" ? "error" : "clarification", type);
      const e = result.record;
      return reply(
        `Saved ${e.description} ${formatMoney(e.amount, currency)} (${e.category}) on ${e.date}.`,
        "success",
        type,
      );
    }

    if (type === "expense.totals") {
      const t = expenses.totals();
      const period = String(payload.period);
      const value = period === "today" ? t.today : period === "week" ? t.week : t.overall;
      return reply(
        `Recorded spending ${period}: ${formatMoney(value, currency)}.`,
        "success",
        type,
      );
    }

    if (type === "expense.listRecent") {
      const list = expenses.list().slice(-Number(payload.limit ?? 5));
      if (!list.length) return reply("No expenses recorded.", "success", type);
      return reply(
        list.map((e) => `${e.description} ${formatMoney(e.amount, currency)}`).join("; "),
        "success",
        type,
      );
    }

    if (type === "dailyLog.add") {
      const result = logs.create({
        text: String(payload.text),
        date: payload.date ? String(payload.date) : undefined,
      });
      if (!result.ok) return reply(result.message, "error", type);
      const e = result.record;
      return reply(
        `Saved Daily Log (${e.category}, ${e.status}) on ${e.date}: ${e.text}`,
        "success",
        type,
      );
    }

    if (type === "dailyLog.list") {
      const date = String(payload.date);
      const rows = logs.listByDate(date);
      if (!rows.length) return reply(`No Daily Log entries for ${date}.`, "success", type);
      return reply(rows.map((r) => r.text).join("; "), "success", type);
    }

    if (type === "dailyLog.setStatus") {
      const match = String(payload.textMatch).toLowerCase();
      const matches = store
        .load()
        .dailyLogEntries.filter((e) => e.text.toLowerCase().includes(match));
      if (matches.length !== 1) {
        return reply("Which Daily Log entry did you mean?", "clarification", type);
      }
      const result = logs.setStatus(matches[0].id, payload.status as "complete" | "incomplete");
      if (!result.ok) return reply(result.message, "error", type);
      return reply(`Updated to ${result.record.status}.`, "success", type);
    }

    if (type === "summary.today") {
      return reply(overview.summariseToday(), "success", type);
    }

    if (type === "workout.addGym") {
      const result = health.createWorkout({
        type: payload.type as WorkoutType,
        exercises: payload.exercises as Exercise[],
      });
      if (!result.ok) return reply(result.message, "clarification", type);
      return reply(`Saved ${workoutTypeLabel(result.record.type)} workout.`, "success", type);
    }

    if (type === "workout.addCardio") {
      const result = health.createCardio({
        type: payload.type as CardioType,
        durationMinutes: Number(payload.durationMinutes),
      });
      if (!result.ok) return reply(result.message, "clarification", type);
      return reply(`Saved ${cardioTypeLabel(result.record.type)} for ${result.record.durationMinutes} minutes.`, "success", type);
    }

    if (type === "workout.listRecent") {
      const rows = health.listRecent(Number(payload.limit ?? 5));
      if (!rows.length) return reply("No workouts recorded.", "success", type);
      return reply(
        rows
          .map((r) =>
            r.kind === "workout"
              ? workoutTypeLabel(r.record.type)
              : `${cardioTypeLabel(r.record.type)} ${r.record.durationMinutes} min`,
          )
          .join("; "),
        "success",
        type,
      );
    }

    if (type === "weight.add") {
      const result = health.createWeight({ value: Number(payload.value) });
      if (!result.ok) return reply(result.message, "clarification", type);
      return reply(`Saved weight ${result.record.value} ${result.record.unit}.`, "success", type);
    }

    if (type === "study.add") {
      const result = study.createStudy({ durationMinutes: Number(payload.durationMinutes) });
      if (!result.ok) return reply(result.message, "clarification", type);
      return reply(`Saved study session ${result.record.durationMinutes} minutes (manual).`, "success", type);
    }

    if (type === "goal.add") {
      const result = goals.createGoal({ title: String(payload.title) });
      if (!result.ok) return reply(result.message, "clarification", type);
      return reply(`Goal added: ${result.record.title}.`, "success", type);
    }

    return reply(unknownFallback(), "unknown", type);
  } catch (e) {
    const message = e instanceof StorageError ? e.message : "Something went wrong. Nothing was saved.";
    return reply(message, "error", null);
  }
}

function unknownFallback() {
  return parseChat("???").kind === "unknown"
    ? `I did not understand. ${operationsListTextSafe()}`
    : "I did not understand.";
}

function operationsListTextSafe() {
  return "I can: add an expense; ask spending today, this week, or overall; list recent expenses; add or list Daily Log entries; mark a Daily Log entry complete or incomplete; summarise today; log a gym or cardio session; list recent workouts; record body weight; log a study session; add a goal.";
}
