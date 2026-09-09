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
    <div className="cyber-panel" style={{
      padding: '0',
      gap: '0',
      animation: threatLevel === 'CRITICAL' ? 'warningStrobe 0.8s ease-in-out infinite' : 'none',
    }}>
      <div className="cyber-panel-corner-tl" style={{ borderColor: currentInfo.color }} />
      <div className="cyber-panel-corner-tr" style={{ borderColor: currentInfo.color }} />
      <div className="cyber-panel-corner-bl" style={{ borderColor: currentInfo.color }} />
      <div className="cyber-panel-corner-br" style={{ borderColor: currentInfo.color }} />

      {/* Threat-colored header */}
      <div className="cyber-panel-header" style={{
        background: `linear-gradient(90deg, ${currentInfo.color}18 0%, transparent 100%)`,
        borderBottomColor: `${currentInfo.color}30`,
        transition: 'all 0.4s ease',
      }}>
        <div className="panel-title" style={{ color: currentInfo.color, transition: 'color 0.3s ease' }}>
          {threatLevel === 'CRITICAL' ? (
            <ShieldAlert size={12} color={currentInfo.color} style={{ filter: `drop-shadow(0 0 6px ${currentInfo.color})`, animation: 'pulseRed 0.8s ease-in-out infinite' }} />
          ) : (
            <AlertTriangle size={12} color={currentInfo.color} style={{ filter: `drop-shadow(0 0 5px ${currentInfo.color})` }} />
          )}
          <span style={{ textShadow: `0 0 10px ${currentInfo.color}50` }}>THREAT INTEL</span>
        </div>
        <span className={`cyber-badge ${currentInfo.badge}`} style={{ transition: 'all 0.3s ease' }}>
          {currentInfo.desc}
        </span>
      </div>

      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2, position: 'relative' }}>

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
            gap: '6px',
            animation: threatLevel === 'CRITICAL' ? 'pulseRed 1s infinite' : 'none',
            boxShadow: threatLevel === 'CRITICAL' ? '0 0 20px var(--alert-red-glow), inset 0 0 10px rgba(255,0,60,0.08)' : 'none',
          }}
        >
          <Zap size={11} />
          {threatLevel === 'CRITICAL' ? '!! OVERRIDE ACTIVE !!' : 'TRIGGER CRITICAL OVERRIDE'}
        </button>
      </div>
    </div>
  );
}
