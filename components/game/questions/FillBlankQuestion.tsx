import LandscapeLayout from '@/components/game/LandscapeLayout';
import { isLandscapeMode, getQuestionBoardSize, getDeviceSize, getResponsiveSizeScaled, TouchTargets, getEdgeMargin, getColumnGap } from '@/constants/layout';
import { Colors, getResponsiveFontSize, Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { FillBlankQuestion as FBQuestion, MalaysianState } from '@/types';
import { playSound } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { ASSETS } from '@/constants/assets';

interface Props {
  question: FBQuestion;
  onAnswer: (answer: string) => void;
}

/**
 * Fill in the Blank Question - Landscape Optimized (Figma Screen 9)
 * Left: Question board (45% width)
 * Right: Input field + OK button (50% width)
 */
export default function FillBlankQuestion({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const { width, height } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width); // Use consistent landscape detection
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const isPhone = getDeviceSize(width) === 'phone';
  const isJohor = question.state === 'johor';

  // Use new responsive board sizing system (auto-scales by device tier)
  const baseBoardSize = getQuestionBoardSize('standard', width);

  // Large board states: 40% larger board on phones, 40% additional boost on tablets
  const largeBoardStates: MalaysianState[] = ['perlis', 'perak', 'kedah'];
  const isLargeBoardPhone = isPhone && largeBoardStates.includes(question.state);
  const isLargeBoardTablet = !isPhone && largeBoardStates.includes(question.state);
  const phoneBoardMultiplier = isLargeBoardPhone ? 1.4 : 1.0;
  const tabletBoardMultiplier = isLargeBoardTablet ? 1.4 : 1.0;

  // All states except Johor: 40% larger board on tablets only
  const boardSizeMultiplier = !isJohor && !isPhone ? 1.4 : 1.0;

  const boardSize = {
    width: baseBoardSize.width * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier,
    height: baseBoardSize.height * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier,
  };

  const boardScale = 1.25;  // Slightly larger for fill-blank questions
  const scaledBoardWidth = boardSize.width * boardScale;
  const scaledBoardHeight = boardSize.height * boardScale;
  const edgeMargin = getEdgeMargin(isLandscape);
  const columnGap = getColumnGap(isLandscape);
  const totalFlex = 40 + 58;
  const leftFlexRatio = 40 / totalFlex;
  const availableWidth = width - edgeMargin * 2 - columnGap;
  // Perlis/Perak/Kedah: use larger screen width to allow bigger board
  const maxBoardWidth = isLargeBoardTablet
    ? width * 0.50  // Tablets: 50% width
    : isLargeBoardPhone
      ? width * 0.55  // Phones: 55% width
      : availableWidth * leftFlexRatio;
  let boardWidth = Math.min(scaledBoardWidth, maxBoardWidth);
  let boardHeight = (scaledBoardHeight / scaledBoardWidth) * boardWidth;

  // Final safety check: ensure board fits within screen bounds
  // Perlis/Perak/Kedah tablets: allow up to 52% width to accommodate larger board
  const maxWidthPercent = isLargeBoardTablet ? 0.52 : 0.45;
  boardWidth = Math.min(boardWidth, width * maxWidthPercent);
  boardHeight = Math.min(boardHeight, height * 0.88);

  // Ensure minimum size for usability
  boardWidth = Math.max(boardWidth, 250);
  boardHeight = Math.max(boardHeight, 180);

  const handleSubmit = async () => {
    if (answer.trim()) {
      playSound('click');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAnswer(answer);
    }
  };

  // Left Section: Question Board
  const leftSection = (
    <View style={styles.questionSection}>
      <ImageBackground
        source={ASSETS.games.dbpSejarah.soalanBoard}
        style={[
          styles.questionBoard,
          {
            width: boardWidth,
            height: boardHeight,
          },
        ]}
        resizeMode="contain">
        <View style={styles.questionContent}>
          <Text
            style={[
              styles.questionText,
              {
                fontSize: getResponsiveFontSize('question', width),
                lineHeight: getResponsiveFontSize('question', width) * Typography.lineHeight.normal,
              },
            ]}
            numberOfLines={3}
            adjustsFontSizeToFit
            minimumFontScale={0.9}
            allowFontScaling={allowScaling}>
            {question.question}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );

  // Right Section: Input Field + OK Button
  const rightSection = (
    <View style={styles.inputSection}>
      {/* Input Box */}
      <ImageBackground
        source={ASSETS.games.dbpSejarah.isiTempatKosong}
        style={[
          styles.inputContainer,
          {
            width: getResponsiveSizeScaled(250, width),
            height: getResponsiveSizeScaled(70, width),
          },
        ]}
        resizeMode="contain">
        <TextInput
          style={[
            styles.input,
            {
              fontSize: getResponsiveFontSize('answer', width),
              paddingHorizontal: getResponsiveSizeScaled(20, width),
            },
          ]}
          value={answer}
          onChangeText={setAnswer}
          placeholder="Masukkan jawapan..."
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="sentences"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          allowFontScaling={allowScaling}
          accessibilityLabel="Kotak jawapan"
          accessible
        />
      </ImageBackground>

      {/* OK Button */}
      <Pressable
        style={({ pressed }) => [
          styles.okButton,
          {
            width: getResponsiveSizeScaled(95, width),
            height: getResponsiveSizeScaled(70, width),
            marginTop: getResponsiveSizeScaled(24, width),
            transform: [{ scale: pressed && answer.trim() ? 0.92 : 1 }],
          },
        ]}
        onPress={handleSubmit}
        disabled={!answer.trim()}
        hitSlop={TouchTargets.hitSlop}
        accessibilityRole="button"
        accessibilityLabel="Hantar jawapan"
        accessibilityState={{ disabled: !answer.trim() }}>
        <Image
          source={ASSETS.shared.buttons.ok.default}
          style={[styles.okButtonImage, !answer.trim() && styles.buttonDisabled]}
          contentFit="contain"
        />
      </Pressable>
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
    // lineHeight calculated dynamically inline
  },

  // Right Section: Input + OK Button
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '90%',
  },
  okButton: {
    position: 'relative',
  },
  okButtonImage: {
    width: '100%',
    height: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
