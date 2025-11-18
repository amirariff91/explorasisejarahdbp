import type { Question } from '@/types';

/**
 * Kedah Questions - Melaka Sultanate Governance (Spec-aligned)
 * Topic: Administrative system and key figures of the Melaka Sultanate
 * Focus: Tun Perak, Jamung (torches), Kapitan system, Tun Besar
 * Question Type: 4 fill-blank questions
 * Timer: None
 */
export const kedahQuestions: Question[] = [
  {
    id: 'kedah-1',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Siapakah Bendahara Melaka yang pernah mempertahankan serangan tentera Siam sebanyak dua kali: _U_ P_RA_',
    correctAnswer: 'Tun Perak',
    acceptableAnswers: ['Tun Perak', 'tun perak', 'TUN PERAK'],
    caseSensitive: false,
    explanation: 'Tun Perak adalah Bendahara (Perdana Menteri) Kesultanan Melaka yang terkenal. Beliau berjaya mempertahankan Melaka dari serangan tentera Siam sebanyak dua kali, menunjukkan kepimpinan dan strategi ketenteraan yang cemerlang.',
  },
  {
    id: 'kedah-2',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Daun kelapa kering atau kain yang dicelup minyak untuk menjadi penyuluh: J_ _U_NG',
    correctAnswer: 'Jamung',
    acceptableAnswers: ['Jamung', 'jamung', 'JAMUNG'],
    caseSensitive: false,
    explanation: 'Jamung adalah obor atau penyuluh yang dibuat dari daun kelapa kering atau kain yang dicelup minyak. Ia digunakan untuk menerangi kawasan pada waktu malam di Kesultanan Melaka, terutamanya untuk keselamatan.',
  },
  {
    id: 'kedah-3',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Ketua kumpulan setiap pedagang asing dikenali sebagai: _A_IT_N',
    correctAnswer: 'Kapitan',
    acceptableAnswers: ['Kapitan', 'kapitan', 'KAPITAN'],
    caseSensitive: false,
    explanation: 'Kapitan adalah gelaran yang diberikan kepada ketua kumpulan pedagang asing di Melaka. Setiap kumpulan pedagang (seperti pedagang China, India, atau Jawa) mempunyai Kapitan mereka sendiri untuk mewakili kepentingan mereka.',
  },
  {
    id: 'kedah-4',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Siapakah anak Tun Perak yang dibunuh oleh Raja Muhammad, putera kepada Sultan Mansur Shah: _U_ B_S_R',
    correctAnswer: 'Tun Besar',
    acceptableAnswers: ['Tun Besar', 'tun besar', 'TUN BESAR'],
    caseSensitive: false,
    explanation: 'Tun Besar adalah anak kepada Tun Perak yang dibunuh oleh Raja Muhammad. Peristiwa tragis ini berlaku dalam konflik dalaman kerajaan Melaka dan menunjukkan ketegangan politik pada zaman tersebut.',
  },
];
