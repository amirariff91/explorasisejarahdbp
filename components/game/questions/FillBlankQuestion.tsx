import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { playSound } from '@/utils/audio';
import LandscapeLayout from '@/components/game/LandscapeLayout';
import { Typography, Colors, getResponsiveFontSize } from '@/constants/theme';
import type { FillBlankQuestion as FBQuestion } from '@/types';
import { isLandscapeMode, QuestionBoard } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';

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
  const baseBoardSize = isLandscape
    ? QuestionBoard.standard.landscape
    : QuestionBoard.standard.portrait;
  const boardScale = 1.87;
  const scaledBoardWidth = baseBoardSize.width * boardScale;
  const scaledBoardHeight = baseBoardSize.height * boardScale;
  const maxBoardWidth = width * (isLandscape ? 0.504 : 1.056); // Increased by 20%
  const boardWidth = Math.min(scaledBoardWidth, maxBoardWidth);
  const boardHeight = (scaledBoardHeight / scaledBoardWidth) * boardWidth;

  const handleSubmit = async () => {
    if (answer.trim()) {
      playSound('click');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onAnswer(answer);
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
            width: boardWidth,
            height: boardHeight,
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

  // Right Section: Input Field + OK Button
  const rightSection = (
    <View style={styles.inputSection}>
      {/* Input Box */}
      <ImageBackground
        source={require('@/assets/images/game/ui-elements/isi-tempat-kosong.png')}
        style={[
          styles.inputContainer,
          {
            width: isLandscape ? 300 : 250,
            height: isLandscape ? 75 : 70,
          },
        ]}
        resizeMode="contain">
        <TextInput
          style={[
            styles.input,
            {
              fontSize: getResponsiveFontSize(Typography.body, isLandscape),
              paddingHorizontal: isLandscape ? 24 : 20,
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
        style={[
          styles.okButton,
          {
            width: isLandscape ? 110 : 95,
            height: isLandscape ? 80 : 70,
            marginTop: isLandscape ? 28 : 24,
          },
        ]}
        onPress={handleSubmit}
        disabled={!answer.trim()}
        accessibilityRole="button"
        accessibilityLabel="Hantar jawapan"
        accessibilityState={{ disabled: !answer.trim() }}>
        <Image
          source={require('@/assets/images/game/buttons/ok-button.png')}
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
    lineHeight: Typography.lineHeight.relaxed,
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
