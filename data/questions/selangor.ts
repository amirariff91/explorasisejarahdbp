import type { Question } from '@/types';

/**
 * Selangor Questions - Independence Movement (Spec-aligned)
 * Topic: UMNO formation, Malayan Union opposition, and independence declaration
 * Focus: Key events, leaders, and symbols of the independence struggle
 * Question Type: 7 multiple choice questions
 * Timer: 10 minutes (600 seconds)
 */
export const selangorQuestions: Question[] = [
  {
    id: 'selangor-1',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'UMNO ditubuhkan pada tahun...?',
    options: ['1957', '1955', '1946', '1963'],
    correctAnswer: '1946',
    explanation: 'UMNO (United Malays National Organisation) ditubuhkan pada 11 Mei 1946 di Johor Bahru. Parti ini ditubuhkan hasil daripada Kongres Melayu Seluruh Malaya untuk menentang Malayan Union dan memperjuangkan hak orang Melayu.',
  },
  {
    id: 'selangor-2',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Mengapakah rakyat menentang Malayan Union?',
    options: [
      'Mengurangkan kuasa Raja-Raja Melayu',
      'Menghapuskan sekolah',
      'Memberi makanan percuma',
      'Menurunkan cukai',
    ],
    correctAnswer: 'Mengurangkan kuasa Raja-Raja Melayu',
    explanation: 'Malayan Union (1946) ditentang hebat kerana ia mengurangkan kuasa Raja-Raja Melayu menjadi simbol sahaja, menghapuskan kedaulatan negeri-negeri Melayu, dan memberikan kerakyatan mudah kepada bukan Melayu. Ini dianggap mengancam kedudukan orang Melayu di tanah air mereka sendiri.',
  },
  {
    id: 'selangor-3',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Siapakah pemimpin yang mengetuai rundingan kemerdekaan di London?',
    options: [
      'Tun Tan Cheng Lock',
      'Tunku Abdul Rahman',
      "Dato' Onn Jaafar",
      'Tun Hussein Onn',
    ],
    correctAnswer: 'Tunku Abdul Rahman',
    explanation: 'Tunku Abdul Rahman memimpin Delegasi Kemerdekaan (Merdeka Mission) ke London pada Januari-Februari 1956 untuk berunding dengan kerajaan British. Rundingan ini berjaya dan Tanah Melayu mencapai kemerdekaan pada 31 Ogos 1957.',
  },
  {
    id: 'selangor-4',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah slogan yang dilaungkan pada hari kemerdekaan?',
    options: ['Merdeka!', 'Malaysia!', 'Bebas!', 'Hidup Rakyat!'],
    correctAnswer: 'Merdeka!',
    explanation: "'Merdeka!' adalah laungan kemerdekaan yang dilaungkan tujuh kali oleh Tunku Abdul Rahman pada 31 Ogos 1957 di Stadium Merdeka, Kuala Lumpur. Laungan ini menjadi simbol kebanggaan dan kemerdekaan Malaysia.",
  },
  {
    id: 'selangor-5',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah simbol perpaduan rakyat sebelum merdeka?',
    options: ['Pembukaan sekolah', 'Parti Perikatan', 'Polis Diraja', 'Perpaduan ekonomi'],
    correctAnswer: 'Parti Perikatan',
    explanation: 'Parti Perikatan (Alliance Party) yang dibentuk pada 1952 adalah gabungan UMNO, MCA, dan MIC yang melambangkan perpaduan berbilang kaum. Kerjasama ini menunjukkan kepada British bahawa rakyat Tanah Melayu bersatu dan bersedia untuk memerintah sendiri.',
  },
  {
    id: 'selangor-6',
    state: 'selangor',
    type: 'multipleChoice',
    question: "Dato' Onn Jaafar dikenali sebagai...",
    options: ['Pengasas UMNO', 'Perdana Menteri pertama', 'Ketua polis', 'Gabenor Malaya'],
    correctAnswer: 'Pengasas UMNO',
    explanation: "Dato' Onn bin Jaafar adalah pengasas dan Presiden pertama UMNO (1946-1951). Beliau memainkan peranan penting dalam menyatukan orang Melayu menentang Malayan Union dan memperjuangkan kemerdekaan Tanah Melayu.",
  },
  {
    id: 'selangor-7',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Siapakah yang mengumumkan kemerdekaan di Stadium Merdeka?',
    options: ['Tunku Abdul Rahman', 'Sultan Selangor', 'Tun Abdul Razak', 'British High Commissioner'],
    correctAnswer: 'Tunku Abdul Rahman',
    explanation: 'Tunku Abdul Rahman Putra Al-Haj mengumumkan kemerdekaan Tanah Melayu di Stadium Merdeka, Kuala Lumpur pada 31 Ogos 1957. Beliau melaungkan "Merdeka!" sebanyak tujuh kali yang disambut oleh rakyat jelata.',
  },
];
