import { MalaysianState } from '@/types/game';

/**
 * State-level timer configuration (in seconds)
 * Based on specification document v2:
 * - Perak, WP KL, Selangor: 10 minutes (600 seconds)
 * - Negeri Sembilan, Melaka: 5 minutes (300 seconds)
 * - All others: No timer (null)
 */
export const STATE_TIMERS: Record<MalaysianState, number | null> = {
  'perlis': null,
  'kedah': null,
  'pulau-pinang': null,
  'perak': 600,  // 10 minutes
  'kuala-lumpur': 600,  // 10 minutes
  'selangor': 600,  // 10 minutes
  'negeri-sembilan': 300,  // 5 minutes
  'melaka': 300,  // 5 minutes
  'johor': null,  // Crossword only, no timer
  'pahang': null,
  'terengganu': null,
  'kelantan': null,
  'sabah': null,
  'sarawak': null,
};

/**
 * Get timer duration for a specific state
 * @param state - Malaysian state
 * @returns Timer duration in seconds, or null if no timer
 */
export function getStateTimer(state: MalaysianState): number | null {
  return STATE_TIMERS[state];
}

/**
 * Check if a state has a timer
 * @param state - Malaysian state
 * @returns true if state has a timer, false otherwise
 */
export function hasStateTimer(state: MalaysianState): boolean {
  return STATE_TIMERS[state] !== null;
}

/**
 * Format time in MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "05:30")
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get color for timer display based on percentage remaining
 * @param timeRemaining - Remaining time in seconds
 * @param totalTime - Total timer duration in seconds
 * @returns Color string for timer display
 */
export function getTimerColor(timeRemaining: number, totalTime: number): string {
  const percentageRemaining = (timeRemaining / totalTime) * 100;

  if (percentageRemaining > 50) {
    return '#4CAF50';  // Green
  } else if (percentageRemaining > 25) {
    return '#FFC107';  // Yellow/Amber
  } else {
    return '#F44336';  // Red
  }
}
