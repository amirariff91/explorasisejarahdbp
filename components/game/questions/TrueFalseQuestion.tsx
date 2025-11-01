import React from 'react';
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
import { playSound } from '@/utils/audio';
import LandscapeLayout from '@/components/game/LandscapeLayout';
import type { TrueFalseQuestion as TFQuestion } from '@/types';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getTextShadowStyle,
  Shadows,
} from '@/constants/theme';
import { isLandscapeMode, QuestionBoard, ButtonSizes, TouchTargets, getQuestionOffsets } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';

interface Props {
  question: TFQuestion;
  onAnswer: (answer: boolean) => void;
}

/**
 * True/False Question - Landscape Optimized (Figma Screen 10)
 * Left: Question board (45% width)
 * Right: Large BETUL / SALAH buttons (50% width)
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TrueFalseQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const { width } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const allowScaling = gameState.allowFontScaling;
  const offsets = getQuestionOffsets('trueFalse', isLandscape) as {
    questionSection: { marginTop: number; marginLeft: number };
    questionContent: { width: string; paddingVertical: number; paddingHorizontal: number; gap: number };
    buttonsSection: { marginTop: number; marginRight: number };
    buttonGap: number;
  };
  const baseBoardSize = isLandscape
    ? QuestionBoard.standard.landscape
    : QuestionBoard.standard.portrait;
  const boardScale = 1.87;
  const scaledBoardWidth = baseBoardSize.width * boardScale;
  const scaledBoardHeight = baseBoardSize.height * boardScale;
  const maxBoardWidth = width * (isLandscape ? 0.504 : 1.056); // Increased by 20%
  const boardWidth = Math.min(scaledBoardWidth, maxBoardWidth);
  const boardHeight = (scaledBoardHeight / scaledBoardWidth) * boardWidth;
  const buttonSize = isLandscape ? ButtonSizes.answer.landscape : ButtonSizes.answer.portrait;

  // Animation values for buttons
  const betulScale = useSharedValue(1);
  const salahScale = useSharedValue(1);

  const handleAnswer = async (answer: boolean) => {
    // Animate the pressed button
    const scale = answer ? betulScale : salahScale;
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);

    playSound('click');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Small delay for visual feedback
    setTimeout(() => {
      onAnswer(answer);
    }, 300);
  };

  const betulAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: betulScale.value }],
  }));

  const salahAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: salahScale.value }],
  }));

  // Left Section: Question Board
  const leftSection = (
    <View style={[styles.questionSection, { marginTop: offsets.questionSection.marginTop, marginLeft: offsets.questionSection.marginLeft }]}>
      <ImageBackground
        source={require('@/assets/images/game/backgrounds/soalan-board.png')}
        style={[
          styles.questionBoard,
          {
            width: boardWidth,
            height: boardHeight,
          },
        ]}
        resizeMode="contain">
        <View style={[
          styles.questionContent,
          {
            width: offsets.questionContent.width as any,
            paddingVertical: offsets.questionContent.paddingVertical,
            paddingHorizontal: offsets.questionContent.paddingHorizontal,
            gap: offsets.questionContent.gap,
          },
        ]}>
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

  // Right Section: BETUL/SALAH Buttons with Animations
  const rightSection = (
    <View style={[styles.buttonsSection, { marginTop: offsets.buttonsSection.marginTop, marginRight: offsets.buttonsSection.marginRight }]}>
      {/* BETUL Button */}
      <AnimatedPressable
        style={[
          styles.button,
          {
            width: buttonSize.width,
            height: buttonSize.height,
          },
          betulAnimatedStyle,
        ]}
        onPress={() => handleAnswer(true)}
        hitSlop={TouchTargets.hitSlop}
        accessibilityRole="button"
        accessibilityLabel="Jawapan: Betul">
        <Image
          source={require('@/assets/images/game/buttons/betul-button.png')}
          style={styles.buttonImage}
          contentFit="contain"
        />
        <Text
          style={[
            styles.buttonText,
            { fontSize: getResponsiveFontSize(Typography.button, isLandscape) + 6 },
          ]}
          allowFontScaling={allowScaling}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
          ellipsizeMode="tail">
          BETUL
        </Text>
      </AnimatedPressable>

      {/* SALAH Button */}
      <AnimatedPressable
        style={[
          styles.button,
          {
            width: buttonSize.width,
            height: buttonSize.height,
            marginTop: offsets.buttonGap,
          },
          salahAnimatedStyle,
        ]}
        onPress={() => handleAnswer(false)}
        hitSlop={TouchTargets.hitSlop}
        accessibilityRole="button"
        accessibilityLabel="Jawapan: Salah">
        <Image
          source={require('@/assets/images/game/buttons/salah-button.png')}
          style={styles.buttonImage}
          contentFit="contain"
        />
        <Text
          style={[
            styles.buttonText,
            { fontSize: getResponsiveFontSize(Typography.button, isLandscape) + 6 },
          ]}
          allowFontScaling={allowScaling}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
          ellipsizeMode="tail">
          SALAH
        </Text>
      </AnimatedPressable>
    </View>
  );

  return (
    <LandscapeLayout
      leftSection={leftSection}
      rightSection={rightSection}
      leftWidth={40}
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
    width: '82%',
    paddingVertical: 32,
    alignItems: 'center',
    gap: 16,
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed,
  },

  // Right Section: Buttons
  buttonsSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    ...getTextShadowStyle(Shadows.text.medium),
  },
});
