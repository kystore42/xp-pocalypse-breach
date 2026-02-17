import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore, type Difficulty } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import type { Language } from '../i18n/translations';
import { setMuted, isSoundMuted } from '../core/audio/soundManager';
import { hasSave, getSaveInfo } from '../core/saveSystem';

const SettingsApp: React.FC = () => {
  const { t, language } = useTranslation();
  const setLanguage = useGameStore(s => s.setLanguage);
  const difficulty = useGameStore(s => s.difficulty);
  const setDifficulty = useGameStore(s => s.setDifficulty);
  const clippyDisabled = useGameStore(s => s.clippyDisabled);
  const disableClippy = useGameStore(s => s.disableClippy);
  const saveGameAction = useGameStore(s => s.saveGame);
  const loadSaveAction = useGameStore(s => s.loadSave);
  const exportSaveAction = useGameStore(s => s.exportSave);
  const importSaveAction = useGameStore(s => s.importSave);
  const newGamePlusLevel = useGameStore(s => s.newGamePlusLevel);
  const [muted, setMutedState] = React.useState(isSoundMuted());
  const [saveExists, setSaveExists] = React.useState(hasSave());

  const handleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  const handleSave = () => {
    saveGameAction();
    setSaveExists(true);
  };

  const handleLoad = () => {
    if (loadSaveAction()) {
      setSaveExists(true);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const json = reader.result as string;
        importSaveAction(json);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <XPWindow windowId="settings" title={t('settings.title')} icon="⚙️" width={400} height="560px">
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

          {/* Save / Load */}
          <div className="mb-4">
            <label className="block text-[12px] font-bold text-gray-700 mb-1">
              💾 {language === 'uk' ? 'Збереження' : 'Save / Load'}
            </label>
            {newGamePlusLevel > 0 && (
              <p className="text-[10px] text-purple-600 font-bold mb-1">NG+{newGamePlusLevel}</p>
            )}
            {saveExists && (() => {
              const info = getSaveInfo();
              return info ? (
                <p className="text-[10px] text-gray-500 mb-2">
                  {language === 'uk' ? 'Збережено' : 'Saved'}: {language === 'uk' ? 'Хвиля' : 'Wave'} {info.wave} · {info.difficulty} · {new Date(info.timestamp!).toLocaleString()}
                </p>
              ) : null;
            })()}
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={handleSave}
                className="px-2 py-1.5 text-[10px] font-bold rounded border border-green-400 bg-green-50 text-green-700 hover:bg-green-100 transition-all"
              >
                💾 {language === 'uk' ? 'Зберегти' : 'Save'}
              </button>
              <button
                onClick={handleLoad}
                disabled={!saveExists}
                className={`px-2 py-1.5 text-[10px] font-bold rounded border transition-all ${
                  saveExists
                    ? 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                📂 {language === 'uk' ? 'Завантажити' : 'Load'}
              </button>
              <button
                onClick={() => exportSaveAction()}
                className="px-2 py-1.5 text-[10px] font-bold rounded border border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-all"
              >
                📤 {language === 'uk' ? 'Експорт' : 'Export'}
              </button>
              <button
                onClick={handleImport}
                className="px-2 py-1.5 text-[10px] font-bold rounded border border-orange-400 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all"
              >
                📥 {language === 'uk' ? 'Імпорт' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </XPWindow>
  );
};

export default SettingsApp;
