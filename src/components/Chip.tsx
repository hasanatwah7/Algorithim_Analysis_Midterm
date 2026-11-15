import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
  tone?: "default" | "ember" | "jade" | "clay";
}

export function Chip({
  active = false,
  tone = "default",
  className,
  children,
  ...props
}: ChipProps) {
  const activeTone =
    tone === "ember"
      ? "border-ember/45 bg-ember/12 text-ember-soft"
      : tone === "jade"
        ? "border-jade/40 bg-jade/10 text-jade"
        : tone === "clay"
          ? "border-clay/40 bg-clay/10 text-clay"
          : "border-white/20 bg-white/[0.08] text-chalk";

  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-medium transition-colors duration-150 active:scale-[0.97]",
        active
          ? activeTone
          : "border-white/[0.08] bg-white/[0.02] text-dim hover:border-white/15 hover:text-mist",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "ember" | "jade" | "clay" | "mono";
  className?: string;
}) {
  const tones = {
    default: "border-white/10 bg-white/[0.04] text-mist",
    ember: "border-ember/25 bg-ember/[0.08] text-ember-soft",
    jade: "border-jade/25 bg-jade/[0.08] text-jade",
    clay: "border-clay/25 bg-clay/[0.08] text-clay",
    mono: "border-white/10 bg-white/[0.03] text-dim font-mono",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-medium tracking-[0.01em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
