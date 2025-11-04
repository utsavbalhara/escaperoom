import { Timestamp } from 'firebase/firestore';

/**
 * Format seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate time remaining from timer start and duration
 */
export function calculateTimeRemaining(
  timerStarted: Timestamp | null,
  timerDuration: number,
  isPaused: boolean
): number {
  if (!timerStarted) return timerDuration;
  if (isPaused) return timerDuration; // Return full duration when paused (simplified)

  const startTime = timerStarted.toMillis();
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  const remaining = Math.max(0, timerDuration - elapsed);

  return remaining;
}

/**
 * Convert Timestamp to readable date string
 */
export function formatDate(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleString();
}

/**
 * Get current server timestamp
 */
export function getCurrentTimestamp(): Timestamp {
  return Timestamp.now();
}

/**
 * Validate code (accepts both numeric and alphanumeric strings)
 */
export function isValidCode(code: string): boolean {
  return code.trim().length > 0;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if admin password is correct
 */
export function validateAdminPassword(password: string): boolean {
  return password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
}

/**
 * Generate a unique ID for client-side operations
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
