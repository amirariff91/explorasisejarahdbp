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
import { playSound } from '@/utils/audio';
import type { TrueFalseQuestion as TFQuestion } from '@/types';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getTextShadowStyle,
  Shadows,
} from '@/constants/theme';
import { isLandscapeMode, QuestionBoard, ButtonSizes, TouchTargets, EdgeMargins, getQuestionOffsets } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';

interface Props {
  question: TFQuestion;
  onAnswer: (answer: boolean) => void;
}

/**
 * True/False Question - Single Board Layout
 * Question at top of board
 * BETUL and SALAH buttons side-by-side at bottom of board
 */
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TrueFalseQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const { width, height } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const allowScaling = gameState.allowFontScaling;
  const offsets = getQuestionOffsets('trueFalseSingle', isLandscape);
  const baseBoardSize = isLandscape
    ? QuestionBoard.singleBoardTrueFalse.landscape
    : QuestionBoard.singleBoardTrueFalse.portrait;

  // Responsive board sizing - 80% width, 88% height max
  const maxBoardWidth = width * 0.80;
  const maxBoardHeight = height * 0.88;
  const aspectRatio = baseBoardSize.width / baseBoardSize.height;

  let boardWidth = Math.min(baseBoardSize.width, maxBoardWidth);
  let boardHeight = boardWidth / aspectRatio;

  // Check if height exceeds limit, recalculate if needed
  if (boardHeight > maxBoardHeight) {
    boardHeight = maxBoardHeight;
    boardWidth = boardHeight * aspectRatio;
  }

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
          <View style={[styles.questionSection, { height: offsets.questionAreaHeight, marginBottom: offsets.buttonsAreaTop }]}>
            <Text
              style={[
                styles.questionText,
                { fontSize: getResponsiveFontSize(Typography.heading, isLandscape) },
              ]}
              numberOfLines={5}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              allowFontScaling={allowScaling}>
              {question.question}
            </Text>
          </View>

          {/* Buttons Section - Bottom (Horizontal Side-by-Side) */}
          <View style={styles.buttonsSection}>
            <View style={[styles.buttonsRow, { gap: offsets.buttonGap }]}>
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
                  style={[styles.buttonImage, { width: buttonSize.width, height: buttonSize.height }]}
                  contentFit="fill"
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
                  },
                  salahAnimatedStyle,
                ]}
                onPress={() => handleAnswer(false)}
                hitSlop={TouchTargets.hitSlop}
                accessibilityRole="button"
                accessibilityLabel="Jawapan: Salah">
                <Image
                  source={require('@/assets/images/game/buttons/salah-button.png')}
                  style={[styles.buttonImage, { width: buttonSize.width, height: buttonSize.height }]}
                  contentFit="fill"
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
          </View>
        </ImageBackground>
      </View>
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
    maxWidth: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed,
  },

  // Buttons Section (Bottom of board - Horizontal)
  buttonsSection: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
