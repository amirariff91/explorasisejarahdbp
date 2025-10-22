/**
 * Theme Constants - Centralized Design System
 * All visual design tokens in one place for consistency
 */

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

  // Text Colors
  textPrimary: '#000',
  textSecondary: '#333',
  textTertiary: '#666',
  textPlaceholder: '#999',
  textLight: '#fff',

  // Shadow Colors
  shadowDark: '#000',
} as const;

// Typography Scale
import { Platform } from 'react-native';

export const Typography = {
  // Font Family (fallback to system; replace with 'Galindo' when font asset is added)
  fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' })!,

  // Font Sizes (Landscape / Portrait)
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

  // Line Heights
  lineHeight: {
    tight: 20,
    normal: 26,
    relaxed: 28,
  },

  // Font Weights
  fontWeight: {
    normal: '400' as const,
    semiBold: '600' as const,
    bold: 'bold' as const,
  },
} as const;

// Text Shadow Presets
export const Shadows = {
  text: {
    strong: {
      color: '#fff',
      offset: { width: 2, height: 2 },
      radius: 4,
    },
    medium: {
      color: '#000',
      offset: { width: 1, height: 1 },
      radius: 2,
    },
    subtle: {
      color: '#000',
      offset: { width: 1, height: 1 },
      radius: 3,
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
export const getResponsiveFontSize = (
  fontSizeConfig: { landscape: number; portrait: number },
  isLandscape: boolean
): number => {
  return isLandscape ? fontSizeConfig.landscape : fontSizeConfig.portrait;
};

export const getTextShadowStyle = (shadowPreset: typeof Shadows.text.medium) => ({
  textShadowColor: shadowPreset.color,
  textShadowOffset: shadowPreset.offset,
  textShadowRadius: shadowPreset.radius,
});

export const getComponentShadowStyle = (shadowPreset: typeof Shadows.component.medium) => ({
  elevation: shadowPreset.elevation,
  shadowColor: shadowPreset.shadowColor,
  shadowOffset: shadowPreset.shadowOffset,
  shadowOpacity: shadowPreset.shadowOpacity,
  shadowRadius: shadowPreset.shadowRadius,
});
