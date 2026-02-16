import type { SyncState } from '../types';

interface StatusBarProps {
  totalWorked: number;
  target: number;
  plannedPerDay: number;
  remainingDays: number;
  goalReached: boolean;
  allFutureSkipped: boolean;
  syncState: SyncState;
}

export function StatusBar({
  totalWorked,
  target,
  plannedPerDay,
  remainingDays,
  goalReached,
  allFutureSkipped,
  syncState,
}: StatusBarProps) {
  const remaining = Math.max(0, target - totalWorked);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-gray-500">Worked:</span>{' '}
          <span className="font-semibold">{totalWorked.toFixed(1)}h</span>
        </div>
        <div>
          <span className="text-gray-500">Remaining:</span>{' '}
          <span className="font-semibold">{remaining.toFixed(1)}h</span>
        </div>
        <div>
          <span className="text-gray-500">Days left:</span>{' '}
          <span className="font-semibold">{remainingDays}</span>
        </div>
        <div>
          <span className="text-gray-500">Per day:</span>{' '}
          <span className="font-semibold">{plannedPerDay.toFixed(1)}h</span>
        </div>
      </div>

      {goalReached && (
        <div className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm font-medium">
          Goal reached! You've logged {totalWorked.toFixed(1)}h of your {target}h target.
        </div>
      )}

      {allFutureSkipped && !goalReached && (
        <div className="px-3 py-2 bg-amber-100 text-amber-700 rounded text-sm font-medium">
          All remaining days are skipped. Unskip some days to plan your hours.
        </div>
      )}

      {syncState.error && (
        <div className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm">
          Sync error: {syncState.error}
          {syncState.lastSynced === null && ' (showing cached data)'}
        </div>
      )}

      {syncState.lastSynced && (
        <div className="text-xs text-gray-400">
          Last synced: {syncState.lastSynced.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
