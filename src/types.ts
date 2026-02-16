export interface DayData {
  date: number; // day of month (1-31)
  workedHours: number; // hours from Google Sheet
  plannedHours: number; // calculated hours needed
  isPast: boolean; // true if before today
  isToday: boolean;
  isSkipped: boolean;
}

export interface SheetRow {
  date: string; // MM/DD/YY from column B
  hours: number; // decimal from column H
}

export interface WorkedHoursMap {
  [day: number]: number; // day of month -> total hours
}

export interface SkipStates {
  month: string; // YYYY-MM key for auto-reset
  days: { [day: number]: boolean };
}

export interface SyncState {
  loading: boolean;
  error: string | null;
  lastSynced: Date | null;
}
