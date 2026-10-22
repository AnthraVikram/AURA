import { localToday } from "./dates";
import type { AppDocument } from "./types";

/**
 * Daily productivity score (deterministic, local records only).
 *
 * Included factors (equal weight). A factor is omitted when that domain has
 * no relevant records — missing data is never treated as zero.
 *
 * - dailyLog: today's entries → 100 × (complete / total)
 * - movement: gym or cardio logged today → 100 (presence only)
 * - study: study sessions today → min(100, round(minutes / 90 × 100)); 90 min = full credit
 * - goals: saved goals → 100 × (completed / total)
 * - habits: saved habits → 100 × (marked done today / total)
 *
 * Score is the rounded mean of included factors, shown only when at least
 * two factors have data. Not a measure of worth, health, or wellbeing.
 */
export type ProductivityFactorId = "dailyLog" | "movement" | "study" | "goals" | "habits";

export type ProductivityFactor = {
  id: ProductivityFactorId;
  label: string;
  included: boolean;
  value?: number;
  detail: string;
};

export type ProductivityScore = {
  score: number | null;
  factors: ProductivityFactor[];
  reason: string;
};

const STUDY_FULL_MINUTES = 90;

export function productivityScore(doc: AppDocument, today = localToday()): ProductivityScore {
  const todayLog = doc.dailyLogEntries.filter((e) => e.date === today);
  const dailyLog: ProductivityFactor = todayLog.length
    ? {
        id: "dailyLog",
        label: "Daily Log",
        included: true,
        value: Math.round((todayLog.filter((e) => e.status === "complete").length / todayLog.length) * 100),
        detail: `${todayLog.filter((e) => e.status === "complete").length} of ${todayLog.length} today’s notes complete`,
      }
    : {
        id: "dailyLog",
        label: "Daily Log",
        included: false,
        detail: "No Daily Log entries recorded for today — not counted",
      };

  const workouts = doc.workoutSessions.filter((w) => w.date === today);
  const cardios = doc.cardioSessions.filter((c) => c.date === today);
  const movement: ProductivityFactor =
    workouts.length + cardios.length > 0
      ? {
          id: "movement",
          label: "Movement",
          included: true,
          value: 100,
          detail: `${workouts.length} gym, ${cardios.length} cardio logged today`,
        }
      : {
          id: "movement",
          label: "Movement",
          included: false,
          detail: "No workout logged yet — not counted",
        };

  const studyToday = doc.studySessions.filter((s) => s.date === today);
  const studyMinutes = studyToday.reduce((s, r) => s + r.durationMinutes, 0);
  const study: ProductivityFactor = studyToday.length
    ? {
        id: "study",
        label: "Study",
        included: true,
        value: Math.min(100, Math.round((studyMinutes / STUDY_FULL_MINUTES) * 100)),
        detail: `${studyMinutes} min recorded today (manual; 90 min = full credit for this factor)`,
      }
    : {
        id: "study",
        label: "Study",
        included: false,
        detail: "No study time recorded yet — not counted",
      };

  const goals: ProductivityFactor = doc.goals.length
    ? {
        id: "goals",
        label: "Goals",
        included: true,
        value: Math.round((doc.goals.filter((g) => g.status === "completed").length / doc.goals.length) * 100),
        detail: `${doc.goals.filter((g) => g.status === "completed").length} of ${doc.goals.length} goals completed`,
      }
    : {
        id: "goals",
        label: "Goals",
        included: false,
        detail: "No goals saved — not counted",
      };

  const habits: ProductivityFactor = doc.habits.length
    ? {
        id: "habits",
        label: "Habits",
        included: true,
        value: Math.round(
          (doc.habits.filter((h) => h.completions.includes(today)).length / doc.habits.length) * 100,
        ),
        detail: `${doc.habits.filter((h) => h.completions.includes(today)).length} of ${doc.habits.length} habits marked done today`,
      }
    : {
        id: "habits",
        label: "Habits",
        included: false,
        detail: "No habits saved — not counted",
      };

  const factors = [dailyLog, movement, study, goals, habits];
  const included = factors.filter((f) => f.included && f.value !== undefined);
  if (included.length < 2) {
    return {
      score: null,
      factors,
      reason: "Not enough data yet",
    };
  }
  const score = Math.round(included.reduce((s, f) => s + (f.value ?? 0), 0) / included.length);
  return {
    score,
    factors,
    reason: `Equal-weighted average of ${included.length} recorded factors.`,
  };
}
