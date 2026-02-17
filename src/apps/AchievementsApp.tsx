import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';

const AchievementsApp: React.FC = () => {
  const achievements = useGameStore(s => s.achievements);
  const language = useGameStore(s => s.language);

  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <XPWindow windowId="achievements" title={language === 'uk' ? '🏆 Досягнення' : '🏆 Achievements'} icon="🏆" width={380} height="400px">
      <div className="h-full flex flex-col bg-[#ECE9D8]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e8e4d8] to-[#d6d2c2] border-b p-2 flex items-center justify-between">
          <span className="text-[12px] font-bold text-gray-700">
            🏆 {language === 'uk' ? 'Досягнення' : 'Achievements'}
          </span>
          <span className="text-[10px] text-gray-500">
            {unlocked}/{achievements.length} {language === 'uk' ? 'розблоковано' : 'unlocked'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="px-3 pt-2 pb-1">
          <div className="w-full h-[8px] bg-gray-300 rounded overflow-hidden border border-gray-400">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
              style={{ width: `${(unlocked / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievements list */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {achievements.map(a => (
            <div
              key={a.id}
              className={`flex items-start gap-2 p-2 mb-1 rounded border transition-all ${
                a.unlocked
                  ? 'bg-white border-yellow-400 shadow-sm'
                  : 'bg-gray-100 border-gray-300 opacity-60'
              }`}
            >
              {/* Icon */}
              <div className={`text-[20px] flex-shrink-0 ${a.unlocked ? '' : 'grayscale'}`}>
                {a.unlocked ? a.icon : '🔒'}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className={`text-[11px] font-bold ${a.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {a.name}
                  </span>
                  {a.unlocked && (
                    <span className="text-[9px] text-yellow-600 bg-yellow-100 px-1 rounded">✅</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">{a.description}</p>
                <div className="text-[9px] text-yellow-600 mt-0.5">
                  {language === 'uk' ? 'Нагорода' : 'Reward'}: +{a.reward} SP
                </div>
              </div>

              {/* Unlocked badge */}
              {a.unlocked && (
                <div className="flex-shrink-0 text-yellow-500 text-[14px]">⭐</div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-[#e8e4d8] to-[#d6d2c2] border-t p-2 text-center">
          <span className="text-[9px] text-gray-500">
            {language === 'uk'
              ? 'Досягнення дають бонусні SP за виконання'
              : 'Achievements grant bonus SP when completed'}
          </span>
        </div>
      </div>
    </XPWindow>
  );
};

export default AchievementsApp;
