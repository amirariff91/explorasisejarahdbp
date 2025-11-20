/**
 * Map Layout Constants
 * Geographic layout and display names for Malaysian states
 * Centralized to prevent recreation on every render
 */

import type { MalaysianState } from '@/types';

// State display names
export const stateDisplayNames: Record<MalaysianState, string> = {
  'perlis': 'Perlis',
  'kedah': 'Kedah',
  'pulau-pinang': 'Pulau Pinang',
  'perak': 'Perak',
  'selangor': 'Selangor',
  'kuala-lumpur': 'Kuala Lumpur',
  'negeri-sembilan': 'Negeri Sembilan',
  'melaka': 'Melaka',
  'johor': 'Johor',
  'pahang': 'Pahang',
  'terengganu': 'Terengganu',
  'kelantan': 'Kelantan',
  'sabah': 'Sabah',
  'sarawak': 'Sarawak',
} as const;

// Geographic layout - Peninsula states positioned roughly by geography
export const peninsulaLayout: (MalaysianState | null)[][] = [
  // Row 1 - North
  ['perlis', 'kedah', 'kelantan', 'terengganu'],
  // Row 2 - North-Central
  ['pulau-pinang', 'perak', 'pahang', null],
  // Row 3 - Central
  ['selangor', 'kuala-lumpur', null, null],
  // Row 4 - Central-South
  ['negeri-sembilan', null, null, null],
  // Row 5 - South
  ['melaka', 'johor', null, null],
] as const;

// Borneo states
export const borneoStates: MalaysianState[] = ['sabah', 'sarawak'] as const;

/**
 * Get all Malaysian states sorted alphabetically by display name
 * @returns Array of all 14 states sorted A-Z
 */
export const getSortedStates = (): MalaysianState[] => {
  const allStates = Object.keys(stateDisplayNames) as MalaysianState[];
  return allStates.sort((a, b) => {
    const nameA = stateDisplayNames[a].toUpperCase();
    const nameB = stateDisplayNames[b].toUpperCase();
    return nameA.localeCompare(nameB);
  });
};
