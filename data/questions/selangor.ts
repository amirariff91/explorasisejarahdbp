import type { Question } from '@/types';

/**
 * Selangor Questions - Malaysian History Educational Content
 * Focus: Malaysian Independence, UMNO, and National Leaders
 * Time limit: 10 minutes
 */
export const selangorQuestions: Question[] = [
  {
    id: 'selangor_1',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'UMNO ditubuhkan pada tahun...?',
    options: ['1957', '1955', '1946', '1963'],
    correctAnswer: '1946',
    explanation: 'UMNO (United Malays National Organisation) ditubuhkan pada tahun 1946.',
  },
  {
    id: 'selangor_2',
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
    explanation: 'Rakyat menentang Malayan Union kerana ia mengurangkan kuasa Raja-Raja Melayu.',
  },
  {
    id: 'selangor_3',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Siapakah pemimpin yang mengetuai rundingan kemerdekaan di London?',
    options: ['Tun Tan Cheng Lock', 'Tunku Abdul Rahman', 'Dato\' Onn Jaafar', 'Tun Hussein Onn'],
    correctAnswer: 'Tunku Abdul Rahman',
    explanation: 'Tunku Abdul Rahman mengetuai rundingan kemerdekaan di London pada tahun 1956.',
  },
  {
    id: 'selangor_4',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah slogan yang dilaungkan pada hari kemerdekaan?',
    options: ['Merdeka!', 'Malaysia!', 'Bebas!', 'Hidup Rakyat!'],
    correctAnswer: 'Merdeka!',
    explanation: 'Slogan "Merdeka!" dilaungkan pada hari kemerdekaan 31 Ogos 1957.',
  },
  {
    id: 'selangor_5',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah simbol perpaduan rakyat sebelum merdeka?',
    options: ['Pembukaan sekolah', 'Parti Perikatan', 'Polis Diraja', 'Perpaduan ekonomi'],
    correctAnswer: 'Parti Perikatan',
    explanation: 'Parti Perikatan adalah simbol perpaduan rakyat sebelum kemerdekaan.',
  },
  {
    id: 'selangor_6',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Dato\' Onn Jaafar dikenali sebagai...',
    options: ['Pengasas UMNO', 'Perdana Menteri pertama', 'Ketua polis', 'Gabenor Malaya'],
    correctAnswer: 'Pengasas UMNO',
    explanation: 'Dato\' Onn Jaafar dikenali sebagai pengasas UMNO pada tahun 1946.',
  },
  {
    id: 'selangor_7',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Siapakah yang mengumumkan kemerdekaan di Stadium Merdeka?',
    options: ['Tunku Abdul Rahman', 'Sultan Selangor', 'Tun Abdul Razak', 'British High Commissioner'],
    correctAnswer: 'Tunku Abdul Rahman',
    explanation: 'Tunku Abdul Rahman mengumumkan kemerdekaan di Stadium Merdeka pada 31 Ogos 1957.',
  },
];
