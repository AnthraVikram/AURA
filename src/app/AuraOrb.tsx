export function AuraOrb() {
  return (
    <div className="orb-wrap" aria-hidden="true">
      <svg className="orb" viewBox="0 0 200 200">
        <defs>
          <radialGradient id="core" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#f4e9ff" />
            <stop offset="35%" stopColor="#c89bff" />
            <stop offset="100%" stopColor="#3a1a80" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="78" ry="28" fill="none" stroke="#b57aff" strokeOpacity="0.45" />
        <ellipse
          cx="100"
          cy="100"
          rx="70"
          ry="24"
          fill="none"
          stroke="#7ec8ff"
          strokeOpacity="0.25"
          transform="rotate(25 100 100)"
        />
        <ellipse
          cx="100"
          cy="100"
          rx="62"
          ry="20"
          fill="none"
          stroke="#e889c8"
          strokeOpacity="0.2"
          transform="rotate(-18 100 100)"
        />
        <circle cx="100" cy="100" r="34" fill="url(#core)" />
        <circle cx="100" cy="100" r="18" fill="#1a0c38" opacity="0.35" />
        <circle cx="148" cy="92" r="2" fill="#fff" />
        <circle cx="54" cy="118" r="1.5" fill="#c9b6ff" />
      </svg>
    </div>
  );
}
