import { useMemo, useState } from "react";
import { Chip } from "@/components/Chip";
import { BenchControls, BenchShell } from "@/components/benches/BenchShell";
import { CodeBlock } from "@/components/CodeBlock";

const binaryArray = Array.from({ length: 12 }, (_, index) => index + 1);
const target = 8;

interface BinaryStep {
  low: number;
  high: number;
  mid: number;
  value: number;
  action: string;
  found: boolean;
}

function buildBinarySteps(): BinaryStep[] {
  const steps: BinaryStep[] = [];
  let low = 1;
  let high = binaryArray.length;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = binaryArray[mid - 1];
    if (value === target) {
      steps.push({ low, high, mid, value, action: `A[${mid}] = ${target} — لقيناه.`, found: true });
      break;
    }
    if (value < target) {
      steps.push({
        low,
        high,
        mid,
        value,
        action: `${value} < ${target} → low = ${mid + 1}`,
        found: false,
      });
      low = mid + 1;
    } else {
      steps.push({
        low,
        high,
        mid,
        value,
        action: `${value} > ${target} → high = ${mid - 1}`,
        found: false,
      });
      high = mid - 1;
    }
  }
  return steps;
}

const binarySteps = buildBinarySteps();

export function PrimitiveOpsBench() {
  const [mode, setMode] = useState<"count" | "search">("count");
  const [n, setN] = useState(12);
  const [step, setStep] = useState(0);

  const best = 5 * n;
  const worst = 7 * n - 2;
  const max = Math.max(best, worst, 1);
  const current = binarySteps[step];

  const arrayMaxCode = useMemo(
    () =>
      "cMax <- A[0]\nfor i <- 1 to n - 1 do\n    if cMax < A[i] then\n        cMax <- A[i]\nreturn cMax",
    [],
  );

  return (
    <BenchShell
      title="Primitive Operations Bench"
      description="عدّ عمليات ArrayMax، أو تتبع Binary Search خطوة بخطوة على نفس مثال المحاضرة."
      controls={
        <div className="flex gap-1.5">
          <Chip active={mode === "count"} tone="ember" onClick={() => setMode("count")}>
            ArrayMax
          </Chip>
          <Chip active={mode === "search"} tone="ember" onClick={() => setMode("search")}>
            Binary Search
          </Chip>
        </div>
      }
    >
      {mode === "count" ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] text-mist">حجم المصفوفة n</span>
              <span className="tabular font-mono text-[13px] text-ember">{n}</span>
            </div>
            <input
              type="range"
              min={2}
              max={30}
              value={n}
              onChange={(event) => setN(Number(event.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#E7A24B]"
              aria-label="حجم المصفوفة"
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[12px] border border-white/[0.06] bg-black/20 p-3">
                <div className="text-[10px] text-dim">Best case</div>
                <div className="tabular mt-1 font-mono text-[22px] font-semibold text-jade">
                  {best}
                </div>
                <div className="mt-1 font-mono text-[10px] text-dim">5n</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-jade transition-[width] duration-300"
                    style={{ width: `${(best / max) * 100}%` }}
                  />
                </div>
              </div>
              <div className="rounded-[12px] border border-white/[0.06] bg-black/20 p-3">
                <div className="text-[10px] text-dim">Worst case</div>
                <div className="tabular mt-1 font-mono text-[22px] font-semibold text-ember">
                  {worst}
                </div>
                <div className="mt-1 font-mono text-[10px] text-dim">7n − 2</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-ember transition-[width] duration-300"
                    style={{ width: `${(worst / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="mt-3 text-[10.5px] leading-5 text-dim">
              الفرق ثابت تقريباً (2n − 2) — الاتنين <span className="font-mono text-mist">O(n)</span>،
              فالـ scalability واحدة.
            </p>
          </div>
          <CodeBlock code={arrayMaxCode} label="ARRAY-MAX" />
        </div>
      ) : (
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="font-mono text-[11px] text-mist">
              Target = <span className="text-ember">8</span> · 1-indexed
            </div>
            <BenchControls
              index={step}
              total={binarySteps.length}
              onPrev={() => setStep((value) => Math.max(0, value - 1))}
              onNext={() =>
                setStep((value) => Math.min(binarySteps.length - 1, value + 1))
              }
              onReset={() => setStep(0)}
            />
          </div>

          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
            {binaryArray.map((value, index) => {
              const position = index + 1;
              const inRange = position >= current.low && position <= current.high;
              const isMid = position === current.mid;
              const isFound = current.found && isMid;
              return (
                <div key={value} className="text-center">
                  <div
                    className={`grid aspect-square place-items-center rounded-[8px] border font-mono text-[11px] transition-colors duration-200 ${
                      isFound
                        ? "border-jade/50 bg-jade/20 text-jade"
                        : isMid
                          ? "border-ember/50 bg-ember/15 text-ember"
                          : inRange
                            ? "border-white/15 bg-white/[0.04] text-mist"
                            : "border-white/[0.04] bg-white/[0.01] text-dim/35"
                    }`}
                  >
                    {value}
                  </div>
                  <div className="mt-1 font-mono text-[8px] text-dim/60">{position}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <span className="font-mono text-[9px] text-dim">low</span>
              <div className="font-mono text-[13px] text-chalk">{current.low}</div>
            </div>
            <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <span className="font-mono text-[9px] text-dim">mid</span>
              <div className="font-mono text-[13px] text-ember">{current.mid}</div>
            </div>
            <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <span className="font-mono text-[9px] text-dim">high</span>
              <div className="font-mono text-[13px] text-chalk">{current.high}</div>
            </div>
          </div>
          <div
            className={`mt-3 rounded-[11px] border px-3 py-2.5 text-[11.5px] ${
              current.found
                ? "border-jade/25 bg-jade/[0.06] text-jade"
                : "border-ember/20 bg-ember/[0.04] text-mist"
            }`}
          >
            <span className="font-mono text-[10px] text-dim">mid = ⌊({current.low}+{current.high})/2⌋ = {current.mid}</span>
            <div className="mt-1">{current.action}</div>
          </div>
        </div>
      )}
    </BenchShell>
  );
}
