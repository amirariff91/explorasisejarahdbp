import type { Question } from '@/types';

/**
 * Kelantan Questions - Malaysian History Educational Content
 * Focus: Recent Malaysian Prime Ministers
 * Matching concept: Select 3 correct facts from 9 options
 */
export const kelantanQuestions: Question[] = [
  {
    id: 'kelantan_1',
    state: 'kelantan',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul berdasarkan perkataan atau gambar yang diberi:',
    title: 'Tan Sri Mahiaddin bin Md Yassin',
    options: [
      'Dilahirkan di Muar, Johor',
      'Perdana Menteri ke-3',
      'Pernah berkhidmat sebagai hakim mahkamah',
      'Pernah menjadi Menteri Besar Negeri Sembilan',
      'Menjadi Perdana Menteri pada 1 Mac 2020',
      'Mendapat pendidikan di Victoria Institution',
      'Melanjutkan pelajaran ke English College',
      'Perdana Menteri ke-8',
      'Dibesarkan di Perak',
    ],
    correctAnswers: [
      'Dilahirkan di Muar, Johor',
      'Menjadi Perdana Menteri pada 1 Mac 2020',
      'Perdana Menteri ke-8',
    ],
    explanation: 'Tan Sri Mahiaddin (Muhyiddin Yassin) dilahirkan di Muar, Johor; menjadi Perdana Menteri pada 1 Mac 2020; dan merupakan Perdana Menteri ke-8.',
  },
  {
    id: 'kelantan_2',
    state: 'kelantan',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul berdasarkan perkataan atau gambar yang diberi:',
    title: 'Dato\' Seri Ismail Sabri bin Yaakob',
    options: [
      'Dilahirkan di Raub, Pahang',
      'Perdana Menteri ke-3',
      'Bersekolah di SM Air Putih, Kuantan',
      'Dilahirkan di Temerloh, Pahang',
      'Menjadi Perdana Menteri pada 10 Ogos 2019',
      'Menteri Ekonomi',
      'Melanjutkan pelajaran ke SM Sains Muar',
      'Perdana Menteri ke-7',
      'Pernah berkhidmat sebagai peguam',
    ],
    correctAnswers: [
      'Dilahirkan di Temerloh, Pahang',
      'Pernah berkhidmat sebagai peguam',
      'Bersekolah di SM Air Putih, Kuantan',
    ],
    explanation: 'Dato\' Seri Ismail Sabri dilahirkan di Temerloh (Pahang), pernah berkhidmat sebagai peguam, dan bersekolah di Sekolah Menengah Air Putih, Kuantan.',
  },
];
