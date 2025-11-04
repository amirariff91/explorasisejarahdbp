import { useGameContext } from '@/contexts/GameContext';
import type { SuccessModalProps } from '@/types';
import { playAmbient, playCelebration, playSound, playStateCompletionVoice } from '@/utils/audio';
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
      playCelebration();
      playAmbient('ambient-celebration', 0.5); // Celebration ambience
      
      // Play state-specific completion voice
      if (gameState.currentState) {
        setTimeout(() => {
          playStateCompletionVoice(gameState.currentState!);
        }, 1000); // Play after 1 second to let celebration sound play first
      }
    }
  }, [visible, gameState.currentState]);

  const handleContinue = () => {
    playSound('click');
    onContinue();
  };

  const handleRestart = () => {
    playSound('click');
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
