import type { Question } from '@/types';

/**
 * Kuala Lumpur Questions - Independence Timeline (Spec-aligned)
 * Topic: Key dates and events leading to Malaysia's independence (1946-1963)
 * Focus: Chronological milestones from Malayan Union to Malaysia formation
 * Question Type: 7 multiple choice questions
 * Timer: 10 minutes (600 seconds)
 */
export const kualaLumpurQuestions: Question[] = [
  {
    id: 'kuala-lumpur-1',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Pada tahun berapakah Malayan Union dicadangkan oleh British?',
    options: ['1945', '1946', '1947', '1948'],
    correctAnswer: '1946',
    explanation: 'Malayan Union dicadangkan oleh British pada tahun 1946. Cadangan ini ditentang hebat oleh orang Melayu kerana mengancam kedudukan raja-raja Melayu dan hak istimewa orang Melayu. Penentangan ini menyebabkan pembentukan UMNO.',
  },
  {
    id: 'kuala-lumpur-2',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Pada tarikh berapakah UMNO ditubuhkan untuk menentang Malayan Union?',
    options: ['11 Mei 1946', '31 Ogos 1946', '1 Februari 1948', '31 Ogos 1957'],
    correctAnswer: '11 Mei 1946',
    explanation: 'UMNO (United Malays National Organisation) ditubuhkan pada 11 Mei 1946 di Johor Bahru oleh Dato\' Onn Jaafar. Parti ini ditubuhkan hasil daripada Kongres Melayu Seluruh Malaya untuk menentang Malayan Union.',
  },
  {
    id: 'kuala-lumpur-3',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Malayan Union digantikan dengan Persekutuan Tanah Melayu (Federation of Malaya) pada tahun:',
    options: ['1946', '1947', '1948', '1949'],
    correctAnswer: '1948',
    explanation: 'Persekutuan Tanah Melayu (Federation of Malaya) ditubuhkan pada 1 Februari 1948 menggantikan Malayan Union. Sistem ini mengembalikan kuasa raja-raja Melayu dan melindungi hak istimewa orang Melayu.',
  },
  {
    id: 'kuala-lumpur-4',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Pilihan raya umum pertama Tanah Melayu diadakan pada tahun:',
    options: ['1952', '1953', '1954', '1955'],
    correctAnswer: '1955',
    explanation: 'Pilihan raya umum pertama Tanah Melayu diadakan pada tahun 1955. Parti Perikatan (Alliance Party) yang diterajui Tunku Abdul Rahman memenangi 51 daripada 52 kerusi. Kemenangan besar ini menguatkan tuntutan kemerdekaan.',
  },
  {
    id: 'kuala-lumpur-5',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Merdeka Mission ke London untuk rundingan kemerdekaan berlangsung pada tahun:',
    options: ['1954', '1955', '1956', '1957'],
    correctAnswer: '1956',
    explanation: 'Merdeka Mission (Delegasi Kemerdekaan) dipimpin oleh Tunku Abdul Rahman ke London pada Januari-Februari 1956. Rundingan ini berjaya mendapat persetujuan British untuk memberikan kemerdekaan kepada Tanah Melayu pada 31 Ogos 1957.',
  },
  {
    id: 'kuala-lumpur-6',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Tanah Melayu mencapai kemerdekaan pada:',
    options: ['31 Ogos 1956', '31 Ogos 1957', '16 September 1963', '1 Januari 1957'],
    correctAnswer: '31 Ogos 1957',
    explanation: 'Tanah Melayu (Malaya) mencapai kemerdekaan pada 31 Ogos 1957. Tunku Abdul Rahman mengisytiharkan kemerdekaan di Stadium Merdeka, Kuala Lumpur dengan laungan "Merdeka!" sebanyak tujuh kali. Ini adalah tarikh bersejarah yang disambut setiap tahun sebagai Hari Kebangsaan.',
  },
  {
    id: 'kuala-lumpur-7',
    state: 'kuala-lumpur',
    type: 'multipleChoice',
    question: 'Malaysia dibentuk melalui penggabungan Tanah Melayu, Singapura, Sabah dan Sarawak pada:',
    options: ['31 Ogos 1957', '1 Januari 1963', '16 September 1963', '9 Ogos 1965'],
    correctAnswer: '16 September 1963',
    explanation: 'Malaysia dibentuk pada 16 September 1963 melalui penggabungan Persekutuan Tanah Melayu, Singapura, Sabah (dahulunya British North Borneo) dan Sarawak. Tarikh ini disambut sebagai Hari Malaysia. Brunei tidak menyertai Malaysia, manakala Singapura berpisah pada 9 Ogos 1965.',
  },
];
