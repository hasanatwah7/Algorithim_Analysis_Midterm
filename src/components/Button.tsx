import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "quiet" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ember text-[#1b1206] border border-ember/60 hover:bg-ember-soft shadow-[0_10px_30px_-12px_rgba(231,162,75,0.55)]",
  secondary:
    "bg-white/[0.045] text-chalk border border-white/10 hover:bg-white/[0.075] hover:border-white/20",
  ghost:
    "bg-transparent text-mist border border-transparent hover:text-chalk hover:bg-white/[0.05]",
  quiet:
    "bg-white/[0.025] text-mist border border-white/[0.07] hover:text-chalk hover:bg-white/[0.055]",
  danger:
    "bg-clay/10 text-clay border border-clay/30 hover:bg-clay/15 hover:border-clay/45",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[12.5px] rounded-[9px] gap-1.5",
  md: "h-11 px-4 text-[13.5px] rounded-[11px] gap-2",
  lg: "h-12 px-5 text-[14px] rounded-[12px] gap-2.5",
  icon: "h-10 w-10 rounded-[10px] justify-center",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,transform,box-shadow] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
