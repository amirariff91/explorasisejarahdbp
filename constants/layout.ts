/**
 * Layout Constants - Responsive Design System
 * Standardized dimensions, spacing, and breakpoints
 */

// Responsive Breakpoints
export const Breakpoints = {
  // Landscape mode threshold (standardized across all components)
  landscape: 800, // px - Optimized for landscape tablets (917�412 Figma design)
} as const;

// Edge Margins (Dead Zones for thumb grips)
export const EdgeMargins = {
  landscape: 40, // px - Wider margins for landscape mode
  portrait: 30, // px - Standard margins for portrait mode
} as const;

// Spacing Scale (4px base unit)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  // Semantic spacing for common patterns
  edgeMargin: { landscape: 40, portrait: 30 },
  questionGap: { landscape: 24, portrait: 20 },
  buttonGap: { landscape: 20, portrait: 16 },
  contentPadding: { landscape: 35, portrait: 28 },
  sectionGap: { landscape: 28, portrait: 24 },
} as const;

// Component Sizes - Question Boards
export const QuestionBoard = {
  // Standard Question Board (Multiple Choice, True/False, Fill Blank) - Increased by 20%
  standard: {
    landscape: { width: 408, height: 264 },
    portrait: { width: 336, height: 312 },
  },
  // Compact Board (Matching, smaller content)
  compact: {
    landscape: { width: 290, height: 200 },
    portrait: { width: 240, height: 180 },
  },
  // Large Board (Tutorial, State Selection)
  large: {
    landscape: { width: 380, height: 160 },
    portrait: { width: 300, height: 200 },
  },
  // Description Board (Tutorial descriptions)
  description: {
    landscape: { width: 380, height: 200 },
    portrait: { width: 320, height: 180 },
  },
  // Clue Board (Crossword clues)
  clue: {
    landscape: { width: 180, height: 240 },
    portrait: { width: 150, height: 200 },
  },
  // Single Board (Multiple Choice - question + answers on same board)
  singleBoardMC: {
    landscape: { width: 700, height: 480 },
    portrait: { width: 500, height: 520 },
  },
  // Single Board (Matching - question + 3x3 grid on same board)
  singleBoardMatching: {
    landscape: { width: 750, height: 450 },
    portrait: { width: 550, height: 480 },
  },
  // Single Board (True/False - question + BETUL/SALAH buttons on same board)
  singleBoardTrueFalse: {
    landscape: { width: 700, height: 400 },
    portrait: { width: 500, height: 440 },
  },
} as const;

// Component Sizes - Buttons (Mobile Game Optimized)
export const ButtonSizes = {
  // Next Button (proceed to next question)
  next: {
    landscape: { width: 120, height: 90 },
    portrait: { width: 100, height: 75 },
  },
  // Menu Button (pause/settings)
  menu: {
    landscape: { width: 120, height: 100 },
    portrait: { width: 100, height: 85 },
  },
  // Answer Button (BETUL/SALAH) - Increased for better touch targets
  answer: {
    landscape: { width: 260, height: 85 },  // +5px height
    portrait: { width: 220, height: 80 },   // +5px height
  },
  // OK Button (submit fill-in-the-blank)
  ok: {
    landscape: { width: 110, height: 80 },
    portrait: { width: 95, height: 70 },
  },
  // Tutorial Continue Button
  tutorialContinue: {
    landscape: { width: 130, height: 90 },
    portrait: { width: 115, height: 80 },
  },
  // Success Modal Button
  successAction: {
    landscape: { width: 240, height: 70 },  // +5px height
    portrait: { width: 220, height: 65 },   // +5px height
  },
  // State Selection Button (fixed width)
  stateButton: {
    widthPercent: 90, // % of container
    paddingVertical: 12,  // +2px for better touch
    paddingHorizontal: 20,
    minHeight: 48,  // Increased from 44
  },
  // Answer Option Button (Multiple Choice) - CRITICAL: Increased for better touch
  answerOption: {
    landscape: { width: 190, height: 70 },  // +13px height (was too small!)
    portrait: { width: 170, height: 65 },   // +10px height
  },
} as const;

// Touch Target Guidelines (Mobile Game Standards)
export const TouchTargets = {
  minimum: 60,      // Absolute minimum for game buttons
  comfortable: 70,  // Preferred for primary actions
  large: 80,        // For frequently used actions
  hitSlop: 10,      // Extra padding around pressable areas
} as const;

// Component Sizes - UI Elements
export const UIElements = {
  // StatusBar elements
  statusBar: {
    healthBar: {
      landscape: { width: 200, height: 50 },
      portrait: { width: 160, height: 50 },
    },
    moneyBar: {
      landscape: { width: 200, height: 50 },
      portrait: { width: 160, height: 50 },
    },
    stateIndicator: {
      landscape: { width: 240, height: 55 },
      portrait: { width: 200, height: 70 },
    },
  },
  // Success Modal elements
  successModal: {
    star: {
      landscape: { width: 320, height: 180 },
      portrait: { width: 250, height: 150 },
    },
    tahniahBg: {
      landscape: { width: 450, height: 400 },
      portrait: { width: 350, height: 325 },
    },
    flare: {
      width: 700,
      height: 600,
    },
  },
  // Input fields
  input: {
    fillBlank: {
      landscape: { width: 300, height: 75 },
      portrait: { width: 250, height: 70 },
    },
  },
  // Grid cells (Matching question)
  gridCell: {
    landscape: { size: 160, heightRatio: 0.32 }, // height = size * heightRatio
    portrait: { size: 130, heightRatio: 0.32 },
  },
  // Crossword grid
  crosswordGrid: {
    landscape: { width: 260, height: 260 },
    portrait: { width: 220, height: 220 },
  },
} as const;

// Layout Ratios (for two-column and three-column layouts)
export const LayoutRatios = {
  // Two-column layouts (Question | Answers)
  twoColumn: {
    // Standard (Multiple Choice, True/False, Fill Blank, Matching)
    standard: {
      left: 40, // % - Increased from 38% for consistent spacing
      right: 58, // %
      gap: 2, // % (remaining) - Managed by LandscapeLayout flexbox gap
    },
    // Matching (Title | Grid) - Uses same ratios as standard
    matching: {
      left: 40, // %
      right: 58, // % - Updated from 55% for consistency
      gap: 2, // % - Updated from 5%
    },
    // Tutorial (Title | Content)
    tutorial: {
      left: 1, // flex ratio
      right: 1.3, // flex ratio
      gap: 24, // px
    },
  },
  // Three-column layouts
  threeColumn: {
    // State Selection (Peninsula | Center | Borneo)
    stateSelection: {
      left: 1, // flex ratio
      center: 1.2, // flex ratio
      right: 1, // flex ratio
      gap: 20, // px
    },
    // Crossword (Across | Grid | Down)
    crossword: {
      left: 1, // flex ratio
      center: 1.2, // flex ratio
      right: 1, // flex ratio
      gap: 18, // px (landscape) / 16 (portrait)
    },
  },
} as const;

// Question Element Positioning - Easily adjustable offsets for quiz layout
export const QuestionOffsets = {
  multipleChoice: {
    landscape: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 16 },
      answersSection: { marginTop: 0, marginRight: 0 },
      optionsContainer: { marginTop: 0, gap: 32 }, // vertical gap between rows
      optionRow: { gap: 18 }, // horizontal gap between buttons
      footerContainer: { marginBottom: 0, marginRight: 0 },
    },
    portrait: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 16 },
      answersSection: { marginTop: 0, marginRight: 0 },
      optionsContainer: { marginTop: 0, gap: 28 },
      optionRow: { gap: 16 },
      footerContainer: { marginBottom: 0, marginRight: 0 },
    },
  },
  trueFalse: {
    landscape: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 16 },
      buttonsSection: { marginTop: 0, marginRight: 0 },
      buttonGap: 30, // gap between BETUL and SALAH buttons
    },
    portrait: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 16 },
      buttonsSection: { marginTop: 0, marginRight: 0 },
      buttonGap: 24,
    },
  },
  fillBlank: {
    landscape: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 16 },
      inputSection: { marginTop: 0, marginRight: 0 },
      inputContainer: { marginTop: 0, paddingHorizontal: 24 },
      okButton: { marginTop: 28 }, // gap between input and OK button
    },
    portrait: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 16 },
      inputSection: { marginTop: 0, marginRight: 0 },
      inputContainer: { marginTop: 0, paddingHorizontal: 20 },
      okButton: { marginTop: 24 },
    },
  },
  matching: {
    landscape: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 12 },
      gridSection: { marginTop: 0, marginRight: 0 },
      gridContainer: { marginTop: 0, gap: 12 }, // gap between rows
      gridRow: { gap: 12 }, // gap between cells
      footerContainer: { marginBottom: 0, marginRight: 0 },
    },
    portrait: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 12 },
      gridSection: { marginTop: 0, marginRight: 0 },
      gridContainer: { marginTop: 0, gap: 12 },
      gridRow: { gap: 12 },
      footerContainer: { marginBottom: 0, marginRight: 0 },
    },
  },
  crossword: {
    landscape: {
      containerPadding: { paddingTop: 40, paddingBottom: 20 },
      columnGap: 18,
      gridContainer: { marginTop: 14 },
      clueContent: { width: '90%', paddingVertical: 16 },
    },
    portrait: {
      containerPadding: { paddingTop: 40, paddingBottom: 20 },
      columnGap: 16,
      gridContainer: { marginTop: 12 },
      clueContent: { width: '90%', paddingVertical: 14 },
    },
  },
  multipleChoiceSingle: {
    landscape: {
      boardPaddingTop: 30,
      boardPaddingBottom: 15,      // Reduced by 5px to compensate for taller question area
      boardPaddingHorizontal: 40,
      questionAreaHeight: 140,      // Increased from 100 to accommodate long questions (e.g. Kedah)
      answerAreaTop: 15,            // Reduced by 5px to compensate
      optionsContainer: { gap: 24 },
      optionRow: { gap: 11 }, // Reduced by another 20% (was 14)
      footerContainer: { marginBottom: 20, marginRight: 40 },
    },
    portrait: {
      boardPaddingTop: 25,
      boardPaddingBottom: 10,      // Reduced by 5px to compensate for taller question area
      boardPaddingHorizontal: 30,
      questionAreaHeight: 130,      // Increased from 90 to accommodate long questions
      answerAreaTop: 12,            // Reduced to compensate
      optionsContainer: { gap: 20 },
      optionRow: { gap: 10 }, // Reduced by another 20% (was 13)
      footerContainer: { marginBottom: 15, marginRight: 30 },
    },
  },
  matchingSingle: {
    landscape: {
      boardPaddingTop: 35,
      boardPaddingBottom: 25,
      boardPaddingHorizontal: 35,
      questionAreaHeight: 110,
      gridAreaTop: 18,
      gridContainer: { gap: 14 },
      gridRow: { gap: 14 },
      footerContainer: { marginBottom: 20, marginRight: 40 },
    },
    portrait: {
      boardPaddingTop: 30,
      boardPaddingBottom: 20,
      boardPaddingHorizontal: 28,
      questionAreaHeight: 100,
      gridAreaTop: 15,
      gridContainer: { gap: 12 },
      gridRow: { gap: 12 },
      footerContainer: { marginBottom: 15, marginRight: 30 },
    },
  },
  trueFalseSingle: {
    landscape: {
      boardPaddingTop: 35,
      boardPaddingBottom: 25,
      boardPaddingHorizontal: 40,
      questionAreaHeight: 110,
      buttonsAreaTop: 20,
      buttonGap: 16, // Reduced by 20% (was 20)
    },
    portrait: {
      boardPaddingTop: 30,
      boardPaddingBottom: 20,
      boardPaddingHorizontal: 30,
      questionAreaHeight: 100,
      buttonsAreaTop: 18,
      buttonGap: 14, // Reduced by 20% (was 18)
    },
  },
} as const;

// Helper Functions
export const getEdgeMargin = (isLandscape: boolean): number => {
  return isLandscape ? EdgeMargins.landscape : EdgeMargins.portrait;
};

export const getColumnGap = (isLandscape: boolean): number => {
  return isLandscape ? Spacing.xl : Spacing.lg;
};

export const isLandscapeMode = (width: number): boolean => {
  return width >= Breakpoints.landscape;
};

export const getResponsiveSize = <T extends { landscape: any; portrait: any }>(
  sizeConfig: T,
  isLandscape: boolean
): T['landscape'] | T['portrait'] => {
  return isLandscape ? sizeConfig.landscape : sizeConfig.portrait;
};

export const getQuestionOffsets = (
  questionType: keyof typeof QuestionOffsets,
  isLandscape: boolean
) => {
  return isLandscape
    ? QuestionOffsets[questionType].landscape
    : QuestionOffsets[questionType].portrait;
};
