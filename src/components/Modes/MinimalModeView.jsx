import React from 'react';
import { Eye, Shield, Terminal as TerminalIcon } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { CommandTerminal } from '../Terminal/CommandTerminal';

export function MinimalModeView() {
  const { activeMode, setActiveMode } = useSimulation();

  if (activeMode !== 'MINIMAL') return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#020509',
      zIndex: 9995,
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      gap: '12px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-cyan)',
        paddingBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-header)', fontSize: '14px', color: 'var(--electric-cyan)' }}>
          <Shield size={18} color="var(--electric-cyan)" />
          <span>NEXUS // PANIC MINIMAL TERMINAL MODE</span>
        </div>
        <button 
          className="cyber-btn cyber-btn-active"
          onClick={() => setActiveMode('NORMAL')}
        >
          <Eye size={13} style={{ marginRight: '4px' }} /> RESTORE FULL COMMAND DASHBOARD
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        <CommandTerminal />
      </div>
    </div>
  );
}
