import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  FlipHorizontal2,
  Layers,
  RotateCcw,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";
import type { StudyCard } from "@/lib/cards";
import {
  cardKindMeta,
  cardsFor,
  shuffleCards,
  type CardKind,
} from "@/lib/cards";
import { useProgress } from "@/lib/progress";
import { Button } from "@/components/Button";
import { Chip, Tag } from "@/components/Chip";
import { Formula } from "@/components/Formula";
import { CodeBlock } from "@/components/CodeBlock";
import { ProgressBar, Ring } from "@/components/Progress";
import { playSound } from "@/lib/sfx";
import { cn } from "@/lib/format";

const kinds: Array<CardKind | "mixed"> = [
  "mixed",
  "concept",
  "formula",
  "theory-qa",
  "problem-steps",
];

function CardFace({ card, side }: { card: StudyCard; side: "front" | "back" }) {
  if (side === "front") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag tone="ember">{cardKindMeta[card.kind].arabic}</Tag>
          <Tag tone="mono">Chapter {card.chapterNumber}</Tag>
          {card.source ? <Tag>{card.source}</Tag> : null}
        </div>
        <div className="flex flex-1 flex-col justify-center py-6">
          <div
            dir={card.kind === "theory-qa" ? "ltr" : "rtl"}
            className={cn(
              "text-balance text-[18px] font-semibold leading-[1.6] tracking-[-0.02em] text-chalk sm:text-[22px]",
              card.kind === "theory-qa" ? "text-left" : "text-right",
            )}
          >
            {card.prompt}
          </div>
          {card.exampleProblem ? (
            <p
              dir="ltr"
              className="mt-4 line-clamp-4 text-left font-mono text-[11px] leading-6 text-dim"
            >
              {card.exampleProblem}
            </p>
          ) : null}
          {card.keyTerms?.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {card.keyTerms.map((term) => (
                <span
                  key={term}
                  dir="ltr"
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[9.5px] text-mist"
                >
                  {term}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-[10px] text-dim">اقلب البطاقة عشان تشوف الإجابة</span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-dim">
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">Space</kbd>
            flip
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag tone="jade">الإجابة</Tag>
        <Tag tone="mono">Chapter {card.chapterNumber}</Tag>
        {card.source ? <Tag>{card.source}</Tag> : null}
      </div>
      <div className="mt-3 flex-1 overflow-y-auto pl-1 pr-1">
        {card.answer ? (
          <div
            dir={card.kind === "theory-qa" || card.kind === "formula" ? "ltr" : "rtl"}
            className={cn(
              "mb-3 rounded-[12px] border border-jade/20 bg-jade/[0.05] px-3.5 py-2.5",
              card.kind === "theory-qa" || card.kind === "formula"
                ? "text-left font-mono text-[12px] text-jade"
                : "text-right text-[12.5px] font-semibold text-jade",
            )}
          >
            {card.answer}
          </div>
        ) : null}

        {card.formulas?.length ? (
          <div className="mb-3 grid gap-2">
            {card.formulas.map((formula, index) => (
              <div key={index} className="formula-shell py-2">
                <Formula tex={formula} display />
              </div>
            ))}
          </div>
        ) : null}

        {card.bodyAr ? (
          <p className="mixed-ar mb-3 text-[12.5px] leading-[2] text-[#d6dce6]">
            {card.bodyAr}
          </p>
        ) : null}

        {card.stepsAr?.length ? (
          <ol className="mb-3 grid gap-2">
            {card.stepsAr.map((step, index) => (
              <li
                key={index}
                className="flex gap-2.5 rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <span className="mt-0.5 font-mono text-[9px] text-ember">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mixed-ar flex-1 text-[11.5px] leading-6 text-mist">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {card.code ? <CodeBlock code={card.code} className="mb-3" /> : null}

        {card.noteAr ? (
          <div className="rounded-[10px] border border-ember/15 bg-ember/[0.04] px-3 py-2">
            <div className="mb-1 text-[9.5px] font-medium text-ember">تريك</div>
            <p className="mixed-ar text-[11px] leading-6 text-mist">{card.noteAr}</p>
          </div>
        ) : null}

        {card.keyTerms?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {card.keyTerms.map((term) => (
              <span
                key={term}
                dir="ltr"
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[9px] text-dim"
              >
                {term}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-[10px] text-dim">قيّم نفسك بصراحة</span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-dim">
          <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">1</kbd>
          got it
          <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">2</kbd>
          missed
        </span>
      </div>
    </div>
  );
}

export function FlashcardDeck({
  chapterNumber,
  onAllMasteredChange,
}: {
  chapterNumber: number;
  onAllMasteredChange?: (allMastered: boolean) => void;
}) {
  const { state, setCardResult, updatePrefs } = useProgress();
  const [kind, setKind] = useState<CardKind | "mixed">(state.prefs.lastCardKind);
  const [onlyUnmastered, setOnlyUnmastered] = useState(true);
  const [shuffled, setShuffled] = useState(true);
  const [queue, setQueue] = useState<StudyCard[]>([]);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<string[]>([]);
  const [missed, setMissed] = useState(0);
  const [initialTotal, setInitialTotal] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);

  const availableCards = useMemo(
    () => cardsFor(chapterNumber, kind),
    [chapterNumber, kind],
  );

  const masteredInDeck = availableCards.filter(
    (card) => state.cards[card.id]?.status === "mastered",
  ).length;

  useEffect(() => {
    const base = cardsFor(chapterNumber, kind).filter(
      (card) =>
        !onlyUnmastered || state.cards[card.id]?.status !== "mastered",
    );
    const next = shuffled ? shuffleCards(base) : base;
    setQueue(next);
    setInitialTotal(next.length);
    setFlipped(false);
    setMastered([]);
    setMissed(0);
    // Deliberately snapshot card statuses when the session starts. Updating a
    // card while studying must not reset the session queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterNumber, kind, onlyUnmastered, shuffled, sessionKey]);

  const current = queue[0] ?? null;
  const done = queue.length === 0 && initialTotal > 0;
  const empty = initialTotal === 0 && queue.length === 0;

  useEffect(() => {
    onAllMasteredChange?.(done);
  }, [done, onAllMasteredChange]);

  const answer = useCallback(
    (correct: boolean) => {
      if (!current) return;
      playSound(correct ? "correct" : "wrong", state.prefs.sfx);
      setCardResult(current.id, correct);
      setFlipped(false);
      if (correct) {
        setMastered((previous) =>
          previous.includes(current.id) ? previous : [...previous, current.id],
        );
        setQueue((previous) => previous.slice(1));
      } else {
        setMissed((previous) => previous + 1);
        setQueue((previous) => {
          if (previous.length <= 1) return previous;
          const [first, ...rest] = previous;
          const insertAt = Math.min(rest.length, 3);
          rest.splice(insertAt, 0, first);
          return rest;
        });
      }
    },
    [current, setCardResult, state.prefs.sfx],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (current) {
          setFlipped((value) => {
            if (!value) playSound("flip", state.prefs.sfx);
            return !value;
          });
        }
        return;
      }
      if (event.key === "1" && flipped) {
        event.preventDefault();
        answer(true);
      }
      if (event.key === "2" && flipped) {
        event.preventDefault();
        answer(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answer, current, flipped, state.prefs.sfx]);

  const progress = initialTotal > 0 ? Math.min(1, mastered.length / initialTotal) : 0;

  const changeKind = (nextKind: CardKind | "mixed") => {
    setKind(nextKind);
    updatePrefs({ lastCardKind: nextKind });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {kinds.map((value) => (
            <Chip
              key={value}
              active={kind === value}
              tone="ember"
              onClick={() => changeKind(value)}
            >
              {value === "mixed" ? "Mixed" : cardKindMeta[value].arabic}
              <span className="font-mono text-[9px] opacity-60">
                {cardsFor(chapterNumber, value).length}
              </span>
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip
            active={onlyUnmastered}
            tone="jade"
            onClick={() => setOnlyUnmastered((value) => !value)}
          >
            <Check size={11} />
            غير المتقن فقط
          </Chip>
          <Chip
            active={shuffled}
            tone="ember"
            onClick={() => setShuffled((value) => !value)}
          >
            <Shuffle size={11} />
            خلط
          </Chip>
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setSessionKey((value) => value + 1)}
            className="gap-1.5"
          >
            <RotateCcw size={13} />
            إعادة الجلسة
          </Button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-dim">
            <span>
              Deck progress · {mastered.length} / {initialTotal || availableCards.length}
            </span>
            <span>
              متقن في الشابتر: {masteredInDeck} / {availableCards.length}
            </span>
          </div>
          <ProgressBar value={progress} tone="jade" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="tabular font-mono text-[15px] text-jade">{mastered.length}</div>
            <div className="text-[9px] text-dim">got it</div>
          </div>
          <div className="text-center">
            <div className="tabular font-mono text-[15px] text-clay">{missed}</div>
            <div className="text-[9px] text-dim">missed</div>
          </div>
        </div>
      </div>

      {empty ? (
        <div className="glass flex flex-col items-center rounded-[20px] px-6 py-12 text-center">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-jade/25 bg-jade/[0.07] text-jade">
            <Sparkles size={20} />
          </div>
          <h3 className="text-[15px] font-semibold text-chalk">كل البطاقات دي متقنة</h3>
          <p className="mt-1.5 max-w-[44ch] text-[12px] leading-6 text-dim">
            مفيش بطاقات متبقية في الفلتر الحالي. اقفل «غير المتقن فقط» لو عايز تراجع كل
            حاجة، أو جرّب نوع deck تاني.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setOnlyUnmastered(false)}
          >
            اعرض كل البطاقات
          </Button>
        </div>
      ) : done ? (
        <div className="glass flex flex-col items-center rounded-[20px] px-6 py-12 text-center">
          <Ring value={1} size={104} label="100%" sublabel="deck cleared" />
          <h3 className="mt-4 text-[16px] font-semibold text-chalk">الجلسة خلصت</h3>
          <p className="mt-1.5 max-w-[44ch] text-[12px] leading-6 text-dim">
            {mastered.length} بطاقة اتقنت، و{missed} misses. الـ cards اللي غلطت فيها
            اتسجلت في تقدمك وهتظهر في Weak Topics.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button variant="primary" onClick={() => setSessionKey((value) => value + 1)}>
              جلسة جديدة
            </Button>
            <Button variant="secondary" onClick={() => setOnlyUnmastered(false)}>
              راجع الكل
            </Button>
          </div>
        </div>
      ) : current ? (
        <div>
          <div className="flip-scene">
            <div
              className="flip-inner h-[440px] sm:h-[420px]"
              data-flipped={flipped ? "true" : "false"}
              role="button"
              tabIndex={0}
              aria-label={flipped ? "اقلب البطاقة للوجه الأمامي" : "اقلب البطاقة للإجابة"}
              onClick={() => {
                setFlipped((value) => {
                  if (!value) playSound("flip", state.prefs.sfx);
                  return !value;
                });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setFlipped((value) => !value);
                }
              }}
            >
              <div className="flip-face glass absolute inset-0 rounded-[22px] p-5 sm:p-6">
                <CardFace card={current} side="front" />
              </div>
              <div className="flip-face flip-back glass-strong absolute inset-0 rounded-[22px] p-5 sm:p-6">
                <CardFace card={current} side="back" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {!flipped ? (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setFlipped(true);
                    playSound("flip", state.prefs.sfx);
                  }}
                  className="gap-2"
                >
                  <FlipHorizontal2 size={16} />
                  اقلب البطاقة
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => answer(false)}
                    className="gap-2 border-clay/25 bg-clay/[0.08] text-clay hover:bg-clay/[0.12]"
                  >
                    <X size={16} />
                    Missed it
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => answer(true)}
                    className="gap-2 !bg-jade !text-[#08140d] hover:!bg-[#86c79e]"
                  >
                    <Check size={16} />
                    Got it
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-dim">
              <span className="flex items-center gap-1">
                <Layers size={11} />
                {queue.length} متبقي
              </span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span>الـ missed بترجع بعد 3 بطاقات</span>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <span className="font-mono text-[9px] text-dim">
              {current.kind} · {current.source}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
