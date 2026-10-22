import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true, icon: "M4 12 L12 4 L20 12 V20 H4 Z" },
  { to: "/daily-log", label: "Daily Log", icon: "M6 4h12v16H6z M8 8h8 M8 12h8 M8 16h5" },
  { to: "/expenses", label: "Expenses", icon: "M4 7h16v10H4z M8 12h8" },
  { to: "/health", label: "Health & Fitness", icon: "M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" },
  { to: "/growth", label: "Personal Growth", icon: "M12 3v18 M5 12c4 0 7-4 7-9 0 5 3 9 7 9" },
  { to: "/study", label: "Study & Screen Time", icon: "M4 6h16v12H4z M8 10h8" },
  { to: "/goals", label: "Goals & Habits", icon: "M12 3l2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6z" },
  { to: "/settings", label: "Settings", icon: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2 M12 20v2 M4 12H2 M22 12h-2" },
];

export function Sidebar() {
  return (
    <nav className="sidebar" aria-label="AURA areas">
      <div className="brand-mark">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="#b57aff" />
          <ellipse cx="12" cy="12" rx="10" ry="5" fill="none" stroke="#b57aff" strokeOpacity="0.6" />
        </svg>
        <div>
          <strong>AURA</strong>
          <span className="brand-sub">Local command centre</span>
        </div>
      </div>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d={l.icon} />
          </svg>
          <span>{l.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
