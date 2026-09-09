import React, { useState } from 'react';
import { Cpu, ShieldCheck, ShieldAlert, Maximize2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function DeviceMatrix() {
  const { nodes, setFocusedModule, focusedModule } = useSimulation();
  const [filterType, setFilterType] = useState('ALL');

  const filteredNodes = nodes.filter((n) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'UNKNOWN') return n.type.includes('UNKNOWN') || n.encryption === 'UNENCRYPTED';
    return n.type.includes(filterType);
  });

  return (
    <div className="cyber-panel" style={{ height: '100%', flex: 1, minHeight: 0 }}>
      {/* Header */}
      <div className="cyber-panel-header">
        <div className="panel-title">
          <Cpu size={14} color="var(--electric-cyan)" />
          <span>DEVICE MATRIX // SIGNAL TARGETS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button 
            className="cyber-btn" 
            style={{ padding: '2px 6px', fontSize: '10px' }}
            onClick={() => setFocusedModule(focusedModule === 'matrix' ? null : 'matrix')}
            title="Focus Matrix"
          >
            <Maximize2 size={11} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '6px 8px',
        backgroundColor: 'rgba(3, 8, 16, 0.95)',
        borderBottom: '1px solid var(--border-cyan)'
      }}>
        {['ALL', 'MOBILE', 'LAPTOP', 'UNKNOWN'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`cyber-btn ${filterType === tab ? 'cyber-btn-active' : ''}`}
            style={{ padding: '2px 8px', fontSize: '10px' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Device List Table */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '6px',
        backgroundColor: 'rgba(2, 6, 12, 0.9)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(0, 240, 255, 0.15)', fontSize: '10px' }}>
              <th style={{ padding: '4px 6px' }}>NODE ID</th>
              <th style={{ padding: '4px 6px' }}>TYPE</th>
              <th style={{ padding: '4px 6px' }}>SIGNAL</th>
              <th style={{ padding: '4px 6px' }}>ENCRYPTION</th>
              <th style={{ padding: '4px 6px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredNodes.map((node) => (
              <tr 
                key={node.id} 
                style={{ 
                  borderBottom: '1px solid rgba(0, 240, 255, 0.06)',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <td style={{ padding: '6px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
                  {node.id}
                </td>
                <td style={{ padding: '6px', color: 'var(--text-secondary)' }}>
                  {node.type}
                </td>
                <td style={{ padding: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '40px',
                      height: '6px',
                      backgroundColor: 'rgba(0, 240, 255, 0.1)',
                      borderRadius: '1px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${node.signal}%`,
                        height: '100%',
                        backgroundColor: node.signal > 75 ? 'var(--neon-green)' : (node.signal > 50 ? 'var(--electric-cyan)' : 'var(--warning-amber)')
                      }} />
                    </div>
                    <span>{node.signal}%</span>
                  </div>
                </td>
                <td style={{ padding: '6px' }}>
                  <span className={`cyber-badge ${node.encryption === 'UNENCRYPTED' ? 'cyber-badge-red' : 'cyber-badge-cyan'}`}>
                    {node.encryption}
                  </span>
                </td>
                <td style={{ padding: '6px' }}>
                  <span className={`cyber-badge ${node.status === 'ACTIVE' ? 'cyber-badge-green' : 'cyber-badge-amber'}`}>
                    {node.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
