import { useState, useEffect } from 'react';
import { Text, StyleSheet, useWindowDimensions, Animated, View } from 'react-native';
import { getDeviceSize, getResponsiveSizeScaled } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';
import { getResponsiveFontSize, Typography } from '@/constants/theme';
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
  const [pulseAnim] = useState(new Animated.Value(1));

  // Update time remaining every second
  useEffect(() => {
    if (!gameState.stateTimer) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);

      // Check if timer expired
      if (remaining !== null && remaining <= 0 && onExpire) {
        onExpire();
      }
    };

    // Update immediately
    updateTimer();

    // Then update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [gameState.stateTimer, getTimeRemaining, onExpire]);

  // Pulse animation when < 30 seconds
  useEffect(() => {
    if (timeRemaining !== null && timeRemaining <= 30 && timeRemaining > 0) {
      // Start pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop pulsing
      pulseAnim.setValue(1);
    }
  }, [timeRemaining, pulseAnim]);

  // Don't render if no timer
  if (!gameState.stateTimer || timeRemaining === null) {
    return null;
  }

  const totalDuration = gameState.stateTimer.duration;
  const timerColor = getTimerColor(timeRemaining, totalDuration);
  const formattedTime = formatTime(timeRemaining);

  // Responsive sizing
  const fontSize = getResponsiveFontSize('stateLabel', width);
  const containerPadding = getResponsiveSizeScaled(isPhone ? 10 : 12, width);
  const borderRadius = getResponsiveSizeScaled(isPhone ? 14 : 10, width);
  const iconSize = getResponsiveSizeScaled(isPhone ? 18 : 20, width);
  const topOffset = isPhone ? 12 : 16;
  const rightOffset = isPhone ? width * 0.10 : 18;

  const content = (
    <Animated.View
      style={[
        styles.container,
        {
          paddingHorizontal: containerPadding,
          paddingVertical: containerPadding * 0.6,
          borderRadius,
          borderColor: timerColor,
          transform: [{ scale: pulseAnim }],
        },
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
          },
        ]}
        allowFontScaling={allowFontScaling}>
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
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  icon: {
    color: '#FFFFFF',
  },
  time: {
    fontFamily: Typography.fontFamily, // Galindo
    // fontWeight: '700', // Galindo doesn't have bold weight, handled by font file
  },
});
