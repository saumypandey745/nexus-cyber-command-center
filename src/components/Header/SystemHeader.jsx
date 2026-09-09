import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Volume2, VolumeX, Monitor, Tv, Eye, Maximize, Minimize,
  Play, RefreshCw, AlertTriangle, Cpu, Radio, Zap, Activity, Palette,
  Wifi, Database, Lock, Globe, ChevronDown, BarChart2, Settings
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const THREAT_CONFIG = {
  LOW:      { color: '#00ff88', glow: 'rgba(0,255,136,0.5)',  bg: 'rgba(0,255,136,0.08)',  border: 'rgba(0,255,136,0.35)',  pulse: false },
  GUARDED:  { color: '#00e5ff', glow: 'rgba(0,229,255,0.5)',  bg: 'rgba(0,229,255,0.08)',  border: 'rgba(0,229,255,0.35)',  pulse: false },
  ELEVATED: { color: '#ffb300', glow: 'rgba(255,179,0,0.5)',  bg: 'rgba(255,179,0,0.08)',  border: 'rgba(255,179,0,0.35)',  pulse: false },
  HIGH:     { color: '#ff6600', glow: 'rgba(255,102,0,0.5)',  bg: 'rgba(255,102,0,0.1)',   border: 'rgba(255,102,0,0.45)',  pulse: true  },
  CRITICAL: { color: '#ff003c', glow: 'rgba(255,0,60,0.6)',   bg: 'rgba(255,0,60,0.12)',   border: 'rgba(255,0,60,0.5)',    pulse: true  },
};

export function SystemHeader() {
  const {
    threatLevel, setThreatLevel, systemMetrics, fxSettings, toggleFx,
    autoDemo, setAutoDemo, activeMode, setActiveMode,
    setBootCompleted, setFocusedModule, focusedModule, sound,
    currentTheme, setCurrentTheme, triggerDeepAnalysis, triggerSystemOverride
  } = useSimulation();

  const [localTime, setLocalTime] = useState('');
  const [utcTime, setUtcTime] = useState('');
  const [uptimeSeconds, setUptimeSeconds] = useState(1420);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [packetFlash, setPacketFlash] = useState(false);
  const [prevDataFlow, setPrevDataFlow] = useState(systemMetrics.dataFlow);

  // Time & uptime
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLocalTime(now.toTimeString().split(' ')[0]);
      setUtcTime(now.toUTCString().split(' ')[4]);
      setUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Packet flash on data change
  useEffect(() => {
    if (systemMetrics.dataFlow !== prevDataFlow) {
      setPacketFlash(true);
      setTimeout(() => setPacketFlash(false), 300);
      setPrevDataFlow(systemMetrics.dataFlow);
    }
  }, [systemMetrics.dataFlow, prevDataFlow]);

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
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const tc = THREAT_CONFIG[threatLevel] || THREAT_CONFIG.GUARDED;
  const isCritical = threatLevel === 'CRITICAL';
  const isHighPlus = threatLevel === 'HIGH' || threatLevel === 'CRITICAL';

  return (
    <header style={{
      height: '54px',
      background: isHighPlus
        ? 'linear-gradient(90deg, rgba(255,0,60,0.08) 0%, rgba(2,5,9,0.97) 30%, rgba(2,5,9,0.97) 70%, rgba(255,0,60,0.05) 100%)'
        : 'linear-gradient(90deg, rgba(0,229,255,0.05) 0%, rgba(2,5,9,0.97) 20%, rgba(2,5,9,0.97) 80%, rgba(0,255,136,0.03) 100%)',
      borderBottom: `1px solid ${isHighPlus ? 'rgba(255,0,60,0.3)' : 'rgba(0,229,255,0.18)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      zIndex: 100,
      gap: '10px',
      flexWrap: 'nowrap',
      position: 'relative',
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {/* Animated top edge line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1px',
        background: isHighPlus
          ? 'linear-gradient(90deg, transparent, rgba(255,0,60,0.8), rgba(255,0,60,0.4), rgba(255,0,60,0.8), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(0,229,255,0.7), rgba(0,255,136,0.5), rgba(0,229,255,0.7), transparent)',
        animation: 'edgeFlow 3s linear infinite',
        backgroundSize: '200% 100%',
        pointerEvents: 'none',
      }} />

      {/* Critical warning stripes overlay */}
      {isCritical && (
        <div className="warning-stripe" style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      {/* ─── LEFT: BRAND + STATUS ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 'max-content', position: 'relative', zIndex: 1 }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, rgba(0,229,255,0.5), rgba(0,255,136,0.3), rgba(0,229,255,0.5))',
              animation: 'hexSpin 4s linear infinite',
              opacity: 0.5,
            }} />
            <Shield
              size={20}
              color="#00e5ff"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.9))', position: 'relative' }}
            />
          </div>
          <div style={{ fontFamily: 'var(--font-header)', fontWeight: 900, fontSize: '13px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #fff 0%, #00e5ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '2px',
            }}>NEXUS</span>
            <span style={{ color: 'rgba(0,229,255,0.45)', fontWeight: 300, letterSpacing: '1px', fontSize: '11px' }}> // OPS</span>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '30px', background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.3), transparent)' }} />

        {/* Status badges cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {/* CORE status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '3px 8px',
            background: 'rgba(0,255,136,0.07)',
            border: '1px solid rgba(0,255,136,0.25)',
            borderRadius: '2px',
            fontSize: '9px',
            color: '#00ff88',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
          }}>
            <div className="status-dot status-dot-green" style={{ width: '5px', height: '5px' }} />
            CORE
          </div>

          {/* MATRIX status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '3px 8px',
            background: 'rgba(0,229,255,0.06)',
            border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: '2px',
            fontSize: '9px',
            color: 'var(--electric-cyan)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
          }}>
            <Radio size={8} />
            MATRIX
          </div>

          {/* THREAT level - dynamic */}
          <div
            onClick={() => {
              const levels = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'CRITICAL'];
              const idx = levels.indexOf(threatLevel);
              const next = levels[(idx + 1) % levels.length];
              setThreatLevel(next);
              sound.playClickSound?.();
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '3px 10px',
              background: tc.bg,
              border: `1px solid ${tc.border}`,
              borderRadius: '2px',
              fontSize: '9px',
              color: tc.color,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '1px',
              cursor: 'pointer',
              fontWeight: 700,
              boxShadow: `0 0 10px ${tc.glow.replace('0.5', '0.15')}`,
              animation: tc.pulse ? 'pulseRed 1.2s ease-in-out infinite' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <AlertTriangle size={8} />
            {threatLevel}
          </div>
        </div>
      </div>

      {/* ─── CENTER: LIVE METRICS ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1px',
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Metric items */}
        {[
          {
            icon: <Wifi size={9} />,
            label: 'NODES',
            value: systemMetrics.activeNodes,
            color: '#00ff88',
            suffix: '',
          },
          {
            icon: <Database size={9} />,
            label: 'FLOW',
            value: `${systemMetrics.dataFlow}`,
            color: packetFlash ? '#fff' : '#00e5ff',
            suffix: 'MB/s',
          },
          {
            icon: <Activity size={9} />,
            label: 'LATENCY',
            value: systemMetrics.latency,
            color: systemMetrics.latency > 20 ? '#ffb300' : '#00ff88',
            suffix: 'ms',
          },
          {
            icon: <BarChart2 size={9} />,
            label: 'STAB',
            value: `${systemMetrics.stability}`,
            color: '#00e5ff',
            suffix: '%',
          },
        ].map((m, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ width: '1px', height: '26px', background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.2), transparent)', margin: '0 4px' }} />
            )}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '3px 10px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '2px',
              minWidth: '58px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)', fontSize: '8px', letterSpacing: '1px' }}>
                {m.icon} {m.label}
              </div>
              <div style={{
                color: m.color,
                fontWeight: 700,
                fontSize: '11px',
                transition: 'color 0.3s ease',
                textShadow: `0 0 8px ${m.color}`,
                letterSpacing: '0.5px',
              }}>
                {m.value}<span style={{ fontSize: '8px', opacity: 0.7 }}>{m.suffix}</span>
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Divider */}
        <div style={{ width: '1px', height: '26px', background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.2), transparent)', margin: '0 6px' }} />

        {/* Time display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3px 10px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '8px', letterSpacing: '1px' }}>LOCAL</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textShadow: '0 0 8px rgba(0,229,255,0.5)' }}>
            {localTime}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3px 10px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '8px', letterSpacing: '1px' }}>UPTIME</div>
          <div style={{ color: '#00ff88', fontWeight: 700, fontSize: '11px', letterSpacing: '1px', textShadow: '0 0 8px var(--neon-green-glow)' }}>
            {formatUptime(uptimeSeconds)}
          </div>
        </div>
      </div>

      {/* ─── RIGHT: CONTROLS ─── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 'max-content', position: 'relative', zIndex: 1 }}>

        {/* Theme selector — styled */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: 'rgba(0,229,255,0.05)',
          border: '1px solid rgba(0,229,255,0.18)',
          borderRadius: '2px',
          padding: '3px 8px',
        }}>
          <Palette size={11} color="var(--electric-cyan)" />
          <select
            value={currentTheme}
            onChange={e => { setCurrentTheme(e.target.value); sound.playClickSound?.(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--electric-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
          >
            <option value="CYBERPUNK" style={{ background: '#060d17', color: '#00f0ff' }}>⚡ CYBERPUNK</option>
            <option value="MATRIX" style={{ background: '#051408', color: '#00ff66' }}>🟩 MATRIX</option>
            <option value="AI_LAB" style={{ background: '#0b1329', color: '#38bdf8' }}>🧪 AI LAB</option>
            <option value="MILITARY" style={{ background: '#121c14', color: '#f59e0b' }}>🪖 MILITARY</option>
            <option value="HOLLYWOOD" style={{ background: '#17040b', color: '#ff0055' }}>🎬 HOLLYWOOD</option>
            <option value="RETRO_CRT" style={{ background: '#1c1200', color: '#ffb700' }}>📺 RETRO CRT</option>
          </select>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.15), transparent)' }} />

        {/* FX Toggles */}
        {[
          { key: 'soundEnabled', icon: fxSettings.soundEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />, label: 'SFX', title: 'Toggle Sound [S]' },
          { key: 'crtMode', icon: <Tv size={11} />, label: 'CRT', title: 'Toggle CRT Mode' },
          { key: 'matrixRain', icon: <Zap size={11} />, label: 'RAIN', title: 'Toggle Matrix Rain [M]' },
        ].map(btn => (
          <button
            key={btn.key}
            onClick={() => toggleFx(btn.key)}
            className={`cyber-btn ${fxSettings[btn.key] ? 'cyber-btn-active' : ''}`}
            title={btn.title}
            style={{ padding: '3px 8px', fontSize: '9px' }}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}

        {/* Demo mode */}
        <button
          onClick={() => { setAutoDemo(!autoDemo); sound.playClickSound?.(); }}
          className={`cyber-btn ${autoDemo ? 'cyber-btn-active' : ''}`}
          title="Auto-Demo [D]"
          style={{ padding: '3px 8px', fontSize: '9px' }}
        >
          <Play size={11} />
          <span>DEMO</span>
        </button>

        {/* Deep analysis */}
        <button
          onClick={triggerDeepAnalysis}
          className="cyber-btn"
          title="Trigger Deep Analysis"
          style={{
            padding: '3px 8px', fontSize: '9px',
            borderColor: 'rgba(191,0,255,0.3)',
            color: '#bf00ff',
          }}
        >
          <Eye size={11} />
          <span>ANALYZE</span>
        </button>

        {/* Override button */}
        <button
          onClick={triggerSystemOverride}
          className="cyber-btn cyber-btn-red"
          title="System Override"
          style={{ padding: '3px 8px', fontSize: '9px' }}
        >
          <AlertTriangle size={11} />
          <span>OVERRIDE</span>
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.15), transparent)' }} />

        {/* Utility buttons */}
        <button
          onClick={() => setBootCompleted(false)}
          className="cyber-btn"
          title="Replay Boot"
          style={{ padding: '3px 6px' }}
        >
          <RefreshCw size={11} />
        </button>

        <button
          onClick={toggleFullscreen}
          className="cyber-btn"
          title="Fullscreen [F]"
          style={{ padding: '3px 6px' }}
        >
          {isFullscreen ? <Minimize size={11} /> : <Maximize size={11} />}
        </button>
      </div>
    </header>
  );
}
