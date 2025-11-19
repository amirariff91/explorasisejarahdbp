/**
 * StateDropdown
 * Modal dropdown for selecting Malaysian states
 * Displays all 14 states alphabetically with completion status and progress
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { getSortedStates, stateDisplayNames } from '@/constants/mapLayout';
import {
  StateVisuals,
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

interface StateDropdownProps {
  visible: boolean;
  onClose: () => void;
  onStateSelect: (state: MalaysianState) => void;
  disabled?: boolean;
}

export default function StateDropdown({
  visible,
  onClose,
  onStateSelect,
  disabled = false,
}: StateDropdownProps) {
  const { width } = useWindowDimensions();
  const { gameState } = useGameContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);
  const allowScaling = gameState.allowFontScaling;

  // Component lifecycle management
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get sorted states
  const sortedStates = getSortedStates();

  // Responsive sizing
  const containerWidth = Math.min(width * 0.85, getResponsiveSizeScaled(500, width, 1.5));
  const itemHeight = getResponsiveSizeScaled(70, width);
  const badgeSize = getResponsiveSizeScaled(28, width);
  const padding = getResponsiveSizeScaled(16, width);
  const borderRadius = getResponsiveSizeScaled(BorderRadius.large, width);
  const fontSize = getResponsiveFontSize('answer', width);
  const titleFontSize = getResponsiveFontSize('question', width);
  const progressFontSize = getResponsiveFontSize('clue', width);

  // Handle state selection
  const handleStatePress = async (state: MalaysianState) => {
    // GUARD: Prevent multiple presses
    if (disabled || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      // Haptic feedback with platform-safe error handling
      if (Platform.OS !== 'web') {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch {
          // Haptics not available on this device/simulator - fail silently
        }
      }

      await playSound('click');
      onStateSelect(state);
      onClose(); // Close modal after selection
    } catch (error) {
      // Log error but don't crash
      if (__DEV__) {
        console.warn('[StateDropdown] Selection error:', error);
      }
    } finally {
      // Reset after delay
      setTimeout(() => {
        if (isMountedRef.current) {
          isProcessingRef.current = false;
          setIsProcessing(false);
        }
      }, 150);
    }
  };

  // Render individual state item
  const renderStateItem = (state: MalaysianState) => {
    const isCompleted = gameState.completedStates.includes(state);
    const stateColor = isCompleted ? Colors.success : (StateVisuals[state]?.color || Colors.gold);
    const stateName = stateDisplayNames[state];

    // Calculate progress for in-progress states
    let progressText = '';
    if (!isCompleted && gameState.questionIndexByState?.[state] !== undefined) {
      const savedIdx = gameState.questionIndexByState[state];
      const total = getQuestionsForState(state).length;
      if (total > 0) {
        const nextQ = Math.min(savedIdx + 1, total);
        progressText = `Soalan ${nextQ}/${total}`;
      }
    }

    return (
      <Pressable
        key={state}
        onPress={() => handleStatePress(state)}
        disabled={isProcessing}
        accessibilityRole="button"
        accessibilityLabel={`${stateName}${isCompleted ? ', selesai' : ''}${progressText ? `, ${progressText}` : ''}`}
        style={({ pressed }) => [
          styles.stateItem,
          {
            height: itemHeight,
            paddingHorizontal: padding,
            opacity: isProcessing ? 0.5 : pressed ? ButtonAnimations.pressOpacity : 1,
            transform: [{ scale: pressed ? ButtonAnimations.pressScale : 1 }],
          },
        ]}
      >
        {/* State color badge */}
        <View
          style={[
            styles.colorBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: stateColor,
            },
          ]}
        />

        {/* State name and progress */}
        <View style={styles.stateInfo}>
          <Text
            style={[styles.stateName, { fontSize }]}
            allowFontScaling={allowScaling}
          >
            {stateName}
          </Text>
          {progressText && (
            <Text
              style={[styles.progressText, { fontSize: progressFontSize }]}
              allowFontScaling={allowScaling}
            >
              {progressText}
            </Text>
          )}
        </View>

        {/* Completion checkmark */}
        {isCompleted && (
          <Text
            style={[styles.checkmark, { fontSize: fontSize * 1.2 }]}
            allowFontScaling={allowScaling}
          >
            ✓
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      {/* Backdrop */}
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Tutup senarai negeri"
      >
        {/* Dropdown container (prevent backdrop click from propagating) */}
        <Pressable
          style={[
            styles.container,
            {
              width: containerWidth,
              borderRadius,
              padding,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { marginBottom: padding }]}>
            <Text
              style={[styles.title, { fontSize: titleFontSize }]}
              allowFontScaling={allowScaling}
            >
              Pilih Negeri
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? ButtonAnimations.pressOpacity : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Tutup"
            >
              <Text
                style={[styles.closeButtonText, { fontSize: titleFontSize }]}
                allowFontScaling={allowScaling}
              >
                ✕
              </Text>
            </Pressable>
          </View>

          {/* State list */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
            bounces={false}
          >
            {sortedStates.map(renderStateItem)}
          </ScrollView>
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
    maxHeight: '85%',
    borderWidth: 3,
    borderColor: Colors.border,
    ...getComponentShadowStyle(Shadows.component.large),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.normal,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontFamily: Typography.fontFamily,
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.normal,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  colorBadge: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.textPrimary,
  },
  stateInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  stateName: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.normal,
  },
  progressText: {
    fontFamily: Typography.fontFamily,
    color: Colors.secondary,
    fontWeight: Typography.fontWeight.semiBold,
    marginTop: 2,
  },
  checkmark: {
    color: Colors.success,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: 8,
  },
});
