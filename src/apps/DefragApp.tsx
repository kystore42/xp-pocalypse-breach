import React, { useState, useEffect } from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const DefragApp: React.FC = () => {
  const defragGrid = useGameStore(s => s.defragGrid);
  const defragActive = useGameStore(s => s.defragActive);
  const defragScore = useGameStore(s => s.defragScore);
  const startDefrag = useGameStore(s => s.startDefrag);
  const moveDefragBlock = useGameStore(s => s.moveDefragBlock);
  const defragTick = useGameStore(s => s.defragTick);
  const { t } = useTranslation();

  const [dragging, setDragging] = useState<{ row: number; col: number } | null>(null);

  // Red blocks slowly expand
  useEffect(() => {
    if (!defragActive) return;
    const interval = setInterval(() => {
      defragTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [defragActive, defragTick]);

  const handleDragStart = (row: number, col: number) => {
    if (defragGrid[row]?.[col]?.type === 'blue') {
      setDragging({ row, col });
    }
  };

  const handleDrop = (row: number, col: number) => {
    if (dragging) {
      moveDefragBlock(dragging.row, dragging.col, row, col);
      setDragging(null);
    }
  };

  const getCellStyle = (type: string) => {
    switch (type) {
      case 'blue': return 'bg-blue-500 border-blue-300 cursor-grab active:cursor-grabbing hover:bg-blue-400 shadow-inner';
      case 'red': return 'bg-red-600 border-red-400 animate-pulse';
      case 'safe': return 'bg-green-200 border-green-400 border-dashed';
      default: return 'bg-gray-700 border-gray-600';
    }
  };

  const getCellLabel = (type: string) => {
    switch (type) {
      case 'blue': return '📦';
      case 'red': return '☠️';
      case 'safe': return '';
      default: return '';
    }
  };

  return (
    <XPWindow windowId="defrag" title={t('defrag.title')} icon="💾" width={520} height="400px">
      <div className="h-full flex flex-col bg-[#ece9d8] p-2 text-[11px]">
        {/* Instructions */}
        <div className="bg-white border border-gray-400 rounded p-2 mb-2">
          <div className="text-[10px] text-gray-600">{t('defrag.instruction')}</div>
        </div>

        {!defragActive && defragGrid.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={startDefrag}
              className="px-6 py-3 bg-[#316ac5] text-white font-bold rounded border border-[#2555a5] 
                hover:bg-[#2555a5] active:bg-[#1a4080] cursor-pointer text-[12px]"
            >
              {t('defrag.start')}
            </button>
          </div>
        ) : (
          <>
            {/* Status bar */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[10px]">
                {defragActive ? t('defrag.running') : '✅ Complete!'}
              </span>
              <span className="text-[10px] text-gray-600">
                {t('defrag.blueInSafe', { count: defragScore })}
              </span>
            </div>

            {/* Grid */}
            <div className="flex-1 bg-[#1a1a2e] border-2 border-gray-500 rounded p-2 flex flex-col gap-[3px]">
              {/* Column labels */}
              <div className="flex gap-[3px] mb-1 pl-[2px]">
                {Array.from({ length: 10 }, (_, c) => (
                  <div key={c} className={`flex-1 text-center text-[8px] ${c >= 8 ? 'text-green-400' : 'text-gray-500'}`}>
                    {c >= 8 ? '✅' : ''}
                  </div>
                ))}
              </div>

              {defragGrid.map((row, r) => (
                <div key={r} className="flex gap-[3px] flex-1">
                  {row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      draggable={cell.type === 'blue' && defragActive}
                      onDragStart={() => handleDragStart(r, c)}
                      onDragOver={(e) => {
                        if (dragging && (cell.type === 'empty' || cell.type === 'safe')) {
                          e.preventDefault();
                        }
                      }}
                      onDrop={() => handleDrop(r, c)}
                      onClick={() => {
                        if (dragging && (cell.type === 'empty' || cell.type === 'safe')) {
                          handleDrop(r, c);
                        } else if (cell.type === 'blue' && defragActive) {
                          handleDragStart(r, c);
                        }
                      }}
                      className={`flex-1 rounded-sm border flex items-center justify-center text-[10px] select-none
                        transition-colors duration-150
                        ${getCellStyle(cell.type)}
                        ${c >= 8 ? 'border-dashed' : ''}
                        ${dragging?.row === r && dragging?.col === c ? 'opacity-40 scale-90' : ''}
                      `}
                    >
                      {getCellLabel(cell.type)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-2 text-[9px] text-gray-500 justify-center">
              <span>🟦 = Your Data</span>
              <span>🟥 = Virus</span>
              <span>⬜ = Empty</span>
              <span>✅ = Safe Zone</span>
            </div>
          </>
        )}
      </div>
    </XPWindow>
  );
};

export default DefragApp;
