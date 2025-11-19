import { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  BorderRadius,
} from '@/constants/theme';
import { isLandscapeMode, getEdgeMargin, getResponsiveSizeScaled } from '@/constants/layout';

interface ProgressBarProps {
  currentQuestion: number; // 1-based index (e.g., 1, 2, 3)
  totalQuestions: number;
}

/**
 * ProgressBar Component
 * Shows quiz progress with animated bar and question counter
 * - "Soalan 3 daripada 10" text
 * - Animated gradient progress bar with shimmer
 * - Positioned below StatusBar with safe area awareness
 * - Responsive sizing for landscape/portrait
 */
export default function ProgressBar({ currentQuestion, totalQuestions }: ProgressBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = isLandscapeMode(width);
  const edgeMargin = getEdgeMargin(isLandscape);

  // Responsive height: slightly thicker on tablets
  const barHeight = getResponsiveSizeScaled(12, width);

  // Calculate progress percentage (0-100)
  const progressPercent = (currentQuestion / totalQuestions) * 100;

  // Animation value - initialize with current percentage
  const progressWidth = useSharedValue(progressPercent);
  
  // Shimmer animation
  const shimmerTranslate = useSharedValue(-100);

  // Animate progress bar when currentQuestion changes
  useEffect(() => {
    progressWidth.value = withSpring(progressPercent, {
      damping: 15,
      stiffness: 100,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, totalQuestions]);

  // Continuous shimmer effect
  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(200, { duration: 1500, easing: Easing.linear }),
      -1,
      true // reverse
    );
  }, [shimmerTranslate]);

  // Animated style for progress fill
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Animated style for shimmer
  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${shimmerTranslate.value}%` }],
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
      <View style={[styles.progressBarContainer, { height: barHeight }]}>
        {/* Background Bar */}
        <View style={styles.progressBarBackground} />

        {/* Animated Progress Fill */}
        <Animated.View style={[styles.progressBarFill, progressAnimatedStyle]}>
           {/* Shimmer Effect Overlay */}
           <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
        </Animated.View>
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
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressBarContainer: {
    // height set dynamically
    position: 'relative',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Darker background for better contrast
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: Colors.gold, // Gold color
    borderRadius: BorderRadius.full,
    overflow: 'hidden', // Keep shimmer inside
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
});
