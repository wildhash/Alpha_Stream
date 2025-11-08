// Original Alpha_Stream types
export enum AssetKind {
  Crypto = 'CRYPTO',
  Stock = 'STOCK',
}

export type AssetSymbol = 'BTC' | 'ETH' | 'SOL' | 'XRP' | 'LTC' | 'TSLA' | 'NVDA' | 'AAPL' | 'MSFT' | 'AMZN';

export interface Asset {
  symbol: AssetSymbol;
  kind: AssetKind;
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

// Trading Game Core Engine types
export interface PlayerStats {
  equity: number;
  btc: number;
  streak: number;
  gemin: number;
}

export interface GameSettings {
  startingScore?: number;
  roadSpeed?: number;
  minMomentum?: number;
  stopPct?: number;
  allowedAssets?: 'all' | AssetKind[];
  speed?: number;
  volume?: number;
  tts?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface InfoCardContent {
  title: string;
  explanation: string;
}

export type GameEffectType = 'powerup' | 'glitch';
export type GameEffect = {
  id: 'MARKET_SIGHT' | 'MARKET_FOG';
  type: GameEffectType;
  name: string;
  description: string;
  duration: number; // in seconds
  icon: React.ElementType;
};

export type GlobalEventType = 'shock' | 'streak';
export interface GlobalMarketEvent {
    id: string;
    type: GlobalEventType;
    title: string;
    description: string;
    duration: number; // in seconds
    active: boolean;
}

export interface BaseEvent {
  id: string;
  lane: number;
}

export interface MarketEvent extends BaseEvent {
  type: 'opportunity' | 'trap';
  value: number;
  symbol: string;
  faded: boolean;
  title: string;
  explanation: string;
  news: {
    headline: string;
    source: string;
    url: string;
  };
  priceHistory: { time: number; price: number; }[];
  analysis?: ChartAnalysis;
}

export interface QuizEvent extends BaseEvent {
    type: 'quiz' | 'mandatory_quiz';
    question: QuizQuestion;
    text: string;
}

export interface RecommendationEvent extends BaseEvent {
    type: 'recommendation';
    text: string;
}

export interface ForecastEvent extends BaseEvent {
    type: 'forecast';
    symbol: string;
    status: 'pending' | 'predicted' | 'resolved';
    initialHeadline: string;
    resolutionHeadline?: string;
    outcome?: 'bullish' | 'bearish';
    prediction?: 'bullish' | 'bearish';
    reward: number;
}

export type GameEvent = MarketEvent | QuizEvent | RecommendationEvent | GlobalMarketEvent | ForecastEvent;

export interface KeyTakeaway {
  id: string;
  text: string;
}

export interface GameContext {
  stats: PlayerStats;
  visibleEvents: MarketEvent[];
}

export interface AlpacaCreds {
  key: string;
  secret: string;
}

export type IntegrationService = {
  id: 'fidelity' | 'robinhood' | 'moonshot' | 'discord' | 'telegram';
  name: string;
  description: string;
  longDescription: string;
  comingSoon: boolean;
  connectionType: 'api' | 'oauth' | 'info';
};

// Types for AI-Generated Chart Analysis
export interface ChartAnnotation {
  index: number; // Index in the priceHistory array
  text: string;
}

export interface ChartAnalysis {
  analysisText: string;
  keyConcept: {
    title: string;
    explanation: string;
  };
  relatedNews: {
    headline: string;
    source: string;
  }[];
  annotations: ChartAnnotation[];
}

export interface PlayerPerks {
    longerPowerups: boolean;
    shorterGlitches: boolean;
    quizWhiz: boolean;
    takeawayArchive: boolean;
}
