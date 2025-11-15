import type { Question } from '@/types';

/**
 * Pulau Pinang Questions - Hang Tuah (Spec-aligned)
 * Topic: The legendary Melaka warrior and admiral Hang Tuah
 * Focus: His life, loyalty, adventures, and legendary keris
 * Question Types: 3 fill-blank, 1 matching, 1 multiple choice
 * Timer: None
 */
export const pulauPinangQuestions: Question[] = [
  {
    id: 'pulau-pinang-1',
    state: 'pulau-pinang',
    type: 'fillBlank',
    question: 'Laksamana termasyhur semasa Kesultanan Melayu Melaka yang terkenal dengan kesetiaannya: H_NG _UA_',
    correctAnswer: 'HANG TUAH',
    acceptableAnswers: ['hang tuah', 'Hang Tuah', 'HANG TUAH'],
    caseSensitive: false,
    explanation: 'Hang Tuah adalah Laksamana (Panglima Angkatan Laut) yang termasyhur semasa pemerintahan Kesultanan Melayu Melaka. Beliau terkenal dengan kesetiaan yang tidak berbelah bagi kepada Sultan Melaka, sehingga melahirkan pepatah "Takkan Melayu Hilang di Dunia".',
  },
  {
    id: 'pulau-pinang-2',
    state: 'pulau-pinang',
    type: 'fillBlank',
    question: 'Keris pusaka sakti Hang Tuah yang dirampas daripada Taming Sari, seorang pendekar dari Jawa: Keris _______  _______.',
    correctAnswer: 'Taming Sari',
    acceptableAnswers: ['Taming Sari', 'taming sari', 'TAMING SARI'],
    caseSensitive: false,
    explanation: 'Keris Taming Sari adalah senjata pusaka yang diperoleh Hang Tuah setelah mengalahkan seorang pendekar bernama Taming Sari dari Majapahit, Jawa. Keris ini dipercayai mempunyai kuasa sakti yang menjadikan pemegangnya kebal.',
  },
  {
    id: 'pulau-pinang-3',
    state: 'pulau-pinang',
    type: 'fillBlank',
    question: 'Hang Tuah dan empat sahabatnya dikenali sebagai _______ Pahlawan Melayu.',
    correctAnswer: 'Lima',
    acceptableAnswers: ['Lima', 'lima', 'LIMA', '5'],
    caseSensitive: false,
    explanation: 'Hang Tuah dan empat sahabatnya - Hang Jebat, Hang Kasturi, Hang Lekir, dan Hang Lekiu - dikenali sebagai Lima Pahlawan Melayu. Mereka adalah pahlawan-pahlawan utama yang membela Kesultanan Melaka.',
  },
  {
    id: 'pulau-pinang-4',
    state: 'pulau-pinang',
    type: 'matching',
    question: 'Pilih 3 sahabat Hang Tuah yang membentuk Lima Pahlawan Melayu:',
    title: 'Lima Pahlawan Melayu',
    options: [
      'Hang Jebat',
      'Hang Nadim',
      'Hang Kasturi',
      'Hang Mahmud',
      'Hang Lekir',
      'Hang Ismail',
      'Hang Ali',
      'Hang Tuah',
      'Tun Perak',
    ],
    correctAnswers: ['Hang Jebat', 'Hang Kasturi', 'Hang Lekir'],
    explanation: 'Lima Pahlawan Melayu terdiri daripada Hang Tuah, Hang Jebat, Hang Kasturi, Hang Lekir, dan Hang Lekiu. Mereka adalah sahabat sejak kecil yang menjadi pahlawan terkenal Kesultanan Melaka. (Nota: Hang Lekiu tidak disenaraikan dalam pilihan kerana hanya 3 jawapan diperlukan)',
  },
  {
    id: 'pulau-pinang-5',
    state: 'pulau-pinang',
    type: 'multipleChoice',
    question: 'Apakah ilmu mempertahankan diri yang digunakan oleh Hang Tuah dan sahabat-sahabatnya?',
    options: ['Muay Thai', 'Silat', 'Wushu', 'Taekwondo'],
    correctAnswer: 'Silat',
    explanation: 'Hang Tuah dan sahabat-sahabatnya adalah pakar dalam seni mempertahankan diri Silat Melayu. Silat adalah seni bela diri tradisional Melayu yang menggabungkan teknik pertahanan, serangan, dan kerohanian.',
  },
];
