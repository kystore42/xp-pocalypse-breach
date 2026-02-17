import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const UpdateCenterApp: React.FC = () => {
  const upgrades = useGameStore(s => s.upgrades);
  const stabilityPoints = useGameStore(s => s.stabilityPoints);
  const purchaseUpgrade = useGameStore(s => s.purchaseUpgrade);
  const { t } = useTranslation();

  return (
    <XPWindow windowId="updateCenter" title={t('updateCenter.title')} icon="🛡️" width={460} height="350px">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3a6ea5] to-[#5a8ecc] p-3 text-white">
          <div className="text-[13px] font-bold">{t('updateCenter.header')}</div>
          <div className="text-[10px] opacity-80 mt-1">
            {t('updateCenter.subtitle')}
          </div>
          <div className="text-[11px] mt-2 font-bold">
            {t('updateCenter.stabilityPoints')}: <span className="text-yellow-300 text-[14px]">{stabilityPoints}</span>
          </div>
        </div>

        {/* Upgrade list */}
        <div className="flex-1 overflow-y-auto bg-white border border-gray-400 mx-1 my-1">
          {upgrades.map(upgrade => (
            <div 
              key={upgrade.id}
              className={`flex items-center p-2 border-b border-gray-100 text-[11px] ${
                upgrade.purchased ? 'bg-green-50 opacity-60' : 'hover:bg-[#e8e4d8]'
              }`}
            >
              <div className="text-2xl mr-3 flex-shrink-0">{upgrade.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[11px]">{t(`upgrade.${upgrade.id}.name`)}</div>
                <div className="text-[9px] text-gray-500 mt-[1px]">{t(`upgrade.${upgrade.id}.desc`)}</div>
              </div>
              <div className="flex-shrink-0 ml-2 text-right">
                {upgrade.purchased ? (
                  <span className="text-green-600 font-bold text-[10px]">{t('updateCenter.installed')}</span>
                ) : (
                  <button 
                    onClick={() => purchaseUpgrade(upgrade.id)}
                    disabled={stabilityPoints < upgrade.cost}
                    className={`px-3 py-1 rounded text-[10px] font-bold border transition-all ${
                      stabilityPoints >= upgrade.cost
                        ? 'bg-[#316ac5] text-white border-[#2555a5] hover:bg-[#2555a5] active:bg-[#1a4080]'
                        : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {upgrade.cost} SP
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mx-1 mb-1 p-2 bg-[#fffde7] border border-[#e6d85e] rounded text-[9px] text-gray-600">
          {t('updateCenter.infoTip')}
        </div>
      </div>
    </XPWindow>
  );
};

export default UpdateCenterApp;
