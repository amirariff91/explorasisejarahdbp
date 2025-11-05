/**
 * Game Types for DBP SEJARAH
 * Malaysian History Educational Game
 */

import type { ReactNode } from 'react';

// Malaysian States
export type MalaysianState =
  | 'perlis'
  | 'kedah'
  | 'pulau-pinang'
  | 'perak'
  | 'selangor'
  | 'kuala-lumpur'
  | 'negeri-sembilan'
  | 'melaka'
  | 'johor'
  | 'pahang'
  | 'terengganu'
  | 'kelantan'
  | 'sabah'
  | 'sarawak';

// Question Types
export type QuestionType =
  | 'multipleChoice' // 4 options
  | 'trueFalse' // BETUL/SALAH
  | 'fillBlank' // Text input
  | 'matching' // 9-grid matching
  | 'crossword'; // Crossword puzzle

// Base Question Interface
export interface BaseQuestion {
  id: string;
  state: MalaysianState;
  type: QuestionType;
  question: string;
  explanation?: string;
  timeLimit?: number; // Time limit in seconds (e.g., 600 for 10 minutes)
  imagePath?: string; // Optional image path for questions with images
}

// Multiple Choice Question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multipleChoice';
  options: [string, string, string, string]; // Exactly 4 options
  correctAnswer: string;
}

// True/False Question
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'trueFalse';
  correctAnswer: boolean;
}

// Fill in the Blank Question
export interface FillBlankQuestion extends BaseQuestion {
  type: 'fillBlank';
  correctAnswer: string;
  acceptableAnswers?: string[]; // Alternative correct answers
  caseSensitive?: boolean;
}

// Matching Question (9 options)
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  title: string; // e.g., "Tunku Abdul Rahman"
  options: [string, string, string, string, string, string, string, string, string]; // Exactly 9
  correctAnswers: string[]; // Subset of correct options
}

// Crossword Question
export interface CrosswordClue {
  direction: 'across' | 'down'; // MENDATAR | MENEGAK
  number: number;
  clue: string;
  answer: string;
  startX: number;
  startY: number;
}

export interface CrosswordQuestion extends BaseQuestion {
  type: 'crossword';
  gridSize: { rows: number; cols: number };
  clues: CrosswordClue[];
}

// Enhanced crossword puzzle definition for dedicated mini-game scenes
export interface CrosswordPuzzleWord {
  /** Unique identifier used to track the word in UI interactions */
  id: string;
  /** Correct answer spelled in uppercase characters */
  answer: string;
  /** Word orientation on the grid */
  direction: 'across' | 'down';
  /** Zero-based starting row position (top to bottom) */
  startRow: number;
  /** Zero-based starting column position (left to right) */
  startCol: number;
  /** Clue identifier that references the clue entry in the puzzle definition */
  clueId: string;
}

export interface CrosswordPuzzleClue {
  /** Unique clue identifier used to connect to a word */
  id: string;
  /** Display number (e.g., 1, 2, 3) */
  number: number;
  /** Short label shown alongside the clue number (e.g., "MENEGAK") */
  label: string;
  /** Full clue text displayed in the clue card */
  text: string;
  /** Direction that determines which clue card the entry lives in */
  direction: 'across' | 'down';
  /** Linked crossword word identifier */
  wordId: string;
}

export interface CrosswordPuzzleDefinition {
  /** Puzzle identifier (used for routing / analytics) */
  id: string;
  /** Total number of rows and columns in the grid */
  gridSize: { rows: number; cols: number };
  /** Ordered list of clue metadata grouped by orientation */
  clues: {
    across: CrosswordPuzzleClue[];
    down: CrosswordPuzzleClue[];
  };
  /** Collection of word placements that fill the grid */
  words: CrosswordPuzzleWord[];
}

// Union type for all questions
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | CrosswordQuestion;

// Answer value types for different question types
export type AnswerValue =
  | string    // For multipleChoice and fillBlank
  | boolean   // For trueFalse
  | string[]  // For matching
  | Record<number, string>;  // For crossword (clue number -> answer)

// Player Profile
export interface PlayerProfile {
  name: string;
  age: number;
}

// Game State
export interface GameState {
  money: number; // Starts at 100, -2 per wrong answer
  health: number; // Health points (0-100)
  currentState: MalaysianState | null;
  completedStates: MalaysianState[];
  currentQuestionIndex: number;
  answers: Record<string, AnswerValue>; // questionId -> answer
  // Per-state current question index for resuming quizzes
  questionIndexByState?: Partial<Record<MalaysianState, number>>;
  showSuccessModal: boolean;
  hasSeenTutorial: boolean;
  playerProfile: PlayerProfile | null;
  // UI settings
  allowFontScaling: boolean;
}

// State Info
export interface StateInfo {
  id: MalaysianState;
  name: string; // Display name in Malay
  questions: Question[];
  isCompleted: boolean;
  unlocked: boolean;
}

// Answer Result
export interface AnswerResult {
  isCorrect: boolean;
  moneyChange: number; // -2 if wrong, 0 if correct
  healthChange: number;
  explanation?: string;
}

// Game Progress (for persistence)
export interface GameProgress {
  money: number;
  health: number;
  completedStates: MalaysianState[];
  hasSeenTutorial: boolean;
  lastPlayedState: MalaysianState | null;
  timestamp: number;
  playerProfile?: PlayerProfile | null;
  // Optional UI settings for persistence
  allowFontScaling?: boolean;
  // Persist quiz progress across sessions
  answers?: Record<string, AnswerValue>;
  questionIndexByState?: Partial<Record<MalaysianState, number>>;
}

// Tutorial Step
export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  image?: any; // require() image
}

// Menu Options
export type MenuAction = 'resume' | 'restart' | 'quit' | 'settings';

// Success Modal Props
export interface SuccessModalProps {
  visible: boolean;
  onContinue: () => void;
  onRestart: () => void;
}

export interface CongratsOverlayProps {
  visible: boolean;
  title?: string;
  stars?: number;
  reward?: ReactNode;
  continueLabel?: string;
  restartLabel?: string;
  allowFontScaling?: boolean;
  onContinue: () => void;
  onRestart: () => void;
}
