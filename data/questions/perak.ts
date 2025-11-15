import type { Question } from '@/types';

/**
 * Perak Questions - Independence Fighters (Spec-aligned)
 * Topic: Political leaders who fought for Malaysia's independence (1945-1957)
 * Focus: UMNO formation, independence negotiations, and key political figures
 * Question Types: 3 fill-blank, 2 multiple choice
 * Timer: 10 minutes (600 seconds)
 */
export const perakQuestions: Question[] = [
  {
    id: 'perak-1',
    state: 'perak',
    type: 'fillBlank',
    question: 'Bapa Kemerdekaan Malaysia yang memimpin rundingan kemerdekaan dengan British: Tunku _______ _______.',
    correctAnswer: 'Abdul Rahman',
    acceptableAnswers: ['Abdul Rahman', 'abdul rahman', 'ABDUL RAHMAN'],
    caseSensitive: false,
    explanation: 'Tunku Abdul Rahman Putra Al-Haj adalah Bapa Kemerdekaan Malaysia (Father of Independence). Beliau memimpin delegasi Tanah Melayu ke London untuk rundingan kemerdekaan dan mengisytiharkan kemerdekaan pada 31 Ogos 1957.',
  },
  {
    id: 'perak-2',
    state: 'perak',
    type: 'fillBlank',
    question: 'Parti politik pertama orang Melayu yang diasaskan pada 1946 untuk menentang Malayan Union: _______.',
    correctAnswer: 'UMNO',
    acceptableAnswers: ['UMNO', 'umno', 'Umno'],
    caseSensitive: false,
    explanation: 'UMNO (United Malays National Organisation / Pertubuhan Kebangsaan Melayu Bersatu) diasaskan pada 11 Mei 1946 oleh Dato\' Onn Jaafar. Parti ini ditubuhkan untuk menentang Malayan Union yang dianggap mengancam kedudukan orang Melayu dan raja-raja Melayu.',
  },
  {
    id: 'perak-3',
    state: 'perak',
    type: 'fillBlank',
    question: 'Perikatan (Alliance Party) dibentuk pada tahun _______ untuk memperjuangkan kemerdekaan.',
    correctAnswer: '1952',
    acceptableAnswers: ['1952'],
    caseSensitive: false,
    explanation: 'Parti Perikatan (Alliance Party) dibentuk pada tahun 1952 melalui kerjasama antara UMNO, MCA (Malayan Chinese Association), dan kemudiannya MIC (Malayan Indian Congress). Kerjasama berbilang kaum ini memainkan peranan penting dalam memperjuangkan kemerdekaan Tanah Melayu.',
  },
  {
    id: 'perak-4',
    state: 'perak',
    type: 'multipleChoice',
    question: 'Siapakah pengasas UMNO yang memimpin perjuangan menentang Malayan Union?',
    options: ['Tunku Abdul Rahman', 'Dato\' Onn Jaafar', 'Tun Abdul Razak', 'Tun Dr. Ismail'],
    correctAnswer: 'Dato\' Onn Jaafar',
    explanation: 'Dato\' Onn Jaafar adalah pengasas dan Presiden pertama UMNO. Beliau memimpin kongres orang Melayu dan gerakan menentang Malayan Union pada tahun 1946. Perjuangan beliau berjaya apabila Malayan Union dibatalkan dan digantikan dengan Persekutuan Tanah Melayu pada 1948.',
  },
  {
    id: 'perak-5',
    state: 'perak',
    type: 'multipleChoice',
    question: 'Pada tahun berapakah Merdeka Mission ke London untuk rundingan kemerdekaan berlangsung?',
    options: ['1955', '1956', '1957', '1963'],
    correctAnswer: '1956',
    explanation: 'Merdeka Mission (Delegasi Kemerdekaan) ke London berlangsung pada tahun 1956 yang dipimpin oleh Tunku Abdul Rahman. Rundingan ini berjaya menghasilkan persetujuan bahawa Tanah Melayu akan mencapai kemerdekaan pada 31 Ogos 1957.',
  },
];
