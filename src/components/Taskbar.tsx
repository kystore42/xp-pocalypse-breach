import React, { useState, useRef, useEffect } from 'react';
import { useGameStore, type WindowId } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';
import SystemTray from './SystemTray';

const TASKBAR_APPS: { id: WindowId; labelKey: string; icon: string }[] = [
  { id: 'network', labelKey: 'taskbar.myNetwork', icon: '🌐' },
  { id: 'cmd', labelKey: 'taskbar.cmd', icon: '⌨️' },
  { id: 'outlook', labelKey: 'taskbar.outlook', icon: '📧' },
  { id: 'recycleBin', labelKey: 'taskbar.recycleBin', icon: '🗑️' },
  { id: 'taskMgr', labelKey: 'taskbar.taskManager', icon: '📊' },
  { id: 'updateCenter', labelKey: 'taskbar.updates', icon: '🛡️' },
  { id: 'settings', labelKey: 'taskbar.settings', icon: '⚙️' },
  { id: 'cooler', labelKey: 'taskbar.cooler', icon: '🖥️' },
  { id: 'icq', labelKey: 'taskbar.icq', icon: '💬' },
  { id: 'defrag', labelKey: 'taskbar.defrag', icon: '💾' },
  { id: 'hardwareShop', labelKey: 'taskbar.hardwareShop', icon: '🔧' },
  { id: 'firewallTetris', labelKey: 'taskbar.firewallTetris', icon: '🧱' },
  { id: 'achievements', labelKey: 'taskbar.achievements', icon: '🏆' },
];

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const openWindow = useGameStore(s => s.openWindow);
  const breachLevel = useGameStore(s => s.breachLevel);
  const stabilityPoints = useGameStore(s => s.stabilityPoints);
  const gameTime = useGameStore(s => s.gameTime);
  const { t } = useTranslation();

  const handleOpen = (id: WindowId) => {
    openWindow(id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[99]" onClick={onClose} />
      <div className="absolute bottom-[30px] left-0 z-[101] w-[280px] bg-white rounded-tr-lg shadow-2xl border border-[#0055ea]/50 overflow-hidden"
        style={{ animation: 'slideUp 0.15s ease-out' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#245edb] to-[#5a9ef5] p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl border-2 border-white/40">
            🖥️
          </div>
          <div>
            <div className="text-white font-bold text-[12px]">{t('startMenu.administrator')}</div>
            <div className="text-blue-100 text-[9px]">{t('startMenu.defense')}</div>
          </div>
        </div>

        {/* Apps */}
        <div className="flex">
          <div className="flex-1 bg-white py-1">
            {TASKBAR_APPS.map(app => (
              <div
                key={app.id}
                onClick={() => handleOpen(app.id)}
                className="flex items-center gap-2 px-3 py-[6px] hover:bg-[#316ac5] hover:text-white cursor-pointer text-[11px]"
              >
                <span className="text-[16px]">{app.icon}</span>
                <span>{t(app.labelKey)}</span>
              </div>
            ))}
          </div>
          <div className="w-[90px] bg-[#d3e5fa] py-1 border-l text-[9px]">
            <div className="px-2 py-1 text-gray-600">
              <div>🕐 {Math.floor(gameTime / 60)}m {gameTime % 60}s</div>
              <div className="mt-2">📊 {t('startMenu.breach')}: {breachLevel.toFixed(1)}%</div>
              <div>⭐ {t('startMenu.sp')}: {stabilityPoints}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-[#4178be] to-[#245edb] flex items-center justify-end p-1 gap-2">
          <span className="text-white text-[10px] opacity-80 cursor-default hover:opacity-100 flex items-center gap-1">
            🔌 {t('startMenu.turnOff')}
          </span>
        </div>
      </div>
    </>
  );
};

const Taskbar: React.FC = () => {
  const [startOpen, setStartOpen] = useState(false);
  const time = useGameStore(s => new Date());
  const windows = useGameStore(s => s.windows);
  const openWindow = useGameStore(s => s.openWindow);
  const focusWindow = useGameStore(s => s.focusWindow);
  const startButtonRunning = useGameStore(s => s.startButtonRunning);
  const breachLevel = useGameStore(s => s.breachLevel);
  const { t } = useTranslation();
  
  const [clock, setClock] = useState(new Date());
  const startRef = useRef<HTMLButtonElement>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Кнопка "Пуск" убегает от курсора
  const handleStartMouseEnter = (e: React.MouseEvent) => {
    if (!startButtonRunning) return;
    const dx = (Math.random() - 0.5) * 200;
    const dy = -(Math.random() * 100 + 30);
    setStartPos(prev => ({
      x: Math.max(-100, Math.min(300, prev.x + dx)),
      y: Math.max(-200, Math.min(0, prev.y + dy))
    }));
  };

  const openWindows = Object.values(windows).filter(w => w.isOpen);

  return (
    <>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      
      <div className="absolute bottom-0 w-full h-[30px] flex items-center z-[100] border-t border-white/20"
        style={{
          background: 'linear-gradient(180deg, #3168d5 0%, #2458c3 3%, #1941a5 6%, #1941a5 90%, #1538a0 95%, #133499 100%)',
        }}
      >
        {/* Start button */}
        <button 
          ref={startRef}
          onClick={() => setStartOpen(!startOpen)}
          onMouseEnter={handleStartMouseEnter}
          className="h-full px-4 rounded-r-[8px] italic font-bold text-white text-[11px] flex items-center gap-1 relative transition-transform duration-200"
          style={{ 
            background: 'linear-gradient(180deg, #3c9a41 0%, #3c9a41 3%, #328f37 6%, #328f37 85%, #257a29 95%, #1e6d22 100%)',
            boxShadow: 'inset 1px 0 1px rgba(255,255,255,0.3), inset 0 1px 1px rgba(255,255,255,0.4)',
            transform: `translate(${startPos.x}px, ${startPos.y}px)`,
          }}
        >
          <span className="text-[14px]">🪟</span>
          <span className="tracking-wide">{t('taskbar.start')}</span>
        </button>

        {/* Quick launch divider */}
        <div className="w-[1px] h-[20px] bg-white/20 mx-1" />

        {/* Open windows in taskbar */}
        <div className="flex items-center gap-[2px] flex-1 overflow-hidden px-1">
          {openWindows.map(w => {
            const app = TASKBAR_APPS.find(a => a.id === w.id);
            return (
              <button
                key={w.id}
                onClick={() => {
                  if (w.minimized) openWindow(w.id);
                  else focusWindow(w.id);
                }}
                className={`h-[22px] px-2 text-[10px] text-white rounded-sm flex items-center gap-1 truncate max-w-[140px]
                  ${w.minimized ? 'bg-[#3c6fc1]/50' : 'bg-[#1e52a2] border border-[#3c6fc1]/50 shadow-inner'}`}
              >
                <span className="text-[11px]">{app?.icon}</span>
                <span className="truncate">{app ? t(app.labelKey) : w.id}</span>
              </button>
            );
          })}
        </div>

        {/* System tray area */}
        <div className="h-full flex items-center border-l border-[#0877bd]/50 pl-1"
          style={{
            background: 'linear-gradient(180deg, #1290e9 0%, #0f7bd6 50%, #0c6bc2 100%)',
          }}
        >
          <SystemTray />
          
          {/* Clock */}
          <div className="h-full px-3 flex items-center text-white text-[11px] font-bold tracking-tight cursor-default">
            {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
