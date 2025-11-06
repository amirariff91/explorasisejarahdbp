import type { Question } from '@/types';

/**
 * Negeri Sembilan Questions - State-specific content about unique Adat Perpatih heritage
 * Focus: Matrilineal system, Minangkabau culture, traditional governance, and architecture
 */
export const negeriSembilanQuestions: Question[] = [
  {
    id: 'ns_1',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Apakah sistem pemerintahan tradisional Negeri Sembilan?',
    options: ['Kesultanan', 'Adat Perpatih', 'Raja Berperlembagaan', 'Feudal'],
    correctAnswer: 'Adat Perpatih',
    explanation: 'Negeri Sembilan terkenal dengan sistem Adat Perpatih yang matrilineal, di mana harta pusaka diwariskan melalui garis keturunan ibu.',
    timeLimit: 60,
  },
  {
    id: 'ns_2',
    state: 'negeri-sembilan',
    type: 'fillBlank',
    question: 'Ibu negeri Negeri Sembilan ialah: S_R_MB_N',
    correctAnswer: 'SEREMBAN',
    acceptableAnswers: ['seremban', 'Seremban'],
    caseSensitive: false,
    explanation: 'Seremban adalah ibu negeri Negeri Sembilan dan terkenal dengan seni bina bercorak Minangkabau.',
    timeLimit: 45,
  },
  {
    id: 'ns_3',
    state: 'negeri-sembilan',
    type: 'trueFalse',
    question: 'Dalam Adat Perpatih, harta pusaka diwariskan kepada anak perempuan?',
    correctAnswer: true,
    explanation: 'Adat Perpatih adalah sistem matrilineal yang unik di mana harta pusaka diwariskan melalui keturunan perempuan, berbeza dengan sistem patrilineal di negeri lain.',
    timeLimit: 45,
  },
  {
    id: 'ns_4',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Negeri Sembilan mempunyai berapa buah "luak" (wilayah)?',
    options: ['5 luak', '7 luak', '9 luak', '11 luak'],
    correctAnswer: '9 luak',
    explanation: 'Negeri Sembilan terdiri daripada 9 luak: Sungai Ujong, Jelebu, Johol, Rembau, Tampin, Ulu Muar, Jempol, Terachi, dan Gunong Pasir. Setiap luak diperintah oleh Undang.',
    timeLimit: 60,
  },
  {
    id: 'ns_5',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Apakah asal usul budaya masyarakat Negeri Sembilan?',
    options: ['Jawa', 'Minangkabau', 'Bugis', 'Aceh'],
    correctAnswer: 'Minangkabau',
    explanation: 'Masyarakat Negeri Sembilan berasal dari Minangkabau, Sumatera Barat. Ini dapat dilihat melalui seni bina tradisional rumah berbumbung gonjong dan sistem Adat Perpatih.',
    timeLimit: 60,
  },
  {
    id: 'ns_6',
    state: 'negeri-sembilan',
    type: 'matching',
    title: 'Ciri-ciri Negeri Sembilan',
    question: 'Pilih 3 ciri yang berkaitan dengan Negeri Sembilan:',
    options: [
      'Sistem matrilineal',
      'Rumah bumbung gonjong',
      'Kesultanan Melayu',
      'Sistem patrilineal',
      'Port Dickson',
      'Petronas Twin Towers',
      'Gua Kelam',
      'Tugu Negara',
      'Lembah Bujang',
    ],
    correctAnswers: ['Sistem matrilineal', 'Rumah bumbung gonjong', 'Port Dickson'],
    explanation: 'Negeri Sembilan terkenal dengan sistem matrilineal Adat Perpatih, rumah tradisional berbumbung gonjong (seperti tanduk kerbau) yang berasal dari Minangkabau, dan Port Dickson sebagai destinasi pelancongan pantai.',
    timeLimit: 90,
  },
];
