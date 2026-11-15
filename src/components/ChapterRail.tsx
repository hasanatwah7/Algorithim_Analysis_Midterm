import type { ChapterStat } from "@/lib/progress";
import type { PatternsLang } from "@/data/patterns_en";
import { cn, formatPercent } from "@/lib/format";

export function ChapterRail({
  stats,
  active,
  onChange,
  showProgress = true,
  lang = "ar",
}: {
  stats: ChapterStat[];
  active: number;
  onChange: (chapter: number) => void;
  showProgress?: boolean;
  lang?: PatternsLang;
}) {
  return (
    <div className="hide-scrollbar -mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
      {stats.map((chapter) => {
        const isActive = chapter.number === active;
        return (
          <button
            key={chapter.number}
            type="button"
            onClick={() => onChange(chapter.number)}
            aria-pressed={isActive}
            className={cn(
              "group relative flex min-w-[176px] shrink-0 flex-col gap-2 rounded-[14px] border px-3.5 py-3 text-start transition-colors duration-150",
              isActive
                ? "border-ember/40 bg-ember/[0.07]"
                : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "font-mono text-[10px] tracking-[0.1em]",
                  isActive ? "text-ember" : "text-dim",
                )}
              >
                CH {String(chapter.number).padStart(2, "0")}
              </span>
              {showProgress ? (
                <span
                  className={cn(
                    "tabular font-mono text-[9.5px]",
                    isActive ? "text-ember-soft" : "text-dim",
                  )}
                >
                  {chapter.answered}/{chapter.total}
                </span>
              ) : null}
            </div>
            <div
              dir={lang === "ar" ? "rtl" : "ltr"}
              className={cn(
                "line-clamp-2 text-start text-[12px] font-semibold leading-[1.5]",
                lang === "ar" && "mixed-ar",
                isActive ? "text-chalk" : "text-mist",
              )}
            >
              {lang === "ar" ? chapter.titleAr : chapter.title}
            </div>
            {showProgress ? (
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-500",
                      chapter.mastery >= 0.8
                        ? "bg-jade"
                        : chapter.mastery >= 0.4
                          ? "bg-ember"
                          : "bg-clay/80",
                    )}
                    style={{ width: `${Math.max(2, chapter.mastery * 100)}%` }}
                  />
                </div>
                <span className="tabular font-mono text-[8.5px] text-dim">
                  {formatPercent(chapter.mastery)}
                </span>
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
