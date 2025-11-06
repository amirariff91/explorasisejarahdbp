import { useGameContext } from '@/contexts/GameContext';
import { getQuestionsForState } from '@/data/questions';
import type { AnswerValue, MalaysianState, Question } from '@/types';
import { playAmbient, playMusic, playSound, stopAllAmbient, stopMusic } from '@/utils/audio';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { ASSETS } from '@/constants/assets';

// Question Components
import CrosswordQuestion from '@/components/game/questions/CrosswordQuestion';
import FillBlankQuestion from '@/components/game/questions/FillBlankQuestion';
import MatchingQuestion from '@/components/game/questions/MatchingQuestion';
import MultipleChoiceQuestion from '@/components/game/questions/MultipleChoiceQuestion';
import TrueFalseQuestion from '@/components/game/questions/TrueFalseQuestion';

// UI Components
import FeedbackOverlay from '@/components/game/FeedbackOverlay';
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
    setCurrentState,
    setQuestionIndexForState,
  } = useGameContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Feedback overlay state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackIsCorrect, setFeedbackIsCorrect] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState<string | undefined>(undefined);
  const [feedbackMoneyChange, setFeedbackMoneyChange] = useState<number | undefined>(undefined);
  const [feedbackHealthChange, setFeedbackHealthChange] = useState<number | undefined>(undefined);

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

  // Track current playing state in global context for persistence and voice playback
  // NOTE: setCurrentState is intentionally omitted from deps to prevent infinite loop.
  // React's setState functions are stable and don't need to be in the dependency array.
  useEffect(() => {
    if (state) setCurrentState(state);
    return () => setCurrentState(null);
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

  // Handle state completion when all questions are answered
  // Guard by verifying every question has a recorded answer
  useEffect(() => {
    if (!state || questions.length === 0 || !isMountedRef.current) return;
    // All questions must have an answer recorded in GameContext
    const allAnswered = questions.every((q) => gameState.answers[q.id] !== undefined);
    if (allAnswered && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      completeState(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, gameState.answers, state]);

  // Play quiz background music on mount
  useEffect(() => {
    playMusic('bgm-quiz', true, 2000); // Fade in quiz theme
    playAmbient('ambient-quiz-soft', 0.15); // Very subtle concentration ambience

    return () => {
      stopMusic(1000); // Fade out when leaving quiz
      stopAllAmbient();
    };
  }, []);

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
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back to Map</Text>
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
    console.error(`Question index ${currentQuestionIndex} out of bounds for state ${state}`);
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

    // Show feedback overlay with result
    setFeedbackIsCorrect(result.isCorrect);
    setFeedbackExplanation(result.explanation);
    setFeedbackMoneyChange(result.moneyChange);
    setFeedbackHealthChange(result.healthChange);
    setShowFeedback(true);

    // Clear any existing timer
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
      answerTimerRef.current = null;
    }

    // Move to next question after feedback is shown (2 seconds)
    answerTimerRef.current = setTimeout(() => {
      // Safety check: only proceed if component is still mounted
      if (!isMountedRef.current) return;

      // Hide feedback
      setShowFeedback(false);

      setCurrentQuestionIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex < questions.length) {
          // More questions remaining - play transition sound
          playSound('transition', { volume: 0.5 }); // Soft transition between questions
          setIsAnswering(false);
          // NOTE: setQuestionIndexForState removed from here to prevent setState during render.
          // Question index sync is now handled by useEffect watching currentQuestionIndex changes.
          return nextIndex;
        } else {
          // All questions completed - don't call setState here
          setIsAnswering(false);
          return prevIndex;
        }
      });

      answerTimerRef.current = null;
    }, 2000); // Increased from 1000ms to 2000ms to show feedback
  };

  const handleFeedbackDismiss = () => {
    // Callback when feedback auto-dismisses (handled by timer above)
    setShowFeedback(false);
  };

  const handleSuccessContinue = () => {
    if (!isMountedRef.current) return;
    setShowSuccessModal(false);
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
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multipleChoice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      case 'trueFalse':
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      case 'fillBlank':
        return (
          <FillBlankQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      case 'matching':
        return (
          <MatchingQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        );
      case 'crossword':
        return (
          <CrosswordQuestion
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

      <MenuButton size="small" />

      <View style={styles.content}>{renderQuestion()}</View>

      {/* Feedback Overlay */}
      <FeedbackOverlay
        visible={showFeedback}
        isCorrect={feedbackIsCorrect}
        explanation={feedbackExplanation}
        moneyChange={feedbackMoneyChange}
        healthChange={feedbackHealthChange}
        onDismiss={handleFeedbackDismiss}
      />

      <SuccessModal
        visible={showSuccessModal}
        onContinue={handleSuccessContinue}
        onRestart={handleSuccessRestart}
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
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
