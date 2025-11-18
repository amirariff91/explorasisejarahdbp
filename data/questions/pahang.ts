import type { Question } from '@/types';

/**
 * Pahang Questions - First 3 Prime Ministers (Spec-aligned)
 * Topic: Malaysia's first 3 Prime Ministers and their backgrounds
 * Focus: Tunku Abdul Rahman, Tun Abdul Razak, Tun Hussein Onn
 * Question Type: 3 matching questions
 * Timer: None
 */
export const pahangQuestions: Question[] = [
  {
    id: 'pahang-1',
    state: 'pahang',
    type: 'matching',
    title: 'Tunku Abdul Rahman Putra Al-Haj',
    question: 'Pilih 3 jawapan yang betul tentang Tunku Abdul Rahman:',
    options: [
      'Bapa Kemerdekaan Negara',
      'Perdana Menteri ke-2',
      'Mengasaskan FELDA',
      'Melahirkan Dasar Ekonomi Baharu',
      'Berasal dari Alor Setar, Kedah',
      'Menjadikan Putrajaya pusat pentadbiran',
      'Menubuhkan UMNO',
      'Melanjutkan pelajaran ke Penang Free School',
      'Membentuk Wawasan 2020',
    ],
    correctAnswers: [
      'Bapa Kemerdekaan Negara',
      'Berasal dari Alor Setar, Kedah',
      'Melanjutkan pelajaran ke Penang Free School',
    ],
    explanation: 'Tunku Abdul Rahman adalah Perdana Menteri pertama Malaysia (1957-1970) yang dikenali sebagai Bapa Kemerdekaan. Beliau berasal dari Alor Setar, Kedah dan melanjutkan pelajaran ke Penang Free School sebelum ke England. Beliau mengisytiharkan kemerdekaan pada 31 Ogos 1957.',
  },
  {
    id: 'pahang-2',
    state: 'pahang',
    type: 'matching',
    title: 'Tun Abdul Razak bin Hussein',
    question: 'Pilih 3 jawapan yang betul tentang Tun Abdul Razak:',
    options: [
      'Dilahirkan di Kuantan, Pahang',
      'Perdana Menteri ke-5',
      'Mengasaskan FELDA',
      'Melahirkan Dasar Pandang Ke Timur',
      'Berasal dari Alor Setar, Kedah',
      'Melancarkan Serangan Subuh',
      'Dilahirkan di Pulau Keladi, Pekan, Pahang',
      'Melanjutkan pelajaran ke Penang Free School',
      'Digelar Bapa Pembangunan',
    ],
    correctAnswers: [
      'Dilahirkan di Pulau Keladi, Pekan, Pahang',
      'Mengasaskan FELDA',
      'Digelar Bapa Pembangunan',
    ],
    explanation: 'Tun Abdul Razak adalah Perdana Menteri kedua Malaysia (1970-1976) yang dilahirkan di Pulau Keladi, Pekan, Pahang. Beliau digelar Bapa Pembangunan kerana membangunkan kawasan luar bandar melalui FELDA dan melaksanakan Dasar Ekonomi Baru (DEB).',
  },
  {
    id: 'pahang-3',
    state: 'pahang',
    type: 'matching',
    title: 'Tun Hussein bin Onn',
    question: 'Pilih 3 jawapan yang betul tentang Tun Hussein Onn:',
    options: [
      'Dilahirkan di Kuantan, Pahang',
      'Perdana Menteri pertama',
      'Mengasaskan FELDA',
      'Berkhidmat sebagai Pegawai Daerah di Klang',
      'Berasal dari Johor Bahru, Johor',
      'Meninggal dunia pada 29 Mei 1990',
      'Menjadi pengetua di English College',
      'Melanjutkan pelajaran ke Malay College Kuala Kangsar',
      'Digelar Bapa Pemodenan',
    ],
    correctAnswers: [
      'Berasal dari Johor Bahru, Johor',
      'Meninggal dunia pada 29 Mei 1990',
      'Melanjutkan pelajaran ke Malay College Kuala Kangsar',
    ],
    explanation: 'Tun Hussein Onn adalah Perdana Menteri ketiga Malaysia (1976-1981) yang berasal dari Johor Bahru, Johor. Beliau melanjutkan pelajaran ke Malay College Kuala Kangsar (MCKK) dan meninggal dunia pada 29 Mei 1990. Beliau digelar Bapa Perpaduan kerana menekankan perpaduan kaum.',
  },
];
