import { createEmptyDocument } from "../../src/domain/emptyDocument";
import { LocalDocumentStore, STORAGE_KEY } from "../../src/storage/localDocumentStore";
import { StorageError } from "../../src/storage/types";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => {
      map.delete(k);
    },
    setItem: (k, v) => {
      map.set(k, v);
    },
  };
}

test("LocalDocumentStore round-trips a document", () => {
  const storage = memoryStorage();
  const a = new LocalDocumentStore(storage);
  const doc = createEmptyDocument();
  doc.preferences.displayName = "A";
  a.save(doc);
  const b = new LocalDocumentStore(storage);
  expect(b.load().preferences.displayName).toBe("A");
  expect(storage.getItem(STORAGE_KEY)).toBeTruthy();
});

test("rejects non-1 schemaVersion", () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 2 }));
  expect(() => new LocalDocumentStore(storage).load()).toThrow(StorageError);
});
