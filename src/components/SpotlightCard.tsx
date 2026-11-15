import {
  useRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/format";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
}

export function SpotlightCard({
  className,
  children,
  as = "div",
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty("--spot-x", `${x}px`);
      element.style.setProperty("--spot-y", `${y}px`);
    });
  };

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      onPointerMove={handlePointerMove}
      className={cn("spotlight glass rounded-[20px]", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
