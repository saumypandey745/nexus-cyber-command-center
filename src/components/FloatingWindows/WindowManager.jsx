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
    accentColor: '#ff0044',
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
    accentColor: '#ffcc00',
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
    accentColor: '#00ff66',
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
    accentColor: '#00f0ff',
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
    accentColor: '#ff0044',
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
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const topZRef = useRef(2000);

  const openWindow = useCallback((def) => {
    setOpenWindows(prev => {
      if (prev.find(w => w.id === def.id)) {
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
        border: '1px solid rgba(0,255,102,0.2)',
        borderRadius: '6px',
        boxShadow: '0 4px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,102,0.1)',
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
                  border: `1px solid ${isOpen ? def.accentColor : 'rgba(0,255,102,0.2)'}`,
                  background: isOpen
                    ? `linear-gradient(135deg, ${def.accentColor}25, ${def.accentColor}08)`
                    : 'rgba(0,255,102,0.04)',
                  color: isOpen ? def.accentColor : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? `0 0 12px ${def.accentColor}40, inset 0 0 8px ${def.accentColor}10` : 'none',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.15)';
                  e.currentTarget.style.boxShadow = `0 0 20px ${def.accentColor}60`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = isOpen ? `0 0 12px ${def.accentColor}40` : 'none';
                }}
              >
                {def.dockIcon}
              </button>
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

        <div style={{ height:'1px', background:'rgba(0,255,102,0.2)', margin:'2px 0' }} />

        <div style={{
          fontSize: '7px', color: 'var(--text-muted)', letterSpacing: '1px',
          textAlign: 'center', fontFamily: 'var(--font-header)', writingMode: 'vertical-rl',
          textOrientation: 'mixed', transform: 'rotate(180deg)',
          padding: '4px 0', opacity: 0.6,
        }}>
          NEXUS TOOLS
        </div>
      </div>

      {/* ─── CYBER START MENU POPUP ─── */}
      {startMenuOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '72px',
            left: '10px',
            width: '320px',
            background: 'rgba(2, 8, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid #00ff66',
            boxShadow: '0 0 30px rgba(0, 255, 102, 0.3), 0 10px 40px rgba(0,0,0,0.9)',
            borderRadius: '4px',
            zIndex: 2500,
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {/* Menu Header */}
          <div style={{
            padding: '10px 12px',
            background: 'linear-gradient(90deg, rgba(0,255,102,0.2) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(0,255,102,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#00ff66', boxShadow: '0 0 10px #00ff66',
              }} />
              <span style={{
                fontFamily: 'var(--font-header)',
                fontSize: '11px',
                fontWeight: 900,
                color: '#00ff66',
                letterSpacing: '2px',
                textShadow: '0 0 10px rgba(0,255,102,0.6)',
              }}>
                NEXUS OS // MENU
              </span>
            </div>
            <span className="cyber-badge cyber-badge-green" style={{ fontSize: '8px' }}>v5.0 ONLINE</span>
          </div>

          {/* Apps list */}
          <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '1px', padding: '2px 4px' }}>
              APPLICATIONS & TOOLS:
            </div>
            {WINDOW_DEFS.map(def => (
              <button
                key={def.id}
                onClick={() => {
                  openWindow(def);
                  setStartMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 10px',
                  background: 'rgba(0, 240, 255, 0.03)',
                  border: '1px solid rgba(0, 240, 255, 0.1)',
                  borderRadius: '3px',
                  color: def.accentColor,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${def.accentColor}20`;
                  e.currentTarget.style.borderColor = def.accentColor;
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(0, 240, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.1)';
                  e.currentTarget.style.color = def.accentColor;
                }}
              >
                <span style={{ fontSize: '14px' }}>{def.dockIcon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800 }}>{def.title}</div>
                  <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{def.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Menu Footer */}
          <div style={{
            padding: '8px 12px',
            background: 'rgba(0,0,0,0.5)',
            borderTop: '1px solid rgba(0,255,102,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '9px',
          }}>
            <span style={{ color: 'var(--text-muted)' }}>STATUS: <span style={{ color: '#00ff66' }}>SECURE</span></span>
            <button
              onClick={() => {
                setOpenWindows([]);
                setStartMenuOpen(false);
              }}
              style={{
                background: 'rgba(255,0,68,0.15)',
                border: '1px solid #ff0044',
                color: '#ff0044',
                padding: '2px 8px',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '8px',
                fontWeight: 800,
              }}
            >
              MINIMIZE ALL
            </button>
          </div>
        </div>
      )}

      {/* ─── TASKBAR (bottom, overlaid on event feed) ─── */}
      <div style={{
        position: 'fixed',
        bottom: '34px', // above event feed
        left: '0',
        right: '0',
        height: '36px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,255,102,0.2)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: '4px',
        zIndex: 1490,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {/* App launcher button */}
        <button
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '3px 12px',
            background: startMenuOpen ? 'rgba(0,255,102,0.25)' : 'rgba(0,255,102,0.08)',
            border: `1px solid ${startMenuOpen ? '#00ff66' : 'rgba(0,255,102,0.3)'}`,
            borderRadius: '3px',
            marginRight: '6px',
            height: '26px',
            cursor: 'pointer',
            boxShadow: startMenuOpen ? '0 0 12px #00ff66' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-header)',
            fontSize: '9px',
            letterSpacing: '2px',
            color: '#00ff66',
            fontWeight: 900,
            textShadow: '0 0 8px rgba(0,255,102,0.8)',
          }}>
            ⚡ NEXUS OS
          </div>
        </button>

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
                background: !isMin ? `${def.accentColor}18` : 'rgba(0,0,0,0.3)',
                border: `1px solid ${!isMin ? def.accentColor : 'rgba(0,255,102,0.15)'}`,
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
            background: 'rgba(0,255,102,0.05)',
            border: '1px solid rgba(0,255,102,0.2)',
            borderRadius: '3px',
            color: '#00ff66',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            fontWeight: 700,
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
