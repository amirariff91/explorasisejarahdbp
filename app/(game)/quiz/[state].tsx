import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useGameContext } from '@/contexts/GameContext';
import { getQuestionsForState } from '@/data/questions';
import type { AnswerValue, MalaysianState, Question } from '@/types';
import { playAmbient, playMusic, playQuestionTransitionSound, stopAllAmbient, stopMusic } from '@/utils/audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, ImageBackground, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ASSETS } from '@/constants/assets';
import { Colors, GameFeedback, getResponsiveFontSize } from '@/constants/theme';

// Question Components
import FillBlankQuestion from '@/components/game/questions/FillBlankQuestion';
import MatchingQuestion from '@/components/game/questions/MatchingQuestion';
import MultipleChoiceQuestion from '@/components/game/questions/MultipleChoiceQuestion';
import TrueFalseQuestion from '@/components/game/questions/TrueFalseQuestion';

// UI Components
import CountdownTimer from '@/components/game/CountdownTimer';
import FeedbackOverlay from '@/components/game/FeedbackOverlay';
import GagalModal from '@/components/game/GagalModal';
import MenuButton from '@/components/game/MenuButton';
import StatusBar from '@/components/game/StatusBar';
import SuccessModal from '@/components/game/SuccessModal';

/**
 * Quiz Screen - Dynamic Route
 * Handles all question types for a specific state
 * Fixed: isMounted ref prevents setState on unmounted component
 */
export default function QuizScreen() {
  const router = useRouter();
  const { state } = useLocalSearchParams<{ state: MalaysianState }>();
  const {
    gameState,
    answerQuestion,
    completeState,
    clearStateAnswers,
    showSuccessModal,
    setShowSuccessModal,
    showGagalModal,
    setShowGagalModal,
    resetWrongAnswerCount,
    setCurrentState,
    setQuestionIndexForState,
    startStateTimer,
    clearStateTimer,
    pauseStateTimer,
    resumeStateTimer,
    isTimerExpired,
  } = useGameContext();

  const { width } = useWindowDimensions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feedback overlay state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState<string | undefined>(undefined);

  // Track component mount state to prevent setState on unmounted component
  const isMountedRef = useRef(true);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedRef = useRef(false); // Track if we've already completed this state

  // Track mounted state and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // Cleanup timer on unmount
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
        answerTimerRef.current = null;
      }
    };
  }, []);

  // Track current playing state in global context for persistence and voice playback.
  // NOTE: setCurrentState is intentionally omitted from deps to prevent infinite loops.
  // We intentionally keep the last played state after unmount so the map screen can
  // surface a \"resume\" badge using GameContext.currentState.
  useEffect(() => {
    if (state) setCurrentState(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Load questions for the current state
  useEffect(() => {
    if (state && isMountedRef.current) {
      const stateQuestions = getQuestionsForState(state);
      if (stateQuestions.length === 0) {
        setError(`No questions found for ${state}. Please try another state.`);
      } else {
        setQuestions(stateQuestions);
        const savedIndex = gameState.questionIndexByState?.[state] ?? 0;
        const clampedIndex = Math.max(0, Math.min(savedIndex, stateQuestions.length - 1));
        setCurrentQuestionIndex(clampedIndex);
        setError(null);
        hasCompletedRef.current = false; // Reset completion flag for new state
        // Reset wrong answer count for fresh start (only if starting from beginning)
        if (savedIndex === 0) {
          resetWrongAnswerCount();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Sync local question index to GameContext for persistence
  // NOTE: Only sync when index changes (not on initial load), to avoid redundant updates
  useEffect(() => {
    if (state && currentQuestionIndex > 0) {
      setQuestionIndexForState(state, currentQuestionIndex);
    }
  }, [currentQuestionIndex, state, setQuestionIndexForState]);

  // Start state timer when quiz begins (only for states with timers)
  useEffect(() => {
    if (state && questions.length > 0) {
      // Always reset any stale timer from previous states before starting
      clearStateTimer();
      startStateTimer(state);
    }
  }, [state, questions.length, startStateTimer, clearStateTimer]);

  // Handle state completion when all questions are answered
  // Guard by verifying every question has a recorded answer
  // Only complete if no wrong answers (perfect score required)
  // REMOVED: Auto-completion logic moved to handleFeedbackDismiss to allow "End-of-Quiz" evaluation.
  // This prevents premature success/failure modals and ensures user sees feedback for the last question.

  // Play quiz background music on mount
  useEffect(() => {
    // Clear any previous ambient layers (e.g., from map or tutorial) before starting quiz ambience
    stopAllAmbient();

    playMusic('bgm-quiz', true, 2000); // Fade in quiz theme
    playAmbient('ambient-quiz-soft', 0.15); // Very subtle concentration ambience

    return () => {
      // Fade out quiz (or success) music and clear all ambient when leaving the quiz
      stopMusic(500);
      stopAllAmbient();
    };
  }, []);

  // Handle back button press with confirmation (prevent accidental exit)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Don't show confirmation if success modal is visible (quiz completed)
      if (showSuccessModal) return false;

      Alert.alert(
        'Keluar dari Kuiz?',
        'Anda pasti mahu keluar? Kemajuan akan disimpan.',
        [
          {
            text: 'Batal',
            style: 'cancel',
          },
          {
            text: 'Keluar',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
      return true; // Prevent default back behavior
    });

    return () => backHandler.remove();
  }, [showSuccessModal, router]);

  // Switch to success music when modal shows
  useEffect(() => {
    if (showSuccessModal) {
      stopMusic(500); // Quick fade out quiz music
      playMusic('bgm-success', false, 1000); // Fade in success theme (no loop)
    }
  }, [showSuccessModal]);

  // Show error if questions failed to load
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { fontSize: getResponsiveFontSize('question', width) }]}>{error}</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}>
            <Text style={[styles.backButtonText, { fontSize: getResponsiveFontSize('answer', width) }]}>Back to Map</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!state || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Guard against undefined question (safety check)
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    if (__DEV__) {
      console.error(`Question index ${currentQuestionIndex} out of bounds for state ${state}`);
    }
    return (
      <View style={styles.container}>
        <Text>Error: Invalid question. Please restart.</Text>
      </View>
    );
  }

  const handleAnswer = (answer: AnswerValue) => {
    // Prevent double-submit or submission on unmounted component
    if (isAnswering || !isMountedRef.current) return;

    setIsAnswering(true);
    const result = answerQuestion(currentQuestion.id, answer, currentQuestion);

    // Pause timer during feedback (if timer exists)
    if (gameState.stateTimer) {
      pauseStateTimer();
    }

    // Show feedback overlay with result
    setFeedbackIsCorrect(result.isCorrect);
    setFeedbackExplanation(result.explanation);
    setShowFeedback(true);

    // Clear any existing timer (cleanup)
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
      answerTimerRef.current = null;
    }
  };

  const handleFeedbackDismiss = () => {
    // Callback when user manually dismisses feedback overlay
    // Safety check: only proceed if component is still mounted
    if (!isMountedRef.current) return;

    // Hide feedback
    setShowFeedback(false);

    // Resume timer after feedback (if timer exists and not expired)
    if (gameState.stateTimer && !isTimerExpired()) {
      resumeStateTimer();
    }

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    if (isLastQuestion) {
      // End of Quiz Logic
      // Check total wrong answers from context (which includes the latest answer)
      const totalWrong = gameState.wrongAnswerCount;

      // If answer just submitted was WRONG, local totalWrong in context might not be updated yet in this render cycle?
      // answerQuestion updates state immediately, but gameState in this scope is from render start.
      // However, we can't easily access the *next* state here.
      // Better approach: We know the result of the *current* answer from feedbackIsCorrect.
      // If current answer was WRONG, we add 1 to current count.
      
      // Actually, simpler: The context updates immediately. But React batches updates.
      // Let's trust the user flow: User sees feedback overlay -> dismisses it.
      // By the time dismiss happens, context *should* have updated?
      // Let's use a functional state update or ref if needed, but for now let's rely on the fact that 
      // feedback overlay showed the result, so state update definitely fired.
      
      // Wait, if we are in the same render cycle as when we showed feedback, gameState is stale.
      // But handleFeedbackDismiss is a *new* event handler call (user pressed dismiss).
      // So gameState *should* be fresh from the latest render *if* the component re-rendered.
      // Did it re-render? answerQuestion called setGameState. Yes.
      
      if (totalWrong > 0) {
        // Any wrong answers -> Failure
        setShowGagalModal(true);
      } else {
        // Perfect score -> Success
        if (!hasCompletedRef.current && state) {
          hasCompletedRef.current = true;
          completeState(state);
        }
      }
      
      setIsAnswering(false);
    } else {
      // Move to next question
      setCurrentQuestionIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        playQuestionTransitionSound(); // Soft transition between questions
        setIsAnswering(false);
        return nextIndex;
      });
    }
  };

  const handleSuccessContinue = () => {
    if (!isMountedRef.current) return;
    setShowSuccessModal(false);
    clearStateTimer();
    router.back(); // Return to map
  };

  const handleSuccessRestart = () => {
    if (!isMountedRef.current || !state) return;
    setShowSuccessModal(false);
    clearStateAnswers(state); // Clear previous answers for fresh start
    setCurrentQuestionIndex(0);
    setQuestionIndexForState(state, 0);
    setIsAnswering(false); // Reset answer lock on restart
    hasCompletedRef.current = false; // Allow completion detection again after restart
    // Restart timer for states with timers
    if (state) {
      clearStateTimer();
      startStateTimer(state);
    }
  };

  const handleTimerExpire = () => {
    // When timer expires, auto-complete the state
    if (!isMountedRef.current || !state) return;

    // Mark state as completed even if not all questions answered
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      completeState(state);
    }
  };

  const handleGagalRetry = () => {
    if (!isMountedRef.current || !state) return;
    setShowGagalModal(false);
    resetWrongAnswerCount();
    clearStateAnswers(state);
    setCurrentQuestionIndex(0);
    setQuestionIndexForState(state, 0);
    setIsAnswering(false);
    hasCompletedRef.current = false;
    clearStateTimer();
    startStateTimer(state);
  };

  const handleGagalBackToMap = () => {
    if (!isMountedRef.current) return;
    setShowGagalModal(false);
    resetWrongAnswerCount();
    clearStateTimer();
    router.back();
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multipleChoice':
        return (
          <MultipleChoiceQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      case 'trueFalse':
        return (
          <TrueFalseQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      case 'fillBlank':
        return (
          <FillBlankQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      case 'matching':
        return (
          <MatchingQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      default:
        return <Text>Unknown question type</Text>;
    }
  };

  return (
    <ImageBackground
      source={ASSETS.shared.backgrounds.main}
      style={styles.container}
      resizeMode="cover">
      <StatusBar state={state} />

      {/* Countdown Timer (only shown for states with timers) */}
      {gameState.stateTimer && (
        <CountdownTimer
          allowFontScaling={gameState.allowFontScaling}
          onExpire={handleTimerExpire}
        />
      )}

      <MenuButton size="small" />

      <View style={styles.content}>
        {currentQuestion && (
          <Animated.View
            key={currentQuestion.id}
            entering={SlideInRight.duration(400)}
            exiting={SlideOutLeft.duration(400)}
            style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
          >
            {renderQuestion()}
          </Animated.View>
        )}
      </View>

      {/* Feedback Overlay */}
      <FeedbackOverlay
        visible={showFeedback}
        isCorrect={feedbackIsCorrect}
        explanation={feedbackExplanation}
        onDismiss={handleFeedbackDismiss}
      />

      <SuccessModal
        visible={showSuccessModal}
        onContinue={handleSuccessContinue}
        onRestart={handleSuccessRestart}
      />

      <GagalModal
        visible={showGagalModal}
        onRetry={handleGagalRetry}
        onBackToMap={handleGagalBackToMap}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    // fontSize set dynamically
    color: GameFeedback.wrong.color,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  backButtonText: {
    color: Colors.textLight,
    // fontSize set dynamically
    fontWeight: 'bold',
  },
});
