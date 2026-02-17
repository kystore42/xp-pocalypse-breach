import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore, type WindowId } from '../store/gameStore';
import { useTranslation } from '../hooks/useTranslation';

interface XPWindowProps {
  windowId: WindowId;
  title: string;
  icon?: string;
  width?: number;
  minWidth?: number;
  height?: string;
  children: React.ReactNode;
  menuBar?: React.ReactNode;
}

const XPWindow: React.FC<XPWindowProps> = ({ 
  windowId, title, icon, width = 420, minWidth, height, children, menuBar 
}) => {
  const win = useGameStore(s => s.windows[windowId]);
  const windowTrails = useGameStore(s => s.windowTrails);
  const focusWindow = useGameStore(s => s.focusWindow);
  const closeWindow = useGameStore(s => s.closeWindow);
  const moveWindow = useGameStore(s => s.moveWindow);
  const minimizeWindow = useGameStore(s => s.minimizeWindow);
  const { t } = useTranslation();
  
  const [isDragging, setIsDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    focusWindow(windowId);
    setIsDragging(true);
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setRel({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    e.preventDefault();
  }, [focusWindow, windowId]);

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      moveWindow(windowId, { x: e.clientX - rel.x, y: e.clientY - rel.y });
    };
    const onMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, rel, windowId, moveWindow]);

  if (!win.isOpen || win.minimized) return null;

  return (
    <div
      ref={windowRef}
      className="absolute select-none"
      style={{ 
        left: win.position.x, 
        top: win.position.y, 
        width: `${width}px`,
        minWidth: minWidth ? `${minWidth}px` : undefined,
        zIndex: win.zIndex,
        // Window trails effect when breach is high
        ...(windowTrails ? { 
          filter: 'drop-shadow(3px 3px 0 rgba(0,0,200,0.3)) drop-shadow(-3px -3px 0 rgba(200,0,0,0.2))',
        } : {}),
      }}
      onMouseDown={() => focusWindow(windowId)}
    >
      {/* Outer border - XP style rounded window */}
      <div className="rounded-t-lg overflow-hidden border border-[#0055ea]/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {/* Title bar */}
        <div 
          onMouseDown={onMouseDown}
          className="h-[26px] flex items-center justify-between px-[3px] cursor-default active:cursor-grabbing"
          style={{
            background: 'linear-gradient(180deg, #0997ff 0%, #0053ee 8%, #0050ee 20%, #066eff 50%, #0050ee 80%, #0344c2 95%, #003ebb 100%)',
          }}
        >
          <div className="flex items-center gap-[4px] min-w-0">
            {icon && <span className="text-[13px] leading-none flex-shrink-0">{icon}</span>}
            <span className="text-white font-bold text-[11px] tracking-wide truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-[2px] flex-shrink-0">
            {/* Minimize */}
            <button 
              onClick={(e) => { e.stopPropagation(); minimizeWindow(windowId); }}
              className="w-[21px] h-[21px] rounded-sm flex items-center justify-center text-white
                bg-gradient-to-b from-[#3c8df2] to-[#1553c8] border border-[#3580e0]
                hover:from-[#5cacff] hover:to-[#2666dd] 
                active:from-[#1553c8] active:to-[#3c8df2]"
            >
              <span className="text-[10px] font-bold leading-none mt-[2px]">─</span>
            </button>
            {/* Close */}
            <button 
              onClick={(e) => { e.stopPropagation(); closeWindow(windowId); }}
              className="w-[21px] h-[21px] rounded-sm flex items-center justify-center text-white font-bold text-[13px]
                bg-gradient-to-b from-[#e8816a] to-[#c5402c] border border-[#d1654d]
                hover:from-[#ff9c82] hover:to-[#d94f39]
                active:from-[#c5402c] active:to-[#e8816a]"
            >
              ×
            </button>
          </div>
        </div>

        {/* Optional menu bar */}
        {menuBar && (
          <div className="bg-[#ece9d8] border-b border-[#aaa] px-1 py-[1px] flex gap-2 text-[11px] text-black">
            {menuBar}
          </div>
        )}

        {/* Content area */}
        <div className="bg-[#ece9d8]" style={{ height }}>
          {children}
        </div>

        {/* Status bar */}
        <div className="bg-[#ece9d8] border-t border-[#a0a0a0] px-2 py-[1px] text-[10px] text-gray-500 h-[18px] flex items-center">
          {t('window.ready')}
        </div>
      </div>
    </div>
  );
};

export default XPWindow;
