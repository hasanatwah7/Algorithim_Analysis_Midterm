import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Filter,
  ListChecks,
  RotateCcw,
  Search,
  Star,
  Target,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { QuestionView } from "@/components/QuestionView";
import { ExplanationDrawer } from "@/components/ExplanationDrawer";
import { TimerControls } from "@/components/TimerControls";
import { Button } from "@/components/Button";
import { Chip, Tag } from "@/components/Chip";
import { ProgressBar } from "@/components/Progress";
import { EmptyState } from "@/components/PageHeader";
import {
  allChapterNumbers,
  allQuestions,
  chapterArabicLabel,
  originLabel,
  type QuestionOrigin,
  type UnifiedQuestion,
} from "@/lib/questions";
import { useProgress } from "@/lib/progress";
import { useCountdown } from "@/lib/useCountdown";
import { cn, formatPercent, normalize } from "@/lib/format";

type StatusFilter = "all" | "unanswered" | "wrong" | "correct" | "saved";
type ChapterFilter = number | "all";
type TierFilter = "all" | 1 | 2 | 3;

const origins: Array<QuestionOrigin | "all"> = [
  "all",
  "quiz",
  "ai-theory",
  "ai-practical",
];

const statuses: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "الكل" },
  { id: "unanswered", label: "لسه" },
  { id: "wrong", label: "أخطاء" },
  { id: "correct", label: "صح" },
  { id: "saved", label: "محفوظ" },
];

export function SolvePage() {
  const {
    state,
    answerQuestion,
    toggleSaved,
    updatePrefs,
  } = useProgress();

  const [chapterFilter, setChapterFilter] = useState<ChapterFilter>("all");
  const [originFilter, setOriginFilter] = useState<QuestionOrigin | "all">("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, number>>({});
  const [timedOutIds, setTimedOutIds] = useState<Set<string>>(new Set());
  const [drawerQuestion, setDrawerQuestion] = useState<UnifiedQuestion | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = normalize(query);
    return allQuestions.filter((question) => {
      if (chapterFilter !== "all" && question.chapterNumber !== chapterFilter) {
        return false;
      }
      if (originFilter !== "all" && question.origin !== originFilter) return false;
      if (tierFilter !== "all" && question.priority !== tierFilter) return false;

      const record = state.answers[question.id];
      if (statusFilter === "unanswered" && record) return false;
      if (statusFilter === "wrong" && record?.correct !== false) return false;
      if (statusFilter === "correct" && record?.correct !== true) return false;
      if (statusFilter === "saved" && !state.saved.includes(question.id)) return false;

      if (needle) {
        const haystack = normalize(
          [question.question, question.code ?? "", question.topic, question.correctAnswer].join(
            " ",
          ),
        );
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [
    chapterFilter,
    originFilter,
    tierFilter,
    statusFilter,
    query,
    state.answers,
    state.saved,
  ]);

  const safeIndex = filtered.length ? Math.min(index, filtered.length - 1) : 0;
  const current = filtered[safeIndex] ?? null;

  useEffect(() => {
    setIndex(0);
  }, [chapterFilter, originFilter, tierFilter, statusFilter, query]);

  const currentRecord = current ? state.answers[current.id] : undefined;
  const selectedIndex =
    current != null
      ? localAnswers[current.id] ?? currentRecord?.selectedIndex ?? null
      : null;
  const answered = selectedIndex !== null;

  const countdown = useCountdown({
    seconds: state.prefs.timerPreset,
    active: state.prefs.timerMode !== "off" && current != null && !answered,
    resetKey: current?.id ?? "none",
    onExpire: () => {
      if (!current) return;
      setLocalAnswers((previous) => ({ ...previous, [current.id]: -1 }));
      setTimedOutIds((previous) => new Set(previous).add(current.id));
      answerQuestion(current.id, -1, false);
      setDrawerQuestion(current);
      setDrawerOpen(true);
    },
  });

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (!current || answered) return;
      setLocalAnswers((previous) => ({ ...previous, [current.id]: optionIndex }));
      answerQuestion(current.id, optionIndex, optionIndex === current.correctIndex);
    },
    [answerQuestion, answered, current],
  );

  const goTo = (next: number) => {
    if (!filtered.length) return;
    const clamped = Math.max(0, Math.min(filtered.length - 1, next));
    setIndex(clamped);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answeredInFilter = filtered.filter((question) => state.answers[question.id]);
  const correctInFilter = answeredInFilter.filter(
    (question) => state.answers[question.id]?.correct,
  );
  const accuracy = answeredInFilter.length
    ? correctInFilter.length / answeredInFilter.length
    : 0;
  const sessionProgress = filtered.length ? (safeIndex + 1) / filtered.length : 0;

  const resetFilters = () => {
    setChapterFilter("all");
    setOriginFilter("all");
    setTierFilter("all");
    setStatusFilter("all");
    setQuery("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="DEPARTMENT 03 · SOLVE"
        title="حل الأسئلة"
        titleEn="Practice Arena"
        description="87 سؤال من بنك الأسئلة والـ AI — فلتر بالشابتر أو النوع أو الحالة، وشغّل مؤقت لكل سؤال. كل إجابة بتتسجل في تقدمك."
        actions={
          <div className="flex items-center gap-2">
            <Tag tone="mono">
              {answeredInFilter.length}/{filtered.length} answered
            </Tag>
            <TimerControls
              mode={state.prefs.timerMode}
              preset={state.prefs.timerPreset}
              remaining={countdown.remaining}
              running={countdown.running}
              onModeChange={(mode) => updatePrefs({ timerMode: mode })}
              onPresetChange={(preset) => updatePrefs({ timerPreset: preset })}
              onStart={countdown.start}
              onPause={countdown.pause}
              onReset={countdown.reset}
              compact
            />
          </div>
        }
      />

      <div className="glass mb-5 rounded-[18px] p-3.5 sm:p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-dim">
            <Filter size={12} className="text-ember" />
            الشابتر
          </div>
          <Chip
            active={chapterFilter === "all"}
            tone="ember"
            onClick={() => setChapterFilter("all")}
          >
            الكل
          </Chip>
          {allChapterNumbers().map((number) => (
            <Chip
              key={number}
              active={chapterFilter === number}
              tone="ember"
              onClick={() => setChapterFilter(number)}
              title={chapterArabicLabel(number)}
            >
              <span className="font-mono">CH {number}</span>
            </Chip>
          ))}
        </div>

        <div className="grid gap-3 border-t border-white/[0.06] pt-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="ml-1 text-[10px] text-dim">المصدر</span>
            {origins.map((origin) => (
              <Chip
                key={origin}
                active={originFilter === origin}
                tone="ember"
                onClick={() => setOriginFilter(origin)}
              >
                {origin === "all" ? "الكل" : originLabel(origin)}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="ml-1 text-[10px] text-dim">الأولوية</span>
            {(["all", 1, 2, 3] as const).map((tier) => (
              <Chip
                key={tier}
                active={tierFilter === tier}
                tone="ember"
                onClick={() => setTierFilter(tier)}
                className="font-mono"
              >
                {tier === "all" ? "الكل" : `T${tier}`}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="ml-1 text-[10px] text-dim">الحالة</span>
            {statuses.map((status) => (
              <Chip
                key={status.id}
                active={statusFilter === status.id}
                tone={status.id === "wrong" ? "clay" : status.id === "correct" ? "jade" : "ember"}
                onClick={() => setStatusFilter(status.id)}
              >
                {status.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex h-9 flex-1 items-center gap-2 rounded-[9px] border border-white/[0.08] bg-white/[0.02] px-3 focus-within:border-ember/40">
            <Search size={13} className="shrink-0 text-dim" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في نص السؤال، الكود، أو الموضوع…"
              dir="auto"
              className="w-full bg-transparent text-[11.5px] text-chalk placeholder:text-dim focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] text-dim">
              {filtered.length} نتيجة · دقة {formatPercent(accuracy)}
            </span>
            <Button variant="quiet" size="sm" onClick={resetFilters} className="gap-1.5">
              <RotateCcw size={12} />
              تصفير
            </Button>
          </div>
        </div>
      </div>

      {current ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10.5px] text-dim">
                <ListChecks size={13} className="text-ember" />
                <span className="tabular font-mono">
                  {String(safeIndex + 1).padStart(3, "0")} /{" "}
                  {String(filtered.length).padStart(3, "0")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => goTo(safeIndex - 1)}
                  disabled={safeIndex <= 0}
                  className="gap-1.5"
                >
                  <ArrowRight size={13} />
                  السابق
                </Button>
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() => goTo(safeIndex + 1)}
                  disabled={safeIndex >= filtered.length - 1}
                  className="gap-1.5"
                >
                  التالي
                  <ArrowLeft size={13} />
                </Button>
              </div>
            </div>

            <QuestionView
              question={current}
              selectedIndex={selectedIndex}
              answered={answered}
              onSelect={handleSelect}
              saved={state.saved.includes(current.id)}
              onToggleSave={() => toggleSaved(current.id)}
              onOpenExplanation={() => {
                setDrawerQuestion(current);
                setDrawerOpen(true);
              }}
              index={safeIndex}
              total={filtered.length}
              timedOut={timedOutIds.has(current.id)}
              onNext={
                safeIndex < filtered.length - 1 ? () => goTo(safeIndex + 1) : undefined
              }
              nextLabel="السؤال التالي"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                {currentRecord ? (
                  <Tag tone={currentRecord.correct ? "jade" : "clay"}>
                    {currentRecord.correct ? (
                      <CheckCircle2 size={10} />
                    ) : (
                      <XCircle size={10} />
                    )}
                    {currentRecord.correct ? "محلول صح" : "محتاج مراجعة"}
                  </Tag>
                ) : (
                  <Tag>لسه متحلش</Tag>
                )}
                {state.saved.includes(current.id) ? (
                  <Tag tone="ember">
                    <Star size={10} fill="currentColor" />
                    محفوظ
                  </Tag>
                ) : null}
                <Tag tone="mono">{current.sourceLabel}</Tag>
                <Tag tone="mono">{originLabel(current.origin)}</Tag>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setDrawerQuestion(current);
                  setDrawerOpen(true);
                }}
                className="gap-1.5"
              >
                <Target size={13} />
                الشرح الكامل
              </Button>
            </div>

            <div className="mt-4 rounded-[14px] border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="mb-2 flex items-center justify-between text-[10px] text-dim">
                <span>موقعك في القائمة</span>
                <span className="tabular font-mono">{formatPercent(sessionProgress)}</span>
              </div>
              <ProgressBar value={sessionProgress} tone="ember" />
              <div className="hide-scrollbar mt-2.5 flex gap-1 overflow-x-auto pb-0.5">
                {filtered.map((question, questionIndex) => {
                  const record = state.answers[question.id];
                  const isCurrent = questionIndex === safeIndex;
                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => goTo(questionIndex)}
                      aria-label={`السؤال ${questionIndex + 1}`}
                      className={cn(
                        "h-6 w-6 shrink-0 rounded-[5px] border font-mono text-[8.5px] transition-colors",
                        isCurrent
                          ? "border-ember bg-ember text-[#1b1206]"
                          : record?.correct === true
                            ? "border-jade/35 bg-jade/15 text-jade"
                            : record?.correct === false
                              ? "border-clay/35 bg-clay/15 text-clay"
                              : "border-white/[0.08] bg-white/[0.02] text-dim hover:text-mist",
                      )}
                    >
                      {questionIndex + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-3 lg:sticky lg:top-[86px] lg:self-start">
            <div className="glass rounded-[16px] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-chalk">الفلاتر الحالية</h3>
                <Tag tone="mono">{filtered.length}</Tag>
              </div>
              <div className="grid gap-2 text-[10.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-dim">الشابتر</span>
                  <span className="text-mist">
                    {chapterFilter === "all" ? "الكل" : `CH ${chapterFilter}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dim">المصدر</span>
                  <span className="text-mist">
                    {originFilter === "all" ? "الكل" : originLabel(originFilter)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dim">الأولوية</span>
                  <span className="font-mono text-mist">
                    {tierFilter === "all" ? "الكل" : `Tier ${tierFilter}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-dim">الحالة</span>
                  <span className="text-mist">
                    {statuses.find((status) => status.id === statusFilter)?.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-[16px] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[12px] font-semibold text-chalk">أرقام سريعة</h3>
                <Target size={13} className="text-ember" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <div className="tabular font-mono text-[16px] text-jade">
                    {correctInFilter.length}
                  </div>
                  <div className="text-[9px] text-dim">صح</div>
                </div>
                <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <div className="tabular font-mono text-[16px] text-clay">
                    {answeredInFilter.length - correctInFilter.length}
                  </div>
                  <div className="text-[9px] text-dim">غلط</div>
                </div>
                <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <div className="tabular font-mono text-[16px] text-chalk">
                    {filtered.length - answeredInFilter.length}
                  </div>
                  <div className="text-[9px] text-dim">لسه</div>
                </div>
                <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                  <div className="tabular font-mono text-[16px] text-ember">
                    {state.saved.length}
                  </div>
                  <div className="text-[9px] text-dim">محفوظ</div>
                </div>
              </div>
            </div>

            <div className="rounded-[14px] border border-ember/15 bg-ember/[0.035] p-3.5">
              <div className="mb-1.5 text-[10px] font-medium text-ember">تريك المؤقت</div>
              <p className="text-[10px] leading-5 text-dim">
                لما الوقت يخلص والسؤال مش محلول، هيتسجل غلط ويتفتح الشرح تلقائياً. تقدر
                تقفل المؤقت من الإعدادات في الأعلى.
              </p>
            </div>
          </aside>
        </div>
      ) : (
        <EmptyState
          icon={<Search size={20} />}
          title="مفيش أسئلة مطابقة للفلاتر"
          description="جرّب تصفير الفلاتر أو غيّر الشابتر/الحالة. كل الأسئلة موجودة محلياً ومفيش حاجة ناقصة."
          action={
            <Button variant="primary" onClick={resetFilters}>
              تصفير الفلاتر
            </Button>
          }
        />
      )}

      <ExplanationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        question={drawerQuestion}
        selectedIndex={
          drawerQuestion
            ? localAnswers[drawerQuestion.id] ??
              state.answers[drawerQuestion.id]?.selectedIndex ??
              null
            : null
        }
      />
    </div>
  );
}
