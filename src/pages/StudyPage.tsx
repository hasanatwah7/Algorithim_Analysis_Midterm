import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  Layers,
  Lightbulb,
  ListChecks,
  Sigma,
  Sparkles,
  Target,
} from "lucide-react";
import { ChapterRail } from "@/components/ChapterRail";
import { ChapterBench } from "@/components/benches/ChapterBench";
import { FlashcardDeck } from "@/components/FlashcardDeck";
import { LanguageToggle } from "@/components/LanguageToggle";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Button } from "@/components/Button";
import { Chip, Tag } from "@/components/Chip";
import { FormulaList } from "@/components/Formula";
import { ProgressBar, Ring, Stat } from "@/components/Progress";
import { getChapter } from "@/lib/questions";
import { cardsFor, cardCountByKind } from "@/lib/cards";
import {
  getChapterStats,
  useProgress,
  type ChapterStat,
} from "@/lib/progress";
import { chapterSummaryEn } from "@/data/patterns_en";
import { conceptEn, type StudyLang } from "@/data/study_en";
import { cn, formatPercent } from "@/lib/format";

type Tab = "theory" | "cards" | "bench";

const tabs: Array<{ id: Tab; icon: typeof BookOpenCheck }> = [
  { id: "theory", icon: BookOpenCheck },
  { id: "cards", icon: Layers },
  { id: "bench", icon: Sparkles },
];

const cardKinds = [
  "concept",
  "formula",
  "theory-qa",
  "problem-steps",
] as const;

const copy = {
  en: {
    eyebrow: "DEPARTMENT 01 · STUDY",
    title: "Theory & Anki",
    description:
      "Read the full concepts, recall the formulas, and test yourself with Anki-style cards. Every chapter includes an interactive bench that explains the idea behind the question.",
    langLabel: "Page language",
    goSolve: "Go to Solve",
    chapterTag: (n: number) => `Chapter ${n}`,
    cardsTag: (n: number) => `${n} cards`,
    conceptsTag: (n: number) => `${n} concepts`,
    patternsTag: (n: number) => `${n} patterns`,
    mastery: "mastery",
    chapterLine: (n: number) => `Chapter ${n}`,
    tabs: {
      theory: "Theory",
      cards: "Anki",
      bench: "Bench",
    },
    formulas: "Formulas",
    finishedTheory:
      "Finished the theory? Flip the cards to lock it in, then drill the problem types.",
    cardsBtn: "Cards",
    problemTypes: "Problem types",
    benchTitle: "Chapter bench",
    benchSubtitle:
      "Play with the idea instead of memorizing it — change the values and watch the steps update.",
    benchArabicTitle: "",
    benchArabicBody: "",
    switchToEnglish: "",
    kindLabels: {
      concept: "Concepts",
      formula: "Formulas",
      "theory-qa": "Theory Q&A",
      "problem-steps": "Problem steps",
    },
    chapterProgress: "Chapter progress",
    correct: "Correct",
    loggedMistakes: "Logged mistakes",
    cardsMastered: "Cards mastered",
    chapterContent: "Chapter content",
    totalCards: "Total cards in the app",
    suggestedRoutine: "Suggested routine",
    routine: [
      "Read the concepts once, slowly.",
      "Flip the formula cards before revealing the answer.",
      "Solve the chapter questions in the Solve page.",
      "Come back to the bench if something still feels unclear.",
    ],
    loadError: "Couldn't load chapter data.",
  },
  ar: {
    eyebrow: "القسم 01 · المذاكرة",
    title: "النظري والكروت",
    description:
      "اقرأ المفاهيم كاملة، استرجع القوانين، واختبر نفسك بكروت على طريقة Anki. كل شابتر فيه Bench تفاعلي يوضح الفكرة وراء السؤال.",
    langLabel: "لغة الصفحة",
    goSolve: "روح لقسم الحل",
    chapterTag: (n: number) => `الشابتر ${n}`,
    cardsTag: (n: number) => `${n} كارت`,
    conceptsTag: (n: number) => `${n} مفهوم`,
    patternsTag: (n: number) => `${n} نمط`,
    mastery: "إتقان",
    chapterLine: (n: number) => `الشابتر ${n}`,
    tabs: {
      theory: "النظري",
      cards: "الكروت",
      bench: "الـ Bench",
    },
    formulas: "القوانين",
    finishedTheory:
      "خلصت النظري؟ اقلب الكروت عشان تثبّت المعلومة، وبعدها تدرّب على أنواع المسائل.",
    cardsBtn: "الكروت",
    problemTypes: "أنواع المسائل",
    benchTitle: "Bench الشابتر",
    benchSubtitle:
      "العب بالفكرة بدل ما تحفظها — غيّر القيم وشوف الخطوات بتتحدث.",
    benchArabicTitle: "الـ Bench التفاعلي متاح بالإنجليزية فقط",
    benchArabicBody:
      "أداة الـ Bench التفاعلية مكتوبة بالإنجليزية، فبتظهر في الوضع الإنجليزي بس عشان الصفحة تفضل عربي بالكامل.",
    switchToEnglish: "بدّل للإنجليزي",
    kindLabels: {
      concept: "المفاهيم",
      formula: "القوانين",
      "theory-qa": "سؤال وجواب",
      "problem-steps": "خطوات المسائل",
    },
    chapterProgress: "تقدم الشابتر",
    correct: "صح",
    loggedMistakes: "أخطاء مسجلة",
    cardsMastered: "كروت متقنة",
    chapterContent: "محتوى الشابتر",
    totalCards: "إجمالي الكروت في التطبيق",
    suggestedRoutine: "روتين مقترح",
    routine: [
      "اقرأ المفاهيم مرة واحدة بهدوء.",
      "اقلب كروت القوانين قبل ما تشوف الإجابة.",
      "حل أسئلة الشابتر في قسم الحل.",
      "ارجع للـ Bench لو حاجة لسه مش واضحة.",
    ],
    loadError: "مش قادر أحمّل بيانات الشابتر.",
  },
} as const;

export function StudyPage() {
  const { state, updatePrefs } = useProgress();
  const stats = useMemo(() => getChapterStats(state), [state]);
  const [tab, setTab] = useState<Tab>("theory");

  const lang = state.prefs.studyLang;
  const isAr = lang === "ar";
  const t = copy[lang];

  const chapterNumber = state.prefs.lastChapter;
  const chapter = getChapter(chapterNumber);
  const stat: ChapterStat | undefined =
    stats.find((item) => item.number === chapterNumber) ?? stats[0];

  const chapterCards = useMemo(
    () => cardsFor(chapterNumber, "mixed"),
    [chapterNumber],
  );
  const masteredCards = chapterCards.filter(
    (card) => state.cards[card.id]?.status === "mastered",
  ).length;
  const cardProgress = chapterCards.length ? masteredCards / chapterCards.length : 0;

  if (!chapter || !stat) {
    return (
      <div className="glass rounded-[20px] p-8 text-center text-mist">
        {t.loadError}
      </div>
    );
  }

  const changeChapter = (next: number) => updatePrefs({ lastChapter: next });
  const changeLang = (next: StudyLang) => updatePrefs({ studyLang: next });

  const summary = isAr
    ? chapter.summaryAr
    : chapterSummaryEn[chapter.number] ?? chapter.summaryAr;

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <LanguageToggle lang={lang} onChange={changeLang} label={t.langLabel} />
            <Link to="/solve">
              <Button variant="primary" size="sm" className="gap-1.5">
                <ListChecks size={14} />
                {t.goSolve}
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

      <div className="grid gap-5 lg:grid-cols-[1fr_296px]">
        <div className="min-w-0">
          <div className="glass mb-5 rounded-[18px] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="ember">{t.chapterTag(chapter.number)}</Tag>
                  <Tag tone="mono">{t.cardsTag(chapterCards.length)}</Tag>
                  <Tag>{t.conceptsTag(chapter.theory.length)}</Tag>
                  <Tag>{t.patternsTag(chapter.practical.length)}</Tag>
                </div>
                <h2
                  dir={isAr ? "rtl" : "ltr"}
                  className={cn(
                    "mt-2.5 text-balance text-[19px] font-bold leading-[1.35] tracking-[-0.03em] text-chalk",
                    isAr && "mixed-ar",
                  )}
                >
                  {isAr ? chapter.titleAr : chapter.title}
                </h2>
                <p
                  dir={isAr ? "rtl" : "ltr"}
                  className={cn(
                    "mt-1 font-mono text-[10.5px] text-dim",
                    isAr && "mixed-ar",
                  )}
                >
                  {t.chapterLine(chapter.number)}
                </p>
              </div>
              <div className="shrink-0 rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-center">
                <div className="tabular font-mono text-[18px] font-semibold text-ember">
                  {formatPercent(stat.mastery)}
                </div>
                <div className="mt-0.5 text-[9.5px] text-dim">{t.mastery}</div>
              </div>
            </div>
            <p
              dir={isAr ? "rtl" : "ltr"}
              className={cn(
                "mt-3 border-t border-white/[0.06] pt-3 text-[12.5px] leading-7 text-mist",
                isAr && "mixed-ar",
              )}
            >
              {summary}
            </p>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-1.5">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <Chip
                  key={item.id}
                  active={tab === item.id}
                  tone="ember"
                  onClick={() => setTab(item.id)}
                  className="h-9 gap-2 px-3.5"
                >
                  <Icon size={13} />
                  {t.tabs[item.id]}
                </Chip>
              );
            })}
          </div>

          {tab === "theory" ? (
            <div className="grid gap-4">
              {chapter.theory.map((concept, index) => {
                const en = conceptEn[concept.id];
                const body = isAr ? concept.contentAr : en?.body ?? concept.contentAr;
                const note = isAr ? concept.importantNoteAr : en?.note;

                return (
                  <SpotlightCard key={concept.id} className="p-5">
                    <div className="flex items-start gap-3.5">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border border-ember/20 bg-ember/[0.06] font-mono text-[10px] text-ember">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3
                          dir="ltr"
                          className="text-left text-[15px] font-semibold leading-6 tracking-[-0.015em] text-chalk"
                        >
                          {concept.title}
                        </h3>
                        <p
                          dir={isAr ? "rtl" : "ltr"}
                          className={cn(
                            "mt-2 text-[13px] leading-[2.05] text-[#d5dbe5]",
                            isAr && "mixed-ar",
                          )}
                        >
                          {body}
                        </p>

                        {concept.formulas?.length ? (
                          <div className="mt-3.5">
                            <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-medium text-dim">
                              <Sigma size={12} className="text-ember" />
                              {t.formulas}
                            </div>
                            <FormulaList formulas={concept.formulas} />
                          </div>
                        ) : null}

                        {note ? (
                          <div className="mt-3.5 flex items-start gap-2.5 rounded-[11px] border border-ember/15 bg-ember/[0.045] px-3.5 py-2.5">
                            <Lightbulb size={14} className="mt-1 shrink-0 text-ember" />
                            <p
                              dir={isAr ? "rtl" : "ltr"}
                              className={cn(
                                "text-[11.5px] leading-6 text-mist",
                                isAr && "mixed-ar",
                              )}
                            >
                              {note}
                            </p>
                          </div>
                        ) : null}

                        {concept.keyTerms.length ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {concept.keyTerms.map((term) => (
                              <span
                                key={term}
                                dir="ltr"
                                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[9.5px] text-dim"
                              >
                                {term}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}

              <div className="mt-2 flex flex-col items-start justify-between gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit size={16} className="text-ember" />
                  <p className="text-[11.5px] leading-6 text-mist">
                    {t.finishedTheory}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setTab("cards")}>
                    {t.cardsBtn}
                  </Button>
                  <Link to="/patterns">
                    <Button variant="quiet" size="sm" className="gap-1.5">
                      {t.problemTypes}
                      <ArrowRight
                        size={13}
                        className={isAr ? "rotate-180" : undefined}
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "cards" ? (
            <FlashcardDeck chapterNumber={chapterNumber} lang={lang} />
          ) : null}

          {tab === "bench" ? (
            isAr ? (
              <div className="glass flex flex-col items-center rounded-[20px] px-6 py-12 text-center">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-ember/25 bg-ember/[0.07] text-ember">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-[15px] font-semibold text-chalk">
                  {t.benchArabicTitle}
                </h3>
                <p className="mt-1.5 max-w-[46ch] text-[12px] leading-6 text-dim">
                  {t.benchArabicBody}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => changeLang("en")}
                >
                  {t.switchToEnglish}
                </Button>
              </div>
            ) : (
              <div>
                <SectionHeading title={t.benchTitle} subtitle={t.benchSubtitle} />
                <ChapterBench chapter={chapterNumber} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {cardKinds.map((kind) => (
                    <span
                      key={kind}
                      className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[10px] text-dim"
                    >
                      {t.kindLabels[kind]}
                      <span className="ml-1.5 font-mono text-[9px] text-mist">
                        {cardsFor(chapterNumber, kind).length}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )
          ) : null}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-[86px] lg:self-start">
          <SpotlightCard className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[12px] font-semibold text-chalk">
                {t.chapterProgress}
              </h3>
              <Target size={14} className="text-ember" />
            </div>
            <div className="flex items-center gap-4">
              <Ring
                value={stat.mastery}
                size={92}
                stroke={8}
                sublabel={t.mastery}
              />
              <div className="grid flex-1 gap-3">
                <Stat
                  value={`${stat.correct}/${stat.total}`}
                  label={t.correct}
                  tone="jade"
                />
                <Stat value={stat.wrong} label={t.loggedMistakes} tone="clay" />
              </div>
            </div>
            <div className="mt-3 border-t border-white/[0.06] pt-3">
              <div className="mb-1.5 flex items-center justify-between text-[10px] text-dim">
                <span>{t.cardsMastered}</span>
                <span className="tabular font-mono">
                  {masteredCards}/{chapterCards.length}
                </span>
              </div>
              <ProgressBar value={cardProgress} tone="jade" />
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[12px] font-semibold text-chalk">
                {t.chapterContent}
              </h3>
              <Layers size={14} className="text-ember" />
            </div>
            <div className="grid gap-2">
              {cardKinds.map((kind) => (
                <div
                  key={kind}
                  className="flex items-center justify-between rounded-[9px] border border-white/[0.055] bg-white/[0.02] px-2.5 py-1.5"
                >
                  <span className="text-[10.5px] text-mist">
                    {t.kindLabels[kind]}
                  </span>
                  <span className="tabular font-mono text-[10px] text-dim">
                    {cardsFor(chapterNumber, kind).length}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] text-dim">
              <span>{t.totalCards}</span>
              <span className="font-mono text-mist">
                {Object.values(cardCountByKind).reduce((sum, value) => sum + value, 0)}
              </span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-jade" />
              <h3 className="text-[12px] font-semibold text-chalk">
                {t.suggestedRoutine}
              </h3>
            </div>
            <ol className="grid gap-2">
              {t.routine.map((step, index) => (
                <li key={step} className="flex gap-2.5">
                  <span
                    className={cn(
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border font-mono text-[8.5px]",
                      "border-ember/25 bg-ember/[0.06] text-ember",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="text-[10.5px] leading-5 text-mist">{step}</span>
                </li>
              ))}
            </ol>
          </SpotlightCard>
        </aside>
      </div>
    </div>
  );
}
