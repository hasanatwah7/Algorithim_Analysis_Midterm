import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function PageHeader({
  title,
  titleEn,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  titleEn?: string;
  description?: ReactNode;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-ember">
            <span className="h-1 w-1 rounded-full bg-ember" />
            {eyebrow}
          </div>
        ) : null}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-balance text-[26px] font-bold leading-[1.2] tracking-[-0.035em] text-chalk sm:text-[32px]">
            {title}
          </h1>
          {titleEn ? (
            <span
              dir="ltr"
              className="font-mono text-[11px] tracking-[0.08em] text-dim"
            >
              {titleEn}
            </span>
          ) : null}
        </div>
        {description ? (
          <div className="mt-2 max-w-[62ch] text-pretty text-[12.5px] leading-6 text-mist">
            {description}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="text-[17px] font-semibold tracking-[-0.025em] text-chalk">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 max-w-[60ch] text-[11.5px] leading-5 text-dim">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass flex flex-col items-center rounded-[20px] px-6 py-12 text-center">
      {icon ? (
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-ember">
          {icon}
        </div>
      ) : null}
      <h3 className="text-[15px] font-semibold text-chalk">{title}</h3>
      <p className="mt-1.5 max-w-[42ch] text-[12px] leading-6 text-dim">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
