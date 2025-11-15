import type { Question } from '@/types';

/**
 * Johor Questions - Malaysia Formation 1963 (Spec-aligned)
 * Topic: The formation of Malaysia on 16 September 1963
 * Focus: States that joined, historical context, key figures
 * Question Type: 1 crossword puzzle
 * Timer: None
 *
 * Note: Crossword implementation handled by dedicated crossword screen
 */
export const johorQuestions: Question[] = [
  {
    id: 'johor-1',
    state: 'johor',
    type: 'crossword',
    question: 'Pembentukan Malaysia 1963',
    gridSize: { rows: 7, cols: 9 },
    clues: [
      // Across
      { direction: 'across', number: 1, clue: 'Negara yang terpisah dari Malaysia pada 9 Ogos 1965', answer: 'SINGAPURA', startX: 0, startY: 0 },
      { direction: 'across', number: 4, clue: 'Negeri Borneo yang dahulunya dikenali sebagai British North Borneo', answer: 'SABAH', startX: 3, startY: 2 },
      { direction: 'across', number: 6, clue: 'Perdana Menteri yang mengusulkan idea pembentukan Malaysia', answer: 'TUNKU', startX: 0, startY: 4 },
      // Down
      { direction: 'down', number: 1, clue: 'Negeri Borneo yang diperintah keluarga Brooke', answer: 'SARAWAK', startX: 0, startY: 0 },
      { direction: 'down', number: 2, clue: 'Bulan Malaysia dibentuk (bahasa Inggeris)', answer: 'SEPTEMBER', startX: 5, startY: 0 },
      { direction: 'down', number: 3, clue: 'Negara Brunei yang tidak menyertai Malaysia', answer: 'BRUNEI', startX: 8, startY: 1 },
      { direction: 'down', number: 5, clue: 'Nama penuh Malaysia sebelum 1963', answer: 'MALAYA', startX: 6, startY: 2 },
    ],
    explanation: 'Malaysia dibentuk pada 16 September 1963 melalui penggabungan Persekutuan Tanah Melayu dengan Singapura, Sabah (dahulunya British North Borneo) dan Sarawak. Brunei tidak menyertai Malaysia. Singapura kemudiannya berpisah dari Malaysia pada 9 Ogos 1965.',
  },
];
