import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { Language } from '../i18n/translations';

const LANGUAGES: { code: Language; label: string; flag: string; desc: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧', desc: 'Play in English' },
  { code: 'uk', label: 'Українська', flag: '🇺🇦', desc: 'Грати українською' },
];

interface LanguageSelectProps {
  onSelected: () => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ onSelected }) => {
  const setLanguage = useGameStore(s => s.setLanguage);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    onSelected();
  };

  return (
    <div className="absolute inset-0 z-[9500] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#000080]" />
      <div className="relative bg-gradient-to-b from-[#ECE9D8] to-[#d6d2c2] rounded-lg border-2 border-[#0055ea] shadow-2xl p-6 max-w-xs w-full">
        <div className="text-center mb-5">
          <div className="text-3xl mb-2">🌐</div>
          <h2 className="text-[15px] font-bold text-gray-800">
            Select Language / Оберіть мову
          </h2>
          <p className="text-[10px] text-gray-500 mt-1">
            XP-Pocalypse Breach
          </p>
        </div>

        <div className="space-y-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="w-full p-3 rounded border-2 text-left transition-all hover:scale-[1.02]
                bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <div className="text-[13px] font-bold text-gray-800">{lang.label}</div>
                  <div className="text-[10px] text-gray-500">{lang.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
