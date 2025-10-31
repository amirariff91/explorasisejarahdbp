import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { playCelebration, playSound } from '@/utils/audio';
import type { SuccessModalProps } from '@/types';
import { useGameContext } from '@/contexts/GameContext';
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
    }
  }, [visible]);

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
