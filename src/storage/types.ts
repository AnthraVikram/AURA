import type { AppDocument } from "../domain/types";

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

export type Store = {
  load(): AppDocument;
  save(doc: AppDocument): void;
};
