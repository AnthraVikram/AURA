import { createEmptyDocument } from "../../src/domain/emptyDocument";
import { MemoryStore } from "../../src/storage/memoryStore";

test("MemoryStore load/save round-trip", () => {
  const store = new MemoryStore();
  const doc = store.load();
  doc.preferences.displayName = "Anthra";
  store.save(doc);
  expect(store.load().preferences.displayName).toBe("Anthra");
  expect(store.load()).not.toBe(doc);
});

test("MemoryStore starts empty", () => {
  expect(new MemoryStore().load().expenses).toEqual(createEmptyDocument().expenses);
});
