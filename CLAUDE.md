# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DBP SEJARAH** is an interactive educational game built with Expo 54, React Native, and TypeScript to teach Malaysian history through gameplay. Players travel through 14 Malaysian states answering history questions across 5 different question types.

**Tech Stack:**
- Expo SDK 54 with New Architecture enabled
- TypeScript 5.9 (strict mode)
- expo-router 6 (file-based routing with typed routes)
- React Context + Hooks for state management
- expo-secure-store for game persistence
- react-native-reanimated 4 for animations
- expo-audio for sound effects and music

## Development Commands

### Local Development
```bash
# Start development server (interactive menu)
yarn start
# or
npx expo start

# Platform-specific
yarn android    # Run on Android device/emulator
yarn ios        # Run on iOS device/simulator
yarn web        # Run in web browser
```

### Code Quality
```bash
# Lint the codebase
npx expo lint
```

### Build & Deploy
```bash
# EAS Build profiles (requires Node.js 20.19.4)
eas build --profile development    # Development APK (internal distribution)
eas build --profile preview        # Preview APK (internal, iOS simulator)
eas build --profile production     # Production app bundle (auto-increment version)

# View build logs
eas build:list
eas build:view [build-id]
eas build:logs [build-id]
```

### Utilities
```bash
# Generate Malaysia map SVG paths from TopoJSON
node scripts/convert-map.js
```

## Architecture Overview

### File-Based Routing (expo-router)

The app uses expo-router 6 with typed routes enabled. Routes are defined by the file structure in `app/`:

```
app/
  (game)/                      # Route group (does not create URL segment)
    _layout.tsx                # Game layout wrapper with GameProvider
    index.tsx                  # Landing screen (redirects based on tutorial status)
    log-masuk.tsx              # Player profile screen
    tutorial.tsx               # First-time tutorial
    map.tsx                    # State selection with Malaysia map
    quiz/[state].tsx           # Dynamic quiz screen (handles all 5 question types)
    crossword/[state].tsx      # Dedicated crossword puzzle screen
```

**Navigation pattern:**
- `index` → checks tutorial status → redirects to `tutorial` or `map`
- `map` → user selects state → navigates to `quiz/[state]`
- Quiz completion → shows SuccessModal → returns to `map`

### State Management (GameContext)

Centralized game state via React Context with automatic persistence to expo-secure-store:

**Location:** `contexts/GameContext.tsx`

**Key Features:**
- Debounced saves (max 1 save/second) to prevent excessive storage writes
- Retry logic with exponential backoff on save failures
- `isMountedRef` pattern to prevent setState on unmounted components
- Per-state question progress tracking (`questionIndexByState`)

**State Shape:**
```typescript
interface GameState {
  money: number;                    // Starts at RM100, -RM2 per wrong answer
  health: number;                   // 0-100, -2 per wrong answer
  currentState: MalaysianState | null;
  completedStates: MalaysianState[];
  currentQuestionIndex: number;
  answers: Record<string, AnswerValue>;
  questionIndexByState?: Partial<Record<MalaysianState, number>>;
  showSuccessModal: boolean;
  hasSeenTutorial: boolean;
  playerProfile: PlayerProfile | null;
  allowFontScaling: boolean;
}
```

**Usage:**
```typescript
import { useGameContext } from '@/contexts/GameContext';

const {
  gameState,
  answerQuestion,
  completeState,
  clearStateAnswers,
  setCurrentState,
} = useGameContext();
```

### Question Type System

All questions are strongly typed with discriminated unions:

**Location:** `types/game.ts`

**5 Question Types:**
1. `multipleChoice` - 4 options, 1 correct answer
2. `trueFalse` - Boolean correct answer
3. `fillBlank` - Text input with optional `acceptableAnswers` and `caseSensitive` flag
4. `matching` - 9-grid with multiple correct selections
5. `crossword` - Dedicated crossword puzzle with clues and grid

**Question Data Organization:**
```
data/questions/
  index.ts              # Central export with getQuestionsForState()
  perlis.ts             # Questions for Perlis state
  kedah.ts              # Questions for Kedah state
  ... (14 state files total)
```

**Adding New Questions:**
1. Edit the appropriate state file in `data/questions/[state].ts`
2. Follow the Question type interfaces from `types/game.ts`
3. Question IDs should be prefixed with state name (e.g., `johor-1`, `johor-2`)

### Answer Checking Logic

Answer validation is handled in GameContext's `checkAnswer()` function:

- **multipleChoice/trueFalse:** Direct equality check
- **fillBlank:** Normalized comparison (trim whitespace, optional case-insensitive), checks `acceptableAnswers` array
- **matching:** Validates unique selections match all `correctAnswers` (order-independent)
- **crossword:** Placeholder (full implementation in dedicated crossword components)

**Penalties:**
- Wrong answer: -RM2 money, -2 health
- Correct answer: No penalty

### Asset Management System

**Location:** `constants/assets.ts`

Centralized asset manifest organized into three categories:

1. **shared:** Cross-game reusable assets (backgrounds, buttons, UI elements, icons)
2. **games.dbpSejarah:** Game-specific assets (soalan boards, answer buttons, crossword elements)
3. **branding:** Platform assets (logos, splash screens, app icons)

**Usage Pattern:**
```typescript
import { ASSETS } from '@/constants/assets';

<Image source={ASSETS.shared.ui.healthBar} />
<Image source={ASSETS.games.dbpSejarah.jawapanButton.default} />
```

**Button State Helper:**
```typescript
import { getButtonState } from '@/constants/assets';

<Pressable>
  {({ pressed, disabled }) => (
    <Image source={getButtonState(ASSETS.shared.buttons.next, pressed, disabled)} />
  )}
</Pressable>
```

**Preloading Strategy:**
- `critical`: Load on app start (main background, health/money bars)
- `preload`: Load during tutorial (buttons, UI elements)
- `lazy`: Load on demand (game-specific screens)

See `utils/preload-assets.ts` for implementation.

### Audio System

**Location:** `utils/audio.ts`

Provides functions for playing background music, ambient sounds, and feedback audio:

```typescript
import { playMusic, playSound, playAmbient, stopMusic, stopAllAmbient } from '@/utils/audio';

// Background music (loops)
await playMusic('background-music');

// One-shot sound effects
await playSound('correct-answer');
await playSound('wrong-answer');

// Ambient sounds (loops)
await playAmbient('jungle-ambiance');

// Cleanup
await stopMusic();
await stopAllAmbient();
```

Audio files are stored in `assets/audio/` and organized by type (music, feedback, ambient).

### Responsive Design System

The app uses a comprehensive **4-tier responsive system** with unified breakpoints to ensure optimal display across all device sizes (667px iPhone SE to 1366px iPad Pro).

**Locations:**
- Layout helpers: `constants/layout.ts`
- Typography helpers: `constants/theme.ts`

#### Device Classification

Four device tiers with progressive scale factors:

| Device Tier | Width Range | Scale Factor | Target Devices |
|-------------|-------------|--------------|----------------|
| `phone` | < 800px | 1.0× | iPhone SE, iPhone 8 (667px-736px) |
| `tablet-sm` | 800-999px | 1.2× | iPad Mini, Small tablets (820px) |
| `tablet-md` | 1000-1199px | 1.5× | iPad 10.2" landscape (1080px) |
| `tablet-lg` | ≥ 1200px | 1.8× | iPad Pro 11"/12.9" landscape (1194px-1366px) |

**Unified Breakpoints:**
```typescript
export const Breakpoints = {
  phone: 800,      // Below 800px
  tabletSmall: 800,   // 800-999px
  tabletMedium: 1000, // 1000-1199px
  tabletLarge: 1200,  // 1200px and above
};
```

#### Device Detection

```typescript
import { useWindowDimensions } from 'react-native';
import { getDeviceSize, getScaleFactor, isLandscapeMode } from '@/constants/layout';

const { width, height } = useWindowDimensions();

// Get device tier classification
const deviceSize = getDeviceSize(width);
// Returns: 'phone' | 'tablet-sm' | 'tablet-md' | 'tablet-lg'

// Get scale multiplier for current device
const scaleFactor = getScaleFactor(width);
// Returns: 1.0, 1.2, 1.5, or 1.8

// Check if landscape (>= 800px width)
const isLandscape = isLandscapeMode(width);
// Returns: boolean
```

#### Responsive Sizing

**Automatic dimension scaling with configurable max limits:**

```typescript
import { getResponsiveSizeScaled } from '@/constants/layout';

// Basic usage - scales from 1.0× to 1.8× by default
const iconSize = getResponsiveSizeScaled(40, width);
// Phone: 40px, Tablet-sm: 48px, Tablet-md: 60px, Tablet-lg: 72px

// With custom max scale (e.g., cap at 1.5×)
const logoSize = getResponsiveSizeScaled(140, width, 1.5);
// Phone: 140px, Tablet-sm: 168px, Tablet-md: 210px, Tablet-lg: 210px (capped)

// Common pattern for margins/padding
const edgeMargin = getResponsiveSizeScaled(20, width);
const buttonGap = getResponsiveSizeScaled(16, width);
```

#### Board Sizing Helpers

**Pre-configured base sizes for game boards with automatic aspect-ratio-preserving scaling:**

```typescript
import { getQuestionBoardSize } from '@/constants/layout';

// Get responsive dimensions for a board type
const boardSize = getQuestionBoardSize('soalan', width);
// Returns: { width: number, height: number }

// Available board types:
const soalanBoard = getQuestionBoardSize('soalan', width);
// Base 360×360 → scales to 648×648 on iPad Pro

const answerBoard = getQuestionBoardSize('answer', width);
// Base 340×280 → scales to 612×504 on iPad Pro

const clueBoard = getQuestionBoardSize('clue', width);
// Base 180×240 → scales to 324×432 on iPad Pro

const descBoard = getQuestionBoardSize('description', width);
// Base 380×200 → scales to 684×360 on iPad Pro

const mapBoard = getQuestionBoardSize('map', width);
// Base 600×450 → scales to 1080×810 on iPad Pro
```

#### Typography Scaling

**Context-aware font size scaling:**

```typescript
import { getResponsiveFontSize } from '@/constants/theme';

// Question text (primary heading)
const questionSize = getResponsiveFontSize('question', width);
// Phone: 16px, Tablet-sm: 19px, Tablet-md: 24px, Tablet-lg: 29px

// Answer text (secondary)
const answerSize = getResponsiveFontSize('answer', width);
// Phone: 14px, Tablet-sm: 17px, Tablet-md: 21px, Tablet-lg: 25px

// Clue text (tertiary)
const clueSize = getResponsiveFontSize('clue', width);
// Phone: 12px, Tablet-sm: 14px, Tablet-md: 18px, Tablet-lg: 22px

// State labels (large)
const stateSize = getResponsiveFontSize('stateLabel', width);
// Phone: 20px, Tablet-sm: 24px, Tablet-md: 30px, Tablet-lg: 36px

// Usage example
<Text style={[styles.questionText, { fontSize: getResponsiveFontSize('question', width) }]}>
  {question.question}
</Text>
```

#### Component Sizing Pattern

**Standard approach for responsive components:**

```typescript
import { useWindowDimensions } from 'react-native';
import { getResponsiveSizeScaled, getQuestionBoardSize } from '@/constants/layout';
import { getResponsiveFontSize } from '@/constants/theme';

export default function MyComponent() {
  const { width } = useWindowDimensions();

  // Get board dimensions
  const boardDimensions = getQuestionBoardSize('soalan', width);

  // Calculate element sizes
  const iconSize = getResponsiveSizeScaled(32, width);
  const buttonWidth = getResponsiveSizeScaled(120, width);
  const padding = getResponsiveSizeScaled(16, width);

  // Get font sizes
  const titleSize = getResponsiveFontSize('question', width);
  const bodySize = getResponsiveFontSize('answer', width);

  return (
    <View style={{
      width: boardDimensions.width,
      height: boardDimensions.height,
      padding
    }}>
      <Text style={{ fontSize: titleSize }}>Title</Text>
      <Text style={{ fontSize: bodySize }}>Body text</Text>
      <Image style={{ width: iconSize, height: iconSize }} />
    </View>
  );
}
```

#### Best Practices

1. **Always use `useWindowDimensions`** - Never hardcode device dimensions
2. **Apply responsive sizing to all hardcoded values** - Margins, padding, icon sizes, etc.
3. **Use board sizing helpers for containers** - Ensures consistent aspect ratios
4. **Use font sizing helpers for text** - Context-aware scaling
5. **Avoid percentage-based widths for small elements** - Use `getResponsiveSizeScaled` instead
6. **Test on multiple device sizes** - iPhone SE (667px), iPad Mini (820px), iPad Pro (1366px)

#### Migration from Old System

The previous 2-tier system (phone/tablet with 600px breakpoint) has been deprecated. If you encounter old code:

```typescript
// ❌ OLD (deprecated)
import { getDeviceCategory } from '@/constants/responsive';
const category = getDeviceCategory(width); // 'phone' | 'tablet'
const size = width < 1000 ? 300 : 400;

// ✅ NEW (4-tier system)
import { getDeviceSize, getResponsiveSizeScaled } from '@/constants/layout';
const deviceSize = getDeviceSize(width); // 'phone' | 'tablet-sm' | 'tablet-md' | 'tablet-lg'
const size = getResponsiveSizeScaled(300, width);
```

See `constants/responsive.ts` for complete migration guide (file kept for backward compatibility).

### Component Safety Pattern

Always use `isMountedRef` to prevent setState on unmounted components:

```typescript
const isMountedRef = useRef(true);

useEffect(() => {
  isMountedRef.current = true;
  return () => {
    isMountedRef.current = false;
  };
}, []);

// Before setState
if (!isMountedRef.current) return;
setMyState(newValue);
```

## Important Files & Their Roles

| File | Purpose |
|------|---------|
| `contexts/GameContext.tsx` | Global game state, persistence, answer checking |
| `types/game.ts` | Complete TypeScript definitions for game entities |
| `types/assets.ts` | Asset manifest type definitions |
| `data/questions/index.ts` | Central question export with `getQuestionsForState()` |
| `constants/assets.ts` | Single source of truth for all assets |
| `constants/layout.ts` | Responsive layout constants, device detection, sizing helpers |
| `constants/theme.ts` | Typography system, colors, shadows, responsive font scaling |
| `constants/responsive.ts` | ⚠️ DEPRECATED - Legacy 2-tier system (use layout.ts instead) |
| `utils/audio.ts` | Audio playback manager |
| `utils/preload-assets.ts` | Asset preloading utility |
| `utils/debounce.ts` | Debounce helper for GameContext saves |
| `app/(game)/_layout.tsx` | Game route wrapper with GameProvider |
| `app/(game)/quiz/[state].tsx` | Dynamic quiz screen (all question types) |

## Project Configuration

### Node Version Requirement

**CRITICAL:** This project requires **Node.js 20.19.4** (specified in `eas.json` for builds).

Package manager: **Yarn 1.22.22** (classic)

### Expo Configuration (`app.json`)

- **Orientation:** Landscape only
- **New Architecture:** Enabled
- **Experiments:**
  - Typed routes enabled
  - React Compiler enabled
- **Asset bundling:** Only game assets are bundled (see `assetBundlePatterns`)
- **Android:** Edge-to-edge enabled, predictive back gesture disabled
- **iOS:** Audio background mode enabled

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` → `./*`

### EAS Build Profiles

- **development:** Development client, internal distribution, APK output
- **preview:** Internal distribution, APK output, iOS simulator build
- **production:** App bundle output, auto-increment version

## Common Development Patterns

### Adding a New State

1. Create question file: `data/questions/[new-state].ts`
2. Define questions following existing patterns
3. Import and add to `data/questions/index.ts`
4. Add state to `MalaysianState` type in `types/game.ts`
5. Update map coordinates in `constants/mapLayout.ts`

### Adding Audio Files

1. Place audio file in `assets/audio/[category]/[filename].mp3`
2. Add entry to appropriate function in `utils/audio.ts`
3. Use `playMusic()`, `playSound()`, or `playAmbient()` in components

### Creating New Question Components

1. Create component in `components/game/questions/`
2. Accept props: `question`, `onAnswer`, `isAnswering`, `allowFontScaling`
3. Use `ASSETS` for images
4. Call `onAnswer(questionId, answer, question)` when user submits
5. Import in `app/(game)/quiz/[state].tsx` and add to type switch

### Debugging Game State

Game state is automatically saved to expo-secure-store with key `dbp_sejarah_game_progress`.

To reset game state during development:
```typescript
import { useGameContext } from '@/contexts/GameContext';

const { resetGame } = useGameContext();
await resetGame(); // Clears SecureStore and resets to initial state
```
