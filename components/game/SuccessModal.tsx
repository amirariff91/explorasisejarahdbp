import { useGameContext } from '@/contexts/GameContext';
import type { SuccessModalProps } from '@/types';
import { playAmbient, playSound, stopAmbient } from '@/utils/audio';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import CongratsOverlay from './CongratsOverlay';

/**
 * SuccessModal Component - wraps the shared CongratsOverlay with
 * game-specific audio + haptic feedback.
 */
export default function SuccessModal({ visible, totalQuestions, onContinue, onRestart }: SuccessModalProps) {
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  // Count answers for current state only to avoid cross-state contamination
  const answeredCount = totalQuestions ?? Object.entries(gameState.answers || {}).filter(([key]) => {
    return gameState.currentState && (key.startsWith(`${gameState.currentState}-`) || key.startsWith(`${gameState.currentState}_`));
  }).length;
  const successMessage = answeredCount > 0
    ? `Anda telah menjawab semua ${answeredCount} soalan dengan betul`
    : undefined;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Celebration ambient only (FeedbackOverlay already plays star SFX for correct answers)
      // Start ambient celebration at lower volume (less overwhelming)
      playAmbient('ambient-celebration', 0.3);
    }
  }, [visible]);

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
      reward={successMessage}
      allowFontScaling={allowScaling}
      onContinue={handleContinue}
      onRestart={handleRestart}
    />
  );
}
