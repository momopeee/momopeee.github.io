
import { useEffect } from 'react';
import { useUI } from '@/context/UIContext';
import { Character } from '@/context/CharacterContext';
import { handleVictory, handleDefeat } from '@/utils/battleResults';

interface UseBattleEffectsProps {
  player: Character;
  opponent1: Character;
  battleTimer: number;
  isPlayerTurn: boolean;
  isBattleStarted: boolean;
  isBattleOver: boolean;
  sosoHealMode: boolean;
  setSosoHealMode: (mode: boolean) => void;
  setIsBattleOver: (isOver: boolean) => void;
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  setSoundEffect: (sound: string | null) => void;
  handleOpponentAttack: () => void;
  handleSosoHeal: () => void;
}

export const useBattleEffects = ({
  player,
  opponent1,
  battleTimer,
  isPlayerTurn,
  isBattleStarted,
  isBattleOver,
  sosoHealMode,
  setSosoHealMode,
  setIsBattleOver,
  addComment,
  setSoundEffect,
  handleOpponentAttack,
  handleSosoHeal
}: UseBattleEffectsProps) => {
  const { handleScreenTransition } = useUI();

  // Handle opponent's turn
  useEffect(() => {
    if (!isPlayerTurn && isBattleStarted && !isBattleOver) {
      const opponentTimer = setTimeout(() => {
        if (sosoHealMode) {
          handleSosoHeal();
        } else {
          handleOpponentAttack();
        }
      }, 1500);
      
      return () => clearTimeout(opponentTimer);
    }
  }, [isPlayerTurn, isBattleStarted, isBattleOver, sosoHealMode, handleOpponentAttack, handleSosoHeal]);

  // Check for battle over conditions
  useEffect(() => {
    if ((player.currentHp <= 0 || opponent1.currentHp <= 0) && !isBattleOver) {
      setIsBattleOver(true);
      
      if (player.currentHp <= 0) {
        // Player lost
        handleDefeat(addComment, setSoundEffect, handleScreenTransition);
      } else if (opponent1.currentHp <= 0) {
        // Player won
        handleVictory(addComment, setSoundEffect, handleScreenTransition);
      }
    }
  }, [player.currentHp, opponent1.currentHp, isBattleOver, setIsBattleOver, addComment, setSoundEffect, handleScreenTransition]);

  // Activate soso heal mode after 30 seconds
  useEffect(() => {
    if (battleTimer >= 30 && !sosoHealMode && !isBattleOver) {
      setSosoHealMode(true);
      addComment("システム", "そーそーのとくぎがはつどうした！", true);
    }
  }, [battleTimer, sosoHealMode, isBattleOver, addComment, setSosoHealMode]);
};
