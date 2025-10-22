import type { Question } from '@/types';

/**
 * Perak Questions - Malaysian History Educational Content
 * Focus: Malaysian Heroes and Resistance Against Colonialism
 * Time limit: 10 minutes (600 seconds)
 */
export const perakQuestions: Question[] = [
  {
    id: 'perak_1',
    state: 'perak',
    type: 'fillBlank',
    question: 'Tokoh yang mempertahankan kedaulatan Naning, siapakah dia: D_L S_I_',
    correctAnswer: 'DOL SAID',
    acceptableAnswers: ['dol said', 'Dol Said'],
    caseSensitive: false,
    explanation: 'Dol Said adalah tokoh yang mempertahankan kedaulatan Naning menentang British.',
  },
  {
    id: 'perak_2',
    state: 'perak',
    type: 'fillBlank',
    question: 'Menentang James Brooke yang menganggap orang Iban sebagai lanun: RE_T_P',
    correctAnswer: 'RENTAP',
    acceptableAnswers: ['rentap', 'Rentap'],
    caseSensitive: false,
    explanation: 'Rentap menentang James Brooke yang menganggap orang Iban sebagai lanun.',
  },
  {
    id: 'perak_3',
    state: 'perak',
    type: 'fillBlank',
    question: 'Sharif Masahor menentang James Brooke di wilayah: S_R_K_I',
    correctAnswer: 'SARIKEI',
    acceptableAnswers: ['sarikei', 'Sarikei'],
    caseSensitive: false,
    explanation: 'Sharif Masahor menentang James Brooke di wilayah Sarikei, Sarawak.',
  },
  {
    id: 'perak_4',
    state: 'perak',
    type: 'multipleChoice',
    question: 'Dato Maharaja Lela menentang British di negeri:',
    options: ['Kuala Lumpur', 'Kelantan', 'Perak', 'Johor'],
    correctAnswer: 'Perak',
    explanation: 'Dato Maharaja Lela adalah pahlawan yang menentang British di negeri Perak.',
  },
  {
    id: 'perak_5',
    state: 'perak',
    type: 'multipleChoice',
    question: 'Terpaksa berundur ke Bukit Putus sebelum berjaya mendapatkan rundingan damai. Siapakah saya?',
    options: ['Yamtuan Antah', 'Mat Kilau', 'Tok Janggut', 'Dol Said'],
    correctAnswer: 'Yamtuan Antah',
    explanation: 'Yamtuan Antah terpaksa berundur ke Bukit Putus sebelum berjaya mendapatkan rundingan damai dengan British.',
  },
];
