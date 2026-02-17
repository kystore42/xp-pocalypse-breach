import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const ErrorPopups: React.FC = () => {
  const errorPopups = useGameStore(s => s.errorPopups);
  const dismissErrorPopup = useGameStore(s => s.dismissErrorPopup);
  const { t } = useTranslation();

  return (
    <>
      {errorPopups.map(err => (
        <div
          key={err.id}
          className="absolute z-[300] select-none animate-bounce-in"
          style={{ left: err.x, top: err.y }}
        >
          <div className="bg-[#ece9d8] border-2 border-[#0058e6] shadow-xl rounded-t-lg w-[340px]">
            {/* Title bar */}
            <div className="bg-gradient-to-r from-[#c82020] to-[#ff6060] h-[22px] flex items-center px-2 justify-between rounded-t">
              <span className="text-white font-bold text-[10px]">{t('error.title')}</span>
              <button 
                onClick={() => dismissErrorPopup(err.id)}
                className="bg-[#e97b4b] border border-white/50 text-white w-4 h-3 flex items-center justify-center text-[9px] hover:bg-[#ff4500]"
              >
                ×
              </button>
            </div>
            {/* Content */}
            <div className="p-3 flex gap-3 items-start">
              <span className="text-3xl">❌</span>
              <div className="text-[10px]">
                <div className="font-bold text-red-700 mb-1">{t('error.fatalError')}</div>
                <div className="font-mono text-[9px] text-gray-700 bg-gray-100 p-1 rounded border">
                  STOP: {err.code}<br />
                  {err.message}
                </div>
              </div>
            </div>
            <div className="p-2 bg-[#ece9d8] border-t flex justify-center">
              <button 
                onClick={() => dismissErrorPopup(err.id)}
                className="px-6 py-[2px] bg-[#ece9d8] border border-gray-400 rounded text-[10px] hover:bg-[#ddd] active:bg-[#ccc] shadow-sm"
              >
                {t('error.ok')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ErrorPopups;
