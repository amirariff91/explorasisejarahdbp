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
  | 'matching'; // 9-grid matching

// Base Question Interface
export interface BaseQuestion {
  id: string;
  state: MalaysianState;
  type: QuestionType;
  question: string;
  explanation?: string;
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

// Union type for all questions
export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | MatchingQuestion;

// Answer value types for different question types
export type AnswerValue =
  | string    // For multipleChoice and fillBlank
  | boolean   // For trueFalse
  | string[]; // For matching

// Player Profile
export interface PlayerProfile {
  name: string;
  age: number;
}

// State Timer State
export interface StateTimerState {
  startTime: number; // Unix timestamp when timer started
  duration: number; // Total duration in seconds
  isPaused: boolean;
  pausedAt?: number; // Unix timestamp when paused
  pausedDuration: number; // Accumulated pause time in seconds
}

// Game State
export interface GameState {
  currentState: MalaysianState | null;
  completedStates: MalaysianState[];
  currentQuestionIndex: number;
  answers: Record<string, AnswerValue>; // questionId -> answer
  // Per-state current question index for resuming quizzes
  questionIndexByState?: Partial<Record<MalaysianState, number>>;
  showSuccessModal: boolean;
  showGagalModal: boolean;
  // Wrong answer tracking for fail condition
  wrongAnswerCount: number;
  hasSeenTutorial: boolean;
  playerProfile: PlayerProfile | null;
  // State-level timer (null if no timer for current state)
  stateTimer: StateTimerState | null;
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
  explanation?: string;
}

// Game Progress (for persistence)
export interface GameProgress {
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
  // State timer state (for resuming timed quizzes)
  stateTimer?: StateTimerState | null;
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
  totalQuestions?: number;
  onContinue: () => void;
  onRestart: () => void;
}

export interface CongratsOverlayProps {
  visible: boolean;
  title?: string;
  reward?: ReactNode;
  continueLabel?: string;
  restartLabel?: string;
  allowFontScaling?: boolean;
  onContinue: () => void;
  onRestart: () => void;
}
