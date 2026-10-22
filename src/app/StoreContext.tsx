import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Store } from "../storage/types";

type Ctx = {
  store: Store;
  error: string | null;
  revision: number;
  bump: () => void;
  setError: (message: string | null) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ store, children }: { store: Store; children: ReactNode }) {
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const value = useMemo<Ctx>(
    () => ({
      store,
      error,
      revision,
      bump: () => setRevision((n) => n + 1),
      setError,
    }),
    [store, error, revision],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreProvider missing");
  return ctx;
}

