import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/format";

export function BenchShell({
  title,
  description,
  controls,
  children,
  className,
}: {
  title: string;
  description: string;
  controls?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "glass overflow-hidden rounded-[20px]",
        "border-ember/15 bg-gradient-to-b from-ember/[0.035] to-transparent",
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-ember/25 bg-ember/10 text-ember">
            <Sparkles size={15} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h3 className="text-[13px] font-semibold text-chalk">{title}</h3>
              <span className="font-mono text-[9px] tracking-[0.1em] text-ember/70">
                INTERACTIVE BENCH
              </span>
            </div>
            <p className="mt-0.5 max-w-[62ch] text-[10.5px] leading-5 text-dim">
              {description}
            </p>
          </div>
        </div>
        {controls ? <div className="flex flex-wrap items-center gap-1.5">{controls}</div> : null}
      </div>
      <div className="px-4 py-4 sm:px-5">{children}</div>
    </section>
  );
}

export function BenchControls({
  index,
  total,
  onPrev,
  onNext,
  onReset,
  playing,
  onPlay,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  playing?: boolean;
  onPlay?: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onReset}
        className="rounded-[8px] border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[10.5px] text-dim transition-colors hover:text-chalk"
      >
        إعادة
      </button>
      {onPlay ? (
        <button
          type="button"
          onClick={onPlay}
          className="rounded-[8px] border border-ember/25 bg-ember/[0.08] px-2.5 py-1.5 text-[10.5px] text-ember transition-colors hover:bg-ember/[0.14]"
        >
          {playing ? "إيقاف" : "تشغيل"}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onPrev}
        disabled={index <= 0}
        className="grid h-8 w-8 place-items-center rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-mist transition-colors hover:text-chalk disabled:opacity-35"
        aria-label="الخطوة السابقة"
      >
        ›
      </button>
      <span className="tabular min-w-[44px] text-center font-mono text-[10px] text-dim">
        {index + 1} / {total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={index >= total - 1}
        className="grid h-8 w-8 place-items-center rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-mist transition-colors hover:text-chalk disabled:opacity-35"
        aria-label="الخطوة التالية"
      >
        ‹
      </button>
    </div>
  );
}
