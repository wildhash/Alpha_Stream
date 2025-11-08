
import React, { useState } from 'react';
import { GameConfig, GameSettings, AssetKind } from '../types';

interface GameConfigModalProps {
  onClose: () => void;
  onSave: (config: GameConfig) => void;
  initialConfig: GameConfig | null;
}

const defaultSettings: GameSettings = {
    startingScore: 100000,
    roadSpeed: 2.5,
    minMomentum: 1.0,
    stopPct: 0.3,
    allowedAssets: 'all',
};

const GameConfigModal: React.FC<GameConfigModalProps> = ({ onClose, onSave, initialConfig }) => {
    const [config, setConfig] = useState<GameConfig>(
        initialConfig || {
            id: `custom-${Date.now()}`,
            name: '',
            description: '',
            settings: defaultSettings,
        }
    );

    const handleSettingsChange = (field: keyof GameSettings, value: any) => {
        setConfig({
            ...config,
            settings: { ...config.settings, [field]: value },
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if(!config.name.trim()){
            alert("Please enter a name for your game mode.");
            return;
        }
        onSave(config);
    };

    const handleAssetChange = (kind: AssetKind) => {
        const current = config.settings.allowedAssets;
        if (current === 'all') {
            handleSettingsChange('allowedAssets', [kind]);
        } else if (current.includes(kind)) {
            const newAssets = current.filter(k => k !== kind);
            handleSettingsChange('allowedAssets', newAssets.length > 0 ? newAssets : 'all');
        } else {
            handleSettingsChange('allowedAssets', [...current, kind]);
        }
    }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gray-900 border border-cyan-500 rounded-lg shadow-2xl p-8 max-w-2xl w-full text-white">
        <h2 className="text-2xl font-bold font-space-grotesk text-cyan-400 mb-6">
            {initialConfig ? 'Edit Game Mode' : 'Create New Game Mode'}
        </h2>
        
        <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input type="text" id="name" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-1 focus:ring-cyan-500 focus:border-cyan-500" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                <textarea id="description" value={config.description} onChange={(e) => setConfig({...config, description: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-1 focus:ring-cyan-500 focus:border-cyan-500" rows={3} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                 <div>
                    <label htmlFor="startingScore" className="block text-sm font-medium text-gray-300">Starting Balance</label>
                    <input type="number" id="startingScore" value={config.settings.startingScore} onChange={(e) => handleSettingsChange('startingScore', parseInt(e.target.value, 10))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Allowed Assets</label>
                    <div className="flex space-x-4 mt-2">
                        <label className="flex items-center space-x-2"><input type="checkbox" checked={config.settings.allowedAssets === 'all' || config.settings.allowedAssets.includes(AssetKind.Crypto)} onChange={() => handleAssetChange(AssetKind.Crypto)} /> <span>Crypto</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" checked={config.settings.allowedAssets === 'all' || config.settings.allowedAssets.includes(AssetKind.Stock)} onChange={() => handleAssetChange(AssetKind.Stock)} /> <span>Stocks</span></label>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="roadSpeed" className="block text-sm font-medium text-gray-300">Road Speed: <span className="font-mono">{config.settings.roadSpeed.toFixed(1)}</span></label>
                    <input type="range" id="roadSpeed" min="1" max="5" step="0.1" value={config.settings.roadSpeed} onChange={(e) => handleSettingsChange('roadSpeed', parseFloat(e.target.value))} className="w-full" />
                </div>
                <div>
                    <label htmlFor="minMomentum" className="block text-sm font-medium text-gray-300">Min Momentum for Opportunity: <span className="font-mono">{config.settings.minMomentum.toFixed(1)}</span></label>
                    <input type="range" id="minMomentum" min="0.5" max="2.5" step="0.1" value={config.settings.minMomentum} onChange={(e) => handleSettingsChange('minMomentum', parseFloat(e.target.value))} className="w-full" />
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
                <button type="button" onClick={onClose}
                    className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                    Cancel
                </button>
                <button type="submit"
                    className="bg-cyan-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors">
                    Save
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default GameConfigModal;
