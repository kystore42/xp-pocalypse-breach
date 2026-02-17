import React from 'react';
import { useGameStore, WAVES } from '../store/gameStore';

const WaveShopOverlay: React.FC = () => {
  const wavePaused = useGameStore(s => s.wavePaused);
  const currentWave = useGameStore(s => s.currentWave);
  const startNextWave = useGameStore(s => s.startNextWave);
  const stabilityPoints = useGameStore(s => s.stabilityPoints);
  const openWindow = useGameStore(s => s.openWindow);
  const gameWon = useGameStore(s => s.gameWon);
  const wavesCompleted = useGameStore(s => s.wavesCompleted);
  const resetGame = useGameStore(s => s.resetGame);

  // Victory screen
  if (gameWon) {
    return (
      <div className="absolute inset-0 z-[9000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative bg-gradient-to-b from-[#1a1a3e] to-[#0a0a2e] border-2 border-yellow-400 rounded-lg p-8 text-center max-w-md shadow-2xl">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-yellow-400 text-xl font-bold mb-2">SYSTEM DEFENDED!</h2>
          <p className="text-gray-300 text-sm mb-4">
            You survived all {WAVES.length} waves and protected the network from the AI hacker!
          </p>
          <div className="text-yellow-300 text-lg font-bold mb-4">
            Final SP: {stabilityPoints}
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  if (!wavePaused) return null;

  const nextWave = WAVES[currentWave];

  return (
    <div className="absolute inset-0 z-[9000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-gradient-to-b from-[#1a1a3e] to-[#0a0a2e] border-2 border-blue-400 rounded-lg p-6 text-center max-w-md shadow-2xl">
        <div className="text-3xl mb-2">🛒</div>
        <h2 className="text-blue-300 text-lg font-bold mb-1">WAVE {wavesCompleted} COMPLETE!</h2>
        <p className="text-gray-400 text-[11px] mb-4">
          Prepare for the next wave. Spend your SP on upgrades!
        </p>

        <div className="text-yellow-300 text-sm font-bold mb-4">
          Available SP: {stabilityPoints}
        </div>

        {/* Quick shop buttons */}
        <div className="flex gap-2 mb-4 justify-center flex-wrap">
          <button
            onClick={() => openWindow('updateCenter')}
            className="px-3 py-1.5 bg-[#316ac5] text-white text-[11px] rounded hover:bg-[#2555a5] border border-[#4178be]"
          >
            🛡️ Software
          </button>
          <button
            onClick={() => openWindow('hardwareShop')}
            className="px-3 py-1.5 bg-[#316ac5] text-white text-[11px] rounded hover:bg-[#2555a5] border border-[#4178be]"
          >
            🔧 Hardware
          </button>
        </div>

        {/* Next wave info */}
        {nextWave && (
          <div className="bg-black/30 rounded p-2 mb-4 text-[10px] text-gray-300">
            <div className="text-blue-300 font-bold mb-1">Next: Wave {nextWave.id} — {nextWave.name}</div>
            <div>Duration: {Math.floor(nextWave.duration / 60)}m {nextWave.duration % 60}s</div>
            <div>Threat Level: {'🔴'.repeat(Math.min(5, Math.ceil(nextWave.breachRateMultiplier * 2.5)))}{'⚫'.repeat(Math.max(0, 5 - Math.ceil(nextWave.breachRateMultiplier * 2.5)))}</div>
          </div>
        )}

        <button
          onClick={startNextWave}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-500 active:bg-green-700 text-sm"
        >
          ▶ START WAVE {currentWave + 1}
        </button>
      </div>
    </div>
  );
};

export default WaveShopOverlay;
