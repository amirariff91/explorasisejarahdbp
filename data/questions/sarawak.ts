import type { Question } from '@/types';

/**
 * Sarawak Questions - Malaysian History Educational Content
 * Focus: Sarawak History and Culture
 * Note: Using sample questions as content document does not contain Sarawak-specific content
 */
export const sarawakQuestions: Question[] = [
  {
    id: 'sarawak-1',
    state: 'sarawak',
    type: 'multipleChoice',
    question: 'Bilakah Sarawak menyertai pembentukan Malaysia?',
    options: ['31 Ogos 1957', '16 September 1963', '1 Januari 1965', '31 Ogos 1963'],
    correctAnswer: '16 September 1963',
    explanation: 'Sarawak menyertai pembentukan Malaysia pada 16 September 1963 bersama-sama dengan Sabah dan Singapura.',
  },
  {
    id: 'sarawak-2',
    state: 'sarawak',
    type: 'trueFalse',
    question: 'Sarawak terletak di Pulau Borneo?',
    correctAnswer: true,
    explanation: 'Sarawak terletak di bahagian barat laut Pulau Borneo.',
  },
  {
    id: 'sarawak-3',
    state: 'sarawak',
    type: 'fillBlank',
    question: 'Ibu negeri Sarawak ialah: K_CH_NG',
    correctAnswer: 'KUCHING',
    acceptableAnswers: ['kuching', 'Kuching'],
    caseSensitive: false,
    explanation: 'Kuching adalah ibu negeri Sarawak.',
  },
];
