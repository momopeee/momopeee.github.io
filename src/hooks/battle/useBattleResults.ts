
import { useNavigate } from 'react-router-dom';

type BattleResultsProps = {
  addComment: (author: string, text: string, isSystem?: boolean) => void;
  handleScreenTransition: (screen: string) => void;
  setIsBattleOver: React.Dispatch<React.SetStateAction<boolean>>;
  setTransitionScheduled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlayerVictory: React.Dispatch<React.SetStateAction<boolean | null>>;
  setShowSkipButton: React.Dispatch<React.SetStateAction<boolean>>;
  setRedirectTimer: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
  setBattleResult: React.Dispatch<React.SetStateAction<'victory' | 'defeat' | null>>;
};

export const useBattleResults = ({
  addComment,
  handleScreenTransition,
  setIsBattleOver,
  setTransitionScheduled,
  setIsPlayerVictory,
  setShowSkipButton,
  setRedirectTimer,
  setBattleResult
}: BattleResultsProps) => {
  const navigate = useNavigate();

  // Handle victory
  const handleVictory = () => {
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('victory');
    
    // Add victory comments
    addComment("システム", "とおるが勝利した、そーそーは破れかぶれになってクソリプを量産してしまった", true);
    
    // Queue up the victory messages with delays
    setTimeout(() => {
      addComment("システム", "とおるは400の経験値を得た、とおるはレベルが上がった", true);
    }, 3000);
    
    setTimeout(() => {
      addComment("システム", "とおるは祝いの美酒に酔いしれた", true);
    }, 6000);
    
    setTimeout(() => {
      addComment("システム", "とおるは祝いの美酒の効果で痛風が悪化した、80のダメージ", true);
    }, 9000);
    
    // Final message and screen transition with clear console logs for debugging
    setTimeout(() => {
      addComment("システム", "ライブが終了しました", true);
      console.log("Scheduling victory transition in 20 seconds...");
      
      // Show skip button after 10 seconds
      setTimeout(() => {
        setShowSkipButton(true);
      }, 1000);
      
      // Set up a 20-second timer for automatic redirect
      const timer = setTimeout(() => {
        console.log("Executing automatic victory transition to victory1");
        handleScreenTransition('victory1');
        navigate('/victory1');
      }, 20000); // 20 seconds automatic redirect
      
      setRedirectTimer(timer);
    }, 12000);
  };

  // Handle defeat
  const handleDefeat = () => {
    // Mark that we've already scheduled a transition
    setTransitionScheduled(true);
    setBattleResult('defeat');
    
    // Add defeat comments
    addComment("システム", "とおるが敗北した、そーそーは歯止めが利かなくなってしまった", true);
    
    setTimeout(() => {
      addComment("システム", "とおるは4000の経験値を得た", true);
    }, 3000);
    
    setTimeout(() => {
      addComment("システム", "とおるは敗北からも学べる男だった", true);
    }, 6000);
    
    setTimeout(() => {
      addComment("システム", "とおるはレベルが上がった", true);
    }, 9000);
    
    setTimeout(() => {
      addComment("システム", "とおるは敗北の美酒に酔いしれた", true);
    }, 12000);
    
    // Final messages and screen transition with clear console logs for debugging
    setTimeout(() => {
      addComment("システム", "とおるは敗北の美酒の効果で痛風が悪化した、530000のダメージ", true);
      
      setTimeout(() => {
        addComment("システム", "ライブが終了しました", true);
        console.log("Scheduling defeat transition to result1 in 20 seconds...");
        
        // Show skip button after 15 seconds
        setTimeout(() => {
          setShowSkipButton(true);
        }, 1000);
        
        // Set up a 20-second timer for automatic redirect to result1 instead of endingB
        const timer = setTimeout(() => {
          console.log("Executing automatic defeat transition to result1");
          handleScreenTransition('result1');
          navigate('/result1');
        }, 20000); // 20 seconds automatic redirect
        
        setRedirectTimer(timer);
      }, 3000);
    }, 15000);
  };

  // Handle skipping end sequences
  const handleSkip = (isPlayerVictory: boolean | null, redirectTimer: NodeJS.Timeout | null) => {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    
    // Transition to the appropriate screen based on battle outcome
    if (isPlayerVictory === true) {
      console.log("Skipping to victory1 screen");
      handleScreenTransition('victory1');
      navigate('/victory1');
    } else if (isPlayerVictory === false) {
      console.log("Skipping to result1 screen");
      handleScreenTransition('result1');
      navigate('/result1');
    }
  };

  return {
    handleVictory,
    handleDefeat,
    handleSkip
  };
};
