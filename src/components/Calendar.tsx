import type { DayData } from '../types';
import { getFirstDayOfWeek } from '../utils/calendar';
import { DayCell } from './DayCell';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarProps {
  days: DayData[];
  onToggleSkip: (day: number) => void;
}

export function Calendar({ days, onToggleSkip }: CalendarProps) {
  const firstDayOffset = getFirstDayOfWeek();

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => (
          <DayCell key={day.date} day={day} onToggleSkip={onToggleSkip} />
        ))}
      </div>
    </div>
  );
}
