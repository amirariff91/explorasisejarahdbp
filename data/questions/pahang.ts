import type { Question } from '@/types';

/**
 * Pahang Questions - From Figma Screen 11
 */
export const pahangQuestions: Question[] = [
  {
    id: 'pahang_1',
    state: 'pahang',
    type: 'matching',
    title: 'Tunku Abdul Rahman Putra Al-Haj Ibni Almarhum Sultan Abdul Hamid Halim Shah',
    question: 'Pilih fakta yang berkaitan dengan Tunku Abdul Rahman:',
    options: [
      'Bapa Kemerdekaan Negara',
      'Perdana Menteri ke-2',
      'Mengasaskan FELDA',
      'Melahirkan Dasar Ekonomi Baharu',
      'Berasal dari Alor Setar, Kedah',
      'Menubuhkan UMNO',
      'Melanjutkan pelajaran ke Penang Free School',
      'Menjadikan Putrajaya pusat Pentadbiran',
      'Membentuk Wawasan 2020',
    ],
    correctAnswers: [
      'Bapa Kemerdekaan Negara',
      'Berasal dari Alor Setar, Kedah',
      'Melanjutkan pelajaran ke Penang Free School',
    ],
    explanation:
      'Tunku Abdul Rahman adalah Bapa Kemerdekaan, berasal dari Kedah, dan belajar di Penang Free School.',
  },
  {
    id: 'pahang_2',
    state: 'pahang',
    type: 'multipleChoice',
    question: 'Apakah negeri terbesar di Semenanjung Malaysia?',
    options: ['Johor', 'Pahang', 'Perak', 'Kelantan'],
    correctAnswer: 'Pahang',
    explanation: 'Pahang adalah negeri terbesar di Semenanjung Malaysia.',
  },
];
