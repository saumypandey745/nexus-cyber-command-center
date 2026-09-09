import React, { useState, useCallback, useRef } from 'react';
import { FloatingWindow } from './FloatingWindow';
import { PasswordCracker } from './PasswordCracker';
import { BitcoinMiner } from './BitcoinMiner';
import { HackerTyper } from './HackerTyper';
import { IPTracer } from './IPTracer';
import { SelfDestruct } from './SelfDestruct';
import {
  Lock, Bitcoin, Terminal, Globe, AlertTriangle, Monitor,
  Plus, Minimize2, Hash, Wifi,
} from 'lucide-react';

const WINDOW_DEFS = [
  {
    id: 'password_cracker',
    title: 'PASSWORD CRACKER',
    icon: <Lock size={13} />,
    accentColor: '#ff003c',
    initialSize: { w: 360, h: 460 },
    initialPos: { x: 80, y: 80 },
    component: PasswordCracker,
    dockIcon: '🔓',
    desc: 'Brute Force',
  },
  {
    id: 'bitcoin_miner',
    title: 'CRYPTO MINER',
    icon: <Hash size={13} />,
    accentColor: '#ffb300',
    initialSize: { w: 360, h: 460 },
    initialPos: { x: 460, y: 80 },
    component: BitcoinMiner,
    dockIcon: '₿',
    desc: 'Crypto Mine',
  },
  {
    id: 'hacker_typer',
    title: 'NEXUS SHELL // HACKER TYPER',
    icon: <Terminal size={13} />,
    accentColor: '#00ff88',
    initialSize: { w: 520, h: 380 },
    initialPos: { x: 200, y: 150 },
    component: HackerTyper,
    dockIcon: '>_',
    desc: 'Hacker Typer',
  },
  {
    id: 'ip_tracer',
    title: 'GLOBAL IP TRACER',
    icon: <Globe size={13} />,
    accentColor: '#ffb300',
    initialSize: { w: 420, h: 380 },
    initialPos: { x: 300, y: 200 },
    component: IPTracer,
    dockIcon: '🌐',
    desc: 'IP Tracker',
  },
  {
    id: 'self_destruct',
    title: '⚠ SELF-DESTRUCT SEQUENCE',
    icon: <AlertTriangle size={13} />,
    accentColor: '#ff003c',
    initialSize: { w: 360, h: 420 },
    initialPos: { x: 600, y: 100 },
    component: SelfDestruct,
    dockIcon: '💣',
    desc: 'Self Destruct',
  },
];

export function WindowManager() {
  const [openWindows, setOpenWindows] = useState([]);
  const [minimized, setMinimized] = useState({});
  const [zIndexMap, setZIndexMap] = useState({});
  const topZRef = useRef(2000);

  const openWindow = useCallback((def) => {
    setOpenWindows(prev => {
      if (prev.find(w => w.id === def.id)) {
        // Restore if minimized
        setMinimized(m => ({ ...m, [def.id]: false }));
        focusWindow(def.id);
        return prev;
      }
      return [...prev, def];
    });
    focusWindow(def.id);
  }, []);

  const closeWindow = useCallback((id) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    setMinimized(m => { const n = { ...m }; delete n[id]; return n; });
  }, []);

  const minimizeWindow = useCallback((id) => {
    setMinimized(m => ({ ...m, [id]: true }));
  }, []);

  const focusWindow = useCallback((id) => {
    topZRef.current += 1;
    setZIndexMap(z => ({ ...z, [id]: topZRef.current }));
  }, []);

  const restoreWindow = useCallback((id) => {
    setMinimized(m => ({ ...m, [id]: false }));
    focusWindow(id);
  }, [focusWindow]);

  return (
    <>
      {/* ─── FLOATING WINDOWS LAYER ─── */}
      {openWindows.map(def => {
        const Component = def.component;
        return (
          <FloatingWindow
            key={def.id}
            id={def.id}
            title={def.title}
            icon={def.icon}
            initialPos={def.initialPos}
            initialSize={def.initialSize}
            accentColor={def.accentColor}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onFocus={focusWindow}
            isMinimized={!!minimized[def.id]}
            zIndex={zIndexMap[def.id] || 2000}
          >
            <Component />
          </FloatingWindow>
        );
      })}

      {/* ─── DESKTOP ICON DOCK (left side) ─── */}
      <div style={{
        position: 'fixed',
        left: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 1500,
        padding: '8px 6px',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,229,255,0.12)',
        borderRadius: '6px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,255,0.06)',
      }}>
        {WINDOW_DEFS.map(def => {
          const isOpen = openWindows.find(w => w.id === def.id);
          const isMin = minimized[def.id];
          return (
            <div key={def.id} style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:'2px' }}>
              <button
                onClick={() => isOpen && !isMin ? minimizeWindow(def.id) : openWindow(def)}
                title={`${def.title}\n${isOpen ? (isMin ? 'Restore' : 'Minimize') : 'Open'}`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: `1px solid ${isOpen ? def.accentColor + '60' : 'rgba(0,229,255,0.12)'}`,
                  background: isOpen
                    ? `linear-gradient(135deg, ${def.accentColor}20, ${def.accentColor}08)`
                    : 'rgba(0,229,255,0.04)',
                  color: isOpen ? def.accentColor : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? `0 0 12px ${def.accentColor}30, inset 0 0 8px ${def.accentColor}08` : 'none',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.15)';
                  e.currentTarget.style.boxShadow = `0 0 20px ${def.accentColor}50`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = isOpen ? `0 0 12px ${def.accentColor}30` : 'none';
                }}
              >
                {def.dockIcon}
              </button>
              {/* Active indicator dot */}
              {isOpen && (
                <div style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: def.accentColor,
                  boxShadow: `0 0 6px ${def.accentColor}`,
                  animation: isMin ? 'none' : 'pulseGreen 2s infinite',
                }} />
              )}
              {!isOpen && <div style={{ width:'4px', height:'4px' }} />}
            </div>
          );
        })}

        {/* Separator */}
        <div style={{ height:'1px', background:'rgba(0,229,255,0.12)', margin:'2px 0' }} />

        {/* Quick label */}
        <div style={{
          fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '1px',
          textAlign: 'center', fontFamily: 'var(--font-header)', writingMode: 'vertical-rl',
          textOrientation: 'mixed', transform: 'rotate(180deg)',
          padding: '4px 0', opacity: 0.6,
        }}>
          NEXUS TOOLS
        </div>
      </div>

      {/* ─── TASKBAR (bottom, overlaid on event feed) ─── */}
      <div style={{
        position: 'fixed',
        bottom: '34px', // above event feed
        left: '0',
        right: '0',
        height: '36px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,229,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: '4px',
        zIndex: 1490,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {/* App launcher button */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '3px 10px',
          borderRight: '1px solid rgba(0,229,255,0.1)',
          marginRight: '6px',
          height: '100%',
        }}>
          <div style={{
            fontFamily: 'var(--font-header)',
            fontSize: '9px',
            letterSpacing: '2px',
            color: 'var(--electric-cyan)',
            fontWeight: 700,
            textShadow: '0 0 8px rgba(0,229,255,0.6)',
          }}>
            NEXUS OS
          </div>
        </div>

        {/* Open windows in taskbar */}
        {openWindows.map(def => {
          const isMin = minimized[def.id];
          return (
            <button
              key={def.id}
              onClick={() => isMin ? restoreWindow(def.id) : (focusWindow(def.id), minimizeWindow(def.id))}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px',
                background: !isMin ? `${def.accentColor}12` : 'rgba(0,0,0,0.3)',
                border: `1px solid ${!isMin ? def.accentColor + '40' : 'rgba(0,229,255,0.1)'}`,
                borderRadius: '3px',
                color: !isMin ? def.accentColor : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                height: '26px',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '11px' }}>{def.dockIcon}</span>
              <span>{def.desc}</span>
              {!isMin && <div style={{ width:'5px', height:'5px', borderRadius:'50%', background: def.accentColor, boxShadow:`0 0 4px ${def.accentColor}`, marginLeft:'2px' }} />}
            </button>
          );
        })}

        {/* Add new window shortcut */}
        <button
          onClick={() => {
            const closed = WINDOW_DEFS.filter(d => !openWindows.find(w => w.id === d.id));
            if (closed.length > 0) openWindow(closed[0]);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 8px', marginLeft: 'auto',
            background: 'rgba(0,229,255,0.04)',
            border: '1px solid rgba(0,229,255,0.12)',
            borderRadius: '3px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            cursor: 'pointer',
            height: '26px',
          }}
        >
          <Plus size={10} />
          <span>OPEN TOOL</span>
        </button>
      </div>
    </>
  );
}
