import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
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
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  aiPracticalDeck,
  getChapter,
  type UnifiedQuestion,
} from "@/lib/questions";
import { getChapterStats, useProgress } from "@/lib/progress";
import {
  chapterSummaryEn,
  drillStepsEn,
  patternEn,
  type PatternsLang,
} from "@/data/patterns_en";
import { cn } from "@/lib/format";

const hasArabic = /[\u0600-\u06FF]/;

const copy = {
  en: {
    eyebrow: "DEPARTMENT 02 · PATTERNS",
    title: "Problem-Type Atlas",
    description:
      "For every chapter: the problem type, its abstract solution steps, a full worked example, and AI practice drills. Mark each type Known or Shaky so you know what to revisit.",
    langLabel: "Page language",
    practiceSolve: "Practice in Solve",
    chapterTag: (n: number) => `Chapter ${n}`,
    patternsTag: (n: number) => `${n} patterns`,
    drillsTag: (n: number) => `${n} AI drills`,
    known: "Known",
    shaky: "Shaky",
    problemTypes: "Problem types",
    pattern: "PATTERN",
    howToUse: "How to use",
    howToUseBody:
      "Read the steps, try the example yourself, then mark the type. Shaky types show up under Weak Topics on the dashboard.",
    problemType: "PROBLEM TYPE",
    abstractSteps: "Abstract solution steps",
    workedExample: "Worked example from the lecture",
    problem: "PROBLEM",
    finalAnswer: "Final answer",
    practiceDrills: "Practice drills for this chapter",
    aiPractical: "AI PRACTICAL",
    drill: "DRILL",
    drillsArabicTitle: "",
    drillsArabicBody: "",
    switchToEnglish: "",
    finished:
      "Finished this type? Solve the full chapter or go back to the cards.",
    chapterQuestions: "Chapter questions",
    cards: "Cards",
    noPatterns: "No problem types recorded for this chapter.",
    loadError: "Couldn't load chapter data.",
    footer:
      "All content comes from the lectures and question bank — no edits, no summaries.",
  },
  ar: {
    eyebrow: "القسم 02 · الأنماط",
    title: "أطلس أنواع المسائل",
    description:
      "لكل شابتر: نوع المسألة، خطوات الحل المجردة، مثال محلول بالكامل، وتدريبات عملية. علّم كل نوع «أعرفه» أو «مش متأكد» عشان تعرف ترجع لإيه.",
    langLabel: "لغة الصفحة",
    practiceSolve: "تدرّب في قسم الحل",
    chapterTag: (n: number) => `الشابتر ${n}`,
    patternsTag: (n: number) => `${n} أنماط`,
    drillsTag: (n: number) => `${n} تدريب AI`,
    known: "أعرفه",
    shaky: "مش متأكد",
    problemTypes: "أنواع المسائل",
    pattern: "نمط",
    howToUse: "طريقة الاستخدام",
    howToUseBody:
      "اقرأ الخطوات، جرّب المثال بنفسك، وبعدها علّم النوع. الأنواع اللي مش متأكد منها تظهر في «المواضيع الضعيفة» على الداشبورد.",
    problemType: "نوع المسألة",
    abstractSteps: "خطوات الحل المجردة",
    workedExample: "مثال محلول من المحاضرة",
    problem: "المسألة",
    finalAnswer: "الإجابة النهائية",
    practiceDrills: "تدريبات هذا الشابتر",
    aiPractical: "تدريبات AI",
    drill: "تدريب",
    drillsArabicTitle: "التدريبات العملية متاحة بالإنجليزية فقط",
    drillsArabicBody:
      "أسئلة التدريبات مكتوبة بالإنجليزية، فبنخفيها في الوضع العربي عشان الصفحة تفضل عربي بالكامل.",
    switchToEnglish: "بدّل للإنجليزي",
    finished: "خلصت النوع ده؟ حل أسئلة الشابتر كاملة أو ارجع للكروت.",
    chapterQuestions: "أسئلة الشابتر",
    cards: "الكروت",
    noPatterns: "مفيش أنواع مسائل مسجلة للشابتر ده.",
    loadError: "مش قادر أحمّل بيانات الشابتر.",
    footer:
      "كل المحتوى من المحاضرات وبنك الأسئلة — من غير تعديل أو تلخيص.",
  },
} as const;

function PatternsLanguageToggle({
  lang,
  onChange,
  label,
}: {
  lang: PatternsLang;
  onChange: (lang: PatternsLang) => void;
  label: string;
}) {
  return <LanguageToggle lang={lang} onChange={onChange} label={label} />;
}

export function PatternsPage() {
  const { state, updatePrefs, setPatternMark, answerQuestion } = useProgress();
  const stats = useMemo(() => getChapterStats(state), [state]);
  const chapterNumber = state.prefs.lastChapter;
  const chapter = getChapter(chapterNumber);
  const lang = state.prefs.patternsLang;
  const isAr = lang === "ar";
  const t = copy[lang];

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

  const activeTranslation = activePattern ? patternEn[activePattern.id] : undefined;

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

  const changeLang = (next: PatternsLang) => {
    updatePrefs({ patternsLang: next });
    setDrawerOpen(false);
  };

  const handleSelect = (question: UnifiedQuestion, optionIndex: number) => {
    setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }));
    answerQuestion(question.id, optionIndex, optionIndex === question.correctIndex);
  };

  if (!chapter) {
    return (
      <div className="glass rounded-[20px] p-8 text-center text-mist">
        {t.loadError}
      </div>
    );
  }

  const problemType = isAr
    ? activePattern?.problemType
    : activeTranslation?.problemType ?? activePattern?.problemType;
  const abstractSteps = isAr
    ? activePattern?.stepsAr ?? []
    : activeTranslation?.steps ?? activePattern?.stepsAr ?? [];
  const workedExample = isAr
    ? {
        problem: activePattern?.workedExample.problem ?? "",
        steps: activePattern?.workedExample.solutionStepsAr ?? [],
        finalAnswer: activePattern?.workedExample.finalAnswer ?? "",
      }
    : {
        problem:
          activeTranslation?.workedExample.problem ??
          activePattern?.workedExample.problem ??
          "",
        steps:
          activeTranslation?.workedExample.steps ??
          activePattern?.workedExample.solutionStepsAr ??
          [],
        finalAnswer:
          activeTranslation?.workedExample.finalAnswer ??
          activePattern?.workedExample.finalAnswer ??
          "",
      };

  const finalAnswer = workedExample.finalAnswer;
  const answerIsArabic = hasArabic.test(finalAnswer);

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PatternsLanguageToggle lang={lang} onChange={changeLang} label={t.langLabel} />
            <Link to="/solve">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Target size={14} />
                {t.practiceSolve}
              </Button>
            </Link>
          </div>
        }
      />

      <ChapterRail
        stats={stats}
        active={chapterNumber}
        onChange={changeChapter}
        lang={lang}
      />

      <div className="glass mb-5 flex flex-col gap-3 rounded-[18px] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag tone="ember">{t.chapterTag(chapter.number)}</Tag>
            <Tag tone="mono">{t.patternsTag(chapter.practical.length)}</Tag>
            <Tag tone="mono">{t.drillsTag(drills.length)}</Tag>
          </div>
          <h2
            dir={isAr ? "rtl" : "ltr"}
            className={cn(
              "mt-2 text-[17px] font-bold tracking-[-0.03em] text-chalk",
              isAr && "mixed-ar",
            )}
          >
            {isAr ? chapter.titleAr : chapter.title}
          </h2>
          <p
            dir={isAr ? "rtl" : "ltr"}
            className={cn(
              "mt-1 text-[11.5px] leading-6 text-dim",
              isAr && "mixed-ar",
            )}
          >
            {isAr ? chapter.summaryAr : chapterSummaryEn[chapter.number] ?? chapter.summaryAr}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="rounded-[11px] border border-jade/25 bg-jade/[0.06] px-3 py-2 text-center">
            <div className="tabular font-mono text-[16px] text-jade">{marks.known}</div>
            <div className="text-[9px] text-dim">{t.known}</div>
          </div>
          <div className="rounded-[11px] border border-clay/25 bg-clay/[0.06] px-3 py-2 text-center">
            <div className="tabular font-mono text-[16px] text-clay">{marks.shaky}</div>
            <div className="text-[9px] text-dim">{t.shaky}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-[86px] lg:self-start">
          <div className="mb-2 flex items-center gap-2 px-1 text-[10.5px] font-medium text-dim">
            <Layers size={13} className="text-ember" />
            {t.problemTypes}
          </div>
          <div className="grid gap-2">
            {chapter.practical.map((pattern, index) => {
              const isActive = activePattern?.id === pattern.id;
              const mark = state.patterns[pattern.id];
              const label = isAr
                ? pattern.problemType
                : patternEn[pattern.id]?.problemType ?? pattern.problemType;
              return (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => setSelectedPatternId(pattern.id)}
                  className={cn(
                    "group rounded-[13px] border px-3.5 py-3 text-start transition-colors",
                    isActive
                      ? "border-ember/40 bg-ember/[0.07]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span dir="ltr" className="font-mono text-[9.5px] text-dim">
                      {t.pattern} {String(index + 1).padStart(2, "0")}
                    </span>
                    {mark ? (
                      <span
                        className={cn(
                          "flex items-center gap-1 font-mono text-[8.5px]",
                          mark === "known" ? "text-jade" : "text-clay",
                        )}
                      >
                        {mark === "known" ? <Check size={10} /> : <TriangleAlert size={10} />}
                        {mark === "known" ? t.known : t.shaky}
                      </span>
                    ) : null}
                  </div>
                  <div
                    dir={isAr ? "rtl" : "ltr"}
                    className={cn(
                      "mt-1 line-clamp-2 text-[11.5px] font-medium leading-5",
                      isAr && "mixed-ar",
                      isActive ? "text-chalk" : "text-mist",
                    )}
                  >
                    {label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-[12px] border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-dim">
              <CircleHelp size={12} className="text-ember" />
              {t.howToUse}
            </div>
            <p className="mt-1.5 text-[10px] leading-5 text-dim">
              {t.howToUseBody}
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
                      {t.problemType}
                    </div>
                    <h3
                      dir={isAr ? "rtl" : "ltr"}
                      className={cn(
                        "text-[17px] font-bold leading-8 tracking-[-0.02em] text-chalk",
                        isAr && "mixed-ar",
                      )}
                    >
                      {problemType}
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
                      {t.known}
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
                      {t.shaky}
                    </Chip>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <div className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold text-mist">
                    <ListOrdered size={14} className="text-ember" />
                    {t.abstractSteps}
                  </div>
                  <ol dir={isAr ? "rtl" : "ltr"} className="grid gap-2">
                    {abstractSteps.map((step, index) => (
                      <li
                        key={index}
                        className="flex gap-3 rounded-[11px] border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5"
                      >
                        <span className="mt-0.5 font-mono text-[10px] text-ember">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "flex-1 text-[12.5px] leading-7 text-[#d6dce6]",
                            isAr && "mixed-ar",
                          )}
                        >
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
                  <h3 className="text-[13px] font-semibold text-chalk">
                    {t.workedExample}
                  </h3>
                </div>
                <div className="rounded-[12px] border border-white/[0.07] bg-black/25 px-3.5 py-3">
                  <div className="mb-1 font-mono text-[9px] tracking-[0.1em] text-dim">
                    {t.problem}
                  </div>
                  <p
                    dir={isAr ? "rtl" : "ltr"}
                    className={cn(
                      "text-[12.5px] leading-7 text-[#d6dce6]",
                      isAr && "mixed-ar",
                    )}
                  >
                    {workedExample.problem}
                  </p>
                </div>
                <ol dir={isAr ? "rtl" : "ltr"} className="mt-3 grid gap-2">
                  {workedExample.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-[11px] border border-white/[0.055] bg-white/[0.02] px-3.5 py-2.5"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-ember/20 bg-ember/[0.06] font-mono text-[8.5px] text-ember">
                        {index + 1}
                      </span>
                      <span
                        className={cn(
                          "flex-1 text-[12px] leading-7 text-mist",
                          isAr && "mixed-ar",
                        )}
                      >
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex flex-col gap-1 rounded-[11px] border border-jade/20 bg-jade/[0.05] px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] text-dim">{t.finalAnswer}</span>
                  <span
                    dir={answerIsArabic ? "rtl" : "ltr"}
                    className={cn(
                      "text-[12px] font-semibold text-jade",
                      answerIsArabic ? "mixed-ar" : "text-start font-mono",
                    )}
                  >
                    {finalAnswer}
                  </span>
                </div>
              </SpotlightCard>

              {isAr ? (
                <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.02] px-4 py-4">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-chalk">
                    <Target size={15} className="text-ember" />
                    {t.drillsArabicTitle}
                  </div>
                  <p className="mt-1.5 text-[11px] leading-6 text-mist">
                    {t.drillsArabicBody}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => changeLang("en")}
                  >
                    {t.switchToEnglish}
                  </Button>
                </div>
              ) : drills.length ? (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={15} className="text-ember" />
                      <h3 className="text-[13px] font-semibold text-chalk">
                        {t.practiceDrills}
                      </h3>
                    </div>
                    <span className="font-mono text-[9.5px] text-dim">
                      {drills.length} {t.aiPractical}
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
                              {t.drill} {String(index + 1).padStart(2, "0")} ·{" "}
                              {drill.problemType}
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
                <p className="text-[11.5px] leading-6 text-mist">{t.finished}</p>
                <div className="flex gap-2">
                  <Link to="/solve">
                    <Button variant="secondary" size="sm" className="gap-1.5">
                      {t.chapterQuestions}
                      <ArrowRight size={13} className={isAr ? "rotate-180" : undefined} />
                    </Button>
                  </Link>
                  <Link to="/study">
                    <Button variant="quiet" size="sm">
                      {t.cards}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-[18px] p-8 text-center text-mist">
              {t.noPatterns}
            </div>
          )}
        </div>
      </div>

      <ExplanationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        question={drawerQuestion}
        selectedIndex={drawerQuestion ? answers[drawerQuestion.id] ?? null : null}
        stepsOverride={
          drawerQuestion && !isAr ? drillStepsEn[drawerQuestion.id] : undefined
        }
        stepsDir={isAr ? "rtl" : "ltr"}
      />

      <div className="mt-6 flex items-center gap-2 text-[10px] text-dim">
        <ChevronLeft size={12} className={isAr ? "rotate-180" : undefined} />
        <span>{t.footer}</span>
      </div>
    </div>
  );
}
