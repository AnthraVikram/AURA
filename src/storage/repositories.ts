import type { AppDocument } from "../domain/types";
import type { Store } from "./types";

type CollectionKey = {
  [K in keyof AppDocument]: AppDocument[K] extends Array<infer _T> ? K : never;
}[keyof AppDocument];

export class CollectionRepository<K extends CollectionKey> {
  constructor(
    private store: Store,
    private key: K,
  ) {}

  list(): AppDocument[K] {
    return this.store.load()[this.key];
  }

  get(id: string): AppDocument[K][number] | null {
    const rows = this.list() as { id: string }[];
    return (rows.find((r) => r.id === id) as AppDocument[K][number]) ?? null;
  }

  upsert(entity: AppDocument[K][number]): AppDocument[K][number] {
    const doc = this.store.load();
    const rows = [...(doc[this.key] as { id: string }[])];
    const id = (entity as { id: string }).id;
    const idx = rows.findIndex((r) => r.id === id);
    if (idx >= 0) rows[idx] = entity as { id: string };
    else rows.push(entity as { id: string });
    (doc[this.key] as unknown) = rows;
    this.store.save(doc);
    return entity;
  }

  delete(id: string): "ok" | "not_found" {
    const doc = this.store.load();
    const rows = [...(doc[this.key] as { id: string }[])];
    const next = rows.filter((r) => r.id !== id);
    if (next.length === rows.length) return "not_found";
    (doc[this.key] as unknown) = next;
    this.store.save(doc);
    return "ok";
  }
}
