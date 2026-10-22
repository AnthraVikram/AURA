import { createEmptyDocument } from "../../src/domain/emptyDocument";
import { productivityScore } from "../../src/domain/productivityScore";
import type { DailyLogEntry, Goal, Habit, TimedSession, WorkoutSession } from "../../src/domain/types";

const today = "2026-10-21";

function log(partial: Partial<DailyLogEntry>): DailyLogEntry {
  return {
    id: partial.id ?? "l1",
    text: "Note",
    date: today,
    category: "plan",
    status: "complete",
    createdAt: "t",
    updatedAt: "t",
    ...partial,
  };
}

test("omits missing domains and hides score until two factors exist", () => {
  const empty = productivityScore(createEmptyDocument(), today);
  expect(empty.score).toBeNull();
  expect(empty.factors.every((f) => !f.included)).toBe(true);

  const doc = createEmptyDocument();
  doc.dailyLogEntries = [log({ id: "a", status: "complete" })];
  const one = productivityScore(doc, today);
  expect(one.score).toBeNull();
  expect(one.factors.find((f) => f.id === "dailyLog")?.included).toBe(true);
  expect(one.factors.find((f) => f.id === "movement")?.included).toBe(false);
});

test("averages only included factors and does not treat missing workout as zero", () => {
  const doc = createEmptyDocument();
  doc.dailyLogEntries = [
    log({ id: "a", status: "complete" }),
    log({ id: "b", status: "incomplete" }),
  ];
  doc.studySessions = [
    {
      id: "s1",
      date: today,
      durationMinutes: 45,
      note: "",
      createdAt: "t",
      updatedAt: "t",
    } satisfies TimedSession,
  ];
  const result = productivityScore(doc, today);
  expect(result.score).not.toBeNull();
  expect(result.factors.find((f) => f.id === "movement")?.included).toBe(false);
  expect(result.factors.find((f) => f.id === "dailyLog")?.value).toBe(50);
  expect(result.factors.find((f) => f.id === "study")?.value).toBe(50);
  expect(result.score).toBe(50);
});

test("goals and habits use saved records only", () => {
  const doc = createEmptyDocument();
  doc.goals = [
    { id: "g1", title: "A", notes: "", status: "completed", createdAt: "t", updatedAt: "t" } satisfies Goal,
    { id: "g2", title: "B", notes: "", status: "active", createdAt: "t", updatedAt: "t" } satisfies Goal,
  ];
  doc.habits = [
    { id: "h1", name: "Water", completions: [today], createdAt: "t", updatedAt: "t" } satisfies Habit,
  ];
  doc.workoutSessions = [
    {
      id: "w1",
      type: "shoulders",
      date: today,
      exercises: [{ name: "Press", sets: 3, repetitions: 8, weight: null, weightUnit: null }],
      createdAt: "t",
      updatedAt: "t",
    } satisfies WorkoutSession,
  ];
  const result = productivityScore(doc, today);
  expect(result.factors.find((f) => f.id === "goals")?.value).toBe(50);
  expect(result.factors.find((f) => f.id === "habits")?.value).toBe(100);
  expect(result.factors.find((f) => f.id === "movement")?.value).toBe(100);
  expect(result.score).toBe(Math.round((50 + 100 + 100) / 3));
});
