/**
 * Map Layout Constants
 * Geographic layout and display names for Malaysian states
 * Centralized to prevent recreation on every render
 */

import type { MalaysianState } from '@/types';

// State display names
export const stateDisplayNames: Record<MalaysianState, string> = {
  'perlis': 'PERLIS',
  'kedah': 'KEDAH',
  'pulau-pinang': 'P. PINANG',
  'perak': 'PERAK',
  'selangor': 'SELANGOR',
  'kuala-lumpur': 'KL',
  'negeri-sembilan': 'N. SEMBILAN',
  'melaka': 'MELAKA',
  'johor': 'JOHOR',
  'pahang': 'PAHANG',
  'terengganu': 'TERENGGANU',
  'kelantan': 'KELANTAN',
  'sabah': 'SABAH',
  'sarawak': 'SARAWAK',
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
