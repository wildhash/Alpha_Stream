
import React from 'react';
import { LoosenStopIcon, RobotIcon, TightenStopIcon, QuitIcon } from './icons/ControlIcons';
import { GameMode } from '../types';

interface ControlsProps {
  isAutoHop: boolean;
  onAutoHopToggle: () => void;
  gameSettings: { stopPct: number; minMomentum: number };
  onSettingsChange: (settings: { stopPct: number; minMomentum: number }) => void;
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  onExit: () => void;
}

interface ControlButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, icon, children, active = false, variant = 'default' }) => {
  const baseClasses = "w-full flex items-center space-x-3 p-3 rounded-lg text-left text-sm font-semibold transition-all border";
  
  const activeClasses = "bg-green-500/20 text-green-300 border-green-500";
  const inactiveClasses = "bg-gray-800/50 text-gray-300 hover:bg-gray-700/70 border-gray-700";
  const dangerClasses = "bg-red-900/50 text-red-300 hover:bg-red-800/70 border-red-700";

  let variantClass;
  if (variant === 'danger') {
    variantClass = dangerClasses;
  } else {
    variantClass = active ? activeClasses : inactiveClasses;
  }
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClass}`}>
      {icon && <span className="text-xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const Controls: React.FC<ControlsProps> = ({ isAutoHop, onAutoHopToggle, gameSettings, onSettingsChange, gameMode, onGameModeChange, onExit }) => {

  const tightenStops = () => {
      onSettingsChange({
          ...gameSettings,
          stopPct: Math.max(0.1, gameSettings.stopPct - 0.05),
      });
  };

  const loosenStops = () => {
      onSettingsChange({
          ...gameSettings,
          stopPct: Math.min(0.5, gameSettings.stopPct + 0.05),
      });
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 space-y-4 h-full flex flex-col">
        <div>
            <h2 className="text-xl font-bold font-space-grotesk text-white">Controls</h2>
        </div>
        
        <div className="space-y-3">
             <ControlButton onClick={onAutoHopToggle} icon={<RobotIcon />} active={isAutoHop}>
                Auto-Hop {isAutoHop ? 'On' : 'Off'}
            </ControlButton>

            <ControlButton onClick={tightenStops} icon={<TightenStopIcon />}>
                Tighten Stops
            </ControlButton>

            <ControlButton onClick={loosenStops} icon={<LoosenStopIcon />}>
                Loosen Stops
            </ControlButton>
        </div>

        <div className="pt-4 border-t border-gray-700 space-y-2">
            <h3 className="text-lg font-semibold font-space-grotesk text-gray-300">Parameters</h3>
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span className="text-gray-400">Stop Loss %:</span>
                    <span className="font-mono">{(gameSettings.stopPct * 100).toFixed(0)}%</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Min Momentum:</span>
                    <span className="font-mono">{gameSettings.minMomentum.toFixed(1)}</span>
                </div>
            </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
             <h3 className="text-lg font-semibold font-space-grotesk text-gray-300 mb-2">Game Mode</h3>
             <div className="flex flex-col space-y-2">
                 <ControlButton onClick={() => onGameModeChange('momentum_news')} active={gameMode === 'momentum_news'}>
                    Momentum + News
                 </ControlButton>
                 <ControlButton onClick={() => onGameModeChange('momentum_only')} active={gameMode === 'momentum_only'}>
                    Momentum Only
                 </ControlButton>
             </div>
        </div>
        <div className="flex-grow"></div>
        <div className="pt-4 border-t border-gray-700">
            <ControlButton onClick={onExit} icon={<QuitIcon />} variant="danger">
                Quit to Lobby
            </ControlButton>
        </div>
    </div>
  );
};
