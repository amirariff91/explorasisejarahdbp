/**
 * Audio Utility
 * Manages game sound effects, voice feedback, background music, and ambient sounds
 * Uses expo-audio for cross-platform audio playback
 * Migrated from expo-av (deprecated in SDK 54)
 */

import type { AudioPlayer, AudioSource } from 'expo-audio';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Sound type definitions (SFX only - no voiceovers)
export type UISound = 'click' | 'star' | 'transition' | 'logo-reveal' | 'title-drop';

export type MusicSound = 'bgm-title' | 'bgm-map' | 'bgm-quiz' | 'bgm-success' | 'bgm-tutorial';

export type AmbientSound = 'ambient-map' | 'ambient-quiz-soft' | 'ambient-celebration';

type SoundType = UISound;

// Sound asset map (SFX only)
const SOUNDS: Record<SoundType, AudioSource> = {
  // UI sounds (SFX)
  'click': require('@/assets/audio/ui/click.mp3'),
  'star': require('@/assets/audio/ui/star.mp3'),
  'transition': require('@/assets/audio/ui/transition.mp3'),
  'logo-reveal': require('@/assets/audio/ui/logo-reveal.mp3'),
  'title-drop': require('@/assets/audio/ui/title-drop.mp3'),
};

// Background music asset map
const MUSIC: Record<MusicSound, AudioSource> = {
  'bgm-title': require('@/assets/audio/music/bgm-title.mp3'),
  'bgm-map': require('@/assets/audio/music/bgm-map.mp3'),
  'bgm-quiz': require('@/assets/audio/music/bgm-quiz.mp3'),
  'bgm-success': require('@/assets/audio/music/bgm-success.mp3'),
  'bgm-tutorial': require('@/assets/audio/music/bgm-tutorial.mp3'),
};

// Ambient sound asset map
const AMBIENT: Record<AmbientSound, AudioSource> = {
  'ambient-map': require('@/assets/audio/ambient/ambient-map.mp3'),
  'ambient-quiz-soft': require('@/assets/audio/ambient/ambient-quiz-soft.mp3'),
  'ambient-celebration': require('@/assets/audio/ambient/ambient-celebration.mp3'),
};

// Sound instance caches
const soundCache: Map<SoundType, AudioPlayer> = new Map();
const musicCache: Map<MusicSound, AudioPlayer> = new Map();
const ambientCache: Map<AmbientSound, AudioPlayer> = new Map();

// Current playing music track
let currentMusic: AudioPlayer | null = null;
let currentMusicName: MusicSound | null = null;

// Debug mode (enabled in development only)
const DEBUG_AUDIO = __DEV__;

/**
 * Initialize audio mode for the app
 * Call this once during app startup
 */
export async function initializeAudio() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true, // Play even when device is on silent (iOS & Android)
    });
    
    if (DEBUG_AUDIO) {
      console.log('[Audio] ✅ Audio system initialized successfully');
    }
  } catch (error) {
    if (DEBUG_AUDIO) {
      console.error('[Audio] ❌ Failed to initialize audio:', error);
    }
    // Fail silently - audio initialization errors should not crash the app
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

    if (DEBUG_AUDIO) {
      console.log(`[Audio] 🔊 Playing sound: ${soundName} (volume: ${volume})`);
    }

    // Check cache first
    let player = soundCache.get(soundName);

    if (!player) {
      // Load sound for the first time
      player = createAudioPlayer(SOUNDS[soundName]);
      soundCache.set(soundName, player);
      
      if (DEBUG_AUDIO) {
        console.log(`[Audio] 📥 Loaded and cached: ${soundName}`);
      }
    }

    // Set playback options
    player.volume = volume;
    player.loop = shouldLoop;

    // Reset to beginning and play
    player.seekTo(0);
    player.play();
  } catch (error) {
    if (DEBUG_AUDIO) {
      console.error(`[Audio] ❌ Failed to play ${soundName}:`, error);
    }
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
    // Fail silently
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
    // Fail silently
  }
}

/**
 * Play feedback sound based on correctness
 * Helper function for quiz questions
 * Uses randomized instrumental feedback
 */
export async function playFeedback(isCorrect: boolean, isPerfect?: boolean): Promise<void> {
  // Use randomized feedback for variety
  await playRandomFeedback(isCorrect, false);
}

/**
 * Play celebration sound
 * For success modals and achievements
 */
export async function playCelebration(): Promise<void> {
  // Play celebration SFX only (no voiceover)
  await playSound('star', { volume: 0.8 });
}

/**
 * Play randomized feedback for variety
 * Prevents repetitive audio experience
 */
export async function playRandomFeedback(isCorrect: boolean, includeEncouragement = false): Promise<void> {
  try {
    // Use simple SFX-only feedback with no voice layers.
    if (isCorrect) {
      await playSound('star', { volume: 0.8 });
    } else {
      await playSound('transition', { volume: 0.7 });
    }
  } catch (error) {
    // Fail silently
  }
}

/**
 * Play background music with optional fade-in
 * @param musicName - Name of the music track
 * @param loop - Whether to loop the music (default: true)
 * @param fadeInDuration - Fade-in duration in ms (0 = no fade)
 */
export async function playMusic(
  musicName: MusicSound,
  loop = true,
  fadeInDuration = 0
): Promise<void> {
  try {
    if (DEBUG_AUDIO) {
      console.log(`[Audio] 🎵 Playing music: ${musicName} (loop: ${loop}, fade: ${fadeInDuration}ms)`);
    }

    // Stop current music if different track
    if (currentMusic && currentMusicName !== musicName) {
      if (DEBUG_AUDIO) {
        console.log(`[Audio] 🔄 Switching from ${currentMusicName} to ${musicName}`);
      }
      await stopMusic(1000); // Fade out current music
    }

    // Check if this music is already playing
    if (currentMusicName === musicName && currentMusic) {
      if (DEBUG_AUDIO) {
        console.log(`[Audio] ⏭️  ${musicName} already playing, skipping`);
      }
      return; // Already playing
    }

    // Get or create music player
    let player = musicCache.get(musicName);
    if (!player) {
      player = createAudioPlayer(MUSIC[musicName]);
      musicCache.set(musicName, player);
      
      if (DEBUG_AUDIO) {
        console.log(`[Audio] 📥 Loaded and cached music: ${musicName}`);
      }
    }

    // Configure playback
    player.loop = loop;
    
    // Handle fade-in
    if (fadeInDuration > 0) {
      player.volume = 0;
      player.play();
      
      // Gradual volume increase
      const steps = 20;
      const stepDuration = fadeInDuration / steps;
      const volumeIncrement = 1.0 / steps;
      
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        player.volume = Math.min(1.0, (i + 1) * volumeIncrement);
      }
      
      if (DEBUG_AUDIO) {
        console.log(`[Audio] 📈 Fade-in complete for ${musicName}`);
      }
    } else {
      player.volume = 1.0;
      player.play();
    }

    currentMusic = player;
    currentMusicName = musicName;
  } catch (error) {
    if (DEBUG_AUDIO) {
      console.error(`[Audio] ❌ Failed to play music ${musicName}:`, error);
    }
    // Fail silently
  }
}

/**
 * Stop currently playing music with optional fade-out
 * @param fadeOutDuration - Fade-out duration in ms (0 = immediate stop)
 */
export async function stopMusic(fadeOutDuration = 0): Promise<void> {
  try {
    if (!currentMusic) return;

    if (DEBUG_AUDIO) {
      console.log(`[Audio] 🛑 Stopping music: ${currentMusicName} (fade: ${fadeOutDuration}ms)`);
    }

    if (fadeOutDuration > 0) {
      // Gradual volume decrease
      const steps = 20;
      const stepDuration = fadeOutDuration / steps;
      const currentVolume = currentMusic.volume;
      const volumeDecrement = currentVolume / steps;
      
      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        if (currentMusic) {
          currentMusic.volume = Math.max(0, currentVolume - (i + 1) * volumeDecrement);
        }
      }
      
      if (DEBUG_AUDIO) {
        console.log(`[Audio] 📉 Fade-out complete`);
      }
    }

    if (currentMusic) {
      currentMusic.pause();
      currentMusic.seekTo(0);
    }

    currentMusic = null;
    currentMusicName = null;
  } catch (error) {
    if (DEBUG_AUDIO) {
      console.error(`[Audio] ❌ Failed to stop music:`, error);
    }
    // Fail silently
  }
}

/**
 * Play ambient sound layer
 * @param ambientName - Name of the ambient sound
 * @param volume - Volume level (0.0 to 1.0, default: 0.3)
 */
export async function playAmbient(ambientName: AmbientSound, volume = 0.3): Promise<void> {
  try {
    let player = ambientCache.get(ambientName);
    if (!player) {
      player = createAudioPlayer(AMBIENT[ambientName]);
      ambientCache.set(ambientName, player);
    }

    player.volume = volume;
    player.loop = true; // Ambient sounds should loop
    player.seekTo(0);
    player.play();
  } catch (error) {
    // Fail silently
  }
}

/**
 * Stop specific ambient sound
 */
export async function stopAmbient(ambientName: AmbientSound): Promise<void> {
  try {
    const player = ambientCache.get(ambientName);
    if (player) {
      player.pause();
      player.seekTo(0);
    }
  } catch (error) {
    // Fail silently
  }
}

/**
 * Stop all ambient sounds
 */
export async function stopAllAmbient(): Promise<void> {
  try {
    Array.from(ambientCache.values()).forEach((player) => {
      player.pause();
      player.seekTo(0);
    });
  } catch (error) {
    // Fail silently
  }
}

/**
 * Unload all cached audio (sounds, music, ambient, state voices)
 * Call during cleanup or app background
 */
export async function unloadAllAudio(): Promise<void> {
  try {
    // Stop and clear all audio
    await stopMusic();
    await stopAllAmbient();
    await stopAllSounds();

    // Remove all cached players
    Array.from(soundCache.values()).forEach(player => player.remove());
    Array.from(musicCache.values()).forEach(player => player.remove());
    Array.from(ambientCache.values()).forEach(player => player.remove());

    // Clear caches
    soundCache.clear();
    musicCache.clear();
    ambientCache.clear();

    currentMusic = null;
    currentMusicName = null;
  } catch (error) {
    // Fail silently
  }
}
