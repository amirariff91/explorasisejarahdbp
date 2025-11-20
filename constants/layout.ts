/**
 * Layout Constants - Responsive Design System
 * Standardized dimensions, spacing, and breakpoints
 */

// Responsive Breakpoints
export const Breakpoints = {
  // Landscape mode threshold (standardized across all components)
  landscape: 800, // px - Optimized for landscape tablets (917×412 Figma design)
} as const;

/**
 * Unified Device Breakpoints - 4-Tier System
 * Replaces dual breakpoint conflicts (800px vs 1000px)
 */
export const DeviceBreakpoints = {
  phoneLandscape: 800,    // 667-799px - Phone landscape (iPhone SE, iPhone 8)
  tabletSmall: 1000,      // 800-999px - Tablet small (iPad Mini landscape)
  tabletMedium: 1200,     // 1000-1199px - Tablet medium (iPad 9.7", iPad Air landscape)
  tabletLarge: 1366,      // 1200+ px - Tablet large (iPad Pro 12.9" landscape)
} as const;

/**
 * Device Size Classification
 */
export type DeviceSize = 'phone' | 'tablet-sm' | 'tablet-md' | 'tablet-lg';

/**
 * Scale Factors for Responsive Sizing
 * Base scale (phone) = 1.0, scales up for larger devices
 */
export const ScaleFactors = {
  phone: 1.0,        // 667-799px - Base scale
  'tablet-sm': 1.2,  // 800-999px - 20% larger
  'tablet-md': 1.5,  // 1000-1199px - 50% larger
  'tablet-lg': 1.8,  // 1200px+ - 80% larger
} as const;

// Edge Margins (Dead Zones for thumb grips)
// Now responsive - scales with device size for better adaptation
export const EdgeMargins = {
  landscape: 40, // px - Base margin for phone landscape (backward compatibility)
  portrait: 30, // px - Base margin for portrait (backward compatibility)
  // Percentage-based margins for better scaling across devices
  landscapePercent: 0.03, // 3% of screen width
  portraitPercent: 0.04, // 4% of screen width
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

/**
 * Base Question Board Sizes - Phone Tier (667-799px)
 * These sizes are scaled up for larger devices using getQuestionBoardSize()
 */
export const QuestionBoardBase = {
  // Standard Question Board (True/False, Fill Blank)
  standard: {
    width: 550,
    height: 380,
  },
  // Compact Board (Matching, smaller content)
  compact: {
    width: 420,
    height: 280,
  },
  // Large Board (Tutorial, State Selection)
  large: {
    width: 380,
    height: 160,
  },
  // Description Board (Tutorial descriptions)
  description: {
    width: 380,
    height: 240,
  },
  // Clue Board (Crossword clues)
  clue: {
    width: 180,
    height: 240,
  },
  // Single Board (Multiple Choice - question + answers on same board)
  singleBoardMC: {
    width: 750,
    height: 480,
  },
  // Matching Question Board (taller aspect ratio for vertical checkbox list)
  matching: {
    width: 600,
    height: 420,
  },
  // Map Board (State selection map container)
  map: {
    width: 680,
    height: 510,
  },
} as const;

/**
 * @deprecated Use QuestionBoardBase with getQuestionBoardSize() instead
 * Legacy board sizes with landscape/portrait variants
 */
export const QuestionBoard = {
  standard: {
    landscape: { width: 480, height: 300 },
    portrait: { width: 380, height: 340 },
  },
  compact: {
    landscape: { width: 420, height: 280 },
    portrait: { width: 340, height: 260 },
  },
  large: {
    landscape: { width: 380, height: 160 },
    portrait: { width: 300, height: 200 },
  },
  description: {
    landscape: { width: 380, height: 200 },
    portrait: { width: 320, height: 180 },
  },
  clue: {
    landscape: { width: 180, height: 240 },
    portrait: { width: 150, height: 200 },
  },
  singleBoardMC: {
    landscape: { width: 680, height: 380 },
    portrait: { width: 460, height: 380 },
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
    phone: { width: 120, height: 60 },     // Reduced for better fit
    tablet: { width: 180, height: 70 },    // Reduced for better fit
  },
  // TERUSKAN Button (submit fill-in-the-blank)
  teruskan: {
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
    stateIndicator: {
      landscape: { width: 280, height: 70 },
      portrait: { width: 230, height: 85 },
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
      teruskanButton: { marginTop: 28 }, // gap between input and TERUSKAN button
    },
    portrait: {
      questionSection: { marginTop: 0, marginLeft: 0 },
      questionContent: { width: '82%', paddingVertical: 32, paddingHorizontal: 0, gap: 16 },
      inputSection: { marginTop: 0, marginRight: 0 },
      inputContainer: { marginTop: 0, paddingHorizontal: 20 },
      teruskanButton: { marginTop: 24 },
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
      questionAreaHeight: 160,          // Increased to 160 for better text overflow handling
      answerAreaTop: 15,                // Reduced to compensate for taller question area
      optionsContainer: { gap: 24 },    // Vertical gap between button rows
      optionRow: { gap: 20 },           // Horizontal gap between buttons
      footerContainer: { marginBottom: 22, marginRight: 40 },
    },
    portrait: {
      boardPaddingTop: 28,
      boardPaddingBottom: 12,           // Reduced to compensate for taller question area
      boardPaddingHorizontal: 32,
      questionAreaHeight: 145,          // Increased to 145 for better text overflow handling
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
      boardPaddingBottom: 30, // Increased bottom padding
      boardPaddingHorizontal: 40,
      questionAreaHeight: 130, // Increased area for question
      buttonsAreaTop: 30, // Increased top gap for centered row
      buttonGap: 20, // Increased horizontal gap for better separation
    },
    portrait: {
      boardPaddingTop: 30,
      boardPaddingBottom: 25, // Increased bottom padding
      boardPaddingHorizontal: 30,
      questionAreaHeight: 120, // Increased area for question
      buttonsAreaTop: 25, // Increased top gap
      buttonGap: 16, // Horizontal gap
    },
  },
} as const;

// Helper Functions
/**
 * Get Edge Margin (Legacy - Fixed Pixels)
 * @deprecated Use getResponsiveEdgeMargin for better scaling across devices
 */
export const getEdgeMargin = (isLandscape: boolean): number => {
  return isLandscape ? EdgeMargins.landscape : EdgeMargins.portrait;
};

/**
 * Get Responsive Edge Margin
 * Returns percentage-based margin that scales with screen width
 *
 * @param isLandscape - Whether device is in landscape orientation
 * @param screenWidth - Current screen width in pixels
 * @returns Edge margin in pixels (percentage of screen width)
 *
 * @example
 * getResponsiveEdgeMargin(true, 1194)  // ~36px (3% of 1194)
 * getResponsiveEdgeMargin(true, 667)   // ~20px (3% of 667)
 */
export const getResponsiveEdgeMargin = (isLandscape: boolean, screenWidth: number): number => {
  const percent = isLandscape ? EdgeMargins.landscapePercent : EdgeMargins.portraitPercent;
  const margin = Math.round(screenWidth * percent);
  // Ensure minimum margin for usability (at least 20px)
  return Math.max(margin, 20);
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

/**
 * Get Device Size Tier
 * Classifies device into one of 4 tiers based on screen width
 *
 * @param width - Screen width in pixels
 * @returns DeviceSize tier ('phone' | 'tablet-sm' | 'tablet-md' | 'tablet-lg')
 *
 * @example
 * getDeviceSize(667)  // 'phone'
 * getDeviceSize(1024) // 'tablet-md'
 * getDeviceSize(1366) // 'tablet-lg'
 */
export const getDeviceSize = (width: number): DeviceSize => {
  if (width < DeviceBreakpoints.tabletSmall) return 'phone';
  if (width < DeviceBreakpoints.tabletMedium) return 'tablet-sm';
  if (width < DeviceBreakpoints.tabletLarge) return 'tablet-md';
  return 'tablet-lg';
};

/**
 * Get Scale Factor for Device
 * Returns multiplier for responsive sizing based on device tier
 *
 * @param width - Screen width in pixels
 * @returns Scale multiplier (1.0, 1.2, 1.5, or 1.8)
 *
 * @example
 * getScaleFactor(667)  // 1.0 (phone)
 * getScaleFactor(1024) // 1.5 (tablet-md)
 * getScaleFactor(1366) // 1.8 (tablet-lg)
 */
export const getScaleFactor = (width: number): number => {
  const deviceSize = getDeviceSize(width);
  return ScaleFactors[deviceSize];
};

/**
 * Get Responsive Size with Scaling
 * Scales a base size proportionally based on device tier
 *
 * @param baseSize - Base dimension in pixels (for phone-sized devices)
 * @param width - Screen width in pixels
 * @param maxScale - Maximum scale factor (default 2.0)
 * @returns Scaled dimension rounded to nearest integer
 *
 * @example
 * getResponsiveSizeScaled(100, 667)  // 100 (phone: 1.0×)
 * getResponsiveSizeScaled(100, 1024) // 150 (tablet-md: 1.5×)
 * getResponsiveSizeScaled(100, 1366) // 180 (tablet-lg: 1.8×)
 */
export const getResponsiveSizeScaled = (
  baseSize: number,
  width: number,
  maxScale: number = 2.0
): number => {
  const scale = Math.min(getScaleFactor(width), maxScale);
  return Math.round(baseSize * scale);
};

/**
 * Get Responsive Question Board Size
 * Scales board dimensions based on device tier
 *
 * @param type - Board type (standard, compact, large, description, clue, singleBoardMC)
 * @param width - Screen width in pixels
 * @returns Scaled board dimensions { width, height }
 *
 * @example
 * getQuestionBoardSize('standard', 667)  // { width: 480, height: 300 } (phone)
 * getQuestionBoardSize('standard', 1024) // { width: 720, height: 450 } (tablet-md: 1.5×)
 * getQuestionBoardSize('standard', 1366) // { width: 864, height: 540 } (tablet-lg: 1.8×)
 */
export const getQuestionBoardSize = (
  type: keyof typeof QuestionBoardBase,
  width: number
): { width: number; height: number } => {
  const base = QuestionBoardBase[type];
  const scale = getScaleFactor(width);
  const deviceSize = getDeviceSize(width);
  const tabletBoardBoost = deviceSize === 'phone' ? 1.0 : 1.3; // Tablets: 30% larger boards
  const boardAssetBoost = deviceSize === 'phone' ? 0.9 : 1.04; // Phones: reduce 10%, others keep +4%
  return {
    width: Math.round(base.width * scale * tabletBoardBoost * boardAssetBoost),
    height: Math.round(base.height * scale * tabletBoardBoost * boardAssetBoost),
  };
};

/**
 * Get Responsive Map Board Size
 * Uses standard 4-tier scaling (same as other question boards)
 *
 * @param width - Screen width in pixels
 * @returns Scaled map board dimensions { width, height }
 *
 * @example
 * getMapBoardSize(667)  // { width: 680, height: 510 } (phone: 1.0×)
 * getMapBoardSize(820)  // { width: 816, height: 612 } (tablet-sm: 1.2×)
 * getMapBoardSize(1080) // { width: 1020, height: 765 } (tablet-md: 1.5×)
 * getMapBoardSize(1366) // { width: 1224, height: 918 } (tablet-lg: 1.8×)
 */
export const getMapBoardSize = (width: number): { width: number; height: number } => {
  const base = QuestionBoardBase.map;
  const deviceSize = getDeviceSize(width);
  const scale = ScaleFactors[deviceSize];

  return {
    width: Math.round(base.width * scale),
    height: Math.round(base.height * scale),
  };
};

export const getQuestionOffsets = (
  questionType: keyof typeof QuestionOffsets,
  isLandscape: boolean
) => {
  return isLandscape
    ? QuestionOffsets[questionType].landscape
    : QuestionOffsets[questionType].portrait;
};
