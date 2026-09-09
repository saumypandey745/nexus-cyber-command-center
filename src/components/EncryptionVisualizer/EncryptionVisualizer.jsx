import React, { useState, useEffect } from 'react';
import { Lock, Key, ShieldCheck } from 'lucide-react';

export function EncryptionVisualizer() {
  const [hexData, setHexData] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const chars = '0123456789ABCDEF';
      let hex = '';
      for (let i = 0; i < 32; i++) {
        hex += chars[Math.floor(Math.random() * chars.length)] + (i % 2 === 1 ? ' ' : '');
      }
      setHexData(hex);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <Lock size={14} color="var(--electric-cyan)" />
          <span>CIPHER & ENCRYPTION MATRIX</span>
        </div>
        <span className="cyber-badge cyber-badge-green">
          QUANTUM: 4096-BIT
        </span>
      </div>

      <div style={{
        backgroundColor: 'rgba(2, 6, 12, 0.95)',
        padding: '6px 8px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--electric-cyan)',
        wordBreak: 'break-all',
        height: '38px',
        display: 'flex',
        alignItems: 'center'
      }}>
        0x {hexData}
      </div>
    </div>
  );
}
