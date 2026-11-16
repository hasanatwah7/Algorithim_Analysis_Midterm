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
import { cardsFor, shuffleCards, type CardKind } from "@/lib/cards";
import type { StudyLang } from "@/data/study_en";
import { useProgress } from "@/lib/progress";
import { Button } from "@/components/Button";
import { Chip, Tag } from "@/components/Chip";
import { Formula } from "@/components/Formula";
import { CodeBlock } from "@/components/CodeBlock";
import { ProgressBar, Ring } from "@/components/Progress";
import { playSound } from "@/lib/sfx";

const kinds: Array<CardKind | "mixed"> = [
  "mixed",
  "concept",
  "formula",
  "theory-qa",
  "problem-steps",
];

const hasArabic = /[\u0600-\u06FF]/;

const deckCopy = {
  en: {
    mixed: "Mixed",
    unmasteredOnly: "Unmastered only",
    shuffle: "Shuffle",
    restart: "Restart session",
    deckProgress: (done: number, total: number) =>
      `Deck progress · ${done} / ${total}`,
    masteredInChapter: (done: number, total: number) =>
      `Mastered in chapter: ${done} / ${total}`,
    gotIt: "got it",
    missed: "missed",
    emptyTitle: "Every card here is mastered",
    emptyBody:
      'No cards left in the current filter. Turn off "Unmastered only" to review everything, or try another deck type.',
    showAll: "Show all cards",
    deckCleared: "deck cleared",
    sessionComplete: "Session complete",
    doneBody: (mastered: number, missed: number) =>
      `${mastered} cards mastered and ${missed} misses. Cards you missed were saved to your progress and show up under Weak Topics.`,
    newSession: "New session",
    reviewAll: "Review all",
    flipAriaFront: "Flip card to the answer",
    flipAriaBack: "Flip card to the front",
    flipCard: "Flip card",
    missedIt: "Missed it",
    gotItBtn: "Got it",
    left: (count: number) => `${count} left`,
    missedReturn: "Missed cards return after 3 cards",
    flipHint: "Flip the card to see the answer",
    flipKey: "flip",
    answer: "Answer",
    trick: "Trick",
    gradeHonestly: "Grade yourself honestly",
    chapterTag: (n: number) => `Chapter ${n}`,
    kindLabels: {
      concept: "Concepts",
      formula: "Formulas",
      "theory-qa": "Theory Q&A",
      "problem-steps": "Problem Steps",
    },
  },
  ar: {
    mixed: "مختلط",
    unmasteredOnly: "غير المتقن فقط",
    shuffle: "خلط",
    restart: "إعادة الجلسة",
    deckProgress: (done: number, total: number) =>
      `تقدم المجموعة · ${done} / ${total}`,
    masteredInChapter: (done: number, total: number) =>
      `متقن في الشابتر: ${done} / ${total}`,
    gotIt: "عرفتها",
    missed: "غلطت",
    emptyTitle: "كل الكروت هنا متقنة",
    emptyBody:
      "مفيش كروت متبقية في الفلتر الحالي. اقفل «غير المتقن فقط» عشان تراجع الكل، أو جرّب نوع مجموعة تاني.",
    showAll: "اعرض كل الكروت",
    deckCleared: "المجموعة خلصت",
    sessionComplete: "الجلسة خلصت",
    doneBody: (mastered: number, missed: number) =>
      `${mastered} كارت اتقنت و${missed} غلطة. الكروت اللي غلطت فيها اتحفظت في تقدمك وبتظهر في «المواضيع الضعيفة».`,
    newSession: "جلسة جديدة",
    reviewAll: "راجع الكل",
    flipAriaFront: "اقلب الكارت للإجابة",
    flipAriaBack: "اقلب الكارت للوجه الأمامي",
    flipCard: "اقلب الكارت",
    missedIt: "غلطتها",
    gotItBtn: "عرفتها",
    left: (count: number) => `فاضل ${count}`,
    missedReturn: "الكروت اللي غلطت فيها بترجع بعد 3 كروت",
    flipHint: "اقلب الكارت عشان تشوف الإجابة",
    flipKey: "اقلب",
    answer: "الإجابة",
    trick: "تريك",
    gradeHonestly: "قيّم نفسك بصراحة",
    chapterTag: (n: number) => `الشابتر ${n}`,
    kindLabels: {
      concept: "المفاهيم",
      formula: "القوانين",
      "theory-qa": "سؤال وجواب",
      "problem-steps": "خطوات المسائل",
    },
  },
} as const;

function CardFace({
  card,
  side,
  lang,
}: {
  card: StudyCard;
  side: "front" | "back";
  lang: StudyLang;
}) {
  const isAr = lang === "ar";
  const t = deckCopy[lang];
  const en = isAr ? undefined : card.en;
  const body = isAr ? card.bodyAr : en?.body;
  const note = isAr ? card.noteAr : en?.note;
  const steps = isAr ? card.stepsAr : en?.steps;
  const answer = en?.answer ?? card.answer;
  const exampleProblem = en?.exampleProblem ?? card.exampleProblem;
  const prompt = isAr ? card.promptAr ?? card.prompt : card.prompt;

  if (side === "front") {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag tone="ember">{t.kindLabels[card.kind]}</Tag>
          <Tag tone="mono">{t.chapterTag(card.chapterNumber)}</Tag>
          {!isAr && card.source ? <Tag>{card.source}</Tag> : null}
        </div>
        <div className="flex flex-1 flex-col justify-center py-6">
          <div
            dir={isAr ? "rtl" : "ltr"}
            className={
              isAr
                ? "mixed-ar text-balance text-[18px] font-semibold leading-[1.6] tracking-[-0.02em] text-chalk sm:text-[22px]"
                : "text-balance text-start text-[18px] font-semibold leading-[1.6] tracking-[-0.02em] text-chalk sm:text-[22px]"
            }
          >
            {prompt}
          </div>
          {exampleProblem ? (
            <p
              dir={hasArabic.test(exampleProblem) ? "rtl" : "ltr"}
              className={
                hasArabic.test(exampleProblem)
                  ? "mixed-ar mt-4 line-clamp-4 text-[11px] leading-6 text-dim"
                  : "mt-4 line-clamp-4 text-start font-mono text-[11px] leading-6 text-dim"
              }
            >
              {exampleProblem}
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
          <span className="text-[10px] text-dim">{t.flipHint}</span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-dim">
            <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">Space</kbd>
            {t.flipKey}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag tone="jade">{t.answer}</Tag>
        <Tag tone="mono">{t.chapterTag(card.chapterNumber)}</Tag>
        {!isAr && card.source ? <Tag>{card.source}</Tag> : null}
      </div>
      <div className="mt-3 flex-1 overflow-y-auto pl-1 pr-1">
        {answer ? (
          <div
            dir="ltr"
            className="mb-3 rounded-[12px] border border-jade/20 bg-jade/[0.05] px-3.5 py-2.5 text-start font-mono text-[12px] text-jade"
          >
            {answer}
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

        {body ? (
          <p
            dir={isAr ? "rtl" : "ltr"}
            className={
              isAr
                ? "mixed-ar mb-3 text-[12.5px] leading-[2] text-[#d6dce6]"
                : "mb-3 text-[12.5px] leading-[2] text-[#d6dce6]"
            }
          >
            {body}
          </p>
        ) : null}

        {steps?.length ? (
          <ol dir={isAr ? "rtl" : "ltr"} className="mb-3 grid gap-2">
            {steps.map((step, index) => (
              <li
                key={index}
                className="flex gap-2.5 rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <span className="mt-0.5 font-mono text-[9px] text-ember">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={
                    isAr
                      ? "mixed-ar flex-1 text-[11.5px] leading-6 text-mist"
                      : "flex-1 text-[11.5px] leading-6 text-mist"
                  }
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        ) : null}

        {card.code ? <CodeBlock code={card.code} className="mb-3" /> : null}

        {note ? (
          <div className="rounded-[10px] border border-ember/15 bg-ember/[0.04] px-3 py-2">
            <div className="mb-1 text-[9.5px] font-medium text-ember">{t.trick}</div>
            <p
              dir={isAr ? "rtl" : "ltr"}
              className={
                isAr
                  ? "mixed-ar text-[11px] leading-6 text-mist"
                  : "text-[11px] leading-6 text-mist"
              }
            >
              {note}
            </p>
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
        <span className="text-[10px] text-dim">{t.gradeHonestly}</span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-dim">
          <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">1</kbd>
          {t.gotIt}
          <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5">2</kbd>
          {t.missed}
        </span>
      </div>
    </div>
  );
}

export function FlashcardDeck({
  chapterNumber,
  lang,
  onAllMasteredChange,
}: {
  chapterNumber: number;
  lang: StudyLang;
  onAllMasteredChange?: (allMastered: boolean) => void;
}) {
  const { state, setCardResult, updatePrefs } = useProgress();
  const t = deckCopy[lang];
  const isAr = lang === "ar";
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
              {value === "mixed" ? t.mixed : t.kindLabels[value]}
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
            {t.unmasteredOnly}
          </Chip>
          <Chip
            active={shuffled}
            tone="ember"
            onClick={() => setShuffled((value) => !value)}
          >
            <Shuffle size={11} />
            {t.shuffle}
          </Chip>
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setSessionKey((value) => value + 1)}
            className="gap-1.5"
          >
            <RotateCcw size={13} />
            {t.restart}
          </Button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-dim">
            <span>
              {t.deckProgress(
                mastered.length,
                initialTotal || availableCards.length,
              )}
            </span>
            <span>
              {t.masteredInChapter(masteredInDeck, availableCards.length)}
            </span>
          </div>
          <ProgressBar value={progress} tone="jade" />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="tabular font-mono text-[15px] text-jade">{mastered.length}</div>
            <div className="text-[9px] text-dim">{t.gotIt}</div>
          </div>
          <div className="text-center">
            <div className="tabular font-mono text-[15px] text-clay">{missed}</div>
            <div className="text-[9px] text-dim">{t.missed}</div>
          </div>
        </div>
      </div>

      {empty ? (
        <div className="glass flex flex-col items-center rounded-[20px] px-6 py-12 text-center">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-jade/25 bg-jade/[0.07] text-jade">
            <Sparkles size={20} />
          </div>
          <h3 className="text-[15px] font-semibold text-chalk">{t.emptyTitle}</h3>
          <p className="mt-1.5 max-w-[44ch] text-[12px] leading-6 text-dim">
            {t.emptyBody}
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setOnlyUnmastered(false)}
          >
            {t.showAll}
          </Button>
        </div>
      ) : done ? (
        <div className="glass flex flex-col items-center rounded-[20px] px-6 py-12 text-center">
          <Ring value={1} size={104} label="100%" sublabel={t.deckCleared} />
          <h3 className="mt-4 text-[16px] font-semibold text-chalk">{t.sessionComplete}</h3>
          <p className="mt-1.5 max-w-[44ch] text-[12px] leading-6 text-dim">
            {t.doneBody(mastered.length, missed)}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button variant="primary" onClick={() => setSessionKey((value) => value + 1)}>
              {t.newSession}
            </Button>
            <Button variant="secondary" onClick={() => setOnlyUnmastered(false)}>
              {t.reviewAll}
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
              aria-label={flipped ? t.flipAriaBack : t.flipAriaFront}
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
                <CardFace card={current} side="front" lang={lang} />
              </div>
              <div className="flip-face flip-back glass-strong absolute inset-0 rounded-[22px] p-5 sm:p-6">
                <CardFace card={current} side="back" lang={lang} />
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
                  {t.flipCard}
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
                    {t.missedIt}
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => answer(true)}
                    className="gap-2 !bg-jade !text-[#08140d] hover:!bg-[#86c79e]"
                  >
                    <Check size={16} />
                    {t.gotItBtn}
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-dim">
              <span className="flex items-center gap-1">
                <Layers size={11} />
                {t.left(queue.length)}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/15" />
              <span>{t.missedReturn}</span>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <span className="font-mono text-[9px] text-dim">
              {t.kindLabels[current.kind]}
              {!isAr && current.source ? ` · ${current.source}` : ""}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
