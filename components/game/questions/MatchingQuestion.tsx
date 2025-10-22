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
import * as Haptics from 'expo-haptics';
import LandscapeLayout from '@/components/game/LandscapeLayout';
import { Typography } from '@/constants/theme';
import type { MatchingQuestion as MQQuestion } from '@/types';
import { getEdgeMargin, LayoutRatios } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';

interface Props {
  question: MQQuestion;
  onAnswer: (answer: string[]) => void;
}

/**
 * Matching Question - Landscape Optimized (Figma Screen 11)
 * Left: Title and instructions (40% width)
 * Right: 3x3 grid of JAWAPAN boxes (55% width)
 */
export default function MatchingQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showNext, setShowNext] = useState(false);
  const { width } = useWindowDimensions();
  const isLandscape = width >= 800; // Landscape mode threshold (Figma: 895px)

  const handleToggleOption = async (option: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        // Deselect
        const newSelected = prev.filter((item) => item !== option);
        setShowNext(newSelected.length > 0);
        return newSelected;
      } else {
        // Select
        const newSelected = [...prev, option];
        setShowNext(true);
        return newSelected;
      }
    });
  };

  const handleSubmit = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onAnswer(selectedOptions);
  };

  // Compute responsive grid cell width so 3 columns always fit the right column
  const edgeMargin = getEdgeMargin(isLandscape);
  const contentWidth = width - edgeMargin * 2;
  const rightPercent = LayoutRatios.twoColumn.matching.right; // 55
  const rightSectionWidth = (contentWidth * rightPercent) / 100;
  const cellGap = 12; // matches styles.gridRow gap
  const gridSize = Math.floor((rightSectionWidth - cellGap * 2) / 3);
  const fontSize = Math.max(9, Math.floor(gridSize / 14));

  // Left Section: Question Board with Title
  const leftSection = (
    <View style={styles.questionSection}>
      <ImageBackground
        source={require('@/assets/images/game/backgrounds/soalan-board.png')}
        style={[
          styles.questionBoard,
          {
            width: isLandscape ? 290 : 240,
            height: isLandscape ? 200 : 180,
          },
        ]}
        resizeMode="contain">
        <View style={styles.questionContent}>
          <Text
            style={[styles.titleText, { fontSize: isLandscape ? 18 : 16 }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            allowFontScaling={allowScaling}>
            {question.title}
          </Text>
          <Text
            style={[styles.questionText, { fontSize: isLandscape ? 16 : 14 }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            allowFontScaling={allowScaling}>
            {question.question}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );

  // Right Section: 3x3 Grid of Options
  const rightSection = (
    <View style={styles.gridSection}>
      <View style={styles.grid}>
        {[0, 1, 2].map((row) => (
          <View key={row} style={styles.gridRow}>
            {question.options.slice(row * 3, row * 3 + 3).map((option, col) => {
              const isSelected = selectedOptions.includes(option);
              return (
                <Pressable
                  key={col}
                  style={[
                    styles.gridCell,
                    {
                      width: gridSize,
                      height: gridSize * 0.32,
                    },
                    isSelected && styles.gridCellSelected,
                  ]}
                  onPress={() => handleToggleOption(option)}
                  accessibilityRole="button"
                  accessibilityLabel={`Pilihan ${row * 3 + col + 1}: ${option}`}
                  accessibilityState={{ selected: isSelected }}>
                  <ImageBackground
                    source={require('@/assets/images/game/buttons/jawapan-button.png')}
                    style={styles.gridCellBg}
                    resizeMode="stretch">
                    <Text
                      style={[styles.gridCellText, { fontSize }]}
                      numberOfLines={2}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                      allowFontScaling={allowScaling}>
                      {isSelected && '✓ '}
                      {option}
                    </Text>
                  </ImageBackground>
                </Pressable>
              );
            })}
          </View>
        ))}
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
            width: isLandscape ? 120 : 100,
            height: isLandscape ? 90 : 75,
          },
        ]}
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="Teruskan">
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
      leftWidth={40}
      rightWidth={55}
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
    width: '80%',
    paddingVertical: 25,
  },
  titleText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionText: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Right Section: Grid
  gridSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCell: {
    position: 'relative',
  },
  gridCellSelected: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  gridCellBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  gridCellText: {
    fontFamily: Typography.fontFamily,
    fontSize: 9,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
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
