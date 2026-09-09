import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function SystemOverrideModal() {
  const { activeMode } = useSimulation();

  if (activeMode !== 'OVERRIDE') return null;

  return (
    <div 
      className="crt-flicker"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(52, 0, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: 99995,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-mono)',
        border: '4px solid var(--alert-red)',
        boxShadow: 'inset 0 0 50px var(--alert-red-glow)'
      }}
    >
      <div style={{
        maxWidth: '650px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px'
      }}>
        <AlertTriangle size={72} color="var(--alert-red)" style={{ animation: 'pulse-red 0.5s infinite' }} />
        
        <h1 className="glitch-text" data-text="SYSTEM OVERRIDE ACTIVE" style={{
          fontFamily: 'var(--font-header)',
          fontSize: '32px',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '3px'
        }}>
          SYSTEM OVERRIDE ACTIVE
        </h1>

        <div style={{
          fontSize: '14px',
          color: '#ff99b8',
          letterSpacing: '1px',
          maxWidth: '500px'
        }}>
          EMERGENCY PROTOCOL INITIALIZED // RADAR ACCELERATING // MATRIX LOCK ACTIVE
        </div>

        <div className="cyber-badge cyber-badge-red" style={{ fontSize: '12px', padding: '6px 16px' }}>
          OVERRIDE SIMULATION IN PROGRESS...
        </div>
      </div>
    </div>
  );
}
