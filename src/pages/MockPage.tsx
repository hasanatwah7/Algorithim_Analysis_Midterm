import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Play,
  RotateCcw,
  Send,
  ShieldQuestion,
  Timer,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { QuestionView } from "@/components/QuestionView";
import { ExplanationDrawer } from "@/components/ExplanationDrawer";
import { Button } from "@/components/Button";
import { Chip, Tag } from "@/components/Chip";
import { ProgressBar, Ring } from "@/components/Progress";
import {
  mockBreakdown,
  mockDurationSec,
  mockQuestions,
} from "@/lib/mock";
import { chapterArabicLabel, type UnifiedQuestion } from "@/lib/questions";
import { useProgress, type MockResult } from "@/lib/progress";
import { cn, formatClock, formatPercent } from "@/lib/format";

const DRAFT_KEY = "vectr-algo:v1:mock-draft";

interface MockDraft {
  startedAt: number;
  answers: Record<string, number>;
  index: number;
}

function loadDraft(): MockDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MockDraft>;
    if (!parsed.startedAt) return null;
    return {
      startedAt: parsed.startedAt,
      answers: parsed.answers ?? {},
      index: parsed.index ?? 0,
    };
  } catch {
    return null;
  }
}

function persistDraft(draft: MockDraft | null): void {
  if (typeof window === "undefined") return;
  try {
    if (draft) window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // Ignore storage failures.
  }
}

const blueprint = [1, 2, 3, 4, 5, 6].map((chapter) => {
  const questions = mockQuestions.filter(
    (question) => question.chapterNumber === chapter,
  );
  return {
    chapter,
    total: questions.length,
    quiz: questions.filter((question) => question.origin === "quiz").length,
    theory: questions.filter((question) => question.origin === "ai-theory").length,
    practical: questions.filter((question) => question.origin === "ai-practical").length,
  };
});

export function MockPage() {
  const { state, saveMockResult } = useProgress();
  const [draft, setDraft] = useState<MockDraft | null>(() => loadDraft());
  const [phase, setPhase] = useState<"intro" | "session" | "results">(() =>
    loadDraft() ? "session" : "intro",
  );
  const [now, setNow] = useState(() => Date.now());
  const [lastResult, setLastResult] = useState<MockResult | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [drawerQuestion, setDrawerQuestion] = useState<UnifiedQuestion | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const result = lastResult ?? state.mock;

  useEffect(() => {
    persistDraft(draft);
  }, [draft]);

  useEffect(() => {
    if (phase !== "session" || !draft) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [phase, draft]);

  const remaining = draft
    ? Math.max(
        0,
        mockDurationSec - Math.floor((now - draft.startedAt) / 1000),
      )
    : mockDurationSec;

  const submit = useCallback(() => {
    if (!draft) return;
    const correct = mockQuestions.filter(
      (question) => draft.answers[question.id] === question.correctIndex,
    ).length;
    const durationSec = Math.min(
      mockDurationSec,
      Math.max(0, Math.floor((Date.now() - draft.startedAt) / 1000)),
    );
    const breakdown = mockBreakdown(draft.answers);
    const next: MockResult = {
      at: Date.now(),
      total: mockQuestions.length,
      correct,
      durationSec,
      byChapter: Object.fromEntries(
        breakdown.map((entry) => [
          String(entry.chapter),
          { total: entry.total, correct: entry.correct },
        ]),
      ),
      answers: { ...draft.answers },
    };
    saveMockResult(next);
    setLastResult(next);
    setDraft(null);
    setPhase("results");
    setConfirming(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [draft, saveMockResult]);

  useEffect(() => {
    if (phase === "session" && draft && remaining <= 0) submit();
  }, [phase, draft, remaining, submit]);

  const start = () => {
    setDraft({ startedAt: Date.now(), answers: {}, index: 0 });
    setNow(Date.now());
    setLastResult(null);
    setPhase("session");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const abandon = () => {
    setDraft(null);
    setPhase("intro");
    setConfirming(false);
  };

  const current = draft ? mockQuestions[draft.index] ?? mockQuestions[0] : null;
  const answeredCount = draft ? Object.keys(draft.answers).length : 0;
  const progress = answeredCount / mockQuestions.length;

  const setAnswer = (optionIndex: number) => {
    if (!draft || !current) return;
    setDraft({
      ...draft,
      answers: { ...draft.answers, [current.id]: optionIndex },
    });
  };

  const goTo = (nextIndex: number) => {
    if (!draft) return;
    setDraft({
      ...draft,
      index: Math.max(0, Math.min(mockQuestions.length - 1, nextIndex)),
    });
  };

  const resultScore = result ? result.correct / result.total : 0;

  return (
    <div>
      <PageHeader
        eyebrow="MOCK MIDTERM · 45 MIN"
        title="امتحان تجريبي"
        titleEn="Mock Midterm"
        description="30 سؤال مختارين من كل الشابترات، 45 دقيقة، بدون تصحيح قبل التسليم. الامتحان ده تدريبي مش ورقة امتحان سابقة — الهدف يقيس جاهزيتك ويظهر نقاط الضعف."
        actions={
          phase === "session" ? (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-[10px] border px-3 py-1.5",
                  remaining <= 300
                    ? "border-clay/35 bg-clay/[0.08]"
                    : "border-ember/25 bg-ember/[0.06]",
                )}
              >
                <Timer
                  size={14}
                  className={remaining <= 300 ? "text-clay" : "text-ember"}
                />
                <span
                  className={cn(
                    "tabular font-mono text-[13px]",
                    remaining <= 300 ? "text-clay" : "text-ember-soft",
                  )}
                >
                  {formatClock(remaining)}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setConfirming(true)}
                className="gap-1.5"
              >
                <Send size={13} />
                سلّم
              </Button>
            </div>
          ) : (
            <Tag tone="mono">
              {mockQuestions.length} questions · {mockDurationSec / 60} min
            </Tag>
          )
        }
      />

      {phase === "intro" ? (
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="glass relative overflow-hidden rounded-[22px] p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-ember/[0.09] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <Tag tone="ember">
                <ShieldQuestion size={11} />
                محاكاة امتحان
              </Tag>
              <h2 className="mt-3 text-balance text-[24px] font-bold leading-[1.3] tracking-[-0.035em] text-chalk sm:text-[28px]">
                30 سؤال. 45 دقيقة.
                <br />
                قرار واحد: جاهز ولا لأ؟
              </h2>
              <p className="mixed-ar mt-3 max-w-[54ch] text-[12.5px] leading-7 text-mist">
                الأسئلة متوزعة على الست شابترات (5 لكل شابتر) ومختلطة بين أسئلة
                الامتحان والنظري والمسائل. المؤقت بيشتغل من أول ما تبدأ، ولو الوقت خلص
                بيتسلم تلقائياً.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {[
                  { icon: ClipboardList, label: "30 سؤال", sub: "5 × 6 chapters" },
                  { icon: Clock3, label: "45 دقيقة", sub: "auto-submit" },
                  { icon: Trophy, label: "نتيجة فورية", sub: "by chapter" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-[12px] border border-white/[0.07] bg-white/[0.025] px-3 py-2.5"
                    >
                      <Icon size={14} className="text-ember" />
                      <div className="mt-1.5 text-[11.5px] font-semibold text-chalk">
                        {item.label}
                      </div>
                      <div className="font-mono text-[9px] text-dim">{item.sub}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button variant="primary" size="lg" onClick={start} className="gap-2">
                  <Play size={15} />
                  ابدأ الامتحان
                </Button>
                {draft ? (
                  <Button variant="secondary" onClick={() => setPhase("session")}>
                    استكمل المحاولة
                  </Button>
                ) : null}
                {result ? (
                  <Button variant="quiet" onClick={() => setPhase("results")}>
                    شوف آخر نتيجة
                  </Button>
                ) : null}
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-[11px] border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                <AlertTriangle size={13} className="mt-0.5 shrink-0 text-ember" />
                <p className="text-[10px] leading-5 text-dim">
                  لو قفلت الصفحة، المحاولة بتتحفظ محلياً وبتكمل من نفس الوقت. مفيش
                  تصحيح أو شرح قبل التسليم.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass rounded-[18px] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-chalk">توزيع الأسئلة</h3>
                <Tag tone="mono">BLUEPRINT</Tag>
              </div>
              <div className="grid gap-1.5">
                {blueprint.map((entry) => (
                  <div
                    key={entry.chapter}
                    className="flex items-center gap-2.5 rounded-[9px] border border-white/[0.055] bg-white/[0.02] px-2.5 py-1.5"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] border border-white/10 bg-white/[0.03] font-mono text-[9px] text-ember">
                      {entry.chapter}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[10.5px] text-mist">
                      {chapterArabicLabel(entry.chapter)}
                    </span>
                    <span className="tabular shrink-0 font-mono text-[9px] text-dim">
                      {entry.quiz}Q · {entry.theory}T · {entry.practical}P
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result ? (
              <div className="glass rounded-[18px] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[12px] font-semibold text-chalk">آخر محاولة</h3>
                  <Tag tone={resultScore >= 0.7 ? "jade" : "clay"}>
                    {formatPercent(resultScore)}
                  </Tag>
                </div>
                <div className="flex items-center gap-4">
                  <Ring
                    value={resultScore}
                    size={86}
                    stroke={8}
                    sublabel="score"
                  />
                  <div className="flex-1">
                    <div className="tabular font-mono text-[13px] text-chalk">
                      {result.correct} / {result.total} صح
                    </div>
                    <div className="mt-1 text-[10px] text-dim">
                      استغرقت {formatClock(result.durationSec)}
                    </div>
                    <div className="mt-1 text-[10px] text-dim">
                      {new Date(result.at).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => setPhase("results")}
                >
                  تفاصيل النتيجة
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {phase === "session" && draft && current ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_272px]">
          <div className="min-w-0">
            <div className="glass mb-4 rounded-[16px] p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10.5px] text-dim">
                  <ClipboardList size={13} className="text-ember" />
                  <span className="tabular font-mono">
                    {String(draft.index + 1).padStart(2, "0")} / {mockQuestions.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-dim">
                  <span>{answeredCount} مجاوب</span>
                  <span className="h-1 w-1 rounded-full bg-white/15" />
                  <span>{mockQuestions.length - answeredCount} فاضل</span>
                </div>
              </div>
              <ProgressBar value={progress} tone="ember" />
            </div>

            <QuestionView
              question={current}
              selectedIndex={draft.answers[current.id] ?? null}
              answered={draft.answers[current.id] !== undefined}
              onSelect={setAnswer}
              mode="exam"
              index={draft.index}
              total={mockQuestions.length}
              onOpenExplanation={undefined}
            />

            <div className="mt-4 flex items-center justify-between gap-2">
              <Button
                variant="quiet"
                onClick={() => goTo(draft.index - 1)}
                disabled={draft.index <= 0}
                className="gap-1.5"
              >
                <ArrowRight size={14} />
                السابق
              </Button>
              <div className="flex items-center gap-2">
                {draft.answers[current.id] !== undefined ? (
                  <Tag tone="jade">
                    <Check size={10} />
                    محفوظ
                  </Tag>
                ) : (
                  <Tag>لسه</Tag>
                )}
                <Button variant="quiet" size="sm" onClick={() => setConfirming(true)}>
                  تسليم
                </Button>
              </div>
              <Button
                variant={draft.index >= mockQuestions.length - 1 ? "primary" : "secondary"}
                onClick={() =>
                  draft.index >= mockQuestions.length - 1
                    ? setConfirming(true)
                    : goTo(draft.index + 1)
                }
                className="gap-1.5"
              >
                {draft.index >= mockQuestions.length - 1 ? "سلّم الامتحان" : "التالي"}
                <ArrowLeft size={14} />
              </Button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[86px] lg:self-start">
            <div className="glass rounded-[16px] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-chalk">خريطة الأسئلة</h3>
                <span className="font-mono text-[9px] text-dim">30 Q</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {mockQuestions.map((question, questionIndex) => {
                  const answered = draft.answers[question.id] !== undefined;
                  const isCurrent = questionIndex === draft.index;
                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => goTo(questionIndex)}
                      className={cn(
                        "grid h-8 place-items-center rounded-[7px] border font-mono text-[9.5px] transition-colors",
                        isCurrent
                          ? "border-ember bg-ember text-[#1b1206]"
                          : answered
                            ? "border-ember/30 bg-ember/[0.12] text-ember"
                            : "border-white/[0.08] bg-white/[0.02] text-dim hover:text-mist",
                      )}
                    >
                      {questionIndex + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[9.5px] text-dim">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm border border-ember/40 bg-ember/20" />
                  متجاوب
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm border border-white/15 bg-white/[0.04]" />
                  فاضي
                </span>
              </div>
            </div>

            <div className="mt-3 rounded-[14px] border border-clay/20 bg-clay/[0.045] p-3.5">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-clay">
                <Clock3 size={12} />
                مؤقت الامتحان
              </div>
              <div className="tabular mt-1.5 font-mono text-[22px] font-semibold text-chalk">
                {formatClock(remaining)}
              </div>
              <p className="mt-1 text-[9.5px] leading-5 text-dim">
                الوقت مشترك على كل الأسئلة. التسليم بيحصل تلقائياً عند الصفر.
              </p>
            </div>

            <Button
              variant="danger"
              size="sm"
              className="mt-3 w-full gap-1.5"
              onClick={abandon}
            >
              <RotateCcw size={12} />
              إلغاء المحاولة
            </Button>
          </aside>
        </div>
      ) : null}

      {phase === "results" && result ? (
        <div className="grid gap-5">
          <div className="glass relative overflow-hidden rounded-[22px] p-6">
            <div
              className={cn(
                "pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl",
                resultScore >= 0.7 ? "bg-jade/[0.12]" : "bg-clay/[0.12]",
              )}
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Tag tone={resultScore >= 0.7 ? "jade" : "clay"}>
                  {resultScore >= 0.7 ? "جاهز للامتحان" : "محتاج مراجعة"}
                </Tag>
                <h2 className="mt-2.5 text-[24px] font-bold tracking-[-0.035em] text-chalk">
                  {result.correct} من {result.total} صح
                </h2>
                <p className="mt-1.5 max-w-[52ch] text-[12px] leading-6 text-mist">
                  {resultScore >= 0.85
                    ? "مستوى ممتاز — راجع الأخطاء البسيطة بس وخلّي عينك على الـ Tiers."
                    : resultScore >= 0.7
                      ? "مستوى كويس. الشابترات اللي تحت 70% هي أولوية المراجعة."
                      : "الأساس محتاج تثبيت. ارجع للنظري والبطاقات قبل محاولة تانية."}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Tag tone="mono">⏱ {formatClock(result.durationSec)}</Tag>
                  <Tag tone="mono">{formatPercent(resultScore)}</Tag>
                  <Tag tone="mono">
                    {new Date(result.at).toLocaleString("ar-EG")}
                  </Tag>
                </div>
              </div>
              <Ring value={resultScore} size={132} stroke={10} sublabel="score" />
            </div>
            <div className="relative mt-6 flex flex-wrap gap-2">
              <Button variant="primary" onClick={start} className="gap-1.5">
                <Play size={14} />
                محاولة جديدة
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPhase("intro")}
                className="gap-1.5"
              >
                <ClipboardList size={14} />
                تفاصيل الامتحان
              </Button>
              <div className="flex items-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[10.5px] text-dim">
                <BookOpenCheck size={13} className="text-ember" />
                راجع الأخطاء تحت
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="glass rounded-[18px] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-chalk">الأداء حسب الشابتر</h3>
                <Tag tone="mono">BY CHAPTER</Tag>
              </div>
              <div className="grid gap-3">
                {[1, 2, 3, 4, 5, 6].map((chapter) => {
                  const entry = result.byChapter[String(chapter)];
                  const total = entry?.total ?? 0;
                  const correct = entry?.correct ?? 0;
                  const ratio = total ? correct / total : 0;
                  return (
                    <div key={chapter}>
                      <div className="mb-1 flex items-center justify-between text-[10.5px]">
                        <span className="truncate text-mist">
                          <span className="ml-1.5 font-mono text-[9px] text-ember">
                            CH{chapter}
                          </span>
                          {chapterArabicLabel(chapter)}
                        </span>
                        <span className="tabular font-mono text-[9.5px] text-dim">
                          {correct}/{total}
                        </span>
                      </div>
                      <ProgressBar
                        value={ratio}
                        tone={ratio >= 0.7 ? "jade" : ratio >= 0.4 ? "ember" : "clay"}
                        height="h-1"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-[18px] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-chalk">ملخص سريع</h3>
                <Tag tone="mono">SUMMARY</Tag>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[11px] border border-jade/20 bg-jade/[0.05] px-3 py-2.5">
                  <CheckCircle2 size={14} className="text-jade" />
                  <div className="tabular mt-1 font-mono text-[19px] text-jade">
                    {result.correct}
                  </div>
                  <div className="text-[9.5px] text-dim">إجابات صح</div>
                </div>
                <div className="rounded-[11px] border border-clay/20 bg-clay/[0.05] px-3 py-2.5">
                  <XCircle size={14} className="text-clay" />
                  <div className="tabular mt-1 font-mono text-[19px] text-clay">
                    {result.total - result.correct}
                  </div>
                  <div className="text-[9.5px] text-dim">إجابات غلط</div>
                </div>
                <div className="rounded-[11px] border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
                  <Clock3 size={14} className="text-ember" />
                  <div className="tabular mt-1 font-mono text-[19px] text-chalk">
                    {formatClock(result.durationSec)}
                  </div>
                  <div className="text-[9.5px] text-dim">الوقت المستغرق</div>
                </div>
                <div className="rounded-[11px] border border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
                  <Trophy size={14} className="text-ember" />
                  <div className="tabular mt-1 font-mono text-[19px] text-chalk">
                    {formatPercent(resultScore)}
                  </div>
                  <div className="text-[9.5px] text-dim">النسبة</div>
                </div>
              </div>
              <p className="mt-3 text-[9.5px] leading-5 text-dim">
                النتيجة دي محفوظة على جهازك. الـ Mock مش بديل عن مراجعة النظري — استخدمها
                كإشارة لأولويات المراجعة.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-chalk">مراجعة الأسئلة</h3>
              <span className="font-mono text-[9.5px] text-dim">30 QUESTIONS</span>
            </div>
            <div className="grid gap-2.5">
              {mockQuestions.map((question, questionIndex) => {
                const selected = result.answers[question.id];
                const isCorrect = selected === question.correctIndex;
                const answered = selected !== undefined;
                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => {
                      setDrawerQuestion(question);
                      setDrawerOpen(true);
                    }}
                    className={cn(
                      "flex items-start gap-3 rounded-[13px] border px-3.5 py-3 text-right transition-colors",
                      isCorrect
                        ? "border-jade/20 bg-jade/[0.04] hover:bg-jade/[0.07]"
                        : "border-clay/20 bg-clay/[0.04] hover:bg-clay/[0.07]",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full",
                        isCorrect ? "bg-jade/15 text-jade" : "bg-clay/15 text-clay",
                      )}
                    >
                      {isCorrect ? <Check size={13} /> : <X size={13} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[9px] text-dim">
                          Q{String(questionIndex + 1).padStart(2, "0")}
                        </span>
                        <Tag tone="mono">CH {question.chapterNumber}</Tag>
                        <Tag>{question.topic}</Tag>
                        {!answered ? <Tag tone="clay">متروك</Tag> : null}
                      </div>
                      <p
                        dir="ltr"
                        className="mt-1 line-clamp-2 text-left text-[11.5px] leading-5 text-mist"
                      >
                        {question.question}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[9px] text-dim">
                        <span>إجابتك: {selected !== undefined ? question.options[selected] : "—"}</span>
                        <span className="text-jade">الصح: {question.correctAnswer}</span>
                      </div>
                    </div>
                    <ArrowLeft size={13} className="mt-2 shrink-0 text-dim" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {confirming ? (
        <div className="fixed inset-0 z-[95] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="glass-strong pop-in w-full max-w-[420px] rounded-[20px] p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] border border-ember/25 bg-ember/10 text-ember">
                <AlertTriangle size={18} />
              </span>
              <div>
                <h3 className="text-[14px] font-semibold text-chalk">تسليم الامتحان؟</h3>
                <p className="mt-1 text-[11.5px] leading-6 text-mist">
                  جاوبت {answeredCount} من {mockQuestions.length}. بعد التسليم مش هتقدر
                  تعدل الإجابات، وهتظهر النتيجة والمراجعة فوراً.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="quiet" size="sm" onClick={() => setConfirming(false)}>
                رجوع
              </Button>
              <Button variant="primary" size="sm" onClick={submit} className="gap-1.5">
                <Send size={13} />
                سلّم نهائي
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <ExplanationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        question={drawerQuestion}
        selectedIndex={
          drawerQuestion && result
            ? result.answers[drawerQuestion.id] ?? null
            : null
        }
      />

      {phase === "results" && !result ? (
        <div className="glass rounded-[18px] p-8 text-center text-mist">
          مفيش نتيجة محفوظة. ابدأ محاولة جديدة.
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-2 text-[10px] text-dim">
        <Chip active tone="ember" className="pointer-events-none h-6">
          Mock
        </Chip>
        <span>امتحان تدريبي مُجمّع من المحتوى — مش ورقة امتحان سابقة.</span>
      </div>
    </div>
  );
}
