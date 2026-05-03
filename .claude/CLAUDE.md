# Explorasi Sejarah — Claude Code Studio

Educational Malaysian history game built with Expo SDK 54 + React Native 0.81.5.
DBP (Dewan Bahasa dan Pustaka) client project.

## Technology Stack

- **Framework**: Expo SDK 54 (Managed Workflow)
- **Language**: TypeScript 5.9 (strict)
- **React Native**: 0.81.5, React 19.1
- **Navigation**: expo-router 6 (file-based)
- **Architecture**: New Architecture + React Compiler enabled
- **Orientation**: Landscape-only
- **State**: React Context (GameContext) + expo-secure-store
- **Animation**: react-native-reanimated 4.1.3
- **Build**: EAS Build — project ID f0b91514-8c96-4844-95a1-185dd39c28f1
- **Package Manager**: yarn

## Project Structure

```
app/(game)/         — game screens (map, quiz, login, tutorial)
app/(tabs)/         — home + explore tabs
components/game/    — shared game UI components
components/game/questions/ — question type components (MC, TF, FB, Matching)
contexts/           — GameContext (global state)
data/questions/     — per-state question data (14 states)
constants/          — theme, layout, assets, responsive helpers
types/              — TypeScript types
utils/              — audio, preload, helpers
assets/             — images, audio files
```

## Key Domain Rules

- Questions in data/questions/ — NEVER rename question IDs
- Game mechanics: RM100 capital, -RM2 + -5% health per wrong answer
- State timers: 5 min default, 10 min for Perak/KL/Selangor/Johor
- All 14 Malaysian states have question data; 5 are fully supported
- Landscape-only — ALL layout must account for landscape orientation
- Responsive: 4-tier (phone <800px, tablet-sm 800-1000px, tablet-md 1000-1200px, tablet-lg >1200px)

## Coding Standards

- TypeScript strict — no `any`, no `@ts-ignore`
- Path alias `@/` maps to repo root
- Components: PascalCase. Hooks/utils: camelCase. Files: kebab-case
- Single quotes, 2-space indent, semicolons required
- Use `process.env.EXPO_OS` not `Platform.OS`
- Use `useWindowDimensions()` not `Dimensions.get()`
- Use CSS `boxShadow` string not legacy shadow* props
- Use `expo-symbols` not `@expo/vector-icons`
- Use `expo-image` not `<Image>` from react-native
- `borderCurve: 'continuous'` on all rounded corners
- `fontVariant: 'tabular-nums'` on all numeric displays (timer, health, money)
- All Pressable must have `accessibilityRole` and `accessibilityLabel`
- No `console.log` in production code (use `__DEV__` guard)

## Commands

- `yarn start` — Expo dev server
- `yarn lint` — ESLint
- `npx tsc --noEmit` — type check
- `eas build --profile preview` — internal APK build
- `eas build --profile production` — store build

## Collaboration Protocol

Question → Options → Decision → Draft → Approval.
Agents ask before writing to files.
No commits without instruction.

## Agent Roster (relevant)

- `@ux-designer` — UI/UX review, screen layout critique
- `@ui-programmer` — component implementation, RN styling
- `@qa-lead` — test planning, regression suites
- `@qa-tester` — manual QA, bug reporting
- `@accessibility-specialist` — a11y audit
- `@gameplay-programmer` — game loop, mechanics, question flow
- `@performance-analyst` — render perf, animation profiling
- `@economy-designer` — balance of RM/health mechanics
- `@localization-lead` — BM/English language review
- `@release-manager` — EAS build + store submission
- `@technical-director` — architecture decisions
