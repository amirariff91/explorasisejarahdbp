/**
 * StateBottomSheet
 * Bottom sheet for selecting Malaysian states
 * Displays all 14 states alphabetically with completion status and progress
 */

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
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

interface StateBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onStateSelect: (state: MalaysianState) => void;
  disabled?: boolean;
}

export default function StateBottomSheet({
  visible,
  onClose,
  onStateSelect,
  disabled = false,
}: StateBottomSheetProps) {
  const { width, height } = useWindowDimensions();
  const { gameState } = useGameContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedState, setSelectedState] = useState<MalaysianState | null>(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const allowScaling = gameState.allowFontScaling;

  // Memoize sorted states to prevent recreation on every render
  const sortedStates = useMemo(() => getSortedStates(), []);

  // Snap points for bottom sheet - pixel-based for landscape mode
  const snapPoints = useMemo(() => {
    // Landscape height: phones ~350-400px, tablets ~800-1000px
    const isPhone = height < 600;

    if (isPhone) {
      // Start larger for phones - shows ~5-6 items
      return [280, height * 0.8];
    } else {
      // Larger for tablets - shows ~6-8 items
      return [height * 0.5, height * 0.7];
    }
  }, [height]);

  // Component lifecycle management
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Control bottom sheet visibility
  useEffect(() => {
    if (visible) {
      // Reset processing state when reopening
      isProcessingRef.current = false;
      setIsProcessing(false);
      setSelectedState(null);
      // Use snapToIndex(0) to open to first (smaller) snap point
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Responsive sizing
  const itemHeight = getResponsiveSizeScaled(60, width);
  const badgeSize = getResponsiveSizeScaled(22, width);
  const padding = getResponsiveSizeScaled(12, width);
  const fontSize = getResponsiveFontSize('answer', width);
  const titleFontSize = getResponsiveFontSize('question', width);
  const progressFontSize = getResponsiveFontSize('clue', width);
  const chevronSize = getResponsiveSizeScaled(18, width);

  // Handle sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  // Custom backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  // Handle state selection
  const handleStatePress = async (state: MalaysianState) => {
    // GUARD: Prevent multiple presses
    if (disabled || isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);
    setSelectedState(state); // Show selection highlight

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

      // Brief delay to show selection feedback
      await new Promise(resolve => setTimeout(resolve, 200));

      onStateSelect(state);
      onClose(); // Close bottom sheet after selection
    } catch (error) {
      // Log error but don't crash
      if (__DEV__) {
        console.warn('[StateBottomSheet] Selection error:', error);
      }
    } finally {
      // Reset after delay
      setTimeout(() => {
        if (isMountedRef.current) {
          isProcessingRef.current = false;
          setIsProcessing(false);
          setSelectedState(null);
        }
      }, 150);
    }
  };

  // Render individual state item
  const renderStateItem = useCallback((state: MalaysianState) => {
    const isCompleted = gameState.completedStates.includes(state);
    const isSelected = selectedState === state;
    const stateColor = isCompleted ? Colors.success : (StateVisuals[state]?.color || Colors.gold);
    const stateName = stateDisplayNames[state];

    // Calculate progress for in-progress states
    let progressText = '';
    let isInProgress = false;
    if (!isCompleted && gameState.questionIndexByState?.[state] !== undefined) {
      const savedIdx = gameState.questionIndexByState[state];
      const total = getQuestionsForState(state).length;
      if (total > 0) {
        const nextQ = Math.min(savedIdx + 1, total);
        progressText = `Soalan ${nextQ}/${total}`;
        isInProgress = true;
      }
    }

    return (
      <Pressable
        key={state}
        onPress={() => handleStatePress(state)}
        disabled={isProcessing}
        accessibilityRole="button"
        accessibilityLabel={`${stateName}${isCompleted ? ', selesai' : ''}${progressText ? `, ${progressText}` : ''}`}
        accessibilityHint="Ketik untuk mula kuiz negeri ini"
        style={({ pressed }) => [
          styles.stateItem,
          isInProgress && styles.stateItemInProgress,
          isSelected && styles.stateItemSelected,
          pressed && styles.stateItemPressed,
          {
            height: itemHeight,
            paddingHorizontal: padding,
            opacity: isProcessing && !isSelected ? 0.5 : 1,
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

        {/* Completion checkmark or chevron */}
        {isCompleted ? (
          <Text
            style={[styles.checkmark, { fontSize: fontSize * 1.2 }]}
            allowFontScaling={allowScaling}
          >
            ✓
          </Text>
        ) : (
          <Text
            style={[styles.chevron, { fontSize: chevronSize }]}
            allowFontScaling={allowScaling}
          >
            ›
          </Text>
        )}
      </Pressable>
    );
  }, [gameState.completedStates, gameState.questionIndexByState, isProcessing, selectedState, itemHeight, padding, badgeSize, fontSize, progressFontSize, chevronSize, allowScaling]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      enableOverDrag={false}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.sheetBackground}
    >
      {/* Header with close button and progress */}
      <View style={[styles.header, { paddingHorizontal: padding, paddingVertical: padding }]}>
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

        <View style={styles.headerContent}>
          <Text
            style={[styles.title, { fontSize: titleFontSize }]}
            allowFontScaling={allowScaling}
          >
            Pilih Negeri
          </Text>
          <Text
            style={[styles.subtitle, { fontSize: progressFontSize }]}
            allowFontScaling={allowScaling}
          >
            Ketik untuk mula • {gameState.completedStates.length}/14 selesai
          </Text>
        </View>

        {/* Spacer for centering */}
        <View style={styles.closeButton} />
      </View>

      {/* State list */}
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {sortedStates.map(renderStateItem)}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: BorderRadius.large,
    borderTopRightRadius: BorderRadius.large,
    ...getComponentShadowStyle(Shadows.component.large),
  },
  handleIndicator: {
    backgroundColor: Colors.border,
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textTertiary,
    fontWeight: Typography.fontWeight.bold,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: 'transparent',
  },
  stateItemPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  stateItemSelected: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  stateItemInProgress: {
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
  },
  colorBadge: {
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
  },
  stateInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  stateName: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.bold,
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
  chevron: {
    color: Colors.textTertiary,
    fontWeight: Typography.fontWeight.bold,
    marginLeft: 8,
  },
});
