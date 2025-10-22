import type { Question } from '@/types';

/**
 * Johor Questions - From Figma Screen 12
 */
export const johorQuestions: Question[] = [
  {
    id: 'johor_1',
    state: 'johor',
    type: 'crossword',
    question: 'Lengkapkan teka silang kata ini:',
    gridSize: { rows: 10, cols: 10 },
    clues: [
      {
        direction: 'across',
        number: 1,
        clue: 'Negara yang ditubuhkan pada 16 September 1963',
        answer: 'MALAYSIA',
        startX: 0,
        startY: 2,
      },
      {
        direction: 'across',
        number: 2,
        clue: 'Keluar daripada Malaysia pada tahun 1965',
        answer: 'SINGAPURA',
        startX: 1,
        startY: 4,
      },
      {
        direction: 'across',
        number: 3,
        clue: 'Kebebasan sesebuah negara daripada kuasa asing',
        answer: 'MERDEKA',
        startX: 2,
        startY: 6,
      },
      {
        direction: 'down',
        number: 1,
        clue: 'Negeri berjiran dengan Sabah dan menyertai Malaysia pada 1963',
        answer: 'SARAWAK',
        startX: 3,
        startY: 0,
      },
      {
        direction: 'down',
        number: 2,
        clue: 'Undang-undang tertinggi negara',
        answer: 'PERLEMBAGAAN',
        startX: 5,
        startY: 1,
      },
      {
        direction: 'down',
        number: 3,
        clue: 'Proses perbincangan antara dua pihak',
        answer: 'RUNDINGAN',
        startX: 7,
        startY: 2,
      },
    ],
    explanation: 'Teka silang kata tentang pembentukan Malaysia.',
  },
  {
    id: 'johor_2',
    state: 'johor',
    type: 'multipleChoice',
    question: 'Apakah nama lama Johor Bahru?',
    options: ['Tanjung Puteri', 'Iskandar Puteri', 'Kota Tinggi', 'Muar'],
    correctAnswer: 'Tanjung Puteri',
    explanation: 'Johor Bahru dahulunya dikenali sebagai Tanjung Puteri.',
  },
];
