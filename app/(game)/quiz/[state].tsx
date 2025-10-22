import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, useWindowDimensions, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';
import { getQuestionsForState } from '@/data/questions';
import type { MalaysianState, Question } from '@/types';

// Question Components
import MultipleChoiceQuestion from '@/components/game/questions/MultipleChoiceQuestion';
import TrueFalseQuestion from '@/components/game/questions/TrueFalseQuestion';
import FillBlankQuestion from '@/components/game/questions/FillBlankQuestion';
import MatchingQuestion from '@/components/game/questions/MatchingQuestion';
import CrosswordQuestion from '@/components/game/questions/CrosswordQuestion';

// UI Components
import StatusBar from '@/components/game/StatusBar';
import MenuButton from '@/components/game/MenuButton';
import SuccessModal from '@/components/game/SuccessModal';

/**
 * Quiz Screen - Dynamic Route
 * Handles all question types for a specific state
 */
export default function QuizScreen() {
  const router = useRouter();
  const { state } = useLocalSearchParams<{ state: MalaysianState }>();
  const { width } = useWindowDimensions();
  const { gameState, answerQuestion, completeState, showSuccessModal, setShowSuccessModal } =
    useGameContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldComplete, setShouldComplete] = useState(false);
  const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state) {
      const stateQuestions = getQuestionsForState(state);
      if (stateQuestions.length === 0) {
        setError(`No questions found for ${state}. Please try another state.`);
      } else {
        setQuestions(stateQuestions);
        setCurrentQuestionIndex(0); // Reset index when state changes - FIX: Prevents cross-state crashes
        setShouldComplete(false); // Reset completion flag on new state
        setError(null);
      }
    }
  }, [state]);

  // Cleanup timer on unmount or navigation
  useEffect(() => {
    return () => {
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
      }
    };
  }, []);

  // Watch for completion flag and complete state after render
  useEffect(() => {
    if (shouldComplete && state) {
      completeState(state);
      setShouldComplete(false); // Reset flag
    }
  }, [shouldComplete, state, completeState]);

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

  const handleAnswer = (answer: any) => {
    // Prevent double-submit
    if (isAnswering) return;
    setIsAnswering(true);

    const result = answerQuestion(currentQuestion.id, answer, currentQuestion);

    // Clear any existing timer
    if (answerTimerRef.current) {
      clearTimeout(answerTimerRef.current);
    }

    // Move to next question or complete state
    answerTimerRef.current = setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => {
        // Use functional update to avoid stale closure
        if (prevIndex < questions.length - 1) {
          setIsAnswering(false); // Re-enable for next question
          return prevIndex + 1;
        } else {
          // All questions completed - flag for completion after render
          setIsAnswering(false);
          setShouldComplete(true); // ✅ Set flag instead of calling completeState directly
          return prevIndex;
        }
      });
      answerTimerRef.current = null; // Clear ref after timer executes
    }, 1000);
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    router.back(); // Return to map
  };

  const handleSuccessRestart = () => {
    setShowSuccessModal(false);
    setCurrentQuestionIndex(0);
    setIsAnswering(false); // Reset answer lock on restart
    setShouldComplete(false); // Reset completion flag
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multipleChoice':
        return <MultipleChoiceQuestion question={currentQuestion} onAnswer={handleAnswer} />;
      case 'trueFalse':
        return <TrueFalseQuestion question={currentQuestion} onAnswer={handleAnswer} />;
      case 'fillBlank':
        return <FillBlankQuestion question={currentQuestion} onAnswer={handleAnswer} />;
      case 'matching':
        return <MatchingQuestion question={currentQuestion} onAnswer={handleAnswer} />;
      case 'crossword':
        return <CrosswordQuestion question={currentQuestion} onAnswer={handleAnswer} />;
      default:
        return <Text>Unknown question type</Text>;
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/game/backgrounds/bg-main.png')}
      style={styles.container}
      resizeMode="cover">
      <StatusBar state={state} />
      <MenuButton />

      <View style={styles.content}>{renderQuestion()}</View>

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
