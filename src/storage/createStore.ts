import { LocalDocumentStore } from "./localDocumentStore";
import { MemoryStore } from "./memoryStore";
import type { Store } from "./types";

export function createBrowserStore(): Store {
  return new LocalDocumentStore();
}

export function createTestStore(): Store {
  return new MemoryStore();
}
