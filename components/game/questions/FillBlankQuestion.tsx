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
 * Fill in the Blank Question - Landscape Optimized (Unified Layout)
 * Unified layout: Text, Input, and Button all stacked inside the board image.
 */
export default function FillBlankQuestion({ question, onAnswer }: Props) {
  const [answer, setAnswer] = useState('');
  const { width, height } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const isPhone = getDeviceSize(width) === 'phone';
  const isTablet = !isPhone;

  // Use new responsive board sizing system (auto-scales by device tier)
  const baseBoardSize = getQuestionBoardSize('standard', width);

  // Large board states
  const largeBoardStates: MalaysianState[] = ['perlis', 'perak', 'kedah'];
  const isLargeBoardPhone = isPhone && largeBoardStates.includes(question.state);
  const isLargeBoardTablet = !isPhone && largeBoardStates.includes(question.state);
  const phoneBoardMultiplier = isLargeBoardPhone ? 1.4 : 1.0;
  const tabletBoardMultiplier = isLargeBoardTablet ? 1.4 : 1.0;

  // All states except Johor: 40% larger board on tablets only
  const boardSizeMultiplier = !isPhone ? 1.4 : 1.0;
  const perakTabletBoardBoost = !isPhone && question.state === 'perak' ? 1.3 : 1.0;
  const isPerlisTablet = isTablet && question.state === 'perlis';
  const perlisTabletScaleDown = isPerlisTablet ? 0.9 : 1.0; // Prevent oversized board on tablets

  let boardWidth = baseBoardSize.width * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier * perakTabletBoardBoost * perlisTabletScaleDown;
  let boardHeight = baseBoardSize.height * boardSizeMultiplier * phoneBoardMultiplier * tabletBoardMultiplier * perakTabletBoardBoost * perlisTabletScaleDown;

  // UNIFIED LAYOUT SIZING: Maximize board size
  const maxWidthPercent = isPhone ? 0.90 : isPerlisTablet ? 0.72 : 0.75;
  const maxHeightPercent = isPhone ? 1.0 : isPerlisTablet ? 0.86 : 1.0;
  boardWidth = Math.min(boardWidth * 1.5, width * maxWidthPercent);
  boardHeight = Math.min(boardHeight * 1.5, height * maxHeightPercent);

  // Ensure minimum size for usability
  boardWidth = Math.max(boardWidth, 320);
  boardHeight = Math.max(boardHeight, 300);

  const handleSubmit = async () => {
    if (answer.trim()) {
      playSound('click');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAnswer(answer);
    }
  };

  // Unified Content: Text + Input + Button all inside the board
  const content = (
    <View style={styles.unifiedContainer}>
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
        <View style={[styles.unifiedContent, { gap: getResponsiveSizeScaled(10, width) }]}>
          {/* Question Text */}
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.questionText,
                {
                  fontSize: getResponsiveFontSize('question', width),
                  lineHeight: getResponsiveFontSize('question', width) * Typography.lineHeight.normal,
                },
              ]}
              numberOfLines={isPhone ? 5 : 7}
              adjustsFontSizeToFit
              minimumFontScale={0.4}
              allowFontScaling={allowScaling}>
              {question.question}
            </Text>
          </View>

          {/* Input Field */}
          <View style={styles.inputWrapper}>
            <ImageBackground
              source={ASSETS.games.dbpSejarah.isiTempatKosong}
              style={[
                styles.inputContainer,
                {
                  width: getResponsiveSizeScaled(260, width),
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
          </View>

          {/* TERUSKAN Button */}
          <View style={styles.buttonWrapper}>
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
                  paddingVertical: getResponsiveSizeScaled(10, width),
                  paddingHorizontal: getResponsiveSizeScaled(20, width),
                  borderRadius: getResponsiveSizeScaled(14, width),
                  minWidth: getResponsiveSizeScaled(120, width),
                  minHeight: getResponsiveSizeScaled(45, width),
                  // Add shadow for polish
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 3,
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
        </View>
      </ImageBackground>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <LandscapeLayout
        leftSection={null} // Clear left/right split
        rightSection={null}
      >
        {content}
      </LandscapeLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  unifiedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  questionBoard: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  unifiedContent: {
    width: '70%', // Reduced from 78% to 70% to guarantee text stays within paper area
    height: '85%', // Increase height usage
    alignItems: 'center',
    justifyContent: 'center', // Center content block vertically
    paddingVertical: 5,
  },
  textContainer: {
    width: '100%',
    maxHeight: '45%', // Limit text height to prevent pushing other elements off
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    paddingHorizontal: 10, // Extra padding for safety
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    zIndex: 10, // Ensure input is above everything else just in case
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
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  teruskanTextButton: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teruskanButtonText: {
    fontFamily: Typography.fontFamily,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'normal',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
