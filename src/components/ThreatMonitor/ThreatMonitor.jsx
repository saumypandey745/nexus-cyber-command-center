import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const THREAT_LEVELS = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'CRITICAL'];

const THREAT_INFO = {
  LOW:      { color: 'var(--neon-green)',    badge: 'cyber-badge-green', desc: 'ALL SYSTEMS SECURE' },
  GUARDED:  { color: 'var(--electric-cyan)', badge: 'cyber-badge-cyan',  desc: 'MONITORING ACTIVE' },
  ELEVATED: { color: 'var(--warning-amber)', badge: 'cyber-badge-amber', desc: 'ANOMALY DETECTED' },
  HIGH:     { color: '#ff6600',             badge: 'cyber-badge-amber', desc: 'THREAT IMMINENT' },
  CRITICAL: { color: 'var(--alert-red)',    badge: 'cyber-badge-red',   desc: 'EMERGENCY PROTOCOL' },
};

export function ThreatMonitor() {
  const { threatLevel, setThreatLevel, addLog, addNotification, triggerSystemOverride } = useSimulation();
  const [flashLevel, setFlashLevel] = useState(null);

  const handleLevelChange = (lvl) => {
    if (lvl === threatLevel) return;
    setFlashLevel(lvl);
    setThreatLevel(lvl);
    addLog(
      `THREAT LEVEL CHANGED: ${threatLevel} → ${lvl}`,
      lvl === 'CRITICAL' ? 'critical' : lvl === 'HIGH' ? 'warning' : 'info',
      'THREAT'
    );
    addNotification(`THREAT LEVEL SET TO ${lvl}`, lvl === 'CRITICAL' ? 'critical' : 'info');
    setTimeout(() => setFlashLevel(null), 600);
  };

  const handleCriticalAlert = () => {
    setThreatLevel('CRITICAL');
    addLog('!!! CRITICAL THREAT OVERRIDE TRIGGERED !!!', 'critical', 'THREAT');
    addNotification('CRITICAL THREAT OVERRIDE ACTIVE', 'critical');
    triggerSystemOverride();
  };

  const currentInfo = THREAT_INFO[threatLevel] || THREAT_INFO.GUARDED;
  const currentIdx = THREAT_LEVELS.indexOf(threatLevel);

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', fontWeight: 700, color: currentInfo.color, transition: 'color 0.3s ease' }}>
          {threatLevel === 'CRITICAL' ? (
            <ShieldAlert size={14} color={currentInfo.color} style={{ animation: 'pulse-red 0.5s infinite' }} />
          ) : (
            <AlertTriangle size={14} color={currentInfo.color} />
          )}
          <span>THREAT INTELLIGENCE</span>
        </div>
        <span className={`cyber-badge ${currentInfo.badge}`} style={{ transition: 'all 0.3s ease' }}>
          {currentInfo.desc}
        </span>
      </div>

      {/* Threat Level Selector Bars */}
      <div style={{ display: 'flex', gap: '3px', width: '100%', height: '22px' }}>
        {THREAT_LEVELS.map((lvl, idx) => {
          const isActive = currentIdx >= idx;
          const info = THREAT_INFO[lvl];
          const isFlashing = flashLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              title={`Set threat level to ${lvl}`}
              style={{
                flex: 1,
                backgroundColor: isActive ? info.color : 'rgba(0, 240, 255, 0.06)',
                border: `1px solid ${isActive ? info.color : 'var(--border-cyan)'}`,
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '8px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: isActive ? '#020509' : 'var(--text-muted)',
                transition: 'all 0.25s ease',
                boxShadow: isActive ? `0 0 10px ${info.color}` : 'none',
                transform: isFlashing ? 'scaleY(1.15)' : 'scaleY(1)',
                letterSpacing: '0.3px'
              }}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      {/* Critical Alert Trigger Button */}
      <button
        className={`cyber-btn ${threatLevel === 'CRITICAL' ? 'cyber-btn-red' : ''}`}
        onClick={handleCriticalAlert}
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '5px 0',
          fontSize: '10px',
          gap: '5px',
          animation: threatLevel === 'CRITICAL' ? 'pulse-red 1s infinite' : 'none'
        }}
      >
        <Zap size={11} />
        {threatLevel === 'CRITICAL' ? '!! OVERRIDE ACTIVE !!' : 'TRIGGER CRITICAL OVERRIDE'}
      </button>
    </div>
  );
}
