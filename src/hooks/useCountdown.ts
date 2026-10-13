import { useEffect, useState } from 'react';

/**
 * Milliseconds left until `target` (ISO string), ticking every second. 0 once the target has
 * passed, null when there is no valid target.
 */
export const useCountdown = (target?: string | null) => {
  const targetMs = target ? Date.parse(target) : NaN;
  const getRemaining = () => (Number.isNaN(targetMs) ? null : Math.max(0, targetMs - Date.now()));
  const [remaining, setRemaining] = useState<number | null>(getRemaining);

  useEffect(() => {
    setRemaining(getRemaining());
    if (Number.isNaN(targetMs)) return;

    const interval = setInterval(() => {
      const next = getRemaining();
      setRemaining(next);
      if (next === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs]);

  return remaining;
};

// 90061000 -> "1 hari 01:01:01", 3661000 -> "01:01:01"
export const formatCountdown = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const pad = (n: number) => String(n).padStart(2, '0');
  const hms = `${pad(Math.floor((totalSeconds % 86400) / 3600))}:${pad(
    Math.floor((totalSeconds % 3600) / 60),
  )}:${pad(totalSeconds % 60)}`;
  return days > 0 ? `${days} hari ${hms}` : hms;
};
