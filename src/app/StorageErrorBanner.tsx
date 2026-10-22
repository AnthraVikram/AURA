import { useAppStore } from "./StoreContext";

export function StorageErrorBanner() {
  const { error } = useAppStore();
  if (!error) return null;
  return (
    <p className="error" role="alert">
      {error}
    </p>
  );
}
