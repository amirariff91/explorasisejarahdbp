/**
 * Centralized Asset Manifest
 * 
 * Single source of truth for all game assets. Import assets from this file
 * instead of using direct require() statements in components.
 * 
 * Benefits:
 * - Type-safe asset references
 * - Easy to swap asset sources
 * - Platform-specific optimizations
 * - Better code organization
 * 
 * Usage:
 *   import { ASSETS } from '@/constants/assets';
 *   <Image source={ASSETS.shared.ui.healthBar} />
 */

import type { AssetManifest } from '@/types/assets';

/**
 * Main asset manifest organized by category
 * 
 * Structure:
 * - shared: Cross-game reusable assets
 * - games: Game-specific assets (dbp-sejarah, future games)
 * - branding: Platform-level assets (splash, icons, logos)
 */
export const ASSETS: AssetManifest = {
  // ============================================================================
  // SHARED ASSETS (Used across all mini-games)
  // ============================================================================
  shared: {
    backgrounds: {
      // Main jungle/tropical background (rotated 270° in Figma Frame 2:180)
      main: require('@/assets/images/game/backgrounds/bg-main.png'),
      
      // Tutorial/instruction board background (Figma Frame 1:26)
      board: require('@/assets/images/game/backgrounds/board-bg.png'),
      
      // TODO: Add responsive variants when ready
      // '16x9': require('@/assets/images/shared/backgrounds/bg-main-16x9@2x.png'),
      // '4x3': require('@/assets/images/shared/backgrounds/bg-main-4x3@2x.png'),
      // '9x16': require('@/assets/images/shared/backgrounds/bg-main-9x16@2x.png'),
      // '3x4': require('@/assets/images/shared/backgrounds/bg-main-3x4@2x.png'),
    },

    buttons: {
      // Menu/pause button (Figma Frame 2:183)
      menu: {
        default: require('@/assets/images/game/buttons/menu-button.png'),
        // TODO: Add state variants when generated
        pressed: require('@/assets/images/game/buttons/menu-button.png'), // Placeholder
        disabled: require('@/assets/images/game/buttons/menu-button.png'), // Placeholder
      },

      // Next/forward button (Figma Frame 2:182)
      next: {
        default: require('@/assets/images/game/buttons/next-button.png'),
        // TODO: Add state variants when generated
        pressed: require('@/assets/images/game/buttons/next-button.png'), // Placeholder
        disabled: require('@/assets/images/game/buttons/next-button.png'), // Placeholder
      },

      // OK/confirm button (Figma Frame 1:22)
      ok: {
        default: require('@/assets/images/game/buttons/ok-button.png'),
        // TODO: Add state variants when generated
        pressed: require('@/assets/images/game/buttons/ok-button.png'), // Placeholder
        disabled: require('@/assets/images/game/buttons/ok-button.png'), // Placeholder
      },
    },

    ui: {
      // Health meter bar (Figma Frame 2:194)
      healthBar: require('@/assets/images/game/ui-elements/health-bar.png'),
      
      // Money/currency bar (Figma Frame 2:195)
      duitBar: require('@/assets/images/game/ui-elements/duit-bar.png'),
      
      // State name badge background (Figma Frame 2:184)
      bgNation: require('@/assets/images/game/ui-elements/bg-nation.png'),
      
      // Star decoration for success modal (Figma Frame 2:39)
      star: require('@/assets/images/game/ui-elements/star.png'),
      
      // Light burst effect (Figma Frame 2:40)
      flare: require('@/assets/images/game/ui-elements/flare.png'),
    },

    icons: {
      // TODO: Add utility icons when designed/exported from Figma
      // These icons are missing from current Figma file
      audioOn: require('@/assets/images/icon.png'), // Placeholder
      audioOff: require('@/assets/images/icon.png'), // Placeholder
      settings: require('@/assets/images/icon.png'), // Placeholder
      backArrow: require('@/assets/images/icon.png'), // Placeholder
      home: require('@/assets/images/icon.png'), // Placeholder
    },
  },

  // ============================================================================
  // GAME-SPECIFIC ASSETS
  // ============================================================================
  games: {
    dbpSejarah: {
      // Question board with ornamental border (Figma Frame 2:181)
      // Used for MENEGAK/MENDATAR clue panels
      soalanBoard: require('@/assets/images/game/backgrounds/soalan-board.png'),
      
      // Crossword grid background (Figma Frame 2:198)
      crosswordBox: require('@/assets/images/game/buttons/crossword-box.png'),
      
      // Answer choice button for multiple choice questions (Figma Frame 1:51)
      jawapanButton: {
        default: require('@/assets/images/game/buttons/jawapan-button.png'),
        // TODO: Add state variants when generated
        pressed: require('@/assets/images/game/buttons/jawapan-button.png'), // Placeholder
        disabled: require('@/assets/images/game/buttons/jawapan-button.png'), // Placeholder
      },
      
      // "Betul" (Correct) button for true/false questions (Figma Frame 2:131)
      betulButton: {
        default: require('@/assets/images/game/buttons/betul-button.png'),
        // TODO: Add pressed state with green glow
        pressed: require('@/assets/images/game/buttons/betul-button.png'), // Placeholder
        disabled: require('@/assets/images/game/buttons/betul-button.png'), // Placeholder
      },
      
      // "Salah" (Wrong) button for true/false questions (Figma Frame 2:132)
      salahButton: {
        default: require('@/assets/images/game/buttons/salah-button.png'),
        // TODO: Add pressed state with red glow
        pressed: require('@/assets/images/game/buttons/salah-button.png'), // Placeholder
        disabled: require('@/assets/images/game/buttons/salah-button.png'), // Placeholder
      },
      
      // Fill-in-blank input field (Figma Frame 2:105)
      isiTempatKosong: require('@/assets/images/game/ui-elements/isi-tempat-kosong.png'),
      
      // Success modal background with "TAHNIAH" text (Figma Frame 2:38)
      tahniahBg: require('@/assets/images/game/ui-elements/tahniah-bg.png'),
      
      // "Teruskan" (Continue) button for success modal (Figma Frame 2:41)
      buttonTeruskan: {
        default: require('@/assets/images/game/ui-elements/button-teruskan.png'),
        // TODO: Add pressed state with gold glow
        pressed: require('@/assets/images/game/ui-elements/button-teruskan.png'), // Placeholder
        disabled: require('@/assets/images/game/ui-elements/button-teruskan.png'), // Placeholder
      },
      
      // TODO: Add Malaysia map when exported from Figma Frame 1:45
      petaMalaysia: require('@/assets/images/icon.png'), // Placeholder
    },

    // Future games can be added here:
    // mathAdventure: { ... },
    // scienceQuest: { ... },
  },

  // ============================================================================
  // BRANDING & PLATFORM ASSETS
  // ============================================================================
  branding: {
    // DBP logo PNG (Figma Frame 1:15)
    logoDbp: require('@/assets/images/game/LOGO DBP/logo-dbp.png'),
    
    // DBP logo SVG for scalability
    logoDbpSvg: require('@/assets/images/game/LOGO DBP/LOGO DBP.svg'),
    
    // "Eksplorasi Sejarah" title masthead (Figma Frame 1:13)
    titleMasthead: require('@/assets/images/game/MASTHEAD/TITLE.svg'),
    
    // TODO: Add splash screen variants when generated
    splashScreenSafe: require('@/assets/images/splash-icon.png'), // Placeholder
    splashScreenFull: require('@/assets/images/splash-icon.png'), // Placeholder
    
    // iOS app icon master (1024x1024)
    appIconIos: require('@/assets/images/icon.png'), // Using existing icon as placeholder
  },
};

/**
 * Asset preload configuration
 * 
 * Defines which assets should be loaded at different stages:
 * - critical: Load immediately on app start (splash, logo)
 * - preload: Load during tutorial/onboarding (common UI elements)
 * - lazy: Load on demand (game-specific screens)
 */
export const ASSET_PRELOAD_CONFIG = {
  critical: [
    ASSETS.shared.backgrounds.main,
    ASSETS.branding.logoDbp,
    ASSETS.branding.titleMasthead,
    ASSETS.shared.ui.healthBar,
    ASSETS.shared.ui.duitBar,
  ],
  
  preload: [
    ASSETS.shared.buttons.menu.default,
    ASSETS.shared.buttons.next.default,
    ASSETS.shared.buttons.ok.default,
    ASSETS.shared.ui.bgNation,
    ASSETS.shared.ui.star,
    ASSETS.shared.ui.flare,
  ],
  
  lazy: [
    ASSETS.games.dbpSejarah.soalanBoard,
    ASSETS.games.dbpSejarah.crosswordBox,
    ASSETS.games.dbpSejarah.jawapanButton.default,
    ASSETS.games.dbpSejarah.betulButton.default,
    ASSETS.games.dbpSejarah.salahButton.default,
    ASSETS.games.dbpSejarah.isiTempatKosong,
    ASSETS.games.dbpSejarah.tahniahBg,
    ASSETS.games.dbpSejarah.buttonTeruskan.default,
    ASSETS.games.dbpSejarah.petaMalaysia,
  ],
};

/**
 * Helper function to get button asset based on state
 * 
 * @param button - Button asset with state variants
 * @param pressed - Whether button is currently pressed
 * @param disabled - Whether button is disabled
 * @returns Appropriate asset source for current state
 */
export function getButtonState(
  button: { default: any; pressed: any; disabled: any },
  pressed: boolean = false,
  disabled: boolean = false
) {
  if (disabled) return button.disabled;
  if (pressed) return button.pressed;
  return button.default;
}

/**
 * Export individual asset categories for convenience
 */
export const SharedAssets = ASSETS.shared;
export const GameAssets = ASSETS.games;
export const BrandingAssets = ASSETS.branding;

/**
 * Type-safe asset accessor
 * 
 * Example usage:
 *   const healthBar = getAsset('shared', 'ui', 'healthBar');
 */
export function getAsset(...path: string[]): any {
  let current: any = ASSETS;
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`Asset not found at path: ${path.join('.')}`);
      return null;
    }
  }
  return current;
}

