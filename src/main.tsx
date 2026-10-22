import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { createBrowserStore } from "./storage/createStore";
import "./styles/theme.css";
import "./styles/layout.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App store={createBrowserStore()} />
  </StrictMode>,
);
