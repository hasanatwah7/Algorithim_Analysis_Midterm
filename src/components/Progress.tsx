import { cn } from "@/lib/format";
import { formatPercent } from "@/lib/format";

export function ProgressBar({
  value,
  className,
  tone = "ember",
  height = "h-1.5",
  label,
}: {
  value: number;
  className?: string;
  tone?: "ember" | "jade" | "clay" | "mist";
  height?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const tones = {
    ember: "bg-ember",
    jade: "bg-jade",
    clay: "bg-clay",
    mist: "bg-mist",
  } as const;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      aria-label={label}
      className={cn("overflow-hidden rounded-full bg-white/[0.06]", height, className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", tones[tone])}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}

export function Ring({
  value,
  size = 116,
  stroke = 9,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E7A24B" />
            <stop offset="100%" stopColor="#74B58D" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="tabular text-[22px] font-bold tracking-[-0.03em] text-chalk">
            {label ?? formatPercent(clamped)}
          </div>
          {sublabel ? (
            <div className="mt-0.5 text-[10px] font-medium text-dim">{sublabel}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Stat({
  value,
  label,
  tone = "default",
}: {
  value: string | number;
  label: string;
  tone?: "default" | "ember" | "jade" | "clay";
}) {
  const tones = {
    default: "text-chalk",
    ember: "text-ember",
    jade: "text-jade",
    clay: "text-clay",
  } as const;
  return (
    <div>
      <div className={cn("tabular text-[21px] font-bold tracking-[-0.03em]", tones[tone])}>
        {value}
      </div>
      <div className="mt-0.5 text-[10.5px] font-medium text-dim">{label}</div>
    </div>
  );
}
