import { View, Text, StyleSheet, ImageBackground, useWindowDimensions } from 'react-native';
import { getLandscapeFontSize, Typography } from '@/constants/theme';
import { ASSETS } from '@/constants/assets';
import type { CrosswordQuestion as CWQuestion } from '@/types';
import { useGameContext } from '@/contexts/GameContext';

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

  // Filter clues by direction
  const acrossClues = question.clues.filter((clue) => clue.direction === 'across');
  const downClues = question.clues.filter((clue) => clue.direction === 'down');

  // Responsive sizing based on width
  const edgeMargin = width < 1000 ? 30 : 40;
  const columnGap = width < 1000 ? 16 : 18;
  const baseClueBoardSize = {
    width: width < 1000 ? 150 : 180,
    height: width < 1000 ? 200 : 240,
  };
  const boardScale = 1.87;
  const scaledClueWidth = baseClueBoardSize.width * boardScale;
  const scaledClueHeight = baseClueBoardSize.height * boardScale;
  const maxClueWidth = width * (width < 1000 ? 0.8 : 0.26);
  const clueBoardWidth = Math.min(scaledClueWidth, maxClueWidth);
  const clueBoardHeight = (scaledClueHeight / scaledClueWidth) * clueBoardWidth;

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
              <Text
                style={[styles.clueTitle, { fontSize: getLandscapeFontSize('answer', width) }]}
                allowFontScaling={allowScaling}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}>
                MENDATAR
              </Text>
              {acrossClues.map((clue) => (
                <Text
                  key={clue.number}
                  style={[styles.clueText, { fontSize: getLandscapeFontSize('clue', width) }]}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  allowFontScaling={allowScaling}>
                  {clue.number}. {clue.clue}
                </Text>
              ))}
            </View>
          </ImageBackground>
        </View>

        {/* Center Column: Title + Grid */}
        <View style={styles.gridColumn}>
          <Text
            style={[styles.title, { fontSize: getLandscapeFontSize('question', width) }]}
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
                width: width < 1000 ? 220 : 260,
                height: width < 1000 ? 220 : 260,
                marginTop: width < 1000 ? 12 : 14,
              },
            ]}>
          <ImageBackground
            source={ASSETS.games.dbpSejarah.crosswordBox}
            style={styles.gridBackground}
            resizeMode="contain">
              <Text
                style={[styles.placeholderText, { fontSize: getLandscapeFontSize('answer', width) }]}
                allowFontScaling={allowScaling}>
                Interactive Grid
              </Text>
              <Text
                style={[styles.placeholderText, { fontSize: getLandscapeFontSize('clue', width) }]}
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
              <Text
                style={[styles.clueTitle, { fontSize: getLandscapeFontSize('answer', width) }]}
                allowFontScaling={allowScaling}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}>
                MENEGAK
              </Text>
              {downClues.map((clue) => (
                <Text
                  key={clue.number}
                  style={[styles.clueText, { fontSize: getLandscapeFontSize('clue', width) }]}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  allowFontScaling={allowScaling}>
                  {clue.number}. {clue.clue}
                </Text>
              ))}
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
