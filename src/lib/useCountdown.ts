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
    if (remaining <= 0) return;
    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          if (!firedRef.current) {
            firedRef.current = true;
            setRunning(false);
            expireRef.current?.();
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, remaining <= 0]);

  const start = useCallback(() => {
    setRemaining((current) => (current <= 0 ? seconds : current));
    setRunning(true);
  }, [seconds]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRemaining(seconds);
    setRunning(active);
    firedRef.current = false;
  }, [seconds, active]);

  return { remaining, running, start, pause, reset };
}
