import { err, ok, type Result } from "../../domain/result";
import type { Preferences, WeightUnit } from "../../domain/types";
import { StorageError, type Store } from "../../storage/types";

export class PreferencesService {
  constructor(private store: Store) {}

  get(): Preferences {
    return this.store.load().preferences;
  }

  save(patch: Partial<Preferences>): Result<Preferences> {
    const current = this.get();
    const next: Preferences = { ...current, ...patch };
    if (patch.displayName !== undefined) next.displayName = patch.displayName.trim();
    if (!next.currencySymbol.trim()) {
      return err("validation", "Currency symbol is required.");
    }
    const unit = next.weightUnit as WeightUnit;
    if (unit !== "kg" && unit !== "lb") {
      return err("validation", "Weight unit must be kg or lb.");
    }
    try {
      const doc = this.store.load();
      doc.preferences = next;
      this.store.save(doc);
      return ok(next);
    } catch (e) {
      return err("storage", e instanceof StorageError ? e.message : "Save did not complete.");
    }
  }
}
