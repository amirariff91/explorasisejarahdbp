import type { Question } from '@/types';

/**
 * Melaka Questions - National Symbols (Spec-aligned)
 * Topic: Malaysia's official national symbols and emblems
 * Focus: Flag, anthem, flower, animal, coat of arms, and other symbols
 * Question Type: 6 multiple choice questions
 * Timer: 5 minutes (300 seconds)
 */
export const melakaQuestions: Question[] = [
  {
    id: 'melaka-1',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah nama bendera kebangsaan Malaysia?',
    options: ['Sang Saka Malaya', 'Jalur Gemilang', 'Merah Putih', 'Bintang Kejora'],
    correctAnswer: 'Jalur Gemilang',
    explanation: 'Jalur Gemilang (Stripes of Glory) adalah nama bendera kebangsaan Malaysia. Bendera ini terdiri daripada 14 jalur merah dan putih yang melambangkan 13 negeri dan Wilayah Persekutuan, serta bulan sabit dan bintang 14 penjuru yang melambangkan Islam dan perpaduan.',
  },
  {
    id: 'melaka-2',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah lagu kebangsaan Malaysia?',
    options: ['Jalur Gemilang', 'Warisan', 'Negaraku', 'Malaysia Berjaya'],
    correctAnswer: 'Negaraku',
    explanation: 'Negaraku (My Country) adalah lagu kebangsaan Malaysia. Lagu ini diadaptasi daripada lagu rakyat negeri Perak "Terang Bulan" dan mula digunakan sebagai lagu kebangsaan pada Hari Kemerdekaan, 31 Ogos 1957.',
  },
  {
    id: 'melaka-3',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah bunga kebangsaan Malaysia?',
    options: ['Bunga Tanjung', 'Bunga Raya', 'Bunga Cempaka', 'Bunga Melur'],
    correctAnswer: 'Bunga Raya',
    explanation: 'Bunga Raya (Hibiscus rosa-sinensis) adalah bunga kebangsaan Malaysia. Bunga berwarna merah ini melambangkan keberanian dan ketabahan rakyat Malaysia. Ia dipilih sebagai bunga kebangsaan pada 28 Julai 1960.',
  },
  {
    id: 'melaka-4',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah haiwan kebangsaan Malaysia?',
    options: ['Gajah Asia', 'Harimau Malaya', 'Beruang Madu', 'Tapir'],
    correctAnswer: 'Harimau Malaya',
    explanation: 'Harimau Malaya (Malayan Tiger / Panthera tigris jacksoni) adalah haiwan kebangsaan Malaysia. Harimau ini melambangkan kekuatan, keberanian dan keanggunan. Ia juga muncul dalam Jata Negara Malaysia sebagai penyokong perisai.',
  },
  {
    id: 'melaka-5',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah nama lambang rasmi atau jata negara Malaysia?',
    options: ['Lambang Negara', 'Jata Negara', 'Simbol Malaysia', 'Perisai Malaysia'],
    correctAnswer: 'Jata Negara',
    explanation: 'Jata Negara (Coat of Arms) adalah lambang rasmi Malaysia yang terdiri daripada perisai dengan 14 jalur (melambangkan negeri), dua harimau sebagai penyokong, bulan sabit dan bintang, serta reben dengan motto "Bersekutu Bertambah Mutu" (Unity is Strength).',
  },
  {
    id: 'melaka-6',
    state: 'melaka',
    type: 'multipleChoice',
    question: 'Apakah motto kebangsaan Malaysia yang tertulis di Jata Negara?',
    options: [
      'Bersekutu Bertambah Mutu',
      'Malaysia Boleh',
      'Satu Malaysia',
      'Kepimpinan Melalui Teladan',
    ],
    correctAnswer: 'Bersekutu Bertambah Mutu',
    explanation: 'Motto kebangsaan Malaysia ialah "Bersekutu Bertambah Mutu" (Unity is Strength). Motto ini menekankan kepentingan perpaduan dan kerjasama antara rakyat berbilang kaum untuk menjadikan Malaysia negara yang kuat dan maju.',
  },
];
