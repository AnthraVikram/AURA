import { isoNow, lastNDates, localToday, newId } from "../../domain/dates";
import { err, ok, type Result } from "../../domain/result";
import type { Goal, GoalStatus, Habit } from "../../domain/types";
import { StorageError, type Store } from "../../storage/types";

export class GoalsService {
  constructor(private store: Store) {}

  createGoal(input: { title: string; notes?: string }): Result<Goal> {
    const title = input.title.trim();
    if (!title) return err("validation", "Goal title is required.");
    const now = isoNow();
    const record: Goal = {
      id: newId(),
      title,
      notes: input.notes ?? "",
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc.goals.push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  setStatus(id: string, status: GoalStatus): Result<Goal> {
    try {
      const doc = this.store.load();
      const idx = doc.goals.findIndex((g) => g.id === id);
      if (idx < 0) return err("not_found", "That goal was not found.");
      doc.goals[idx] = { ...doc.goals[idx], status, updatedAt: isoNow() };
      this.store.save(doc);
      return ok(doc.goals[idx]);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  list(): Goal[] {
    return this.store.load().goals;
  }

  delete(id: string): Result<{ id: string }> {
    try {
      const doc = this.store.load();
      const next = doc.goals.filter((g) => g.id !== id);
      if (next.length === doc.goals.length) return err("not_found", "That goal was not found.");
      doc.goals = next;
      this.store.save(doc);
      return ok({ id });
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  createHabit(name: string): Result<Habit> {
    const trimmed = name.trim();
    if (!trimmed) return err("validation", "Habit name is required.");
    const now = isoNow();
    const record: Habit = {
      id: newId(),
      name: trimmed,
      completions: [],
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc.habits.push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  setHabitDone(id: string, date: string, done: boolean): Result<Habit> {
    try {
      const doc = this.store.load();
      const idx = doc.habits.findIndex((h) => h.id === id);
      if (idx < 0) return err("not_found", "That habit was not found.");
      const set = new Set(doc.habits[idx].completions);
      if (done) set.add(date);
      else set.delete(date);
      doc.habits[idx] = {
        ...doc.habits[idx],
        completions: [...set],
        updatedAt: isoNow(),
      };
      this.store.save(doc);
      return ok(doc.habits[idx]);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  habitCounts(id: string, today = localToday()): Result<{ count: number }> {
    const habit = this.store.load().habits.find((h) => h.id === id);
    if (!habit) return err("not_found", "That habit was not found.");
    const window = new Set(lastNDates(7, today));
    const count = habit.completions.filter((d) => window.has(d)).length;
    return ok({ count });
  }

  deleteHabit(id: string): Result<{ id: string }> {
    try {
      const doc = this.store.load();
      const next = doc.habits.filter((h) => h.id !== id);
      if (next.length === doc.habits.length) return err("not_found", "That habit was not found.");
      doc.habits = next;
      this.store.save(doc);
      return ok({ id });
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  acceptSuggestion(title: string): Result<Goal> {
    return this.createGoal({ title, notes: "Accepted suggestion" });
  }

  listHabits(): Habit[] {
    return this.store.load().habits;
  }
}
