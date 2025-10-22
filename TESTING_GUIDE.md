# Testing Guide - DBP SEJARAH

## 🚀 Quick Start

```bash
# Start the development server
yarn start

# Then press:
# 'a' for Android
# 'i' for iOS
# 'w' for Web
```

## ✅ Test Checklist

### 1. First Launch (Tutorial Flow)
- [ ] App opens to tutorial screen
- [ ] Can swipe/navigate through 2 tutorial steps
- [ ] Tutorial text displays correctly
- [ ] "MULA" button on final step
- [ ] Navigates to state selection after tutorial
- [ ] Tutorial is not shown again on subsequent launches

### 2. State Selection Screen
- [ ] Background image loads
- [ ] Title "EKSPLORASI SEJARAH DBP" displays
- [ ] Stats show: RM100, 100% health, 0/13 states
- [ ] 13 state buttons are visible
- [ ] Can tap any state to start quiz
- [ ] "Panduan" button opens tutorial
- [ ] Completed states show checkmark (✓)

### 3. Quiz Screen - Multiple Choice
- [ ] Background loads
- [ ] StatusBar shows at top (Health, Money, State name)
- [ ] Question board displays with question text
- [ ] 4 answer buttons in 2x2 grid
- [ ] **Animation**: Buttons scale down on press (NEW!)
- [ ] Selected button highlights
- [ ] NEXT button appears after selection
- [ ] Menu button (bottom-left) works
- [ ] Can navigate to next question

### 4. Quiz Screen - True/False
- [ ] Question displays correctly
- [ ] BETUL button (green theme)
- [ ] SALAH button (red theme)
- [ ] Immediate feedback after selection
- [ ] Moves to next question automatically

### 5. Quiz Screen - Fill-in-the-Blank
- [ ] Question displays
- [ ] Text input box (ISI-TEMPAT-KOSONG) appears
- [ ] Can type answer
- [ ] OK button appears
- [ ] Validates answer (case-insensitive)
- [ ] Accepts alternative spellings

### 6. Quiz Screen - Matching (9-grid)
- [ ] Title text displays
- [ ] Question shows
- [ ] 9 option boxes in 3x3 grid
- [ ] Can tap multiple options
- [ ] Selected options show checkmark
- [ ] NEXT button appears after selection
- [ ] Validates all correct options selected

### 7. Quiz Screen - Crossword
- [ ] Two clue boards display (MENDATAR + MENEGAK)
- [ ] Clues are readable
- [ ] Grid placeholder shows
- [ ] (Interactive grid is future enhancement)

### 8. Success Modal
- [ ] Modal appears after completing all questions
- [ ] **Animation**: Star rotates continuously (NEW!)
- [ ] **Animation**: Flare grows and glows (NEW!)
- [ ] **Animation**: Content fades in + slides up (NEW!)
- [ ] "TAHNIAH!" title displays
- [ ] Success message shows
- [ ] TERUSKAN button → returns to map
- [ ] ULANG SEMULA button → restarts state
- [ ] **Haptic**: Success vibration on appear (NEW!)

### 9. Menu Button
- [ ] Menu button always visible (bottom-left)
- [ ] Tapping opens pause overlay
- [ ] Overlay has dark background
- [ ] "Teruskan" resumes game
- [ ] "Ulang Semula" restarts level
- [ ] "Keluar ke Peta" returns to map

### 10. Game Mechanics
- [ ] Wrong answer: -RM2 from money
- [ ] Wrong answer: -5% from health
- [ ] Correct answer: No penalty
- [ ] Money never goes below RM0
- [ ] Health never goes below 0%
- [ ] Completed states tracked
- [ ] Progress persists across app restarts

### 11. Responsive Design
#### Phone (< 600dp width)
- [ ] All text readable
- [ ] Buttons large enough to tap
- [ ] No content overflow
- [ ] StatusBar fits properly

#### Tablet (≥ 600dp width)
- [ ] Larger font sizes applied
- [ ] Buttons scale appropriately
- [ ] Layout uses more space
- [ ] Everything centered nicely

### 12. Haptic Feedback
- [ ] Button press: Light tap
- [ ] Correct answer: Success vibration
- [ ] Wrong answer: Notification vibration
- [ ] Success modal: Success vibration

### 13. Animations (NEW!)
- [ ] Success modal star rotates
- [ ] Success modal flare pulses
- [ ] Content slides up smoothly
- [ ] Button press animations work
- [ ] No janky animations
- [ ] Smooth 60fps performance

### 14. Persistence
- [ ] Close app completely
- [ ] Reopen app
- [ ] Money value preserved
- [ ] Health value preserved
- [ ] Completed states preserved
- [ ] Tutorial not shown again
- [ ] Last state remembered

## 🐛 Common Issues & Fixes

### Issue: App crashes on start
**Fix**: Clear metro cache
```bash
npx expo start --clear
```

### Issue: Images not loading
**Fix**: Restart dev server
```bash
# Stop server (Ctrl+C)
yarn start
```

### Issue: TypeScript errors
**Fix**: Check compilation
```bash
npx tsc --noEmit
```

### Issue: Animations not smooth
**Fix**: Test on device (not simulator)
```bash
# iOS
yarn ios

# Android
yarn android
```

### Issue: Navigation error on first launch
**Fix**: Already fixed! Using `<Redirect>` component

## 📊 Performance Benchmarks

### Expected Performance:
- **App Launch**: < 2 seconds
- **Screen Transitions**: < 300ms
- **Button Feedback**: Instant (< 100ms)
- **Animation FPS**: 60fps steady
- **Memory Usage**: < 150MB

### Tools to Monitor:
```bash
# React DevTools
npx react-devtools

# Performance monitor
npx expo start
# Then press 'shift + m' for more tools
```

## 🎯 Acceptance Criteria

### Must Pass:
- ✅ Tutorial shows on first launch only
- ✅ All 5 question types work
- ✅ Answers are validated correctly
- ✅ Game state persists
- ✅ Animations run smoothly
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Works on phone & tablet

### Nice to Have:
- 🎨 Smooth 60fps animations
- 📱 Responsive on all screens
- 🎮 Satisfying haptic feedback
- ✨ Polished UI transitions

## 🔍 Manual Test Cases

### Test Case 1: Complete Game Flow
1. Launch app (should show tutorial)
2. Complete tutorial
3. Select PERLIS
4. Answer all questions
5. See success modal
6. Return to map
7. Verify PERLIS marked complete

**Expected**: ✓ PERLIS, updated money/health, smooth flow

### Test Case 2: Wrong Answers
1. Select any state
2. Choose wrong answer
3. Observe money decrease by RM2
4. Observe health decrease by 5%
5. Continue to next question

**Expected**: Penalties applied correctly

### Test Case 3: App Persistence
1. Answer some questions
2. Note current money/health
3. Close app completely
4. Reopen app
5. Check money/health values

**Expected**: Values match before closing

### Test Case 4: Animations
1. Complete a state
2. Watch success modal
3. Verify star rotates
4. Verify flare glows
5. Verify smooth content appearance

**Expected**: Buttery smooth 60fps

## 📱 Device Testing Matrix

| Device Type | Size | Tested | Notes |
|------------|------|--------|-------|
| iPhone SE  | Small | ⏳ | Smallest screen test |
| iPhone 14  | Medium | ⏳ | Standard phone |
| iPhone 14 Pro Max | Large | ⏳ | Large phone |
| iPad Mini | Tablet | ⏳ | Small tablet (600dp) |
| iPad Pro | Tablet | ⏳ | Large tablet |
| Android Phone | Various | ⏳ | Multiple sizes |
| Android Tablet | 10" | ⏳ | Tablet breakpoint |

## ✅ Final Checklist

Before marking complete:
- [ ] All test cases pass
- [ ] No console warnings
- [ ] No TypeScript errors
- [ ] Animations smooth on device
- [ ] Haptics work on device
- [ ] Tested on both iOS and Android
- [ ] Tested phone and tablet sizes
- [ ] All Figma screens implemented
- [ ] Code is clean and documented
- [ ] README.md updated
- [ ] Ready for production deploy

## 🎉 Success Criteria

**The app is ready when:**
1. ✅ A new user can complete full tutorial → quiz → success flow
2. ✅ Animations feel polished and smooth
3. ✅ No crashes or errors
4. ✅ Game state persists correctly
5. ✅ All question types work
6. ✅ Responsive on all screens
7. ✅ Haptic feedback enhances experience
8. ✅ Developers can easily add new states/questions

---

**Happy Testing! 🎮**

If you find any issues, they're likely easy fixes given the solid foundation.
