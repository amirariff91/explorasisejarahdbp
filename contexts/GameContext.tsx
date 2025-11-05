import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
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
  AnswerValue,
} from '@/types';

interface GameContextType {
  gameState: GameState;
  hasSeenTutorial: boolean;
  showSuccessModal: boolean;
  answerQuestion: (questionId: string, answer: AnswerValue, question: Question) => AnswerResult;
  completeState: (state: MalaysianState) => void;
  clearStateAnswers: (state: MalaysianState) => void;
  setCurrentState: (state: MalaysianState | null) => void;
  setQuestionIndexForState: (state: MalaysianState, index: number) => void;
  markTutorialComplete: () => void;
  resetGame: () => Promise<void>;
  setShowSuccessModal: (show: boolean) => void;
  setAllowFontScaling: (allow: boolean) => void;
  setPlayerProfile: (name: string, age: number) => void;
  saveError: string | null;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'dbp_sejarah_game_progress';
const INITIAL_MONEY = 100;
const INITIAL_HEALTH = 100;
// Align with tutorial copy: "Jika jawapan anda salah RM2.00 akan ditolak."
const MONEY_PENALTY = 2;
const HEALTH_PENALTY = 2;

const initialGameState: GameState = {
  money: INITIAL_MONEY,
  health: INITIAL_HEALTH,
  currentState: null,
  completedStates: [],
  currentQuestionIndex: 0,
  answers: {},
  questionIndexByState: {},
  showSuccessModal: false,
  hasSeenTutorial: false,
  playerProfile: null,
  allowFontScaling: false,
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Keep the latest game state in a ref to avoid stale closures in debounced saves
  const latestStateRef = useRef<GameState>(initialGameState);
  useEffect(() => {
    latestStateRef.current = gameState;
  }, [gameState]);

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
          playerProfile: progress.playerProfile ?? null,
          allowFontScaling: progress.allowFontScaling ?? false,
          answers: progress.answers ?? {},
          questionIndexByState: progress.questionIndexByState ?? {},
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
      // Read from ref to ensure we always save the latest state
      const current = latestStateRef.current;
      const progress: GameProgress = {
        money: current.money,
        health: current.health,
        completedStates: current.completedStates,
        hasSeenTutorial: current.hasSeenTutorial,
        lastPlayedState: current.currentState,
        timestamp: Date.now(),
        playerProfile: current.playerProfile,
        allowFontScaling: current.allowFontScaling,
        answers: current.answers,
        questionIndexByState: current.questionIndexByState,
      };

      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(progress));
      setSaveError(null); // Clear any previous errors on successful save
    } catch (error) {
      console.error('Failed to save progress:', error);

      // Retry logic: attempt up to 2 retries with exponential backoff
      if (retryCount < 2) {
        const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s
        setSaveError(`Menyimpan kemajuan... cuba lagi (${retryCount + 1}/2)`);

        setTimeout(() => {
          saveProgress(retryCount + 1);
        }, retryDelay);
      } else {
        setSaveError('Gagal menyimpan kemajuan. Sila cuba lagi.');
      }
    }
  };

  const checkAnswer = (question: Question, answer: AnswerValue): boolean => {
    switch (question.type) {
      case 'multipleChoice':
        return answer === question.correctAnswer;
      case 'trueFalse':
        return answer === question.correctAnswer;
      case 'fillBlank':
        if (typeof answer !== 'string') return false;
        // Normalize spacing and case for robust comparisons
        const normalizedAnswer = question.caseSensitive
          ? answer.trim()
          : answer.trim().toLowerCase();
        const normalizedCorrect = question.caseSensitive
          ? (question.correctAnswer ?? '').trim()
          : (question.correctAnswer ?? '').trim().toLowerCase();

        if (normalizedAnswer === normalizedCorrect) return true;

        // Check acceptable alternatives
        if (question.acceptableAnswers) {
          return question.acceptableAnswers.some((acceptable) => {
            const normalizedAcceptable = question.caseSensitive
              ? (acceptable ?? '').trim()
              : (acceptable ?? '').trim().toLowerCase();
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
    answer: AnswerValue,
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
      // Preserve currentState so SuccessModal can access it for voice playback
      currentState: state,
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
        // Support ids with '-' or '_' separators (e.g., 'johor-1' or 'johor_1')
        if (questionId.startsWith(`${state}-`) || questionId.startsWith(`${state}_`)) {
          delete updatedAnswers[questionId];
        }
      });
      const updatedIndexMap = { ...(prev.questionIndexByState ?? {}) };
      delete updatedIndexMap[state];
      return {
        ...prev,
        answers: updatedAnswers,
        questionIndexByState: updatedIndexMap,
      };
    });
  };

  const setQuestionIndexForState = (state: MalaysianState, index: number) => {
    setGameState((prev) => ({
      ...prev,
      questionIndexByState: { ...(prev.questionIndexByState ?? {}), [state]: index },
    }));
  };

  const setCurrentState = (state: MalaysianState | null) => {
    setGameState((prev) => ({
      ...prev,
      currentState: state,
    }));
  };

  const markTutorialComplete = () => {
    setGameState((prev) => ({
      ...prev,
      hasSeenTutorial: true,
    }));
  };

  const resetGame = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
    } catch (e) {
      // Ignore delete errors; proceed with local reset
    }
    setGameState(initialGameState);
  };

  const setShowSuccessModal = (show: boolean) => {
    setGameState((prev) => ({ ...prev, showSuccessModal: show }));
  };

  const setAllowFontScaling = (allow: boolean) => {
    setGameState((prev) => ({ ...prev, allowFontScaling: allow }));
  };

  const setPlayerProfile = (name: string, age: number) => {
    setGameState((prev) => ({
      ...prev,
      playerProfile: { name, age },
    }));
  };

  const value: GameContextType = useMemo(
    () => ({
      gameState,
      hasSeenTutorial: gameState.hasSeenTutorial,
      showSuccessModal: gameState.showSuccessModal,
      answerQuestion,
      completeState,
      clearStateAnswers,
      setCurrentState,
      setQuestionIndexForState,
      markTutorialComplete,
      resetGame,
      setShowSuccessModal,
      setAllowFontScaling,
      setPlayerProfile,
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
