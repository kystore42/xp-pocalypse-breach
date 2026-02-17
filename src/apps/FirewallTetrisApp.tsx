import React, { useEffect, useRef } from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';

const COLS = 6;
const ROWS = 10;
const CELL_SIZE = 40;

const FirewallTetrisApp: React.FC = () => {
  const fwTetrisActive = useGameStore(s => s.fwTetrisActive);
  const fwTetrisPackets = useGameStore(s => s.fwTetrisPackets);
  const fwTetrisScore = useGameStore(s => s.fwTetrisScore);
  const fwTetrisMissed = useGameStore(s => s.fwTetrisMissed);
  const fwTetrisTimeLeft = useGameStore(s => s.fwTetrisTimeLeft);
  const fwTetrisClick = useGameStore(s => s.fwTetrisClick);
  const fwTetrisTick = useGameStore(s => s.fwTetrisTick);
  const startFirewallTetris = useGameStore(s => s.startFirewallTetris);
  const language = useGameStore(s => s.language);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (fwTetrisActive) {
      intervalRef.current = window.setInterval(() => {
        fwTetrisTick();
      }, 200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fwTetrisActive, fwTetrisTick]);

  if (!fwTetrisActive) {
    return (
      <XPWindow windowId="firewallTetris" title="🧱 Firewall Tetris" icon="🧱" width={300} height="480px">
        <div className="p-4 text-center">
          <div className="text-3xl mb-2">🧱</div>
          <h3 className="text-[13px] font-bold text-gray-800 mb-2">
            {language === 'uk' ? 'Firewall Тетріс' : 'Firewall Tetris'}
          </h3>
          <p className="text-[10px] text-gray-600 mb-3 leading-snug">
            {language === 'uk'
              ? 'Блокуйте червоні пакети (шкідливі), пропускайте зелені (легітимні). Натискайте на червоні!'
              : 'Block red packets (malicious), let green ones pass. Click red packets to block them!'}
          </p>
          <button
            onClick={startFirewallTetris}
            className="px-4 py-2 bg-[#316ac5] text-white font-bold text-[12px] rounded hover:bg-[#2555a5]"
          >
            ▶ {language === 'uk' ? 'СТАРТ' : 'START'}
          </button>
        </div>
      </XPWindow>
    );
  }

  const minutes = Math.floor(fwTetrisTimeLeft / 60);
  const seconds = fwTetrisTimeLeft % 60;

  return (
    <XPWindow windowId="firewallTetris" title="🧱 Firewall Tetris" icon="🧱" width={300} height="480px">
    <div className="p-2">
      {/* HUD */}
      <div className="flex justify-between mb-2 text-[10px] font-mono">
        <span className="text-green-600 font-bold">
          ✅ {language === 'uk' ? 'Рахунок' : 'Score'}: {fwTetrisScore}
        </span>
        <span className="text-yellow-600 font-bold">
          ⏱ {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <span className="text-red-600 font-bold">
          ❌ {language === 'uk' ? 'Пропущено' : 'Missed'}: {fwTetrisMissed}
        </span>
      </div>

      {/* Game grid */}
      <div
        className="relative border-2 border-gray-400 bg-[#0a0a2e] mx-auto"
        style={{
          width: COLS * CELL_SIZE,
          height: ROWS * CELL_SIZE,
        }}
      >
        {/* Grid lines */}
        {Array.from({ length: COLS - 1 }).map((_, i) => (
          <div
            key={`v${i}`}
            className="absolute top-0 bottom-0 border-l border-gray-700/30"
            style={{ left: (i + 1) * CELL_SIZE }}
          />
        ))}
        {Array.from({ length: ROWS - 1 }).map((_, i) => (
          <div
            key={`h${i}`}
            className="absolute left-0 right-0 border-t border-gray-700/30"
            style={{ top: (i + 1) * CELL_SIZE }}
          />
        ))}

        {/* Packets */}
        {fwTetrisPackets.map(packet => (
          <button
            key={packet.id}
            onClick={() => fwTetrisClick(packet.id)}
            className={`absolute rounded-sm border font-mono text-[9px] font-bold flex items-center justify-center
              transition-all duration-150 cursor-pointer
              ${packet.type === 'bad'
                ? 'bg-red-600/80 border-red-400 text-white hover:bg-red-500 hover:scale-110'
                : 'bg-green-600/80 border-green-400 text-white hover:bg-green-500'}
            `}
            style={{
              left: packet.col * CELL_SIZE + 2,
              top: packet.row * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
            }}
            title={packet.type === 'bad' ? 'BLOCK THIS!' : 'Let pass'}
          >
            <div className="flex flex-col items-center">
              <span>{packet.type === 'bad' ? '🔴' : '🟢'}</span>
              <span className="text-[7px]">{packet.label}</span>
            </div>
          </button>
        ))}

        {/* Firewall line at bottom */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400/60"
          style={{ bottom: CELL_SIZE }}
        />
        <div className="absolute left-1 text-[8px] text-yellow-400/60 font-bold"
          style={{ bottom: CELL_SIZE + 2 }}>
          ─── FIREWALL ───
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2 text-[9px]">
        <span><span className="inline-block w-3 h-3 bg-red-600 rounded-sm mr-1" />
          {language === 'uk' ? 'Блокуй!' : 'Block!'}</span>
        <span><span className="inline-block w-3 h-3 bg-green-600 rounded-sm mr-1" />
          {language === 'uk' ? 'Пропусти' : 'Let pass'}</span>
      </div>
    </div>
    </XPWindow>
  );
};

export default FirewallTetrisApp;
