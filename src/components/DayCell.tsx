import type { DayData } from '../types';

interface DayCellProps {
  day: DayData;
  onToggleSkip: (day: number) => void;
}

export function DayCell({ day, onToggleSkip }: DayCellProps) {
  const isFuture = !day.isPast;

  return (
    <div
      className={`
        relative rounded-lg border p-2 min-h-[80px] text-sm
        ${day.isToday ? 'border-blue-500 border-2 bg-blue-50' : 'border-gray-200'}
        ${day.isPast ? 'bg-gray-50' : 'bg-white'}
        ${day.isSkipped ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`font-semibold ${day.isToday ? 'text-blue-600' : 'text-gray-700'}`}
        >
          {day.date}
        </span>
        {isFuture && (
          <button
            onClick={() => onToggleSkip(day.date)}
            className={`text-xs px-1.5 py-0.5 rounded cursor-pointer ${
              day.isSkipped
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={day.isSkipped ? 'Unskip day' : 'Skip day'}
          >
            {day.isSkipped ? 'Skipped' : 'Skip'}
          </button>
        )}
      </div>

      <div className="text-center mt-1">
        {day.isPast ? (
          <span className="text-gray-600">
            {day.workedHours > 0 ? `${day.workedHours.toFixed(1)}h` : '0h'}
          </span>
        ) : day.isSkipped ? (
          <span className="text-gray-400 line-through">0h</span>
        ) : (
          <span className="text-blue-600 font-medium">
            {day.plannedHours > 0 ? `${day.plannedHours.toFixed(1)}h` : '0h'}
          </span>
        )}
      </div>
    </div>
  );
}
