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
  // Standard Question Board (True/False, Fill Blank)
  standard: {
    landscape: { width: 480, height: 300 },  // Increased from 408×264
    portrait: { width: 380, height: 340 },   // Increased from 336×312
  },
  // Compact Board (Matching, smaller content)
  compact: {
    landscape: { width: 420, height: 280 },  // +24% larger for 3×3 grid readability
    portrait: { width: 340, height: 260 },   // Increased for better spacing
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
    landscape: { width: 680, height: 380 },  // ~1.79:1 ratio - Comfortable fit for content
    portrait: { width: 460, height: 380 },   // Increased for better phone portrait fit
  },
} as const;

// Component Sizes - Buttons (Landscape-Only, Responsive)
export const ButtonSizes = {
  // Figma Reference (917×412 landscape)
  figma: {
    answer: { width: 266, height: 78 },     // JAWAPAN 1-4 buttons
    betul: { width: 274, height: 91 },      // BETUL button
    salah: { width: 259, height: 121 },     // SALAH button (taller)
    gridCell: { width: 194, height: 57 },   // Matching grid cells (3×3)
  },
  
  // Next Button (proceed to next question)
  next: {
    phone: { width: 100, height: 75 },
    tablet: { width: 120, height: 90 },
    // Backward compatibility (landscape = tablet, portrait = phone)
    landscape: { width: 120, height: 90 },
    portrait: { width: 100, height: 75 },
  },
  // Menu Button (pause/settings)
  menu: {
    phone: { width: 100, height: 85 },
    tablet: { width: 120, height: 100 },
    // Backward compatibility
    landscape: { width: 120, height: 100 },
    portrait: { width: 100, height: 85 },
  },
  // Answer Button (Multiple Choice JAWAPAN buttons)
  answer: {
    phone: { width: 150, height: 70 },     // Scaled for 667px width
    tablet: { width: 240, height: 78 },    // Close to Figma (266×78)
  },
  // True/False Buttons (BETUL/SALAH)
  trueFalse: {
    phone: { width: 140, height: 72 },     // Larger for kids!
    tablet: { width: 220, height: 85 },    // Close to Figma
  },
  // OK Button (submit fill-in-the-blank)
  ok: {
    phone: { width: 100, height: 75 },
    tablet: { width: 110, height: 80 },
    // Backward compatibility
    landscape: { width: 110, height: 80 },
    portrait: { width: 100, height: 75 },
  },
  // Tutorial Continue Button
  tutorialContinue: {
    phone: { width: 115, height: 80 },
    tablet: { width: 130, height: 90 },
    // Backward compatibility
    landscape: { width: 130, height: 90 },
    portrait: { width: 115, height: 80 },
  },
  // Success Modal Button
  successAction: {
    phone: { width: 220, height: 70 },
    tablet: { width: 240, height: 75 },
    // Backward compatibility
    landscape: { width: 240, height: 75 },
    portrait: { width: 220, height: 70 },
  },
  // State Selection Button (fixed width)
  stateButton: {
    widthPercent: 90, // % of container
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 48,
  },
  // Matching Grid Cells (3×3 grid)
  gridCell: {
    phone: { width: 110, height: 52 },     // Minimum 52dp height
    tablet: { width: 160, height: 57 },    // Figma spec
  },
} as const;

// Touch Target Guidelines (Kid-Friendly, Landscape Game)
export const TouchTargets = {
  minimum: 48,      // iOS HIG + Material Design minimum
  comfortable: 60,  // Primary actions (kids)
  kids: 72,         // Ideal for children (frequently used)
  hitSlop: 12,      // Extra padding around pressable areas (increased from 10)
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
      boardPaddingTop: 28,              // Optimized for 380px height
      boardPaddingBottom: 15,           // Reduced to compensate for taller question area
      boardPaddingHorizontal: 40,       // Wide padding for content breathing room
      questionAreaHeight: 140,          // Increased from 90 to accommodate long questions (e.g. Kedah)
      answerAreaTop: 15,                // Reduced to compensate for taller question area
      optionsContainer: { gap: 24 },    // Vertical gap between button rows
      optionRow: { gap: 20 },           // Horizontal gap between buttons
      footerContainer: { marginBottom: 22, marginRight: 40 },
    },
    portrait: {
      boardPaddingTop: 28,
      boardPaddingBottom: 12,           // Reduced to compensate for taller question area
      boardPaddingHorizontal: 32,
      questionAreaHeight: 130,          // Increased from 90 to accommodate long questions
      answerAreaTop: 15,                // Reduced to compensate
      optionsContainer: { gap: 22 },
      optionRow: { gap: 16 },
      footerContainer: { marginBottom: 20, marginRight: 32 },
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
