import React from 'react';
import { useGameStore, type Difficulty } from '../store/gameStore';

const DIFF_INFO: Record<Difficulty, { label: string; labelUk: string; desc: string; descUk: string; color: string; stars: number }> = {
  easy: {
    label: 'Easy',
    labelUk: 'Легко',
    desc: 'Slower hacker, +30 starting SP, fewer nodes',
    descUk: 'Повільніший хакер, +30 ОС, менше вузлів',
    color: 'bg-green-500 border-green-600',
    stars: 1,
  },
  normal: {
    label: 'Normal',
    labelUk: 'Нормально',
    desc: 'Standard experience — balanced challenge',
    descUk: 'Стандартний досвід — збалансований виклик',
    color: 'bg-yellow-500 border-yellow-600',
    stars: 2,
  },
  hard: {
    label: 'Hard',
    labelUk: 'Складно',
    desc: 'Faster hacker, no starting SP, extra nodes',
    descUk: 'Швидший хакер, без стартових ОС, більше вузлів',
    color: 'bg-red-500 border-red-600',
    stars: 3,
  },
};

interface DifficultySelectProps {
  onSelected: () => void;
}

const DifficultySelect: React.FC<DifficultySelectProps> = ({ onSelected }) => {
  const difficulty = useGameStore(s => s.difficulty);
  const setDifficulty = useGameStore(s => s.setDifficulty);
  const language = useGameStore(s => s.language);

  const handleSelect = (d: Difficulty) => {
    setDifficulty(d);
    onSelected();
  };

  return (
    <div className="absolute inset-0 z-[9500] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#000080]" />
      <div className="relative bg-gradient-to-b from-[#ECE9D8] to-[#d6d2c2] rounded-lg border-2 border-[#0055ea] shadow-2xl p-6 max-w-sm w-full">
        <div className="text-center mb-4">
          <div className="text-2xl mb-1">🖥️</div>
          <h2 className="text-[14px] font-bold text-gray-800">
            {language === 'uk' ? 'Оберіть складність' : 'Select Difficulty'}
          </h2>
          <p className="text-[10px] text-gray-500 mt-1">
            {language === 'uk' ? 'XP-Pocalypse Захист' : 'XP-Pocalypse Defense'}
          </p>
        </div>

        <div className="space-y-2">
          {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => {
            const info = DIFF_INFO[d];
            return (
              <button
                key={d}
                onClick={() => handleSelect(d)}
                className={`w-full p-3 rounded border-2 text-left transition-all hover:scale-[1.02]
                  ${d === difficulty ? 'ring-2 ring-blue-400' : ''}
                  bg-white hover:bg-gray-50 border-gray-300`}
              >
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-white text-[10px] font-bold ${info.color}`}>
                    {language === 'uk' ? info.labelUk : info.label}
                  </span>
                  <span className="text-yellow-500 text-[12px]">
                    {'⭐'.repeat(info.stars)}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {language === 'uk' ? info.descUk : info.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelect;
