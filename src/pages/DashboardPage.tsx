import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Layers,
  ListChecks,
  Play,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { SpotlightCard } from "@/components/SpotlightCard";import { Button } from "@/components/Button";
import { Tag } from "@/components/Chip";
import { ProgressBar, Ring } from "@/components/Progress";
import {
  getChapterStats,
  getOverallStats,
  getWeakTopics,
  useProgress,
} from "@/lib/progress";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn, formatPercent } from "@/lib/format";

const departments = [
  {
    to: "/study",
    label: "المذاكرة",
    english: "Study",
    description: "نظري كامل + 143 بطاقة أنكي + بنش تفاعلي لكل شابتر.",
    icon: BookOpen,
    tone: "ember" as const,
  },
  {
    to: "/patterns",
    label: "أنواع المسائل",
    english: "Patterns",
    description: "13 نوع مسألة بخطوات مجردة وأمثلة محلولة وتمارين عملية.",
    icon: Layers,
    tone: "jade" as const,
  },
  {
    to: "/solve",
    label: "حل",
    english: "Solve",
    description: "87 سؤال بفلاتر ومؤقت وشرح كامل لكل إجابة.",
    icon: ListChecks,
    tone: "ember" as const,
  },
];

export function DashboardPage() {
  const { state, updatePrefs } = useProgress();
  const reduced = usePrefersReducedMotion();
  const scope = useRef<HTMLDivElement>(null);

  const overall = useMemo(() => getOverallStats(state), [state]);
  const chapters = useMemo(() => getChapterStats(state), [state]);
  const weakTopics = useMemo(() => getWeakTopics(state, 5), [state]);
  const mockScore = state.mock
    ? state.mock.correct / Math.max(1, state.mock.total)
    : null;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".hero-reveal", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.075,
        ease: "power3.out",
      });
      gsap.from(".bento-reveal", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.055,
        delay: 0.18,
        ease: "power2.out",
      });
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <div ref={scope}>
      <section className="glass relative mb-6 overflow-hidden rounded-[26px] px-5 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-ember/[0.1] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-jade/[0.06] blur-3xl"
          aria-hidden="true"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <div className="hero-reveal mb-3 flex flex-wrap items-center gap-2">
              <Tag tone="ember">
                <Sparkles size={11} />
                Algorithms · Midterm
              </Tag>
              <Tag tone="mono">6 CHAPTERS</Tag>
              <Tag tone="mono">87 QUESTIONS</Tag>
              <Tag tone="mono">143 CARDS</Tag>
            </div>
            <h1 className="hero-reveal text-balance text-[34px] font-extrabold leading-[1.15] tracking-[-0.045em] text-chalk sm:text-[46px]">
              افهم الخوارزمية.
              <br />
              <span className="text-ember">متحفظهاش.</span>
            </h1>
            <p className="hero-reveal mt-3 max-w-[58ch] text-pretty text-[13px] leading-7 text-mist">
              منصة مذاكرة كاملة للميدتيرم: نظرية مشروحة بالعربي، بطاقات استرجاع، أطلس
              لأنواع المسائل، بنشات تفاعلية، وحل بفلاتر ومؤقت — كله محلي على جهازك.
            </p>
            <div className="hero-reveal mt-5 flex flex-wrap items-center gap-2">
              <Link
                to="/study"
                onClick={() => updatePrefs({ lastChapter: state.prefs.lastChapter })}
              >
                <Button variant="primary" size="lg" className="gap-2">
                  <BookOpen size={16} />
                  ابدأ من الشابتر {state.prefs.lastChapter}
                </Button>
              </Link>
              <Link to="/speedrun">
                <Button variant="secondary" size="lg" className="gap-2">
                  <Zap size={16} />
                  Speedrun
                </Button>
              </Link>
              <Link to="/mock">
                <Button variant="quiet" size="lg" className="gap-2">
                  <Timer size={15} />
                  Mock Midterm
                </Button>
              </Link>
            </div>
            <div className="hero-reveal mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-dim">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-jade" />
                بدون تسجيل
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-jade" />
                بدون سيرفر
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-jade" />
                تقدمك محفوظ على جهازك
              </span>
            </div>
          </div>

          <div className="hero-reveal">
            <SpotlightCard className="rounded-[20px] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-chalk">الجاهزية العامة</div>
                  <div className="mt-0.5 text-[9.5px] text-dim">
                    {overall.answered} من {overall.total} سؤال اتلمس
                  </div>
                </div>
                <Tag tone={overall.mastery >= 0.7 ? "jade" : "ember"}>
                  <TrendingUp size={10} />
                  {overall.mastery >= 0.7 ? "جاهز" : "لسه"}
                </Tag>
              </div>
              <div className="flex items-center gap-5">
                <Ring value={overall.mastery} size={116} stroke={9} sublabel="mastery" />
                <div className="grid flex-1 gap-2.5">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[9.5px] text-dim">
                      <span>دقة الإجابات</span>
                      <span className="tabular font-mono text-mist">
                        {formatPercent(overall.accuracy)}
                      </span>
                    </div>
                    <ProgressBar value={overall.accuracy} tone="jade" height="h-1" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[9.5px] text-dim">
                      <span>البطاقات المتقنة</span>
                      <span className="tabular font-mono text-mist">
                        {overall.cardsMastered}/143
                      </span>
                    </div>
                    <ProgressBar
                      value={overall.cardsMastered / 143}
                      tone="ember"
                      height="h-1"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-[9px] border border-white/[0.06] bg-white/[0.02] px-2.5 py-1.5">
                    <span className="text-[9.5px] text-dim">آخر Mock</span>
                    <span className="font-mono text-[10.5px] text-chalk">
                      {mockScore !== null ? formatPercent(mockScore) : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {departments.map((department, index) => {
          const Icon = department.icon;
          return (
            <Link key={department.to} to={department.to} className="bento-reveal">
              <SpotlightCard className="group h-full rounded-[18px] p-4">
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "grid h-10 w-10 place-items-center rounded-[11px] border",
                      department.tone === "jade"
                        ? "border-jade/25 bg-jade/[0.07] text-jade"
                        : "border-ember/25 bg-ember/[0.07] text-ember",
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.1em] text-dim">
                    DEPT 0{index + 1}
                  </span>
                </div>
                <h2 className="mt-3 flex items-baseline gap-2 text-[15px] font-semibold text-chalk">
                  {department.label}
                  <span className="font-mono text-[9.5px] tracking-[0.06em] text-dim">
                    {department.english}
                  </span>
                </h2>
                <p className="mt-1 text-[11px] leading-6 text-mist">{department.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[10.5px] font-medium text-ember">
                  افتح القسم
                  <ArrowLeft
                    size={12}
                    className="transition-transform group-hover:-translate-x-0.5"
                  />
                </div>
              </SpotlightCard>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <SpotlightCard className="bento-reveal p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={15} className="text-ember" />
              <h2 className="text-[13px] font-semibold text-chalk">خريطة الشابترات</h2>
            </div>
            <Link
              to="/study"
              className="flex items-center gap-1 text-[10px] text-dim transition-colors hover:text-ember"
            >
              المذاكرة
              <ChevronLeft size={11} />
            </Link>
          </div>
          <div className="grid gap-2">
            {chapters.map((chapter) => (
              <Link
                key={chapter.number}
                to="/study"
                onClick={() => updatePrefs({ lastChapter: chapter.number })}
                className="group flex items-center gap-3 rounded-[11px] border border-white/[0.055] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
              >
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-[7px] border font-mono text-[9.5px]",
                    chapter.mastery >= 0.7
                      ? "border-jade/30 bg-jade/[0.08] text-jade"
                      : chapter.mastery > 0
                        ? "border-ember/25 bg-ember/[0.07] text-ember"
                        : "border-white/10 bg-white/[0.03] text-dim",
                  )}
                >
                  {chapter.number}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-medium text-mist transition-colors group-hover:text-chalk">
                      {chapter.titleAr}
                    </span>
                    <span className="tabular shrink-0 font-mono text-[9px] text-dim">
                      {chapter.correct}/{chapter.total}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar
                      value={chapter.mastery}
                      tone={
                        chapter.mastery >= 0.7
                          ? "jade"
                          : chapter.mastery > 0
                            ? "ember"
                            : "clay"
                      }
                      height="h-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SpotlightCard>

        <div className="flex flex-col gap-4">
          <SpotlightCard className="bento-reveal p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-clay" />
                <h2 className="text-[13px] font-semibold text-chalk">نقاط الضعف</h2>
              </div>
              <Tag tone={weakTopics.length ? "clay" : "jade"}>
                {weakTopics.length ? `${weakTopics.length} topics` : "نظيف"}
              </Tag>
            </div>
            {weakTopics.length ? (
              <div className="grid gap-2">
                {weakTopics.map((topic) => (
                  <div
                    key={`${topic.chapterNumber}-${topic.topic}`}
                    className="flex items-center gap-2.5 rounded-[10px] border border-clay/15 bg-clay/[0.035] px-3 py-2"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-clay/15 font-mono text-[9px] text-clay">
                      {topic.wrong}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10.5px] font-medium text-mist">
                        {topic.topic}
                      </div>
                      <div className="font-mono text-[8.5px] text-dim">
                        CH {topic.chapterNumber} · {topic.wrong}/{topic.total} wrong
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-[12px] border border-jade/15 bg-jade/[0.03] px-4 py-6 text-center">
                <CheckCircle2 size={20} className="text-jade" />
                <div className="mt-2 text-[11.5px] font-semibold text-chalk">مفيش أخطاء مسجلة</div>
                <p className="mt-1 text-[10px] leading-5 text-dim">
                  ابدأ تحل أو تذاكر — أول ما تغلط، النوع هيتسجل هنا.
                </p>
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Link to="/solve">
                <Button variant="quiet" size="sm" className="gap-1.5">
                  <ListChecks size={12} />
                  راجع الأخطاء
                </Button>
              </Link>
              <Link to="/speedrun">
                <Button variant="quiet" size="sm" className="gap-1.5">
                  <Zap size={12} />
                  Weak speedrun
                </Button>
              </Link>
            </div>
          </SpotlightCard>

          <div className="bento-reveal grid grid-cols-2 gap-3">
            <SpotlightCard className="p-3.5">
              <Star size={14} className="text-ember" />
              <div className="tabular mt-1.5 font-mono text-[19px] font-semibold text-chalk">
                {overall.saved}
              </div>
              <div className="text-[9.5px] text-dim">أسئلة محفوظة</div>
            </SpotlightCard>
            <SpotlightCard className="p-3.5">
              <BrainCircuit size={14} className="text-jade" />
              <div className="tabular mt-1.5 font-mono text-[19px] font-semibold text-chalk">
                {overall.cardsMastered}
              </div>
              <div className="text-[9.5px] text-dim">بطاقات متقنة</div>
            </SpotlightCard>
            <SpotlightCard className="p-3.5">
              <CheckCircle2 size={14} className="text-jade" />
              <div className="tabular mt-1.5 font-mono text-[19px] font-semibold text-chalk">
                {overall.correct}
              </div>
              <div className="text-[9.5px] text-dim">إجابات صح</div>
            </SpotlightCard>
            <SpotlightCard className="p-3.5">
              <Play size={14} className="text-ember" />
              <div className="tabular mt-1.5 font-mono text-[19px] font-semibold text-chalk">
                {state.mock ? formatPercent(mockScore ?? 0) : "—"}
              </div>
              <div className="text-[9.5px] text-dim">أفضل Mock</div>
            </SpotlightCard>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-[18px] border border-ember/15 bg-ember/[0.035] px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-ember/25 bg-ember/10 text-ember">
            <Sparkles size={16} />
          </span>
          <div>
            <div className="text-[12px] font-semibold text-chalk">نصيحة اليوم</div>
            <p className="mt-0.5 max-w-[62ch] text-[10.5px] leading-5 text-mist">
              ذاكر شابتر واحد نظري + بطاقاته، بعدها حل 5 أسئلة عليه. التكرار المتباعد
              أفضل من قراءة كل حاجة مرة واحدة.
            </p>
          </div>
        </div>
        <Link to="/patterns">
          <Button variant="secondary" size="sm" className="gap-1.5">
            بصمج أنواع المسائل
            <ArrowLeft size={13} />
          </Button>
        </Link>
      </div>

      <div className="mt-4 text-center text-[9.5px] text-dim">
        VECTR // ALGO — مذاكرة محلية بالكامل. بياناتك مش بتسيب جهازك.
      </div>
    </div>
  );
}
