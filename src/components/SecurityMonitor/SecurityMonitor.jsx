import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Server, CheckCircle2, Wifi, Eye, AlertTriangle, Zap } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const SECURITY_LAYERS = [
  { id: 'FW', name: 'FIREWALL', status: 'ACTIVE', color: '#00ff66', icon: <ShieldCheck size={12} />, bars: 5 },
  { id: 'ENC', name: 'ENCRYPTION', status: 'AES-256', color: '#00f0ff', icon: <Lock size={12} />, bars: 5 },
  { id: 'IDS', name: 'INTRUSION DETECT', status: 'SCANNING', color: '#00ffaa', icon: <Eye size={12} />, bars: 4 },
  { id: 'VPN', name: 'VPN TUNNEL', status: 'SECURED', color: '#d000ff', icon: <Wifi size={12} />, bars: 5 },
];

function MiniBarChart({ bars, color, animate }) {
  const [heights, setHeights] = useState(() => Array.from({ length: 8 }, () => Math.random() * 60 + 20));

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setHeights(Array.from({ length: 8 }, () => Math.random() * 60 + 20));
    }, 800);
    return () => clearInterval(interval);
  }, [animate]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '20px' }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: '3px',
          height: `${h}%`,
          background: color,
          borderRadius: '1px',
          boxShadow: `0 0 4px ${color}`,
          transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: 0.7 + (h / 100) * 0.3,
        }} />
      ))}
    </div>
  );
}

export function SecurityMonitor() {
  const { systemMetrics, threatLevel } = useSimulation();
  const [scanProgress, setScanProgress] = useState(0);
  const [packetsBlocked, setPacketsBlocked] = useState(1247);
  const [integrityScore, setIntegrityScore] = useState(98.4);

  useEffect(() => {
    const scan = setInterval(() => {
      setScanProgress(prev => (prev >= 100 ? 0 : prev + 2.5));
    }, 80);
    const packets = setInterval(() => {
      setPacketsBlocked(prev => prev + Math.floor(Math.random() * 3));
    }, 1200);
    const integrity = setInterval(() => {
      setIntegrityScore(prev => +(Math.min(99.9, Math.max(97.0, prev + (Math.random() * 0.4 - 0.2))).toFixed(1)));
    }, 2000);
    return () => { clearInterval(scan); clearInterval(packets); clearInterval(integrity); };
  }, []);

  const isCritical = threatLevel === 'CRITICAL';

  return (
    <div className="cyber-panel" style={{ padding: '0', gap: '0', flex: '0 0 auto' }}>
      {/* Corner decorators */}
      <div className="cyber-panel-corner-tl" />
      <div className="cyber-panel-corner-tr" />
      <div className="cyber-panel-corner-bl" />
      <div className="cyber-panel-corner-br" />

      {/* Header */}
      <div className="cyber-panel-header">
        <div className="panel-title">
          <ShieldCheck size={12} color="#00ff88" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.8))' }} />
          <span>SECURITY MATRIX</span>
        </div>
        <span className={`cyber-badge ${isCritical ? 'cyber-badge-red' : 'cyber-badge-green'}`}>
          {isCritical ? '⚠ BREACH' : '✓ SHIELDED'}
        </span>
      </div>

      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 2 }}>
        {/* Security layers grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
          {SECURITY_LAYERS.map(layer => (
            <div key={layer.id} style={{
              background: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, ${layer.color}06 100%)`,
              border: `1px solid ${layer.color}25`,
              borderRadius: '3px',
              padding: '7px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${layer.color}55`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${layer.color}25`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: layer.color }}>
                  {React.cloneElement(layer.icon, { color: layer.color, style: { filter: `drop-shadow(0 0 4px ${layer.color})` } })}
                </div>
                <MiniBarChart bars={layer.bars} color={layer.color} animate={true} />
              </div>
              <div style={{ fontSize: '8px', color: 'var(--text-muted)', letterSpacing: '0.8px' }}>{layer.name}</div>
              <div style={{
                fontSize: '10px',
                color: layer.color,
                fontWeight: 700,
                textShadow: `0 0 8px ${layer.color}`,
                letterSpacing: '0.5px',
              }}>
                {layer.status}
              </div>
            </div>
          ))}
        </div>

        {/* Active scan bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '4px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={8} color="#00e5ff" /> DEEP PACKET SCAN
            </span>
            <span style={{ color: '#00e5ff' }}>{scanProgress.toFixed(0)}%</span>
          </div>
          <div style={{
            height: '3px',
            background: 'rgba(0,229,255,0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              width: `${scanProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00e5ff, #00ff88)',
              borderRadius: '2px',
              boxShadow: '0 0 8px rgba(0,229,255,0.6)',
              transition: 'width 0.1s linear',
            }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>BLOCKED</div>
            <div style={{ color: '#ff6600', fontWeight: 700, textShadow: '0 0 6px rgba(255,102,0,0.6)' }}>
              {packetsBlocked.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>LAYERS</div>
            <div style={{ color: '#00e5ff', fontWeight: 700, textShadow: '0 0 6px rgba(0,229,255,0.6)' }}>
              07
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>INTEGRITY</div>
            <div style={{ color: '#00ff88', fontWeight: 700, textShadow: '0 0 6px var(--neon-green-glow)' }}>
              {integrityScore}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
