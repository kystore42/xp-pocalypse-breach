import React, { useState, useEffect, useRef } from 'react';
import { useGameStore, WAVES } from '../store/gameStore';

const SHOP_TIME = 30; // seconds between waves to shop

const WaveShopOverlay: React.FC = () => {
  const wavePaused = useGameStore(s => s.wavePaused);
  const currentWave = useGameStore(s => s.currentWave);
  const startNextWave = useGameStore(s => s.startNextWave);
  const stabilityPoints = useGameStore(s => s.stabilityPoints);
  const openWindow = useGameStore(s => s.openWindow);
  const gameWon = useGameStore(s => s.gameWon);
  const wavesCompleted = useGameStore(s => s.wavesCompleted);
  const resetGame = useGameStore(s => s.resetGame);
  const language = useGameStore(s => s.language);
  const startNewGamePlus = useGameStore(s => s.startNewGamePlus);
  const newGamePlusLevel = useGameStore(s => s.newGamePlusLevel);

  const [countdown, setCountdown] = useState(SHOP_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevWavePaused = useRef(false);

  // Reset countdown when wave pause starts
  useEffect(() => {
    if (wavePaused && !prevWavePaused.current) {
      setCountdown(SHOP_TIME);
    }
    prevWavePaused.current = wavePaused;
  }, [wavePaused]);

  // Countdown timer during shop phase
  useEffect(() => {
    if (!wavePaused || gameWon) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          startNextWave();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [wavePaused, gameWon, startNextWave]);

  // Victory screen
  if (gameWon) {
    return (
      <div className="absolute inset-0 z-[9000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative bg-gradient-to-b from-[#1a1a3e] to-[#0a0a2e] border-2 border-yellow-400 rounded-lg p-8 text-center max-w-md shadow-2xl">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-yellow-400 text-xl font-bold mb-2">
            {language === 'uk' ? 'СИСТЕМУ ЗАХИЩЕНО!' : 'SYSTEM DEFENDED!'}
          </h2>
          <p className="text-gray-300 text-sm mb-4">
            {language === 'uk'
              ? `Ви пережили всі ${WAVES.length} хвиль і захистили мережу від ШІ-хакера!`
              : `You survived all ${WAVES.length} waves and protected the network from the AI hacker!`}
          </p>
          <div className="text-yellow-300 text-lg font-bold mb-4">
            {language === 'uk' ? 'Фінальні ОС' : 'Final SP'}: {stabilityPoints}
          </div>
          {newGamePlusLevel > 0 && (
            <div className="text-purple-300 text-[11px] mb-2">
              New Game+ Level {newGamePlusLevel}
            </div>
          )}
          <div className="flex gap-2 justify-center">
            <button
              onClick={resetGame}
              className="px-5 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 text-sm"
            >
              {language === 'uk' ? 'СПОЧАТКУ' : 'RESTART'}
            </button>
            <button
              onClick={startNewGamePlus}
              className="px-5 py-2 bg-purple-600 text-white font-bold rounded hover:bg-purple-500 text-sm border border-purple-400"
            >
              ⭐ NG+ {(newGamePlusLevel || 0) + 1}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!wavePaused) return null;

  const nextWave = WAVES[currentWave];
  const isUrgent = countdown <= 10;

  return (
    <div className="absolute inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-gradient-to-b from-[#1a1a3e] to-[#0a0a2e] border-2 border-blue-400 rounded-lg p-6 text-center max-w-md shadow-2xl">
        <div className="text-3xl mb-2">🛒</div>
        <h2 className="text-blue-300 text-xl font-bold mb-1">
          {language === 'uk' ? `ХВИЛЯ ${wavesCompleted} ЗАВЕРШЕНА!` : `WAVE ${wavesCompleted} COMPLETE!`}
        </h2>
        <p className="text-gray-400 text-[13px] mb-3">
          {language === 'uk'
            ? 'Підготуйтесь до наступної хвилі. Витратьте ОС на покращення!'
            : 'Prepare for the next wave. Spend your SP on upgrades!'}
        </p>

        {/* Countdown timer */}
        <div className={`text-center mb-3 text-[15px] font-bold ${isUrgent ? 'text-red-400 animate-pulse' : 'text-orange-300'}`}>
          ⏱️ {language === 'uk' ? 'Наступна хвиля через' : 'Next wave in'}: {countdown}s
        </div>

        <div className="text-yellow-300 text-sm font-bold mb-4">
          {language === 'uk' ? 'Доступно ОС' : 'Available SP'}: {stabilityPoints}
        </div>

        {/* Quick shop buttons */}
        <div className="flex gap-2 mb-4 justify-center flex-wrap">
          <button
            onClick={() => openWindow('updateCenter')}
            className="px-4 py-2 bg-[#316ac5] text-white text-[13px] rounded hover:bg-[#2555a5] border border-[#4178be]"
          >
            🛡️ {language === 'uk' ? 'Софт' : 'Software'}
          </button>
          <button
            onClick={() => openWindow('hardwareShop')}
            className="px-4 py-2 bg-[#316ac5] text-white text-[13px] rounded hover:bg-[#2555a5] border border-[#4178be]"
          >
            🔧 {language === 'uk' ? 'Залізо' : 'Hardware'}
          </button>
        </div>

        {/* Next wave info */}
        {nextWave && (
          <div className="bg-black/30 rounded p-3 mb-4 text-[12px] text-gray-300">
            <div className="text-blue-300 font-bold mb-1">
              {language === 'uk'
                ? `Далі: Хвиля ${nextWave.id} — ${nextWave.name}`
                : `Next: Wave ${nextWave.id} — ${nextWave.name}`}
            </div>
            <div>
              {language === 'uk' ? 'Тривалість' : 'Duration'}: {Math.floor(nextWave.duration / 60)}m {nextWave.duration % 60}s
            </div>
            <div>
              {language === 'uk' ? 'Загроза' : 'Threat Level'}: {'🔴'.repeat(Math.min(5, Math.ceil(nextWave.breachRateMultiplier * 2.5)))}{'⚫'.repeat(Math.max(0, 5 - Math.ceil(nextWave.breachRateMultiplier * 2.5)))}
            </div>
          </div>
        )}

        <button
          onClick={startNextWave}
          className="px-8 py-2.5 bg-green-600 text-white font-bold rounded hover:bg-green-500 active:bg-green-700 text-base"
        >
          ▶ {language === 'uk' ? `ПОЧАТИ ХВИЛЮ ${currentWave + 1}` : `START WAVE ${currentWave + 1}`}
        </button>
      </div>
    </div>
  );
};

export default WaveShopOverlay;
