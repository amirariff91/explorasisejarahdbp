import type { Question } from '@/types';

/**
 * Terengganu Questions - Malaysian History Educational Content
 * Focus: Malaysian Prime Ministers
 * Matching concept: Select 3 correct facts from 9 options
 */
export const terengganuQuestions: Question[] = [
  {
    id: 'terengganu_1',
    state: 'terengganu',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul berdasarkan perkataan atau gambar yang diberi:',
    title: 'Tun Dr. Mahathir bin Mohamad',
    options: [
      'Perdana Menteri keempat dan ketujuh',
      'Perdana Menteri pertama',
      'Memperkenalkan Gagasan 1 Malaysia',
      'Dilahirkan pada 10 Julai 1924',
      'Berasal dari Pulau Pinang',
      'Dilahirkan pada 10 Julai 1925',
      'Menjadi cikgu di Alor Setar',
      'Berkahwin dengan Tun Dr. Siti Hasmah',
      'Digelar Bapa Pembangunan',
    ],
    correctAnswers: [
      'Perdana Menteri keempat dan ketujuh',
      'Dilahirkan pada 10 Julai 1925',
      'Berkahwin dengan Tun Dr. Siti Hasmah',
    ],
    explanation: 'Tun Dr. Mahathir adalah Perdana Menteri keempat dan ketujuh Malaysia, dilahirkan pada 10 Julai 1925, dan berkahwin dengan Tun Dr. Siti Hasmah.',
  },
  {
    id: 'terengganu_2',
    state: 'terengganu',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul berdasarkan perkataan atau gambar yang diberi:',
    title: 'Tun Abdullah bin Ahmad Badawi',
    options: [
      'Berkahwin dengan Tun Jeanne Abdullah',
      'Perdana Menteri ke-3',
      'Memperkenalkan 1 Murid 1 Sukan',
      'Dilahirkan pada 31 Ogos 1957',
      'Berasal dari Melaka',
      'Digelar Bapa Pembangunan Modal Insan',
      'Menjadi cikgu di Alor Setar',
      'Melanjutkan pelajaran ke Universiti Al-Azhar',
      'Dilahirkan di Kampung Perlis, Bayan Lepas',
    ],
    correctAnswers: [
      'Digelar Bapa Pembangunan Modal Insan',
      'Melanjutkan pelajaran ke Universiti Al-Azhar',
      'Dilahirkan di Kampung Perlis, Bayan Lepas',
    ],
    explanation: 'Tun Abdullah Ahmad Badawi digelar Bapa Pembangunan Modal Insan, melanjutkan pelajaran ke Universiti Al-Azhar, dan dilahirkan di Kampung Perlis, Bayan Lepas.',
  },
  {
    id: 'terengganu_3',
    state: 'terengganu',
    type: 'matching',
    question: 'Pilih 3 jawapan yang betul berdasarkan perkataan atau gambar yang diberi:',
    title: 'Dato\' Sri Mohd Najib bin Tun Abdul Razak',
    options: [
      'Pernah menjadi Menteri Besar Perak',
      'Perdana Menteri ke-3',
      'Memperkenalkan Gagasan 1 Malaysia',
      'Dilahirkan di Kuala Lipis, Pahang',
      'Berasal dari Melaka',
      'Anak kepada Perdana Menteri ke-2',
      'Menjadi cikgu di Alor Setar',
      'Pernah menjadi Menteri Pertahanan',
      'Dilahirkan pada 31 Ogos 1963',
    ],
    correctAnswers: [
      'Memperkenalkan Gagasan 1 Malaysia',
      'Anak kepada Perdana Menteri ke-2',
      'Pernah menjadi Menteri Pertahanan',
    ],
    explanation: 'Dato\' Sri Mohd Najib memperkenalkan Gagasan 1 Malaysia, anak kepada Perdana Menteri ke-2 (Tun Abdul Razak), dan pernah menjadi Menteri Pertahanan.',
  },
];
