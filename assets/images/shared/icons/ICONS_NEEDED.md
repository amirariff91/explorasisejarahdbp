# Utility Icons Needed

These icons are not present in the current Figma file and need to be designed following the DBP Sejarah visual style.

## Design Guidelines
- **Style**: Rounded, playful, matches tropical/jungle theme
- **Size**: 48×48 px base (with @2x and @3x variants)
- **Color Palette**: Use colors from bg-main (#FF9D5C, #FF6B6B, #FFD700)
- **Line Weight**: 3-4px strokes
- **Format**: SVG (vector) + PNG (raster fallbacks)

## Required Icons

### 1. Audio On (`audio-on.svg` / `audio-on.png`)
- **Icon**: Speaker with sound waves
- **Visual**: 🔊 Three curved lines emanating from speaker
- **Colors**: Gold accent (#FFD700) for waves, white speaker
- **States**: Only default (no pressed/disabled needed)
- **Export Sizes**: 48×48, 96×96 (@2x), 144×144 (@3x)

### 2. Audio Off (`audio-off.svg` / `audio-off.png`)
- **Icon**: Speaker with diagonal slash
- **Visual**: 🔇 Speaker with red slash through it
- **Colors**: Red slash (#FF4444), white speaker
- **States**: Only default
- **Export Sizes**: 48×48, 96×96 (@2x), 144×144 (@3x)

### 3. Settings (`settings.svg` / `settings.png`)
- **Icon**: Gear/cog
- **Visual**: ⚙️ 8-tooth gear
- **Colors**: White fill, gold outline (#FFD700)
- **States**: Only default
- **Export Sizes**: 48×48, 96×96 (@2x), 144×144 (@3x)

### 4. Back Arrow (`back-arrow.svg` / `back-arrow.png`)
- **Icon**: Left-pointing arrow
- **Visual**: ← Rounded arrow pointing left
- **Colors**: White fill
- **States**: Only default
- **Export Sizes**: 48×48, 96×96 (@2x), 144×144 (@3x)

### 5. Home (`home.svg` / `home.png`)
- **Icon**: House/home
- **Visual**: 🏠 Simple house with roof and door
- **Colors**: White fill, gold roof (#FFD700)
- **States**: Only default
- **Export Sizes**: 48×48, 96×96 (@2x), 144×144 (@3x)

## Reference Style
Look at existing buttons in `/assets/images/game/buttons/` for style consistency:
- Rounded corners (border-radius: 8-12px for rectangular icons)
- Drop shadows for depth
- High contrast for visibility
- Matches Galindo font playfulness

## Export Settings
- **SVG**: Optimize paths, remove Figma metadata
- **PNG**: Transparent background, 80-90% compression
- **Naming**: kebab-case (e.g., `audio-on.png`, `audio-on@2x.png`)

## After Export
1. Place SVG files in: `/assets/images/shared/icons/`
2. Place PNG files in: `/assets/images/shared/icons/`
3. Update `/constants/assets.ts`:
   ```typescript
   icons: {
     audioOn: require('@/assets/images/shared/icons/audio-on.png'),
     audioOff: require('@/assets/images/shared/icons/audio-off.png'),
     settings: require('@/assets/images/shared/icons/settings.png'),
     backArrow: require('@/assets/images/shared/icons/back-arrow.png'),
     home: require('@/assets/images/shared/icons/home.png'),
   }
   ```

## Status
⏳ Awaiting design and export

## Design Tools
- **Figma**: Add to existing DBP SEJARAH file for consistency
- **Illustrator**: If vector design preferred
- **IconJar/Noun Project**: For icon inspiration (customize to match style)

## Questions?
Contact design team or development lead

