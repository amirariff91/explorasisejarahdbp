import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import type {
  GameState,
  GameProgress,
  MalaysianState,
  Question,
  AnswerResult,
} from '@/types';

interface GameContextType {
  gameState: GameState;
  hasSeenTutorial: boolean;
  showSuccessModal: boolean;
  answerQuestion: (questionId: string, answer: any, question: Question) => AnswerResult;
  completeState: (state: MalaysianState) => void;
  markTutorialComplete: () => void;
  resetGame: () => void;
  setShowSuccessModal: (show: boolean) => void;
  setAllowFontScaling: (allow: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'dbp_sejarah_game_progress';
const INITIAL_MONEY = 100;
const INITIAL_HEALTH = 100;
const MONEY_PENALTY = 2;

const initialGameState: GameState = {
  money: INITIAL_MONEY,
  health: INITIAL_HEALTH,
  currentState: null,
  completedStates: [],
  currentQuestionIndex: 0,
  answers: {},
  showSuccessModal: false,
  hasSeenTutorial: false,
  allowFontScaling: false,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever game state changes
  useEffect(() => {
    saveProgress();
  }, [gameState]);

  const loadProgress = async () => {
    try {
      const savedData = await SecureStore.getItemAsync(STORAGE_KEY);
      if (savedData) {
        const progress: GameProgress = JSON.parse(savedData);
        setGameState((prev) => ({
          ...prev,
          money: progress.money,
          health: progress.health,
          completedStates: progress.completedStates,
          hasSeenTutorial: progress.hasSeenTutorial,
          currentState: progress.lastPlayedState,
          allowFontScaling: progress.allowFontScaling ?? false,
        }));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const progress: GameProgress = {
        money: gameState.money,
        health: gameState.health,
        completedStates: gameState.completedStates,
        hasSeenTutorial: gameState.hasSeenTutorial,
        lastPlayedState: gameState.currentState,
        timestamp: Date.now(),
        allowFontScaling: gameState.allowFontScaling,
      };
      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const checkAnswer = (question: Question, answer: any): boolean => {
    switch (question.type) {
      case 'multipleChoice':
        return answer === question.correctAnswer;
      case 'trueFalse':
        return answer === question.correctAnswer;
      case 'fillBlank':
        const normalizedAnswer = question.caseSensitive
          ? answer.trim()
          : answer.trim().toLowerCase();
        const correctAnswer = question.caseSensitive
          ? question.correctAnswer
          : question.correctAnswer.toLowerCase();

        if (normalizedAnswer === correctAnswer) return true;

        // Check acceptable alternatives
        if (question.acceptableAnswers) {
          return question.acceptableAnswers.some((acceptable) => {
            const normalizedAcceptable = question.caseSensitive
              ? acceptable
              : acceptable.toLowerCase();
            return normalizedAnswer === normalizedAcceptable;
          });
        }
        return false;
      case 'matching':
        // Answer should be array of selected options
        if (!Array.isArray(answer)) return false;
        
        // Remove duplicates from user answer
        const uniqueAnswers = [...new Set(answer)];
        
        // Must select exact number of correct answers (no duplicates allowed)
        if (uniqueAnswers.length !== question.correctAnswers.length) return false;
        
        // All selected must be correct AND all correct must be selected
        return (
          uniqueAnswers.every((item) => question.correctAnswers.includes(item)) &&
          question.correctAnswers.every((correct) => uniqueAnswers.includes(correct))
        );
      case 'crossword':
        // Crossword checking logic
        return true; // Placeholder
      default:
        return false;
    }
  };

  const answerQuestion = (
    questionId: string,
    answer: any,
    question: Question
  ): AnswerResult => {
    const isCorrect = checkAnswer(question, answer);
    const moneyChange = isCorrect ? 0 : -MONEY_PENALTY;
    const healthChange = isCorrect ? 0 : -5;

    setGameState((prev) => ({
      ...prev,
      money: Math.max(0, prev.money + moneyChange),
      health: Math.max(0, prev.health + healthChange),
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));

    return {
      isCorrect,
      moneyChange,
      healthChange,
      explanation: question.explanation,
    };
  };

  const completeState = (state: MalaysianState) => {
    setGameState((prev) => ({
      ...prev,
      completedStates: [...new Set([...prev.completedStates, state])],
      currentState: null,
      currentQuestionIndex: 0,
    }));
    setShowSuccessModal(true);
  };

  const markTutorialComplete = () => {
    setGameState((prev) => ({
      ...prev,
      hasSeenTutorial: true,
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
    SecureStore.deleteItemAsync(STORAGE_KEY);
  };

  const value: GameContextType = {
    gameState,
    hasSeenTutorial: gameState.hasSeenTutorial,
    showSuccessModal,
    answerQuestion,
    completeState,
    markTutorialComplete,
    resetGame,
    setShowSuccessModal,
    setAllowFontScaling: (allow: boolean) =>
      setGameState((prev) => ({ ...prev, allowFontScaling: allow })),
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}
