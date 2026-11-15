import * as Popover from "@radix-ui/react-popover";
import { Pause, Play, RotateCcw, Settings2, Timer } from "lucide-react";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { formatClock } from "@/lib/format";
import type { TimerMode, TimerPreset } from "@/lib/progress";

export const timerPresets: TimerPreset[] = [30, 45, 60, 90];

export function TimerControls({
  mode,
  preset,
  remaining,
  running,
  onModeChange,
  onPresetChange,
  onStart,
  onPause,
  onReset,
  compact = false,
}: {
  mode: TimerMode;
  preset: TimerPreset;
  remaining: number;
  running: boolean;
  onModeChange: (mode: TimerMode) => void;
  onPresetChange: (preset: TimerPreset) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  compact?: boolean;
}) {
  const off = mode === "off";

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex items-center gap-2 rounded-[10px] border px-2.5 py-1.5 ${
          off
            ? "border-white/[0.07] bg-white/[0.02]"
            : remaining <= 10
              ? "border-clay/30 bg-clay/[0.07]"
              : "border-ember/25 bg-ember/[0.06]"
        }`}
      >
        <Timer size={14} className={off ? "text-dim" : "text-ember"} />
        <span
          className={`tabular font-mono text-[12px] ${
            off ? "text-dim" : remaining <= 10 ? "text-clay" : "text-ember-soft"
          }`}
        >
          {off ? "--:--" : formatClock(remaining)}
        </span>
        {!off ? (
          <>
            <button
              type="button"
              onClick={running ? onPause : onStart}
              className="grid h-7 w-7 place-items-center rounded-md text-mist transition-colors hover:bg-white/[0.07] hover:text-chalk"
              aria-label={running ? "Pause timer" : "Start timer"}
            >
              {running ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="grid h-7 w-7 place-items-center rounded-md text-dim transition-colors hover:bg-white/[0.07] hover:text-chalk"
              aria-label="Reset timer"
            >
              <RotateCcw size={13} />
            </button>
          </>
        ) : null}
      </div>

      <Popover.Root>
        <Popover.Trigger asChild>
          <Button
            variant="quiet"
            size={compact ? "icon" : "sm"}
            className={compact ? "h-9 w-9" : "gap-1.5"}
            aria-label="Timer settings"
          >
            <Settings2 size={14} />
            {!compact ? <span className="text-[11.5px]">Timer</span> : null}
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            sideOffset={8}
            align="end"
            className="pop-in glass-strong z-[70] w-[290px] rounded-[16px] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[12px] font-semibold text-chalk">Timer settings</div>
              <span className="text-[10px] text-dim">Off / Question</span>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-1.5">
              {(
                [
                  ["off", "Off"],
                  ["question", "Per question"],
                ] as const
              ).map(([value, label]) => (
                <Chip
                  key={value}
                  active={mode === value}
                  tone="ember"
                  onClick={() => onModeChange(value)}
                  className="justify-center"
                >
                  {label}
                </Chip>
              ))}
            </div>
            <div className="mb-2 text-[10.5px] font-medium text-dim">Question duration</div>
            <div className="grid grid-cols-4 gap-1.5">
              {timerPresets.map((value) => (
                <Chip
                  key={value}
                  active={preset === value}
                  tone="ember"
                  onClick={() => onPresetChange(value)}
                  className="justify-center font-mono"
                >
                  {value}s
                </Chip>
              ))}
            </div>
            <p className="mt-3 text-[10.5px] leading-5 text-dim">
              If time runs out on an unanswered question, it's logged wrong and the
              explanation opens automatically.
            </p>
            <Popover.Arrow className="fill-white/10" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
