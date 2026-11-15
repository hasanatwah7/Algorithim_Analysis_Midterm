import { useCallback, useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  seconds: number;
  active: boolean;
  resetKey: string | number;
  onExpire?: () => void;
}

export interface Countdown {
  remaining: number;
  running: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useCountdown({
  seconds,
  active,
  resetKey,
  onExpire,
}: UseCountdownOptions): Countdown {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(active);
  const expireRef = useRef(onExpire);
  const firedRef = useRef(false);

  useEffect(() => {
    expireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setRemaining(seconds);
    setRunning(active);
    firedRef.current = false;
  }, [seconds, active, resetKey]);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  // Fire the expiry callback after the countdown renders at zero, never inside a
  // state updater (that would update another component while rendering).
  useEffect(() => {
    if (!running || remaining > 0) return;
    setRunning(false);
    if (firedRef.current) return;
    firedRef.current = true;
    expireRef.current?.();
  }, [running, remaining]);

  const start = useCallback(() => {
    if (remaining <= 0) {
      setRemaining(seconds);
      firedRef.current = false;
    }
    setRunning(true);
  }, [seconds, remaining]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRemaining(seconds);
    setRunning(active);
    firedRef.current = false;
  }, [seconds, active]);

  return { remaining, running, start, pause, reset };
}
