import { getResponsiveSizeScaled } from '@/constants/layout';
import { Colors, getResponsiveFontSize, Opacity, Typography } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface Props {
  option: string;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
  index: number;
  allowFontScaling?: boolean;
}

/**
 * CheckboxCard - Single selectable item for Matching questions
 * Full-width card with checkbox icon and text label
 */
export default function CheckboxCard({
  option,
  isSelected,
  isDisabled,
  onPress,
  index,
  allowFontScaling = true,
}: Props) {
  const { width } = useWindowDimensions();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  // Responsive sizing
  const itemHeight = getResponsiveSizeScaled(56, width);
  const checkboxSize = getResponsiveSizeScaled(20, width);
  const fontSize = getResponsiveFontSize('gridCell', width);
  const horizontalPadding = getResponsiveSizeScaled(12, width);
  const borderRadius = getResponsiveSizeScaled(12, width, 1.3);

  // Animate checkmark on selection change
  useEffect(() => {
    Animated.timing(checkmarkAnim, {
      toValue: isSelected ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isSelected, checkmarkAnim]);

  const handlePress = async () => {
    if (isDisabled) return;

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          minHeight: itemHeight,
        },
      ]}>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          {
            paddingHorizontal: horizontalPadding,
            paddingVertical: horizontalPadding * 0.75,
            borderRadius,
            backgroundColor: isSelected ? Colors.primary : Colors.background,
            borderWidth: 2,
            borderColor: isSelected ? Colors.primary : Colors.border,
            opacity: isDisabled ? Opacity.disabled : 1,
          },
          pressed && !isDisabled && styles.pressed,
        ]}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        accessibilityLabel={`Pilihan ${index + 1}: ${option}`}>
        {/* Checkbox Icon */}
        <View
          style={[
            styles.checkbox,
            {
              width: checkboxSize,
              height: checkboxSize,
              borderRadius: checkboxSize * 0.25,
              backgroundColor: isSelected ? Colors.textLight : 'transparent',
              borderWidth: 2,
              borderColor: isSelected ? Colors.textLight : Colors.textSecondary,
            },
          ]}>
          {/* Checkmark */}
          <Animated.Text
            style={[
              styles.checkmark,
              {
                fontSize: checkboxSize * 0.7,
                opacity: checkmarkAnim,
                transform: [
                  {
                    scale: checkmarkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}>
            ✓
          </Animated.Text>
        </View>

        {/* Option Text */}
        <Text
          style={[
            styles.optionText,
            {
              fontSize,
              lineHeight: fontSize * Typography.lineHeight.normal,
              color: isSelected ? Colors.textLight : Colors.textPrimary,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
          allowFontScaling={allowFontScaling}>
          {option}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '55%',
    alignSelf: 'center',
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 56,
  },
  pressed: {
    opacity: Opacity.pressed,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    fontWeight: Typography.fontWeight.bold as any,
    color: Colors.primary,
  },
  optionText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.semiBold,
    flex: 1,
  },
});
