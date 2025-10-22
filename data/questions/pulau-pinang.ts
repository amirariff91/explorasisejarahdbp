import type { Question } from '@/types';

/**
 * Pulau Pinang Questions - Malaysian History Educational Content
 * Focus: Hang Tuah and Melaka Sultanate Warriors
 */
export const pulauPinangQuestions: Question[] = [
  {
    id: 'pulau_pinang_1',
    state: 'pulau-pinang',
    type: 'fillBlank',
    question: 'Laksamana termasyhur semasa Kesultanan Melayu Melaka: H_NG _UA_',
    correctAnswer: 'HANG TUAH',
    acceptableAnswers: ['hang tuah', 'Hang Tuah'],
    caseSensitive: false,
    explanation: 'Hang Tuah adalah Laksamana termasyhur semasa Kesultanan Melayu Melaka.',
  },
  {
    id: 'pulau_pinang_2',
    state: 'pulau-pinang',
    type: 'fillBlank',
    question: 'Nama tempat kelahiran Hang Tuah: S_NG_I D_Y_NG',
    correctAnswer: 'SUNGAI DUYUNG',
    acceptableAnswers: ['sungai duyung', 'Sungai Duyung'],
    caseSensitive: false,
    explanation: 'Hang Tuah dilahirkan di Sungai Duyung, Melaka.',
  },
  {
    id: 'pulau_pinang_3',
    state: 'pulau-pinang',
    type: 'matching',
    question: 'Pilih 3 sahabat Hang Tuah yang paling terkenal:',
    title: 'Sahabat Hang Tuah',
    options: [
      'Hang Lekir',
      'Hang Nadim',
      'Hang Lekiu',
      'Hang Kebun',
      'Hang Jebat',
      'Hang Kasturi',
      'Hang Mahmud',
      'Hang Ismail',
      'Hang Ali',
    ],
    correctAnswers: ['Hang Lekir', 'Hang Lekiu', 'Hang Jebat'],
    explanation: 'Tiga sahabat Hang Tuah yang paling terkenal adalah Hang Lekir, Hang Lekiu, dan Hang Jebat. (Nota: Hang Kasturi juga seorang sahabat, tetapi pilih 3 yang paling utama)',
  },
  {
    id: 'pulau_pinang_4',
    state: 'pulau-pinang',
    type: 'multipleChoice',
    question: 'Ilmu mempertahankan diri yang digunakan Hang Tuah dan sahabatnya:',
    options: ['Muay Thai', 'Wushu', 'Taekwondo', 'Silat'],
    correctAnswer: 'Silat',
    explanation: 'Hang Tuah dan sahabat-sahabatnya menggunakan ilmu Silat untuk mempertahankan diri.',
  },
];
