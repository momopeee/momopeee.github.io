
import { useState, useCallback } from 'react';
import { useUI } from '@/context/UIContext';
import { useCharacter } from '@/context/CharacterContext';
import { useBattle } from '@/context/BattleContext';
import { 
  performPlayerAttack, 
  performPlayerSpecial, 
  performRunAway, 
  performHighball,
  performOpponentAttack,
  performSosoHeal
} from '@/utils/battleActions';
import { useBattleEffects } from './useBattleEffects';

export const useBattleLogic = () => {
  const { handleScreenTransition } = useUI();
  const { 
    player, setPlayer,
    opponent1, setOpponent1,
    showCharacterSheet, setShowCharacterSheet,
    currentCharacterSheet, setCurrentCharacterSheet,
  } = useCharacter();
  const {
    battleTimer,
    resetBattleTimer,
    startBattleTimer,
    comments, addComment, clearComments,
    specialAttackAvailable, setSpecialAttackAvailable,
    attackCount, setAttackCount,
    highballMode, setHighballMode,
    sosoHealMode, setSosoHealMode,
  } = useBattle();

  const [isBattleOver, setIsBattleOver] = useState(false);
  const [soundEffect, setSoundEffect] = useState<string | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleStarted, setIsBattleStarted] = useState(false);

  // Initialize battle when component mounts
  useState(() => {
    clearComments();
    resetBattleTimer();
    startBattleTimer();
    setIsBattleStarted(true);
    
    // Reset player and opponent stats
    setPlayer({
      ...player,
      currentHp: player.maxHp,
      attackMin: 15,  // Set attack min to 15
      attackMax: 30,  // Set attack max to 30
      specialPower: 50 // Special attack power to 30-50
    });
    
    setOpponent1({
      ...opponent1,
      currentHp: opponent1.maxHp
    });
    
    setAttackCount(0);
    setSpecialAttackAvailable(false);
    setHighballMode(false);
    setSosoHealMode(false);
    
    addComment("システム", "バトル開始！ さよならクソリプそーそー！", true);
  });

  // Define handler functions using useCallback to prevent unnecessary re-renders
  const handleOpponentAttack = useCallback(() => {
    if (isBattleOver) return;
    
    // Perform opponent attack
    const result = performOpponentAttack(player, opponent1, addComment);
    
    setPlayer(result.updatedPlayer);
    
    // Start player's turn
    if (result.endTurn) {
      setIsPlayerTurn(true);
    }
  }, [player, opponent1, isBattleOver, addComment, setPlayer, setIsPlayerTurn]);

  const handleSosoHeal = useCallback(() => {
    if (isBattleOver) return;
    
    // Perform soso heal
    const result = performSosoHeal(opponent1, addComment);
    
    setOpponent1(result.updatedOpponent);
    
    // Start player's turn
    if (result.endTurn) {
      setIsPlayerTurn(true);
    }
  }, [opponent1, isBattleOver, addComment, setOpponent1, setIsPlayerTurn]);

  // Use our new custom hook for battle effects
  useBattleEffects({
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
  });

  // Handle player attack
  const handlePlayerAttack = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Increase attack count for special attack
    const newAttackCount = attackCount + 1;
    setAttackCount(newAttackCount);
    
    // Enable special attack after 3 regular attacks
    if (newAttackCount >= 3 && !specialAttackAvailable) {
      setSpecialAttackAvailable(true);
    }
    
    // Perform the attack
    const result = performPlayerAttack(player, opponent1, highballMode, addComment);
    
    setPlayer(result.updatedPlayer);
    setOpponent1(result.updatedOpponent);
    
    // Reset highball mode if it was active
    if (highballMode) {
      setHighballMode(false);
    }
    
    // End player's turn
    if (result.endTurn) {
      setIsPlayerTurn(false);
    }
  };

  // Handle player special attack
  const handlePlayerSpecial = () => {
    if (isBattleOver || !isPlayerTurn || !specialAttackAvailable) return;
    
    // Perform special attack
    const result = performPlayerSpecial(player, opponent1, addComment);
    
    setOpponent1(result.updatedOpponent);
    
    // Reset special attack availability and count
    setSpecialAttackAvailable(false);
    setAttackCount(0);
    
    // End player's turn
    if (result.endTurn) {
      setIsPlayerTurn(false);
    }
  };

  // Handle running away
  const handleRunAway = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Perform run away action
    const result = performRunAway(player, addComment);
    
    setPlayer(result.updatedPlayer);
    
    // End player's turn
    if (result.endTurn) {
      setIsPlayerTurn(false);
    }
  };

  // Handle drinking highball
  const handleHighball = () => {
    if (isBattleOver || !isPlayerTurn) return;
    
    // Perform highball action
    const result = performHighball(player, addComment);
    
    setPlayer(result.updatedPlayer);
    setHighballMode(result.highballMode);
    
    // End player's turn
    if (result.endTurn) {
      setIsPlayerTurn(false);
    }
  };

  // Handle character sheet display
  const handleCharacterClick = (character: 'player' | 'opponent1') => {
    setCurrentCharacterSheet(character);
    setShowCharacterSheet(true);
  };

  return {
    player,
    opponent1,
    battleTimer,
    isBattleOver,
    soundEffect,
    isPlayerTurn,
    attackCount,
    sosoHealMode,
    specialAttackAvailable,
    highballMode,
    showCharacterSheet,
    currentCharacterSheet,
    comments,
    handlePlayerAttack,
    handlePlayerSpecial,
    handleRunAway,
    handleHighball,
    handleCharacterClick,
    setShowCharacterSheet
  };
};
