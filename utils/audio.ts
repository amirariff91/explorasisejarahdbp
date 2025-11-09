/**
 * Audio Utility
 * Manages game sound effects, voice feedback, background music, and ambient sounds
 * Uses expo-audio for cross-platform audio playback
 * Migrated from expo-av (deprecated in SDK 54)
 */

import type { MalaysianState } from '@/types';
import type { AudioPlayer, AudioSource } from 'expo-audio';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Sound type definitions
export type FeedbackSound = 
  | 'betul' | 'tidak-tepat' | 'hebat' | 'tahniah' | 'bagus' | 'cuba-lagi'
  | 'correct-1' | 'correct-2' | 'correct-3'
  | 'wrong-1' | 'wrong-2'
  | 'encourage-1' | 'encourage-2' | 'encourage-3';

export type UISound = 'click' | 'star' | 'transition' | 'logo-reveal' | 'title-drop';

export type VoiceNarration = 
  | 'selamat-datang'
  | 'voice-tutorial-step1' | 'voice-tutorial-step2'
  | 'voice-welcome' | 'voice-select-state' | 'voice-good-luck' 
  | 'voice-try-again' | 'voice-perfect-score';

export type MusicSound = 'bgm-title' | 'bgm-map' | 'bgm-quiz' | 'bgm-success' | 'bgm-tutorial';

export type AmbientSound = 'ambient-map' | 'ambient-quiz-soft' | 'ambient-celebration';

type SoundType = FeedbackSound | UISound | VoiceNarration;

// Sound asset map
const SOUNDS: Record<SoundType, AudioSource> = {
  // Original feedback sounds (voice)
  'betul': require('@/assets/audio/feedback/betul.mp3'),
  'tidak-tepat': require('@/assets/audio/feedback/tidak-tepat.mp3'),
  'hebat': require('@/assets/audio/feedback/hebat.mp3'),
  'tahniah': require('@/assets/audio/feedback/tahniah.mp3'),
  'bagus': require('@/assets/audio/feedback/bagus.mp3'),
  'cuba-lagi': require('@/assets/audio/feedback/cuba-lagi.mp3'),

  // New feedback variations
  'correct-1': require('@/assets/audio/feedback/correct-1.mp3'),
  'correct-2': require('@/assets/audio/feedback/correct-2.mp3'),
  'correct-3': require('@/assets/audio/feedback/correct-3.mp3'),
  'wrong-1': require('@/assets/audio/feedback/wrong-1.mp3'),
  'wrong-2': require('@/assets/audio/feedback/wrong-2.mp3'),
  'encourage-1': require('@/assets/audio/feedback/encourage-1.mp3'),
  'encourage-2': require('@/assets/audio/feedback/encourage-2.mp3'),
  'encourage-3': require('@/assets/audio/feedback/encourage-3.mp3'),

  // UI sounds (SFX)
  'click': require('@/assets/audio/ui/click.mp3'),
  'star': require('@/assets/audio/ui/star.mp3'),
  'transition': require('@/assets/audio/ui/transition.mp3'),
  'logo-reveal': require('@/assets/audio/ui/logo-reveal.mp3'),
  'title-drop': require('@/assets/audio/ui/title-drop.mp3'),

  // Voice narration
  'selamat-datang': require('@/assets/audio/tutorial/selamat-datang.mp3'),
  'voice-tutorial-step1': require('@/assets/audio/tutorial/voice-tutorial-step1.mp3'),
  'voice-tutorial-step2': require('@/assets/audio/tutorial/voice-tutorial-step2.mp3'),
  'voice-welcome': require('@/assets/audio/tutorial/voice-welcome.mp3'),
  'voice-select-state': require('@/assets/audio/tutorial/voice-select-state.mp3'),
  'voice-good-luck': require('@/assets/audio/tutorial/voice-good-luck.mp3'),
  'voice-try-again': require('@/assets/audio/tutorial/voice-try-again.mp3'),
  'voice-perfect-score': require('@/assets/audio/tutorial/voice-perfect-score.mp3'),
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

// State completion voice map
const STATE_VOICES: Record<MalaysianState, AudioSource> = {
  'perlis': require('@/assets/audio/states/complete-perlis.mp3'),
  'kedah': require('@/assets/audio/states/complete-kedah.mp3'),
  'pulau-pinang': require('@/assets/audio/states/complete-pulau-pinang.mp3'),
  'perak': require('@/assets/audio/states/complete-perak.mp3'),
  'selangor': require('@/assets/audio/states/complete-selangor.mp3'),
  'kuala-lumpur': require('@/assets/audio/states/complete-kuala-lumpur.mp3'),
  'negeri-sembilan': require('@/assets/audio/states/complete-negeri-sembilan.mp3'),
  'melaka': require('@/assets/audio/states/complete-melaka.mp3'),
  'johor': require('@/assets/audio/states/complete-johor.mp3'),
  'pahang': require('@/assets/audio/states/complete-pahang.mp3'),
  'terengganu': require('@/assets/audio/states/complete-terengganu.mp3'),
  'kelantan': require('@/assets/audio/states/complete-kelantan.mp3'),
  'sabah': require('@/assets/audio/states/complete-sabah.mp3'),
  'sarawak': require('@/assets/audio/states/complete-sarawak.mp3'),
};

// Sound instance caches
const soundCache: Map<SoundType, AudioPlayer> = new Map();
const musicCache: Map<MusicSound, AudioPlayer> = new Map();
const ambientCache: Map<AmbientSound, AudioPlayer> = new Map();
const stateVoiceCache: Map<MalaysianState, AudioPlayer> = new Map();

// Current playing music track
let currentMusic: AudioPlayer | null = null;
let currentMusicName: MusicSound | null = null;

// Feedback variation arrays for randomization
const CORRECT_FEEDBACK: FeedbackSound[] = ['betul', 'correct-1', 'correct-2', 'correct-3', 'hebat', 'bagus'];
const WRONG_FEEDBACK: FeedbackSound[] = ['tidak-tepat', 'wrong-1', 'wrong-2', 'cuba-lagi'];
const ENCOURAGE_FEEDBACK: FeedbackSound[] = ['encourage-1', 'encourage-2', 'encourage-3'];

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

/**
 * Play randomized feedback for variety
 * Prevents repetitive audio experience
 */
export async function playRandomFeedback(isCorrect: boolean, includeEncouragement = false): Promise<void> {
  try {
    if (isCorrect) {
      // Pick random correct feedback
      const feedback = CORRECT_FEEDBACK[Math.floor(Math.random() * CORRECT_FEEDBACK.length)];
      await playSound(feedback);
    } else {
      // Pick random wrong feedback
      const feedback = WRONG_FEEDBACK[Math.floor(Math.random() * WRONG_FEEDBACK.length)];
      await playSound(feedback);
      
      // Optionally add encouragement after wrong answer
      if (includeEncouragement && Math.random() > 0.5) {
        setTimeout(async () => {
          const encourage = ENCOURAGE_FEEDBACK[Math.floor(Math.random() * ENCOURAGE_FEEDBACK.length)];
          await playSound(encourage);
        }, 1500); // Play encouragement 1.5s after wrong feedback
      }
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
 * Play state completion voice
 * @param state - Malaysian state identifier
 */
export async function playStateCompletionVoice(state: MalaysianState): Promise<void> {
  try {
    let player = stateVoiceCache.get(state);
    if (!player) {
      player = createAudioPlayer(STATE_VOICES[state]);
      stateVoiceCache.set(state, player);
    }

    player.volume = 1.0;
    player.loop = false;
    player.seekTo(0);
    player.play();
  } catch (error) {
    // Fail silently
  }
}

/**
 * Play tutorial step narration
 * @param stepIndex - Tutorial step (0 or 1)
 */
export async function playTutorialNarration(stepIndex: number): Promise<void> {
  try {
    const voiceName: VoiceNarration = stepIndex === 0 ? 'voice-tutorial-step1' : 'voice-tutorial-step2';
    await playSound(voiceName);
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
    Array.from(stateVoiceCache.values()).forEach(player => player.remove());

    // Clear caches
    soundCache.clear();
    musicCache.clear();
    ambientCache.clear();
    stateVoiceCache.clear();

    currentMusic = null;
    currentMusicName = null;
  } catch (error) {
    // Fail silently
  }
}
