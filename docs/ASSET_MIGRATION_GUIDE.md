# Asset Migration Guide

This guide walks developers through migrating from the legacy asset structure to the new modular asset system.

**Status**: Migration in progress  
**Target Completion**: TBD  
**Breaking Changes**: None (backwards compatible via symlinks)

---

## Migration Overview

### Goals
1. ✅ Organize assets into modular structure for future mini-games
2. ✅ Centralize asset imports via manifest file
3. ✅ Maintain backwards compatibility (no breaking changes)
4. ✅ Improve asset loading performance
5. ✅ Enable platform-specific optimizations

### Non-Goals
- ❌ Change existing asset filenames
- ❌ Require immediate updates to all components
- ❌ Introduce new dependencies

---

## Migration Phases

### Phase 1: Infrastructure Setup ✅
**Duration**: 1-2 days  
**Risk**: Low (no code changes)

Tasks:
- [x] Create new folder structure
- [x] Generate asset manifest file
- [x] Add TypeScript types
- [x] Document migration plan

### Phase 2: Asset Acquisition 🔄
**Duration**: 3-5 days  
**Risk**: Low (new assets only)

Tasks:
- [ ] Export missing Figma assets
- [ ] Generate button state variants
- [ ] Create splash screen variants
- [ ] Update app icons

### Phase 3: Backwards Compatibility 🔄
**Duration**: 1 day  
**Risk**: Low (symlinks)

Tasks:
- [ ] Create symlinks from new paths to old paths
- [ ] Verify asset loading on all platforms
- [ ] Update asset manifest with all paths

### Phase 4: Component Migration 📅
**Duration**: 1-2 weeks  
**Risk**: Medium (code changes, requires testing)

Tasks:
- [ ] Migrate StatusBar component
- [ ] Migrate MenuButton component
- [ ] Migrate SuccessModal component
- [ ] Migrate question components (5 types)
- [ ] Migrate game screens (tutorial, quiz, crossword, map)
- [ ] Update all `require()` and `import` statements

### Phase 5: Cleanup 📅
**Duration**: 2-3 days  
**Risk**: Low (after thorough testing)

Tasks:
- [ ] Remove symlinks
- [ ] Delete legacy asset paths
- [ ] Update documentation
- [ ] Archive old folder structure

---

## Old vs New Structure

### Legacy Structure (Current)
```
/assets/images/
├── game/
│   ├── backgrounds/
│   │   ├── bg-main.png
│   │   ├── board-bg.png
│   │   └── soalan-board.png
│   ├── buttons/
│   │   ├── betul-button.png
│   │   ├── crossword-box.png
│   │   ├── jawapan-button.png
│   │   ├── menu-button.png
│   │   ├── next-button.png
│   │   ├── ok-button.png
│   │   └── salah-button.png
│   ├── ui-elements/
│   │   ├── bg-nation.png
│   │   ├── button-teruskan.png
│   │   ├── duit-bar.png
│   │   ├── flare.png
│   │   ├── health-bar.png
│   │   ├── isi-tempat-kosong.png
│   │   ├── star.png
│   │   └── tahniah-bg.png
│   ├── LOGO DBP/
│   │   ├── LOGO DBP.svg
│   │   └── logo-dbp.png
│   └── MASTHEAD/
│       └── TITLE.svg
├── icon.png
├── splash-icon.png
└── ... (other files)
```

### New Modular Structure
```
/assets/images/
├── shared/                    # Cross-game reusable
│   ├── backgrounds/
│   │   ├── bg-main.png
│   │   ├── bg-main@2x.png
│   │   └── bg-main@3x.png
│   ├── buttons/
│   │   ├── menu-button.png
│   │   ├── menu-button-pressed.png
│   │   ├── menu-button-disabled.png
│   │   ├── next-button.png
│   │   ├── next-button-pressed.png
│   │   ├── next-button-disabled.png
│   │   └── ok-button.png
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
│   └── dbp-sejarah/          # Game-specific
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
    └── app-icon-ios.png
```

---

## Asset Manifest Usage

### Before (Legacy)
```typescript
// In component file
import { Image } from 'expo-image';

export const StatusBar = () => {
  return (
    <>
      <Image
        source={require('@/assets/images/game/ui-elements/health-bar.png')}
      />
      <Image
        source={require('@/assets/images/game/ui-elements/duit-bar.png')}
      />
    </>
  );
};
```

### After (New Manifest)
```typescript
// In component file
import { Image } from 'expo-image';
import { ASSETS } from '@/constants/assets';

export const StatusBar = () => {
  return (
    <>
      <Image source={ASSETS.shared.ui.healthBar} />
      <Image source={ASSETS.shared.ui.duitBar} />
    </>
  );
};
```

### Benefits
1. ✅ **Centralized**: Change asset path once, affects all components
2. ✅ **Type-safe**: TypeScript autocomplete for asset names
3. ✅ **Platform-aware**: Can conditionally load WebP, @2x, @3x variants
4. ✅ **Testable**: Mock asset manifest in tests
5. ✅ **Discoverable**: IDE autocomplete shows all available assets

---

## Migration Steps for Developers

### Step 1: Update Imports
Find all `require()` statements for assets:

```bash
# Search for asset imports
grep -r "require('@/assets/images" app/ components/
```

Replace with manifest imports:

**Before**:
```typescript
const bgMain = require('@/assets/images/game/backgrounds/bg-main.png');
```

**After**:
```typescript
import { ASSETS } from '@/constants/assets';
const bgMain = ASSETS.shared.backgrounds.main;
```

### Step 2: Handle Button States
Update button components to use state variants:

**Before**:
```typescript
<Pressable>
  <Image source={require('@/assets/images/game/buttons/next-button.png')} />
</Pressable>
```

**After**:
```typescript
import { ASSETS } from '@/constants/assets';

<Pressable>
  {({ pressed, disabled }) => (
    <Image 
      source={
        disabled 
          ? ASSETS.shared.buttons.next.disabled
          : pressed
          ? ASSETS.shared.buttons.next.pressed
          : ASSETS.shared.buttons.next.default
      }
    />
  )}
</Pressable>
```

### Step 3: Add TypeScript Types
Ensure your component imports asset types:

```typescript
import type { AssetSource } from '@/types/assets';

interface Props {
  backgroundImage?: AssetSource;
}
```

### Step 4: Test Asset Loading
Verify assets load correctly on all platforms:

```bash
# iOS
yarn ios

# Android
yarn android

# Web
yarn web
```

Check Metro bundler output for any missing assets or import errors.

---

## Component Migration Checklist

### High Priority (Core UI)
- [ ] `StatusBar.tsx` - Health and money bars
- [ ] `MenuButton.tsx` - Pause button
- [ ] `ProgressBar.tsx` - Progress indicators
- [ ] `SuccessModal.tsx` - Victory screen
- [ ] `FeedbackOverlay.tsx` - Answer feedback

### Medium Priority (Question Components)
- [ ] `MultipleChoiceQuestion.tsx` - MCQ component
- [ ] `TrueFalseQuestion.tsx` - True/False component
- [ ] `FillBlankQuestion.tsx` - Fill-in-blank component
- [ ] `MatchingQuestion.tsx` - Matching grid component
- [ ] `CrosswordQuestion.tsx` - Crossword component

### Low Priority (Screens)
- [ ] `app/(game)/tutorial.tsx` - Tutorial screen
- [ ] `app/(game)/index.tsx` - State selection map
- [ ] `app/(game)/quiz/[state].tsx` - Quiz screen
- [ ] `app/(game)/crossword/[state].tsx` - Crossword screen
- [ ] `app/(tabs)/index.tsx` - Home screen
- [ ] `app/(tabs)/explore.tsx` - Explore screen

---

## Backwards Compatibility Strategy

### Symlinks (Phase 3)
Create symlinks from new paths to old paths:

```bash
# Example: Link shared assets back to legacy paths
cd /Users/amirariff/.cursor/worktrees/explorasisejarahdbp/xzL1x

# Health bar
ln -s assets/images/shared/ui/health-bar.png \
      assets/images/game/ui-elements/health-bar.png

# Duit bar
ln -s assets/images/shared/ui/duit-bar.png \
      assets/images/game/ui-elements/duit-bar.png

# Background
ln -s assets/images/shared/backgrounds/bg-main.png \
      assets/images/game/backgrounds/bg-main.png

# ... (repeat for all assets)
```

### Manifest Fallbacks
The asset manifest includes fallback paths for compatibility:

```typescript
export const ASSETS = {
  shared: {
    ui: {
      // New path (preferred)
      healthBar: require('@/assets/images/shared/ui/health-bar.png'),
      // Legacy path (fallback during migration)
      _legacyHealthBar: require('@/assets/images/game/ui-elements/health-bar.png'),
    },
  },
};
```

---

## Testing Checklist

After migrating components, verify:

### Visual Testing
- [ ] All images render correctly
- [ ] No broken image placeholders
- [ ] Button states work (default, pressed, disabled)
- [ ] Backgrounds fill screen properly
- [ ] Icons display at correct sizes

### Platform Testing
- [ ] iOS Simulator (iPhone 15 Pro)
- [ ] iOS Device (if available)
- [ ] Android Emulator (Pixel 7 Pro)
- [ ] Android Device (if available)
- [ ] Web Browser (Chrome, Safari)

### Performance Testing
- [ ] Assets load within 2 seconds
- [ ] No console warnings about missing assets
- [ ] Metro bundler shows no import errors
- [ ] App bundle size doesn't increase significantly
- [ ] Lazy loading works for map/crossword screens

### Functional Testing
- [ ] Tutorial completes successfully
- [ ] State selection map renders
- [ ] Quiz questions display correctly
- [ ] Crossword grid appears
- [ ] Success modal shows on completion
- [ ] Audio controls work (when icons implemented)

---

## Common Issues & Solutions

### Issue 1: Asset Not Found
**Error**: `Unable to resolve module @/assets/images/shared/ui/health-bar.png`

**Solution**:
1. Verify file exists at specified path
2. Check asset manifest has correct path
3. Restart Metro bundler: `npx expo start --clear`
4. Check for typos in filename (case-sensitive)

### Issue 2: Symlink Doesn't Work on Windows
**Error**: `ENOENT: no such file or directory`

**Solution**:
- Use `mklink` instead of `ln -s` on Windows
- Or copy files instead of symlinking (temporary workaround)
- Ensure Git is configured to handle symlinks: `git config core.symlinks true`

### Issue 3: Button States Not Displaying
**Error**: Pressed/disabled variants not showing

**Solution**:
1. Verify button state variants are exported from Figma
2. Check asset manifest includes all 3 states (default, pressed, disabled)
3. Ensure Pressable component passes `pressed` and `disabled` props
4. Test with `console.log` to verify state changes

### Issue 4: Performance Degradation
**Error**: Slow asset loading, stuttering animations

**Solution**:
1. Enable asset preloading in app initialization
2. Use `expo-image` library (handles caching automatically)
3. Convert large PNGs to WebP for web platform
4. Implement lazy loading for non-critical assets
5. Check Metro bundler is caching assets correctly

---

## Rollback Plan

If migration causes critical issues:

### Step 1: Revert Component Changes
```bash
# Revert last commit
git revert HEAD

# Or reset to previous commit
git reset --hard <commit-hash>
```

### Step 2: Remove New Assets
```bash
# Remove new folder structure (keep legacy)
rm -rf assets/images/shared/
rm -rf assets/images/games/
rm -rf assets/images/branding/
```

### Step 3: Remove Symlinks
```bash
# Find and remove all symlinks
find assets/images -type l -delete
```

### Step 4: Remove Asset Manifest
```bash
# Remove manifest file
rm constants/assets.ts
rm types/assets.ts
```

### Step 5: Clear Metro Cache
```bash
# Clear cache and restart
npx expo start --clear
```

---

## Performance Optimizations

### Preload Critical Assets
In `app/_layout.tsx`, preload assets before rendering:

```typescript
import { Asset } from 'expo-asset';
import { ASSETS } from '@/constants/assets';

export default function RootLayout() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        ASSETS.shared.backgrounds.main,
        ASSETS.shared.ui.healthBar,
        ASSETS.shared.ui.duitBar,
        ASSETS.branding.logo,
      ]);
      setAssetsLoaded(true);
    }
    loadAssets();
  }, []);

  if (!assetsLoaded) {
    return <LoadingScreen />;
  }

  return <Slot />;
}
```

### Lazy Load Game Assets
In quiz/crossword screens, lazy load game-specific assets:

```typescript
import { ASSETS } from '@/constants/assets';

export default function QuizScreen() {
  const [gameAssetsLoaded, setGameAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadGameAssets() {
      await Asset.loadAsync([
        ASSETS.games.dbpSejarah.soalanBoard,
        ASSETS.games.dbpSejarah.crosswordBox,
        ASSETS.games.dbpSejarah.jawapanButton,
      ]);
      setGameAssetsLoaded(true);
    }
    loadGameAssets();
  }, []);

  // ...
}
```

### Platform-Specific Loading
Use WebP for web, PNG for native:

```typescript
// In constants/assets.ts
import { Platform } from 'react-native';

const getImageSource = (webp: any, png: any) => {
  return Platform.OS === 'web' ? webp : png;
};

export const ASSETS = {
  shared: {
    backgrounds: {
      main: getImageSource(
        require('@/assets/images/shared/backgrounds/bg-main.webp'),
        require('@/assets/images/shared/backgrounds/bg-main.png')
      ),
    },
  },
};
```

---

## Timeline & Milestones

| Phase | Duration | Completion Date | Status |
|---|---|---|---|
| Phase 1: Infrastructure | 1-2 days | TBD | ✅ Complete |
| Phase 2: Asset Acquisition | 3-5 days | TBD | 🔄 In Progress |
| Phase 3: Backwards Compat | 1 day | TBD | 📅 Planned |
| Phase 4: Component Migration | 1-2 weeks | TBD | 📅 Planned |
| Phase 5: Cleanup | 2-3 days | TBD | 📅 Planned |

**Total Estimated Duration**: 2-3 weeks

---

## Success Criteria

Migration is considered successful when:

1. ✅ All components use centralized asset manifest
2. ✅ No hardcoded asset paths remain in codebase
3. ✅ All tests pass on iOS, Android, and Web
4. ✅ Asset loading performance is equal or better than before
5. ✅ No visual regressions (screenshots match baseline)
6. ✅ TypeScript types provide full autocomplete support
7. ✅ Documentation is updated with new asset system
8. ✅ Team is trained on new asset workflow

---

## Contact & Support

**Questions?** Ask in:
- Development Slack channel
- Weekly sync meetings
- GitHub discussions

**Issues?** File a bug report:
- Use template: `Bug: Asset Migration - [Component Name]`
- Include: Platform, error message, screenshot
- Tag: `asset-migration`, `bug`

---

**Document Version**: 1.0  
**Last Updated**: October 31, 2025  
**Owner**: Development Team

