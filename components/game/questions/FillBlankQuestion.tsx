import LandscapeLayout from '@/components/game/LandscapeLayout';
import { isLandscapeMode, getQuestionBoardSize, TouchTargets } from '@/constants/layout';
import { Colors, getResponsiveFontSize, Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { FillBlankQuestion as FBQuestion } from '@/types';
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
  const { width } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width); // Use consistent landscape detection
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  // Use new responsive board sizing system (auto-scales by device tier)
  const boardSize = getQuestionBoardSize('standard', width);
  const boardScale = 1.25;  // Slightly larger for fill-blank questions
  const scaledBoardWidth = boardSize.width * boardScale;
  const scaledBoardHeight = boardSize.height * boardScale;
  const maxBoardWidth = width * (isLandscape ? 0.85 : 0.92);
  const boardWidth = Math.min(scaledBoardWidth, maxBoardWidth);
  const boardHeight = (scaledBoardHeight / scaledBoardWidth) * boardWidth;

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
            width: width < 1000 ? 250 : 300,
            height: width < 1000 ? 70 : 75,
          },
        ]}
        resizeMode="contain">
        <TextInput
          style={[
            styles.input,
            {
              fontSize: getResponsiveFontSize('answer', width),
              paddingHorizontal: width < 1000 ? 20 : 24,
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
            width: width < 1000 ? 95 : 110,
            height: width < 1000 ? 70 : 80,
            marginTop: width < 1000 ? 24 : 28,
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
