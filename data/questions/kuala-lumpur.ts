import type { Question } from '@/types';

/**
 * Kuala Lumpur Questions - Malaysian History Educational Content
 * Focus: KL as capital city, landmarks, and Wilayah Persekutuan
 */
export const kualaLumpurQuestions: Question[] = [
  {
    id: 'kl_1',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Kuala Lumpur adalah ibu negara Malaysia?',
    options: ['Betul', 'Salah', 'Kadang-kadang', 'Tidak pasti'],
    correctAnswer: 'Betul',
    explanation: 'Kuala Lumpur adalah ibu negara Malaysia.',
  },
  {
    id: 'kl_2',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Bangunan kembar tertinggi di Malaysia?',
    options: ['KLCC Tower', 'Menara KL', 'Petronas Twin Towers', 'Merdeka 118'],
    correctAnswer: 'Petronas Twin Towers',
    explanation: 'Petronas Twin Towers adalah bangunan kembar tertinggi di Malaysia.',
  },
  {
    id: 'kl_3',
    state: 'kuala-lumpur',
    type: 'trueFalse',
    question: 'Kuala Lumpur adalah Wilayah Persekutuan?',
    correctAnswer: true,
    explanation: 'Kuala Lumpur adalah Wilayah Persekutuan bersama Putrajaya dan Labuan.',
  },
  {
    id: 'kl_4',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Gua terkenal di Kuala Lumpur?',
    options: ['Gua Kelam', 'Gua Tempurung', 'Batu Caves', 'Gua Niah'],
    correctAnswer: 'Batu Caves',
    explanation: 'Batu Caves adalah gua terkenal di Kuala Lumpur dengan patung Lord Murugan.',
  },
  {
    id: 'kl_5',
    state: 'kuala-lumpur',
    type: 'fillBlank',
    question: 'Sungai yang memberikan nama kepada Kuala Lumpur: S_NG_I KL_NG',
    correctAnswer: 'SUNGAI KLANG',
    acceptableAnswers: ['sungai klang', 'Sungai Klang'],
    caseSensitive: false,
    explanation: 'Sungai Klang adalah sungai yang memberikan nama kepada Kuala Lumpur (Kuala = pertemuan, Lumpur = berlumpur).',
  },
];
