/**
 * Asset management types for the DBP Sejarah educational game
 * 
 * Provides type-safe asset references and categorization for modular asset loading
 */

import type { ImageSourcePropType } from 'react-native';

/**
 * Generic asset source type compatible with expo-image and React Native Image
 */
export type AssetSource = ImageSourcePropType;

/**
 * Button state variants for interactive components
 */
export interface ButtonAsset {
  default: AssetSource;
  pressed: AssetSource;
  disabled: AssetSource;
}

/**
 * Background assets with optional responsive variants
 */
export interface BackgroundAssets {
  main: AssetSource;
  board: AssetSource;
  '16x9'?: AssetSource;
  '4x3'?: AssetSource;
  '9x16'?: AssetSource;
  '3x4'?: AssetSource;
}

/**
 * UI element assets (bars, decorations, effects)
 */
export interface UIAssets {
  healthBar: AssetSource;
  duitBar: AssetSource;
  bgNation: AssetSource;
  star: AssetSource;
  flare: AssetSource;
}

/**
 * Utility icon assets (settings, navigation, audio controls)
 */
export interface IconAssets {
  audioOn: AssetSource;
  audioOff: AssetSource;
  settings: AssetSource;
  backArrow: AssetSource;
  home: AssetSource;
}

/**
 * Button assets organized by type with state variants
 */
export interface ButtonAssets {
  menu: ButtonAsset;
  next: ButtonAsset;
  ok: ButtonAsset;
}

/**
 * Shared assets used across all mini-games
 */
export interface SharedAssets {
  backgrounds: BackgroundAssets;
  buttons: ButtonAssets;
  ui: UIAssets;
  icons: IconAssets;
}

/**
 * DBP Sejarah game-specific assets
 */
export interface DBPSejarahAssets {
  soalanBoard: AssetSource;
  crosswordBox: AssetSource;
  jawapanButton: ButtonAsset;
  betulButton: ButtonAsset;
  salahButton: ButtonAsset;
  isiTempatKosong: AssetSource;
  tahniahBg: AssetSource;
  buttonTeruskan: ButtonAsset;
  petaMalaysia: AssetSource;
}

/**
 * Game-specific assets organized by game name
 */
export interface GameAssets {
  dbpSejarah: DBPSejarahAssets;
  // Future games can be added here:
  // mathAdventure: MathAdventureAssets;
  // scienceQuest: ScienceQuestAssets;
}

/**
 * Branding and platform assets (splash screens, app icons, logos)
 */
export interface BrandingAssets {
  logoDbp: AssetSource;
  logoDbpSvg: AssetSource;
  titleMasthead: AssetSource;
  splashScreenSafe: AssetSource;
  splashScreenFull: AssetSource;
  appIconIos: AssetSource;
}

/**
 * Root asset manifest structure
 */
export interface AssetManifest {
  shared: SharedAssets;
  games: GameAssets;
  branding: BrandingAssets;
}

/**
 * Asset loading state for preloading/lazy loading
 */
export interface AssetLoadingState {
  loaded: boolean;
  error?: Error;
  progress?: number;
}

/**
 * Asset preload configuration
 */
export interface AssetPreloadConfig {
  critical: AssetSource[];    // Load immediately on app start
  lazy: AssetSource[];        // Load on demand
  preload: AssetSource[];     // Load during tutorial/onboarding
}

/**
 * Platform-specific asset configuration
 */
export interface PlatformAssetConfig {
  ios: {
    densities: ['@1x', '@2x', '@3x'];
    preferredFormat: 'png';
  };
  android: {
    densities: ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
    preferredFormat: 'png';
  };
  web: {
    preferredFormat: 'webp' | 'png' | 'svg';
    fallbackFormat: 'png';
  };
}

/**
 * Helper type to extract asset category keys
 */
export type AssetCategory = keyof AssetManifest;

/**
 * Helper type to extract asset names from a category
 */
export type AssetName<T extends AssetCategory> = keyof AssetManifest[T];

/**
 * Type guard to check if an asset is a ButtonAsset
 */
export function isButtonAsset(asset: any): asset is ButtonAsset {
  return (
    typeof asset === 'object' &&
    'default' in asset &&
    'pressed' in asset &&
    'disabled' in asset
  );
}

/**
 * Type guard to check if a value is a valid AssetSource
 */
export function isAssetSource(value: any): value is AssetSource {
  return (
    typeof value === 'number' ||
    (typeof value === 'object' && 'uri' in value) ||
    (typeof value === 'object' && 'default' in value)
  );
}

