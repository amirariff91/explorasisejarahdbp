import type { Question } from '@/types';

/**
 * Perlis Questions - From Figma Screen 6
 */
export const perlisQuestions: Question[] = [
  {
    id: 'perlis_1',
    state: 'perlis',
    type: 'multipleChoice',
    question: 'Siapakah pengasas negeri Melaka?',
    options: ['Hang Tuah', 'Parameswara', 'Tunku Abdul Rahman', 'Hang Nadim'],
    correctAnswer: 'Parameswara',
    explanation: 'Parameswara adalah pengasas Kesultanan Melaka pada tahun 1400.',
  },
  {
    id: 'perlis_2',
    state: 'perlis',
    type: 'trueFalse',
    question: 'Perlis adalah negeri terkecil di Malaysia?',
    correctAnswer: true,
    explanation: 'Perlis adalah negeri terkecil di Malaysia dengan keluasan 821 km persegi.',
  },
];
