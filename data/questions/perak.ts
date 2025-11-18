import type { Question } from '@/types';

/**
 * Perak Questions - Resistance Fighters (Spec-aligned)
 * Topic: Local warriors who resisted colonial powers in Malaysia
 * Focus: Dol Said, Rentap, Sharif Masahor, Dato Maharaja Lela, Yamtuan Antah
 * Question Types: 3 fill-blank, 2 multiple choice
 * Timer: 10 minutes (600 seconds)
 */
export const perakQuestions: Question[] = [
  {
    id: 'perak-1',
    state: 'perak',
    type: 'fillBlank',
    question: 'Tokoh yang mempertahankan kedaulatan Naning: D_L S_I_',
    correctAnswer: 'Dol Said',
    acceptableAnswers: ['Dol Said', 'dol said', 'DOL SAID'],
    caseSensitive: false,
    explanation: 'Dol Said adalah tokoh yang mempertahankan kedaulatan Naning dari campur tangan British pada awal abad ke-19. Beliau menentang British yang cuba menguasai Naning.',
  },
  {
    id: 'perak-2',
    state: 'perak',
    type: 'fillBlank',
    question: 'Menentang James Brooke yang menganggap orang Iban sebagai lanun: RE_T_P',
    correctAnswer: 'Rentap',
    acceptableAnswers: ['Rentap', 'rentap', 'RENTAP'],
    caseSensitive: false,
    explanation: 'Rentap adalah pahlawan Iban yang menentang James Brooke di Sarawak. Beliau dikenali kerana ketegasannya menentang penjajah yang menganggap orang Iban sebagai lanun.',
  },
  {
    id: 'perak-3',
    state: 'perak',
    type: 'fillBlank',
    question: 'Sharif Masahor menentang James Brooke di wilayah: S_R_K_I',
    correctAnswer: 'Sarikei',
    acceptableAnswers: ['Sarikei', 'sarikei', 'SARIKEI'],
    caseSensitive: false,
    explanation: 'Sharif Masahor adalah pemimpin yang menentang James Brooke di wilayah Sarikei, Sarawak. Beliau memimpin perlawanan terhadap penjajahan British.',
  },
  {
    id: 'perak-4',
    state: 'perak',
    type: 'multipleChoice',
    question: 'Dato Maharaja Lela menentang British di negeri:',
    options: ['Kuala Lumpur', 'Kelantan', 'Perak', 'Johor'],
    correctAnswer: 'Perak',
    explanation: 'Dato Maharaja Lela adalah pahlawan Melayu yang menentang British di Perak. Beliau terkenal dalam sejarah kerana perlawanannya terhadap penjajah British di negeri Perak.',
  },
  {
    id: 'perak-5',
    state: 'perak',
    type: 'multipleChoice',
    question: 'Terpaksa berundur ke Bukit Putus sebelum berjaya mendapatkan rundingan damai. Siapakah saya?',
    options: ['Yamtuan Antah', 'Mat Kilau', 'Tok Janggut', 'Dol Said'],
    correctAnswer: 'Yamtuan Antah',
    explanation: 'Yamtuan Antah adalah pemimpin Negeri Sembilan yang terpaksa berundur ke Bukit Putus sebelum berjaya mendapatkan rundingan damai dengan pihak British. Beliau dikenali sebagai pemimpin yang bijaksana dalam menangani konflik.',
  },
];
