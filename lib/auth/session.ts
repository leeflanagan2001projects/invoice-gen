const SESSION_KEY = 'invoicegen_session';

interface SessionData {
  loggedIn: true;
  email: string;
  loginAt: number;
}

export function setSession(email: string): void {
  if (typeof window === 'undefined') return;
  const data: SessionData = { loggedIn: true, email, loginAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getSession()?.loggedIn === true;
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
