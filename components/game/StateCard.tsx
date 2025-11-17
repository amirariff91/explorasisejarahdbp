import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useEffect, useMemo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { playSound } from '@/utils/audio';
import type { MalaysianState } from '@/types';
import { Typography, Colors, getTextShadowStyle, Shadows, StateVisuals, BorderRadius, getResponsiveFontSize } from '@/constants/theme';
import { getResponsiveSizeScaled } from '@/constants/layout';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StateCardProps {
  stateId: MalaysianState;
  stateName: string;
  isCompleted: boolean;
  isRecommended?: boolean;
  onPress: (state: MalaysianState) => void;
}

/**
 * StateCard Component
 * Visual card for selecting a Malaysian state on the map screen
 * Shows colorful gradient, icon, state name, and completion status
 */
export default function StateCard({
  stateId,
  stateName,
  isCompleted,
  isRecommended = false,
  onPress,
}: StateCardProps) {
  const { width } = useWindowDimensions();

  // Get visual theme for this state
  const visuals = StateVisuals[stateId];

  // Calculate responsive dimensions
  const dimensions = useMemo(() => ({
    cardWidth: getResponsiveSizeScaled(100, width),
    cardHeight: getResponsiveSizeScaled(90, width),
    borderWidth: getResponsiveSizeScaled(4, width),
    padding: getResponsiveSizeScaled(8, width),
    emojiSize: getResponsiveSizeScaled(48, width),
    emojiMargin: getResponsiveSizeScaled(4, width),
    stateNameSize: getResponsiveFontSize('clue', width), // Uses clue scale (12→18px)
    checkmarkContainer: getResponsiveSizeScaled(20, width),
    checkmarkSize: getResponsiveSizeScaled(14, width),
    checkmarkInset: getResponsiveSizeScaled(4, width),
    badgeInset: getResponsiveSizeScaled(-8, width),
    badgePaddingH: getResponsiveSizeScaled(6, width),
    badgePaddingV: getResponsiveSizeScaled(2, width),
    badgeBorder: getResponsiveSizeScaled(2, width),
    badgeTextSize: getResponsiveSizeScaled(8, width),
    shadowOffset: getResponsiveSizeScaled(3, width),
    shadowRadius: getResponsiveSizeScaled(2, width),
  }), [width]);

  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  // Pulse animation for incomplete states (attract attention)
  useEffect(() => {
    if (!isCompleted) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1000 }),
          withTiming(1.0, { duration: 1000 })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      pulseScale.value = 1;
    }
  }, [isCompleted, pulseScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  const handlePress = async () => {
    // Audio feedback
    playSound('click');

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Button animation (more pronounced press)
    scale.value = withSequence(
      withSpring(0.92, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    // Navigate to state
    onPress(stateId);
  };

  return (
    <AnimatedPressable
      style={[
        styles.card,
        {
          width: dimensions.cardWidth,
          height: dimensions.cardHeight,
          borderWidth: dimensions.borderWidth,
          padding: dimensions.padding,
          backgroundColor: visuals.color,
          borderColor: visuals.borderColor,
          shadowOffset: { width: dimensions.shadowOffset, height: dimensions.shadowOffset },
          shadowRadius: dimensions.shadowRadius,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${stateName} state, ${isCompleted ? 'completed with checkmark' : 'not started, tap to begin quiz'}`}
      accessibilityHint="Double tap to start quiz for this state"
    >
      {/* Big Emoji Icon */}
      <Text style={[styles.emoji, { fontSize: dimensions.emojiSize, marginBottom: dimensions.emojiMargin }]}>
        {visuals.emoji}
      </Text>

      {/* State Name */}
      <Text
        style={[styles.stateName, { fontSize: dimensions.stateNameSize }]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {stateName}
      </Text>

      {/* Completion Checkmark */}
      {isCompleted && (
        <View style={[
          styles.checkmarkContainer,
          {
            top: dimensions.checkmarkInset,
            right: dimensions.checkmarkInset,
            width: dimensions.checkmarkContainer,
            height: dimensions.checkmarkContainer,
          }
        ]}>
          <Text style={[styles.checkmark, { fontSize: dimensions.checkmarkSize }]}>✓</Text>
        </View>
      )}

      {/* Recommended Badge */}
      {isRecommended && !isCompleted && (
        <View style={[
          styles.recommendedBadge,
          {
            top: dimensions.badgeInset,
            right: dimensions.badgeInset,
            paddingHorizontal: dimensions.badgePaddingH,
            paddingVertical: dimensions.badgePaddingV,
            borderWidth: dimensions.badgeBorder,
          }
        ]}>
          <Text style={[styles.recommendedText, { fontSize: dimensions.badgeTextSize }]}>Seterusnya</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // Dynamic: width, height, borderWidth, padding, shadowOffset, shadowRadius
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Outer shadow (bottom-right depth) - illustrated button style
    shadowColor: '#000',
    shadowOpacity: 0.5,
    elevation: 6,
  },
  emoji: {
    // Dynamic: fontSize, marginBottom
    textAlign: 'center',
  },
  stateName: {
    // Dynamic: fontSize
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
    color: Colors.textLight,
    textAlign: 'center',
    ...getTextShadowStyle(Shadows.text.subtle),
  },
  checkmarkContainer: {
    // Dynamic: top, right, width, height
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    // Dynamic: fontSize
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  recommendedBadge: {
    // Dynamic: top, right, paddingHorizontal, paddingVertical, borderWidth
    position: 'absolute',
    backgroundColor: '#2196F3',
    borderRadius: BorderRadius.small,
    borderColor: '#fff',
  },
  recommendedText: {
    // Dynamic: fontSize
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
    color: Colors.textLight,
  },
});
