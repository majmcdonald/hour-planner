import { useState, useCallback, useEffect, useRef } from 'react';
import type { WorkedHoursMap, SyncState } from '../types';
import { initGoogleAuth, fetchSheetData } from '../utils/sheets';
import { useCachedSheetData } from './useLocalStorage';

export function useGoogleSheets(sheetId: string) {
  const [workedHours, setWorkedHours] = useState<WorkedHoursMap>({});
  const [syncState, setSyncState] = useState<SyncState>({
    loading: false,
    error: null,
    lastSynced: null,
  });
  const [isAuthed, setIsAuthed] = useState(false);
  const authInitialized = useRef(false);
  const { getCached, setCached } = useCachedSheetData();

  // Load cached data on mount
  useEffect(() => {
    const cached = getCached();
    if (cached) setWorkedHours(cached);
  }, [getCached]);

  // Initialize Google Auth on mount
  useEffect(() => {
    if (authInitialized.current) return;
    authInitialized.current = true;

    initGoogleAuth()
      .then(() => setIsAuthed(true))
      .catch((err) => {
        setSyncState((prev) => ({ ...prev, error: err.message }));
      });
  }, []);

  const sync = useCallback(async () => {
    setSyncState({ loading: true, error: null, lastSynced: null });
    try {
      const data = await fetchSheetData(sheetId);
      setWorkedHours(data);
      setCached(data);
      setSyncState({ loading: false, error: null, lastSynced: new Date() });
    } catch (err) {
      const cached = getCached();
      if (cached) setWorkedHours(cached);
      setSyncState({
        loading: false,
        error: err instanceof Error ? err.message : 'Sync failed',
        lastSynced: null,
      });
    }
  }, [sheetId, setCached, getCached]);

  // Auto-sync once auth is ready
  const autoSynced = useRef(false);
  useEffect(() => {
    if (isAuthed && !autoSynced.current) {
      autoSynced.current = true;
      sync();
    }
  }, [isAuthed, sync]);

  return { workedHours, syncState, sync, isAuthed };
}
