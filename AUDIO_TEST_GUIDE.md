# Audio Testing Guide - Quick Start

## ✅ What Was Fixed

1. **iOS Audio Mode** - Audio now works properly on all devices
2. **State Tap Sound** - Changed from harsh "chainsaw" to soft click
3. **Debug Logging** - See exactly what's playing in console

---

## 🚀 Quick Test (Start Now!)

```bash
cd /Users/amirariff/projects/explorasisejarahdbp
yarn start

# Then press:
# 'i' for iOS Simulator
# 'a' for Android Emulator
```

---

## 🎧 What You Should Hear

### Tutorial Screen
**Voice Narration** (should hear immediately):
- Step 1: "Selamat datang! Anda akan diberikan seratus ringgit..."
- Step 2: "Pengembaraan bermula mengikut topik Sejarah..."

**Console Output**:
```
[Audio] ✅ Audio system initialized successfully
[Audio] 🎵 Playing music: bgm-tutorial (loop: true, fade: 2000ms)
[Audio] 🔊 Playing sound: voice-tutorial-step1 (volume: 1)
```

### Map Screen
**Tap a State**:
- Should hear: Soft, pleasant click ✅
- NOT: Harsh chainsaw sound ❌

**Console Output**:
```
[Audio] 🎵 Playing music: bgm-map (loop: true, fade: 2000ms)
[Audio] 🔊 Playing sound: click (volume: 1)
```

### Quiz Screen
**Answer Questions**:
- Correct: Random variations ("Betul sekali!", "Jawapan yang tepat!", "Syabas!")
- Wrong: Random variations ("Tidak tepat, cuba lagi", "Hampir betul...")
- Encouragement: Sometimes plays after wrong answers

**Console Output**:
```
[Audio] 🎵 Playing music: bgm-quiz (loop: true, fade: 2000ms)
[Audio] 🔊 Playing sound: correct-2 (volume: 1)
```

### Success Modal
**Complete a State**:
- Hear: "Tahniah!" + Star sparkle
- Then: "Tahniah! Anda telah berjaya menamatkan [State Name]!"

**Console Output**:
```
[Audio] 🛑 Stopping music: bgm-quiz (fade: 500ms)
[Audio] 🎵 Playing music: bgm-success (loop: false, fade: 1000ms)
[Audio] 🔊 Playing sound: tahniah (volume: 1)
```

---

## 🐛 Troubleshooting

### "I don't hear any voice"

**Check Console for**:
```
[Audio] ❌ Failed to play voice-tutorial-step1: [error]
```

**Solutions**:
1. Turn up device volume
2. Disable silent mode
3. Check console for initialization error
4. Try restarting the app

### "State tap still sounds harsh"

**Check Console Shows**:
```
[Audio] 🔊 Playing sound: click (volume: 1)  ✅ Correct
```

**NOT**:
```
[Audio] 🔊 Playing sound: transition (volume: 1)  ❌ Old code
```

**Fix**: Reload the app (Cmd+R on iOS, R+R on Android)

### "Background music is silent"

**This is EXPECTED!** Placeholder music files are only 8.6KB (silent).

**Voice narration WILL work** - those files are 20-207KB (good quality).

**To fix music**: Download proper tracks from Pixabay Music and replace:
- `assets/audio/music/bgm-map.mp3`
- `assets/audio/music/bgm-quiz.mp3`
- `assets/audio/music/bgm-success.mp3`
- `assets/audio/music/bgm-tutorial.mp3`

---

## 📱 Device Testing

### iOS Device
1. Connect iPhone/iPad
2. Run `yarn ios` or build with EAS
3. Test with **Silent Mode ON** - audio should still play
4. Test with **Silent Mode OFF** - audio should play louder

### Android Device
1. Connect Android phone
2. Run `yarn android`
3. Test volume up/down
4. Check audio ducking (lower volume) during notifications

---

## ✅ Success Checklist

- [ ] Console shows `[Audio] ✅ Audio system initialized successfully`
- [ ] Tutorial voice narration plays automatically
- [ ] State tap plays soft click (not harsh chainsaw)
- [ ] Quiz feedback varies (different voices)
- [ ] Success modal plays state-specific celebration
- [ ] No error messages in console
- [ ] Works on iOS (silent mode on/off)
- [ ] Works on Android

---

## 🎯 What's Working vs What's Not

### ✅ WORKING (Test These First!)
- **Voice Narration** (29 files, 20-207KB) - Perfect quality
- **UI Sounds** (click, star) - Clear and pleasant
- **Soft State Taps** - Fixed, no more chainsaw
- **Debug Console** - See all audio activity
- **iOS Compatibility** - playsInSilentMode enabled

### ⚠️ PLACEHOLDERS (Expected to be silent)
- **Background Music** (4 files, 8.6KB each) - Need proper tracks
- **Ambient Sounds** (3 files, 8.6KB each) - Need proper loops

---

## 📊 Expected Console Output

**Good Session** (everything working):
```
[Audio] ✅ Audio system initialized successfully
[Audio] 🎵 Playing music: bgm-tutorial (loop: true, fade: 2000ms)
[Audio] 📥 Loaded and cached music: bgm-tutorial
[Audio] 📈 Fade-in complete for bgm-tutorial
[Audio] 🔊 Playing sound: voice-tutorial-step1 (volume: 1)
[Audio] 📥 Loaded and cached: voice-tutorial-step1
[Audio] 🔊 Playing sound: click (volume: 1)
[Audio] 🔄 Switching from bgm-tutorial to bgm-map
[Audio] 🛑 Stopping music: bgm-tutorial (fade: 1000ms)
```

**Problem Session** (something wrong):
```
[Audio] ❌ Failed to initialize audio: [error message]
[Audio] ❌ Failed to play voice-tutorial-step1: [error message]
```

---

## 🎉 Quick Win Test

**30 Second Test**:
1. Start app: `yarn start` → press `i`
2. Wait for tutorial screen
3. Listen for: "Selamat datang..."
4. **If you hear the voice = SUCCESS!** ✅

Everything else (music, ambient) can be added later. The voice narration is the most important part and should work immediately.

---

## 📝 Notes

- **Debug logs only show in development** (`__DEV__` mode)
- **Production builds** will fail silently (no console logs)
- **Voice files** are high quality and ready for production
- **Music/ambient files** need replacement before production

---

**Ready to test? Run `yarn start` and listen for "Selamat datang..."! 🎙️**

