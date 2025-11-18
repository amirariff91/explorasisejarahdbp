import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getResponsiveSizeScaled } from '@/constants/layout';

interface ScrollGradientOverlayProps {
  /**
   * Whether to show the gradient (typically when not scrolled to bottom)
   */
  visible: boolean;

  /**
   * Base height of the gradient in pixels (will be scaled responsively)
   * @default 40
   */
  height?: number;

  /**
   * Gradient colors from transparent to solid
   * @default ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
   */
  colors?: string[];

  /**
   * Opacity of the entire gradient overlay
   * @default 1.0 (fully opaque)
   */
  opacity?: number;

  /**
   * Bottom position offset (for positioning above bottom elements)
   * @default 0
   */
  bottom?: number;

  /**
   * Horizontal padding to inset the gradient from container edges
   * @default 0
   */
  paddingHorizontal?: number;
}

/**
 * Reusable gradient fade overlay for scrollable content.
 * Shows a gradient at the bottom to indicate more content below.
 *
 * Usage:
 * ```tsx
 * const [isAtBottom, setIsAtBottom] = useState(false);
 *
 * <ScrollView onScroll={handleScroll}>
 *   {content}
 * </ScrollView>
 * <ScrollGradientOverlay visible={!isAtBottom} />
 * ```
 */
export default function ScrollGradientOverlay({
  visible,
  height = 40,
  colors = ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)'],
  opacity = 1.0,
  bottom = 0,
  paddingHorizontal = 0,
}: ScrollGradientOverlayProps) {
  const { width } = useWindowDimensions();

  const responsiveHeight = getResponsiveSizeScaled(height, width);
  const responsivePadding = paddingHorizontal > 0 ? getResponsiveSizeScaled(paddingHorizontal, width) : 0;

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          height: responsiveHeight,
          bottom,
          opacity,
          left: responsivePadding,
          right: responsivePadding,
        },
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});
