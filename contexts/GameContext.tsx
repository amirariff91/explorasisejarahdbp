import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { debounce } from '@/utils/debounce';
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
  clearStateAnswers: (state: MalaysianState) => void;
  markTutorialComplete: () => void;
  resetGame: () => void;
  setShowSuccessModal: (show: boolean) => void;
  setAllowFontScaling: (allow: boolean) => void;
  saveError: string | null;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'dbp_sejarah_game_progress';
const INITIAL_MONEY = 100;
const INITIAL_HEALTH = 100;
const MONEY_PENALTY = 1;
const HEALTH_PENALTY = 2;

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create debounced save function (max one save per second)
  const debouncedSaveProgress = useMemo(
    () =>
      debounce((retryCount = 0) => {
        saveProgress(retryCount);
      }, 1000),
    []
  );

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress whenever game state changes (debounced)
  useEffect(() => {
    if (!isLoading) {
      // Only save after initial load is complete
      debouncedSaveProgress();
    }
  }, [gameState, isLoading, debouncedSaveProgress]);

  const loadProgress = async () => {
    setIsLoading(true);
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
      setSaveError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to load progress:', error);
      setSaveError('Gagal memuatkan data. Menggunakan data lalai.');
      // Continue with default state - don't block the app
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (retryCount = 0) => {
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
      setSaveError(null); // Clear any previous errors on successful save
    } catch (error) {
      console.error('Failed to save progress:', error);

      // Retry logic: attempt up to 2 retries with exponential backoff
      if (retryCount < 2) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s
        console.log(`Retrying save in ${retryDelay}ms...`);
        setSaveError(`Menyimpan kemajuan... cuba lagi (${retryCount + 1}/2)`);

        setTimeout(() => {
          saveProgress(retryCount + 1);
        }, retryDelay);
      } else {
        setSaveError('Gagal menyimpan kemajuan. Sila cuba lagi.');
      }
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
    const healthChange = isCorrect ? 0 : -HEALTH_PENALTY;

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
      showSuccessModal: true,
    }));
  };

  const clearStateAnswers = (state: MalaysianState) => {
    // Clear all answers for questions belonging to this state
    // Questions are prefixed with state name (e.g., "johor-1", "johor-2")
    setGameState((prev) => {
      const updatedAnswers = { ...prev.answers };
      Object.keys(updatedAnswers).forEach((questionId) => {
        if (questionId.startsWith(`${state}-`)) {
          delete updatedAnswers[questionId];
        }
      });
      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
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

  const setShowSuccessModal = (show: boolean) => {
    setGameState((prev) => ({ ...prev, showSuccessModal: show }));
  };

  const setAllowFontScaling = (allow: boolean) => {
    setGameState((prev) => ({ ...prev, allowFontScaling: allow }));
  };

  const value: GameContextType = useMemo(
    () => ({
      gameState,
      hasSeenTutorial: gameState.hasSeenTutorial,
      showSuccessModal: gameState.showSuccessModal,
      answerQuestion,
      completeState,
      clearStateAnswers,
      markTutorialComplete,
      resetGame,
      setShowSuccessModal,
      setAllowFontScaling,
      saveError,
      isLoading,
    }),
    [gameState, saveError, isLoading]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}
