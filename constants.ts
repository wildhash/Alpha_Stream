import { Asset, AssetKind, AssetSymbol, GameConfig } from './types';

export const ASSETS: Asset[] = [
  { symbol: 'BTC', kind: AssetKind.Crypto },
  { symbol: 'ETH', kind: AssetKind.Crypto },
  { symbol: 'SOL', kind: AssetKind.Crypto },
  { symbol: 'XRP', kind: AssetKind.Crypto },
  { symbol: 'LTC', kind: AssetKind.Crypto },
  { symbol: 'TSLA', kind: AssetKind.Stock },
  { symbol: 'NVDA', kind: AssetKind.Stock },
  { symbol: 'AAPL', kind: AssetKind.Stock },
  { symbol: 'MSFT', kind: AssetKind.Stock },
  { symbol: 'AMZN', kind: AssetKind.Stock },
];

// Visual constants, not affected by game logic
export const GAME_CONFIG = {
  CANVAS_WIDTH: 1000,
  CANVAS_HEIGHT: 600,
  PLAYER_SIZE: 15,
  PLAYER_Y_POSITION: 500,
  LANE_COUNT: 5,
  HORIZON_Y: 200,
  ROAD_WIDTH_BOTTOM: 800,
  ROAD_WIDTH_TOP: 100,
  STAR_COUNT: 200,
  PLATFORM_BASE_LENGTH: 80,
  PLAYER_LANE_SWITCH_SPEED: 0.15,
  RIDE_ACTIVATION_Y: 510,
  PLATFORM_DESPAWN_Y: 600,
};

// Gameplay presets
export const GAME_PRESETS: GameConfig[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'A balanced experience with standard speed and volatility. A great place to start.',
    settings: {
      startingScore: 100000,
      roadSpeed: 2.5,
      minMomentum: 1.0,
      stopPct: 0.3,
      allowedAssets: 'all',
    }
  },
  {
    id: 'crypto_rush',
    name: 'Crypto Rush',
    description: 'A faster, crypto-only mode with higher volatility. Opportunities and traps appear more frequently.',
    settings: {
      startingScore: 100000,
      roadSpeed: 3.5,
      minMomentum: 1.2,
      stopPct: 0.25,
      allowedAssets: [AssetKind.Crypto],
    }
  },
  {
    id: 'stocks_pro',
    name: 'Stocks Pro',
    description: 'A slower, more methodical mode focused on stocks. Requires careful decision making.',
    settings: {
      startingScore: 250000,
      roadSpeed: 2.0,
      minMomentum: 0.8,
      stopPct: 0.35,
      allowedAssets: [AssetKind.Stock],
    }
  }
];