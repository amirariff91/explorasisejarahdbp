import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import { Colors, BorderRadius, Shadows, getResponsiveFontSize } from '@/constants/theme';
import { getResponsiveSizeScaled } from '@/constants/layout';

interface GameTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  maxLength?: number;
  accessibilityLabel?: string;
  width: number; // Required for responsive sizing
}

/**
 * GameTextInput - Styled input component matching game aesthetic
 * Features recessed blue slot design with label
 */
export function GameTextInput({
  label,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  error,
  maxLength,
  accessibilityLabel,
  width,
}: GameTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Responsive sizing
  const inputHeight = getResponsiveSizeScaled(50, width);
  const labelFontSize = getResponsiveFontSize('answer', width);
  const inputFontSize = getResponsiveFontSize('answer', width);
  const horizontalPadding = getResponsiveSizeScaled(14, width);
  const labelMargin = getResponsiveSizeScaled(6, width);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={[styles.label, { fontSize: labelFontSize, marginBottom: labelMargin }]}>
        {label.toUpperCase()}
      </Text>

      {/* Input Container - Outer blue panel */}
      <View style={[styles.outerContainer, isFocused && styles.outerContainerFocused]}>
        {/* Inner recessed slot - darker blue inset */}
        <View
          style={[
            styles.innerSlot,
            { height: inputHeight, paddingHorizontal: horizontalPadding },
          ]}>
          <TextInput
            style={[styles.input, { fontSize: inputFontSize }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType={keyboardType}
            maxLength={maxLength}
            autoCapitalize={
              keyboardType === 'numeric' ||
              keyboardType === 'number-pad' ||
              keyboardType === 'decimal-pad' ||
              keyboardType === 'phone-pad'
                ? 'none'
                : 'words'
            }
            autoCorrect={false}
            returnKeyType="done"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            accessibilityLabel={accessibilityLabel || label}
            accessible
          />
        </View>
      </View>

      {/* Error Message */}
      {error ? (
        <Text
          style={[
            styles.errorText,
            { fontSize: getResponsiveFontSize('clue', width) },
          ]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 0.5,
  },

  // Outer container - same blue as panel
  outerContainer: {
    backgroundColor: '#1E8EEA',
    borderRadius: BorderRadius.small,
    padding: 4,
    ...Shadows.component.small,
  },

  outerContainerFocused: {
    ...Shadows.component.medium,
  },

  // Inner slot - darker blue with inset appearance
  innerSlot: {
    backgroundColor: '#1680D7',
    borderRadius: BorderRadius.small - 2,
    justifyContent: 'center',
    // Inset shadow effect
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderTopColor: 'rgba(0, 0, 0, 0.25)',
    borderLeftColor: 'rgba(0, 0, 0, 0.25)',
  },

  input: {
    color: Colors.textLight,
    fontWeight: '500',
    height: '100%',
  },

  errorText: {
    color: '#ff6b6b',
    marginTop: 4,
    marginLeft: 4,
  },
});
