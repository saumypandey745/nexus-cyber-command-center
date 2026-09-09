import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Maximize, Lock, Hash, Terminal, Globe, AlertTriangle } from 'lucide-react';

export function HotkeyBar({ onTriggerTool }) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeKey, setActiveKey] = useState(null);

  // Play synthetic Web Audio hacker click
  const playHackerBeep = (freq = 800, type = 'sine') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio autoplay restriction fallback
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '1') {
        setActiveKey('1');
        playHackerBeep(900, 'square');
        onTriggerTool?.('password_cracker');
      } else if (e.key === '2') {
        setActiveKey('2');
        playHackerBeep(1100, 'sine');
        onTriggerTool?.('bitcoin_miner');
      } else if (e.key === '3') {
        setActiveKey('3');
        playHackerBeep(700, 'sawtooth');
        onTriggerTool?.('hacker_typer');
      } else if (e.key === '4') {
        setActiveKey('4');
        playHackerBeep(850, 'triangle');
        onTriggerTool?.('ip_tracer');
      } else if (e.key === '5') {
        setActiveKey('5');
        playHackerBeep(400, 'sawtooth');
        onTriggerTool?.('self_destruct');
      }

      setTimeout(() => setActiveKey(null), 300);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioEnabled, onTriggerTool]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const HOTKEYS = [
    { key: '1', name: 'PASS CRACKER', id: 'password_cracker', color: '#ff0044', icon: <Lock size={10} /> },
    { key: '2', name: 'BTC MINER', id: 'bitcoin_miner', color: '#ffcc00', icon: <Hash size={10} /> },
    { key: '3', name: 'HACKER TYPER', id: 'hacker_typer', color: '#00ff66', icon: <Terminal size={10} /> },
    { key: '4', name: 'IP TRACER', id: 'ip_tracer', color: '#00f0ff', icon: <Globe size={10} /> },
    { key: '5', name: 'SELF DESTRUCT', id: 'self_destruct', color: '#ff0044', icon: <AlertTriangle size={10} /> },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '3px 12px',
      background: 'rgba(0, 4, 12, 0.9)',
      borderBottom: '1px solid rgba(0, 255, 102, 0.2)',
      fontSize: '9px',
      fontFamily: 'var(--font-mono)',
      color: '#00ff66',
      zIndex: 100,
      position: 'relative',
    }}>
      {/* Hotkey buttons list */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--text-muted)', letterSpacing: '1px', fontWeight: 800 }}>
          QUICK HOTKEYS:
        </span>
        {HOTKEYS.map((hk) => {
          const isActive = activeKey === hk.key;
          return (
            <button
              key={hk.key}
              onClick={() => {
                playHackerBeep(800, 'square');
                onTriggerTool?.(hk.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                background: isActive ? `${hk.color}40` : 'rgba(0,255,102,0.05)',
                border: `1px solid ${isActive ? hk.color : 'rgba(0,255,102,0.2)'}`,
                borderRadius: '2px',
                color: isActive ? '#ffffff' : hk.color,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 700,
                boxShadow: isActive ? `0 0 10px ${hk.color}` : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{
                background: hk.color,
                color: '#000',
                fontWeight: 900,
                padding: '0 3px',
                borderRadius: '1px',
                fontSize: '8px',
              }}>
                {hk.key}
              </span>
              <span>{hk.name}</span>
            </button>
          );
        })}
      </div>

      {/* Audio & Fullscreen Quick Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          style={{
            background: 'none',
            border: 'none',
            color: audioEnabled ? '#00ff66' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '9px',
            fontWeight: 700,
          }}
          title="Toggle Sound Effects"
        >
          {audioEnabled ? <Volume2 size={12} color="#00ff66" /> : <VolumeX size={12} color="var(--text-muted)" />}
          <span>{audioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
        </button>

        <button
          onClick={toggleFullscreen}
          style={{
            background: 'none',
            border: 'none',
            color: '#00f0ff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '9px',
            fontWeight: 700,
          }}
          title="Toggle Fullscreen Mode"
        >
          <Maximize size={12} color="#00f0ff" />
          <span>FULLSCREEN</span>
        </button>
      </div>
    </div>
  );
}
