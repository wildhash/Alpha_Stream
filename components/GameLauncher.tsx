import React, { useState, useEffect } from 'react';
import { GameConfig } from '../types';
import { useGameLogic } from '../hooks/useGameLogic.ts';
import { GameCanvas } from './GameCanvas';
import { Hud } from './Hud';
import { Controls } from './Controls';
import { InstructionsModal } from './InstructionsModal';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GameLauncherProps {
  gameConfig: GameConfig;
  onExit: () => void;
}

export const GameLauncher: React.FC<GameLauncherProps> = ({ gameConfig, onExit }) => {
  const { 
    gameState, 
    gameSettings,
    currentRidePnl,
    isAutoHop,
    gameMode,
    onLaneSwitch, 
    onRestart,
    onAutoHopToggle,
    onSettingsChange,
    onGameModeChange,
  } = useGameLogic(gameConfig);

  const [hasPlayedBefore, setHasPlayedBefore] = useLocalStorage('alpha-arcade-has-played', false);
  const [showInstructions, setShowInstructions] = useState(!hasPlayedBefore);

  useEffect(() => {
      if(!showInstructions){
          setHasPlayedBefore(true);
      }
  }, [showInstructions, setHasPlayedBefore]);

  if(showInstructions) {
      return <InstructionsModal onClose={() => setShowInstructions(false)} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 animate-fade-in">
      <div className="flex-grow relative">
        <Hud gameState={gameState} currentRidePnl={currentRidePnl} />
        <GameCanvas 
          gameState={gameState} 
          onLaneSwitch={onLaneSwitch}
          onRestart={onRestart}
        />
      </div>
      <div className="w-full md:w-64 flex-shrink-0">
         <Controls
            isAutoHop={isAutoHop}
            onAutoHopToggle={onAutoHopToggle}
            gameSettings={{ stopPct: gameSettings.stopPct, minMomentum: gameSettings.minMomentum }}
            onSettingsChange={(newSettings) => onSettingsChange({ stopPct: newSettings.stopPct, minMomentum: newSettings.minMomentum })}
            gameMode={gameMode}
            onGameModeChange={onGameModeChange}
            onExit={onExit}
        />
      </div>
    </div>
  );
};