import { cn } from "@/lib/format";

export type PageLang = "en" | "ar";

export function LanguageToggle({
  lang,
  onChange,
  label,
}: {
  lang: PageLang;
  onChange: (lang: PageLang) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1"
    >
      <button
        type="button"
        aria-pressed={lang === "en"}
        onClick={() => onChange("en")}
        className={cn(
          "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
          lang === "en"
            ? "bg-ember/15 text-ember-soft"
            : "text-dim hover:text-mist",
        )}
      >
        English
      </button>
      <button
        type="button"
        aria-pressed={lang === "ar"}
        onClick={() => onChange("ar")}
        className={cn(
          "rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
          lang === "ar"
            ? "bg-ember/15 text-ember-soft"
            : "text-dim hover:text-mist",
        )}
      >
        عربي
      </button>
    </div>
  );
}
