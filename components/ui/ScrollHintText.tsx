import React, { useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { getResponsiveFontSize } from '@/constants/theme';

interface ScrollHintTextProps {
  /**
   * Hint text to display (e.g., "Leret untuk lihat semua ↓")
   */
  text: string;

  /**
   * Whether the hint is visible
   */
  visible: boolean;

  /**
   * Duration in milliseconds before auto-hiding
   * @default 3000 (3 seconds)
   */
  autoDismissDelay?: number;

  /**
   * Callback when hint is dismissed (auto or manual)
   */
  onDismiss?: () => void;

  /**
   * Font size context for responsive scaling
   * @default 'clue'
   */
  fontSizeContext?: 'question' | 'answer' | 'clue' | 'stateLabel';

  /**
   * Text color
   * @default '#8B4513' (brown)
   */
  color?: string;

  /**
   * Whether to use bold font weight
   * @default false
   */
  bold?: boolean;
}

export default function ScrollHintText({
  text,
  visible,
  autoDismissDelay = 3000,
  onDismiss,
  fontSizeContext = 'clue',
  color = '#8B4513',
  bold = false,
}: ScrollHintTextProps) {
  const { width } = useWindowDimensions();
  const opacity = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });

      timeoutRef.current = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished && onDismiss) {
            runOnJS(onDismiss)();
          }
        });
      }, autoDismissDelay);
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, autoDismissDelay, opacity, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fontSize = getResponsiveFontSize(fontSizeContext, width);

  return (
    <Animated.Text
      style={[
        styles.hintText,
        {
          fontSize,
          color,
          fontWeight: bold ? 'bold' : 'normal',
        },
        animatedStyle,
      ]}
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  hintText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 4,
  },
});
