/** Format ISO date string to UK display e.g. "2024-03-15" → "15 March 2024" */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Format ISO date to short UK format e.g. "15/03/2024" */
export function formatDateShort(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-GB');
}

/** Get today's date as ISO string e.g. "2024-03-15" */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Add days to ISO date string */
export function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/** Check if an ISO date is in the past */
export function isOverdue(isoDate: string): boolean {
  return isoDate < todayISO();
}

/** Get first day of current month as ISO */
export function firstDayOfMonth(): string {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().split('T')[0];
}
