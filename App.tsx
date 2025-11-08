import React, { useState } from 'react';
import { GameConfig } from './types';
import { LandingPage } from './components/LandingPage';
import { GameLauncher } from './components/GameLauncher';
import { GAME_PRESETS } from './constants';


const App: React.FC = () => {
    const [activeGameConfig, setActiveGameConfig] = useState<GameConfig | null>(null);

    const handleGameSelect = (config: GameConfig) => {
        setActiveGameConfig(config);
    };

    const handleExitGame = () => {
        setActiveGameConfig(null);
    };

    return (
        <div className="bg-[#0a0a0a] text-gray-200 min-h-screen flex flex-col items-center justify-center p-4 font-inter selection:bg-cyan-400/20">
            {activeGameConfig ? (
                <GameLauncher 
                    gameConfig={activeGameConfig} 
                    onExit={handleExitGame} 
                />
            ) : (
                <LandingPage 
                    presets={GAME_PRESETS} 
                    onGameSelect={handleGameSelect} 
                />
            )}
        </div>
    );
};

export default App;