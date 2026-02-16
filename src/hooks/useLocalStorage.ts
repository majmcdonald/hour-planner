import { useState, useCallback } from 'react';
import type { SkipStates } from '../types';
import { getMonthKey } from '../utils/calendar';

export function useTargetHours(): [number, (value: number) => void] {
  const [target, setTargetState] = useState<number>(() => {
    const stored = localStorage.getItem('targetHours');
    return stored ? parseFloat(stored) : 160;
  });

  const setTarget = useCallback((value: number) => {
    setTargetState(value);
    localStorage.setItem('targetHours', String(value));
  }, []);

  return [target, setTarget];
}

export function useSkipStates(): [
  { [day: number]: boolean },
  (day: number) => void,
] {
  const monthKey = getMonthKey();

  const [skipStates, setSkipStates] = useState<SkipStates>(() => {
    const stored = localStorage.getItem('skipStates');
    if (stored) {
      const parsed: SkipStates = JSON.parse(stored);
      // Auto-reset if month changed
      if (parsed.month !== monthKey) {
        const fresh: SkipStates = { month: monthKey, days: {} };
        localStorage.setItem('skipStates', JSON.stringify(fresh));
        return fresh;
      }
      return parsed;
    }
    return { month: monthKey, days: {} };
  });

  const toggleSkip = useCallback(
    (day: number) => {
      setSkipStates((prev) => {
        const next: SkipStates = {
          month: monthKey,
          days: { ...prev.days, [day]: !prev.days[day] },
        };
        if (!next.days[day]) delete next.days[day];
        localStorage.setItem('skipStates', JSON.stringify(next));
        return next;
      });
    },
    [monthKey]
  );

  return [skipStates.days, toggleSkip];
}

export function useCachedSheetData() {
  const cacheKey = `sheetCache_${getMonthKey()}`;

  const getCached = useCallback((): { [day: number]: number } | null => {
    const stored = localStorage.getItem(cacheKey);
    return stored ? JSON.parse(stored) : null;
  }, [cacheKey]);

  const setCached = useCallback(
    (data: { [day: number]: number }) => {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    },
    [cacheKey]
  );

  return { getCached, setCached };
}
