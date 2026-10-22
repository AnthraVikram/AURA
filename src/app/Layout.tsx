import { Outlet, useLocation } from "react-router-dom";
import { ChatPanel } from "../chat/ChatPanel";
import { ChatSessionProvider } from "./ChatSessionContext";
import { Sidebar } from "./Sidebar";
import { StorageErrorBanner } from "./StorageErrorBanner";

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <ChatSessionProvider>
      <div className={`shell ${isHome ? "home-shell" : "module-shell"}`}>
        <Sidebar />
        <div className={`main ${isHome ? "home-main" : ""}`}>
          <StorageErrorBanner />
          {isHome ? (
            <Outlet />
          ) : (
            <main className="card page">
              <Outlet />
            </main>
          )}
        </div>
        {isHome ? null : (
          <div className="rail">
            <ChatPanel variant="dock" />
          </div>
        )}
      </div>
    </ChatSessionProvider>
  );
}
