import { useState } from "react";
import { AuraOrb } from "./AuraOrb";
import { ChatPanel } from "../chat/ChatPanel";
import { DashboardCards } from "./DashboardCards";
import { DailyLogPanel } from "./DailyLogPanel";
import { QuickActionDialog, type QuickKind } from "./QuickActionDialog";
import { useAppStore } from "./StoreContext";

function greeting(name: string, now = new Date()) {
  const h = now.getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${part}, ${name}.`;
}

export function HomePage() {
  const { store, revision, error, bump } = useAppStore();
  void revision;
  const name = store.load().preferences.displayName.trim() || "You";
  const [kind, setKind] = useState<QuickKind>(null);

  return (
    <div className="home-spread">
      <div className="workspace">
        <section className="card hero">
          <AuraOrb />
          <div className="hero-copy">
            <p className="brand-sub">AURA</p>
            <h1>{greeting(name)}</h1>
            <p className="lede">A local command centre for what you actually record — nothing invented.</p>
            {error ? null : (
              <p className="status-dot">
                <i /> Local · ready
              </p>
            )}
          </div>
          <ChatPanel variant="hero" />
          <div className="quick-row" aria-label="Quick actions">
            <button type="button" className="secondary" onClick={() => setKind("expense")}>
              Add expense
            </button>
            <button type="button" className="secondary" onClick={() => setKind("workout")}>
              Log workout
            </button>
            <button type="button" className="secondary" onClick={() => setKind("study")}>
              Record study time
            </button>
            <button type="button" className="secondary" onClick={() => setKind("log")}>
              Add daily note
            </button>
          </div>
        </section>
        <DashboardCards />
      </div>
      <DailyLogPanel onQuick={setKind} />
      <QuickActionDialog kind={kind} onClose={() => setKind(null)} onSaved={bump} />
    </div>
  );
}
