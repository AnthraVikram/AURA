import { useEffect } from "react";
import { CardioForm } from "../modules/health/CardioForm";
import { DailyLogForm } from "../modules/daily-log/DailyLogForm";
import { ExpenseForm } from "../modules/expenses/ExpenseForm";
import { WorkoutForm } from "../modules/health/WorkoutForm";
import { StudyQuickForm } from "../modules/study/StudyQuickForm";

export type QuickKind = "log" | "expense" | "workout" | "study" | null;

const titles: Record<Exclude<QuickKind, null>, string> = {
  log: "Add a Daily Log entry",
  expense: "Add an expense",
  workout: "Log a workout",
  study: "Record study or screen time",
};

export function QuickActionDialog({
  kind,
  onClose,
  onSaved,
}: {
  kind: QuickKind;
  onClose: () => void;
  onSaved: () => void;
}) {
  useEffect(() => {
    if (!kind) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [kind, onClose]);

  if (!kind) return null;

  function saved() {
    onSaved();
    onClose();
  }

  return (
    <div className="dialog-backdrop" onClick={onClose} role="presentation">
      <div
        className="card dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <h2 id="quick-dialog-title">{titles[kind]}</h2>
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
        </header>
        {kind === "log" ? <DailyLogForm onSaved={saved} /> : null}
        {kind === "expense" ? <ExpenseForm onSaved={saved} /> : null}
        {kind === "workout" ? (
          <>
            <WorkoutForm onSaved={saved} />
            <CardioForm onSaved={saved} />
          </>
        ) : null}
        {kind === "study" ? <StudyQuickForm onSaved={saved} /> : null}
      </div>
    </div>
  );
}
