import type { Question } from '@/types';

/**
 * Perlis Questions - Melaka Founding (Spec-aligned)
 * Topic: The founding of the Melaka Sultanate by Parameswara
 * Focus: Historical facts about how and when Melaka was established
 * Question Type: 4 fill-blank questions
 * Timer: None
 */
export const perlisQuestions: Question[] = [
  {
    id: 'perlis-1',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Kesultanan Melaka diasaskan oleh seorang putera dari Palembang bernama _______.',
    correctAnswer: 'Parameswara',
    acceptableAnswers: ['Parameswara', 'parameswara', 'PARAMESWARA'],
    caseSensitive: false,
    explanation: 'Parameswara (juga dikenali sebagai Iskandar Shah) adalah pengasas Kesultanan Melaka pada tahun 1400. Beliau melarikan diri dari Palembang, Sumatera sebelum mendirikan Melaka.',
  },
  {
    id: 'perlis-2',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Melaka diasaskan pada tahun _______ Masihi.',
    correctAnswer: '1400',
    acceptableAnswers: ['1400'],
    caseSensitive: false,
    explanation: 'Kesultanan Melaka diasaskan pada tahun 1400 Masihi oleh Parameswara. Tarikh ini menandakan permulaan salah satu empayar perdagangan terhebat di Asia Tenggara.',
  },
  {
    id: 'perlis-3',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Nama "Melaka" diambil daripada nama pokok _______ yang menaungi Parameswara semasa beliau berehat.',
    correctAnswer: 'Melaka',
    acceptableAnswers: ['Melaka', 'melaka', 'MELAKA'],
    caseSensitive: false,
    explanation: 'Menurut legenda, Parameswara berehat di bawah pokok Melaka (Phyllanthus emblica) ketika menyaksikan seekor pelanduk menendang anjing pemburuannya. Beliau teruja dengan kejadian itu dan menamakan tempat tersebut Melaka.',
  },
  {
    id: 'perlis-4',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Melaka terletak di lokasi strategik iaitu Selat _______, yang menjadikannya pusat perdagangan penting.',
    correctAnswer: 'Melaka',
    acceptableAnswers: ['Melaka', 'melaka', 'MELAKA'],
    caseSensitive: false,
    explanation: 'Selat Melaka menghubungkan Lautan Hindi dengan Laut China Selatan. Lokasi strategik ini menjadikan Melaka sebagai pusat perdagangan antarabangsa yang penting, menghubungkan pedagang dari China, India, Arab, dan Eropah.',
  },
];
