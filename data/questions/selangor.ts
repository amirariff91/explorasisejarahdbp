import type { Question } from '@/types';

/**
 * Selangor Questions - Pre-independence Politics (Spec-aligned)
 * Topic: Political developments and movements before Malaysia's independence
 * Focus: Party formation, political cooperation, constitutional developments
 * Question Type: 7 multiple choice questions
 * Timer: 10 minutes (600 seconds)
 */
export const selangorQuestions: Question[] = [
  {
    id: 'selangor-1',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah punca utama penentangan orang Melayu terhadap Malayan Union?',
    options: [
      'Mengurangkan kuasa Raja-Raja Melayu dan mengancam hak istimewa orang Melayu',
      'Menurunkan cukai untuk rakyat',
      'Menutup sekolah vernakular',
      'Menghalang pembangunan ekonomi',
    ],
    correctAnswer: 'Mengurangkan kuasa Raja-Raja Melayu dan mengancam hak istimewa orang Melayu',
    explanation: 'Malayan Union (1946) ditentang hebat kerana ia mengurangkan kuasa Raja-Raja Melayu menjadi simbol sahaja, menghapuskan kedaulatan negeri-negeri Melayu, dan memberikan kerakyatan mudah kepada bukan Melayu. Ini dianggap mengancam kedudukan orang Melayu di tanah air mereka sendiri.',
  },
  {
    id: 'selangor-2',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Parti politik kaum Cina yang menjadi rakan kongsi UMNO dalam Parti Perikatan ialah:',
    options: [
      'Malaysian Chinese Association (MCA)',
      'Democratic Action Party (DAP)',
      'Parti Gerakan Rakyat Malaysia',
      'Malaysian Indian Congress (MIC)',
    ],
    correctAnswer: 'Malaysian Chinese Association (MCA)',
    explanation: 'Malaysian Chinese Association (MCA) ditubuhkan pada 1949 oleh Tan Cheng Lock. MCA bekerjasama dengan UMNO membentuk Parti Perikatan (Alliance) pada 1952, yang kemudiannya disertai MIC. Kerjasama berbilang kaum ini memainkan peranan penting dalam perjuangan kemerdekaan.',
  },
  {
    id: 'selangor-3',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah kepentingan utama pembentukan Parti Perikatan (Alliance Party)?',
    options: [
      'Menunjukkan perpaduan berbilang kaum dalam perjuangan kemerdekaan',
      'Menentang British secara bersenjata',
      'Menghalang pilihan raya diadakan',
      'Membubarkan sistem raja berperlembagaan',
    ],
    correctAnswer: 'Menunjukkan perpaduan berbilang kaum dalam perjuangan kemerdekaan',
    explanation: 'Parti Perikatan (dibentuk 1952) adalah gabungan UMNO, MCA, dan MIC yang menunjukkan kepada British bahawa kaum-kaum utama di Tanah Melayu boleh bekerjasama dan sedia untuk memerintah sendiri. Perpaduan berbilang kaum ini menjadi faktor penting dalam mendapat keyakinan British untuk memberikan kemerdekaan.',
  },
  {
    id: 'selangor-4',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Siapakah pemimpin MIC (Malaysian Indian Congress) yang menjadi rakan dalam Parti Perikatan?',
    options: [
      'Tun V.T. Sambanthan',
      'Tun Tan Cheng Lock',
      'Tun Abdul Razak',
      'Tun Dr. Ismail',
    ],
    correctAnswer: 'Tun V.T. Sambanthan',
    explanation: 'Tun V.T. Sambanthan adalah Presiden MIC yang membawa parti itu menyertai Parti Perikatan. Beliau mewakili masyarakat India dalam rundingan kemerdekaan dan memainkan peranan penting dalam membentuk Malaysia yang berbilang kaum.',
  },
  {
    id: 'selangor-5',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah nama komisen yang ditubuhkan untuk merangka perlembagaan Tanah Melayu?',
    options: [
      'Suruhanjaya Reid',
      'Suruhanjaya Cobbold',
      'Suruhanjaya Barnes',
      'Suruhanjaya Razak',
    ],
    correctAnswer: 'Suruhanjaya Reid',
    explanation: 'Suruhanjaya Reid (Reid Commission) ditubuhkan pada 1956 untuk merangka perlembagaan Tanah Melayu. Diketuai oleh Lord Reid, suruhanjaya ini menghasilkan draf perlembagaan yang mengimbangi kepentingan semua kaum dan menjadi asas kepada Perlembagaan Persekutuan Tanah Melayu 1957.',
  },
  {
    id: 'selangor-6',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Pada tahun berapakah Tanah Melayu mencapai pemerintahan sendiri dalaman (internal self-government)?',
    options: ['1953', '1954', '1955', '1956'],
    correctAnswer: '1955',
    explanation: 'Tanah Melayu mencapai pemerintahan sendiri dalaman pada 1955 selepas kemenangan besar Parti Perikatan dalam pilihan raya umum pertama. Tunku Abdul Rahman dilantik sebagai Ketua Menteri (Chief Minister), menandakan permulaan pentadbiran tempatan oleh rakyat Tanah Melayu sendiri, walaupun masih di bawah British dalam hal ehwal luar dan pertahanan.',
  },
  {
    id: 'selangor-7',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'Apakah peranan Kongres Kebangsaan Melayu dalam perjuangan menentang Malayan Union?',
    options: [
      'Menyatukan semua pertubuhan Melayu untuk menentang Malayan Union',
      'Membentuk kerajaan sementara',
      'Mengisytiharkan kemerdekaan lebih awal',
      'Memulakan peperangan dengan British',
    ],
    correctAnswer: 'Menyatukan semua pertubuhan Melayu untuk menentang Malayan Union',
    explanation: 'Kongres Kebangsaan Melayu (Pan-Malayan Malay Congress) bersidang pada Mac 1946 di Kuala Lumpur, menyatukan lebih 200 pertubuhan Melayu untuk menentang Malayan Union. Kongres ini menghasilkan Pusat Tenaga Ra\'ayat (PUTERA) dan akhirnya membawa kepada pembentukan UMNO pada 11 Mei 1946 sebagai parti politik pertama orang Melayu.',
  },
];
