import { Link } from "react-router-dom";

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1"
      />
      <path
        d="M9 27.5 15.5 13 22 24 26.5 16 31 27.5"
        stroke="#E7A24B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="13" r="2.4" fill="#E7A24B" />
      <circle cx="22" cy="24" r="2.1" fill="#F4F6F9" />
      <circle cx="26.5" cy="16" r="2.1" fill="#F4F6F9" />
      <path
        d="M9 31.5h22"
        stroke="rgba(244,246,249,0.28)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5"
      aria-label="VECTR ALGO — home"
    >
      <LogoMark size={compact ? 30 : 34} />
      <span
        dir="ltr"
        className="flex items-baseline gap-1.5 font-sans text-[15px] font-extrabold tracking-[-0.02em]"
      >
        <span className="text-chalk transition-colors group-hover:text-ember-soft">
          VECTR
        </span>
        <span className="font-mono text-[12px] font-medium tracking-[0.06em] text-dim">
          //
        </span>
        <span className="font-mono text-[12px] font-semibold tracking-[0.14em] text-ember">
          ALGO
        </span>
      </span>
    </Link>
  );
}
