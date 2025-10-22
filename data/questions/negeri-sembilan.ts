import type { Question } from '@/types';

/**
 * Negeri Sembilan Questions - From Figma Screen 10
 */
export const negeriSembilanQuestions: Question[] = [
  {
    id: 'ns_1',
    state: 'negeri-sembilan',
    type: 'trueFalse',
    question: 'Tempoh perkhidmatan YDP Agong adalah selama 3 tahun?',
    correctAnswer: false,
    explanation:
      'Tempoh perkhidmatan Yang di-Pertuan Agong adalah 5 tahun, bukan 3 tahun.',
  },
  {
    id: 'ns_2',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Apakah sistem pemerintahan tradisional Negeri Sembilan?',
    options: ['Kesultanan', 'Adat Perpatih', 'Raja Berperlembagaan', 'Feudal'],
    correctAnswer: 'Adat Perpatih',
    explanation: 'Negeri Sembilan terkenal dengan sistem Adat Perpatih yang matrilineal.',
  },
];
