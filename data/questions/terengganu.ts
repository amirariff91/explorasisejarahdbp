import type { Question } from '@/types';

/**
 * Terengganu Questions - Malaysian History Educational Content
 * Focus: Malaysian Prime Ministers
 * Matching concept: Select 3 correct facts from 9 options
 */
export const terengganuQuestions: Question[] = [
  {
    id: 'terengganu-1',
    state: 'terengganu',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul:',
    title: 'Tun Dr. Mahathir bin Mohamad',
    options: [
      'PM keempat dan ketujuh',
      'PM pertama',
      'Gagasan 1 Malaysia',
      'Lahir 10 Julai 1924',
      'Berasal dari Pulau Pinang',
      'Lahir 10 Julai 1925',
      'Cikgu di Alor Setar',
      'Kahwin Tun Siti Hasmah',
      'Bapa Pembangunan',
    ],
    correctAnswers: [
      'PM keempat dan ketujuh',
      'Lahir 10 Julai 1925',
      'Kahwin Tun Siti Hasmah',
    ],
    explanation: 'Tun Dr. Mahathir adalah Perdana Menteri keempat dan ketujuh Malaysia, dilahirkan pada 10 Julai 1925, dan berkahwin dengan Tun Dr. Siti Hasmah.',
  },
  {
    id: 'terengganu-2',
    state: 'terengganu',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul:',
    title: 'Tun Abdullah bin Ahmad Badawi',
    options: [
      'Kahwin Tun Jeanne Abdullah',
      'PM ke-3',
      '1 Murid 1 Sukan',
      'Lahir 31 Ogos 1957',
      'Berasal dari Melaka',
      'Bapa Pembangunan Insan',
      'Cikgu di Alor Setar',
      'Belajar di Al-Azhar',
      'Lahir Kpg Perlis, B. Lepas',
    ],
    correctAnswers: [
      'Bapa Pembangunan Insan',
      'Belajar di Al-Azhar',
      'Lahir Kpg Perlis, B. Lepas',
    ],
    explanation: 'Tun Abdullah Ahmad Badawi digelar Bapa Pembangunan Modal Insan, melanjutkan pelajaran ke Universiti Al-Azhar, dan dilahirkan di Kampung Perlis, Bayan Lepas.',
  },
  {
    id: 'terengganu-3',
    state: 'terengganu',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul:',
    title: 'Dato\' Sri Mohd Najib bin Tun Abdul Razak',
    options: [
      'PM ke-3',
      'Gagasan 1 Malaysia',
      'Menjadi PM pada 3 April 2009',
      'PM ke-6',
      'Dilahirkan di Kuala Lipis',
      'Anak PM ke-2',
      'Berasal dari Melaka',
      'Menteri Pertahanan',
      'Lahir 31 Ogos 1963',
    ],
    correctAnswers: [
      'Gagasan 1 Malaysia',
      'Menjadi PM pada 3 April 2009',
      'PM ke-6',
    ],
    explanation: 'Dato\' Sri Mohd Najib adalah Perdana Menteri ke-6 Malaysia yang menjadi PM pada 3 April 2009. Beliau memperkenalkan Gagasan 1 Malaysia dan merupakan anak kepada Perdana Menteri ke-2, Tun Abdul Razak.',
  },
];
