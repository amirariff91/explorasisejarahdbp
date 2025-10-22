import type { Question } from '@/types';

/**
 * Melaka Questions - Malaysian History Educational Content
 * Focus: National Symbols, Rukun Negara, and Malaysian Identity
 * Time limit: 5 minutes
 */
export const melakaQuestions: Question[] = [
  {
    id: 'melaka_1',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah maksud \'Rukun Negara\'?',
    options: [
      'Prinsip asas perpaduan dan keharmonian',
      'Undang-undang negara',
      'Lagu rasmi',
      'Buku teks sejarah',
    ],
    correctAnswer: 'Prinsip asas perpaduan dan keharmonian',
    explanation: 'Rukun Negara adalah prinsip asas perpaduan dan keharmonian rakyat Malaysia.',
  },
  {
    id: 'melaka_2',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah maksud Jalur Gemilang?',
    options: [
      'Warna kegemaran',
      'Lambang kebanggaan dan kemegahan negara',
      'Gambar lukisan',
      'Nama makanan',
    ],
    correctAnswer: 'Lambang kebanggaan dan kemegahan negara',
    explanation: 'Jalur Gemilang adalah bendera Malaysia dan lambang kebanggaan negara.',
  },
  {
    id: 'melaka_3',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Lagu kebangsaan Malaysia ialah...?',
    options: ['Malaysia Maju', 'Negaraku', 'Wawasan 2020', 'Jalur Gemilang'],
    correctAnswer: 'Negaraku',
    explanation: 'Negaraku adalah lagu kebangsaan Malaysia.',
  },
  {
    id: 'melaka_4',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Rukun Negara mempunyai berapa prinsip?',
    options: ['4', '5', '6', '7'],
    correctAnswer: '5',
    explanation: 'Rukun Negara mempunyai 5 prinsip utama.',
  },
  {
    id: 'melaka_5',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Lambang rasmi negara Malaysia ialah...?',
    options: ['Jalur Gemilang', 'Jata Negara', 'Tugu Negara', 'Parlimen'],
    correctAnswer: 'Jata Negara',
    explanation: 'Jata Negara adalah lambang rasmi negara Malaysia.',
  },
  {
    id: 'melaka_6',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Pakaian tradisional Melayu lelaki ialah...?',
    options: ['Cheongsam', 'Baju Melayu', 'Saree', 'Kimono'],
    correctAnswer: 'Baju Melayu',
    explanation: 'Baju Melayu adalah pakaian tradisional Melayu lelaki.',
  },
];
