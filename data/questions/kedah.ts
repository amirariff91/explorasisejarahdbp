import type { Question } from '@/types';

/**
 * Kedah Questions - From Figma Screen 8
 */
export const kedahQuestions: Question[] = [
  {
    id: 'kedah_1',
    state: 'kedah',
    type: 'multipleChoice',
    question: 'Siapakah Bendahara Melaka yang pertahankan serangan Siam?',
    options: ['Tun Teja', 'Tun Perak', 'Puteri Gunung Ledang', 'Hang Nadim'],
    correctAnswer: 'Tun Perak',
    explanation:
      'Tun Perak adalah Bendahara Melaka yang terkenal dan berjaya mempertahankan Melaka dari serangan Siam.',
  },
  {
    id: 'kedah_2',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Tokoh yang mempertahankan kedaulatan Naning. Siapakah dia?',
    correctAnswer: 'Dol Said',
    acceptableAnswers: ['Dato Dol Said', 'Dato\' Dol Said'],
    caseSensitive: false,
    explanation: 'Dol Said adalah pahlawan Naning yang menentang British.',
  },
];
