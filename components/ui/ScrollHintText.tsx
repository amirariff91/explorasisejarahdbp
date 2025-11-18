import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
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

/**
 * Reusable auto-dismissing hint text component for scroll affordance.
 * Fades in on mount, stays visible for specified duration, then fades out.
 *
 * Usage:
 * ```tsx
 * const [showHint, setShowHint] = useState(true);
 *
 * <ScrollHintText
 *   text="Leret untuk lihat semua pilihan ↓"
 *   visible={showHint}
 *   onDismiss={() => setShowHint(false)}
 * />
 * ```
 */
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after delay
      timeoutRef.current = setTimeout(() => {
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onDismiss?.();
        });
      }, autoDismissDelay);
    } else {
      // Immediate fade out if visible changes to false
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, autoDismissDelay, fadeAnim, onDismiss]);

  if (!visible && fadeAnim._value === 0) {
    return null;
  }

  const fontSize = getResponsiveFontSize(fontSizeContext, width);

  return (
    <Animated.Text
      style={[
        styles.hintText,
        {
          fontSize,
          color,
          fontWeight: bold ? 'bold' : 'normal',
          opacity: fadeAnim,
        },
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
