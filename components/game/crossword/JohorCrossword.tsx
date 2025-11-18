import { useMemo, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { playSound, playMusic, playAmbient, stopMusic, stopAllAmbient } from '@/utils/audio';
import { johorCrosswordPuzzle } from '@/data/crosswords';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getComponentShadowStyle,
  Shadows,
  BorderRadius,
} from '@/constants/theme';
import {
  isLandscapeMode,
  LayoutRatios,
  Spacing,
  ButtonSizes,
  getQuestionOffsets,
  getQuestionBoardSize,
  getResponsiveSizeScaled,
  TouchTargets,
} from '@/constants/layout';
import StatusBar from '@/components/game/StatusBar';
import MenuButton from '@/components/game/MenuButton';
import FeedbackOverlay from '@/components/game/FeedbackOverlay';
import SuccessModal from '@/components/game/SuccessModal';
import { useGameContext } from '@/contexts/GameContext';
import { ASSETS } from '@/constants/assets';
import type {
  CrosswordPuzzleClue,
  CrosswordPuzzleDefinition,
  CrosswordPuzzleWord,
} from '@/types';

type CrosswordCell = {
  readonly row: number;
  readonly col: number;
  readonly letter: string | null;
  readonly wordIds: string[];
};

const PUZZLE: CrosswordPuzzleDefinition = johorCrosswordPuzzle;
const INITIAL_ACTIVE_CLUE_ID = PUZZLE.clues.across[0]?.id ?? null;

export default function JohorCrossword() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = isLandscapeMode(width);
  const { gameState, completeState, setShowSuccessModal } = useGameContext();
  const allowScaling = gameState.allowFontScaling;

  // Responsive font sizes
  const clueFontSize = getResponsiveFontSize('clue', width);
  const clueNumberSize = clueFontSize + 1; // Slightly larger for numbers
  const titleSize = getResponsiveFontSize('answer', width); // For "MENEGAK"/"MENDATAR"
  const hintSize = clueFontSize - 1; // Smaller for hints

  // Responsive spacing
  const itemPaddingV = getResponsiveSizeScaled(10, width);
  const itemPaddingH = getResponsiveSizeScaled(12, width);
  const itemMargin = getResponsiveSizeScaled(8, width);
  const boardPaddingV = getResponsiveSizeScaled(22, width);
  const contentGap = getResponsiveSizeScaled(12, width);
  const boardContentWidth = getResponsiveSizeScaled(130, width);

  const [activeClueId, setActiveClueId] = useState<string | null>(INITIAL_ACTIVE_CLUE_ID);
  const [visitedClues, setVisitedClues] = useState<Record<string, boolean>>(() => {
    if (!INITIAL_ACTIVE_CLUE_ID) {
      return {};
    }
    return { [INITIAL_ACTIVE_CLUE_ID]: true };
  });
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState<string | undefined>(undefined);
  const [showHint, setShowHint] = useState(true);

  const wordMap = useMemo(() => {
    const entries = PUZZLE.words.map((word: CrosswordPuzzleWord) => [word.id, word] as const);
    return new Map(entries);
  }, []);

  const clueMap = useMemo(() => {
    const entries: [string, CrosswordPuzzleClue][] = [];
    PUZZLE.clues.across.forEach((clue: CrosswordPuzzleClue) => entries.push([clue.id, clue]));
    PUZZLE.clues.down.forEach((clue: CrosswordPuzzleClue) => entries.push([clue.id, clue]));
    return new Map(entries);
  }, []);

  const totalClueCount = PUZZLE.clues.across.length + PUZZLE.clues.down.length;

  const gridCells = useMemo(() => {
    const rows = PUZZLE.gridSize.rows;
    const cols = PUZZLE.gridSize.cols;
    const matrix: CrosswordCell[][] = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex): CrosswordCell => ({
        row: rowIndex,
        col: colIndex,
        letter: null,
        wordIds: [],
      }))
    );

    PUZZLE.words.forEach((word: CrosswordPuzzleWord) => {
      const letters = word.answer.toUpperCase().split('');

      letters.forEach((letter: string, index: number) => {
        const row = word.startRow + (word.direction === 'down' ? index : 0);
        const col = word.startCol + (word.direction === 'across' ? index : 0);

        const cell = matrix[row]?.[col];
        if (!cell) {
          return;
        }

        // Create new cell object instead of mutating readonly properties
        matrix[row]![col] = {
          ...cell,
          letter: letter,
          wordIds: [...cell.wordIds, word.id],
        };
      });
    });

    return matrix;
  }, []);

  const flatCells: CrosswordCell[] = useMemo(() => {
    const list: CrosswordCell[] = [];
    gridCells.forEach((row) => {
      row.forEach((cell) => {
        list.push(cell);
      });
    });
    return list;
  }, [gridCells]);

  const activeClue = activeClueId ? clueMap.get(activeClueId) : undefined;
  const activeWordId = activeClue?.wordId ?? null;
  const activeWord = activeWordId ? wordMap.get(activeWordId) : undefined;

  const highlightedCellKeys = useMemo(() => {
    if (!activeWord) {
      return new Set<string>();
    }

    const keys = new Set<string>();
    const letters = activeWord.answer.length;

    for (let index = 0; index < letters; index += 1) {
      const row = activeWord.startRow + (activeWord.direction === 'down' ? index : 0);
      const col = activeWord.startCol + (activeWord.direction === 'across' ? index : 0);
      keys.add(`${row}-${col}`);
    }

    return keys;
  }, [activeWord]);

  const visitedWordIds = useMemo(() => {
    const ids = new Set<string>();
    Object.entries(visitedClues).forEach(([clueId, visited]) => {
      if (!visited) return;
      const clue = clueMap.get(clueId);
      if (!clue) return;
      ids.add(clue.wordId);
    });
    return ids;
  }, [visitedClues, clueMap]);

  const visitedCount = useMemo(() => {
    return Object.values(visitedClues).filter(Boolean).length;
  }, [visitedClues]);

  const crosswordOffsets = getQuestionOffsets('crossword', isLandscape) as {
    containerPadding: { paddingTop: number; paddingBottom: number };
    columnGap: number;
    gridContainer: { marginTop: number };
    clueContent: { width: string; paddingVertical: number };
  };
  const columnGap = crosswordOffsets.columnGap;

  // Compute available width for three-column layout (clues | grid | clues)
  const horizontalPadding = isLandscape
    ? Spacing.contentPadding.landscape
    : Spacing.contentPadding.portrait;
  const totalColumnFlex =
    LayoutRatios.threeColumn.crossword.left +
    LayoutRatios.threeColumn.crossword.center +
    LayoutRatios.threeColumn.crossword.right;

  // Total width for columns after side padding and inter-column gaps
  const columnsWidth = Math.max(
    width - horizontalPadding * 2 - (isLandscape ? columnGap * 2 : 0),
    0,
  );

  const centerColumnShare = LayoutRatios.threeColumn.crossword.center / totalColumnFlex;
  const clueColumnShare = LayoutRatios.threeColumn.crossword.left / totalColumnFlex;

  const centerColumnWidth = columnsWidth * centerColumnShare;
  const clueColumnWidth = columnsWidth * clueColumnShare;

  // Responsive grid sizing constrained to center column
  const gridMaxWidth = isLandscape ? centerColumnWidth * 0.9 : width * 0.72;
  const gridMaxHeight = height * (isLandscape ? 0.55 : 0.46);

  const baseTileSize = Math.min(
    gridMaxWidth / PUZZLE.gridSize.cols,
    gridMaxHeight / PUZZLE.gridSize.rows,
    52
  );

  let tileSize = Math.max(baseTileSize, 24);
  if (tileSize > baseTileSize) {
    tileSize = baseTileSize;
  }

  const gridWidth = tileSize * PUZZLE.gridSize.cols;
  const gridHeight = tileSize * PUZZLE.gridSize.rows;

  // Responsive clue board sizing using responsive helper (no manual scaling)
  const clueBoardSize = {
    ...getQuestionBoardSize('clue', width),
    width: getQuestionBoardSize('clue', width).width * (isLandscape ? 1.05 : 1.1),
    height: getQuestionBoardSize('clue', width).height * (isLandscape ? 1.05 : 1.1),
  };

  const handleSelectWord = (wordId?: string) => {
    if (!wordId) {
      return;
    }
    const word = wordMap.get(wordId);
    if (!word) {
      return;
    }
    const clue = clueMap.get(word.clueId);
    if (!clue) {
      return;
    }
    playSound('click'); // Tile selection sound
    handleSelectClue(clue);
  };

  const handleSelectClue = (clue: CrosswordPuzzleClue) => {
    playSound('click');
    setShowHint(false);
    setActiveClueId(clue.id);
    setVisitedClues((prev) => {
      if (prev[clue.id]) {
        return prev;
      }
      return { ...prev, [clue.id]: true };
    });
  };

  const handleCheck = () => {
    if (visitedCount < totalClueCount) {
      playSound('click'); // Incomplete check sound
      setFeedbackExplanation(
        `Sila semak semua petunjuk MENEGAK dan MENDATAR terlebih dahulu. (Petunjuk diterokai: ${visitedCount}/${totalClueCount})`
      );
      setFeedbackVisible(true);
      return;
    }

    // All clues visited - play success sound
    playSound('star'); // Celebration sound for completion
    // Mark state as completed and show success modal
    completeState('johor');
  };

  const handleFeedbackDismiss = () => {
    setFeedbackVisible(false);
    setFeedbackExplanation(undefined);
  };

  const handleSuccessContinue = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const handleSuccessRestart = () => {
    setShowSuccessModal(false);
    setVisitedClues(INITIAL_ACTIVE_CLUE_ID ? { [INITIAL_ACTIVE_CLUE_ID]: true } : {});
    setActiveClueId(INITIAL_ACTIVE_CLUE_ID);
  };

  const nextButtonSize = isLandscape ? ButtonSizes.next.landscape : ButtonSizes.next.portrait;

  // Play crossword background music and ambient sounds on mount
  useEffect(() => {
    // Clear any previous ambient layers (e.g., from map or tutorial) before starting crossword ambience
    stopAllAmbient();

    playMusic('bgm-quiz', true, 2000); // Reuse quiz music for crossword
    playAmbient('ambient-quiz-soft', 0.15); // Subtle concentration ambience

    return () => {
      // Fade out crossword (or success) music and clear all ambient when leaving the crossword
      stopMusic(500);
      stopAllAmbient();
    };
  }, []);

  // Switch to success music when modal shows
  useEffect(() => {
    if (gameState.showSuccessModal) {
      // No explicit stopMusic needed - playMusic will handle the transition
      playMusic('bgm-success', false, 1000); // Fade in success theme (no loop)
    }
  }, [gameState.showSuccessModal]);

  return (
    <ImageBackground
      source={ASSETS.shared.backgrounds.main}
      style={styles.background}
      resizeMode="cover">
      <StatusBar state="johor" />

      <View
        style={[
          styles.screenContent,
          {
            paddingHorizontal: isLandscape
              ? Spacing.contentPadding.landscape
              : Spacing.contentPadding.portrait,
            paddingBottom: isLandscape
              ? Spacing.sectionGap.landscape
              : Spacing.sectionGap.portrait,
          },
        ]}>
        {showHint && (
          <View style={styles.hintContainer}>
            <Text
              style={styles.hintText}
              allowFontScaling={allowScaling}
              adjustsFontSizeToFit
              numberOfLines={3}
              minimumFontScale={0.85}>
              Tip: Tekan petunjuk atau kotak huruf untuk sorot jawapan. Semak semua petunjuk MENEGAK dan MENDATAR untuk tamat.
            </Text>
          </View>
        )}

        {/* Three Column Layout */}
        <View
          style={[
            styles.contentRow,
            {
              flexDirection: isLandscape ? 'row' : 'column',
              gap: columnGap,
            },
          ]}>
          <View style={styles.clueColumn}>
            <ClueBoard
              title="MENEGAK"
              clues={PUZZLE.clues.down}
              activeClueId={activeClueId}
              visitedClues={visitedClues}
              allowScaling={allowScaling}
              boardWidth={clueBoardSize.width}
              boardHeight={clueBoardSize.height}
              onSelect={handleSelectClue}
              titleSize={titleSize}
              hintSize={hintSize}
              clueFontSize={clueFontSize}
              clueNumberSize={clueNumberSize}
              boardContentWidth={boardContentWidth}
              boardPaddingV={boardPaddingV}
              contentGap={contentGap}
              itemPaddingV={itemPaddingV}
              itemPaddingH={itemPaddingH}
              itemMargin={itemMargin}
            />
          </View>

          <View style={styles.gridColumn}>
            <View style={styles.gridContainer}>
              <View
                style={[
                  styles.gridSurface,
                  {
                    width: gridWidth,
                    height: gridHeight,
                  },
                ]}>
                {flatCells.map((cell) => {
                  const hasLetter = !!cell.letter;
                  const key = `${cell.row}-${cell.col}`;
                  const isHighlighted = highlightedCellKeys.has(key);
                  const isVisited = cell.wordIds.some((wordId) => visitedWordIds.has(wordId));

                  const selectableWordId = cell.wordIds.find((wordId) => wordId === activeWordId) ?? cell.wordIds[0];

                  return (
                    <View
                      key={key}
                      style={{
                        width: tileSize,
                        height: tileSize,
                      }}>
                      {hasLetter ? (
                        <Pressable
                          style={styles.tilePressable}
                          onPress={() => handleSelectWord(selectableWordId)}
                          accessibilityRole="button"
                          accessibilityLabel={`Petak huruf ${cell.letter}`}
                          hitSlop={TouchTargets.hitSlop}>
                          <ImageBackground
                            source={ASSETS.games.dbpSejarah.crosswordBox}
                            style={styles.tileBackground}
                            resizeMode="cover">
                            <View
                              style={[
                                styles.tileOverlay,
                                isVisited && styles.tileVisited,
                                isHighlighted && styles.tileActive,
                              ]}
                            />
                            <Text
                              style={[styles.tileLetter, isHighlighted && styles.tileLetterActive]}
                              allowFontScaling={allowScaling}>
                              {cell.letter}
                            </Text>
                          </ImageBackground>
                        </Pressable>
                      ) : (
                        <View style={styles.emptyTile} />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.clueColumn}>
            <ClueBoard
              title="MENDATAR"
              clues={PUZZLE.clues.across}
              activeClueId={activeClueId}
              visitedClues={visitedClues}
              allowScaling={allowScaling}
              boardWidth={clueBoardSize.width}
              boardHeight={clueBoardSize.height}
              onSelect={handleSelectClue}
              titleSize={titleSize}
              hintSize={hintSize}
              clueFontSize={clueFontSize}
              clueNumberSize={clueNumberSize}
              boardContentWidth={boardContentWidth}
              boardPaddingV={boardPaddingV}
              contentGap={contentGap}
              itemPaddingV={itemPaddingV}
              itemPaddingH={itemPaddingH}
              itemMargin={itemMargin}
            />
          </View>
        </View>
      </View>

      {/* Floating Controls */}
      <MenuButton />

      <Text
        style={[
          styles.progressText,
          {
            bottom: insets.bottom + 28,
            left: Math.max(insets.left, 16),
          },
        ]}
        allowFontScaling={allowScaling}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}>
        Petunjuk diterokai: {visitedCount}/{totalClueCount}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.nextButton,
          {
            width: nextButtonSize.width,
            height: nextButtonSize.height,
            bottom: insets.bottom + 20,
            right: Math.max(insets.right, 16),
            transform: [{ scale: pressed ? 0.92 : 1 }],
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Semak jawapan"
        onPress={handleCheck}>
        <Image
          source={ASSETS.shared.buttons.next.default}
          style={styles.nextButtonImage}
          contentFit="contain"
        />
      </Pressable>

      <FeedbackOverlay
        visible={feedbackVisible}
        isCorrect={false}
        explanation={feedbackExplanation}
        onDismiss={handleFeedbackDismiss}
      />

      <SuccessModal
        visible={gameState.showSuccessModal}
        onContinue={handleSuccessContinue}
        onRestart={handleSuccessRestart}
      />
    </ImageBackground>
  );
}

interface ClueBoardProps {
  title: string;
  clues: CrosswordPuzzleClue[];
  activeClueId: string | null;
  visitedClues: Record<string, boolean>;
  allowScaling: boolean;
  boardWidth: number;
  boardHeight: number;
  onSelect: (clue: CrosswordPuzzleClue) => void;
  // Responsive font sizes
  titleSize: number;
  hintSize: number;
  clueFontSize: number;
  clueNumberSize: number;
  // Responsive spacing
  boardContentWidth: number;
  boardPaddingV: number;
  contentGap: number;
  itemPaddingV: number;
  itemPaddingH: number;
  itemMargin: number;
}

function ClueBoard({
  title,
  clues,
  activeClueId,
  visitedClues,
  allowScaling,
  boardWidth,
  boardHeight,
  onSelect,
  // Responsive font sizes
  titleSize,
  hintSize,
  clueFontSize,
  clueNumberSize,
  // Responsive spacing
  boardContentWidth,
  boardPaddingV,
  contentGap,
  itemPaddingV,
  itemPaddingH,
  itemMargin,
}: ClueBoardProps) {
  const scrollRef = useRef<ScrollView | null>(null);
  const itemLayoutRef = useRef<Record<string, number>>({});
  const isAcross = title === 'MENDATAR';
  const isDown = title === 'MENEGAK';
  const titleColor = isAcross ? '#0a87b8' : '#1d9c3a';

  useEffect(() => {
    if (!activeClueId) return;
    const y = itemLayoutRef.current[activeClueId];
    if (y === undefined || !scrollRef.current) return;
    const offset = Math.max(y - 40, 0);
    scrollRef.current.scrollTo({ y: offset, animated: true });
  }, [activeClueId]);

  return (
    <ImageBackground
      source={ASSETS.games.dbpSejarah.soalanBoard}
      style={[
        styles.clueBoard,
        {
          width: boardWidth,
          height: boardHeight,
        },
      ]}
      resizeMode="contain">
      <View
        style={[
      styles.clueBoardContent,
      {
        width: boardContentWidth,
        paddingVertical: boardPaddingV,
        gap: contentGap,
      },
    ]}>
      <Text
        style={[
          styles.clueTitle,
          {
            fontSize: titleSize,
            color: Colors.textLight,
            backgroundColor: titleColor,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 14,
            overflow: 'hidden',
            textAlign: 'center',
            textShadowColor: 'rgba(0,0,0,0.35)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 3,
          },
        ]}
        allowFontScaling={allowScaling}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}>
        {title}
      </Text>
        <Text
          style={[styles.clueHint, { fontSize: hintSize }]}
          allowFontScaling={allowScaling}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}>
          Leret untuk lihat semua petunjuk
        </Text>
        <ScrollView
          ref={scrollRef}
          style={styles.clueScroll}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {clues.map((clue) => {
            const isActive = activeClueId === clue.id;
            const isVisited = visitedClues[clue.id];
            return (
              <Pressable
                key={clue.id}
                onPress={() => onSelect(clue)}
                onLayout={(event) => {
                  const y = event.nativeEvent.layout.y;
                  itemLayoutRef.current[clue.id] = y;
                  if (activeClueId === clue.id && scrollRef.current) {
                    const offset = Math.max(y - 40, 0);
                    scrollRef.current.scrollTo({ y: offset, animated: true });
                  }
                }}
                style={[
                  styles.clueItem,
                  {
                    paddingVertical: itemPaddingV,
                    paddingHorizontal: itemPaddingH,
                    marginBottom: itemMargin,
                  },
                  isActive && styles.clueItemActive,
                  isVisited && styles.clueItemVisited,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Petunjuk ${clue.number}. ${clue.text}`}
                accessibilityState={{ selected: isActive }}>
                <Text style={[styles.clueNumber, { fontSize: clueNumberSize }]} allowFontScaling={allowScaling}>
                  {clue.number}.
                </Text>
                <Text
                  style={[styles.clueText, { fontSize: clueFontSize }, isActive && styles.clueTextActive]}
                  allowFontScaling={allowScaling}
                  adjustsFontSizeToFit
                  numberOfLines={3}
                  minimumFontScale={0.85}>
                  {clue.text}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.semiTransparentCard,
    borderRadius: BorderRadius.large,
    ...getComponentShadowStyle(Shadows.component.medium),
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  hintContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.semiTransparentCard,
    borderRadius: BorderRadius.medium,
    ...getComponentShadowStyle(Shadows.component.small),
  },
  hintText: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  contentRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clueColumn: {
    flex: LayoutRatios.threeColumn.crossword.left,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridColumn: {
    flex: LayoutRatios.threeColumn.crossword.center,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.semiTransparentCard,
    borderRadius: BorderRadius.medium,
    ...getComponentShadowStyle(Shadows.component.small),
  },
  gridSurface: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tileBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tilePressable: {
    flex: 1,
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius.small,
  },
  tileVisited: {
    backgroundColor: Colors.semiTransparentCard,
  },
  tileActive: {
    borderWidth: 2,
    borderColor: Colors.warning,
    backgroundColor: Colors.warning,
    opacity: 0.35,
  },
  tileLetter: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
    fontSize: 20,
    color: Colors.textPrimary,
  },
  tileLetterActive: {
    color: Colors.primary,
  },
  emptyTile: {
    flex: 1,
  },
  clueBoard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clueBoardContent: {
    // Width, padding, and gap applied inline with responsive values
  },
  clueTitle: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
    // color and sizing applied inline
    textAlign: 'center',
    marginBottom: 12,
  },
  clueHint: {
    fontFamily: Typography.fontFamily,
    // fontSize applied inline with responsive value
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 6,
  },
  clueScroll: {
    maxHeight: '80%',
  },
  clueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // Padding and margin applied inline with responsive values
    borderRadius: BorderRadius.medium,
    backgroundColor: 'transparent',
  },
  clueItemVisited: {
    backgroundColor: Colors.semiTransparentCard,
  },
  clueItemActive: {
    backgroundColor: Colors.warning,
  },
  clueNumber: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal, // Changed from bold - Galindo only has 400 Regular weight
    // fontSize applied inline with responsive value
    color: '#4A3020', // Dark brown for better contrast on light background
    marginRight: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  clueText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    // fontSize applied inline with responsive value
    color: '#4A3020', // Dark brown for better contrast on light background
    lineHeight: Typography.lineHeight.tight,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  clueTextActive: {
    color: Colors.textLight,
  },
  progressText: {
    position: 'absolute',
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: Colors.textPrimary,
    backgroundColor: Colors.semiTransparentCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.medium,
    ...getComponentShadowStyle(Shadows.component.small),
  },
  nextButton: {
    position: 'absolute',
  },
  nextButtonImage: {
    width: '100%',
    height: '100%',
  },
});
