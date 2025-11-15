import { useMemo, useState, useEffect } from 'react';
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
  QuestionBoard,
  LayoutRatios,
  Spacing,
  ButtonSizes,
  getQuestionOffsets,
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
  const { gameState, completeState, setShowSuccessModal: setGlobalSuccessModal } = useGameContext();
  const allowScaling = gameState.allowFontScaling;

  const [activeClueId, setActiveClueId] = useState<string | null>(INITIAL_ACTIVE_CLUE_ID);
  const [visitedClues, setVisitedClues] = useState<Record<string, boolean>>(() => {
    if (!INITIAL_ACTIVE_CLUE_ID) {
      return {};
    }
    return { [INITIAL_ACTIVE_CLUE_ID]: true };
  });
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackExplanation, setFeedbackExplanation] = useState<string | undefined>(undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const clueBoardSize = isLandscape
    ? QuestionBoard.clue.landscape
    : QuestionBoard.clue.portrait;

  const gridMaxWidth = width * (isLandscape ? 0.42 : 0.78);
  const gridMaxHeight = height * (isLandscape ? 0.58 : 0.42);

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
  const crosswordOffsets = getQuestionOffsets('crossword', isLandscape) as {
    containerPadding: { paddingTop: number; paddingBottom: number };
    columnGap: number;
    gridContainer: { marginTop: number };
    clueContent: { width: string; paddingVertical: number };
  };
  const columnGap = crosswordOffsets.columnGap;

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
    setActiveClueId(clue.id);
    setVisitedClues((prev) => {
      if (prev[clue.id]) {
        return prev;
      }
      return { ...prev, [clue.id]: true };
    });
  };

  const handleCheck = () => {
    const visitedCount = Object.values(visitedClues).filter(Boolean).length;

    if (visitedCount < totalClueCount) {
      playSound('click'); // Incomplete check sound
      setFeedbackExplanation('Sila semak semua petunjuk MENEGAK dan MENDATAR terlebih dahulu.');
      setFeedbackVisible(true);
      return;
    }

    // All clues visited - play success sound
    playSound('star'); // Celebration sound for completion
    // Mark state as completed in global game state but avoid showing the global modal here
    completeState('johor');
    setGlobalSuccessModal(false);
    setShowSuccessModal(true);
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
    playMusic('bgm-quiz', true, 2000); // Reuse quiz music for crossword
    playAmbient('ambient-quiz-soft', 0.15); // Subtle concentration ambience

    return () => {
      stopMusic(1000); // Fade out when leaving crossword
      stopAllAmbient();
    };
  }, []);

  // Switch to success music when modal shows
  useEffect(() => {
    if (showSuccessModal) {
      stopMusic(500); // Quick fade out crossword music
      playMusic('bgm-success', false, 1000); // Fade in success theme (no loop)
    }
  }, [showSuccessModal]);

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
        {/* Title Ribbon */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                // Use stateLabel tier and bump slightly for prominent crossword title
                fontSize: getResponsiveFontSize('stateLabel', width) + 4,
              },
            ]}
            allowFontScaling={allowScaling}
            adjustsFontSizeToFit
            numberOfLines={1}>
            JOHOR
          </Text>
        </View>

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
                          hitSlop={4}>
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
            />
          </View>
        </View>
      </View>

      {/* Floating Controls */}
      <MenuButton />

      <Pressable
        style={[
          styles.nextButton,
          {
            width: nextButtonSize.width,
            height: nextButtonSize.height,
            bottom: insets.bottom + 20,
            right: Math.max(insets.right, 16),
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
        visible={showSuccessModal}
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
}: ClueBoardProps) {
  return (
    <ImageBackground
      source={ASSETS.games.dbpSejarah.soalanBoard}
      style={[
        styles.clueBoard,
        {
          width: boardWidth * 1.9,
          height: boardHeight * 1.9,
        },
      ]}
      resizeMode="contain">
      <View style={styles.clueBoardContent}>
        <Text
          style={styles.clueTitle}
          allowFontScaling={allowScaling}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {title}
        </Text>
        <ScrollView
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
                style={[styles.clueItem, isActive && styles.clueItemActive, isVisited && styles.clueItemVisited]}
                accessibilityRole="button"
                accessibilityLabel={`Petunjuk ${clue.number}. ${clue.text}`}
                accessibilityState={{ selected: isActive }}>
                <Text style={styles.clueNumber} allowFontScaling={allowScaling}>
                  {clue.number}.
                </Text>
                <Text
                  style={[styles.clueText, isActive && styles.clueTextActive]}
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
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: 2,
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
    fontWeight: Typography.fontWeight.bold,
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
    width: '72%',
    paddingVertical: 22,
    gap: 12,
  },
  clueTitle: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  clueScroll: {
    maxHeight: '80%',
  },
  clueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.medium,
    marginBottom: 8,
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
    fontWeight: Typography.fontWeight.bold,
    fontSize: 14,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  clueText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.tight,
  },
  clueTextActive: {
    color: Colors.textLight,
  },
  nextButton: {
    position: 'absolute',
  },
  nextButtonImage: {
    width: '100%',
    height: '100%',
  },
});
