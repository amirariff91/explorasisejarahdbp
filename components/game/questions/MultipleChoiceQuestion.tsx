import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import LandscapeLayout from '@/components/game/LandscapeLayout';
import type { MultipleChoiceQuestion as MCQuestion } from '@/types';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  Opacity,
  ButtonAnimations,
} from '@/constants/theme';
import {
  isLandscapeMode,
  QuestionBoard,
  ButtonSizes,
  Spacing,
  getEdgeMargin,
  LayoutRatios,
  TouchTargets,
} from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';

interface Props {
  question: MCQuestion;
  onAnswer: (answer: string) => void;
}

/**
 * Multiple Choice Question - Landscape Optimized (Figma Screens 6, 8)
 * Left: Question board (45% width)
 * Right: 4 JAWAPAN buttons in 2x2 grid (50% width)
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function MultipleChoiceQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const { width } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const allowScaling = gameState.allowFontScaling;
  const questionBoardSize = isLandscape
    ? QuestionBoard.standard.landscape
    : QuestionBoard.standard.portrait;
  const buttonSize = isLandscape
    ? ButtonSizes.answerOption.landscape
    : ButtonSizes.answerOption.portrait;
  const nextButtonSize = isLandscape ? ButtonSizes.next.landscape : ButtonSizes.next.portrait;

  // Compute responsive button width so two options always fit the right column
  const edgeMargin = getEdgeMargin(isLandscape);
  const contentWidth = width - edgeMargin * 2;
  const rightPercent = LayoutRatios.twoColumn.standard.right; // 58
  const rightSectionWidth = (contentWidth * rightPercent) / 100;
  const horizontalGap = Spacing.lg; // gap between two buttons in a row
  const computedButtonWidth = Math.floor((rightSectionWidth - horizontalGap) / 2);
  const buttonHeightRatio = buttonSize.height / buttonSize.width;
  const computedButtonHeight = Math.round(computedButtonWidth * buttonHeightRatio);

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

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(answer);
    setShowNext(true);
  };

  const handleNext = async () => {
    if (selectedAnswer) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onAnswer(selectedAnswer);
    }
  };

  // Left Section: Question Board
  const leftSection = (
    <View style={styles.questionSection}>
      <ImageBackground
        source={require('@/assets/images/game/backgrounds/soalan-board.png')}
        style={[
          styles.questionBoard,
          {
            width: questionBoardSize.width,
            height: questionBoardSize.height,
          },
        ]}
        resizeMode="contain">
        <View style={styles.questionContent}>
          <Text
            style={[
              styles.questionText,
              { fontSize: getResponsiveFontSize(Typography.heading, isLandscape) },
            ]}
            numberOfLines={3}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            allowFontScaling={allowScaling}>
            {question.question}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );

  // Right Section: Answer Options
  const rightSection = (
    <View style={styles.answersSection}>
      <View style={styles.optionsContainer}>
        <View style={styles.optionRow}>
          {question.options.slice(0, 2).map((option, btnIndex) => (
            <AnimatedPressable
              key={btnIndex}
              style={[
                styles.optionButton,
                {
                  width: computedButtonWidth,
                  height: computedButtonHeight,
                },
                selectedAnswer === option && styles.optionButtonSelected,
                buttonAnimatedStyles[btnIndex],
              ]}
              onPress={() => handleSelect(option, btnIndex)}
              hitSlop={TouchTargets.hitSlop}
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
                  minimumFontScale={0.8}
                  allowFontScaling={allowScaling}>
                  {option}
                </Text>
              </ImageBackground>
            </AnimatedPressable>
          ))}
        </View>

        <View style={styles.optionRow}>
          {question.options.slice(2, 4).map((option, btnIndex) => {
            const index = btnIndex + 2;
            return (
              <AnimatedPressable
                key={index}
                style={[
                  styles.optionButton,
                  {
                    width: computedButtonWidth,
                    height: computedButtonHeight,
                  },
                  selectedAnswer === option && styles.optionButtonSelected,
                  buttonAnimatedStyles[index],
                ]}
                onPress={() => handleSelect(option, index)}
                hitSlop={TouchTargets.hitSlop}
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
                    minimumFontScale={0.8}
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
  );

  // Footer: Next Button (bottom-right)
  const footer = showNext ? (
    <View style={styles.footerContainer}>
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
  ) : null;

  return (
    <LandscapeLayout
      leftSection={leftSection}
      rightSection={rightSection}
      footer={footer}
      leftWidth={38}
      rightWidth={58}
    />
  );
}

const styles = StyleSheet.create({
  // Left Section: Question
  questionSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionBoard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContent: {
    width: '75%',
    paddingVertical: 35,
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed,
  },

  // Right Section: Answers
  answersSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    gap: Spacing.xxxl, // 32px - Increased vertical spacing
  },
  optionRow: {
    flexDirection: 'row',
    gap: Spacing.lg, // 18px - Horizontal spacing
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

  // Footer: Next Button
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  nextButton: {
    // Size set dynamically
  },
  nextButtonImage: {
    width: '100%',
    height: '100%',
  },
});
