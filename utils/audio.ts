/**
 * Audio Utility
 * Manages game sound effects and voice feedback
 * Uses expo-audio for cross-platform audio playback
 * Migrated from expo-av (deprecated in SDK 54)
 */

import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer, AudioSource } from 'expo-audio';

// Sound type definitions
export type FeedbackSound = 'betul' | 'tidak-tepat' | 'hebat' | 'tahniah' | 'bagus' | 'cuba-lagi';
export type UISound = 'click' | 'star' | 'transition';
export type TutorialSound = 'selamat-datang';

type SoundType = FeedbackSound | UISound | TutorialSound;

// Sound asset map
const SOUNDS: Record<SoundType, AudioSource> = {
  // Feedback sounds (voice)
  'betul': require('@/assets/audio/feedback/betul.mp3'),
  'tidak-tepat': require('@/assets/audio/feedback/tidak-tepat.mp3'),
  'hebat': require('@/assets/audio/feedback/hebat.mp3'),
  'tahniah': require('@/assets/audio/feedback/tahniah.mp3'),
  'bagus': require('@/assets/audio/feedback/bagus.mp3'),
  'cuba-lagi': require('@/assets/audio/feedback/cuba-lagi.mp3'),

  // UI sounds (SFX)
  'click': require('@/assets/audio/ui/click.mp3'),
  'star': require('@/assets/audio/ui/star.mp3'),
  'transition': require('@/assets/audio/ui/transition.mp3'),

  // Tutorial sounds (voice)
  'selamat-datang': require('@/assets/audio/tutorial/selamat-datang.mp3'),
};

// Sound instance cache to prevent re-loading
const soundCache: Map<SoundType, AudioPlayer> = new Map();

/**
 * Initialize audio mode for the app
 * Call this once during app startup
 */
export async function initializeAudio() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true, // Play even when device is on silent
    });
  } catch (error) {
    console.warn('Failed to initialize audio:', error);
  }
}

/**
 * Play a sound effect or voice feedback
 * @param soundName - Name of the sound to play
 * @param options - Playback options (volume, loop, etc.)
 */
export async function playSound(
  soundName: SoundType,
  options?: {
    volume?: number; // 0.0 to 1.0 (default: 1.0)
    shouldLoop?: boolean; // Default: false
  }
): Promise<void> {
  try {
    const { volume = 1.0, shouldLoop = false } = options || {};

    // Check cache first
    let player = soundCache.get(soundName);

    if (!player) {
      // Load sound for the first time
      player = createAudioPlayer(SOUNDS[soundName]);
      soundCache.set(soundName, player);
    }

    // Set playback options
    player.volume = volume;
    player.loop = shouldLoop;

    // Reset to beginning and play
    player.seekTo(0);
    player.play();
  } catch (error) {
    console.warn(`Failed to play sound "${soundName}":`, error);
    // Fail silently - don't crash the app if audio doesn't work
  }
}

/**
 * Stop all currently playing sounds
 */
export async function stopAllSounds(): Promise<void> {
  try {
    Array.from(soundCache.values()).forEach((player) => {
      player.pause();
    });
  } catch (error) {
    console.warn('Failed to stop sounds:', error);
  }
}

/**
 * Unload all cached sounds to free memory
 * Call this during cleanup or when switching major app sections
 */
export async function unloadAllSounds(): Promise<void> {
  try {
    Array.from(soundCache.values()).forEach((player) => {
      player.remove();
    });
    soundCache.clear();
  } catch (error) {
    console.warn('Failed to unload sounds:', error);
  }
}

/**
 * Play feedback sound based on correctness
 * Helper function for quiz questions
 */
export async function playFeedback(isCorrect: boolean, isPerfect?: boolean): Promise<void> {
  if (isPerfect) {
    await playSound('hebat'); // "Hebat!" for perfect scores
  } else if (isCorrect) {
    await playSound('betul'); // "Betul!" for correct answers
  } else {
    await playSound('tidak-tepat'); // "Tidak tepat" for wrong answers
  }
}

/**
 * Play celebration sound
 * For success modals and achievements
 */
export async function playCelebration(): Promise<void> {
  // Play both voice and SFX for maximum celebration!
  await Promise.all([
    playSound('tahniah'), // "Tahniah!"
    playSound('star', { volume: 0.7 }), // Star SFX (slightly quieter)
  ]);
}
