import {
  ButtonSizes,
  EdgeMargins,
  getQuestionOffsets,
  isLandscapeMode,
  QuestionBoard,
  TouchTargets,
} from '@/constants/layout';
import {
  Colors,
  getResponsiveFontSize,
  Opacity,
  Typography,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { MultipleChoiceQuestion as MCQuestion } from '@/types';
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
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MultipleChoiceQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const allowScaling = gameState.allowFontScaling;
  const offsets = getQuestionOffsets('multipleChoiceSingle', isLandscape) as {
    boardPaddingTop: number;
    boardPaddingBottom: number;
    boardPaddingHorizontal: number;
    questionAreaHeight: number;
    answerAreaTop: number;
    optionsContainer: { gap: number };
    optionRow: { gap: number };
    footerContainer: { marginBottom: number; marginRight: number };
  };
  const baseBoardSize = isLandscape
    ? QuestionBoard.singleBoardMC.landscape
    : QuestionBoard.singleBoardMC.portrait;

  // Responsive board sizing - Allow board to reach its base dimensions
  const maxBoardWidth = width * 0.90;  // Increased to allow base size (350px)
  const maxBoardHeight = height * 0.88; // Allow adequate height for longer questions
  const aspectRatio = baseBoardSize.width / baseBoardSize.height;

  let boardWidth = Math.min(baseBoardSize.width, maxBoardWidth);
  let boardHeight = boardWidth / aspectRatio;

  // Check if height exceeds limit, recalculate if needed
  if (boardHeight > maxBoardHeight) {
    boardHeight = maxBoardHeight;
    boardWidth = boardHeight * aspectRatio;
  }
  const nextButtonSize = isLandscape ? ButtonSizes.next.landscape : ButtonSizes.next.portrait;

  // Calculate button dimensions based on board width
  const buttonAreaWidth = boardWidth - (offsets.boardPaddingHorizontal * 2);
  const horizontalGap = offsets.optionRow.gap;
  const buttonWidth = (buttonAreaWidth - horizontalGap) / 2;

  // Clamp button width with min/max bounds
  const clampedButtonWidth = Math.max(140, Math.min(buttonWidth, 260)); // Optimized for 680×380 board

  // Maintain button aspect ratio
  const buttonAspectRatio = 184 / 626; // jawapan-button.png aspect ratio
  const clampedButtonHeight = clampedButtonWidth * buttonAspectRatio;

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
    // Button press animation
    buttonScales[index].value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      buttonScales[index].value = withSpring(1, { damping: 10 });
    }, 100);

    playSound('click');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(answer);
    setShowNext(true);
  };

  const handleNext = async () => {
    if (selectedAnswer) {
      playSound('click');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onAnswer(selectedAnswer);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <ImageBackground
          source={require('@/assets/images/game/backgrounds/soalan-board.png')}
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
          <View style={[styles.questionSection, { height: offsets.questionAreaHeight, marginBottom: offsets.answerAreaTop }]}>
            <Text
              style={[
                styles.questionText,
                { fontSize: getResponsiveFontSize(Typography.heading, isLandscape) },
              ]}
              numberOfLines={7}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              allowFontScaling={allowScaling}>
              {question.question}
            </Text>
          </View>

          {/* Answers Section - Bottom */}
          <View style={styles.answersSection}>
            <View style={[styles.optionsContainer, { gap: offsets.optionsContainer.gap }]}>
              <View style={[styles.optionRow, { gap: offsets.optionRow.gap }]}>
                {question.options.slice(0, 2).map((option, btnIndex) => (
                  <AnimatedPressable
                    key={btnIndex}
                    style={[
                      styles.optionButton,
                      {
                        width: clampedButtonWidth,
                        height: clampedButtonHeight,
                      },
                      selectedAnswer === option && styles.optionButtonSelected,
                      buttonAnimatedStyles[btnIndex],
                    ]}
                    onPress={() => handleSelect(option, btnIndex)}
                    hitSlop={TouchTargets.hitSlop}
                    pressRetentionOffset={TouchTargets.hitSlop}
                    accessibilityRole="button"
                    accessibilityLabel={`Jawapan ${btnIndex + 1}: ${option}`}
                    accessibilityState={{ selected: selectedAnswer === option }}>
                    <ImageBackground
                      source={require('@/assets/images/game/buttons/jawapan-button.png')}
                      style={styles.optionButtonBg}
                      resizeMode="stretch">
                      <Text
                        style={[
                          styles.optionText,
                          { fontSize: getResponsiveFontSize(Typography.bodySmall, isLandscape) },
                        ]}
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        minimumFontScale={0.85}
                        allowFontScaling={allowScaling}>
                        {option}
                      </Text>
                    </ImageBackground>
                  </AnimatedPressable>
                ))}
              </View>

              <View style={[styles.optionRow, { gap: offsets.optionRow.gap }]}>
                {question.options.slice(2, 4).map((option, btnIndex) => {
                  const index = btnIndex + 2;
                  return (
                    <AnimatedPressable
                      key={index}
                      style={[
                        styles.optionButton,
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
                      <ImageBackground
                        source={require('@/assets/images/game/buttons/jawapan-button.png')}
                        style={styles.optionButtonBg}
                        resizeMode="stretch">
                        <Text
                          style={[
                            styles.optionText,
                            { fontSize: getResponsiveFontSize(Typography.bodySmall, isLandscape) },
                          ]}
                          numberOfLines={2}
                          adjustsFontSizeToFit
                          minimumFontScale={0.85}
                          allowFontScaling={allowScaling}>
                          {option}
                        </Text>
                      </ImageBackground>
                    </AnimatedPressable>
                  );
                })}
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
            style={[
              styles.nextButton,
              {
                width: nextButtonSize.width,
                height: nextButtonSize.height,
              },
            ]}
            onPress={handleNext}
            hitSlop={TouchTargets.hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Teruskan ke soalan seterusnya">
            <Image
              source={require('@/assets/images/game/buttons/next-button.png')}
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
    lineHeight: Typography.lineHeight.normal * 20, // 1.4 * 20 = 28
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
  optionButton: {
    position: 'relative',
  },
  optionButtonSelected: {
    opacity: Opacity.selected,
    transform: [{ scale: 0.95 }],
  },
  optionButtonBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.semiBold,
    paddingHorizontal: 8,
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
