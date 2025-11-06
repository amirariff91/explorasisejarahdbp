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

### Responsive Design

Uses `useWindowDimensions` hook with 600dp breakpoint:

```typescript
import { useWindowDimensions } from 'react-native';

const { width } = useWindowDimensions();
const isTablet = width >= 600;
```

Components should scale UI elements based on `isTablet` boolean.

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
| `constants/layout.ts` | Responsive layout constants |
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
