import { useState } from "react";
import { Formula } from "@/components/Formula";
import { Chip } from "@/components/Chip";
import { BenchControls, BenchShell } from "@/components/benches/BenchShell";

const inductionSteps = [
  {
    label: "Basis",
    title: "أصغر قيمتين",
    body: "عوّض n = 1 و n = 2. الاتنين بيحققوا المتباينة، فالبداية سليمة.",
    formulas: ["F(1)=1 < 2^1=2", "F(2)=2 < 2^2=4"],
  },
  {
    label: "Hypothesis",
    title: "فرض الاستقراء",
    body: "افترض أن F(i) < 2^i صحيحة لكل i < n، وده مسموح لأن Fibonacci بتعتمد على آخر قيمتين.",
    formulas: ["F(i) < 2^i \\quad \\forall\\ i < n"],
  },
  {
    label: "Step",
    title: "الخطوة الاستقرائية",
    body: "فكّ F(n) باستخدام التعريف، طبّق الفرض على الحدين، وبسّط — الناتج 2^n.",
    formulas: [
      "F(n)=F(n-1)+F(n-2)",
      "< 2^{n-1}+2^{n-2}",
      "< 2^{n-1}+2^{n-1}=2^n",
    ],
  },
];

export function InductionBench() {
  const [mode, setMode] = useState<"proof" | "sums">("proof");
  const [step, setStep] = useState(0);
  const [n, setN] = useState(6);

  const arithmetic = (n * (n + 1)) / 2;
  const geometric = 2 * (2 ** n - 1);
  const max = Math.max(arithmetic, geometric, 1);
  const current = inductionSteps[step];

  return (
    <BenchShell
      title="Proof & Summation Bench"
      description="اتنقل بين خطوات استقراء Fibonacci، أو جرّب قوانين المجموع بنفسك."
      controls={
        <div className="flex gap-1.5">
          <Chip active={mode === "proof"} tone="ember" onClick={() => setMode("proof")}>
            Induction
          </Chip>
          <Chip active={mode === "sums"} tone="ember" onClick={() => setMode("sums")}>
            Summation
          </Chip>
        </div>
      }
    >
      {mode === "proof" ? (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {inductionSteps.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] transition-colors ${
                    index === step
                      ? "border-ember/40 bg-ember/10 text-ember"
                      : "border-white/[0.08] bg-white/[0.02] text-dim hover:text-mist"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <BenchControls
              index={step}
              total={inductionSteps.length}
              onPrev={() => setStep((value) => Math.max(0, value - 1))}
              onNext={() =>
                setStep((value) => Math.min(inductionSteps.length - 1, value + 1))
              }
              onReset={() => setStep(0)}
            />
          </div>
          <div className="rounded-[14px] border border-white/[0.06] bg-black/20 p-4">
            <div className="text-[10.5px] font-medium text-ember">{current.label}</div>
            <div className="mt-1 text-[15px] font-semibold text-chalk">{current.title}</div>
            <p className="mixed-ar mt-2 max-w-[62ch] text-[12.5px] leading-7 text-mist">
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
          <div className="mt-3 flex items-start gap-2 rounded-[12px] border border-ember/15 bg-ember/[0.04] px-3 py-2.5">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ember" />
            <p className="text-[10.5px] leading-5 text-mist">
              التريك: في خطوة n استخدم الفرض على <span className="font-mono text-ember">n-1</span> و
              <span className="font-mono text-ember"> n-2</span>، وبعدها كبّر الحد الأصغر لـ
              <span className="font-mono text-ember"> 2^(n-1)</span> عشان توصل لـ 2^n.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="flex flex-1 items-center gap-3 text-[11px] text-mist">
              <span className="shrink-0 font-mono text-[10px] text-dim">n</span>
              <input
                type="range"
                min={1}
                max={10}
                value={n}
                onChange={(event) => setN(Number(event.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#E7A24B]"
                aria-label="اختر قيمة n"
              />
              <span className="tabular w-6 text-center font-mono text-ember">{n}</span>
            </label>
            <span className="font-mono text-[10px] text-dim">Σ i · Σ 2^i</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[13px] border border-white/[0.06] bg-black/20 p-3.5">
              <div className="text-[10.5px] text-dim">Arithmetic series</div>
              <div className="tabular mt-1 font-mono text-[20px] font-semibold text-chalk">
                {arithmetic}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-ember transition-[width] duration-300"
                  style={{ width: `${(arithmetic / max) * 100}%` }}
                />
              </div>
              <div className="mt-2 font-mono text-[10px] text-dim">
                ∑<sub>i=1..{n}</sub> i = {n}({n}+1)/2
              </div>
            </div>
            <div className="rounded-[13px] border border-white/[0.06] bg-black/20 p-3.5">
              <div className="text-[10.5px] text-dim">Geometric series</div>
              <div className="tabular mt-1 font-mono text-[20px] font-semibold text-jade">
                {geometric}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full bg-jade transition-[width] duration-300"
                  style={{ width: `${(geometric / max) * 100}%` }}
                />
              </div>
              <div className="mt-2 font-mono text-[10px] text-dim">
                ∑<sub>i=1..{n}</sub> 2<sup>i</sup> = 2(2<sup>{n}</sup> − 1)
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10.5px] leading-5 text-dim">
            جرّب n كبيرة: المتسلسلة الهندسية بتضاعف القيمة كل خطوة، بينما الحسابية بتزيد خطياً.
          </p>
        </div>
      )}
    </BenchShell>
  );
}
