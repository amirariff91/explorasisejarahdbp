import { useState, useEffect } from 'react';
import { Text, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { getDeviceSize, getResponsiveSizeScaled } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';
import { Colors, getResponsiveFontSize, Typography } from '@/constants/theme';
import { formatTime, getTimerColor } from '@/constants/stateTimers';

interface CountdownTimerProps {
  allowFontScaling?: boolean;
  onExpire?: () => void;
  alignBesideState?: boolean;
}

export default function CountdownTimer({
  allowFontScaling = false,
  onExpire,
  alignBesideState = false,
}: CountdownTimerProps) {
  const { gameState, getTimeRemaining } = useGameContext();
  const { width } = useWindowDimensions();
  const isPhone = getDeviceSize(width) === 'phone';
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const scale = useSharedValue(1);

  // Derived sizing — must be above early return (hooks rules)
  const fontSize = getResponsiveFontSize('stateLabel', width);
  const containerPadding = getResponsiveSizeScaled(isPhone ? 10 : 12, width);
  const borderRadius = getResponsiveSizeScaled(isPhone ? 14 : 10, width);
  const iconSize = getResponsiveSizeScaled(isPhone ? 18 : 20, width);
  const topOffset = isPhone ? 12 : 16;
  const rightOffset = isPhone ? width * 0.10 : 18;

  // Update time remaining every second
  useEffect(() => {
    if (!gameState.stateTimer) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);
      if (remaining !== null && remaining <= 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [gameState.stateTimer, getTimeRemaining, onExpire]);

  // Pulse animation when < 30 seconds — must be above early return
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining <= 30 && timeRemaining > 0) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 150 });
    }
  }, [timeRemaining, scale]);

  // Must be above early return (hooks rules)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Don't render if no timer
  if (!gameState.stateTimer || timeRemaining === null) {
    return null;
  }

  const totalDuration = gameState.stateTimer.duration;
  const timerColor = getTimerColor(timeRemaining, totalDuration);
  const formattedTime = formatTime(timeRemaining);

  const content = (
    <Animated.View
      style={[
        styles.container,
        {
          paddingHorizontal: containerPadding,
          paddingVertical: containerPadding * 0.6,
          borderRadius,
          borderCurve: 'continuous',
          borderColor: timerColor,
          boxShadow: '0 3px 6px rgba(0,0,0,0.35)',
        },
        animatedStyle,
      ]}>
      <Text
        style={[styles.icon, { fontSize: iconSize }]}
        allowFontScaling={allowFontScaling}>
        ⏱️
      </Text>
      <Text
        style={[
          styles.time,
          {
            fontSize,
            color: timerColor,
            fontVariant: ['tabular-nums'],
          },
        ]}
        allowFontScaling={allowFontScaling}
        accessibilityLabel={`Masa tinggal ${formattedTime}`}
        accessibilityRole="text">
        {formattedTime}
      </Text>
    </Animated.View>
  );

  if (alignBesideState || !isPhone) {
    return content;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: topOffset,
        right: rightOffset,
        zIndex: 30,
      }}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 2,
    gap: 8,
  },
  icon: {
    color: Colors.textLight,
  },
  time: {
    fontFamily: Typography.fontFamily,
  },
});
