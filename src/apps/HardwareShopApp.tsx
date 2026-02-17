import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';

const HardwareShopApp: React.FC = () => {
  const hardware = useGameStore(s => s.hardware);
  const stabilityPoints = useGameStore(s => s.stabilityPoints);
  const upgradeHardware = useGameStore(s => s.upgradeHardware);

  return (
    <XPWindow windowId="hardwareShop" title="Hardware Shop" icon="🔧" width={480} height="400px">
      <div className="flex flex-col h-full bg-[#ECE9D8] text-black text-xs">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A246A] to-[#3A6EA5] text-white px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔧</span>
          <span className="font-bold text-[11px]">Hardware Shop — Device Upgrades</span>
        </div>
        <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">
          {stabilityPoints} SP
        </span>
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {hardware.map(item => {
          const isMaxed = item.level >= item.maxLevel;
          const cost = item.cost * (item.level + 1);
          const canAfford = stabilityPoints >= cost;

          return (
            <div
              key={item.id}
              className="border border-gray-400 bg-white rounded p-2 flex items-center gap-3"
            >
              {/* Icon */}
              <div className="text-2xl w-10 h-10 flex items-center justify-center bg-[#D6DFF7] rounded border border-[#8DB2E3]">
                {item.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[11px] flex items-center gap-2">
                  {item.name}
                  {/* Level pips */}
                  <span className="flex gap-0.5 ml-1">
                    {Array.from({ length: item.maxLevel }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full border ${
                          i < item.level
                            ? 'bg-green-500 border-green-700'
                            : 'bg-gray-200 border-gray-400'
                        }`}
                      />
                    ))}
                  </span>
                </div>
                <div className="text-[10px] text-gray-600 truncate">{item.description}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Lvl {item.level}/{item.maxLevel}
                  {!isMaxed && <span className="ml-2 text-blue-700 font-bold">Cost: {cost} SP</span>}
                </div>
              </div>

              {/* Button */}
              <button
                disabled={isMaxed || !canAfford}
                onClick={() => upgradeHardware(item.id)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded border shadow-sm min-w-[70px]
                  ${isMaxed
                    ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                    : canAfford
                      ? 'bg-[#D6DFF7] text-[#0A246A] border-[#8DB2E3] hover:bg-[#B9CDE5] active:bg-[#8DB2E3] cursor-pointer'
                      : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                  }`}
              >
                {isMaxed ? 'MAX' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div className="border-t border-gray-400 bg-[#F1EFE2] px-3 py-1 text-[10px] text-gray-500">
        💡 Hardware upgrades persist through the game. Costs increase per level.
      </div>
      </div>
    </XPWindow>
  );
};

export default HardwareShopApp;
