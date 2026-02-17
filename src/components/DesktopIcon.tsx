import React, { useRef, useCallback } from 'react';

interface DesktopIconProps {
  label: string;
  icon: string;
  onOpen: () => void;
  position?: { x: number; y: number };
  onDragEnd?: (x: number, y: number) => void;
}

const DRAG_THRESHOLD = 5; // pixels before considering it a drag

const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onOpen, position, onDragEnd }) => {
  const dragRef = useRef<{ startX: number; startY: number; dragging: boolean; hasMoved: boolean } | null>(null);
  const elRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX - (position?.x ?? 0),
      startY: e.clientY - (position?.y ?? 0),
      dragging: true,
      hasMoved: false,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current?.dragging) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const dist = Math.abs(dx - (position?.x ?? 0)) + Math.abs(dy - (position?.y ?? 0));
      if (dist > DRAG_THRESHOLD) {
        dragRef.current.hasMoved = true;
      }
      if (elRef.current) {
        elRef.current.style.left = `${dx}px`;
        elRef.current.style.top = `${dy}px`;
      }
    };

    const handleMouseUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (dragRef.current?.dragging && dragRef.current.hasMoved) {
        const x = ev.clientX - dragRef.current.startX;
        const y = ev.clientY - dragRef.current.startY;
        onDragEnd?.(x, y);
      }
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [position, onDragEnd]);

  const handleDoubleClick = useCallback(() => {
    if (!dragRef.current?.hasMoved) {
      onOpen();
    }
  }, [onOpen]);

  const style: React.CSSProperties = position
    ? { position: 'absolute', left: position.x, top: position.y }
    : {};

  return (
    <div
      ref={elRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={style}
      className="group flex flex-col items-center w-[80px] cursor-pointer text-center py-1 px-1 rounded-sm
        hover:bg-blue-500/20 active:bg-blue-500/40"
    >
      <div className="w-[48px] h-[48px] flex items-center justify-center text-[36px] drop-shadow-md">
        {icon}
      </div>
      <span className="text-white text-[12px] mt-[2px] leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-[2px]
        group-hover:bg-[#316ac5] group-hover:text-white rounded-[2px] break-words max-w-[78px]">
        {label}
      </span>
    </div>
  );
};

export default DesktopIcon;
