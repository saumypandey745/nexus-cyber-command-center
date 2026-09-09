import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Flame, Radio, AlertTriangle } from 'lucide-react';

export function NuclearControl() {
  const [coreTemp, setCoreTemp] = useState(842);
  const [pressure, setPressure] = useState(14.2);
  const [rodPosition, setRodPosition] = useState(65);
  const [meltdownRisk, setMeltdownRisk] = useState(24.5);
  const [scramActive, setScramActive] = useState(false);

  useEffect(() => {
    if (scramActive) return;
    const interval = setInterval(() => {
      setCoreTemp(prev => Math.min(1850, Math.max(600, prev + Math.floor(Math.random() * 15 - 6))));
      setPressure(prev => +(Math.min(28.0, Math.max(10.0, prev + (Math.random() * 0.4 - 0.18))).toFixed(1)));
      setMeltdownRisk(prev => +(Math.min(99.9, Math.max(5.0, prev + (Math.random() * 0.6 - 0.25))).toFixed(1)));
    }, 800);
    return () => clearInterval(interval);
  }, [scramActive]);

  const handleScram = () => {
    setScramActive(true);
    setCoreTemp(320);
    setPressure(4.1);
    setMeltdownRisk(0.1);
    setRodPosition(100);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(2, 6, 16, 0.95)',
      fontFamily: 'var(--font-mono)',
      padding: '12px',
      gap: '10px',
    }}>
      {/* Header Warning Banner */}
      <div style={{
        padding: '8px 10px',
        background: scramActive ? 'rgba(0,255,102,0.15)' : 'rgba(255,0,68,0.15)',
        border: `1px solid ${scramActive ? '#00ff66' : '#ff0044'}`,
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color={scramActive ? '#00ff66' : '#ff0044'} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: scramActive ? '#00ff66' : '#ff0044', letterSpacing: '1px' }}>
              {scramActive ? 'EMERGENCY SCRAM EXECUTED' : 'REACTOR CORE #04 ONLINE'}
            </div>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>CHORNOBYL GRID • UNIT 4 MONITORED</div>
          </div>
        </div>
        <span className={scramActive ? 'cyber-badge cyber-badge-green' : 'cyber-badge cyber-badge-red'}>
          {scramActive ? 'SAFE' : 'CRITICAL'}
        </span>
      </div>

      {/* Gauges & Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div className="metric-card">
          <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>CORE TEMPERATURE</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: coreTemp > 1200 ? '#ff0044' : '#ffcc00' }}>
            {coreTemp}°C
          </div>
        </div>
        <div className="metric-card">
          <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>SYSTEM PRESSURE</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#00f0ff' }}>
            {pressure} MPa
          </div>
        </div>
      </div>

      {/* Risk progress bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 700 }}>
          <span style={{ color: 'var(--text-muted)' }}>MELTDOWN RISK PROBABILITY:</span>
          <span style={{ color: meltdownRisk > 60 ? '#ff0044' : '#00ff66' }}>{meltdownRisk}%</span>
        </div>
        <div className="cyber-progress-track">
          <div
            className="cyber-progress-bar"
            style={{
              width: `${meltdownRisk}%`,
              background: meltdownRisk > 60 ? 'linear-gradient(90deg, #ffcc00, #ff0044)' : 'linear-gradient(90deg, #00f0ff, #00ff66)',
            }}
          />
        </div>
      </div>

      {/* Emergency Control Action */}
      <button
        onClick={handleScram}
        disabled={scramActive}
        style={{
          marginTop: 'auto',
          padding: '10px',
          background: scramActive ? 'rgba(0,255,102,0.1)' : 'linear-gradient(135deg, rgba(255,0,68,0.3) 0%, rgba(255,0,68,0.1) 100%)',
          border: `1px solid ${scramActive ? '#00ff66' : '#ff0044'}`,
          borderRadius: '3px',
          color: scramActive ? '#00ff66' : '#ffffff',
          fontWeight: 900,
          fontSize: '11px',
          cursor: scramActive ? 'default' : 'pointer',
          letterSpacing: '1px',
          boxShadow: scramActive ? '0 0 10px #00ff66' : '0 0 20px rgba(255,0,68,0.4)',
        }}
      >
        {scramActive ? '✓ REACTOR COOLED // SYSTEM STABLE' : '🚨 SHUTDOWN REACTOR (AZ-5 SCRAM)'}
      </button>
    </div>
  );
}
