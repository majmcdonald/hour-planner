import type { WorkedHoursMap } from '../types';
import { getCurrentMonthDays, getToday } from './calendar';

export function calculateTotalWorked(workedHours: WorkedHoursMap): number {
  return Object.values(workedHours).reduce((sum, h) => sum + h, 0);
}

export function getFutureDays(workedHours: WorkedHoursMap): number[] {
  const today = getToday();
  const totalDays = getCurrentMonthDays();
  const todayHasData = (workedHours[today] || 0) > 0;
  const days: number[] = [];
  // Today is future unless it has worked hours
  const startDay = todayHasData ? today + 1 : today;
  for (let d = startDay; d <= totalDays; d++) {
    days.push(d);
  }
  return days;
}

export function calculatePlannedHoursPerDay(
  target: number,
  totalWorked: number,
  futureDays: number[],
  skippedDays: { [day: number]: boolean }
): number {
  const unskippedFutureDays = futureDays.filter((d) => !skippedDays[d]);
  if (unskippedFutureDays.length === 0) return 0;

  const remaining = target - totalWorked;
  if (remaining <= 0) return 0;

  return remaining / unskippedFutureDays.length;
}
