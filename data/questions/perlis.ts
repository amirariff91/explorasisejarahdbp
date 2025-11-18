import type { Question } from '@/types';

/**
 * Perlis Questions - Melaka Founding Legend (Spec-aligned)
 * Topic: The legendary founding of Melaka by Parameswara
 * Focus: Parameswara, the pelanduk (mouse deer) legend, and the origin of the name
 * Question Type: 3 fill-blank questions
 * Timer: None
 * Note: Spec Q1 (map image) omitted as it requires visual reference
 */
export const perlisQuestions: Question[] = [
  {
    id: 'perlis-1',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Siapakah nama pengasas negeri Melaka: P_RA_E_ _RA',
    correctAnswer: 'Parameswara',
    acceptableAnswers: ['Parameswara', 'parameswara', 'PARAMESWARA'],
    caseSensitive: false,
    explanation: 'Parameswara (juga dikenali sebagai Iskandar Shah) adalah pengasas Kesultanan Melaka pada tahun 1400. Beliau melarikan diri dari Palembang, Sumatera sebelum mendirikan Melaka sebagai pusat perdagangan maritim yang hebat.',
  },
  {
    id: 'perlis-2',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Binatang apakah yang menendang anjing Parameswara: _E_AN_ _K',
    correctAnswer: 'Pelanduk',
    acceptableAnswers: ['Pelanduk', 'pelanduk', 'PELANDUK'],
    caseSensitive: false,
    explanation: 'Menurut legenda, Parameswara berehat di bawah sebatang pokok ketika menyaksikan seekor pelanduk menendang anjing pemburuannya. Kejadian luar biasa ini memberi inspirasi kepada Parameswara untuk mendirikan sebuah negeri yang kuat di tempat tersebut.',
  },
  {
    id: 'perlis-3',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Perkataan Melaka berasal dari sebatang: _O_OK',
    correctAnswer: 'Pokok',
    acceptableAnswers: ['Pokok', 'pokok', 'POKOK'],
    caseSensitive: false,
    explanation: 'Nama "Melaka" diambil daripada pokok Melaka (Phyllanthus emblica) yang menaungi Parameswara semasa beliau berehat dan menyaksikan pelanduk menendang anjingnya. Pokok ini memberikan nama kepada negeri yang kemudiannya menjadi empayar perdagangan yang terkenal.',
  },
];
