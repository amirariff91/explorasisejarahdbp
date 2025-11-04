# Asset Export Checklist for Designers

This checklist provides exact instructions for exporting assets from the Figma file to ensure consistency and quality across all platforms.

**Figma File**: [DBP SEJARAH](https://www.figma.com/design/65nT29eLZRN0u9Mjb66CKZ/DBP-SEJARAH?node-id=2-109)

---

## Export Settings Overview

### Standard Settings
- **Format**: PNG (unless specified as SVG)
- **Scale**: 2x (generates base, @2x, and @3x automatically)
- **Background**: Transparent (unless specified as solid)
- **Compression**: 80-90% quality (optimize for file size)

### Figma Rotation Note
⚠️ **CRITICAL**: Many frames in the Figma file are rotated 270°. Ensure you:
1. Select the frame/component
2. Rotate back to 0° before exporting
3. Or export and rotate in post-processing

---

## Batch Export Groups

### Group 1: Backgrounds
**Settings**: PNG, 2x scale, Transparent background

- [ ] **Frame 2:180** "bg 1"
  - Export as: `bg-main.png`, `bg-main@2x.png`, `bg-main@3x.png`
  - Base size: 918×516 (@2x = 1836×1032)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/backgrounds/`

- [ ] **Frame 1:26** "BOARD-BG 1"
  - Export as: `board-bg.png`, `board-bg@2x.png`, `board-bg@3x.png`
  - Base size: 694×425 (@2x = 1388×850)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/backgrounds/`

- [ ] **Frame 2:181** "SOALAN-BOARD 1"
  - Export as: `soalan-board.png`, `soalan-board@2x.png`, `soalan-board@3x.png`
  - Base size: 224×167 (@2x = 448×334)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

- [ ] **Frame 2:198** "Box-jejak-kata 1"
  - Export as: `crossword-box.png`, `crossword-box@2x.png`, `crossword-box@3x.png`
  - Base size: 354×350 (@2x = 708×700)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

---

### Group 2: Buttons (Default State)
**Settings**: PNG, 2x scale, Transparent background

- [ ] **Frame 2:183** "MENU-BUTTON 1"
  - Export as: `menu-button.png`, `menu-button@2x.png`, `menu-button@3x.png`
  - Base size: 116×97 (@2x = 232×194)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/buttons/`

- [ ] **Frame 2:182** "NEXT-BUTTON 3"
  - Export as: `next-button.png`, `next-button@2x.png`, `next-button@3x.png`
  - Base size: 114×87 (@2x = 228×174)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/buttons/`

- [ ] **Frame 1:51** "JAWAPAN 1"
  - Export as: `jawapan-button.png`, `jawapan-button@2x.png`, `jawapan-button@3x.png`
  - Base size: 266×78 (@2x = 532×156)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

- [ ] **Frame 1:22** "OK-BUTTON 1"
  - Export as: `ok-button.png`, `ok-button@2x.png`, `ok-button@3x.png`
  - Base size: 193×136 (@2x = 386×272)
  - No rotation needed
  - Destination: `/assets/images/shared/buttons/`

- [ ] **Frame 2:131** "BETUL-ATAU-SALAH-BUTTON 1"
  - Export as: `betul-button.png`, `betul-button@2x.png`, `betul-button@3x.png`
  - Base size: 274×91 (@2x = 548×182)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

- [ ] **Frame 2:132** "SALAH-BUTTON 1"
  - Export as: `salah-button.png`, `salah-button@2x.png`, `salah-button@3x.png`
  - Base size: 259×121 (@2x = 518×242)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

---

### Group 3: Button State Variants (Pressed)
**Settings**: PNG, 2x scale, Transparent background, Apply 10% darker filter + 2px Y-offset

Create pressed variants for interactive buttons:

- [ ] `menu-button-pressed.png` (@2x, @3x)
  - Apply: Brightness -10%, translate Y +2px
  
- [ ] `next-button-pressed.png` (@2x, @3x)
  - Apply: Brightness -10%, translate Y +2px

- [ ] `ok-button-pressed.png` (@2x, @3x)
  - Apply: Brightness -10%, translate Y +2px

- [ ] `jawapan-button-pressed.png` (@2x, @3x)
  - Apply: Brightness -10%, translate Y +2px

**Special Pressed States (Glow Effect)**:

- [ ] `betul-button-pressed.png` (@2x, @3x)
  - Apply: Green outer glow (color: #4CAF50, blur: 8px, opacity: 60%)

- [ ] `salah-button-pressed.png` (@2x, @3x)
  - Apply: Red outer glow (color: #FF4444, blur: 8px, opacity: 60%)

- [ ] `button-teruskan-pressed.png` (@2x, @3x)
  - Apply: Gold outer glow (color: #FFD700, blur: 8px, opacity: 60%)

---

### Group 4: Button State Variants (Disabled)
**Settings**: PNG, 2x scale, Transparent background, Apply 50% opacity

Create disabled variants:

- [ ] `menu-button-disabled.png` (@2x, @3x)
- [ ] `next-button-disabled.png` (@2x, @3x)
- [ ] `ok-button-disabled.png` (@2x, @3x)
- [ ] `jawapan-button-disabled.png` (@2x, @3x)
- [ ] `betul-button-disabled.png` (@2x, @3x)
- [ ] `salah-button-disabled.png` (@2x, @3x)
- [ ] `button-teruskan-disabled.png` (@2x, @3x)

---

### Group 5: UI Elements
**Settings**: PNG, 2x scale, Transparent background

- [ ] **Frame 2:194** "HEALTH 1"
  - Export as: `health-bar.png`, `health-bar@2x.png`, `health-bar@3x.png`
  - Base size: 194×57 (@2x = 388×114)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/ui/`

- [ ] **Frame 2:195** "DUIT 1"
  - Export as: `duit-bar.png`, `duit-bar@2x.png`, `duit-bar@3x.png`
  - Base size: 194×57 (@2x = 388×114)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/ui/`

- [ ] **Frame 2:184** "BG-NATION 1"
  - Export as: `bg-nation.png`, `bg-nation@2x.png`, `bg-nation@3x.png`
  - Base size: 250×106 (@2x = 500×212)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/ui/`

- [ ] **Frame 2:105** "ISI-TEMPAT-KOSONG 1"
  - Export as: `isi-tempat-kosong.png`, `isi-tempat-kosong@2x.png`, `isi-tempat-kosong@3x.png`
  - Base size: 266×88 (@2x = 532×176)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

- [ ] **Frame 2:39** "STAR 1"
  - Export as: `star.png`, `star@2x.png`, `star@3x.png`
  - Base size: 259×151 (@2x = 518×302)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/ui/`

- [ ] **Frame 2:40** "Flare 1"
  - Export as: `flare.png`, `flare@2x.png`, `flare@3x.png`
  - Base size: 744×533 (@2x = 1488×1066)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/shared/ui/`

- [ ] **Frame 2:38** "TAHNIAH-BG 1"
  - Export as: `tahniah-bg.png`, `tahniah-bg@2x.png`, `tahniah-bg@3x.png`
  - Base size: 351×325 (@2x = 702×650)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

- [ ] **Frame 2:41** "BUTTON-TERUSKAN 1"
  - Export as: `button-teruskan.png`, `button-teruskan@2x.png`, `button-teruskan@3x.png`
  - Base size: 238×79 (@2x = 476×158)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

---

### Group 6: Branding (Vector + Raster)
**Settings**: SVG + PNG, Vector + 2x scale raster

- [ ] **Frame 1:15** "DBP-Logo 1"
  - Export as SVG: `logo-dbp.svg`
  - Export as PNG: `logo-dbp.png`, `logo-dbp@2x.png`, `logo-dbp@3x.png`
  - Base size: 95×130 (@2x = 190×260)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/branding/`

- [ ] **Frame 1:13** "EXP-SEJARAH-TITLE 1"
  - Export as SVG: `title-masthead.svg`
  - Size: Vector (viewBox 564×242)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/branding/`

---

### Group 7: Map Asset (NEW)
**Settings**: PNG + SVG, 2x scale + Vector

- [ ] **Frame 1:45** "PETA-MALAYSIA 1"
  - Export as PNG: `peta-malaysia.png`, `peta-malaysia@2x.png`, `peta-malaysia@3x.png`
  - Export as SVG: `peta-malaysia.svg` (for interactive map)
  - Base size: 533×397 (@2x = 1066×794)
  - Rotate: 270° correction needed
  - Destination: `/assets/images/games/dbp-sejarah/`

---

### Group 8: Splash Screens (NEW)
**Settings**: PNG, Specific platform sizes, Solid background

#### Safe-Area Layout
- [ ] **Frame 1:3** Composite (Logo + Title centered)
  - iPhone 15 Pro: `splash-screen-safe-1284x2778.png` (1284×2778)
  - iPhone X/XS: `splash-screen-safe-1125x2436.png` (1125×2436)
  - iPhone XS Max: `splash-screen-safe-1242x2688.png` (1242×2688)
  - Android xxxhdpi: `splash-screen-safe-1440x2560.png` (1440×2560)
  - Center logo at 40% from top, title at 60%
  - Background: Full bg-main image
  - Safe margins: 48px top/bottom
  - Destination: `/assets/images/branding/`

#### Full-Bleed Layout
- [ ] **Frame 1:3** Full background
  - Same sizes as safe-area versions
  - Prefix: `splash-screen-full-`
  - Extend bg-main to fill entire canvas
  - Logo + title overlaid on center
  - Destination: `/assets/images/branding/`

---

### Group 9: App Icons (NEW/UPDATE)
**Settings**: PNG, Specific platform sizes, No rotation

#### iOS Master Icon
- [ ] **Frame 1:15** "DBP-Logo 1" (cropped/centered)
  - Export as: `app-icon-ios.png` (1024×1024)
  - Add 20% padding around logo
  - Background: Solid #FF9D5C (from bg-main palette)
  - Destination: `/assets/images/branding/`

#### Android Adaptive Foreground
- [ ] **Frame 1:15** "DBP-Logo 1"
  - Export as: `android-icon-foreground.png` (432×432)
  - Center logo in 66dp safe zone
  - Transparent background
  - Already exists, but verify sizing
  - Destination: `/assets/images/` (root level)

#### Android Adaptive Background
- [ ] **Solid Color Fill**
  - Export as: `android-icon-background.png` (432×432)
  - Solid fill: #FF9D5C
  - Already exists, verify color matches
  - Destination: `/assets/images/` (root level)

#### Android Monochrome
- [ ] **Frame 1:15** "DBP-Logo 1" (silhouette)
  - Export as: `android-icon-monochrome.png` (432×432)
  - Black logo silhouette on transparent background
  - For themed icons (Android 13+)
  - Already exists, verify if update needed
  - Destination: `/assets/images/` (root level)

#### Web Favicon
- [ ] **Frame 1:15** "DBP-Logo 1" (simplified)
  - Export as: `favicon.png` (32×32)
  - Simplified logo (emblem only, drop text)
  - Transparent background
  - High contrast for browser tabs
  - Already exists, verify if update needed
  - Destination: `/assets/images/` (root level)

---

### Group 10: Utility Icons (NEW - Design Needed)
**Settings**: SVG + PNG, 48×48 base size, Transparent background

⚠️ **These icons are not in the current Figma file. Please design following the existing visual style (rounded, playful, matches tropical theme).**

- [ ] **Audio On Icon**
  - Export as SVG: `audio-on.svg`
  - Export as PNG: `audio-on.png`, `audio-on@2x.png`, `audio-on@3x.png`
  - Design: Speaker icon with sound waves
  - Size: 48×48 base
  - Destination: `/assets/images/shared/icons/`

- [ ] **Audio Off Icon**
  - Export as SVG: `audio-off.svg`
  - Export as PNG: `audio-off.png`, `audio-off@2x.png`, `audio-off@3x.png`
  - Design: Speaker icon with slash
  - Size: 48×48 base
  - Destination: `/assets/images/shared/icons/`

- [ ] **Settings Icon**
  - Export as SVG: `settings.svg`
  - Export as PNG: `settings.png`, `settings@2x.png`, `settings@3x.png`
  - Design: Gear/cog icon
  - Size: 48×48 base
  - Destination: `/assets/images/shared/icons/`

- [ ] **Back Arrow Icon**
  - Export as SVG: `back-arrow.svg`
  - Export as PNG: `back-arrow.png`, `back-arrow@2x.png`, `back-arrow@3x.png`
  - Design: Left arrow for navigation
  - Size: 48×48 base
  - Destination: `/assets/images/shared/icons/`

- [ ] **Home Icon**
  - Export as SVG: `home.svg`
  - Export as PNG: `home.png`, `home@2x.png`, `home@3x.png`
  - Design: House icon
  - Size: 48×48 base
  - Destination: `/assets/images/shared/icons/`

---

## Responsive Background Variants (Optional - Future Enhancement)

Export bg-main in multiple aspect ratios for responsive layouts:

- [ ] **16:9 Landscape** (1920×1080 @2x)
  - Export as: `bg-main-16x9@2x.png`
  - Use case: Landscape tablets, web

- [ ] **4:3 iPad Landscape** (1536×1152 @2x)
  - Export as: `bg-main-4x3@2x.png`
  - Use case: iPad landscape

- [ ] **9:16 Portrait** (1080×1920 @2x)
  - Export as: `bg-main-9x16@2x.png`
  - Use case: Portrait phones (most common)

- [ ] **3:4 iPad Portrait** (1152×1536 @2x)
  - Export as: `bg-main-3x4@2x.png`
  - Use case: iPad portrait

---

## Quality Assurance Checklist

Before delivering assets, verify:

- [ ] All assets rotated correctly (270° correction applied where needed)
- [ ] Transparent backgrounds where specified
- [ ] No stray layers or hidden elements
- [ ] Malay text rendered with correct font (Galindo)
- [ ] Colors match Figma hex values exactly
- [ ] PNG compression optimized (80-90% quality, not 100%)
- [ ] SVG files cleaned (remove Figma metadata, optimize paths)
- [ ] All @2x and @3x variants generated automatically
- [ ] Button states visually distinct but consistent
- [ ] Splash screens tested on notched devices (safe area respected)
- [ ] App icons pass iOS/Android validation tools
- [ ] File naming follows kebab-case convention
- [ ] All files organized in correct destination folders

---

## Malay Text Preservation

**CRITICAL**: These text elements must remain exactly as designed (embedded in graphics):

- **State Names**: PERLIS, KEDAH, JOHOR, PAHANG, NEGERI SEMBILAN
- **Crossword Labels**: MENEGAK, MENDATAR
- **Button Text**: BETUL, SALAH, TERUSKAN, ULANG SEMULA
- **Success Modal**: TAHNIAH

Do NOT separate text into separate layers unless specifically requested for localization.

---

## Delivery Format

Package all assets in a ZIP file with this structure:

```
dbp-sejarah-assets-v1.0.zip
├── shared/
│   ├── backgrounds/
│   ├── buttons/
│   ├── ui/
│   └── icons/
├── games/
│   └── dbp-sejarah/
└── branding/
```

Include a `README.txt` with:
- Export date
- Figma file version/link
- List of changes (if updating existing assets)
- Any notes or deviations from this checklist

---

**Checklist Version**: 1.0  
**Last Updated**: October 31, 2025  
**Questions?** Contact development team

