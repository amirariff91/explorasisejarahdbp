/**
 * Theme Constants - Centralized Design System
 * All visual design tokens in one place for consistency
 */

import { Platform } from 'react-native';

// Color Palette
export const Colors = {
  // Primary Colors
  primary: '#4CAF50', // Green - Primary actions, active states
  secondary: '#2196F3', // Blue - Info, tutorial
  success: '#4CAF50', // Green - Success states
  warning: '#FFC107', // Yellow/Gold - Warnings, completed states
  gold: '#FFD700', // Bright gold - Celebration, highlights

  // Background Colors
  backgroundOverlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays
  backgroundOverlayDark: 'rgba(23, 23, 23, 0.81)', // Success modal
  cardBackground: '#fff',
  semiTransparentCard: 'rgba(255, 255, 255, 0.8)',
  loginPanel: '#1E8EEA', // Login panel background (bright blue)

  // Text Colors
  textPrimary: '#000',
  textSecondary: '#333',
  textTertiary: '#666',
  textPlaceholder: '#999',
  textLight: '#fff',

  // Shadow Colors
  shadowDark: '#000',

  // Theme-specific colors for light/dark modes
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2196F3',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#2196F3',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
} as const;

// Font Families
export const Fonts = {
  rounded: 'Galindo', // Main game font
  mono: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace'
  }),
} as const;

// Typography Scale (Landscape-Only, Figma-Aligned)
export const Typography = {
  // Font Family - Galindo is loaded via useAppFonts hook
  fontFamily: 'Galindo',

  // Figma Reference Sizes (917×412 landscape)
  figma: {
    stateLabel: 32,    // State names (e.g., "PERLIS")
    question: 20,      // Question text
    answer: 16,        // Answer button text
    gridCell: 8,       // Matching grid cells (TOO SMALL - needs increase)
    clue: 10,          // Crossword clues (TOO SMALL - needs increase)
  },

  // Phone Sizes (667-844px width, landscape)
  phone: {
    stateLabel: 24,    // -25% from Figma (fits small screens)
    question: 16,      // -20% from Figma
    answer: 14,        // -12.5% from Figma
    gridCell: 12,      // +50% from Figma (accessibility minimum!)
    clue: 12,          // +20% from Figma (readable)
  },

  // Tablet Sizes (1024px+ width, landscape)
  tablet: {
    stateLabel: 32,    // Figma spec
    question: 20,      // Figma spec
    answer: 16,        // Figma spec
    gridCell: 10,      // +25% from Figma (still readable)
    clue: 12,          // +20% from Figma (improved readability)
  },

  // Legacy sizes (maintain backward compatibility for now)
  title: {
    landscape: 28,
    portrait: 24,
  },
  subtitle: {
    landscape: 18,
    portrait: 16,
  },
  heading: {
    landscape: 20,
    portrait: 18,
  },
  body: {
    landscape: 17,
    portrait: 16,
  },
  bodySmall: {
    landscape: 15,
    portrait: 14,
  },
  caption: {
    landscape: 13,
    portrait: 12,
  },
  captionSmall: {
    landscape: 11,
    portrait: 10,
  },
  button: {
    landscape: 18,
    portrait: 16,
  },
  buttonSmall: {
    landscape: 16,
    portrait: 15,
  },

  // Line Heights (Figma spec: 1.414 = √2 ratio)
  lineHeight: {
    tight: 1.2,
    normal: 1.414,     // Figma spec (was 1.4)
    relaxed: 1.5,
  },

  // Letter Spacing (Added for Figma compliance)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 1.5,
  },

  // Font Weights
  fontWeight: {
    normal: '400' as const,
    semiBold: '600' as const,
    bold: 'bold' as const,
  },
} as const;

/**
 * Responsive Typography Scale - 4-Tier Device System
 * Unified scaling strategy that works across all device sizes
 *
 * Device Classification:
 * - phone: 667-799px (scale 1.0×)
 * - tablet-sm: 800-999px (scale 1.2×)
 * - tablet-md: 1000-1199px (scale 1.5×)
 * - tablet-lg: 1200px+ (scale 1.8×)
 */
export const TypographyScale = {
  phone: {
    stateLabel: 24,
    question: 16,
    answer: 14,
    gridCell: 12,
    clue: 12,
  },
  'tablet-sm': {
    stateLabel: 28,    // 24 × 1.2 ≈ 28
    question: 18,      // 16 × 1.2 ≈ 18
    answer: 15,        // 14 × 1.2 ≈ 15
    gridCell: 14,      // 12 × 1.2 ≈ 14
    clue: 14,          // 12 × 1.2 ≈ 14
  },
  'tablet-md': {
    stateLabel: 32,    // 24 × 1.5 ≈ 32
    question: 20,      // 16 × 1.5 ≈ 20
    answer: 16,        // 14 × 1.5 ≈ 16
    gridCell: 16,      // 12 × 1.5 ≈ 16
    clue: 16,          // 12 × 1.5 ≈ 16
  },
  'tablet-lg': {
    stateLabel: 38,    // 24 × 1.8 ≈ 38
    question: 24,      // 16 × 1.8 ≈ 24
    answer: 18,        // 14 × 1.8 ≈ 18
    gridCell: 18,      // 12 × 1.8 ≈ 18
    clue: 18,          // 12 × 1.8 ≈ 18
  },
} as const;

// Text Shadow Presets (Refined to match Figma - visible but subtle)
export const Shadows = {
  text: {
    strong: {
      color: 'rgba(0, 0, 0, 0.6)',
      offset: { width: 1, height: 2 },
      radius: 3,
    },
    medium: {
      color: 'rgba(0, 0, 0, 0.4)',
      offset: { width: 1, height: 1 },
      radius: 2,
    },
    subtle: {
      color: 'rgba(0, 0, 0, 0.25)',
      offset: { width: 0, height: 1 },
      radius: 2,
    },
    // For homepage title with thick outline
    titleStroke: {
      color: '#1565C0', // Dark blue for stroke
      offset: { width: 0, height: 0 },
      radius: 6,
    },
  },

  // Component Shadows (iOS & Android)
  component: {
    small: {
      elevation: 3, // Android
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    medium: {
      elevation: 4, // Android
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    large: {
      elevation: 10, // Android
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
    },
  },
} as const;

// Border Radius Scale
export const BorderRadius = {
  small: 12,
  medium: 18,
  large: 22,
  xlarge: 25,
  full: 999, // Fully rounded
} as const;

// Opacity Values
export const Opacity = {
  disabled: 0.5,
  selected: 0.8,
  overlay: 0.7,
} as const;

// Animation Durations (milliseconds)
export const AnimationDurations = {
  fast: 100,
  normal: 300,
  slow: 600,
  verySlow: 800,
  continuous: 3000,
} as const;

// Game Feedback (for answer results)
export const GameFeedback = {
  correct: {
    color: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    icon: '✅',
    haptic: 'success' as const,
  },
  wrong: {
    color: '#f44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    icon: '❌',
    haptic: 'error' as const,
  },
} as const;

// Button Press Animations
export const ButtonAnimations = {
  pressScale: 0.95,
  pressDuration: 150,
  releaseDuration: 100,
  pressOpacity: 0.8,
} as const;

// Helper Functions

/**
 * Get responsive font size using unified 4-tier system
 *
 * @param type - Font type (stateLabel, question, answer, gridCell, clue)
 * @param width - Screen width in pixels
 * @returns Scaled font size appropriate for device
 *
 * @example
 * const fontSize = getResponsiveFontSize('question', width);
 */
export const getResponsiveFontSize = (
  type: keyof typeof TypographyScale.phone,
  width: number
): number => {
  const { getDeviceSize } = require('@/constants/layout');
  const deviceSize = getDeviceSize(width);
  return TypographyScale[deviceSize][type];
};

/**
 * @deprecated Use getResponsiveFontSize(type, width) instead
 * Legacy helper for landscape/portrait font sizes
 */
export const getResponsiveFontSizeLegacy = (
  fontSizeConfig: { landscape: number; portrait: number },
  isLandscape: boolean
): number => {
  return isLandscape ? fontSizeConfig.landscape : fontSizeConfig.portrait;
};

/**
 * @deprecated Use getResponsiveFontSize(type, width) instead
 * Old 2-tier landscape helper (1000px breakpoint)
 */
export const getLandscapeFontSize = (
  type: keyof typeof Typography.phone,
  screenWidth: number
): number => {
  // Phone: 667-999px
  if (screenWidth < 1000) {
    return Typography.phone[type];
  }
  // Tablet: 1000px+
  return Typography.tablet[type];
};

export const getTextShadowStyle = (
  shadowPreset: typeof Shadows.text.medium | typeof Shadows.text.strong | typeof Shadows.text.subtle
) => ({
  textShadowColor: shadowPreset.color,
  textShadowOffset: shadowPreset.offset,
  textShadowRadius: shadowPreset.radius,
});

export const getComponentShadowStyle = (
  shadowPreset: typeof Shadows.component.small | typeof Shadows.component.medium | typeof Shadows.component.large
) => ({
  elevation: shadowPreset.elevation,
  shadowColor: shadowPreset.shadowColor,
  shadowOffset: shadowPreset.shadowOffset,
  shadowOpacity: shadowPreset.shadowOpacity,
  shadowRadius: shadowPreset.shadowRadius,
});

// State Visual Identities (Gradients + Icons)
import type { MalaysianState } from '@/types';

export const StateVisuals: Record<MalaysianState, {
  color: string;          // Main solid color
  borderColor: string;    // Darker border for depth
  emoji: string;          // Emoji icon
}> = {
  'perlis': {
    color: '#FFD700',        // Bright gold (rice fields)
    borderColor: '#DAA520',  // Darker gold
    emoji: '🌾',
  },
  'kedah': {
    color: '#8BC34A',        // Lime green (rice bowl)
    borderColor: '#689F38',  // Darker green
    emoji: '🌾',
  },
  'pulau-pinang': {
    color: '#00BCD4',        // Cyan (island)
    borderColor: '#0097A7',  // Darker cyan
    emoji: '🏝️',
  },
  'perak': {
    color: '#90A4AE',        // Gray-blue (mountains)
    borderColor: '#607D8B',  // Darker gray
    emoji: '⛰️',
  },
  'selangor': {
    color: '#AB47BC',        // Purple (urban)
    borderColor: '#7B1FA2',  // Darker purple
    emoji: '🏙️',
  },
  'kuala-lumpur': {
    color: '#42A5F5',        // Bright blue (capital)
    borderColor: '#1976D2',  // Darker blue
    emoji: '🏛️',
  },
  'negeri-sembilan': {
    color: '#FF9800',        // Orange
    borderColor: '#F57C00',  // Darker orange
    emoji: '🏡',
  },
  'melaka': {
    color: '#FF5722',        // Red-orange (port)
    borderColor: '#E64A19',  // Darker red
    emoji: '⚓',
  },
  'johor': {
    color: '#66BB6A',        // Green (palm trees)
    borderColor: '#43A047',  // Darker green
    emoji: '🌴',
  },
  'pahang': {
    color: '#4CAF50',        // Forest green (rainforest)
    borderColor: '#2E7D32',  // Darker forest green
    emoji: '🌲',
  },
  'terengganu': {
    color: '#26C6DA',        // Teal (ocean/turtles)
    borderColor: '#00ACC1',  // Darker teal
    emoji: '🐢',
  },
  'kelantan': {
    color: '#EC407A',        // Pink (culture)
    borderColor: '#C2185B',  // Darker pink
    emoji: '🎭',
  },
  'sabah': {
    color: '#A1887F',        // Brown (orangutan/rainforest)
    borderColor: '#6D4C41',  // Darker brown
    emoji: '🦧',
  },
  'sarawak': {
    color: '#9CCC65',        // Light green (hornbill/jungle)
    borderColor: '#689F38',  // Darker green
    emoji: '🦜',
  },
};
