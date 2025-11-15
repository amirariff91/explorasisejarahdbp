import type { Question } from '@/types';

/**
 * Negeri Sembilan Questions - Malaysian Monarchy (Spec-aligned)
 * Topic: Malaysia's constitutional monarchy system and royal institutions
 * Focus: Yang di-Pertuan Agong, Conference of Rulers, rotation system
 * Question Types: 2 True/False, 3 Multiple Choice
 * Timer: 5 minutes (300 seconds)
 */
export const negeriSembilanQuestions: Question[] = [
  {
    id: 'negeri-sembilan-1',
    state: 'negeri-sembilan',
    type: 'trueFalse',
    question: 'Malaysia mengamalkan sistem Raja Berperlembagaan (Constitutional Monarchy)?',
    correctAnswer: true,
    explanation: 'Malaysia mengamalkan sistem Raja Berperlembagaan di mana Yang di-Pertuan Agong (Raja) adalah ketua negara, tetapi kuasa pemerintahan sebenar terletak pada Perdana Menteri dan Kabinet yang dipilih melalui sistem demokrasi berparlimen. Raja bertindak mengikut nasihat Kabinet dan Perlembagaan.',
  },
  {
    id: 'negeri-sembilan-2',
    state: 'negeri-sembilan',
    type: 'trueFalse',
    question: 'Yang di-Pertuan Agong dilantik secara bergilir-gilir daripada kalangan Raja-Raja Melayu?',
    correctAnswer: true,
    explanation: 'Malaysia mempunyai sistem unik di mana Yang di-Pertuan Agong dipilih secara bergilir-gilir setiap 5 tahun dari kalangan sembilan Raja-Raja Melayu (Sultan/Raja dari Perlis, Kedah, Perak, Selangor, Negeri Sembilan, Johor, Pahang, Terengganu, dan Kelantan). Sistem ini memastikan perkongsian kuasa antara negeri-negeri beraja.',
  },
  {
    id: 'negeri-sembilan-3',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Apakah nama majlis yang membincangkan hal ehwal berkaitan Raja-Raja dan kepentingan orang Melayu?',
    options: [
      'Majlis Raja-Raja (Conference of Rulers)',
      'Dewan Rakyat',
      'Dewan Negara',
      'Majlis Mesyuarat Kerajaan',
    ],
    correctAnswer: 'Majlis Raja-Raja (Conference of Rulers)',
    explanation: 'Majlis Raja-Raja (Conference of Rulers) adalah institusi penting yang terdiri daripada kesembilan Raja-Raja Melayu dan empat Yang di-Pertua Negeri (Gabenor). Majlis ini bersidang untuk memilih Yang di-Pertuan Agong, membincang perkara-perkara istimewa orang Melayu, agama Islam, dan kedudukan Raja-Raja.',
  },
  {
    id: 'negeri-sembilan-4',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Berapakah tempoh jawatan Yang di-Pertuan Agong Malaysia?',
    options: ['3 tahun', '4 tahun', '5 tahun', '6 tahun'],
    correctAnswer: '5 tahun',
    explanation: 'Yang di-Pertuan Agong Malaysia dilantik untuk tempoh 5 tahun. Selepas tamat tempoh, Majlis Raja-Raja akan memilih Raja seterusnya secara bergilir mengikut susunan senarai keutamaan (seniority) di kalangan sembilan Raja-Raja Melayu.',
  },
  {
    id: 'negeri-sembilan-5',
    state: 'negeri-sembilan',
    type: 'multipleChoice',
    question: 'Antara kuasa penting Yang di-Pertuan Agong ialah:',
    options: [
      'Melantik Perdana Menteri dan hakim',
      'Menulis undang-undang baru',
      'Menentukan harga barang',
      'Memilih Menteri Kabinet',
    ],
    correctAnswer: 'Melantik Perdana Menteri dan hakim',
    explanation: 'Antara kuasa penting Yang di-Pertuan Agong termasuklah melantik Perdana Menteri (ahli Dewan Rakyat yang mendapat majoriti sokongan), melantik hakim-hakim termasuk Ketua Hakim Negara, mengurniakan darjah kebesaran dan pengampunan, serta memberi perkenan diraja kepada undang-undang yang diluluskan Parlimen sebelum ia berkuat kuasa.',
  },
];
