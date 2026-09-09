import React from 'react';
import { ShieldCheck, Lock, Server, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function SecurityMonitor() {
  const { systemMetrics } = useSimulation();

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <ShieldCheck size={14} color="var(--neon-green)" />
          <span>SECURITY & FIREWALL MATRIX</span>
        </div>
        <span className="cyber-badge cyber-badge-green">
          SHIELDED
        </span>
      </div>

      {/* Security Status Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '6px',
        fontSize: '11px'
      }}>
        <div style={{ background: 'rgba(3, 8, 16, 0.8)', padding: '6px', borderRadius: '2px', border: '1px solid rgba(0, 255, 102, 0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="var(--neon-green)" />
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>FIREWALL</div>
            <div style={{ color: 'var(--neon-green)', fontWeight: 700 }}>ACTIVE</div>
          </div>
        </div>

        <div style={{ background: 'rgba(3, 8, 16, 0.8)', padding: '6px', borderRadius: '2px', border: '1px solid rgba(0, 240, 255, 0.2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Lock size={13} color="var(--electric-cyan)" />
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>SECURITY LAYERS</div>
            <div style={{ color: 'var(--electric-cyan)', fontWeight: 700 }}>07 LAYERS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
