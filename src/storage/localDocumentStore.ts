import { createEmptyDocument } from "../domain/emptyDocument";
import type { AppDocument } from "../domain/types";
import { StorageError, type Store } from "./types";

export const STORAGE_KEY = "aura.v1";

export class LocalDocumentStore implements Store {
  constructor(private readonly storage: Storage = window.localStorage) {}

  load(): AppDocument {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyDocument();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new StorageError("Saved data is corrupt and could not be read.");
    }
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed as AppDocument).schemaVersion !== 1
    ) {
      throw new StorageError("Saved data uses an unknown version and was not loaded.");
    }
    return parsed as AppDocument;
  }

  save(doc: AppDocument): void {
    if (doc.schemaVersion !== 1) {
      throw new StorageError("Cannot save an unknown document version.");
    }
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(doc));
      const readBack = this.storage.getItem(STORAGE_KEY);
      if (!readBack) {
        throw new StorageError("Save did not complete.");
      }
    } catch (e) {
      if (e instanceof StorageError) throw e;
      throw new StorageError("Save did not complete. Lists were left unchanged.");
    }
  }
}
