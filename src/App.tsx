import React, { useEffect, useState, useCallback, useRef } from 'react';
import blissImage from './assets/images/bliss.jpg';
import { useGameStore } from './store/gameStore';
import { hackerTick } from './core/ai/hackerAI';
import { useTranslation } from './hooks/useTranslation';
import { startAmbient, updateAmbient, stopAmbient, playStartupSound } from './core/audio/soundManager';

// Components
import DesktopIcon from './components/DesktopIcon';
import Taskbar from './components/Taskbar';
import ErrorPopups from './components/ErrorPopups';
import GameOverScreen from './components/GameOverScreen';
import WaveHUD from './components/WaveHUD';
import WaveShopOverlay from './components/WaveShopOverlay';
import TutorialOverlay from './components/TutorialOverlay';
import ClippyHelper from './components/ClippyHelper';
import DifficultySelect from './components/DifficultySelect';
import LanguageSelect from './components/LanguageSelect';
import CRTShader from './components/CRTShader';

// Apps
import TerminalApp from './apps/TerminalApp';
import NetworkMapApp from './apps/NetworkMapApp';
import OutlookApp from './apps/OutlookApp';
import RecycleBinApp from './apps/RecycleBinApp';
import TaskManagerApp from './apps/TaskManagerApp';
import UpdateCenterApp from './apps/UpdateCenterApp';
import SettingsApp from './apps/SettingsApp';
import CoolerApp from './apps/CoolerApp';
import ICQApp from './apps/ICQApp';
import DefragApp from './apps/DefragApp';
import HardwareShopApp from './apps/HardwareShopApp';
import FirewallTetrisApp from './apps/FirewallTetrisApp';
import AchievementsApp from './apps/AchievementsApp';

type IconId = 'network' | 'cmd' | 'outlook' | 'recycleBin' | 'taskMgr' | 'updateCenter' | 'settings' | 'cooler' | 'icq' | 'defrag' | 'hardwareShop' | 'firewallTetris' | 'achievements';

interface IconDef {
  id: IconId;
  labelKey: string;
  icon: string;
  windowId: IconId;
}

const ICON_DEFS: IconDef[] = [
  { id: 'network', labelKey: 'desktop.myNetwork', icon: '🌐', windowId: 'network' },
  { id: 'cmd', labelKey: 'desktop.cmd', icon: '⌨️', windowId: 'cmd' },
  { id: 'outlook', labelKey: 'desktop.outlook', icon: '📧', windowId: 'outlook' },
  { id: 'recycleBin', labelKey: 'desktop.recycleBin', icon: '🗑️', windowId: 'recycleBin' },
  { id: 'taskMgr', labelKey: 'desktop.taskManager', icon: '📊', windowId: 'taskMgr' },
  { id: 'updateCenter', labelKey: 'desktop.windowsUpdate', icon: '🛡️', windowId: 'updateCenter' },
  { id: 'settings', labelKey: 'desktop.settings', icon: '⚙️', windowId: 'settings' },
  { id: 'cooler', labelKey: 'desktop.cooler', icon: '🖥️', windowId: 'cooler' },
  { id: 'icq', labelKey: 'desktop.icq', icon: '💬', windowId: 'icq' },
  { id: 'defrag', labelKey: 'desktop.defrag', icon: '💾', windowId: 'defrag' },
  { id: 'hardwareShop', labelKey: 'taskbar.hardwareShop', icon: '🔧', windowId: 'hardwareShop' },
  { id: 'firewallTetris', labelKey: 'taskbar.firewallTetris', icon: '🧱', windowId: 'firewallTetris' },
  { id: 'achievements', labelKey: 'taskbar.achievements', icon: '🏆', windowId: 'achievements' },
];

const ICON_W = 80;
const ICON_H = 76;
const TASKBAR_H = 36;

function getDefaultIconPositions(): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const cols = Math.max(1, Math.floor((window.innerHeight - TASKBAR_H - 24) / ICON_H));
  ICON_DEFS.forEach((def, idx) => {
    const col = Math.floor(idx / cols);
    const row = idx % cols;
    positions[def.id] = { x: 16 + col * (ICON_W + 8), y: 24 + row * ICON_H };
  });
  return positions;
}

function clampPositions(positions: Record<string, { x: number; y: number }>): Record<string, { x: number; y: number }> {
  const maxX = Math.max(0, window.innerWidth - ICON_W);
  const maxY = Math.max(0, window.innerHeight - TASKBAR_H - ICON_H);
  const clamped: Record<string, { x: number; y: number }> = {};
  for (const id in positions) {
    clamped[id] = {
      x: Math.max(0, Math.min(positions[id].x, maxX)),
      y: Math.max(0, Math.min(positions[id].y, maxY)),
    };
  }
  return clamped;
}

export default function App() {
  const openWindow = useGameStore(s => s.openWindow);
  const tick = useGameStore(s => s.tick);
  const screenShake = useGameStore(s => s.screenShake);
  const wallpaperCorrupted = useGameStore(s => s.wallpaperCorrupted);
  const breachLevel = useGameStore(s => s.breachLevel);
  const gameOver = useGameStore(s => s.gameOver);
  const bsodMinigame = useGameStore(s => s.bsodMinigame);
  const cpuTemp = useGameStore(s => s.cpuTemp);
  const wavePaused = useGameStore(s => s.wavePaused);
  const gameWon = useGameStore(s => s.gameWon);
  const { t } = useTranslation();
  const [iconPositions, setIconPositions] = useState(getDefaultIconPositions);
  const [languageChosen, setLanguageChosen] = useState(false);
  const [difficultyChosen, setDifficultyChosen] = useState(false);
  const ambientStarted = useRef(false);

  const updateIconPosition = useCallback((id: string, x: number, y: number) => {
    const maxX = Math.max(0, window.innerWidth - ICON_W);
    const maxY = Math.max(0, window.innerHeight - TASKBAR_H - ICON_H);
    setIconPositions(prev => ({
      ...prev,
      [id]: { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) },
    }));
  }, []);

  // Clamp icons on window resize
  useEffect(() => {
    const handleResize = () => {
      setIconPositions(prev => clampPositions(prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Основний ігровий тик — кожну секунду
  useEffect(() => {
    if (!difficultyChosen) return;
    const interval = setInterval(() => {
      tick();
      hackerTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick, difficultyChosen]);

  // Ambient sound — Start on first interaction, update based on breach
  useEffect(() => {
    if (!difficultyChosen) return;
    if (!ambientStarted.current) {
      playStartupSound();
      startAmbient();
      ambientStarted.current = true;
    }
    updateAmbient(breachLevel);
  }, [breachLevel, difficultyChosen]);

  useEffect(() => {
    return () => { stopAmbient(); };
  }, []);

  // Show language selection, then difficulty selection before game
  if (!languageChosen) {
    return <LanguageSelect onSelected={() => setLanguageChosen(true)} />;
  }
  if (!difficultyChosen) {
    return <DifficultySelect onSelected={() => setDifficultyChosen(true)} />;
  }

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden select-none bg-black"
      style={{ 
        fontFamily: 'Tahoma, "Segoe UI", sans-serif',
        // Screen shake effect
        animation: screenShake ? 'screenShake 0.15s infinite' : 'none',
      }}
    >
      {/* Advanced CRT WebGL post-processing shader */}
      <CRTShader enabled={true} intensity={0.4} />

      {/* CRT scanline overlay (CSS fallback) */}
      <div className="absolute inset-0 pointer-events-none z-[998] opacity-[0.04]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px)',
          backgroundSize: '100% 3px',
        }}
      />

      {/* CRT RGB sub-pixel overlay */}
      <div className="absolute inset-0 pointer-events-none z-[998] opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(90deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1) 1px, rgba(0,0,255,0.1) 2px, transparent 3px)',
          backgroundSize: '3px 100%',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[997]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.2) 100%)',
        }}
      />

      {/* Desktop wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${blissImage})`,
          filter: wallpaperCorrupted 
            ? `hue-rotate(${180 + breachLevel}deg) saturate(3) contrast(1.5)` 
            : `saturate(${1 - breachLevel * 0.002}) brightness(1.05)`,
        }}
      />

      {/* Corrupted wallpaper overlay */}
      {wallpaperCorrupted && (
        <div className="absolute inset-0 pointer-events-none z-[5] mix-blend-multiply opacity-30 animate-pulse"
          style={{
            background: 'repeating-linear-gradient(45deg, #ff0000, #ff0000 10px, transparent 10px, transparent 20px)',
          }}
        />
      )}

      {/* === DESKTOP ICONS === */}
      <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          {ICON_DEFS.map(def => (
            <DesktopIcon
              key={def.id}
              label={t(def.labelKey)}
              icon={def.icon}
              onOpen={() => openWindow(def.windowId)}
              position={iconPositions[def.id]}
              onDragEnd={(x, y) => updateIconPosition(def.id, x, y)}
            />
          ))}
        </div>
      </div>

      {/* === APP WINDOWS === */}
      <NetworkMapApp />
      <TerminalApp />
      <OutlookApp />
      <RecycleBinApp />
      <TaskManagerApp />
      <UpdateCenterApp />
      <SettingsApp />
      <CoolerApp />
      <ICQApp />
      <DefragApp />
      <HardwareShopApp />

      {/* === FIREWALL TETRIS === */}
      <FirewallTetrisApp />

      {/* === ACHIEVEMENTS === */}
      <AchievementsApp />

      {/* === ERROR POPUPS (visual chaos) === */}
      <ErrorPopups />

      {/* === BREACH LEVEL HUD === */}
      <div className="absolute top-2 right-2 z-[100] pointer-events-none flex flex-col gap-2">
        {/* Wave HUD */}
        <div className="pointer-events-auto">
          <WaveHUD />
        </div>

        <div className={`bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-[13px] font-mono border min-w-[160px] ${
          breachLevel > 70 ? 'border-red-500 text-red-400' :
          breachLevel > 40 ? 'border-yellow-500 text-yellow-400' :
          'border-green-500/50 text-green-400'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span>{t('hud.breachLevel')}</span>
            <span className={`font-bold text-[16px] ${breachLevel > 70 ? 'animate-pulse' : ''}`}>
              {breachLevel.toFixed(0)}%
            </span>
          </div>
          <div className="w-40 h-[8px] bg-gray-700 rounded overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded ${
                breachLevel > 70 ? 'bg-red-500' :
                breachLevel > 40 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${breachLevel}%` }}
            />
          </div>
        </div>

        {/* CPU Temperature widget */}
        <div className={`bg-black/70 backdrop-blur-sm rounded-lg px-4 py-3 text-[13px] font-mono border min-w-[160px] ${
          cpuTemp > 85 ? 'border-red-500 text-red-400' :
          cpuTemp > 65 ? 'border-orange-500 text-orange-400' :
          'border-cyan-500/50 text-cyan-400'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span>🌡️ CPU</span>
            <span className={`font-bold text-[16px] ${cpuTemp > 85 ? 'animate-pulse' : ''}`}>
              {cpuTemp.toFixed(0)}°C
            </span>
          </div>
          <div className="w-40 h-[8px] bg-gray-700 rounded overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded ${
                cpuTemp > 85 ? 'bg-red-500' :
                cpuTemp > 65 ? 'bg-orange-400' :
                'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (cpuTemp / 105) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* === TUTORIAL OVERLAY === */}
      <TutorialOverlay />

      {/* === CLIPPY HELPER === */}
      <ClippyHelper />

      {/* === WAVE SHOP / VICTORY OVERLAY === */}
      <WaveShopOverlay />

      {/* === TASKBAR === */}
      <Taskbar />

      {/* === GAME OVER (BSOD) === */}
      <GameOverScreen />
    </div>
  );
}