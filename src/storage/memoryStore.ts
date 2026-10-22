import { createEmptyDocument } from "../domain/emptyDocument";
import type { AppDocument } from "../domain/types";
import type { Store } from "./types";

export class MemoryStore implements Store {
  private doc: AppDocument;

  constructor(initial?: AppDocument) {
    this.doc = initial ? structuredClone(initial) : createEmptyDocument();
  }

  load(): AppDocument {
    return structuredClone(this.doc);
  }

  save(doc: AppDocument): void {
    this.doc = structuredClone(doc);
  }
}
