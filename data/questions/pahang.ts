import type { Question } from '@/types';

/**
 * Pahang Questions - Prime Ministers Matching (Spec-aligned)
 * Topic: Malaysia's Prime Ministers and their contributions
 * Focus: First 7 PMs (1957-2020) and their major achievements
 * Question Type: 3 matching questions
 * Timer: None
 */
export const pahangQuestions: Question[] = [
  {
    id: 'pahang-1',
    state: 'pahang',
    type: 'matching',
    title: 'Perdana Menteri Malaysia (1957-1990)',
    question: 'Pilih 3 pencapaian/gelaran yang berkaitan dengan Perdana Menteri awal Malaysia:',
    options: [
      'Bapa Kemerdekaan Malaysia',
      'Bapa Pembangunan Malaysia',
      'Mengasaskan Parti Keadilan',
      'Bapa Perpaduan',
      'Melaksanakan Wawasan 2020',
      'Mengisytiharkan kemerdekaan 1957',
      'Dasar Pandang ke Timur',
      'Menjadi PM pada usia 92 tahun',
      'Mengasaskan FELDA',
    ],
    correctAnswers: [
      'Bapa Kemerdekaan Malaysia',
      'Bapa Pembangunan Malaysia',
      'Bapa Perpaduan',
    ],
    explanation: 'Tunku Abdul Rahman dikenali sebagai Bapa Kemerdekaan (mengisytiharkan kemerdekaan 1957), Tun Abdul Razak sebagai Bapa Pembangunan (membangunkan luar bandar, FELDA, DEB), dan Tun Hussein Onn sebagai Bapa Perpaduan (menekankan perpaduan kaum).',
  },
  {
    id: 'pahang-2',
    state: 'pahang',
    type: 'matching',
    title: 'Dasar-Dasar Perdana Menteri',
    question: 'Pilih 3 dasar/program yang diperkenalkan oleh Perdana Menteri Malaysia:',
    options: [
      'Dasar Ekonomi Baru (DEB)',
      'Wawasan 2020',
      'FELDA (Penempatan Tanah Persekutuan)',
      'One Belt One Road',
      'Sustainable Development Goals',
      'Dasar Pandang ke Timur',
      'Pelan Marshall',
      'ASEAN Free Trade Area',
      'Pakatan Rakyat',
    ],
    correctAnswers: [
      'Dasar Ekonomi Baru (DEB)',
      'Wawasan 2020',
      'FELDA (Penempatan Tanah Persekutuan)',
    ],
    explanation: 'Dasar Ekonomi Baru (DEB) diperkenalkan Tun Abdul Razak untuk membasmi kemiskinan dan menyusun semula masyarakat. FELDA ditubuhkan untuk memberi tanah kepada peneroka miskin. Wawasan 2020 dilancarkan Tun Dr. Mahathir untuk menjadikan Malaysia negara maju menjelang 2020.',
  },
  {
    id: 'pahang-3',
    state: 'pahang',
    type: 'matching',
    title: 'Perdana Menteri dan Tempoh Perkhidmatan',
    question: 'Pilih 3 Perdana Menteri yang berkhidmat paling lama (1981-2020):',
    options: [
      'Tun Dr. Mahathir Mohamad',
      'Tun Abdullah Ahmad Badawi',
      'Dato\' Seri Najib Razak',
      'Tunku Abdul Rahman',
      'Tun Abdul Razak',
      'Tun Hussein Onn',
      'Dato\' Seri Ismail Sabri Yaakob',
      'Tan Sri Muhyiddin Yassin',
      'Dato\' Seri Anwar Ibrahim',
    ],
    correctAnswers: [
      'Tun Dr. Mahathir Mohamad',
      'Dato\' Seri Najib Razak',
      'Tun Abdullah Ahmad Badawi',
    ],
    explanation: 'Tun Dr. Mahathir Mohamad berkhidmat paling lama (22 tahun: 1981-2003, plus 2018-2020). Dato\' Seri Najib Razak berkhidmat 9 tahun (2009-2018), dan Tun Abdullah Ahmad Badawi berkhidmat 5 tahun (2003-2009).',
  },
];
