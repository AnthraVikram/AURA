# Contract: Storage port

**Consumers**: module services only. Chat and UI MUST NOT import the adapter.

**Adapters**: `MemoryStore` (tests), `LocalDocumentStore` (browser `localStorage` key `aura.v1`).

## Document envelope

See `storage.schema.json`. Load MUST parse JSON, verify `schemaVersion === 1`, and reject corrupt payloads with an error the UI can show. Save MUST write the full document atomically from the app’s point of view (write string, then read-back check when the platform allows).

## Port

```text
Store
  load() -> AppDocument
  save(AppDocument) -> void
```

Failures: throw or return a typed `StorageError`. Callers MUST surface failure; they MUST NOT report module success.

## Collection repositories (implemented on top of Store)

Chat transcripts are **not** a collection on `AppDocument`. Persist module records only.

Each collection (`dailyLogEntries`, `expenses`, … except `learningResources` seed and `preferences`):

```text
list() -> T[]
get(id) -> T | not_found
upsert(T) -> T          # insert or replace by id; services decide create vs edit
delete(id) -> ok | not_found
```

`PreferencesRepository.get() / save(preferences)`
`LearningResourceRepository.list()` (read-only catalogue)

## Success / failure

| Operation | Success | Failure |
|-----------|---------|---------|
| load | Document returned | Visible load error; empty UI MUST NOT invent rows |
| save | Subsequent load returns saved data | Prior document unchanged; caller shows error |
| get/delete missing | `not_found` | Never `ok` |
| quota / thrown adapter error | n/a | `StorageError`; no success toast/chat confirm |

## Cloud migration seam (not implemented)

A later `HttpStore` can implement the same `Store` or per-collection repositories. This release MUST NOT call a network store or claim sync.
