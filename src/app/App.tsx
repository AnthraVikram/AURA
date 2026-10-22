import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { StoreProvider } from "./StoreContext";
import type { Store } from "../storage/types";

export function App({ store }: { store: Store }) {
  return (
    <StoreProvider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </StoreProvider>
  );
}
