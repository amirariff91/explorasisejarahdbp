import { ButtonSizes, EdgeMargins, isLandscapeMode, QuestionBoard, TouchTargets } from '@/constants/layout';
import {
  Colors,
  getResponsiveFontSize,
  getTextShadowStyle,
  Shadows,
  Typography,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { TrueFalseQuestion as TFQuestion } from '@/types';
import { playSound } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
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
import { ASSETS } from '@/constants/assets';

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
  // Simple responsive offsets for True/False questions
  const offsets = {
    boardPaddingTop: 25,
    boardPaddingBottom: 15,
    boardPaddingHorizontal: 30,
    questionAreaHeight: 90,
    buttonsAreaTop: 15,
    buttonGap: 30,
  };

  const baseBoardSize = isLandscape
    ? QuestionBoard.standard.landscape
    : QuestionBoard.standard.portrait;

  // Responsive board sizing - Allow board to reach its base dimensions (408×264)
  const maxBoardWidth = width * 0.90;  // Increased to allow full board size
  const maxBoardHeight = height * 0.88; // Allow adequate height
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

          {/* Buttons Section - Bottom (Vertical Stacking per Figma) */}
          <View style={styles.buttonsSection}>
            {/* BETUL Button - Top */}
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
                source={ASSETS.games.dbpSejarah.betulButton.default}
                style={[styles.buttonImage, { width: buttonSize.width, height: buttonSize.height }]}
                contentFit="fill"
              />
              <Text
                style={[
                  styles.buttonText,
                  { fontSize: isLandscape ? 32 : 28 }, // Figma spec: 32px for action buttons
                ]}
                allowFontScaling={allowScaling}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.75}
                ellipsizeMode="tail">
                BETUL
              </Text>
            </AnimatedPressable>

            {/* SALAH Button - Bottom */}
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
                source={ASSETS.games.dbpSejarah.salahButton.default}
                style={[styles.buttonImage, { width: buttonSize.width, height: buttonSize.height }]}
                contentFit="fill"
              />
              <Text
                style={[
                  styles.buttonText,
                  { fontSize: isLandscape ? 32 : 28 }, // Figma spec: 32px for action buttons
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

  // Buttons Section (Bottom of board - Vertical per Figma)
  buttonsSection: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
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
