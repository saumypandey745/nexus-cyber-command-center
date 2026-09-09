import React from 'react';
import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const THREAT_LEVELS = ['LOW', 'GUARDED', 'ELEVATED', 'HIGH', 'CRITICAL'];

export function ThreatMonitor() {
  const { threatLevel, setThreatLevel, addLog, addNotification, sound } = useSimulation();

  const handleLevelChange = (lvl) => {
    setThreatLevel(lvl);
    addLog(`THREAT LEVEL MANUALLY ADJUSTED TO ${lvl}`, lvl === 'CRITICAL' ? 'critical' : 'warning', 'THREAT');
    addNotification(`THREAT LEVEL SET TO ${lvl}`, lvl === 'CRITICAL' ? 'critical' : 'info');
    if (lvl === 'CRITICAL' || lvl === 'HIGH') {
      sound.playAlertSound();
    } else {
      sound.playClickSound();
    }
  };

  const getBarColor = (lvl) => {
    switch (lvl) {
      case 'LOW': return 'var(--neon-green)';
      case 'GUARDED': return 'var(--electric-cyan)';
      case 'ELEVATED': return 'var(--warning-amber)';
      case 'HIGH': return '#ff6600';
      case 'CRITICAL': return 'var(--alert-red)';
      default: return 'var(--electric-cyan)';
    }
  };

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <AlertTriangle size={14} color={threatLevel === 'CRITICAL' ? 'var(--alert-red)' : 'var(--electric-cyan)'} />
          <span>THREAT INTELLIGENCE CENTER</span>
        </div>
        <span className={`cyber-badge ${threatLevel === 'CRITICAL' ? 'cyber-badge-red' : 'cyber-badge-cyan'}`}>
          STATUS: {threatLevel}
        </span>
      </div>

      {/* Threat Level Meter Gauge */}
      <div style={{ display: 'flex', gap: '4px', width: '100%', height: '18px' }}>
        {THREAT_LEVELS.map((lvl, idx) => {
          const isActive = THREAT_LEVELS.indexOf(threatLevel) >= idx;
          return (
            <button
              key={lvl}
              onClick={() => handleLevelChange(lvl)}
              style={{
                flex: 1,
                backgroundColor: isActive ? getBarColor(lvl) : 'rgba(0, 240, 255, 0.08)',
                border: '1px solid var(--border-cyan)',
                borderRadius: '1px',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: isActive ? '#020509' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 0 8px ${getBarColor(lvl)}` : 'none'
              }}
            >
              {lvl}
            </button>
          );
        })}
      </div>
    </div>
  );
}
