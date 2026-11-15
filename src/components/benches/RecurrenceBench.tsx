import { useState } from "react";
import { Formula } from "@/components/Formula";
import { Chip } from "@/components/Chip";
import { BenchControls, BenchShell } from "@/components/benches/BenchShell";

interface RecurrencePreset {
  id: string;
  label: string;
  recurrence: string;
  answer: string;
  params?: { a: string; b: string; critical: string; compare: string };
  steps: Array<{ title: string; body: string; formulas: string[] }>;
}

const presets: RecurrencePreset[] = [
  {
    id: "merge",
    label: "Merge Sort",
    recurrence: "T(n)=2T(n/2)+n",
    answer: "\\Theta(n\\log n)",
    params: {
      a: "2",
      b: "2",
      critical: "n^{\\log_2 2}=n",
      compare: "f(n)=n=\\Theta(n^1\\log^0 n)",
    },
    steps: [
      {
        title: "Read a, b, and f(n)",
        body: "From the recurrence: two recursive calls, the problem size halves, and the work outside the calls is linear.",
        formulas: ["a=2,\\quad b=2,\\quad f(n)=n"],
      },
      {
        title: "Compute the critical term",
        body: "The critical term is n raised to log_b a. Here the exponent is 1, so the critical term is n.",
        formulas: ["n^{\\log_b a}=n^{\\log_2 2}=n"],
      },
      {
        title: "Pick the case",
        body: "f(n) equals the critical term times log^0 n → Case 2 with k = 0.",
        formulas: ["f(n)=\\Theta(n^{\\log_b a}\\log^0 n)"],
      },
      {
        title: "Write the answer",
        body: "Case 2 adds one to the logarithm's power, so the answer is n log n.",
        formulas: ["T(n)=\\Theta(n\\log n)"],
      },
    ],
  },
  {
    id: "case3",
    label: "3T(n/6)+n",
    recurrence: "T(n)=3T(n/6)+n",
    answer: "\\Theta(n)",
    params: {
      a: "3",
      b: "6",
      critical: "n^{\\log_6 3}\\approx n^{0.613}",
      compare: "f(n)=n=\\Omega(n^{0.613+\\epsilon})",
    },
    steps: [
      {
        title: "Read the values",
        body: "3 calls, each on n/6, and the outside work is n.",
        formulas: ["a=3,\\quad b=6,\\quad f(n)=n"],
      },
      {
        title: "Critical term",
        body: "log_6 3 ≈ 0.613, so n^1 is clearly larger.",
        formulas: ["n^{\\log_6 3}\\approx n^{0.613}"],
      },
      {
        title: "Check Case 3",
        body: "f(n) exceeds the critical term by an ε exponent, and the regularity condition holds because 3(n/6) = n/2 ≤ δn for any δ ≥ 1/2.",
        formulas: ["af(n/b)=3(n/6)=n/2\\le \\delta n"],
      },
      {
        title: "Write the answer",
        body: "Case 3 takes f(n) itself, so the result is linear.",
        formulas: ["T(n)=\\Theta(n)"],
      },
    ],
  },
  {
    id: "sqrt",
    label: "2T(√n)+1",
    recurrence: "T(n)=2T(\\sqrt n)+1",
    answer: "\\Theta(\\log n)",
    steps: [
      {
        title: "Change the variable",
        body: "Let z = log n, meaning n = 2^z. Then √n = 2^{z/2}.",
        formulas: ["z=\\log n,\\quad n=2^z,\\quad \\sqrt n=2^{z/2}"],
      },
      {
        title: "Write S(z)",
        body: "Define S(z) = T(2^z); the recurrence becomes Master-Theorem shaped.",
        formulas: ["S(z)=2S(z/2)+O(1)"],
      },
      {
        title: "Apply Master",
        body: "a=2, b=2 → critical term z^1, and f(z)=O(1) is smaller → Case 1.",
        formulas: ["S(z)=\\Theta(z^{\\log_2 2})=\\Theta(z)"],
      },
      {
        title: "Switch back",
        body: "Since z = log n, the final result is logarithmic.",
        formulas: ["T(n)=\\Theta(\\log n)"],
      },
    ],
  },
  {
    id: "unroll",
    label: "T(n−1)+2ⁿ",
    recurrence: "T(n)=T(n-1)+2^n",
    answer: "O(2^n)",
    steps: [
      {
        title: "Unroll the first 3 steps",
        body: "Each step drops n by one, and the work accumulates as a sum of powers of 2.",
        formulas: [
          "T(n)=T(n-1)+2^n",
          "=T(n-2)+2^{n-1}+2^n",
          "=\\dots=T(0)+\\sum_{i=1}^{n}2^i",
        ],
      },
      {
        title: "Apply the geometric-series formula",
        body: "The sum from 2^1 to 2^n = 2(2^n − 1) = 2^{n+1} − 2.",
        formulas: ["\\sum_{i=1}^{n}2^i=2(2^n-1)=2^{n+1}-2"],
      },
      {
        title: "Take the dominant term",
        body: "2^n is the largest term, so the complexity is exponential.",
        formulas: ["T(n)=O(2^n)"],
      },
    ],
  },
];

export function RecurrenceBench() {
  const [presetId, setPresetId] = useState("merge");
  const [step, setStep] = useState(0);
  const preset = presets.find((item) => item.id === presetId) ?? presets[0];
  const current = preset.steps[Math.min(step, preset.steps.length - 1)];

  return (
    <BenchShell
      title="Recurrence Bench"
      description="Pick a recurrence from the lecture and see the Master Theorem decision or the unrolling steps."
      controls={
        <div className="flex flex-wrap gap-1.5">
          {presets.map((item) => (
            <Chip
              key={item.id}
              active={item.id === presetId}
              tone="ember"
              onClick={() => {
                setPresetId(item.id);
                setStep(0);
              }}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      }
    >
      <div className="mb-4 rounded-[13px] border border-white/[0.06] bg-black/25 px-4 py-3">
        <div className="text-[10px] text-dim">Recurrence</div>
        <div className="mt-1.5 overflow-x-auto">
          <Formula tex={preset.recurrence} display />
        </div>
      </div>

      {preset.params ? (
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <div className="font-mono text-[9px] text-dim">a</div>
            <div className="font-mono text-[14px] text-chalk">{preset.params.a}</div>
          </div>
          <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <div className="font-mono text-[9px] text-dim">b</div>
            <div className="font-mono text-[14px] text-chalk">{preset.params.b}</div>
          </div>
          <div className="rounded-[10px] border border-ember/20 bg-ember/[0.04] px-3 py-2">
            <div className="font-mono text-[9px] text-ember/70">critical</div>
            <div className="overflow-x-auto">
              <Formula tex={preset.params.critical} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[10.5px] text-dim">
          Step {step + 1} of {preset.steps.length}
        </div>
        <BenchControls
          index={step}
          total={preset.steps.length}
          onPrev={() => setStep((value) => Math.max(0, value - 1))}
          onNext={() =>
            setStep((value) => Math.min(preset.steps.length - 1, value + 1))
          }
          onReset={() => setStep(0)}
        />
      </div>

      <div className="rounded-[14px] border border-white/[0.06] bg-black/20 p-4">
        <div className="text-[14px] font-semibold text-chalk">{current.title}</div>
        <p className="mt-1.5 max-w-[64ch] text-[12px] leading-7 text-mist">
          {current.body}
        </p>
        <div className="mt-3 grid gap-2">
          {current.formulas.map((formula, index) => (
            <div key={index} className="formula-shell py-2">
              <Formula tex={formula} display />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-[11px] border border-jade/20 bg-jade/[0.04] px-3.5 py-2.5">
        <span className="text-[10.5px] text-mist">Final answer</span>
        <span className="text-jade">
          <Formula tex={preset.answer} />
        </span>
      </div>
    </BenchShell>
  );
}
