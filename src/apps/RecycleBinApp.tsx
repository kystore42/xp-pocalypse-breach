import React from 'react';
import XPWindow from '../components/XPWindow';
import { useGameStore } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

const RecycleBinApp: React.FC = () => {
  const items = useGameStore(s => s.recycleBinItems);
  const deleteItem = useGameStore(s => s.deleteRecycleBinItem);
  const emptyBin = useGameStore(s => s.emptyRecycleBin);

  const visibleItems = items.filter(i => !i.deleted);
  const { t } = useTranslation();

  return (
    <XPWindow windowId="recycleBin" title={t('recycleBin.title')} icon="🗑️" width={420} height="300px"
      menuBar={
        <>
          <span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('recycleBin.menuFile')}</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-2 cursor-default">{t('recycleBin.menuEdit')}</span>
          <span 
            onClick={() => emptyBin()} 
            className="hover:bg-[#316ac5] hover:text-white px-2 cursor-pointer"
          >
            {t('recycleBin.emptyBin')}
          </span>
        </>
      }
    >
      <div className="bg-white h-full overflow-y-auto border border-gray-400 m-1">
        {/* Column headers */}
        <div className="sticky top-0 bg-[#f5f3ed] border-b flex text-[10px] font-bold text-gray-600">
          <div className="flex-1 px-2 py-1 border-r">{t('recycleBin.name')}</div>
          <div className="w-16 px-2 py-1 border-r text-center">{t('recycleBin.size')}</div>
          <div className="w-16 px-2 py-1 border-r text-center">{t('recycleBin.type')}</div>
          <div className="w-14 px-2 py-1 text-center">{t('recycleBin.action')}</div>
        </div>

        {visibleItems.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-[11px]">
            {t('recycleBin.empty')}
          </div>
        ) : (
          visibleItems.map(item => (
            <div 
              key={item.id} 
              className={`flex text-[10px] border-b hover:bg-[#e8e4d8] ${
                item.isMalware ? 'bg-red-50 text-red-700' : ''
              }`}
            >
              <div className="flex-1 px-2 py-[3px] border-r flex items-center gap-1 truncate">
                {item.isMalware ? '⚠️' : '📄'} {item.name}
              </div>
              <div className="w-16 px-2 py-[3px] border-r text-center">{item.size}</div>
              <div className="w-16 px-2 py-[3px] border-r text-center">
                {item.isMalware ? <span className="text-red-500 font-bold">{t('recycleBin.virus')}</span> : t('recycleBin.file')}
              </div>
              <div className="w-14 px-2 py-[3px] text-center">
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="text-red-600 hover:text-red-800 font-bold text-[9px]"
                  title={t('recycleBin.del')}
                >
                  {t('recycleBin.del')}
                </button>
              </div>
            </div>
          ))
        )}

        {/* Summary */}
        <div className="p-2 text-[9px] text-gray-500 border-t bg-[#f8f6f0]">
          {t('recycleBin.items', { count: visibleItems.length })}
          {visibleItems.some(i => i.isMalware) && (
            <span className="text-red-500 font-bold ml-2 animate-pulse">
              {t('recycleBin.malwareWarning')}
            </span>
          )}
        </div>
      </div>
    </XPWindow>
  );
};

export default RecycleBinApp;
