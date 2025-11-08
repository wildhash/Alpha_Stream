
import React from 'react';
import { GameState } from '../types';
import { DollarSignIcon, TrendingUpIcon, ClockIcon } from './icons/HudIcons';

interface HudProps {
  gameState: GameState;
  currentRidePnl: number;
}

const formatScore = (score: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(score);
};

const RideInfo: React.FC<{ ride: GameState['currentRide'], pnl: number }> = ({ ride, pnl }) => {
    if (!ride) return null;

    const pnlColor = pnl >= 0 ? 'text-green-400' : 'text-red-400';
    const rideType = ride.platform.isOpportunity ? 'LONG' : 'SHORT';
    const rideTypeColor = ride.platform.isOpportunity ? 'text-green-400' : 'text-red-400';

    return (
        <div className="bg-gray-900/60 p-3 rounded-md border border-gray-700 font-mono text-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-400">RIDE:</span>
                <span className={`font-bold ${rideTypeColor}`}>{ride.platform.asset.symbol} {rideType}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
                <span className="text-gray-400">PNL:</span>
                <span className={`font-bold ${pnlColor}`}>{formatScore(pnl)}</span>
            </div>
        </div>
    );
};

const NewsTicker: React.FC<{ news: GameState['news'] }> = ({ news }) => {
    if (news.length === 0) {
        return <div className="text-sm text-gray-500 italic">Market quiet...</div>;
    }
    const latestNews = news[news.length - 1];
    const impactColor = latestNews.impact > 0 ? 'text-green-400' : 'text-red-400';

    return (
        <div className="text-sm animate-fade-in">
            <span className="font-bold text-cyan-400 mr-2">NEWS:</span>
            <span className={`font-semibold ${impactColor}`}>{latestNews.asset.symbol}</span>
            <span className="text-gray-300"> - {latestNews.headline}</span>
        </div>
    );
}

export const Hud: React.FC<HudProps> = ({ gameState, currentRidePnl }) => {
  const { score, gameTime, currentRide, news } = gameState;

  return (
    <div className="absolute top-0 left-0 right-0 p-4 text-white font-space-grotesk z-10 flex justify-between items-start pointer-events-none">
      {/* Left side: Score and Stats */}
      <div className="space-y-3">
        <div className="bg-gray-900/60 backdrop-blur-sm p-3 rounded-lg border border-gray-700 flex items-center space-x-3 shadow-lg">
          <DollarSignIcon className="w-8 h-8 text-cyan-400" />
          <div>
            <div className="text-sm text-gray-400">BALANCE</div>
            <div className="text-3xl font-bold tracking-wider">{formatScore(score)}</div>
          </div>
        </div>
        <RideInfo ride={currentRide} pnl={currentRidePnl} />
      </div>

      {/* Center: News Ticker */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/2 max-w-2xl bg-gray-900/60 backdrop-blur-sm p-3 rounded-lg border border-gray-700 shadow-lg text-center overflow-hidden">
        <NewsTicker news={news} />
      </div>

      {/* Right side: Time and Momentum */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-3 rounded-lg border border-gray-700 flex items-center space-x-3 shadow-lg">
        <ClockIcon className="w-8 h-8 text-cyan-400" />
        <div>
          <div className="text-sm text-gray-400">TIME</div>
          <div className="text-3xl font-bold font-mono">{Math.floor(gameTime / 60).toString().padStart(2, '0')}:{(gameTime % 60).toString().padStart(2, '0')}</div>
        </div>
      </div>
    </div>
  );
};
