import {
  ArrowLeft,
  BookOpen,
  Check,
  Clock3,
  Flag,
  Star,
  X,
} from "lucide-react";
import type { UnifiedQuestion } from "@/lib/questions";
import { originLabel, priorityLabel } from "@/lib/questions";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/Button";
import { Tag } from "@/components/Chip";
import { cn, formatIndex } from "@/lib/format";

export type QuestionMode = "practice" | "speedrun" | "exam";

export function QuestionView({
  question,
  selectedIndex,
  answered,
  onSelect,
  onOpenExplanation,
  saved,
  onToggleSave,
  mode = "practice",
  index,
  total,
  timedOut = false,
  onNext,
  nextLabel = "السؤال التالي",
  showMeta = true,
}: {
  question: UnifiedQuestion;
  selectedIndex: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
  onOpenExplanation?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  mode?: QuestionMode;
  index?: number;
  total?: number;
  timedOut?: boolean;
  onNext?: () => void;
  nextLabel?: string;
  showMeta?: boolean;
}) {
  const reveal = answered && mode !== "exam";
  const correct = selectedIndex === question.correctIndex;

  return (
    <section className="relative">
      {showMeta ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag tone="mono">{question.sourceLabel}</Tag>
            <Tag tone="ember">{priorityLabel(question)}</Tag>
            <Tag>{question.chapterNumber === "general" ? "General" : `Chapter ${question.chapterNumber}`}</Tag>
            {question.difficulty ? <Tag>{question.difficulty}</Tag> : null}
            {timedOut ? (
              <Tag tone="clay">
                <Clock3 size={10} /> الوقت خلص
              </Tag>
            ) : null}
          </div>
          <div className="flex items-center gap-1.5">
            {typeof index === "number" && typeof total === "number" ? (
              <span className="tabular mr-1 font-mono text-[10.5px] text-dim">
                {formatIndex(index + 1)} / {formatIndex(total)}
              </span>
            ) : null}
            {onToggleSave ? (
              <button
                type="button"
                onClick={onToggleSave}
                aria-pressed={saved}
                aria-label={saved ? "شيل من المحفوظات" : "احفظ السؤال"}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-[9px] border transition-colors",
                  saved
                    ? "border-ember/30 bg-ember/10 text-ember"
                    : "border-white/[0.08] bg-white/[0.02] text-dim hover:text-mist",
                )}
              >
                <Star size={15} fill={saved ? "currentColor" : "none"} />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="glass rounded-[20px] p-5 sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-ember/20 bg-ember/[0.07] font-mono text-[10px] text-ember">
            Q
          </span>
          <div className="min-w-0 flex-1">
            <h2
              dir="ltr"
              className="text-pretty text-left text-[15px] font-medium leading-[1.7] tracking-[-0.01em] text-chalk sm:text-[16.5px]"
            >
              {question.question}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] text-dim">{question.topic}</span>
              {question.problemType ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/15" />
                  <span className="text-[10.5px] text-dim">{originLabel(question.origin)}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {question.code ? <CodeBlock code={question.code} className="mb-5" /> : null}

        <div
          className="grid gap-2"
          role="group"
          aria-label="اختيارات الإجابة"
        >
          {question.options.map((option, optionIndex) => {
            const isSelected = selectedIndex === optionIndex;
            const isCorrectOption = optionIndex === question.correctIndex;
            const showCorrect = reveal && isCorrectOption;
            const showWrong = reveal && isSelected && !isCorrectOption;
            const dimmed = reveal && !isCorrectOption && !isSelected;

            return (
              <button
                key={optionIndex}
                type="button"
                disabled={answered && mode !== "exam"}
                onClick={() => onSelect(optionIndex)}
                aria-pressed={isSelected}
                className={cn(
                  "group flex min-h-[52px] w-full items-center gap-3 rounded-[13px] border px-3.5 py-2.5 text-left transition-[background-color,border-color,opacity,transform] duration-150 active:scale-[0.995]",
                  "disabled:cursor-default",
                  showCorrect
                    ? "border-jade/40 bg-jade/[0.09]"
                    : showWrong
                      ? "border-clay/40 bg-clay/[0.08]"
                      : isSelected
                        ? "border-ember/45 bg-ember/[0.08]"
                        : "border-white/[0.075] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.045]",
                  dimmed && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-[7px] border font-mono text-[10px] transition-colors",
                    showCorrect
                      ? "border-jade/40 bg-jade/15 text-jade"
                      : showWrong
                        ? "border-clay/40 bg-clay/15 text-clay"
                        : isSelected
                          ? "border-ember/40 bg-ember/15 text-ember"
                          : "border-white/10 bg-white/[0.03] text-dim group-hover:text-mist",
                  )}
                >
                  {showCorrect ? (
                    <Check size={13} />
                  ) : showWrong ? (
                    <X size={13} />
                  ) : (
                    String.fromCharCode(65 + optionIndex)
                  )}
                </span>
                <span
                  dir="ltr"
                  className="flex-1 text-left font-mono text-[12px] leading-6 text-[#d2d9e4]"
                >
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {reveal ? (
          <div
            className={cn(
              "mt-5 flex flex-col gap-3 rounded-[14px] border px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
              correct
                ? "border-jade/25 bg-jade/[0.06]"
                : "border-clay/25 bg-clay/[0.06]",
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full",
                  correct ? "bg-jade/15 text-jade" : "bg-clay/15 text-clay",
                )}
              >
                {correct ? <Check size={14} /> : <X size={14} />}
              </span>
              <div>
                <div
                  className={cn(
                    "text-[12px] font-semibold",
                    correct ? "text-jade" : "text-clay",
                  )}
                >
                  {correct ? "إجابة صحيحة" : "إجابة غلط"}
                </div>
                <div dir="ltr" className="mt-0.5 text-left font-mono text-[10.5px] text-mist">
                  {correct ? "Nice. الشرح متاح." : `Correct: ${question.correctAnswer}`}
                </div>
              </div>
            </div>
            {onOpenExplanation ? (
              <Button variant="secondary" size="sm" onClick={onOpenExplanation} className="gap-1.5">
                <BookOpen size={14} />
                افتح الشرح
              </Button>
            ) : null}
          </div>
        ) : null}

        {mode === "exam" ? (
          <div className="mt-4 flex items-center gap-2 text-[10.5px] text-dim">
            <Flag size={12} className="text-ember" />
            اختيارك محفوظ في المسودة. مفيش تصحيح قبل التسليم.
          </div>
        ) : null}

        {onNext && reveal ? (
          <div className="mt-4 flex justify-end">
            <Button variant="primary" onClick={onNext} className="gap-1.5">
              {nextLabel}
              <ArrowLeft size={15} />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
