import { useGameContext } from '@/contexts/GameContext';
import type { SuccessModalProps } from '@/types';
import { playAmbient, playSound, playStateCompletionVoice, stopAmbient } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import CongratsOverlay from './CongratsOverlay';

/**
 * SuccessModal Component - wraps the shared CongratsOverlay with
 * game-specific audio + haptic feedback.
 */
export default function SuccessModal({ visible, onContinue, onRestart }: SuccessModalProps) {
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Sequential audio playback for clearer celebration experience
      playSound('star'); // 1. Celebration sound effect

      // 2. Wait 500ms, then play state completion voice (snappier celebration)
      if (gameState.currentState) {
        setTimeout(() => {
          playStateCompletionVoice(gameState.currentState!);
        }, 500);
      }

      // 3. Start ambient celebration at lower volume (less overwhelming)
      playAmbient('ambient-celebration', 0.3);
    }
  }, [visible, gameState.currentState]);

  const handleContinue = () => {
    playSound('click');
    // Stop celebration ambience when closing modal
    stopAmbient('ambient-celebration');
    onContinue();
  };

  const handleRestart = () => {
    playSound('click');
    // Stop celebration ambience when closing modal
    stopAmbient('ambient-celebration');
    onRestart();
  };

  return (
    <CongratsOverlay
      visible={visible}
      title="TAHNIAH"
      allowFontScaling={allowScaling}
      onContinue={handleContinue}
      onRestart={handleRestart}
    />
  );
}
