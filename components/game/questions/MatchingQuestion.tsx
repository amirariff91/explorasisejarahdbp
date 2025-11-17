import { ButtonSizes, EdgeMargins, getQuestionBoardSize, getDeviceSize, getResponsiveSizeScaled, TouchTargets } from '@/constants/layout';
import { Colors, getResponsiveFontSize, Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { MatchingQuestion as MQQuestion } from '@/types';
import { playSound } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ASSETS } from '@/constants/assets';
import CheckboxCard from './CheckboxCard';

interface Props {
  question: MQQuestion;
  onAnswer: (answer: string[]) => void;
}

/**
 * Matching Question - Vertical Checkbox List Layout
 * Question title/instructions at top in board
 * Scrollable list of checkbox items below
 */
export default function MatchingQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showNext, setShowNext] = useState(false);
  const { width, height } = useWindowDimensions();

  // Use singleBoardMC for taller board to accommodate vertical list
  const baseBoardSize = getQuestionBoardSize('singleBoardMC', width);
  const boardSizeMultiplier = 1.0; // Can adjust per state if needed

  const boardSize = {
    width: baseBoardSize.width * boardSizeMultiplier,
    height: baseBoardSize.height * boardSizeMultiplier,
  };

  // Calculate final board dimensions with safety checks
  const maxBoardWidth = width * 0.92;
  const maxBoardHeight = height * 0.88;
  const aspectRatio = boardSize.width / boardSize.height;

  let boardWidth = Math.min(boardSize.width, maxBoardWidth);
  let boardHeight = boardWidth / aspectRatio;

  if (boardHeight > maxBoardHeight) {
    boardHeight = maxBoardHeight;
    boardWidth = boardHeight * aspectRatio;
  }

  // Ensure minimum size for usability
  boardWidth = Math.max(boardWidth, 300);
  boardHeight = Math.max(boardHeight, 200);

  // Board layout offsets - Account for decorative border on soalan-board.png
  // The board image has ornamental borders (~40px top, ~60px bottom, ~45px sides in original 1140×849px)
  // Use percentage-based padding to match actual decorative border proportions
  const offsets = {
    boardPaddingTop: Math.round(boardHeight * 0.05),        // 5% of height (~19px phone → 34px tablet-lg)
    boardPaddingBottom: Math.round(boardHeight * 0.075),    // 7.5% of height (~29px phone → 51px tablet-lg)
    boardPaddingHorizontal: Math.round(boardWidth * 0.04),  // 4% of width (matches ~45px border at 1140px)
    questionAreaHeight: Math.round(boardHeight * 0.24),     // 24% of height (91px phone → 164px tablet-lg)
    listAreaTop: Math.round(boardHeight * 0.02),            // 2% of height (~8px phone → 14px tablet-lg)
  };

  // Calculate internal dimensions for question and list sections
  const questionSectionHeight = offsets.questionAreaHeight;
  const availableListHeight = boardHeight - offsets.boardPaddingTop - offsets.boardPaddingBottom - questionSectionHeight - offsets.listAreaTop;

  // Responsive sizing
  const listGap = 4;  // Fixed 4px gap between checkboxes (reduced from responsive 8-14px)
  const listPaddingHorizontal = getResponsiveSizeScaled(16, width);
  const nextButtonSize = width < 1000 ? ButtonSizes.next.phone : ButtonSizes.next.tablet;

  const handleToggleOption = async (option: string) => {
    playSound('click');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        // Deselect
        const newSelected = prev.filter((item) => item !== option);
        setShowNext(newSelected.length === 3);
        return newSelected;
      } else {
        // Only allow selection if less than 3 already selected
        if (prev.length >= 3) {
          // Already have 3 selections, don't allow more
          return prev;
        }
        // Select
        const newSelected = [...prev, option];
        setShowNext(newSelected.length === 3);
        return newSelected;
      }
    });
  };

  const handleSubmit = async () => {
    playSound('click');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAnswer(selectedOptions);
  };

  return (
    <View style={styles.container}>
      {/* Question Board - Contains Everything */}
      <ImageBackground
        source={ASSETS.games.dbpSejarah.soalanBoard}
        style={[
          styles.questionBoard,
          {
            width: boardWidth,
            height: boardHeight,
            paddingTop: offsets.boardPaddingTop,
            paddingBottom: offsets.boardPaddingBottom,
            paddingHorizontal: offsets.boardPaddingHorizontal,
          },
        ]}
        resizeMode="contain">
        {/* Question Section - Fixed Height at Top */}
        <View style={[styles.questionSection, { height: questionSectionHeight }]}>
          <Text
            style={[
              styles.titleText,
              {
                fontSize: getResponsiveFontSize('question', width),
                lineHeight: getResponsiveFontSize('question', width) * Typography.lineHeight.tight,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            allowFontScaling={allowScaling}>
            {question.title}
          </Text>
          <Text
            style={[
              styles.questionText,
              {
                fontSize: getResponsiveFontSize('answer', width),
                lineHeight: getResponsiveFontSize('answer', width) * Typography.lineHeight.tight,
                marginTop: 6,
              },
            ]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            allowFontScaling={allowScaling}>
            {question.question}
          </Text>
          <Text
            style={[
              styles.instructionText,
              {
                fontSize: getResponsiveFontSize('clue', width),
                color: selectedOptions.length === 3 ? Colors.success : Colors.textSecondary,
                marginTop: 8,
              },
            ]}
            allowFontScaling={allowScaling}>
            Pilih 3 jawapan yang betul ({selectedOptions.length}/3)
          </Text>
        </View>

        {/* Checkbox List - Scrollable Section Below */}
        <View
          style={[
            styles.listContainer,
            {
              height: availableListHeight,
              marginTop: offsets.listAreaTop,
            },
          ]}>
          <FlatList
            data={question.options}
            keyExtractor={(item, index) => `option-${index}`}
            renderItem={({ item, index }) => (
              <CheckboxCard
                option={item}
                isSelected={selectedOptions.includes(item)}
                isDisabled={selectedOptions.length >= 3 && !selectedOptions.includes(item)}
                onPress={() => handleToggleOption(item)}
                index={index}
                allowFontScaling={allowScaling}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ height: listGap }} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </ImageBackground>

      {/* Next Button - Bottom Right */}
      {showNext && (
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              {
                width: nextButtonSize.width,
                height: nextButtonSize.height,
                transform: [{ scale: pressed ? 0.92 : 1 }],
              },
            ]}
            onPress={handleSubmit}
            hitSlop={TouchTargets.hitSlop}
            accessibilityRole="button"
            accessibilityLabel="Teruskan ke soalan seterusnya">
            <Image
              source={ASSETS.shared.buttons.next.default}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: EdgeMargins.landscape,
  },

  // Question Board - Contains Everything
  questionBoard: {
    alignSelf: 'center',
  },

  // Question Section - Fixed Height at Top
  questionSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  instructionText: {
    fontFamily: Typography.fontFamily,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.semiBold,
  },

  // List Container - Scrollable Section
  listContainer: {
    width: '100%',
  },

  // Footer: Next Button
  footer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
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
