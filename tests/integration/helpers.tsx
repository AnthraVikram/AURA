import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StoreProvider } from "../../src/app/StoreContext";
import { AppRoutes } from "../../src/app/routes";
import { MemoryStore } from "../../src/storage/memoryStore";
import type { Store } from "../../src/storage/types";

export function renderWithStore(store: Store = new MemoryStore(), initialPath = "/") {
  const view = render(
    <StoreProvider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRoutes />
      </MemoryRouter>
    </StoreProvider>,
  );
  return { store, ...view };
}
