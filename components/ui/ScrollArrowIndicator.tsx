import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { getResponsiveSizeScaled } from '@/constants/layout';

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

export default function ScrollArrowIndicator({
  visible,
  direction = 'down',
  color = '#000000',
  size = 20,
  bottom = 10,
  pulse = true,
}: ScrollArrowIndicatorProps) {
  const { width } = useWindowDimensions();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (visible && pulse) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 1;
    }
  }, [visible, pulse, opacity]);

  // Must be above early return (hooks rules)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse ? opacity.value : 1,
  }));

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
      style={[styles.container, { bottom: responsiveBottom }]}
      pointerEvents="none"
    >
      <Animated.Text
        style={[
          styles.arrow,
          {
            fontSize: responsiveSize,
            color,
          },
          animatedStyle,
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
