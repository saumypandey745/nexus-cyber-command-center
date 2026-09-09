import React, { useState, useEffect } from 'react';
import { Search, FileCode, Check } from 'lucide-react';

const STAGES = [
  'DATA STRUCTURE ANALYSIS',
  'METADATA PROCESSING',
  'SIGNATURE COMPARISON',
  'PATTERN RECOGNITION',
  'ANOMALY DETECTION',
  'FORENSIC REPORT GENERATED'
];

export function ForensicsModule() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % STAGES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="cyber-panel" style={{ padding: '10px 12px', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--electric-cyan)', fontWeight: 700 }}>
          <FileCode size={14} color="var(--electric-cyan)" />
          <span>DIGITAL FORENSICS ENGINE</span>
        </div>
        <span className="cyber-badge cyber-badge-cyan">
          STAGE {currentStage + 1}/6
        </span>
      </div>

      <div style={{
        backgroundColor: 'rgba(3, 8, 16, 0.85)',
        padding: '8px',
        borderRadius: '2px',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        fontSize: '11px',
        fontFamily: 'var(--font-mono)'
      }}>
        <div style={{ color: 'var(--neon-green)', fontWeight: 700, marginBottom: '6px' }}>
          &gt; {STAGES[currentStage]}
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(0, 240, 255, 0.1)',
          borderRadius: '1px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentStage + 1) / STAGES.length) * 100}%`,
            height: '100%',
            backgroundColor: 'var(--electric-cyan)',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
}
