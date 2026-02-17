import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore, type Difficulty } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import type { Language } from '../i18n/translations';
import { setMuted, isSoundMuted } from '../core/audio/soundManager';

const SettingsApp: React.FC = () => {
  const { t, language } = useTranslation();
  const setLanguage = useGameStore(s => s.setLanguage);
  const difficulty = useGameStore(s => s.difficulty);
  const setDifficulty = useGameStore(s => s.setDifficulty);
  const clippyDisabled = useGameStore(s => s.clippyDisabled);
  const disableClippy = useGameStore(s => s.disableClippy);
  const [muted, setMutedState] = React.useState(isSoundMuted());

  const handleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  return (
    <XPWindow windowId="settings" title={t('settings.title')} icon="⚙️" width={400} height="420px">
      <div className="h-full flex flex-col">
        {/* Section header */}
        <div className="bg-gradient-to-r from-[#e8e4d8] to-[#d6d2c2] border-b p-2">
          <span className="text-[12px] font-bold text-gray-700">⚙️ {t('settings.general')}</span>
        </div>

        <div className="flex-1 bg-white p-4 overflow-y-auto">
          {/* Language setting */}
          <div className="mb-4">
            <label className="block text-[12px] font-bold text-gray-700 mb-1">
              🌐 {t('settings.language')}
            </label>
            <p className="text-[10px] text-gray-500 mb-2">{t('settings.languageDesc')}</p>
            
            <div className="flex flex-col gap-1">
              <label
                className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-all text-[11px] ${
                  language === 'en' 
                    ? 'bg-[#e8f0fe] border-[#316ac5] text-[#316ac5] font-bold' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en' as Language)}
                  className="accent-[#316ac5]"
                />
                <span className="text-[14px]">🇬🇧</span>
                {t('settings.english')}
              </label>

              <label
                className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer transition-all text-[11px] ${
                  language === 'uk' 
                    ? 'bg-[#e8f0fe] border-[#316ac5] text-[#316ac5] font-bold' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="language"
                  value="uk"
                  checked={language === 'uk'}
                  onChange={() => setLanguage('uk' as Language)}
                  className="accent-[#316ac5]"
                />
                <span className="text-[14px]">🇺🇦</span>
                {t('settings.ukrainian')}
              </label>
            </div>
          </div>

          {/* Difficulty setting */}
          <div className="mb-4">
            <label className="block text-[12px] font-bold text-gray-700 mb-1">
              🎮 {language === 'uk' ? 'Складність' : 'Difficulty'}
            </label>
            <div className="flex gap-1">
              {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 px-2 py-1.5 text-[10px] font-bold rounded border transition-all ${
                    difficulty === d
                      ? 'bg-[#316ac5] text-white border-[#316ac5]'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {d === 'easy' ? (language === 'uk' ? 'Легко' : 'Easy') :
                   d === 'normal' ? (language === 'uk' ? 'Норма' : 'Normal') :
                   (language === 'uk' ? 'Складно' : 'Hard')}
                </button>
              ))}
            </div>
          </div>

          {/* Sound setting */}
          <div className="mb-4">
            <label className="block text-[12px] font-bold text-gray-700 mb-1">
              🔊 {language === 'uk' ? 'Звук' : 'Sound'}
            </label>
            <button
              onClick={handleMute}
              className={`px-3 py-1.5 text-[11px] rounded border transition-all ${
                muted
                  ? 'bg-red-100 border-red-300 text-red-600'
                  : 'bg-green-100 border-green-300 text-green-600'
              }`}
            >
              {muted
                ? (language === 'uk' ? '🔇 Вимкнено' : '🔇 Muted')
                : (language === 'uk' ? '🔊 Увімкнено' : '🔊 On')}
            </button>
          </div>

          {/* Clippy toggle */}
          <div className="mb-4">
            <label className="block text-[12px] font-bold text-gray-700 mb-1">
              📎 Clippy
            </label>
            <p className="text-[10px] text-gray-500 mb-1">
              {language === 'uk' ? 'Помічник з підказками' : 'Helper assistant with tips'}
            </p>
            {clippyDisabled ? (
              <span className="text-[10px] text-gray-400">
                {language === 'uk' ? '❌ Вимкнено' : '❌ Disabled'}
              </span>
            ) : (
              <button
                onClick={disableClippy}
                className="px-3 py-1 text-[10px] border border-gray-300 rounded hover:bg-red-50 text-gray-600"
              >
                {language === 'uk' ? '🚫 Вимкнути (10 SP)' : '🚫 Disable (10 SP)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </XPWindow>
  );
};

export default SettingsApp;
