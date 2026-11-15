import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookMarked,
  Check,
  ChevronLeft,
  CircleHelp,
  Layers,
  ListOrdered,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { ChapterRail } from "@/components/ChapterRail";
import { PageHeader } from "@/components/PageHeader";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Button } from "@/components/Button";
import { Chip, Tag } from "@/components/Chip";
import { QuestionView } from "@/components/QuestionView";
import { ExplanationDrawer } from "@/components/ExplanationDrawer";
import {
  aiPracticalDeck,
  getChapter,
  type UnifiedQuestion,
} from "@/lib/questions";
import { getChapterStats, useProgress } from "@/lib/progress";
import { cn } from "@/lib/format";

export function PatternsPage() {
  const { state, updatePrefs, setPatternMark, answerQuestion } = useProgress();
  const stats = useMemo(() => getChapterStats(state), [state]);
  const chapterNumber = state.prefs.lastChapter;
  const chapter = getChapter(chapterNumber);

  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [drawerQuestion, setDrawerQuestion] = useState<UnifiedQuestion | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drills = useMemo(
    () => aiPracticalDeck.filter((question) => question.chapterNumber === chapterNumber),
    [chapterNumber],
  );

  const activePattern =
    chapter?.practical.find((pattern) => pattern.id === selectedPatternId) ??
    chapter?.practical[0] ??
    null;

  const marks = useMemo(() => {
    if (!chapter) return { known: 0, shaky: 0 };
    let known = 0;
    let shaky = 0;
    for (const pattern of chapter.practical) {
      const mark = state.patterns[pattern.id];
      if (mark === "known") known += 1;
      if (mark === "shaky") shaky += 1;
    }
    return { known, shaky };
  }, [chapter, state.patterns]);

  const changeChapter = (next: number) => {
    updatePrefs({ lastChapter: next });
    setSelectedPatternId(null);
    setAnswers({});
  };

  const handleSelect = (question: UnifiedQuestion, optionIndex: number) => {
    setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }));
    answerQuestion(question.id, optionIndex, optionIndex === question.correctIndex);
  };

  if (!chapter) {
    return (
      <div className="glass rounded-[20px] p-8 text-center text-mist">
        تعذّر تحميل بيانات الشابتر.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="DEPARTMENT 02 · PATTERNS"
        title="أطلس أنواع المسائل"
        titleEn="Problem-Type Atlas"
        description="لكل شابتر: نوع المسألة، خطوات الحل المجردة، مثال محلول كامل، وتمارين AI عملية. علّم كل نوع بـ Known أو Shaky عشان تعرف ترجع لإيه."
        actions={
          <Link to="/solve">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Target size={14} />
              طبّق في الحل
            </Button>
          </Link>
        }
      />

      <ChapterRail stats={stats} active={chapterNumber} onChange={changeChapter} />

      <div className="glass mb-5 flex flex-col gap-3 rounded-[18px] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag tone="ember">Chapter {chapter.number}</Tag>
            <Tag tone="mono">{chapter.practical.length} patterns</Tag>
            <Tag tone="mono">{drills.length} AI drills</Tag>
          </div>
          <h2 className="mt-2 text-[17px] font-bold tracking-[-0.03em] text-chalk">
            {chapter.titleAr}
          </h2>
          <p className="mixed-ar mt-1 text-[11.5px] leading-6 text-dim">
            {chapter.summaryAr}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="rounded-[11px] border border-jade/25 bg-jade/[0.06] px-3 py-2 text-center">
            <div className="tabular font-mono text-[16px] text-jade">{marks.known}</div>
            <div className="text-[9px] text-dim">Known</div>
          </div>
          <div className="rounded-[11px] border border-clay/25 bg-clay/[0.06] px-3 py-2 text-center">
            <div className="tabular font-mono text-[16px] text-clay">{marks.shaky}</div>
            <div className="text-[9px] text-dim">Shaky</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-[86px] lg:self-start">
          <div className="mb-2 flex items-center gap-2 px-1 text-[10.5px] font-medium text-dim">
            <Layers size={13} className="text-ember" />
            أنواع المسائل
          </div>
          <div className="grid gap-2">
            {chapter.practical.map((pattern, index) => {
              const isActive = activePattern?.id === pattern.id;
              const mark = state.patterns[pattern.id];
              return (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={cn(
                    "group rounded-[13px] border px-3.5 py-3 text-right transition-colors",
                    isActive
                      ? "border-ember/40 bg-ember/[0.07]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9.5px] text-dim">
                      PATTERN {String(index + 1).padStart(2, "0")}
                    </span>
                    {mark ? (
                      <span
                        className={cn(
                          "flex items-center gap-1 font-mono text-[8.5px]",
                          mark === "known" ? "text-jade" : "text-clay",
                        )}
                      >
                        {mark === "known" ? <Check size={10} /> : <TriangleAlert size={10} />}
                        {mark}
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={cn(
                      "mt-1 line-clamp-2 text-[11.5px] font-medium leading-5",
                      isActive ? "text-chalk" : "text-mist",
                    )}
                  >
                    {pattern.problemType}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-[12px] border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-dim">
              <CircleHelp size={12} className="text-ember" />
              طريقة الاستخدام
            </div>
            <p className="mt-1.5 text-[10px] leading-5 text-dim">
              اقرأ الخطوات، جرّب المثال بنفسك، بعدين علّم النوع. الـ Shaky هتلاقيه في
              Weak Topics بالداشبورد.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {activePattern ? (
            <div className="grid gap-4">
              <SpotlightCard className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.1em] text-ember">
                      <BookMarked size={12} />
                      PROBLEM TYPE
                    </div>
                    <h3 className="mixed-ar text-[17px] font-bold leading-8 tracking-[-0.02em] text-chalk">
                      {activePattern.problemType}
                    </h3>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Chip
                      active={state.patterns[activePattern.id] === "known"}
                      tone="jade"
                      onClick={() =>
                        setPatternMark(
                          activePattern.id,
                          state.patterns[activePattern.id] === "known" ? null : "known",
                        )
                      }
                    >
                      <Check size={11} />
                      Known
                    </Chip>
                    <Chip
                      active={state.patterns[activePattern.id] === "shaky"}
                      tone="clay"
                      onClick={() =>
                        setPatternMark(
                          activePattern.id,
                          state.patterns[activePattern.id] === "shaky" ? null : "shaky",
                        )
                      }
                    >
                      <TriangleAlert size={11} />
                      Shaky
                    </Chip>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <div className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold text-mist">
                    <ListOrdered size={14} className="text-ember" />
                    خطوات الحل المجردة
                  </div>
                  <ol className="grid gap-2">
                    {activePattern.stepsAr.map((step, index) => (
                      <li
                        key={index}
                        className="flex gap-3 rounded-[11px] border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5"
                      >
                        <span className="mt-0.5 font-mono text-[10px] text-ember">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mixed-ar flex-1 text-[12.5px] leading-7 text-[#d6dce6]">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles size={15} className="text-ember" />
                  <h3 className="text-[13px] font-semibold text-chalk">مثال محلول من المحاضرة</h3>
                </div>
                <div className="rounded-[12px] border border-white/[0.07] bg-black/25 px-3.5 py-3">
                  <div className="mb-1 font-mono text-[9px] tracking-[0.1em] text-dim">
                    PROBLEM
                  </div>
                  <p className="mixed-ar text-[12.5px] leading-7 text-[#d6dce6]">
                    {activePattern.workedExample.problem}
                  </p>
                </div>
                <ol className="mt-3 grid gap-2">
                  {activePattern.workedExample.solutionStepsAr.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-[11px] border border-white/[0.055] bg-white/[0.02] px-3.5 py-2.5"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-ember/20 bg-ember/[0.06] font-mono text-[8.5px] text-ember">
                        {index + 1}
                      </span>
                      <span className="mixed-ar flex-1 text-[12px] leading-7 text-mist">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex flex-col gap-1 rounded-[11px] border border-jade/20 bg-jade/[0.05] px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] text-dim">الناتج النهائي</span>
                  <span
                    dir="ltr"
                    className="text-left font-mono text-[12px] font-semibold text-jade"
                  >
                    {activePattern.workedExample.finalAnswer}
                  </span>
                </div>
              </SpotlightCard>

              {drills.length ? (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={15} className="text-ember" />
                      <h3 className="text-[13px] font-semibold text-chalk">
                        تدريبات عملية على نفس الشابتر
                      </h3>
                    </div>
                    <span className="font-mono text-[9.5px] text-dim">
                      {drills.length} AI PRACTICAL
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {drills.map((drill, index) => {
                      const selected = answers[drill.id] ?? null;
                      const answered = selected !== null;
                      return (
                        <div key={drill.id}>
                          <div className="mb-2 flex items-center justify-between px-1">
                            <span className="font-mono text-[9px] text-dim">
                              DRILL {String(index + 1).padStart(2, "0")} · {drill.problemType}
                            </span>
                            <Tag tone={drill.difficulty === "Hard" ? "clay" : "ember"}>
                              {drill.difficulty ?? "Medium"}
                            </Tag>
                          </div>
                          <QuestionView
                            question={drill}
                            selectedIndex={selected}
                            answered={answered}
                            onSelect={(optionIndex) => handleSelect(drill, optionIndex)}
                            onOpenExplanation={() => {
                              setDrawerQuestion(drill);
                              setDrawerOpen(true);
                            }}
                            showMeta={false}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col items-start justify-between gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 sm:flex-row sm:items-center">
                <p className="text-[11.5px] leading-6 text-mist">
                  خلصت النوع ده؟ جرّب تحل أسئلة الشابتر كاملة أو ارجع للبطاقات.
                </p>
                <div className="flex gap-2">
                  <Link to="/solve">
                    <Button variant="secondary" size="sm" className="gap-1.5">
                      أسئلة الشابتر
                      <ArrowLeft size={13} />
                    </Button>
                  </Link>
                  <Link to="/study">
                    <Button variant="quiet" size="sm">
                      البطاقات
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-[18px] p-8 text-center text-mist">
              مفيش أنواع مسائل مسجلة للشابتر ده.
            </div>
          )}
        </div>
      </div>

      <ExplanationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        question={drawerQuestion}
        selectedIndex={drawerQuestion ? answers[drawerQuestion.id] ?? null : null}
      />

      <div className="mt-6 flex items-center gap-2 text-[10px] text-dim">
        <ChevronLeft size={12} />
        <span>كل المحتوى من المحاضرات وبنك الأسئلة — بدون أي تعديل أو تلخيص.</span>
      </div>
    </div>
  );
}
