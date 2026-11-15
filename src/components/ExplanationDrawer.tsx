import * as Dialog from "@radix-ui/react-dialog";
import {
  BookOpenCheck,
  Check,
  CornerDownLeft,
  Lightbulb,
  ListOrdered,
  X,
  XCircle,
} from "lucide-react";
import type { UnifiedQuestion } from "@/lib/questions";
import { originArabic, priorityLabel } from "@/lib/questions";
import { CodeBlock } from "@/components/CodeBlock";
import { Tag } from "@/components/Chip";
import { Button } from "@/components/Button";

export function ExplanationDrawer({
  open,
  onOpenChange,
  question,
  selectedIndex,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: UnifiedQuestion | null;
  selectedIndex: number | null;
}) {
  if (!question) return null;
  const isCorrect = selectedIndex === question.correctIndex;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm" />
        <Dialog.Content
          dir="rtl"
          className="drawer-content glass-strong fixed left-0 top-0 z-[90] flex h-full w-full max-w-[480px] flex-col border-r-0 border-l border-white/10 focus:outline-none"
          aria-describedby={undefined}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
            <div>
              <Dialog.Title className="flex items-center gap-2 text-[14px] font-semibold text-chalk">
                <Lightbulb size={16} className="text-ember" />
                الشرح والحل
              </Dialog.Title>
              <p className="mt-1 text-[10.5px] text-dim">
                {originArabic(question.origin)} · {priorityLabel(question)}
              </p>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="إغلاق الشرح">
                <X size={17} />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div
              className={`mb-5 flex items-start gap-3 rounded-[14px] border px-4 py-3 ${
                isCorrect
                  ? "border-jade/25 bg-jade/[0.07]"
                  : "border-clay/25 bg-clay/[0.07]"
              }`}
            >
              {isCorrect ? (
                <Check size={18} className="mt-0.5 shrink-0 text-jade" />
              ) : (
                <XCircle size={18} className="mt-0.5 shrink-0 text-clay" />
              )}
              <div>
                <div className={`text-[12.5px] font-semibold ${isCorrect ? "text-jade" : "text-clay"}`}>
                  {isCorrect ? "إجابة صحيحة" : "الإجابة الصح"}
                </div>
                <div dir="ltr" className="mt-1 text-[13px] font-semibold text-chalk">
                  {question.correctAnswer}
                </div>
              </div>
            </div>

            {question.code ? (
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-mist">
                  <CornerDownLeft size={13} className="text-ember" />
                  الكود / المعادلة
                </div>
                <CodeBlock code={question.code} />
              </div>
            ) : null}

            {question.explanationAr ? (
              <section className="mb-5">
                <h3 className="mb-2 flex items-center gap-2 text-[11.5px] font-semibold text-mist">
                  <BookOpenCheck size={14} className="text-ember" />
                  الشرح
                </h3>
                <p className="mixed-ar text-[13.5px] leading-[2.05] text-[#d8dde6]">
                  {question.explanationAr}
                </p>
              </section>
            ) : null}

            {question.stepsAr?.length ? (
              <section className="mb-5">
                <h3 className="mb-2 flex items-center gap-2 text-[11.5px] font-semibold text-mist">
                  <ListOrdered size={14} className="text-ember" />
                  خطوات الحل
                </h3>
                <ol className="grid gap-2">
                  {question.stepsAr.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                    >
                      <span className="mt-0.5 font-mono text-[10px] text-ember">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mixed-ar flex-1 text-[12.5px] leading-7 text-[#d8dde6]">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="text-[10.5px] font-medium text-dim">نوع السؤال</div>
              <div className="mt-1 text-[12.5px] text-chalk">{question.topic}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag tone="mono">{question.sourceLabel}</Tag>
                <Tag tone="ember">{priorityLabel(question)}</Tag>
                {question.difficulty ? <Tag>{question.difficulty}</Tag> : null}
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.07] px-5 py-4">
            <Dialog.Close asChild>
              <Button variant="secondary" className="w-full">
                رجوع للحل
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
