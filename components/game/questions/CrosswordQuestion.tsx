import { View, Text, StyleSheet, ImageBackground, useWindowDimensions, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useState } from 'react';
import { getResponsiveFontSize, Typography } from '@/constants/theme';
import { getResponsiveSizeScaled, getQuestionBoardSize } from '@/constants/layout';
import { ASSETS } from '@/constants/assets';
import type { CrosswordQuestion as CWQuestion } from '@/types';
import { useGameContext } from '@/contexts/GameContext';
import ScrollGradientOverlay from '@/components/ui/ScrollGradientOverlay';

interface Props {
  question: CWQuestion;
  onAnswer: (answer: any) => void;
}

/**
 * Crossword Question - Landscape Optimized (Figma Screen 12)
 * Left: MENDATAR (Across) clues (25% width)
 * Center: Title + Crossword grid (50% width)
 * Right: MENEGAK (Down) clues (25% width)
 * Note: Interactive crossword grid is implemented in JohorCrossword.tsx
 */
export default function CrosswordQuestion({ question, onAnswer }: Props) {
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const { width } = useWindowDimensions();
  const [isAcrossAtBottom, setIsAcrossAtBottom] = useState(false);
  const [isDownAtBottom, setIsDownAtBottom] = useState(false);

  // Filter clues by direction
  const acrossClues = question.clues.filter((clue) => clue.direction === 'across');
  const downClues = question.clues.filter((clue) => clue.direction === 'down');

  // Responsive sizing (4-tier system)
  const edgeMargin = getResponsiveSizeScaled(30, width);
  const columnGap = getResponsiveSizeScaled(16, width);
  const baseClueBoardSize = getQuestionBoardSize('clue', width); // Auto-scales from 180×240 base
  const boardScale = 1.87;
  const scaledClueWidth = baseClueBoardSize.width * boardScale;
  const scaledClueHeight = baseClueBoardSize.height * boardScale;
  const totalColumns = 3;
  const availableWidth = Math.max(
    width - edgeMargin * 2 - columnGap * (totalColumns - 1),
    0,
  );
  const columnWidth = availableWidth / totalColumns || 0;

  const clueBoardMaxWidth = columnWidth;
  const clueBoardWidth = Math.min(scaledClueWidth, clueBoardMaxWidth);
  const clueBoardHeight = (scaledClueHeight / scaledClueWidth) * clueBoardWidth;

  const baseGridSize = getResponsiveSizeScaled(220, width);
  const gridSize = Math.min(baseGridSize, columnWidth);

  // Scroll handlers for gradient overlays
  const handleAcrossScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;
    setIsAcrossAtBottom(isAtBottom);
  };

  const handleDownScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 10;
    setIsDownAtBottom(isAtBottom);
  };

  return (
    <View style={styles.container}>
      {/* Three-Column Layout: Across | Grid | Down */}
      <View style={[styles.threeColumnContainer, { paddingHorizontal: edgeMargin, gap: columnGap }]}>

        {/* Left Column: MENDATAR (Across) Clues */}
        <View style={styles.clueColumn}>
          <ImageBackground
            source={ASSETS.games.dbpSejarah.soalanBoard}
            style={[
              styles.clueBoard,
              {
                width: clueBoardWidth,
                height: clueBoardHeight,
              },
            ]}
            resizeMode="contain">
            <View style={styles.clueBoardContent}>
              <View style={{ position: 'relative', flex: 1 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.clueScrollContent}
                onScroll={handleAcrossScroll}
                scrollEventThrottle={16}>
                <Text
                  style={[styles.clueTitle, { fontSize: getResponsiveFontSize('answer', width) }]}
                  allowFontScaling={allowScaling}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.8}>
                  MENDATAR
                </Text>
                {acrossClues.map((clue) => (
                  <Text
                    key={clue.number}
                    style={[styles.clueText, { fontSize: getResponsiveFontSize('clue', width) }]}
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    allowFontScaling={allowScaling}>
                    {clue.number}. {clue.clue}
                  </Text>
                ))}
              </ScrollView>

              {/* Subtle Gradient Overlay */}
              <ScrollGradientOverlay
                visible={!isAcrossAtBottom}
                height={40}
                colors={['rgba(255, 255, 255, 0)', 'rgba(245, 235, 215, 0.7)']}
                opacity={0.8}
                bottom={0}
              />
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Center Column: Title + Grid */}
        <View style={styles.gridColumn}>
          <Text
            style={[styles.title, { fontSize: getResponsiveFontSize('question', width) }]}
            allowFontScaling={allowScaling}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}>
            Teka Silang Kata
          </Text>

          {/* Crossword Grid - Placeholder */}
          <View
            style={[
              styles.gridContainer,
              {
                width: gridSize,
                height: gridSize,
                marginTop: getResponsiveSizeScaled(12, width),
              },
            ]}>
          <ImageBackground
            source={ASSETS.games.dbpSejarah.crosswordBox}
            style={styles.gridBackground}
            resizeMode="contain">
              <Text
                style={[styles.placeholderText, { fontSize: getResponsiveFontSize('answer', width) }]}
                allowFontScaling={allowScaling}>
                Interactive Grid
              </Text>
              <Text
                style={[styles.placeholderText, { fontSize: getResponsiveFontSize('clue', width) }]}
                allowFontScaling={allowScaling}>
                Coming soon...
              </Text>
            </ImageBackground>
          </View>
        </View>

        {/* Right Column: MENEGAK (Down) Clues */}
        <View style={styles.clueColumn}>
          <ImageBackground
            source={ASSETS.games.dbpSejarah.soalanBoard}
            style={[
              styles.clueBoard,
              {
                width: clueBoardWidth,
                height: clueBoardHeight,
              },
            ]}
            resizeMode="contain">
            <View style={styles.clueBoardContent}>
              <View style={{ position: 'relative', flex: 1 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.clueScrollContent}
                onScroll={handleDownScroll}
                scrollEventThrottle={16}>
                <Text
                  style={[styles.clueTitle, { fontSize: getResponsiveFontSize('answer', width) }]}
                  allowFontScaling={allowScaling}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.8}>
                  MENEGAK
                </Text>
                {downClues.map((clue) => (
                  <Text
                    key={clue.number}
                    style={[styles.clueText, { fontSize: getResponsiveFontSize('clue', width) }]}
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    allowFontScaling={allowScaling}>
                    {clue.number}. {clue.clue}
                  </Text>
                ))}
              </ScrollView>

              {/* Subtle Gradient Overlay */}
              <ScrollGradientOverlay
                visible={!isDownAtBottom}
                height={40}
                colors={['rgba(255, 255, 255, 0)', 'rgba(245, 235, 215, 0.7)']}
                opacity={0.8}
                bottom={0}
              />
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Three-Column Layout
  threeColumnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },

  // Left & Right Columns: Clues
  clueColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clueBoard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clueBoardContent: {
    width: '80%',
    paddingVertical: 16,
    flex: 1,  // Allow ScrollView to take available height
  },
  clueScrollContent: {
    flexGrow: 1,
  },
  clueTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  clueText: {
    fontFamily: Typography.fontFamily,
    fontSize: 10,
    color: '#000',
    lineHeight: Typography.lineHeight.normal * 14, // 1.4 * 14 = 19.6
    marginBottom: 4,
  },

  // Center Column: Title + Grid
  gridColumn: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
});
