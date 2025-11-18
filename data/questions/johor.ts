import type { Question } from '@/types';

/**
 * Johor Questions - Malaysia Formation 1963 (Spec-aligned)
 * Topic: The formation of Malaysia on 16 September 1963
 * Focus: States that joined, independence concepts, national governance
 * Question Type: 6 fillBlank questions
 * Timer: None
 */
export const johorQuestions: Question[] = [
  {
    id: 'johor-1',
    state: 'johor',
    type: 'fillBlank',
    question: 'Negara yang ditubuhkan pada 16 September 1963: M_L_Y_IA',
    correctAnswer: 'Malaysia',
    acceptableAnswers: ['malaysia', 'Malaysia', 'MALAYSIA'],
    caseSensitive: false,
    explanation: 'Malaysia dibentuk pada 16 September 1963 melalui penggabungan Persekutuan Tanah Melayu dengan Singapura, Sabah, dan Sarawak.',
  },
  {
    id: 'johor-2',
    state: 'johor',
    type: 'fillBlank',
    question: 'Negara yang keluar daripada Malaysia pada tahun 1965: S_NG_P_RA',
    correctAnswer: 'Singapura',
    acceptableAnswers: ['singapura', 'Singapura', 'SINGAPURA'],
    caseSensitive: false,
    explanation: 'Singapura berpisah dari Malaysia pada 9 Ogos 1965 dan menjadi negara merdeka.',
  },
  {
    id: 'johor-3',
    state: 'johor',
    type: 'fillBlank',
    question: 'Kebebasan sesebuah negara daripada kuasa asing: K_M_RD_K_ _N',
    correctAnswer: 'Kemerdekaan',
    acceptableAnswers: ['kemerdekaan', 'Kemerdekaan', 'KEMERDEKAAN'],
    caseSensitive: false,
    explanation: 'Kemerdekaan merujuk kepada kebebasan sesebuah negara daripada penjajahan atau kawalan kuasa asing.',
  },
  {
    id: 'johor-4',
    state: 'johor',
    type: 'fillBlank',
    question: 'Negeri Borneo yang bergabung dengan Sabah dan menyertai Malaysia pada 1963: S_R_W_K',
    correctAnswer: 'Sarawak',
    acceptableAnswers: ['sarawak', 'Sarawak', 'SARAWAK'],
    caseSensitive: false,
    explanation: 'Sarawak, bersama Sabah, menyertai Persekutuan Tanah Melayu dan Singapura untuk membentuk Malaysia pada 16 September 1963.',
  },
  {
    id: 'johor-5',
    state: 'johor',
    type: 'fillBlank',
    question: 'Undang-undang tertinggi negara: P_RL_MB_G_ _N',
    correctAnswer: 'Perlembagaan',
    acceptableAnswers: ['perlembagaan', 'Perlembagaan', 'PERLEMBAGAAN'],
    caseSensitive: false,
    explanation: 'Perlembagaan Persekutuan adalah undang-undang tertinggi Malaysia yang menggariskan struktur kerajaan dan hak rakyat.',
  },
  {
    id: 'johor-6',
    state: 'johor',
    type: 'fillBlank',
    question: 'Proses perbincangan antara dua pihak atau lebih: R_ND_NG_N',
    correctAnswer: 'Rundingan',
    acceptableAnswers: ['rundingan', 'Rundingan', 'RUNDINGAN'],
    caseSensitive: false,
    explanation: 'Rundingan merujuk kepada proses perbincangan dan perundingan antara pihak-pihak yang terlibat untuk mencapai persetujuan.',
  },
];
