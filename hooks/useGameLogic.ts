import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameConfig,
  GameState,
  PlayerState,
  Platform,
  Ride,
  Star,
  NewsItem,
  GameMode,
  Asset,
  AssetKind,
} from '../types';
import { GAME_CONFIG, ASSETS } from '../constants';
import { GoogleGenAI } from '@google/genai';

// Fix: Initialize the GoogleGenAI client correctly with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateHeadline = async (asset: Asset, impact: number): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const impactDirection = impact > 0 ? 'positive' : 'negative';
    const assetType = asset.kind === AssetKind.Crypto ? 'cryptocurrency' : 'stock';
    const prompt = `Generate a very short, punchy, fake news headline for the ${assetType} ${asset.symbol} that would cause a ${impactDirection} price movement. Maximum 10 words.`;

    // Fix: Use the correct API call for generating content.
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    // Fix: Access the generated text directly from the `text` property of the response.
    const text = response.text.trim().replace(/\"/g, '');
    return text || `Major news hits ${asset.symbol}!`;
  } catch (error) {
    console.error('Error generating headline:', error);
    return `Volatility spike for ${asset.symbol}!`;
  }
};

const getInitialState = (config: GameConfig): GameState => {
  const stars: Star[] = Array.from({ length: GAME_CONFIG.STAR_COUNT }, () => ({
    x: Math.random() * GAME_CONFIG.CANVAS_WIDTH,
    y: Math.random() * GAME_CONFIG.CANVAS_HEIGHT,
    r: Math.random() * 1.5,
    vy: 1 + Math.random() * 2,
  }));

  return {
    score: config.settings.startingScore,
    player: {
      currentLane: Math.floor(GAME_CONFIG.LANE_COUNT / 2),
      targetLane: Math.floor(GAME_CONFIG.LANE_COUNT / 2),
      size: GAME_CONFIG.PLAYER_SIZE,
      laneSwitchProgress: 1,
    },
    platforms: [],
    stars,
    currentRide: null,
    gameOver: false,
    gameTime: 0,
    screenShake: 0,
    news: [],
    gameSpeed: config.settings.roadSpeed,
  };
};

const createPlatform = (availableAssets: Asset[]): Platform => {
  const laneIndex = Math.floor(Math.random() * GAME_CONFIG.LANE_COUNT);
  const isOpportunity = Math.random() > 0.4; // 60% chance of being an opportunity (long)
  const momentum = 0.5 + Math.random() * 1.5;
  const asset = availableAssets[Math.floor(Math.random() * availableAssets.length)];

  return {
    id: `platform-${Date.now()}-${Math.random()}`,
    y: GAME_CONFIG.HORIZON_Y,
    length: GAME_CONFIG.PLATFORM_BASE_LENGTH,
    laneIndex,
    isOpportunity,
    asset,
    momentum,
  };
};

export const useGameLogic = (config: GameConfig) => {
  const [gameState, setGameState] = useState<GameState>(() => getInitialState(config));
  const [gameSettings, setGameSettings] = useState(config.settings);
  const [isAutoHop, setIsAutoHop] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('momentum_news');

  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const newsTimeoutRef = useRef<number | undefined>(undefined);

  const getAvailableAssets = useCallback((): Asset[] => {
    if (gameSettings.allowedAssets === 'all') {
      return ASSETS;
    }
    return ASSETS.filter(a => gameSettings.allowedAssets.includes(a.kind));
  }, [gameSettings.allowedAssets]);

  const generateNews = useCallback(async () => {
    if (gameMode !== 'momentum_news' || gameState.gameOver) {
      return;
    }

    const availableAssets = getAvailableAssets();
    if (availableAssets.length === 0) return;

    const asset = availableAssets[Math.floor(Math.random() * availableAssets.length)];
    const impact = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.5);
    const headline = await generateHeadline(asset, impact);

    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      asset,
      headline,
      impact,
      timestamp: gameState.gameTime,
    };

    setGameState(prev => ({
      ...prev,
      news: [...prev.news.slice(-4), newItem],
      platforms: prev.platforms.map(p => {
        if (p.asset.symbol === asset.symbol) {
          return { ...p, momentum: Math.max(0.1, p.momentum + impact) };
        }
        return p;
      }),
    }));
  }, [gameMode, gameState.gameTime, gameState.gameOver, getAvailableAssets]);

  const scheduleNextNews = useCallback(() => {
    if (newsTimeoutRef.current) {
      clearTimeout(newsTimeoutRef.current);
    }
    if (gameMode === 'momentum_news' && !gameState.gameOver) {
      const nextNewsTime = 10000 + Math.random() * 10000;
      newsTimeoutRef.current = window.setTimeout(generateNews, nextNewsTime);
    }
  }, [gameMode, gameState.gameOver, generateNews]);

  useEffect(() => {
    scheduleNextNews();
    return () => {
      if (newsTimeoutRef.current) clearTimeout(newsTimeoutRef.current);
    };
  }, [scheduleNextNews, gameMode]);

  const update = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver) {
        return prev;
      }

      let newState: GameState = { ...prev, gameTime: prev.gameTime + 1 };
      newState.gameSpeed = gameSettings.roadSpeed * (1 + prev.gameTime / 30000);

      if (prev.player.currentLane !== prev.player.targetLane) {
        const diff = prev.player.targetLane - prev.player.currentLane;
        const move = Math.sign(diff) * GAME_CONFIG.PLAYER_LANE_SWITCH_SPEED;
        newState.player.currentLane = Math.abs(diff) < Math.abs(move) ? prev.player.targetLane : prev.player.currentLane + move;
      }

      newState.platforms = prev.platforms
        .map(p => ({ ...p, y: p.y + newState.gameSpeed }))
        .filter(p => p.y < GAME_CONFIG.PLATFORM_DESPAWN_Y);

      const lastPlatform = newState.platforms[newState.platforms.length - 1];
      if (!lastPlatform || lastPlatform.y > 50) {
        const availableAssets = getAvailableAssets();
        if (availableAssets.length > 0) {
          newState.platforms.push(createPlatform(availableAssets));
        }
      }

      if (prev.currentRide) {
        const { platform, entryScore } = prev.currentRide;
        const pnlDirection = platform.isOpportunity ? 1 : -1;
        const pnl = (platform.momentum - 1) * 10000 * pnlDirection;
        
        if (pnl < -(entryScore * gameSettings.stopPct)) {
          newState.score = prev.score - (entryScore * gameSettings.stopPct);
          newState.currentRide = null;
        } else {
          newState.currentRide = { ...prev.currentRide, currentScore: entryScore + pnl, pnl };
          newState.score = entryScore + pnl;
        }
      } else {
        const playerLane = Math.round(prev.player.currentLane);
        const ridePlatform = newState.platforms.find(
          p => p.laneIndex === playerLane && p.y > GAME_CONFIG.PLAYER_Y_POSITION && p.y < GAME_CONFIG.RIDE_ACTIVATION_Y
        );
        if (ridePlatform) {
          newState.currentRide = {
            platform: ridePlatform,
            entryScore: prev.score,
            currentScore: prev.score,
            pnl: 0,
          };
          newState.platforms = newState.platforms.filter(p => p.id !== ridePlatform.id);
        }
      }

      if (isAutoHop && !newState.currentRide) {
        const upcomingPlatforms = newState.platforms
          .filter(p => p.y > GAME_CONFIG.HORIZON_Y && p.y < GAME_CONFIG.PLAYER_Y_POSITION && p.momentum >= gameSettings.minMomentum)
          .sort((a, b) => a.y - b.y);
        if (upcomingPlatforms.length > 0) {
          newState.player.targetLane = upcomingPlatforms[0].laneIndex;
        }
      }

      newState.stars = prev.stars.map(s => {
        let newY = s.y + s.vy * newState.gameSpeed * 0.1;
        if (newY > GAME_CONFIG.CANVAS_HEIGHT) newY = 0;
        return { ...s, y: newY };
      });

      return newState;
    });
  }, [gameSettings, isAutoHop, getAvailableAssets]);

  useEffect(() => {
    let frameId: number;
    const gameLoop = () => {
      update();
      frameId = requestAnimationFrame(gameLoop);
    };
    gameLoop();
    return () => cancelAnimationFrame(frameId);
  }, [update]);

  const onLaneSwitch = (lane: number) => {
    if (isAutoHop) setIsAutoHop(false);
    setGameState(prev => ({ ...prev, player: { ...prev.player, targetLane: lane } }));
  };

  const onRestart = () => {
    setGameState(getInitialState(config));
  };

  const onAutoHopToggle = () => setIsAutoHop(prev => !prev);
  
  const onSettingsChange = (settings: { stopPct: number; minMomentum: number }) => {
    setGameSettings(prev => ({ ...prev, ...settings }));
  };
  
  const onGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'momentum_only') {
      if (newsTimeoutRef.current) clearTimeout(newsTimeoutRef.current);
      setGameState(prev => ({ ...prev, news: [] }));
    }
  };

  const currentRidePnl = gameState.currentRide ? gameState.currentRide.pnl : 0;

  return {
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
  };
};