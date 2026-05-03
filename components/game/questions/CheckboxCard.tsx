import { getResponsiveSizeScaled } from "@/constants/layout";
import {
  Colors,
  getResponsiveFontSize,
  Opacity,
  Typography,
} from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";

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

  // Animation values (reanimated shared values)
  const scaleAnim = useSharedValue(1);
  const checkmarkAnim = useSharedValue(isSelected ? 1 : 0);

  // Responsive sizing - comfortable tap target
  const itemHeight = getResponsiveSizeScaled(32, width); // Comfortable height
  const checkboxSize = getResponsiveSizeScaled(18, width);
  const fontSize = getResponsiveFontSize("gridCell", width);
  const horizontalPadding = getResponsiveSizeScaled(10, width);
  const borderRadius = getResponsiveSizeScaled(10, width, 1.3);

  // Animate checkmark on selection change
  useEffect(() => {
    checkmarkAnim.value = withTiming(isSelected ? 1 : 0, { duration: 150 });
  }, [isSelected, checkmarkAnim]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkmarkAnim.value,
    transform: [{ scale: 0.5 + checkmarkAnim.value * 0.5 }],
  }));

  const handlePress = async () => {
    if (isDisabled) return;

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Press animation
    scaleAnim.value = withSequence(
      withTiming(0.98, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          minHeight: itemHeight,
        },
        containerStyle,
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          {
            paddingHorizontal: horizontalPadding,
            paddingVertical: horizontalPadding * 0.5, // Reduced from 0.75 for more compact cards
            borderRadius,
            backgroundColor: isSelected ? Colors.primary : Colors.background,
            borderWidth: 2,
            borderColor: isSelected ? Colors.primary : Colors.border,
            opacity: isDisabled ? Opacity.disabled : 1,
          },
          pressed && !isDisabled && { opacity: Opacity.selected },
        ]}
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected, disabled: isDisabled }}
        accessibilityLabel={`Pilihan ${index + 1}: ${option}`}
      >
        {/* Checkbox Icon */}
        <View
          style={[
            styles.checkbox,
            {
              width: checkboxSize,
              height: checkboxSize,
              borderRadius: checkboxSize * 0.25,
              backgroundColor: isSelected ? Colors.textLight : "transparent",
              borderWidth: 2,
              borderColor: isSelected ? Colors.textLight : Colors.textSecondary,
            },
          ]}
        >
          {/* Checkmark */}
          <Animated.Text
            style={[
              styles.checkmark,
              {
                fontSize: checkboxSize * 0.7,
              },
              checkmarkStyle,
            ]}
          >
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
          allowFontScaling={allowFontScaling}
        >
          {option}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "85%",
    alignSelf: "center",
  },
  pressable: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    minHeight: 32, // Comfortable tap target
  },
  checkbox: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkmark: {
    fontWeight: Typography.fontWeight.bold as any,
    color: Colors.primary,
  },
  optionText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal,
    flex: 1,
  },
});
