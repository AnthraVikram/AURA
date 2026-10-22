import { defaultDailyLogStatus, inferDailyLogCategory } from "../../domain/dailyLogRules";
import { isoNow, localToday, newId } from "../../domain/dates";
import { err, ok, type Result } from "../../domain/result";
import type { CompletionStatus, DailyLogCategory, DailyLogEntry } from "../../domain/types";
import { StorageError, type Store } from "../../storage/types";

export class DailyLogService {
  constructor(private store: Store) {}

  create(input: {
    text: string;
    date?: string;
    category?: DailyLogCategory;
    status?: CompletionStatus;
  }): Result<DailyLogEntry> {
    const text = input.text.trim();
    if (!text) return err("validation", "Entry text is required.");
    const date = input.date ?? localToday();
    const today = localToday();
    const category = input.category ?? inferDailyLogCategory(text);
    const status = input.status ?? defaultDailyLogStatus(category, date, today);
    const now = isoNow();
    const record: DailyLogEntry = {
      id: newId(),
      text,
      date,
      category,
      status,
      createdAt: now,
      updatedAt: now,
    };
    try {
      const doc = this.store.load();
      doc.dailyLogEntries.push(record);
      this.store.save(doc);
      return ok(record);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  update(
    id: string,
    patch: Partial<Pick<DailyLogEntry, "text" | "date" | "category" | "status">>,
  ): Result<DailyLogEntry> {
    try {
      const doc = this.store.load();
      const idx = doc.dailyLogEntries.findIndex((e) => e.id === id);
      if (idx < 0) return err("not_found", "That Daily Log entry was not found.");
      if (patch.text !== undefined && !patch.text.trim()) {
        return err("validation", "Entry text is required.");
      }
      const next = {
        ...doc.dailyLogEntries[idx],
        ...patch,
        text: patch.text !== undefined ? patch.text.trim() : doc.dailyLogEntries[idx].text,
        updatedAt: isoNow(),
      };
      doc.dailyLogEntries[idx] = next;
      this.store.save(doc);
      return ok(next);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }

  listByDate(date: string): DailyLogEntry[] {
    return this.store.load().dailyLogEntries.filter((e) => e.date === date);
  }

  listIncomplete(includeOverdue = true, today = localToday()): DailyLogEntry[] {
    return this.store.load().dailyLogEntries.filter((e) => {
      if (e.status !== "incomplete") return false;
      if (e.date === today) return true;
      return includeOverdue && e.date < today;
    });
  }

  setStatus(id: string, status: CompletionStatus): Result<DailyLogEntry> {
    return this.update(id, { status });
  }

  delete(id: string): Result<{ id: string }> {
    try {
      const doc = this.store.load();
      const next = doc.dailyLogEntries.filter((e) => e.id !== id);
      if (next.length === doc.dailyLogEntries.length) {
        return err("not_found", "That Daily Log entry was not found.");
      }
      doc.dailyLogEntries = next;
      this.store.save(doc);
      return ok({ id });
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }
}
