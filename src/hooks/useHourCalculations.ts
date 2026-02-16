import { useMemo } from 'react';
import type { DayData, WorkedHoursMap } from '../types';
import { getCurrentMonthDays, isDayPast, isDayToday } from '../utils/calendar';
import { calculateTotalWorked, getFutureDays, calculatePlannedHoursPerDay } from '../utils/calculations';

interface HourCalculations {
  days: DayData[];
  totalWorked: number;
  totalPlanned: number;
  plannedPerDay: number;
  goalReached: boolean;
  allFutureSkipped: boolean;
  remainingDays: number;
}

export function useHourCalculations(
  workedHours: WorkedHoursMap,
  target: number,
  skippedDays: { [day: number]: boolean }
): HourCalculations {
  return useMemo(() => {
    const totalDays = getCurrentMonthDays();
    const futureDays = getFutureDays();
    const totalWorked = calculateTotalWorked(workedHours);
    const goalReached = totalWorked >= target;

    const unskippedFutureDays = futureDays.filter((d) => !skippedDays[d]);
    const allFutureSkipped = futureDays.length > 0 && unskippedFutureDays.length === 0;

    const plannedPerDay = calculatePlannedHoursPerDay(
      target,
      totalWorked,
      futureDays,
      skippedDays
    );

    const days: DayData[] = [];
    for (let d = 1; d <= totalDays; d++) {
      const past = isDayPast(d);
      const today = isDayToday(d);
      const isSkipped = !!skippedDays[d];
      const isFuture = !past; // today counts as future

      days.push({
        date: d,
        workedHours: workedHours[d] || 0,
        plannedHours: isFuture && !isSkipped ? plannedPerDay : 0,
        isPast: past,
        isToday: today,
        isSkipped,
      });
    }

    const totalPlanned = unskippedFutureDays.length * plannedPerDay;

    return {
      days,
      totalWorked,
      totalPlanned,
      plannedPerDay,
      goalReached,
      allFutureSkipped,
      remainingDays: unskippedFutureDays.length,
    };
  }, [workedHours, target, skippedDays]);
}
