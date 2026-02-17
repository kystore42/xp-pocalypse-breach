import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const GameOverScreen: React.FC = () => {
  const gameOver = useGameStore(s => s.gameOver);
  const bsodMinigame = useGameStore(s => s.bsodMinigame);
  const bsodErrors = useGameStore(s => s.bsodErrors);
  const bsodCaughtCount = useGameStore(s => s.bsodCaughtCount);
  const bsodTotalErrors = useGameStore(s => s.bsodTotalErrors);
  const bsodTimeLeft = useGameStore(s => s.bsodTimeLeft);
  const catchBSODError = useGameStore(s => s.catchBSODError);
  const bsodTick = useGameStore(s => s.bsodTick);
  const gameTime = useGameStore(s => s.gameTime);
  const stabilityPoints = useGameStore(s => s.stabilityPoints);
  const resetGame = useGameStore(s => s.resetGame);
  const { t } = useTranslation();

  // BSOD minigame animation loop
  useEffect(() => {
    if (!bsodMinigame) return;
    const interval = setInterval(() => {
      bsodTick();
    }, 50); // ~20 FPS
    return () => clearInterval(interval);
  }, [bsodMinigame, bsodTick]);

  // --- BSOD MINI-GAME MODE ---
  if (bsodMinigame) {
    return (
      <div className="absolute inset-0 z-[9999]">
        <div className="absolute inset-0 bg-[#000080]" />

        {/* Header */}
        <div className="relative z-10 text-center pt-4">
          <div className="text-white text-[16px] font-mono font-bold animate-pulse">
            {t('bsod.catchErrors')}
          </div>
          <div className="flex justify-center gap-8 mt-2 text-[14px] font-mono">
            <span className="text-yellow-300">{t('bsod.caught', { caught: bsodCaughtCount, total: bsodTotalErrors })}</span>
            <span className={`${bsodTimeLeft < 5 ? 'text-red-400 animate-pulse' : 'text-green-300'}`}>
              {t('bsod.timeLeft', { time: Math.ceil(bsodTimeLeft) })}
            </span>
          </div>
        </div>

        {/* Moving error codes */}
        {bsodErrors.filter(e => !e.caught).map(err => (
          <button
            key={err.id}
            onClick={() => catchBSODError(err.id)}
            className="absolute px-3 py-2 bg-red-700/80 border-2 border-red-400 text-white font-mono text-[11px] 
              cursor-pointer hover:bg-red-500 hover:scale-110 active:scale-95 transition-transform rounded shadow-lg"
            style={{
              left: `${err.x}px`,
              top: `${err.y}px`,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            ⚠ {err.code}
          </button>
        ))}

        {/* Caught errors (visible as "fixed") */}
        {bsodErrors.filter(e => e.caught).map(err => (
          <div
            key={err.id}
            className="absolute px-3 py-2 bg-green-700/50 border border-green-400 text-green-300 font-mono text-[11px] rounded line-through opacity-50"
            style={{
              left: `${err.x}px`,
              top: `${err.y}px`,
            }}
          >
            ✅ {err.code}
          </div>
        ))}
      </div>
    );
  }

  // --- REAL GAME OVER (if BSOD mini-game failed) ---
  if (!gameOver) return null;

  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;

  return (
    <div className="absolute inset-0 z-[9999] flex items-center justify-center">
      {/* BSOD background */}
      <div className="absolute inset-0 bg-[#000080]" />
      
      <div className="relative text-white font-mono text-[14px] max-w-[600px] p-8 leading-relaxed">
        <div className="text-center mb-6">
          <div className="text-[16px] bg-[#a0a0a0] text-[#000080] px-4 py-1 inline-block font-bold">
            Windows
          </div>
        </div>

        <p>{t('gameOver.fatalException')}</p>
        <p className="mt-4">{t('gameOver.fullBreach')}</p>
        <p className="mt-2">
          {t('gameOver.breachStatus')}
        </p>

        <p className="mt-6 text-yellow-300">
          {t('gameOver.survivalTime', { time: `${minutes}m ${seconds}s` })}
        </p>
        <p className="text-yellow-300">
          {t('gameOver.pointsEarned', { points: stabilityPoints })}
        </p>

        <div className="mt-8 text-center">
          <p>{t('gameOver.pressRestart')}</p>
          <button
            onClick={resetGame}
            className="mt-4 px-8 py-2 bg-[#a0a0a0] text-[#000080] font-bold text-[12px] hover:bg-white active:bg-[#808080] cursor-pointer"
          >
            {t('gameOver.restartButton')}
          </button>
        </div>

        <p className="mt-8 text-[10px] text-[#a0a0a0]">
          {t('gameOver.ctrlAltDel')}
        </p>
      </div>
    </div>
  );
};

export default GameOverScreen;
