import { useEffect, useMemo, useState } from "react";
import { BenchControls, BenchShell } from "@/components/benches/BenchShell";

interface HeapStep {
  array: number[];
  heapSize: number;
  active: number;
  swapped: number[];
  action: string;
  phase: "build" | "sort" | "done";
}

const initial = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];

function swap(array: number[], first: number, second: number): void {
  [array[first], array[second]] = [array[second], array[first]];
}

function buildSteps(): HeapStep[] {
  const array = [...initial];
  let heapSize = array.length;
  let phase: "build" | "sort" = "build";
  const steps: HeapStep[] = [
    {
      array: [...array],
      heapSize,
      active: 0,
      swapped: [],
      action: "BUILD-MAX-HEAP: start at i = ⌊n/2⌋ = 5 and walk down to 1.",
      phase: "build",
    },
  ];

  const heapify = (start: number): void => {
    let index = start;
    let guard = 0;
    while (guard < 8) {
      guard += 1;
      const left = index * 2;
      const right = index * 2 + 1;
      let largest = index;
      if (left <= heapSize && array[left - 1] > array[largest - 1]) largest = left;
      if (right <= heapSize && array[right - 1] > array[largest - 1]) largest = right;

      if (largest === index) {
        steps.push({
          array: [...array],
          heapSize,
          active: index,
          swapped: [],
          action: `MAX-HEAPIFY(A, ${index}): node ${array[index - 1]} is larger than its children → settled.`,
          phase,
        });
        return;
      }

      const before = array[index - 1];
      const after = array[largest - 1];
      swap(array, index - 1, largest - 1);
      steps.push({
        array: [...array],
        heapSize,
        active: largest,
        swapped: [index - 1, largest - 1],
        action: `MAX-HEAPIFY(A, ${index}): ${before} < ${after} → swap(A[${index}], A[${largest}]) then descend.`,
        phase,
      });
      index = largest;
    }
  };

  for (let i = Math.floor(heapSize / 2); i >= 1; i -= 1) {
    steps.push({
      array: [...array],
      heapSize,
      active: i,
      swapped: [],
      action: `Call MAX-HEAPIFY(A, ${i}) — elements 6 through 10 are leaves.`,
      phase: "build",
    });
    heapify(i);
  }

  steps.push({
    array: [...array],
    heapSize,
    active: 0,
    swapped: [],
    action: "BUILD-MAX-HEAP done: the largest element is now at the root A[1].",
    phase: "build",
  });

  phase = "sort";
  while (heapSize > 1) {
    const root = array[0];
    const last = array[heapSize - 1];
    swap(array, 0, heapSize - 1);
    steps.push({
      array: [...array],
      heapSize,
      active: 1,
      swapped: [0, heapSize - 1],
      action: `HEAPSORT: swap(A[1]=${root}, A[${heapSize}]=${last}) → ${root} settles at the end.`,
      phase: "sort",
    });
    heapSize -= 1;
    steps.push({
      array: [...array],
      heapSize,
      active: 1,
      swapped: [],
      action: `Decrease heap-size to ${heapSize}, then MAX-HEAPIFY(A, 1).`,
      phase: "sort",
    });
    if (heapSize > 1) heapify(1);
  }

  steps.push({
    array: [...array],
    heapSize: 1,
    active: 0,
    swapped: [],
    action: "HEAPSORT done: the array is sorted in ascending order.",
    phase: "done",
  });

  return steps;
}

const WIDTH = 760;
const LEVEL_HEIGHT = 62;
const TOP = 26;

function nodePosition(index: number): { x: number; y: number } {
  const depth = Math.floor(Math.log2(index));
  const levelStart = 2 ** depth;
  const positionInLevel = index - levelStart;
  const levelCount = 2 ** depth;
  const x = ((positionInLevel + 0.5) / levelCount) * WIDTH;
  const y = TOP + depth * LEVEL_HEIGHT;
  return { x, y };
}

export function HeapBench() {
  const steps = useMemo(buildSteps, []);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = steps[index];
  const totalNodes = current.array.length;
  const svgHeight = TOP + Math.floor(Math.log2(totalNodes)) * LEVEL_HEIGHT + 40;

  useEffect(() => {
    if (!playing) return;
    if (index >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 850);
    return () => window.clearTimeout(timer);
  }, [playing, index, steps.length]);

  return (
    <BenchShell
      title="Heap Visualizer"
      description="BUILD-MAX-HEAP then HEAPSORT on the same lecture array — nodes and swaps move at every step."
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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`rounded-full border px-2.5 py-1 font-mono text-[9px] ${
              current.phase === "sort"
                ? "border-jade/30 bg-jade/[0.08] text-jade"
                : current.phase === "done"
                  ? "border-jade/30 bg-jade/[0.08] text-jade"
                  : "border-ember/30 bg-ember/[0.08] text-ember"
            }`}
          >
            {current.phase === "build"
              ? "BUILD-MAX-HEAP"
              : current.phase === "sort"
                ? "HEAPSORT"
                : "DONE"}
          </span>
          <span className="font-mono text-[9.5px] text-dim">
            heap-size = {current.heapSize}
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-dim">
          A = [{current.array.join(", ")}]
        </span>
      </div>

      <div className="rounded-[14px] border border-white/[0.06] bg-black/25 p-2">
        <svg
          viewBox={`0 0 ${WIDTH} ${svgHeight}`}
          className="h-auto w-full"
          role="img"
          aria-label="Max Heap tree"
        >
          {Array.from({ length: totalNodes }, (_, nodeIndex) => nodeIndex + 1).map((node) => {
            if (node === 1) return null;
            const parent = Math.floor(node / 2);
            const from = nodePosition(parent);
            const to = nodePosition(node);
            const visible = node <= current.heapSize;
            return (
              <line
                key={`edge-${node}`}
                x1={from.x}
                y1={from.y + 19}
                x2={to.x}
                y2={to.y - 19}
                stroke={visible ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.04)"}
                strokeWidth="1.2"
              />
            );
          })}
          {Array.from({ length: totalNodes }, (_, nodeIndex) => nodeIndex + 1).map((node) => {
            const position = nodePosition(node);
            const visible = node <= current.heapSize;
            const isActive = node === current.active;
            const isSwapped = current.swapped.includes(node - 1);
            return (
              <g key={`node-${node}`} className="transition-opacity duration-300" opacity={visible ? 1 : 0.28}>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="19"
                  fill={isSwapped ? "rgba(116,181,141,0.16)" : isActive ? "rgba(231,162,75,0.16)" : "rgba(255,255,255,0.035)"}
                  stroke={isSwapped ? "rgba(116,181,141,0.65)" : isActive ? "rgba(231,162,75,0.7)" : "rgba(255,255,255,0.12)"}
                  strokeWidth={isActive || isSwapped ? 1.8 : 1}
                  className="transition-[fill,stroke] duration-200"
                />
                <text
                  x={position.x}
                  y={position.y + 4}
                  textAnchor="middle"
                  fill={isSwapped ? "#74B58D" : isActive ? "#E7A24B" : "#F4F6F9"}
                  fontSize="11"
                  fontFamily="JetBrains Mono Variable, monospace"
                  fontWeight="600"
                >
                  {current.array[node - 1]}
                </text>
                <text
                  x={position.x}
                  y={position.y + 31}
                  textAnchor="middle"
                  fill="rgba(152,161,178,0.5)"
                  fontSize="7"
                  fontFamily="JetBrains Mono Variable, monospace"
                >
                  {node}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 rounded-[10px] border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 text-[11.5px] text-mist">
        {current.action}
      </div>
    </BenchShell>
  );
}
