import type { Question } from '@/types';

/**
 * Perlis Questions - State-specific content about the smallest state in Malaysia
 * Focus: Geography, natural attractions, border significance, and local history
 */
export const perlisQuestions: Question[] = [
  {
    id: 'perlis_1',
    state: 'perlis',
    type: 'trueFalse',
    question: 'Perlis adalah negeri terkecil di Malaysia?',
    correctAnswer: true,
    explanation: 'Perlis adalah negeri terkecil di Malaysia dengan keluasan 821 km persegi, tetapi kaya dengan sejarah dan keindahan semula jadi.',
  },
  {
    id: 'perlis_2',
    state: 'perlis',
    type: 'multipleChoice',
    question: 'Apakah nama gua terkenal di Perlis yang mempunyai terowong sepanjang 370 meter?',
    options: ['Gua Tempurung', 'Gua Kelam', 'Gua Niah', 'Batu Caves'],
    correctAnswer: 'Gua Kelam',
    explanation: 'Gua Kelam adalah tarikan pelancong utama di Perlis dengan terowong gua sepanjang 370 meter yang menghubungkan Kaki Bukit dengan Wan Tangga.',
    timeLimit: 60,
  },
  {
    id: 'perlis_3',
    state: 'perlis',
    type: 'fillBlank',
    question: 'Ibu negeri Perlis ialah: K_NG_R',
    correctAnswer: 'KANGAR',
    acceptableAnswers: ['kangar', 'Kangar'],
    caseSensitive: false,
    explanation: 'Kangar adalah ibu negeri Perlis dan merupakan bandar terkecil yang menjadi ibu negeri di Malaysia.',
    timeLimit: 45,
  },
  {
    id: 'perlis_4',
    state: 'perlis',
    type: 'multipleChoice',
    question: 'Bandar manakah di Perlis yang terletak di sempadan Malaysia-Thailand?',
    options: ['Kangar', 'Padang Besar', 'Arau', 'Kuala Perlis'],
    correctAnswer: 'Padang Besar',
    explanation: 'Padang Besar adalah bandar sempadan yang menghubungkan Malaysia dengan Thailand, terkenal sebagai pusat membeli-belah dan pintu masuk penting.',
    timeLimit: 60,
  },
  {
    id: 'perlis_5',
    state: 'perlis',
    type: 'trueFalse',
    question: 'Perlis mempunyai sistem beraja sendiri dengan gelaran Raja?',
    correctAnswer: true,
    explanation: 'Perlis mempunyai Raja sebagai ketua negeri. Gelaran penuh ialah Raja Perlis, berbeza dengan negeri lain yang menggunakan gelaran Sultan.',
    timeLimit: 45,
  },
  {
    id: 'perlis_6',
    state: 'perlis',
    type: 'multipleChoice',
    question: 'Perlis pernah berada di bawah pemerintahan negeri manakah sebelum menjadi negeri yang berasingan?',
    options: ['Perak', 'Kedah', 'Selangor', 'Kelantan'],
    correctAnswer: 'Kedah',
    explanation: 'Perlis dahulunya merupakan sebahagian daripada Kedah sebelum dipisahkan oleh British pada tahun 1843 dan dijadikan negeri yang berasingan.',
    timeLimit: 60,
  },
];
