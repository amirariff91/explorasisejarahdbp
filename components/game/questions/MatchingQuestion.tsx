import { ButtonSizes, EdgeMargins, getQuestionBoardSize, getResponsiveSizeScaled, TouchTargets } from '@/constants/layout';
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
  // Simple responsive offsets for Matching questions
  const offsets = {
    boardPaddingTop: 25,
    boardPaddingBottom: 15,
    boardPaddingHorizontal: 30,
    questionAreaHeight: 150,  // Optimized for larger 'singleBoardMC' board - gives more space to grid
    gridAreaTop: 12,
    gridContainer: { gap: 16 },
    gridRow: { gap: 16 },
    footerContainer: { marginBottom: 30, marginRight: 30 },
  };

  // Use new responsive board sizing system (auto-scales by device tier)
  // Using 'singleBoardMC' board (680×380 base) for adequate width for 3×3 grid with long text
  const boardSize = getQuestionBoardSize('singleBoardMC', width);

  // Responsive board sizing - Allow larger board to use available space
  const maxBoardWidth = width * (width < 1000 ? 0.90 : 0.92);  // 90% phone, 92% tablet
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
        setShowNext(newSelected.length === 3);
        return newSelected;
      } else {
        // Only allow selection if less than 3 already selected
        if (prev.length >= 3) {
          // Already have 3 selections, don't allow more
          return prev;
        }
        // Select
        const newSelected = [...prev, option];
        setShowNext(newSelected.length === 3);
        return newSelected;
      }
    });
  };

  const handleSubmit = async () => {
    playSound('click');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAnswer(selectedOptions);
  };

  // Calculate button dimensions based on board width
  const buttonAreaWidth = boardWidth - (offsets.boardPaddingHorizontal * 2);
  const horizontalGap = offsets.gridRow.gap;
  const baseButtonWidth = (buttonAreaWidth - horizontalGap * 2) / 3;

  // Use calculated width without increase to prevent overflow
  const buttonWidth = baseButtonWidth;

  // Clamp button width with min/max bounds for text readability
  const clampedButtonWidth = Math.max(140, Math.min(buttonWidth, 240));

  // Calculate height based on jawapan-button aspect ratio
  const buttonAspectRatio = 184 / 626; // jawapan-button.png aspect ratio
  const clampedButtonHeight = clampedButtonWidth * buttonAspectRatio;

  // Font size using theme system (responsive across 4 tiers: 12→18px)
  const fontSize = getResponsiveFontSize('gridCell', width);

  // Responsive padding for grid cells - optimized to maximize text space
  const cellPadding = getResponsiveSizeScaled(8, width);

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
                {
                  fontSize: getResponsiveFontSize('question', width),
                  lineHeight: getResponsiveFontSize('question', width) * Typography.lineHeight.normal,
                },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.9}
              allowFontScaling={allowScaling}>
              {question.title}
            </Text>
            <Text
              style={[
                styles.questionText,
                {
                  fontSize: getResponsiveFontSize('answer', width),
                  lineHeight: getResponsiveFontSize('answer', width) * Typography.lineHeight.tight,
                },
              ]}
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.9}
              allowFontScaling={allowScaling}>
              {question.question}
            </Text>
            <Text
              style={[
                styles.instructionText,
                {
                  fontSize: getResponsiveFontSize('clue', width),
                  color: selectedOptions.length === 3 ? Colors.success : Colors.textSecondary,
                },
              ]}
              allowFontScaling={allowScaling}>
              Pilih 3 jawapan yang betul ({selectedOptions.length}/3)
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
                          style={[styles.gridCellBg, { padding: cellPadding }]}
                          resizeMode="stretch">
                          <Text
                            style={[styles.gridCellText, { fontSize }]}
                            numberOfLines={5}
                            adjustsFontSizeToFit
                            minimumFontScale={0.9}
                            ellipsizeMode="tail"
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
    // lineHeight calculated dynamically inline
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
    // Dynamic: padding
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCellText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.semiBold,
  },
  instructionText: {
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.semiBold,
    marginTop: 4,
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
