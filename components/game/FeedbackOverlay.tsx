import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { playFeedback } from '@/utils/audio';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getTextShadowStyle,
  Shadows,
} from '@/constants/theme';

interface FeedbackOverlayProps {
  visible: boolean;
  isCorrect: boolean;
  explanation?: string;
  moneyChange?: number;
  healthChange?: number;
  onDismiss: () => void;
}

/**
 * FeedbackOverlay Component
 * Shows immediate visual feedback after answering a question
 * - ✓ BETUL! (green celebration) for correct answers
 * - ✗ TIDAK TEPAT (red shake) for wrong answers
 * - Displays explanation text if provided
 * - Auto-dismisses after 2 seconds
 */
export default function FeedbackOverlay({
  visible,
  isCorrect,
  explanation,
  moneyChange,
  healthChange,
  onDismiss,
}: FeedbackOverlayProps) {
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const explainOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      // Audio feedback (voice)
      playFeedback(isCorrect);

      // Fade in background
      opacity.value = withTiming(1, { duration: 200 });

      if (isCorrect) {
        // Correct answer: Bounce in with celebration
        scale.value = withSequence(
          withSpring(1.2, { damping: 8, stiffness: 100 }),
          withSpring(1, { damping: 10, stiffness: 150 })
        );
      } else {
        // Wrong answer: Shake animation
        scale.value = withSpring(1, { damping: 10 });
        translateX.value = withSequence(
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-10, { duration: 50 }),
          withTiming(0, { duration: 50 })
        );
      }

      // Fade in explanation text after icon animation
      explainOpacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) });

      // Auto-dismiss after 2 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // Reset animations when hidden
      scale.value = 0;
      opacity.value = 0;
      translateX.value = 0;
      explainOpacity.value = 0;
    }
  }, [visible, isCorrect]);

  // Animated styles
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  const explanationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: explainOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
      <View style={styles.container}>
        {/* Feedback Icon & Text */}
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <Text style={[styles.icon, isCorrect ? styles.iconCorrect : styles.iconWrong]}>
            {isCorrect ? '✓' : '✗'}
          </Text>
          <Text
            style={[
              styles.feedbackText,
              isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextWrong,
            ]}>
            {isCorrect ? 'BETUL!' : 'TIDAK TEPAT'}
          </Text>

          {/* Resource Changes (Money & Health) */}
          {!isCorrect && (moneyChange !== undefined || healthChange !== undefined) && (
            <View style={styles.changesContainer}>
              {moneyChange !== undefined && moneyChange !== 0 && (
                <Text style={styles.changeText}>
                  💰 {moneyChange > 0 ? '+' : ''}RM{moneyChange}
                </Text>
              )}
              {healthChange !== undefined && healthChange !== 0 && (
                <Text style={styles.changeText}>
                  ❤️ {healthChange > 0 ? '+' : ''}{healthChange}%
                </Text>
              )}
            </View>
          )}
        </Animated.View>

        {/* Explanation Text */}
        {explanation && (
          <Animated.View style={[styles.explanationContainer, explanationAnimatedStyle]}>
            <ScrollView
              style={styles.explanationScroll}
              showsVerticalScrollIndicator={true}
              bounces={false}>
              <Text style={styles.explanationText}>{explanation}</Text>
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9997, // Below modals (9998-9999) but above everything else
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    maxWidth: '80%',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconCorrect: {
    color: '#4CAF50', // Green
  },
  iconWrong: {
    color: '#f44336', // Red
  },
  feedbackText: {
    fontFamily: Typography.fontFamily,
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    ...getTextShadowStyle(Shadows.text.strong),
  },
  feedbackTextCorrect: {
    color: '#4CAF50',
  },
  feedbackTextWrong: {
    color: '#f44336',
  },
  changesContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    justifyContent: 'center',
  },
  changeText: {
    fontFamily: Typography.fontFamily,
    fontSize: 18,
    fontWeight: Typography.fontWeight.bold,
    color: '#ff9800', // Orange for negative changes
    ...getTextShadowStyle(Shadows.text.medium),
  },
  explanationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    maxWidth: '100%',
    maxHeight: 200, // Prevent overflow, allow scrolling
  },
  explanationScroll: {
    maxHeight: 168, // Container padding (16*2) subtracted from maxHeight
  },
  explanationText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed,
  },
});
