import { ButtonSizes, EdgeMargins, isLandscapeMode, QuestionBoardBase, getQuestionBoardSize, TouchTargets } from '@/constants/layout';
import { Colors, getResponsiveFontSize, Opacity, Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { MatchingQuestion as MQQuestion } from '@/types';
import { playSound } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ASSETS } from '@/constants/assets';

interface Props {
  question: MQQuestion;
  onAnswer: (answer: string[]) => void;
}

/**
 * Matching Question - Single Board Layout
 * Question title/instructions at top of board
 * 3x3 grid of JAWAPAN boxes at bottom of board (9 options)
 */
export default function MatchingQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showNext, setShowNext] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  // Simple responsive offsets for Matching questions
  const offsets = {
    boardPaddingTop: 25,
    boardPaddingBottom: 15,
    boardPaddingHorizontal: 30,
    questionAreaHeight: 140, // Increased from 90 for longer text
    gridAreaTop: 12, // Reduced from 15 to compensate
    gridContainer: { gap: 16 }, // Reduced from 20 for better spacing
    gridRow: { gap: 16 },
    footerContainer: { marginBottom: 30, marginRight: 30 },
  };

  // Use new responsive board sizing system (auto-scales by device tier)
  const boardSize = getQuestionBoardSize('compact', width);

  // Responsive board sizing - Allow board to reach its base dimensions
  const maxBoardWidth = width * (width < 1000 ? 0.80 : 0.85);  // 80% phone, 85% tablet
  const maxBoardHeight = height * 0.85; // Allow adequate height for larger screens
  const aspectRatio = boardSize.width / boardSize.height;

  let boardWidth = Math.min(boardSize.width, maxBoardWidth);
  let boardHeight = boardWidth / aspectRatio;

  // Check if height exceeds limit, recalculate if needed
  if (boardHeight > maxBoardHeight) {
    boardHeight = maxBoardHeight;
    boardWidth = boardHeight * aspectRatio;
  }

  // Responsive button sizing (phone <1000px, tablet ≥1000px)
  const nextButtonSize = width < 1000 ? ButtonSizes.next.phone : ButtonSizes.next.tablet;

  const handleToggleOption = async (option: string) => {
    playSound('click');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        // Deselect
        const newSelected = prev.filter((item) => item !== option);
        setShowNext(newSelected.length > 0);
        return newSelected;
      } else {
        // Select
        const newSelected = [...prev, option];
        setShowNext(true);
        return newSelected;
      }
    });
  };

  const handleSubmit = async () => {
    playSound('click');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAnswer(selectedOptions);
  };

  // Calculate button dimensions based on board width (with 10% size increase)
  const buttonAreaWidth = boardWidth - (offsets.boardPaddingHorizontal * 2);
  const horizontalGap = offsets.gridRow.gap;
  const baseButtonWidth = (buttonAreaWidth - horizontalGap * 2) / 3;

  // Increase button size by 10%
  const buttonWidth = baseButtonWidth * 1.1;

  // Clamp button width with min/max bounds (min increased for better text display)
  const clampedButtonWidth = Math.max(160, Math.min(buttonWidth, 260));

  // Calculate height based on jawapan-button aspect ratio
  const buttonAspectRatio = 184 / 626; // jawapan-button.png aspect ratio
  const clampedButtonHeight = clampedButtonWidth * buttonAspectRatio;

  // Font size scales with button size (minimum 14px for WCAG accessibility)
  const fontSize = Math.max(14, Math.floor(clampedButtonWidth / 14));

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <ImageBackground
          source={ASSETS.games.dbpSejarah.soalanBoard}
          style={[
            styles.board,
            {
              width: boardWidth,
              height: boardHeight,
              paddingTop: offsets.boardPaddingTop,
              paddingBottom: offsets.boardPaddingBottom,
              paddingHorizontal: offsets.boardPaddingHorizontal,
            },
          ]}
          resizeMode="contain">
          {/* Question Section - Top */}
          <View style={[styles.questionSection, { height: offsets.questionAreaHeight, marginBottom: offsets.gridAreaTop }]}>
            <Text
              style={[
                styles.titleText,
                { fontSize: getResponsiveFontSize('question', width) },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              allowFontScaling={allowScaling}>
              {question.title}
            </Text>
            <Text
              style={[
                styles.questionText,
                { fontSize: getResponsiveFontSize('answer', width) },
              ]}
              numberOfLines={3}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              allowFontScaling={allowScaling}>
              {question.question}
            </Text>
          </View>

          {/* Grid Section - Bottom */}
          <View style={styles.gridSection}>
            <View style={[styles.grid, { gap: offsets.gridContainer.gap }]}>
              {[0, 1, 2].map((row) => (
                <View key={row} style={[styles.gridRow, { gap: offsets.gridRow.gap }]}>
                  {question.options.slice(row * 3, row * 3 + 3).map((option, col) => {
                    const isSelected = selectedOptions.includes(option);
                    return (
                      <Pressable
                        key={col}
                        style={({ pressed }) => [
                          styles.gridCell,
                          {
                            width: clampedButtonWidth,
                            height: clampedButtonHeight,
                            transform: [{ scale: pressed ? 0.92 : 1 }],
                          },
                          isSelected && styles.gridCellSelected,
                        ]}
                        onPress={() => handleToggleOption(option)}
                        hitSlop={TouchTargets.hitSlop}
                        pressRetentionOffset={TouchTargets.hitSlop}
                        accessibilityRole="button"
                        accessibilityLabel={`Pilihan ${row * 3 + col + 1}: ${option}`}
                        accessibilityState={{ selected: isSelected }}>
                        <ImageBackground
                          source={ASSETS.games.dbpSejarah.jawapanButton.default}
                          style={styles.gridCellBg}
                          resizeMode="stretch">
                          <Text
                            style={[styles.gridCellText, { fontSize }]}
                            numberOfLines={3}
                            adjustsFontSizeToFit
                            minimumFontScale={0.85}
                            allowFontScaling={allowScaling}>
                            {isSelected && '✓ '}
                            {option}
                          </Text>
                        </ImageBackground>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Next Button - Outside board, bottom-right */}
      {showNext && (
        <View style={[
          styles.footer,
          {
            bottom: offsets.footerContainer.marginBottom,
            right: offsets.footerContainer.marginRight,
          },
        ]}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              {
                width: nextButtonSize.width,
                height: nextButtonSize.height,
                transform: [{ scale: pressed ? 0.92 : 1 }],
              },
            ]}
            onPress={handleSubmit}
            hitSlop={TouchTargets.hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Teruskan ke soalan seterusnya">
            <Image
              source={ASSETS.shared.buttons.next.default}
              style={styles.nextButtonImage}
              contentFit="contain"
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: EdgeMargins.landscape,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  // Question Section (Top of board)
  questionSection: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.bold,
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.tight * 16, // 1.2 * 16 = 19.2
  },

  // Grid Section (Bottom of board)
  gridSection: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    position: 'relative',
  },
  gridCellSelected: {
    opacity: Opacity.selected,
    transform: [{ scale: 0.95 }],
  },
  gridCellBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  gridCellText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.semiBold,
  },

  // Footer: Next Button (Outside board)
  footer: {
    position: 'absolute',
    zIndex: 20,
  },
  nextButton: {
    // Size set dynamically
  },
  nextButtonImage: {
    width: '100%',
    height: '100%',
  },
});
