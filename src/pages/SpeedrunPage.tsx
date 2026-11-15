import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Flame,
  GripVertical,
  Home,
  Layers,
  Play,
  RotateCcw,
  Settings2,
  Shuffle,
  Sparkles,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Chip, Tag } from "@/components/Chip";
import { ProgressBar, Ring, Stat } from "@/components/Progress";
import { CodeBlock } from "@/components/CodeBlock";
import {
  chapterArabicLabel,
  originLabel,
  priorityLabel,
  type UnifiedQuestion,
} from "@/lib/questions";
import { getDeck, useProgress } from "@/lib/progress";
import { playSound } from "@/lib/sfx";
import { cn, formatClock, formatPercent } from "@/lib/format";

type Phase = "setup" | "run" | "done";

const deckOptions: Array<{ id: string; label: string; arabic: string; description: string }> = [
  { id: "master", label: "Master", arabic: "كل الأسئلة", description: "87 سؤال مرتبين بالأولوية" },
  { id: "weak", label: "Weak pool", arabic: "نقاط الضعف", description: "الشابترات اللي فيها أخطاء" },
  { id: "mistakes", label: "Mistakes", arabic: "الأخطاء", description: "كل سؤال غلطت فيه" },
  { id: "saved", label: "Saved", arabic: "المحفوظات", description: "الأسئلة اللي علّمتها" },
  { id: "quiz", label: "Quiz bank", arabic: "أسئلة الامتحان", description: "27 سؤال من السيتات" },
  { id: "ai-theory", label: "AI Theory", arabic: "نظري إضافي", description: "36 سؤال نظري" },
  { id: "ai-practical", label: "AI Practical", arabic: "مسائل إضافية", description: "24 مسألة عملية" },
  ...Array.from({ length: 6 }, (_, index) => {
    const chapter = index + 1;
    return {
      id: `chapter-${chapter}`,
      label: `Chapter ${chapter}`,
      arabic: chapterArabicLabel(chapter),
      description: `كل أسئلة الشابتر ${chapter}`,
    };
  }),
];

const presets = [30, 45, 60, 90] as const;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function SpeedrunPage() {
  const { state, answerQuestion, updatePrefs } = useProgress();
  const [phase, setPhase] = useState<Phase>("setup");
  const [queue, setQueue] = useState<UnifiedQuestion[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [requeues, setRequeues] = useState(0);
  const [cleared, setCleared] = useState<string[]>([]);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState<number>(state.prefs.timerPreset);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [hudPos, setHudPos] = useState(() => ({
    x: typeof window === "undefined" ? 16 : Math.max(12, window.innerWidth - 214),
    y: 88,
  }));

  const current = queue[0] ?? null;
  const deck = state.prefs.speedrunDeck;
  const deckSize = getDeck(state, deck).length;
  const shuffleEnabled = state.prefs.speedrunShuffle;
  const soundOn = state.prefs.sfx;
  const preset = state.prefs.timerPreset;

  const counts = useMemo(
    () =>
      Object.fromEntries(
        deckOptions.map((option) => [option.id, getDeck(state, option.id).length]),
      ) as Record<string, number>,
    [state],
  );

  const start = () => {
    const source = getDeck(state, deck);
    if (!source.length) return;
    const ordered = shuffleEnabled ? shuffle(source) : source;
    setQueue(ordered);
    setSelected(null);
    setAnswered(false);
    setLastCorrect(false);
    setAttempts(0);
    setCorrectAttempts(0);
    setStreak(0);
    setBestStreak(0);
    setRequeues(0);
    setCleared([]);
    setSecondsLeft(preset);
    setElapsed(0);
    setStartedAt(Date.now());
    setPhase("run");
    playSound("flip", soundOn);
  };

  const commitAnswer = useCallback(
    (optionIndex: number | null) => {
      if (!current || answered) return;
      const correct = optionIndex !== null && optionIndex === current.correctIndex;
      setAnswered(true);
      setSelected(optionIndex);
      setLastCorrect(correct);
      setAttempts((value) => value + 1);
      answerQuestion(current.id, optionIndex ?? -1, correct);
      playSound(correct ? "correct" : "wrong", soundOn);
      if (correct) {
        const nextStreak = streak + 1;
        setCorrectAttempts((value) => value + 1);
        setStreak(nextStreak);
        setBestStreak((value) => Math.max(value, nextStreak));
        setCleared((previous) =>
          previous.includes(current.id) ? previous : [...previous, current.id],
        );
      } else {
        setStreak(0);
      }
    },
    [answerQuestion, answered, current, soundOn, streak],
  );

  const next = useCallback(() => {
    if (!current) return;
    setQueue((previous) => {
      const [first, ...rest] = previous;
      if (!first) return previous;
      if (!lastCorrect) {
        const insertAt = Math.min(rest.length, 3 + Math.floor(Math.random() * 2));
        rest.splice(insertAt, 0, first);
        setRequeues((value) => value + 1);
      }
      return rest;
    });
    setSelected(null);
    setAnswered(false);
  }, [current, lastCorrect]);

  useEffect(() => {
    if (phase !== "run") return;
    const timer = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [phase, startedAt]);

  useEffect(() => {
    if (phase !== "run" || !timerEnabled || answered) return;
    const timer = window.setInterval(
      () => setSecondsLeft((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [phase, timerEnabled, answered, current?.id]);

  useEffect(() => {
    setSecondsLeft(preset);
  }, [current?.id, preset]);

  useEffect(() => {
    if (phase === "run" && timerEnabled && !answered && secondsLeft <= 0) {
      commitAnswer(null);
    }
  }, [secondsLeft, phase, timerEnabled, answered, commitAnswer]);

  useEffect(() => {
    if (phase === "run" && queue.length === 0 && attempts > 0) {
      setPhase("done");
      playSound("finish", soundOn);
    }
  }, [phase, queue.length, attempts, soundOn]);

  useEffect(() => {
    if (phase !== "run") return;
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (!answered && current) {
        const key = event.key.toLowerCase();
        const map: Record<string, number> = {
          "1": 0,
          "2": 1,
          "3": 2,
          "4": 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        };
        const optionIndex = map[key];
        if (optionIndex !== undefined && optionIndex < current.options.length) {
          event.preventDefault();
          commitAnswer(optionIndex);
        }
        return;
      }
      if (answered && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, answered, current, commitAnswer, next]);

  const dragState = useRef<{ dx: number; dy: number } | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = {
      dx: event.clientX - hudPos.x,
      dy: event.clientY - hudPos.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const width = 200;
    const height = 120;
    setHudPos({
      x: Math.max(8, Math.min(window.innerWidth - width, event.clientX - dragState.current.dx)),
      y: Math.max(8, Math.min(window.innerHeight - height, event.clientY - dragState.current.dy)),
    });
  };

  const onPointerUp = () => {
    dragState.current = null;
  };

  const accuracy = attempts ? correctAttempts / attempts : 0;
  const runProgress = attempts ? Math.min(1, cleared.length / Math.max(1, cleared.length + queue.length)) : 0;

  if (phase === "setup") {
    return (
      <div className="min-h-screen px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LogoMark size={30} />
              <span dir="ltr" className="font-mono text-[11px] tracking-[0.16em] text-mist">
                VECTR // SPEEDRUN
              </span>
            </div>
            <Link to="/">
              <Button variant="quiet" size="sm" className="gap-1.5">
                <Home size={13} />
                خروج
              </Button>
            </Link>
          </div>

          <div className="mb-7">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-ember">
              <Zap size={13} />
              FULLSCREEN MODE
            </div>
            <h1 className="text-balance text-[30px] font-bold leading-[1.2] tracking-[-0.04em] text-chalk sm:text-[38px]">
              Speedrun.
              <span className="mr-2 text-ember">سرعة ودقة.</span>
            </h1>
            <p className="mt-2 max-w-[58ch] text-[12.5px] leading-6 text-mist">
              كل سؤال غلط بيرجع بعد 3–4 أسئلة. اختار deck، شغّل المؤقت، واستخدم الكيبورد:
              <span className="mx-1 font-mono text-ember">1–4</span> للإجابة و
              <span className="mx-1 font-mono text-ember">Enter</span> للسؤال التالي.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="glass rounded-[20px] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-ember" />
                  <h2 className="text-[13px] font-semibold text-chalk">اختار الـ Deck</h2>
                </div>
                <Tag tone="mono">{deckSize} questions</Tag>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {deckOptions.map((option) => {
                  const active = deck === option.id;
                  const count = counts[option.id] ?? 0;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={count === 0}
                      onClick={() => updatePrefs({ speedrunDeck: option.id })}
                      className={cn(
                        "rounded-[12px] border px-3.5 py-2.5 text-right transition-colors disabled:opacity-40",
                        active
                          ? "border-ember/40 bg-ember/[0.08]"
                          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "text-[11.5px] font-semibold",
                            active ? "text-chalk" : "text-mist",
                          )}
                        >
                          {option.arabic}
                        </span>
                        <span className="tabular font-mono text-[9px] text-dim">{count}</span>
                      </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[9.5px] text-dim">
                          {option.description}
                        </span>
                        <span className="shrink-0 font-mono text-[8px] tracking-[0.08em] text-dim/70">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="glass rounded-[20px] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Settings2 size={15} className="text-ember" />
                  <h2 className="text-[13px] font-semibold text-chalk">الإعدادات</h2>
                </div>

                <div className="grid gap-3">
                  <div>
                    <div className="mb-1.5 text-[10px] text-dim">ترتيب الأسئلة</div>
                    <div className="flex gap-1.5">
                      <Chip
                        active={!shuffleEnabled}
                        tone="ember"
                        onClick={() => updatePrefs({ speedrunShuffle: false })}
                      >
                        مرتب
                      </Chip>
                      <Chip
                        active={shuffleEnabled}
                        tone="ember"
                        onClick={() => updatePrefs({ speedrunShuffle: true })}
                      >
                        <Shuffle size={11} />
                        عشوائي
                      </Chip>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 text-[10px] text-dim">المؤقت لكل سؤال</div>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip
                        active={!timerEnabled}
                        tone="ember"
                        onClick={() => setTimerEnabled(false)}
                      >
                        مقفول
                      </Chip>
                      {presets.map((value) => (
                        <Chip
                          key={value}
                          active={timerEnabled && preset === value}
                          tone="ember"
                          onClick={() => {
                            setTimerEnabled(true);
                            updatePrefs({ timerPreset: value });
                            setSecondsLeft(value);
                          }}
                          className="font-mono"
                        >
                          {value}s
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                    <span className="text-[10.5px] text-mist">مؤثرات صوتية</span>
                    <button
                      type="button"
                      onClick={() => updatePrefs({ sfx: !soundOn })}
                      aria-pressed={soundOn}
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-[7px] border transition-colors",
                        soundOn
                          ? "border-ember/30 bg-ember/10 text-ember"
                          : "border-white/10 bg-white/[0.03] text-dim",
                      )}
                      aria-label={soundOn ? "إيقاف الصوت" : "تشغيل الصوت"}
                    >
                      {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] border border-ember/20 bg-ember/[0.045] p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-ember">
                  <Flame size={14} />
                  قاعدة إعادة السؤال
                </div>
                <p className="mt-1.5 text-[10.5px] leading-5 text-mist">
                  لو غلطت، السؤال بيتأجل 3 أو 4 مواقع في الطابور ويرجعلك. مش هيطلع من
                  الجلسة غير لما تجاوبه صح.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={start}
                disabled={deckSize === 0}
                className="w-full gap-2"
              >
                <Play size={15} />
                ابدأ السرعة
              </Button>
              {deckSize === 0 ? (
                <p className="text-center text-[10px] text-clay">
                  الـ deck ده فاضي — اختار deck تاني أو حل أسئلة الأول.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const total = cleared.length;
    return (
      <div className="min-h-screen px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[860px]">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LogoMark size={30} />
              <span dir="ltr" className="font-mono text-[11px] tracking-[0.16em] text-mist">
                VECTR // SPEEDRUN
              </span>
            </div>
            <Link to="/">
              <Button variant="quiet" size="sm" className="gap-1.5">
                <Home size={13} />
                خروج
              </Button>
            </Link>
          </div>

          <div className="glass relative overflow-hidden rounded-[24px] p-6 sm:p-8">
            <div
              className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-ember/[0.12] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Tag tone="ember">
                  <Trophy size={11} />
                  SESSION COMPLETE
                </Tag>
                <h1 className="mt-2 text-[26px] font-bold tracking-[-0.04em] text-chalk">
                  {total} سؤال اتقفل
                </h1>
                <p className="mt-1.5 max-w-[46ch] text-[12px] leading-6 text-mist">
                  {accuracy >= 0.85
                    ? "دقة عالية وسرعة كويسة. جرّب deck أصعب أو قلّل وقت السؤال."
                    : accuracy >= 0.6
                      ? "أداء متوسط. الأسئلة اللي رجعت أكتر من مرة هي اللي محتاجة مراجعة."
                      : "السرعة مش كل حاجة — ارجع للشرح والبطاقات قبل speedrun تاني."}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Tag tone="mono">{formatClock(elapsed)}</Tag>
                  <Tag tone="mono">{attempts} attempts</Tag>
                  <Tag tone="mono">{requeues} requeues</Tag>
                </div>
              </div>
              <Ring value={accuracy} size={128} stroke={10} sublabel="accuracy" />
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-[12px] border border-white/[0.07] bg-white/[0.025] p-3">
                <Stat value={correctAttempts} label="إجابات صح" tone="jade" />
              </div>
              <div className="rounded-[12px] border border-white/[0.07] bg-white/[0.025] p-3">
                <Stat value={attempts - correctAttempts} label="إجابات غلط" tone="clay" />
              </div>
              <div className="rounded-[12px] border border-white/[0.07] bg-white/[0.025] p-3">
                <Stat value={bestStreak} label="أطول streak" tone="ember" />
              </div>
              <div className="rounded-[12px] border border-white/[0.07] bg-white/[0.025] p-3">
                <Stat value={requeues} label="إعادة جدولة" />
              </div>
            </div>

            <div className="relative mt-6 flex flex-wrap gap-2">
              <Button variant="primary" onClick={start} className="gap-1.5">
                <RotateCcw size={14} />
                جولة تانية
              </Button>
              <Button variant="secondary" onClick={() => setPhase("setup")} className="gap-1.5">
                <Settings2 size={14} />
                غيّر الـ deck
              </Button>
              <Link to="/solve">
                <Button variant="quiet" className="gap-1.5">
                  <ArrowLeft size={14} />
                  روح للحل
                </Button>
              </Link>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-dim">
            كل إجابة اتسجلت في تقدمك — الـ Weak Topics هتتحدث تلقائياً.
          </p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="glass rounded-[20px] p-8 text-center">
          <p className="text-mist">الـ deck خلص.</p>
          <Button className="mt-3" onClick={() => setPhase("setup")}>
            رجوع للإعدادات
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 pb-16 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <span dir="ltr" className="hidden font-mono text-[10px] tracking-[0.16em] text-dim sm:block">
              VECTR // SPEEDRUN
            </span>
          </div>
          <div className="flex flex-1 items-center gap-3">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-[9.5px] text-dim">
                <span className="font-mono">
                  {cleared.length} cleared · {queue.length} in queue
                </span>
                <span className="tabular font-mono">{formatPercent(runProgress)}</span>
              </div>
              <ProgressBar value={runProgress} tone="jade" height="h-1" />
            </div>
            <Link to="/">
              <Button variant="quiet" size="sm" className="gap-1.5">
                <X size={13} />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="glass mb-4 rounded-[18px] p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag tone="mono">{current.sourceLabel}</Tag>
              <Tag tone="ember">{priorityLabel(current)}</Tag>
              <Tag>
                {current.chapterNumber === "general" ? "General" : `CH ${current.chapterNumber}`}
              </Tag>
              <Tag tone="mono">{originLabel(current.origin)}</Tag>
            </div>
            <div className="flex items-center gap-2">
              <span className="tabular font-mono text-[10px] text-dim">
                {String(attempts + 1).padStart(3, "0")}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-ember/25 bg-ember/[0.06] px-2 py-0.5 font-mono text-[9.5px] text-ember">
                <Flame size={10} />
                {streak}
              </span>
            </div>
          </div>

          <h1
            dir="ltr"
            className="text-pretty text-left text-[16px] font-medium leading-[1.7] tracking-[-0.01em] text-chalk sm:text-[18px]"
          >
            {current.question}
          </h1>

          {current.code ? <CodeBlock code={current.code} className="mt-3" /> : null}

          <div className="mt-4 grid gap-2 sm:grid-cols-2" role="group" aria-label="اختيارات الإجابة">
            {current.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrect = optionIndex === current.correctIndex;
              const showCorrect = answered && isCorrect;
              const showWrong = answered && isSelected && !isCorrect;
              return (
                <button
                  key={optionIndex}
                  type="button"
                  disabled={answered}
                  onClick={() => commitAnswer(optionIndex)}
                  className={cn(
                    "flex min-h-[52px] items-center gap-2.5 rounded-[12px] border px-3 py-2.5 text-left transition-colors disabled:cursor-default",
                    showCorrect
                      ? "border-jade/45 bg-jade/[0.1]"
                      : showWrong
                        ? "border-clay/45 bg-clay/[0.09]"
                        : "border-white/[0.075] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.045]",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-[6px] border font-mono text-[9.5px]",
                      showCorrect
                        ? "border-jade/40 bg-jade/15 text-jade"
                        : showWrong
                          ? "border-clay/40 bg-clay/15 text-clay"
                          : "border-white/10 bg-white/[0.03] text-dim",
                    )}
                  >
                    {showCorrect ? (
                      <Check size={12} />
                    ) : showWrong ? (
                      <X size={12} />
                    ) : (
                      optionIndex + 1
                    )}
                  </span>
                  <span dir="ltr" className="flex-1 text-left font-mono text-[11.5px] leading-6 text-[#d2d9e4]">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {answered ? (
            <div
              className={cn(
                "mt-4 rounded-[13px] border px-3.5 py-3",
                lastCorrect
                  ? "border-jade/25 bg-jade/[0.05]"
                  : "border-clay/25 bg-clay/[0.05]",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full",
                      lastCorrect ? "bg-jade/15 text-jade" : "bg-clay/15 text-clay",
                    )}
                  >
                    {lastCorrect ? <Check size={12} /> : <X size={12} />}
                  </span>
                  <span
                    className={cn(
                      "text-[11.5px] font-semibold",
                      lastCorrect ? "text-jade" : "text-clay",
                    )}
                  >
                    {lastCorrect ? "صح — كمّل" : "غلط — هيرجع بعد 3–4 أسئلة"}
                  </span>
                </div>
                <span dir="ltr" className="font-mono text-[10.5px] text-mist">
                  {current.correctAnswer}
                </span>
              </div>
              {current.explanationAr ? (
                <p className="mixed-ar mt-2 text-[11px] leading-6 text-mist">
                  {current.explanationAr}
                </p>
              ) : null}
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[9px] text-dim">
                  <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono">
                    Enter
                  </kbd>
                  للسؤال التالي
                </span>
                <Button variant="primary" size="sm" onClick={next} className="gap-1.5">
                  التالي
                  <ArrowLeft size={13} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px] text-dim">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono">
                  1–4
                </kbd>
                اختار
              </span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono">
                  A–D
                </kbd>
                اختار
              </span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Timer size={10} className="text-ember" />
                {timerEnabled ? `${preset}s لكل سؤال` : "المؤقت مقفول"}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-dim">
          <span className="flex items-center gap-1.5">
            <Sparkles size={11} className="text-ember" />
            لو المؤقت خلص، السؤال بيتسجل غلط ويرجع في الطابور.
          </span>
          <span className="font-mono">elapsed {formatClock(elapsed)}</span>
        </div>
      </div>

      <div
        className="glass-strong fixed z-[60] w-[200px] rounded-[14px] p-2.5"
        style={{ left: hudPos.x, top: hudPos.y }}
      >
        <div
          role="presentation"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="mb-2 flex cursor-grab touch-none items-center justify-between rounded-[7px] bg-white/[0.03] px-2 py-1 active:cursor-grabbing"
        >
          <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-dim">
            <GripVertical size={10} />
            HUD
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => updatePrefs({ sfx: !soundOn })}
              className="grid h-5 w-5 place-items-center rounded text-dim hover:text-chalk"
              aria-label={soundOn ? "إيقاف الصوت" : "تشغيل الصوت"}
            >
              {soundOn ? <Volume2 size={10} /> : <VolumeX size={10} />}
            </button>
            <button
              type="button"
              onClick={() => {
                setTimerEnabled((value) => {
                  if (!value) setSecondsLeft(preset);
                  return !value;
                });
              }}
              className="grid h-5 w-5 place-items-center rounded text-dim hover:text-chalk"
              aria-label={timerEnabled ? "إيقاف المؤقت" : "تشغيل المؤقت"}
            >
              <Timer size={10} />
            </button>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[8px] tracking-[0.1em] text-dim">TIMER</div>
            <div
              className={cn(
                "tabular font-mono text-[22px] font-semibold leading-tight",
                !timerEnabled
                  ? "text-dim"
                  : secondsLeft <= 5
                    ? "text-clay"
                    : "text-ember-soft",
              )}
            >
              {timerEnabled ? formatClock(secondsLeft) : "--:--"}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[8px] tracking-[0.1em] text-dim">STREAK</div>
            <div className="tabular font-mono text-[16px] font-semibold text-jade">{streak}</div>
          </div>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-300",
              secondsLeft <= 5 ? "bg-clay" : "bg-ember",
            )}
            style={{
              width: timerEnabled ? `${Math.max(0, Math.min(100, (secondsLeft / preset) * 100))}%` : "0%",
            }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between font-mono text-[8px] text-dim">
          <span>{queue.length} queue</span>
          <span>{requeues} requeue</span>
        </div>
      </div>
    </div>
  );
}
