import type { SyncState } from '../types';

interface SyncButtonProps {
  syncState: SyncState;
  onSync: () => void;
}

export function SyncButton({ syncState, onSync }: SyncButtonProps) {
  return (
    <button
      onClick={onSync}
      disabled={syncState.loading}
      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {syncState.loading ? 'Syncing...' : 'Sync'}
    </button>
  );
}
