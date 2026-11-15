import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/format";

interface FormulaProps {
  tex: string;
  display?: boolean;
  className?: string;
}

export function Formula({ tex, display = false, className }: FormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: display,
        strict: false,
        trust: false,
        output: "html",
      });
    } catch {
      return tex;
    }
  }, [tex, display]);

  return (
    <span
      dir="ltr"
      className={cn(display ? "formula-shell block" : "inline-block", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function FormulaList({
  formulas,
  className,
}: {
  formulas: string[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      {formulas.map((formula, index) => (
        <div key={`${formula}-${index}`} className="formula-shell">
          <Formula tex={formula} display />
        </div>
      ))}
    </div>
  );
}
