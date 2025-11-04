/**
 * Local storage utilities for persisting team authentication
 * across page refreshes without requiring re-authentication
 */

const STORAGE_KEY = 'escape_room_team_session';

export interface StoredTeamSession {
  teamId: string;
  teamName: string;
  authenticatedAt: number; // timestamp
}

/**
 * Save authenticated team session to localStorage
 */
export const saveTeamSession = (teamId: string, teamName: string): void => {
  if (typeof window === 'undefined') return;

  const session: StoredTeamSession = {
    teamId,
    teamName,
    authenticatedAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save team session:', error);
  }
};

/**
 * Retrieve stored team session from localStorage
 */
export const getStoredTeamSession = (): StoredTeamSession | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session: StoredTeamSession = JSON.parse(stored);

    // Session is valid for 24 hours
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const age = Date.now() - session.authenticatedAt;

    if (age > maxAge) {
      // Session expired, clear it
      clearTeamSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Failed to retrieve team session:', error);
    return null;
  }
};

/**
 * Clear stored team session from localStorage
 */
export const clearTeamSession = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear team session:', error);
  }
};

/**
 * Check if there's an active team session
 */
export const hasActiveSession = (): boolean => {
  return getStoredTeamSession() !== null;
};
