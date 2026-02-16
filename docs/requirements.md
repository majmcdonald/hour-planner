# Hour Planner — Product Requirements

## Overview

A React web app that helps track working hours against a monthly target. It pulls actual hours from a Google Sheet, shows them on a calendar, and calculates how many hours per day are needed to hit the target for the remaining days in the month.

## Requirements

| # | Requirement |
|---|-------------|
| 1 | Calendar view showing all days of the current month |
| 2 | Pull hours worked from Google Sheets (tab per month, e.g. "Feb 2026") |
| 3 | Sync button to refresh data from the sheet |
| 4 | Target Hours input, persisted in localStorage across sessions |
| 5 | Calculate hours/day needed: `(target - totalWorked) / remainingUnskippedDays` |
| 6 | Each day shows worked hours (past) OR planned hours (future, including today) |
| 7 | Skip button on each future/planned day (toggle on/off) |
| 8 | Skipped days plan 0 hours; recalculate excluding skipped days |
| 9 | Skip states persisted in localStorage; auto-reset on new month |
| 10 | Auto-sync with Google Sheet on app start |
| 11 | Current month only — no month navigation |

## Google Sheet Structure

- **Tab naming:** `"Feb 2026"` (short month + space + year)
- **Rows 1–4:** Sheet metadata (ignore)
- **Row 5:** Column headers
- **Row 6+:** Data rows
- **Column B:** Date (`MM/DD/YY`)
- **Column H:** Hours worked (decimal)
- **Multiple rows per day** — sum Column H values for the same date

## Key Design Decisions

- **Today = future day** — today shows planned hours, not worked hours
- **All calendar days count** — no auto-skipping weekends; user skips manually
- **Month rollover** — target hours are preserved; skip states reset
- **Edge cases:**
  - Target met/exceeded → show 0 planned hours per day (+ "goal reached" indicator)
  - All remaining days skipped → show warning, no division by zero
  - Sync failure → show cached data with error message
  - No sheet data for a past day → show 0 hours

## Tech Stack

- React + Vite (TypeScript)
- Google Sheets API v4 (read-only via OAuth 2.0)
- localStorage for persistence (target hours, skip states, cached sheet data)
- Tailwind CSS v4 for styling

## Authentication

Google OAuth 2.0 with the `spreadsheets.readonly` scope. The user signs in with their Google account to grant access to their private sheet. Tokens are managed in-memory; re-auth is prompted when tokens expire.

## Data Flow

1. App mounts → Google Identity Services library loads → OAuth client initializes
2. Auto-sync triggers → fetches the current month's tab from the Google Sheet
3. Sheet rows are parsed: Column B (date) and Column H (hours) are extracted from row 6 onward
4. Hours are summed per date and stored as a `WorkedHoursMap`
5. The planning calculation runs: `(target - totalWorked) / unskippedFutureDays`
6. Each calendar day displays either worked hours (past) or planned hours (future)
7. Skip toggles and target changes trigger recalculation
8. All state (target, skips, cached sheet data) is persisted to localStorage
