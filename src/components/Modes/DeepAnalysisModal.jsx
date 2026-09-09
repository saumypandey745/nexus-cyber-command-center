import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function DeepAnalysisModal() {
  const { activeMode, setActiveMode } = useSimulation();
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('INITIALIZING DEEP ANALYSIS...');

  useEffect(() => {
    if (activeMode !== 'DEEP_ANALYSIS') return;

    setProgress(0);
    const actions = [
      'SCANNING FREQUENCY BANDWIDTH (5.8 GHz)...',
      'DECRYPTING SUB-NODE PACKETS (RSA-4096)...',
      'CORRELATING BIOMETRIC & NETWORK SIGNATURES...',
      'CALIBRATING SATELLITE BEAM ALIGNMENT...',
      'FINALIZING THREAT MATRIX RE-INDEX...',
      'ANALYSIS COMPLETE // SYSTEM STABLE'
    ];

    let actionIdx = 0;
    const interval = setInterval(() => {
      actionIdx++;
      if (actionIdx < actions.length) {
        setCurrentAction(actions[actionIdx]);
        setProgress(Math.round(((actionIdx + 1) / actions.length) * 100));
      }
    }, 900);

    return () => clearInterval(interval);
  }, [activeMode]);

  if (activeMode !== 'DEEP_ANALYSIS') return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(2, 6, 12, 0.95)',
      backdropFilter: 'blur(16px)',
      zIndex: 99990,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'rgba(6, 15, 28, 0.95)',
        border: '2px solid var(--electric-cyan)',
        boxShadow: '0 0 35px var(--electric-cyan-glow)',
        borderRadius: '4px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={28} color="var(--electric-cyan)" className="glitch-screen-active" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '18px', color: '#fff', letterSpacing: '2px' }}>
              CINEMATIC DEEP ANALYSIS MODE
            </h2>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              FULL SPECTRUM THREAT & NETWORK SWEEP IN PROGRESS
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(2, 6, 12, 0.9)',
          padding: '12px',
          borderRadius: '2px',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          fontSize: '12px',
          color: 'var(--neon-green)'
        }}>
          &gt; {currentAction}
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span>PROGRESS</span>
            <span style={{ color: 'var(--electric-cyan)', fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{
            height: '10px',
            backgroundColor: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--electric-cyan)',
              boxShadow: '0 0 10px var(--electric-cyan-glow)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
