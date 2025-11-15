import type { Question } from '@/types';

/**
 * Kedah Questions - Melaka Sultanate (Spec-aligned)
 * Topic: The golden age and governance of the Melaka Sultanate
 * Focus: Sultans, trade, religion, and cultural peak of Melaka
 * Question Type: 4 fill-blank questions
 * Timer: None
 */
export const kedahQuestions: Question[] = [
  {
    id: 'kedah-1',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Zaman kegemilangan Kesultanan Melaka mencapai kemuncaknya pada abad ke-_______.',
    correctAnswer: '15',
    acceptableAnswers: ['15', '15.'],
    caseSensitive: false,
    explanation: 'Kesultanan Melaka mencapai zaman kegemilangannya pada abad ke-15 Masihi, terutamanya di bawah pemerintahan Sultan Mansur Shah (1459-1477). Melaka menjadi pusat perdagangan dan penyebaran Islam yang terpenting di Asia Tenggara.',
  },
  {
    id: 'kedah-2',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Sultan _______ _______ adalah sultan pertama yang memeluk Islam di Kesultanan Melaka.',
    correctAnswer: 'Muzaffar Shah',
    acceptableAnswers: ['Muzaffar Shah', 'muzaffar shah', 'MUZAFFAR SHAH'],
    caseSensitive: false,
    explanation: 'Sultan Muzaffar Shah (memerintah 1445-1459) merupakan sultan pertama Melaka yang memeluk agama Islam. Penukaran agamanya menandakan permulaan penyebaran Islam secara meluas di Melaka dan Nusantara.',
  },
  {
    id: 'kedah-3',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Melaka menjadi pusat perdagangan rempah yang penting kerana menghubungkan pedagang dari _______, India, dan Eropah.',
    correctAnswer: 'China',
    acceptableAnswers: ['China', 'china', 'CHINA'],
    caseSensitive: false,
    explanation: 'Melaka terletak di laluan perdagangan strategik yang menghubungkan China dengan India dan Eropah. Pedagang dari China membawa sutera dan porselin, manakala pedagang India dan Arab membawa kain dan rempah ratus.',
  },
  {
    id: 'kedah-4',
    state: 'kedah',
    type: 'fillBlank',
    question: 'Undang-undang Melaka yang terkenal ialah Undang-Undang _______ Melaka atau Hukum Kanun Melaka.',
    correctAnswer: 'Laut',
    acceptableAnswers: ['Laut', 'laut', 'LAUT'],
    caseSensitive: false,
    explanation: 'Undang-Undang Laut Melaka (juga dikenali sebagai Hukum Kanun Melaka) adalah kod undang-undang maritim yang mengawal aktiviti perdagangan dan pelayaran. Undang-undang ini digunakan secara meluas di Nusantara dan menunjukkan sistem pentadbiran Melaka yang tersusun.',
  },
];
