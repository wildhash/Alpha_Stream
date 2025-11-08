import React from 'react';

interface InstructionsModalProps {
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-900 border border-cyan-500 rounded-lg shadow-2xl p-8 max-w-lg w-full text-center text-white">
        <h2 className="text-3xl font-bold font-space-grotesk text-cyan-400 mb-4">Welcome to Alpha Lane!</h2>
        <p className="text-gray-300 mb-6">Your mission is to maximize your profits by riding the waves of market momentum.</p>
        
        <ul className="space-y-4 text-left mb-8">
            <li className="flex items-start space-x-3">
                <span className="text-green-400 font-bold text-xl">1.</span>
                <div>
                    <h3 className="font-semibold">Go Long on Opportunities</h3>
                    <p className="text-sm text-gray-400">Drive over <span className="text-green-400 font-semibold">glowing green</span> platforms to start a 'long' ride on a high-momentum asset.</p>
                </div>
            </li>
            <li className="flex items-start space-x-3">
                <span className="text-red-400 font-bold text-xl">2.</span>
                 <div>
                    <h3 className="font-semibold">Go Short on Volatility</h3>
                    <p className="text-sm text-gray-400">Drive over <span className="text-red-400 font-semibold">unstable red</span> platforms to 'short' an asset. It's another way to profit!</p>
                </div>
            </li>
            <li className="flex items-start space-x-3">
                <span className="text-cyan-400 font-bold text-xl">3.</span>
                 <div>
                    <h3 className="font-semibold">Switch Lanes</h3>
                    <p className="text-sm text-gray-400">Simply <span className="font-semibold">click on any lane</span> to navigate your ship.</p>
                </div>
            </li>
             <li className="flex items-start space-x-3">
                <span className="text-yellow-400 font-bold text-xl">4.</span>
                 <div>
                    <h3 className="font-semibold">Get the High Score!</h3>
                    <p className="text-sm text-gray-400">Your goal is to get the highest <span className="font-semibold">paper trading balance</span>. You can't lose money, only make it!</p>
                </div>
            </li>
        </ul>

        <button 
          onClick={onClose}
          className="w-full bg-cyan-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-cyan-400 transition-colors text-lg"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};