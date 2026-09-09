import React, { useState } from 'react';
import { Target, Search, Radio, Wifi } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

const RADII = ['25M', '50M', '100M', '250M', '500M'];

export function AreaScanner() {
  const { triggerAreaScan, nodes } = useSimulation();
  const [selectedRadius, setSelectedRadius] = useState('100M');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (radius) => {
    setSelectedRadius(radius);
    setIsScanning(true);
    triggerAreaScan(radius);
    setTimeout(() => setIsScanning(false), 1200);
  };

  const mobileCount = nodes.filter((n) => n.type.includes('MOBILE')).length;
  const compCount = nodes.filter((n) => n.type.includes('LAPTOP') || n.type.includes('WORKSTATION')).length;
  const smartCount = nodes.filter((n) => n.type.includes('SMART') || n.type.includes('TERMINAL')).length;
  const unknownCount = nodes.filter((n) => n.type.includes('UNKNOWN')).length;

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <Target size={14} color="var(--electric-cyan)" />
          <span>AREA SIGNAL SCANNER</span>
        </div>
        <span className="cyber-badge cyber-badge-green">
          {isScanning ? 'SCANNING...' : 'READY'}
        </span>
      </div>

      {/* Radius selector buttons */}
      <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
        {RADII.map((radius) => (
          <button
            key={radius}
            onClick={() => handleScan(radius)}
            className={`cyber-btn ${selectedRadius === radius ? 'cyber-btn-active' : ''}`}
            style={{ flex: 1, justifyContent: 'center', padding: '4px 0', fontSize: '10px' }}
          >
            {radius}
          </button>
        ))}
      </div>

      {/* Breakdown Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px',
        backgroundColor: 'rgba(3, 8, 16, 0.8)',
        padding: '8px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        fontSize: '11px'
      }}>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>MOBILE NODES</div>
          <div style={{ color: 'var(--electric-cyan)', fontWeight: 700, fontSize: '14px' }}>{mobileCount}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>COMPUTING</div>
          <div style={{ color: 'var(--neon-green)', fontWeight: 700, fontSize: '14px' }}>{compCount}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>SMART DEVICES</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{smartCount}</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>UNKNOWN</div>
          <div style={{ color: 'var(--alert-red)', fontWeight: 700, fontSize: '14px' }}>{unknownCount}</div>
        </div>
      </div>
    </div>
  );
}
