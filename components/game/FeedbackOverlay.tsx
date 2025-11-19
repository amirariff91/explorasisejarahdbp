import {
  BorderRadius,
  Colors,
  getTextShadowStyle,
  getResponsiveFontSize,
  Shadows,
  Typography,
  GameFeedback,
} from '@/constants/theme';
import { getResponsiveSizeScaled } from '@/constants/layout';
import { playRandomFeedback } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions, Pressable, TouchableWithoutFeedback, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useGameContext } from '@/contexts/GameContext';

interface FeedbackOverlayProps {
  visible: boolean;
  isCorrect: boolean;
  explanation?: string;
  onDismiss: () => void;
}

/**
 * FeedbackOverlay Component
 * Shows immediate visual feedback after answering a question
 * - ✓ BETUL! (green celebration) for correct answers
 * - ✗ CUBA LAGI! (red shake) for wrong answers
 * - Displays explanation text if provided
 * - User can dismiss by tapping the close button or anywhere on the overlay
 */
export default function FeedbackOverlay({
  visible,
  isCorrect,
  explanation,
  onDismiss,
}: FeedbackOverlayProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Simple responsive sizing
  const iconSize = getResponsiveSizeScaled(60, width);
  const feedbackTextSize = getResponsiveFontSize('question', width);
  const explanationTextSize = getResponsiveFontSize('answer', width);
  const closeButtonSize = getResponsiveSizeScaled(40, width);
  const closeIconSize = getResponsiveFontSize('question', width);
  const hintTextSize = getResponsiveFontSize('clue', width);

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

      // Audio feedback (voice) - randomized for variety
      playRandomFeedback(isCorrect, false); // false = disable encouragement to prevent double sound

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
    } else {
      // Reset animations when hidden
      scale.value = 0;
      opacity.value = 0;
      translateX.value = 0;
      explainOpacity.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isCorrect]);

  // Auto-show scroll hint after 1 second if content overflows
  useEffect(() => {
    if (visible && explanation) {
      const timer = setTimeout(() => {
        setShowScrollHint(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowScrollHint(false);
      setIsAtBottom(false);
    }
  }, [visible, explanation]);

  // Scroll handler
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isScrolledToBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 5;
    setIsAtBottom(isScrolledToBottom);

    // Dismiss hint on scroll
    if (contentOffset.y > 5 && showScrollHint) {
      setShowScrollHint(false);
    }
  };

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
    <TouchableWithoutFeedback onPress={onDismiss}>
      <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
        {/* Close Button */}
        <Pressable
          onPress={onDismiss}
          style={[
            styles.closeButton,
            {
              width: closeButtonSize,
              height: closeButtonSize,
              top: Math.max(insets.top, getResponsiveSizeScaled(20, width)),
              right: Math.max(insets.right, getResponsiveSizeScaled(20, width)),
              borderRadius: closeButtonSize / 2, // Make it circular
            },
          ]}
          hitSlop={16}>
          <Text
            style={[
              styles.closeIcon,
              { 
                fontSize: closeIconSize * 0.8,
                lineHeight: closeButtonSize, // Center vertically
                textAlign: 'center', // Center horizontally
              },
            ]}
            allowFontScaling={allowScaling}>
            ✕
          </Text>
        </Pressable>

        {/* Content Container - Stop propagation for scrolling */}
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            {/* Feedback Icon & Text */}
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <Text
                style={[
                  styles.icon,
                  { fontSize: iconSize },
                  isCorrect ? styles.iconCorrect : styles.iconWrong
                ]}
                allowFontScaling={allowScaling}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}>
                {isCorrect ? '✓' : '✗'}
              </Text>
              <Text
                style={[
                  styles.feedbackText,
                  { fontSize: feedbackTextSize },
                  isCorrect ? styles.feedbackTextCorrect : styles.feedbackTextWrong,
                ]}
                allowFontScaling={allowScaling}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}>
                {isCorrect ? 'BETUL!' : 'CUBA LAGI!'}
              </Text>
            </Animated.View>

            {/* Explanation Text */}
            {explanation && (
              <Animated.View style={[styles.explanationContainer, explanationAnimatedStyle]}>
                <ScrollView
                  style={styles.explanationScroll}
                  showsVerticalScrollIndicator={true}
                  bounces={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}>
                  <Text
                    style={[
                      styles.explanationText,
                      {
                        fontSize: explanationTextSize,
                        lineHeight: explanationTextSize * Typography.lineHeight.relaxed,
                      },
                    ]}
                    allowFontScaling={allowScaling}>
                    {explanation}
                  </Text>
                </ScrollView>

                {/* Scroll Hint - Shows after 1 second if content overflows */}
                {showScrollHint && !isAtBottom && (
                  <Text
                    style={[
                      styles.scrollHint,
                      {
                        fontSize: hintTextSize,
                      },
                    ]}
                    allowFontScaling={allowScaling}>
                    Baca lagi ↓
                  </Text>
                )}
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </TouchableWithoutFeedback>
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
    // fontSize set dynamically based on screen width
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconCorrect: {
    color: GameFeedback.correct.color, // Green
  },
  iconWrong: {
    color: GameFeedback.wrong.color, // Red
  },
  feedbackText: {
    fontFamily: Typography.fontFamily,
    // fontSize set dynamically based on screen width
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
    ...getTextShadowStyle(Shadows.text.strong),
  },
  feedbackTextCorrect: {
    color: GameFeedback.correct.color,
  },
  feedbackTextWrong: {
    color: GameFeedback.wrong.color,
  },
  explanationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: BorderRadius.small,
    padding: 16,
    maxWidth: '100%',
    maxHeight: 200, // Prevent overflow, allow scrolling
  },
  explanationScroll: {
    maxHeight: 168, // Container padding (16*2) subtracted from maxHeight
  },
  explanationText: {
    // Dynamic: fontSize, lineHeight
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    // Dynamic: top, right, width, height
    zIndex: 10000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeIcon: {
    // Dynamic: fontSize
    color: GameFeedback.wrong.color, // Red color matching wrong answer
    fontFamily: Typography.fontFamily, // Galindo
    fontWeight: 'normal',
  },
  scrollHint: {
    // Dynamic: fontSize
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
