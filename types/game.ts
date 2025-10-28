/**
 * Game Types for DBP SEJARAH
 * Malaysian History Educational Game
 */

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

// Union type for all questions
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | CrosswordQuestion;

// Game State
export interface GameState {
  money: number; // Starts at 100, -2 per wrong answer
  health: number; // Health points (0-100)
  currentState: MalaysianState | null;
  completedStates: MalaysianState[];
  currentQuestionIndex: number;
  answers: Record<string, any>; // questionId -> answer
  showSuccessModal: boolean;
  hasSeenTutorial: boolean;
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
  // Optional UI settings for persistence
  allowFontScaling?: boolean;
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
