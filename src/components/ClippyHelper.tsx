import React from 'react';
import { useGameStore } from '../store/gameStore';
import AnimatedClippySVG from './AnimatedClippySVG';
import type { ClippyExpression } from './AnimatedClippySVG';

const ClippyHelper: React.FC = () => {
  const clippyVisible = useGameStore(s => s.clippyVisible);
  const clippyMessage = useGameStore(s => s.clippyMessage);
  const clippyDisabled = useGameStore(s => s.clippyDisabled);
  const dismissClippy = useGameStore(s => s.dismissClippy);
  const disableClippy = useGameStore(s => s.disableClippy);
  const language = useGameStore(s => s.language);

  if (clippyDisabled || !clippyVisible || !clippyMessage) return null;

  const typeColors: Record<string, string> = {
    tip: 'border-yellow-400 bg-gradient-to-b from-[#fffde7] to-[#fff9c4]',
    warning: 'border-red-400 bg-gradient-to-b from-[#ffebee] to-[#fce4ec]',
    joke: 'border-blue-400 bg-gradient-to-b from-[#e3f2fd] to-[#bbdefb]',
  };

  const borderColor = typeColors[clippyMessage.type] || typeColors.tip;

  // Map message type to SVG expression
  const expressionMap: Record<string, ClippyExpression> = {
    tip: 'thinking',
    warning: 'alert',
    joke: 'happy',
  };
  const expression = expressionMap[clippyMessage.type] || 'idle';

  return (
    <div className="absolute bottom-12 right-4 z-[7500] flex items-end gap-2"
      style={{ animation: 'clippy-in 0.4s ease-out' }}>
      {/* Animated Clippy SVG character */}
      <div className="flex flex-col items-center">
        <AnimatedClippySVG expression={expression} size={56} />
        <div className="text-[8px] text-white/60 font-bold mt-[-4px]">Clippy</div>
      </div>

      {/* Speech bubble */}
      <div className={`relative max-w-[280px] rounded-lg border-2 p-3 shadow-lg ${borderColor}`}>
        {/* Triangle pointer */}
        <div className="absolute -left-2 bottom-4 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-yellow-400 border-b-[6px] border-b-transparent" />

        <p className="text-[13px] text-gray-800 leading-snug mb-2">
          {clippyMessage.text}
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={disableClippy}
            className="px-2 py-0.5 text-[9px] text-gray-400 hover:text-red-500 border border-gray-300 rounded"
            title={language === 'uk' ? 'Вимкнути (10 SP)' : 'Disable (10 SP)'}
          >
            🚫 {language === 'uk' ? 'Вимк.' : 'Off'}
          </button>
          <button
            onClick={dismissClippy}
            className="px-3 py-0.5 bg-[#316ac5] text-white text-[10px] font-bold rounded hover:bg-[#2555a5]"
          >
            OK
          </button>
        </div>
      </div>

      <style>{`
        @keyframes clippy-in {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes clippy-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default ClippyHelper;
