import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';

interface GameTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  maxLength?: number;
  accessibilityLabel?: string;
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
}: GameTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label.toUpperCase()}</Text>

      {/* Input Container - Outer blue panel */}
      <View style={[styles.outerContainer, isFocused && styles.outerContainerFocused]}>
        {/* Inner recessed slot - darker blue inset */}
        <View style={styles.innerSlot}>
          <TextInput
            style={styles.input}
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textLight,
    marginBottom: 8,
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
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    // Inset shadow effect
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderTopColor: 'rgba(0, 0, 0, 0.25)',
    borderLeftColor: 'rgba(0, 0, 0, 0.25)',
  },

  input: {
    fontSize: 18,
    color: Colors.textLight,
    fontWeight: '500',
    height: '100%',
  },

  errorText: {
    fontSize: 13,
    color: '#ff6b6b',
    marginTop: 4,
    marginLeft: 4,
  },
});
