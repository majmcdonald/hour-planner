import { useState } from 'react';
import type { SyncState } from '../types';

interface SyncButtonProps {
  syncState: SyncState;
  onSync: () => void;
  sheetId: string;
  onSheetIdChange: (value: string) => void;
}

export function SyncButton({ syncState, onSync, sheetId, onSheetIdChange }: SyncButtonProps) {
  const [editing, setEditing] = useState(!sheetId);
  const [draft, setDraft] = useState(sheetId);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onSheetIdChange(trimmed);
      setEditing(false);
    }
  };

  if (editing || !sheetId) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Google Sheet ID"
          className="w-64 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSave}
          disabled={!draft.trim()}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Save
        </button>
        {sheetId && (
          <button
            onClick={() => { setDraft(sheetId); setEditing(false); }}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => { setDraft(sheetId); setEditing(true); }}
        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
        title="Change Sheet ID"
      >
        Change Sheet
      </button>
      <button
        onClick={onSync}
        disabled={syncState.loading}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {syncState.loading ? 'Syncing...' : 'Sync'}
      </button>
    </div>
  );
}
