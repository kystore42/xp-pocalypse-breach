import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const OutlookApp: React.FC = () => {
  const emails = useGameStore(s => s.emails);
  const readEmail = useGameStore(s => s.readEmail);
  const clickEmailLink = useGameStore(s => s.clickEmailLink);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const { t } = useTranslation();

  const selectedEmail = emails.find(e => e.id === selectedId);

  return (
    <XPWindow windowId="outlook" title={t('outlook.title')} icon="📧" width={520} height="360px"
      menuBar={<><span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('outlook.menuFile')}</span><span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('outlook.menuEdit')}</span><span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('outlook.menuView')}</span><span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('outlook.menuTools')}</span></>}
    >
      <div className="flex h-full border border-gray-400 m-1 bg-white">
        {/* Email list (left) */}
        <div className="w-[200px] border-r border-gray-300 overflow-y-auto flex-shrink-0">
          <div className="bg-gradient-to-b from-[#f5f1e5] to-[#ece7d5] border-b px-2 py-1 text-[10px] font-bold text-gray-600">
            {t('outlook.inbox')} ({emails.length})
          </div>
          {emails.length === 0 ? (
            <div className="p-3 text-[10px] text-gray-400 italic text-center">{t('outlook.noMessages')}</div>
          ) : (
            emails.map(email => (
              <div
                key={email.id}
                onClick={() => { setSelectedId(email.id); readEmail(email.id); }}
                className={`px-2 py-[6px] border-b border-gray-100 cursor-pointer text-[10px] 
                  ${selectedId === email.id ? 'bg-[#316ac5] text-white' : 'hover:bg-[#eee]'}
                  ${!email.read ? 'font-bold' : ''}`}
              >
                <div className="truncate flex items-center gap-1">
                  {!email.read && <span className="text-yellow-500 text-[8px]">●</span>}
                  {email.isPhishing && !email.read && <span className="text-[8px]">⚠️</span>}
                  {email.from}
                </div>
                <div className="truncate opacity-70 text-[9px]">{email.subject}</div>
                <div className="text-[8px] opacity-50">{email.time}</div>
              </div>
            ))
          )}
        </div>

        {/* Email body (right) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedEmail ? (
            <>
              <div className="bg-[#f8f4ec] border-b p-2 text-[10px] flex-shrink-0">
                <div><strong>{t('outlook.from')}</strong> {selectedEmail.from}</div>
                <div><strong>{t('outlook.subject')}</strong> {selectedEmail.subject}</div>
                <div><strong>{t('outlook.date')}</strong> {selectedEmail.time}</div>
              </div>
              <div className="flex-1 p-3 text-[11px] overflow-y-auto leading-relaxed">
                <div className="whitespace-pre-wrap">{selectedEmail.body}</div>
                
                {/* Phishing link button */}
                {selectedEmail.isPhishing && !selectedEmail.clickedLink && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-300 rounded">
                    <button 
                      onClick={() => clickEmailLink(selectedEmail.id)}
                      className="bg-[#316ac5] text-white px-3 py-1 rounded text-[10px] hover:bg-[#2555a5] active:bg-[#1a4080]"
                    >
                      📎 {selectedEmail.attachment || t('outlook.downloadUpdate')}
                    </button>
                    <div className="text-[8px] text-gray-400 mt-1 italic">
                      {selectedEmail.attachment || 'update_driver_v3.1.exe'}
                    </div>
                  </div>
                )}

                {selectedEmail.clickedLink && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-300 rounded text-red-600 text-[10px] font-bold animate-pulse">
                    {t('outlook.phishingWarning')}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-[11px]">
              {t('outlook.selectMessage')}
            </div>
          )}
        </div>
      </div>
    </XPWindow>
  );
};

export default OutlookApp;
