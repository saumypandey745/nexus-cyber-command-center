import React from 'react';
import { Activity, Terminal } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function LiveEventFeed() {
  const { eventFeed } = useSimulation();

  return (
    <div style={{
      height: '32px',
      backgroundColor: 'rgba(2, 5, 9, 0.95)',
      borderTop: '1px solid var(--border-cyan)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: '12px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      overflow: 'hidden',
      zIndex: 90
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--electric-cyan)',
        fontWeight: 700,
        flexShrink: 0
      }}>
        <Activity size={13} color="var(--electric-cyan)" />
        <span>LIVE EVENT FEED:</span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        flex: 1
      }}>
        {eventFeed.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>[{item.timestamp}]</span>
            <span style={{ color: 'var(--neon-green)', fontWeight: 600 }}>{item.event}</span>
            <span style={{ color: '#fff' }}>{item.target}</span>
            <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: '8px', padding: '0 4px' }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
