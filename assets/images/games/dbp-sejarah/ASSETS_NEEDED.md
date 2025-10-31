# Missing Assets for DBP Sejarah

These assets need to be exported manually from Figma and placed in this directory.

## Required Exports

### 1. Malaysia Map (`peta-malaysia.png`)
- **Figma Frame**: 1:45 "PETA-MALAYSIA 1"
- **Export Settings**: PNG, 2x scale, Transparent background
- **Base Size**: 533×397 px
- **Export Sizes**:
  - `peta-malaysia.png` (533×397)
  - `peta-malaysia@2x.png` (1066×794)
  - `peta-malaysia@3x.png` (1599×1191)
- **Also Export SVG**: `peta-malaysia.svg` for interactive map features
- **Rotation**: 270° correction needed from Figma
- **Usage**: State selection map screen

### Notes
- The map should show all Malaysian states with clear boundaries
- Preserve interactive regions if possible (for click detection)
- Ensure state names are readable at all scales
- SVG version preferred for scalability and interactivity

## Export Instructions

1. Open Figma file: https://www.figma.com/design/65nT29eLZRN0u9Mjb66CKZ/DBP-SEJARAH
2. Navigate to Frame 1:45 "PETA-MALAYSIA 1"
3. Select the frame
4. Rotate to 0° if needed
5. Export with settings above
6. Place files in this directory
7. Update `/constants/assets.ts` to point to actual file:
   ```typescript
   petaMalaysia: require('@/assets/images/games/dbp-sejarah/peta-malaysia.png'),
   ```

## Status
⏳ Awaiting manual export from Figma

