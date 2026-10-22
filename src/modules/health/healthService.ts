import { isoNow, localToday, newId } from "../../domain/dates";
import {
  CARDIO_TYPES,
  GYM_TYPES,
  validateIntAtLeast,
  validatePositiveNumber,
} from "../../domain/healthValidation";
import { err, ok, type Result } from "../../domain/result";
import type {
  CardioSession,
  CardioType,
  Exercise,
  WeightEntry,
  WeightUnit,
  WorkoutSession,
  WorkoutType,
} from "../../domain/types";
import { StorageError, type Store } from "../../storage/types";

export class HealthService {
  constructor(private store: Store) {}

  createWorkout(input: {
    type: WorkoutType;
    date?: string;
    exercises: Exercise[];
  }): Result<WorkoutSession> {
    if (!GYM_TYPES.includes(input.type)) return err("validation", "Unknown workout type.");
    if (!input.exercises.length) return err("validation", "Add at least one exercise.");
    for (const ex of input.exercises) {
      if (!ex.name.trim()) return err("validation", "Exercise name is required.");
      const s = validateIntAtLeast(ex.sets, 1, "Sets");
      if (s) return err("validation", s);
      const r = validateIntAtLeast(ex.repetitions, 1, "Repetitions");
      if (r) return err("validation", r);
      if (ex.weight !== null) {
        const w = validatePositiveNumber(ex.weight, "Weight", true);
        if (w) return err("validation", w);
        if (!ex.weightUnit) return err("validation", "Weight unit is required when a weight is set.");
      }
    }
    const now = isoNow();
    const record: WorkoutSession = {
      id: newId(),
      type: input.type,
      date: input.date ?? localToday(),
      exercises: input.exercises,
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc.workoutSessions.push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  createCardio(input: {
    type: CardioType;
    durationMinutes: number;
    date?: string;
  }): Result<CardioSession> {
    if (!CARDIO_TYPES.includes(input.type)) return err("validation", "Unknown cardio type.");
    const d = validatePositiveNumber(input.durationMinutes, "Duration");
    if (d) return err("validation", d);
    const now = isoNow();
    const record: CardioSession = {
      id: newId(),
      type: input.type,
      durationMinutes: input.durationMinutes,
      date: input.date ?? localToday(),
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc.cardioSessions.push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  createWeight(input: { value: number; date?: string; unit?: WeightUnit }): Result<WeightEntry> {
    const v = validatePositiveNumber(input.value, "Weight");
    if (v) return err("validation", v);
    const now = isoNow();
    const unit = input.unit ?? this.store.load().preferences.weightUnit;
    const record: WeightEntry = {
      id: newId(),
      value: input.value,
      unit,
      date: input.date ?? localToday(),
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc.weightEntries.push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  listRecent(limit = 5) {
    const doc = this.store.load();
    const rows = [
      ...doc.workoutSessions.map((w) => ({ kind: "workout" as const, date: w.date, record: w })),
      ...doc.cardioSessions.map((c) => ({ kind: "cardio" as const, date: c.date, record: c })),
    ].sort((a, b) => b.date.localeCompare(a.date) || b.record.createdAt.localeCompare(a.record.createdAt));
    return rows.slice(0, limit);
  }

  listWeights(): WeightEntry[] {
    return [...this.store.load().weightEntries].sort((a, b) => a.date.localeCompare(b.date));
  }

  deleteWorkout(id: string): Result<{ id: string }> {
    return this.deleteFrom("workoutSessions", id, "That workout was not found.");
  }

  deleteCardio(id: string): Result<{ id: string }> {
    return this.deleteFrom("cardioSessions", id, "That cardio session was not found.");
  }

  deleteWeight(id: string): Result<{ id: string }> {
    return this.deleteFrom("weightEntries", id, "That weight record was not found.");
  }

  private deleteFrom(
    key: "workoutSessions" | "cardioSessions" | "weightEntries",
    id: string,
    message: string,
  ): Result<{ id: string }> {
    try {
      const doc = this.store.load();
      const rows = doc[key] as { id: string }[];
      const next = rows.filter((r) => r.id !== id);
      if (next.length === rows.length) return err("not_found", message);
      (doc[key] as { id: string }[]) = next;
      this.store.save(doc);
      return ok({ id });
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }
}
