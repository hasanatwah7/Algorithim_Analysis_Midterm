import { useMemo, useState } from "react";
import { Formula } from "@/components/Formula";
import { BenchShell } from "@/components/benches/BenchShell";

interface GrowthFunction {
  key: string;
  label: string;
  tex: string;
  fn: (n: number) => number;
  note: string;
}

const growthFunctions: GrowthFunction[] = [
  {
    key: "log",
    label: "log n",
    tex: "\\log n",
    fn: (n) => Math.log2(n),
    note: "ينمو ببطء شديد — لو n اتضاعف يزيد خطوة واحدة.",
  },
  {
    key: "log2",
    label: "log² n",
    tex: "\\log^2 n",
    fn: (n) => Math.log2(n) ** 2,
    note: "أسرع من log n، لكن لسه أبطأ من أي جذر.",
  },
  {
    key: "sqrt",
    label: "√n",
    tex: "\\sqrt{n}",
    fn: (n) => Math.sqrt(n),
    note: "بين اللوغاريتم والخطي — مش خطي.",
  },
  {
    key: "linear",
    label: "n",
    tex: "n",
    fn: (n) => n,
    note: "خطي: ضعف الـ input = ضعف الوقت.",
  },
  {
    key: "nlogn",
    label: "n log n",
    tex: "n\\log n",
    fn: (n) => n * Math.log2(n),
    note: "الحد الفاصل لخوارزميات الترتيب المقارن الجيدة.",
  },
  {
    key: "quadratic",
    label: "n²",
    tex: "n^2",
    fn: (n) => n ** 2,
    note: "تربيعي — أي loop متداخلة غالباً بتطلع كده.",
  },
  {
    key: "cubic",
    label: "n³",
    tex: "n^3",
    fn: (n) => n ** 3,
    note: "تكعيبي — خطير حتى على n متوسطة.",
  },
  {
    key: "exponential",
    label: "2ⁿ",
    tex: "2^n",
    fn: (n) => 2 ** n,
    note: "أسي — أي زيادة صغيرة في n بتضاعف الوقت.",
  },
];

const N_MAX = 40;
const WIDTH = 680;
const HEIGHT = 230;
const PAD_X = 16;
const PAD_Y = 18;

function logValue(value: number): number {
  return Math.log2(value + 1);
}

function pointsFor(fn: (n: number) => number, maxLog: number): string {
  const points: string[] = [];
  for (let n = 1; n <= N_MAX; n += 1) {
    const x = PAD_X + ((n - 1) / (N_MAX - 1)) * (WIDTH - PAD_X * 2);
    const y =
      HEIGHT - PAD_Y - (logValue(fn(n)) / maxLog) * (HEIGHT - PAD_Y * 2);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

function formatValue(value: number): string {
  if (value >= 1_000_000) return value.toExponential(2);
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2);
}

export function GrowthBench() {
  const [selected, setSelected] = useState("nlogn");

  const maxLog = useMemo(() => {
    return Math.max(...growthFunctions.map((item) => logValue(item.fn(N_MAX))));
  }, []);

  const polylines = useMemo(
    () =>
      growthFunctions.map((item) => ({
        ...item,
        points: pointsFor(item.fn, maxLog),
      })),
    [maxLog],
  );

  const active = growthFunctions.find((item) => item.key === selected) ?? growthFunctions[0];
  const values = [8, 16, 32].map((n) => ({ n, value: active.fn(n) }));

  return (
    <BenchShell
      title="Growth Rate Bench"
      description="اختار دالة وشوف شكل نموها على مقياس لوغاريتمي — الترتيب نفسه هو اللي بيتسأل عليه."
    >
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="rounded-[14px] border border-white/[0.06] bg-black/25 p-2.5">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="مقارنة معدلات نمو الدوال"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = PAD_Y + ratio * (HEIGHT - PAD_Y * 2);
              return (
                <line
                  key={ratio}
                  x1={PAD_X}
                  x2={WIDTH - PAD_X}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.055)"
                  strokeWidth="1"
                />
              );
            })}
            {polylines.map((item) => {
              const isActive = item.key === selected;
              return (
                <polyline
                  key={item.key}
                  points={item.points}
                  fill="none"
                  stroke={isActive ? "#E7A24B" : "rgba(244,246,249,0.2)"}
                  strokeWidth={isActive ? 2.4 : 1.1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-[stroke,stroke-width] duration-200"
                />
              );
            })}
            {(() => {
              const value = active.fn(N_MAX);
              const y =
                HEIGHT -
                PAD_Y -
                (logValue(value) / maxLog) * (HEIGHT - PAD_Y * 2);
              return (
                <circle
                  cx={WIDTH - PAD_X}
                  cy={y}
                  r="4"
                  fill="#E7A24B"
                  stroke="#050608"
                  strokeWidth="2"
                />
              );
            })()}
            <text
              x={PAD_X}
              y={HEIGHT - 3}
              fill="rgba(152,161,178,0.55)"
              fontSize="8"
              fontFamily="JetBrains Mono Variable, monospace"
            >
              n=1
            </text>
            <text
              x={WIDTH - PAD_X}
              y={HEIGHT - 3}
              fill="rgba(152,161,178,0.55)"
              fontSize="8"
              textAnchor="end"
              fontFamily="JetBrains Mono Variable, monospace"
            >
              n={N_MAX}
            </text>
          </svg>
          <div className="flex flex-wrap gap-1.5 px-1 pb-1 pt-2">
            {growthFunctions.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelected(item.key)}
                className={`rounded-md border px-2 py-1 font-mono text-[9.5px] transition-colors ${
                  item.key === selected
                    ? "border-ember/40 bg-ember/10 text-ember"
                    : "border-white/[0.06] bg-white/[0.02] text-dim hover:text-mist"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="rounded-[13px] border border-white/[0.07] bg-white/[0.025] p-3.5">
            <div className="text-[10px] text-dim">الدالة المختارة</div>
            <div className="mt-1.5 formula-shell !py-2">
              <Formula tex={active.tex} display />
            </div>
            <p className="mixed-ar mt-2 text-[11px] leading-6 text-mist">{active.note}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {values.map((item) => (
              <div
                key={item.n}
                className="rounded-[10px] border border-white/[0.06] bg-black/20 px-2.5 py-2"
              >
                <div className="font-mono text-[9px] text-dim">n={item.n}</div>
                <div className="tabular mt-1 font-mono text-[12.5px] text-chalk">
                  {formatValue(item.value)}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[13px] border border-ember/15 bg-ember/[0.035] p-3">
            <div className="mb-2 text-[10px] font-medium text-ember">ترتيب النمو</div>
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 font-mono text-[9.5px] text-dim">
              {["log n", "log² n", "√n", "n", "n log n", "n²", "n³", "2ⁿ"].map(
                (label, index, list) => (
                  <span key={label} className="flex items-center gap-1">
                    <span className={label === active.label ? "text-ember" : ""}>{label}</span>
                    {index < list.length - 1 ? <span className="text-white/20">≺</span> : null}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </BenchShell>
  );
}
