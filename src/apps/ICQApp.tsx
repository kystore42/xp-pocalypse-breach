import React, { useRef, useEffect } from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const ICQApp: React.FC = () => {
  const icqMessages = useGameStore(s => s.icqMessages);
  const icqSpamActive = useGameStore(s => s.icqSpamActive);
  const registryPassword = useGameStore(s => s.registryPassword);
  const registryUsed = useGameStore(s => s.registryUsed);
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [icqMessages]);

  return (
    <XPWindow windowId="icq" title={t('icq.title')} icon="💬" width={360} height="380px">
      <div className="h-full flex flex-col bg-white">
        {/* ICQ Header */}
        <div className="bg-gradient-to-r from-[#63b74f] to-[#4a9e3a] px-3 py-2 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[18px]">🌼</span>
            <span className="font-bold text-[12px]">{t('icq.title')}</span>
          </div>
          <span className="text-[10px] opacity-80">
            {t('icq.messagesCount', { count: icqMessages.length })}
          </span>
        </div>

        {/* Spam warning */}
        {icqSpamActive && (
          <div className="bg-yellow-100 border-b border-yellow-400 text-yellow-800 px-2 py-1 text-[10px] font-bold animate-pulse">
            {t('icq.spamWarning')}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-[11px]">
          {icqMessages.length === 0 ? (
            <div className="text-gray-400 text-center mt-8 text-[10px]">No messages yet</div>
          ) : (
            icqMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-2 rounded border ${
                  msg.isAlly
                    ? 'bg-green-50 border-green-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-[2px]">
                  <span className={`font-bold text-[10px] ${msg.isAlly ? 'text-green-700' : 'text-gray-500'}`}>
                    {msg.isAlly ? '⭐ ' : ''}{msg.from}
                  </span>
                  <span className="text-[8px] text-gray-400">{msg.time}</span>
                </div>
                <div className={`text-[10px] ${msg.isAlly ? 'text-green-800 font-medium' : 'text-gray-600'}`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Hint */}
        {!registryUsed && icqMessages.some(m => m.isAlly) && (
          <div className="bg-blue-50 border-t border-blue-200 px-2 py-1 text-[9px] text-blue-700">
            {t('icq.allyHint')}
          </div>
        )}
        {registryUsed && (
          <div className="bg-green-50 border-t border-green-200 px-2 py-1 text-[9px] text-green-700">
            ✅ Registry key applied!
          </div>
        )}
      </div>
    </XPWindow>
  );
};

export default ICQApp;
