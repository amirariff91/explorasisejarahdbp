import type { Question } from '@/types';

/**
 * Sabah Questions - Malaysian History Educational Content
 * Focus: Sabah History and Culture
 * Note: Content document contains base64 images - image support can be added later
 */
export const sabahQuestions: Question[] = [
  {
    id: 'sabah-1',
    state: 'sabah',
    type: 'multipleChoice',
    question: 'Bilakah Sabah menyertai pembentukan Malaysia?',
    options: ['31 Ogos 1957', '16 September 1963', '1 Januari 1965', '31 Ogos 1963'],
    correctAnswer: '16 September 1963',
    explanation: 'Sabah menyertai pembentukan Malaysia pada 16 September 1963 bersama-sama dengan Sarawak dan Singapura.',
  },
  {
    id: 'sabah-2',
    state: 'sabah',
    type: 'trueFalse',
    question: 'Sabah terletak di Pulau Borneo?',
    correctAnswer: true,
    explanation: 'Sabah terletak di bahagian utara Pulau Borneo.',
  },
  {
    id: 'sabah-3',
    state: 'sabah',
    type: 'fillBlank',
    question: 'Ibu negeri Sabah ialah: K_TA K_NAB_LU',
    correctAnswer: 'KOTA KINABALU',
    acceptableAnswers: ['kota kinabalu', 'Kota Kinabalu'],
    caseSensitive: false,
    explanation: 'Kota Kinabalu adalah ibu negeri Sabah.',
  },
  {
    id: 'sabah-4',
    state: 'sabah',
    type: 'multipleChoice',
    question: 'Gunung tertinggi di Malaysia terletak di Sabah. Apakah namanya?',
    options: ['Gunung Tahan', 'Gunung Kinabalu', 'Gunung Ledang', 'Gunung Jerai'],
    correctAnswer: 'Gunung Kinabalu',
    explanation: 'Gunung Kinabalu adalah gunung tertinggi di Malaysia dengan ketinggian 4,095 meter.',
  },
];
