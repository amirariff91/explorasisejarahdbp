import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { getResponsiveSizeScaled, getResponsiveFontSize } from '@/constants/layout';

interface ScrollArrowIndicatorProps {
  /**
   * Whether the arrow is visible
   */
  visible: boolean;

  /**
   * Direction of the arrow
   * @default 'down'
   */
  direction?: 'up' | 'down' | 'left' | 'right';

  /**
   * Arrow color
   * @default '#000000'
   */
  color?: string;

  /**
   * Base size of the arrow in pixels (will be scaled responsively)
   * @default 20
   */
  size?: number;

  /**
   * Position from bottom edge
   * @default 10
   */
  bottom?: number;

  /**
   * Whether to enable pulsing animation
   * @default true
   */
  pulse?: boolean;
}

/**
 * Reusable arrow indicator for scroll affordance.
 * Shows a pulsing arrow to indicate scrollable content in a direction.
 *
 * Usage:
 * ```tsx
 * const [hasMoreContent, setHasMoreContent] = useState(true);
 *
 * <View style={{ position: 'relative' }}>
 *   <ScrollView>
 *     {content}
 *   </ScrollView>
 *   <ScrollArrowIndicator
 *     visible={hasMoreContent}
 *     direction="down"
 *     color="#4169E1"
 *   />
 * </View>
 * ```
 */
export default function ScrollArrowIndicator({
  visible,
  direction = 'down',
  color = '#000000',
  size = 20,
  bottom = 10,
  pulse = true,
}: ScrollArrowIndicatorProps) {
  const { width } = useWindowDimensions();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible && pulse) {
      // Create pulsing loop animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
        pulseAnim.setValue(1);
      };
    } else {
      pulseAnim.setValue(1);
    }
  }, [visible, pulse, pulseAnim]);

  if (!visible) {
    return null;
  }

  const responsiveSize = getResponsiveSizeScaled(size, width);
  const responsiveBottom = getResponsiveSizeScaled(bottom, width);

  const arrowSymbols = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: responsiveBottom,
        },
      ]}
      pointerEvents="none"
    >
      <Animated.Text
        style={[
          styles.arrow,
          {
            fontSize: responsiveSize,
            color,
            opacity: pulse ? pulseAnim : 1,
          },
        ]}
      >
        {arrowSymbols[direction]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  arrow: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
});
