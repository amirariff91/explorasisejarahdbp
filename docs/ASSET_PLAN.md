# DBP SEJARAH - Asset Standardization Plan

## Overview

This document outlines the comprehensive asset management system for the DBP Sejarah educational game. The plan ensures visual consistency across all current and future mini-games while maintaining compatibility with the existing Expo/React Native architecture.

**Figma Source**: [DBP SEJARAH Design File](https://www.figma.com/design/65nT29eLZRN0u9Mjb66CKZ/DBP-SEJARAH?node-id=2-109)

**Last Updated**: October 31, 2025

---

## Asset Categories

### A. Core UI (Used in ALL Games)
Shared assets that appear across multiple mini-games:
- Status bars (health, money)
- Navigation buttons (menu, next, back)
- Common backgrounds
- Success/failure feedback elements

### B. Game-Specific (DBP Sejarah Crossword/Quiz)
Assets unique to the history crossword game:
- Question boards (MENEGAK/MENDATAR)
- Crossword grid components
- Answer buttons (BETUL/SALAH)
- Fill-in-blank input fields

### C. Brand/Platform (Splash, Icons, Store)
App-level branding and platform assets:
- Splash screens (iOS/Android)
- App icons (adaptive, monochrome)
- DBP logo and title masthead
- Store graphics

### D. Utility (Settings, Audio, Navigation)
Functional UI icons:
- Audio on/off controls
- Settings gear icon
- Navigation arrows
- Home/back buttons

---

## Modular Folder Structure

```
/assets/images/
├── shared/                    # Cross-game reusable assets
│   ├── backgrounds/
│   │   ├── bg-main.png
│   │   ├── bg-main@2x.png
│   │   └── bg-main@3x.png
│   ├── buttons/
│   │   ├── next-button.png
│   │   ├── next-button-pressed.png
│   │   ├── next-button-disabled.png
│   │   └── ... (more buttons with states)
│   ├── ui/
│   │   ├── health-bar.png
│   │   ├── duit-bar.png
│   │   ├── star.png
│   │   └── flare.png
│   └── icons/
│       ├── audio-on.svg
│       ├── audio-off.svg
│       ├── settings.svg
│       ├── back-arrow.svg
│       └── home.svg
│
├── games/
│   └── dbp-sejarah/          # Game-specific assets
│       ├── soalan-board.png
│       ├── crossword-box.png
│       ├── jawapan-button.png
│       ├── betul-button.png
│       ├── salah-button.png
│       ├── isi-tempat-kosong.png
│       ├── tahniah-bg.png
│       ├── button-teruskan.png
│       └── peta-malaysia.png
│
└── branding/
    ├── logo-dbp.svg
    ├── logo-dbp.png
    ├── title-masthead.svg
    ├── splash-screen-safe.png
    └── splash-screen-full.png
```

---

## Design Tokens

### Typography
- **Primary Font**: Galindo (Google Fonts)
- **Heading Size**: 32px, normal weight, white color
- **Body Size**: 13px, 1.69px letter-spacing, white color
- **Instructions**: 10px, black color
- **Questions**: 7px, black color

### Color Palette
- **Background Gradient**: Sunset theme (#FF9D5C → #FF6B6B → #8B4789)
- **Text Primary**: White (#FFFFFF)
- **Text Secondary**: Black (#000000)
- **Accent Gold**: #FFD700
- **Health Red**: #FF4444
- **Money Green**: #4CAF50

### Spacing Constants
- Button padding: 16px horizontal, 12px vertical
- Grid gaps: 8px (crossword cells)
- Panel margins: 20px
- Safe area insets: 48px top, 24px sides

---

## Asset Inventory

| ID | Asset Name | Figma Frame | Size (Base) | Status |
|---|---|---|---|---|
| **Core UI Assets** |
| A01 | bg-main.png | 2:180 | 918×516 | ✅ Exists |
| A02 | health-bar.png | 2:194 | 194×57 | ✅ Exists |
| A03 | duit-bar.png | 2:195 | 194×57 | ✅ Exists |
| A04 | bg-nation.png | 2:184 | 250×106 | ✅ Exists |
| A05 | menu-button.png | 2:183 | 116×97 | ✅ Exists |
| A06 | next-button.png | 2:182 | 114×87 | ✅ Exists |
| A07 | star.png | 2:39 | 259×151 | ✅ Exists |
| A08 | flare.png | 2:40 | 744×533 | ✅ Exists |
| **Game-Specific Assets** |
| B01 | soalan-board.png | 2:181 | 224×167 | ✅ Exists |
| B02 | board-bg.png | 1:26 | 694×425 | ✅ Exists |
| B03 | crossword-box.png | 2:198 | 354×350 | ✅ Exists |
| B04 | jawapan-button.png | 1:51 | 266×78 | ✅ Exists |
| B05 | ok-button.png | 1:22 | 193×136 | ✅ Exists |
| B06 | betul-button.png | 2:131 | 274×91 | ✅ Exists |
| B07 | salah-button.png | 2:132 | 259×121 | ✅ Exists |
| B08 | isi-tempat-kosong.png | 2:105 | 266×88 | ✅ Exists |
| B09 | tahniah-bg.png | 2:38 | 351×325 | ✅ Exists |
| B10 | button-teruskan.png | 2:41 | 238×79 | ✅ Exists |
| **Brand/Platform Assets** |
| C01 | splash-screen-safe.png | 1:3 | 1284×2778 | 🆕 New |
| C02 | splash-screen-full.png | 1:3 | 1284×2778 | 🆕 New |
| C03 | app-icon-ios.png | 1:15 | 1024×1024 | 🆕 Update |
| C04 | android-icon-foreground.png | 1:15 | 432×432 | ✅ Exists |
| C05 | android-icon-background.png | Color | 432×432 | ✅ Exists |
| C06 | logo-dbp (svg/png) | 1:15 | 95×130 | ✅ Exists |
| C07 | title-masthead.svg | 1:13 | 564×242 | ✅ Exists |
| **Utility Assets** |
| D01 | icon-audio-on | TBD | 48×48 | 🆕 New |
| D02 | icon-audio-off | TBD | 48×48 | 🆕 New |
| D03 | icon-settings | TBD | 48×48 | 🆕 New |
| D04 | icon-back-arrow | TBD | 48×48 | 🆕 New |
| D05 | icon-home | TBD | 48×48 | 🆕 New |
| D06 | peta-malaysia.png | 1:45 | 533×397 | 🆕 New |

---

## Button State Variants

Interactive buttons should have 3 states:

| Button | Default | Pressed | Disabled |
|---|---|---|---|
| next-button | Original | 10% darker, -2px offset | 50% opacity |
| menu-button | Original | 10% darker, -2px offset | 50% opacity |
| ok-button | Original | 10% darker, -2px offset | 50% opacity |
| jawapan-button | Original | 10% darker, -2px offset | 50% opacity |
| betul-button | Original | Green glow overlay | 50% opacity |
| salah-button | Original | Red glow overlay | 50% opacity |
| button-teruskan | Original | Gold glow overlay | 50% opacity |

**Naming Convention**:
- `button-name.png` (default)
- `button-name-pressed.png`
- `button-name-disabled.png`

---

## Platform-Specific Considerations

### iOS
- Use @2x assets for standard iPhone
- Use @3x assets for iPhone Plus/Pro Max
- Splash screen must account for notches (safe area)
- App icon master: 1024×1024 PNG

### Android
- Use density qualifiers: mdpi (1x), hdpi (1.5x), xhdpi (2x), xxhdpi (3x), xxxhdpi (4x)
- Adaptive icons: separate foreground + background layers
- Splash screen must account for punchouts (camera cutouts)

### Web
- Prefer SVG for icons (scalable)
- Use WebP format with PNG fallback for photos
- Lazy load large backgrounds

---

## Asset Loading Strategy

### Critical (Load Immediately)
- bg-main.png (visible on launch)
- logo-dbp.png (splash screen)
- title-masthead.svg (splash screen)
- health-bar.png, duit-bar.png (always visible)

### Lazy Load (On Demand)
- peta-malaysia.png (map screen only)
- crossword-box.png (crossword questions only)
- tahniah-bg.png (success modal only)

### Preload During Tutorial
- All button variants
- soalan-board.png
- Common UI elements

---

## Backwards Compatibility

During migration, maintain compatibility with existing code:

1. **Phase 1**: Create new folder structure without moving files
2. **Phase 2**: Create symlinks from new paths to old paths
3. **Phase 3**: Update components to import from centralized manifest
4. **Phase 4**: Remove old paths after thorough testing
5. **Phase 5**: Delete symlinks

**Example symlink**:
```bash
ln -s /assets/images/game/backgrounds/bg-main.png \
      /assets/images/shared/backgrounds/bg-main.png
```

---

## Malay Text Preservation

**CRITICAL**: These text elements must remain exactly as designed:

- **State Names**: PERLIS, KEDAH, JOHOR, PAHANG, NEGERI SEMBILAN
- **Crossword Labels**: MENEGAK, MENDATAR
- **Button Text**: BETUL, SALAH, TERUSKAN, ULANG SEMULA
- **Success Modal**: TAHNIAH

Text is embedded directly in graphics (not separate layers) per DBP branding requirements.

---

## Future Enhancements

### Lottie Animation Candidates
1. **Star** (Frame 2:39) - Pulsing/spinning on success
2. **Flare** (Frame 2:40) - Radial burst on correct answer
3. **Health Bar** (Frame 2:194) - Fill level animation
4. **Money Counter** (Frame 2:195) - Number increment/decrement

### Responsive Background Variants
- 16:9 (landscape tablets, web)
- 4:3 (iPad landscape)
- 9:16 (portrait phones - most common)
- 3:4 (iPad portrait)

---

## References

- **Figma File**: https://www.figma.com/design/65nT29eLZRN0u9Mjb66CKZ/DBP-SEJARAH
- **Asset Manifest**: `/constants/assets.ts`
- **Migration Guide**: `/docs/ASSET_MIGRATION_GUIDE.md`
- **Export Checklist**: `/docs/ASSET_EXPORT_CHECKLIST.md`
- **Design Tokens**: `/constants/theme.ts`

---

**Document Version**: 1.0  
**Status**: Active  
**Owner**: Development Team

