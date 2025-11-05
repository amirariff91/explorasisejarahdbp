import type { Question } from '@/types';

/**
 * Johor Questions - Quiz route does not include crossword.
 * Crossword for Johor is handled in the dedicated crossword scene.
 */
export const johorQuestions: Question[] = [
  {
    id: 'johor_2',
    state: 'johor',
    type: 'multipleChoice',
    question: 'Apakah nama lama Johor Bahru?',
    options: ['Tanjung Puteri', 'Iskandar Puteri', 'Kota Tinggi', 'Muar'],
    correctAnswer: 'Tanjung Puteri',
    explanation: 'Johor Bahru dahulunya dikenali sebagai Tanjung Puteri.',
  },
];
