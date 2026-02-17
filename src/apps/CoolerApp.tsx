import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const CoolerApp: React.FC = () => {
  const cpuTemp = useGameStore(s => s.cpuTemp);
  const dustLevel = useGameStore(s => s.dustLevel);
  const minerActive = useGameStore(s => s.minerActive);
  const liquidCoolingActive = useGameStore(s => s.liquidCoolingActive);
  const clickCooler = useGameStore(s => s.clickCooler);
  const { t } = useTranslation();

  const tempColor = cpuTemp > 85 ? 'text-red-500' : cpuTemp > 65 ? 'text-orange-400' : 'text-green-500';
  const tempStatus = cpuTemp > 85 ? t('cooler.critical') : cpuTemp > 65 ? t('cooler.hot') : t('cooler.normal');
  const tempBarWidth = Math.min(100, (cpuTemp / 105) * 100);
  const dustBarWidth = Math.min(100, dustLevel);

  return (
    <XPWindow windowId="cooler" title={t('cooler.title')} icon="🖥️" width={420} height="360px">
      <div className="h-full flex flex-col bg-[#ece9d8] p-2 gap-2 text-[11px]">
        {/* Miner warning */}
        {minerActive && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 text-[10px] font-bold animate-pulse rounded">
            {t('cooler.minerWarning')}
          </div>
        )}

        {/* Temperature gauge */}
        <div className="bg-white border border-gray-400 rounded p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">{t('cooler.cpuTemp')}</span>
            <span className={`font-bold text-[14px] ${tempColor}`}>{cpuTemp.toFixed(1)}°C</span>
          </div>
          <div className="w-full h-[14px] bg-gray-200 rounded overflow-hidden border border-gray-300">
            <div 
              className={`h-full transition-all duration-300 ${
                cpuTemp > 85 ? 'bg-red-500 animate-pulse' : cpuTemp > 65 ? 'bg-orange-400' : 'bg-green-500'
              }`}
              style={{ width: `${tempBarWidth}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-gray-500">
            <span>20°C</span>
            <span>{t('cooler.status')}: {tempStatus}</span>
            <span>105°C</span>
          </div>
        </div>

        {/* Dust level */}
        <div className="bg-white border border-gray-400 rounded p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">{t('cooler.dustLevel')}</span>
            <span className="text-gray-600">{dustLevel.toFixed(0)}%</span>
          </div>
          <div className="w-full h-[10px] bg-gray-200 rounded overflow-hidden border border-gray-300">
            <div 
              className={`h-full transition-all duration-300 ${
                dustLevel > 60 ? 'bg-yellow-600' : 'bg-gray-400'
              }`}
              style={{ width: `${dustBarWidth}%` }}
            />
          </div>
        </div>

        {/* Liquid cooling status */}
        {liquidCoolingActive && (
          <div className="bg-blue-50 border border-blue-300 text-blue-700 px-2 py-1 text-[10px] rounded flex items-center gap-1">
            {t('cooler.liquidCooling')}
          </div>
        )}

        {/* Fan grid — clickable coolers */}
        <div className="bg-[#2a2a2a] border border-gray-600 rounded p-3 flex-1">
          <div className="text-center text-gray-400 text-[9px] mb-2">{t('cooler.clickFan')}</div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                onClick={clickCooler}
                className="aspect-square bg-[#1a1a1a] border-2 border-gray-600 rounded-full flex items-center justify-center 
                  hover:border-cyan-400 hover:bg-[#0a2a3a] active:bg-cyan-900 active:scale-95 
                  transition-all cursor-pointer select-none"
                style={{
                  animation: `spin ${3 + i * 0.5}s linear infinite`,
                }}
              >
                <span className="text-[28px]" style={{ filter: dustLevel > 60 ? 'opacity(0.5) blur(1px)' : 'none' }}>
                  🌀
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </XPWindow>
  );
};

export default CoolerApp;
