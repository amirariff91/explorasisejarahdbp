/**
 * StateDropdownButton
 * Trigger button to open the state selection dropdown
 */

import React from 'react';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { getResponsiveSizeScaled } from '@/constants/layout';
import {
  Colors,
  Typography,
  BorderRadius,
  Shadows,
  getComponentShadowStyle,
  getResponsiveFontSize,
  ButtonAnimations,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';

interface StateDropdownButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function StateDropdownButton({ onPress, disabled = false }: StateDropdownButtonProps) {
  const { width } = useWindowDimensions();
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;

  const buttonHeight = getResponsiveSizeScaled(44, width);
  const fontSize = getResponsiveFontSize('answer', width);
  const paddingHorizontal = getResponsiveSizeScaled(24, width);
  const borderRadius = getResponsiveSizeScaled(BorderRadius.medium, width);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Buka senarai negeri"
      accessibilityHint="Ketik untuk memilih negeri dari senarai"
      style={({ pressed }) => [
        styles.button,
        {
          height: buttonHeight,
          paddingHorizontal,
          borderRadius,
          opacity: disabled ? 0.5 : pressed ? ButtonAnimations.pressOpacity : 1,
          transform: [{ scale: pressed ? ButtonAnimations.pressScale : 1 }],
        },
      ]}
    >
      <Text
        style={[styles.buttonText, { fontSize }]}
        allowFontScaling={allowScaling}
      >
        Pilih Negeri ▼
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
    ...getComponentShadowStyle(Shadows.component.medium),
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
});
