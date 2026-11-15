type SoundName = "correct" | "wrong" | "flip" | "tick" | "finish";

let audioContext: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioContext = new Ctor();
  }
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
): void {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playSound(name: SoundName, enabled = true): void {
  if (!enabled) return;
  const ctx = context();
  if (!ctx) return;
  const now = ctx.currentTime;
  switch (name) {
    case "correct":
      tone(ctx, 523.25, now, 0.12, 0.035);
      tone(ctx, 783.99, now + 0.09, 0.2, 0.03);
      break;
    case "wrong":
      tone(ctx, 196, now, 0.18, 0.04, "triangle");
      tone(ctx, 146.83, now + 0.08, 0.24, 0.03, "triangle");
      break;
    case "flip":
      tone(ctx, 392, now, 0.06, 0.018);
      break;
    case "tick":
      tone(ctx, 880, now, 0.035, 0.012);
      break;
    case "finish":
      tone(ctx, 523.25, now, 0.12, 0.03);
      tone(ctx, 659.25, now + 0.1, 0.12, 0.03);
      tone(ctx, 783.99, now + 0.2, 0.28, 0.035);
      break;
  }
}
