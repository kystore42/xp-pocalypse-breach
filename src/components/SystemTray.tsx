import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const SystemTray: React.FC = () => {
  const notifications = useGameStore(s => s.notifications);
  const dismissNotification = useGameStore(s => s.dismissNotification);
  const breachLevel = useGameStore(s => s.breachLevel);
  const cpuTemp = useGameStore(s => s.cpuTemp);
  const unreadCount = useGameStore(s => s.emails.filter(e => !e.read).length);
  const { t } = useTranslation();

  // Показывать только последние 3 неубранные уведомления
  const activeNotifs = notifications.filter(n => !n.dismissed).slice(-3);

  return (
    <>
      {/* Notification balloons */}
      <div className="absolute bottom-[34px] right-2 z-[200] flex flex-col gap-1 pointer-events-auto">
        {activeNotifs.map((notif) => {
          const bgColor = notif.type === 'error' ? 'bg-[#fff0f0] border-red-300' :
            notif.type === 'warning' ? 'bg-[#fffff0] border-[#e6d85e]' :
            notif.type === 'success' ? 'bg-[#f0fff0] border-green-300' :
            'bg-[#fffff0] border-[#e6d85e]';

          return (
            <div
              key={notif.id}
              className={`${bgColor} border rounded shadow-lg p-2 max-w-[280px] text-[10px] animate-slide-in relative`}
              style={{ 
                animation: 'slideIn 0.3s ease-out',
              }}
            >
              {/* XP-style balloon pointer */}
              <div className="absolute -bottom-[6px] right-4 w-3 h-3 bg-inherit border-r border-b border-inherit rotate-45" />
              
              <div className="flex items-start gap-2">
                <div className="flex-1 leading-tight">{notif.text}</div>
                <button 
                  onClick={() => dismissNotification(notif.id)}
                  className="text-gray-400 hover:text-gray-700 text-[10px] flex-shrink-0 font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tray icons */}
      <div className="flex items-center gap-[3px] h-full px-1">
        {/* Breach level indicator */}
        <div className={`text-[10px] cursor-default ${
          breachLevel > 70 ? 'text-red-300 animate-pulse' : 
          breachLevel > 40 ? 'text-yellow-300' : 'text-green-300'
        }`} title={t('tray.breachLevel', { level: breachLevel })}>
          {breachLevel > 70 ? '🔴' : breachLevel > 40 ? '🟡' : '🟢'}
        </div>

        {/* Mail indicator */}
        {unreadCount > 0 && (
          <div className="text-[10px] cursor-default animate-bounce" title={t('tray.unreadEmails', { count: unreadCount })}>
            📧
          </div>
        )}

        {/* CPU temp */}
        <div className={`text-[10px] cursor-default ${cpuTemp > 70 ? 'text-red-300' : ''}`} title={t('tray.cpu', { temp: cpuTemp.toFixed(0) })}>
          🌡️
        </div>
      </div>
    </>
  );
};

export default SystemTray;
