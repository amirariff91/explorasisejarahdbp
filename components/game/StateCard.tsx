import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useEffect } from 'react';
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
import { Typography, Colors, getTextShadowStyle, Shadows, StateVisuals, BorderRadius } from '@/constants/theme';

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
  // Get visual theme for this state
  const visuals = StateVisuals[stateId];

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
          backgroundColor: visuals.color,
          borderColor: visuals.borderColor,
        },
        animatedStyle,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${stateName} state, ${isCompleted ? 'completed with checkmark' : 'not started, tap to begin quiz'}`}
      accessibilityHint="Double tap to start quiz for this state"
    >
      {/* Big Emoji Icon */}
      <Text style={styles.emoji}>{visuals.emoji}</Text>

      {/* State Name */}
      <Text style={styles.stateName} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
        {stateName}
      </Text>

      {/* Completion Checkmark */}
      {isCompleted && (
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}

      {/* Recommended Badge */}
      {isRecommended && !isCompleted && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Seterusnya</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 90,
    borderRadius: BorderRadius.medium,
    borderWidth: 4,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Outer shadow (bottom-right depth) - illustrated button style
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 6,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 4,
    textAlign: 'center',
  },
  stateName: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    textAlign: 'center',
    ...getTextShadowStyle(Shadows.text.subtle),
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: BorderRadius.small,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#2196F3',
    borderRadius: BorderRadius.small,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  recommendedText: {
    fontFamily: Typography.fontFamily,
    fontSize: 8,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
  },
});
