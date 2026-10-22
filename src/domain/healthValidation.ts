import type { CardioType, WorkoutType } from "./types";

export const GYM_TYPES: WorkoutType[] = [
  "leg_day",
  "back_and_biceps",
  "chest_and_triceps",
  "shoulders",
];

export const CARDIO_TYPES: CardioType[] = ["running", "skipping"];

export const WORKOUT_LABELS: Record<WorkoutType, string> = {
  leg_day: "Leg Day",
  back_and_biceps: "Back and Biceps",
  chest_and_triceps: "Chest and Triceps",
  shoulders: "Shoulders",
};

export const CARDIO_LABELS: Record<CardioType, string> = {
  running: "Running",
  skipping: "Skipping",
};

export function workoutTypeLabel(type: WorkoutType): string {
  return WORKOUT_LABELS[type];
}

export function cardioTypeLabel(type: CardioType): string {
  return CARDIO_LABELS[type];
}

export function validatePositiveNumber(value: unknown, label: string, allowZero = false): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return `${label} must be a number.`;
  }
  if (allowZero ? value < 0 : value <= 0) {
    return `${label} must be greater than ${allowZero ? "or equal to zero" : "zero"}.`;
  }
  return null;
}

export function validateIntAtLeast(value: unknown, min: number, label: string): string | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value < min) {
    return `${label} must be a whole number of at least ${min}.`;
  }
  return null;
}
