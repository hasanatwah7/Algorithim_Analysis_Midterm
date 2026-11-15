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
import { cn, formatPercent } from "@/lib/format";

type Tab = "theory" | "cards" | "bench";

const tabs: Array<{ id: Tab; label: string; icon: typeof BookOpenCheck }> = [
  { id: "theory", label: "Theory", icon: BookOpenCheck },
  { id: "cards", label: "Anki", icon: Layers },
  { id: "bench", label: "Bench", icon: Sparkles },
];

export function StudyPage() {
  const { state, updatePrefs } = useProgress();
  const stats = useMemo(() => getChapterStats(state), [state]);
  const [tab, setTab] = useState<Tab>("theory");

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
        Couldn't load chapter data.
      </div>
    );
  }

  const changeChapter = (next: number) => updatePrefs({ lastChapter: next });

  return (
    <div>
      <PageHeader
        eyebrow="DEPARTMENT 01 · STUDY"
        title="Theory & Anki"
        description="Read the full concepts, recall the formulas, and test yourself with Anki-style cards. Every chapter includes an interactive bench that explains the idea behind the question."
        actions={
          <Link to="/solve">
            <Button variant="primary" size="sm" className="gap-1.5">
              <ListChecks size={14} />
              Go to Solve
            </Button>
          </Link>
        }
      />

      <ChapterRail stats={stats} active={chapterNumber} onChange={changeChapter} />

      <div className="grid gap-5 lg:grid-cols-[1fr_296px]">
        <div className="min-w-0">
          <div className="glass mb-5 rounded-[18px] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="ember">Chapter {chapter.number}</Tag>
                  <Tag tone="mono">{chapterCards.length} cards</Tag>
                  <Tag>{chapter.theory.length} concepts</Tag>
                  <Tag>{chapter.practical.length} patterns</Tag>
                </div>
                <h2 className="mt-2.5 text-balance text-[19px] font-bold leading-[1.35] tracking-[-0.03em] text-chalk">
                  {chapter.title}
                </h2>
                <p dir="ltr" className="mt-1 text-left font-mono text-[10.5px] text-dim">
                  Chapter {chapter.number} · {chapter.titleAr}
                </p>
              </div>
              <div className="shrink-0 rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-center">
                <div className="tabular font-mono text-[18px] font-semibold text-ember">
                  {formatPercent(stat.mastery)}
                </div>
                <div className="mt-0.5 text-[9.5px] text-dim">mastery</div>
              </div>
            </div>
            <p className="mixed-ar mt-3 border-t border-white/[0.06] pt-3 text-[12.5px] leading-7 text-mist">
              {chapter.summaryAr}
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
                  {item.label}
                </Chip>
              );
            })}
          </div>

          {tab === "theory" ? (
            <div className="grid gap-4">
              {chapter.theory.map((concept, index) => (
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
                      <p className="mixed-ar mt-2 text-[13px] leading-[2.05] text-[#d5dbe5]">
                        {concept.contentAr}
                      </p>

                      {concept.formulas?.length ? (
                        <div className="mt-3.5">
                          <div className="mb-2 flex items-center gap-1.5 text-[10.5px] font-medium text-dim">
                            <Sigma size={12} className="text-ember" />
                            Formulas
                          </div>
                          <FormulaList formulas={concept.formulas} />
                        </div>
                      ) : null}

                      {concept.importantNoteAr ? (
                        <div className="mt-3.5 flex items-start gap-2.5 rounded-[11px] border border-ember/15 bg-ember/[0.045] px-3.5 py-2.5">
                          <Lightbulb size={14} className="mt-1 shrink-0 text-ember" />
                          <p className="mixed-ar text-[11.5px] leading-6 text-mist">
                            {concept.importantNoteAr}
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
              ))}

              <div className="mt-2 flex flex-col items-start justify-between gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit size={16} className="text-ember" />
                  <p className="text-[11.5px] leading-6 text-mist">
                    Finished the theory? Flip the cards to lock it in, then drill the
                    problem types.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setTab("cards")}>
                    Cards
                  </Button>
                  <Link to="/patterns">
                    <Button variant="quiet" size="sm" className="gap-1.5">
                      Problem types
                      <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "cards" ? <FlashcardDeck chapterNumber={chapterNumber} /> : null}

          {tab === "bench" ? (
            <div>
              <SectionHeading
                title="Chapter bench"
                subtitle="Play with the idea instead of memorizing it — change the values and watch the steps update."
              />
              <ChapterBench chapter={chapterNumber} />
              <div className="mt-4 flex flex-wrap gap-2">
                {(["concept", "formula", "theory-qa", "problem-steps"] as const).map(
                  (kind) => (
                    <span
                      key={kind}
                      className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[10px] text-dim"
                    >
                      {kind === "concept"
                        ? "Concepts"
                        : kind === "formula"
                          ? "Formulas"
                          : kind === "theory-qa"
                            ? "Theory Q&A"
                            : "Problem steps"}
                      <span className="ml-1.5 font-mono text-[9px] text-mist">
                        {cardsFor(chapterNumber, kind).length}
                      </span>
                    </span>
                  ),
                )}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-[86px] lg:self-start">
          <SpotlightCard className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[12px] font-semibold text-chalk">Chapter progress</h3>
              <Target size={14} className="text-ember" />
            </div>
            <div className="flex items-center gap-4">
              <Ring
                value={stat.mastery}
                size={92}
                stroke={8}
                sublabel="mastery"
              />
              <div className="grid flex-1 gap-3">
                <Stat value={`${stat.correct}/${stat.total}`} label="Correct" tone="jade" />
                <Stat value={stat.wrong} label="Logged mistakes" tone="clay" />
              </div>
            </div>
            <div className="mt-3 border-t border-white/[0.06] pt-3">
              <div className="mb-1.5 flex items-center justify-between text-[10px] text-dim">
                <span>Cards mastered</span>
                <span className="tabular font-mono">
                  {masteredCards}/{chapterCards.length}
                </span>
              </div>
              <ProgressBar value={cardProgress} tone="jade" />
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[12px] font-semibold text-chalk">Chapter content</h3>
              <Layers size={14} className="text-ember" />
            </div>
            <div className="grid gap-2">
              {(
                [
                  ["concept", "Concepts"],
                  ["formula", "Formulas"],
                  ["theory-qa", "Theory Q&A"],
                  ["problem-steps", "Problem steps"],
                ] as const
              ).map(([kind, label]) => (
                <div
                  key={kind}
                  className="flex items-center justify-between rounded-[9px] border border-white/[0.055] bg-white/[0.02] px-2.5 py-1.5"
                >
                  <span className="text-[10.5px] text-mist">{label}</span>
                  <span className="tabular font-mono text-[10px] text-dim">
                    {cardsFor(chapterNumber, kind).length}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] text-dim">
              <span>Total cards in the app</span>
              <span className="font-mono text-mist">
                {Object.values(cardCountByKind).reduce((sum, value) => sum + value, 0)}
              </span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-jade" />
              <h3 className="text-[12px] font-semibold text-chalk">Suggested routine</h3>
            </div>
            <ol className="grid gap-2">
              {[
                "Read the concepts once, slowly.",
                "Flip the formula cards before revealing the answer.",
                "Solve the chapter questions in the Solve page.",
                "Come back to the bench if something still feels unclear.",
              ].map((step, index) => (
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
