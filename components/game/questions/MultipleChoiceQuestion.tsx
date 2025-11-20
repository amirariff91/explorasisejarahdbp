import {
  ButtonSizes,
  EdgeMargins,
  getQuestionOffsets,
  isLandscapeMode,
  getQuestionBoardSize,
  getDeviceSize,
  getResponsiveSizeScaled,
  TouchTargets,
} from '@/constants/layout';
import {
  Colors,
  getResponsiveFontSize,
  Opacity,
  Typography,
  Shadows,
  getComponentShadowStyle,
} from '@/constants/theme';
import { ASSETS } from '@/constants/assets';
import { useGameContext } from '@/contexts/GameContext';
import type { MultipleChoiceQuestion as MCQuestion } from '@/types';
import { playSound } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Image } from 'expo-image';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  question: MCQuestion;
  onAnswer: (answer: string) => void;
}

/**
 * Multiple Choice Question - Single Board Layout
 * Question at top of board
 * 4 JAWAPAN buttons in 2x2 grid at bottom of board
 * Refactored to use CSS-styled buttons instead of images for better text handling
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MultipleChoiceQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const isPhone = getDeviceSize(width) === 'phone';
  const allowScaling = gameState.allowFontScaling;
  const isJohor = question.state === 'johor';
  const isSabah = question.state === 'sabah';
  const isSarawak = question.state === 'sarawak';
  const isMelaka = question.state === 'melaka';
  const isSelangor = question.state === 'selangor';
  const isTightPhone = isPhone && (isSabah || isSarawak || isMelaka || isSelangor);
  const forceWrap = isTightPhone;
  const questionMaxWidth = forceWrap ? '72%' : '85%';
  const baseQuestionFontSize = getResponsiveFontSize('question', width);
  const questionFontSize = forceWrap ? Math.round(baseQuestionFontSize * 1.08) : baseQuestionFontSize;
  const baseOffsets = getQuestionOffsets('multipleChoiceSingle', isLandscape) as {
    boardPaddingTop: number;
    boardPaddingBottom: number;
    boardPaddingHorizontal: number;
    questionAreaHeight: number;
    answerAreaTop: number;
    optionsContainer: { gap: number };
    optionRow: { gap: number };
    footerContainer: { marginBottom: number; marginRight: number };
  };

  // Slightly tighter layout on phones for Sabah, Sarawak & Melaka so buttons stay on the board
  const offsets = isTightPhone
    ? {
        ...baseOffsets,
        boardPaddingBottom: Math.min(baseOffsets.boardPaddingBottom, 12),
        questionAreaHeight: Math.min(baseOffsets.questionAreaHeight, 135),
        answerAreaTop: Math.min(baseOffsets.answerAreaTop, 12),
        optionsContainer: { ...baseOffsets.optionsContainer, gap: Math.min(baseOffsets.optionsContainer.gap, 12) },
        optionRow: { ...baseOffsets.optionRow, gap: Math.min(baseOffsets.optionRow.gap, 8) },
      }
    : baseOffsets;
  // Use new responsive board sizing system (auto-scales by device tier)
  const baseBoardSize = getQuestionBoardSize('singleBoardMC', width);

  // Large board states: 40% larger board on phones, 40% additional boost on tablets
  const largeBoardStates = ['perlis', 'perak', 'kedah'] as const;
  const isLargeBoardPhone = isPhone && largeBoardStates.includes(question.state as any);
  const isLargeBoardTablet = !isPhone && largeBoardStates.includes(question.state as any);
  const phoneBoardMultiplier = isLargeBoardPhone ? 1.4 : 1.0;
  const tabletBoardMultiplier = isLargeBoardTablet ? 1.4 : 1.0;

  // All states except Johor: 40% larger board on tablets only
  const boardSizeMultiplier = !isJohor && !isPhone ? 1.4 : 1.0;

  const boardSize = {
    width: baseBoardSize.width * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier,
    height: baseBoardSize.height * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier,
  };

  // Responsive board sizing - Allow board to reach its base dimensions
  const maxBoardWidth = width * 0.90;
  const maxBoardHeight = height * 0.96; // Slightly reduced from 100% to avoid header crowding
  const aspectRatio = boardSize.width / boardSize.height;

  // Safe bounds checking to prevent extreme values
  let boardWidth = Math.min(boardSize.width, maxBoardWidth);
  let boardHeight = boardWidth / aspectRatio;

  // Check if height exceeds limit, recalculate if needed
  if (boardHeight > maxBoardHeight) {
    boardHeight = maxBoardHeight;
    boardWidth = boardHeight * aspectRatio;
  }

  // Final safety check: ensure board fits within screen bounds
  boardWidth = Math.min(boardWidth, width * 0.95);
  boardHeight = Math.min(boardHeight, height * 0.96); // Match max height limit

  // Ensure minimum size for usability
  boardWidth = Math.max(boardWidth, 300);
  boardHeight = Math.max(boardHeight, 220);
  const nextButtonSize = isLandscape ? ButtonSizes.next.landscape : ButtonSizes.next.portrait;

  // Calculate button dimensions based on board width
  const buttonAreaWidth = boardWidth - (offsets.boardPaddingHorizontal * 2);
  const horizontalGap = offsets.optionRow.gap;
  const baseButtonWidth = (buttonAreaWidth - horizontalGap) / 2;

  // Apply 20% increase on tablets only
  const tabletMultiplier = isPhone ? 1.0 : 1.2;
  const buttonWidth = baseButtonWidth * tabletMultiplier;

  // Clamp button width with min/max bounds (adjusted for tablets)
  const buttonWidthMin = isTightPhone ? 130 : 140;
  const buttonWidthMax = isTightPhone ? 230 : (isPhone ? 260 : 312); // 260 * 1.2 = 312 for tablets
  const clampedButtonWidth = Math.max(buttonWidthMin, Math.min(buttonWidth, buttonWidthMax));

  // Font size for answer text (used in height calculation)
  const answerFontSize = getResponsiveFontSize('answer', width) * 0.9; // Reduce by 10% to prevent overflow

  // CSS-styled button logic - dynamic height based on content
  const answerHorizontalPadding = getResponsiveSizeScaled(8, width); // Reduced from 12
  const minAnswerHeight =
    answerFontSize * Typography.lineHeight.tight * 2 + // Ensure at least 2 lines fit
    answerHorizontalPadding * 2;

  // Available vertical space for the 2×2 grid (answers) inside the board.
  // Relax padding constraints slightly to give more room
  const availableAnswerAreaHeight =
    boardHeight -
    (offsets.boardPaddingTop * 0.8) - // Reduce top padding influence
    (offsets.boardPaddingBottom * 0.5) - // Reduce bottom padding influence
    offsets.questionAreaHeight -
    offsets.answerAreaTop;

  // Two rows: include gap between rows.
  const totalAnswerRowGaps = offsets.optionsContainer.gap + offsets.optionRow.gap;
  const maxHeightPerAnswerFromBoard =
    (availableAnswerAreaHeight - totalAnswerRowGaps) / 2;

  const phoneHeightTrim = isPhone ? 0.85 : 1.0; // reduce answer box height 15% on phones to be safe

  // Base height for touch target consistency, but allow growth
  const baseCSSHeight = 45 * (isPhone ? 1 : 1.2); // Reduced base height (was 50)
  let clampedButtonHeight = Math.max(baseCSSHeight, minAnswerHeight) * phoneHeightTrim;

  if (Number.isFinite(maxHeightPerAnswerFromBoard) && maxHeightPerAnswerFromBoard > 0) {
    clampedButtonHeight = Math.min(clampedButtonHeight, maxHeightPerAnswerFromBoard);
  }
  // Slight upward shift for Sabah/Sarawak/Melaka on phones to keep answers centered on the board
  const answerYOffset = isTightPhone ? -boardHeight * 0.1 : 0;

  // Force long prompts into two lines on tight phone layouts
  const wrapQuestionText = (text: string): string => {
    if (!forceWrap) return text;
    if (text.includes('\n')) return text;
    const words = text.split(' ');
    if (words.length < 4) return text;
    const mid = Math.floor(words.length / 2);
    return `${words.slice(0, mid).join(' ')}\n${words.slice(mid).join(' ')}`;
  };
  const displayQuestion = wrapQuestionText(question.question);

  // Animation values for each button
  const buttonScales = [
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
  ];

  // Create all animated styles at top level (React Hooks rules)
  const buttonAnimatedStyles = [
    useAnimatedStyle(() => ({ transform: [{ scale: buttonScales[0].value }] })),
    useAnimatedStyle(() => ({ transform: [{ scale: buttonScales[1].value }] })),
    useAnimatedStyle(() => ({ transform: [{ scale: buttonScales[2].value }] })),
    useAnimatedStyle(() => ({ transform: [{ scale: buttonScales[3].value }] })),
  ];

  const handleSelect = async (answer: string, index: number) => {
    // Button press animation (snappier, kid-friendly)
    buttonScales[index].value = withSpring(0.92, { damping: 12 }); // More squish
    setTimeout(() => {
      buttonScales[index].value = withSpring(1, { damping: 10, stiffness: 200 });
    }, 80); // Faster release

    playSound('click', { volume: 0.5 }); // Softer for kids
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Light feedback
    setSelectedAnswer(answer);
    setShowNext(true);
  };

  const handleNext = async () => {
    if (selectedAnswer) {
      playSound('click', { volume: 0.5 }); // Softer
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onAnswer(selectedAnswer);
    }
  };

  // Reusable Button Render Function
  const renderOptionButton = (option: string, btnIndex: number, isSecondRow = false) => {
    // Correct index for 2nd row items (0,1 -> 2,3)
    const index = isSecondRow ? btnIndex + 2 : btnIndex;
    return (
      <AnimatedPressable
        key={index}
        style={[
          styles.cssButton,
          {
            width: clampedButtonWidth,
            height: clampedButtonHeight,
          },
          selectedAnswer === option && styles.optionButtonSelected,
          buttonAnimatedStyles[index],
        ]}
        onPress={() => handleSelect(option, index)}
        hitSlop={TouchTargets.hitSlop}
        pressRetentionOffset={TouchTargets.hitSlop}
        accessibilityRole="button"
        accessibilityLabel={`Jawapan ${index + 1}: ${option}`}
        accessibilityState={{ selected: selectedAnswer === option }}>
        <View style={styles.cssButtonInner}>
          <Text
            style={[
              styles.optionText,
              {
                fontSize: answerFontSize,
                paddingHorizontal: answerHorizontalPadding,
                lineHeight: answerFontSize * Typography.lineHeight.tight,
              },
            ]}
            numberOfLines={3}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            allowFontScaling={allowScaling}>
            {option}
          </Text>
        </View>
      </AnimatedPressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.boardContainer, { marginTop: getResponsiveSizeScaled(10, width) }]}>
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
          <View style={[styles.questionSection, { height: offsets.questionAreaHeight, marginBottom: offsets.answerAreaTop, maxWidth: questionMaxWidth }]}>
            <Text
              style={[
                styles.questionText,
                {
                  fontSize: questionFontSize,
                  lineHeight: questionFontSize * Typography.lineHeight.normal,
                },
              ]}
              numberOfLines={forceWrap ? 2 : 7}
              adjustsFontSizeToFit={forceWrap}
              minimumFontScale={forceWrap ? 0.9 : 0.9}
              allowFontScaling={allowScaling}>
              {displayQuestion}
            </Text>
          </View>

          {/* Answers Section - Bottom */}
          <View style={[styles.answersSection, { transform: [{ translateY: answerYOffset }] }]}>
            <View style={[styles.optionsContainer, { gap: offsets.optionsContainer.gap }]}>
              <View style={[styles.optionRow, { gap: offsets.optionRow.gap }]}>
                {question.options.slice(0, 2).map((option, i) => renderOptionButton(option, i, false))}
              </View>

              <View style={[styles.optionRow, { gap: offsets.optionRow.gap }]}>
                {question.options.slice(2, 4).map((option, i) => renderOptionButton(option, i, true))}
              </View>
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
            onPress={handleNext}
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
    maxWidth: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    // lineHeight calculated dynamically inline
  },

  // Answers Section (Bottom of board)
  answersSection: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionRow: {
    flexDirection: 'row',
  },
  // CSS-Styled Button (Replacements for ImageBackground)
  cssButton: {
    backgroundColor: '#5D4037', // Wood texture color
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD700', // Gold border
    ...getComponentShadowStyle(Shadows.component.small),
    overflow: 'hidden',
  },
  cssButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle inner shadow/gradient effect
  },
  optionButtonSelected: {
    opacity: Opacity.selected,
    transform: [{ scale: 0.95 }],
    backgroundColor: '#4E342E', // Darker wood on select
    borderColor: '#FFF176', // Lighter gold
  },
  optionText: {
    // Dynamic: paddingHorizontal
    fontFamily: Typography.fontFamily,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.semiBold,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
