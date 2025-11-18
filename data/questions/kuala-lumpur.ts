import type { Question } from '@/types';

/**
 * Kuala Lumpur Questions - Resistance Fighters & Independence (Spec-aligned)
 * Topic: Local heroes and basic independence facts
 * Focus: Dato' Bahaman, Tok Janggut, independence date, first PM, meaning of merdeka
 * Question Type: 5 multiple choice questions
 * Timer: 10 minutes (600 seconds)
 */
export const kualaLumpurQuestions: Question[] = [
  {
    id: 'kuala-lumpur-1',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: "Dato' Bahaman menyerang Balai Polis Lubuk Terua pada tahun:",
    options: ['1890', '1892', '1895', '1891'],
    correctAnswer: '1891',
    explanation: "Dato' Bahaman adalah pahlawan Pahang yang menentang British. Pada tahun 1891, beliau memimpin serangan ke atas Balai Polis Lubuk Terua sebagai tindak balas terhadap campur tangan British dalam pentadbiran Pahang. Perlawanan beliau adalah antara penentangan awal terhadap penjajahan British di Tanah Melayu.",
  },
  {
    id: 'kuala-lumpur-2',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Tok Janggut terkorban dalam serangan British di:',
    options: ['Besut', 'Teluk Panglima Garang', 'Kampung Baru', 'Kampung Saring'],
    correctAnswer: 'Kampung Saring',
    explanation: 'Tok Janggut (Haji Abdul Rahman Limbong) adalah pahlawan Kelantan yang menentang penjajahan British. Beliau terkorban dalam serangan British di Kampung Saring pada tahun 1915. Perlawanan Tok Janggut dikenali sebagai Pemberontakan Kelantan 1915.',
  },
  {
    id: 'kuala-lumpur-3',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Bilakah Tanah Melayu mencapai kemerdekaan?',
    options: ['31 Ogos 1957', '31 Ogos 1963', '16 September 1963', '1 Januari 1956'],
    correctAnswer: '31 Ogos 1957',
    explanation: 'Tanah Melayu mencapai kemerdekaan pada 31 Ogos 1957. Tunku Abdul Rahman mengisytiharkan kemerdekaan di Stadium Merdeka, Kuala Lumpur dengan laungan "Merdeka!" sebanyak tujuh kali. Tarikh ini disambut sebagai Hari Kebangsaan setiap tahun.',
  },
  {
    id: 'kuala-lumpur-4',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Siapakah Perdana Menteri pertama Malaysia?',
    options: ['Tun Abdul Razak', 'Tunku Abdul Rahman', 'Tun Dr Mahathir', "Dato' Onn Jaafar"],
    correctAnswer: 'Tunku Abdul Rahman',
    explanation: 'Tunku Abdul Rahman Putra Al-Haj adalah Perdana Menteri pertama Malaysia (1957-1970). Beliau dikenali sebagai "Bapa Kemerdekaan" kerana peranannya dalam memimpin perjuangan kemerdekaan dan rundingan dengan British. Beliau juga memainkan peranan penting dalam pembentukan Malaysia.',
  },
  {
    id: 'kuala-lumpur-5',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: "Apakah maksud 'merdeka'?",
    options: ['Membuka sempadan negara', 'Bebas daripada penjajahan', 'Menyertai peperangan', 'Melawat negara asing'],
    correctAnswer: 'Bebas daripada penjajahan',
    explanation: "'Merdeka' bermaksud bebas daripada penjajahan atau kawalan kuasa asing. Perkataan ini menjadi laungan kebanggaan rakyat Malaysia semasa pengisytiharan kemerdekaan. Ia melambangkan kebebasan politik dan hak untuk mentadbir negara sendiri.",
  },
];
