import React, { useState, useEffect } from 'react';
import { Target, Search, Radio, Wifi, Cpu, HelpCircle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const RADII = ['25M', '50M', '100M', '250M', '500M'];

export function AreaScanner() {
  const { triggerAreaScan, nodes } = useSimulation();
  const [selectedRadius, setSelectedRadius] = useState('100M');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScanCount, setLastScanCount] = useState(null);

  const handleScan = (radius) => {
    if (isScanning) return;
    setSelectedRadius(radius);
    setIsScanning(true);
    setScanProgress(0);
    triggerAreaScan(radius);

    // Progress bar animation (1200ms matches triggerAreaScan timeout)
    const steps = 20;
    const stepDuration = 1200 / steps;
    let step = 0;
    const progressInterval = setInterval(() => {
      step++;
      setScanProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(progressInterval);
        setIsScanning(false);
        setLastScanCount(nodes.length);
      }
    }, stepDuration);
  };

  const mobileCount = nodes.filter((n) => n.type.includes('MOBILE')).length;
  const compCount = nodes.filter((n) => n.type.includes('LAPTOP') || n.type.includes('WORKSTATION')).length;
  const smartCount = nodes.filter((n) => n.type.includes('SMART') || n.type.includes('TERMINAL')).length;
  const unknownCount = nodes.filter((n) => n.type.includes('UNKNOWN')).length;

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontFamily: 'var(--font-header)', fontSize: '11px',
          color: 'var(--electric-cyan)', fontWeight: 700
        }}>
          <Target size={14} color="var(--electric-cyan)" />
          <span>AREA SIGNAL SCANNER</span>
        </div>
        <span className={`cyber-badge ${isScanning ? 'cyber-badge-amber' : 'cyber-badge-green'}`}
          style={{ animation: isScanning ? 'pulse-red 0.8s infinite' : 'none' }}
        >
          {isScanning ? `SCANNING ${scanProgress}%` : 'READY'}
        </span>
      </div>

      {/* Scan Progress Bar */}
      {isScanning && (
        <div style={{
          height: '3px',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${scanProgress}%`,
            height: '100%',
            backgroundColor: 'var(--electric-cyan)',
            boxShadow: '0 0 8px var(--electric-cyan-glow)',
            transition: 'width 0.06s linear'
          }} />
        </div>
      )}

      {/* Radius selector buttons */}
      <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
        {RADII.map((radius) => (
          <button
            key={radius}
            onClick={() => handleScan(radius)}
            disabled={isScanning}
            className={`cyber-btn ${selectedRadius === radius ? 'cyber-btn-active' : ''}`}
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: '4px 0',
              fontSize: '10px',
              opacity: isScanning ? 0.6 : 1,
              cursor: isScanning ? 'not-allowed' : 'pointer'
            }}
          >
            {radius}
          </button>
        ))}
      </div>

      {/* Breakdown Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '4px',
        backgroundColor: 'rgba(3, 8, 16, 0.8)',
        padding: '6px 8px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        fontSize: '11px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '8px', marginBottom: '2px' }}>MOBILE</div>
          <div style={{ color: 'var(--electric-cyan)', fontWeight: 700, fontSize: '14px' }}>{mobileCount}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '8px', marginBottom: '2px' }}>COMPUTING</div>
          <div style={{ color: 'var(--neon-green)', fontWeight: 700, fontSize: '14px' }}>{compCount}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '8px', marginBottom: '2px' }}>SMART</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{smartCount}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '8px', marginBottom: '2px' }}>UNKNOWN</div>
          <div style={{ color: 'var(--alert-red)', fontWeight: 700, fontSize: '14px' }}>{unknownCount}</div>
        </div>
      </div>
    </div>
  );
}
