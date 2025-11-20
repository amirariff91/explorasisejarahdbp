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
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { debounce } from '@/utils/debounce';
import { getStateTimer } from '@/constants/stateTimers';
import type {
  GameState,
  GameProgress,
  MalaysianState,
  Question,
  AnswerResult,
  AnswerValue,
  StateTimerState,
} from '@/types';

interface GameContextType {
  gameState: GameState;
  hasSeenTutorial: boolean;
  showSuccessModal: boolean;
  showGagalModal: boolean;
  answerQuestion: (questionId: string, answer: AnswerValue, question: Question) => AnswerResult;
  completeState: (state: MalaysianState) => void;
  clearStateAnswers: (state: MalaysianState) => void;
  setCurrentState: (state: MalaysianState | null) => void;
  setQuestionIndexForState: (state: MalaysianState, index: number) => void;
  markTutorialComplete: () => void;
  resetGame: () => Promise<void>;
  setShowSuccessModal: (show: boolean) => void;
  setShowGagalModal: (show: boolean) => void;
  resetWrongAnswerCount: () => void;
  setAllowFontScaling: (allow: boolean) => void;
  setPlayerProfile: (name: string, age: number) => void;
  // State timer functions
  startStateTimer: (state: MalaysianState) => void;
  pauseStateTimer: () => void;
  resumeStateTimer: () => void;
  getTimeRemaining: () => number | null;
  isTimerExpired: () => boolean;
  clearStateTimer: () => void;
  saveError: string | null;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'dbp_sejarah_game_progress';

const initialGameState: GameState = {
  currentState: null,
  completedStates: [],
  currentQuestionIndex: 0,
  answers: {},
  questionIndexByState: {},
  showSuccessModal: false,
  showGagalModal: false,
  wrongAnswerCount: 0,
  hasSeenTutorial: false,
  playerProfile: null,
  stateTimer: null,
  allowFontScaling: false,
};

// Simple loading screen component
function LoadingScreen({ message }: { message: string }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#8B4513" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '600',
  },
});

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
          completedStates: progress.completedStates,
          hasSeenTutorial: progress.hasSeenTutorial,
          currentState: progress.lastPlayedState,
          playerProfile: progress.playerProfile ?? null,
          allowFontScaling: progress.allowFontScaling ?? false,
          answers: progress.answers ?? {},
          questionIndexByState: progress.questionIndexByState ?? {},
          stateTimer: progress.stateTimer ?? null,
        }));
      }
      setSaveError(null); // Clear any previous errors
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to load progress:', error);
      }
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
        completedStates: current.completedStates,
        hasSeenTutorial: current.hasSeenTutorial,
        lastPlayedState: current.currentState,
        timestamp: Date.now(),
        playerProfile: current.playerProfile,
        allowFontScaling: current.allowFontScaling,
        answers: current.answers,
        questionIndexByState: current.questionIndexByState,
        stateTimer: current.stateTimer,
      };

      await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(progress));
      setSaveError(null); // Clear any previous errors on successful save
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save progress:', error);
      }

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

    setGameState((prev) => {
      const newWrongCount = isCorrect ? prev.wrongAnswerCount : prev.wrongAnswerCount + 1;
      // Sudden death removed - failure is handled at end of quiz

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answer,
        },
        wrongAnswerCount: newWrongCount,
      };
    });

    return {
      isCorrect,
      explanation: question.explanation,
    };
  };

  const completeState = useCallback((state: MalaysianState) => {
    setGameState((prev) => ({
      ...prev,
      completedStates: [...new Set([...prev.completedStates, state])],
      // Preserve currentState so SuccessModal can access it for voice playback
      currentState: state,
      currentQuestionIndex: 0,
      showSuccessModal: true,
      // Clear any running timer when state is completed to avoid reuse
      stateTimer: null,
    }));
  }, []);

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

  const setQuestionIndexForState = useCallback((state: MalaysianState, index: number) => {
    setGameState((prev) => ({
      ...prev,
      questionIndexByState: { ...(prev.questionIndexByState ?? {}), [state]: index },
    }));
  }, []); // Empty deps - setGameState is stable by React guarantee

  const setCurrentState = useCallback((state: MalaysianState | null) => {
    setGameState((prev) => ({
      ...prev,
      currentState: state,
    }));
  }, []);

  const markTutorialComplete = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      hasSeenTutorial: true,
    }));
  }, []);

  const resetGame = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
    } catch (e) {
      // Ignore delete errors; proceed with local reset
    }
    setGameState(initialGameState);
  };

  const setShowSuccessModal = useCallback((show: boolean) => {
    setGameState((prev) => ({ ...prev, showSuccessModal: show }));
  }, []);

  const setShowGagalModal = useCallback((show: boolean) => {
    setGameState((prev) => ({ ...prev, showGagalModal: show }));
  }, []);

  const resetWrongAnswerCount = useCallback(() => {
    setGameState((prev) => ({ ...prev, wrongAnswerCount: 0, showGagalModal: false }));
  }, []);

  const setAllowFontScaling = useCallback((allow: boolean) => {
    setGameState((prev) => ({ ...prev, allowFontScaling: allow }));
  }, []);

  const setPlayerProfile = useCallback((name: string, age: number) => {
    setGameState((prev) => ({
      ...prev,
      playerProfile: { name, age },
    }));
  }, []);

  // Timer management functions
  const startStateTimer = useCallback((state: MalaysianState) => {
    const duration = getStateTimer(state);
    if (duration === null) {
      // No timer for this state
      setGameState((prev) => ({ ...prev, stateTimer: null }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      stateTimer: {
        startTime: Date.now(),
        duration,
        isPaused: false,
        pausedDuration: 0,
      },
    }));
  }, []);

  const pauseStateTimer = useCallback(() => {
    setGameState((prev) => {
      if (!prev.stateTimer || prev.stateTimer.isPaused) return prev;
      return {
        ...prev,
        stateTimer: {
          ...prev.stateTimer,
          isPaused: true,
          pausedAt: Date.now(),
        },
      };
    });
  }, []);

  const resumeStateTimer = useCallback(() => {
    setGameState((prev) => {
      if (!prev.stateTimer || !prev.stateTimer.isPaused || !prev.stateTimer.pausedAt) {
        return prev;
      }

      const pauseDuration = Date.now() - prev.stateTimer.pausedAt;

      return {
        ...prev,
        stateTimer: {
          ...prev.stateTimer,
          isPaused: false,
          pausedAt: undefined,
          pausedDuration: prev.stateTimer.pausedDuration + pauseDuration,
        },
      };
    });
  }, []);

  const getTimeRemaining = useCallback((): number | null => {
    const timer = gameState.stateTimer;
    if (!timer) return null;

    const now = Date.now();
    const elapsed = timer.isPaused && timer.pausedAt
      ? timer.pausedAt - timer.startTime - timer.pausedDuration
      : now - timer.startTime - timer.pausedDuration;

    const remaining = timer.duration - Math.floor(elapsed / 1000);
    return Math.max(0, remaining);
  }, [gameState.stateTimer]);

  const isTimerExpired = useCallback((): boolean => {
    const remaining = getTimeRemaining();
    return remaining !== null && remaining <= 0;
  }, [getTimeRemaining]);

  const clearStateTimer = useCallback(() => {
    setGameState((prev) => ({ ...prev, stateTimer: null }));
  }, []);

  const value: GameContextType = useMemo(
    () => ({
      gameState,
      hasSeenTutorial: gameState.hasSeenTutorial,
      showSuccessModal: gameState.showSuccessModal,
      showGagalModal: gameState.showGagalModal,
      answerQuestion,
      completeState,
      clearStateAnswers,
      setCurrentState,
      setQuestionIndexForState,
      markTutorialComplete,
      resetGame,
      setShowSuccessModal,
      setShowGagalModal,
      resetWrongAnswerCount,
      setAllowFontScaling,
      setPlayerProfile,
      startStateTimer,
      pauseStateTimer,
      resumeStateTimer,
      getTimeRemaining,
      isTimerExpired,
      clearStateTimer,
      saveError,
      isLoading,
    }),
    [
      gameState,
      saveError,
      isLoading,
      answerQuestion,
      completeState,
      clearStateAnswers,
      setCurrentState,
      setQuestionIndexForState,
      markTutorialComplete,
      resetGame,
      setShowSuccessModal,
      setShowGagalModal,
      resetWrongAnswerCount,
      setAllowFontScaling,
      setPlayerProfile,
      startStateTimer,
      pauseStateTimer,
      resumeStateTimer,
      getTimeRemaining,
      isTimerExpired,
      clearStateTimer,
    ]
  );

  // Don't render children until game state is loaded from SecureStore
  if (isLoading) {
    return <LoadingScreen message="Memuatkan data permainan..." />;
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}
