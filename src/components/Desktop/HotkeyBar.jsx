import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Maximize, Lock, Hash, Terminal, Globe, AlertTriangle } from 'lucide-react';
import { useWindowContext } from '../../context/WindowContext';

export function HotkeyBar() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeKey, setActiveKey] = useState(null);
  const { requestOpenWindow } = useWindowContext() || {};

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
    const WINDOW_HOTKEYS = {
      '1': { id: 'password_cracker', freq: 900, type: 'square' },
      '2': { id: 'bitcoin_miner', freq: 1100, type: 'sine' },
      '3': { id: 'hacker_typer', freq: 700, type: 'sawtooth' },
      '4': { id: 'ip_tracer', freq: 850, type: 'triangle' },
      '5': { id: 'self_destruct', freq: 400, type: 'sawtooth' },
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (WINDOW_HOTKEYS[e.key]) {
        const { id, freq, type } = WINDOW_HOTKEYS[e.key];
        setActiveKey(e.key);
        playHackerBeep(freq, type);
        requestOpenWindow?.(id);
        setTimeout(() => setActiveKey(null), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioEnabled, requestOpenWindow]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

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
      {/* Hotkey hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#00ff66', letterSpacing: '0.5px', fontWeight: 800 }}>
          ⌨ Press any key to hack | Press 1-5 for tools | 0-9 for popups | Space to close
        </span>
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
