import { isoNow, isWithinLastDays, localToday, newId } from "../../domain/dates";
import { err, ok, type Result } from "../../domain/result";
import { validateDuration } from "../../domain/studyValidation";
import type { TimedSession } from "../../domain/types";
import { StorageError, type Store } from "../../storage/types";

export class StudyService {
  constructor(private store: Store) {}

  createStudy(input: { durationMinutes: number; date?: string; note?: string }): Result<TimedSession> {
    return this.create("studySessions", input);
  }

  createScreenTime(input: {
    durationMinutes: number;
    date?: string;
    note?: string;
  }): Result<TimedSession> {
    return this.create("screenTimeEntries", input);
  }

  listStudy(): TimedSession[] {
    return this.store.load().studySessions;
  }

  listScreenTime(): TimedSession[] {
    return this.store.load().screenTimeEntries;
  }

  summaries(kind: "study" | "screen", today = localToday()) {
    const rows = kind === "study" ? this.listStudy() : this.listScreenTime();
    const sum = (pred: (r: TimedSession) => boolean) =>
      rows.filter(pred).reduce((s, r) => s + r.durationMinutes, 0);
    return {
      source: "manual" as const,
      today: sum((r) => r.date === today),
      week: sum((r) => isWithinLastDays(r.date, 7, today)),
      overall: sum(() => true),
    };
  }

  deleteStudy(id: string): Result<{ id: string }> {
    return this.delete("studySessions", id, "That study session was not found.");
  }

  deleteScreenTime(id: string): Result<{ id: string }> {
    return this.delete("screenTimeEntries", id, "That screen-time record was not found.");
  }

  private create(
    key: "studySessions" | "screenTimeEntries",
    input: { durationMinutes: number; date?: string; note?: string },
  ): Result<TimedSession> {
    const d = validateDuration(input.durationMinutes);
    if (d) return err("validation", d);
    const now = isoNow();
    const record: TimedSession = {
      id: newId(),
      durationMinutes: input.durationMinutes,
      date: input.date ?? localToday(),
      note: input.note ?? "",
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc[key].push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  private delete(
    key: "studySessions" | "screenTimeEntries",
    id: string,
    message: string,
  ): Result<{ id: string }> {
    try {
      const doc = this.store.load();
      const next = doc[key].filter((r) => r.id !== id);
      if (next.length === doc[key].length) return err("not_found", message);
      doc[key] = next;
      this.store.save(doc);
      return ok({ id });
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }
}
