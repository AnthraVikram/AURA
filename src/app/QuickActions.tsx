import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const nav = useNavigate();
  return (
    <div aria-label="Quick actions">
      <button type="button" onClick={() => nav("/expenses")}>
        Add expense
      </button>{" "}
      <button type="button" className="secondary" onClick={() => nav("/daily-log")}>
        Daily Log
      </button>{" "}
      <button type="button" className="secondary" onClick={() => nav("/health")}>
        Add workout
      </button>
    </div>
  );
}
