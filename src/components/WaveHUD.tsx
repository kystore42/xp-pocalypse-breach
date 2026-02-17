import React from 'react';
import { useGameStore, WAVES } from '../store/gameStore';

const WaveHUD: React.FC = () => {
  const currentWave = useGameStore(s => s.currentWave);
  const waveTimeLeft = useGameStore(s => s.waveTimeLeft);
  const wavePaused = useGameStore(s => s.wavePaused);
  const wavesCompleted = useGameStore(s => s.wavesCompleted);
  const totalWaves = useGameStore(s => s.totalWaves);
  const startNextWave = useGameStore(s => s.startNextWave);
  const gameWon = useGameStore(s => s.gameWon);

  const wave = WAVES[currentWave] || WAVES[WAVES.length - 1];
  const minutes = Math.floor(waveTimeLeft / 60);
  const seconds = waveTimeLeft % 60;

  if (gameWon) return null;

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded px-3 py-2 text-[10px] font-mono border border-purple-500/50 text-purple-300">
      <div className="flex items-center gap-2 mb-1">
        <span>🌊 WAVE</span>
        <span className="font-bold text-[12px] text-purple-200">
          {currentWave + 1}/{totalWaves}
        </span>
      </div>
      <div className="text-[9px] text-purple-400 mb-1">{wave.name}</div>
      {!wavePaused ? (
        <div className="flex items-center gap-1">
          <span>⏱</span>
          <span className={`font-bold ${waveTimeLeft < 30 ? 'text-yellow-400 animate-pulse' : ''}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      ) : (
        <button
          onClick={startNextWave}
          className="w-full mt-1 px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-500 active:bg-green-700 animate-pulse"
        >
          ▶ START WAVE {currentWave + 1}
        </button>
      )}
    </div>
  );
};

export default WaveHUD;
