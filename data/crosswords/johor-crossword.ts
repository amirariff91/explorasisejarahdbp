import type { CrosswordPuzzleDefinition } from '@/types';

/**
 * Johor Crossword Puzzle Definition
 * Layout is derived from the Figma reference shared in the brief.
 * The grid is 12x12 to accommodate the longest word ("PERLEMBAGAAN").
 */
export const johorCrosswordPuzzle: CrosswordPuzzleDefinition = {
  id: 'johor-crossword',
  gridSize: { rows: 12, cols: 12 },
  clues: {
    across: [
      {
        id: 'clue-across-1',
        number: 1,
        label: 'MENDATAR',
        text: 'Negara yang ditubuhkan pada 16 September 1963',
        direction: 'across',
        wordId: 'word-malaysia',
      },
      {
        id: 'clue-across-2',
        number: 2,
        label: 'MENDATAR',
        text: 'Keluar daripada Malaysia pada tahun 1965',
        direction: 'across',
        wordId: 'word-singapura',
      },
      {
        id: 'clue-across-3',
        number: 3,
        label: 'MENDATAR',
        text: 'Kebebasan sesebuah negara daripada kuasa asing',
        direction: 'across',
        wordId: 'word-kemerdekaan',
      },
    ],
    down: [
      {
        id: 'clue-down-1',
        number: 1,
        label: 'MENEGAK',
        text: 'Negeri bergabung dengan Sabah dan menubuhkan Malaysia pada 1963',
        direction: 'down',
        wordId: 'word-sarawak',
      },
      {
        id: 'clue-down-2',
        number: 2,
        label: 'MENEGAK',
        text: 'Undang-undang tertinggi negara',
        direction: 'down',
        wordId: 'word-perlembagaan',
      },
      {
        id: 'clue-down-3',
        number: 3,
        label: 'MENEGAK',
        text: 'Proses perbincangan antara dua pihak',
        direction: 'down',
        wordId: 'word-rundingan',
      },
    ],
  },
  words: [
    {
      id: 'word-kemerdekaan',
      answer: 'KEMERDEKAAN',
      direction: 'across',
      startRow: 4,
      startCol: 1,
      clueId: 'clue-across-3',
    },
    {
      id: 'word-malaysia',
      answer: 'MALAYSIA',
      direction: 'across',
      startRow: 5,
      startCol: 4,
      clueId: 'clue-across-1',
    },
    {
      id: 'word-singapura',
      answer: 'SINGAPURA',
      direction: 'across',
      startRow: 6,
      startCol: 3,
      clueId: 'clue-across-2',
    },
    {
      id: 'word-sarawak',
      answer: 'SARAWAK',
      direction: 'down',
      startRow: 5,
      startCol: 1,
      clueId: 'clue-down-1',
    },
    {
      id: 'word-perlembagaan',
      answer: 'PERLEMBAGAAN',
      direction: 'down',
      startRow: 0,
      startCol: 2,
      clueId: 'clue-down-2',
    },
    {
      id: 'word-rundingan',
      answer: 'RUNDINGAN',
      direction: 'down',
      startRow: 3,
      startCol: 0,
      clueId: 'clue-down-3',
    },
  ],
};

