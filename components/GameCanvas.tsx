import React, { useRef, useEffect } from 'react';
import { GameState } from '../types';
import { GAME_CONFIG } from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  onLaneSwitch: (lane: number) => void;
  onRestart: () => void;
}

const getLaneX = (laneIndex: number, y: number, canvasWidth: number) => {
  const perspective = (y - GAME_CONFIG.HORIZON_Y) / (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.HORIZON_Y);
  const roadWidth = GAME_CONFIG.ROAD_WIDTH_TOP + (GAME_CONFIG.ROAD_WIDTH_BOTTOM - GAME_CONFIG.ROAD_WIDTH_TOP) * perspective;
  const laneWidth = roadWidth / GAME_CONFIG.LANE_COUNT;
  return (canvasWidth / 2) + (laneIndex - Math.floor(GAME_CONFIG.LANE_COUNT / 2)) * laneWidth;
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onLaneSwitch, onRestart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      gameState.stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw road
      const roadPoints = [
        { x: (canvas.width - GAME_CONFIG.ROAD_WIDTH_BOTTOM) / 2, y: canvas.height },
        { x: (canvas.width - GAME_CONFIG.ROAD_WIDTH_TOP) / 2, y: GAME_CONFIG.HORIZON_Y },
        { x: (canvas.width + GAME_CONFIG.ROAD_WIDTH_TOP) / 2, y: GAME_CONFIG.HORIZON_Y },
        { x: (canvas.width + GAME_CONFIG.ROAD_WIDTH_BOTTOM) / 2, y: canvas.height },
      ];
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.moveTo(roadPoints[0].x, roadPoints[0].y);
      ctx.lineTo(roadPoints[1].x, roadPoints[1].y);
      ctx.lineTo(roadPoints[2].x, roadPoints[2].y);
      ctx.lineTo(roadPoints[3].x, roadPoints[3].y);
      ctx.closePath();
      ctx.fill();
      
      // Draw lane lines
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1;
      for (let i = 1; i < GAME_CONFIG.LANE_COUNT; i++) {
        const xTop = getLaneX(i - 0.5, GAME_CONFIG.HORIZON_Y, canvas.width);
        const xBottom = getLaneX(i - 0.5, canvas.height, canvas.width);
        ctx.beginPath();
        ctx.moveTo(xTop, GAME_CONFIG.HORIZON_Y);
        ctx.lineTo(xBottom, canvas.height);
        ctx.stroke();
      }

      // Draw platforms (sorted by Y for correct overlap)
      const sortedPlatforms = [...gameState.platforms].sort((a, b) => a.y - b.y);
      sortedPlatforms.forEach(platform => {
        const perspective = (platform.y - GAME_CONFIG.HORIZON_Y) / (canvas.height - GAME_CONFIG.HORIZON_Y);
        const width = (40 + 60 * perspective);
        const height = (5 + 15 * perspective);

        const x = getLaneX(platform.laneIndex, platform.y, canvas.width);
        
        const color = platform.isOpportunity ? '#10B981' : '#F87171';
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillRect(x - width / 2, platform.y - height / 2, width, height);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = 'white';
        ctx.font = `${10 + 6 * perspective}px "Space Grotesk", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(platform.asset.symbol, x, platform.y + (5 * perspective));
      });

      // Draw Player
      const playerY = GAME_CONFIG.PLAYER_Y_POSITION;
      const playerX = getLaneX(gameState.player.currentLane, playerY, canvas.width);
      ctx.fillStyle = '#00ffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(playerX, playerY - gameState.player.size);
      ctx.lineTo(playerX - gameState.player.size / 1.5, playerY + gameState.player.size / 2);
      ctx.lineTo(playerX + gameState.player.size / 1.5, playerY + gameState.player.size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    render();

  }, [gameState]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      
      const y = GAME_CONFIG.PLAYER_Y_POSITION;
      const perspective = (y - GAME_CONFIG.HORIZON_Y) / (GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.HORIZON_Y);
      const roadWidth = GAME_CONFIG.ROAD_WIDTH_TOP + (GAME_CONFIG.ROAD_WIDTH_BOTTOM - GAME_CONFIG.ROAD_WIDTH_TOP) * perspective;
      const roadStartX = (canvas.width - roadWidth) / 2;
      const laneWidth = roadWidth / GAME_CONFIG.LANE_COUNT;
      
      if(x > roadStartX && x < roadStartX + roadWidth){
          const clickedLane = Math.floor((x - roadStartX) / laneWidth);
          onLaneSwitch(clickedLane);
      }
  };

  return <canvas ref={canvasRef} width={GAME_CONFIG.CANVAS_WIDTH} height={GAME_CONFIG.CANVAS_HEIGHT} onClick={handleCanvasClick} className="w-full h-auto bg-black rounded-lg border border-gray-700 cursor-pointer" />;
};