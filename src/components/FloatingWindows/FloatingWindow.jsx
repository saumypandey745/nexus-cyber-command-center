import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Minus, Square, Move } from 'lucide-react';

/**
 * NEXUS Floating Window Manager
 * Draggable, resizable, z-indexed windows like a real OS
 */
export function FloatingWindow({
  id, title, icon, children,
  initialPos = { x: 100, y: 100 },
  initialSize = { w: 400, h: 300 },
  onClose, onMinimize,
  isMinimized = false,
  zIndex = 1000,
  onFocus,
  accentColor = 'var(--electric-cyan)',
  headerBg,
  resizable = true,
}) {
  const [pos, setPos] = useState(initialPos);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const windowRef = useRef(null);

  const handleMouseDownDrag = useCallback((e) => {
    if (e.target.closest('.no-drag')) return;
    e.preventDefault();
    onFocus?.(id);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setIsDragging(true);
  }, [pos, id, onFocus]);

  const handleMouseDownResize = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    setIsResizing(true);
  }, [size]);

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e) => {
      if (isDragging) {
        setPos({
          x: Math.max(0, Math.min(window.innerWidth - size.w, e.clientX - dragOffset.current.x)),
          y: Math.max(0, Math.min(window.innerHeight - 40, e.clientY - dragOffset.current.y)),
        });
      }
      if (isResizing) {
        const dx = e.clientX - resizeStart.current.x;
        const dy = e.clientY - resizeStart.current.y;
        setSize({
          w: Math.max(200, resizeStart.current.w + dx),
          h: Math.max(120, resizeStart.current.h + dy),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, size.w]);

  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      onMouseDown={() => onFocus?.(id)}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '4px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(3,10,24,0.97) 0%, rgba(2,6,16,0.99) 100%)',
        border: `1px solid ${accentColor}40`,
        boxShadow: `0 0 0 1px ${accentColor}15, 0 20px 80px rgba(0,0,0,0.9), 0 0 60px ${accentColor}08`,
        backdropFilter: 'blur(20px)',
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: isDragging ? 'none' : 'auto',
        transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s ease',
      }}
    >
      {/* Corner accents */}
      <div style={{ position:'absolute', top:-1, left:-1, width:10, height:10, borderTop:`2px solid ${accentColor}`, borderLeft:`2px solid ${accentColor}`, zIndex:5, pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:-1, right:-1, width:10, height:10, borderTop:`2px solid ${accentColor}80`, borderRight:`2px solid ${accentColor}80`, zIndex:5, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-1, left:-1, width:10, height:10, borderBottom:`2px solid ${accentColor}80`, borderLeft:`2px solid ${accentColor}80`, zIndex:5, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-1, right:-1, width:10, height:10, borderBottom:`2px solid ${accentColor}`, borderRight:`2px solid ${accentColor}`, zIndex:5, pointerEvents:'none' }} />

      {/* Top shimmer */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:'1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        opacity: 0.8, zIndex:4, pointerEvents:'none',
        animation: 'edgeFlow 3s linear infinite', backgroundSize:'200% 100%',
      }} />

      {/* Titlebar */}
      <div
        onMouseDown={handleMouseDownDrag}
        style={{
          height: '32px',
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          background: headerBg || `linear-gradient(90deg, ${accentColor}18 0%, ${accentColor}06 60%, transparent 100%)`,
          borderBottom: `1px solid ${accentColor}20`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          flexShrink: 0,
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
          {icon && <span style={{ color: accentColor, filter: `drop-shadow(0 0 4px ${accentColor})`, fontSize:'14px', lineHeight:1 }}>{icon}</span>}
          <span style={{
            fontFamily: 'var(--font-header)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: accentColor,
            textShadow: `0 0 10px ${accentColor}60`,
          }}>
            {title}
          </span>
        </div>

        {/* Window controls */}
        <div className="no-drag" style={{ display:'flex', gap:'5px', alignItems:'center' }}>
          <button
            onClick={() => onMinimize?.(id)}
            style={{
              width:'13px', height:'13px', borderRadius:'50%',
              background:'#ffb300', border:'none', cursor:'pointer',
              boxShadow:'0 0 6px rgba(255,179,0,0.6)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}
            title="Minimize"
          >
            <Minus size={8} color="#000" />
          </button>
          <button
            onClick={() => onClose?.(id)}
            style={{
              width:'13px', height:'13px', borderRadius:'50%',
              background:'#ff003c', border:'none', cursor:'pointer',
              boxShadow:'0 0 6px rgba(255,0,60,0.6)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}
            title="Close"
          >
            <X size={8} color="#fff" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
        {children}
      </div>

      {/* Resize handle */}
      {resizable && (
        <div
          onMouseDown={handleMouseDownResize}
          style={{
            position: 'absolute',
            bottom: 0, right: 0,
            width: '16px', height: '16px',
            cursor: 'se-resize',
            zIndex: 10,
            background: `linear-gradient(135deg, transparent 50%, ${accentColor}30 50%)`,
          }}
        />
      )}
    </div>
  );
}
