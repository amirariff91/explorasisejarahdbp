import type { Question } from '@/types';

/**
 * Melaka Questions - Rukun Negara & National Identity (Spec-aligned)
 * Topic: Rukun Negara principles, national symbols, and traditional culture
 * Focus: Rukun Negara meaning & principles, Jalur Gemilang, Negaraku, Jata Negara, Baju Melayu
 * Question Type: 6 multiple choice questions
 * Timer: 5 minutes (300 seconds)
 */
export const melakaQuestions: Question[] = [
  {
    id: 'melaka-1',
    state: 'melaka',
    type: 'multipleChoice',
    question: "Apakah maksud 'Rukun Negara'?",
    options: [
      'Prinsip asas perpaduan dan keharmonian',
      'Undang-undang negara',
      'Lagu rasmi',
      'Buku teks sejarah',
    ],
    correctAnswer: 'Prinsip asas perpaduan dan keharmonian',
    explanation: 'Rukun Negara adalah ideologi kebangsaan Malaysia yang mengandungi lima prinsip asas untuk membina perpaduan dan keharmonian antara rakyat berbilang kaum. Ia diperkenalkan pada 31 Ogos 1970 selepas peristiwa 13 Mei 1969.',
  },
  {
    id: 'melaka-2',
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
    explanation: 'Jalur Gemilang melambangkan kebanggaan serta kemegahan negara Malaysia. Nama ini diumumkan oleh Perdana Menteri Tun Dr. Mahathir bin Mohamad pada 31 Ogos 1997 sempena ulang tahun kemerdekaan yang ke-40.',
  },
  {
    id: 'melaka-3',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Lagu kebangsaan Malaysia ialah...?',
    options: ['Malaysia Maju', 'Negaraku', 'Wawasan 2020', 'Jalur Gemilang'],
    correctAnswer: 'Negaraku',
    explanation: 'Negaraku adalah lagu kebangsaan Malaysia. Lagu ini diadaptasi daripada lagu rakyat negeri Perak "Terang Bulan" dan mula digunakan sebagai lagu kebangsaan pada Hari Kemerdekaan, 31 Ogos 1957.',
  },
  {
    id: 'melaka-4',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Rukun Negara mempunyai berapa prinsip?',
    options: ['4', '5', '6', '7'],
    correctAnswer: '5',
    explanation: 'Rukun Negara mempunyai 5 prinsip iaitu: (1) Kepercayaan kepada Tuhan, (2) Kesetiaan kepada Raja dan Negara, (3) Keluhuran Perlembagaan, (4) Kedaulatan Undang-undang, dan (5) Kesopanan dan Kesusilaan.',
  },
  {
    id: 'melaka-5',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Lambang rasmi negara Malaysia ialah...?',
    options: ['Jalur Gemilang', 'Jata Negara', 'Tugu Negara', 'Parlimen'],
    correctAnswer: 'Jata Negara',
    explanation: 'Jata Negara adalah lambang rasmi Malaysia yang terdiri daripada perisai dengan 14 jalur, dua harimau sebagai penyokong, bulan sabit dan bintang 14 penjuru, serta moto "Bersekutu Bertambah Mutu".',
  },
  {
    id: 'melaka-6',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Pakaian tradisional Melayu lelaki ialah...?',
    options: ['Cheongsam', 'Baju Melayu', 'Saree', 'Kimono'],
    correctAnswer: 'Baju Melayu',
    explanation: 'Baju Melayu adalah pakaian tradisional lelaki Melayu yang terdiri daripada baju berlengan panjang dan seluar panjang, biasanya dipakai bersama sampin (kain songket) dan songkok. Ia sering dipakai semasa majlis rasmi dan perayaan.',
  },
];
