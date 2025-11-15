import { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  BorderRadius,
} from '@/constants/theme';
import { isLandscapeMode, getEdgeMargin } from '@/constants/layout';

interface ProgressBarProps {
  currentQuestion: number; // 1-based index (e.g., 1, 2, 3)
  totalQuestions: number;
}

/**
 * ProgressBar Component
 * Shows quiz progress with animated bar and question counter
 * - "Soalan 3 daripada 10" text
 * - Animated gradient progress bar
 * - Positioned below StatusBar with safe area awareness
 * - Responsive sizing for landscape/portrait
 */
export default function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = isLandscapeMode(width);
  const edgeMargin = getEdgeMargin(isLandscape);

  // Calculate progress percentage (0-100)
  const progressPercent = (currentQuestion / totalQuestions) * 100;

  // Animation value - initialize with current percentage to prevent initial animation
  const progressWidth = useSharedValue(progressPercent);

  // Animate progress bar when currentQuestion changes
  useEffect(() => {
    progressWidth.value = withSpring(progressPercent, {
      damping: 15,
      stiffness: 100,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, totalQuestions]);

  // Animated style for progress fill
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: edgeMargin,
          marginTop: insets.top > 0 ? 4 : 8, // Closer spacing if safe area present
        },
      ]}>
      {/* Question Counter */}
      <Text
        style={[
          styles.counterText,
          // Use unified responsive typography scale (answer text size tier)
          { fontSize: getResponsiveFontSize('answer', width) },
        ]}>
        Soalan {currentQuestion} daripada {totalQuestions}
      </Text>

      {/* Progress Bar Container */}
      <View style={styles.progressBarContainer}>
        {/* Background Bar */}
        <View style={styles.progressBarBackground} />

        {/* Animated Progress Fill */}
        <Animated.View style={[styles.progressBarFill, progressAnimatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    zIndex: 5, // Below StatusBar but above questions
  },
  counterText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 10,
    position: 'relative',
    borderRadius: BorderRadius.small,
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.primary, // Gold/yellow
    borderRadius: BorderRadius.small,
  },
});
