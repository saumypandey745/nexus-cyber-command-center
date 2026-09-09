import React, { useState, useEffect } from 'react';
import { 
  Shield, Volume2, VolumeX, Monitor, Tv, Eye, Maximize, Minimize, 
  Play, RefreshCw, AlertTriangle, Cpu, Radio, Zap, Activity, Palette
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function SystemHeader() {
  const { 
    threatLevel, setThreatLevel, systemMetrics, fxSettings, toggleFx, 
    autoDemo, setAutoDemo, activeMode, setActiveMode, 
    setBootCompleted, setFocusedModule, focusedModule, sound,
    currentTheme, setCurrentTheme
  } = useSimulation();

  const [localTime, setLocalTime] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [uptimeSeconds, setUptimeSeconds] = useState(1420);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time & Uptime Counter
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLocalTime(now.toTimeString().split(' ')[0]);
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const getThreatBadgeClass = () => {
    switch (threatLevel) {
      case 'LOW': return 'cyber-badge-green';
      case 'GUARDED': return 'cyber-badge-cyan';
      case 'ELEVATED': return 'cyber-badge-amber';
      case 'HIGH': return 'cyber-badge-amber';
      case 'CRITICAL': return 'cyber-badge-red';
      default: return 'cyber-badge-cyan';
    }
  };

  return (
    <header style={{
      height: '52px',
      backgroundColor: 'rgba(2, 5, 9, 0.95)',
      borderBottom: '1px solid var(--border-cyan)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      zIndex: 100,
      gap: '12px',
      flexWrap: 'nowrap',
      overflowX: 'auto'
    }}>
      {/* Left Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 'max-content' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-header)',
          fontWeight: 900,
          fontSize: '15px',
          color: '#fff',
          letterSpacing: '1px'
        }}>
          <Shield size={22} color="var(--electric-cyan)" style={{ filter: 'drop-shadow(0 0 6px var(--electric-cyan-glow))' }} />
          <span>NEXUS <span style={{ color: 'var(--electric-cyan)', fontWeight: 400 }}>// CYBER OPS</span></span>
        </div>

        {/* Live Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
          <span className="cyber-badge cyber-badge-green">
            <Activity size={10} style={{ marginRight: '4px' }} /> CORE: ONLINE
          </span>
          <span className="cyber-badge cyber-badge-cyan">
            <Radio size={10} style={{ marginRight: '4px' }} /> MATRIX: ACTIVE
          </span>
          <span className={`cyber-badge ${getThreatBadgeClass()}`}>
            <AlertTriangle size={10} style={{ marginRight: '4px' }} /> THREAT: {threatLevel}
          </span>
        </div>
      </div>

      {/* Center Clocks & Uptime */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)',
        minWidth: 'max-content'
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>LOCAL: </span>
          <span style={{ color: 'var(--electric-cyan)', fontWeight: 700 }}>{localTime}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>UTC: </span>
          <span style={{ color: '#fff' }}>{utcTime}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>UPTIME: </span>
          <span style={{ color: 'var(--neon-green)' }}>{formatUptime(uptimeSeconds)}</span>
        </div>
      </div>

      {/* Right Control Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 'max-content' }}>
        {/* Style / Theme Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 240, 255, 0.08)', padding: '2px 6px', borderRadius: '2px', border: '1px solid var(--border-cyan)' }}>
          <Palette size={13} color="var(--electric-cyan)" />
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>STYLE:</span>
          <select 
            value={currentTheme}
            onChange={(e) => {
              setCurrentTheme(e.target.value);
              sound.playClickSound();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--electric-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="CYBERPUNK" style={{ background: '#060d17', color: '#00f0ff' }}>⚡ CYBERPUNK</option>
            <option value="MATRIX" style={{ background: '#051408', color: '#00ff66' }}>🟩 MATRIX TERMINAL</option>
            <option value="AI_LAB" style={{ background: '#0b1329', color: '#38bdf8' }}>🧪 ADVANCED AI LAB</option>
            <option value="MILITARY" style={{ background: '#121c14', color: '#f59e0b' }}>🪖 MILITARY COMMAND</option>
            <option value="HOLLYWOOD" style={{ background: '#17040b', color: '#ff0055' }}>🎬 HOLLYWOOD HACKER</option>
            <option value="RETRO_CRT" style={{ background: '#1c1200', color: '#ffb700' }}>📺 RETRO CRT</option>
          </select>
        </div>

        {/* Sound Toggle */}
        <button 
          onClick={() => toggleFx('soundEnabled')}
          className={`cyber-btn ${fxSettings.soundEnabled ? 'cyber-btn-active' : ''}`}
          title="Toggle Sound Effects [S]"
        >
          {fxSettings.soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          <span>AUDIO</span>
        </button>

        {/* CRT Scanlines Toggle */}
        <button 
          onClick={() => toggleFx('crtMode')}
          className={`cyber-btn ${fxSettings.crtMode ? 'cyber-btn-active' : ''}`}
          title="Toggle CRT Monitor Effects"
        >
          <Tv size={13} />
          <span>CRT</span>
        </button>

        {/* Matrix Rain Toggle */}
        <button 
          onClick={() => toggleFx('matrixRain')}
          className={`cyber-btn ${fxSettings.matrixRain ? 'cyber-btn-active' : ''}`}
          title="Toggle Matrix Rain Canvas [M]"
        >
          <Zap size={13} />
          <span>RAIN</span>
        </button>

        {/* Auto Demo Toggle */}
        <button 
          onClick={() => setAutoDemo(!autoDemo)}
          className={`cyber-btn ${autoDemo ? 'cyber-btn-active' : ''}`}
          title="Toggle Auto-Demo Mode [D]"
        >
          <Play size={13} />
          <span>DEMO</span>
        </button>

        {/* Panic / Minimal Mode */}
        <button 
          onClick={() => setActiveMode(activeMode === 'MINIMAL' ? 'NORMAL' : 'MINIMAL')}
          className={`cyber-btn ${activeMode === 'MINIMAL' ? 'cyber-btn-red' : ''}`}
          title="Toggle Minimal / Panic Mode"
        >
          <Eye size={13} />
          <span>{activeMode === 'MINIMAL' ? 'FULL OS' : 'PANIC'}</span>
        </button>

        {/* Replay Boot */}
        <button 
          onClick={() => setBootCompleted(false)}
          className="cyber-btn"
          title="Replay Cinematic Boot Sequence"
        >
          <RefreshCw size={13} />
        </button>

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullscreen}
          className="cyber-btn"
          title="Toggle Fullscreen Mode [F]"
        >
          {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
        </button>
      </div>
    </header>
  );
}
