/**
 * StatePicker
 * Native picker for selecting Malaysian states
 * Uses @react-native-picker/picker for cross-platform native UI
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getSortedStates, stateDisplayNames } from '@/constants/mapLayout';
import {
  Colors,
  Typography,
  BorderRadius,
  Shadows,
  getComponentShadowStyle,
  getResponsiveFontSize,
  ButtonAnimations,
} from '@/constants/theme';
import { getResponsiveSizeScaled } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';
import { getQuestionsForState } from '@/data/questions';
import { playSound } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import type { MalaysianState } from '@/types';

interface StatePickerProps {
  visible: boolean;
  onClose: () => void;
  onStateSelect: (state: MalaysianState) => void;
  disabled?: boolean;
}

export default function StatePicker({
  visible,
  onClose,
  onStateSelect,
  disabled = false,
}: StatePickerProps) {
  const { width } = useWindowDimensions();
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;

  // Get sorted states
  const sortedStates = useMemo(() => getSortedStates(), []);

  // Track selected state in picker
  const [selectedValue, setSelectedValue] = useState<MalaysianState>(sortedStates[0]);

  // Generate picker items with status
  const pickerItems = useMemo(() => {
    return sortedStates.map((state) => {
      const isCompleted = gameState.completedStates.includes(state);
      const stateName = stateDisplayNames[state];

      let label = stateName;

      if (isCompleted) {
        label = `${stateName} ✓`;
      } else if (gameState.questionIndexByState?.[state] !== undefined) {
        const savedIdx = gameState.questionIndexByState[state];
        const total = getQuestionsForState(state).length;
        if (total > 0) {
          const nextQ = Math.min(savedIdx + 1, total);
          label = `${stateName} (${nextQ}/${total})`;
        }
      }

      return { value: state, label };
    });
  }, [sortedStates, gameState.completedStates, gameState.questionIndexByState]);

  // Responsive sizing
  const padding = getResponsiveSizeScaled(16, width);
  const titleFontSize = getResponsiveFontSize('question', width);
  const buttonFontSize = getResponsiveFontSize('answer', width);

  // Handle confirm selection
  const handleConfirm = async () => {
    if (disabled) return;

    try {
      // Haptic feedback
      if (Platform.OS !== 'web') {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch {
          // Haptics not available
        }
      }

      await playSound('click');
      onStateSelect(selectedValue);
      onClose();
    } catch (error) {
      if (__DEV__) {
        console.warn('[StatePicker] Selection error:', error);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Tutup pemilih negeri"
      >
        <Pressable
          style={[
            styles.container,
            {
              padding,
              borderRadius: getResponsiveSizeScaled(BorderRadius.large, width),
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[styles.title, { fontSize: titleFontSize }]}
              allowFontScaling={allowScaling}
            >
              Pilih Negeri
            </Text>
            <Text
              style={[styles.subtitle, { fontSize: getResponsiveFontSize('clue', width) }]}
              allowFontScaling={allowScaling}
            >
              {gameState.completedStates.length}/14 selesai
            </Text>
          </View>

          {/* Native Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(value) => setSelectedValue(value as MalaysianState)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {pickerItems.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                { opacity: pressed ? ButtonAnimations.pressOpacity : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Batal"
            >
              <Text
                style={[styles.buttonText, styles.cancelButtonText, { fontSize: buttonFontSize }]}
                allowFontScaling={allowScaling}
              >
                Batal
              </Text>
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              disabled={disabled}
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                {
                  opacity: disabled ? 0.5 : pressed ? ButtonAnimations.pressOpacity : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Pilih negeri ini"
            >
              <Text
                style={[styles.buttonText, styles.confirmButtonText, { fontSize: buttonFontSize }]}
                allowFontScaling={allowScaling}
              >
                Pilih
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: Colors.backgroundOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.cardBackground,
    width: '85%',
    maxWidth: 400,
    ...getComponentShadowStyle(Shadows.component.large),
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.cardBackground,
    borderRadius: BorderRadius.medium,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 180 : 50,
  },
  pickerItem: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.border,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
  },
  confirmButtonText: {
    color: Colors.textLight,
  },
});
