import LandscapeLayout from '@/components/game/LandscapeLayout';
import { isLandscapeMode, getQuestionBoardSize, getDeviceSize, getResponsiveSizeScaled, TouchTargets, getEdgeMargin, getColumnGap } from '@/constants/layout';
import { Colors, getResponsiveFontSize, Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { FillBlankQuestion as FBQuestion, MalaysianState } from '@/types';
import { playSound } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
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
 * Right: Input field + TERUSKAN button (50% width)
 */
export default function FillBlankQuestion({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const { width, height } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width); // Use consistent landscape detection
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const isPhone = getDeviceSize(width) === 'phone';
  const isJohor = question.state === 'johor';
  const LEFT_SECTION_FLEX = 48;
  const RIGHT_SECTION_FLEX = 52;

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
  const perakTabletBoardBoost = !isPhone && question.state === 'perak' ? 1.3 : 1.0;

  const boardSize = {
    width: baseBoardSize.width * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier * perakTabletBoardBoost,
    height: baseBoardSize.height * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier * perakTabletBoardBoost,
  };

  const boardScale = 1.25;  // Slightly larger for fill-blank questions
  const scaledBoardWidth = boardSize.width * boardScale;
  const scaledBoardHeight = boardSize.height * boardScale;
  const edgeMargin = getEdgeMargin(isLandscape);
  const columnGap = getColumnGap(isLandscape);
  const totalFlex = LEFT_SECTION_FLEX + RIGHT_SECTION_FLEX;
  const leftFlexRatio = LEFT_SECTION_FLEX / totalFlex;
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
  const maxWidthPercent = isLargeBoardTablet ? 0.58 : 0.48;
  boardWidth = Math.min(boardWidth, width * maxWidthPercent);
  boardHeight = Math.min(boardHeight, height * 0.90);

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
            numberOfLines={4}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            allowFontScaling={allowScaling}>
            {question.question}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );

  // Right Section: Input Field + TERUSKAN Button
  const rightSection = (
    <View style={[styles.inputSection, { gap: getResponsiveSizeScaled(20, width) }]}>
      {/* Input Box */}
      <ImageBackground
        source={ASSETS.games.dbpSejarah.isiTempatKosong}
        style={[
          styles.inputContainer,
          {
            width: getResponsiveSizeScaled(280, width),
            height: getResponsiveSizeScaled(80, width),
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

      {/* TERUSKAN Button */}
      <Pressable
        style={({ pressed }) => [
          {
            transform: [
              { scale: pressed && answer.trim() ? 0.95 : 1 },
            ],
          },
        ]}
        onPress={handleSubmit}
        disabled={!answer.trim()}
        hitSlop={TouchTargets.hitSlop}
        accessibilityRole="button"
        accessibilityLabel="Hantar jawapan"
        accessibilityState={{ disabled: !answer.trim() }}>
        <View style={[
          styles.teruskanTextButton,
          {
            paddingVertical: getResponsiveSizeScaled(12, width),
            paddingHorizontal: getResponsiveSizeScaled(24, width),
            borderRadius: getResponsiveSizeScaled(16, width),
            minWidth: getResponsiveSizeScaled(140, width),
            minHeight: getResponsiveSizeScaled(55, width),
            // Add shadow for polish
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          },
          !answer.trim() && styles.buttonDisabled
        ]}>
          <Text
            style={[
              styles.teruskanButtonText,
              { fontSize: getResponsiveFontSize('answer', width) }
            ]}
            allowFontScaling={allowScaling}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
            numberOfLines={1}
          >
            TERUSKAN
          </Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LandscapeLayout
        leftSection={leftSection}
        rightSection={rightSection}
        leftWidth={LEFT_SECTION_FLEX}
        rightWidth={RIGHT_SECTION_FLEX}
      />
    </View>
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
    flexShrink: 1, // Allow shrinking if needed to prevent overlap
  },
  questionContent: {
    width: '78%',
    paddingVertical: 40,
    alignItems: 'center',
    gap: 20,
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    // lineHeight calculated dynamically inline
  },

  // Right Section: Input + TERUSKAN Button
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1, // Allow shrinking to scale down if screen is tight
  },
  input: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '90%',
  },

  // TERUSKAN Text Button
  teruskanTextButton: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical, paddingHorizontal, borderRadius set inline dynamically
  },
  teruskanButtonText: {
    fontFamily: Typography.fontFamily,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'normal',
    // fontSize set inline dynamically
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
