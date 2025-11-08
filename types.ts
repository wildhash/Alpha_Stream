
export enum AssetKind {
  Crypto = 'CRYPTO',
  Stock = 'STOCK',
}

export type AssetSymbol = 'BTC' | 'ETH' | 'SOL' | 'XRP' | 'LTC' | 'TSLA' | 'NVDA' | 'AAPL' | 'MSFT' | 'AMZN';

export interface Asset {
  symbol: AssetSymbol;
  kind: AssetKind;
}

export interface GameSettings {
  startingScore: number;
  roadSpeed: number;
  minMomentum: number;
  stopPct: number;
  allowedAssets: 'all' | AssetKind[];
}

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  settings: GameSettings;
}

export interface PlayerState {
  currentLane: number;
  targetLane: number;
  size: number;
  laneSwitchProgress: number; // 0 to 1
}

export interface Platform {
  id: string;
  y: number;
  length: number;
  laneIndex: number;
  isOpportunity: boolean; // true for long, false for short
  asset: Asset;
  momentum: number;
}

export interface Ride {
  platform: Platform;
  entryScore: number;
  currentScore: number;
  pnl: number;
}

export interface Star {
  x: number;
  y: number;
  r: number;
  vy: number;
}

export interface GameState {
  score: number;
  player: PlayerState;
  platforms: Platform[];
  stars: Star[];
  currentRide: Ride | null;
  gameOver: boolean;
  gameTime: number;
  screenShake: number;
  news: NewsItem[];
  gameSpeed: number;
}

export type GameMode = 'momentum_only' | 'momentum_news';

export interface NewsItem {
    id: string;
    asset: Asset;
    headline: string;
    impact: number; // e.g., -1 to 1
    timestamp: number;
}
