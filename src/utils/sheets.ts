import type { WorkedHoursMap } from '../types';
import { getSheetTabName, getCurrentMonthYear } from './calendar';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let accessToken: string | null = null;

export function initGoogleAuth(): Promise<void> {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      reject(new Error('VITE_GOOGLE_CLIENT_ID not set in .env'));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: () => {}, // overridden at request time
      });
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

export function requestAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      reject(new Error('Google auth not initialized'));
      return;
    }

    tokenClient.callback = (response: google.accounts.oauth2.TokenResponse) => {
      if (response.error) {
        reject(new Error(response.error));
        return;
      }
      accessToken = response.access_token;
      resolve(response.access_token);
    };

    if (accessToken) {
      // Try to use existing token
      resolve(accessToken);
    } else {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    }
  });
}

export async function fetchSheetData(): Promise<WorkedHoursMap> {
  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error('VITE_GOOGLE_SHEET_ID not set in .env');

  const token = accessToken || (await requestAccessToken());
  const tabName = getSheetTabName();
  const range = `'${tabName}'!B6:H`;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    // Token expired, request new one
    accessToken = null;
    const newToken = await requestAccessToken();
    const retryRes = await fetch(url, {
      headers: { Authorization: `Bearer ${newToken}` },
    });
    if (!retryRes.ok) throw new Error(`Sheet API error: ${retryRes.status}`);
    return parseSheetResponse(await retryRes.json());
  }

  if (!res.ok) throw new Error(`Sheet API error: ${res.status}`);
  return parseSheetResponse(await res.json());
}

function parseSheetResponse(data: { values?: string[][] }): WorkedHoursMap {
  const worked: WorkedHoursMap = {};
  const { month, year } = getCurrentMonthYear();

  if (!data.values) return worked;

  for (const row of data.values) {
    // Column B is index 0 (date), Column H is index 6 (hours)
    const dateStr = row[0];
    const hoursStr = row[6];

    if (!dateStr || !hoursStr) continue;

    const parsed = parseDate(dateStr);
    if (!parsed) continue;

    // Only include dates from the current month
    if (parsed.month !== month || parsed.year !== year) continue;

    const hours = parseFloat(hoursStr);
    if (isNaN(hours)) continue;

    worked[parsed.day] = (worked[parsed.day] || 0) + hours;
  }

  return worked;
}

function parseDate(dateStr: string): { month: number; day: number; year: number } | null {
  // Expected format: MM/DD/YY
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const month = parseInt(parts[0], 10) - 1; // 0-indexed
  const day = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);

  // Handle 2-digit year
  if (year < 100) year += 2000;

  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  return { month, day, year };
}
