import type { Question } from '@/types';

/**
 * Pulau Pinang Questions - Hang Tuah (Spec-aligned)
 * Topic: The legendary Melaka warrior and admiral Hang Tuah
 * Focus: Identity, birthplace, companions, and martial arts
 * Question Types: 2 fill-blank, 1 matching, 1 multiple choice
 * Timer: None
 */
export const pulauPinangQuestions: Question[] = [
  {
    id: 'pulau-pinang-1',
    state: 'pulau-pinang',
    type: 'fillBlank',
    question: 'Laksamana termasyhur semasa Kesultanan Melayu Melaka: H_NG _UA_',
    correctAnswer: 'Hang Tuah',
    acceptableAnswers: ['hang tuah', 'Hang Tuah', 'HANG TUAH'],
    caseSensitive: false,
    explanation: 'Hang Tuah adalah Laksamana (Panglima Angkatan Laut) yang termasyhur semasa pemerintahan Kesultanan Melayu Melaka. Beliau terkenal dengan kesetiaan yang tidak berbelah bagi kepada Sultan Melaka, sehingga melahirkan pepatah "Takkan Melayu Hilang di Dunia".',
  },
  {
    id: 'pulau-pinang-2',
    state: 'pulau-pinang',
    type: 'fillBlank',
    question: 'Nama tempat kelahiran Hang Tuah: S_NG_I D_Y_NG',
    correctAnswer: 'Sungai Duyung',
    acceptableAnswers: ['Sungai Duyung', 'sungai duyung', 'SUNGAI DUYUNG'],
    caseSensitive: false,
    explanation: 'Hang Tuah dilahirkan di Kampung Sungai Duyung, Melaka. Tempat ini menjadi tempat kelahiran salah seorang pahlawan terhebat Kesultanan Melayu Melaka. Sungai Duyung kini merupakan kawasan bersejarah di negeri Melaka.',
  },
  {
    id: 'pulau-pinang-3',
    state: 'pulau-pinang',
    type: 'matching',
    question: 'Siapakah empat sahabat Hang Tuah:',
    title: 'Empat Sahabat Hang Tuah',
    options: [
      'Hang Lekir',
      'Hang Nadim',
      'Hang Lekiu',
      'Hang Kebun',
      'Hang Jebat',
      'Hang Kasturi',
      'Hang Tuah',
      'Tun Perak',
      'Hang Mahmud',
    ],
    correctAnswers: ['Hang Lekir', 'Hang Lekiu', 'Hang Jebat', 'Hang Kasturi'],
    explanation: 'Empat sahabat Hang Tuah yang membentuk Lima Pahlawan Melayu ialah Hang Jebat, Hang Kasturi, Hang Lekir, dan Hang Lekiu. Mereka adalah sahabat sejak kecil yang menjadi pahlawan terkenal Kesultanan Melaka.',
  },
  {
    id: 'pulau-pinang-4',
    state: 'pulau-pinang',
    type: 'multipleChoice',
    question: 'Ilmu mempertahankan diri yang digunakan Hang Tuah dan sahabatnya:',
    options: ['Muay Thai', 'Wushu', 'Taekwondo', 'Silat'],
    correctAnswer: 'Silat',
    explanation: 'Hang Tuah dan sahabat-sahabatnya adalah pakar dalam seni mempertahankan diri Silat Melayu. Silat adalah seni bela diri tradisional Melayu yang menggabungkan teknik pertahanan, serangan, dan kerohanian. Mereka belajar silat daripada Adi Putra semasa kecil.',
  },
];
