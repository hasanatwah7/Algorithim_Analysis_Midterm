import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/format";

const tokenPattern =
  /(\/\/[^\n]*|--[^\n]*|\b(?:Algorithm|Input|Output|If|Then|Else|ElseIf|Return|for|to|do|while|if|return|repeat|until|end|min|max|abs|swap|length|heap-size|PARENT|LEFT|RIGHT|MAX-HEAPIFY|BUILD-MAX-HEAP|HEAPSORT|PARTITION|RANDOMIZED-SELECT|LIST-SEARCH|LIST-DELETE|PUSH|POP|ENQUEUE|DEQUEUE)\b|<-|≤|≥|≠|\b\d+(?:\.\d+)?\b|"[^"]*")/g;

function tokenClass(token: string): string | null {
  if (token.startsWith("//") || token.startsWith("--")) return "tok-comment";
  if (/^\d/.test(token)) return "tok-number";
  if (token.startsWith('"')) return "tok-string";
  if (token === "<-" || token === "≤" || token === "≥" || token === "≠") {
    return "tok-op";
  }
  if (/^[A-Za-z]/.test(token)) return "tok-keyword";
  return null;
}

function renderLine(line: string): ReactNode {
  const parts = line.split(tokenPattern);
  return parts.map((part, index) => {
    const kind = tokenClass(part);
    if (!kind) return <Fragment key={index}>{part}</Fragment>;
    return (
      <span key={index} className={kind}>
        {part}
      </span>
    );
  });
}

export function CodeBlock({
  code,
  className,
  label,
}: {
  code: string;
  className?: string;
  label?: string;
}) {
  const lines = code.split("\n");
  return (
    <div className={cn("code-shell", className)}>
      {label ? (
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
          <span className="font-mono text-[10px] tracking-[0.14em] text-dim">
            {label}
          </span>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-ember/50" />
          </span>
        </div>
      ) : null}
      <pre>
        <code>
          {lines.map((line, index) => (
            <span key={index} className="block min-h-[1.8em]">
              {line.length > 0 ? renderLine(line) : "\u00A0"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
