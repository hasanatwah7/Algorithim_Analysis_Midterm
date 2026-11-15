import { useEffect, useMemo, useState } from "react";
import { BenchControls, BenchShell } from "@/components/benches/BenchShell";

interface PartitionStep {
  array: number[];
  i: number;
  j: number;
  action: string;
  swapped: number[];
  done?: boolean;
  pivotIndex: number;
}

const initial = [2, 8, 7, 1, 3, 5, 6, 4];

function buildSteps(): PartitionStep[] {
  const array = [...initial];
  const pivot = array[array.length - 1];
  const steps: PartitionStep[] = [
    {
      array: [...array],
      i: 0,
      j: 1,
      action: `x = A[8] = ${pivot} · i = 0 · j = 1`,
      swapped: [],
      pivotIndex: 7,
    },
  ];
  let i = 0;
  for (let j = 0; j < array.length - 1; j += 1) {
    const value = array[j];
    if (value <= pivot) {
      const oldI = i;
      if (i !== j) {
        [array[i], array[j]] = [array[j], array[i]];
      }
      i += 1;
      steps.push({
        array: [...array],
        i,
        j: j + 1,
        action:
          oldI === j
            ? `A[${j + 1}] = ${value} ≤ ${pivot} → i = ${i} (same slot, no actual swap)`
            : `A[${j + 1}] = ${value} ≤ ${pivot} → i = ${i} · swap(${oldI + 1}, ${j + 1})`,
        swapped: oldI === j ? [] : [oldI, j],
        pivotIndex: 7,
      });
    } else {
      steps.push({
        array: [...array],
        i,
        j: j + 1,
        action: `A[${j + 1}] = ${value} > ${pivot} → skip and j++`,
        swapped: [],
        pivotIndex: 7,
      });
    }
  }
  const pivotIndex = i;
  [array[i], array[array.length - 1]] = [array[array.length - 1], array[i]];
  steps.push({
    array: [...array],
    i,
    j: array.length,
    action: `swap(A[${i + 1}], pivot) → pivot settles at q = ${i + 1}`,
    swapped: [i, array.length - 1],
    done: true,
    pivotIndex,
  });
  return steps;
}

export function PartitionBench() {
  const steps = useMemo(buildSteps, []);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = steps[index];

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 1000);
    return () => window.clearTimeout(timer);
  }, [playing, index, steps.length]);

  return (
    <BenchShell
      title="PARTITION Tracer"
      description="Trace Lomuto Partition on the same lecture array. Watch i, j, and the swaps at every step."
      controls={
        <BenchControls
          index={index}
          total={steps.length}
          onPrev={() => {
            setPlaying(false);
            setIndex((value) => Math.max(0, value - 1));
          }}
          onNext={() => {
            setPlaying(false);
            setIndex((value) => Math.min(steps.length - 1, value + 1));
          }}
          onReset={() => {
            setPlaying(false);
            setIndex(0);
          }}
          playing={playing}
          onPlay={() => setPlaying((value) => !value)}
        />
      }
    >
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {current.array.map((value, cellIndex) => {
          const isPivot =
            cellIndex === current.pivotIndex ||
            (current.done && cellIndex === current.swapped[0]);
          const isJ = cellIndex === current.j - 1;
          const isSwapped = current.swapped.includes(cellIndex);
          return (
            <div key={cellIndex} className="text-center">
              <div className="mb-1 h-3 font-mono text-[8px] text-dim">
                {isJ ? <span className="text-ember">j</span> : null}
              </div>
              <div
                className={`grid aspect-square place-items-center rounded-[10px] border font-mono text-[13px] transition-all duration-200 ${
                  isPivot
                    ? "border-ember/50 bg-ember/12 text-ember"
                    : isSwapped
                      ? "border-jade/50 bg-jade/15 text-jade"
                      : isJ
                        ? "border-white/25 bg-white/[0.06] text-chalk"
                        : "border-white/[0.07] bg-white/[0.025] text-mist"
                }`}
              >
                {value}
              </div>
              <div className="mt-1 font-mono text-[8px] text-dim/60">{cellIndex + 1}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[auto_1fr]">
        <div className="flex gap-2">
          <div className="rounded-[9px] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5">
            <span className="font-mono text-[9px] text-dim">i</span>
            <div className="font-mono text-[13px] text-chalk">{current.i}</div>
          </div>
          <div className="rounded-[9px] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5">
            <span className="font-mono text-[9px] text-dim">j</span>
            <div className="font-mono text-[13px] text-ember">{Math.min(current.j, 8)}</div>
          </div>
        </div>
        <div
          className={`flex items-center rounded-[10px] border px-3.5 py-2 text-[11.5px] ${
            current.done
              ? "border-jade/25 bg-jade/[0.06] text-jade"
              : "border-white/[0.07] bg-white/[0.02] text-mist"
          }`}
        >
          {current.action}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-dim">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-ember/50 bg-ember/20" />
          pivot
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-jade/50 bg-jade/20" />
          swap
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm border border-white/25 bg-white/10" />
          j
        </span>
        <span className="mr-auto font-mono">Θ(n) · in-place</span>
      </div>
    </BenchShell>
  );
}
