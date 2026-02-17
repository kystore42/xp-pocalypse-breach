import React from 'react';
import { useGameStore, TUTORIAL_STEPS } from '../store/gameStore';

const TUTORIAL_TEXTS_EN = [
  '👋 Welcome, Administrator! Your Windows XP network is under attack by an AI hacker. Let me show you the basics.',
  '🔍 First, open cmd.exe and type "scan" to check for threats. This reveals compromised nodes and malware.',
  '🌐 Check My Network Places to see your nodes. Watch for ⚡ probing and 💀 compromised status!',
  '🩹 When a node is compromised, type "patch node1" (using the node ID) in cmd.exe to fix it.',
  '📊 Open Task Manager to find malicious processes. Use "taskkill /pid [number]" to eliminate them.',
  '📧 Watch Outlook for phishing emails! Never click "Download" on suspicious attachments.',
  '⭐ You earn Stability Points (SP) for defending. Spend them in Windows Update for upgrades!',
  '🎮 Good luck, Administrator! The AI adapts and gets smarter. Stay vigilant! Click "Got it" to begin.',
];

const TUTORIAL_TEXTS_UK = [
  '👋 Ласкаво просимо, Адміністраторе! Вашу мережу Windows XP атакує ШІ-хакер. Ось основи.',
  '🔍 Спочатку відкрийте cmd.exe і введіть "scan" для перевірки загроз.',
  '🌐 Перевірте Мережеве оточення, щоб бачити стан вузлів. Стежте за ⚡ та 💀!',
  '🩹 Коли вузол скомпрометований, введіть "patch node1" в cmd.exe для відновлення.',
  '📊 Відкрийте Диспетчер завдань для пошуку шкідливих процесів. "taskkill /pid [номер]".',
  '📧 Стежте за фішинговими листами в Outlook! Не натискайте на підозрілі вкладення.',
  '⭐ Заробляйте Очки стабільності (ОС) за захист. Витрачайте в Оновленнях Windows!',
  '🎮 Удачі, Адміністраторе! ШІ адаптується. Будьте пильні! Натисніть "Зрозуміло".',
];

const TutorialOverlay: React.FC = () => {
  const tutorialActive = useGameStore(s => s.tutorialActive);
  const tutorialStep = useGameStore(s => s.tutorialStep);
  const advanceTutorial = useGameStore(s => s.advanceTutorial);
  const skipTutorial = useGameStore(s => s.skipTutorial);
  const language = useGameStore(s => s.language);

  if (!tutorialActive || tutorialStep < 0) return null;

  const texts = language === 'uk' ? TUTORIAL_TEXTS_UK : TUTORIAL_TEXTS_EN;
  const step = TUTORIAL_STEPS[tutorialStep];
  const text = texts[tutorialStep] || texts[0];
  const isLast = tutorialStep >= TUTORIAL_STEPS.length - 1;

  return (
    <div className="absolute inset-0 z-[8000] flex items-end justify-center pb-12 pointer-events-none">
      {/* Dim background */}
      <div className="absolute inset-0 bg-black/30 pointer-events-auto" onClick={advanceTutorial} />

      {/* Tutorial card */}
      <div className="relative pointer-events-auto bg-gradient-to-b from-[#fffde7] to-[#fff9c4] border-2 border-yellow-600 rounded-lg p-4 max-w-lg shadow-2xl"
        style={{ animation: 'slideUp 0.3s ease-out' }}>
        <div className="flex items-start gap-3">
          {/* Clippy-like character */}
          <div className="text-3xl flex-shrink-0 animate-bounce">📎</div>

          <div className="flex-1">
            <div className="text-[10px] text-yellow-700 font-bold mb-1">
              TUTORIAL — Step {tutorialStep + 1}/{TUTORIAL_STEPS.length}
            </div>
            <p className="text-[12px] text-gray-800 leading-relaxed">{text}</p>

            {step?.highlight && (
              <div className="mt-2 text-[10px] text-blue-600 font-bold">
                💡 Try opening: {step.highlight}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <button
            onClick={skipTutorial}
            className="px-3 py-1 text-[10px] text-gray-500 hover:text-gray-700"
          >
            Skip Tutorial
          </button>
          <button
            onClick={advanceTutorial}
            className="px-4 py-1.5 bg-[#316ac5] text-white text-[11px] font-bold rounded hover:bg-[#2555a5]"
          >
            {isLast ? '✅ Got it!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
