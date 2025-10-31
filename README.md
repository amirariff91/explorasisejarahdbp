# DBP SEJARAH - Malaysian History Educational Game

An interactive educational game built with Expo 54, React Native, and TypeScript to teach Malaysian history through gameplay.

## 🎮 Features

- **5 Malaysian States**: Perlis, Kedah, Negeri Sembilan, Pahang, Johor
- **5 Question Types**:
  - Multiple Choice (4 options)
  - True/False
  - Fill in the Blank
  - Matching (9-grid)
  - Crossword Puzzles
- **Game Mechanics**:
  - Start with RM100 travel money
  - Lose RM2 for wrong answers
  - Health meter tracking
  - State progression system
- **Responsive Design**: Works on phones and tablets (600dp breakpoint)
- **Persistent Progress**: Game state saved locally with expo-secure-store
- **Haptic Feedback**: Enhanced UX with tactile responses

## 🏗️ Project Structure

```
app/
  (game)/              # Route group for game screens
    index.tsx          # State selection map
    tutorial.tsx       # Game tutorial
    quiz/[state].tsx   # Dynamic quiz screen
    crossword/[state].tsx

components/game/
  StatusBar.tsx        # Health, Money, State display
  MenuButton.tsx       # Pause overlay
  SuccessModal.tsx     # Victory celebration
  questions/           # 5 question type components
    MultipleChoiceQuestion.tsx
    TrueFalseQuestion.tsx
    FillBlankQuestion.tsx
    MatchingQuestion.tsx
    CrosswordQuestion.tsx

contexts/
  GameContext.tsx      # Global game state management

data/questions/        # Question data for each state
  perlis.ts
  kedah.ts
  negeri-sembilan.ts
  pahang.ts
  johor.ts

types/
  game.ts             # TypeScript interfaces

assets/images/game/    # Figma assets
  backgrounds/         # 3 background images
  buttons/             # 7 button images
  ui-elements/         # 8 UI element images
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19.4+
- Yarn 4.10.2+
- Expo CLI

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

## 📱 Screens & Flow

1. **Tutorial** (First time only)
   - Explains game rules
   - Money system introduction

2. **State Selection Map**
   - Choose Malaysian state to explore
   - View progress (completed states)
   - Check money and health status

3. **Quiz Screen**
   - Dynamic questions based on selected state
   - Multiple question types
   - Real-time score updates
   - Menu for pause/restart

4. **Success Modal**
   - Celebration when state is completed
   - Option to continue or replay

## 🎨 Design

Based on Figma design: [DBP SEJARAH](https://www.figma.com/design/65nT29eLZRN0u9Mjb66CKZ/DBP-SEJARAH)

### Key UI Elements
- Background images for immersion
- Custom button graphics
- Question boards matching Figma design
- State indicator banners
- Health and money bars

## 🔧 Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript 5.9
- **Navigation**: expo-router 6 (file-based)
- **State**: React Context + Hooks
- **Storage**: expo-secure-store
- **Images**: expo-image
- **Haptics**: expo-haptics
- **Animations**: react-native-reanimated 4

## 📐 Responsive Design

Uses `useWindowDimensions` hook for adaptive layouts:
- **Phone**: < 600dp width
- **Tablet**: ≥ 600dp width

All components scale appropriately for different screen sizes.

## 🎯 Game Rules

- Start with RM100 and 100% health
- Each wrong answer: -RM2, -5% health
- Complete all questions in a state to unlock next
- Collect all 13 states to finish the game

## 🔮 Future Enhancements

- [ ] Add remaining 8 Malaysian states
- [ ] Interactive crossword grid implementation
- [ ] Sound effects for correct/wrong answers
- [ ] Leaderboard system
- [ ] Multiplayer mode
- [ ] More question types (drag-and-drop, timeline)
- [ ] Animated transitions with Reanimated v4
- [ ] Achievement badges
- [ ] Daily challenges

## 📝 Adding New Questions

To add questions for a new state:

1. Create file: `data/questions/[state].ts`
2. Export questions array following the type definitions
3. Import in `data/questions/index.ts`
4. Add mapping in `getQuestionsForState` function

Example:
```typescript
export const selangorQuestions: Question[] = [
  {
    id: 'selangor_1',
    state: 'selangor',
    type: 'multipleChoice',
    question: 'What is the capital of Selangor?',
    options: ['KL', 'Shah Alam', 'Putrajaya', 'Petaling Jaya'],
    correctAnswer: 'Shah Alam',
  },
];
```

## 🖼️ Asset Management System

The project uses a modular asset system for scalability across multiple mini-games.

### Asset Structure
```
/assets/images/
├── shared/          # Cross-game reusable assets
│   ├── backgrounds/ # Jungle theme, boards
│   ├── buttons/     # Menu, next, OK buttons
│   ├── ui/          # Health/money bars, effects
│   └── icons/       # Settings, audio, navigation
├── games/
│   └── dbp-sejarah/ # Game-specific assets
│       └── ...      # Crossword, answer buttons
└── branding/
    └── ...          # Logo, splash screens
```

### Using Assets in Components
```typescript
import { ASSETS } from '@/constants/assets';

// Shared assets (used across all games)
<Image source={ASSETS.shared.ui.healthBar} />
<Image source={ASSETS.shared.buttons.menu.default} />

// Game-specific assets
<Image source={ASSETS.games.dbpSejarah.soalanBoard} />

// Branding assets
<Image source={ASSETS.branding.logoDbp} />
```

### Button State Management
```typescript
import { ASSETS, getButtonState } from '@/constants/assets';

<Pressable>
  {({ pressed, disabled }) => (
    <Image source={getButtonState(ASSETS.shared.buttons.next, pressed, disabled)} />
  )}
</Pressable>
```

### Adding New Assets
1. Place files in appropriate category folder
2. Add to `/constants/assets.ts` manifest
3. Use TypeScript autocomplete to access: `ASSETS.category.subcategory.assetName`

### Documentation
- **Asset Plan**: See `docs/ASSET_PLAN.md` for full specification
- **Export Guide**: See `docs/ASSET_EXPORT_CHECKLIST.md` for designers
- **Migration**: See `docs/ASSET_MIGRATION_GUIDE.md` for developers

## 📄 License

Educational use only - DBP SEJARAH

## 👥 Credits

- Design: Figma - DBP SEJARAH
- Development: Built with Expo 54
- Content: Malaysian history curriculum
