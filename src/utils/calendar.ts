export function getCurrentMonthDays(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

export function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getSheetTabName(): string {
  const now = new Date();
  const monthShort = now.toLocaleString('en-US', { month: 'short' });
  return `${monthShort} ${now.getFullYear()}`;
}

export function getSheetTabNameLong(): string {
  const now = new Date();
  const monthLong = now.toLocaleString('en-US', { month: 'long' });
  return `${monthLong} ${now.getFullYear()}`;
}

export function getFirstDayOfWeek(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).getDay();
}

export function getToday(): number {
  return new Date().getDate();
}

export function isDayPast(day: number): boolean {
  // Today counts as future (shows planned hours)
  return day < new Date().getDate();
}

export function isDayToday(day: number): boolean {
  return day === new Date().getDate();
}
