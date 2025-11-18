import type { Question } from '@/types';

/**
 * Negeri Sembilan Questions - Yang di-Pertuan Agong (Spec-aligned)
 * Topic: Malaysia's constitutional monarchy and the Yang di-Pertuan Agong
 * Focus: Term of service, first YDP Agong, Istana Negara, Majlis Raja-Raja, royal insignia
 * Question Types: 2 True/False, 3 Multiple Choice
 * Timer: 5 minutes (300 seconds)
 */
export const negeriSembilanQuestions: Question[] = [
  {
    id: 'negeri-sembilan-1',
    state: 'negeri-sembilan',
    type: 'trueFalse',
    question: 'Tempoh perkhidmatan YDP Agong ialah selama 3 tahun?',
    correctAnswer: false,
    explanation: 'Tempoh perkhidmatan Yang di-Pertuan Agong adalah 5 tahun, bukan 3 tahun. Selepas tamat tempoh, Majlis Raja-Raja akan memilih Raja seterusnya secara bergilir mengikut susunan senarai keutamaan di kalangan sembilan Raja-Raja Melayu.',
  },
  {
    id: 'negeri-sembilan-2',
    state: 'negeri-sembilan',
    type: 'trueFalse',
    question: 'Tuanku Abdul Rahman adalah YDP Agong pertama Malaysia?',
    correctAnswer: true,
    explanation: 'Tuanku Abdul Rahman ibni Almarhum Tuanku Muhammad dari Negeri Sembilan adalah Yang di-Pertuan Agong pertama Malaysia (1957-1960). Beliau memegang jawatan ini semasa kemerdekaan Tanah Melayu diisytiharkan pada 31 Ogos 1957.',
  },
  {
    id: 'negeri-sembilan-3',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Di manakah letaknya Istana Negara?',
    options: ['Putrajaya', 'Kuala Lumpur', 'Johor Bahru', 'Kota Kinabalu'],
    correctAnswer: 'Kuala Lumpur',
    explanation: 'Istana Negara terletak di Jalan Duta, Kuala Lumpur. Istana ini adalah kediaman rasmi Yang di-Pertuan Agong dan tempat upacara-upacara rasmi kerajaan diadakan. Istana Negara baharu ini dibina pada tahun 2011 menggantikan istana lama di Jalan Istana.',
  },
  {
    id: 'negeri-sembilan-4',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Siapakah yang memilih YDP Agong?',
    options: ['Parlimen', 'Majlis Raja-Raja', 'Rakyat Malaysia', 'Perdana Menteri'],
    correctAnswer: 'Majlis Raja-Raja',
    explanation: 'Majlis Raja-Raja adalah badan yang memilih Yang di-Pertuan Agong secara bergilir-gilir dari kalangan sembilan Raja-Raja Melayu. Majlis ini juga membincangkan hal-hal berkaitan agama Islam dan hak istimewa orang Melayu.',
  },
  {
    id: 'negeri-sembilan-5',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Berikut adalah BUKAN simbol kebesaran YDP Agong, KECUALI?',
    options: ['Mahkota dan keris', 'Jata negeri', 'Kad pengenalan', 'Jalur Gemilang'],
    correctAnswer: 'Mahkota dan keris',
    explanation: 'Mahkota dan keris adalah antara simbol kebesaran Yang di-Pertuan Agong. Keris pendek (Keris Panjang) merupakan alat kebesaran diraja yang digunakan semasa pertabalan. Simbol-simbol ini melambangkan kedaulatan dan kuasa Raja sebagai ketua negara.',
  },
];
