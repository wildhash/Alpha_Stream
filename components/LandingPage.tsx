
import React, { useState } from 'react';
import { GameConfig, AssetKind } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import GameConfigModal from './GameConfigModal';
import { EditIcon, DeleteIcon, PlusIcon } from './icons/GameIcons';

interface LandingPageProps {
  presets: GameConfig[];
  onGameSelect: (config: GameConfig) => void;
}

const GameCard: React.FC<{ 
    config: GameConfig; 
    onSelect: () => void; 
    onEdit?: () => void;
    onDelete?: () => void;
    isCustom?: boolean;
}> = ({ config, onSelect, onEdit, onDelete, isCustom = false }) => {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col hover:border-cyan-400 transition-colors duration-300 transform hover:-translate-y-1 relative">
            <h3 className="text-xl font-bold font-space-grotesk text-white mb-2">{config.name}</h3>
            <p className="text-gray-400 text-sm flex-grow mb-4">{config.description || 'A custom game configuration.'}</p>
            
            {isCustom && (
                <div className="absolute top-3 right-3 flex space-x-2">
                    <button onClick={onEdit} aria-label={`Edit ${config.name}`} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"><EditIcon /></button>
                    <button onClick={onDelete} aria-label={`Delete ${config.name}`} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"><DeleteIcon /></button>
                </div>
            )}
            
            <button 
                onClick={onSelect}
                className="mt-auto w-full bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors"
            >
                Play
            </button>
        </div>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ presets, onGameSelect }) => {
  const [savedGames, setSavedGames] = useLocalStorage<GameConfig[]>('alpha-arcade-saved-games', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameConfig | null>(null);

  const handleSaveGame = (configToSave: GameConfig) => {
    if (savedGames.find(g => g.id === configToSave.id)) {
      // Editing existing game
      setSavedGames(savedGames.map(g => g.id === configToSave.id ? configToSave : g));
    } else {
      // Creating new game
      setSavedGames([...savedGames, configToSave]);
    }
    setIsModalOpen(false);
    setEditingGame(null);
  };
  
  const handleEdit = (config: GameConfig) => {
    setEditingGame(config);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingGame(null);
    setIsModalOpen(true);
  }
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this game mode?")) {
        setSavedGames(savedGames.filter(g => g.id !== id));
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto text-center animate-fade-in p-4">
        <h1 className="text-5xl md:text-6xl font-bold font-space-grotesk text-white mb-2">
            Alpha <span className="text-cyan-400">Arcade</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10">Play presets or create your own trading game.</p>
        
        {isModalOpen && (
            <GameConfigModal
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveGame}
                initialConfig={editingGame}
            />
        )}

        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-bold font-space-grotesk text-left mb-4">Game Presets</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {presets.map(preset => (
                        <GameCard 
                            key={preset.id} 
                            config={preset}
                            onSelect={() => onGameSelect(preset)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-space-grotesk text-left">My Saved Games</h2>
                    <button 
                        onClick={handleCreateNew}
                        className="flex items-center space-x-2 bg-green-500/20 text-green-300 font-semibold py-2 px-4 rounded-lg hover:bg-green-500/30 border border-green-500 transition-colors"
                    >
                       <PlusIcon />
                       <span>Create New</span>
                    </button>
                </div>
                {savedGames.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {savedGames.map(game => (
                            <GameCard 
                                key={game.id} 
                                config={game}
                                onSelect={() => onGameSelect(game)}
                                onEdit={() => handleEdit(game)}
                                onDelete={() => handleDelete(game.id)}
                                isCustom
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
                        <p className="text-gray-500">You haven't created any custom games yet.</p>
                        <p className="text-gray-500">Click "Create New" to build your own!</p>
                    </div>
                )}
            </div>
        </div>

        <footer className="mt-16 text-sm text-gray-500">
            <p>This is a simulation game. Not financial advice.</p>
        </footer>
    </div>
  );
};
